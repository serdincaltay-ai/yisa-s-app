/**
 * ManyChat Webhook — Lead'leri demo_requests'e yazar
 * ManyChat → External Request veya Webhook → POST /api/webhooks/manychat
 * Kaynak: source = 'manychat'
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

/** HMAC-SHA256 imza doğrulama (ManyChat webhook secret varsa) */
function verifySignature(payload: string, signature: string | null, secret: string | undefined): boolean {
  if (!secret || !signature) return true
  try {
    const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex')
    return crypto.timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expected, 'hex'))
  } catch {
    return false
  }
}

/** ManyChat payload'tan lead bilgisi çıkar */
function parseLead(body: unknown): { name: string; email: string; phone?: string; city?: string; notes?: string } | null {
  if (!body || typeof body !== 'object') return null
  const o = body as Record<string, unknown>
  const first = typeof o.first_name === 'string' ? o.first_name.trim() : ''
  const last = typeof o.last_name === 'string' ? o.last_name.trim() : ''
  const name = [first, last].filter(Boolean).join(' ') || (typeof o.name === 'string' ? o.name.trim() : '')
  const email = typeof o.email === 'string' ? o.email.trim() : ''
  const phone = typeof o.phone === 'string' ? o.phone.trim() : undefined
  const city = typeof o.city === 'string' ? o.city.trim() : undefined
  const notes = typeof o.notes === 'string' ? o.notes.trim() : undefined
  if (!name && !email) return null
  return { name: name || 'ManyChat Lead', email: email || 'manychat@lead.local', phone, city, notes }
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()
    const signature = req.headers.get('x-manychat-signature') ?? req.headers.get('x-signature')
    const secret = process.env.MANYCHAT_WEBHOOK_SECRET?.trim()

    let body: unknown
    try {
      body = rawBody ? JSON.parse(rawBody) : {}
    } catch {
      body = {}
    }

    if (secret && signature && !verifySignature(rawBody, signature, secret)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const lead = parseLead(body)
    if (!lead || !lead.email) {
      return NextResponse.json({ ok: false, error: 'Ad veya e-posta eksik.' }, { status: 400 })
    }

    const supabase = getSupabase()
    if (!supabase) {
      return NextResponse.json({ error: 'Sunucu yapılandırma hatası.' }, { status: 500 })
    }

    const { data, error } = await supabase
      .from('demo_requests')
      .insert({
        name: lead.name,
        email: lead.email,
        phone: lead.phone ?? null,
        city: lead.city ?? null,
        notes: lead.notes ?? null,
        facility_type: null,
        source: 'manychat',
      })
      .select('id')
      .single()

    if (error) {
      if (error.code === '23514') {
        return NextResponse.json(
          { ok: false, error: "demo_requests source 'manychat' henüz tanımlı değil. Migration çalıştırın." },
          { status: 400 }
        )
      }
      console.error('[manychat] Insert error:', error)
      return NextResponse.json({ error: 'Kayıt sırasında hata oluştu.' }, { status: 500 })
    }

    return NextResponse.json({ ok: true, id: data?.id })
  } catch (e) {
    console.error('[manychat] Error:', e)
    return NextResponse.json({ error: 'Sunucu hatası.' }, { status: 500 })
  }
}
