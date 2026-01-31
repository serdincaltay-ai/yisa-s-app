import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

export async function GET() {
  try {
    const supabase = getSupabase()
    
    if (!supabase) {
      return NextResponse.json(
        { agents: [], error: 'Supabase bağlantısı yapılandırılmamış' },
        { status: 500 }
      )
    }

    const { data, error } = await supabase
      .from('agent_states')
      .select('*')
      .order('updated_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        { agents: [], error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ agents: data ?? [] })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Bilinmeyen hata'
    return NextResponse.json(
      { agents: [], error: message },
      { status: 500 }
    )
  }
}
