/**
 * Antrenör: ölçüm girişi, analiz
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { getTenantIdWithFallback } from '@/lib/franchise-tenant'

export const dynamic = 'force-dynamic'

function yasHesapla(birthDate: string | null): number | null {
  if (!birthDate) return null
  const diff = new Date().getTime() - new Date(birthDate).getTime()
  return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000))
}

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ sporcular: [] })

    const tenantId = await getTenantIdWithFallback(user.id, req)
    if (!tenantId) return NextResponse.json({ sporcular: [] })

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) return NextResponse.json({ sporcular: [] })

    const service = createServiceClient(url, key)
    const { data: sporcular } = await service
      .from('athletes')
      .select('id, name, surname, birth_date, gender')
      .eq('tenant_id', tenantId)
      .eq('coach_user_id', user.id)
      .order('name')

    return NextResponse.json({ sporcular: sporcular ?? [] })
  } catch (e) {
    console.error('[antrenor/olcum GET]', e)
    return NextResponse.json({ sporcular: [] })
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Giriş gerekli' }, { status: 401 })

    const tenantId = await getTenantIdWithFallback(user.id, req)
    if (!tenantId) return NextResponse.json({ error: 'Tesis atanmamış' }, { status: 403 })

    const body = await req.json()
    const athleteId = body.athlete_id
    const olcumTarihi = body.olcum_tarihi || new Date().toISOString().slice(0, 10)
    if (!athleteId) return NextResponse.json({ error: 'athlete_id gerekli' }, { status: 400 })

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) return NextResponse.json({ error: 'Sunucu hatası' })

    const service = createServiceClient(url, key)

    const { data: athlete } = await service.from('athletes').select('id, birth_date, gender').eq('id', athleteId).eq('tenant_id', tenantId).single()
    if (!athlete) return NextResponse.json({ error: 'Sporcu bulunamadı' }, { status: 404 })

    const row = {
      tenant_id: tenantId,
      athlete_id: athleteId,
      olcum_tarihi: olcumTarihi,
      boy: body.boy != null ? Number(body.boy) : null,
      kilo: body.kilo != null ? Number(body.kilo) : null,
      esneklik: body.esneklik != null ? Number(body.esneklik) : null,
      dikey_sicrama: body.dikey_sicrama != null ? Number(body.dikey_sicrama) : null,
      sure_20m: body.sure_20m != null ? Number(body.sure_20m) : null,
      denge: body.denge != null ? Number(body.denge) : null,
      koordinasyon: body.koordinasyon != null ? parseInt(String(body.koordinasyon), 10) : null,
      kuvvet: body.kuvvet != null ? parseInt(String(body.kuvvet), 10) : null,
      dayaniklilik: body.dayaniklilik != null ? parseInt(String(body.dayaniklilik), 10) : null,
      postur_notu: body.postur_notu || null,
      genel_degerlendirme: body.genel_degerlendirme || null,
      olcen_id: user.id,
    }

    const { data: inserted, error } = await service.from('athlete_measurements').insert(row).select('id').single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const yas = yasHesapla(athlete.birth_date)
    const cinsiyet = (athlete.gender === 'E' || athlete.gender === 'K') ? athlete.gender : 'E'
    const analiz: Array<{ parametre: string; deger: number; seviye: string; brans?: string }> = []
    const bransOnerileri = new Set<string>()

    const params = ['boy', 'kilo', 'esneklik', 'dikey_sicrama', 'sure_20m', 'denge', 'koordinasyon', 'kuvvet', 'dayaniklilik'] as const
    const colMap: Record<string, keyof typeof row> = { boy: 'boy', kilo: 'kilo', esneklik: 'esneklik', dikey_sicrama: 'dikey_sicrama', sure_20m: 'sure_20m', denge: 'denge', koordinasyon: 'koordinasyon', kuvvet: 'kuvvet', dayaniklilik: 'dayaniklilik' }

    if (yas != null) {
      const { data: refs } = await service.from('reference_values').select('*').in('parametre', params).eq('cinsiyet', cinsiyet).lte('yas_max', yas).gte('yas_min', yas)
      for (const p of params) {
        const val = row[colMap[p]]
        if (val == null) continue
        const v = Number(val)
        const r = (refs ?? []).find((x: { parametre: string }) => x.parametre === p)
        if (r) {
          const min = Number(r.deger_min)
          const max = Number(r.deger_max)
          let seviye = 'normal'
          if (v < min) seviye = 'zayif'
          else if (v >= min && v <= max) seviye = r.seviye
          else seviye = 'ustun'
          analiz.push({ parametre: p, deger: v, seviye })
          if (r.brans_uygunluk) bransOnerileri.add(r.brans_uygunluk)
        }
      }
    }

    return NextResponse.json({
      ok: true,
      id: inserted?.id,
      analiz,
      bransOnerileri: Array.from(bransOnerileri),
    })
  } catch (e) {
    console.error('[antrenor/olcum POST]', e)
    return NextResponse.json({ error: 'Sunucu hatası' })
  }
}
