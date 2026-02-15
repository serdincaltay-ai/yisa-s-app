'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, Calendar, CheckCircle, XCircle, Activity } from 'lucide-react'

type BugunDers = { id: string; gun: string; saat: string; ders_adi: string; brans?: string }
type YoklamaOzet = { tarih: string; geldi: number; gelmedi: number }

export default function AntrenorDashboard() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<{
    bugunDersleri: BugunDers[]
    sporcuSayisi: number
    sonYoklamalar: YoklamaOzet[]
    bugunTarih: string
  } | null>(null)

  useEffect(() => {
    fetch('/api/antrenor/dashboard')
      .then((r) => r.json())
      .then((d) => {
        setData({
          bugunDersleri: d.bugunDersleri ?? [],
          sporcuSayisi: d.sporcuSayisi ?? 0,
          sonYoklamalar: d.sonYoklamalar ?? [],
          bugunTarih: d.bugunTarih ?? '',
        })
      })
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <span className="text-muted-foreground">Yükleniyor...</span>
      </div>
    )
  }

  const d = data ?? { bugunDersleri: [], sporcuSayisi: 0, sonYoklamalar: [], bugunTarih: '' }

  return (
    <div className="p-6 space-y-6">
      <div className="rounded-lg bg-primary/15 border border-primary/30 p-4">
        <p className="text-sm text-muted-foreground">Hoş geldiniz</p>
        <h1 className="text-xl font-bold">Antrenör Paneli</h1>
        <p className="text-sm text-muted-foreground">
          Bugün {d.bugunDersleri.length} ders, {d.sporcuSayisi} sporcu
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-5 w-5 text-primary" />
              Atanan Sporcu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{d.sporcuSayisi}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="h-5 w-5 text-primary" />
              Bugünün Dersleri
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{d.bugunDersleri.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="h-5 w-5 text-primary" />
              Son Yoklamalar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{d.sonYoklamalar.length} gün</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Bugünün Programı
          </CardTitle>
          <CardDescription>{d.bugunTarih}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {d.bugunDersleri.length === 0 ? (
            <p className="text-muted-foreground text-sm">Bugün ders yok.</p>
          ) : (
            d.bugunDersleri.map((ders) => (
              <div
                key={ders.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div>
                  <p className="font-medium">{ders.ders_adi}</p>
                  <p className="text-xs text-muted-foreground">
                    {ders.saat} {ders.brans ? `• ${ders.brans}` : ''}
                  </p>
                </div>
                <Badge variant="outline">Ders</Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Son Yoklamalar Özeti</CardTitle>
          <CardDescription>Son günlerin geldi / gelmedi sayıları</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {d.sonYoklamalar.length === 0 ? (
            <p className="text-muted-foreground text-sm">Henüz yoklama yok.</p>
          ) : (
            d.sonYoklamalar.map((y) => (
              <div
                key={y.tarih}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <span className="text-sm font-medium">{y.tarih}</span>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                    <CheckCircle className="h-4 w-4" />
                    {y.geldi}
                  </span>
                  <span className="flex items-center gap-1 text-red-600 dark:text-red-400">
                    <XCircle className="h-4 w-4" />
                    {y.gelmedi}
                  </span>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
