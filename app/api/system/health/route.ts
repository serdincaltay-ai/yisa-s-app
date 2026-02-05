import { NextResponse } from "next/server"

interface AgentHealth {
  status: "ok" | "error" | "no_key" | "simulated"
  latency?: number
  error?: string
  lastCheck: string
}

async function checkAgent(name: string, testFn: () => Promise<void>): Promise<AgentHealth> {
  const start = Date.now()
  try {
    await testFn()
    return { status: "ok", latency: Date.now() - start, lastCheck: new Date().toISOString() }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    if (msg.includes("no_key")) {
      return { status: "no_key", error: msg, lastCheck: new Date().toISOString() }
    }
    return { status: "error", latency: Date.now() - start, error: msg, lastCheck: new Date().toISOString() }
  }
}

async function checkOpenAI(): Promise<void> {
  if (!process.env.OPENAI_API_KEY) throw new Error("no_key")
}

async function checkAnthropic(): Promise<void> {
  if (!process.env.ANTHROPIC_API_KEY) throw new Error("no_key")
}

async function checkGemini(): Promise<void> {
  const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.GOOGLE_GEMINI_API_KEY
  if (!key) throw new Error("no_key")
}

async function checkTogether(): Promise<void> {
  if (!process.env.TOGETHER_API_KEY) throw new Error("no_key")
}

async function checkGitHub(): Promise<void> {
  if (!process.env.GITHUB_TOKEN) throw new Error("no_key")
}

async function checkVercel(): Promise<void> {
  if (!process.env.VERCEL_TOKEN) throw new Error("no_key")
}

async function checkSupabase(): Promise<void> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) throw new Error("no_key")
}

export async function GET() {
  const [gpt, claude, gemini, together, github, vercel, supabase] = await Promise.all([
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

  return NextResponse.json({
    system: okCount === agents.length ? "healthy" : okCount > 0 ? "degraded" : "down",
    ok: okCount,
    total: Object.keys(agents).length,
    agents,
  })
}
