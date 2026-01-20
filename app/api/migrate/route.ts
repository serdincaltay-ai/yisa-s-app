import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

// POST - Run migrations
export async function POST() {
  try {
    const supabase = getSupabaseAdmin()
    
    // First, check if table exists by trying to query it
    const { error: checkError } = await supabase
      .from('robots')
      .select('id')
      .limit(1)

    if (checkError && checkError.message.includes('does not exist')) {
      // Table doesn't exist, we need to create it via Supabase Dashboard or SQL Editor
      console.log('Robots table does not exist, attempting to create...')
      
      return NextResponse.json({ 
        success: false,
        message: 'Robots tablosu Supabase Dashboard\'da oluşturulmalı. SQL Editor\'de migration dosyasını çalıştırın.',
        migration_file: '/supabase/migrations/001_create_robots_table.sql'
      }, { status: 400 })
    }

    // If table exists, seed the data
    const robots = [
      {
        name: 'CEO Robot',
        code: 'CEO',
        role: 'Üst Düzey Karar Verici',
        description: 'Stratejik kararlar alır, öncelikleri belirler ve diğer robotları koordine eder.',
        status: 'active',
        model: 'claude-sonnet-4-20250514',
        color: '#F59E0B',
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
        color: '#3B82F6',
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
        color: '#10B981',
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
        color: '#EC4899',
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
        color: '#8B5CF6',
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
        color: '#06B6D4',
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
        color: '#F97316',
        icon: '⚙️',
        capabilities: ['operations-management', 'process-optimization', 'efficiency', 'automation']
      }
    ]

    // Check existing robots
    const { data: existing } = await supabase
      .from('robots')
      .select('code')

    const existingCodes = new Set(existing?.map(r => r.code) || [])
    const robotsToInsert = robots.filter(r => !existingCodes.has(r.code))

    if (robotsToInsert.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Tüm robotlar zaten mevcut',
        existing: existing?.length || 0
      })
    }

    // Insert new robots
    const { data, error } = await supabase
      .from('robots')
      .insert(robotsToInsert)
      .select()

    if (error) {
      console.error('Insert error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Migration completed',
      inserted: data?.length || 0,
      total: (existing?.length || 0) + (data?.length || 0)
    })

  } catch (err) {
    console.error('Migration error:', err)
    return NextResponse.json({ 
      error: err instanceof Error ? err.message : 'Migration failed' 
    }, { status: 500 })
  }
}

// GET - Check migration status
export async function GET() {
  try {
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('robots')
      .select('id, name, code, status')

    if (error) {
      return NextResponse.json({ 
        status: 'not_migrated',
        error: error.message 
      })
    }

    return NextResponse.json({
      status: 'migrated',
      robots_count: data?.length || 0,
      robots: data
    })
  } catch (err) {
    return NextResponse.json({ 
      status: 'error',
      error: err instanceof Error ? err.message : 'Unknown error' 
    })
  }
}
