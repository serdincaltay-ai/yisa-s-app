import { NextRequest, NextResponse } from 'next/server'
import { saveChatMessage } from '@/lib/db/chat-messages'
import { fetchWithRetry } from '@/lib/api/fetch-with-retry'

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages'

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY tanımlı değil' },
        { status: 500 }
      )
    }

    const body = await req.json()
    const message = typeof body.message === 'string' ? body.message : (body.message ?? 'Merhaba')
    const taskType = typeof body.taskType === 'string' ? body.taskType : undefined
    const assignedAI = typeof body.assignedAI === 'string' ? body.assignedAI : 'CLAUDE'
    const userId = typeof body.user_id === 'string' ? body.user_id : (body.user?.id as string | undefined)

    const res = await fetchWithRetry(ANTHROPIC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 1024,
        system: 'Sen YİSA-S Patron Asistanısın. Kısa, net ve Türkçe yanıt ver.',
        messages: [{ role: 'user', content: message }],
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      return NextResponse.json(
        { error: 'Claude isteği başarısız', detail: err },
        { status: res.status }
      )
    }

    const data = await res.json()
    const text =
      data.content?.find((c: { type: string }) => c.type === 'text')?.text ?? 'Yanıt oluşturulamadı.'

    if (userId) {
      await saveChatMessage({
        user_id: userId,
        message,
        response: text,
        ai_providers: [assignedAI || 'CLAUDE'],
      })
    }

    return NextResponse.json({
      text,
      assignedAI: assignedAI || 'CLAUDE',
      taskType: taskType || 'unknown',
    })
  } catch (e) {
    const err = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ error: 'Chat hatası', detail: err }, { status: 500 })
  }
}
