/**
 * POST /api/tenant-robots/install — Tenant'a robot kur
 * V3.0 Mimari: Bölüm 6.3 (Tenant Onboarding)
 *
 * Ödeme sonrası otomatik olarak veya Patron tarafından manuel tetiklenir.
 */

import { NextRequest, NextResponse } from 'next/server'
import { requirePatronOrFlow } from '@/lib/auth/api-auth'
import { installRobotsForTenant, type TenantRobotType } from '@/lib/db/tenant-robots'
import { insertAuditLog } from '@/lib/db/ceo-celf'

export async function POST(req: NextRequest) {
  try {
    const auth = await requirePatronOrFlow()
    if (auth instanceof NextResponse) return auth

    const body = await req.json()
    const { tenant_id, robot_types } = body

    if (!tenant_id) {
      return NextResponse.json({ error: 'tenant_id zorunludur.' }, { status: 400 })
    }

    const validTypes: TenantRobotType[] = ['muhasebe', 'sosyal_medya', 'antrenor', 'satis', 'ik', 'iletisim']
    const selectedTypes = robot_types
      ? (robot_types as string[]).filter((t) => validTypes.includes(t as TenantRobotType)) as TenantRobotType[]
      : undefined  // undefined = tüm robotlar kurulur

    const { installed, error } = await installRobotsForTenant(tenant_id, selectedTypes)

    if (error) return NextResponse.json({ error }, { status: 500 })

    await insertAuditLog({
      action: 'tenant_robots_installed',
      entity_type: 'tenant',
      entity_id: tenant_id,
      user_id: auth.user.id,
      payload: { installed_robots: installed },
    })

    return NextResponse.json({
      ok: true,
      tenant_id,
      installed,
      message: `${installed.length} robot başarıyla kuruldu.`,
    })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    )
  }
}
