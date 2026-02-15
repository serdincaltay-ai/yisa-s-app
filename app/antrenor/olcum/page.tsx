'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

type Sporcu = { id: string; name: string; surname?: string; birth_date?: string; gender?: string }

export default function AntrenorOlcumPage() {
  const [sporcular, setSporcular] = useState<Sporcu[]>([])
  const [selected, setSelected] = useState('')
  const [form, setForm] = useState<Record<string, string | number>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [sonuc, setSonuc] = useState<{ analiz?: Array<{ parametre: string; deger: number; seviye: string }>; bransOnerileri?: string[] } | null>(null)

  useEffect(() => {
    fetch('/api/antrenor/olcum')
      .then((r) => r.json())
      .then((d) => setSporcular(d.sporcular ?? []))
      .catch(() => setSporcular([]))
      .finally(() => setLoading(false))
  }, [])

  const handleKaydet = async () => {
    if (!selected) return
    setSaving(true)
    setSonuc(null)
    try {
      const res = await fetch('/api/antrenor/olcum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          athlete_id: selected,
          olcum_tarihi: new Date().toISOString().slice(0, 10),
          ...form,
        }),
      })
      const j = await res.json()
      if (res.ok && j.ok) {
        setSonuc({ analiz: j.analiz ?? [], bransOnerileri: j.bransOnerileri ?? [] })
        setForm({})
      } else {
        alert(j.error ?? 'Kaydetme başarısız')
      }
    } catch {
      alert('Kaydetme başarısız')
    } finally {
      setSaving(false)
    }
  }

  const alanlar = [
    { key: 'boy', label: 'Boy (cm)', type: 'number' },
    { key: 'kilo', label: 'Kilo (kg)', type: 'number' },
    { key: 'esneklik', label: 'Esneklik (cm)', type: 'number' },
    { key: 'dikey_sicrama', label: 'Dikey Sıçrama (cm)', type: 'number' },
    { key: 'sure_20m', label: '20m Sprint (sn)', type: 'number' },
    { key: 'denge', label: 'Denge (sn)', type: 'number' },
    { key: 'koordinasyon', label: 'Koordinasyon (puan)', type: 'number' },
    { key: 'kuvvet', label: 'Kuvvet (puan)', type: 'number' },
    { key: 'dayaniklilik', label: 'Dayanıklılık (puan)', type: 'number' },
  ]

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Ölçüm Girişi</h1>

      <Card>
        <CardHeader>
          <CardTitle>Sporcu Seçimi</CardTitle>
          <CardDescription>Ölçüm yapılacak sporcuyu seçin</CardDescription>
        </CardHeader>
        <CardContent>
          <select
            value={selected}
            onChange={(e) => { setSelected(e.target.value); setSonuc(null) }}
            className="w-full max-w-md rounded-lg border border-input bg-background px-4 py-2"
          >
            <option value="">Sporcu seçin</option>
            {sporcular.map((s) => (
              <option key={s.id} value={s.id}>{s.name} {s.surname ?? ''}</option>
            ))}
          </select>
        </CardContent>
      </Card>

      {selected && (
        <Card>
          <CardHeader>
            <CardTitle>Ölçüm Değerleri</CardTitle>
            <CardDescription>Tüm parametreleri girin (opsiyonel alanlar boş bırakılabilir)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {alanlar.map((a) => (
                <div key={a.key}>
                  <label className="text-sm font-medium">{a.label}</label>
                  <input
                    type={a.type}
                    value={form[a.key] ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, [a.key]: e.target.value }))}
                    className="mt-1 w-full rounded border border-input bg-background px-3 py-2"
                  />
                </div>
              ))}
            </div>
            <div>
              <label className="text-sm font-medium">Postür Notu</label>
              <textarea value={form.postur_notu ?? ''} onChange={(e) => setForm((f) => ({ ...f, postur_notu: e.target.value }))} className="mt-1 w-full rounded border border-input bg-background px-3 py-2" rows={2} />
            </div>
            <div>
              <label className="text-sm font-medium">Genel Değerlendirme</label>
              <textarea value={form.genel_degerlendirme ?? ''} onChange={(e) => setForm((f) => ({ ...f, genel_degerlendirme: e.target.value }))} className="mt-1 w-full rounded border border-input bg-background px-3 py-2" rows={2} />
            </div>
            <Button onClick={handleKaydet} disabled={saving}>Kaydet</Button>
          </CardContent>
        </Card>
      )}

      {sonuc && (
        <Card>
          <CardHeader>
            <CardTitle>Analiz Sonucu</CardTitle>
            <CardDescription>Referans değerlerle karşılaştırma</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {sonuc.analiz && sonuc.analiz.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {sonuc.analiz.map((a) => (
                  <Badge key={a.parametre} variant="outline">
                    {a.parametre}: {a.deger} — {a.seviye}
                  </Badge>
                ))}
              </div>
            )}
            {sonuc.bransOnerileri && sonuc.bransOnerileri.length > 0 && (
              <div>
                <p className="font-medium mb-2">Branş Uygunluk Önerisi</p>
                <p className="text-sm text-muted-foreground">{sonuc.bransOnerileri.join(', ')}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {loading && <p className="text-muted-foreground">Yükleniyor...</p>}
    </div>
  )
}
