"use client"

// YİSA-S Patron Panel - Komut Arayüzü
// v0.3.0 - Altılı Ortak Akıl İskeleti

import { useState } from "react"

interface CommandResult {
  status: string
  plan?: { intent: string; taskType: string }
  build?: {
    agent: string
    output: { message?: string; raw?: unknown }
  }
  check?: { ok: boolean; warnings: string[] }
  preflight?: {
    ok: boolean
    rbacOk: boolean
    lockStatus: { currentOwner: string | null }
  }
  release?: { stage: string; status: string; releaseId: string }
}

export default function PatronCommandPanel() {
  const [command, setCommand] = useState("")
  const [mode, setMode] = useState<"DEMO" | "LIVE">("DEMO")
  const [dryRun, setDryRun] = useState(true)
  const [stage, setStage] = useState<"STAGING" | "CANARY" | "PROD">("STAGING")
  const [tenant, setTenant] = useState("TENANT_DEMO")
  const [results, setResults] = useState<CommandResult[]>([])
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!command.trim()) return
    setLoading(true)

    try {
      const res = await fetch("/api/patron/command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: command,
          tenantId: tenant,
          mode,
          dryRun,
          stage,
        }),
      })

      const result = (await res.json()) as CommandResult
      if (!res.ok) {
        setResults((prev) => [
          {
            status: "ERROR",
            plan: undefined,
            build: {
              agent: "api",
              output: {
                message: (result as { detail?: string })?.detail || "API hatası",
              },
            },
          } as CommandResult,
          ...prev,
        ])
      } else {
        setResults((prev) => [result, ...prev])
      }
    } catch (e) {
      setResults((prev) => [
        {
          status: "ERROR",
          build: {
            agent: "api",
            output: {
              message:
                e instanceof Error ? e.message : "Bağlantı hatası",
            },
          },
        } as CommandResult,
        ...prev,
      ])
    } finally {
      setCommand("")
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl bg-zinc-900/80 p-5 border border-zinc-800">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-white mb-1">
          Patron Komut Merkezi
        </h2>
        <p className="text-sm text-zinc-400">
          Komut yazın, PLAN → BUILD → CHECK → PREFLIGHT → RELEASE akışı çalışır
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Tenant</label>
          <input
            type="text"
            value={tenant}
            onChange={(e) => setTenant(e.target.value)}
            className="w-full bg-zinc-800 rounded-lg px-3 py-2 text-sm text-white border border-zinc-700 focus:border-emerald-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Mod</label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as "DEMO" | "LIVE")}
            className="w-full bg-zinc-800 rounded-lg px-3 py-2 text-sm text-white border border-zinc-700 focus:border-emerald-500 outline-none"
          >
            <option value="DEMO">DEMO</option>
            <option value="LIVE">LIVE</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Stage</label>
          <select
            value={stage}
            onChange={(e) =>
              setStage(e.target.value as "STAGING" | "CANARY" | "PROD")
            }
            className="w-full bg-zinc-800 rounded-lg px-3 py-2 text-sm text-white border border-zinc-700 focus:border-emerald-500 outline-none"
          >
            <option value="STAGING">STAGING</option>
            <option value="CANARY">CANARY</option>
            <option value="PROD">PROD</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Dry-Run</label>
          <button
            type="button"
            onClick={() => setDryRun(!dryRun)}
            className={`w-full rounded-lg px-3 py-2 text-sm font-medium transition ${
              dryRun
                ? "bg-amber-600/80 hover:bg-amber-600 text-white"
                : "bg-emerald-600/80 hover:bg-emerald-600 text-white"
            }`}
          >
            {dryRun ? "AÇIK" : "KAPALI"}
          </button>
        </div>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="Patron komutu yazın... (örn: Konsolide rapor üret)"
          className="flex-1 bg-zinc-800 rounded-lg px-4 py-3 text-white placeholder-zinc-500 border border-zinc-700 focus:border-emerald-500 outline-none"
        />
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 rounded-lg px-6 py-3 font-medium text-white transition"
        >
          {loading ? "⏳" : "Gönder"}
        </button>
      </div>

      {results.length > 0 && (
        <div className="mt-4 space-y-3 max-h-64 overflow-y-auto">
          {results.map((result, i) => (
            <div
              key={i}
              className={`rounded-lg p-3 border-l-4 ${
                result.status === "RELEASE_READY"
                  ? "border-emerald-500 bg-emerald-500/10"
                  : result.status === "DRY_RUN"
                  ? "border-amber-500 bg-amber-500/10"
                  : result.status === "BLOCKED" || result.status === "ERROR"
                  ? "border-red-500 bg-red-500/10"
                  : "border-zinc-600 bg-zinc-800/50"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span
                  className={`px-2 py-0.5 rounded text-xs font-medium ${
                    result.status === "RELEASE_READY"
                      ? "bg-emerald-900/50 text-emerald-300"
                      : result.status === "DRY_RUN"
                      ? "bg-amber-900/50 text-amber-300"
                      : "bg-red-900/50 text-red-300"
                  }`}
                >
                  {result.status}
                </span>
                <span className="text-zinc-500 text-xs">
                  {result.build?.agent?.toUpperCase()}
                </span>
              </div>
              <div className="text-sm text-zinc-300 space-y-1">
                {result.plan && (
                  <>
                    <p>
                      <span className="text-zinc-500">Intent:</span>{" "}
                      {result.plan.intent}
                    </p>
                    <p>
                      <span className="text-zinc-500">TaskType:</span>{" "}
                      {result.plan.taskType}
                    </p>
                  </>
                )}
                {result.build?.output?.message && (
                  <p className="text-zinc-400 truncate max-w-md">
                    {String(result.build.output.message).substring(0, 100)}...
                  </p>
                )}
                {result.release && (
                  <p>
                    <span className="text-zinc-500">Release:</span>{" "}
                    {result.release.releaseId}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
