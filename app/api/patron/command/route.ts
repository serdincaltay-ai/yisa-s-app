// YİSA-S Patron Robot - API Route
// POST /api/patron/command

import { NextRequest, NextResponse } from "next/server"
import { runPatronCommand } from "@/lib/patron-robot/orchestrator"
import type { Mode, Stage } from "@/lib/patron-robot/types"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const text = typeof body.text === "string" ? body.text.trim() : ""
    const tenantId =
      typeof body.tenantId === "string"
        ? body.tenantId
        : body.tenant ?? "TENANT_DEMO"
    const mode: Mode =
      body.mode === "LIVE" || body.mode === "DEMO" ? body.mode : "DEMO"
    const dryRun = body.dryRun !== false
    const requestedStage: Stage =
      body.stage === "STAGING" || body.stage === "CANARY" || body.stage === "PROD"
        ? body.stage
        : "STAGING"

    if (!text) {
      return NextResponse.json(
        { error: "Komut metni (text) gerekli" },
        { status: 400 }
      )
    }

    const result = await runPatronCommand({
      tenantId,
      mode,
      text,
      dryRun,
      requestedStage,
    })

    return NextResponse.json(result)
  } catch (e) {
    const err = e instanceof Error ? e.message : String(e)
    return NextResponse.json(
      { error: "Patron komutu işlenemedi", detail: err },
      { status: 500 }
    )
  }
}
