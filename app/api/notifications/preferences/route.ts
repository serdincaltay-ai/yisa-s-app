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
 * GET /api/notifications/preferences?user_id=xxx
 * Returns notification preferences for a user.
 */
export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('user_id')
    if (!userId) {
      return NextResponse.json({ error: 'user_id parametresi gerekli.' }, { status: 400 })
    }

    const supabase = getSupabase()
    if (!supabase) {
      return NextResponse.json({ error: 'Sunucu yapilandirma hatasi.' }, { status: 500 })
    }

    const { data, error } = await supabase
      .from('notification_preferences')
      .select('user_id, yoklama_sonucu, odeme_hatirlatma, duyuru')
      .eq('user_id', userId)
      .maybeSingle()

    if (error) {
      console.error('[notifications/preferences] GET error:', error)
      return NextResponse.json({ error: 'Tercihler alinamadi.' }, { status: 500 })
    }

    // Return defaults if no preferences found
    const preferences = data ?? {
      user_id: userId,
      yoklama_sonucu: true,
      odeme_hatirlatma: true,
      duyuru: true,
    }

    return NextResponse.json({ preferences })
  } catch (e) {
    console.error('[notifications/preferences] Error:', e)
    return NextResponse.json({ error: 'Sunucu hatasi.' }, { status: 500 })
  }
}

/**
 * POST /api/notifications/preferences
 * Save/update notification preferences for a user.
 *
 * Body: {
 *   user_id: string
 *   yoklama_sonucu: boolean
 *   odeme_hatirlatma: boolean
 *   duyuru: boolean
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const userId = typeof body.user_id === 'string' ? body.user_id : null

    if (!userId) {
      return NextResponse.json({ error: 'user_id gerekli.' }, { status: 400 })
    }

    const supabase = getSupabase()
    if (!supabase) {
      return NextResponse.json({ error: 'Sunucu yapilandirma hatasi.' }, { status: 500 })
    }

    const prefs = {
      user_id: userId,
      yoklama_sonucu: body.yoklama_sonucu !== false,
      odeme_hatirlatma: body.odeme_hatirlatma !== false,
      duyuru: body.duyuru !== false,
      updated_at: new Date().toISOString(),
    }

    // Upsert: insert if not exists, update if exists
    const { error } = await supabase
      .from('notification_preferences')
      .upsert(prefs, { onConflict: 'user_id' })

    if (error) {
      console.error('[notifications/preferences] POST error:', error)
      return NextResponse.json({ error: 'Tercihler kaydedilemedi.' }, { status: 500 })
    }

    return NextResponse.json({ ok: true, message: 'Bildirim tercihleri kaydedildi.' })
  } catch (e) {
    console.error('[notifications/preferences] Error:', e)
    return NextResponse.json({ error: 'Sunucu hatasi.' }, { status: 500 })
  }
}
