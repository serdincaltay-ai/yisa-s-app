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

export interface ApprovalItem {
  id: string
  type: string
  title: string
  description?: string
  status: 'pending' | 'approved' | 'rejected'
  priority?: 'low' | 'normal' | 'high'
  created_at: string
  source?: string
}

export async function GET() {
  try {
    const supabase = getSupabase()
    const tables = ['approval_queue', 'pending_approvals', 'workflow_tasks', 'approvals']

    for (const table of tables) {
      if (!supabase) break
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)
      if (error) continue
      if (!Array.isArray(data) || data.length === 0) continue

      const items: ApprovalItem[] = data.map((row: Record<string, unknown>) => ({
        id: String(row.id ?? row.uuid ?? ''),
        type: String(row.type ?? row.kind ?? 'onay'),
        title: String(row.title ?? row.subject ?? row.name ?? '—'),
        description: row.description != null ? String(row.description) : undefined,
        status: (row.status as 'pending' | 'approved' | 'rejected') ?? 'pending',
        priority: (row.priority as 'low' | 'normal' | 'high') ?? 'normal',
        created_at: String(row.created_at ?? ''),
        source: row.source != null ? String(row.source) : undefined,
      }))
      return NextResponse.json({ items, table })
    }

    return NextResponse.json({ items: [], table: null })
  } catch {
    return NextResponse.json({ items: [], table: null })
  }
}
