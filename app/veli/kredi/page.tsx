'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Coins, AlertTriangle } from 'lucide-react'

type Paket = { isim: string; saat: number; fiyat: number }
type Child = { id: string; name: string; surname?: string; ders_kredisi?: number; toplam_kredi?: number }

export default function VeliKrediPage() {
  const [packages, setPackages] = useState<Paket[]>([])
  const [children, setChildren] = useState<Child[]>([])
  const [selectedChild, setSelectedChild] = useState('')
  const [selectedPaket, setSelectedPaket] = useState(-1)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/veli/kredi')
      .then((r) => r.json())
      .then((d) => {
        setPackages(d.packages ?? [])
        setChildren(d.children ?? [])
        if (d.children?.length && !selectedChild) setSelectedChild(d.children[0].id)
      })
      .catch(() => {
        setPackages([])
        setChildren([])
      })
      .finally(() => setLoading(false))
  }, [])

  const handleSatınAl = async () => {
    if (!selectedChild || selectedPaket < 0) return
    setSaving(true)
    try {
      const res = await fetch('/api/veli/kredi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ athlete_id: selectedChild, paket_index: selectedPaket, odeme_yontemi: 'nakit' }),
      })
      const j = await res.json()
      if (res.ok && j.ok) {
        setChildren((prev) => prev.map((c) => (c.id === selectedChild ? { ...c, ders_kredisi: j.ders_kredisi } : c)))
      } else {
        alert(j.error ?? 'İşlem başarısız')
      }
    } catch {
      alert('İşlem başarısız')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <span className="text-muted-foreground">Yükleniyor...</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-lg mx-auto space-y-6">
        <Link href="/veli/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Veli paneline dön
        </Link>

        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Coins className="h-7 w-7 text-primary" />
          Kredi Satın Al
        </h1>

        <Card>
          <CardHeader>
            <CardTitle>Çocuk Seçin</CardTitle>
            <CardDescription>Hangi çocuk için kredi alacaksınız?</CardDescription>
          </CardHeader>
          <CardContent>
            <select
              value={selectedChild}
              onChange={(e) => setSelectedChild(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-4 py-2"
            >
              <option value="">Seçin</option>
              {children.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.surname ?? ''} — Kalan: {(c.ders_kredisi ?? 0)} ders
                </option>
              ))}
            </select>
          </CardContent>
        </Card>

        {packages.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Henüz kredi paketi tanımlanmamış. Tesisinizle iletişime geçin.
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Paket Seçin</CardTitle>
              <CardDescription>Ders kredisi paketleri</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {packages.map((p, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedPaket(i)}
                  className={`flex items-center justify-between rounded-lg border p-4 cursor-pointer transition-colors ${
                    selectedPaket === i ? 'border-primary bg-primary/10' : 'hover:bg-muted/50'
                  }`}
                >
                  <div>
                    <p className="font-medium">{p.isim}</p>
                    <p className="text-sm text-muted-foreground">{p.saat} ders hakkı</p>
                  </div>
                  <p className="font-bold">{p.fiyat.toLocaleString('tr-TR')} ₺</p>
                </div>
              ))}
              <Button onClick={handleSatınAl} disabled={saving || !selectedChild || selectedPaket < 0} className="w-full mt-4">
                {saving ? 'İşleniyor...' : 'Satın Al'}
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="flex items-start gap-3 rounded-lg bg-amber-500/10 border border-amber-500/30 p-3">
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
          <p className="text-sm">
            Kredi bittiğinde yeni paket almanız gerekir. Antrenör yoklamada &quot;Geldi&quot; işaretlendiğinde 1 ders hakkı düşer.
          </p>
        </div>
      </div>
    </div>
  )
}
