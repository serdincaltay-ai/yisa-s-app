/**
 * Antrenör: Profil düzenleme — bio, lisans türü, yarışmacı deneyimi
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { getTenantIdWithFallback } from '@/lib/franchise-tenant'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Giriş gerekli' }, { status: 401 })

    const tenantId = await getTenantIdWithFallback(user.id, req)
    if (!tenantId) return NextResponse.json({ error: 'Tesis atanmamış' })

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) return NextResponse.json({ error: 'Sunucu hatası' })

    const service = createServiceClient(url, key)

    const { data: staff } = await service
      .from('staff')
      .select('id, name, surname, email, phone, role, branch, bio, license_type, is_competitive_coach, competitive_experience, city, district, address')
      .eq('tenant_id', tenantId)
      .eq('user_id', user.id)
      .maybeSingle()

    return NextResponse.json({ profil: staff ?? null })
  } catch (e) {
    console.error('[antrenor/profil GET]', e)
    return NextResponse.json({ error: 'Sunucu hatası' })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Giriş gerekli' }, { status: 401 })

    const tenantId = await getTenantIdWithFallback(user.id, req)
    if (!tenantId) return NextResponse.json({ error: 'Tesis atanmamış' }, { status: 403 })

    const body = await req.json()

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) return NextResponse.json({ error: 'Sunucu hatası' })

    const service = createServiceClient(url, key)

    const updates: Record<string, unknown> = {}
    if (typeof body.bio === 'string') updates.bio = body.bio.trim()
    if (typeof body.license_type === 'string') updates.license_type = body.license_type.trim()
    if (typeof body.is_competitive_coach === 'boolean') updates.is_competitive_coach = body.is_competitive_coach
    if (typeof body.competitive_experience === 'string') updates.competitive_experience = body.competitive_experience.trim()
    if (typeof body.phone === 'string') updates.phone = body.phone.trim()
    if (typeof body.city === 'string') updates.city = body.city.trim()
    if (typeof body.district === 'string') updates.district = body.district.trim()
    if (typeof body.address === 'string') updates.address = body.address.trim()

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'Güncellenecek alan yok' }, { status: 400 })
    }

    const { error } = await service
      .from('staff')
      .update(updates)
      .eq('tenant_id', tenantId)
      .eq('user_id', user.id)

    if (error) {
      console.error('[profil update]', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true, message: 'Profil güncellendi' })
  } catch (e) {
    console.error('[antrenor/profil PUT]', e)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
