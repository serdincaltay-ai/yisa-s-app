/**
 * SEÇENEK 2 - CEO → CELF → Patron Onay (Zincir Zorunlu)
 * Her mesaj: securityCheck → CEO (sınıflandır) → CELF (direktörlük AI'ı) → Sonuç Patron onayına sunulur.
 * Claude direkt cevap vermez; sadece CELF içinde ilgili direktörlükte çalışır.
 * Patron Kararı: 30 Ocak 2026
 */

import { NextRequest, NextResponse } from 'next/server'
import {
  detectTaskType,
  routeToDirector,
  isRoutineRequest,
  getRoutineScheduleFromMessage,
  classifyTask,
} from '@/lib/robots/ceo-robot'
import { getDirectorAIProviders, CELF_DIRECTORATES, runCelfChecks, type DirectorKey } from '@/lib/robots/celf-center'
import { securityCheck } from '@/lib/robots/security-robot'
import { archiveTaskResult } from '@/lib/robots/data-robot'
import { saveChatMessage } from '@/lib/db/chat-messages'
import { savePrivateTask, updatePrivateTaskResult } from '@/lib/db/patron-private'
import { logCelfAudit } from '@/lib/db/celf-audit'
import {
  createCeoTask,
  updateCeoTask,
  createPatronCommand,
  insertCelfLog,
} from '@/lib/db/ceo-celf'

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages'
const OPENAI_URL = 'https://api.openai.com/v1/chat/completions'
const GOOGLE_GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'
const TOGETHER_URL = 'https://api.together.xyz/v1/chat/completions'

async function callClaude(message: string, system?: string): Promise<string | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return null
  const res = await fetch(ANTHROPIC_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 1024,
      system: system ?? 'Sen YİSA-S CELF direktörlük asistanısın. Kısa, net ve Türkçe yanıt ver.',
      messages: [{ role: 'user', content: message }],
    }),
  })
  if (!res.ok) return null
  const data = await res.json()
  return data.content?.find((c: { type: string }) => c.type === 'text')?.text ?? null
}

async function callOpenAI(message: string): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return null
  const res = await fetch(OPENAI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: 'gpt-4-turbo-preview',
      max_tokens: 1024,
      messages: [
        { role: 'system', content: 'Sen YİSA-S CELF direktörlük asistanısın. Kısa, net, Türkçe.' },
        { role: 'user', content: message },
      ],
    }),
  })
  if (!res.ok) return null
  const data = await res.json()
  return data.choices?.[0]?.message?.content ?? null
}

async function callGemini(message: string): Promise<string | null> {
  const apiKey = process.env.GOOGLE_API_KEY ?? process.env.GOOGLE_GEMINI_API_KEY
  if (!apiKey) return null
  const url = `${GOOGLE_GEMINI_URL}?key=${apiKey}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: message }] }],
      generationConfig: { maxOutputTokens: 1024 },
    }),
  })
  if (!res.ok) return null
  const data = await res.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? null
}

async function callTogether(message: string): Promise<string | null> {
  const apiKey = process.env.TOGETHER_API_KEY
  if (!apiKey) return null
  const res = await fetch(TOGETHER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: 'meta-llama/Llama-3-70b-chat-hf',
      max_tokens: 1024,
      messages: [{ role: 'user', content: message }],
    }),
  })
  if (!res.ok) return null
  const data = await res.json()
  return data.choices?.[0]?.message?.content ?? null
}

/** CELF: Direktörlüğün AI sağlayıcılarından ilk erişilebileni çağırır. Claude sadece burada çalışır. */
async function runCelfDirector(
  directorKey: DirectorKey,
  message: string
): Promise<{ text: string; provider: string } | null> {
  const director = CELF_DIRECTORATES[directorKey]
  const systemHint = director
    ? `${director.name} (${director.work}). Kısa, net, Türkçe yanıt ver.`
    : 'YİSA-S asistan. Kısa, net, Türkçe yanıt ver.'
  const providers = getDirectorAIProviders(directorKey)

  for (const provider of providers) {
    if (provider === 'V0' || provider === 'CURSOR') continue
    let out: string | null = null
    switch (provider) {
      case 'GPT':
        out = await callOpenAI(message)
        if (out) return { text: out, provider: 'GPT' }
        break
      case 'CLAUDE':
        out = await callClaude(message, systemHint)
        if (out) return { text: out, provider: 'CLAUDE' }
        break
      case 'GEMINI':
        out = await callGemini(message)
        if (out) return { text: out, provider: 'GEMINI' }
        break
      case 'TOGETHER':
        out = await callTogether(message)
        if (out) return { text: out, provider: 'TOGETHER' }
        break
      default:
        break
    }
  }
  return null
}

function taskTypeToLabel(taskType: string): string {
  const map: Record<string, string> = {
    research: 'araştırma',
    design: 'tasarım',
    code: 'kod',
    report: 'rapor',
    general: 'genel',
  }
  return map[taskType] ?? taskType
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const message = typeof body.message === 'string' ? body.message : (body.message ?? 'Merhaba')
    const user = body.user ?? null
    const userId = typeof body.user_id === 'string' ? body.user_id : (user?.id as string | undefined)
    const ipAddress = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? undefined

    // ─── a) Önce securityCheck ─────────────────────────────────────────────
    const security = await securityCheck({
      message,
      userId,
      ipAddress,
      logToDb: true,
    })
    if (!security.allowed) {
      return NextResponse.json(
        { error: security.reason ?? 'Bu işlem AI için yasaktır.', blocked: true },
        { status: 403 }
      )
    }

    // ─── b) CEO: İş sınıflandırması (şirket / özel / belirsiz) ──────────────
    const taskClassification = classifyTask(message)

    if (taskClassification === 'unclear') {
      return NextResponse.json({
        status: 'classification_unclear',
        message: 'Bu şirketle ilgili mi, yoksa özel bir iş mi?',
        flow: 'CEO sınıflandırma',
      })
    }

    if (taskClassification === 'private') {
      if (!userId) {
        return NextResponse.json({ error: 'Özel iş için giriş gerekli.' }, { status: 401 })
      }
      const privateTask = await savePrivateTask({ patron_id: userId, command: message, task_type: 'genel' })
      if (privateTask.error) {
        return NextResponse.json({ error: privateTask.error }, { status: 500 })
      }
      const privateResult = await callClaude(message, 'Sen Patronun kişisel asistanısın. Şirket verisine erişmeden, kısa ve Türkçe yanıt ver.')
      const resultText = privateResult ?? 'Yanıt oluşturulamadı.'
      if (privateTask.id) await updatePrivateTaskResult(privateTask.id, resultText)
      await saveChatMessage({
        user_id: userId,
        message,
        response: resultText,
        ai_providers: ['CLAUDE'],
      })
      return NextResponse.json({
        status: 'private_done',
        flow: 'Patron özel iş (CELF\'e gitmez)',
        text: resultText,
        private_task_id: privateTask.id ?? undefined,
      })
    }

    // ─── ŞİRKET İŞİ: CEO → CELF (direktörlük + denetim) → Patron Onay ───────
    const taskType = detectTaskType(message)
    let directorKey = routeToDirector(message)
    if (!directorKey) directorKey = 'CCO' as DirectorKey
    const taskTypeLabel = taskTypeToLabel(taskType)

    const ceoTaskResult = await createCeoTask({
      user_id: userId,
      task_description: message,
      task_type: taskTypeLabel,
      director_key: directorKey,
    })
    const ceoTaskId = ceoTaskResult.id ?? undefined
    if (ceoTaskId) {
      await insertCelfLog({
        ceo_task_id: ceoTaskId,
        director_key: directorKey,
        action: 'ceo_classify',
        input_summary: message.substring(0, 200),
        output_summary: `${taskTypeLabel} → ${directorKey}`,
      })
    }

    // ─── CELF iç denetim: veri erişim, koruma, onay, veto ───────────────────
    const celfAudit = runCelfChecks({
      directorKey,
      taskId: ceoTaskId,
      requiredData: [],
      affectedData: [],
      operation: message,
    })
    if (ceoTaskId) {
      await logCelfAudit({
        task_id: ceoTaskId,
        director_key: directorKey,
        check_type: 'data_access',
        check_result: celfAudit.errors.length ? 'failed' : 'passed',
        details: { errors: celfAudit.errors, warnings: celfAudit.warnings },
      })
      await logCelfAudit({
        task_id: ceoTaskId,
        director_key: directorKey,
        check_type: celfAudit.vetoBlocked ? 'veto' : 'approval',
        check_result: celfAudit.vetoBlocked ? 'failed' : (celfAudit.warnings.length ? 'warning' : 'passed'),
        details: { vetoBlocked: celfAudit.vetoBlocked, warnings: celfAudit.warnings },
      })
    }
    if (!celfAudit.passed) {
      return NextResponse.json({
        status: 'celf_check_failed',
        flow: 'CEO → CELF denetim',
        errors: celfAudit.errors,
        warnings: celfAudit.warnings,
        veto_blocked: celfAudit.vetoBlocked,
        message: celfAudit.errors[0] ?? 'CELF denetimi geçilemedi.',
      })
    }

    // ─── c) CELF: İlgili direktörlük AI'ını çalıştır ───────────────────────
    const celfResult = await runCelfDirector(directorKey, message)
    const displayText = celfResult?.text ?? 'Yanıt oluşturulamadı. API anahtarlarını (.env) kontrol edin.'
    const aiProvider = celfResult?.provider ?? '—'
    const aiProviders = celfResult ? [celfResult.provider] : []

    // ─── d) CEO sonucu toplar: task_results'a kaydet ───────────────────────
    await archiveTaskResult({
      taskId: ceoTaskId,
      directorKey,
      aiProviders,
      inputCommand: message,
      outputResult: displayText,
      status: 'completed',
    })

    if (ceoTaskId) {
      await updateCeoTask(ceoTaskId, {
        status: 'completed',
        result_payload: {
          taskType: taskTypeLabel,
          director_key: directorKey,
          displayText,
          aiProvider,
        },
      })
      await insertCelfLog({
        ceo_task_id: ceoTaskId,
        director_key: directorKey,
        action: 'celf_execute',
        input_summary: message.substring(0, 200),
        output_summary: displayText.substring(0, 300),
        payload: { providers: aiProviders },
      })
    }

    // ─── e) Patrona sun: Her zaman onay kuyruğuna al ───────────────────────
    const cmd = await createPatronCommand({
      user_id: userId,
      command: message,
      ceo_task_id: ceoTaskId,
      output_payload: {
        displayText,
        task_type: taskTypeLabel,
        director_key: directorKey,
        director_name: CELF_DIRECTORATES[directorKey]?.name ?? directorKey,
        ai_providers: aiProviders,
        flow: 'CEO → CELF → Patron Onay',
      },
    })
    const commandId = cmd.id

    if (ceoTaskId && commandId) {
      await updateCeoTask(ceoTaskId, { patron_command_id: commandId })
    }

    if (userId) {
      await saveChatMessage({
        user_id: userId,
        message,
        response: 'Patron onayı bekleniyor. Onay kuyruğunu kontrol edin.',
        ai_providers: aiProviders.length ? aiProviders : [],
      })
    }

    const routineRequest = isRoutineRequest(message)
    const routineSchedule = getRoutineScheduleFromMessage(message)

    // ─── f) Yanıt: Her zaman awaiting_patron_approval; sonuç onaydan sonra gösterilir ─
    return NextResponse.json({
      status: 'awaiting_patron_approval',
      flow: 'CEO → CELF → Patron Onay',
      text: displayText,
      command_id: commandId,
      ceo_task_id: ceoTaskId,
      director_key: directorKey,
      director_name: CELF_DIRECTORATES[directorKey]?.name ?? directorKey,
      task_type: taskTypeLabel,
      ai_provider: aiProvider,
      routine_request: routineRequest,
      routine_schedule: routineSchedule ?? undefined,
      message: 'Sonuç Patron onayına sunuldu. Onayla / Reddet / Değiştir ile karar verin.',
    })
  } catch (e) {
    const err = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ error: 'Flow hatası', detail: err }, { status: 500 })
  }
}
