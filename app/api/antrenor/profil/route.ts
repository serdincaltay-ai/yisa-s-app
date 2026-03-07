/**
 * Antrenör profil: GET (bilgi getir) + PATCH (güncelle)
 * staff tablosundan employment_type, is_competitive_coach, license_type, bio vb.
 * user_metadata'dan ad, soyad, telefon
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

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })

    const service = createServiceClient(url, key)
    const tenantId = await getTenantIdWithFallback(user.id, req)

    const meta = user.user_metadata ?? {}
    const profile = {
      id: user.id,
      email: user.email ?? '',
      name: (meta.name as string) ?? (meta.full_name as string) ?? '',
      surname: (meta.surname as string) ?? '',
      phone: (meta.phone as string) ?? (user.phone ?? ''),
    }

    // staff tablosundan ek bilgiler
    let staffData = null
    if (tenantId) {
      const { data } = await service
        .from('staff')
        .select('id, branch, employment_type, is_competitive_coach, license_type, employment_start_date, bio')
        .eq('user_id', user.id)
        .eq('tenant_id', tenantId)
        .maybeSingle()
      staffData = data
    }

    return NextResponse.json({
      profile,
      staff: staffData ?? {
        branch: '',
        employment_type: 'full_time',
        is_competitive_coach: false,
        license_type: '',
        employment_start_date: null,
        bio: '',
      },
    })
  } catch (e) {
    console.error('[antrenor/profil GET]', e)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Giriş gerekli' }, { status: 401 })

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })

    const service = createServiceClient(url, key)
    const tenantId = await getTenantIdWithFallback(user.id, req)
    const body = await req.json()

    // user_metadata güncelle (ad, soyad, telefon)
    if (body.name !== undefined || body.surname !== undefined || body.phone !== undefined) {
      const metaUpdate: Record<string, string> = {}
      if (typeof body.name === 'string') metaUpdate.name = body.name.trim()
      if (typeof body.surname === 'string') metaUpdate.surname = body.surname.trim()
      if (typeof body.phone === 'string') metaUpdate.phone = body.phone.trim()

      const { error: authErr } = await service.auth.admin.updateUserById(user.id, {
        user_metadata: { ...user.user_metadata, ...metaUpdate },
      })
      if (authErr) {
        return NextResponse.json({ error: 'Profil güncellenemedi' }, { status: 500 })
      }
    }

    // staff tablosu güncelle
    if (tenantId) {
      const staffUpdate: Record<string, unknown> = {}
      if (typeof body.employment_type === 'string') staffUpdate.employment_type = body.employment_type
      if (typeof body.is_competitive_coach === 'boolean') staffUpdate.is_competitive_coach = body.is_competitive_coach
      if (typeof body.license_type === 'string') staffUpdate.license_type = body.license_type
      if (typeof body.bio === 'string') staffUpdate.bio = body.bio
      if (body.employment_start_date !== undefined) staffUpdate.employment_start_date = body.employment_start_date

      if (Object.keys(staffUpdate).length > 0) {
        const { error: staffErr } = await service
          .from('staff')
          .update(staffUpdate)
          .eq('user_id', user.id)
          .eq('tenant_id', tenantId)

        if (staffErr) {
          return NextResponse.json({ error: 'Personel bilgileri güncellenemedi' }, { status: 500 })
        }
      }
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[antrenor/profil PATCH]', e)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
