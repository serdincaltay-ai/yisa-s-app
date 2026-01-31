/**
 * YiSA-S Vitrin Robotu (ROB-VITRIN)
 * Franchise arayüzü, 7/24 müşteri karşılama
 * lise-s.com için
 */

import { getSupabase } from '@/lib/supabase'
import { routeToAI } from '@/lib/ai/router'

// Vitrin Robot Konfigürasyonu
export const VITRIN_CONFIG = {
  code: 'ROB-VITRIN',
  name: 'YiSA-S Vitrin Robotu',
  layer: 7,
  description: 'Franchise müşteri arayüzü ve 7/24 karşılama',
  capabilities: [
    'customer_greeting',
    'info_display',
    'demo_booking',
    'faq_answer',
    'contact_form',
    'franchise_intro'
  ],
  aiService: 'gpt'  // Hızlı, doğal diyalog için
}

// Vitrin Mesaj Tipleri
export type VitrinMessageType = 
  | 'greeting'
  | 'info_request'
  | 'demo_request'
  | 'pricing_question'
  | 'contact'
  | 'faq'
  | 'complaint'
  | 'other'

// Otomatik Yanıtlar
export const AUTO_RESPONSES: Record<VitrinMessageType, string> = {
  greeting: 'Merhaba! YiSA-S Spor Yönetim Sistemine hoş geldiniz. Size nasıl yardımcı olabilirim?',
  info_request: 'YiSA-S, jimnastik okulları için geliştirilmiş yapay zeka destekli yönetim sistemidir. Sporcu takibi, değerlendirme, aidat yönetimi ve daha fazlası...',
  demo_request: 'Demo talebinizi aldık! En kısa sürede sizinle iletişime geçeceğiz. Lütfen iletişim bilgilerinizi bırakın.',
  pricing_question: 'YiSA-S\'te 3 farklı paket bulunmaktadır: Başlangıç ($1,500), Profesyonel ($2,500) ve Kurumsal ($5,000). Detaylar için demo talep edebilirsiniz.',
  contact: 'İletişim bilgilerinizi bırakın, en kısa sürede sizinle iletişime geçeceğiz.',
  faq: 'Sıkça sorulan sorular için lütfen bekleyin, size yardımcı olacağım.',
  complaint: 'Geri bildiriminiz için teşekkürler. Konuyu ilgili birime ileteceğiz ve en kısa sürede dönüş yapacağız.',
  other: 'Mesajınızı aldım. Size en iyi şekilde yardımcı olmak için inceliyorum.'
}

// Mesaj Sınıflandırma
export function classifyMessage(message: string): VitrinMessageType {
  const lowerMessage = message.toLowerCase()
  
  const patterns: [VitrinMessageType, string[]][] = [
    ['greeting', ['merhaba', 'selam', 'iyi günler', 'hello', 'hi']],
    ['demo_request', ['demo', 'deneme', 'görmek istiyorum', 'test']],
    ['pricing_question', ['fiyat', 'ücret', 'paket', 'ne kadar', 'maliyet']],
    ['info_request', ['nedir', 'ne yapar', 'nasıl çalışır', 'özellik']],
    ['contact', ['iletişim', 'telefon', 'email', 'arayın', 'ulaşın']],
    ['complaint', ['şikayet', 'sorun', 'problem', 'memnun değil']],
    ['faq', ['soru', 'nasıl', 'neden', 'ne zaman']]
  ]
  
  for (const [type, keywords] of patterns) {
    if (keywords.some(kw => lowerMessage.includes(kw))) {
      return type
    }
  }
  
  return 'other'
}

// Vitrin Mesajı İşle
export async function processVitrinMessage(params: {
  sessionId: string
  message: string
  visitorInfo?: {
    name?: string
    email?: string
    phone?: string
    source?: string
  }
}) {
  const supabase = getSupabase()
  const messageType = classifyMessage(params.message)
  
  // Mesajı kaydet
  await supabase.from('vitrin_messages').insert({
    session_id: params.sessionId,
    message: params.message,
    message_type: messageType,
    visitor_info: params.visitorInfo,
    created_at: new Date().toISOString()
  })
  
  // Basit mesajlar için otomatik yanıt
  if (['greeting', 'pricing_question', 'demo_request'].includes(messageType)) {
    return {
      response: AUTO_RESPONSES[messageType],
      type: messageType,
      needsHuman: false
    }
  }
  
  // Karmaşık mesajlar için AI kullan
  const aiResponse = await routeToAI({
    directorate: 'CSO_SATIS',
    taskType: 'chat',
    prompt: `Bir jimnastik okulu yönetim sistemi olan YiSA-S'in vitrin robotu olarak yanıt ver.
    
Müşteri mesajı: ${params.message}
Mesaj tipi: ${messageType}

Kısa, profesyonel ve yardımcı bir yanıt ver. Türkçe yanıt ver.`,
    tenantId: 'platform'
  })
  
  // Yanıtı kaydet
  await supabase.from('vitrin_messages').insert({
    session_id: params.sessionId,
    message: aiResponse.response,
    is_bot: true,
    created_at: new Date().toISOString()
  })
  
  return {
    response: aiResponse.response,
    type: messageType,
    needsHuman: messageType === 'complaint'
  }
}

// Demo Talebi Kaydet
export async function createDemoRequest(params: {
  name: string
  email: string
  phone: string
  companyName?: string
  studentCount?: number
  message?: string
  source?: string
}) {
  const supabase = getSupabase()
  
  const { data, error } = await supabase
    .from('demo_requests')
    .insert({
      ...params,
      status: 'new',
      created_at: new Date().toISOString()
    })
    .select()
    .single()
  
  if (!error) {
    // Satış direktörlüğüne bildirim gönder
    await supabase.from('tasks').insert({
      directorate: 'CSO_SATIS',
      type: 'demo_followup',
      title: `Yeni Demo Talebi: ${params.name}`,
      description: `${params.companyName || 'Bilinmeyen'} - ${params.studentCount || '?'} öğrenci`,
      priority: 'high',
      status: 'queued',
      metadata: { demo_request_id: data.id }
    })
  }
  
  return { demoRequest: data, error }
}

// İletişim Formu
export async function submitContactForm(params: {
  name: string
  email: string
  subject: string
  message: string
}) {
  const supabase = getSupabase()
  
  const { data, error } = await supabase
    .from('contact_submissions')
    .insert({
      ...params,
      status: 'new',
      created_at: new Date().toISOString()
    })
    .select()
    .single()
  
  return { submission: data, error }
}

// Vitrin İstatistikleri
export async function getVitrinStats(period: 'daily' | 'weekly' | 'monthly' = 'daily') {
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
      startDate = new Date(now.setMonth(now.getMonth() - 1))
      break
  }
  
  const [messages, demos, contacts] = await Promise.all([
    supabase
      .from('vitrin_messages')
      .select('id', { count: 'exact' })
      .gte('created_at', startDate.toISOString()),
    supabase
      .from('demo_requests')
      .select('id', { count: 'exact' })
      .gte('created_at', startDate.toISOString()),
    supabase
      .from('contact_submissions')
      .select('id', { count: 'exact' })
      .gte('created_at', startDate.toISOString())
  ])
  
  return {
    period,
    messageCount: messages.count || 0,
    demoRequestCount: demos.count || 0,
    contactCount: contacts.count || 0
  }
}
