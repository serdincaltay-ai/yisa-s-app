'use client'

import { useEffect, useState } from 'react'
import {
  FileText,
  Loader2,
  Bot,
  CheckCircle,
  XCircle,
  BarChart3,
  Clock,
  Zap,
  TrendingUp,
  Filter,
} from 'lucide-react'

type TaskResult = {
  id: string
  task_id: string | null
  routine_task_id: string | null
  director_key: string | null
  ai_providers: string[]
  input_command: string
  output_result: string
  status: string
  created_at: string
}

// ─── Direktörlük isimleri ──────────────────────────────────────────────────
const DIRECTOR_NAMES: Record<string, string> = {
  CFO: 'Finans',
  CTO: 'Teknoloji',
  CIO: 'Bilgi Sistemleri',
  CMO: 'Pazarlama',
  CHRO: 'İnsan Kaynakları',
  CLO: 'Hukuk',
  CSO_SATIS: 'Satış',
  CPO: 'Ürün',
  CDO: 'Veri / Analitik',
  CISO: 'Bilgi Güvenliği',
  CCO: 'Müşteri İlişkileri',
  CSO_STRATEJI: 'Strateji',
  CSPO: 'Spor',
  COO: 'Operasyon',
  RND: 'AR-GE',
}

export default function ReportsPage() {
  const [tasks, setTasks] = useState<TaskResult[]>([])
  const [loading, setLoading] = useState(true)
  const [dirFilter, setDirFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    fetch('/api/task-results?limit=100')
      .then((r) => r.json())
      .then((d) => setTasks(d.results ?? []))
      .catch(() => setTasks([]))
      .finally(() => setLoading(false))
  }, [])

  // ─── İstatistikler ────────────────────────────────────────────────────
  const tamamlanan = tasks.filter((t) => t.status === 'completed').length
  const basarisiz = tasks.filter((t) => t.status === 'failed').length
  const iptal = tasks.filter((t) => t.status === 'cancelled').length

  // Direktörlük dağılımı
  const direktorlukDagilimi = tasks.reduce<Record<string, number>>((acc, t) => {
    const key = t.director_key ?? 'Bilinmeyen'
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})
  const direktorlukSirali = Object.entries(direktorlukDagilimi).sort((a, b) => b[1] - a[1])

  // AI sağlayıcı dağılımı
  const aiDagilimi = tasks.reduce<Record<string, number>>((acc, t) => {
    for (const p of (t.ai_providers ?? [])) {
      acc[p] = (acc[p] || 0) + 1
    }
    return acc
  }, {})

  // Son 24 saat
  const yirmiDortSaatOnce = Date.now() - 24 * 60 * 60 * 1000
  const son24Saat = tasks.filter((t) => new Date(t.created_at).getTime() > yirmiDortSaatOnce).length

  // Filtreleme
  const filteredTasks = tasks.filter((t) => {
    if (dirFilter !== 'all' && t.director_key !== dirFilter) return false
    if (statusFilter !== 'all' && t.status !== statusFilter) return false
    return true
  })
  const directorKeys = [...new Set(tasks.map((t) => t.director_key).filter(Boolean))] as string[]

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <BarChart3 size={24} className="text-cyan-400" />
          Raporlar
        </h1>
        <p className="text-slate-400 mt-1">
          CDO direktörlüğü — CELF görev sonuçları, direktörlük analizi, Veri Arşivleme.
        </p>
      </div>

      {/* Özet Kartları */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-white">{tasks.length}</p>
          <p className="text-slate-400 text-sm">Toplam Görev</p>
        </div>
        <div className="bg-slate-800/60 border border-emerald-500/30 rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <CheckCircle size={16} className="text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400">{tamamlanan}</p>
          <p className="text-slate-400 text-sm">Tamamlanan</p>
        </div>
        <div className="bg-slate-800/60 border border-red-500/30 rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <XCircle size={16} className="text-red-400" />
          </div>
          <p className="text-2xl font-bold text-red-400">{basarisiz}</p>
          <p className="text-slate-400 text-sm">Başarısız</p>
        </div>
        <div className="bg-slate-800/60 border border-amber-500/30 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-amber-400">{iptal}</p>
          <p className="text-slate-400 text-sm">İptal</p>
        </div>
        <div className="bg-slate-800/60 border border-cyan-500/30 rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Clock size={16} className="text-cyan-400" />
          </div>
          <p className="text-2xl font-bold text-cyan-400">{son24Saat}</p>
          <p className="text-slate-400 text-sm">Son 24 Saat</p>
        </div>
      </div>

      {/* Direktörlük Dağılımı + AI Sağlayıcılar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp size={18} /> Direktörlük Dağılımı
          </h2>
          {direktorlukSirali.length === 0 ? (
            <p className="text-slate-500 text-sm">Veri yok.</p>
          ) : (
            <div className="space-y-2">
              {direktorlukSirali.map(([key, sayi]) => {
                const maxSayi = direktorlukSirali[0]?.[1] ?? 1
                const yuzde = Math.round((sayi / maxSayi) * 100)
                return (
                  <div key={key} className="flex items-center gap-3">
                    <span className="text-cyan-400 font-mono text-xs w-24 shrink-0">{key}</span>
                    <div className="flex-1 h-5 bg-slate-700/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-full transition-all"
                        style={{ width: `${yuzde}%` }}
                      />
                    </div>
                    <span className="text-slate-300 text-sm font-medium w-8 text-right">{sayi}</span>
                    <span className="text-slate-500 text-xs w-20 truncate">
                      {DIRECTOR_NAMES[key] ?? ''}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Zap size={18} /> AI Sağlayıcı Kullanımı
          </h2>
          {Object.keys(aiDagilimi).length === 0 ? (
            <p className="text-slate-500 text-sm">Veri yok.</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(aiDagilimi)
                .sort((a, b) => b[1] - a[1])
                .map(([provider, sayi]) => {
                  const renkler: Record<string, string> = {
                    GPT: 'from-green-600 to-green-400',
                    CLAUDE: 'from-violet-600 to-violet-400',
                    GEMINI: 'from-blue-600 to-blue-400',
                    TOGETHER: 'from-amber-600 to-amber-400',
                    V0: 'from-pink-600 to-pink-400',
                    CURSOR: 'from-cyan-600 to-cyan-400',
                    CLAUDE_DENET: 'from-purple-600 to-purple-400',
                  }
                  const renk = renkler[provider] ?? 'from-gray-600 to-gray-400'
                  const maxSayi = Math.max(...Object.values(aiDagilimi))
                  const yuzde = Math.round((sayi / maxSayi) * 100)

                  return (
                    <div key={provider} className="flex items-center gap-3">
                      <span className="text-white font-mono text-xs w-28 shrink-0">{provider}</span>
                      <div className="flex-1 h-5 bg-slate-700/50 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${renk} rounded-full transition-all`}
                          style={{ width: `${yuzde}%` }}
                        />
                      </div>
                      <span className="text-slate-300 text-sm font-medium w-8 text-right">{sayi}</span>
                    </div>
                  )
                })}
            </div>
          )}
        </div>
      </div>

      {/* Filtre + Görev Listesi */}
      <div>
        <div className="flex items-center gap-4 mb-4 flex-wrap">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <FileText size={20} /> Görev Sonuçları
          </h2>
          <div className="flex items-center gap-2 ml-auto">
            <Filter size={14} className="text-slate-400" />
            <select
              value={dirFilter}
              onChange={(e) => setDirFilter(e.target.value)}
              className="bg-slate-800 border border-slate-600 text-slate-300 text-sm rounded-lg px-3 py-1.5"
            >
              <option value="all">Tüm Direktörlükler</option>
              {directorKeys.map((k) => (
                <option key={k} value={k}>{k} — {DIRECTOR_NAMES[k] ?? ''}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-800 border border-slate-600 text-slate-300 text-sm rounded-lg px-3 py-1.5"
            >
              <option value="all">Tüm Durumlar</option>
              <option value="completed">Tamamlanan</option>
              <option value="failed">Başarısız</option>
              <option value="cancelled">İptal</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-slate-400">
            <Loader2 size={18} className="animate-spin" /> Yükleniyor...
          </div>
        ) : filteredTasks.length === 0 ? (
          <p className="text-slate-500 text-sm">
            {tasks.length === 0
              ? 'Henüz arşivlenmiş görev yok.'
              : 'Seçilen filtreye uygun görev yok.'}
          </p>
        ) : (
          <div className="space-y-3">
            {filteredTasks.slice(0, 50).map((t) => (
              <div
                key={t.id}
                className={`bg-slate-800/50 border rounded-xl p-4 ${
                  t.status === 'failed'
                    ? 'border-red-500/30'
                    : t.status === 'cancelled'
                      ? 'border-amber-500/30'
                      : 'border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <Bot size={14} className="text-cyan-400" />
                  <span className="text-cyan-400 font-mono text-sm">{t.director_key ?? '—'}</span>
                  {t.director_key && DIRECTOR_NAMES[t.director_key] && (
                    <span className="text-slate-500 text-xs">({DIRECTOR_NAMES[t.director_key]})</span>
                  )}
                  {t.status === 'completed' ? (
                    <CheckCircle size={14} className="text-emerald-400" />
                  ) : t.status === 'failed' ? (
                    <XCircle size={14} className="text-red-400" />
                  ) : (
                    <XCircle size={14} className="text-amber-400" />
                  )}
                  {t.ai_providers && t.ai_providers.length > 0 && (
                    <span className="text-slate-600 text-xs font-mono">
                      [{t.ai_providers.join(', ')}]
                    </span>
                  )}
                  <span className="text-slate-500 text-xs ml-auto">
                    {new Date(t.created_at).toLocaleString('tr-TR')}
                  </span>
                </div>
                <p className="text-slate-300 text-sm mb-1 truncate">{t.input_command}</p>
                <p className="text-slate-500 text-xs line-clamp-2">{t.output_result}</p>
              </div>
            ))}
            {filteredTasks.length > 50 && (
              <p className="text-slate-500 text-sm text-center">
                ... ve {filteredTasks.length - 50} görev daha
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
