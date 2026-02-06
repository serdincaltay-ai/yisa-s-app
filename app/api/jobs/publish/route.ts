/**
 * POST /api/jobs/publish
 * Onaylanmış işi mağazaya yayınla
 * V3.0 Mimari: Bölüm 1.6 (Mağaza)
 */

import { NextRequest, NextResponse } from 'next/server'
import { requirePatronOrFlow } from '@/lib/auth/api-auth'
import { publishJobToStore, getJobById, addJobLog } from '@/lib/db/robot-jobs'
import { insertAuditLog } from '@/lib/db/ceo-celf'

export async function POST(req: NextRequest) {
  try {
    const auth = await requirePatronOrFlow()
    if (auth instanceof NextResponse) return auth

    const body = await req.json()
    const { job_id, category, price_cents } = body

    if (!job_id || !category) {
      return NextResponse.json({ error: 'job_id ve category zorunludur.' }, { status: 400 })
    }

    const validCategories = ['sablon', 'robot', 'paket', 'icerik', 'hizmet']
    if (!validCategories.includes(category)) {
      return NextResponse.json({
        error: `Geçerli kategoriler: ${validCategories.join(', ')}`,
      }, { status: 400 })
    }

    // İş onaylanmış mı kontrol et
    const { data: job, error: jobError } = await getJobById(job_id)
    if (jobError || !job) {
      return NextResponse.json({ error: jobError ?? 'İş bulunamadı.' }, { status: 404 })
    }

    if (job.status !== 'approved' && job.status !== 'published') {
      return NextResponse.json({
        error: `Sadece onaylanmış işler mağazaya yayınlanabilir. Mevcut durum: ${job.status}`,
      }, { status: 400 })
    }

    const { product_id, error: publishError } = await publishJobToStore(job_id, {
      category,
      price_cents: price_cents ?? 0,
    })

    if (publishError) {
      return NextResponse.json({ error: publishError }, { status: 500 })
    }

    await addJobLog({
      job_id,
      action: 'published',
      actor: 'PATRON',
      details: { product_id, category, price_cents },
    })

    await insertAuditLog({
      action: 'job_published_to_store',
      entity_type: 'store_product',
      entity_id: product_id,
      user_id: auth.user.id,
      payload: { job_id, category, ticket_no: job.ticket_no },
    })

    return NextResponse.json({
      ok: true,
      product_id,
      message: `İş mağazaya yayınlandı. Ticket: ${job.ticket_no}`,
    })
  } catch (e) {
    return NextResponse.json(
      { error: 'Yayınlama hatası', detail: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    )
  }
}
