"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import {
  CheckCircle2,
  XCircle,
  RefreshCw,
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  MapPin,
  Clock,
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from "lucide-react"

// ─── Types ───────────────────────────────────────────────────────────────────

interface DemoRequest {
  id: string
  name: string | null
  email: string | null
  phone: string | null
  facility_type: string | null
  city: string | null
  notes: string | null
  status: string
  source: string | null
  created_at: string
  payment_status: string | null
  payment_amount: number | null
  payment_at: string | null
  payment_notes: string | null
}

interface DecisionResult {
  ok: boolean
  message: string
  tenant_id?: string
  slug?: string
  subdomain?: string
  temp_password?: string
  login_email?: string
  franchise_created?: boolean
  steps_completed?: string[]
  error?: string
  error_step?: string
  error_detail?: string
}

type FilterStatus = "all" | "new" | "converted" | "rejected"

// ─── Status Badge Component ─────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; label: string }> = {
    new: { bg: "bg-amber-500/15", text: "text-amber-400", label: "Beklemede" },
    converted: { bg: "bg-emerald-500/15", text: "text-emerald-400", label: "Onaylandi" },
    rejected: { bg: "bg-red-500/15", text: "text-red-400", label: "Reddedildi" },
  }
  const c = config[status] ?? { bg: "bg-slate-500/15", text: "text-slate-400", label: status }
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  )
}

// ─── Confirmation Modal ─────────────────────────────────────────────────────

function ConfirmModal({
  type,
  request,
  onConfirm,
  onCancel,
  loading,
}: {
  type: "approve" | "reject"
  request: DemoRequest
  onConfirm: (reason?: string) => void
  onCancel: () => void
  loading: boolean
}) {
  const [reason, setReason] = useState("")
  const isApprove = type === "approve"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-md rounded-2xl border border-[#2a3650] bg-[#0a0e17] p-6 shadow-2xl">
        <h3 className="text-lg font-semibold text-[#e2e8f0] mb-2">
          {isApprove ? "Talebi Onayla" : "Talebi Reddet"}
        </h3>
        <p className="text-sm text-[#8892a8] mb-4">
          {isApprove
            ? `"${request.name}" icin tenant olusturma baslatilacak. Onayliyor musunuz?`
            : `"${request.name}" talebini reddetmek istediginizden emin misiniz?`}
        </p>

        {isApprove && (
          <div className="mb-4 p-3 rounded-lg border border-amber-500/20 bg-amber-500/5">
            <p className="text-xs text-amber-400 font-medium mb-1">Onay sonrasi otomatik islemler:</p>
            <ul className="text-xs text-[#8892a8] space-y-0.5 list-disc list-inside">
              <li>Tenant olusturulacak (slug + veritabani)</li>
              <li>Kullanici hesabi acilacak / baglanti kurulacak</li>
              <li>Subdomain aktif edilecek</li>
              <li>Baslangic verileri eklenecek</li>
            </ul>
          </div>
        )}

        {!isApprove && (
          <div className="mb-4">
            <label className="block text-xs text-[#8892a8] mb-1">Red sebebi (opsiyonel)</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Neden reddedildi..."
              rows={3}
              className="w-full rounded-lg border border-[#2a3650] bg-[#060a13] px-3 py-2 text-sm text-[#e2e8f0] placeholder:text-[#4a5568] focus:outline-none focus:border-[#00d4ff]/50"
            />
          </div>
        )}

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 rounded-lg text-sm text-[#8892a8] border border-[#2a3650] hover:bg-[#2a3650]/30 transition-colors disabled:opacity-50"
          >
            Iptal
          </button>
          <button
            onClick={() => onConfirm(reason || undefined)}
            disabled={loading}
            className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors disabled:opacity-50 flex items-center gap-2 ${
              isApprove
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isApprove ? "Onayla" : "Reddet"}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Result Modal (shown after approve) ─────────────────────────────────────

function ResultModal({
  result,
  onClose,
}: {
  result: DecisionResult
  onClose: () => void
}) {
  const isSuccess = result.ok

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl border border-[#2a3650] bg-[#0a0e17] p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          {isSuccess ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          ) : (
            <AlertCircle className="w-6 h-6 text-red-400" />
          )}
          <h3 className="text-lg font-semibold text-[#e2e8f0]">
            {isSuccess ? "Tenant Olusturuldu" : "Hata Olustu"}
          </h3>
        </div>

        <p className="text-sm text-[#8892a8] mb-4">{result.message}</p>

        {isSuccess && result.slug && (
          <div className="space-y-2 mb-4 p-3 rounded-lg border border-[#2a3650] bg-[#060a13]">
            <div className="flex justify-between text-xs">
              <span className="text-[#8892a8]">Tenant Slug:</span>
              <span className="text-[#00d4ff] font-mono">{result.slug}</span>
            </div>
            {result.subdomain && (
              <div className="flex justify-between text-xs">
                <span className="text-[#8892a8]">Subdomain:</span>
                <span className="text-[#00d4ff] font-mono">{result.subdomain}.yisa-s.com</span>
              </div>
            )}
            {result.login_email && (
              <div className="flex justify-between text-xs">
                <span className="text-[#8892a8]">Giris E-posta:</span>
                <span className="text-[#e2e8f0] font-mono">{result.login_email}</span>
              </div>
            )}
            {result.temp_password && (
              <div className="flex justify-between text-xs">
                <span className="text-[#8892a8]">Gecici Sifre:</span>
                <span className="text-amber-400 font-mono">{result.temp_password}</span>
              </div>
            )}
            {result.steps_completed && result.steps_completed.length > 0 && (
              <div className="pt-2 border-t border-[#2a3650]">
                <p className="text-[10px] text-[#8892a8] mb-1">Tamamlanan adimlar:</p>
                <div className="flex flex-wrap gap-1">
                  {result.steps_completed.map((step) => (
                    <span
                      key={step}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400"
                    >
                      {step}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!isSuccess && result.error_step && (
          <div className="mb-4 p-3 rounded-lg border border-red-500/20 bg-red-500/5">
            <p className="text-xs text-red-400">
              Hata adimi: <span className="font-mono">{result.error_step}</span>
            </p>
            {result.error_detail && (
              <p className="text-xs text-[#8892a8] mt-1">{result.error_detail}</p>
            )}
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-[#00d4ff] hover:bg-[#00d4ff]/80 transition-colors"
          >
            Tamam
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Request Card (Mobile) ──────────────────────────────────────────────────

function RequestCard({
  request,
  onApprove,
  onReject,
}: {
  request: DemoRequest
  onApprove: () => void
  onReject: () => void
}) {
  const [expanded, setExpanded] = useState(false)
  const isNew = request.status === "new"

  return (
    <div className="rounded-xl border border-[#2a3650] bg-[#0a0e17]/80 p-4 transition-all hover:border-[#2a3650]/80">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-[#e2e8f0] truncate">
            {request.name || "Isimsiz"}
          </h4>
          <p className="text-xs text-[#8892a8] mt-0.5">
            {request.facility_type || "Belirtilmemis"}
          </p>
        </div>
        <StatusBadge status={request.status} />
      </div>

      <div className="space-y-1.5 mb-3">
        {request.email && (
          <div className="flex items-center gap-2 text-xs text-[#8892a8]">
            <Mail className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{request.email}</span>
          </div>
        )}
        {request.phone && (
          <div className="flex items-center gap-2 text-xs text-[#8892a8]">
            <Phone className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{request.phone}</span>
          </div>
        )}
        {request.city && (
          <div className="flex items-center gap-2 text-xs text-[#8892a8]">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{request.city}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-xs text-[#8892a8]">
          <Clock className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{new Date(request.created_at).toLocaleString("tr-TR")}</span>
        </div>
      </div>

      {request.source && (
        <div className="mb-3">
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00d4ff]/10 text-[#00d4ff] font-medium">
            {request.source}
          </span>
          {request.payment_status === "odendi" && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-medium ml-1">
              Odeme alindi
            </span>
          )}
        </div>
      )}

      {expanded && request.notes && (
        <div className="mb-3 p-2 rounded-lg bg-[#060a13] text-xs text-[#8892a8] whitespace-pre-wrap max-h-32 overflow-auto">
          {request.notes}
        </div>
      )}

      <div className="flex items-center justify-between">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-xs text-[#00d4ff] hover:text-[#00d4ff]/80 transition-colors"
        >
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          {expanded ? "Gizle" : "Detay"}
        </button>

        {isNew && (
          <div className="flex gap-2">
            <button
              onClick={onApprove}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-600/15 text-emerald-400 hover:bg-emerald-600/25 transition-colors min-h-[36px]"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Onayla
            </button>
            <button
              onClick={onReject}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-600/15 text-red-400 hover:bg-red-600/25 transition-colors min-h-[36px]"
            >
              <XCircle className="w-3.5 h-3.5" />
              Reddet
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Main Page Component ────────────────────────────────────────────────────

export default function OnayKuyrugu() {
  const [requests, setRequests] = useState<DemoRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [filter, setFilter] = useState<FilterStatus>("all")
  const [modal, setModal] = useState<{
    type: "approve" | "reject"
    request: DemoRequest
  } | null>(null)
  const [resultModal, setResultModal] = useState<DecisionResult | null>(null)
  const [deciding, setDeciding] = useState(false)

  const fetchRequests = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)
    try {
      const res = await fetch("/api/demo-requests")
      const data = await res.json()
      setRequests(data.items ?? [])
    } catch {
      console.error("[onay-kuyrugu] Fetch error")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchRequests()
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => fetchRequests(true), 30000)
    return () => clearInterval(interval)
  }, [fetchRequests])

  const handleDecision = async (reason?: string) => {
    if (!modal) return
    setDeciding(true)

    try {
      const res = await fetch("/api/demo-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "decide",
          id: modal.request.id,
          decision: modal.type,
          reason,
        }),
      })
      const data: DecisionResult = await res.json()

      if (modal.type === "approve") {
        // Show result modal for approvals (contains tenant details)
        setResultModal(data)
      }

      // Refresh the list
      await fetchRequests(true)
    } catch {
      setResultModal({
        ok: false,
        message: "Baglanti hatasi. Lutfen tekrar deneyin.",
        steps_completed: [],
      })
    } finally {
      setDeciding(false)
      setModal(null)
    }
  }

  const filtered = requests.filter((r) => {
    if (filter === "all") return true
    return r.status === filter
  })

  const counts = {
    all: requests.length,
    new: requests.filter((r) => r.status === "new").length,
    converted: requests.filter((r) => r.status === "converted").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-[#e2e8f0]">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-[#2a3650] bg-[#0a0a1a]/95 backdrop-blur-sm px-4 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <Link
              href="/patron"
              className="text-sm font-mono text-[#00d4ff]/80 hover:text-[#00d4ff] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center -m-2"
              aria-label="Patron paneline don"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <span className="text-[#8892a8] font-mono text-xs hidden sm:inline">|</span>
            <div>
              <h1 className="text-base md:text-lg font-bold font-mono tracking-wide">
                Onay Kuyrugu
              </h1>
              <p className="text-[10px] text-[#8892a8] hidden sm:block">
                Demo talepleri ve tenant olusturma
              </p>
            </div>
          </div>
          <button
            onClick={() => fetchRequests(true)}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-[#8892a8] border border-[#2a3650] hover:bg-[#2a3650]/30 transition-colors min-h-[44px] disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Yenile</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {([
            { key: "all" as const, label: "Toplam", color: "#00d4ff", icon: Building2 },
            { key: "new" as const, label: "Bekleyen", color: "#f59e0b", icon: Clock },
            { key: "converted" as const, label: "Onaylanan", color: "#10b981", icon: CheckCircle2 },
            { key: "rejected" as const, label: "Reddedilen", color: "#ef4444", icon: XCircle },
          ] as const).map(({ key, label, color, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`p-4 rounded-xl border transition-all text-left ${
                filter === key
                  ? "border-[" + color + "]/40 bg-[" + color + "]/5"
                  : "border-[#2a3650] bg-[#0a0e17]/50 hover:border-[#2a3650]/80"
              }`}
              style={filter === key ? { borderColor: `${color}40`, backgroundColor: `${color}08` } : undefined}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon className="w-4 h-4" style={{ color }} />
                <span className="text-xs text-[#8892a8]">{label}</span>
              </div>
              <p className="text-2xl font-bold" style={{ color }}>
                {counts[key]}
              </p>
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-[#00d4ff] animate-spin" />
          </div>
        )}

        {/* Empty State */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-16">
            <Building2 className="w-12 h-12 text-[#2a3650] mx-auto mb-3" />
            <p className="text-sm text-[#8892a8]">
              {filter === "new"
                ? "Bekleyen talep yok"
                : filter === "converted"
                  ? "Henuz onaylanan talep yok"
                  : filter === "rejected"
                    ? "Reddedilen talep yok"
                    : "Henuz demo talebi yok"}
            </p>
          </div>
        )}

        {/* Desktop Table View */}
        {!loading && filtered.length > 0 && (
          <div className="hidden md:block rounded-xl border border-[#2a3650] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#2a3650] bg-[#0a0e17]/80">
                    <th className="text-left text-xs font-medium text-[#8892a8] px-4 py-3">Firma / Yetkili</th>
                    <th className="text-left text-xs font-medium text-[#8892a8] px-4 py-3">Tesis</th>
                    <th className="text-left text-xs font-medium text-[#8892a8] px-4 py-3">Iletisim</th>
                    <th className="text-left text-xs font-medium text-[#8892a8] px-4 py-3">Sehir</th>
                    <th className="text-left text-xs font-medium text-[#8892a8] px-4 py-3">Kaynak</th>
                    <th className="text-left text-xs font-medium text-[#8892a8] px-4 py-3">Tarih</th>
                    <th className="text-left text-xs font-medium text-[#8892a8] px-4 py-3">Durum</th>
                    <th className="text-right text-xs font-medium text-[#8892a8] px-4 py-3">Islem</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr
                      key={r.id}
                      className="border-b border-[#2a3650]/50 hover:bg-[#0a0e17]/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-[#e2e8f0]">{r.name || "Isimsiz"}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-xs text-[#8892a8]">{r.facility_type || "-"}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="space-y-0.5">
                          {r.email && (
                            <p className="text-xs text-[#8892a8] truncate max-w-[180px]">{r.email}</p>
                          )}
                          {r.phone && <p className="text-xs text-[#8892a8]">{r.phone}</p>}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-xs text-[#8892a8]">{r.city || "-"}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00d4ff]/10 text-[#00d4ff]">
                          {r.source || "www"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-xs text-[#8892a8] whitespace-nowrap">
                          {new Date(r.created_at).toLocaleDateString("tr-TR")}
                        </p>
                        <p className="text-[10px] text-[#4a5568]">
                          {new Date(r.created_at).toLocaleTimeString("tr-TR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={r.status} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        {r.status === "new" ? (
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => setModal({ type: "approve", request: r })}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-600/15 text-emerald-400 hover:bg-emerald-600/25 transition-colors min-h-[36px]"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Onayla
                            </button>
                            <button
                              onClick={() => setModal({ type: "reject", request: r })}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-600/15 text-red-400 hover:bg-red-600/25 transition-colors min-h-[36px]"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              Reddet
                            </button>
                          </div>
                        ) : r.status === "converted" ? (
                          <span className="text-xs text-emerald-400/60 flex items-center gap-1 justify-end">
                            <ExternalLink className="w-3 h-3" />
                            Tenant aktif
                          </span>
                        ) : (
                          <span className="text-xs text-red-400/60">Reddedildi</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Mobile Card View */}
        {!loading && filtered.length > 0 && (
          <div className="md:hidden space-y-3">
            {filtered.map((r) => (
              <RequestCard
                key={r.id}
                request={r}
                onApprove={() => setModal({ type: "approve", request: r })}
                onReject={() => setModal({ type: "reject", request: r })}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      {modal && (
        <ConfirmModal
          type={modal.type}
          request={modal.request}
          onConfirm={handleDecision}
          onCancel={() => setModal(null)}
          loading={deciding}
        />
      )}
      {resultModal && (
        <ResultModal result={resultModal} onClose={() => setResultModal(null)} />
      )}
    </div>
  )
}
