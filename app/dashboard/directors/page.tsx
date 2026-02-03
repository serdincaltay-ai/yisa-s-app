'use client'

import { useEffect, useState } from 'react'
import { Play, RefreshCw, Loader2, Bot, CheckCircle2, XCircle, Clock } from 'lucide-react'
import { CELF_DIRECTORATES, CELF_DIRECTORATE_KEYS, type DirectorKey } from '@/lib/robots/celf-center'
import { supabase } from '@/lib/supabase'

type StartupTask = { id: string; directorKey: string; name: string; command: string; requiresApproval?: boolean; status?: string }
type StartupSummary = Record<string, { pending: number; completed: number; total: number }>

export default function DirectorsPage() {
  const [summary, setSummary] = useState<StartupSummary | null>(null)
  const [tasks, setTasks] = useState<StartupTask[]>([])
  const [loading, setLoading] = useState(true)
  const [acting, setActing] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/startup')
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data?.error ?? 'Veri alınamadı')
        return
      }
      const rawSummary = data?.summary
      const summaryMap = Array.isArray(rawSummary)
        ? Object.fromEntries(
            rawSummary.map((s: { director: string; pending: number; completed: number; total: number }) => [
              s.director,
              { pending: s.pending, completed: s.completed, total: s.total },
            ])
          )
        : rawSummary ?? null
      setSummary(summaryMap)
      setTasks(Array.isArray(data?.next_tasks) ? data.next_tasks : [])
    } catch {
      setError('Veri yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleRunDirector = async (director: DirectorKey) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    setActing(director)
    setError(null)
    try {
      const res = await fetch('/api/startup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'run_director',
          director,
          user_id: user.id,
          user: user,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data?.error ?? 'Tetikleme başarısız')
        return
      }
      await fetchData()
    } catch {
      setError('İstek gönderilemedi')
    } finally {
      setActing(null)
    }
  }

  const handleRunTask = async (taskId: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    setActing(taskId)
    setError(null)
    try {
      const res = await fetch('/api/startup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'run_task',
          task_id: taskId,
          user_id: user.id,
          user: user,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data?.error ?? 'Tetikleme başarısız')
        return
      }
      await fetchData()
    } catch {
      setError('İstek gönderilemedi')
    } finally {
      setActing(null)
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">CELF Direktörlükleri</h1>
          <p className="text-slate-400">Başlangıç görevleri — Her direktörlük için tetikleme (Patron onayı gerekir)</p>
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
        <div className="space-y-8">
          {/* Direktörlük kartları */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CELF_DIRECTORATE_KEYS.map((key) => {
              const dir = CELF_DIRECTORATES[key]
              const s = summary?.[key]
              const dirTasks = tasks.filter((t) => t.directorKey === key)
              const pendingCount = s?.pending ?? dirTasks.length
              return (
                <div
                  key={key}
                  className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 hover:border-cyan-500/30 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                        <Bot className="text-cyan-400" size={24} />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-white">{dir?.name ?? key}</h2>
                        <p className="text-slate-500 text-sm">{key}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRunDirector(key)}
                      disabled={!!acting}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 text-sm font-medium transition-colors disabled:opacity-50"
                    >
                      {acting === key ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Play size={16} />
                      )}
                      Tetikle
                    </button>
                  </div>
                  <p className="text-slate-400 text-sm mb-4">{dir?.work ?? '—'}</p>
                  <div className="space-y-2 mb-4">
                    <p className="text-slate-500 text-xs font-medium">Görevler: {dir?.tasks?.slice(0, 3).join(', ')}</p>
                    <p className="text-slate-500 text-xs">AI: {dir?.aiProviders?.join(', ')}</p>
                  </div>
                  {pendingCount > 0 && (
                    <p className="text-amber-400 text-sm flex items-center gap-1">
                      <Clock size={14} /> {pendingCount} beklemede
                    </p>
                  )}
                  {dirTasks.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-700 space-y-2">
                      {dirTasks.slice(0, 3).map((t) => (
                        <div key={t.id} className="flex items-center justify-between text-sm">
                          <span className="text-slate-300 truncate flex-1">{t.name}</span>
                          <button
                            type="button"
                            onClick={() => handleRunTask(t.id)}
                            disabled={!!acting}
                            className="flex-shrink-0 ml-2 px-2 py-1 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 text-xs disabled:opacity-50"
                          >
                            {acting === t.id ? <Loader2 size={12} className="animate-spin" /> : 'Çalıştır'}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Sonraki görevler özeti */}
          {tasks.length > 0 && (
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Sıradaki Başlangıç Görevleri</h3>
              <div className="space-y-3">
                {tasks.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between rounded-xl bg-slate-900/50 p-4 border border-slate-700"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white">{t.name}</p>
                      <p className="text-slate-500 text-sm truncate">{t.command}</p>
                      <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded bg-slate-700 text-slate-400">
                        {t.directorKey}
                        {t.requiresApproval && ' · Onay gerekli'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRunTask(t.id)}
                      disabled={!!acting}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 text-sm font-medium disabled:opacity-50 ml-4"
                    >
                      {acting === t.id ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <>
                          <Play size={16} />
                          Tetikle
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
