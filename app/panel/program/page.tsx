'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, Calendar, CheckCircle2, X } from 'lucide-react'
import { BRANS_RENK, DEFAULT_BRANS_RENK } from '@/lib/tenant-template-config'

type ScheduleRow = {
  id: string
  gun: string
  saat: string
  ders_adi: string
  brans: string | null
  seviye: string | null
  antrenor_id?: string | null
}

const GUNLER = ['Pazartesi', 'Sali', 'Carsamba', 'Persembe', 'Cuma', 'Cumartesi', 'Pazar'] as const
const SAATLER = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00']
const BRANS_LIST = Object.keys(BRANS_RENK)

type CellEdit = { gun: string; saat: string; brans: string; seviye: string; ders_adi: string }

export default function ProgramPage() {
  const [items, setItems] = useState<ScheduleRow[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [editingCell, setEditingCell] = useState<string | null>(null)
  const [cellForm, setCellForm] = useState<CellEdit>({ gun: '', saat: '', brans: '', seviye: '', ders_adi: '' })
  const [draft, setDraft] = useState<ScheduleRow[]>([])
  const [saving, setSaving] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/franchise/schedule')
      const data = await res.json()
      const rows: ScheduleRow[] = (data.items ?? []).map((r: Record<string, unknown>) => ({
        id: String(r.id ?? ''),
        gun: String(r.gun ?? ''),
        saat: String(r.saat ?? ''),
        ders_adi: String(r.ders_adi ?? ''),
        brans: typeof r.brans === 'string' ? r.brans : null,
        seviye: typeof r.seviye === 'string' ? r.seviye : null,
        antrenor_id: typeof r.antrenor_id === 'string' ? r.antrenor_id : null,
      }))
      setItems(rows)
      setDraft(rows)
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

  const cellKey = (gun: string, saat: string) => `${gun}-${saat}`
  const getSlot = (list: ScheduleRow[], gun: string, saat: string) =>
    list.find((i) => i.gun === gun && i.saat === saat)

  const bransColor = (brans: string | null | undefined) => {
    if (!brans) return DEFAULT_BRANS_RENK
    return BRANS_RENK[brans] ?? DEFAULT_BRANS_RENK
  }

  const handleCellClick = (gun: string, saat: string) => {
    if (!editMode) return
    const key = cellKey(gun, saat)
    if (editingCell === key) { setEditingCell(null); return }
    const existing = getSlot(draft, gun, saat)
    setCellForm({
      gun,
      saat,
      brans: existing?.brans ?? '',
      seviye: existing?.seviye ?? '',
      ders_adi: existing?.ders_adi ?? '',
    })
    setEditingCell(key)
  }

  const handleCellSave = () => {
    if (!cellForm.brans && !cellForm.ders_adi) {
      setDraft((prev) => prev.filter((i) => !(i.gun === cellForm.gun && i.saat === cellForm.saat)))
    } else {
      setDraft((prev) => {
        const existing = prev.find((i) => i.gun === cellForm.gun && i.saat === cellForm.saat)
        const filtered = prev.filter((i) => !(i.gun === cellForm.gun && i.saat === cellForm.saat))
        return [
          ...filtered,
          {
            id: existing?.id ?? '',
            gun: cellForm.gun,
            saat: cellForm.saat,
            ders_adi: cellForm.ders_adi || cellForm.brans,
            brans: cellForm.brans || null,
            seviye: cellForm.seviye || null,
            antrenor_id: existing?.antrenor_id ?? null,
          },
        ]
      })
    }
    setEditingCell(null)
  }

  const handleCellClear = () => {
    setDraft((prev) => prev.filter((i) => !(i.gun === cellForm.gun && i.saat === cellForm.saat)))
    setEditingCell(null)
  }

  const handleSaveAll = async () => {
    if (saving) return
    setSaving(true)
    try {
      const payload = draft.map((item) => ({
        gun: item.gun,
        saat: item.saat,
        ders_adi: item.ders_adi,
        brans: item.brans ?? null,
        seviye: item.seviye ?? null,
        antrenor_id: item.antrenor_id ?? null,
      }))
      const res = await fetch('/api/franchise/schedule', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: payload }),
      })
      const data = await res.json()
      if (data?.ok) {
        setEditMode(false)
        setEditingCell(null)
        setToast({ message: `Program kaydedildi (${data.count} ders)`, type: 'success' })
        fetchData()
      } else {
        setToast({ message: data?.error ?? 'Kayıt başarısız', type: 'error' })
      }
    } catch {
      setToast({ message: 'Bağlantı hatası', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setEditMode(false)
    setEditingCell(null)
    setDraft(items)
  }

  const handleEnterEdit = () => {
    setDraft(items)
    setEditMode(true)
  }

  const displayItems = editMode ? draft : items

  return (
    <div className="p-6 space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Ders Programı</h1>
          <p className="text-muted-foreground">
            {editMode ? 'Hücreye tıklayarak ders ekleyin veya düzenleyin' : 'Haftalık ders programınız'}
          </p>
        </div>
        <div className="flex gap-2">
          {editMode ? (
            <>
              <Button variant="outline" onClick={handleCancel} disabled={saving}>
                <X className="h-4 w-4 mr-2" />
                İptal
              </Button>
              <Button onClick={handleSaveAll} disabled={saving}>
                {saving ? (
                  <><Loader2 className="h-4 w-4 animate-spin mr-2" />Kaydediliyor…</>
                ) : (
                  <><CheckCircle2 className="h-4 w-4 mr-2" />Kaydet</>
                )}
              </Button>
            </>
          ) : (
            <Button onClick={handleEnterEdit}>
              <Calendar className="h-4 w-4 mr-2" />
              Düzenle
            </Button>
          )}
        </div>
      </header>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <Card>
          <CardContent className="overflow-x-auto p-4">
            <div className="min-w-[900px]">
              <div className="grid gap-1" style={{ gridTemplateColumns: `80px repeat(${GUNLER.length}, 1fr)` }}>
                <div className="p-2" />
                {GUNLER.map((day) => (
                  <div key={day} className="rounded-lg bg-muted p-2 text-center font-medium text-foreground text-sm">{day}</div>
                ))}
                {SAATLER.map((hour) => (
                  <React.Fragment key={hour}>
                    <div className="flex items-center justify-center p-2 text-sm text-muted-foreground font-mono">{hour}</div>
                    {GUNLER.map((day) => {
                      const slot = getSlot(displayItems, day, hour)
                      const key = cellKey(day, hour)
                      const isEditing = editingCell === key
                      const colors = bransColor(slot?.brans)

                      if (isEditing) {
                        return (
                          <div key={key} className="rounded-lg border-2 border-primary p-2 text-xs min-h-[80px] flex flex-col gap-1 bg-muted/50">
                            <select
                              className="w-full rounded border border-input bg-background px-1 py-0.5 text-xs"
                              value={cellForm.brans}
                              onChange={(e) => setCellForm({ ...cellForm, brans: e.target.value, ders_adi: e.target.value || cellForm.ders_adi })}
                            >
                              <option value="">Branş seç…</option>
                              {BRANS_LIST.map((b) => (
                                <option key={b} value={b}>{b}</option>
                              ))}
                            </select>
                            <input
                              className="w-full rounded border border-input bg-background px-1 py-0.5 text-xs"
                              placeholder="Seviye"
                              value={cellForm.seviye}
                              onChange={(e) => setCellForm({ ...cellForm, seviye: e.target.value })}
                            />
                            <input
                              className="w-full rounded border border-input bg-background px-1 py-0.5 text-xs"
                              placeholder="Ders adı"
                              value={cellForm.ders_adi}
                              onChange={(e) => setCellForm({ ...cellForm, ders_adi: e.target.value })}
                            />
                            <div className="flex gap-1 mt-0.5">
                              <button type="button" onClick={handleCellSave} className="flex-1 rounded bg-primary px-1 py-0.5 text-primary-foreground text-[10px] hover:bg-primary/90">Tamam</button>
                              <button type="button" onClick={handleCellClear} className="flex-1 rounded bg-destructive px-1 py-0.5 text-destructive-foreground text-[10px] hover:bg-destructive/90">Temizle</button>
                            </div>
                          </div>
                        )
                      }

                      return (
                        <div
                          key={key}
                          onClick={() => handleCellClick(day, hour)}
                          className={`rounded-lg border p-2 text-center text-xs min-h-[48px] flex flex-col items-center justify-center gap-0.5 transition-colors ${
                            editMode ? 'cursor-pointer hover:border-primary hover:bg-muted/30' : ''
                          } ${slot ? `${colors.bg} ${colors.border}` : 'border-[hsl(var(--border))]'}`}
                        >
                          {slot ? (
                            <>
                              <span className={`font-medium truncate w-full ${colors.text}`}>{slot.brans || slot.ders_adi}</span>
                              {slot.seviye && <span className="text-muted-foreground truncate w-full text-[10px]">{slot.seviye}</span>}
                              {slot.ders_adi && slot.brans && slot.ders_adi !== slot.brans && (
                                <span className="text-muted-foreground truncate w-full text-[10px]">{slot.ders_adi}</span>
                              )}
                            </>
                          ) : (
                            <span className="text-muted-foreground">{editMode ? '+' : '—'}</span>
                          )}
                        </div>
                      )
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
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
