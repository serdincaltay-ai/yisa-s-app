'use client'

import { useEffect, useState } from 'react'
import { LayoutTemplate, Lightbulb, RefreshCw, AlertCircle } from 'lucide-react'

type TemplateItem = {
  id: string
  name: string
  type: string
  used_count?: number
  where_used?: string
  created_at: string
}

type RDSuggestion = {
  id: string
  title: string
  description?: string
  source: string
  status: string
  created_at: string
}

export default function SablonlarPage() {
  const [templates, setTemplates] = useState<TemplateItem[]>([])
  const [suggestions, setSuggestions] = useState<RDSuggestion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/templates')
      const data = await res.json()
      setTemplates(Array.isArray(data?.templates) ? data.templates : [])
      setSuggestions(Array.isArray(data?.suggestions) ? data.suggestions : [])
    } catch {
      setError('Veri yüklenemedi.')
      setTemplates([])
      setSuggestions([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Şablonlar</h1>
          <p className="text-slate-400">Tüm şablonlar — veri havuzu, nerede kullanılıyor, Ar-Ge / CEO önerileri.</p>
        </div>
        <button
          type="button"
          onClick={fetchData}
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
            {templates.length === 0 ? (
              <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 text-center">
                <AlertCircle className="mx-auto mb-2 text-slate-500" size={32} />
                <p className="text-slate-500 text-sm">
                  <code>templates</code> veya <code>sablonlar</code> tablosu Supabase&apos;de oluşturulduğunda burada listelenecek.
                </p>
              </div>
            ) : (
              <div className="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="px-6 py-4 text-slate-400 font-medium text-sm">Ad</th>
                        <th className="px-6 py-4 text-slate-400 font-medium text-sm">Tür</th>
                        <th className="px-6 py-4 text-slate-400 font-medium text-sm">Kullanım</th>
                        <th className="px-6 py-4 text-slate-400 font-medium text-sm">Nerede kullanılıyor</th>
                        <th className="px-6 py-4 text-slate-400 font-medium text-sm">Tarih</th>
                      </tr>
                    </thead>
                    <tbody>
                      {templates.map((t) => (
                        <tr key={t.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                          <td className="px-6 py-4 text-white font-medium">{t.name}</td>
                          <td className="px-6 py-4 text-slate-400">{t.type}</td>
                          <td className="px-6 py-4 text-amber-400">{t.used_count ?? '—'}</td>
                          <td className="px-6 py-4 text-slate-500 text-sm">{t.where_used ?? '—'}</td>
                          <td className="px-6 py-4 text-slate-500 text-sm">
                            {t.created_at ? new Date(t.created_at).toLocaleDateString('tr-TR') : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Lightbulb size={20} /> Ar-Ge / CEO Güncellemeleri
            </h2>
            {suggestions.length === 0 ? (
              <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 text-center">
                <AlertCircle className="mx-auto mb-2 text-slate-500" size={32} />
                <p className="text-slate-500 text-sm">
                  <code>rd_suggestions</code> veya <code>ceo_updates</code> tablosu oluşturulduğunda burada listelenecek.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {suggestions.map((s) => (
                  <div
                    key={s.id}
                    className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 hover:border-amber-500/30 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-white font-medium">{s.title}</h3>
                      <span
                        className={`text-xs px-2 py-1 rounded-lg ${
                          s.status === 'done' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                        }`}
                      >
                        {s.status}
                      </span>
                    </div>
                    {s.description && <p className="text-slate-500 text-sm mb-2">{s.description}</p>}
                    <p className="text-slate-600 text-xs">
                      {s.source} · {s.created_at ? new Date(s.created_at).toLocaleDateString('tr-TR') : '—'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
