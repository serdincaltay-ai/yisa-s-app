/**
 * GET /api/coo/belge-kontrol
 * Haftalık cron: Süresi dolacak/dolmuş belgeleri tarar, patron'a push bildirim gönderir.
 * vercel.json'da haftalık (Pazartesi 08:00 UTC) çalışacak şekilde ayarlanmıştır.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import {
  sendPushNotification,
  type PushSubscriptionData,
} from '@/lib/notifications/web-push'

export const dynamic = 'force-dynamic'

const WARN_DAYS = 30

interface RecordRow {
  id: string
  athlete_id: string
  saglik_raporu_gecerlilik: string
  record_type: string
}

interface AthleteRow {
  id: string
  name: string
  surname: string | null
  tenant_id: string
}

interface TenantRow {
  id: string
  name: string
}

interface SubscriptionRow {
  endpoint: string
  keys_p256dh: string
  keys_auth: string
}

export async function GET(req: NextRequest) {
  try {
    // Cron secret dogrulamasi
    const cronSecret = process.env.CRON_SECRET?.trim()
    if (cronSecret) {
      const auth = req.headers.get('authorization')
      if (auth !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
      }
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) {
      return NextResponse.json({ error: 'Sunucu yapılandırma hatası' }, { status: 500 })
    }

    const service = createServiceClient(url, key)

    const bugun = new Date()
    const otuzGunSonra = new Date(bugun)
    otuzGunSonra.setDate(otuzGunSonra.getDate() + WARN_DAYS)
    const otuzGunStr = otuzGunSonra.toISOString().slice(0, 10)

    // Süresi dolacak veya dolmuş belgeleri bul
    const { data: records, error: recErr } = await service
      .from('athlete_health_records')
      .select('id, athlete_id, saglik_raporu_gecerlilik, record_type')
      .not('saglik_raporu_gecerlilik', 'is', null)
      .lte('saglik_raporu_gecerlilik', otuzGunStr)
      .order('saglik_raporu_gecerlilik', { ascending: true })

    if (recErr) {
      console.error('[belge-kontrol] Sorgu hatası:', recErr.message)
      return NextResponse.json({ error: recErr.message }, { status: 500 })
    }

    if (!records || records.length === 0) {
      return NextResponse.json({ ok: true, bildirim: 0, mesaj: 'Süresi dolacak belge yok' })
    }

    const typedRecords = records as RecordRow[]

    // Sporcu bilgilerini al
    const athleteIds = [...new Set(typedRecords.map((r) => r.athlete_id))]
    const { data: athletes } = await service
      .from('athletes')
      .select('id, name, surname, tenant_id')
      .in('id', athleteIds)

    const typedAthletes = (athletes ?? []) as AthleteRow[]
    const athleteMap = new Map(typedAthletes.map((a) => [a.id, a]))

    // Tenant bilgilerini al
    const tenantIds = [...new Set(typedAthletes.map((a) => a.tenant_id).filter(Boolean))]
    const { data: tenants } = await service
      .from('tenants')
      .select('id, name')
      .in('id', tenantIds)

    const tenantMap = new Map(((tenants ?? []) as TenantRow[]).map((t) => [t.id, t]))

    // Patron kullanıcılarını bul (user_metadata.role = 'patron')
    const { data: patronUsers } = await service
      .from('user_tenants')
      .select('user_id')
      .eq('role', 'patron')

    const patronUserIds = [...new Set((patronUsers ?? []).map((p: { user_id: string }) => p.user_id))]

    if (patronUserIds.length === 0) {
      // Patron yoksa owner'lara gönder
      const { data: owners } = await service
        .from('user_tenants')
        .select('user_id')
        .eq('role', 'owner')
        .in('tenant_id', tenantIds)

      patronUserIds.push(...(owners ?? []).map((o: { user_id: string }) => o.user_id))
    }

    if (patronUserIds.length === 0) {
      return NextResponse.json({ ok: true, bildirim: 0, mesaj: 'Bildirim gönderilecek kullanıcı yok' })
    }

    // Push subscription'larını getir
    const { data: allSubs } = await service
      .from('push_subscriptions')
      .select('user_id, endpoint, keys_p256dh, keys_auth')
      .in('user_id', patronUserIds)
      .eq('is_active', true)

    const subsMap = new Map<string, SubscriptionRow[]>()
    for (const sub of (allSubs ?? []) as Array<{ user_id: string } & SubscriptionRow>) {
      const list = subsMap.get(sub.user_id) ?? []
      list.push({ endpoint: sub.endpoint, keys_p256dh: sub.keys_p256dh, keys_auth: sub.keys_auth })
      subsMap.set(sub.user_id, list)
    }

    // Tenant bazlı özet oluştur
    const bugunStr = bugun.toISOString().slice(0, 10)
    const tenantOzet = new Map<string, { tesis: string; dolmus: number; yakinda: number }>()
    for (const rec of typedRecords) {
      const athlete = athleteMap.get(rec.athlete_id)
      if (!athlete) continue
      const tid = athlete.tenant_id
      const tenant = tenantMap.get(tid)
      if (!tenantOzet.has(tid)) {
        tenantOzet.set(tid, { tesis: tenant?.name ?? 'Bilinmeyen', dolmus: 0, yakinda: 0 })
      }
      const ozet = tenantOzet.get(tid)!
      if (rec.saglik_raporu_gecerlilik < bugunStr) {
        ozet.dolmus++
      } else {
        ozet.yakinda++
      }
    }

    // Bildirim metni oluştur
    const ozetSatirlari: string[] = []
    for (const [, ozet] of tenantOzet) {
      const parcalar: string[] = []
      if (ozet.dolmus > 0) parcalar.push(`${ozet.dolmus} süresi dolmuş`)
      if (ozet.yakinda > 0) parcalar.push(`${ozet.yakinda} yakında dolacak`)
      ozetSatirlari.push(`${ozet.tesis}: ${parcalar.join(', ')}`)
    }

    const toplamDolmus = typedRecords.filter((r) => r.saglik_raporu_gecerlilik < bugunStr).length
    const toplamYakinda = typedRecords.length - toplamDolmus

    const title = 'Haftalık Belge Geçerlilik Raporu'
    const body = `${toplamDolmus} süresi dolmuş, ${toplamYakinda} yakında dolacak belge var.\n${ozetSatirlari.join('\n')}`

    // Her patron/owner'a bildirim gönder
    let gonderilen = 0
    for (const userId of patronUserIds) {
      const subs = subsMap.get(userId)
      if (!subs || subs.length === 0) continue

      for (const sub of subs) {
        const pushSub: PushSubscriptionData = {
          endpoint: sub.endpoint,
          keys: { p256dh: sub.keys_p256dh, auth: sub.keys_auth },
        }
        const result = await sendPushNotification(pushSub, {
          title,
          body,
          notification_type: 'belge_uyari',
          url: '/franchise/belgeler',
        })
        if (result.ok) gonderilen++
      }
    }

    return NextResponse.json({
      ok: true,
      bildirim: gonderilen,
      toplam_belge: typedRecords.length,
      suresi_dolmus: toplamDolmus,
      yakinda_dolacak: toplamYakinda,
      tesis_ozet: Object.fromEntries(tenantOzet),
    })
  } catch (e) {
    console.error('[belge-kontrol]', e)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
