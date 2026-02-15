'use client'

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'

type Athlete = { id: string; name: string | null; surname: string | null }
type Package = { id: string; name: string; seans_count: number; price: number; max_taksit: number }

type PaketSatModalProps = {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  athletes: Athlete[]
  packages: Package[]
}

export function PaketSatModal({ open, onClose, onSuccess, athletes, packages }: PaketSatModalProps) {
  const [athleteId, setAthleteId] = useState('')
  const [packageId, setPackageId] = useState('')
  const [taksitSayisi, setTaksitSayisi] = useState(1)
  const [baslangicTarihi, setBaslangicTarihi] = useState(() => new Date().toISOString().slice(0, 10))
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const selectedPackage = packages.find((p) => p.id === packageId)
  const maxTaksit = selectedPackage?.max_taksit ?? 1

  useEffect(() => {
    if (open) {
      setAthleteId('')
      setPackageId('')
      setTaksitSayisi(1)
      setBaslangicTarihi(new Date().toISOString().slice(0, 10))
      setError(null)
    }
  }, [open])

  useEffect(() => {
    if (packageId && selectedPackage) {
      setTaksitSayisi(Math.min(taksitSayisi, selectedPackage.max_taksit))
    }
  }, [packageId, selectedPackage?.max_taksit])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!athleteId || !packageId) {
      setError('Öğrenci ve paket seçiniz')
      return
    }
    setSending(true)
    try {
      const res = await fetch('/api/student-packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          athlete_id: athleteId,
          package_id: packageId,
          taksit_sayisi: taksitSayisi,
          baslangic_tarihi: baslangicTarihi,
        }),
      })
      const data = await res.json()
      if (res.ok && data.ok) {
        onSuccess()
        onClose()
      } else {
        setError(data.error ?? 'İşlem başarısız')
      }
    } catch {
      setError('Bağlantı hatası')
    } finally {
      setSending(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <div className="rounded-lg border bg-card p-6 max-w-md w-full shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Paket Sat</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Öğrenci *</Label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
              value={athleteId}
              onChange={(e) => setAthleteId(e.target.value)}
              required
            >
              <option value="">Seçiniz</option>
              {athletes.map((a) => (
                <option key={a.id} value={a.id}>{[a.name, a.surname].filter(Boolean).join(' ').trim() || '—'}</option>
              ))}
            </select>
          </div>
          <div>
            <Label>Paket *</Label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
              value={packageId}
              onChange={(e) => setPackageId(e.target.value)}
              required
            >
              <option value="">Seçiniz</option>
              {packages.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — {p.seans_count} seans, {p.price.toLocaleString('tr-TR')} TL
                </option>
              ))}
            </select>
          </div>
          {selectedPackage && (
            <p className="text-sm text-muted-foreground">
              {selectedPackage.price.toLocaleString('tr-TR')} TL ÷ {maxTaksit} taksit = {(selectedPackage.price / Math.min(taksitSayisi, maxTaksit)).toLocaleString('tr-TR')} TL / taksit
            </p>
          )}
          <div>
            <Label>Taksit (1–{maxTaksit})</Label>
            <Input
              type="number"
              min={1}
              max={maxTaksit}
              value={taksitSayisi}
              onChange={(e) => setTaksitSayisi(Math.max(1, Math.min(maxTaksit, parseInt(e.target.value, 10) || 1)))}
            />
          </div>
          <div>
            <Label>Başlangıç Tarihi</Label>
            <Input
              type="date"
              value={baslangicTarihi}
              onChange={(e) => setBaslangicTarihi(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={sending}>
              {sending && <Loader2 className="h-4 w-4 animate-spin" />}
              Kaydet
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
