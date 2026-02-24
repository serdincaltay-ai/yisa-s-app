import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

/**
 * Veli–antrenör mesajlaşma: konuşma listesi ve mesajlar.
 * İleride tenant_veli_conversations / tenant_veli_messages tabloları ile doldurulacak.
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Giriş gerekli' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const threadId = searchParams.get('thread_id')

    if (threadId) {
      // Tek konuşma mesajları (şimdilik boş)
      return NextResponse.json({ messages: [], thread: null })
    }

    // Konuşma listesi (veli = parent_user_id ile eşleşen çocukların antrenörleri; şimdilik boş)
    return NextResponse.json({ threads: [] })
  } catch (e) {
    console.error('[veli/messages GET]', e)
    return NextResponse.json({ threads: [], messages: [] })
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Giriş gerekli' }, { status: 401 })

    const body = await req.json()
    const thread_id = body.thread_id as string | undefined
    const message = typeof body.message === 'string' ? body.message.trim() : ''
    if (!message) return NextResponse.json({ error: 'Mesaj metni zorunludur' }, { status: 400 })

    // İleride: tenant_veli_messages tablosuna insert
    return NextResponse.json({ ok: true, message: 'Mesaj gönderimi ileride aktif olacak' })
  } catch (e) {
    console.error('[veli/messages POST]', e)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
