/**
 * POST /api/webhooks/stripe
 * Stripe Webhook Handler
 * checkout.session.completed olayını dinler ve ödeme durumunu günceller
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { verifyWebhookSignature } from '@/lib/stripe/client'

export const dynamic = 'force-dynamic'

// Stripe webhook'lar raw body gerektirir — Next.js body parsing'i devre dışı bırak
export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get('stripe-signature')
    if (!signature) {
      return NextResponse.json({ error: 'stripe-signature header eksik' }, { status: 400 })
    }

    // Raw body al
    const rawBody = await req.text()

    // İmzayı doğrula
    const event = verifyWebhookSignature(rawBody, signature)
    if (!event) {
      return NextResponse.json({ error: 'Webhook imza doğrulaması başarısız' }, { status: 400 })
    }

    // Supabase service client
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) {
      console.error('[Stripe Webhook] Supabase yapılandırması eksik')
      return NextResponse.json({ error: 'Sunucu yapılandırma hatası' }, { status: 500 })
    }

    const service = createServiceClient(url, key)

    // checkout.session.completed — ödeme başarılı
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object

      const paymentId = session.metadata?.payment_id
      const tenantId = session.metadata?.tenant_id

      if (!paymentId || !tenantId) {
        console.warn('[Stripe Webhook] Metadata eksik: payment_id veya tenant_id yok.', session.id)
        return NextResponse.json({ received: true, warning: 'Metadata eksik' })
      }

      // Ödeme durumunu 'paid' olarak güncelle (payments tablosu)
      const { error: updateError } = await service
        .from('payments')
        .update({
          status: 'paid',
          payment_method: 'kart',
          paid_date: new Date().toISOString().slice(0, 10),
          notes: `Stripe checkout #${session.id.substring(0, 20)}`,
        })
        .eq('id', paymentId)
        .eq('tenant_id', tenantId)

      if (updateError) {
        console.error('[Stripe Webhook] Ödeme güncelleme hatası:', updateError.message)
        return NextResponse.json({ error: 'Ödeme güncelleme hatası' }, { status: 500 })
      }

      console.log(`[Stripe Webhook] Ödeme başarılı: payment_id=${paymentId}, session=${session.id}`)
    }

    // checkout.session.expired — checkout süresi doldu, durumu geri al
    if (event.type === 'checkout.session.expired') {
      const session = event.data.object

      const paymentId = session.metadata?.payment_id
      const tenantId = session.metadata?.tenant_id

      if (paymentId && tenantId) {
        // Orijinal durumu metadata'dan oku (pending veya overdue olabilir)
        const revertStatus = session.metadata?.original_status || 'pending'

        // Sadece 'processing' durumundakileri geri al
        const { error: revertError } = await service
          .from('payments')
          .update({ status: revertStatus, payment_method: null })
          .eq('id', paymentId)
          .eq('tenant_id', tenantId)
          .eq('status', 'processing')

        if (revertError) {
          console.error('[Stripe Webhook] Durum geri alma hatası:', revertError.message)
        } else {
          console.log(`[Stripe Webhook] Checkout süresi doldu, durum geri alındı: payment_id=${paymentId}`)
        }
      }
    }

    // Diğer olayları sessizce kabul et
    return NextResponse.json({ received: true })
  } catch (e) {
    console.error('[Stripe Webhook] Hata:', e instanceof Error ? e.message : e)
    return NextResponse.json(
      { error: 'Webhook işleme hatası' },
      { status: 500 }
    )
  }
}
