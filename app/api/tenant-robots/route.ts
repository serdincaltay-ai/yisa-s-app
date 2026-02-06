/**
 * GET /api/tenant-robots?tenant_id=xxx — Tenant'ın robotlarını listele
 * V3.0 Mimari: Bölüm 6 (Tenant İşletme Robotları)
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServer } from '@/lib/supabase'
import { getTenantRobots } from '@/lib/db/tenant-robots'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const tenantId = searchParams.get('tenant_id')

    if (!tenantId) {
      return NextResponse.json({ error: 'tenant_id zorunludur.' }, { status: 400 })
    }

    const { data, error } = await getTenantRobots(tenantId)
    if (error) return NextResponse.json({ error }, { status: 500 })

    return NextResponse.json({
      ok: true,
      robots: data ?? [],
      count: data?.length ?? 0,
    })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    )
  }
}
