import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import {
  updatePatronCommand,
  updateCeoTask,
  insertAuditLog,
  getPatronCommand,
} from '@/lib/db/ceo-celf'
import { createCeoRoutine, type ScheduleType } from '@/lib/db/ceo-routines'
import { githubPush } from '@/lib/api/github-client'
import { fetchWithRetry } from '@/lib/api/fetch-with-retry'

export const dynamic = 'force-dynamic'

const ALLOWED_STATUSES = new Set(['pending', 'approved', 'rejected', 'cancelled', 'modified'])

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

export interface ApprovalItem {
  id: string
  type: string
  title: string
  description?: string
  status: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'modified'
  priority?: 'low' | 'normal' | 'high'
  created_at: string
  source?: string
  has_github_commit?: boolean
}

export async function GET() {
  try {
    const supabase = getSupabase()
    if (!supabase) {
      return NextResponse.json({ error: 'Veritabanı bağlantısı yok (SUPABASE_SERVICE_ROLE_KEY gerekli)', items: [], table: null }, { status: 503 })
    }

    const { data, error } = await supabase
      .from('patron_commands')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      return NextResponse.json({ error: error.message, items: [], table: null }, { status: 500 })
    }

    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json({ items: [], table: 'patron_commands' })
    }

    const items: ApprovalItem[] = data.map((row: Record<string, unknown>) => {
      const rawStatus = String(row.status ?? 'pending')
      const status = (ALLOWED_STATUSES.has(rawStatus) ? rawStatus : 'pending') as ApprovalItem['status']
      const outputPayload = row.output_payload as Record<string, unknown> | null
      const hasGithubCommit = !!(outputPayload?.github_prepared_commit)

      return {
        id: String(row.id ?? ''),
        type: String(row.type ?? 'onay'),
        title: String(row.title ?? row.command ?? '—'),
        description: row.description != null ? String(row.description) : undefined,
        status,
        priority: (row.priority as 'low' | 'normal' | 'high') ?? 'normal',
        created_at: String(row.created_at ?? ''),
        source: row.source != null ? String(row.source) : undefined,
        has_github_commit: hasGithubCommit,
      }
    })

    return NextResponse.json({ items, table: 'patron_commands' })
  } catch (e) {
    const err = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ error: err, items: [], table: null }, { status: 500 })
  }
}

/**
 * POST /api/approvals — Patron kararı
 * decision: 'approve' | 'reject' | 'cancel' | 'modify' | 'suggest' | 'push'
 * 
 * approve: İşi onayla (approved) — otomatik deploy/push YOK
 * reject: İşi reddet (rejected) — "Bu işi yapmak istemiyorum"
 * cancel: İşi iptal et (cancelled) — "Bu iş geçersiz/yanlış açıldı"
 * modify: İşi değiştir (modified) — Yeniden düzenleme için
 * suggest: Öneri iste — GPT ile iyileştirme önerileri
 * push: GitHub'a push et — SADECE onaylanmış ve commit hazır işlerde
 * 
 * cancel_all: true → Bekleyen + onaylanmış tüm işleri iptal eder
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const commandId = typeof body.command_id === 'string' ? body.command_id : undefined
    const decision = body.decision as 'approve' | 'reject' | 'cancel' | 'modify' | 'suggest' | 'push'
    const cancelAll = body.cancel_all === true
    const userId = typeof body.user_id === 'string' ? body.user_id : undefined
    const modifyText = typeof body.modify_text === 'string' ? body.modify_text : undefined
    const saveRoutine = body.save_routine === true
    const schedule = (body.schedule as ScheduleType) ?? undefined

    const supabase = getSupabase()
    if (!supabase) {
      return NextResponse.json({ error: 'Veritabanı bağlantısı yok' }, { status: 503 })
    }

    // ═══════════════════════════════════════════════════════════════════════
    // Tümünü İptal Et — sadece Patron
    // ═══════════════════════════════════════════════════════════════════════
    if (cancelAll) {
      const { data: rows, error: fetchErr } = await supabase
        .from('patron_commands')
        .select('id, ceo_task_id, status')
        .in('status', ['pending', 'approved', 'modified'])
        .limit(200)
      if (fetchErr) return NextResponse.json({ error: fetchErr.message }, { status: 500 })
      
      const list = (rows ?? []) as { id: string; ceo_task_id: string | null; status: string }[]
      const now = new Date().toISOString()
      let cancelledCount = 0
      
      for (const row of list) {
        const upd = await updatePatronCommand(row.id, {
          status: 'cancelled',
          decision: 'cancel',
          decision_at: now,
        })
        if (!upd.error) {
          cancelledCount++
          if (row.ceo_task_id) await updateCeoTask(row.ceo_task_id, { status: 'cancelled' })
          await insertAuditLog({
            action: 'cancel_all',
            entity_type: 'patron_command',
            entity_id: row.id,
            user_id: userId,
            payload: { cancel_all: true, previous_status: row.status },
          })
        }
      }
      return NextResponse.json({
        ok: true,
        cancelled_count: cancelledCount,
        message: cancelledCount === 0 ? 'İptal edilecek iş yok.' : `${cancelledCount} iş iptal edildi.`,
      })
    }

    if (!commandId) {
      return NextResponse.json({ error: 'command_id gerekli' }, { status: 400 })
    }

    // ═══════════════════════════════════════════════════════════════════════
    // Rutin kaydı
    // ═══════════════════════════════════════════════════════════════════════
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
      return NextResponse.json({ ok: true, routine_id: id, message: 'Rutin görev kaydedildi.' })
    }

    if (!decision) {
      return NextResponse.json({ error: 'decision gerekli (approve, reject, cancel, modify, suggest, push)' }, { status: 400 })
    }
    if (!['approve', 'reject', 'cancel', 'modify', 'suggest', 'push'].includes(decision)) {
      return NextResponse.json({ error: 'Geçersiz decision' }, { status: 400 })
    }

    // ═══════════════════════════════════════════════════════════════════════
    // Öneri İste (suggest)
    // ═══════════════════════════════════════════════════════════════════════
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
      const res = await fetchWithRetry('https://api.openai.com/v1/chat/completions', {
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

    // ═══════════════════════════════════════════════════════════════════════
    // GitHub Push (AYRI ADIM - sadece onaylanmış + commit hazır işlerde)
    // ═══════════════════════════════════════════════════════════════════════
    if (decision === 'push') {
      const cmd = await getPatronCommand(commandId)
      if (cmd.error) {
        return NextResponse.json({ error: 'Komut bulunamadı' }, { status: 404 })
      }
      if (cmd.status !== 'approved') {
        return NextResponse.json({ error: 'Push için önce işi onaylamanız gerekir.' }, { status: 400 })
      }
      const gh = cmd.output_payload?.github_prepared_commit as
        | { commitSha: string; owner: string; repo: string; branch?: string }
        | undefined
      if (!gh?.commitSha || !gh?.owner || !gh?.repo) {
        return NextResponse.json({ error: 'Bu işte hazırlanmış GitHub commit yok.' }, { status: 400 })
      }
      const pushResult = await githubPush({
        owner: gh.owner,
        repo: gh.repo,
        branch: gh.branch ?? 'main',
        commitSha: gh.commitSha,
      })
      await insertAuditLog({
        action: 'push',
        entity_type: 'patron_command',
        entity_id: commandId,
        user_id: userId,
        payload: { github: gh, result: pushResult },
      })
      if (!pushResult.ok) {
        return NextResponse.json({ ok: false, error: `GitHub push başarısız: ${pushResult.error}` }, { status: 500 })
      }
      return NextResponse.json({ ok: true, message: 'GitHub push başarılı.', github_push: 'pushed' })
    }

    // ═══════════════════════════════════════════════════════════════════════
    // Normal kararlar: approve / reject / cancel / modify
    // ═══════════════════════════════════════════════════════════════════════
    const now = new Date().toISOString()

    let resultText: string | undefined
    if (decision === 'approve') {
      const cmd = await getPatronCommand(commandId)
      const payload = cmd.output_payload ?? {}
      resultText = typeof payload.displayText === 'string' ? payload.displayText : undefined
    }

    const status =
      decision === 'approve' ? 'approved'
      : decision === 'reject' ? 'rejected'
      : decision === 'cancel' ? 'cancelled'
      : 'modified'

    const updateErr = await updatePatronCommand(commandId, {
      status,
      decision,
      decision_at: now,
      modify_text: modifyText,
    })
    if (updateErr.error) {
      return NextResponse.json({ error: updateErr.error }, { status: 500 })
    }

    // ceo_tasks senkronizasyonu
    const cmdForCeo = await getPatronCommand(commandId)
    if (cmdForCeo.ceo_task_id && !cmdForCeo.error) {
      const ceoStatus =
        decision === 'approve' ? 'completed'
        : decision === 'reject' || decision === 'cancel' ? 'cancelled'
        : undefined
      if (ceoStatus) {
        await updateCeoTask(cmdForCeo.ceo_task_id, { status: ceoStatus })
      }
    }

    await insertAuditLog({
      action: decision,
      entity_type: 'patron_command',
      entity_id: commandId,
      user_id: userId,
      payload: { modify_text: modifyText },
    })

    const message =
      decision === 'approve' ? 'İşlem onaylandı. GitHub push için ayrıca "Push Et" butonunu kullanın.'
      : decision === 'reject' ? 'İşlem reddedildi.'
      : decision === 'cancel' ? 'İşlem iptal edildi.'
      : 'Değişiklik kaydedildi.'

    return NextResponse.json({
      ok: true,
      command_id: commandId,
      decision,
      status,
      result: resultText,
      message,
    })
  } catch (e) {
    const err = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ error: 'Onay kararı hatası', detail: err }, { status: 500 })
  }
}