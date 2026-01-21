const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
app.use(cors());
app.use(express.json());

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// ============ AI MODELLERİ ============

async function callGPT(message, task = 'araştır') {
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: `Sen araştırma uzmanısın. Görevi ${task}. Detaylı araştır, kaynak belirt. Türkçe cevap ver.` },
          { role: 'user', content: message }
        ],
        max_tokens: 4096
      })
    });
    const data = await res.json();
    return data.choices?.[0]?.message?.content || 'GPT yanıt veremedi.';
  } catch (e) {
    return 'GPT Hatası: ' + e.message;
  }
}

async function callGemini(message, task = 'analiz et') {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: `Görev: ${task}\n\n${message}` }] }] })
      }
    );
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Gemini yanıt veremedi.';
  } catch (e) {
    return 'Gemini Hatası: ' + e.message;
  }
}

async function callTogether(message, task = 'değerlendir') {
  try {
    const res = await fetch('https://api.together.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`
      },
      body: JSON.stringify({
        model: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
        messages: [
          { role: 'system', content: `Görevin: ${task}. Farklı bir bakış açısı sun. Türkçe cevap ver.` },
          { role: 'user', content: message }
        ],
        max_tokens: 4096
      })
    });
    const data = await res.json();
    return data.choices?.[0]?.message?.content || 'Together yanıt veremedi.';
  } catch (e) {
    return 'Together Hatası: ' + e.message;
  }
}

async function callV0(message) {
  try {
    const res = await fetch('https://api.v0.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.V0_API_KEY}`
      },
      body: JSON.stringify({
        model: 'v0-1.0-md',
        messages: [{ role: 'user', content: message }],
        max_tokens: 4096
      })
    });
    const data = await res.json();
    return data.choices?.[0]?.message?.content || 'V0 yanıt veremedi.';
  } catch (e) {
    return 'V0 Hatası: ' + e.message;
  }
}

async function callCursor(task) {
  try {
    const res = await fetch('https://api.cursor.com/v0/agents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(process.env.CURSOR_API_KEY + ':').toString('base64')
      },
      body: JSON.stringify({
        prompt: { text: task },
        source: { repository: 'https://github.com/serdincaltay-ai/yisa-s-app', ref: 'main' },
        target: { autoCreatePr: true }
      })
    });
    const data = await res.json();
    if (data.id) return { success: true, id: data.id, url: `https://cursor.com/agents?id=${data.id}` };
    return { success: false, error: JSON.stringify(data) };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

// ============ ARAÇLAR ============

async function githubListRepos() {
  const res = await fetch('https://api.github.com/user/repos?per_page=20&sort=updated', {
    headers: { 'Authorization': `token ${process.env.GITHUB_TOKEN_FINEGRAINED || process.env.GITHUB_TOKEN}` }
  });
  const repos = await res.json();
  return Array.isArray(repos) ? repos.map(r => r.name).join(', ') : 'Alınamadı';
}

async function vercelListProjects() {
  const res = await fetch('https://api.vercel.com/v9/projects', {
    headers: { 'Authorization': `Bearer ${process.env.VERCEL_TOKEN}` }
  });
  const data = await res.json();
  return data.projects ? data.projects.map(p => p.name).join(', ') : 'Alınamadı';
}

async function supabaseQuery(table, action = 'select') {
  const res = await fetch(`${process.env.SUPABASE_URL}/rest/v1/${table}?limit=10`, {
    headers: {
      'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY
    }
  });
  return await res.json();
}

// ============ MASTER ORCHESTRATOR ============

const MASTER_PROMPT = `Sen YİSA-S Ana Asistan'sın. Patron Serdinç Altay'ın kişisel AI asistanısın.

GÖREV: Patron'un isteklerini analiz et, doğru AI'ları ve araçları seç, işi yaptır, sonucu sun.

MEVCUT AI'LAR:
- GPT: Araştırma, bilgi toplama
- Gemini: Grafik, görsel analiz, tasarım değerlendirme
- Together: Farklı bakış açısı, alternatif değerlendirme
- Claude (sen): Düzenleme, birleştirme, final karar
- V0: UI/Component üretimi
- Cursor: Kod yazma, hata düzeltme, PR oluşturma

ARAÇLAR:
- GitHub: Repo yönetimi
- Vercel: Deployment
- Supabase: Veritabanı
- Railway: Backend

ROBOTLAR (Supabase'de tanımlı):
- CEO, COO, CTO, CFO, CMO, CPO, CSO, CCO, CHRO
- CISO (Siber Güvenlik)
- Veri Robotu
- YİSA-S Self

ÇALIŞMA PRENSİBİ:
1. İsteği analiz et
2. 2 farklı AI'dan görüş al (hangisi uygunsa)
3. Sonuçları birleştir ve düzenle
4. Üretim işiyse V0'a gönder
5. Kod işiyse Cursor'a gönder
6. Komut işiyse direkt çalıştır

CEVAP: JSON formatında döndür:
{
  "plan": "Ne yapılacak kısa açıklama",
  "ai_tasks": [{"ai": "gpt", "task": "..."}, {"ai": "gemini", "task": "..."}],
  "tools": ["github", "v0"],
  "final_action": "v0|cursor|direct|report"
}`;

async function masterOrchestrate(userMessage) {
  let report = '';
  
  try {
    // 1. Plan yap
    const planResult = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: MASTER_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    });
    
    const planText = planResult.content[0].text;
    let plan;
    
    try {
      const jsonMatch = planText.match(/\{[\s\S]*\}/);
      plan = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch {
      // Basit soru, direkt cevapla
      const direct = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        system: 'Sen YİSA-S Asistanısın. Patron Serdinç Altay\'a yardım et. Türkçe, profesyonel, kısa cevap ver.',
        messages: [{ role: 'user', content: userMessage }],
      });
      return direct.content[0].text;
    }

    if (!plan) {
      const direct = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        system: 'Sen YİSA-S Asistanısın. Patron Serdinç Altay\'a yardım et. Türkçe, profesyonel, kısa cevap ver.',
        messages: [{ role: 'user', content: userMessage }],
      });
      return direct.content[0].text;
    }

    report += `🎯 **GÖREV:** ${plan.plan}\n\n`;

    // 2. AI'ları çalıştır
    const aiResults = {};
    
    if (plan.ai_tasks && plan.ai_tasks.length > 0) {
      report += `🤖 **AI ÇALIŞIYOR:**\n`;
      
      for (const task of plan.ai_tasks) {
        if (task.ai === 'gpt') {
          report += `📊 GPT araştırıyor...\n`;
          aiResults.gpt = await callGPT(task.task);
        } else if (task.ai === 'gemini') {
          report += `🎨 Gemini analiz ediyor...\n`;
          aiResults.gemini = await callGemini(task.task);
        } else if (task.ai === 'together') {
          report += `🔄 Together değerlendiriyor...\n`;
          aiResults.together = await callTogether(task.task);
        }
      }
      report += `\n`;
    }

    // 3. Araçları çalıştır
    if (plan.tools && plan.tools.length > 0) {
      report += `🔧 **ARAÇLAR:**\n`;
      
      for (const tool of plan.tools) {
        if (tool === 'github') {
          const repos = await githubListRepos();
          report += `📁 GitHub: ${repos}\n`;
        } else if (tool === 'vercel') {
          const projects = await vercelListProjects();
          report += `🚀 Vercel: ${projects}\n`;
        }
      }
      report += `\n`;
    }

    // 4. Final işlem
    if (plan.final_action === 'v0' && aiResults.gpt) {
      report += `🎨 **V0 ÜRETİM:**\n`;
      const v0Result = await callV0(aiResults.gpt);
      report += v0Result + '\n\n';
    } else if (plan.final_action === 'cursor') {
      report += `💻 **CURSOR:**\n`;
      const cursorResult = await callCursor(userMessage);
      if (cursorResult.success) {
        report += `✅ Agent başlatıldı: ${cursorResult.url}\n\n`;
      } else {
        report += `❌ Hata: ${cursorResult.error}\n\n`;
      }
    }

    // 5. Sonuçları birleştir
    if (Object.keys(aiResults).length > 0) {
      report += `📋 **SONUÇLAR:**\n\n`;
      
      if (aiResults.gpt) {
        report += `**GPT Araştırması:**\n${aiResults.gpt}\n\n`;
      }
      if (aiResults.gemini) {
        report += `**Gemini Analizi:**\n${aiResults.gemini}\n\n`;
      }
      if (aiResults.together) {
        report += `**Together Değerlendirmesi:**\n${aiResults.together}\n\n`;
      }

      // Claude final düzenleme
      const finalEdit = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        system: 'Verilen AI çıktılarını birleştir, düzenle, profesyonel özet yap. Türkçe.',
        messages: [{ role: 'user', content: JSON.stringify(aiResults) }],
      });
      
      report += `✅ **FİNAL:**\n${finalEdit.content[0].text}\n`;
    }

    return report;

  } catch (e) {
    return `Hata: ${e.message}`;
  }
}

// ============ HIZLI KOMUTLAR ============

function detectQuickCommand(msg) {
  const m = msg.toLowerCase();
  if (m.includes('github repo') || m.includes('github listele')) return 'github';
  if (m.includes('vercel proje')) return 'vercel';
  if (m.includes('supabase tablo')) return 'supabase';
  if (m.includes('railway durum')) return 'railway';
  if (m.includes('sistem kur') || m.includes('robotu kur')) return 'setup';
  if (m.includes('robot listele')) return 'robots';
  return null;
}

// ============ MAIN ENDPOINT ============

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Mesaj gerekli' });

    const cmd = detectQuickCommand(message);
    
    if (cmd === 'github') {
      const repos = await githubListRepos();
      return res.json({ message: `📁 **GitHub Repolar:**\n${repos}`, model: 'github' });
    }
    if (cmd === 'vercel') {
      const projects = await vercelListProjects();
      return res.json({ message: `🚀 **Vercel Projeler:**\n${projects}`, model: 'vercel' });
    }
    if (cmd === 'railway') {
      return res.json({ message: `🚂 **Railway:** ONLINE`, model: 'railway' });
    }
    if (cmd === 'setup') {
      return res.json({ 
        message: `🔧 **SİSTEM KURULUMU**\n\nPatron, hangi robotu kurmak istiyorsunuz?\n\n1. CEO Robot\n2. CISO Robot (Siber Güvenlik)\n3. COO Robot\n4. Veri Robotu\n5. YİSA-S Self\n6. Tüm C-Level Robotlar\n\nNumara veya isim yazın.`, 
        model: 'setup' 
      });
    }
    if (cmd === 'robots') {
      return res.json({ 
        message: `🤖 **ROBOT KADROSU:**\n\n👔 CEO - Strateji\n🔒 CISO - Güvenlik\n⚙️ COO - Operasyon\n💰 CFO - Finans\n💻 CTO - Teknoloji\n📢 CMO - Pazarlama\n📦 CPO - Ürün\n🛡️ CSO - Strateji\n📞 CCO - Müşteri\n👥 CHRO - İK\n📊 Veri Robotu\n🔧 YİSA-S Self`, 
        model: 'system' 
      });
    }

    // Master Orchestrator
    const response = await masterOrchestrate(message);
    res.json({ message: response, model: 'master' });

  } catch (error) {
    console.error('Error:', error);
    res.json({ message: 'Hata: ' + error.message, model: 'error' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', version: '2.0-master' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`YİSA-S Master running on ${PORT}`));
