import { NextResponse } from 'next/server'
import { getSupabaseAdmin, YISA_ROBOTS } from '@/lib/supabase-admin'

// GET - Tüm robotları getir
export async function GET() {
  try {
    const supabase = getSupabaseAdmin()
    const { data: robots, error } = await supabase
      .from('robots')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Robots fetch error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ robots })
  } catch (err) {
    console.error('API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Robots tablosunu oluştur ve seed et
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const action = body.action || 'seed'

    if (action === 'create-table') {
      // Create robots table using raw SQL
      const supabase = getSupabaseAdmin()
      const { error: createError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS robots (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            code VARCHAR(50) UNIQUE NOT NULL,
            role VARCHAR(255) NOT NULL,
            description TEXT,
            status VARCHAR(50) DEFAULT 'standby',
            model VARCHAR(100),
            color VARCHAR(20),
            icon VARCHAR(10),
            capabilities JSONB DEFAULT '[]',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
          
          CREATE INDEX IF NOT EXISTS idx_robots_code ON robots(code);
          CREATE INDEX IF NOT EXISTS idx_robots_status ON robots(status);
        `
      })

      if (createError) {
        console.error('Table creation error:', createError)
        // Table might already exist, continue
      }

      return NextResponse.json({ message: 'Table creation attempted' })
    }

    if (action === 'seed') {
      const supabase = getSupabaseAdmin()
      // First check if robots already exist
      const { data: existing } = await supabase
        .from('robots')
        .select('code')

      const existingCodes = new Set(existing?.map(r => r.code) || [])
      const robotsToInsert = YISA_ROBOTS.filter(r => !existingCodes.has(r.code))

      if (robotsToInsert.length === 0) {
        return NextResponse.json({ 
          message: 'All robots already exist',
          count: existing?.length || 0
        })
      }

      const { data, error } = await supabase
        .from('robots')
        .insert(robotsToInsert)
        .select()

      if (error) {
        console.error('Seed error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ 
        message: 'Robots seeded successfully',
        inserted: data?.length || 0,
        robots: data
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (err) {
    console.error('API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH - Robot durumunu güncelle
export async function PATCH(req: Request) {
  try {
    const supabase = getSupabaseAdmin()
    const body = await req.json()
    const { id, status, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'Robot ID required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('robots')
      .update({ 
        status, 
        ...updates,
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Update error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ robot: data })
  } catch (err) {
    console.error('API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
