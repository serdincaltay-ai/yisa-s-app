'use client'

import { useEffect, useState } from 'react'
import { Check, X, Clock, AlertCircle, RefreshCw, Loader2, Trash2, Ban, GitBranch } from 'lucide-react'

type ApprovalItem = {
  id: string
  type: string
  title: string
  description?: string
  status: string
  priority?: string
  created_at: string
  source?: string
  has_github_commit?: boolean
}

export default function OnayKuyruguPage() {
  const [items, setItems] = useState<ApprovalItem[]>([])
  const [table, setTable] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actingId, setActingId] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/approvals')
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data?.error ?? 'Veri yüklenemedi.')
        setItems([])
        setTable(null)
        return
      }
      setItems(Array.isArray(data?.items) ? data.items : [])
      setTable(data?.table ?? null)
    } catch {
      setError('Veri yüklenemedi.')
      setItems([])
      setTable(null)
    } finally {
      setLoading(false)
    }
  }

  const handleDecision = async (commandId: string, decision: 'approve' | 'reject' | 'cancel' | 'push') => {
    setActingId(commandId + '_' + decision)
    try {
      const res = await fetch('/api/approvals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command_id: commandId, decision }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data?.error ?? 'İşlem başarısız.')
        return
      }
      if (data.message) {
        alert(data.message)
      }
      setError(null)
      await fetchData()
    } catch {
      setError('İstek gönderilemedi.')
    } finally {
      setActingId(null)
    }
  }

  const handleCancelAll = async () => {
    const cancellable = items.filter((i) => ['pending', 'approved', 'modified'].includes(i.status))
    if (cancellable.length === 0) return
    if (!confirm(`${cancellable.length} işin tamamını iptal etmek istediğinize emin misiniz?`)) return
    setActingId('cancel_all')
    try {
      const res = await fetch('/api/approvals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cancel_all: true }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data?.error ?? 'Tümünü iptal başarısız.')
        return
      }
      if (data.message) {
        alert(data.message)
      }
      setError(null)
      await fetchData()
    } catch {
      setError('İstek gönderilemedi.')
    } finally {
      setActingId(null)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const pending = items.filter((i) => i.status === 'pending')
  const approved = items.filter((i) => i.status === 'approved')
  const rejected = items.filter((i) => ['rejected', 'cancelled'].includes(i.status))
  const cancellable = items.filter((i) => ['pending', 'approved', 'modified'].includes(i.status))

  const actionableStatuses = new Set(['pending', 'approved', 'modified'])

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Onay Kuyruğu</h1>
          <p className="text-slate-400">
            Sistemden gelen işler — Onayla / Reddet / İptal / Push
            {table && <span className="ml-2 text-xs text-slate-500">(Kaynak: {table})</span>}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {cancellable.length > 0 && (
            <button
              type="button"
              onClick={handleCancelAll}
              disabled={loading || actingId !== null}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 border border-rose-500/40 text-sm font-medium transition-colors disabled:opacity-50"
              title="Bekleyen ve onaylanmış tüm işleri iptal et"
            >
              {actingId === 'cancel_all' ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
              Tümünü İptal Et ({cancellable.length})
            </button>
          )}
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
      ) : items.length === 0 ? (
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-12 text-center">
          <AlertCircle className="mx-auto mb-4 text-slate-500" size={48} />
          <p className="text-slate-400 mb-2">Henüz onay kaydı yok.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
              <p className="text-amber-400 text-sm">Bekleyen</p>
              <p className="text-2xl font-bold text-white">{pending.length}</p>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
              <p className="text-emerald-400 text-sm">Onaylanan</p>
              <p className="text-2xl font-bold text-white">{approved.length}</p>
            </div>
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
              <p className="text-red-400 text-sm">Reddedilen / İptal</p>
              <p className="text-2xl font-bold text-white">{rejected.length}</p>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="px-6 py-4 text-slate-400 font-medium text-sm">Tip</th>
                    <th className="px-6 py-4 text-slate-400 font-medium text-sm">Başlık</th>
                    <th className="px-6 py-4 text-slate-400 font-medium text-sm">Öncelik</th>
                    <th className="px-6 py-4 text-slate-400 font-medium text-sm">Durum</th>
                    <th className="px-6 py-4 text-slate-400 font-medium text-sm">Tarih</th>
                    <th className="px-6 py-4 text-slate-400 font-medium text-sm">İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                      <td className="px-6 py-4 text-white">{item.type}</td>
                      <td className="px-6 py-4">
                        <span className="text-white">{item.title.length > 80 ? item.title.slice(0, 80) + '…' : item.title}</span>
                        {item.has_github_commit && (
                          <span className="ml-2 text-xs text-purple-400" title="GitHub commit hazır">
                            <GitBranch size={12} className="inline" />
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2 py-1 rounded-lg ${
                          item.priority === 'high' ? 'bg-rose-500/20 text-rose-400'
                          : item.priority === 'low' ? 'bg-slate-500/20 text-slate-400'
                          : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {item.priority ?? 'normal'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {item.status === 'pending' && (
                          <span className="flex items-center gap-1 text-amber-400 text-sm">
                            <Clock size={14} /> Bekliyor
                          </span>
                        )}
                        {item.status === 'approved' && (
                          <span className="flex items-center gap-1 text-emerald-400 text-sm">
                            <Check size={14} /> Onaylandı
                          </span>
                        )}
                        {item.status === 'rejected' && (
                          <span className="flex items-center gap-1 text-red-400 text-sm">
                            <X size={14} /> Reddedildi
                          </span>
                        )}
                        {item.status === 'cancelled' && (
                          <span className="flex items-center gap-1 text-slate-400 text-sm">
                            <Ban size={14} /> İptal Edildi
                          </span>
                        )}
                        {item.status === 'modified' && (
                          <span className="flex items-center gap-1 text-blue-400 text-sm">
                            <RefreshCw size={14} /> Düzenlendi
                          </span>
                        )}
                        {!['pending', 'approved', 'rejected', 'cancelled', 'modified'].includes(item.status) && (
                          <span className="text-slate-400 text-sm">{item.status}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-sm">
                        {item.created_at ? new Date(item.created_at).toLocaleDateString('tr-TR') : '—'}
                      </td>
                      <td className="px-6 py-4">
                        {item.status === 'pending' ? (
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleDecision(item.id, 'approve')}
                              disabled={actingId !== null}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 text-sm font-medium transition-colors disabled:opacity-50"
                            >
                              {actingId === item.id + '_approve' ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                              Onayla
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDecision(item.id, 'cancel')}
                              disabled={actingId !== null}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 text-sm font-medium transition-colors disabled:opacity-50"
                            >
                              {actingId === item.id + '_cancel' ? <Loader2 size={14} className="animate-spin" /> : <Ban size={14} />}
                              İptal
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDecision(item.id, 'reject')}
                              disabled={actingId !== null}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 text-sm font-medium transition-colors disabled:opacity-50"
                            >
                              {actingId === item.id + '_reject' ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />}
                              Reddet
                            </button>
                          </div>
                        ) : item.status === 'approved' ? (
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleDecision(item.id, 'cancel')}
                              disabled={actingId !== null}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 text-sm font-medium transition-colors disabled:opacity-50"
                            >
                              {actingId === item.id + '_cancel' ? <Loader2 size={14} className="animate-spin" /> : <Ban size={14} />}
                              İptal
                            </button>
                            {item.has_github_commit && (
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm('GitHub\'a push yapmak istediğinize emin misiniz?')) {
                                    handleDecision(item.id, 'push')
                                  }
                                }}
                                disabled={actingId !== null}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 text-sm font-medium transition-colors disabled:opacity-50"
                              >
                                {actingId === item.id + '_push' ? <Loader2 size={14} className="animate-spin" /> : <GitBranch size={14} />}
                                Push Et
                              </button>
                            )}
                          </div>
                        ) : item.status === 'modified' ? (
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleDecision(item.id, 'approve')}
                              disabled={actingId !== null}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 text-sm font-medium transition-colors disabled:opacity-50"
                            >
                              {actingId === item.id + '_approve' ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                              Onayla
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDecision(item.id, 'cancel')}
                              disabled={actingId !== null}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 text-sm font-medium transition-colors disabled:opacity-50"
                            >
                              {actingId === item.id + '_cancel' ? <Loader2 size={14} className="animate-spin" /> : <Ban size={14} />}
                              İptal
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-500 text-sm">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}