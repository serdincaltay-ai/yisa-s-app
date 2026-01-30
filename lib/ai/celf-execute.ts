/**
 * YİSA-S CELF Çalıştırıcı
 * Direktörlük + komut → AI çağrısı (GPT/Claude/Gemini/Together).
 * Flow route ve COO run-due tarafından kullanılır.
 * Tarih: 30 Ocak 2026
 */

import { type DirectorKey } from '@/lib/robots/celf-center'
import { getDirectorateConfigMerged } from '@/lib/robots/celf-config-merged'

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages'
const OPENAI_URL = 'https://api.openai.com/v1/chat/completions'
const GOOGLE_GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'
const TOGETHER_URL = 'https://api.together.xyz/v1/chat/completions'

/** Özel iş ve CELF içinde kullanılır; flow route'tan import edilebilir. */
export async function callClaude(message: string, system?: string): Promise<string | null> {
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

/**
 * CELF: Direktörlüğün AI sağlayıcılarından ilk erişilebileni çağırır.
 * Konfigürasyon önce director_rules (DB) ile birleştirilir; dinamik güncelleme Patron onayı ile.
 * V0 ve CURSOR atlanır (API yok / local).
 */
export async function runCelfDirector(
  directorKey: DirectorKey,
  message: string
): Promise<{ text: string; provider: string } | null> {
  const director = await getDirectorateConfigMerged(directorKey)
  const systemHint = director
    ? `${director.name} (${director.work}). Kısa, net, Türkçe yanıt ver.`
    : 'YİSA-S asistan. Kısa, net, Türkçe yanıt ver.'
  const providers = director.aiProviders

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
