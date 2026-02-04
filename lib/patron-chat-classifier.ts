/**
 * Patron chat mesajı sınıflandırması:
 * - approval: "onaylıyorum", "evet onayla" → bekleyen işi onayla, push/deploy
 * - conversation: araştırma, soru, değerlendirme → sadece asistan yanıtlar, CELF'e gitmez
 * - command: yapılacak iş komutu → CEO → CELF → onay kuyruğu
 *
 * Açık komut tetikleyicileri (bunlar her zaman command):
 * - "bunu CEO'ya gönder", "bunu Cloud'a gönder", "10'a çıkart"
 * Eşleşmezse varsayılan: command
 */

export type PatronMessageIntent = 'approval' | 'conversation' | 'command'

const APPROVAL_PATTERNS = [
  /\bonayl[ıi]yorum\b/i,
  /\bonayla\s*(yap)?\s*$/i,
  /\bevet\s+onayla\b/i,
  /\bpatron\s+onayl[ıi]yor\b/i,
  /\bkabul\s+ediyorum\b/i,
  /\bonay\s+veriyorum\b/i,
  /\b(onayl[ıi]yorum|onay\s+ver)\b/i,
  /\b(uygula|yap)\s*(bunu|bunu\s+onayla)?\s*$/i,
]

const CONVERSATION_PATTERNS = [
  /\bara[sş]t[ıi]r\b/i,
  /\bne\s+demek\b/i,
  /\bnas[ıi]l\s+(yapılır|olur|yapabilirim)\b/i,
  /\bnedir\b/i,
  /\bsöyle\s*(bana)?\b/i,
  /\banlat\b/i,
  /\bdeğerlendir\b/i,
  /\bbakal[ıi]m\b/i,
  /\bdü[sş]ün\b/i,
  /\bmerak\s+ediyorum\b/i,
  /\böğrenmek\s+istiyorum\b/i,
  /\bbilgi\s+ver\b/i,
  /\baçıklama\s*(yap)?\b/i,
  /\bne\s+olur\b/i,
  /\bne\s+diyorsun\b/i,
  /\bfikrin\s+ne\b/i,
  /\b(soru|sorular)\s+var\b/i,
  /^\s*(merhaba|selam|hey)\s*$/i,
  /^\s*(\?|\.\.\.)\s*$/,
]

/**
 * Mesajın niyetini döndürür.
 * Önce onay ifadesi, sonra konuşma, aksi halde komut.
 */
export function classifyPatronMessage(message: string): PatronMessageIntent {
  const trimmed = (message ?? '').trim()
  if (!trimmed) return 'conversation'

  for (const p of APPROVAL_PATTERNS) {
    if (p.test(trimmed)) return 'approval'
  }
  for (const p of CONVERSATION_PATTERNS) {
    if (p.test(trimmed)) return 'conversation'
  }

  return 'command'
}

/**
 * Mesaj sadece onay ifadesi mi (kısa ve sadece onay kelimeleri).
 * Uzun cümlelerde yanlışlıkla "onayla" geçmesin diye kısıtlayabiliriz.
 */
export function isApprovalPhrase(message: string): boolean {
  return classifyPatronMessage(message) === 'approval'
}
