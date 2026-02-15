/**
 * Mevcut kullanıcının franchise panelindeki rolü
 * owner: tam erişim
 * coach: yoklama, program, öğrenciler (readonly)
 * parent: sadece /veli
 */

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export type PanelRole = 'owner' | 'coach' | 'parent'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ role: null }, { status: 401 })

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) return NextResponse.json({ role: 'owner' })

    const service = createServiceClient(url, key)

    // tenants.owner_id → owner
    const { data: t } = await service
      .from('tenants')
      .select('id')
      .eq('owner_id', user.id)
      .limit(1)
      .maybeSingle()
    if (t) return NextResponse.json({ role: 'owner' as PanelRole })

    // user_tenants.role → owner/admin/manager = owner, trainer = coach
    const { data: ut } = await service
      .from('user_tenants')
      .select('role')
      .eq('user_id', user.id)
      .limit(1)
      .maybeSingle()
    if (ut?.role) {
      const r = String(ut.role).toLowerCase()
      if (['owner', 'admin', 'manager'].includes(r)) return NextResponse.json({ role: 'owner' as PanelRole })
      if (r === 'trainer') return NextResponse.json({ role: 'coach' as PanelRole })
    }

    // app_metadata veya user_metadata
    const metaRole = (user.app_metadata?.role ?? user.user_metadata?.role) as string | undefined
    if (metaRole) {
      const r = String(metaRole).toLowerCase()
      if (['owner', 'admin'].includes(r)) return NextResponse.json({ role: 'owner' as PanelRole })
      if (['coach', 'trainer', 'antrenor'].includes(r)) return NextResponse.json({ role: 'coach' as PanelRole })
      if (r === 'parent' || r === 'veli') return NextResponse.json({ role: 'parent' as PanelRole })
    }

    return NextResponse.json({ role: 'owner' })
  } catch {
    return NextResponse.json({ role: 'owner' })
  }
}
