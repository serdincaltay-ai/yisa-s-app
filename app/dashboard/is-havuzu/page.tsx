'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  Check, X, Clock, AlertCircle, RefreshCw, Loader2,
  Send, Eye, FileText, Bot, Rocket, RotateCcw, Store,
  Zap, Shield, Database, Cpu, BarChart3, XCircle
} from 'lucide-react'

// ─── Tipler ──────────────────────────────────────────────────

type RobotJob = {
  id: string
  ticket_no: string
  source_robot: string
  director_key: string | null
  ai_provider: string | null
  title: string
  description: string | null
  job_type: string
  content_type: string
  priority: string
  output_data: Record<string, unknown>
  output_preview: string | null
  version: number
  status: string
  patron_decision: string | null
  patron_notes: string | null
  patron_decision_at: string | null
  store_published: boolean
  token_cost: number
  iteration_count: number
  created_at: string
}

type JobStats = {
  total: number
  ceo_pool: number
  approved: number
  published: number
  correction: number
  rejected: number
}

// ─── Sabitler ────────────────────────────────────────────────

const DIRECTOR_LABELS: Record<string, string> = {
  CFO: 'Finans', CTO: 'Teknoloji', CIO: 'Bilgi İşlem', CMO: 'Pazarlama',
  CHRO: 'İK', CLO: 'Hukuk', CSO: 'Strateji', CDO: 'Tasarım',
  CISO: 'Güvenlik', CCO: 'İletişim', CPO: 'Ürün', SPORTIF: 'Sportif',
  CSO_SATIS: 'Satış', CSO_STRATEJI: 'Strateji', CSPO: 'Spor', COO: 'Operasyon', RND: 'AR-GE',
}

const JOB_TYPE_LABELS: Record<string, string> = {
  logo: 'Logo', tasarim: 'Tasarım', video: 'Video', belge: 'Belge',
  sablon: 'Şablon', robot: 'Robot', antrenman: 'Antrenman', rapor: 'Rapor',
  kampanya: 'Kampanya', general: 'Genel',
}

const PRIORITY_STYLES: Record<string, string> = {
  critical: 'bg-red-500/20 text-red-400 border-red-500/40',
  high: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
  normal: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
  low: 'bg-slate-500/20 text-slate-400 border-slate-500/40',
}

const STORE_CATEGORIES = [
  { value: 'sablon', label: 'Şablon' },
  { value: 'robot', label: 'Robot' },
  { value: 'paket', label: 'Paket' },
  { value: 'icerik', label: 'İçerik' },
  { value: 'hizmet', label: 'Hizmet' },
]

// ─── Sayfa ──────────────────────────────────────────────────

export default function IsHavuzuPage() {
  const [jobs, setJobs] = useState<RobotJob[]>([])
  const [stats, setStats] = useState<JobStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [actingId, setActingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [previewJob, setPreviewJob] = useState<RobotJob | null>(null)
  const [correctionNotes, setCorrectionNotes] = useState('')
  const [correctionJobId, setCorrectionJobId] = useState<string | null>(null)
  const [publishJobId, setPublishJobId] = useState<string | null>(null)
  const [publishCategory, setPublishCategory] = useState('sablon')
  const [generateCommand, setGenerateCommand] = useState('')
  const [generating, setGenerating] = useState(false)

  // ─── Veri Çek ──────────────────────────────────────────

  const fetchJobs = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/jobs/ceo-pool?include_approved=true')
      const data = await res.json()
      if (!res.ok) { setError(data?.error ?? 'Yüklenemedi'); return }
      setJobs(data.pool ?? [])
      setStats(data.stats ?? null)
    } catch {
      setError('Bağlantı hatası')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchJobs() }, [fetchJobs])

  // ─── İş Üret ──────────────────────────────────────────

  const handleGenerate = async () => {
    if (!generateCommand.trim()) return
    setGenerating(true)
    setError(null)
    try {
      const res = await fetch('/api/jobs/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: generateCommand.trim() }),
      })
      const data = await res.json()
      if (data.ok) {
        setGenerateCommand('')
        await fetchJobs()
      } else {
        setError(data.error ?? 'Üretim hatası')
      }
    } catch {
      setError('Bağlantı hatası')
    } finally {
      setGenerating(false)
    }
  }

  // ─── Karar Ver ─────────────────────────────────────────

  const handleDecision = async (jobId: string, decision: 'approved' | 'rejected' | 'correction') => {
    if (decision === 'correction' && !correctionNotes.trim()) {
      setError('Düzeltme notu yazmalısınız.')
      return
    }

    setActingId(`${jobId}_${decision}`)
    setError(null)
    try {
      const body: Record<string, unknown> = { job_id: jobId, decision }
      if (decision === 'correction') body.notes = correctionNotes.trim()

      const res = await fetch('/api/jobs/decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (data.ok) {
        setCorrectionNotes('')
        setCorrectionJobId(null)
        await fetchJobs()
      } else {
        setError(data.error ?? 'Karar hatası')
      }
    } catch {
      setError('Bağlantı hatası')
    } finally {
      setActingId(null)
    }
  }

  // ─── Mağazaya Yayınla ─────────────────────────────────

  const handlePublish = async (jobId: string) => {
    setActingId(`${jobId}_publish`)
    try {
      const res = await fetch('/api/jobs/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_id: jobId, category: publishCategory }),
      })
      const data = await res.json()
      if (data.ok) {
        setPublishJobId(null)
        await fetchJobs()
      } else {
        setError(data.error ?? 'Yayınlama hatası')
      }
    } catch {
      setError('Bağlantı hatası')
    } finally {
      setActingId(null)
    }
  }

  // ─── Render ────────────────────────────────────────────

  return (
    <div className="p-8 min-h-screen">
      {/* Başlık */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Cpu className="text-cyan-400" size={28} />
            Robot İş Havuzu
          </h1>
          <p className="text-slate-400 mt-1">
            CELF üretir → CEO Havuzu → Sen onaylarsın → Mağaza / Deploy
          </p>
        </div>
        <button
          type="button"
          onClick={fetchJobs}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm transition-colors disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Yenile
        </button>
      </div>

      {/* İstatistikler */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          <StatCard icon={<Clock size={18} />} label="Havuzda" value={stats.ceo_pool} color="amber" />
          <StatCard icon={<Check size={18} />} label="Onaylanan" value={stats.approved} color="emerald" />
          <StatCard icon={<Store size={18} />} label="Mağazada" value={stats.published} color="cyan" />
          <StatCard icon={<RotateCcw size={18} />} label="Düzeltme" value={stats.correction} color="blue" />
          <StatCard icon={<XCircle size={18} />} label="Reddedilen" value={stats.rejected} color="red" />
          <StatCard icon={<BarChart3 size={18} />} label="Toplam" value={stats.total} color="slate" />
        </div>
      )}

      {/* İş Üretim Formu */}
      <div className="mb-8 p-6 bg-slate-800/50 border border-slate-700 rounded-2xl">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Zap className="text-yellow-400" size={20} />
          Yeni İş Üret (CELF)
        </h2>
        <div className="flex gap-3">
          <input
            type="text"
            value={generateCommand}
            onChange={(e) => setGenerateCommand(e.target.value)}
            placeholder="Görev yaz... (ör: Franchise için logo tasarla, Aylık rapor hazırla, Sosyal medya kampanyası oluştur)"
            className="flex-1 px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            onKeyDown={(e) => { if (e.key === 'Enter') handleGenerate() }}
          />
          <button
            type="button"
            onClick={handleGenerate}
            disabled={generating || !generateCommand.trim()}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 border border-cyan-500/40 font-medium transition-colors disabled:opacity-50"
          >
            {generating ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            Üret
          </button>
        </div>
      </div>

      {/* Hata */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-2">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {/* İş Listesi */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-500">
          <Loader2 className="animate-spin mr-2" size={20} /> Yükleniyor...
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-12 text-center">
          <Bot className="mx-auto mb-4 text-slate-500" size={48} />
          <p className="text-slate-400 mb-2">CEO havuzunda bekleyen iş yok.</p>
          <p className="text-slate-500 text-sm">Yukarıdaki formdan yeni iş üretebilirsiniz.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 hover:border-slate-600 transition-colors"
            >
              {/* Üst kısım */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-cyan-400 font-mono text-sm">{job.ticket_no}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-lg border ${PRIORITY_STYLES[job.priority] ?? PRIORITY_STYLES.normal}`}>
                      {job.priority}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-lg bg-slate-700 text-slate-300">
                      {JOB_TYPE_LABELS[job.job_type] ?? job.job_type}
                    </span>
                    {job.director_key && (
                      <span className="text-xs px-2 py-0.5 rounded-lg bg-purple-500/20 text-purple-400">
                        {job.director_key} — {DIRECTOR_LABELS[job.director_key] ?? ''}
                      </span>
                    )}
                    {job.ai_provider && (
                      <span className="text-xs text-slate-500">{job.ai_provider}</span>
                    )}
                  </div>
                  <h3 className="text-white font-medium text-lg">{job.title}</h3>
                  {job.iteration_count > 1 && (
                    <span className="text-xs text-blue-400 mt-1 inline-block">
                      v{job.version} — {job.iteration_count}. deneme
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-500">
                  {new Date(job.created_at).toLocaleString('tr-TR')}
                </span>
              </div>

              {/* Önizleme */}
              {job.output_preview && (
                <div className="mb-4 p-4 bg-slate-900/50 border border-slate-700/50 rounded-xl text-slate-300 text-sm whitespace-pre-wrap max-h-40 overflow-y-auto">
                  {job.output_preview}
                </div>
              )}

              {/* Claude denetim uyarısı */}
              {(job.output_data as Record<string, unknown>)?.review_passed === false && (
                <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400 text-sm flex items-center gap-2">
                  <Shield size={16} />
                  Claude denetimi: Bu iş denetimden geçmedi. İncelemeniz önerilir.
                </div>
              )}

              {/* Aksiyon Butonları */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Görüntüle */}
                <button
                  type="button"
                  onClick={() => setPreviewJob(previewJob?.id === job.id ? null : job)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm transition-colors"
                >
                  <Eye size={16} /> Detay
                </button>

                {/* Onayla */}
                <button
                  type="button"
                  onClick={() => handleDecision(job.id, 'approved')}
                  disabled={actingId !== null}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/40 text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {actingId === `${job.id}_approved` ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                  Onayla
                </button>

                {/* Düzeltme */}
                <button
                  type="button"
                  onClick={() => setCorrectionJobId(correctionJobId === job.id ? null : job.id)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/40 text-sm font-medium transition-colors"
                >
                  <RotateCcw size={16} /> Düzelt
                </button>

                {/* Reddet */}
                <button
                  type="button"
                  onClick={() => handleDecision(job.id, 'rejected')}
                  disabled={actingId !== null}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/40 text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {actingId === `${job.id}_rejected` ? <Loader2 size={16} className="animate-spin" /> : <X size={16} />}
                  Reddet
                </button>

                {/* Mağazaya Gönder (onaylıysa) */}
                {job.status === 'approved' && !job.store_published && (
                  <button
                    type="button"
                    onClick={() => setPublishJobId(publishJobId === job.id ? null : job.id)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 border border-cyan-500/40 text-sm font-medium transition-colors"
                  >
                    <Store size={16} /> Mağazaya Gönder
                  </button>
                )}
              </div>

              {/* Düzeltme Notu Formu */}
              {correctionJobId === job.id && (
                <div className="mt-4 p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                  <textarea
                    value={correctionNotes}
                    onChange={(e) => setCorrectionNotes(e.target.value)}
                    placeholder="Düzeltme notunu yaz... (ör: Logo daha minimalist olsun, renkleri değiştir)"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
                    rows={3}
                  />
                  <div className="flex justify-end gap-2 mt-3">
                    <button
                      type="button"
                      onClick={() => { setCorrectionJobId(null); setCorrectionNotes('') }}
                      className="px-4 py-2 rounded-xl bg-slate-700 text-slate-300 text-sm hover:bg-slate-600"
                    >
                      İptal
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDecision(job.id, 'correction')}
                      disabled={actingId !== null || !correctionNotes.trim()}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/40 text-sm font-medium disabled:opacity-50"
                    >
                      {actingId === `${job.id}_correction` ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                      Düzeltmeye Gönder
                    </button>
                  </div>
                </div>
              )}

              {/* Mağaza Yayınlama Formu */}
              {publishJobId === job.id && (
                <div className="mt-4 p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-xl">
                  <div className="flex items-center gap-3">
                    <label className="text-slate-400 text-sm">Kategori:</label>
                    <select
                      value={publishCategory}
                      onChange={(e) => setPublishCategory(e.target.value)}
                      className="bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white"
                    >
                      {STORE_CATEGORIES.map((c) => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => handlePublish(job.id)}
                      disabled={actingId !== null}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 border border-cyan-500/40 text-sm font-medium disabled:opacity-50"
                    >
                      {actingId === `${job.id}_publish` ? <Loader2 size={16} className="animate-spin" /> : <Rocket size={16} />}
                      Yayınla
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Detay Modal */}
      {previewJob && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setPreviewJob(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-cyan-400 font-mono">{previewJob.ticket_no}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-lg border ${PRIORITY_STYLES[previewJob.priority] ?? ''}`}>
                    {previewJob.priority}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-white">{previewJob.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewJob(null)}
                className="p-2 rounded-lg hover:bg-slate-700 text-slate-400"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <InfoRow label="Kaynak Robot" value={previewJob.source_robot} />
              <InfoRow label="Direktörlük" value={previewJob.director_key ? `${previewJob.director_key} — ${DIRECTOR_LABELS[previewJob.director_key] ?? ''}` : '—'} />
              <InfoRow label="AI Sağlayıcı" value={previewJob.ai_provider ?? '—'} />
              <InfoRow label="İş Tipi" value={JOB_TYPE_LABELS[previewJob.job_type] ?? previewJob.job_type} />
              <InfoRow label="Token Maliyeti" value={String(previewJob.token_cost)} />
              <InfoRow label="Versiyon" value={`v${previewJob.version} (${previewJob.iteration_count}. deneme)`} />
            </div>

            {previewJob.description && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-slate-400 mb-2">Görev Açıklaması</h4>
                <p className="text-slate-300 text-sm whitespace-pre-wrap">{previewJob.description}</p>
              </div>
            )}

            <div>
              <h4 className="text-sm font-medium text-slate-400 mb-2">AI Çıktısı</h4>
              <div className="p-4 bg-slate-800 border border-slate-700 rounded-xl text-slate-300 text-sm whitespace-pre-wrap max-h-96 overflow-y-auto">
                {(previewJob.output_data as Record<string, unknown>)?.raw_output
                  ? String((previewJob.output_data as Record<string, unknown>).raw_output)
                  : previewJob.output_preview ?? 'Çıktı yok'}
              </div>
            </div>

            {(previewJob.output_data as Record<string, unknown>)?.claude_review && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-amber-400 mb-2 flex items-center gap-2">
                  <Shield size={16} /> Claude Denetim Raporu
                </h4>
                <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl text-slate-300 text-sm whitespace-pre-wrap">
                  {String((previewJob.output_data as Record<string, unknown>).claude_review)}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Yardımcı Bileşenler ────────────────────────────────────

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  const colorMap: Record<string, string> = {
    amber: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
    emerald: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    cyan: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
    blue: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
    red: 'bg-red-500/10 border-red-500/30 text-red-400',
    slate: 'bg-slate-500/10 border-slate-500/30 text-slate-400',
  }
  return (
    <div className={`rounded-xl border p-4 ${colorMap[color] ?? colorMap.slate}`}>
      <div className="flex items-center gap-2 mb-1">{icon}<span className="text-sm">{label}</span></div>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-xs text-slate-500">{label}</span>
      <p className="text-sm text-white">{value}</p>
    </div>
  )
}
