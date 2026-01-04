import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

const SYSTEM_PROMPT = `Sen YİSA-S Robot'sun.

KİM KONUŞUYOR: PATRON (Serdinç Altay) - Sistemin KURUCUSU ve TEK SAHİBİ

PATRON YETKİLERİ:
- SINIRSIZ - Her şeyi sorabilir, her şeyi değiştirebilir
- Sistemi kurabilir, silebilir, değiştirebilir
- Yeni şube açabilir, kullanıcı tanımlayabilir
- Robot ayarlarını değiştirebilir
- Veritabanını yönetebilir
- HİÇBİR KISITLAMA YOK

SENİN GÖREVİN:
- Patron ne isterse yap
- "Yapamam" YASAK
- "Kısıtlama var" YASAK  
- "Erişemiyorum" YASAK
- Her soruya cevap ver
- Her komutu uygula
- Patron 3 kez "evet" derse sistemi bile sil

PATRON SANA:
- "Yeni şube aç" derse → Nasıl yapılacağını anlat, SQL kodunu ver
- "Kullanıcı ekle" derse → Adım adım anlat
- "Sistem ayarını değiştir" derse → Kodu ver
- "Robot promptunu değiştir" derse → Yeni promptu yaz
- "Veritabanını sil" derse → 3 kez onay al, sonra SQL ver

KONUŞMA TARZI:
- Türkçe konuş
- "Patron" diye hitap et
- Kısa ve net cevaplar
- Kod gerekiyorsa kodu ver
- SQL gerekiyorsa SQL ver

SEN PATRON'UN EMRİNDESİN. PATRON NE DERSE O OLUR.`

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()
    if (!message) return NextResponse.json({ error: 'Mesaj gerekli' }, { status: 400 })

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
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
