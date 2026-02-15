import { createClient } from '@supabase/supabase-js'

/** Franchise tenant_id: auth'tan veya demo fallback (tenant_id şimdilik hardcoded) */
export async function getTenantIdWithFallback(userId: string | null): Promise<string | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null

  if (userId) {
    const service = createClient(url, key)
    const { data: ut } = await service
      .from('user_tenants')
      .select('tenant_id')
      .eq('user_id', userId)
      .limit(1)
      .maybeSingle()
    if (ut?.tenant_id) return ut.tenant_id

    const { data: t } = await service
      .from('tenants')
      .select('id')
      .eq('owner_id', userId)
      .limit(1)
      .maybeSingle()
    if (t?.id) return t.id
  }

  const demo = process.env.NEXT_PUBLIC_DEMO_TENANT_ID?.trim()
  if (demo && /^[0-9a-f-]{36}$/i.test(demo)) return demo
  return null
}
