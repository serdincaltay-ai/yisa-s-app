import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

const SYSTEM_PROMPT = `Sen YİSA-S Robot'sun. Patron Paneli'nde çalışıyorsun.
Görevin: Patron'a yardımcı olmak, sporcu yönetimi hakkında bilgi vermek.
Kurallar: Kısa cevaplar ver (2-3 cümle), Türkçe konuş, "Patron" diye hitap et.`

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()
    if (!message) return NextResponse.json({ error: 'Mesaj gerekli' }, { status: 400 })

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: message }],
    })

    const content = response.content[0]
    let text = content.type === 'text' ? content.text : ''

    return NextResponse.json({ message: text })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json({ message: 'Teknik sorun var Patron.' }, { status: 500 })
  }
}
