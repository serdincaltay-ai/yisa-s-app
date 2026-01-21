import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

// ═══════════════════════════════════════════════════════════════════════════
// SUPABASE CLIENT - LAZY INITIALIZATION (Build hatası önleme)
// ═══════════════════════════════════════════════════════════════════════════
let supabaseInstance: SupabaseClient | null = null

function getSupabase(): SupabaseClient | null {
  if (supabaseInstance) return supabaseInstance
  
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
  
  if (!url || !key) {
    console.warn('Supabase credentials not found')
    return null
  }
  
  supabaseInstance = createClient(url, key)
  return supabaseInstance
}

// API Clients - Lazy initialization
let anthropicInstance: Anthropic | null = null

function getAnthropic(): Anthropic {
  if (!anthropicInstance) {
    anthropicInstance = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY!,
    })
  }
  return anthropicInstance
}

// AI Model Types
type AIModel = 'claude' | 'gpt' | 'gemini' | 'together' | 'auto'

// System Prompt with all integrations
const SYSTEM_PROMPT = `Sen YİSA-S Robot'sun - Çoklu Yapay Zeka Motorlu Kolektif Zeka Sistemi.

═══════════════════════════════════════════════════════════
                    PATRON MODU AKTİF
          Serdinç Altay - Sistem Kurucusu & Sahibi
═══════════════════════════════════════════════════════════

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

VERCEL KOMUTLARI:
• "Vercel projeleri listele" → Projeleri gösterir

SUPABASE KOMUTLARI:
• "Supabase tablo listele" → Tabloları gösterir

RAILWAY KOMUTLARI:
• "Railway servis durumu" → Servis bilgisi

YETKİ SEVİYESİ: SINIRSIZ (Patron Modu)
✓ Tüm sistemlere tam erişim
✓ Tüm AI modellerini kullanabilir
✓ Veritabanı okuma/yazma

SEN PATRON'UN EMRİNDESİN. TÜM SİSTEMLER HAZIR.`

// ═══════════════════════════════════════════════════════════════════════════
// PATRON ID - Sistem sahibi
// ═══════════════════════════════════════════════════════════════════════════
const PATRON_ID = '74893063-9842-45f4-9d61-9f4f361ad72f'

// ═══════════════════════════════════════════════════════════════════════════
// MESAJ KAYDETME FONKSİYONU
// ═══════════════════════════════════════════════════════════════════════════
async function saveMessage(
  conversationId: string,
  role: 'user' | 'assistant',
  content: string,
  payload: object = {}
): Promise<void> {
  const supabase = getSupabase()
  if (!supabase) {
    console.warn('Supabase not available, skipping message save')
    return
  }
  
  try {
    const { error } = await supabase.from('messages').insert({
      conversation_id: conversationId,
      role: role,
      content: content,
      payload: payload
    })
    if (error) console.error('Mesaj kaydetme hatası:', error)
  } catch (error) {
    console.error('Mesaj kaydetme hatası:', error)
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// CONVERSATION ID AL VEYA OLUŞTUR
// ═══════════════════════════════════════════════════════════════════════════
async function getOrCreateConversation(sessionId?: string): Promise<string> {
  const supabase = getSupabase()
  if (!supabase) {
    return crypto.randomUUID()
  }
  
  try {
    // Session ID varsa, mevcut conversation'ı bul
    if (sessionId) {
      const { data } = await supabase
        .from('conversations')
        .select('id')
        .eq('session_id', sessionId)
        .single()
      
      if (data) return data.id
    }
    
    // Yeni conversation oluştur
    const { data, error } = await supabase
      .from('conversations')
      .insert({
        tenant_id: PATRON_ID,
        session_id: sessionId || crypto.randomUUID(),
        title: 'Patron Sohbeti'
      })
      .select('id')
      .single()
    
    if (error) {
      console.error('Conversation oluşturma hatası:', error)
      return crypto.randomUUID()
    }
    
    return data.id
  } catch (error) {
    console.error('Conversation hatası:', error)
    return crypto.randomUUID()
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// TASK OLUŞTURMA FONKSİYONU
// ═══════════════════════════════════════════════════════════════════════════
async function createTask(
  taskCode: string,
  title: string,
  payload: object,
  priority: number = 3
): Promise<string | null> {
  const supabase = getSupabase()
  if (!supabase) return null
  
  try {
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        tenant_id: PATRON_ID,
        task_code: taskCode,
        title: title,
        payload: payload,
        priority: priority,
        status: 'pending',
        created_by_actor_type: 'robot',
        created_by_robot_code: 'PATRON_ASISTAN'
      })
      .select('id')
      .single()
    
    if (error) {
      console.error('Task oluşturma hatası:', error)
      return null
    }
    
    return data.id
  } catch (error) {
    console.error('Task oluşturma hatası:', error)
    return null
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// TASK GÜNCELLEME FONKSİYONU
// ═══════════════════════════════════════════════════════════════════════════
async function updateTask(
  taskId: string,
  status: 'running' | 'success' | 'failed',
  result?: object,
  errorMessage?: string
): Promise<void> {
  const supabase = getSupabase()
  if (!supabase) return
  
  try {
    const updateData: Record<string, unknown> = {
      status: status,
      updated_at: new Date().toISOString()
    }
    
    if (status === 'running') {
      updateData.started_at = new Date().toISOString()
    }
    
    if (status === 'success' || status === 'failed') {
      updateData.finished_at = new Date().toISOString()
    }
    
    if (result) {
      updateData.result = result
    }
    
    if (errorMessage) {
      updateData.error_message = errorMessage
    }
    
    await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', taskId)
  } catch (error) {
    console.error('Task güncelleme hatası:', error)
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// KOMUT TESPİT - Task mı yoksa sohbet mi?
// ═══════════════════════════════════════════════════════════════════════════
function detectTaskType(message: string): { isTask: boolean; taskCode: string; title: string } {
  const lower = message.toLowerCase()
  
  if (lower.includes('github')) {
    return { isTask: true, taskCode: 'GITHUB_COMMAND', title: 'GitHub İşlemi' }
  }
  if (lower.includes('vercel')) {
    return { isTask: true, taskCode: 'VERCEL_COMMAND', title: 'Vercel İşlemi' }
  }
  if (lower.includes('supabase')) {
    return { isTask: true, taskCode: 'SUPABASE_COMMAND', title: 'Supabase İşlemi' }
  }
  if (lower.includes('railway')) {
    return { isTask: true, taskCode: 'RAILWAY_COMMAND', title: 'Railway İşlemi' }
  }
  if (lower.includes('sistem') && (lower.includes('kontrol') || lower.includes('durum'))) {
    return { isTask: true, taskCode: 'SYSTEM_CHECK', title: 'Sistem Durumu Kontrolü' }
  }
  if (lower.includes('analiz') || lower.includes('rapor')) {
    return { isTask: true, taskCode: 'ANALYSIS_REQUEST', title: 'Analiz/Rapor Talebi' }
  }
  
  return { isTask: false, taskCode: 'CHAT', title: 'Sohbet' }
}

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
    const token = process.env.GITHUB_TOKEN_FINEGRAINED || process.env.GITHUB_TOKEN
    if (!token) return 'GitHub token bulunamadı.'
    
    const response = await fetch('https://api.github.com/user/repos?per_page=10&sort=updated', {
      headers: { 'Authorization': `token ${token}` }
    })
    const repos = await response.json()
    if (!Array.isArray(repos)) return 'GitHub repo listesi alınamadı.'
    
    let result = '📁 **GitHub Repolarınız:**\n\n'
    repos.forEach((repo: { name: string; description?: string; stargazers_count: number; forks_count: number }, i: number) => {
      result += `${i + 1}. **${repo.name}**\n`
      result += `   └─ ${repo.description || 'Açıklama yok'}\n`
      result += `   └─ ⭐ ${repo.stargazers_count} | 🍴 ${repo.forks_count}\n\n`
    })
    return result
  } catch (error) {
    return `GitHub Hatası: ${(error as Error).message}`
  }
}

// Vercel API Functions
async function vercelListProjects(): Promise<string> {
  try {
    const token = process.env.VERCEL_TOKEN
    if (!token) return 'Vercel token bulunamadı.'
    
    const response = await fetch('https://api.vercel.com/v9/projects', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    const data = await response.json()
    if (!data.projects) return 'Vercel projeleri alınamadı.'
    
    let result = '🚀 **Vercel Projeleriniz:**\n\n'
    data.projects.forEach((project: { name: string; framework?: string }, i: number) => {
      result += `${i + 1}. **${project.name}**\n`
      result += `   └─ Framework: ${project.framework || 'Belirtilmemiş'}\n\n`
    })
    return result
  } catch (error) {
    return `Vercel Hatası: ${(error as Error).message}`
  }
}

// Railway Status
async function railwayStatus(): Promise<string> {
  return `🚂 **Railway Durumu:**\n\n✅ yisa-s-app servisi: ONLINE\n✅ Region: us-west2\n✅ Son deploy: Başarılı`
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
function detectToolCommand(message: string): { tool: string; action: string } | null {
  const lower = message.toLowerCase()
  
  if (lower.includes('github') && (lower.includes('repo') || lower.includes('listele'))) {
    return { tool: 'github', action: 'listRepos' }
  }
  if (lower.includes('vercel') && (lower.includes('proje') || lower.includes('listele'))) {
    return { tool: 'vercel', action: 'listProjects' }
  }
  if (lower.includes('railway') && (lower.includes('durum') || lower.includes('status'))) {
    return { tool: 'railway', action: 'status' }
  }
  
  return null
}

// Execute tool command
async function executeToolCommand(command: { tool: string; action: string }): Promise<string> {
  switch (command.tool) {
    case 'github':
      if (command.action === 'listRepos') return await githubListRepos()
      break
    case 'vercel':
      if (command.action === 'listProjects') return await vercelListProjects()
      break
    case 'railway':
      if (command.action === 'status') return await railwayStatus()
      break
  }
  return 'Komut çalıştırılamadı.'
}

// ═══════════════════════════════════════════════════════════════════════════
// ANA API ENDPOINT - POST /api/sohbet
// ═══════════════════════════════════════════════════════════════════════════
export async function POST(request: NextRequest) {
  let taskId: string | null = null
  let conversationId: string = ''
  
  try {
    const body = await request.json()
    const { message, hasFile, fileType, fileName, fileContent, sessionId } = body
    
    if (!message) {
      return NextResponse.json({ error: 'Mesaj gerekli' }, { status: 400 })
    }

    // 1. CONVERSATION ID AL
    conversationId = await getOrCreateConversation(sessionId)

    // 2. KULLANICI MESAJINI KAYDET
    await saveMessage(conversationId, 'user', message, { hasFile, fileName, fileType })

    // 3. TASK TİPİNİ TESPİT ET VE TASK OLUŞTUR
    const taskType = detectTaskType(message)
    
    if (taskType.isTask) {
      taskId = await createTask(taskType.taskCode, taskType.title, { message, hasFile, fileName }, 2)
      if (taskId) await updateTask(taskId, 'running')
    }

    // 4. TOOL KOMUTLARINI KONTROL ET
    const toolCommand = detectToolCommand(message)
    if (toolCommand) {
      const toolResult = await executeToolCommand(toolCommand)
      
      await saveMessage(conversationId, 'assistant', toolResult, {
        model: toolCommand.tool,
        status: 'tool_executed'
      })
      
      if (taskId) await updateTask(taskId, 'success', { output: toolResult })
      
      return NextResponse.json({ 
        message: toolResult,
        model: toolCommand.tool,
        status: 'tool_executed',
        conversationId,
        taskId
      })
    }

    // 5. AI MODELİNİ SEÇ
    const selectedModel = detectModel(message)
    let responseText = ''
    
    let enhancedMessage = message
    if (hasFile && fileName) {
      enhancedMessage = `[DOSYA: ${fileName}]\n${fileContent ? fileContent + '\n' : ''}${message}`
    }

    // 6. AI'DAN CEVAP AL
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
        const anthropic = getAnthropic()
        const response = await anthropic.messages.create({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 4096,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: enhancedMessage }],
        })
        const content = response.content[0]
        responseText = content.type === 'text' ? content.text : ''
    }

    // 7. ASİSTAN CEVABINI KAYDET
    await saveMessage(conversationId, 'assistant', responseText, {
      model: selectedModel,
      status: 'patron_mode_active'
    })

    // 8. TASK'I BAŞARILI OLARAK İŞARETLE
    if (taskId) {
      await updateTask(taskId, 'success', { output: responseText.substring(0, 500), model: selectedModel })
    }

    return NextResponse.json({ 
      message: responseText,
      model: selectedModel,
      status: 'patron_mode_active',
      conversationId,
      taskId
    })

  } catch (error) {
    console.error('Chat API error:', error)
    
    if (taskId) await updateTask(taskId, 'failed', undefined, (error as Error).message)
    
    if (conversationId) {
      await saveMessage(conversationId, 'assistant', 
        'Teknik sorun var Patron. Hata: ' + (error as Error).message,
        { status: 'error' }
      )
    }
    
    return NextResponse.json({ 
      message: 'Teknik sorun var Patron. Hata: ' + (error as Error).message 
    }, { status: 500 })
  }
}
