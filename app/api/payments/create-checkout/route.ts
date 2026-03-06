/**
 * POST /api/payments/create-checkout
 * Stripe Checkout Session oluştur
 * Veli veya franchise kullanıcısı bekleyen bir aidat için ödeme başlatır
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { getTenantIdWithFallback } from '@/lib/franchise-tenant'
import { createCheckoutSession } from '@/lib/stripe/client'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    // Auth kontrolü
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Giriş gerekli' }, { status: 401 })
    }

    const tenantId = await getTenantIdWithFallback(user.id, req)
    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant atanmamış' }, { status: 403 })
    }

    const body = await req.json()
    const paymentId = typeof body.payment_id === 'string' ? body.payment_id.trim() : ''

    if (!paymentId) {
      return NextResponse.json({ error: 'payment_id alanı gerekli.' }, { status: 400 })
    }

    // Ödeme kaydını getir
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) {
      return NextResponse.json({ error: 'Sunucu yapılandırma hatası' }, { status: 500 })
    }

    const service = createServiceClient(url, key)
    const { data: payment, error: paymentError } = await service
      .from('package_payments')
      .select('id, amount, currency, status, athlete_id, athletes(name, surname)')
      .eq('id', paymentId)
      .eq('tenant_id', tenantId)
      .single()

    if (paymentError || !payment) {
      return NextResponse.json(
        { error: 'Ödeme kaydı bulunamadı veya bu tenant\'a ait değil.' },
        { status: 404 }
      )
    }

    if (payment.status === 'odendi' || payment.status === 'paid') {
      return NextResponse.json(
        { error: 'Bu ödeme zaten tamamlanmış.' },
        { status: 400 }
      )
    }

    if (payment.status === 'processing') {
      return NextResponse.json(
        { error: 'Bu ödeme için zaten bir checkout işlemi başlatılmış. Lütfen mevcut ödemeyi tamamlayın veya biraz bekleyin.' },
        { status: 409 }
      )
    }

    // Sporcu adını al
    const athlete = payment.athletes as { name?: string; surname?: string } | null
    const athleteName = athlete
      ? [athlete.name, athlete.surname].filter(Boolean).join(' ').trim() || 'Sporcu'
      : 'Sporcu'

    // Atomik olarak durumu 'processing' yap — race condition önlemi
    // Sadece bekliyor/gecikmis olan ödemeleri güncelle
    const originalStatus = payment.status as string
    const { data: updated, error: lockError } = await service
      .from('package_payments')
      .update({ status: 'processing', payment_method: 'kredi_karti_online' })
      .eq('id', paymentId)
      .eq('tenant_id', tenantId)
      .in('status', ['bekliyor', 'gecikmis'])
      .select('id')

    if (lockError || !updated || updated.length === 0) {
      return NextResponse.json(
        { error: 'Bu ödeme için işlem başlatılamadı. Başka bir checkout devam ediyor olabilir.' },
        { status: 409 }
      )
    }

    // Site URL'ini belirle
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? `${req.nextUrl.protocol}//${req.nextUrl.host}`

    // Stripe Checkout Session oluştur
    const result = await createCheckoutSession({
      paymentId: payment.id as string,
      athleteName,
      amount: Number(payment.amount),
      currency: (payment.currency as string) ?? 'try',
      tenantId,
      userId: user.id,
      successUrl: `${siteUrl}/veli/odeme?success=true&payment_id=${paymentId}`,
      cancelUrl: `${siteUrl}/veli/odeme?cancelled=true`,
    })

    if (result.error) {
      // Stripe başarısız oldu — durumu geri al
      await service
        .from('package_payments')
        .update({ status: originalStatus, payment_method: null })
        .eq('id', paymentId)
        .eq('tenant_id', tenantId)
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({
      ok: true,
      sessionId: result.sessionId,
      url: result.url,
    })
  } catch (e) {
    console.error('[create-checkout]', e)
    const err = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ error: 'Checkout oluşturma hatası', detail: err }, { status: 500 })
  }
}
