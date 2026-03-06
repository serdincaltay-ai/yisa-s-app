/**
 * GET /api/franchise/belgeler/kontrol
 * athlete_health_records tablosundan saglik_raporu_gecerlilik < bugün + 30 gün olanları listele
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { getTenantIdWithFallback } from '@/lib/franchise-tenant'

export const dynamic = 'force-dynamic'

const WARN_DAYS = 30

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Giriş gerekli' }, { status: 401 })

    const tenantId = await getTenantIdWithFallback(user.id, req)
    if (!tenantId) return NextResponse.json({ items: [], toplam: 0 })

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) return NextResponse.json({ items: [], toplam: 0 })

    const service = createServiceClient(url, key)

    // Tenant'a ait sporcu id'lerini al
    const { data: tenantAthletes } = await service.from('athletes').select('id').eq('tenant_id', tenantId)
    const athleteIds = (tenantAthletes ?? []).map((a: { id: string }) => a.id)
    if (athleteIds.length === 0) return NextResponse.json({ items: [], toplam: 0 })

    const bugun = new Date()
    const otuzGunSonra = new Date(bugun)
    otuzGunSonra.setDate(otuzGunSonra.getDate() + WARN_DAYS)
    const otuzGunStr = otuzGunSonra.toISOString().slice(0, 10)

    // saglik_raporu_gecerlilik < bugün + 30 gün olanları getir
    const { data: records, error } = await service
      .from('athlete_health_records')
      .select('id, athlete_id, record_type, saglik_raporu_gecerlilik, recorded_at, athletes(name, surname, parent_user_id)')
      .in('athlete_id', athleteIds)
      .not('saglik_raporu_gecerlilik', 'is', null)
      .lte('saglik_raporu_gecerlilik', otuzGunStr)
      .order('saglik_raporu_gecerlilik', { ascending: true })

    if (error) {
      console.error('[belgeler/kontrol]', error.message)
      return NextResponse.json({ items: [], toplam: 0, error: error.message })
    }

    const bugunStr = bugun.toISOString().slice(0, 10)
    const items = (records ?? []).map((r: Record<string, unknown>) => {
      const a = r.athletes as { name?: string; surname?: string; parent_user_id?: string | null } | null
      const gecerlilik = r.saglik_raporu_gecerlilik as string
      const suresiDolmus = gecerlilik < bugunStr

      return {
        id: r.id,
        athlete_id: r.athlete_id,
        athlete_name: a ? `${a.name ?? ''} ${a.surname ?? ''}`.trim() : '—',
        parent_user_id: a?.parent_user_id ?? null,
        record_type: r.record_type,
        saglik_raporu_gecerlilik: gecerlilik,
        recorded_at: r.recorded_at,
        suresi_dolmus: suresiDolmus,
        durum: suresiDolmus ? 'suresi_dolmus' : 'yakinda_dolacak',
        mesaj: suresiDolmus
          ? `Sağlık raporu süresi dolmuş (${formatTarih(gecerlilik)})`
          : `Sağlık raporu ${formatTarih(gecerlilik)} tarihinde dolacak`,
      }
    })

    return NextResponse.json({
      items,
      toplam: items.length,
      suresi_dolmus: items.filter((i: { suresi_dolmus: boolean }) => i.suresi_dolmus).length,
      yakinda_dolacak: items.filter((i: { suresi_dolmus: boolean }) => !i.suresi_dolmus).length,
    })
  } catch (e) {
    console.error('[belgeler/kontrol]', e)
    return NextResponse.json({ items: [], toplam: 0, error: 'Sunucu hatası' }, { status: 500 })
  }
}

/** YYYY-MM-DD → "5 Mart 2026" formatına çevir */
function formatTarih(tarih: string): string {
  try {
    const d = new Date(tarih + 'T00:00:00')
    return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
  } catch {
    return tarih
  }
}
