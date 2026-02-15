'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, Banknote, Clock, AlertCircle } from 'lucide-react'

type AidatRow = {
  id: string
  athlete_id: string
  athlete_name: string
  amount: number
  payment_type: string
  period_month: number | null
  period_year: number | null
  due_date: string | null
  paid_date: string | null
  status: string
  payment_method: string | null
}

const AYLAR = [
  { value: '', label: 'Tüm Aylar' },
  { value: '1', label: 'Ocak' }, { value: '2', label: 'Şubat' }, { value: '3', label: 'Mart' },
  { value: '4', label: 'Nisan' }, { value: '5', label: 'Mayıs' }, { value: '6', label: 'Haziran' },
  { value: '7', label: 'Temmuz' }, { value: '8', label: 'Ağustos' }, { value: '9', label: 'Eylül' },
  { value: '10', label: 'Ekim' }, { value: '11', label: 'Kasım' }, { value: '12', label: 'Aralık' },
]

function formatDate(s: string | null): string {
  if (!s) return '—'
  try {
    return new Date(s).toLocaleDateString('tr-TR')
  } catch {
    return s
  }
}

function formatTL(n: number): string {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(n)
}

function donemLabel(month: number | null, year: number | null): string {
  if (!month || !year) return '—'
  const ay = AYLAR.find((a) => a.value === String(month))?.label ?? String(month)
  return `${ay} ${year}`
}

export default function AidatPage() {
  const [items, setItems] = useState<AidatRow[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [ayFilter, setAyFilter] = useState('')
  const [yilFilter, setYilFilter] = useState(String(new Date().getFullYear()))
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [odemeModal, setOdemeModal] = useState<AidatRow | null>(null)
  const [saving, setSaving] = useState(false)
  const [odemeTarih, setOdemeTarih] = useState(new Date().toISOString().slice(0, 10))
  const [odemeYontem, setOdemeYontem] = useState('nakit')

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter) params.set('status', statusFilter)
      if (ayFilter) params.set('period_month', ayFilter)
      if (yilFilter) params.set('period_year', yilFilter)
      const res = await fetch(`/api/franchise/payments?${params}`)
      const data = await res.json()
      const rows = (data.items ?? []).map((r: Record<string, unknown>) => ({
        id: r.id,
        athlete_id: r.athlete_id,
        athlete_name: r.athlete_name ?? '—',
        amount: Number(r.amount) || 0,
        payment_type: r.payment_type ?? '',
        period_month: r.period_month ?? null,
        period_year: r.period_year ?? null,
        due_date: r.due_date ?? null,
        paid_date: r.paid_date ?? null,
        status: r.status ?? 'pending',
        payment_method: r.payment_method ?? null,
      }))
      setItems(rows)
    } catch {
      setItems([])
      setToast({ message: 'Liste yüklenemedi', type: 'error' })
    } finally {
      setLoading(false)
    }
  }, [statusFilter, ayFilter, yilFilter])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 4000)
    return () => clearTimeout(t)
  }, [toast])

  const toplamTahsilat = items.filter((i) => i.status === 'paid').reduce((s, i) => s + i.amount, 0)
  const bekleyenToplam = items.filter((i) => i.status === 'pending').reduce((s, i) => s + i.amount, 0)
  const bekleyenAdet = items.filter((i) => i.status === 'pending').length
  const gecikenToplam = items.filter((i) => i.status === 'overdue').reduce((s, i) => s + i.amount, 0)
  const gecikenAdet = items.filter((i) => i.status === 'overdue').length

  const handleOdemeKaydet = async () => {
    if (!odemeModal) return
    setSaving(true)
    try {
      const res = await fetch('/api/franchise/payments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: odemeModal.id,
          status: 'paid',
          paid_date: odemeTarih,
          payment_method: odemeYontem,
        }),
      })
      const data = await res.json()
      if (res.ok && data.ok) {
        setToast({ message: 'Ödeme kaydedildi', type: 'success' })
        setOdemeModal(null)
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

  const durumBadge = (s: string) => {
    if (s === 'paid') return <Badge style={{ backgroundColor: '#00d4ff33', color: '#00d4ff' }}>Ödendi</Badge>
    if (s === 'pending') return <Badge style={{ backgroundColor: '#ffa50033', color: '#ffa500' }}>Bekleyen</Badge>
    if (s === 'overdue') return <Badge style={{ backgroundColor: '#e9456033', color: '#e94560' }}>Gecikmiş</Badge>
    if (s === 'cancelled') return <Badge variant="secondary">İptal</Badge>
    return <Badge variant="secondary">{s}</Badge>
  }

  return (
    <div className="p-6 space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Aidat Takibi</h1>
          <p className="text-muted-foreground">Ödeme durumlarını yönetin</p>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-[#00d4ff]/30">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#00d4ff]/20">
              <Banknote className="h-6 w-6 text-[#00d4ff]" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Toplam Tahsilat</p>
              <p className="text-xl font-bold text-[#00d4ff]">{formatTL(toplamTahsilat)}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#ffa500]/30">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#ffa500]/20">
              <Clock className="h-6 w-6 text-[#ffa500]" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Bekleyen</p>
              <p className="text-xl font-bold text-[#ffa500]">
                {formatTL(bekleyenToplam)} ({bekleyenAdet} kayıt)
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#e94560]/30">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#e94560]/20">
              <AlertCircle className="h-6 w-6 text-[#e94560]" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Geciken</p>
              <p className="text-xl font-bold text-[#e94560]">
                {formatTL(gecikenToplam)} ({gecikenAdet} kayıt)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center flex-wrap">
        <select
          className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Tüm Durumlar</option>
          <option value="paid">Ödendi</option>
          <option value="pending">Bekleyen</option>
          <option value="overdue">Gecikmiş</option>
          <option value="cancelled">İptal</option>
        </select>
        <select
          className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={ayFilter}
          onChange={(e) => setAyFilter(e.target.value)}
        >
          {AYLAR.map((a) => (
            <option key={a.value || '_'} value={a.value}>{a.label}</option>
          ))}
        </select>
        <select
          className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={yilFilter}
          onChange={(e) => setYilFilter(e.target.value)}
        >
          {[2026, 2025, 2024].map((y) => (
            <option key={y} value={String(y)}>{y}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="rounded-lg border overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="h-12 px-4 text-left font-medium">Öğrenci Adı</th>
                <th className="h-12 px-4 text-left font-medium">Dönem</th>
                <th className="h-12 px-4 text-right font-medium">Tutar</th>
                <th className="h-12 px-4 text-left font-medium">Vade</th>
                <th className="h-12 px-4 text-left font-medium">Ödeme Tarihi</th>
                <th className="h-12 px-4 text-left font-medium">Durum</th>
                <th className="h-12 px-4 text-left font-medium w-28">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {items.map((r) => (
                <tr key={r.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="p-4 font-medium">{r.athlete_name}</td>
                  <td className="p-4">{donemLabel(r.period_month, r.period_year)}</td>
                  <td className="p-4 text-right">{formatTL(r.amount)}</td>
                  <td className="p-4">{formatDate(r.due_date)}</td>
                  <td className="p-4">{formatDate(r.paid_date)}</td>
                  <td className="p-4">{durumBadge(r.status)}</td>
                  <td className="p-2">
                    {(r.status === 'pending' || r.status === 'overdue') && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setOdemeModal(r)
                          setOdemeTarih(new Date().toISOString().slice(0, 10))
                          setOdemeYontem('nakit')
                        }}
                      >
                        Ödeme Kaydet
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 && (
            <p className="text-center py-8 text-muted-foreground">Kayıt bulunamadı</p>
          )}
        </div>
      )}

      {odemeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="rounded-lg border bg-card p-6 max-w-md w-full shadow-lg">
            <h3 className="text-lg font-semibold">Ödeme Kaydet</h3>
            <p className="text-muted-foreground mt-1">{odemeModal.athlete_name} — {formatTL(odemeModal.amount)}</p>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Ödeme Tarihi</label>
                <input
                  type="date"
                  value={odemeTarih}
                  onChange={(e) => setOdemeTarih(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Ödeme Yöntemi</label>
                <select
                  value={odemeYontem}
                  onChange={(e) => setOdemeYontem(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="nakit">Nakit</option>
                  <option value="kart">Kredi Kartı</option>
                  <option value="havale">Havale</option>
                  <option value="eft">EFT</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-6 justify-end">
              <Button variant="outline" onClick={() => setOdemeModal(null)}>İptal</Button>
              <Button onClick={handleOdemeKaydet} disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                Kaydet
              </Button>
            </div>
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
