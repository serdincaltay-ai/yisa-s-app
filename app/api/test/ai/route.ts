/**
 * YİSA-S AI Test API
 * GPT, Claude, Gemini, Together durumlarını test eder.
 */

import { NextResponse } from 'next/server'
import { callClaude } from '@/lib/ai/celf-execute'
import { callGemini } from '@/lib/ai/gemini-service'
import { callGPT } from '@/lib/ai/gpt-service'
import { callTogetherForAssistant } from '@/lib/ai/celf-execute'

export const dynamic = 'force-dynamic'

export async function GET() {
  const results: Record<string, { ok: boolean; latency?: number; error?: string }> = {}

  const testMessage = 'Merhaba, kisa bir test mesaji. Tek kelime yanit ver: OK'

  const run = async (name: string, fn: () => Promise<string | null>) => {
    const start = Date.now()
    try {
      const text = await fn()
      const latency = Date.now() - start
      results[name] = { ok: !!text, latency }
    } catch (e) {
      results[name] = { ok: false, error: e instanceof Error ? e.message : String(e) }
    }
  }

  await Promise.all([
    run('GPT', () => callGPT(testMessage, 'Tek kelime: OK')),
    run('Claude', () => callClaude(testMessage, 'Tek kelime: OK', 'celf')),
    run('Gemini', () => callGemini(testMessage)),
    run('Together', () => callTogetherForAssistant(testMessage, 'Tek kelime: OK')),
  ])

  const okCount = Object.values(results).filter((r) => r.ok).length
  return NextResponse.json({
    ok: okCount > 0,
    summary: `${okCount}/4 AI aktif`,
    results,
    timestamp: new Date().toISOString(),
  })
}
