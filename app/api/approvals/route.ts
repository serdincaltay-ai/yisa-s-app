import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import {
  updatePatronCommand,
  insertAuditLog,
  getPatronCommand,
} from '@/lib/db/ceo-celf'

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
    const tables = ['patron_commands', 'approval_queue', 'pending_approvals', 'workflow_tasks', 'approvals']

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
        title: String(row.title ?? row.subject ?? row.name ?? row.command ?? '—'),
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

/**
 * POST /api/approvals — Patron kararı: Onayla / Reddet / Değiştir
 * Body: { command_id: string, decision: 'approve' | 'reject' | 'modify', user_id?: string, modify_text?: string }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const commandId = typeof body.command_id === 'string' ? body.command_id : undefined
    const decision = body.decision as 'approve' | 'reject' | 'modify'
    const userId = typeof body.user_id === 'string' ? body.user_id : undefined
    const modifyText = typeof body.modify_text === 'string' ? body.modify_text : undefined

    if (!commandId || !decision) {
      return NextResponse.json(
        { error: 'command_id ve decision gerekli (approve, reject, modify)' },
        { status: 400 }
      )
    }
    if (!['approve', 'reject', 'modify'].includes(decision)) {
      return NextResponse.json({ error: 'Geçersiz decision' }, { status: 400 })
    }

    const now = new Date().toISOString()

    // Onay öncesi komutu al (onay sonrası aksiyon için payload gerekli)
    let resultText: string | undefined
    if (decision === 'approve') {
      const cmd = await getPatronCommand(commandId)
      const payload = cmd.output_payload ?? {}
      resultText =
        typeof payload.displayText === 'string'
          ? payload.displayText
          : undefined
    }

    const status =
      decision === 'approve' ? 'approved' : decision === 'reject' ? 'rejected' : 'modified'

    const updateErr = await updatePatronCommand(commandId, {
      status,
      decision,
      decision_at: now,
      modify_text: modifyText,
    })
    if (updateErr.error) {
      return NextResponse.json({ error: updateErr.error }, { status: 500 })
    }

    await insertAuditLog({
      action: decision,
      entity_type: 'patron_command',
      entity_id: commandId,
      user_id: userId,
      payload: { modify_text: modifyText },
    })

    return NextResponse.json({
      ok: true,
      command_id: commandId,
      decision,
      status,
      result: resultText,
      message:
        decision === 'approve'
          ? 'İşlem onaylandı ve uygulandı.'
          : decision === 'reject'
            ? 'İşlem reddedildi.'
            : 'Değişiklik kaydedildi. Yeniden işlem için mesajı güncelleyip gönderin.',
    })
  } catch (e) {
    const err = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ error: 'Onay kararı hatası', detail: err }, { status: 500 })
  }
}
