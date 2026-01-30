import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import {
  updatePatronCommand,
  insertAuditLog,
  getPatronCommand,
} from '@/lib/db/ceo-celf'
import { createCeoRoutine, type ScheduleType } from '@/lib/db/ceo-routines'

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
 * POST /api/approvals — Patron kararı: Onayla / Reddet / Öneri İste / Değiştir
 * Body: { command_id, decision: 'approve'|'reject'|'modify'|'suggest', user_id?, modify_text? }
 * Onay sonrası rutin kaydı: { command_id, save_routine: true, schedule: 'daily'|'weekly'|'monthly' }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const commandId = typeof body.command_id === 'string' ? body.command_id : undefined
    const decision = body.decision as 'approve' | 'reject' | 'modify' | 'suggest'
    const userId = typeof body.user_id === 'string' ? body.user_id : undefined
    const modifyText = typeof body.modify_text === 'string' ? body.modify_text : undefined
    const saveRoutine = body.save_routine === true
    const schedule = (body.schedule as ScheduleType) ?? undefined

    if (!commandId) {
      return NextResponse.json({ error: 'command_id gerekli' }, { status: 400 })
    }

    // Rutin kaydı: onaylanmış komuttan ceo_routines oluştur
    if (saveRoutine && schedule && ['daily', 'weekly', 'monthly'].includes(schedule)) {
      const cmd = await getPatronCommand(commandId)
      if (cmd.error || !cmd.command) {
        return NextResponse.json({ error: 'Komut bulunamadı' }, { status: 404 })
      }
      const payload = cmd.output_payload ?? {}
      const directorKey = (typeof payload.director_key === 'string' ? payload.director_key : 'CCO') as string
      const { id, error } = await createCeoRoutine({
        routine_name: `Rutin: ${(cmd.command as string).substring(0, 50)}`,
        routine_type: 'rapor',
        director_key: directorKey,
        command_template: cmd.command as string,
        schedule,
        schedule_time: '02:00',
        created_by: userId ?? undefined,
      })
      if (error) return NextResponse.json({ error }, { status: 500 })
      return NextResponse.json({ ok: true, routine_id: id, message: 'Rutin görev kaydedildi. COO zamanı gelince çalıştıracak.' })
    }

    if (!decision) {
      return NextResponse.json({ error: 'decision gerekli (approve, reject, modify, suggest)' }, { status: 400 })
    }
    if (!['approve', 'reject', 'modify', 'suggest'].includes(decision)) {
      return NextResponse.json({ error: 'Geçersiz decision' }, { status: 400 })
    }

    // Öneri İste: mevcut çıktı için geliştirme önerileri (GPT/Claude ile)
    if (decision === 'suggest') {
      const cmd = await getPatronCommand(commandId)
      if (cmd.error || !cmd.output_payload) {
        return NextResponse.json({ error: 'Komut bulunamadı' }, { status: 404 })
      }
      const displayText = typeof cmd.output_payload.displayText === 'string' ? cmd.output_payload.displayText : ''
      const apiKey = process.env.OPENAI_API_KEY
      if (!apiKey) {
        return NextResponse.json({ suggestions: 'Öneri servisi şu an kullanılamıyor.', ok: true })
      }
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: 'gpt-4-turbo-preview',
          max_tokens: 512,
          messages: [
            { role: 'system', content: 'Sen YİSA-S kalite asistanısın. Verilen çıktıyı inceleyip geliştirilebilecek 3-5 kısa öneri ver. Türkçe, madde madde.' },
            { role: 'user', content: `Görev: ${cmd.command}\n\nMevcut çıktı:\n${displayText}\n\nGeliştirme önerileri (kısa, net):` },
          ],
        }),
      })
      if (!res.ok) {
        return NextResponse.json({ suggestions: 'Öneri alınamadı.', ok: true })
      }
      const data = await res.json()
      const suggestions = data.choices?.[0]?.message?.content ?? 'Öneri oluşturulamadı.'
      return NextResponse.json({ ok: true, suggestions })
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
