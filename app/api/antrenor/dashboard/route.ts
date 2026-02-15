/**
 * Antrenör dashboard: bugünün dersleri, atanan sporcu sayısı, son yoklamalar
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { getTenantIdWithFallback } from '@/lib/franchise-tenant'

export const dynamic = 'force-dynamic'

const GUN_MAP: Record<number, string> = {
  0: 'Pazar', 1: 'Pazartesi', 2: 'Sali', 3: 'Carsamba', 4: 'Persembe', 5: 'Cuma', 6: 'Cumartesi',
}

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
    const bugunGun = GUN_MAP[new Date().getDay()] ?? 'Pazartesi'
    const bugunStr = new Date().toISOString().slice(0, 10)

    const [schedulesRes, athletesRes, attendanceRes] = await Promise.all([
      service.from('tenant_schedule').select('id, gun, saat, ders_adi, brans').eq('tenant_id', tenantId).eq('gun', bugunGun).order('saat'),
      service.from('athletes').select('id', { count: 'exact', head: true }).eq('tenant_id', tenantId).eq('coach_user_id', user.id),
      service.from('attendance').select('lesson_date, status').eq('tenant_id', tenantId).order('lesson_date', { ascending: false }).limit(20),
    ])

    const schedules = schedulesRes.data ?? []
    const sporcuSayisi = athletesRes.count ?? 0
    const sonYoklamalar = (attendanceRes.data ?? []).reduce((acc: Record<string, { geldi: number; gelmedi: number }>, r: { lesson_date: string; status: string }) => {
      const d = r.lesson_date as string
      if (!acc[d]) acc[d] = { geldi: 0, gelmedi: 0 }
      if (r.status === 'present') acc[d].geldi++
      else acc[d].gelmedi++
      return acc
    }, {})

    return NextResponse.json({
      bugunDersleri: schedules,
      sporcuSayisi,
      sonYoklamalar: Object.entries(sonYoklamalar).slice(0, 7).map(([tarih, v]) => ({ tarih, ...v })),
      bugunTarih: bugunStr,
    })
  } catch (e) {
    console.error('[antrenor/dashboard]', e)
    return NextResponse.json({ error: 'Sunucu hatası' })
  }
}
