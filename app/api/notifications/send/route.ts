import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { configureWebPush } from '@/lib/notifications/vapid'
import type { NotificationType } from '@/lib/notifications/types'

export const dynamic = 'force-dynamic'

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

const VALID_TYPES: NotificationType[] = ['yoklama_sonucu', 'odeme_hatirlatma', 'duyuru']

/**
 * POST /api/notifications/send
 * Send push notifications to subscribed users.
 *
 * Body: {
 *   type: NotificationType
 *   title: string
 *   body: string
 *   url?: string
 *   user_ids?: string[]   — target specific users (empty = all in tenant)
 *   tenant_id?: string
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const type = body.type as NotificationType
    const title = typeof body.title === 'string' ? body.title.trim() : ''
    const notifBody = typeof body.body === 'string' ? body.body.trim() : ''
    const url = typeof body.url === 'string' ? body.url : '/veli/dashboard'
    const userIds = Array.isArray(body.user_ids) ? body.user_ids : []
    const tenantId = typeof body.tenant_id === 'string' ? body.tenant_id : null

    // Validate
    if (!type || !VALID_TYPES.includes(type)) {
      return NextResponse.json(
        { error: `Gecersiz bildirim turu. Gecerli turler: ${VALID_TYPES.join(', ')}` },
        { status: 400 }
      )
    }
    if (!title || !notifBody) {
      return NextResponse.json(
        { error: 'title ve body alanlari zorunludur.' },
        { status: 400 }
      )
    }

    // Configure web-push
    const wp = configureWebPush()
    if (!wp) {
      return NextResponse.json(
        { error: 'VAPID anahtarlari yapilandirilmamis. NEXT_PUBLIC_VAPID_PUBLIC_KEY ve VAPID_PRIVATE_KEY env gerekli.' },
        { status: 500 }
      )
    }

    const supabase = getSupabase()
    if (!supabase) {
      return NextResponse.json({ error: 'Sunucu yapilandirma hatasi.' }, { status: 500 })
    }

    // Fetch active push subscriptions
    let query = supabase
      .from('push_subscriptions')
      .select('id, user_id, endpoint, keys_p256dh, keys_auth')
      .eq('is_active', true)

    if (userIds.length > 0) {
      query = query.in('user_id', userIds)
    }
    if (tenantId) {
      query = query.eq('tenant_id', tenantId)
    }

    const { data: subscriptions, error: fetchErr } = await query.limit(500)

    if (fetchErr) {
      console.error('[notifications/send] Fetch subscriptions error:', fetchErr)
      return NextResponse.json({ error: 'Abonelik verileri alinamadi.' }, { status: 500 })
    }

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({ ok: true, sent: 0, message: 'Aktif abonelik bulunamadi.' })
    }

    // Check user notification preferences
    const subscriberUserIds = [...new Set(subscriptions.map((s) => s.user_id))]
    const { data: prefs } = await supabase
      .from('notification_preferences')
      .select('user_id, yoklama_sonucu, odeme_hatirlatma, duyuru')
      .in('user_id', subscriberUserIds)

    const prefsMap = new Map<string, Record<string, boolean>>()
    if (prefs) {
      for (const p of prefs) {
        prefsMap.set(p.user_id, p)
      }
    }

    // Filter out users who disabled this notification type
    const filteredSubs = subscriptions.filter((sub) => {
      const userPrefs = prefsMap.get(sub.user_id)
      // If no preferences found, default to all enabled
      if (!userPrefs) return true
      return userPrefs[type] !== false
    })

    // Prepare push payload
    const payload = JSON.stringify({
      type,
      title,
      body: notifBody,
      url,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
    })

    // Send to all filtered subscriptions
    let sent = 0
    let failed = 0
    const expiredEndpoints: string[] = []

    const results = await Promise.allSettled(
      filteredSubs.map(async (sub) => {
        const pushSub = {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.keys_p256dh,
            auth: sub.keys_auth,
          },
        }

        try {
          await wp.sendNotification(pushSub, payload)
          sent++
        } catch (err: unknown) {
          const statusCode = (err as { statusCode?: number })?.statusCode
          if (statusCode === 410 || statusCode === 404) {
            // Subscription expired or invalid — mark inactive
            expiredEndpoints.push(sub.endpoint)
          }
          failed++
        }
      })
    )

    // Clean up expired subscriptions
    if (expiredEndpoints.length > 0) {
      await supabase
        .from('push_subscriptions')
        .update({ is_active: false })
        .in('endpoint', expiredEndpoints)
    }

    // Log the notification send
    await supabase.from('notification_logs').insert({
      type,
      title,
      body: notifBody,
      url,
      tenant_id: tenantId,
      target_user_ids: userIds.length > 0 ? userIds : null,
      total_subscriptions: filteredSubs.length,
      sent_count: sent,
      failed_count: failed,
      expired_count: expiredEndpoints.length,
    })

    return NextResponse.json({
      ok: true,
      sent,
      failed,
      expired: expiredEndpoints.length,
      total: filteredSubs.length,
    })
  } catch (e) {
    console.error('[notifications/send] Error:', e)
    return NextResponse.json({ error: 'Sunucu hatasi.' }, { status: 500 })
  }
}
