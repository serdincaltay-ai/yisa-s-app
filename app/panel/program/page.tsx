'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, Plus, Trash2 } from 'lucide-react'

type ScheduleRow = {
  id: string
  gun: string
  saat: string
  ders_adi: string
  brans: string | null
  antrenor_id?: string | null
}

const GUNLER = ['Pazartesi', 'Sali', 'Carsamba', 'Persembe', 'Cuma', 'Cumartesi', 'Pazar'] as const

const BRANSLAR = [
  'Artistik Cimnastik',
  'Ritmik Cimnastik',
  'Trampolin',
  'Genel Jimnastik',
  'Temel Hareket Eğitimi',
  'Diğer',
]

export default function ProgramPage() {
  const [items, setItems] = useState<ScheduleRow[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ gun: 'Pazartesi', saat: '09:00', ders_adi: '', brans: '' })

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/franchise/schedule')
      const data = await res.json()
      const rows = (data.items ?? []).map((r: Record<string, unknown>) => ({
        id: r.id,
        gun: r.gun ?? '',
        saat: r.saat ?? '',
        ders_adi: r.ders_adi ?? '',
        brans: r.brans ?? null,
        antrenor_id: r.antrenor_id ?? null,
      }))
      setItems(rows)
    } catch {
      setItems([])
      setToast({ message: 'Program yüklenemedi', type: 'error' })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 4000)
    return () => clearTimeout(t)
  }, [toast])

  const handleDersEkle = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/franchise/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gun: form.gun,
          saat: form.saat,
          ders_adi: form.ders_adi || 'Ders',
          brans: form.brans || null,
        }),
      })
      const data = await res.json()
      if (res.ok && data.ok) {
        setToast({ message: 'Ders eklendi', type: 'success' })
        setShowModal(false)
        setForm({ gun: 'Pazartesi', saat: '09:00', ders_adi: '', brans: '' })
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

  const handleDersSil = async (id: string) => {
    if (!confirm('Bu dersi silmek istediğinize emin misiniz?')) return
    try {
      const res = await fetch(`/api/franchise/schedule?id=${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (res.ok && data.ok) {
        setToast({ message: 'Ders silindi', type: 'success' })
        fetchData()
      } else {
        setToast({ message: data.error ?? 'Silme başarısız', type: 'error' })
      }
    } catch {
      setToast({ message: 'Bağlantı hatası', type: 'error' })
    }
  }

  const grid = new Map<string, ScheduleRow>()
  for (const r of items) {
    grid.set(`${r.gun}|${r.saat}`, r)
  }

  const saatler = Array.from(new Set(items.map((r) => r.saat))).sort()

  return (
    <div className="p-6 space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Ders Programı</h1>
          <p className="text-muted-foreground">Haftalık ders programınız</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Ders Ekle
        </Button>
      </header>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="rounded-lg border overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="h-12 px-3 text-left font-medium w-20">Saat</th>
                {GUNLER.map((g) => (
                  <th key={g} className="h-12 px-3 text-left font-medium min-w-[120px]">{g}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {saatler.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-muted-foreground">
                    Henüz ders eklenmemiş. &quot;Ders Ekle&quot; ile başlayın.
                  </td>
                </tr>
              ) : (
                saatler.map((saat) => (
                  <tr key={saat} className="border-b last:border-0 hover:bg-muted/20">
                    <td className="p-3 font-medium text-muted-foreground">{saat}</td>
                    {GUNLER.map((gun) => {
                      const cell = grid.get(`${gun}|${saat}`)
                      return (
                        <td key={gun} className="p-2 align-top">
                          {cell ? (
                            <Card className="border-[#00d4ff]/20">
                              <CardContent className="p-3">
                                <p className="font-medium text-foreground">{cell.ders_adi}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">{cell.brans ?? '—'}</p>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="mt-2 h-8 px-2 text-destructive hover:text-destructive"
                                  onClick={() => handleDersSil(cell.id)}
                                >
                                  <Trash2 className="h-3 w-3 mr-1" />
                                  Sil
                                </Button>
                              </CardContent>
                            </Card>
                          ) : (
                            <span className="text-muted-foreground/50 text-xs">—</span>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="rounded-lg border bg-card p-6 max-w-md w-full shadow-lg">
            <h3 className="text-lg font-semibold">Ders Ekle</h3>
            <form onSubmit={handleDersEkle} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Gün</label>
                <select
                  value={form.gun}
                  onChange={(e) => setForm((f) => ({ ...f, gun: e.target.value }))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  required
                >
                  {GUNLER.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Saat</label>
                <input
                  type="time"
                  value={form.saat}
                  onChange={(e) => setForm((f) => ({ ...f, saat: e.target.value }))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Ders Adı</label>
                <input
                  type="text"
                  value={form.ders_adi}
                  onChange={(e) => setForm((f) => ({ ...f, ders_adi: e.target.value }))}
                  placeholder="Örn: Başlangıç Grubu"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Branş</label>
                <select
                  value={form.brans}
                  onChange={(e) => setForm((f) => ({ ...f, brans: e.target.value }))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Seçiniz</option>
                  {BRANSLAR.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                  İptal
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  Kaydet
                </Button>
              </div>
            </form>
          </div>
        </div>
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
