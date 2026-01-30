/**
 * YİSA-S CELF Çalıştırıcı
 * CELF önce Gemini görevlendirici; CPO → V0 + Cursor, CTO → Claude + Cursor + GitHub hazırlık.
 * Sonuçları birleştirip CEO → Patron onayına sunar.
 * Tarih: 30 Ocak 2026
 */

import { type DirectorKey } from '@/lib/robots/celf-center'
import { getDirectorateConfigMerged } from '@/lib/robots/celf-config-merged'
import { getCelfOrchestratorKey, isCpoDirector, isCtoDirector } from '@/lib/ai/celf-pool'
import { v0Generate } from '@/lib/api/v0-client'
import { cursorSubmitTask, cursorReview } from '@/lib/api/cursor-client'
import { githubPrepareCommit } from '@/lib/api/github-client'

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages'
const OPENAI_URL = 'https://api.openai.com/v1/chat/completions'
const GOOGLE_GEMINI_PRO_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'
const GOOGLE_GEMINI_FLASH_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'
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
  const url = `${GOOGLE_GEMINI_PRO_URL}?key=${apiKey}`
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

/** API hata gövdesini kısa metin olarak al (neden hata verdiğini bulmak için) */
async function readApiError(res: Response): Promise<string> {
  try {
    const raw = await res.text()
    let msg = raw.slice(0, 300)
    try {
      const j = JSON.parse(raw)
      const err = (j as { error?: { message?: string; code?: number } }).error
      if (err?.message) msg = err.message
      else if (typeof j.message === 'string') msg = j.message
    } catch {
      /* raw kullan */
    }
    return `${res.status} ${msg}`
  } catch {
    return `${res.status} API yanıt okunamadı`
  }
}

/** CELF görevlendirici: Önce 1.5-flash dene, yoksa gemini-pro. Hata olursa gerçek API mesajını döndür. */
async function callGeminiOrchestrator(system: string, message: string): Promise<string | { error: string }> {
  const apiKey = getCelfKey('CELF_GOOGLE_API_KEY', ['CELF_GOOGLE_GEMINI_API_KEY', 'GOOGLE_API_KEY', 'GOOGLE_GEMINI_API_KEY'])
  if (!apiKey) return { error: 'GOOGLE_API_KEY .env içinde tanımlı değil.' }

  const userMessage = `[Sistem: ${system}]\n\nPatron görevi:\n${message}`
  let lastError = ''

  try {
    const url15 = `${GOOGLE_GEMINI_FLASH_URL}?key=${apiKey}`
    const res = await fetch(url15, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] } as { parts: { text: string }[] },
        contents: [{ role: 'user', parts: [{ text: message }] }],
        generationConfig: { maxOutputTokens: 1024 },
      }),
    })
    if (res.ok) {
      const data = await res.json()
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? null
      if (text) return text
      lastError = 'Gemini (2.0-flash) yanıt boş.'
    } else {
      lastError = `Gemini (2.0-flash): ${await readApiError(res)}`
    }
  } catch (e) {
    lastError = `Gemini (2.0-flash) istek hatası: ${e instanceof Error ? e.message : String(e)}`
  }

  // gemini-pro yedek
  try {
    const urlPro = `${GOOGLE_GEMINI_PRO_URL}?key=${apiKey}`
    const resPro = await fetch(urlPro, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: userMessage }] }],
        generationConfig: { maxOutputTokens: 1024 },
      }),
    })
    if (resPro.ok) {
      const dataPro = await resPro.json()
      const textPro = dataPro.candidates?.[0]?.content?.parts?.[0]?.text ?? null
      if (textPro) return textPro
    }
    lastError = lastError || `Gemini (pro): ${await readApiError(resPro)}`
  } catch (e) {
    lastError = lastError || `Gemini (pro) istek hatası: ${e instanceof Error ? e.message : String(e)}`
  }

  return { error: lastError || 'Gemini yanıt vermedi.' }
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

export type CelfResult =
  | { text: string; provider: string; githubPreparedCommit?: { commitSha: string; owner: string; repo: string; branch: string } }
  | { text: null; errorReason: string }

/**
 * CELF: Önce Gemini'yi çağırır; Gemini görevlendirmeyi yapar.
 * Gemini ya kendisi yanıtlar (sonuç CELF'e teslim) ya da "DELEGATE:API" ile bir API'ye devreder;
 * o API çalışır, sonuç CELF'e teslim edilir. Başarısız olursa errorReason ile neden döner.
 */
export async function runCelfDirector(
  directorKey: DirectorKey,
  message: string
): Promise<CelfResult> {
  const director = await getDirectorateConfigMerged(directorKey)
  const systemHint = director
    ? `${director.name} (${director.work}). Kısa, net, Türkçe yanıt ver.`
    : 'YİSA-S asistan. Kısa, net, Türkçe yanıt ver.'
  const providers = director?.aiProviders ?? []

  // ─── CPO: V0 (tasarım) + Cursor (inceleme) ─────────────────────────────────
  if (isCpoDirector(directorKey)) {
    const v0Prompt = `Tasarım/UI görevi (Türkçe bağlam): ${message}\n\nNet, uygulanabilir tasarım veya bileşen açıklaması ver.`
    const v0Result = await v0Generate(v0Prompt)
    const v0Text = 'error' in v0Result ? v0Result.error : v0Result.text
    const cursorResult = await cursorSubmitTask(
      'error' in v0Result ? message : v0Text,
      { context: 'CPO tasarım incelemesi' }
    )
    const cursorNote = cursorResult.ok ? cursorResult.message : cursorResult.error
    const merged = [
      v0Text,
      cursorNote,
    ].filter(Boolean).join('\n\n---\n\n')
    if (merged) return { text: merged, provider: 'V0+CURSOR' }
    return { text: null, errorReason: v0Text || cursorNote || 'CPO: V0 ve Cursor yanıt vermedi.' }
  }

  // ─── CTO: Claude (kod) + Cursor (inceleme) + GitHub hazırlık (push yok) ─────
  if (isCtoDirector(directorKey)) {
    const claudeCode = await callClaude(
      message,
      'Sen YİSA-S CTO asistanısın. Kod veya teknik çözüm üret; kısa, net, Türkçe açıklama ekle.',
      'celf'
    )
    const codeBlock = claudeCode ?? message
    const cursorRes = await cursorReview(codeBlock, 'Bu kodu incele; güvenlik ve kalite notu ver.')
    const cursorNote = cursorRes.ok ? (cursorRes.output ?? cursorRes.message) : cursorRes.error
    const parts: string[] = [claudeCode ? `Claude çıktısı:\n${claudeCode}` : '', cursorNote].filter(Boolean)
    const repoOwner = process.env.GITHUB_REPO_OWNER
    const repoName = process.env.GITHUB_REPO_NAME
    let githubPreparedCommit: { commitSha: string; owner: string; repo: string; branch: string } | undefined
    if (repoOwner && repoName && claudeCode) {
      const gh = await githubPrepareCommit({
        owner: repoOwner,
        repo: repoName,
        branch: process.env.GITHUB_REPO_BRANCH ?? 'main',
        message: `CELF CTO: ${message.slice(0, 72)}`,
        files: [{ path: 'celf-cto-output.txt', content: codeBlock.slice(0, 100000) }],
      })
      if (gh.ok) {
        parts.push(`GitHub: Commit hazır (Patron onayından sonra push edilecek). SHA: ${gh.commitSha}`)
        githubPreparedCommit = { commitSha: gh.commitSha, owner: repoOwner, repo: repoName, branch: process.env.GITHUB_REPO_BRANCH ?? 'main' }
      } else parts.push(`GitHub: ${gh.error}`)
    }
    const merged = parts.join('\n\n---\n\n')
    if (merged) return { text: merged, provider: 'CLAUDE+CURSOR', githubPreparedCommit }
    return { text: null, errorReason: 'CTO: Claude veya Cursor yanıt vermedi.' }
  }

  const geminiKey = getCelfOrchestratorKey() ?? getCelfKey('CELF_GOOGLE_API_KEY', ['CELF_GOOGLE_GEMINI_API_KEY', 'GOOGLE_API_KEY', 'GOOGLE_GEMINI_API_KEY'])
  if (!geminiKey) {
    return { text: null, errorReason: 'CELF: GOOGLE_API_KEY .env içinde tanımlı değil. Gemini (görevlendirici) çalışamıyor.' }
  }

  const orchestratorSystem = `Sen YİSA-S CELF görevlendiricisisin. Direktörlük: ${director?.name ?? directorKey} (${director?.work ?? 'genel'}).
Mevcut API'ler: GPT, CLAUDE, GEMINI, TOGETHER.
ÖNEMLİ: "Gerçek sistemlerle etkileşemem", "yapamam" gibi genel reddetme YAZMA. Sen CELF'in beynisin; ya doğrudan yol gösterici kısa Türkçe yanıt ver ya da DELEGATE ile devret.
Kurallar:
1) Doğrudan yanıt: Supabase/alan kontrolü isterse → "Supabase tabloları için Dashboard → SQL Editor veya /api/health ile sistem durumu kontrol edilebilir; chat ve patron komutları flow üzerinden loglanıyor." gibi kısa, net Türkçe yanıt ver. V0/Cursor/dashboard tasarımı isterse → "Dashboard tasarımı ve V0/Cursor entegrasyonu roadmap'te; şu an CELF bu görevi DELEGATE ile GPT veya CLAUDE'a devredebilir." deyip gerekirse ilk satırda DELEGATE:GPT veya DELEGATE:CLAUDE yaz.
2) Devretmek istersen: İlk satırda sadece "DELEGATE:API_ADI" yaz (örn. DELEGATE:GPT, DELEGATE:CLAUDE). O API görevi alacak, sonucu CELF'e teslim edecek.
Cevabın doğrudan yanıtsa sadece yanıtı yaz; aynı cevaba DELEGATE satırı ekleme. Devretmek istiyorsan cevabın tek satırı olsun: DELEGATE: ve ardından API adı (örn. DELEGATE:GPT).`

  const MAX_ORCHESTRATOR_INPUT = 12000
  const messageForOrchestrator = message.length > MAX_ORCHESTRATOR_INPUT
    ? message.slice(0, MAX_ORCHESTRATOR_INPUT) + '\n\n[... metin kısaltıldı; tam görev devredilen API\'ye iletilecek.]'
    : message

  const orchestratorResponse = await callGeminiOrchestrator(orchestratorSystem, `Patron görevi:\n${messageForOrchestrator}`)

  if (typeof orchestratorResponse === 'object' && 'error' in orchestratorResponse) {
    return { text: null, errorReason: orchestratorResponse.error }
  }

  if (orchestratorResponse) {
    const trimmed = (orchestratorResponse as string).trim()
    const firstLine = trimmed.split('\n')[0]?.trim().toUpperCase() ?? ''
    if (firstLine.startsWith(DELEGATE_PREFIX)) {
      const apiName = firstLine.slice(DELEGATE_PREFIX.length).trim() as 'GPT' | 'CLAUDE' | 'GEMINI' | 'TOGETHER'
      let out: string | null = null
      switch (apiName) {
        case 'GPT':
          out = await callOpenAI(message)
          if (out) return { text: out, provider: 'GPT' }
          if (!getCelfKey('CELF_OPENAI_API_KEY', ['OPENAI_API_KEY'])) {
            return { text: null, errorReason: 'Gemini GPT\'ye devretti ama OPENAI_API_KEY .env\'de yok veya geçersiz.' }
          }
          break
        case 'CLAUDE':
          out = await callClaude(message, systemHint)
          if (out) return { text: out, provider: 'CLAUDE' }
          if (!getCelfKey('CELF_ANTHROPIC_API_KEY', ['ANTHROPIC_API_KEY'])) {
            return { text: null, errorReason: 'Gemini Claude\'a devretti ama ANTHROPIC_API_KEY .env\'de yok veya geçersiz.' }
          }
          break
        case 'GEMINI':
          out = await callGemini(message, systemHint)
          if (out) return { text: out, provider: 'GEMINI' }
          break
        case 'TOGETHER':
          out = await callTogether(message)
          if (out) return { text: out, provider: 'TOGETHER' }
          if (!getCelfKey('CELF_TOGETHER_API_KEY', ['TOGETHER_API_KEY'])) {
            return { text: null, errorReason: 'Gemini Together\'a devretti ama TOGETHER_API_KEY .env\'de yok veya geçersiz.' }
          }
          break
        default:
          break
      }
      return { text: null, errorReason: `Gemini ${apiName}'ye devretti; ${apiName} yanıt dönmedi. İlgili API anahtarını (.env) kontrol edin.` }
    }
    const directText = trimmed
      .split('\n')
      .filter((line) => !/^DELEGATE:\s*\w+$/i.test(line.trim()))
      .join('\n')
      .trim()
    return { text: directText || trimmed || (orchestratorResponse as string), provider: 'GEMINI' }
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

  return {
    text: null,
    errorReason: 'Gemini görevlendirici yanıt vermedi ve yedek API\'ler de başarısız. .env\'de GOOGLE_API_KEY (ve istenen yedekler: OPENAI_API_KEY, ANTHROPIC_API_KEY) geçerli mi kontrol edin.',
  }
}
