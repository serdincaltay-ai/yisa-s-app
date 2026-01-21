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

// ============ GITHUB WRITE ============

async function githubCreateFile(path, content, message = 'Robot: Dosya oluşturuldu') {
  try {
    const token = process.env.GITHUB_TOKEN_FINEGRAINED || process.env.GITHUB_TOKEN;
    if (!token) return { success: false, error: 'GitHub token eksik' };

    const owner = process.env.GITHUB_OWNER || 'serdincaltay-ai';
    const repo = process.env.GITHUB_REPO || 'yisa-s-app';

    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github+json'
      },
      body: JSON.stringify({
        message,
        content: Buffer.from(content, 'utf-8').toString('base64')
      })
    });

    const data = await res.json();

    if (res.status === 201 && data.commit) {
      return { success: true, sha: data.commit.sha, url: data.content?.html_url };
    }
    if (res.status === 422 || res.status === 409) {
      return { success: false, error: 'Dosya zaten var (create yerine update kullan)' };
    }
    return { success: false, error: data.message || `GitHub hata: ${res.status}` };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

async function githubGetFile(path) {
  try {
    const token = process.env.GITHUB_TOKEN_FINEGRAINED || process.env.GITHUB_TOKEN;
    if (!token) return { success: false, error: 'GitHub token eksik' };

    const owner = process.env.GITHUB_OWNER || 'serdincaltay-ai';
    const repo = process.env.GITHUB_REPO || 'yisa-s-app';

    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json'
      }
    });

    if (res.status === 404) return { success: false, error: 'Dosya bulunamadı' };

    const data = await res.json();
    if (data.content) {
      return {
        success: true,
        content: Buffer.from(data.content, 'base64').toString('utf-8'),
        sha: data.sha
      };
    }
    return { success: false, error: 'Dosya içeriği okunamadı' };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

async function githubUpdateFile(path, content, message = 'Robot: Dosya güncellendi') {
  try {
    const token = process.env.GITHUB_TOKEN_FINEGRAINED || process.env.GITHUB_TOKEN;
    if (!token) return { success: false, error: 'GitHub token eksik' };

    const owner = process.env.GITHUB_OWNER || 'serdincaltay-ai';
    const repo = process.env.GITHUB_REPO || 'yisa-s-app';

    const existing = await githubGetFile(path);
    if (!existing.success) {
      return await githubCreateFile(path, content, message.replace('güncellendi', 'oluşturuldu'));
    }

    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github+json'
      },
      body: JSON.stringify({
        message,
        content: Buffer.from(content, 'utf-8').toString('base64'),
        sha: existing.sha
      })
    });

    const data = await res.json();
    if (data.commit) return { success: true, sha: data.commit.sha, url: data.content?.html_url };
    return { success: false, error: data.message || 'Bilinmeyen hata' };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

// ============ RAILWAY ENV ============

async function railwayAddEnv(name, value) {
  try {
    const token = process.env.RAILWAY_TOKEN;
    const projectId = process.env.RAILWAY_PROJECT_ID;
    const environmentId = process.env.RAILWAY_ENVIRONMENT_ID;
    const serviceId = process.env.RAILWAY_SERVICE_ID;

    if (!token) return { success: false, error: 'RAILWAY_TOKEN tanımlı değil' };
    if (!projectId || !environmentId || !serviceId) {
      return { success: false, error: 'RAILWAY_PROJECT_ID / RAILWAY_ENVIRONMENT_ID / RAILWAY_SERVICE_ID eksik' };
    }

    const res = await fetch('https://backboard.railway.app/graphql/v2', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: `
          mutation($input: VariableUpsertInput!) {
            variableUpsert(input: $input)
          }
        `,
        variables: {
          input: { projectId, environmentId, serviceId, name, value }
        }
      })
    });

    const data = await res.json();

    if (data.data?.variableUpsert) return { success: true, message: `${name} eklendi/güncellendi` };
    return { success: false, error: data.errors?.[0]?.message || 'Bilinmeyen hata' };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

// ============ SUPABASE DDL ============

async function supabaseExecSQL(sql) {
  try {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) return { success: false, error: 'SUPABASE_URL veya SUPABASE_SERVICE_ROLE_KEY eksik' };

    const rpcRes = await fetch(`${url}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'apikey': key,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: sql })
    });

    if (rpcRes.ok) {
      const data = await rpcRes.json().catch(() => null);
      return { success: true, result: data };
    }

    const err = await rpcRes.json().catch(() => ({}));
    return {
      success: false,
      error: `exec_sql RPC yok. Önce Supabase SQL Editor'da RPC oluşturun. (${err?.message || rpcRes.status})`
    };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

async function supabaseEnableRLS(tableName) {
  const sql = `ALTER TABLE public.${tableName} ENABLE ROW LEVEL SECURITY;`;
  return await supabaseExecSQL(sql);
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
- GitHub: Repo yönetimi, dosya oluşturma/güncelleme
- Vercel: Deployment
- Supabase: Veritabanı, RLS yönetimi
- Railway: Backend, env yönetimi

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
  if (m.includes('assistant sayfası') || m.includes('assistant oluştur')) return 'create_assistant';
  if (m.includes('railway env') || m.includes('railway değişken')) return 'railway_env';
  if (m.includes('rls düzelt') || m.includes('rls etkinleştir')) return 'fix_rls';
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

    if (cmd === 'create_assistant') {
      const pageContent = `'use client'

import RobotDashboard from '@/components/RobotDashboard'

export default function AssistantPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <RobotDashboard />
    </div>
  )
}
`;

      const path = 'app/assistant/page.tsx';
      const existing = await githubGetFile(path);
      const result = existing.success
        ? await githubUpdateFile(path, pageContent, 'Robot: /assistant sayfası güncellendi')
        : await githubCreateFile(path, pageContent, 'Robot: /assistant sayfası oluşturuldu');

      if (result.success) {
        return res.json({
          message: `✅ **/assistant sayfası hazır!**\n\n📁 Dosya: ${path}\n🔗 URL: ${result.url || 'GitHub'}\n\nVercel otomatik deploy tetikleyecek. 2-3 dk bekleyin.`,
          model: 'github'
        });
      }
      return res.json({ message: `❌ Hata: ${result.error}`, model: 'error' });
    }

    if (cmd === 'railway_env') {
      const url = process.env.SUPABASE_URL;
      const anon = process.env.SUPABASE_ANON_KEY;

      if (!anon) {
        return res.json({
          message: `❌ **SUPABASE_ANON_KEY tanımlı değil.**\n\nÖnce Railway'e SUPABASE_ANON_KEY ekleyin:\nSupabase → Settings → API → anon public key`,
          model: 'error'
        });
      }

      const env1 = await railwayAddEnv('NEXT_PUBLIC_SUPABASE_URL', url || '');
      const env2 = await railwayAddEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', anon);

      return res.json({
        message:
          `🚂 **Railway Env Güncelleme:**\n\n` +
          `1) NEXT_PUBLIC_SUPABASE_URL: ${env1.success ? '✅' : '❌ ' + env1.error}\n` +
          `2) NEXT_PUBLIC_SUPABASE_ANON_KEY: ${env2.success ? '✅' : '❌ ' + env2.error}`,
        model: 'railway'
      });
    }

    if (cmd === 'fix_rls') {
      const tables = ['job_types', 'worker_pools', 'routines', 'dashboard_templates', 'instagram_templates', 'slogans', 'franchise_customers'];
      let report = '🔒 **RLS Düzeltme:**\n\n';

      for (const table of tables) {
        const result = await supabaseEnableRLS(table);
        report += `${table}: ${result.success ? '✅' : '❌ ' + result.error}\n`;
      }

      report += '\n⚠️ RLS açıldı. Her tablo için policy tanımlanmalı.';
      return res.json({ message: report, model: 'supabase' });
    }

    const response = await masterOrchestrate(message);
    res.json({ message: response, model: 'master' });

  } catch (error) {
    console.error('Error:', error);
    res.json({ message: 'Hata: ' + error.message, model: 'error' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', version: '3.0-full' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`YİSA-S Master running on ${PORT}`));
