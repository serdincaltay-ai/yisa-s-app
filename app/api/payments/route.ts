import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

async function getTenantId(userId: string): Promise<string | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  const service = createServiceClient(url, key)
  const { data: ut } = await service.from('user_tenants').select('tenant_id').eq('user_id', userId).limit(1).maybeSingle()
  if (ut?.tenant_id) return ut.tenant_id
  const { data: t } = await service.from('tenants').select('id').eq('owner_id', userId).limit(1).maybeSingle()
  return t?.id ?? null
}

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Giriş gerekli' }, { status: 401 })

    const tenantId = await getTenantId(user.id)
    if (!tenantId) return NextResponse.json({ items: [] })

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const studentId = searchParams.get('student_id')

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) return NextResponse.json({ items: [] })

    const service = createServiceClient(url, key)
    let query = service
      .from('package_payments')
      .select(`
        id,
        student_id,
        student_package_id,
        amount,
        currency,
        payment_date,
        due_date,
        taksit_no,
        toplam_taksit,
        status,
        payment_method,
        description,
        receipt_no,
        created_at,
        students(ad_soyad),
        student_packages(kalan_seans, seans_packages(name))
      `)
      .eq('tenant_id', tenantId)
      .order('due_date', { ascending: true })

    if (status && ['bekliyor', 'odendi', 'gecikmis'].includes(status)) {
      query = query.eq('status', status)
    }
    if (studentId) query = query.eq('student_id', studentId)

    const { data, error } = await query

    if (error) return NextResponse.json({ items: [], error: error.message })

    const today = new Date().toISOString().slice(0, 10)
    const items = (data ?? []).map((r: Record<string, unknown>) => {
      const s = r.status as string
      const due = r.due_date as string
      let effectiveStatus = s
      if (s === 'bekliyor' && due < today) effectiveStatus = 'gecikmis'
      const st = r.students as Record<string, unknown> | null
      const sp = r.student_packages as { kalan_seans?: number; seans_packages?: { name?: string } } | null
      return {
        ...r,
        effective_status: effectiveStatus,
        ad_soyad: st?.ad_soyad ?? null,
        kalan_seans: sp?.kalan_seans ?? null,
        paket_adi: sp?.seans_packages?.name ?? null,
      }
    })

    return NextResponse.json({ items })
  } catch (e) {
    console.error('[payments GET]', e)
    return NextResponse.json({ items: [] })
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Giriş gerekli' }, { status: 401 })

    const tenantId = await getTenantId(user.id)
    if (!tenantId) return NextResponse.json({ error: 'Tenant atanmamış' }, { status: 403 })

    const body = await req.json()
    const studentId = body.student_id
    const studentPackageId = body.student_package_id || null
    const amount = parseFloat(String(body.amount ?? 0))
    const paymentDate = typeof body.payment_date === 'string' && body.payment_date
      ? body.payment_date
      : new Date().toISOString().slice(0, 10)
    const paymentMethod = ['nakit', 'havale', 'kredi_karti', 'diger'].includes(body.payment_method ?? '')
      ? body.payment_method
      : null
    const description = typeof body.description === 'string' ? body.description.trim() : null
    const receiptNo = typeof body.receipt_no === 'string' ? body.receipt_no.trim() : null

    const isRecordPayment = body.payment_id != null

    if (isRecordPayment && body.payment_id) {
      const { data: updated, error } = await createServiceClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
        .from('package_payments')
        .update({
          status: 'odendi',
          payment_date: paymentDate,
          payment_method: paymentMethod,
          receipt_no: receiptNo,
          description: description,
        })
        .eq('id', body.payment_id)
        .eq('tenant_id', tenantId)
        .select()
        .single()

      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ ok: true, payment: updated })
    }

    if (!studentId || amount <= 0) {
      return NextResponse.json({ error: 'student_id ve amount zorunludur' }, { status: 400 })
    }

    const dueDate = typeof body.due_date === 'string' && body.due_date
      ? body.due_date
      : paymentDate

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })

    const service = createServiceClient(url, key)
    const { data, error } = await service
      .from('package_payments')
      .insert({
        tenant_id: tenantId,
        student_id: studentId,
        student_package_id: studentPackageId,
        amount: Number(amount.toFixed(2)),
        currency: 'TRY',
        payment_date: paymentDate,
        due_date: dueDate,
        taksit_no: 1,
        toplam_taksit: 1,
        status: 'odendi',
        payment_method: paymentMethod,
        description,
        receipt_no: receiptNo,
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true, payment: data })
  } catch (e) {
    console.error('[payments POST]', e)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
