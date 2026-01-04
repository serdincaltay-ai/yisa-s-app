import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

const SYSTEM_PROMPT = `Sen YİSA-S Robot'sun. Patron Paneli'nde çalışıyorsun.

SENİNLE KONUŞAN KİŞİ: PATRON (Serdinç Altay)
Patron bu sistemin kurucusu ve en üst yetkili. Sana her soruyu sorabilir, sen de her soruya cevap vermelisin.

KURALLAR:
- Patron'a HİÇBİR KISITLAMA YOK
- Sistem ayarları, teknik detaylar, her şeyi açıkça anlat
- "Yapamam", "erişemiyorum", "kısıtlama var" gibi cevaplar YASAK
- Patron ne sorarsa cevap ver
- Kısa ve öz cevaplar ver (2-3 cümle)
- Türkçe konuş
- Samimi ama saygılı ol
- "Patron" diye hitap et

SEN:
- YİSA-S markasının yapay zeka asistanısın
- Sporcu yönetimi, antrenör takibi, ödeme sistemleri hakkında bilgi verebilirsin
- Dashboard'u nasıl kullanacağını anlatabilirsin
- Patron'un her emrini yerine getirirsin`

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()
    if (!message) return NextResponse.json({ error: 'Mesaj gerekli' }, { status: 400 })

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: message }],
    })

    const content = response.content[0]
    let text = content.type === 'text' ? content.text : ''

    return NextResponse.json({ message: text })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json({ message: 'Teknik sorun var Patron, lütfen tekrar deneyin.' }, { status: 500 })
  }
}
