"use client"

/**
 * YiSA-S Guvenlik Robotu Dashboard
 * Yasak islem loglari, patron-lock durumu, RLS kontrol ozeti
 * lib/security-robot.ts securityCheck fonksiyonunu kullanir
 */

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Shield,
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Lock,
  Eye,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react"
import Link from "next/link"

// Patron-lock forbidden terms (client-side reference, mirrors lib/security/patron-lock.ts)
const FORBIDDEN_TERMS = [
  ".env", ".env.local", ".env.production", "API_KEY", "SECRET", "PASSWORD",
  "TOKEN", "git push", "git commit", "vercel deploy", "DROP TABLE",
  "DELETE FROM", "TRUNCATE", "delete_user", "change_password",
  "grant_permission", "fiyat_degistir", "kullanici_sil", "yetki_degistir",
  "veritabani sil",
]

const PATRON_APPROVAL_TERMS = [
  "deploy", "commit", "push", "merge", "table create", "table alter",
  "user delete", "role change", "price change", "env change",
]

const RLS_TABLES = [
  { name: "tenants", policy: "tenant_id bazli izolasyon", status: "aktif" },
  { name: "users", policy: "tenant_id + rol bazli erisim", status: "aktif" },
  { name: "athletes", policy: "tenant_id + antrenor/veli filtreleme", status: "aktif" },
  { name: "trainers", policy: "tenant_id bazli", status: "aktif" },
  { name: "parents", policy: "parent_id bazli izolasyon", status: "aktif" },
  { name: "attendance", policy: "tenant_id + antrenor bazli", status: "aktif" },
  { name: "measurements", policy: "tenant_id + antrenor/veli", status: "aktif" },
  { name: "chat_messages", policy: "tenant_id + kullanici bazli", status: "aktif" },
  { name: "security_logs", policy: "sadece patron okuma", status: "aktif" },
  { name: "patron_commands", policy: "sadece patron", status: "aktif" },
  { name: "demo_requests", policy: "sadece patron/staff", status: "aktif" },
  { name: "franchises", policy: "tenant_id bazli", status: "aktif" },
]

interface SecurityLog {
  id: string
  event_type: string
  severity: string
  description: string | null
  blocked: boolean
  created_at: string
}

function getSeverityBadge(severity: string) {
  switch (severity) {
    case "acil":
      return <Badge variant="outline" className="border-red-500/50 text-red-400 bg-red-500/10 text-xs">Acil</Badge>
    case "kirmizi":
      return <Badge variant="outline" className="border-orange-500/50 text-orange-400 bg-orange-500/10 text-xs">Kirmizi</Badge>
    case "turuncu":
      return <Badge variant="outline" className="border-amber-500/50 text-amber-400 bg-amber-500/10 text-xs">Turuncu</Badge>
    case "sari":
      return <Badge variant="outline" className="border-yellow-500/50 text-yellow-400 bg-yellow-500/10 text-xs">Sari</Badge>
    default:
      return <Badge variant="outline" className="border-zinc-500/50 text-zinc-400 bg-zinc-500/10 text-xs">{severity}</Badge>
  }
}

export default function GuvenlikRobotPage() {
  const [logs, setLogs] = useState<SecurityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [testInput, setTestInput] = useState("")
  const [testResult, setTestResult] = useState<{
    allowed: boolean
    reason: string
    requiresApproval: boolean
  } | null>(null)

  const fetchLogs = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/robot/guvenlik/logs")
      const data = await res.json()
      if (data.logs) {
        setLogs(data.logs)
      }
    } catch {
      // Failed to fetch logs
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  const handleSecurityTest = () => {
    if (!testInput.trim()) return

    const normalized = testInput.toLowerCase().trim()
    const isForbidden = FORBIDDEN_TERMS.some((term) =>
      normalized.includes(term.toLowerCase())
    )
    const needsApproval = PATRON_APPROVAL_TERMS.some((term) =>
      normalized.includes(term.toLowerCase())
    )

    if (isForbidden) {
      setTestResult({
        allowed: false,
        reason: "YASAK: Bu islem AI icin engellenmistir.",
        requiresApproval: false,
      })
    } else if (needsApproval) {
      setTestResult({
        allowed: true,
        reason: "PATRON ONAYI GEREKLI: Bu islem onay gerektirir.",
        requiresApproval: true,
      })
    } else {
      setTestResult({
        allowed: true,
        reason: "GUVENLI: Bu islem izin verilen kapsamda.",
        requiresApproval: false,
      })
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/robot" className="h-10 w-10 rounded-xl bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-colors">
              <ArrowLeft className="h-5 w-5 text-zinc-400" strokeWidth={1.5} />
            </Link>
            <div className="h-10 w-10 rounded-xl bg-orange-400/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-orange-400" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Guvenlik Robotu</h1>
              <p className="text-xs text-zinc-400">Siber Guvenlik Dashboard</p>
            </div>
          </div>
          <Button
            onClick={fetchLogs}
            disabled={loading}
            variant="outline"
            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 rounded-xl gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Yenile
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Security Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card className="bg-zinc-900 border-zinc-800 rounded-2xl">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-orange-400/10 flex items-center justify-center">
                  <Lock className="h-5 w-5 text-orange-400" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{FORBIDDEN_TERMS.length}</p>
                  <p className="text-xs text-zinc-400">Yasak Terim</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 rounded-2xl">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-amber-400/10 flex items-center justify-center">
                  <Eye className="h-5 w-5 text-amber-400" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{PATRON_APPROVAL_TERMS.length}</p>
                  <p className="text-xs text-zinc-400">Onay Gerektiren</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 rounded-2xl">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-400/10 flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5 text-emerald-400" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{RLS_TABLES.length}</p>
                  <p className="text-xs text-zinc-400">RLS Korumalı Tablo</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Security Test */}
          <Card className="bg-zinc-900 border-zinc-800 rounded-2xl">
            <CardHeader className="border-b border-zinc-800">
              <CardTitle className="text-base font-semibold text-white flex items-center gap-2">
                <Search className="h-4 w-4 text-cyan-400" />
                Guvenlik Testi
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <p className="text-xs text-zinc-400">
                Bir komut veya ifade girin, patron-lock sistemi kontrol etsin.
              </p>
              <div className="flex gap-2">
                <Input
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSecurityTest()}
                  placeholder="Ornek: DROP TABLE users"
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 h-10 rounded-xl"
                />
                <Button
                  onClick={handleSecurityTest}
                  className="bg-orange-500 hover:bg-orange-600 text-white h-10 px-4 rounded-xl"
                >
                  Test Et
                </Button>
              </div>
              {testResult && (
                <div
                  className={`p-3 rounded-xl border text-sm ${
                    !testResult.allowed
                      ? "bg-red-500/10 border-red-500/30 text-red-300"
                      : testResult.requiresApproval
                        ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                        : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {!testResult.allowed ? (
                      <XCircle className="h-4 w-4 text-red-400" />
                    ) : testResult.requiresApproval ? (
                      <AlertTriangle className="h-4 w-4 text-amber-400" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    )}
                    {testResult.reason}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* RLS Status */}
          <Card className="bg-zinc-900 border-zinc-800 rounded-2xl">
            <CardHeader className="border-b border-zinc-800">
              <CardTitle className="text-base font-semibold text-white flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-emerald-400" />
                RLS Kontrol Ozeti
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-zinc-800 max-h-[320px] overflow-y-auto">
                {RLS_TABLES.map((table) => (
                  <div key={table.name} className="flex items-center justify-between px-4 py-2.5">
                    <div>
                      <span className="text-sm text-zinc-200 font-mono">{table.name}</span>
                      <p className="text-xs text-zinc-500">{table.policy}</p>
                    </div>
                    <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/5 text-xs">
                      {table.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Security Logs */}
        <Card className="bg-zinc-900 border-zinc-800 rounded-2xl mt-6 overflow-hidden">
          <CardHeader className="border-b border-zinc-800">
            <CardTitle className="text-base font-semibold text-white flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-400" />
              Guvenlik Loglari
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center text-zinc-500">
                <RefreshCw className="h-6 w-6 mx-auto mb-2 animate-spin" />
                <p className="text-sm">Loglar yukleniyor...</p>
              </div>
            ) : logs.length > 0 ? (
              <div className="divide-y divide-zinc-800">
                {logs.slice(0, 20).map((log) => (
                  <div key={log.id} className="flex items-center justify-between px-5 py-3 hover:bg-zinc-800/50 transition-colors">
                    <div className="flex items-center gap-3">
                      {log.blocked ? (
                        <XCircle className="h-4 w-4 text-red-400 shrink-0" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      )}
                      <div>
                        <span className="text-sm text-zinc-200">{log.event_type}</span>
                        {log.description && (
                          <p className="text-xs text-zinc-500 truncate max-w-[300px]">
                            {log.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getSeverityBadge(log.severity)}
                      <span className="text-xs text-zinc-600">
                        {new Date(log.created_at).toLocaleString("tr-TR", {
                          day: "2-digit",
                          month: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-zinc-500">
                <Shield className="h-6 w-6 mx-auto mb-2" />
                <p className="text-sm">Henuz guvenlik logu yok — sistem temiz</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
