'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Users, Calendar, CheckCircle, XCircle, Activity, ClipboardCheck, Ruler, TrendingUp } from 'lucide-react'

type BugunDers = { id: string; gun: string; saat: string; ders_adi: string; brans?: string }
type YoklamaOzet = { tarih: string; geldi: number; gelmedi: number }

export default function AntrenorDashboard() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<{
    bugunDersleri: BugunDers[]
    sporcuSayisi: number
    sonYoklamalar: YoklamaOzet[]
    bugunTarih: string
    haftalikDersSayisi?: number
    toplamYoklama?: number
    devamOrani?: number
  } | null>(null)

  useEffect(() => {
    fetch('/api/antrenor/dashboard')
      .then((r) => r.json())
      .then((d) => {
        const yoklamalar: YoklamaOzet[] = d.sonYoklamalar ?? []
        const toplamGeldi = yoklamalar.reduce((s: number, y: YoklamaOzet) => s + y.geldi, 0)
        const toplamHepsi = yoklamalar.reduce((s: number, y: YoklamaOzet) => s + y.geldi + y.gelmedi, 0)
        setData({
          bugunDersleri: d.bugunDersleri ?? [],
          sporcuSayisi: d.sporcuSayisi ?? 0,
          sonYoklamalar: yoklamalar,
          bugunTarih: d.bugunTarih ?? '',
          haftalikDersSayisi: d.haftalikDersSayisi ?? 0,
          toplamYoklama: toplamHepsi,
          devamOrani: toplamHepsi > 0 ? Math.round((toplamGeldi / toplamHepsi) * 100) : 0,
        })
      })
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <span className="text-muted-foreground">Yukleniyor...</span>
      </div>
    )
  }

  const d = data ?? { bugunDersleri: [], sporcuSayisi: 0, sonYoklamalar: [], bugunTarih: '', haftalikDersSayisi: 0, toplamYoklama: 0, devamOrani: 0 }

  return (
    <div className="p-6 space-y-6">
      <div className="rounded-lg bg-primary/15 border border-primary/30 p-4">
        <p className="text-sm text-muted-foreground">Hos geldiniz</p>
        <h1 className="text-xl font-bold">Antrenor Paneli</h1>
        <p className="text-sm text-muted-foreground">
          Bugun {d.bugunDersleri.length} ders, {d.sporcuSayisi} sporcu
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
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
              Bugunun Dersleri
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
              Haftalik Ders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{d.haftalikDersSayisi ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-5 w-5 text-primary" />
              Devam Orani
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">%{d.devamOrani ?? 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* Hizli Erisim */}
      <div className="grid gap-3 md:grid-cols-3">
        <Link href="/antrenor/yoklama">
          <Button variant="outline" className="w-full h-16 flex items-center gap-3 text-left justify-start">
            <ClipboardCheck className="h-6 w-6 text-primary" />
            <div>
              <p className="font-medium">Yoklama Al</p>
              <p className="text-xs text-muted-foreground">Ders secip devam durumu girin</p>
            </div>
          </Button>
        </Link>
        <Link href="/antrenor/sporcular">
          <Button variant="outline" className="w-full h-16 flex items-center gap-3 text-left justify-start">
            <Users className="h-6 w-6 text-primary" />
            <div>
              <p className="font-medium">Sporcularim</p>
              <p className="text-xs text-muted-foreground">Sporcu listesi ve detaylari</p>
            </div>
          </Button>
        </Link>
        <Link href="/antrenor/olcum">
          <Button variant="outline" className="w-full h-16 flex items-center gap-3 text-left justify-start">
            <Ruler className="h-6 w-6 text-primary" />
            <div>
              <p className="font-medium">Olcum Girisi</p>
              <p className="text-xs text-muted-foreground">Sporcu olcum ve analiz</p>
            </div>
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Bugunun Programi
          </CardTitle>
          <CardDescription>{d.bugunTarih}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {d.bugunDersleri.length === 0 ? (
            <p className="text-muted-foreground text-sm">Bugun ders yok.</p>
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
          <CardTitle>Son Yoklamalar Ozeti</CardTitle>
          <CardDescription>Son gunlerin geldi / gelmedi sayilari</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {d.sonYoklamalar.length === 0 ? (
            <p className="text-muted-foreground text-sm">Henuz yoklama yok.</p>
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
