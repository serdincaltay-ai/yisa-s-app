import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Lazy initialization to avoid build-time errors
let _supabaseAdmin: SupabaseClient | null = null

export function getSupabaseAdmin(): SupabaseClient {
  if (_supabaseAdmin) return _supabaseAdmin
  
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required')
  }
  
  _supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
  
  return _supabaseAdmin
}

// Robot types for YİSA-S system
export interface Robot {
  id: string
  name: string
  code: string
  role: string
  description: string
  status: 'active' | 'standby' | 'offline'
  model: string
  color: string
  icon: string
  capabilities: string[]
  created_at: string
  updated_at: string
}

// 7 Ana Robot Tanımları
export const YISA_ROBOTS: Omit<Robot, 'id' | 'created_at' | 'updated_at'>[] = [
  {
    name: 'CEO Robot',
    code: 'CEO',
    role: 'Üst Düzey Karar Verici',
    description: 'Stratejik kararlar alır, öncelikleri belirler ve diğer robotları koordine eder.',
    status: 'active',
    model: 'claude-sonnet-4-20250514',
    color: '#F59E0B', // Amber
    icon: '👔',
    capabilities: ['strategic-planning', 'decision-making', 'coordination', 'priority-management']
  },
  {
    name: 'Analyst Robot',
    code: 'ANALYST',
    role: 'Veri Analisti',
    description: 'Verileri analiz eder, raporlar oluşturur ve içgörüler sağlar.',
    status: 'active',
    model: 'claude-sonnet-4-20250514',
    color: '#3B82F6', // Blue
    icon: '📊',
    capabilities: ['data-analysis', 'reporting', 'insights', 'visualization']
  },
  {
    name: 'Developer Robot',
    code: 'DEV',
    role: 'Yazılım Geliştirici',
    description: 'Kod yazar, sistemleri geliştirir ve teknik sorunları çözer.',
    status: 'active',
    model: 'claude-sonnet-4-20250514',
    color: '#10B981', // Emerald
    icon: '💻',
    capabilities: ['coding', 'debugging', 'architecture', 'optimization']
  },
  {
    name: 'Designer Robot',
    code: 'DESIGNER',
    role: 'UI/UX Tasarımcı',
    description: 'Kullanıcı arayüzleri tasarlar ve kullanıcı deneyimini optimize eder.',
    status: 'active',
    model: 'claude-sonnet-4-20250514',
    color: '#EC4899', // Pink
    icon: '🎨',
    capabilities: ['ui-design', 'ux-research', 'prototyping', 'branding']
  },
  {
    name: 'Support Robot',
    code: 'SUPPORT',
    role: 'Müşteri Desteği',
    description: 'Kullanıcı sorularını yanıtlar, sorunları çözer ve destek sağlar.',
    status: 'active',
    model: 'claude-sonnet-4-20250514',
    color: '#8B5CF6', // Purple
    icon: '🤝',
    capabilities: ['customer-support', 'problem-solving', 'communication', 'documentation']
  },
  {
    name: 'Research Robot',
    code: 'RESEARCH',
    role: 'Araştırmacı',
    description: 'Pazar araştırması yapar, trendleri takip eder ve bilgi toplar.',
    status: 'active',
    model: 'claude-sonnet-4-20250514',
    color: '#06B6D4', // Cyan
    icon: '🔬',
    capabilities: ['market-research', 'trend-analysis', 'information-gathering', 'competitive-analysis']
  },
  {
    name: 'Operations Robot',
    code: 'OPS',
    role: 'Operasyon Yöneticisi',
    description: 'Günlük operasyonları yönetir, süreçleri optimize eder ve verimliliği artırır.',
    status: 'standby',
    model: 'claude-sonnet-4-20250514',
    color: '#F97316', // Orange
    icon: '⚙️',
    capabilities: ['operations-management', 'process-optimization', 'efficiency', 'automation']
  }
]
