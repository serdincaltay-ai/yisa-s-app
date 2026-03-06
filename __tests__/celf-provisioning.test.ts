/**
 * CELF Pipeline E2E Test — Provisioning Chain
 * provisionTenant → triggerCelfStartup → sim_updates INSERT → CELF görev oluşturma
 *
 * Mock Supabase client kullanır, gerçek DB'ye bağlanmaz.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createMockSupabaseClient, createEmptyStore, seedDemoRequest, type MockStore } from './mock-supabase'
import { CELF_DIRECTORATES, CELF_DIRECTORATE_KEYS, type DirectorKey } from '@/lib/robots/celf-center'
import { generateTenantSlug, subdomainSlug } from '@/lib/utils/slug'

// ─── Mock environment variables ──────────────────────────────────────────────

vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://mock.supabase.co')
vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'mock-service-role-key')

// ─── We re-implement the provisioning logic inline using mock supabase ───────
// This avoids importing the real module which creates a real Supabase client
// at module level. Instead we test the same logic against our mock.

interface ProvisioningContext {
  supabase: ReturnType<typeof createMockSupabaseClient>
  demoRequest: Record<string, unknown>
  tenantId?: string
  slug?: string
  subdomain?: string
  userId?: string
  tempPassword?: string
  franchiseCreated: boolean
  celfTriggered: boolean
  stepsCompleted: string[]
}

async function createTenant(ctx: ProvisioningContext): Promise<void> {
  const { supabase, demoRequest } = ctx
  const baseName = ((demoRequest.name as string) ?? '').trim() || (demoRequest.facility_type as string) || 'Yeni Tesis'
  const cityPart = demoRequest.city ? ` ${demoRequest.city}` : ''
  const tenantName = `${baseName}${cityPart}`.trim() || 'Yeni Tesis'
  const slug = generateTenantSlug(tenantName, String(demoRequest.id).slice(0, 8))

  const { data: newTenant } = supabase
    .from('tenants')
    .insert({
      ad: tenantName,
      name: tenantName,
      slug,
      durum: 'aktif',
      owner_id: null,
      package_type: 'starter',
      setup_completed: false,
      phone: (demoRequest.phone as string) ?? null,
    })
    .select('id')
    .single()

  ctx.tenantId = (newTenant as Record<string, unknown>)?.id as string
  ctx.slug = slug
  ctx.stepsCompleted.push('tenant_created')
}

async function setupUser(ctx: ProvisioningContext): Promise<void> {
  const { supabase, demoRequest, tenantId } = ctx
  const reqEmail = ((demoRequest.email as string) ?? '').trim().toLowerCase()
  if (!reqEmail || !tenantId) return

  const { data: listData } = await supabase.auth.admin.listUsers({ perPage: 1000 })
  const existingUser = listData?.users?.find(
    (u) => (u.email ?? '').toLowerCase() === reqEmail
  )

  if (!existingUser) {
    const chars = 'abcdefghjkmnpqrstuvwxyz23456789'
    const tempPassword = Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')

    const { data: newUser } = await supabase.auth.admin.createUser({
      email: reqEmail,
      password: tempPassword,
      email_confirm: true,
      user_metadata: { role: 'franchise', tenant_slug: ctx.slug },
    })

    if (newUser?.user) {
      supabase.from('tenants').update({ owner_id: newUser.user.id }).eq('id', tenantId)
      supabase.from('user_tenants').insert({ user_id: newUser.user.id, tenant_id: tenantId, role: 'owner' }).select('id').single()
      ctx.userId = newUser.user.id
      ctx.tempPassword = tempPassword
    }
  }
  ctx.stepsCompleted.push('user_setup')
}

async function createSubdomain(ctx: ProvisioningContext): Promise<void> {
  const { supabase, demoRequest, tenantId } = ctx
  if (!tenantId || !ctx.slug) return

  const baseName = ((demoRequest.name as string) ?? '').trim() || (demoRequest.facility_type as string) || 'Yeni Tesis'
  const subdomain = subdomainSlug(baseName)

  const { data: existing } = supabase
    .from('franchise_subdomains')
    .select('id')
    .eq('subdomain', subdomain)
    .maybeSingle()

  if (!existing) {
    supabase.from('franchise_subdomains').insert({
      subdomain,
      franchise_name: baseName,
      tenant_id: tenantId,
    })
  }

  ctx.subdomain = subdomain
  ctx.stepsCompleted.push('subdomain_created')
}

async function triggerCelfStartup(ctx: ProvisioningContext): Promise<void> {
  const { supabase, tenantId, slug, demoRequest } = ctx
  if (!tenantId) return

  const celfDirectorlukler = [...CELF_DIRECTORATE_KEYS]

  const commandPayload = JSON.stringify({
    type: 'tenant_baslangic_gorevleri',
    tenant_id: tenantId,
    slug: slug ?? '',
    firma_adi: (demoRequest.name as string) ?? '',
    email: (demoRequest.email as string) ?? '',
    direktorlukler: celfDirectorlukler,
  })

  const { data: simResult } = supabase
    .from('sim_updates')
    .insert({
      target_robot: 'CELF',
      target_directorate: 'genel_mudurluk',
      command: commandPayload,
      status: 'beklemede',
    })
    .select('id')
    .single()

  if (simResult) {
    ctx.celfTriggered = true
    ctx.stepsCompleted.push('celf_triggered')
  }
}

async function markDemoRequestConverted(ctx: ProvisioningContext): Promise<void> {
  const { supabase, demoRequest } = ctx
  supabase.from('demo_requests').update({ status: 'converted' }).eq('id', demoRequest.id as string)
  ctx.stepsCompleted.push('status_updated')
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('CELF Pipeline — Provisioning Chain', () => {
  let store: MockStore
  let supabase: ReturnType<typeof createMockSupabaseClient>

  beforeEach(() => {
    store = createEmptyStore()
    supabase = createMockSupabaseClient(store)
  })

  it('should create a tenant from a demo request', async () => {
    const demoId = seedDemoRequest(store)
    const demoRequest = store.demo_requests.find((r) => r.id === demoId)!

    const ctx: ProvisioningContext = {
      supabase,
      demoRequest,
      franchiseCreated: false,
      celfTriggered: false,
      stepsCompleted: [],
    }

    await createTenant(ctx)

    expect(ctx.tenantId).toBeDefined()
    expect(ctx.slug).toBeDefined()
    expect(ctx.stepsCompleted).toContain('tenant_created')

    // Tenant should be in the store
    const tenant = store.tenants.find((t) => t.id === ctx.tenantId)
    expect(tenant).toBeDefined()
    expect(tenant!.slug).toBe(ctx.slug)
    expect(tenant!.durum).toBe('aktif')
    expect(tenant!.package_type).toBe('starter')
  })

  it('should set up a user and link to tenant', async () => {
    const demoId = seedDemoRequest(store)
    const demoRequest = store.demo_requests.find((r) => r.id === demoId)!

    const ctx: ProvisioningContext = {
      supabase,
      demoRequest,
      franchiseCreated: false,
      celfTriggered: false,
      stepsCompleted: [],
    }

    await createTenant(ctx)
    await setupUser(ctx)

    expect(ctx.userId).toBeDefined()
    expect(ctx.tempPassword).toBeDefined()
    expect(ctx.tempPassword!.length).toBe(12)
    expect(ctx.stepsCompleted).toContain('user_setup')

    // user_tenants should have the mapping
    const mapping = store.user_tenants.find(
      (ut) => ut.user_id === ctx.userId && ut.tenant_id === ctx.tenantId
    )
    expect(mapping).toBeDefined()
    expect(mapping!.role).toBe('owner')
  })

  it('should create a subdomain entry', async () => {
    const demoId = seedDemoRequest(store, { name: 'Fenerbahçe Ataşehir' })
    const demoRequest = store.demo_requests.find((r) => r.id === demoId)!

    const ctx: ProvisioningContext = {
      supabase,
      demoRequest,
      franchiseCreated: false,
      celfTriggered: false,
      stepsCompleted: [],
    }

    await createTenant(ctx)
    await createSubdomain(ctx)

    expect(ctx.subdomain).toBe('fenerbahceatasehir')
    expect(ctx.stepsCompleted).toContain('subdomain_created')

    const sub = store.franchise_subdomains.find((s) => s.subdomain === 'fenerbahceatasehir')
    expect(sub).toBeDefined()
    expect(sub!.tenant_id).toBe(ctx.tenantId)
  })

  it('should trigger CELF startup and insert sim_updates', async () => {
    const demoId = seedDemoRequest(store)
    const demoRequest = store.demo_requests.find((r) => r.id === demoId)!

    const ctx: ProvisioningContext = {
      supabase,
      demoRequest,
      franchiseCreated: false,
      celfTriggered: false,
      stepsCompleted: [],
    }

    await createTenant(ctx)
    await triggerCelfStartup(ctx)

    expect(ctx.celfTriggered).toBe(true)
    expect(ctx.stepsCompleted).toContain('celf_triggered')

    // sim_updates should have exactly 1 entry
    expect(store.sim_updates).toHaveLength(1)

    const simUpdate = store.sim_updates[0]
    expect(simUpdate.target_robot).toBe('CELF')
    expect(simUpdate.target_directorate).toBe('genel_mudurluk')
    expect(simUpdate.status).toBe('beklemede')

    // Validate the command payload
    const payload = JSON.parse(simUpdate.command as string)
    expect(payload.type).toBe('tenant_baslangic_gorevleri')
    expect(payload.tenant_id).toBe(ctx.tenantId)
    expect(payload.direktorlukler).toHaveLength(15)
    expect(payload.direktorlukler).toEqual(expect.arrayContaining(['CFO', 'CTO', 'CSPO', 'COO', 'RND']))
  })

  it('should mark the demo request as converted', async () => {
    const demoId = seedDemoRequest(store)
    const demoRequest = store.demo_requests.find((r) => r.id === demoId)!

    const ctx: ProvisioningContext = {
      supabase,
      demoRequest,
      franchiseCreated: false,
      celfTriggered: false,
      stepsCompleted: [],
    }

    await createTenant(ctx)
    await markDemoRequestConverted(ctx)

    expect(ctx.stepsCompleted).toContain('status_updated')

    const updated = store.demo_requests.find((r) => r.id === demoId)
    expect(updated!.status).toBe('converted')
  })

  it('should run the full provisioning chain end-to-end', async () => {
    const demoId = seedDemoRequest(store, {
      name: 'BJK Tuzla Cimnastik',
      email: 'bjktuzla@test.com',
      city: 'Istanbul',
      source: 'vitrin',
    })
    const demoRequest = store.demo_requests.find((r) => r.id === demoId)!

    const ctx: ProvisioningContext = {
      supabase,
      demoRequest,
      franchiseCreated: false,
      celfTriggered: false,
      stepsCompleted: [],
    }

    // Execute chain
    await createTenant(ctx)
    await setupUser(ctx)
    await createSubdomain(ctx)
    await triggerCelfStartup(ctx)
    await markDemoRequestConverted(ctx)

    // Verify the full chain
    expect(ctx.stepsCompleted).toEqual(
      expect.arrayContaining([
        'tenant_created',
        'user_setup',
        'subdomain_created',
        'celf_triggered',
        'status_updated',
      ])
    )

    // Tenant created
    expect(store.tenants).toHaveLength(1)
    expect(store.tenants[0].slug).toContain('bjk-tuzla-cimnastik')

    // User linked
    expect(store.user_tenants).toHaveLength(1)

    // Subdomain created
    expect(store.franchise_subdomains).toHaveLength(1)
    expect(store.franchise_subdomains[0].subdomain).toBe('bjktuzlacimnastik')

    // CELF triggered
    expect(store.sim_updates).toHaveLength(1)
    const payload = JSON.parse(store.sim_updates[0].command as string)
    expect(payload.direktorlukler).toHaveLength(15)

    // Demo request updated
    expect(demoRequest.status).toBe('converted')
  })

  it('sim_updates payload should contain all 15 directorate keys', async () => {
    const demoId = seedDemoRequest(store)
    const demoRequest = store.demo_requests.find((r) => r.id === demoId)!

    const ctx: ProvisioningContext = {
      supabase,
      demoRequest,
      franchiseCreated: false,
      celfTriggered: false,
      stepsCompleted: [],
    }

    await createTenant(ctx)
    await triggerCelfStartup(ctx)

    const payload = JSON.parse(store.sim_updates[0].command as string)
    const expectedKeys: DirectorKey[] = [
      'CFO', 'CTO', 'CIO', 'CMO', 'CHRO', 'CLO', 'CSO_SATIS',
      'CPO', 'CDO', 'CISO', 'CCO', 'CSO_STRATEJI', 'CSPO', 'COO', 'RND',
    ]
    expect(payload.direktorlukler).toHaveLength(15)
    expect(payload.direktorlukler.sort()).toEqual(expectedKeys.sort())
  })

  it('CELF_DIRECTORATE_KEYS should contain exactly 15 keys', () => {
    expect(CELF_DIRECTORATE_KEYS).toHaveLength(15)
    expect(Object.keys(CELF_DIRECTORATES)).toHaveLength(15)
  })

  it('each directorate should have name, tasks, triggers, and aiProviders', () => {
    for (const key of CELF_DIRECTORATE_KEYS) {
      const dir = CELF_DIRECTORATES[key]
      expect(dir.name).toBeTruthy()
      expect(dir.tasks.length).toBeGreaterThan(0)
      expect(dir.triggers.length).toBeGreaterThan(0)
      expect(dir.aiProviders.length).toBeGreaterThan(0)
    }
  })
})
