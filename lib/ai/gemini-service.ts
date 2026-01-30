/**
 * YİSA-S Gemini Servisi
 * Araştırma, veri analizi.
 * Tarih: 30 Ocak 2026
 */

const GOOGLE_GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'

export async function research(query: string, context?: string): Promise<{ text: string; error?: string }> {
  const apiKey = process.env.GOOGLE_API_KEY ?? process.env.GOOGLE_GEMINI_API_KEY
  if (!apiKey) return { text: '', error: 'GOOGLE_API_KEY yok' }

  try {
    const url = `${GOOGLE_GEMINI_URL}?key=${apiKey}`
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: `Araştır (kısa, Türkçe, net): ${query}${context ? `\nBağlam: ${context}` : ''}` }] }],
        generationConfig: { maxOutputTokens: 1024 },
      }),
    })
    if (!res.ok) return { text: '', error: await res.text() }
    const data = await res.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
    return { text }
  } catch (e) {
    const err = e instanceof Error ? e.message : String(e)
    return { text: '', error: err }
  }
}
