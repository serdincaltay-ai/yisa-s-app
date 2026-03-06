/**
 * GET /api/notifications/preferences — Bildirim tercihlerini getir
 * POST /api/notifications/preferences — Bildirim tercihlerini güncelle
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/api-auth'
import {
  getNotificationPreferences,
  upsertNotificationPreferences,
} from '@/lib/db/push-subscriptions'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const auth = await requireAuth()
    if (auth instanceof NextResponse) return auth

    const { data, error } = await getNotificationPreferences(auth.user.id)

    if (error) {
      return NextResponse.json({ error }, { status: 500 })
    }

    return NextResponse.json({ ok: true, preferences: data })
  } catch (e) {
    const err = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ error: 'Tercih getirme hatası', detail: err }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth()
    if (auth instanceof NextResponse) return auth

    const body = await req.json()

    const yoklama = body.yoklama_sonucu !== false
    const odeme = body.odeme_hatirlama !== false
    const duyuru = body.duyuru !== false

    const result = await upsertNotificationPreferences({
      user_id: auth.user.id,
      yoklama_sonucu: yoklama,
      odeme_hatirlama: odeme,
      duyuru: duyuru,
    })

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({
      ok: true,
      preferences: { yoklama_sonucu: yoklama, odeme_hatirlama: odeme, duyuru: duyuru },
    })
  } catch (e) {
    const err = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ error: 'Tercih güncelleme hatası', detail: err }, { status: 500 })
  }
}
