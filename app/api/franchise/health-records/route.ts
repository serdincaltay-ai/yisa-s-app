import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { getTenantIdWithFallback } from '@/lib/franchise-tenant'

export const dynamic = 'force-dynamic'

const VALID_DAYS = 365
const WARN_DAYS = 30

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Giriş gerekli' }, { status: 401 })

    const tenantId = await getTenantIdWithFallback(user.id, req)
    if (!tenantId) return NextResponse.json({ items: [], warnings: [] })

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) return NextResponse.json({ items: [], warnings: [] })

    const service = createServiceClient(url, key)
    const { data: tenantAthletes } = await service.from('athletes').select('id').eq('tenant_id', tenantId)
    const athleteIds = (tenantAthletes ?? []).map((a: { id: string }) => a.id)
    if (athleteIds.length === 0) return NextResponse.json({ items: [], warnings: [] })

    const { data: records, error } = await service
      .from('athlete_health_records')
      .select('id, athlete_id, record_type, notes, recorded_at, created_at, saglik_raporu_gecerlilik, athletes(name, surname, parent_user_id)')
      .in('athlete_id', athleteIds)
      .order('recorded_at', { ascending: false })
      .limit(500)

    if (error) return NextResponse.json({ items: [], warnings: [], error: error.message })

    const filtered = records ?? []
    const bugun = new Date()
    const otuzGunSonra = new Date(bugun)
    otuzGunSonra.setDate(otuzGunSonra.getDate() + WARN_DAYS)

    const items = filtered.map((r: Record<string, unknown>) => {
      const a = r.athletes as { name?: string; surname?: string; parent_user_id?: string | null } | null
      const gecerlilik = r.saglik_raporu_gecerlilik as string | null
      let gecerlilikDurumu: 'gecerli' | 'uyari' | 'suresi_dolmus' | 'belirsiz' = 'belirsiz'

      if (gecerlilik) {
        const gecerlilikTarihi = new Date(gecerlilik + 'T00:00:00')
        if (gecerlilikTarihi < bugun) {
          gecerlilikDurumu = 'suresi_dolmus'
        } else if (gecerlilikTarihi <= otuzGunSonra) {
          gecerlilikDurumu = 'uyari'
        } else {
          gecerlilikDurumu = 'gecerli'
        }
      }

      return {
        id: r.id,
        athlete_id: r.athlete_id,
        athlete_name: a ? `${a.name ?? ''} ${a.surname ?? ''}`.trim() : '—',
        parent_user_id: a?.parent_user_id ?? null,
        record_type: r.record_type,
        notes: r.notes,
        recorded_at: r.recorded_at,
        created_at: r.created_at,
        saglik_raporu_gecerlilik: gecerlilik,
        gecerlilik_durumu: gecerlilikDurumu,
      }
    })

    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - VALID_DAYS)
    const warnings = items.filter((r) => {
      if (r.gecerlilik_durumu === 'suresi_dolmus' || r.gecerlilik_durumu === 'uyari') return true
      const ra = r.recorded_at as string | null
      const d = ra ? new Date(ra) : null
      return !d || d < cutoff
    }).map((r) => {
      let message = 'Sağlık kaydı yok'
      let severity: 'red' | 'yellow' = 'red'
      if (r.gecerlilik_durumu === 'suresi_dolmus') {
        message = 'Sağlık raporu süresi dolmuş — yenileme zorunlu'
        severity = 'red'
      } else if (r.gecerlilik_durumu === 'uyari') {
        message = 'Sağlık raporu 30 gün içinde dolacak'
        severity = 'yellow'
      } else if (r.recorded_at) {
        message = 'Sağlık kaydı 1 yıldan eski — yenileme önerilir'
        severity = 'yellow'
      }
      return {
        athlete_id: r.athlete_id,
        athlete_name: r.athlete_name,
        parent_user_id: r.parent_user_id,
        recorded_at: r.recorded_at,
        saglik_raporu_gecerlilik: r.saglik_raporu_gecerlilik,
        gecerlilik_durumu: r.gecerlilik_durumu,
        message,
        severity,
      }
    })

    return NextResponse.json({ items, warnings })
  } catch (e) {
    console.error('[franchise/health-records GET]', e)
    return NextResponse.json({ items: [], warnings: [] })
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Giriş gerekli' }, { status: 401 })

    const tenantId = await getTenantIdWithFallback(user.id, req)
    if (!tenantId) return NextResponse.json({ error: 'Tenant atanmamış' }, { status: 403 })

    const body = await req.json()
    const athlete_id = body.athlete_id as string | undefined
    const record_type = (body.record_type as string) || 'genel'
    const notes = typeof body.notes === 'string' ? body.notes.trim() : null
    if (!athlete_id) return NextResponse.json({ error: 'athlete_id zorunludur' }, { status: 400 })

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })

    const service = createServiceClient(url, key)
    const { data: athlete } = await service.from('athletes').select('id').eq('id', athlete_id).eq('tenant_id', tenantId).maybeSingle()
    if (!athlete) return NextResponse.json({ error: 'Öğrenci bulunamadı' }, { status: 404 })

    const saglik_raporu_gecerlilik = typeof body.saglik_raporu_gecerlilik === 'string' ? body.saglik_raporu_gecerlilik : null

    const { data, error } = await service
      .from('athlete_health_records')
      .insert({ athlete_id, record_type, notes, recorded_at: new Date().toISOString(), recorded_by: user.id, saglik_raporu_gecerlilik })
      .select('id, athlete_id, record_type, recorded_at, saglik_raporu_gecerlilik')
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true, item: data })
  } catch (e) {
    console.error('[franchise/health-records POST]', e)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
