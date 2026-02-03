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
  template_id?: string
  name: string
  type: string
  used_count?: number
  where_used?: string
  created_at: string
  source?: 'ceo' | 'db'
  director_key?: string
  is_approved?: boolean
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
            template_id: String(row.id ?? row.uuid ?? ''),
            name: String(row.name ?? row.title ?? row.ad ?? row.slug ?? '—'),
            type: String(row.type ?? row.category ?? row.kategori ?? 'şablon'),
            used_count: typeof row.used_count === 'number' ? row.used_count : typeof row.kullanim_sayisi === 'number' ? row.kullanim_sayisi : undefined,
            where_used: row.where_used != null ? String(row.where_used) : undefined,
            created_at: String(row.created_at ?? row.olusturma_tarihi ?? ''),
            source: 'db' as const,
          }))
          break
        }
      }

      // ceo_templates'i de ekle (robot üretimi)
      try {
        const { data: ceoData } = await supabase
          .from('ceo_templates')
          .select('id, template_name, template_type, director_key, is_approved, created_at')
          .order('created_at', { ascending: false })
          .limit(100)
        if (Array.isArray(ceoData) && ceoData.length > 0) {
          const ceoTemplates: TemplateItem[] = ceoData.map((row: Record<string, unknown>) => ({
            id: 'ceo-' + String(row.id ?? ''),
            template_id: String(row.id ?? ''),
            name: String(row.template_name ?? '—'),
            type: String(row.template_type ?? 'rapor'),
            director_key: row.director_key != null ? String(row.director_key) : undefined,
            used_count: undefined,
            where_used: row.director_key != null ? `CEO · ${row.director_key}` : 'CEO',
            created_at: String(row.created_at ?? ''),
            source: 'ceo' as const,
            is_approved: row.is_approved === true,
          }))
          templates = [...ceoTemplates, ...templates]
        }
      } catch (_) {
        // ceo_templates tablosu yoksa devam et
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
