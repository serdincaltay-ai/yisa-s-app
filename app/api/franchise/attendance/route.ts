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
    if (!tenantId) return NextResponse.json({ items: [], message: 'Tenant atanmamış' })

    const { searchParams } = new URL(req.url)
    const date = searchParams.get('date')
    if (!date) return NextResponse.json({ error: 'date parametresi gerekli (YYYY-MM-DD)' }, { status: 400 })

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) return NextResponse.json({ items: [] })

    const service = createServiceClient(url, key)
    const { data, error } = await service
      .from('attendance')
      .select('id, athlete_id, lesson_date, lesson_time, status, notes, athletes(name, surname)')
      .eq('tenant_id', tenantId)
      .eq('lesson_date', date)
      .order('created_at', { ascending: true })

    if (error) return NextResponse.json({ items: [], error: error.message })

    const items = (data ?? []).map((row: Record<string, unknown>) => {
      const a = row.athletes as Record<string, unknown> | null
      return {
        id: row.id,
        athlete_id: row.athlete_id,
        athlete_name: a ? `${a.name ?? ''} ${a.surname ?? ''}`.trim() : '—',
        lesson_date: row.lesson_date,
        lesson_time: row.lesson_time,
        status: row.status,
        notes: row.notes,
      }
    })
    return NextResponse.json({ items })
  } catch (e) {
    console.error('[franchise/attendance GET]', e)
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
    const records = body.records as Array<{ athlete_id: string; lesson_date: string; status?: string }>
    if (!Array.isArray(records) || records.length === 0) {
      return NextResponse.json({ error: 'records dizisi gerekli' }, { status: 400 })
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })

    const service = createServiceClient(url, key)
    const rows = records.map((r) => ({
      tenant_id: tenantId,
      athlete_id: r.athlete_id,
      lesson_date: r.lesson_date,
      status: ['present', 'absent', 'late', 'excused'].includes(r.status ?? '') ? r.status : 'present',
      marked_by: user.id,
    }))

    const { data, error } = await service
      .from('attendance')
      .upsert(rows, { onConflict: 'tenant_id,athlete_id,lesson_date' })
      .select('id')

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true, count: data?.length ?? 0 })
  } catch (e) {
    console.error('[franchise/attendance POST]', e)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
