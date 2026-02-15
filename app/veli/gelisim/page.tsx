'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, TrendingUp } from 'lucide-react'

type Child = { id: string; name: string; surname?: string }
type Olcum = { id: string; olcum_tarihi: string; boy?: number; kilo?: number; esneklik?: number; genel_degerlendirme?: string }

export default function VeliGelisimPage() {
  const [children, setChildren] = useState<Child[]>([])
  const [selected, setSelected] = useState('')
  const [items, setItems] = useState<Olcum[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/veli/children')
      .then((r) => r.json())
      .then((d) => {
        const list = d.items ?? []
        setChildren(list)
        if (list.length && !selected) setSelected(list[0].id)
      })
      .catch(() => setChildren([]))
  }, [])

  useEffect(() => {
    if (!selected) {
      setItems([])
      setLoading(false)
      return
    }
    setLoading(true)
    fetch(`/api/veli/gelisim?athlete_id=${selected}`)
      .then((r) => r.json())
      .then((d) => setItems(d.items ?? []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [selected])

  const boyData = items.filter((o) => o.boy != null).map((o) => ({ tarih: o.olcum_tarihi, val: o.boy! })).reverse()
  const kiloData = items.filter((o) => o.kilo != null).map((o) => ({ tarih: o.olcum_tarihi, val: o.kilo! })).reverse()
  const maxVal = Math.max(...boyData.map((d) => d.val), ...kiloData.map((d) => d.val), 1)

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-lg mx-auto space-y-6">
        <Link href="/veli/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Panele dön
        </Link>

        <h1 className="text-2xl font-bold flex items-center gap-2">
          <TrendingUp className="h-7 w-7 text-primary" />
          Gelişim Takibi
        </h1>

        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="w-full rounded-lg border border-input bg-background px-4 py-2"
        >
          <option value="">Çocuk seçin</option>
          {children.map((c) => (
            <option key={c.id} value={c.id}>{c.name} {c.surname ?? ''}</option>
          ))}
        </select>

        {loading ? (
          <p className="text-muted-foreground">Yükleniyor...</p>
        ) : items.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Henüz ölçüm kaydı yok.
            </CardContent>
          </Card>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Boy & Kilo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.slice(0, 8).map((o) => (
                    <div key={o.id} className="flex justify-between border-b pb-2 text-sm">
                      <span>{o.olcum_tarihi}</span>
                      <span>
                        {o.boy != null && `${o.boy} cm`}
                        {o.boy != null && o.kilo != null && ' · '}
                        {o.kilo != null && `${o.kilo} kg`}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Esneklik</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {items.filter((o) => o.esneklik != null).slice(0, 8).map((o) => (
                    <div key={o.id} className="flex justify-between text-sm">
                      <span>{o.olcum_tarihi}</span>
                      <span>{o.esneklik} cm</span>
                    </div>
                  ))}
                  {items.filter((o) => o.esneklik != null).length === 0 && (
                    <p className="text-muted-foreground text-sm">Veri yok</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {items.some((o) => o.genel_degerlendirme) && (
              <Card>
                <CardHeader>
                  <CardTitle>Değerlendirme</CardTitle>
                </CardHeader>
                <CardContent>
                  {items.find((o) => o.genel_degerlendirme)?.genel_degerlendirme}
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  )
}
