import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

/**
 * Franchise paneli: Kullanıcının tenant bilgisini döner.
 * user_tenants veya tenants.owner_id üzerinden.
 */
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Giriş gerekli' }, { status: 401 })
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) {
      return NextResponse.json({ error: 'Sunucu yapılandırma hatası' }, { status: 500 })
    }
    const service = createServiceClient(url, key)

    // 1. user_tenants'tan tenant_id
    const { data: ut } = await service
      .from('user_tenants')
      .select('tenant_id')
      .eq('user_id', user.id)
      .limit(1)
      .maybeSingle()

    let tenantId = ut?.tenant_id

    // 2. Yoksa tenants.owner_id
    if (!tenantId) {
      const { data: t } = await service
        .from('tenants')
        .select('id')
        .eq('owner_id', user.id)
        .limit(1)
        .maybeSingle()
      tenantId = t?.id
    }

    if (!tenantId) {
      return NextResponse.json({
        tenant: null,
        message: 'Henüz atanmış tesisiniz yok. Patron onayı sonrası tesisiniz oluşturulacak.',
      })
    }

    const { data: tenant, error: tenantError } = await service
      .from('tenants')
      .select('id, ad, name, slug, durum, package_type, token_balance')
      .eq('id', tenantId)
      .single()

    if (tenantError || !tenant) {
      return NextResponse.json({ error: 'Tenant bulunamadı' }, { status: 404 })
    }

    // franchise tablosundan ek bilgi
    const { data: franchise } = await service
      .from('franchises')
      .select('isletme_adi, yetkili_ad, yetkili_soyad, ogrenci_sayisi, personel_sayisi, aylik_gelir')
      .eq('tenant_id', tenantId)
      .maybeSingle()

    return NextResponse.json({
      tenant: {
        id: tenant.id,
        name: tenant.name ?? tenant.ad ?? 'Tesisim',
        slug: tenant.slug,
        status: tenant.durum,
        packageType: tenant.package_type,
        tokenBalance: tenant.token_balance ?? 0,
        franchise: franchise ? {
          businessName: franchise.isletme_adi,
          contactName: `${franchise.yetkili_ad ?? ''} ${franchise.yetkili_soyad ?? ''}`.trim(),
          memberCount: franchise.ogrenci_sayisi ?? 0,
          staffCount: franchise.personel_sayisi ?? 0,
          monthlyRevenue: franchise.aylik_gelir ?? 0,
        } : null,
      },
    })
  } catch (e) {
    console.error('[franchise/tenant]', e)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
