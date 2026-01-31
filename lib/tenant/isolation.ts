/**
 * YiSA-S Tenant İzolasyon Sistemi
 * Multi-tenant güvenlik, veri ayrımı, erişim kontrolü
 */

import { getSupabase } from '@/lib/supabase'

// İzolasyon Katmanları
export enum IsolationLevel {
  GLOBAL = 'global',           // Platform Admin - tüm veriye erişim
  AGGREGATED = 'aggregated',   // Patron - agregat raporlar, bireysel veri yok
  TENANT = 'tenant',           // Franchise - kendi verisi
  USER = 'user'                // Kullanıcı - kendi profili
}

// Tenant Durumları
export enum TenantStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  TRIAL = 'trial',
  CANCELLED = 'cancelled'
}

// Tenant Bilgisi
export interface Tenant {
  id: string
  name: string
  slug: string
  status: TenantStatus
  plan: 'starter' | 'professional' | 'enterprise'
  owner_id: string
  settings: {
    timezone: string
    language: string
    currency: string
  }
  limits: {
    max_users: number
    max_students: number
    monthly_tokens: number
  }
  created_at: string
}

// Tenant Context
let currentTenantId: string | null = null

export function setTenantContext(tenantId: string) {
  currentTenantId = tenantId
}

export function getTenantContext(): string | null {
  return currentTenantId
}

export function clearTenantContext() {
  currentTenantId = null
}

// Tenant Doğrulama
export async function validateTenantAccess(
  userId: string,
  tenantId: string
): Promise<{ allowed: boolean; role?: string; level?: IsolationLevel }> {
  const supabase = getSupabase()
  
  // Kullanıcının tenant üyeliğini kontrol et
  const { data: membership } = await supabase
    .from('user_profiles')
    .select('role, tenant_id')
    .eq('user_id', userId)
    .single()
  
  if (!membership) {
    return { allowed: false }
  }
  
  // Platform Admin her yere erişebilir
  if (membership.role === 'ROL-0') {
    return { allowed: true, role: 'ROL-0', level: IsolationLevel.GLOBAL }
  }
  
  // Patron (agregat erişim)
  if (membership.role === 'patron') {
    return { allowed: true, role: 'patron', level: IsolationLevel.AGGREGATED }
  }
  
  // Tenant üyesi mi?
  if (membership.tenant_id === tenantId) {
    return { allowed: true, role: membership.role, level: IsolationLevel.TENANT }
  }
  
  return { allowed: false }
}

// Güvenli Sorgu Wrapper
export async function secureQuery<T>(
  table: string,
  query: 'select' | 'insert' | 'update' | 'delete',
  params: {
    tenantId: string
    userId: string
    data?: Partial<T>
    filters?: Record<string, unknown>
    select?: string
  }
): Promise<{ data: T[] | null; error: Error | null }> {
  const supabase = getSupabase()
  
  // Erişim kontrolü
  const access = await validateTenantAccess(params.userId, params.tenantId)
  if (!access.allowed) {
    return { data: null, error: new Error('Erişim reddedildi') }
  }
  
  // RLS zaten aktif ama ekstra kontrol
  let q = supabase.from(table)
  
  switch (query) {
    case 'select':
      q = q.select(params.select || '*').eq('tenant_id', params.tenantId)
      if (params.filters) {
        Object.entries(params.filters).forEach(([key, value]) => {
          q = q.eq(key, value)
        })
      }
      break
      
    case 'insert':
      if (params.data) {
        q = q.insert({ ...params.data, tenant_id: params.tenantId })
      }
      break
      
    case 'update':
      if (params.data) {
        q = q.update(params.data).eq('tenant_id', params.tenantId)
        if (params.filters) {
          Object.entries(params.filters).forEach(([key, value]) => {
            q = q.eq(key, value)
          })
        }
      }
      break
      
    case 'delete':
      // Soft delete - veri silinmez, gizlenir
      q = q.update({ deleted_at: new Date().toISOString(), is_deleted: true })
        .eq('tenant_id', params.tenantId)
      if (params.filters) {
        Object.entries(params.filters).forEach(([key, value]) => {
          q = q.eq(key, value)
        })
      }
      break
  }
  
  const { data, error } = await q
  return { data: data as T[] | null, error: error as Error | null }
}

// Tenant Oluştur
export async function createTenant(params: {
  name: string
  slug: string
  ownerId: string
  plan: 'starter' | 'professional' | 'enterprise'
}): Promise<{ tenant: Tenant | null; error: Error | null }> {
  const supabase = getSupabase()
  
  // Slug benzersiz mi?
  const { data: existing } = await supabase
    .from('tenants')
    .select('id')
    .eq('slug', params.slug)
    .single()
  
  if (existing) {
    return { tenant: null, error: new Error('Bu slug zaten kullanılıyor') }
  }
  
  // Plan limitleri
  const planLimits = {
    starter: { max_users: 10, max_students: 50, monthly_tokens: 5000 },
    professional: { max_users: 30, max_students: 150, monthly_tokens: 15000 },
    enterprise: { max_users: 100, max_students: 500, monthly_tokens: 50000 }
  }
  
  const { data, error } = await supabase
    .from('tenants')
    .insert({
      name: params.name,
      slug: params.slug,
      owner_id: params.ownerId,
      status: TenantStatus.TRIAL,
      plan: params.plan,
      settings: {
        timezone: 'Europe/Istanbul',
        language: 'tr',
        currency: 'TRY'
      },
      limits: planLimits[params.plan]
    })
    .select()
    .single()
  
  return { tenant: data as Tenant, error: error as Error | null }
}

// Tenant İstatistikleri
export async function getTenantStats(tenantId: string) {
  const supabase = getSupabase()
  
  const [users, students, tasks] = await Promise.all([
    supabase.from('user_profiles').select('id', { count: 'exact' }).eq('tenant_id', tenantId),
    supabase.from('athletes').select('id', { count: 'exact' }).eq('tenant_id', tenantId),
    supabase.from('tasks').select('id', { count: 'exact' }).eq('tenant_id', tenantId)
  ])
  
  return {
    userCount: users.count || 0,
    studentCount: students.count || 0,
    taskCount: tasks.count || 0
  }
}
