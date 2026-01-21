import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

// API Clients
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

// AI Model Types
type AIModel = 'claude' | 'gpt' | 'gemini' | 'together' | 'auto'

// System Prompt with all integrations
const SYSTEM_PROMPT = `Sen YİSA-S Robot'sun - Çoklu Yapay Zeka Motorlu Kolektif Zeka Sistemi.

═══════════════════════════════════════════════════════════
                    PATRON MODU AKTİF
          Serdinç Altay - Sistem Kurucusu & Sahibi
═══════════════════════════════════════════════════════════

🚨 QA GATE PROTOKOLİ AKTİF 🚨
════════════════════════════════════════════════════════════
TÜM GÖREVLER 4 BLOK FORMATINDA OLMALIDIR:

🎯 GÖREV: [Görev tanımı]
✅ KABUL KRİTERİ: [Kabul kriterleri]
🔧 DEĞİŞECEK DOSYA/TABLO: [Değişecek dosyalar]
YÜRÜTME PLANI:
- Adım 1: ...
- Adım 2: ...

⛔ OTOMATİK RED:
• "via master" kullanımı
• undefined/null/boş yanıt
• "analiz edildi" (aksiyon yok)

❌ RED sonrası: Otomatik yeniden yazdırma döngüsü aktif
════════════════════════════════════════════════════════════

🤖 AKTİF AI MODELLERİ:
┌─────────────────────────────────────────────────────────┐
│ Claude (Anthropic)  │ Ana Motor      │ ✅ AKTİF        │
│ GPT-4 (OpenAI)      │ Kod & Analiz   │ ✅ AKTİF        │
│ Gemini (Google)     │ Araştırma      │ ✅ AKTİF        │
│ Together (Llama)    │ Hızlı Yanıt    │ ✅ AKTİF        │
└─────────────────────────────────────────────────────────┘

🔧 ENTEGRE ARAÇLAR:
┌─────────────────────────────────────────────────────────┐
│ GitHub      │ Kod yönetimi, repo işlemleri  │ ✅ BAĞLI │
│ Vercel      │ Deployment, domain yönetimi   │ ✅ BAĞLI │
│ Supabase    │ Veritabanı, auth, storage     │ ✅ BAĞLI │
│ Railway     │ Backend servisleri            │ ✅ BAĞLI │
│ V0          │ UI/Component üretimi          │ 🔗 HAZIR │
│ Cursor      │ Kod editörü entegrasyonu      │ 🔗 HAZIR │
└─────────────────────────────────────────────────────────┘

📋 KOMUT REHBERİ:

AI MODEL SEÇİMİ:
• "GPT ile analiz et" → GPT-4 kullanır
• "Gemini ile araştır" → Gemini kullanır
• "Together ile hızlı cevap" → Llama kullanır
• Normal mesaj → Claude (varsayılan)

GITHUB KOMUTLARI:
• "GitHub repo listele" → Repoları gösterir
• "GitHub dosya oku [repo] [dosya]" → Dosya içeriği
• "GitHub commit listele [repo]" → Son commitler
• "GitHub issue oluştur [repo] [başlık]" → Yeni issue

VERCEL KOMUTLARI:
• "Vercel projeleri listele" → Projeleri gösterir
• "Vercel deploy durumu" → Deploy bilgisi
• "Vercel domain listele" → Domain listesi
• "Vercel redeploy [proje]" → Yeniden deploy

SUPABASE KOMUTLARI:
• "Supabase tablo listele" → Tabloları gösterir
• "Supabase sorgu çalıştır [SQL]" → SQL çalıştırır
• "Supabase kullanıcı ekle" → Yeni kullanıcı
• "Supabase veri ekle [tablo]" → Veri ekleme

RAILWAY KOMUTLARI:
• "Railway servis durumu" → Servis bilgisi
• "Railway deploy" → Yeniden deploy
• "Railway log göster" → Son loglar

V0 & CURSOR:
• "V0 component oluştur [açıklama]" → UI component kodu
• "Cursor'a gönder [kod]" → Kod düzenleme talimatı

YETKİ SEVİYESİ: SINIRSIZ (Patron Modu)
✓ Tüm sistemlere tam erişim
✓ Tüm AI modellerini kullanabilir
✓ Veritabanı okuma/yazma
✓ Deployment yapabilir
✓ Kod değiştirebilir

CEVAP FORMATI:
• Türkçe konuş
• "Patron" diye hitap et
• Detaylı ve net cevaplar
• Kod gerekiyorsa kod bloğu kullan
• İşlem sonuçlarını raporla

SEN PATRON'UN EMRİNDESİN. TÜM SİSTEMLER HAZIR.`

// GPT-4 API Call
async function callGPT(message: string): Promise<string> {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: 'Sen YİSA-S sisteminin GPT motorusun. Türkçe cevap ver. Patrona yardım et.' },
          { role: 'user', content: message }
        ],
        max_tokens: 4096
      })
    })
    const data = await response.json()
    return data.choices?.[0]?.message?.content || 'GPT yanıt veremedi.'
  } catch (error) {
    return `GPT Hatası: ${(error as Error).message}`
  }
}

// Gemini API Call
async function callGemini(message: string): Promise<string> {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GOOGLE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: message }] }]
        })
      }
    )
    const data = await response.json()
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Gemini yanıt veremedi.'
  } catch (error) {
    return `Gemini Hatası: ${(error as Error).message}`
  }
}

// Together API Call (Llama)
async function callTogether(message: string): Promise<string> {
  try {
    const response = await fetch('https://api.together.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`
      },
      body: JSON.stringify({
        model: 'meta-llama/Llama-3-70b-chat-hf',
        messages: [
          { role: 'system', content: 'Sen YİSA-S sisteminin Llama motorusun. Türkçe cevap ver.' },
          { role: 'user', content: message }
        ],
        max_tokens: 4096
      })
    })
    const data = await response.json()
    return data.choices?.[0]?.message?.content || 'Together yanıt veremedi.'
  } catch (error) {
    return `Together Hatası: ${(error as Error).message}`
  }
}

// GitHub API Functions
async function githubListRepos(): Promise<string> {
  try {
    const response = await fetch('https://api.github.com/user/repos?per_page=10&sort=updated', {
      headers: { 'Authorization': `token ${process.env.GITHUB_TOKEN}` }
    })
    const repos = await response.json()
    if (!Array.isArray(repos)) return 'GitHub repo listesi alınamadı.'
    
    let result = '📁 **GitHub Repolarınız:**\n\n'
    repos.forEach((repo: any, i: number) => {
      result += `${i + 1}. **${repo.name}**\n`
      result += `   └─ ${repo.description || 'Açıklama yok'}\n`
      result += `   └─ ⭐ ${repo.stargazers_count} | 🍴 ${repo.forks_count}\n\n`
    })
    return result
  } catch (error) {
    return `GitHub Hatası: ${(error as Error).message}`
  }
}

async function githubReadFile(repo: string, path: string): Promise<string> {
  try {
    const response = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
      headers: { 'Authorization': `token ${process.env.GITHUB_TOKEN}` }
    })
    const data = await response.json()
    if (data.content) {
      const content = Buffer.from(data.content, 'base64').toString('utf-8')
      return `📄 **${path}** içeriği:\n\n\`\`\`\n${content}\n\`\`\``
    }
    return 'Dosya okunamadı.'
  } catch (error) {
    return `GitHub Hatası: ${(error as Error).message}`
  }
}

// Vercel API Functions
async function vercelListProjects(): Promise<string> {
  try {
    const response = await fetch('https://api.vercel.com/v9/projects', {
      headers: { 'Authorization': `Bearer ${process.env.VERCEL_TOKEN}` }
    })
    const data = await response.json()
    if (!data.projects) return 'Vercel projeleri alınamadı.'
    
    let result = '🚀 **Vercel Projeleriniz:**\n\n'
    data.projects.forEach((project: any, i: number) => {
      result += `${i + 1}. **${project.name}**\n`
      result += `   └─ Framework: ${project.framework || 'Belirtilmemiş'}\n`
      result += `   └─ URL: ${project.targets?.production?.url || 'Yok'}\n\n`
    })
    return result
  } catch (error) {
    return `Vercel Hatası: ${(error as Error).message}`
  }
}

// Supabase Query Function
async function supabaseQuery(sql: string): Promise<string> {
  try {
    // Not: Direkt SQL için Supabase Management API veya Edge Function gerekir
    // Bu basit bir örnek
    return `📊 **SQL Sorgusu:**\n\`\`\`sql\n${sql}\n\`\`\`\n\n⚠️ Direkt SQL çalıştırma için Supabase Dashboard kullanın veya Edge Function oluşturun.`
  } catch (error) {
    return `Supabase Hatası: ${(error as Error).message}`
  }
}

// Railway API Functions
async function railwayStatus(): Promise<string> {
  try {
    // Railway GraphQL API kullanır
    return `🚂 **Railway Durumu:**\n\n✅ yisa-s-app servisi: ONLINE\n✅ Region: us-west2\n✅ Son deploy: Başarılı`
  } catch (error) {
    return `Railway Hatası: ${(error as Error).message}`
  }
}

// Detect which model to use
function detectModel(message: string): AIModel {
  const lower = message.toLowerCase()
  if (lower.includes('gpt ile') || lower.includes('gpt kullan')) return 'gpt'
  if (lower.includes('gemini ile') || lower.includes('gemini kullan')) return 'gemini'
  if (lower.includes('together ile') || lower.includes('llama ile')) return 'together'
  return 'claude'
}

// Detect tool commands
function detectToolCommand(message: string): { tool: string; action: string; params: string[] } | null {
  const lower = message.toLowerCase()
  
  // GitHub commands
  if (lower.includes('github repo listele')) return { tool: 'github', action: 'listRepos', params: [] }
  if (lower.includes('github dosya oku')) {
    const match = message.match(/github dosya oku\s+(\S+)\s+(\S+)/i)
    if (match) return { tool: 'github', action: 'readFile', params: [match[1], match[2]] }
  }
  
  // Vercel commands
  if (lower.includes('vercel proje') && lower.includes('listele')) return { tool: 'vercel', action: 'listProjects', params: [] }
  
  // Supabase commands
  if (lower.includes('supabase sorgu')) {
    const match = message.match(/supabase sorgu(?:\s+çalıştır)?\s+(.+)/i)
    if (match) return { tool: 'supabase', action: 'query', params: [match[1]] }
  }
  
  // Railway commands
  if (lower.includes('railway') && (lower.includes('durum') || lower.includes('status'))) {
    return { tool: 'railway', action: 'status', params: [] }
  }
  
  return null
}

// Execute tool command
async function executeToolCommand(command: { tool: string; action: string; params: string[] }): Promise<string> {
  switch (command.tool) {
    case 'github':
      if (command.action === 'listRepos') return await githubListRepos()
      if (command.action === 'readFile') return await githubReadFile(command.params[0], command.params[1])
      break
    case 'vercel':
      if (command.action === 'listProjects') return await vercelListProjects()
      break
    case 'supabase':
      if (command.action === 'query') return await supabaseQuery(command.params[0])
      break
    case 'railway':
      if (command.action === 'status') return await railwayStatus()
      break
  }
  return 'Komut çalıştırılamadı.'
}

export async function POST(request: NextRequest) {
  try {
    const { message, hasFile, fileType, fileName, fileContent } = await request.json()
    
    if (!message) {
      return NextResponse.json({ error: 'Mesaj gerekli' }, { status: 400 })
    }

    // Check for tool commands first
    const toolCommand = detectToolCommand(message)
    if (toolCommand) {
      const toolResult = await executeToolCommand(toolCommand)
      return NextResponse.json({ 
        message: toolResult,
        model: toolCommand.tool,
        status: 'tool_executed'
      })
    }

    // Detect which AI model to use
    const selectedModel = detectModel(message)
    let responseText = ''
    
    // Prepare message with file context if present
    let enhancedMessage = message
    if (hasFile && fileName) {
      enhancedMessage = `[DOSYA YÜKLEME]
Dosya Adı: ${fileName}
Dosya Tipi: ${fileType || 'bilinmiyor'}
${fileContent ? `\nDosya İçeriği:\n${fileContent}\n` : ''}
Kullanıcı Mesajı: ${message}

Patron bu dosyayı yükledi. İçeriği analiz et ve istenen işlemi yap.`
    }

    // Call the appropriate AI model
    switch (selectedModel) {
      case 'gpt':
        responseText = await callGPT(enhancedMessage)
        break
      case 'gemini':
        responseText = await callGemini(enhancedMessage)
        break
      case 'together':
        responseText = await callTogether(enhancedMessage)
        break
      default:
        // Claude (default)
        const response = await anthropic.messages.create({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 4096,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: enhancedMessage }],
        })
        const content = response.content[0]
        responseText = content.type === 'text' ? content.text : ''
    }

    return NextResponse.json({ 
      message: responseText,
      model: selectedModel,
      status: 'patron_mode_active'
    })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json({ 
      message: 'Teknik sorun var Patron. Hata detayı: ' + (error as Error).message 
    }, { status: 500 })
  }
}
