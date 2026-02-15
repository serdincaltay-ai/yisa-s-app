/**
 * Franchise tesis ayarları: personel hedefleri, aidat kademeleri
 */

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

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Giriş gerekli' }, { status: 401 })

    const tenantId = await getTenantId(user.id)
    if (!tenantId) return NextResponse.json({ error: 'Tesis atanmamış' }, { status: 403 })

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
    const service = createServiceClient(url, key)

    const { data: tenant, error } = await service
      .from('tenants')
      .select('id, name, slug, package_type, antrenor_hedef, temizlik_hedef, mudur_hedef, aidat_tiers, kredi_paketleri')
      .eq('id', tenantId)
      .single()

    if (error || !tenant) return NextResponse.json({ error: 'Tesis bulunamadı' }, { status: 404 })
    return NextResponse.json({
      tenant: {
        ...tenant,
        aidat_tiers: tenant.aidat_tiers ?? { '25': 500, '45': 700, '60': 900 },
      },
    })
  } catch (e) {
    console.error('[franchise/settings]', e)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Giriş gerekli' }, { status: 401 })

    const tenantId = await getTenantId(user.id)
    if (!tenantId) return NextResponse.json({ error: 'Tesis atanmamış' }, { status: 403 })

    const body = await req.json()
    const update: Record<string, unknown> = {}
    if (typeof body.antrenor_hedef === 'number') update.antrenor_hedef = body.antrenor_hedef
    if (typeof body.temizlik_hedef === 'number') update.temizlik_hedef = body.temizlik_hedef
    if (typeof body.mudur_hedef === 'number') update.mudur_hedef = body.mudur_hedef
    if (body.aidat_tiers != null && typeof body.aidat_tiers === 'object') update.aidat_tiers = body.aidat_tiers
    if (Array.isArray(body.kredi_paketleri)) update.kredi_paketleri = body.kredi_paketleri

    if (Object.keys(update).length === 0) return NextResponse.json({ error: 'Güncellenecek alan yok' }, { status: 400 })

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
    const service = createServiceClient(url, key)

    const { error } = await service.from('tenants').update(update).eq('id', tenantId)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[franchise/settings]', e)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
