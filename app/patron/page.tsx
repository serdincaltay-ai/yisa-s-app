'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Bell } from 'lucide-react'
import { ROBOTS } from '@/lib/patron/robots'
import ApprovalQueue from '@/components/patron/ApprovalQueue'
import AssistantChat from '@/components/patron/AssistantChat'

/** Health check'ten gelen veriyi 5 robota dağıt */
function mapHealthToRobots(health: { robots?: { id: string; name: string; status: string }[]; ok?: boolean }) {
  const robots = health?.robots ?? []
  const byId: Record<string, boolean> = {}
  for (const r of robots) {
    byId[r.id] = r.status === 'ok'
    byId[r.name] = r.status === 'ok'
  }
  const supabaseOk = byId['Supabase'] ?? false
  const gptOk = byId['GPT'] ?? false
  const claudeOk = byId['Claude'] ?? false
  const geminiOk = byId['Gemini'] ?? false
  const togetherOk = byId['Together'] ?? false
  const vercelOk = byId['Vercel'] ?? false
  const aiCount = [gptOk, claudeOk, geminiOk, togetherOk].filter(Boolean).length

  return {
    ceo: 'ok' as const,
    guvenlik: health?.ok ? 'ok' : 'error',
    veri: supabaseOk ? 'ok' : 'error',
    celf: aiCount >= 2 ? 'ok' : aiCount >= 1 ? 'warning' : 'error',
    yisas: vercelOk ? 'ok' : 'warning',
  }
}

export default function PatronPanel() {
  const [robotStatus, setRobotStatus] = useState<ReturnType<typeof mapHealthToRobots> | null>(null)
  const [pendingCount, setPendingCount] = useState(0)

  useEffect(() => {
    const fetchAll = () => {
      Promise.all([
        fetch('/api/system/health').then((r) => r.json()),
        fetch('/api/approvals').then((r) => r.json()),
      ]).then(([health, approvals]) => {
        setRobotStatus(mapHealthToRobots(health))
        const items = (approvals?.items ?? []).filter((i: { status: string }) => i.status === 'pending')
        setPendingCount(items.length)
      })
    }
    fetchAll()
    const t = setInterval(fetchAll, 60000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0e17] text-[#f8fafc] flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-[#0f172a] border-b border-[#1e293b]">
        <Link href="/" className="flex items-center gap-3 hover:opacity-90">
          <div className="relative w-9 h-9 flex-shrink-0 rounded-lg overflow-hidden">
            <Image src="/logo.png" alt="YİSA-S" fill className="object-contain" />
          </div>
          <span className="text-lg font-semibold text-[#f8fafc]">YİSA-S PATRON PANELİ</span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm text-[#94a3b8] font-mono">
            🕐 {new Date().toLocaleTimeString('tr-TR', { hour12: false })}
          </span>
          <button className="relative p-2 rounded-lg bg-[#111827] border border-[#1e293b] hover:border-[#3b82f6]/40 transition-colors">
            <Bell className="w-5 h-5 text-[#94a3b8]" />
            {pendingCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#ef4444] text-[10px] font-bold flex items-center justify-center text-white">
                {pendingCount}
              </span>
            )}
          </button>
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#10b981] to-[#3b82f6]" />
        </div>
      </header>

      {/* BÖLÜM 1: Robotlar (üst şerit) */}
      <section className="p-4 border-b border-[#1e293b]">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {ROBOTS.map((r) => {
            const status = robotStatus
              ? (robotStatus[r.id as keyof typeof robotStatus] ?? 'ok')
              : 'ok'
            const isOk = status === 'ok'
            const isWarning = status === 'warning'
            return (
              <div
                key={r.id}
                className="rounded-xl border bg-[#111827] p-4 flex flex-col items-center gap-2 hover:shadow-lg transition-all cursor-pointer"
                style={{
                  borderColor: isOk ? '#1e293b' : isWarning ? '#f59e0b' : '#ef4444',
                  boxShadow: isOk ? undefined : `0 0 12px -2px ${r.color}40`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 0 20px -4px ${r.color}60`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = isOk ? '' : `0 0 12px -2px ${r.color}40`
                }}
              >
                <span className="text-3xl">{r.icon}</span>
                <span className="text-sm font-bold text-[#f8fafc] text-center">{r.name}</span>
                <span className="text-[10px] text-[#94a3b8] text-center">{r.role}</span>
                <div className="flex items-center gap-1.5 mt-1">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: isOk ? '#10b981' : isWarning ? '#f59e0b' : '#ef4444',
                    }}
                  />
                  <span className="text-[10px] text-[#94a3b8]">
                    {isOk ? 'Online' : isWarning ? 'Kısmi' : 'Offline'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* BÖLÜM 2: Onay Havuzu */}
      <section className="flex-1 p-4 overflow-auto">
        <h2 className="text-sm font-semibold text-[#f8fafc] mb-3">Onay Havuzu</h2>
        <ApprovalQueue />
      </section>

      {/* BÖLÜM 3: Asistan Chat */}
      <section className="p-4 border-t border-[#1e293b]">
        <h2 className="text-sm font-semibold text-[#f8fafc] mb-3">Asistan Chat</h2>
        <AssistantChat />
      </section>

      {/* Footer */}
      <footer className="px-4 py-2 bg-[#0f172a] border-t border-[#1e293b] flex flex-wrap items-center justify-between gap-2 text-xs text-[#94a3b8]">
        <span>© YİSA-S 2026</span>
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#10b981]" />
          Sistem: ✅ | Robotlar: 5/5 | CELF: 12 dir
        </span>
      </footer>
    </div>
  )
}
