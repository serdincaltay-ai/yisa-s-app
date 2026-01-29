/**
 * SEÇENEK 2 - Kalite Optimize Flow API
 * PATRON → CEO (sınıflandır) → CELF (direktörlük) → GPT/Gemini/Claude... → CEO → PATRON ONAY
 * Patron Kararı: 29 Ocak 2026
 */

import { NextRequest, NextResponse } from 'next/server'
import { routeToAI, detectTaskType, type CallAIFn } from '@/lib/ai-router'
import { routeToDirector, isRoutineRequest, getRoutineScheduleFromMessage } from '@/lib/robots/ceo-robot'
import { securityCheck } from '@/lib/robots/security-robot'
import { archiveTaskResult } from '@/lib/robots/data-robot'
import { saveChatMessage } from '@/lib/db/chat-messages'
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
      system: system ?? 'Sen YİSA-S Patron Asistanısın. Kısa, net ve Türkçe yanıt ver.',
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
        { role: 'system', content: 'Sen YİSA-S koordinatörüsün. Kısa, net, Türkçe.' },
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
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text
  return text ?? null
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

/** Önceki adımların metin çıktılarını topla (Claude düzeltme/son kontrol için) */
function getAccumulatedText(inp: Record<string, unknown>, inputMessage: string): string {
  const parts: string[] = []
  const keys = ['task_type', 'research_data', 'raw_code', 'design_code', 'final_report', 'corrected_output', 'approved_output']
  for (const k of keys) {
    const v = inp[k]
    if (v && typeof v === 'object' && 'text' in v && typeof (v as { text: string }).text === 'string') {
      parts.push((v as { text: string }).text)
    }
  }
  if (parts.length > 0) return parts.join('\n\n---\n\n')
  return typeof inp?.message === 'string' ? inp.message : inputMessage
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

    // 1. CEO: Görevi sınıflandır (araştırma/tasarım/kod/genel) ve direktörlüğe yönlendir
    const taskType = detectTaskType(message)
    const directorKey = routeToDirector(message)
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
        director_key: directorKey ?? 'GENEL',
        action: 'ceo_classify',
        input_summary: message.substring(0, 200),
        output_summary: `${taskTypeLabel} → ${directorKey ?? '—'}`,
      })
    }

    const inputMessage =
      typeof (body as { output?: { message?: string } }).output?.message === 'string'
        ? (body as { output: { message: string } }).output.message
        : message

    const callAIFn: CallAIFn = async (provider, input) => {
      const inp = (input || {}) as Record<string, unknown>
      const textForClaude = getAccumulatedText(inp, inputMessage)
      const text = typeof inp?.message === 'string' ? inp.message : textForClaude

      switch (provider) {
        case 'GPT': {
          const out = await callOpenAI(text)
          if (out == null) return { provider: 'GPT', status: 'skipped', reason: 'API key yok' }
          return { provider: 'GPT', text: out, status: 'ok' }
        }
        case 'CLAUDE': {
          const out = await callClaude(textForClaude)
          if (out == null) return { provider: 'CLAUDE', status: 'skipped', reason: 'API key yok' }
          return { provider: 'CLAUDE', text: out, status: 'ok' }
        }
        case 'GEMINI': {
          const out = await callGemini(text)
          if (out == null) return { provider: 'GEMINI', status: 'skipped', reason: 'API key yok' }
          return { provider: 'GEMINI', text: out, status: 'ok' }
        }
        case 'TOGETHER': {
          const out = await callTogether(text)
          if (out == null) return { provider: 'TOGETHER', status: 'skipped', reason: 'API key yok' }
          return { provider: 'TOGETHER', text: out, status: 'ok' }
        }
        case 'V0':
        case 'CURSOR':
        case 'SYSTEM':
          return { provider, status: 'skipped', reason: 'local or system' }
        default:
          return { provider, status: 'skipped', reason: 'unknown' }
      }
    }

    const result = await routeToAI(message, { user }, callAIFn)

    const lastOk = result.aiResponses.find(
      (r) => (r.response as { status?: string })?.status === 'ok' && (r.response as { text?: string })?.text
    )
    const lastText = lastOk ? (lastOk.response as { text: string }).text : null
    const displayText =
      lastText ??
      (result.output.approved_output as { text?: string } | undefined)?.text ??
      (result.output.corrected_output as { text?: string } | undefined)?.text ??
      (result.output.final_report as { text?: string } | undefined)?.text ??
      (result.aiResponses.some((r) => (r.response as { status?: string })?.status === 'skipped')
        ? 'Yanıt oluşturulamadı. API anahtarlarını (.env) kontrol edin.'
        : 'İşlem tamamlandı.')

    const aiProviders = result.aiResponses
      .filter(
        (r) =>
          (r.response as { status?: string })?.status === 'ok' &&
          (r.response as { text?: string })?.text
      )
      .map((r) => r.provider)

    let commandId: string | undefined
    if (result.status === 'awaiting_patron_approval') {
      const cmd = await createPatronCommand({
        user_id: userId,
        command: message,
        ceo_task_id: ceoTaskId,
        output_payload: {
          ...result.output,
          displayText: typeof displayText === 'string' ? displayText : JSON.stringify(displayText),
          aiResponses: result.aiResponses.map((r) => ({
            provider: r.provider,
            response: r.response,
          })),
        },
      })
      commandId = cmd.id
    }

    if (ceoTaskId) {
      await updateCeoTask(ceoTaskId, {
        status: 'completed',
        result_payload: {
          taskType: result.output.taskType,
          displayText: typeof displayText === 'string' ? displayText : JSON.stringify(displayText),
          aiResponses: result.aiResponses.length,
        },
        ...(commandId ? { patron_command_id: commandId } : {}),
      })
      await insertCelfLog({
        ceo_task_id: ceoTaskId,
        director_key: directorKey ?? 'GENEL',
        action: 'celf_execute',
        input_summary: message.substring(0, 200),
        output_summary: (typeof displayText === 'string' ? displayText : '').substring(0, 300),
        payload: { providers: aiProviders },
      })
    }

    if (userId) {
      await saveChatMessage({
        user_id: userId,
        message,
        response: typeof displayText === 'string' ? displayText : JSON.stringify(displayText),
        ai_providers: aiProviders.length ? aiProviders : ['CLAUDE'],
      })
    }

    await archiveTaskResult({
      taskId: ceoTaskId,
      directorKey: directorKey ?? undefined,
      aiProviders,
      inputCommand: message,
      outputResult: typeof displayText === 'string' ? displayText : JSON.stringify(displayText),
      status: 'completed',
    })

    const routineRequest = isRoutineRequest(message)
    const routineSchedule = getRoutineScheduleFromMessage(message)

    return NextResponse.json({
      status: result.status,
      output: result.output,
      aiResponses: result.aiResponses.map((r) => ({
        provider: r.provider,
        response: r.response,
        timestamp: r.timestamp,
      })),
      flow: result.flow,
      text: typeof displayText === 'string' ? displayText : JSON.stringify(displayText),
      command_id: commandId,
      ceo_task_id: ceoTaskId,
      routine_request: routineRequest,
      routine_schedule: routineSchedule ?? undefined,
    })
  } catch (e) {
    const err = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ error: 'Flow hatası', detail: err }, { status: 500 })
  }
}
