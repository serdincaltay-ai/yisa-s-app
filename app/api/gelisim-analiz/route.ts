/**
 * Faz 4 — Veri Robotu: Gelişim Analiz Endpoint'i
 * POST: { athlete_id, tenant_id }
 * Sporcunun son ölçümlerini referans_degerler ile karşılaştırır.
 * Response: sporcu bilgileri, parametre bazlı analiz, branş önerisi
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { getTenantIdWithFallback } from '@/lib/franchise-tenant'

export const dynamic = 'force-dynamic'

type Durum = 'dusuk' | 'normal' | 'yuksek'

interface ParametreAnaliz {
  parametre: string
  deger: number
  referans_min: number
  referans_max: number
  optimal: number
  durum: Durum
  yuzdelik: number
}

interface AnalizResponse {
  athlete: {
    id: string
    ad: string
    yas: number | null
    cinsiyet: string
    vucut_tipi: string
  }
  olcum_tarihi: string | null
  analiz: ParametreAnaliz[]
  oneri: string
  brans_onerileri: string[]
}

/** Yaşı hesapla (tam yıl) */
function yasHesapla(birthDate: string | null): number | null {
  if (!birthDate) return null
  const diff = new Date().getTime() - new Date(birthDate).getTime()
  return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000))
}

/** Vücut tipi tahmini (BMI + esneklik bazlı basit sınıflandırma) */
function vucutTipiTahmin(
  bmi: number | null,
  esneklik: number | null
): string {
  if (bmi == null) return 'belirsiz'
  if (bmi < 15) return 'ince-uzun'
  if (bmi > 20) return 'guclu-kompakt'
  if (esneklik != null && esneklik > 25) return 'esnek'
  return 'dengeli'
}

/** Branş önerisi üret (analiz sonuçlarına göre) */
function bransOnerisiUret(analizler: ParametreAnaliz[], vucutTipi: string): string[] {
  const onerileri: string[] = []
  const ustunParametreler = analizler.filter((a) => a.durum === 'yuksek').map((a) => a.parametre)

  if (ustunParametreler.includes('esneklik') || ustunParametreler.includes('denge')) {
    onerileri.push('cimnastik')
  }
  if (ustunParametreler.includes('surat') || ustunParametreler.includes('dayaniklilik')) {
    onerileri.push('atletizm')
  }
  if (ustunParametreler.includes('koordinasyon') || ustunParametreler.includes('denge')) {
    if (!onerileri.includes('cimnastik')) onerileri.push('cimnastik')
  }
  if (ustunParametreler.includes('kuvvet') || ustunParametreler.includes('dikey_sicrama')) {
    onerileri.push('jimnastik')
  }

  if (vucutTipi === 'esnek' && !onerileri.includes('cimnastik')) {
    onerileri.push('cimnastik')
  }
  if (vucutTipi === 'ince-uzun') {
    onerileri.push('yuzme')
  }

  if (onerileri.length === 0) onerileri.push('genel')
  return onerileri
}

/** Öneri metni üret */
function oneriMetniUret(
  analizler: ParametreAnaliz[],
  vucutTipi: string,
  branslar: string[]
): string {
  const ustun = analizler.filter((a) => a.durum === 'yuksek').map((a) => a.parametre)
  const dusuk = analizler.filter((a) => a.durum === 'dusuk').map((a) => a.parametre)

  const parcalar: string[] = []

  if (vucutTipi !== 'belirsiz') {
    parcalar.push(`Sporcu ${vucutTipi} vücut tipinde.`)
  }

  if (ustun.length > 0) {
    parcalar.push(`Üstün parametreler: ${ustun.join(', ')}.`)
  }
  if (dusuk.length > 0) {
    parcalar.push(`Geliştirilmesi gereken: ${dusuk.join(', ')}.`)
  }

  if (branslar.length > 0 && branslar[0] !== 'genel') {
    parcalar.push(`Önerilen branşlar: ${branslar.join(', ')}.`)
  }

  if (parcalar.length === 0) {
    return 'Yeterli ölçüm verisi bulunamadı. Daha fazla parametre girilmesi önerilir.'
  }

  return parcalar.join(' ')
}

function getService() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createServiceClient(url, key)
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Giriş gerekli' }, { status: 401 })

    const body = await req.json()
    const athleteId = typeof body.athlete_id === 'string' ? body.athlete_id.trim() : ''
    if (!athleteId) return NextResponse.json({ error: 'athlete_id zorunludur' }, { status: 400 })

    const tenantId = await getTenantIdWithFallback(user.id, req)
    if (!tenantId) return NextResponse.json({ error: 'Tenant atanmamış' }, { status: 403 })

    const service = getService()
    if (!service) return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })

    // 1) Sporcu bilgilerini al
    const { data: athlete } = await service
      .from('athletes')
      .select('id, name, surname, birth_date, gender')
      .eq('id', athleteId)
      .eq('tenant_id', tenantId)
      .single()

    if (!athlete) return NextResponse.json({ error: 'Sporcu bulunamadı' }, { status: 404 })

    const yas = yasHesapla(athlete.birth_date)
    const cinsiyet = (athlete.gender === 'E' || athlete.gender === 'K') ? athlete.gender : 'E'

    // 2) Son ölçümü al (gelisim_olcumleri tablosundan)
    const { data: sonOlcum } = await service
      .from('gelisim_olcumleri')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('athlete_id', athleteId)
      .order('olcum_tarihi', { ascending: false })
      .limit(1)
      .maybeSingle()

    // Fallback: athlete_measurements tablosundan da bak
    let olcumVerileri: Record<string, number> = {}
    let olcumTarihi: string | null = null

    if (sonOlcum?.olcum_verileri && typeof sonOlcum.olcum_verileri === 'object') {
      const raw = sonOlcum.olcum_verileri as Record<string, unknown>
      for (const [k, v] of Object.entries(raw)) {
        if (v != null && !isNaN(Number(v))) {
          olcumVerileri[k] = Number(v)
        }
      }
      olcumTarihi = sonOlcum.olcum_tarihi as string
    } else {
      // Fallback: athlete_measurements
      const { data: legacyOlcum } = await service
        .from('athlete_measurements')
        .select('*')
        .eq('tenant_id', tenantId)
        .eq('athlete_id', athleteId)
        .order('olcum_tarihi', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (legacyOlcum) {
        const params = ['boy', 'kilo', 'esneklik', 'dikey_sicrama', 'sure_20m', 'denge', 'koordinasyon', 'kuvvet', 'dayaniklilik'] as const
        for (const p of params) {
          const val = legacyOlcum[p]
          if (val != null && !isNaN(Number(val))) {
            olcumVerileri[p === 'sure_20m' ? 'surat' : p] = Number(val)
          }
        }
        olcumTarihi = legacyOlcum.olcum_tarihi as string
      }
    }

    // 3) BMI hesapla (eğer boy + kilo varsa)
    if (olcumVerileri.boy && olcumVerileri.kilo && !olcumVerileri.bmi) {
      const boyMetre = olcumVerileri.boy / 100
      olcumVerileri.bmi = Math.round((olcumVerileri.kilo / (boyMetre * boyMetre)) * 10) / 10
    }

    // 4) Referans değerlerle karşılaştır
    const analizler: ParametreAnaliz[] = []

    if (yas != null) {
      const { data: refs } = await service
        .from('referans_degerler')
        .select('*')
        .eq('yas', yas)
        .eq('cinsiyet', cinsiyet)

      for (const [parametre, deger] of Object.entries(olcumVerileri)) {
        const ref = (refs ?? []).find((r: { parametre: string }) => r.parametre === parametre)
        if (!ref) continue

        const minDeger = Number(ref.min_deger)
        const maxDeger = Number(ref.max_deger)
        const optimal = Number(ref.optimal_deger)
        const range = maxDeger - minDeger

        let durum: Durum = 'normal'
        // Sürat için ters mantık (düşük = iyi)
        if (parametre === 'surat') {
          if (deger > maxDeger) durum = 'dusuk'
          else if (deger < minDeger) durum = 'yuksek'
        } else {
          if (deger < minDeger) durum = 'dusuk'
          else if (deger > maxDeger) durum = 'yuksek'
        }

        // Yüzdelik hesapla (0-100 arası, min=0, max=100)
        let yuzdelik = range > 0 ? Math.round(((deger - minDeger) / range) * 100) : 50
        if (parametre === 'surat') {
          yuzdelik = range > 0 ? Math.round(((maxDeger - deger) / range) * 100) : 50
        }
        yuzdelik = Math.max(0, Math.min(100, yuzdelik))

        analizler.push({
          parametre,
          deger,
          referans_min: minDeger,
          referans_max: maxDeger,
          optimal,
          durum,
          yuzdelik,
        })
      }
    }

    // 5) Vücut tipi + branş önerisi
    const vucutTipi = vucutTipiTahmin(
      olcumVerileri.bmi ?? null,
      olcumVerileri.esneklik ?? null
    )
    const bransOnerileri = bransOnerisiUret(analizler, vucutTipi)
    const oneri = oneriMetniUret(analizler, vucutTipi, bransOnerileri)

    const response: AnalizResponse = {
      athlete: {
        id: athlete.id as string,
        ad: `${athlete.name ?? ''} ${athlete.surname ?? ''}`.trim(),
        yas,
        cinsiyet,
        vucut_tipi: vucutTipi,
      },
      olcum_tarihi: olcumTarihi,
      analiz: analizler,
      oneri,
      brans_onerileri: bransOnerileri,
    }

    return NextResponse.json(response)
  } catch (e) {
    console.error('[gelisim-analiz POST]', e)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
