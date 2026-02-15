"use client"

import React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  Calendar,
  HeartPulse,
  FileText,
  Settings,
  Bell,
  LogOut,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  UserPlus,
  ClipboardList,
  Home,
  Dumbbell,
  Activity,
} from "lucide-react"

const ogrenciler = [
  { id: 1, ad: "Elif Yilmaz", yas: 8, durum: "aktif", sonOlcum: "2 gun once", risk: "dusuk" },
  { id: 2, ad: "Ahmet Kaya", yas: 10, durum: "aktif", sonOlcum: "1 hafta once", risk: "orta" },
  { id: 3, ad: "Zeynep Demir", yas: 7, durum: "aktif", sonOlcum: "3 gun once", risk: "dusuk" },
  { id: 4, ad: "Mehmet Can", yas: 9, durum: "aktif", sonOlcum: "5 gun once", risk: "yuksek" },
  { id: 5, ad: "Ayse Ozturk", yas: 11, durum: "pasif", sonOlcum: "1 ay once", risk: "dusuk" },
]

const bugunDersler = [
  { saat: "10:00", ders: "Temel Cimnastik", antrenor: "Ali Hoca", ogrenciSayisi: 8 },
  { saat: "14:00", ders: "Ileri Seviye", antrenor: "Ayse Hoca", ogrenciSayisi: 6 },
  { saat: "16:00", ders: "Ozel Ders", antrenor: "Mehmet Hoca", ogrenciSayisi: 1 },
  { saat: "18:00", ders: "Yetiskin Grubu", antrenor: "Ali Hoca", ogrenciSayisi: 12 },
]

const bildirimler = [
  { tip: "uyari", mesaj: "Mehmet Can icin saglik kontrolu gerekiyor", zaman: "2 saat once" },
  { tip: "bilgi", mesaj: "Yeni ogrenci kaydı: Fatma Arslan", zaman: "5 saat once" },
  { tip: "basari", mesaj: "Aylik rapor olusturuldu", zaman: "1 gun once" },
]

export default function TesisPaneli() {
  const [aktifMenu, setAktifMenu] = useState("anasayfa")

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-sidebar">
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Activity className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <span className="font-bold text-sidebar-foreground">YISA-S</span>
              <p className="text-xs text-sidebar-foreground/60">Tesis Paneli</p>
            </div>
          </div>

          <nav className="flex-1 space-y-1 p-4">
            <MenuButonu ikon={<Home className="h-5 w-5" />} etiket="Ana Sayfa" aktif={aktifMenu === "anasayfa"} tikla={() => setAktifMenu("anasayfa")} />
            <MenuButonu ikon={<Users className="h-5 w-5" />} etiket="Ogrenciler" aktif={aktifMenu === "ogrenciler"} tikla={() => setAktifMenu("ogrenciler")} />
            <MenuButonu ikon={<Calendar className="h-5 w-5" />} etiket="Ders Programi" aktif={aktifMenu === "dersler"} tikla={() => setAktifMenu("dersler")} />
            <MenuButonu ikon={<HeartPulse className="h-5 w-5" />} etiket="Saglik Takibi" aktif={aktifMenu === "saglik"} tikla={() => setAktifMenu("saglik")} />
            <MenuButonu ikon={<Dumbbell className="h-5 w-5" />} etiket="Antrenorler" aktif={aktifMenu === "antrenorler"} tikla={() => setAktifMenu("antrenorler")} />
            <MenuButonu ikon={<FileText className="h-5 w-5" />} etiket="Belgeler" aktif={aktifMenu === "belgeler"} tikla={() => setAktifMenu("belgeler")} />
            <MenuButonu ikon={<ClipboardList className="h-5 w-5" />} etiket="Raporlar" aktif={aktifMenu === "raporlar"} tikla={() => setAktifMenu("raporlar")} />
            <MenuButonu ikon={<Settings className="h-5 w-5" />} etiket="Ayarlar" aktif={aktifMenu === "ayarlar"} tikla={() => setAktifMenu("ayarlar")} />
          </nav>

          <div className="border-t border-sidebar-border p-4">
            <div className="mb-3 rounded-lg bg-sidebar-accent p-3">
              <p className="text-xs text-sidebar-foreground/60 mb-1">Token Bakiyesi</p>
              <div className="flex items-center justify-between">
                <span className="font-bold text-sidebar-foreground">847</span>
                <Badge variant="secondary" className="text-xs">Aylik: 1000</Badge>
              </div>
              <Progress value={84.7} className="mt-2 h-1.5" />
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start text-sidebar-foreground/60 hover:text-sidebar-foreground"
              onClick={() => window.location.href = "/"}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Cikis Yap
            </Button>
          </div>
        </div>
      </aside>

      <main className="ml-64 flex-1">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-6">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Hosgeldiniz, Serdinc Bey</h1>
            <p className="text-sm text-muted-foreground">Demo Cimnastik Salonu</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="relative bg-transparent">
              <Bell className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground">3</span>
            </Button>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Yeni Ogrenci
            </Button>
          </div>
        </header>

        <div className="p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <OzetKarti baslik="Toplam Ogrenci" deger="47" degisim="+3 bu ay" ikon={<Users className="h-5 w-5" />} renk="primary" />
            <OzetKarti baslik="Bugunki Dersler" deger="4" degisim="27 ogrenci" ikon={<Calendar className="h-5 w-5" />} renk="accent" />
            <OzetKarti baslik="Saglik Uyarilari" deger="2" degisim="Kontrol gerekiyor" ikon={<AlertTriangle className="h-5 w-5" />} renk="warning" />
            <OzetKarti baslik="Bu Ay Gelisim" deger="%87" degisim="Hedef: %85" ikon={<TrendingUp className="h-5 w-5" />} renk="success" />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Bugunki Dersler
                </CardTitle>
                <CardDescription>31 Ocak 2026</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {bugunDersler.map((ders, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-16 items-center justify-center rounded bg-primary/10 text-sm font-medium text-primary">{ders.saat}</div>
                        <div>
                          <p className="font-medium">{ders.ders}</p>
                          <p className="text-sm text-muted-foreground">{ders.antrenor}</p>
                        </div>
                      </div>
                      <Badge variant="secondary">{ders.ogrenciSayisi} ogrenci</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  Bildirimler
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {bildirimler.map((bildirim, i) => (
                    <div key={i} className="flex gap-3 rounded-lg border p-3">
                      {bildirim.tip === "uyari" && <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />}
                      {bildirim.tip === "bilgi" && <Clock className="h-5 w-5 text-blue-500 shrink-0" />}
                      {bildirim.tip === "basari" && <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />}
                      <div>
                        <p className="text-sm">{bildirim.mesaj}</p>
                        <p className="text-xs text-muted-foreground">{bildirim.zaman}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Son Kaydedilen Ogrenciler
                  </CardTitle>
                  <CardDescription>Ogrenci listesi ve saglik durumlari</CardDescription>
                </div>
                <Button variant="outline">Tum Ogrenciler</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left text-sm text-muted-foreground">
                      <th className="pb-3 font-medium">Ogrenci</th>
                      <th className="pb-3 font-medium">Yas</th>
                      <th className="pb-3 font-medium">Durum</th>
                      <th className="pb-3 font-medium">Son Olcum</th>
                      <th className="pb-3 font-medium">Risk</th>
                      <th className="pb-3 font-medium">Islem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ogrenciler.map((ogrenci) => (
                      <tr key={ogrenci.id} className="border-b last:border-0">
                        <td className="py-3 font-medium">{ogrenci.ad}</td>
                        <td className="py-3 text-muted-foreground">{ogrenci.yas}</td>
                        <td className="py-3">
                          <Badge variant={ogrenci.durum === "aktif" ? "default" : "secondary"}>{ogrenci.durum === "aktif" ? "Aktif" : "Pasif"}</Badge>
                        </td>
                        <td className="py-3 text-muted-foreground">{ogrenci.sonOlcum}</td>
                        <td className="py-3">
                          <Badge
                            variant="outline"
                            className={
                              ogrenci.risk === "dusuk" ? "border-green-500 text-green-500" :
                              ogrenci.risk === "orta" ? "border-amber-500 text-amber-500" :
                              "border-red-500 text-red-500"
                            }
                          >
                            {ogrenci.risk === "dusuk" ? "Dusuk" : ogrenci.risk === "orta" ? "Orta" : "Yuksek"}
                          </Badge>
                        </td>
                        <td className="py-3">
                          <Button variant="ghost" size="sm">Detay</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

function MenuButonu({ ikon, etiket, aktif, tikla }: { ikon: React.ReactNode; etiket: string; aktif: boolean; tikla: () => void }) {
  return (
    <button
      onClick={tikla}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
        aktif ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
      }`}
    >
      {ikon}
      {etiket}
    </button>
  )
}

function OzetKarti({ baslik, deger, degisim, ikon, renk }: { baslik: string; deger: string; degisim: string; ikon: React.ReactNode; renk: string }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{baslik}</p>
            <p className="text-2xl font-bold">{deger}</p>
            <p className="text-xs text-muted-foreground">{degisim}</p>
          </div>
          <div className={`flex h-12 w-12 items-center justify-center rounded-full ${
            renk === "primary" ? "bg-primary/10 text-primary" :
            renk === "accent" ? "bg-accent/10 text-accent" :
            renk === "warning" ? "bg-amber-100 text-amber-600" :
            "bg-green-100 text-green-600"
          }`}>
            {ikon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
