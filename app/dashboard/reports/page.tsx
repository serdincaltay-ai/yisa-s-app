'use client'

import { useEffect, useState } from 'react'
import { FileText, Loader2, Bot, CheckCircle, XCircle } from 'lucide-react'

type TaskResult = {
  id: string
  director_key: string | null
  input_command: string
  output_result: string
  status: string
  created_at: string
  routine_task_id?: string | null
}

export default function ReportsPage() {
  const [tasks, setTasks] = useState<TaskResult[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/task-results?limit=20')
      .then((r) => r.json())
      .then((d) => setTasks(d.results ?? []))
      .catch(() => setTasks([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Raporlar</h1>
        <p className="text-slate-400">CDO direktörlüğü — analiz, rapor, Veri Arşivleme (task_results).</p>
      </div>

      {/* Son Görevler (Veri Arşivleme tüketimi) */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <FileText size={20} /> Son Görevler
        </h2>
        {loading ? (
          <div className="flex items-center gap-2 text-slate-400">
            <Loader2 size={18} className="animate-spin" /> Yükleniyor…
          </div>
        ) : tasks.length === 0 ? (
          <p className="text-slate-500 text-sm">Henüz arşivlenmiş görev yok.</p>
        ) : (
          <div className="space-y-3">
            {tasks.map((t) => (
              <div
                key={t.id}
                className="bg-slate-800/50 border border-slate-700 rounded-xl p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Bot size={14} className="text-cyan-400" />
                  <span className="text-cyan-400 font-mono text-sm">{t.director_key ?? '—'}</span>
                  {t.status === 'completed' ? (
                    <CheckCircle size={14} className="text-emerald-400" />
                  ) : (
                    <XCircle size={14} className="text-amber-400" />
                  )}
                  <span className="text-slate-500 text-xs ml-auto">
                    {new Date(t.created_at).toLocaleString('tr-TR')}
                  </span>
                </div>
                <p className="text-slate-300 text-sm mb-1 truncate">{t.input_command}</p>
                <p className="text-slate-500 text-xs line-clamp-2">{t.output_result}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-2">Gelir Raporu</h2>
          <p className="text-slate-500 text-sm">Aylık/yıllık gelir özeti — CFO verisi.</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-2">Kullanıcı / Tesis</h2>
          <p className="text-slate-500 text-sm">Üye, tesis, franchise sayıları.</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-2">Operasyon</h2>
          <p className="text-slate-500 text-sm">COO süreç takibi, kaynak kullanımı.</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-2">Güvenlik / Audit</h2>
          <p className="text-slate-500 text-sm">CISO log, erişim raporları.</p>
        </div>
      </div>
    </div>
  )
}
