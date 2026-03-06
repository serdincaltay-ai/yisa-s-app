/**
 * POST /api/sms/send
 * Manuel SMS gönderimi — sadece Patron veya yetkili roller
 * Body: { to: string, message: string, trigger_type?: string }
 */

import { NextRequest, NextResponse } from 'next/server'
import { requirePatronOrFlow } from '@/lib/auth/api-auth'
import { sendSMS, isSmsConfigured } from '@/lib/sms/provider'
import { getTenantIdWithFallback } from '@/lib/franchise-tenant'

export const dynamic = 'force-dynamic'

const MAX_MESSAGE_LEN = 480 // SMS segment sınırı (Türkçe karakter ile ~2 segment)

export async function POST(req: NextRequest) {
  try {
    const auth = await requirePatronOrFlow()
    if (auth instanceof NextResponse) return auth

    if (!isSmsConfigured()) {
      return NextResponse.json(
        { error: 'SMS servisi yapılandırılmamış. TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN ve TWILIO_PHONE_NUMBER gerekli.' },
        { status: 503 }
      )
    }

    const tenantId = await getTenantIdWithFallback(auth.user.id, req)

    const body = await req.json()
    const to = typeof body.to === 'string' ? body.to.trim() : ''
    const message = typeof body.message === 'string' ? body.message.trim() : ''
    const triggerType = typeof body.trigger_type === 'string' ? body.trigger_type : 'manual'

    if (!to) {
      return NextResponse.json({ error: 'Telefon numarası (to) gerekli.' }, { status: 400 })
    }

    if (!message) {
      return NextResponse.json({ error: 'Mesaj içeriği (message) gerekli.' }, { status: 400 })
    }

    if (message.length > MAX_MESSAGE_LEN) {
      return NextResponse.json(
        { error: `Mesaj çok uzun. Maksimum ${MAX_MESSAGE_LEN} karakter.` },
        { status: 400 }
      )
    }

    const result = await sendSMS(to, message, {
      tenant_id: tenantId ?? undefined,
      trigger_type: triggerType,
    })

    if (result.ok) {
      return NextResponse.json({ ok: true, sid: result.sid })
    }

    return NextResponse.json({ error: result.error ?? 'SMS gönderilemedi' }, { status: 500 })
  } catch (e) {
    console.error('[api/sms/send]', e)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
