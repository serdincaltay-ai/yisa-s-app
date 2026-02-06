/**
 * GET /api/jobs/ceo-pool
 * CEO Havuzu (10'a Çıkart) — Patronun inceleyeceği tamamlanmış işler
 * V3.0 Mimari: Bölüm 2.2
 */

import { NextRequest, NextResponse } from 'next/server'
import { requirePatronOrFlow } from '@/lib/auth/api-auth'
import { getCeoPoolJobs, getApprovedJobs, getJobStats } from '@/lib/db/robot-jobs'

export async function GET(req: NextRequest) {
  try {
    const auth = await requirePatronOrFlow()
    if (auth instanceof NextResponse) return auth

    const { searchParams } = new URL(req.url)
    const includeApproved = searchParams.get('include_approved') === 'true'
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100)

    // CEO havuzundaki bekleyen işler
    const { data: poolJobs, error: poolError } = await getCeoPoolJobs(limit)
    if (poolError) {
      return NextResponse.json({ error: poolError }, { status: 500 })
    }

    // İstatistikler
    const { data: stats } = await getJobStats()

    // Onaylanan işler (hatırlatma — kenarda durur)
    let approvedJobs: typeof poolJobs = []
    if (includeApproved) {
      const { data } = await getApprovedJobs(10)
      approvedJobs = data ?? []
    }

    return NextResponse.json({
      ok: true,
      pool: poolJobs ?? [],
      pool_count: poolJobs?.length ?? 0,
      approved_reminder: approvedJobs,
      stats: stats ?? {},
    })
  } catch (e) {
    return NextResponse.json(
      { error: 'CEO havuzu hatası', detail: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    )
  }
}
