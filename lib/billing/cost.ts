/**
 * YiSA-S Maliyet ve Limit Sistemi
 * Token ekonomisi, fiyatlandırma, bütçe kontrolü
 */

import { getSupabase } from '@/lib/supabase'

// Token Fiyatlandırma (USD)
export const TOKEN_PRICING = {
  // AI Servisleri
  claude: { input: 0.003, output: 0.015 },      // per 1K tokens
  gpt4: { input: 0.01, output: 0.03 },
  gpt35: { input: 0.0005, output: 0.0015 },
  gemini: { input: 0.00025, output: 0.0005 },
  together: { input: 0.0002, output: 0.0002 },
  
  // Medya Servisleri
  fal_image: 0.02,           // per image
  fal_video: 0.50,           // per video
  canva_export: 0.01,        // per export
  pika_video: 0.30,          // per video
  
  // Platform Token (YiSA-S internal)
  platform_token: 0.0007,    // USD per token
}

// Döviz Kurları
export const EXCHANGE_RATES = {
  USD_TRY: 35,
}

// Franchise Paketleri
export const FRANCHISE_PACKAGES = {
  starter: {
    name: 'Başlangıç',
    setupFee: 1500,          // USD one-time
    monthlyTokens: 5000,
    maxStudents: 50,
    features: ['Temel raporlar', 'E-posta destek']
  },
  professional: {
    name: 'Profesyonel',
    setupFee: 2500,
    monthlyTokens: 15000,
    maxStudents: 150,
    features: ['Gelişmiş raporlar', 'Öncelikli destek', 'Özel şablonlar']
  },
  enterprise: {
    name: 'Kurumsal',
    setupFee: 5000,
    monthlyTokens: 50000,
    maxStudents: 500,
    features: ['Sınırsız rapor', '7/24 destek', 'Özel entegrasyon', 'Beyaz etiket']
  }
}

// Maliyet Hesaplama
export function calculateAICost(
  service: keyof typeof TOKEN_PRICING,
  inputTokens: number,
  outputTokens: number
): { usd: number; try: number } {
  const pricing = TOKEN_PRICING[service]
  
  let usd = 0
  if (typeof pricing === 'object' && 'input' in pricing) {
    usd = (inputTokens / 1000) * pricing.input + (outputTokens / 1000) * pricing.output
  } else if (typeof pricing === 'number') {
    usd = pricing
  }
  
  return {
    usd: Math.round(usd * 10000) / 10000,
    try: Math.round(usd * EXCHANGE_RATES.USD_TRY * 100) / 100
  }
}

// Token Kullanımı Kaydet
export async function recordTokenUsage(params: {
  tenantId: string
  service: string
  inputTokens: number
  outputTokens: number
  taskId?: string
  robotCode?: string
}) {
  const supabase = getSupabase()
  const cost = calculateAICost(
    params.service as keyof typeof TOKEN_PRICING,
    params.inputTokens,
    params.outputTokens
  )
  
  const { error } = await supabase.from('ai_usage').insert({
    tenant_id: params.tenantId,
    service: params.service,
    input_tokens: params.inputTokens,
    output_tokens: params.outputTokens,
    cost_usd: cost.usd,
    cost_try: cost.try,
    task_id: params.taskId,
    robot_code: params.robotCode,
    created_at: new Date().toISOString()
  })
  
  if (error) throw error
  return cost
}

// Bütçe Kontrolü
export async function checkBudget(tenantId: string): Promise<{
  allowed: boolean
  remaining: number
  used: number
  limit: number
}> {
  const supabase = getSupabase()
  
  // Tenant bütçesini al
  const { data: budget } = await supabase
    .from('cost_budgets')
    .select('monthly_limit_usd')
    .eq('tenant_id', tenantId)
    .single()
  
  const limit = budget?.monthly_limit_usd || 100 // Default $100
  
  // Bu ayki kullanımı al
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)
  
  const { data: usage } = await supabase
    .from('ai_usage')
    .select('cost_usd')
    .eq('tenant_id', tenantId)
    .gte('created_at', startOfMonth.toISOString())
  
  const used = usage?.reduce((sum, u) => sum + (u.cost_usd || 0), 0) || 0
  const remaining = limit - used
  
  return {
    allowed: remaining > 0,
    remaining,
    used,
    limit
  }
}

// Günlük/Haftalık/Aylık Rapor
export async function getCostReport(tenantId: string, period: 'daily' | 'weekly' | 'monthly') {
  const supabase = getSupabase()
  
  const now = new Date()
  let startDate: Date
  
  switch (period) {
    case 'daily':
      startDate = new Date(now.setHours(0, 0, 0, 0))
      break
    case 'weekly':
      startDate = new Date(now.setDate(now.getDate() - 7))
      break
    case 'monthly':
      startDate = new Date(now.setDate(1))
      startDate.setHours(0, 0, 0, 0)
      break
  }
  
  const { data } = await supabase
    .from('ai_usage')
    .select('service, cost_usd, cost_try, input_tokens, output_tokens')
    .eq('tenant_id', tenantId)
    .gte('created_at', startDate.toISOString())
  
  // Servise göre grupla
  const byService: Record<string, { count: number; cost_usd: number; tokens: number }> = {}
  
  data?.forEach(row => {
    if (!byService[row.service]) {
      byService[row.service] = { count: 0, cost_usd: 0, tokens: 0 }
    }
    byService[row.service].count++
    byService[row.service].cost_usd += row.cost_usd || 0
    byService[row.service].tokens += (row.input_tokens || 0) + (row.output_tokens || 0)
  })
  
  const totalUsd = Object.values(byService).reduce((sum, s) => sum + s.cost_usd, 0)
  
  return {
    period,
    startDate: startDate.toISOString(),
    byService,
    total: {
      usd: Math.round(totalUsd * 100) / 100,
      try: Math.round(totalUsd * EXCHANGE_RATES.USD_TRY * 100) / 100
    }
  }
}
