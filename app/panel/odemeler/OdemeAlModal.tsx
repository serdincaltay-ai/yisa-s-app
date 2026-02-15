'use client'

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import type { OdemeRow } from './OdemeTable'

type OdemeAlModalProps = {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  payment: OdemeRow | null
}

const ODEME_YONTEMLERI = [
  { value: 'nakit', label: 'Nakit' },
  { value: 'havale', label: 'Havale' },
  { value: 'kredi_karti', label: 'Kredi Kartı' },
  { value: 'diger', label: 'Diğer' },
]

export function OdemeAlModal({ open, onClose, onSuccess, payment }: OdemeAlModalProps) {
  const [tutar, setTutar] = useState('')
  const [tarih, setTarih] = useState(() => new Date().toISOString().slice(0, 10))
  const [yontem, setYontem] = useState('nakit')
  const [makbuzNo, setMakbuzNo] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open && payment) {
      setTutar(String(payment.amount))
      setTarih(new Date().toISOString().slice(0, 10))
      setYontem('nakit')
      setMakbuzNo('')
      setError(null)
    }
  }, [open, payment])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!payment) return
    setSending(true)
    try {
      const res = await fetch(`/api/payments/${payment.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'odendi',
          payment_date: tarih,
          payment_method: yontem,
          receipt_no: makbuzNo || undefined,
        }),
      })
      if (res.ok) {
        onSuccess()
        onClose()
      } else {
        const data = await res.json()
        setError(data.error ?? 'İşlem başarısız')
      }
    } catch {
      setError('Bağlantı hatası')
    } finally {
      setSending(false)
    }
  }

  if (!open || !payment) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <div className="rounded-lg border bg-card p-6 max-w-md w-full shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Ödeme Al</h3>
        <p className="text-sm text-muted-foreground mb-4">
          {payment.ad_soyad ?? '—'} — {payment.amount.toLocaleString('tr-TR')} TL
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Tutar (TL)</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={tutar}
              onChange={(e) => setTutar(e.target.value)}
              required
            />
          </div>
          <div>
            <Label>Ödeme Tarihi</Label>
            <Input
              type="date"
              value={tarih}
              onChange={(e) => setTarih(e.target.value)}
            />
          </div>
          <div>
            <Label>Ödeme Yöntemi</Label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
              value={yontem}
              onChange={(e) => setYontem(e.target.value)}
            >
              {ODEME_YONTEMLERI.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div>
            <Label>Makbuz No (opsiyonel)</Label>
            <Input
              value={makbuzNo}
              onChange={(e) => setMakbuzNo(e.target.value)}
              placeholder="Makbuz numarası"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={sending}>
              {sending && <Loader2 className="h-4 w-4 animate-spin" />}
              Ödemeyi Kaydet
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              İptal
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
