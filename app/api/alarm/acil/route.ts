/**
 * POST /api/alarm/acil
 * Acil Destek Alarm Sistemi
 * 
 * Sistem hatasi veya guvenlik ihlali durumunda:
 *   - Patron'a email gonderir
 *   - Patron'a push bildirim gonderir
 *   - security_logs'a severity='acil' kaydeder
 * 
 * Body: { type: 'sistem_hatasi' | 'guvenlik_ihlali', message: string, details?: string, source?: string }
 * 
 * GET /api/alarm/acil
 * Son acil alarmlari listeler (patron dashboard banner icin)
 */

import { NextRequest, NextResponse } from 'next/server'
import { createSecurityLog } from '@/lib/db/security-logs'
import { sendEmail } from '@/lib/email/resend'
import { getUserSubscriptions } from '@/lib/db/push-subscriptions'
import { sendPushNotification, type PushSubscriptionData } from '@/lib/notifications/web-push'
import { getSupabaseServer } from '@/lib/supabase'
import { PATRON_EMAIL } from '@/lib/auth/roles'

export const dynamic = 'force-dynamic'

type AcilAlarmType = 'sistem_hatasi' | 'guvenlik_ihlali'

const VALID_TYPES: AcilAlarmType[] = ['sistem_hatasi', 'guvenlik_ihlali']

const ALARM_TYPE_LABELS: Record<AcilAlarmType, string> = {
  sistem_hatasi: 'Sistem Hatasi',
  guvenlik_ihlali: 'Guvenlik Ihlali',
}

// ─── POST: Acil alarm tetikle ─────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const type = body.type as AcilAlarmType
    const message = typeof body.message === 'string' ? body.message.trim() : ''
    const details = typeof body.details === 'string' ? body.details.trim() : undefined
    const source = typeof body.source === 'string' ? body.source.trim() : 'bilinmiyor'

    // Validasyon
    if (!VALID_TYPES.includes(type)) {
      return NextResponse.json(
        { error: `Gecersiz alarm tipi. Gecerli tipler: ${VALID_TYPES.join(', ')}` },
        { status: 400 }
      )
    }

    if (!message) {
      return NextResponse.json(
        { error: 'message alani zorunludur.' },
        { status: 400 }
      )
    }

    const tarih = new Date().toISOString()
    const alarmLabel = ALARM_TYPE_LABELS[type]

    // 1) security_logs'a kaydet (severity='acil')
    const logResult = await createSecurityLog({
      event_type: `acil_alarm_${type}`,
      severity: 'acil',
      description: `[ACIL ALARM] ${alarmLabel}: ${message}${details ? ` | Detay: ${details}` : ''} | Kaynak: ${source}`,
      blocked: type === 'guvenlik_ihlali',
    })

    // 2) Patron'a email gonder
    let emailSent = false
    try {
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #dc2626; color: white; padding: 20px; border-radius: 12px 12px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">&#x1F6A8; ACIL ALARM</h1>
            <p style="margin: 8px 0 0; opacity: 0.9;">${alarmLabel}</p>
          </div>
          <div style="background: #1e293b; color: #f8fafc; padding: 24px; border-radius: 0 0 12px 12px;">
            <div style="background: #0f172a; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
              <p style="margin: 0; font-size: 14px; color: #94a3b8;">Mesaj:</p>
              <p style="margin: 8px 0 0; font-size: 16px; font-weight: bold;">${message}</p>
            </div>
            ${details ? `
            <div style="background: #0f172a; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
              <p style="margin: 0; font-size: 14px; color: #94a3b8;">Detay:</p>
              <p style="margin: 8px 0 0; font-size: 14px;">${details}</p>
            </div>
            ` : ''}
            <div style="display: flex; gap: 16px; margin-top: 16px;">
              <div style="flex: 1; background: #0f172a; padding: 12px; border-radius: 8px;">
                <p style="margin: 0; font-size: 12px; color: #94a3b8;">Kaynak</p>
                <p style="margin: 4px 0 0; font-size: 14px;">${source}</p>
              </div>
              <div style="flex: 1; background: #0f172a; padding: 12px; border-radius: 8px;">
                <p style="margin: 0; font-size: 12px; color: #94a3b8;">Tarih</p>
                <p style="margin: 4px 0 0; font-size: 14px;">${new Date(tarih).toLocaleString('tr-TR')}</p>
              </div>
            </div>
            <p style="margin: 24px 0 0; font-size: 12px; color: #64748b; text-align: center;">
              Bu alarm YiSA-S Acil Destek Sistemi tarafindan otomatik gonderilmistir.
            </p>
          </div>
        </div>
      `

      const emailResult = await sendEmail(
        PATRON_EMAIL,
        `[ACIL ALARM] ${alarmLabel}: ${message.slice(0, 80)}`,
        emailHtml
      )
      emailSent = emailResult.ok
    } catch (emailErr) {
      console.error('[alarm/acil] Email gonderilemedi:', emailErr)
    }

    // 3) Patron'a push bildirim gonder
    let pushSent = 0
    try {
      // Patron kullanicisinin user_id'sini bul
      const db = getSupabaseServer()
      if (db) {
        const { data: patronUsers } = await db
          .from('auth_users_view')
          .select('id')
          .eq('email', PATRON_EMAIL)
          .limit(1)

        // Eger view yoksa, admin client ile auth'dan ara
        let patronUserId: string | undefined
        if (patronUsers && patronUsers.length > 0) {
          patronUserId = patronUsers[0].id
        } else {
          // Alternatif: user_tenants tablosundan patron rolunu bul
          const { data: patronFromTenants } = await db
            .from('user_tenants')
            .select('user_id')
            .eq('role', 'patron')
            .limit(1)

          if (patronFromTenants && patronFromTenants.length > 0) {
            patronUserId = patronFromTenants[0].user_id
          }
        }

        if (patronUserId) {
          const { data: subscriptions } = await getUserSubscriptions(patronUserId)
          if (subscriptions && subscriptions.length > 0) {
            for (const sub of subscriptions) {
              const pushSub: PushSubscriptionData = {
                endpoint: sub.endpoint,
                keys: {
                  p256dh: sub.keys_p256dh,
                  auth: sub.keys_auth,
                },
              }
              const result = await sendPushNotification(pushSub, {
                title: `ACIL ALARM: ${alarmLabel}`,
                body: message.slice(0, 200),
                notification_type: 'duyuru',
                url: '/patron',
              })
              if (result.ok) pushSent++
            }
          }
        }
      }
    } catch (pushErr) {
      console.error('[alarm/acil] Push bildirimi gonderilemedi:', pushErr)
    }

    return NextResponse.json({
      ok: true,
      alarm: {
        type,
        message,
        details,
        source,
        tarih,
        log_id: logResult.id,
      },
      bildirimler: {
        email: emailSent,
        push: pushSent,
      },
    })
  } catch (e) {
    const err = e instanceof Error ? e.message : String(e)
    console.error('[alarm/acil] Hata:', err)
    return NextResponse.json(
      { error: 'Acil alarm tetikleme hatasi', detail: err },
      { status: 500 }
    )
  }
}

// ─── GET: Son acil alarmlari listele (patron dashboard banner icin) ──────

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const limit = Math.min(Number(searchParams.get('limit')) || 10, 50)
    const spikeHours = Number(searchParams.get('hours')) || 24

    const db = getSupabaseServer()
    if (!db) {
      return NextResponse.json({ error: 'Supabase baglantisi yok' }, { status: 500 })
    }

    // Son X saat icindeki acil alarmlar
    const since = new Date(Date.now() - spikeHours * 60 * 60 * 1000).toISOString()

    const { data, error } = await db
      .from('security_logs')
      .select('id, event_type, severity, description, blocked, created_at')
      .eq('severity', 'acil')
      .gte('created_at', since)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const alarmlar = (data ?? []) as {
      id: string
      event_type: string
      severity: string
      description: string | null
      blocked: boolean
      created_at: string
    }[]

    return NextResponse.json({
      ok: true,
      acil_alarm_var: alarmlar.length > 0,
      toplam: alarmlar.length,
      alarmlar,
      kontrol_periyodu_saat: spikeHours,
    })
  } catch (e) {
    const err = e instanceof Error ? e.message : String(e)
    return NextResponse.json(
      { error: 'Acil alarm listesi hatasi', detail: err },
      { status: 500 }
    )
  }
}
