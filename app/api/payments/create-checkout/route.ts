/**
 * Stripe Checkout Session olusturma
 * POST /api/payments/create-checkout
 * Body: { payment_ids: string[] }
 *
 * Secilen bekleyen odemeler icin Stripe Checkout Session olusturur
 * ve checkout URL'i doner.
 * Not: success_url ve cancel_url sunucu tarafinda belirlenir (open redirect onlemi).
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { getTenantIdWithFallback } from '@/lib/franchise-tenant'
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
      return NextResponse.json(
        { error: 'Stripe yapilandirilmamis. STRIPE_SECRET_KEY eksik.' },
        { status: 500 }
      )
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Giris gerekli' }, { status: 401 })
    }

    const tenantId = await getTenantIdWithFallback(user.id, req)
    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant bulunamadi' }, { status: 403 })
    }

    const body = await req.json()
    const paymentIds: string[] = Array.isArray(body.payment_ids) ? body.payment_ids : []

    if (paymentIds.length === 0) {
      return NextResponse.json({ error: 'Odeme secilmedi (payment_ids bos)' }, { status: 400 })
    }

    // Stripe metadata 500 karakter limiti: UUID (36 char) + virgul = ~37 char, max ~13 odeme
    const MAX_PAYMENTS_PER_CHECKOUT = 13
    if (paymentIds.length > MAX_PAYMENTS_PER_CHECKOUT) {
      return NextResponse.json(
        { error: `Tek seferde en fazla ${MAX_PAYMENTS_PER_CHECKOUT} odeme secebilirsiniz.` },
        { status: 400 }
      )
    }

    const service = getSupabaseService()
    if (!service) {
      return NextResponse.json({ error: 'Sunucu yapilandirma hatasi' }, { status: 500 })
    }

    // Secilen odemeleri getir — sadece bu tenant'a ait ve bekleyen/gecikmis olanlar
    const { data: payments, error: fetchErr } = await service
      .from('franchise_payments')
      .select('id, athlete_id, amount, period_month, period_year, status, athletes(name, surname)')
      .eq('tenant_id', tenantId)
      .in('id', paymentIds)
      .in('status', ['pending', 'overdue'])

    if (fetchErr) {
      // franchise_payments tablosu yoksa package_payments dene
      const { data: altPayments, error: altErr } = await service
        .from('package_payments')
        .select('id, athlete_id, amount, taksit_no, status, athletes(name, surname)')
        .eq('tenant_id', tenantId)
        .in('id', paymentIds)
        .in('status', ['bekliyor', 'pending', 'overdue', 'gecikmis'])

      if (altErr || !altPayments || altPayments.length === 0) {
        return NextResponse.json(
          { error: 'Odeme kaydi bulunamadi veya zaten odenmis' },
          { status: 404 }
        )
      }

      // package_payments icin checkout session olustur
      const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = altPayments.map((p) => {
        const ath = p.athletes as { name?: string; surname?: string } | null
        const athleteName = ath ? [ath.name, ath.surname].filter(Boolean).join(' ') : 'Sporcu'
        const desc = `Aidat - ${athleteName}`
        return {
          price_data: {
            currency: 'try',
            product_data: { name: desc },
            unit_amount: Math.round(Number(p.amount) * 100),
          },
          quantity: 1,
        }
      })

      const origin = req.headers.get('origin') || req.headers.get('referer')?.replace(/\/[^/]*$/, '') || 'https://app.yisa-s.com'
      const successUrl = `${origin}/veli/odeme?status=success`
      const cancelUrl = `${origin}/veli/odeme?status=cancel`

      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: lineItems,
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          tenant_id: tenantId,
          payment_ids: altPayments.map((p) => p.id).join(','),
          payment_table: 'package_payments',
        },
      })

      return NextResponse.json({ url: session.url, session_id: session.id })
    }

    if (!payments || payments.length === 0) {
      return NextResponse.json(
        { error: 'Odeme kaydi bulunamadi veya zaten odenmis' },
        { status: 404 }
      )
    }

    // franchise_payments icin checkout session olustur
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = payments.map((p) => {
      const ath = p.athletes as { name?: string; surname?: string } | null
      const athleteName = ath ? [ath.name, ath.surname].filter(Boolean).join(' ') : 'Sporcu'
      const periodLabel = p.period_month && p.period_year
        ? ` (${p.period_month}/${p.period_year})`
        : ''
      const desc = `Aidat - ${athleteName}${periodLabel}`
      return {
        price_data: {
          currency: 'try',
          product_data: { name: desc },
          unit_amount: Math.round(Number(p.amount) * 100),
        },
        quantity: 1,
      }
    })

    const origin = req.headers.get('origin') || req.headers.get('referer')?.replace(/\/[^/]*$/, '') || 'https://app.yisa-s.com'
    const successUrl = `${origin}/veli/odeme?status=success`
    const cancelUrl = `${origin}/veli/odeme?status=cancel`

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        tenant_id: tenantId,
        payment_ids: payments.map((p) => p.id).join(','),
        payment_table: 'franchise_payments',
      },
    })

    return NextResponse.json({ url: session.url, session_id: session.id })
  } catch (e) {
    console.error('[create-checkout]', e)
    return NextResponse.json({ error: 'Stripe checkout olusturulamadi' }, { status: 500 })
  }
}
