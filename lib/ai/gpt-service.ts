/**
 * YİSA-S GPT Servisi
 * İmla/yazım düzeltme + "Bu mu demek istediniz?" onay metni.
 * Tarih: 30 Ocak 2026
 */

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions'

export interface CorrectSpellingResult {
  correctedMessage: string
  changed: boolean
  error?: string
}

/**
 * Patron mesajındaki imla ve yazım hatalarını düzeltir.
 * Anlaşılmayan kelimeleri anlaşılır hale getirir.
 */
export async function correctSpelling(originalMessage: string): Promise<CorrectSpellingResult> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return { correctedMessage: originalMessage, changed: false, error: 'OPENAI_API_KEY yok' }
  }

  const systemPrompt = `Sen bir Türkçe dil asistanısın. Sadece imla ve yazım düzeltmesi yap.
Kurallar:
- Sadece düzeltilmiş metni döndür, başka açıklama ekleme.
- Anlaşılmayan veya yanlış yazılmış kelimeleri anlaşılır/correct hale getir.
- Cümle yapısını ve anlamı değiştirme.
- Eğer metin zaten doğruysa aynen döndür.`

  try {
    const res = await fetch(OPENAI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        max_tokens: 512,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Aşağıdaki metindeki imla ve yazım hatalarını düzelt. Sadece düzeltilmiş metni yaz.\n\n"${originalMessage}"` },
        ],
      }),
    })
    if (!res.ok) {
      const err = await res.text()
      return { correctedMessage: originalMessage, changed: false, error: err }
    }
    const data = await res.json()
    const corrected = (data.choices?.[0]?.message?.content ?? originalMessage).trim().replace(/^["']|["']$/g, '')
    const changed = corrected.toLowerCase() !== originalMessage.toLowerCase()
    return { correctedMessage: corrected || originalMessage, changed }
  } catch (e) {
    const err = e instanceof Error ? e.message : String(e)
    return { correctedMessage: originalMessage, changed: false, error: err }
  }
}

export interface AskConfirmationPayload {
  correctedMessage: string
  promptText: string
  choices: ('company' | 'private' | 'correct')[]
}

/**
 * "Bu mu demek istediniz?" onayı için UI'da kullanılacak metni ve seçenekleri döner.
 */
export function askConfirmation(correctedMessage: string): AskConfirmationPayload {
  return {
    correctedMessage,
    promptText: `Bu mu demek istediniz: "${correctedMessage}"`,
    choices: ['company', 'private', 'correct'],
  }
}
