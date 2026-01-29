'use client'

/**
 * Patron Onay Paneli — Seçenek 2 Kalite Optimize
 * Onayla / Reddet / Değiştir
 */

import { useState } from 'react'
import { Check, X, Edit3 } from 'lucide-react'

export interface PendingTask {
  output: Record<string, unknown>
  aiResponses: { provider: string; response: unknown }[]
  flow: string
  message: string
}

interface PatronApprovalUIProps {
  pendingTask: PendingTask
  onApprove: () => void
  onReject: () => void
  onModify?: (modifyText: string) => void
}

export function PatronApprovalUI({
  pendingTask,
  onApprove,
  onReject,
  onModify,
}: PatronApprovalUIProps) {
  const [showModifyInput, setShowModifyInput] = useState(false)
  const [modifyText, setModifyText] = useState('')

  const handleModify = () => {
    if (onModify && modifyText.trim()) {
      onModify(modifyText.trim())
      setShowModifyInput(false)
      setModifyText('')
    } else {
      setShowModifyInput(false)
    }
  }

  return (
    <div className="patron-approval-panel rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 space-y-3">
      <h3 className="font-semibold text-amber-400">⏳ Patron Onayı Bekleniyor</h3>

      <div className="task-summary text-sm text-slate-300 space-y-1">
        <p>
          <strong>Görev:</strong> {pendingTask.message}
        </p>
        <p>
          <strong>İşlem:</strong> {(pendingTask.output?.taskType as string) ?? '—'}
        </p>
        <p>
          <strong>Çalışan AI&apos;lar:</strong>{' '}
          {pendingTask.aiResponses
            .filter((a) => {
              const r = a.response as { status?: string; text?: string } | undefined
              return r && (r.status === 'ok' || typeof r.text === 'string')
            })
            .map((a) => a.provider)
            .join(' → ') || '—'}
        </p>
        <p className="text-slate-500 text-xs">{pendingTask.flow}</p>
      </div>

      <div className="approval-buttons flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onApprove}
          className="flex items-center gap-1 px-3 py-2 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 text-sm font-medium transition-colors"
        >
          <Check size={14} />
          Onayla
        </button>
        <button
          type="button"
          onClick={onReject}
          className="flex items-center gap-1 px-3 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 text-sm font-medium transition-colors"
        >
          <X size={14} />
          Reddet
        </button>
        <button
          type="button"
          onClick={() => setShowModifyInput((s) => !s)}
          className="flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-600 text-slate-300 hover:bg-slate-500 text-sm font-medium transition-colors"
        >
          <Edit3 size={14} />
          Değiştir
        </button>
      </div>

      {showModifyInput && (
        <div className="space-y-2">
          <textarea
            value={modifyText}
            onChange={(e) => setModifyText(e.target.value)}
            placeholder="Değişiklik talimatınızı yazın..."
            rows={3}
            className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500/50 focus:outline-none"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleModify}
              className="px-3 py-1.5 text-sm bg-amber-500 hover:bg-amber-400 text-slate-900 rounded-lg font-medium"
            >
              Gönder
            </button>
            <button
              type="button"
              onClick={() => setShowModifyInput(false)}
              className="px-3 py-1.5 text-sm bg-slate-600 hover:bg-slate-500 text-slate-200 rounded-lg"
            >
              İptal
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
