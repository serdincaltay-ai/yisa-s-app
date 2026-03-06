import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

/**
 * POST /api/notifications/subscribe
 * Registers a push subscription for the authenticated user.
 *
 * Body: {
 *   subscription: PushSubscription (endpoint, keys.p256dh, keys.auth)
 *   tenant_id?: string
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const subscription = body.subscription
    const tenantId = typeof body.tenant_id === 'string' ? body.tenant_id : null

    if (
      !subscription ||
      typeof subscription.endpoint !== 'string' ||
      !subscription.keys?.p256dh ||
      !subscription.keys?.auth
    ) {
      return NextResponse.json(
        { error: 'Gecersiz subscription nesnesi. endpoint, keys.p256dh ve keys.auth gerekli.' },
        { status: 400 }
      )
    }

    // Identify the user via Supabase auth cookie
    const supabase = getSupabase()
    if (!supabase) {
      return NextResponse.json({ error: 'Sunucu yapilandirma hatasi.' }, { status: 500 })
    }

    // Extract user from auth header or cookie
    const authHeader = req.headers.get('authorization')
    let userId: string | null = null

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.slice(7)
      const { data } = await supabase.auth.getUser(token)
      userId = data?.user?.id ?? null
    }

    // Allow anonymous subscriptions with a client-provided user_id fallback
    if (!userId && typeof body.user_id === 'string') {
      userId = body.user_id
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'Kimlik dogrulanamadi. Oturum acik olmali.' },
        { status: 401 }
      )
    }

    // Upsert: same endpoint = update, new endpoint = insert
    const { data: existing } = await supabase
      .from('push_subscriptions')
      .select('id')
      .eq('endpoint', subscription.endpoint)
      .eq('user_id', userId)
      .maybeSingle()

    if (existing) {
      // Update existing subscription
      await supabase
        .from('push_subscriptions')
        .update({
          keys_p256dh: subscription.keys.p256dh,
          keys_auth: subscription.keys.auth,
          is_active: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
    } else {
      // Insert new subscription
      const { error: insertErr } = await supabase.from('push_subscriptions').insert({
        user_id: userId,
        tenant_id: tenantId,
        endpoint: subscription.endpoint,
        keys_p256dh: subscription.keys.p256dh,
        keys_auth: subscription.keys.auth,
        is_active: true,
      })

      if (insertErr) {
        console.error('[notifications/subscribe] Insert error:', insertErr)
        return NextResponse.json({ error: 'Abonelik kaydi sirasinda hata.' }, { status: 500 })
      }
    }

    return NextResponse.json({ ok: true, message: 'Push aboneligi kaydedildi.' })
  } catch (e) {
    console.error('[notifications/subscribe] Error:', e)
    return NextResponse.json({ error: 'Sunucu hatasi.' }, { status: 500 })
  }
}

/**
 * DELETE /api/notifications/subscribe
 * Removes a push subscription.
 *
 * Body: { endpoint: string }
 */
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json()
    const endpoint = typeof body.endpoint === 'string' ? body.endpoint : null

    if (!endpoint) {
      return NextResponse.json({ error: 'endpoint gerekli.' }, { status: 400 })
    }

    const supabase = getSupabase()
    if (!supabase) {
      return NextResponse.json({ error: 'Sunucu yapilandirma hatasi.' }, { status: 500 })
    }

    // Soft-delete: mark as inactive
    await supabase
      .from('push_subscriptions')
      .update({ is_active: false })
      .eq('endpoint', endpoint)

    return NextResponse.json({ ok: true, message: 'Push aboneligi kaldirildi.' })
  } catch (e) {
    console.error('[notifications/subscribe] DELETE error:', e)
    return NextResponse.json({ error: 'Sunucu hatasi.' }, { status: 500 })
  }
}
