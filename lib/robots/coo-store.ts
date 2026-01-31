/**
 * YiSA-S COO Şablon Mağazası (ROB-COO)
 * CELP'den gelen şablonları franchise'lara satış
 * Sanal mağaza sistemi
 */

import { getSupabase } from '@/lib/supabase'
import { recordTokenUsage } from '@/lib/billing/cost'

// COO Robot Konfigürasyonu
export const COO_CONFIG = {
  code: 'ROB-COO',
  name: 'COO Yardımcı Robot',
  layer: 6,
  description: 'Şablon mağazası, franchise satış',
  aiServices: ['gpt', 'together']
}

// Şablon Kategorileri
export const TEMPLATE_CATEGORIES = {
  report: { name: 'Raporlar', icon: 'file-text' },
  certificate: { name: 'Sertifikalar', icon: 'award' },
  evaluation: { name: 'Değerlendirmeler', icon: 'clipboard' },
  marketing: { name: 'Pazarlama', icon: 'megaphone' },
  contract: { name: 'Sözleşmeler', icon: 'file-contract' },
  invoice: { name: 'Faturalar', icon: 'receipt' },
  schedule: { name: 'Programlar', icon: 'calendar' },
  graphic: { name: 'Grafikler', icon: 'image' }
}

// Şablon Interface
export interface Template {
  id: string
  code: string
  name: string
  category: keyof typeof TEMPLATE_CATEGORIES
  description: string
  thumbnail?: string
  tokenCost: number
  format: 'pdf' | 'docx' | 'xlsx' | 'png' | 'svg'
  variables: {
    name: string
    type: 'text' | 'number' | 'date' | 'image' | 'list'
    required: boolean
    default?: string
  }[]
  createdBy: string  // Direktörlük kodu
  isActive: boolean
  usageCount: number
}

// Mağaza Ürünleri Listele
export async function listTemplates(params?: {
  category?: keyof typeof TEMPLATE_CATEGORIES
  search?: string
  limit?: number
  offset?: number
}) {
  const supabase = getSupabase()
  
  let query = supabase
    .from('templates')
    .select('*')
    .eq('is_active', true)
  
  if (params?.category) {
    query = query.eq('category', params.category)
  }
  
  if (params?.search) {
    query = query.ilike('name', `%${params.search}%`)
  }
  
  if (params?.limit) {
    query = query.limit(params.limit)
  }
  
  if (params?.offset) {
    query = query.range(params.offset, params.offset + (params.limit || 10) - 1)
  }
  
  const { data, error } = await query.order('usage_count', { ascending: false })
  
  return { templates: data as Template[] | null, error }
}

// Şablon Satın Al / Kullan
export async function useTemplate(params: {
  templateId: string
  tenantId: string
  userId: string
  variables: Record<string, unknown>
}): Promise<{ success: boolean; output?: string; error?: string }> {
  const supabase = getSupabase()
  
  // Şablonu al
  const { data: template } = await supabase
    .from('templates')
    .select('*')
    .eq('id', params.templateId)
    .single()
  
  if (!template) {
    return { success: false, error: 'Şablon bulunamadı' }
  }
  
  // Token bakiyesi kontrol
  const { data: tenant } = await supabase
    .from('tenants')
    .select('token_balance')
    .eq('id', params.tenantId)
    .single()
  
  if (!tenant || tenant.token_balance < template.token_cost) {
    return { success: false, error: 'Yetersiz token bakiyesi' }
  }
  
  // Token düş
  await supabase
    .from('tenants')
    .update({ token_balance: tenant.token_balance - template.token_cost })
    .eq('id', params.tenantId)
  
  // Kullanım kaydı
  await supabase.from('template_usage').insert({
    template_id: params.templateId,
    tenant_id: params.tenantId,
    user_id: params.userId,
    variables: params.variables,
    token_cost: template.token_cost,
    created_at: new Date().toISOString()
  })
  
  // Kullanım sayısını artır
  await supabase
    .from('templates')
    .update({ usage_count: template.usage_count + 1 })
    .eq('id', params.templateId)
  
  // Token kullanımını kaydet
  await recordTokenUsage({
    tenantId: params.tenantId,
    service: 'template',
    inputTokens: 0,
    outputTokens: template.token_cost,
    robotCode: 'ROB-COO'
  })
  
  // Şablonu oluştur (gerçek implementasyon ayrı servis olacak)
  const output = await generateTemplate(template, params.variables)
  
  return { success: true, output }
}

// Şablon Oluştur (basit implementasyon)
async function generateTemplate(
  template: Template,
  variables: Record<string, unknown>
): Promise<string> {
  // Gerçek implementasyonda:
  // - PDF: puppeteer veya jsPDF
  // - DOCX: docxtemplater
  // - PNG/SVG: canvas veya sharp
  
  // Şimdilik placeholder URL döndür
  const templateUrl = `/api/templates/generate/${template.id}?vars=${encodeURIComponent(JSON.stringify(variables))}`
  return templateUrl
}

// Yeni Şablon Ekle (CELP'den gelir)
export async function addTemplate(params: {
  name: string
  category: keyof typeof TEMPLATE_CATEGORIES
  description: string
  tokenCost: number
  format: Template['format']
  variables: Template['variables']
  createdBy: string
  content: string  // Base64 veya URL
}) {
  const supabase = getSupabase()
  
  const code = `TPL-${params.category.toUpperCase()}-${Date.now()}`
  
  const { data, error } = await supabase
    .from('templates')
    .insert({
      code,
      name: params.name,
      category: params.category,
      description: params.description,
      token_cost: params.tokenCost,
      format: params.format,
      variables: params.variables,
      created_by: params.createdBy,
      content: params.content,
      is_active: true,
      usage_count: 0,
      created_at: new Date().toISOString()
    })
    .select()
    .single()
  
  return { template: data, error }
}

// Mağaza İstatistikleri
export async function getStoreStats() {
  const supabase = getSupabase()
  
  const [templates, usage, revenue] = await Promise.all([
    supabase.from('templates').select('id', { count: 'exact' }).eq('is_active', true),
    supabase.from('template_usage').select('token_cost'),
    supabase.from('template_usage')
      .select('token_cost')
      .gte('created_at', new Date(new Date().setDate(1)).toISOString())
  ])
  
  const totalTokens = usage.data?.reduce((sum, u) => sum + (u.token_cost || 0), 0) || 0
  const monthlyTokens = revenue.data?.reduce((sum, u) => sum + (u.token_cost || 0), 0) || 0
  
  return {
    templateCount: templates.count || 0,
    totalUsage: usage.data?.length || 0,
    totalTokensEarned: totalTokens,
    monthlyTokensEarned: monthlyTokens
  }
}

// Popüler Şablonlar
export async function getPopularTemplates(limit: number = 10) {
  const supabase = getSupabase()
  
  const { data } = await supabase
    .from('templates')
    .select('id, name, category, token_cost, usage_count')
    .eq('is_active', true)
    .order('usage_count', { ascending: false })
    .limit(limit)
  
  return data || []
}

// Kategori Bazlı İstatistik
export async function getCategoryStats() {
  const supabase = getSupabase()
  
  const { data } = await supabase
    .from('templates')
    .select('category, usage_count')
    .eq('is_active', true)
  
  const stats: Record<string, { count: number; usage: number }> = {}
  
  data?.forEach(t => {
    if (!stats[t.category]) {
      stats[t.category] = { count: 0, usage: 0 }
    }
    stats[t.category].count++
    stats[t.category].usage += t.usage_count || 0
  })
  
  return stats
}
