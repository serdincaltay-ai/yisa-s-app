import { NextResponse } from "next/server"

export async function GET() {
  const check = (key: string) => process.env[key] ? "ok" : "no_key"

  const agents = {
    gpt: check("OPENAI_API_KEY"),
    claude: check("ANTHROPIC_API_KEY"),
    gemini: check("GOOGLE_API_KEY") === "ok" ? "ok" : check("GEMINI_API_KEY"),
    together: check("TOGETHER_API_KEY"),
    github: check("GITHUB_TOKEN"),
    vercel: check("VERCEL_TOKEN"),
    supabase: check("NEXT_PUBLIC_SUPABASE_URL"),
  }

  const okCount = Object.values(agents).filter((s) => s === "ok").length

  return NextResponse.json({
    system: okCount > 4 ? "healthy" : okCount > 0 ? "degraded" : "down",
    ok: okCount,
    total: Object.keys(agents).length,
    agents,
  })
}
