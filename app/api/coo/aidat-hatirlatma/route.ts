/**
 * GET /api/coo/aidat-hatirlatma
 * Cron ile günlük çağrılır (09:00 UTC — vercel.json)
 * Yaklaşan (7 gün içinde) veya gecikmiş pending ödemeleri bulur,
 * ilgili velilere push notification gönderir ve reminder_logs'a kayıt yazar.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import {
  sendPushNotification,
  type PushSubscriptionData,
} from '@/lib/notifications/web-push'

export const dynamic = 'force-dynamic'

interface PaymentRow {
  id: string
  athlete_id: string
  amount: number
  due_date: string
  status: string
  period_month: number | null
  period_year: number | null
  tenant_id: string
}

interface AthleteRow {
  id: string
  name: string
  surname: string | null
  parent_user_id: string | null
}

interface SubscriptionRow {
  endpoint: string
  keys_p256dh: string
  keys_auth: string
}

interface PreferenceRow {
  odeme_hatirlatma: boolean
}

export async function GET(req: NextRequest) {
  try {
    // Cron secret doğrulaması (varsa)
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

    // Bugün + 7 gün sonrası
    const bugun = new Date()
    const yediGunSonra = new Date(bugun)
    yediGunSonra.setDate(yediGunSonra.getDate() + 7)

    const bugunStr = bugun.toISOString().slice(0, 10)
    const yediGunStr = yediGunSonra.toISOString().slice(0, 10)

    // Son 3 gün içinde hatırlatma gönderilmiş payment_id'leri bul (deduplication)
    const ucGunOnce = new Date(bugun)
    ucGunOnce.setDate(ucGunOnce.getDate() - 3)
    const { data: recentLogs } = await service
      .from('reminder_logs')
      .select('payment_id')
      .eq('status', 'sent')
      .gte('sent_at', ucGunOnce.toISOString())

    const recentlyRemindedIds = new Set(
      (recentLogs ?? []).map((r: { payment_id: string }) => r.payment_id)
    )

    // pending + due_date <= bugün+7 olan ödemeleri bul
    // TODO: Multi-tenant yapıda tenant_id filtresi eklenmeli.
    // Şu an tek tenant olduğu için tüm ödemeler tek geçişte işleniyor.
    const { data: payments, error: payErr } = await service
      .from('payments')
      .select('id, athlete_id, amount, due_date, status, period_month, period_year, tenant_id')
      .eq('status', 'pending')
      .lte('due_date', yediGunStr)
      .order('due_date', { ascending: true })

    if (payErr) {
      console.error('[aidat-hatirlatma] Ödeme sorgu hatası:', payErr.message)
      return NextResponse.json({ error: payErr.message }, { status: 500 })
    }

    if (!payments || payments.length === 0) {
      return NextResponse.json({ ok: true, hatirlatilan: 0, mesaj: 'Bekleyen ödeme yok' })
    }

    const typedPayments = payments as PaymentRow[]

    // Sporcu bilgilerini al (parent_user_id ile veli bağlantısı)
    const athleteIds = [...new Set(typedPayments.map((p) => p.athlete_id))]
    const { data: athletes } = await service
      .from('athletes')
      .select('id, name, surname, parent_user_id')
      .in('id', athleteIds)

    const typedAthletes = (athletes ?? []) as AthleteRow[]
    const athleteMap = new Map(typedAthletes.map((a) => [a.id, a]))

    // Velilerin push subscription'larını al
    const parentUserIds = [...new Set(typedAthletes.filter((a) => a.parent_user_id).map((a) => a.parent_user_id!))]

    if (parentUserIds.length === 0) {
      return NextResponse.json({ ok: true, hatirlatilan: 0, mesaj: 'Veli bağlantısı olan sporcu yok' })
    }

    // Bildirim tercihlerini kontrol et
    const { data: allPrefs } = await service
      .from('notification_preferences')
      .select('user_id, odeme_hatirlatma')
      .in('user_id', parentUserIds)

    const prefsMap = new Map(
      ((allPrefs ?? []) as Array<{ user_id: string } & PreferenceRow>).map((p) => [p.user_id, p])
    )

    // Push subscription'ları getir
    const { data: allSubs } = await service
      .from('push_subscriptions')
      .select('user_id, endpoint, keys_p256dh, keys_auth')
      .in('user_id', parentUserIds)
      .eq('is_active', true)

    const subsMap = new Map<string, SubscriptionRow[]>()
    for (const sub of (allSubs ?? []) as Array<{ user_id: string } & SubscriptionRow>) {
      const list = subsMap.get(sub.user_id) ?? []
      list.push({ endpoint: sub.endpoint, keys_p256dh: sub.keys_p256dh, keys_auth: sub.keys_auth })
      subsMap.set(sub.user_id, list)
    }

    let gonderilen = 0
    let atlanan = 0
    const logRows: Array<{
      payment_id: string
      veli_user_id: string
      channel: string
      status: string
      error_message: string | null
      tenant_id: string | null
    }> = []

    for (const payment of typedPayments) {
      // Deduplication: son 3 günde zaten hatırlatma gönderilmişse atla
      if (recentlyRemindedIds.has(payment.id)) {
        atlanan++
        continue
      }

      const athlete = athleteMap.get(payment.athlete_id)
      if (!athlete?.parent_user_id) {
        atlanan++
        continue
      }

      const veliId = athlete.parent_user_id

      // Bildirim tercihi kontrolü
      const pref = prefsMap.get(veliId)
      if (pref && !pref.odeme_hatirlatma) {
        logRows.push({
          payment_id: payment.id,
          veli_user_id: veliId,
          channel: 'push',
          status: 'skipped',
          error_message: 'Kullanıcı ödeme hatırlatmayı devre dışı bırakmış',
          tenant_id: payment.tenant_id,
        })
        atlanan++
        continue
      }

      // Push bildirim gönder
      const subs = subsMap.get(veliId)
      if (!subs || subs.length === 0) {
        logRows.push({
          payment_id: payment.id,
          veli_user_id: veliId,
          channel: 'push',
          status: 'skipped',
          error_message: 'Aktif push aboneliği yok',
          tenant_id: payment.tenant_id,
        })
        atlanan++
        continue
      }

      const cocukAdi = [athlete.name, athlete.surname].filter(Boolean).join(' ')
      const gecikmisMi = payment.due_date < bugunStr
      const tutarStr = Number(payment.amount).toLocaleString('tr-TR')
      const dueDateStr = formatTarih(payment.due_date)

      const title = gecikmisMi ? 'Gecikmiş Aidat Hatırlatması' : 'Aidat Hatırlatması'
      const body = gecikmisMi
        ? `${cocukAdi} için ${tutarStr} TL tutarında ödemenizin son tarihi (${dueDateStr}) geçmiştir. Lütfen en kısa sürede ödeme yapınız.`
        : `${cocukAdi} için ${tutarStr} TL tutarında ödemenizin son tarihi: ${dueDateStr}. Veli panelinizden ödeme yapabilirsiniz.`

      let pushSent = false
      for (const sub of subs) {
        const pushSub: PushSubscriptionData = {
          endpoint: sub.endpoint,
          keys: { p256dh: sub.keys_p256dh, auth: sub.keys_auth },
        }

        const result = await sendPushNotification(pushSub, {
          title,
          body,
          notification_type: 'odeme_hatirlatma',
          url: '/veli/odeme',
        })

        if (result.ok) {
          pushSent = true
        } else {
          logRows.push({
            payment_id: payment.id,
            veli_user_id: veliId,
            channel: 'push',
            status: 'failed',
            error_message: result.error ?? 'Bilinmeyen hata',
            tenant_id: payment.tenant_id,
          })
        }
      }

      if (pushSent) {
        gonderilen++
        logRows.push({
          payment_id: payment.id,
          veli_user_id: veliId,
          channel: 'push',
          status: 'sent',
          error_message: null,
          tenant_id: payment.tenant_id,
        })
      } else {
        atlanan++
      }
    }

    // Log kayıtlarını yaz
    if (logRows.length > 0) {
      const { error: logErr } = await service.from('reminder_logs').insert(logRows)
      if (logErr) {
        console.error('[aidat-hatirlatma] Log kayıt hatası:', logErr.message)
      }
    }

    return NextResponse.json({
      ok: true,
      hatirlatilan: gonderilen,
      atlanan,
      toplam_odeme: typedPayments.length,
      tarih: bugunStr,
    })
  } catch (e) {
    console.error('[aidat-hatirlatma]', e)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
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
