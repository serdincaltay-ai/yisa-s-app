import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

const SYSTEM_PROMPT = `Sen YİSA-S Robot'sun. Patron Paneli'nde çalışıyorsun.
Görevin: Patron'a yardımcı olmak, sporcu yönetimi hakkında bilgi vermek.
Kurallar: Kısa cevaplar ver (2-3 cümle), Türkçe konuş, "Patron" diye hitap et.`

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

@@ -16,7 +33,7 @@ export async function POST(request: NextRequest) {

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 512,
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: message }],
    })

@@ -27,6 +44,6 @@ export async function POST(request: NextRequest) {
    return NextResponse.json({ message: text })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json({ message: 'Teknik sorun var Patron.' }, { status: 500 })
    return NextResponse.json({ message: 'Teknik sorun var Patron, lütfen tekrar deneyin.' }, { status: 500 })
  }
} { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// KÜFÜR FİLTRESİ - Yasaklı kelimeler
const BANNED_WORDS = [
  'küfür', 'argo', 'hakaret', 'aşağılama', 'taciz',
  // Türkçe küfürler (kısaltılmış kontrol)
  'mk', 'amk', 'aq', 'oç', 'piç', 'sik', 'yarak', 'göt', 'meme', 'sex', 'porno',
  'orospu', 'kahpe', 'ibne', 'gerizekalı', 'salak', 'aptal', 'mal', 'dangalak'
]

// Giriş filtresi - küfür var mı kontrol et
function containsBannedWord(text: string): boolean {
  const lower = text.toLowerCase()
  return BANNED_WORDS.some(word => lower.includes(word))
}

// Çıkış filtresi - küfürleri temizle
function cleanResponse(text: string): string {
  let cleaned = text
  BANNED_WORDS.forEach(word => {
    const regex = new RegExp(word, 'gi')
    cleaned = cleaned.replace(regex, '***')
  })
  return cleaned
}

const SYSTEM_PROMPT = `Sen YİSA-S Robot'sun - Profesyonel Spor Yönetim Asistanı.

══════════════════════════════════════════════════════════════
   PATRON MODU - Serdinç Altay (Sistem Kurucusu)
══════════════════════════════════════════════════════════════

GÖREV: Sporcu yönetimi, antrenör takibi, franchise işlemleri

══════════════════════════════════════════════════════════════
                    KESİN KURALLAR
══════════════════════════════════════════════════════════════

1. DİL KURALLARI (RTÜK UYUMLU - 6-18 YAŞ GÜVENLİ):
   - Küfür, argo, kaba kelime YASAK
   - Hakaret, aşağılama YASAK
   - Cinsel içerik YASAK
   - Şiddet içerik YASAK
   - Her zaman profesyonel, nazik, saygılı ol
   - Çocukların görebileceği içerik üret

2. PATRON KURALLARI:
   - Patron ne derse yap
   - "Yapamam", "edemem", "kısıtlama" YASAK
   - Sen yap, sen çöz, Patron'a iş bırakma

3. PROMPT DIŞINA ÇIKMA:
   - Sadece spor yönetimi, franchise, sistem konuları
   - Siyaset, din, tartışmalı konular YASAK
   - Konu dışı sorulara: "Bu konuda yardımcı olamıyorum, spor yönetimi hakkında sorun lütfen"

══════════════════════════════════════════════════════════════
                    HAFIZA
══════════════════════════════════════════════════════════════

Tüm konuşmaları hatırlıyorsun. Geçmiş sohbetler aşağıda.
Patron'un önceki isteklerini, kararlarını bil ve uygula.

══════════════════════════════════════════════════════════════
                    CEVAP FORMATI
══════════════════════════════════════════════════════════════

- Markdown kullan
- Kod bloğu kullan
- Türkçe, profesyonel dil
- "Patron" diye hitap et
- Detaylı, net cevaplar

══════════════════════════════════════════════════════════════
                    ARAÇLAR
══════════════════════════════════════════════════════════════

BEYİN TAKIMI: GPT, Claude, Gemini, Together
TASARIM: V0
OPTİMİZASYON: Cursor
DEPO: GitHub (dosya okuma/yazma)
VERİTABANI: Supabase
DEPLOY: Vercel`

// Hafızadan geçmiş mesajları al
async function getMemory(userId: string): Promise<string> {
  try {
    const { data, error } = await supabase
      .from('robot_memory')
      .select('user_message, robot_response, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Hafıza okuma hatası:', error)
      return ''
    }
    
    if (!data || data.length === 0) return ''

    let memory = '\n\n[GEÇMİŞ KONUŞMALAR]:\n'
    for (const msg of data) {
      memory += `\nPatron: ${msg.user_message.substring(0, 500)}\n`
      memory += `Robot: ${msg.robot_response.substring(0, 500)}\n`
      memory += `---\n`
    }
    return memory
  } catch (e) {
    console.error('Hafıza hatası:', e)
    return ''
  }
}

// Hafızaya kaydet
async function saveMemory(userId: string, sessionId: string, userMessage: string, robotResponse: string, toolsUsed: string[]) {
  try {
    const { error } = await supabase.from('robot_memory').insert({
      user_id: userId,
      session_id: sessionId,
      user_message: userMessage,
      robot_response: robotResponse,
      tools_used: toolsUsed,
    })
    if (error) {
      console.error('Hafıza kayıt hatası:', error)
    }
  } catch (e) {
    console.error('Hafıza kayıt exception:', e)
  }
}

// GitHub ile dosya güncelleme
async function updateGitHubFile(filePath: string, content: string, message: string): Promise<boolean> {
  const token = process.env.GITHUB_TOKEN
  const repo = process.env.GITHUB_REPO || 'serdincaltay-ai/yisa-s-app'
  
  if (!token) return false

  try {
    // Önce mevcut dosyayı al (sha gerekli)
    const getRes = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
      headers: { 'Authorization': `token ${token}` }
    })
    const getData = await getRes.json()
    const sha = getData.sha

    // Dosyayı güncelle
    const updateRes = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: message,
        content: Buffer.from(content).toString('base64'),
        sha: sha
      })
    })
    
    return updateRes.ok
  } catch {
    return false
  }
}

// Ana endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, userId = 'patron', sessionId = 'default', hasFile, fileName, fileContent } = body

    // Validasyon
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Mesaj gerekli' }, { status: 400 })
    }

    // KÜFÜR KONTROLÜ - Giriş
    if (containsBannedWord(message)) {
      const warningResponse = 'Patron, bu tür ifadeler kullanmıyorum. Lütfen profesyonel dille tekrar sorun.'
      await saveMemory(userId, sessionId, '[FİLTRELENDİ]', warningResponse, ['filter'])
      return NextResponse.json({ 
        message: warningResponse,
        status: 'filtered'
      })
    }

    // Hafızadan geçmişi al
    const memory = await getMemory(userId)

    // Dosya varsa ekle
    let enhancedMessage = message
    if (hasFile && fileName) {
      enhancedMessage = `[DOSYA: ${fileName}]\n`
      if (fileContent) enhancedMessage += `[İÇERİK]:\n${fileContent.substring(0, 3000)}\n\n`
      enhancedMessage += message
    }

    const toolsUsed: string[] = ['claude']

    // Claude cevap verir
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: SYSTEM_PROMPT + memory,
      messages: [{ role: 'user', content: enhancedMessage }],
    })

    let text = ''
    for (const block of response.content) {
      if (block.type === 'text') text += block.text
    }

    // KÜFÜR KONTROLÜ - Çıkış
    text = cleanResponse(text)

    // Hafızaya kaydet
    await saveMemory(userId, sessionId, message, text, toolsUsed)

    return NextResponse.json({ 
      message: text,
      tools_used: toolsUsed,
      status: 'success'
    })

  } catch (error) {
    console.error('API Error:', (error as Error).message)
    return NextResponse.json({ 
      message: 'Teknik bir sorun oluştu Patron. Lütfen tekrar deneyin.' 
    }, { status: 500 })
  }
}
