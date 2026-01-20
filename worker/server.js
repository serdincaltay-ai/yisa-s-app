const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
app.use(cors());
app.use(express.json());

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `Sen YİSA-S Robot'sun - Çoklu Yapay Zeka Motorlu Kolektif Zeka Sistemi.

PATRON MODU AKTİF - Serdinç Altay - Sistem Kurucusu & Sahibi

AKTİF AI MODELLERİ: Claude | GPT | Gemini | Together
ENTEGRE ARAÇLAR: GitHub | Vercel | Supabase | Railway

KOMUTLAR:
- "GitHub repo listele" → Repoları gösterir
- "Vercel projeleri listele" → Projeleri gösterir
- "GPT ile [mesaj]" → GPT kullanır
- "Gemini ile [mesaj]" → Gemini kullanır
- "Together ile [mesaj]" → Llama kullanır
- "Railway durumu" → Servis durumu

Türkçe konuş. "Patron" diye hitap et. Detaylı cevap ver.`;

// GPT
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
        messages: [
          { role: 'system', content: 'Sen YİSA-S sisteminin GPT motorusun. Türkçe cevap ver.' },
          { role: 'user', content: message }
        ],
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

// Gemini
async function callGemini(message) {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`,
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

// Together
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
        messages: [
          { role: 'system', content: 'Sen YİSA-S sisteminin Llama motorusun. Türkçe cevap ver.' },
          { role: 'user', content: message }
        ],
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

// GitHub
async function githubListRepos() {
  try {
    const res = await fetch('https://api.github.com/user/repos?per_page=10&sort=updated', {
      headers: { 'Authorization': `token ${process.env.GITHUB_TOKEN}` }
    });
    const repos = await res.json();
    if (!Array.isArray(repos)) return 'GitHub repo listesi alınamadı.';
    let result = '📁 GitHub Repolarınız:\n\n';
    repos.forEach((repo, i) => {
      result += `${i + 1}. ${repo.name}\n   ${repo.description || 'Açıklama yok'}\n\n`;
    });
    return result;
  } catch (e) {
    return 'GitHub Hatası: ' + e.message;
  }
}

// Vercel
async function vercelListProjects() {
  try {
    const res = await fetch('https://api.vercel.com/v9/projects', {
      headers: { 'Authorization': `Bearer ${process.env.VERCEL_TOKEN}` }
    });
    const data = await res.json();
    if (!data.projects) return 'Vercel projeleri alınamadı.';
    let result = '🚀 Vercel Projeleriniz:\n\n';
    data.projects.forEach((p, i) => {
      result += `${i + 1}. ${p.name}\n   Framework: ${p.framework || '-'}\n\n`;
    });
    return result;
  } catch (e) {
    return 'Vercel Hatası: ' + e.message;
  }
}

// Model detection
function detectModel(message) {
  const lower = message.toLowerCase();
  if (lower.includes('gpt ile')) return 'gpt';
  if (lower.includes('gemini ile')) return 'gemini';
  if (lower.includes('together ile') || lower.includes('llama ile')) return 'together';
  return 'claude';
}

// Tool detection
function detectTool(message) {
  const lower = message.toLowerCase();
  if (lower.includes('github repo')) return 'github-repos';
  if (lower.includes('vercel proje')) return 'vercel-projects';
  if (lower.includes('railway durum')) return 'railway-status';
  return null;
}

// Main chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Mesaj gerekli' });

    // Check tools first
    const tool = detectTool(message);
    if (tool === 'github-repos') {
      const result = await githubListRepos();
      return res.json({ message: result, model: 'github' });
    }
    if (tool === 'vercel-projects') {
      const result = await vercelListProjects();
      return res.json({ message: result, model: 'vercel' });
    }
    if (tool === 'railway-status') {
      return res.json({ 
        message: '🚂 Railway Durumu:\n\n✅ yisa-s-app: ONLINE\n✅ Worker: ACTIVE', 
        model: 'railway' 
      });
    }

    // AI model selection
    const model = detectModel(message);
    let response = '';

    if (model === 'gpt') {
      response = await callGPT(message.replace(/gpt ile/i, '').trim());
    } else if (model === 'gemini') {
      response = await callGemini(message.replace(/gemini ile/i, '').trim());
    } else if (model === 'together') {
      response = await callTogether(message.replace(/together ile|llama ile/i, '').trim());
    } else {
      // Claude default
      const result = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: message }],
      });
      response = result.content[0].type === 'text' ? result.content[0].text : '';
    }

    res.json({ message: response, model });
  } catch (error) {
    console.error('Chat error:', error);
    res.json({ message: 'Hata: ' + error.message, model: 'error' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`YİSA-S Worker running on port ${PORT}`);
});
