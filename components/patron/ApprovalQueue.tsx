'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, Edit3, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'

interface ApprovalItem {
  id: string
  title: string
  status: string
  created_at: string
  displayText?: string
  output_payload?: { displayText?: string; director_key?: string; director_name?: string }
  director_key?: string
  director_name?: string
}

export default function ApprovalQueue() {
  const [items, setItems] = useState<ApprovalItem[]>([])
  const [loading, setLoading] = useState(true)
  const [actingId, setActingId] = useState<string | null>(null)
  const [previewItem, setPreviewItem] = useState<ApprovalItem | null>(null)

  const fetchQueue = async () => {
    try {
      const res = await fetch('/api/approvals')
      const data = await res.json()
      const list = (data.items ?? []).filter((i: ApprovalItem) => i.status === 'pending')
      setItems(list)
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQueue()

    const channel = supabase
      .channel('patron_commands')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'patron_commands' }, () => {
        fetchQueue()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const handleDecision = async (id: string, decision: 'approve' | 'reject') => {
    setActingId(id)
    try {
      const res = await fetch('/api/approvals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command_id: id, decision: decision === 'approve' ? 'approve' : 'reject' }),
      })
      if (res.ok) {
        setItems((prev) => prev.filter((i) => i.id !== id))
        setPreviewItem((p) => (p?.id === id ? null : p))
      }
    } finally {
      setActingId(null)
    }
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-[#1e293b] bg-[#111827] p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-4 w-1/3 bg-[#1e293b] rounded" />
          <div className="h-20 bg-[#1e293b] rounded" />
          <div className="h-20 bg-[#1e293b] rounded" />
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-xl border border-[#1e293b] bg-[#111827] p-4">
        <h3 className="text-sm font-semibold text-[#f8fafc] mb-3 flex items-center gap-2">
          Onay Havuzu
          <span className="text-xs text-[#94a3b8]">({items.length} bekliyor)</span>
        </h3>

        {items.length === 0 ? (
          <p className="text-sm text-[#94a3b8] py-6 text-center">Bekleyen iş yok</p>
        ) : (
          <div className="space-y-3 max-h-[320px] overflow-y-auto">
            <AnimatePresence>
              {items.map((item) => {
                const displayText = item.displayText ?? item.output_payload?.displayText ?? ''
                const directorKey = item.director_key ?? item.output_payload?.director_key ?? '—'
                const directorName = item.director_name ?? item.output_payload?.director_name ?? directorKey
                const snippet = displayText ? displayText.slice(0, 80).replace(/\n/g, ' ') + (displayText.length > 80 ? '…' : '') : ''

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-4 rounded-lg border border-[#1e293b] bg-[#0a0e17] hover:border-[#3b82f6]/40 transition-colors"
                  >
                    <p className="text-sm font-medium text-[#f8fafc] truncate">
                      #{item.id.slice(0, 8)} {item.title?.slice(0, 60) ?? '—'}
                    </p>
                    <p className="text-xs text-[#94a3b8] mt-1">
                      {directorName} ({directorKey})
                    </p>
                    {snippet && (
                      <p className="text-xs text-[#94a3b8] mt-2 line-clamp-2">« {snippet} »</p>
                    )}
                    <p className="text-xs text-[#f97316] mt-2">⏳ Bekliyor</p>
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        className="bg-[#10b981] hover:bg-[#059669] text-white"
                        onClick={() => handleDecision(item.id, 'approve')}
                        disabled={!!actingId}
                      >
                        <Check size={14} className="mr-1" /> Onayla
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-[#ef4444]/50 text-[#ef4444] hover:bg-[#ef4444]/20"
                        onClick={() => handleDecision(item.id, 'reject')}
                        disabled={!!actingId}
                      >
                        <X size={14} className="mr-1" /> Reddet
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-[#94a3b8]"
                        onClick={() => setPreviewItem(item)}
                      >
                        <Eye size={14} className="mr-1" /> Göz
                      </Button>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Önizleme modal */}
      {previewItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setPreviewItem(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#111827] rounded-xl border border-[#1e293b] max-w-2xl w-full max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e293b]">
              <h3 className="font-semibold text-[#f8fafc] truncate">{previewItem.title}</h3>
              <Button variant="ghost" size="sm" onClick={() => setPreviewItem(null)}>
                <X size={18} />
              </Button>
            </div>
            <div className="p-4 overflow-auto max-h-[60vh]">
              <pre className="text-sm text-[#f8fafc] whitespace-pre-wrap font-sans">
                {previewItem.displayText ?? previewItem.output_payload?.displayText ?? '—'}
              </pre>
            </div>
          </motion.div>
        </div>
      )}
    </>
  )
}
