/**
 * Franchise: kredi özeti — toplam aktif kredi, biten krediler
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
    if (!user) return NextResponse.json({ toplamAktifKredi: 0, bitenKrediler: [] })

    const tenantId = await getTenantIdWithFallback(user.id, req)
    if (!tenantId) return NextResponse.json({ toplamAktifKredi: 0, bitenKrediler: [] })

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) return NextResponse.json({ toplamAktifKredi: 0, bitenKrediler: [] })

    const service = createServiceClient(url, key)
    const { data: athletes } = await service
      .from('athletes')
      .select('id, name, surname, ders_kredisi, toplam_kredi')
      .eq('tenant_id', tenantId)

    let toplamAktifKredi = 0
    const bitenKrediler: Array<{ id: string; name: string; surname?: string }> = []

    for (const a of athletes ?? []) {
      const kredi = Number(a.ders_kredisi) ?? 0
      toplamAktifKredi += kredi
      if (kredi === 0 && (Number(a.toplam_kredi) ?? 0) > 0) {
        bitenKrediler.push({ id: a.id, name: a.name ?? '', surname: a.surname ?? '' })
      }
    }

    return NextResponse.json({ toplamAktifKredi, bitenKrediler })
  } catch (e) {
    console.error('[franchise/kredi-ozet]', e)
    return NextResponse.json({ toplamAktifKredi: 0, bitenKrediler: [] })
  }
}
