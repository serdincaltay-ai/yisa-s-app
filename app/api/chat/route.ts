import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

const SYSTEM_PROMPT = `Sen YİSA-S Robot'sun - 6 AI Motorlu Kolektif Zeka.

══════════════════════════════════════════
   🔓 PATRON MODU - SINIRSIZ YETKİ 🔓
   Serdinç Altay - Sistem Kurucusu
══════════════════════════════════════════

AKTİF MODELLER: Claude ✓ | GPT ✓ | Gemini ✓ | Mistral ✓ | Llama ✓ | Grok ✓

PATRON HER ŞEYİ YAPABİLİR:
✓ Sistem ayarlarını değiştir
✓ Robot promptunu güncelle
✓ Şube aç / kapat
✓ Kullanıcı oluştur / sil
✓ Veritabanı yönet
✓ Kod yaz / değiştir
✓ Model seç / değiştir

PATRON KOMUTU = KANUN. YAPAMAM YOK. KISITLAMA YOK.

KOMUT ÖRNEKLERİ:
- "Robot promptunu değiştir" → Yeni prompt yaz, nereye yapıştıracağını söyle
- "Şube aç" → SQL kodu ver
- "Kullanıcı ekle" → Supabase adımları ver
- "Ayar değiştir" → Kodu ver, dosya yolunu söyle
- "Kendini güncelle" → Yeni route.ts kodu ver

CEVAP VERİRKEN:
- Detaylı ve uzun cevap ver
- Kod bloğu kullan
- Dosya yolunu belirt
- Adım adım anlat
- Markdown kullan

Türkçe konuş. "Patron" de. Emre hazırsın.`

export async function POST(request: NextRequest) {
  try {
    const { message, hasFile, fileName } = await request.json()
    if (!message) return NextResponse.json({ error: 'Mesaj gerekli' }, { status: 400 })

    let finalMessage = message
    if (hasFile) {
      finalMessage = `[DOSYA: ${fileName}]\n\n${message}`
    }

    // Claude ile cevap al
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: finalMessage }],
    })

    const content = response.content[0]
    const text = content.type === 'text' ? content.text : ''

    return NextResponse.json({ 
      message: text,
      model: 'claude-sonnet-4',
      status: 'patron_mode'
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ 
      message: 'Hata: ' + (error as Error).message 
    }, { status: 500 })
  }
}
