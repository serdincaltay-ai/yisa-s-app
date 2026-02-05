// YİSA-S System Health Check — GET /api/system/health
// Tüm agent'ların durumunu kontrol eder

import { NextResponse } from "next/server"

interface AgentHealth {
  status: "ok" | "error" | "no_key" | "simulated"
  latency?: number
  error?: string
  lastCheck: string
}

async function checkAgent(
  name: string,
  testFn: () => Promise<void>
): Promise<AgentHealth> {
  const start = Date.now()
  try {
    await testFn()
    return {
      status: "ok",
      latency: Date.now() - start,
      lastCheck: new Date().toISOString(),
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    if (msg.includes("no_key") || msg.includes("API key")) {
      return { status: "no_key", error: msg, lastCheck: new Date().toISOString() }
    }
    return {
      status: "error",
      latency: Date.now() - start,
      error: msg,
      lastCheck: new Date().toISOString(),
    }
  }
}

async function checkOpenAI(): Promise<void> {
  if (!process.env.OPENAI_API_KEY) throw new Error("no_key")
  const res = await fetch("https://api.openai.com/v1/models", {
    headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    signal: AbortSignal.timeout(5000),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
}

async function checkAnthropic(): Promise<void> {
  if (!process.env.ANTHROPIC_API_KEY) throw new Error("no_key")
  const key = process.env.ANTHROPIC_API_KEY
  if (!key.startsWith("sk-ant-")) throw new Error("Invalid key format")
}

async function checkGemini(): Promise<void> {
  const key =
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.GOOGLE_GEMINI_API_KEY
  if (!key) throw new Error("no_key")
}

async function checkTogether(): Promise<void> {
  if (!process.env.TOGETHER_API_KEY) throw new Error("no_key")
}

async function checkGitHub(): Promise<void> {
  if (!process.env.GITHUB_TOKEN) throw new Error("no_key")
  const res = await fetch("https://api.github.com/user", {
    headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` },
    signal: AbortSignal.timeout(5000),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
}

async function checkVercel(): Promise<void> {
  if (!process.env.VERCEL_TOKEN) throw new Error("no_key")
}

async function checkSupabase(): Promise<void> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) throw new Error("no_key")
  const res = await fetch(`${url}/rest/v1/`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
    signal: AbortSignal.timeout(5000),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
}

export async function GET() {
  const [gpt, claude, gemini, together, github, vercel, supabase] =
    await Promise.all([
      checkAgent("gpt", checkOpenAI),
      checkAgent("claude", checkAnthropic),
      checkAgent("gemini", checkGemini),
      checkAgent("together", checkTogether),
      checkAgent("github", checkGitHub),
      checkAgent("vercel", checkVercel),
      checkAgent("supabase", checkSupabase),
    ])

  const agents = { gpt, claude, gemini, together, github, vercel, supabase }

  const okCount = Object.values(agents).filter((a) => a.status === "ok").length
  const totalCount = Object.keys(agents).length

  return NextResponse.json({
    system: okCount === totalCount ? "healthy" : okCount > 0 ? "degraded" : "down",
    ok: okCount,
    total: totalCount,
    agents,
    checkedAt: new Date().toISOString(),
  })
}
```

3. Aşağıda **"Commit changes"** butonuna basın

Vercel otomatik deploy edecek, 30-40 saniye sonra tekrar deneyin:
```
https://app.yisa-s.com/api/system/health
