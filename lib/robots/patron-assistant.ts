/**
 * YiSA-S Patron Asistanı (ROB-ASISTAN)
 * Kişisel işler, özel depo, AI orkestrasyon
 * app.yisa-s.com için
 */

import { getSupabase } from '@/lib/supabase'
import { routeToAI, AI_SERVICES } from '@/lib/ai/router'

// Patron Asistan Konfigürasyonu
export const PATRON_ASSISTANT_CONFIG = {
  code: 'ROB-ASISTAN',
  name: 'Patron Asistanı',
  layer: 1,
  description: 'Kişisel işler, AI orkestrasyon, özel depo',
  aiServices: ['claude', 'gpt', 'gemini', 'together', 'v0', 'cursor'],
  capabilities: [
    'personal_tasks',
    'ai_orchestration', 
    'private_storage',
    'daily_briefing',
    'decision_support',
    'calendar_management',
    'note_taking'
  ]
}

// 3 Ana Senaryo
export enum PatronScenario {
  PATRON_QUESTION = 'patron_question',    // Patron sorusu - öncelik 1
  SYSTEM_TASK = 'system_task',            // Sistem işi - kuyrukta
  PERSONAL_TASK = 'personal_task'         // Kişisel iş - özel depo
}

// Özel Depo (PATRON_OZEL_DEPO)
export interface PrivateItem {
  id: string
  type: 'note' | 'file' | 'idea' | 'todo' | 'password' | 'contact'
  title: string
  content: string
  tags: string[]
  isEncrypted: boolean
  createdAt: string
  updatedAt: string
}

// Patron Komutu İşle
export async function processPatronCommand(params: {
  command: string
  scenario: PatronScenario
  attachments?: string[]
  priority?: 'low' | 'normal' | 'high' | 'urgent'
}) {
  const supabase = getSupabase()
  
  // Komut analizi için Claude kullan
  const analysis = await routeToAI({
    directorate: 'CIO',
    taskType: 'analysis',
    prompt: `Patron komutu analiz et ve kategorize et:

Komut: ${params.command}
Senaryo: ${params.scenario}

Yanıt formatı (JSON):
{
  "category": "finance|tech|hr|marketing|legal|sales|product|data|sports|media|strategy|personal",
  "action": "query|create|update|delete|report|approve|reject",
  "targetDirectorate": "CFO|CTO|CIO|CMO|CHRO|CLO|CSO_SATIS|CPO|CDO|CSPO|CMDO|CRDO|CISO|CXO|CCO|CSO_STRATEJI",
  "urgency": "low|normal|high|urgent",
  "summary": "tek satır özet"
}`,
    tenantId: 'platform'
  })
  
  let parsedAnalysis
  try {
    parsedAnalysis = JSON.parse(analysis.response)
  } catch {
    parsedAnalysis = {
      category: 'personal',
      action: 'query',
      targetDirectorate: 'CIO',
      urgency: params.priority || 'normal',
      summary: params.command.substring(0, 100)
    }
  }
  
  // Patron komutunu kaydet
  const { data: commandRecord } = await supabase
    .from('patron_commands')
    .insert({
      command: params.command,
      scenario: params.scenario,
      analysis: parsedAnalysis,
      status: 'processing',
      priority: parsedAnalysis.urgency,
      created_at: new Date().toISOString()
    })
    .select()
    .single()
  
  // Senaryoya göre işle
  switch (params.scenario) {
    case PatronScenario.PATRON_QUESTION:
      return await handlePatronQuestion(commandRecord.id, params.command, parsedAnalysis)
    
    case PatronScenario.SYSTEM_TASK:
      return await createSystemTask(commandRecord.id, params.command, parsedAnalysis)
    
    case PatronScenario.PERSONAL_TASK:
      return await handlePersonalTask(commandRecord.id, params.command, parsedAnalysis)
  }
}

// Patron Sorusu - Hemen Yanıt
async function handlePatronQuestion(
  commandId: string,
  question: string,
  analysis: Record<string, string>
) {
  const supabase = getSupabase()
  
  // İlgili direktörlüğe sor
  const response = await routeToAI({
    directorate: analysis.targetDirectorate as any,
    taskType: 'chat',
    prompt: `Patron şunu soruyor: ${question}

Kısa, net ve profesyonel yanıt ver. Önemli verileri vurgula.`,
    tenantId: 'platform',
    priority: 'high'
  })
  
  // Komutu güncelle
  await supabase
    .from('patron_commands')
    .update({
      status: 'completed',
      response: response.response,
      completed_at: new Date().toISOString()
    })
    .eq('id', commandId)
  
  return {
    type: 'answer',
    response: response.response,
    source: response.aiUsed,
    commandId
  }
}

// Sistem Görevi Oluştur
async function createSystemTask(
  commandId: string,
  command: string,
  analysis: Record<string, string>
) {
  const supabase = getSupabase()
  
  // Task oluştur
  const { data: task } = await supabase
    .from('tasks')
    .insert({
      title: analysis.summary,
      description: command,
      directorate: analysis.targetDirectorate,
      type: analysis.action,
      priority: analysis.urgency,
      status: 'queued',
      source: 'patron_command',
      source_id: commandId,
      created_at: new Date().toISOString()
    })
    .select()
    .single()
  
  // Komutu güncelle
  await supabase
    .from('patron_commands')
    .update({
      status: 'task_created',
      task_id: task.id
    })
    .eq('id', commandId)
  
  return {
    type: 'task_created',
    taskId: task.id,
    message: `Görev oluşturuldu: ${analysis.summary}`,
    directorate: analysis.targetDirectorate,
    commandId
  }
}

// Kişisel İş - Özel Depo
async function handlePersonalTask(
  commandId: string,
  command: string,
  analysis: Record<string, string>
) {
  const supabase = getSupabase()
  
  // Özel depoya kaydet
  const { data: privateItem } = await supabase
    .from('patron_private_storage')
    .insert({
      type: 'note',
      title: analysis.summary,
      content: command,
      tags: [analysis.category],
      is_encrypted: false,
      created_at: new Date().toISOString()
    })
    .select()
    .single()
  
  // Komutu güncelle
  await supabase
    .from('patron_commands')
    .update({
      status: 'stored',
      private_item_id: privateItem.id
    })
    .eq('id', commandId)
  
  return {
    type: 'stored',
    itemId: privateItem.id,
    message: 'Özel depoya kaydedildi',
    commandId
  }
}

// Günlük Brifing
export async function getDailyBriefing() {
  const supabase = getSupabase()
  
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const [pendingTasks, completedToday, alerts, stats] = await Promise.all([
    // Bekleyen görevler
    supabase
      .from('tasks')
      .select('id, title, priority, directorate')
      .in('status', ['queued', 'running'])
      .order('priority', { ascending: false })
      .limit(10),
    
    // Bugün tamamlanan
    supabase
      .from('tasks')
      .select('id', { count: 'exact' })
      .eq('status', 'success')
      .gte('completed_at', today.toISOString()),
    
    // Güvenlik uyarıları
    supabase
      .from('security_alerts')
      .select('id, type, severity, message')
      .eq('is_resolved', false)
      .order('severity', { ascending: false })
      .limit(5),
    
    // Genel istatistikler
    supabase
      .from('tenants')
      .select('id', { count: 'exact' })
      .eq('status', 'active')
  ])
  
  return {
    date: today.toISOString(),
    summary: {
      pendingTaskCount: pendingTasks.data?.length || 0,
      completedTodayCount: completedToday.count || 0,
      activeAlertCount: alerts.data?.length || 0,
      activeTenantCount: stats.count || 0
    },
    pendingTasks: pendingTasks.data || [],
    alerts: alerts.data || [],
    greeting: getGreeting()
  }
}

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 6) return 'İyi geceler Patron'
  if (hour < 12) return 'Günaydın Patron'
  if (hour < 18) return 'İyi günler Patron'
  return 'İyi akşamlar Patron'
}

// Özel Depo İşlemleri
export async function addToPrivateStorage(item: Omit<PrivateItem, 'id' | 'createdAt' | 'updatedAt'>) {
  const supabase = getSupabase()
  
  const { data, error } = await supabase
    .from('patron_private_storage')
    .insert({
      ...item,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select()
    .single()
  
  return { item: data, error }
}

export async function getPrivateItems(params?: {
  type?: PrivateItem['type']
  tags?: string[]
  search?: string
}) {
  const supabase = getSupabase()
  
  let query = supabase.from('patron_private_storage').select('*')
  
  if (params?.type) {
    query = query.eq('type', params.type)
  }
  
  if (params?.tags?.length) {
    query = query.contains('tags', params.tags)
  }
  
  if (params?.search) {
    query = query.or(`title.ilike.%${params.search}%,content.ilike.%${params.search}%`)
  }
  
  const { data, error } = await query.order('created_at', { ascending: false })
  
  return { items: data, error }
}

// Karar Destek
export async function getDecisionSupport(topic: string) {
  // Birden fazla AI'dan görüş al
  const [claude, gpt, gemini] = await Promise.all([
    routeToAI({
      directorate: 'CIO',
      taskType: 'analysis',
      prompt: `Konu: ${topic}\n\nStratejik analiz ve öneri sun.`,
      tenantId: 'platform',
      preferredAI: 'claude'
    }),
    routeToAI({
      directorate: 'CIO',
      taskType: 'analysis',
      prompt: `Konu: ${topic}\n\nFarklı açılardan değerlendir ve öneri sun.`,
      tenantId: 'platform',
      preferredAI: 'gpt'
    }),
    routeToAI({
      directorate: 'CIO',
      taskType: 'analysis',
      prompt: `Konu: ${topic}\n\nHızlı ve pratik çözüm öner.`,
      tenantId: 'platform',
      preferredAI: 'gemini'
    })
  ])
  
  return {
    topic,
    opinions: [
      { source: 'Claude', response: claude.response },
      { source: 'GPT', response: gpt.response },
      { source: 'Gemini', response: gemini.response }
    ]
  }
}
