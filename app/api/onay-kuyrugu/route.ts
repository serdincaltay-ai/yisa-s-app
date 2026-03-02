/**
 * Onay Kuyrugu API: Demo talep ozet istatistikleri + provisioning zincir durumu
 * demo_requests → tenants baglantisi
 */

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Giris gerekli' }, { status: 401 })

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) return NextResponse.json({ error: 'Sunucu hatasi' })

    const service = createServiceClient(url, key)

    // Patron/owner rol kontrolu — sadece yetkili kullanicilar erisebilir
    const { data: userRole } = await service
      .from('user_tenants')
      .select('role')
      .eq('user_id', user.id)
      .in('role', ['owner', 'patron'])
      .limit(1)
      .maybeSingle()
    if (!userRole) return NextResponse.json({ error: 'Yetki yok' }, { status: 403 })

    // Demo talep istatistikleri
    const { data: requests } = await service
      .from('demo_requests')
      .select('id, status, source, created_at, payment_status')
      .order('created_at', { ascending: false })
      .limit(200)

    const items = requests ?? []
    const bekleyen = items.filter((r: { status: string }) => r.status === 'new').length
    const onaylanan = items.filter((r: { status: string }) => r.status === 'converted').length
    const reddedilen = items.filter((r: { status: string }) => r.status === 'rejected').length
    const toplam = items.length

    // Kaynak dagilimi
    const kaynakDagilimi: Record<string, number> = {}
    for (const r of items) {
      const src = (r as { source?: string }).source || 'bilinmeyen'
      kaynakDagilimi[src] = (kaynakDagilimi[src] || 0) + 1
    }

    // Tenant sayisi (provisioning sonucu)
    const { count: tenantCount } = await service
      .from('tenants')
      .select('id', { count: 'exact', head: true })

    // Son 7 gun talep trendi
    const yediGunOnce = new Date()
    yediGunOnce.setDate(yediGunOnce.getDate() - 7)
    const sonHafta = items.filter((r: { created_at: string }) =>
      new Date(r.created_at) >= yediGunOnce
    ).length

    return NextResponse.json({
      ozet: {
        toplam,
        bekleyen,
        onaylanan,
        reddedilen,
        sonHaftaTalep: sonHafta,
        toplamTenant: tenantCount ?? 0,
      },
      kaynakDagilimi: Object.entries(kaynakDagilimi).map(([kaynak, sayi]) => ({ kaynak, sayi })),
    })
  } catch (e) {
    console.error('[onay-kuyrugu]', e)
    return NextResponse.json({ error: 'Sunucu hatasi' })
  }
}
