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

export interface TemplateItem {
  id: string
  name: string
  type: string
  used_count?: number
  where_used?: string
  created_at: string
}

export interface RDSuggestion {
  id: string
  title: string
  description?: string
  source: string
  status: string
  created_at: string
}

export async function GET() {
  try {
    const supabase = getSupabase()
    const templateTables = ['templates', 'sablonlar', 'template_pool', 'design_templates']
    let templates: TemplateItem[] = []
    let suggestions: RDSuggestion[] = []

    if (supabase) {
      for (const table of templateTables) {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100)
        if (error) continue
        if (Array.isArray(data) && data.length > 0) {
          templates = data.map((row: Record<string, unknown>) => ({
            id: String(row.id ?? row.uuid ?? ''),
            name: String(row.name ?? row.title ?? row.slug ?? '—'),
            type: String(row.type ?? row.category ?? 'şablon'),
            used_count: typeof row.used_count === 'number' ? row.used_count : undefined,
            where_used: row.where_used != null ? String(row.where_used) : undefined,
            created_at: String(row.created_at ?? ''),
          }))
          break
        }
      }

      const suggestionTables = ['rd_suggestions', 'ceo_updates', 'ar_ge', 'suggestions']
      for (const table of suggestionTables) {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50)
        if (error) continue
        if (Array.isArray(data) && data.length > 0) {
          suggestions = data.map((row: Record<string, unknown>) => ({
            id: String(row.id ?? row.uuid ?? ''),
            title: String(row.title ?? row.name ?? '—'),
            description: row.description != null ? String(row.description) : undefined,
            source: String(row.source ?? 'CEO'),
            status: String(row.status ?? 'pending'),
            created_at: String(row.created_at ?? ''),
          }))
          break
        }
      }
    }

    return NextResponse.json({ templates, suggestions })
  } catch {
    return NextResponse.json({ templates: [], suggestions: [] })
  }
}
