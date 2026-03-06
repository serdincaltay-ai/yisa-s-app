/**
 * POST /api/notifications/subscribe
 * Push notification aboneliği kaydet
 * DELETE /api/notifications/subscribe
 * Push notification aboneliğini sil
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/api-auth'
import {
  upsertPushSubscription,
  deletePushSubscription,
} from '@/lib/db/push-subscriptions'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth()
    if (auth instanceof NextResponse) return auth

    const body = await req.json()

    const endpoint = typeof body.endpoint === 'string' ? body.endpoint.trim() : ''
    const p256dh = typeof body.keys?.p256dh === 'string' ? body.keys.p256dh : ''
    const authKey = typeof body.keys?.auth === 'string' ? body.keys.auth : ''

    if (!endpoint || !p256dh || !authKey) {
      return NextResponse.json(
        { error: 'Geçersiz subscription verisi. endpoint, keys.p256dh ve keys.auth gerekli.' },
        { status: 400 }
      )
    }

    const result = await upsertPushSubscription({
      user_id: auth.user.id,
      endpoint,
      keys_p256dh: p256dh,
      keys_auth: authKey,
    })

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({ ok: true, id: result.id })
  } catch (e) {
    const err = e instanceof Error ? e.message : String(e)
    return NextResponse.json(
      { error: 'Abonelik kaydı hatası', detail: err },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = await requireAuth()
    if (auth instanceof NextResponse) return auth

    const body = await req.json()
    const endpoint = typeof body.endpoint === 'string' ? body.endpoint.trim() : ''

    if (!endpoint) {
      return NextResponse.json(
        { error: 'endpoint alanı gerekli.' },
        { status: 400 }
      )
    }

    const result = await deletePushSubscription(endpoint, auth.user.id)

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    const err = e instanceof Error ? e.message : String(e)
    return NextResponse.json(
      { error: 'Abonelik silme hatası', detail: err },
      { status: 500 }
    )
  }
}
