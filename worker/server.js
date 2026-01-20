const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
app.use(cors());
app.use(express.json());

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// ============ ROBOT TANIMLARI ============

const ROBOTS = {
  ceo: {
    name: 'CEO Robot',
    emoji: '👔',
    role: 'Stratejik kararlar, iş planları, vizyon',
    prompt: `Sen YİSA-S CEO Robot'usun. Stratejik kararlar alır, iş planları yapar, vizyoner düşünürsün.
Patron Serdinç Altay'a rapor verirsin. Kararlarını veriye dayandır, risk analizi yap.
Kısa ve öz cevap ver. Türkçe konuş.`
  },
  cto: {
    name: 'CTO Robot',
    emoji: '💻',
    role: 'Teknoloji stratejisi, mimari, teknik kararlar',
    prompt: `Sen YİSA-S CTO Robot'usun. Teknoloji stratejisi belirler, sistem mimarisi tasarlar, teknik kararlar alırsın.
Modern teknolojileri bilir, scalable çözümler önerirsin. Kısa ve öz cevap ver. Türkçe konuş.`
  },
  cfo: {
    name: 'CFO Robot',
    emoji: '💰',
    role: 'Finans, bütçe, maliyet analizi',
    prompt: `Sen YİSA-S CFO Robot'usun. Finansal analiz yapar, bütçe planlar, maliyet optimizasyonu önerirsin.
ROI hesaplar, finansal riskleri değerlendirirsin. Kısa ve öz cevap ver. Türkçe konuş.`
  },
  cmo: {
    name: 'CMO Robot',
    emoji: '📢',
    role: 'Pazarlama, büyüme, marka stratejisi',
    prompt: `Sen YİSA-S CMO Robot'usun. Pazarlama stratejisi belirler, büyüme planları yapar, marka yönetirsin.
Müşteri segmentasyonu, kampanya planlaması yaparsın. Kısa ve öz cevap ver. Türkçe konuş.`
  },
  coo: {
    name: 'COO Robot',
    emoji: '⚙️',
    role: 'Operasyon, süreç optimizasyonu, verimlilik',
    prompt: `Sen YİSA-S COO Robot'usun. Günlük operasyonları yönetir, süreçleri optimize eder, verimliliği artırırsın.
KPI takibi, darboğaz tespiti yaparsın. Kısa ve öz cevap ver. Türkçe konuş.`
  },
  ciso: {
    name: 'CISO Robot',
    emoji: '🔒',
    role: 'Siber güvenlik, tehdit analizi, koruma',
    prompt: `Sen YİSA-S CISO Robot'usun. Siber güvenlik tehditleri analiz eder, güvenlik politikaları önerir.
OWASP, NIST standartlarını bilirsin. Kısa ve öz cevap ver. Türkçe konuş.`
  },
  chro: {
    name: 'CHRO Robot',
    emoji: '👥',
    role: 'İnsan kaynakları, ekip yönetimi',
    prompt: `Sen YİSA-S CHRO Robot'usun. İnsan kaynakları yönetir, ekip oluşturur, yetenek geliştirir.
Organizasyon yapısı, performans yönetimi yaparsın. Kısa ve öz cevap ver. Türkçe konuş.`
  },
  clo: {
    name: 'CLO Robot',
    emoji: '⚖️',
    role: 'Hukuk, uyumluluk, sözleşmeler',
    prompt: `Sen YİSA-S CLO Robot'usun. Hukuki danışmanlık yapar, sözleşme inceler, uyumluluk sağlarsın.
KVKK, GDPR bilirsin. Kısa ve öz cevap ver. Türkçe konuş.`
  },
  self: {
    name: 'Self Robot',
    emoji: '🔧',
    role: 'Sistem bakımı, performans, iyileştirme',
    prompt: `Sen YİSA-S Self Robot'usun. Sistemin kendi bakımını yapar, hataları tespit eder, performansı optimize edersin.
Proaktif çözümler önerirsin. Kısa ve öz cevap ver. Türkçe konuş.`
  },
  analyst: {
    name: 'Analyst Robot',
    emoji: '📊',
    role: 'Veri analizi, raporlama, içgörü',
    prompt: `Sen YİSA-S Analyst Robot'usun. Veri analizi yapar, raporlar hazırlar, içgörüler sunar.
Trendleri tespit eder, tahminler yaparsın. Kısa ve öz cevap ver. Türkçe konuş.`
  },
  developer: {
    name: 'Developer Robot',
    emoji: '👨‍💻',
    role: 'Kod yazma, geliştirme, debugging',
    prompt: `Sen YİSA-S Developer Robot'usun. Kod yazar, bug düzeltir, feature geliştirir.
Clean code, best practices uygularsın. Kısa ve öz cevap ver. Türkçe konuş.`
  },
  designer: {
    name: 'Designer Robot',
    emoji: '🎨',
    role: 'UI/UX tasarım, görsel kimlik',
    prompt: `Sen YİSA-S Designer Robot'usun. UI/UX tasarlar, kullanıcı deneyimi optimize eder.
Modern tasarım trendlerini bilirsin. Kısa ve öz cevap ver. Türkçe konuş.`
  },
  qa: {
    name: 'QA Robot',
    emoji: '🧪',
    role: 'Test, kalite kontrol, bug tespiti',
    prompt: `Sen YİSA-S QA Robot'usun. Test yapar, kalite kontrol eder, bug tespit eder.
Test senaryoları yazar, otomasyon önerirsin. Kısa ve öz cevap ver. Türkçe konuş.`
  },
  devops: {
    name: 'DevOps Robot',
    emoji: '🚀',
    role: 'CI/CD, deployment, altyapı',
    prompt: `Sen YİSA-S DevOps Robot'usun. CI/CD pipeline kurar, deployment yapar, altyapı yönetir.
Docker, Kubernetes, cloud bilirsin. Kısa ve öz cevap ver. Türkçe konuş.`
  },
  support: {
    name: 'Support Robot',
    emoji: '🎧',
    role: 'Müşteri destek, sorun çözme',
    prompt: `Sen YİSA-S Support Robot'usun. Müşteri sorunlarını çözer, destek sağlar.
Empati kurar, hızlı çözüm üretirsin. Kısa ve öz cevap ver. Türkçe konuş.`
  },
  researcher: {
    name: 'Researcher Robot',
    emoji: '🔬',
    role: 'Araştırma, trend analizi, inovasyon',
    prompt: `Sen YİSA-S Researcher Robot'usun. Pazar araştırması yapar, trendleri analiz eder, inovasyon önerir.
Rakip analizi, fırsat tespiti yaparsın. Kısa ve öz cevap ver. Türkçe konuş.`
  },
  trainer: {
    name: 'Trainer Robot',
    emoji: '📚',
    role: 'Eğitim, dokümantasyon, bilgi aktarımı',
    prompt: `Sen YİSA-S Trainer Robot'usun. Eğitim materyali hazırlar, dokümantasyon yazar, bilgi aktarır.
Anlaşılır anlatım, örnek odaklı öğretirsin. Kısa ve öz cevap ver. Türkçe konuş.`
  }
};

// ============ ORKESTRATÖR PROMPT ============

const ORCHESTRATOR_PROMPT = `Sen YİSA-S Akıllı Orkestratör Asistanısın. Patron Serdinç Altay'ın tüm robotlarını yönetirsin.

GÖREVLER:
1. Patron'un isteğini analiz et
2. Hangi robotların çalışması gerektiğine karar ver
3. Robotları koordine et
4. Sonuçları birleştir

MEVCUT ROBOTLAR:
${Object.entries(ROBOTS).map(([key, r]) => `- ${r.emoji} ${r.name} (${key}): ${r.role}`).join('\n')}

ARAÇLAR:
- GitHub: Repo yönetimi
- Vercel: Deployment
- Supabase: Veritabanı
- Railway: Backend
- V0: UI üretimi
- Cursor: Kod düzeltme

CEVAP FORMATI:
Patron'un isteğini analiz et ve şu JSON formatında cevap ver:
{
  "analysis": "İsteğin kısa analizi",
  "robots": ["robot1", "robot2"],
  "tasks": {
    "robot1": "Bu robota verilecek görev",
    "robot2": "Bu robota verilecek görev"
  },
  "workflow": "İş akışı açıklaması",
  "tools": ["tool1", "tool2"]
}

Sadece JSON döndür, başka bir şey yazma.`;

// ============ ROBOT ÇAĞIRMA ============

async function callRobot(robotKey, task) {
  const robot = ROBOTS[robotKey];
  if (!robot) return { error: `Robot bulunamadı: ${robotKey}` };
  
  try {
    const result = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: robot.prompt,
      messages: [{ role: 'user', content: task }],
    });
    return {
      robot: robot.name,
      emoji: robot.emoji,
      response: result.content[0].type === 'text' ? result.content[0].text : 'Yanıt alınamadı.'
    };
  } catch (e) {
    return { error: `${robot.name} Hatası: ${e.message}` };
  }
}

// ============ AI MODELLERİ ============

async function callGPT(message) {
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: message }],
        max_tokens: 4096
      })
    });
    const data = await res.json();
    if (data.error) return 'GPT Hatası: ' + data.error.message;
    return data.choices?.[0]?.message?.content || 'GPT yanıt veremedi.';
  } catch (e) {
    return 'GPT Hatası: ' + e.message;
  }
}

async function callGemini(message) {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: message }] }] })
      }
    );
    const data = await res.json();
    if (data.error) return 'Gemini Hatası: ' + data.error.message;
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Gemini yanıt veremedi.';
  } catch (e) {
    return 'Gemini Hatası: ' + e.message;
  }
}

async function callTogether(message) {
  try {
    const res = await fetch('https://api.together.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`
      },
      body: JSON.stringify({
        model: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
        messages: [{ role: 'user', content: message }],
        max_tokens: 4096
      })
    });
    const data = await res.json();
    if (data.error) return 'Together Hatası: ' + data.error.message;
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
    if (data.error) return 'V0 Hatası: ' + data.error.message;
    return data.choices?.[0]?.message?.content || 'V0 yanıt veremedi.';
  } catch (e) {
    return 'V0 Hatası: ' + e.message;
  }
}

// ============ ARAÇLAR ============

async function githubListRepos() {
  try {
    const res = await fetch('https://api.github.com/user/repos?per_page=10&sort=updated', {
      headers: { 'Authorization': `token ${process.env.GITHUB_TOKEN}` }
    });
    const repos = await res.json();
    if (!Array.isArray(repos)) return 'GitHub repo listesi alınamadı.';
    return repos.map((r, i) => `${i + 1}. ${r.name}`).join('\n');
  } catch (e) {
    return 'GitHub Hatası: ' + e.message;
  }
}

async function vercelListProjects() {
  try {
    const res = await fetch('https://api.vercel.com/v9/projects', {
      headers: { 'Authorization': `Bearer ${process.env.VERCEL_TOKEN}` }
    });
    const data = await res.json();
    if (!data.projects) return 'Vercel projeleri alınamadı.';
    return data.projects.map((p, i) => `${i + 1}. ${p.name}`).join('\n');
  } catch (e) {
    return 'Vercel Hatası: ' + e.message;
  }
}

async function supabaseListTables() {
  try {
    const res = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/?apikey=${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY
        }
      }
    );
    const data = await res.json();
    if (data.paths) {
      const tables = Object.keys(data.paths).filter(p => !p.includes('rpc')).map(p => p.replace('/', ''));
      return tables.join(', ');
    }
    return 'Tablolar alınamadı.';
  } catch (e) {
    return 'Supabase Hatası: ' + e.message;
  }
}

async function cursorAgent(task) {
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
    if (data.id) return `Agent başlatıldı: ${data.id}`;
    return 'Cursor başlatılamadı: ' + JSON.stringify(data);
  } catch (e) {
    return 'Cursor Hatası: ' + e.message;
  }
}

// ============ ORKESTRATÖR ============

async function orchestrate(userMessage) {
  let report = `🎯 **YİSA-S ORKESTRATÖR**\n\n`;
  report += `📋 **Görev:** ${userMessage}\n\n`;

  // 1. Görevi analiz et
  report += `⏳ Görev analiz ediliyor...\n\n`;
  
  try {
    const analysisResult = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: ORCHESTRATOR_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    });
    
    const analysisText = analysisResult.content[0].type === 'text' ? analysisResult.content[0].text : '{}';
    
    // JSON parse et
    let plan;
    try {
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      plan = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch (e) {
      plan = null;
    }

    if (!plan || !plan.robots || plan.robots.length === 0) {
      // Basit soru - doğrudan cevapla
      const directResult = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        system: `Sen YİSA-S Asistanısın. Patron Serdinç Altay'a yardım ediyorsun. Türkçe konuş, "Patron" diye hitap et.`,
        messages: [{ role: 'user', content: userMessage }],
      });
      return directResult.content[0].type === 'text' ? directResult.content[0].text : 'Yanıt alınamadı.';
    }

    report += `📊 **Analiz:** ${plan.analysis}\n\n`;
    report += `🔄 **İş Akışı:** ${plan.workflow}\n\n`;
    report += `🤖 **Görevlendirilen Robotlar:** ${plan.robots.length}\n\n`;
    report += `---\n\n`;

    // 2. Robotları çağır
    for (const robotKey of plan.robots) {
      const task = plan.tasks[robotKey] || userMessage;
      const robot = ROBOTS[robotKey];
      
      if (!robot) continue;
      
      report += `${robot.emoji} **${robot.name}** çalışıyor...\n`;
      
      const result = await callRobot(robotKey, task);
      
      if (result.error) {
        report += `❌ Hata: ${result.error}\n\n`;
      } else {
        report += `✅ Tamamlandı\n`;
        report += `📝 **Yanıt:**\n${result.response}\n\n`;
      }
      
      report += `---\n\n`;
    }

    // 3. Araçları çalıştır
    if (plan.tools && plan.tools.length > 0) {
      report += `🔧 **Araçlar Çalıştırılıyor:**\n\n`;
      
      for (const tool of plan.tools) {
        if (tool === 'github') {
          report += `📁 GitHub: ${await githubListRepos()}\n\n`;
        } else if (tool === 'vercel') {
          report += `🚀 Vercel: ${await vercelListProjects()}\n\n`;
        } else if (tool === 'supabase') {
          report += `🗄️ Supabase: ${await supabaseListTables()}\n\n`;
        } else if (tool === 'v0') {
          report += `🎨 V0: Tasarım üretiliyor...\n`;
          const v0Result = await callV0(plan.tasks.designer || userMessage);
          report += `${v0Result}\n\n`;
        } else if (tool === 'cursor') {
          report += `💻 Cursor: ${await cursorAgent(plan.tasks.developer || userMessage)}\n\n`;
        }
      }
    }

    report += `✅ **GÖREV TAMAMLANDI**\n\n`;
    report += `Başka bir şey yapmamı ister misiniz Patron?`;

    return report;

  } catch (e) {
    return `Orkestratör Hatası: ${e.message}`;
  }
}

// ============ HIZLI KOMUTLAR ============

function detectQuickCommand(message) {
  const lower = message.toLowerCase();
  if (lower.includes('github repo') || lower.includes('github listele')) return 'github';
  if (lower.includes('vercel proje') || lower.includes('vercel listele')) return 'vercel';
  if (lower.includes('supabase tablo')) return 'supabase';
  if (lower.includes('railway durum')) return 'railway';
  if (lower.includes('robotları listele') || lower.includes('robot listesi')) return 'list-robots';
  if (lower.includes('gpt ile')) return 'gpt';
  if (lower.includes('gemini ile')) return 'gemini';
  if (lower.includes('together ile')) return 'together';
  if (lower.includes('v0 ile')) return 'v0';
  return null;
}

// ============ MAIN ENDPOINT ============

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Mesaj gerekli' });

    // 1. Hızlı komutları kontrol et
    const quickCmd = detectQuickCommand(message);
    
    if (quickCmd === 'github') {
      const repos = await githubListRepos();
      return res.json({ message: `📁 **GitHub Repolarınız:**\n\n${repos}`, model: 'github' });
    }
    if (quickCmd === 'vercel') {
      const projects = await vercelListProjects();
      return res.json({ message: `🚀 **Vercel Projeleriniz:**\n\n${projects}`, model: 'vercel' });
    }
    if (quickCmd === 'supabase') {
      const tables = await supabaseListTables();
      return res.json({ message: `🗄️ **Supabase Tablolarınız:**\n\n${tables}`, model: 'supabase' });
    }
    if (quickCmd === 'railway') {
      return res.json({ message: `🚂 **Railway Durumu:**\n\n✅ yisa-s-app: ONLINE\n✅ Backend: ACTIVE`, model: 'railway' });
    }
    if (quickCmd === 'list-robots') {
      let robotList = `🤖 **YİSA-S ROBOT KADROSU (17 Robot)**\n\n`;
      Object.entries(ROBOTS).forEach(([key, r]) => {
        robotList += `${r.emoji} **${r.name}** (${key})\n   └ ${r.role}\n\n`;
      });
      return res.json({ message: robotList, model: 'system' });
    }
    if (quickCmd === 'gpt') {
      const response = await callGPT(message.replace(/gpt ile/i, '').trim());
      return res.json({ message: response, model: 'gpt' });
    }
    if (quickCmd === 'gemini') {
      const response = await callGemini(message.replace(/gemini ile/i, '').trim());
      return res.json({ message: response, model: 'gemini' });
    }
    if (quickCmd === 'together') {
      const response = await callTogether(message.replace(/together ile/i, '').trim());
      return res.json({ message: response, model: 'together' });
    }
    if (quickCmd === 'v0') {
      const response = await callV0(message.replace(/v0 ile/i, '').trim());
      return res.json({ message: response, model: 'v0' });
    }

    // 2. Orkestratör ile işle
    const response = await orchestrate(message);
    res.json({ message: response, model: 'orchestrator' });

  } catch (error) {
    console.error('Chat error:', error);
    res.json({ message: 'Hata: ' + error.message, model: 'error' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', robots: Object.keys(ROBOTS).length, timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`YİSA-S Orkestratör running on port ${PORT} with ${Object.keys(ROBOTS).length} robots`);
});
```

---

**17 ROBOT KADROSU:**

| Robot | Emoji | Görev |
|-------|-------|-------|
| CEO | 👔 | Strateji & Vizyon |
| CTO | 💻 | Teknoloji & Mimari |
| CFO | 💰 | Finans & Bütçe |
| CMO | 📢 | Pazarlama & Büyüme |
| COO | ⚙️ | Operasyon & Süreç |
| CISO | 🔒 | Siber Güvenlik |
| CHRO | 👥 | İnsan Kaynakları |
| CLO | ⚖️ | Hukuk & Uyumluluk |
| Self | 🔧 | Sistem Bakımı |
| Analyst | 📊 | Veri Analizi |
| Developer | 👨‍💻 | Kod Geliştirme |
| Designer | 🎨 | UI/UX Tasarım |
| QA | 🧪 | Test & Kalite |
| DevOps | 🚀 | CI/CD & Altyapı |
| Support | 🎧 | Müşteri Destek |
| Researcher | 🔬 | Araştırma |
| Trainer | 📚 | Eğitim |

---

**KULLANIM ÖRNEKLERİ:**
```
"Franchise modülü için plan yap"
→ CEO, CTO, CFO, Designer robotları çalışır

"Güvenlik açığı analizi yap"
→ CISO, DevOps, QA robotları çalışır

"Yeni özellik geliştir: kullanıcı dashboard"
→ Designer, Developer, QA, DevOps robotları çalışır

"Robotları listele"
→ Tüm robotların listesi

"GitHub repo listele"
→ Hızlı komut
