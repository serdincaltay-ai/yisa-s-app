/**
 * GET /api/jobs/stats
 * İş üretim istatistikleri
 */

import { NextRequest, NextResponse } from 'next/server'
import { requirePatronOrFlow } from '@/lib/auth/api-auth'
import { getJobStats } from '@/lib/db/robot-jobs'

export async function GET(req: NextRequest) {
  try {
    const auth = await requirePatronOrFlow()
    if (auth instanceof NextResponse) return auth

    const { data, error } = await getJobStats()
    if (error) return NextResponse.json({ error }, { status: 500 })

    return NextResponse.json({ ok: true, stats: data })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    )
  }
}
