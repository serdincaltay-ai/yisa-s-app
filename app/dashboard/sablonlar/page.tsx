'use client'

import { useEffect, useState, useCallback } from 'react'
import { LayoutTemplate, RefreshCw, AlertCircle, Store, Lightbulb, X } from 'lucide-react'

const KATEGORILER = [
  'Tümü',
  'CFO',
  'CLO',
  'CHRO',
  'CMO',
  'CTO',
  'CSO',
  'CSPO',
  'COO',
  'CMDO',
  'CCO',
  'CDO',
  'CISO',
] as const

type SablonItem = {
  id: string
  ad: string
  kategori: string
  icerik: Record<string, unknown>
  durum: string
  olusturan: string
  created_at?: string
}

type TemplateUsage = {
  id: string
  tenant_id: string
  tenant_name: string
  template_id: string
  template_source: string
  used_at: string
  notes?: string
}

type RDSuggestion = {
  id: string
  title: string
  description?: string
  source: string
  status: string
  created_at: string
}

function isEmptyIcerik(icerik: Record<string, unknown>): boolean {
  if (!icerik || typeof icerik !== 'object') return true
  const keys = Object.keys(icerik)
  return keys.length === 0 || (keys.length === 1 && keys[0] === 'aciklama' && !icerik.aciklama)
}

export default function SablonlarPage() {
  const [sablonlar, setSablonlar] = useState<SablonItem[]>([])
  const [toplam, setToplam] = useState(0)
  const [kategoriFilter, setKategoriFilter] = useState<string>('Tümü')
  const [usages, setUsages] = useState<TemplateUsage[]>([])
  const [suggestions, setSuggestions] = useState<RDSuggestion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modalSablon, setModalSablon] = useState<SablonItem | null>(null)

  const fetchData = useCallback(async (kategori?: string) => {
    setLoading(true)
    setError(null)
    try {
      const url = kategori && kategori !== 'Tümü'
        ? `/api/templates?kategori=${encodeURIComponent(kategori)}`
        : '/api/templates'
      const [tRes, uRes] = await Promise.all([
        fetch(url),
        fetch('/api/templates/usage'),
      ])
      const tData = await tRes.json()
      const uData = await uRes.json()
      setSablonlar(Array.isArray(tData?.sablonlar) ? tData.sablonlar : [])
      setToplam(typeof tData?.toplam === 'number' ? tData.toplam : (tData?.sablonlar?.length ?? 0))
      setSuggestions(Array.isArray(tData?.suggestions) ? tData.suggestions : [])
      setUsages(Array.isArray(uData?.items) ? uData.items : [])
    } catch {
      setError('Veri yüklenemedi.')
      setSablonlar([])
      setToplam(0)
      setUsages([])
      setSuggestions([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData(kategoriFilter === 'Tümü' ? undefined : kategoriFilter)
  }, [kategoriFilter, fetchData])

  const bosIcerikSayisi = sablonlar.filter((s) => isEmptyIcerik(s.icerik)).length

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Şablonlar</h1>
          <p className="text-slate-400">66 direktörlük şablonu — kategoriye göre filtreleyin, içeriği görüntüleyin.</p>
        </div>
        <button
          type="button"
          onClick={() => fetchData(kategoriFilter === 'Tümü' ? undefined : kategoriFilter)}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm transition-colors disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Yenile
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      {bosIcerikSayisi > 0 && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-2">
          <AlertCircle size={20} />
          <span>{bosIcerikSayisi} şablonun içeriği boş. Supabase&apos;de SABLONLAR_TEK_SQL.sql çalıştırıldığından emin olun.</span>
        </div>
      )}

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <span className="text-slate-400 text-sm">Kategori:</span>
        {KATEGORILER.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setKategoriFilter(k)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              kategoriFilter === k
                ? 'bg-amber-500/30 text-amber-400 border border-amber-500/50'
                : 'bg-slate-700/50 text-slate-400 border border-slate-600 hover:bg-slate-700 hover:text-slate-300'
            }`}
          >
            {k}
          </button>
        ))}
      </div>

      <div className="mb-4 text-slate-400 text-sm">
        Toplam: <strong className="text-white">{toplam}</strong> şablon
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-500">
          Yükleniyor…
        </div>
      ) : (
        <>
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <LayoutTemplate size={20} /> Şablon Havuzu
            </h2>
            {sablonlar.length === 0 ? (
              <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 text-center">
                <AlertCircle className="mx-auto mb-2 text-slate-500" size={32} />
                <p className="text-slate-500 text-sm">
                  Bu kategoride şablon yok veya <code>ceo_templates</code> tablosu boş. Supabase SQL Editor&apos;da <code>SABLONLAR_TEK_SQL.sql</code> dosyasını çalıştırın.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {sablonlar.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setModalSablon(s)}
                    className={`text-left rounded-xl border p-4 transition-colors ${
                      isEmptyIcerik(s.icerik)
                        ? 'border-red-500/50 bg-red-500/5 hover:bg-red-500/10'
                        : 'border-slate-700 bg-slate-800/50 hover:border-amber-500/40 hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="font-medium text-white truncate">{s.ad}</div>
                    <div className="text-slate-400 text-sm mt-1">{s.kategori}</div>
                    <div className="text-slate-500 text-xs mt-1 flex items-center gap-2">
                      <span>{s.durum}</span>
                      <span>·</span>
                      <span>{s.olusturan}</span>
                    </div>
                    {isEmptyIcerik(s.icerik) && (
                      <div className="mt-2 text-red-400 text-xs flex items-center gap-1">
                        <AlertCircle size={12} /> İçerik boş
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {modalSablon && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
              onClick={() => setModalSablon(null)}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
            >
              <div
                className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between p-4 border-b border-slate-700">
                  <h3 id="modal-title" className="text-lg font-semibold text-white">
                    {modalSablon.ad}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setModalSablon(null)}
                    className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700"
                    aria-label="Kapat"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="p-4 text-slate-400 text-sm">
                  <span className="text-slate-500">Kategori:</span> {modalSablon.kategori}
                  <span className="mx-2">·</span>
                  <span className="text-slate-500">Oluşturan:</span> {modalSablon.olusturan}
                </div>
                <div className="flex-1 overflow-auto p-4 pt-0">
                  <pre className="bg-slate-950 border border-slate-700 rounded-xl p-4 text-xs text-slate-300 overflow-auto whitespace-pre-wrap font-mono">
                    {JSON.stringify(modalSablon.icerik, null, 2)}
                  </pre>
                  {isEmptyIcerik(modalSablon.icerik) && (
                    <p className="mt-2 text-red-400 text-sm">Bu şablonun içeriği boş.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="mb-8">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Store size={20} /> Şablon Kullanımı
            </h2>
            {usages.length === 0 ? (
              <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 text-center">
                <p className="text-slate-500 text-sm">
                  Henüz kayıtlı şablon kullanımı yok.
                </p>
              </div>
            ) : (
              <div className="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="px-6 py-4 text-slate-400 font-medium text-sm">Tenant</th>
                        <th className="px-6 py-4 text-slate-400 font-medium text-sm">Şablon ID</th>
                        <th className="px-6 py-4 text-slate-400 font-medium text-sm">Kaynak</th>
                        <th className="px-6 py-4 text-slate-400 font-medium text-sm">Tarih</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usages.map((u) => (
                        <tr key={u.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                          <td className="px-6 py-4 text-white font-medium">{u.tenant_name}</td>
                          <td className="px-6 py-4 text-slate-400 font-mono text-xs">{String(u.template_id).slice(0, 8)}…</td>
                          <td className="px-6 py-4 text-slate-400">{u.template_source}</td>
                          <td className="px-6 py-4 text-slate-500 text-sm">
                            {u.used_at ? new Date(u.used_at).toLocaleString('tr-TR') : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {suggestions.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Lightbulb size={20} /> Ar-Ge / CEO Güncellemeleri
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {suggestions.map((s) => (
                  <div
                    key={s.id}
                    className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 hover:border-amber-500/30 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-white font-medium">{s.title}</h3>
                      <span className="text-xs px-2 py-1 rounded-lg bg-amber-500/20 text-amber-400">{s.status}</span>
                    </div>
                    {s.description && <p className="text-slate-500 text-sm mb-2">{s.description}</p>}
                    <p className="text-slate-600 text-xs">{s.source} · {s.created_at ? new Date(s.created_at).toLocaleDateString('tr-TR') : '—'}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
