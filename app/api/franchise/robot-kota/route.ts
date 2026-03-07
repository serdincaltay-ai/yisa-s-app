import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getQuotaSummary } from '@/lib/robots/quota'

/**
 * GET /api/franchise/robot-kota
 * Franchise panelinde robot kota ozeti gosterir.
 * Header: x-tenant-id (middleware tarafindan eklenir)
 */
export async function GET(request: Request) {
  try {
    const tenantId = request.headers.get('x-tenant-id')
    if (!tenantId) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
    }

    // Tenant paket tipini bul
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) {
      return NextResponse.json({ error: 'Sunucu yapılandırma hatası' }, { status: 500 })
    }

    const supabase = createClient(url, key)
    const { data: tenant } = await supabase
      .from('tenants')
      .select('package_type')
      .eq('id', tenantId)
      .maybeSingle()

    const paketTipi = (tenant?.package_type as string) ?? 'starter'

    const ozet = await getQuotaSummary(tenantId, paketTipi)

    return NextResponse.json({ ok: true, paketTipi, kotalar: ozet })
  } catch (err) {
    const mesaj = err instanceof Error ? err.message : 'Bilinmeyen hata'
    return NextResponse.json({ error: mesaj }, { status: 500 })
  }
}
