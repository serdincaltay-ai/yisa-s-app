/**
 * POST /api/jobs/generate
 * CELF İş Üretim Endpoint'i — Robot iş üretir, CEO havuzuna gönderir
 * V3.0 Mimari: Bölüm 1.5 + Bölüm 4
 */

import { NextRequest, NextResponse } from 'next/server'
import { requirePatronOrFlow } from '@/lib/auth/api-auth'
import { generateJob, type JobGenerationRequest } from '@/lib/robots/job-generator'
import { insertAuditLog } from '@/lib/db/ceo-celf'

export async function POST(req: NextRequest) {
  try {
    const auth = await requirePatronOrFlow()
    if (auth instanceof NextResponse) return auth

    const body = await req.json()
    const { command, director_key, job_type, priority, tenant_id, target_audience } = body

    if (!command || typeof command !== 'string' || command.trim().length === 0) {
      return NextResponse.json({ error: 'command (görev açıklaması) zorunludur.' }, { status: 400 })
    }

    const request: JobGenerationRequest = {
      command: command.trim(),
      director_key: director_key ?? undefined,
      job_type: job_type ?? undefined,
      priority: priority ?? 'normal',
      tenant_id: tenant_id ?? undefined,
      target_audience: target_audience ?? 'all',
    }

    const result = await generateJob(request)

    // Audit log
    await insertAuditLog({
      action: 'job_generated',
      entity_type: 'robot_job',
      entity_id: result.job_id,
      user_id: auth.user.id,
      payload: {
        command: command.slice(0, 200),
        director_key,
        success: result.success,
        ticket_no: result.ticket_no,
      },
    })

    if (!result.success) {
      return NextResponse.json({
        ok: false,
        error: result.error,
        job_id: result.job_id,
        ticket_no: result.ticket_no,
      }, { status: result.job_id ? 200 : 500 })
    }

    return NextResponse.json({
      ok: true,
      job_id: result.job_id,
      ticket_no: result.ticket_no,
      status: result.status,
      output_preview: result.output_preview,
      message: `İş üretildi ve CEO havuzuna gönderildi. Ticket: ${result.ticket_no}`,
    })
  } catch (e) {
    return NextResponse.json(
      { error: 'İş üretim hatası', detail: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    )
  }
}
