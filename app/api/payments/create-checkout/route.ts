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
  // Rollback için dış scope'ta tanımla
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let service: any = null
  let paymentId = ''
  let tenantId = ''
  let originalStatus = ''

  try {
    // Auth kontrolü
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Giriş gerekli' }, { status: 401 })
    }

    const resolvedTenantId = await getTenantIdWithFallback(user.id, req)
    if (!resolvedTenantId) {
      return NextResponse.json({ error: 'Tenant atanmamış' }, { status: 403 })
    }
    tenantId = resolvedTenantId

    const body = await req.json()
    paymentId = typeof body.payment_id === 'string' ? body.payment_id.trim() : ''

    if (!paymentId) {
      return NextResponse.json({ error: 'payment_id alanı gerekli.' }, { status: 400 })
    }

    // Ödeme kaydını getir
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) {
      return NextResponse.json({ error: 'Sunucu yapılandırma hatası' }, { status: 500 })
    }

    service = createServiceClient(url, key)

    const { data: rawPayment, error: paymentError } = await service
      .from('payments')
      .select('id, amount, status, athlete_id, athletes(name, surname)')
      .eq('id', paymentId)
      .eq('tenant_id', tenantId)
      .single()

    const payment = rawPayment as {
      id: string
      amount: number
      status: string
      athlete_id: string
      athletes: { name?: string; surname?: string } | null
    } | null

    if (paymentError || !payment) {
      return NextResponse.json(
        { error: 'Ödeme kaydı bulunamadı veya bu tenant\'a ait değil.' },
        { status: 404 }
      )
    }

    if (payment.status === 'paid') {
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
    const athlete = payment.athletes
    const athleteName = athlete
      ? [athlete.name, athlete.surname].filter(Boolean).join(' ').trim() || 'Sporcu'
      : 'Sporcu'

    // Atomik olarak durumu 'processing' yap — race condition önlemi
    // Sadece pending/overdue olan ödemeleri güncelle
    originalStatus = payment.status
    const { data: updated, error: lockError } = await service
      .from('payments')
      .update({ status: 'processing', payment_method: 'kart' })
      .eq('id', paymentId)
      .eq('tenant_id', tenantId)
      .in('status', ['pending', 'overdue'])
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
      currency: 'try',
      tenantId,
      userId: user.id,
      originalStatus,
      successUrl: `${siteUrl}/veli/odeme?success=true&payment_id=${paymentId}`,
      cancelUrl: `${siteUrl}/veli/odeme?cancelled=true`,
    })

    if (result.error) {
      // Stripe başarısız oldu — durumu geri al
      await service
        .from('payments')
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
    // Rollback: status zaten 'processing' yapıldıysa geri al
    if (service && paymentId && tenantId && originalStatus) {
      await service
        .from('payments')
        .update({ status: originalStatus, payment_method: null })
        .eq('id', paymentId)
        .eq('tenant_id', tenantId)
        .eq('status', 'processing')
        .catch(() => {}) // Rollback hatası orijinal hatayı maskelemesin
    }
    console.error('[create-checkout]', e)
    const err = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ error: 'Checkout oluşturma hatası', detail: err }, { status: 500 })
  }
}
