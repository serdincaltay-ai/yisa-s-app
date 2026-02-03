import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

async function getTenantId(userId: string): Promise<string | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  const service = createServiceClient(url, key)

  const { data: ut } = await service
    .from('user_tenants')
    .select('tenant_id')
    .eq('user_id', userId)
    .limit(1)
    .maybeSingle()
  if (ut?.tenant_id) return ut.tenant_id

  const { data: t } = await service
    .from('tenants')
    .select('id')
    .eq('owner_id', userId)
    .limit(1)
    .maybeSingle()
  return t?.id ?? null
}

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Giriş gerekli' }, { status: 401 })

    const tenantId = await getTenantId(user.id)
    if (!tenantId) return NextResponse.json({ items: [], message: 'Tenant atanmamış' })

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) return NextResponse.json({ items: [] })

    const service = createServiceClient(url, key)
    const { data, error } = await service
      .from('staff')
      .select('id, name, surname, email, phone, role, branch, is_active, created_at')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })

    if (error) return NextResponse.json({ items: [], error: error.message })
    return NextResponse.json({ items: data ?? [] })
  } catch (e) {
    console.error('[franchise/staff GET]', e)
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
    const name = typeof body.name === 'string' ? body.name.trim() : ''
    const surname = typeof body.surname === 'string' ? body.surname.trim() : null
    const email = typeof body.email === 'string' ? body.email.trim() : null
    const phone = typeof body.phone === 'string' ? body.phone.trim() : null
    const role = typeof body.role === 'string' && ['admin', 'manager', 'trainer', 'receptionist', 'other'].includes(body.role)
      ? body.role
      : 'trainer'
    const branch = typeof body.branch === 'string' ? body.branch.trim() : null

    if (!name) return NextResponse.json({ error: 'Ad zorunludur' }, { status: 400 })

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })

    const service = createServiceClient(url, key)
    const { data, error } = await service
      .from('staff')
      .insert({
        tenant_id: tenantId,
        name,
        surname: surname || null,
        email: email || null,
        phone: phone || null,
        role,
        branch: branch || null,
        is_active: true,
      })
      .select('id, name, surname, role, created_at')
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true, staff: data })
  } catch (e) {
    console.error('[franchise/staff POST]', e)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
