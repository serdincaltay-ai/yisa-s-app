/**
 * Stripe Webhook Handler
 * POST /api/webhooks/stripe
 *
 * checkout.session.completed eventini dinler,
 * ilgili odeme kayitlarinin status'unu paid/odendi yapar.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY?.trim()
  if (!key) return null
  return new Stripe(key, { apiVersion: '2026-02-25.clover' })
}

function getSupabaseService() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createServiceClient(url, key)
}

export async function POST(req: NextRequest) {
  try {
    const stripe = getStripe()
    if (!stripe) {
      console.error('[stripe-webhook] STRIPE_SECRET_KEY eksik')
      return NextResponse.json({ error: 'Stripe yapilandirilmamis' }, { status: 500 })
    }

    const body = await req.text()
    const sig = req.headers.get('stripe-signature')
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim()

    let event: Stripe.Event

    if (webhookSecret && sig) {
      try {
        event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
      } catch (err) {
        console.error('[stripe-webhook] Imza dogrulanamadi:', err)
        return NextResponse.json({ error: 'Webhook imza hatasi' }, { status: 400 })
      }
    } else if (!webhookSecret) {
      // Production'da STRIPE_WEBHOOK_SECRET zorunlu
      console.error('[stripe-webhook] STRIPE_WEBHOOK_SECRET ayarlanmamis — guvenlik riski, istek reddedildi')
      return NextResponse.json({ error: 'Webhook yapilandirma hatasi' }, { status: 500 })
    } else {
      // sig yok ama secret var — gecersiz istek
      return NextResponse.json({ error: 'stripe-signature header eksik' }, { status: 400 })
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session

      if (session.payment_status !== 'paid') {
        // Odeme henuz tamamlanmamis, atla
        return NextResponse.json({ received: true, status: 'payment_not_completed' })
      }

      const metadata = session.metadata ?? {}
      const tenantId = metadata.tenant_id
      const paymentIdsStr = metadata.payment_ids
      const paymentTable = metadata.payment_table || 'franchise_payments'

      if (!tenantId || !paymentIdsStr) {
        console.error('[stripe-webhook] metadata eksik:', metadata)
        return NextResponse.json({ received: true, status: 'missing_metadata' })
      }

      const paymentIds = paymentIdsStr.split(',').map((id: string) => id.trim()).filter(Boolean)
      if (paymentIds.length === 0) {
        return NextResponse.json({ received: true, status: 'no_payment_ids' })
      }

      const service = getSupabaseService()
      if (!service) {
        console.error('[stripe-webhook] Supabase baglantisi yapilandirilmamis')
        return NextResponse.json({ error: 'Sunucu yapilandirma hatasi' }, { status: 500 })
      }

      const now = new Date().toISOString().slice(0, 10)
      const stripePaymentIntent = typeof session.payment_intent === 'string'
        ? session.payment_intent
        : null

      if (paymentTable === 'package_payments') {
        // package_payments tablosunda status: bekliyor -> odendi
        const { error } = await service
          .from('package_payments')
          .update({
            status: 'odendi',
            payment_date: now,
            payment_method: 'kredi_karti',
            description: stripePaymentIntent
              ? `Stripe odeme: ${stripePaymentIntent}`
              : 'Stripe online odeme',
          })
          .eq('tenant_id', tenantId)
          .in('id', paymentIds)
          .in('status', ['bekliyor', 'pending', 'overdue', 'gecikmis'])

        if (error) {
          console.error('[stripe-webhook] package_payments guncelleme hatasi:', error)
          return NextResponse.json({ error: 'Odeme guncelleme hatasi' }, { status: 500 })
        }
      } else {
        // franchise_payments tablosunda status: pending -> paid
        const { error } = await service
          .from('franchise_payments')
          .update({
            status: 'paid',
            paid_date: now,
            payment_method: 'stripe',
            notes: stripePaymentIntent
              ? `Stripe odeme: ${stripePaymentIntent}`
              : 'Stripe online odeme',
          })
          .eq('tenant_id', tenantId)
          .in('id', paymentIds)
          .in('status', ['pending', 'overdue'])

        if (error) {
          console.error('[stripe-webhook] franchise_payments guncelleme hatasi:', error)
          return NextResponse.json({ error: 'Odeme guncelleme hatasi' }, { status: 500 })
        }
      }

      console.log(`[stripe-webhook] ${paymentIds.length} odeme guncellendi (${paymentTable}), tenant: ${tenantId}`)
      return NextResponse.json({ received: true, status: 'payments_updated', count: paymentIds.length })
    }

    // Diger event tipleri icin sadece onay don
    return NextResponse.json({ received: true, status: 'event_ignored', type: event.type })
  } catch (e) {
    console.error('[stripe-webhook] Beklenmeyen hata:', e)
    return NextResponse.json({ error: 'Webhook isleme hatasi' }, { status: 500 })
  }
}
