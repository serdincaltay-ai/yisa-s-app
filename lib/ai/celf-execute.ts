/**
 * YİSA-S CELF Çalıştırıcı
 * CELF önce Gemini'yi çağırır; Gemini görevlendirmeyi yapar (kendisi yanıtlar veya API'ye devreder).
 * En son işi yapan sonucu CELF'e teslim eder; CELF CEO/Patron'a iletir.
 * Tarih: 30 Ocak 2026
 */

import { type DirectorKey } from '@/lib/robots/celf-center'
import { getDirectorateConfigMerged } from '@/lib/robots/celf-config-merged'

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages'
const OPENAI_URL = 'https://api.openai.com/v1/chat/completions'
const GOOGLE_GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'
const GOOGLE_GEMINI_15_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'
const TOGETHER_URL = 'https://api.together.xyz/v1/chat/completions'

const DELEGATE_PREFIX = 'DELEGATE:'

/** .env'den okunan anahtarı trim'le; baştaki/sondaki boşluk API hatasına yol açar */
function getEnv(key: string): string | undefined {
  const v = process.env[key]
  return typeof v === 'string' ? v.trim() || undefined : undefined
}

/** CELF tarafı anahtarlar (ayrı key; yoksa genel key) */
function getCelfKey(envKey: string, fallbackKeys: string[]): string | undefined {
  const v = getEnv(envKey)
  if (v) return v
  for (const k of fallbackKeys) {
    const f = getEnv(k)
    if (f) return f
  }
  return undefined
}

/** Özel iş (Asistan) veya CELF içinde kullanılır. context='asistan' → ASISTAN_ANTHROPIC_API_KEY */
export async function callClaude(
  message: string,
  system?: string,
  context?: 'asistan' | 'celf'
): Promise<string | null> {
  const apiKey =
    context === 'asistan'
      ? getEnv('ASISTAN_ANTHROPIC_API_KEY') ?? getEnv('ANTHROPIC_API_KEY')
      : getCelfKey('CELF_ANTHROPIC_API_KEY', ['ANTHROPIC_API_KEY'])
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
  const apiKey = getCelfKey('CELF_OPENAI_API_KEY', ['OPENAI_API_KEY'])
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

async function callGemini(message: string, systemHint?: string): Promise<string | null> {
  const apiKey = getCelfKey('CELF_GOOGLE_API_KEY', ['CELF_GOOGLE_GEMINI_API_KEY', 'GOOGLE_API_KEY', 'GOOGLE_GEMINI_API_KEY'])
  if (!apiKey) return null
  const url = `${GOOGLE_GEMINI_URL}?key=${apiKey}`
  const body: Record<string, unknown> = {
    contents: [{ role: 'user', parts: [{ text: systemHint ? `${systemHint}\n\n${message}` : message }] }],
    generationConfig: { maxOutputTokens: 1024 },
  }
  if (systemHint) {
    body.contents = [{ role: 'user', parts: [{ text: `[Sistem: ${systemHint}]\n\nKullanıcı görevi:\n${message}` }] }]
  }
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) return null
  const data = await res.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? null
}

/** CELF görevlendirici: Önce 1.5-flash dene, yoksa gemini-pro — CELF anahtarı */
async function callGeminiOrchestrator(system: string, message: string): Promise<string | null> {
  const apiKey = getCelfKey('CELF_GOOGLE_API_KEY', ['CELF_GOOGLE_GEMINI_API_KEY', 'GOOGLE_API_KEY', 'GOOGLE_GEMINI_API_KEY'])
  if (!apiKey) return null
  const userMessage = `[Sistem: ${system}]\n\nPatron görevi:\n${message}`

  try {
    const url15 = `${GOOGLE_GEMINI_15_URL}?key=${apiKey}`
    const res = await fetch(url15, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: [{ role: 'user', parts: [{ text: message }] }],
        generationConfig: { maxOutputTokens: 1024 },
      }),
    })
    if (res.ok) {
      const data = await res.json()
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? null
      if (text) return text
    }
  } catch {
    /* 1.5-flash yoksa veya hata verirse gemini-pro'ya düş */
  }

  const urlPro = `${GOOGLE_GEMINI_URL}?key=${apiKey}`
  const resPro = await fetch(urlPro, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: userMessage }] }],
      generationConfig: { maxOutputTokens: 1024 },
    }),
  })
  if (!resPro.ok) return null
  const dataPro = await resPro.json()
  return dataPro.candidates?.[0]?.content?.parts?.[0]?.text ?? null
}

async function callTogether(message: string): Promise<string | null> {
  const apiKey = getCelfKey('CELF_TOGETHER_API_KEY', ['TOGETHER_API_KEY'])
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
 * CELF: Önce Gemini'yi çağırır; Gemini görevlendirmeyi yapar.
 * Gemini ya kendisi yanıtlar (sonuç CELF'e teslim) ya da "DELEGATE:API" ile bir API'ye devreder;
 * o API çalışır, sonuç CELF'e teslim edilir. En son işi yapan sonucu CELF döndürür.
 */
export async function runCelfDirector(
  directorKey: DirectorKey,
  message: string
): Promise<{ text: string; provider: string } | null> {
  const director = await getDirectorateConfigMerged(directorKey)
  const systemHint = director
    ? `${director.name} (${director.work}). Kısa, net, Türkçe yanıt ver.`
    : 'YİSA-S asistan. Kısa, net, Türkçe yanıt ver.'
  const providers = director?.aiProviders ?? []

  const orchestratorSystem = `Sen YİSA-S CELF görevlendiricisisin. Direktörlük: ${director?.name ?? directorKey} (${director?.work ?? 'genel'}).
Mevcut API'ler: GPT, CLAUDE, GEMINI, TOGETHER.
Kurallar:
1) Ya doğrudan Türkçe yanıt ver (kısa, net).
2) Ya da ilk satırda sadece "DELEGATE:API_ADI" yaz (örn. DELEGATE:GPT veya DELEGATE:CLAUDE). O API görevi alacak, sonucu CELF'e teslim edecek.
Cevabın doğrudan yanıtsa sadece yanıtı yaz. Devretmek istiyorsan ilk satır: DELEGATE: ve ardından API adı.`

  const orchestratorResponse = await callGeminiOrchestrator(orchestratorSystem, `Patron görevi:\n${message}`)

  if (orchestratorResponse) {
    const trimmed = orchestratorResponse.trim()
    const firstLine = trimmed.split('\n')[0]?.trim().toUpperCase() ?? ''
    if (firstLine.startsWith(DELEGATE_PREFIX)) {
      const apiName = firstLine.slice(DELEGATE_PREFIX.length).trim() as 'GPT' | 'CLAUDE' | 'GEMINI' | 'TOGETHER'
      let out: string | null = null
      switch (apiName) {
        case 'GPT':
          out = await callOpenAI(message)
          if (out) return { text: out, provider: 'GPT' }
          break
        case 'CLAUDE':
          out = await callClaude(message, systemHint)
          if (out) return { text: out, provider: 'CLAUDE' }
          break
        case 'GEMINI':
          out = await callGemini(message, systemHint)
          if (out) return { text: out, provider: 'GEMINI' }
          break
        case 'TOGETHER':
          out = await callTogether(message)
          if (out) return { text: out, provider: 'TOGETHER' }
          break
        default:
          break
      }
    } else {
      return { text: trimmed || orchestratorResponse, provider: 'GEMINI' }
    }
  }

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
        out = await callGemini(message, systemHint)
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
