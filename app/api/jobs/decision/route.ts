/**
 * POST /api/jobs/decision
 * Patron Karar Endpoint'i — Onayla / Reddet / Düzeltme Gönder
 * V3.0 Mimari: Bölüm 2.2 (10'a Çıkart Havuzu)
 *
 * Akış:
 *  - approved → Mağazaya/Deploy'a gönderilir (otomatik)
 *  - rejected → İş reddedilir, arşivlenir
 *  - correction → CELF'e düzeltme notu ile geri gönderilir, yeniden üretim başlar
 */

import { NextRequest, NextResponse } from 'next/server'
import { requirePatronOrFlow } from '@/lib/auth/api-auth'
import { setPatronDecision, addJobLog, getJobById, publishJobToStore } from '@/lib/db/robot-jobs'
import { regenerateJob } from '@/lib/robots/job-generator'
import { insertAuditLog } from '@/lib/db/ceo-celf'

export async function POST(req: NextRequest) {
  try {
    const auth = await requirePatronOrFlow()
    if (auth instanceof NextResponse) return auth

    const body = await req.json()
    const { job_id, decision, notes, store_category, store_price_cents } = body

    if (!job_id || !decision) {
      return NextResponse.json({ error: 'job_id ve decision zorunludur.' }, { status: 400 })
    }

    const validDecisions = ['approved', 'rejected', 'correction']
    if (!validDecisions.includes(decision)) {
      return NextResponse.json({ error: 'decision: approved, rejected veya correction olmalı.' }, { status: 400 })
    }

    // İşi kontrol et
    const { data: job, error: jobError } = await getJobById(job_id)
    if (jobError || !job) {
      return NextResponse.json({ error: jobError ?? 'İş bulunamadı.' }, { status: 404 })
    }

    if (job.status !== 'ceo_pool') {
      return NextResponse.json({
        error: `Bu iş şu anda CEO havuzunda değil. Mevcut durum: ${job.status}`,
      }, { status: 400 })
    }

    // Kararı kaydet
    const { error: decisionError } = await setPatronDecision(job_id, decision, notes)
    if (decisionError) {
      return NextResponse.json({ error: decisionError }, { status: 500 })
    }

    // Log: Patron kararı
    await addJobLog({
      job_id,
      action: decision,
      actor: 'PATRON',
      details: { notes, user_email: auth.user.email },
    })

    // Audit log
    await insertAuditLog({
      action: `job_${decision}`,
      entity_type: 'robot_job',
      entity_id: job_id,
      user_id: auth.user.id,
      payload: { ticket_no: job.ticket_no, decision, notes },
    })

    // ─── Onay → Mağazaya yayınla (otomatik) ─────────────
    if (decision === 'approved') {
      // Eğer mağaza kategorisi belirtildiyse mağazaya yayınla
      if (store_category) {
        const { product_id, error: publishError } = await publishJobToStore(job_id, {
          category: store_category,
          price_cents: store_price_cents,
        })

        if (publishError) {
          return NextResponse.json({
            ok: true,
            decision,
            message: `İş onaylandı ama mağaza yayınında hata: ${publishError}`,
            job_id,
          })
        }

        await addJobLog({
          job_id,
          action: 'published',
          actor: 'SYSTEM',
          details: { product_id, store_category },
        })

        return NextResponse.json({
          ok: true,
          decision,
          message: `İş onaylandı ve mağazaya yayınlandı. Ticket: ${job.ticket_no}`,
          job_id,
          product_id,
        })
      }

      return NextResponse.json({
        ok: true,
        decision,
        message: `İş onaylandı. Ticket: ${job.ticket_no}`,
        job_id,
      })
    }

    // ─── Red → Arşivle ──────────────────────────────────
    if (decision === 'rejected') {
      return NextResponse.json({
        ok: true,
        decision,
        message: `İş reddedildi. Ticket: ${job.ticket_no}`,
        job_id,
      })
    }

    // ─── Düzeltme → CELF'e geri gönder, yeniden üret ────
    if (decision === 'correction') {
      if (!notes || notes.trim().length === 0) {
        return NextResponse.json({
          error: 'Düzeltme kararı için notes (düzeltme notu) zorunludur.',
        }, { status: 400 })
      }

      // Yeniden üretimi tetikle (arka planda)
      const regenResult = await regenerateJob(job_id, notes)

      return NextResponse.json({
        ok: true,
        decision,
        message: `Düzeltme notu CELF'e gönderildi. Yeni iş üretiliyor. Ticket: ${job.ticket_no}`,
        job_id,
        new_job_id: regenResult.job_id,
        new_ticket_no: regenResult.ticket_no,
      })
    }

    return NextResponse.json({ ok: true, decision, job_id })
  } catch (e) {
    return NextResponse.json(
      { error: 'Karar hatası', detail: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    )
  }
}
