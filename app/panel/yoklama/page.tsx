'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { YoklamaList, type YoklamaItem } from './YoklamaList'

const BRANSLAR = [
  '',
  'Artistik Cimnastik',
  'Ritmik Cimnastik',
  'Trampolin',
  'Genel Jimnastik',
  'Temel Hareket Eğitimi',
  'Diğer',
]

function bugunISO() {
  const d = new Date()
  return d.toISOString().slice(0, 10)
}

export default function YoklamaPage() {
  const [date, setDate] = useState(bugunISO)
  const [bransFilter, setBransFilter] = useState('')
  const [items, setItems] = useState<YoklamaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ date })
      if (bransFilter) params.set('brans', bransFilter)
      const res = await fetch(`/api/attendance?${params}`)
      const data = await res.json()
      setItems(Array.isArray(data.items) ? data.items : [])
    } catch {
      setItems([])
      setToast({ message: 'Yoklama yüklenemedi', type: 'error' })
    } finally {
      setLoading(false)
    }
  }, [date, bransFilter])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)')
    setIsMobile(mq.matches)
    const h = () => setIsMobile(window.matchMedia('(max-width: 640px)').matches)
    mq.addEventListener('change', h)
    return () => mq.removeEventListener('change', h)
  }, [])

  const handleStatusChange = (studentId: string, status: YoklamaItem['status']) => {
    setItems((prev) =>
      prev.map((i) => (i.student_id === studentId ? { ...i, status } : i))
    )
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const records = items.map((i) => ({
        student_id: i.student_id,
        date,
        status: i.status,
        seans_dustu: i.status === 'katildi',
      }))
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ records }),
      })
      const data = await res.json()
      if (res.ok && data.ok) {
        setToast({ message: 'Yoklama kaydedildi', type: 'success' })
        fetchData()
      } else {
        setToast({ message: data.error ?? 'Kayıt başarısız', type: 'error' })
      }
    } catch {
      setToast({ message: 'Bağlantı hatası', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 4000)
    return () => clearTimeout(t)
  }, [toast])

  return (
    <div className="p-6 space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-foreground">Yoklama</h1>
        <p className="text-muted-foreground">Günlük devam takibi</p>
      </header>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div>
          <label htmlFor="yoklama-date" className="block text-sm font-medium mb-1">
            Tarih
          </label>
          <input
            id="yoklama-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="flex h-10 w-full sm:w-auto rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="yoklama-brans" className="block text-sm font-medium mb-1">
            Branş
          </label>
          <select
            id="yoklama-brans"
            className="flex h-10 w-full sm:w-48 rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={bransFilter}
            onChange={(e) => setBransFilter(e.target.value)}
          >
            {BRANSLAR.map((b) => (
              <option key={b || '_'} value={b}>
                {b || 'Tümü'}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          <YoklamaList items={items} onChange={handleStatusChange} isMobile={isMobile} />
          {items.length > 0 && (
            <Button
              onClick={handleSave}
              disabled={saving}
              className="min-h-[44px] w-full sm:w-auto"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              Toplu Kaydet
            </Button>
          )}
        </>
      )}

      {toast && (
        <div
          className={`fixed bottom-4 right-4 z-50 px-4 py-2 rounded-lg shadow-lg ${
            toast.type === 'success' ? 'bg-green-600/90' : 'bg-destructive/90'
          } text-white`}
        >
          {toast.message}
        </div>
      )}
    </div>
  )
}
