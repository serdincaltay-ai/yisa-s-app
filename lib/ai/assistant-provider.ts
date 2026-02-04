/**
 * Patron asistanı için AI sağlayıcı seçimi
 * GEMINI (varsayılan), CLAUDE, CURSOR, CLOUD (Together)
 */

import { callClaude, callTogetherForAssistant } from '@/lib/ai/celf-execute'
import { callGemini } from '@/lib/ai/gemini-service'
import { callGPT } from '@/lib/ai/gpt-service'

export type AssistantProvider = 'GEMINI' | 'CLAUDE' | 'CURSOR' | 'CLOUD'

const ASSISTANT_SYSTEM =
  'Sen Patronun asistanısın. Sadece konuşma, araştırma, bilgi veriyorsun. Şirket işi komutu değil; CELF\'e gitme, deploy/push yapma. Kısa ve Türkçe yanıt ver.'

/** Seçilen sağlayıcı ile asistan yanıtı üretir */
export async function callAssistantByProvider(
  provider: AssistantProvider,
  message: string,
  system?: string
): Promise<{ text: string; provider: string }> {
  const sys = system ?? ASSISTANT_SYSTEM
  let text: string | null = null
  let usedProvider: string = provider

  switch (provider) {
    case 'GEMINI':
      text = await callGemini(message, sys)
      break
    case 'CLAUDE':
      text = await callClaude(message, sys, 'asistan')
      break
    case 'CURSOR':
      // Cursor kod için; sohbet için Claude kullan
      text = await callClaude(message, sys, 'asistan')
      usedProvider = 'CLAUDE'
      break
    case 'CLOUD':
      text = await callTogetherForAssistant(message, sys)
      usedProvider = 'TOGETHER'
      break
    default:
      text = await callGemini(message, sys)
      usedProvider = 'GEMINI'
  }

  if (!text) {
    // Yedek: Gemini veya GPT
    text = await callGemini(message, sys) ?? await callGPT(message, sys)
    usedProvider = text ? 'GEMINI' : '—'
  }

  return {
    text: text ?? 'Yanıt oluşturulamadı. API anahtarlarını (.env) kontrol edin.',
    provider: usedProvider,
  }
}
