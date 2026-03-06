/**
 * GET /api/coo/aidat-hatirlatma
 * Cron ile gunluk 09:00 UTC'de cagrilir.
 *
 * payments tablosundan status='pending' ve due_date < bugun + 7 gun olanlari bulur.
 * Her biri icin veliye push notification + email gonderir.
 * reminder_logs tablosuna kayit yazar.
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServer } from '@/lib/supabase'
import { getUserSubscriptions } from '@/lib/db/push-subscriptions'
import {
  sendPushNotification,
  type PushSubscriptionData,
} from '@/lib/notifications/web-push'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

interface PendingPayment {
  id: string
  athlete_id: string
  amount: number
  due_date: string
  tenant_id: string
  athlete: {
    name: string
    surname: string | null
    parent_user_id: string | null
    parent_email: string | null
  } | null
}

export async function GET(req: NextRequest) {
  try {
    // Cron secret dogrulamasi (varsa)
    const cronSecret = process.env.CRON_SECRET?.trim()
    if (cronSecret) {
      const auth = req.headers.get('authorization')
      if (auth !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    const db = getSupabaseServer()
    if (!db) {
      return NextResponse.json({ error: 'Supabase baglantisi yok' }, { status: 500 })
    }

    // Bugun + 7 gun
    const now = new Date()
    const sevenDaysLater = new Date(now)
    sevenDaysLater.setDate(sevenDaysLater.getDate() + 7)
    const cutoffDate = sevenDaysLater.toISOString().split('T')[0] // YYYY-MM-DD

    // Pending odemeler — due_date <= bugun + 7 gun
    const { data: payments, error: payErr } = await db
      .from('payments')
      .select(`
        id,
        athlete_id,
        amount,
        due_date,
        tenant_id,
        athlete:athletes!inner(name, surname, parent_user_id, parent_email)
      `)
      .eq('status', 'pending')
      .lte('due_date', cutoffDate)
      .order('due_date', { ascending: true })

    if (payErr) {
      return NextResponse.json({ error: 'Odeme sorgulama hatasi', detail: payErr.message }, { status: 500 })
    }

    if (!payments || payments.length === 0) {
      return NextResponse.json({ ok: true, message: 'Hatirlatilacak odeme yok.', sent: 0 })
    }

    const results: {
      payment_id: string
      athlete: string
      push: boolean
      email: boolean
    }[] = []

    for (const raw of payments) {
      const payment = raw as unknown as PendingPayment
      const athlete = payment.athlete
      if (!athlete || !athlete.parent_user_id) continue

      const veliUserId = athlete.parent_user_id
      const athleteName = [athlete.name, athlete.surname].filter(Boolean).join(' ')
      const formattedAmount = Number(payment.amount).toLocaleString('tr-TR', { minimumFractionDigits: 2 })
      const dueDate = payment.due_date

      // --- Push Notification ---
      let pushSent = false
      try {
        const { data: subs } = await getUserSubscriptions(veliUserId)
        if (subs && subs.length > 0) {
          for (const sub of subs) {
            const pushSub: PushSubscriptionData = {
              endpoint: sub.endpoint,
              keys: {
                p256dh: sub.keys_p256dh,
                auth: sub.keys_auth,
              },
            }
            const res = await sendPushNotification(pushSub, {
              title: 'Aidat Hatirlatma',
              body: `${athleteName} icin ${formattedAmount} TL tutarindaki aidat odemesinin son tarihi: ${dueDate}`,
              notification_type: 'odeme_hatirlatma',
              url: '/veli/dashboard',
            })
            if (res.ok) pushSent = true
          }
        }
      } catch {
        // Push hatasi sessizce atlanir, email denenir
      }

      // Push log
      if (pushSent) {
        await db.from('reminder_logs').insert({
          payment_id: payment.id,
          veli_user_id: veliUserId,
          channel: 'push',
        })
      }

      // --- Email Notification ---
      let emailSent = false
      const veliEmail = athlete.parent_email
      if (veliEmail) {
        try {
          emailSent = await sendReminderEmail({
            to: veliEmail,
            athleteName,
            amount: formattedAmount,
            dueDate,
          })
        } catch {
          // Email hatasi sessizce atlanir
        }
      }

      // Email log
      if (emailSent) {
        await db.from('reminder_logs').insert({
          payment_id: payment.id,
          veli_user_id: veliUserId,
          channel: 'email',
        })
      }

      results.push({
        payment_id: payment.id,
        athlete: athleteName,
        push: pushSent,
        email: emailSent,
      })
    }

    const pushCount = results.filter((r) => r.push).length
    const emailCount = results.filter((r) => r.email).length

    return NextResponse.json({
      ok: true,
      message: `${results.length} odeme islendi. Push: ${pushCount}, Email: ${emailCount}`,
      sent: results.length,
      push_sent: pushCount,
      email_sent: emailCount,
      details: results,
    })
  } catch (e) {
    const err = e instanceof Error ? e.message : String(e)
    return NextResponse.json(
      { error: 'Aidat hatirlatma hatasi', detail: err },
      { status: 500 }
    )
  }
}

// ---------------------------------------------------------------------------
// Email gonderim helper'i
// Supabase Auth admin API veya harici email servisi entegrasyonu buraya eklenir.
// Su an icin basit bir SMTP/Resend/SendGrid entegrasyonu yoksa log birakir.
// ---------------------------------------------------------------------------
async function sendReminderEmail(params: {
  to: string
  athleteName: string
  amount: string
  dueDate: string
}): Promise<boolean> {
  const resendApiKey = process.env.RESEND_API_KEY
  if (!resendApiKey) {
    console.log(
      `[AidatHatirlatma] Email gonderilecek: ${params.to} — ${params.athleteName} — ${params.amount} TL — Son tarih: ${params.dueDate} (RESEND_API_KEY tanimli degil, atlanıyor)`
    )
    return false
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${resendApiKey}`,
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL ?? 'YiSA-S <bildirim@yisa-s.com>',
      to: [params.to],
      subject: `Aidat Hatirlatma — ${params.athleteName}`,
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;">
          <h2 style="color:#1a1a2e;">Aidat Hatirlatma</h2>
          <p>Sayın Veli,</p>
          <p><strong>${params.athleteName}</strong> icin <strong>${params.amount} TL</strong> tutarindaki aidat odemesinin son tarihi <strong>${params.dueDate}</strong> olarak belirlenmistir.</p>
          <p>Lutfen odemenizi zamaninda yapiniz.</p>
          <hr style="border:none;border-top:1px solid #eee;margin:24px 0;"/>
          <p style="font-size:12px;color:#888;">Bu bildirim YiSA-S sistemi tarafindan otomatik gonderilmistir.</p>
        </div>
      `,
    }),
  })

  return res.ok
}
