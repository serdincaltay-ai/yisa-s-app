"use client"

/**
 * YiSA-S Vitrin Sayfasi — Tam Revizyon
 * Gorsel agirlikli, tablet mockup konsepti, minimal yazi
 */

import { useState, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Bot,
  Zap,
  Users,
  BarChart3,
  Mail,
  MapPin,
  Check,
  Brain,
  CreditCard,
  Phone,
  MessageCircle,
  Shield,
  ChevronLeft,
  ChevronRight,
  Star,
  Trophy,
  Heart,
  Dumbbell,
  ClipboardCheck,
  Play,
  ArrowRight,
  Coins,
  Lock,
  Sparkles,
} from "lucide-react"
import Link from "next/link"
import { YisaLogoInline } from "@/components/YisaLogo"

/* ================================================================
   TUTARLI ORNEK VERILER
   ================================================================ */
const OGRENCILER = [
  { ad: "Elif Yilmaz", yas: 8, cinsiyet: "K", brans: "Cimnastik", kayitTarih: "2025-09-01", aidat: 1200, durum: "aktif" },
  { ad: "Can Demir", yas: 10, cinsiyet: "E", brans: "Cimnastik", kayitTarih: "2025-09-15", aidat: 1200, durum: "aktif" },
  { ad: "Zeynep Kaya", yas: 7, cinsiyet: "K", brans: "Yuzme", kayitTarih: "2025-10-01", aidat: 1500, durum: "aktif" },
  { ad: "Baris Ozturk", yas: 9, cinsiyet: "E", brans: "Basketbol", kayitTarih: "2025-10-10", aidat: 1000, durum: "aktif" },
  { ad: "Selin Arslan", yas: 11, cinsiyet: "K", brans: "Voleybol", kayitTarih: "2025-11-01", aidat: 1000, durum: "ayrilan" },
  { ad: "Mert Sahin", yas: 8, cinsiyet: "E", brans: "Cimnastik", kayitTarih: "2026-01-05", aidat: 1200, durum: "aktif" },
]

const OZELLIKLER = [
  { baslik: "AI Destekli Yonetim", slogan: "Yapay zeka tesisinizi yonetsin", icon: Brain, renk: "from-cyan-500 to-blue-600", tabletIcerik: "ai-panel" },
  { baslik: "Tesis Yonetim Paneli", slogan: "Tek ekranda tum kontrol", icon: Shield, renk: "from-emerald-500 to-teal-600", tabletIcerik: "tesis-panel" },
  { baslik: "Sporcu Gelisim Takibi", slogan: "Veriyle buyuyen sporcular", icon: BarChart3, renk: "from-amber-500 to-orange-600", tabletIcerik: "sporcu-gelisim" },
  { baslik: "Antrenman Uzmani (AI)", slogan: "Kisisel antrenman planlari", icon: Dumbbell, renk: "from-purple-500 to-pink-600", tabletIcerik: "antrenman-ai" },
  { baslik: "Veli Paneli", slogan: "Gelisimi canli takip edin", icon: Heart, renk: "from-pink-500 to-rose-600", tabletIcerik: "veli-panel" },
  { baslik: "Aidat & Odeme Takibi", slogan: "Otomatik hatirlatma sistemi", icon: CreditCard, renk: "from-green-500 to-emerald-600", tabletIcerik: "aidat-takip" },
  { baslik: "Yoklama Sistemi", slogan: "Tek tikla yoklama kaydi", icon: ClipboardCheck, renk: "from-blue-500 to-indigo-600", tabletIcerik: "yoklama" },
]

const GELISIM_PARAMETRELERI = [
  { ad: "Esneklik", yildiz: 4, emoji: "\uD83E\uDD38", seviye: "Harika!", renk: "bg-emerald-500", yuzde: 80, referans: "Yas grubu: 7-9" },
  { ad: "Kuvvet", yildiz: 2, emoji: "\uD83D\uDCAA", seviye: "Gelistirelim!", renk: "bg-amber-500", yuzde: 40, referans: "Yas grubu: 7-9" },
  { ad: "Denge", yildiz: 3, emoji: "\uD83E\uDDD8", seviye: "Iyi!", renk: "bg-blue-500", yuzde: 60, referans: "Dunya normu" },
  { ad: "Koordinasyon", yildiz: 5, emoji: "\u2B50", seviye: "Mukemmel!", renk: "bg-purple-500", yuzde: 100, referans: "Yas grubu: 7-9" },
  { ad: "Dayaniklilik", yildiz: 3, emoji: "\uD83C\uDFC3", seviye: "Iyi!", renk: "bg-cyan-500", yuzde: 60, referans: "Dunya normu" },
]

const TOKEN_PAKETLERI = [
  { sure: "Aylik", fiyat: "Ucretsiz", token: 0, aktif: true },
  { sure: "3 Aylik Analiz", fiyat: "5 Token", token: 5, aktif: false },
  { sure: "6 Aylik Analiz", fiyat: "15 Token", token: 15, aktif: false },
  { sure: "12 Aylik Analiz", fiyat: "30 Token", token: 30, aktif: false },
]

const YOKLAMA_VERILERI = [
  { tarih: "2026-03-03", ogrenci: "Elif Yilmaz", durum: "katildi", aciklama: "" },
  { tarih: "2026-03-03", ogrenci: "Can Demir", durum: "katilmadi", aciklama: "Hastalik (rapor var)" },
  { tarih: "2026-03-03", ogrenci: "Zeynep Kaya", durum: "katildi", aciklama: "" },
  { tarih: "2026-03-03", ogrenci: "Mert Sahin", durum: "katildi", aciklama: "" },
  { tarih: "2026-03-05", ogrenci: "Elif Yilmaz", durum: "katildi", aciklama: "" },
  { tarih: "2026-03-05", ogrenci: "Can Demir", durum: "katildi", aciklama: "" },
  { tarih: "2026-03-05", ogrenci: "Zeynep Kaya", durum: "katilmadi", aciklama: "Aile izni" },
  { tarih: "2026-03-05", ogrenci: "Mert Sahin", durum: "katildi", aciklama: "" },
]

const KAYIT_TREND = [
  { ay: "Eyl", baslayan: 8, ayrilan: 1, kiz: 5, erkek: 3 },
  { ay: "Eki", baslayan: 6, ayrilan: 0, kiz: 3, erkek: 3 },
  { ay: "Kas", baslayan: 4, ayrilan: 2, kiz: 2, erkek: 2 },
  { ay: "Ara", baslayan: 3, ayrilan: 1, kiz: 1, erkek: 2 },
  { ay: "Oca", baslayan: 7, ayrilan: 0, kiz: 4, erkek: 3 },
  { ay: "Sub", baslayan: 5, ayrilan: 1, kiz: 3, erkek: 2 },
  { ay: "Mar", baslayan: 9, ayrilan: 0, kiz: 5, erkek: 4 },
]

const PAKETLER = [
  { ad: "Starter", fiyat: "$49", periyot: "/ay", ozellikler: ["50 uye kapasitesi", "1 sube", "Temel AI robotlar", "Veli paneli", "E-posta destek"], vurgu: false },
  { ad: "Pro", fiyat: "$99", periyot: "/ay", ozellikler: ["200 uye kapasitesi", "3 sube", "Tum AI robotlar", "WhatsApp entegrasyonu", "Oncelikli destek", "Gelisim grafikleri", "50 token/ay"], vurgu: true },
  { ad: "Enterprise", fiyat: "$199", periyot: "/ay", ozellikler: ["Sinirsiz uye", "Sinirsiz sube", "Ozel entegrasyonlar", "Dedicated destek", "Tam ozellestirme", "API erisimi", "200 token/ay"], vurgu: false },
]

const FAQ_ITEMS = [
  { q: "YiSA-S nedir?", a: "Spor tesislerini AI robotlarla yoneten franchise sistemidir." },
  { q: "Demo nasil talep edilir?", a: "Ucretsiz Demo butonuna tiklayin, formu doldurun." },
  { q: "Token sistemi nedir?", a: "Gelismis analizler icin kullanilan kredi sistemidir. Temel ozellikler ucretsizdir." },
  { q: "Hangi paket bana uygun?", a: "Kucuk tesisler icin Starter, orta olcek icin Pro, buyuk isletmeler icin Enterprise." },
]

/* ================================================================
   TABLET MOCKUP COMPONENT
   ================================================================ */
function TabletMockup({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative mx-auto ${className}`}>
      <div className="relative rounded-[2rem] border-[6px] border-gray-700 bg-gray-900 shadow-2xl shadow-black/50 overflow-hidden">
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-gray-700 z-10" />
        <div className="bg-gray-950 overflow-hidden">{children}</div>
      </div>
    </div>
  )
}

/* ================================================================
   TABLET SCREEN CONTENTS
   ================================================================ */
function TabletScreenDashboard() {
  return (
    <div className="p-3 space-y-2 text-[10px] min-h-[200px]">
      <div className="flex items-center justify-between mb-2">
        <span className="font-bold text-cyan-400 text-xs">YiSA-S Panel</span>
        <span className="text-gray-500">Merhaba, Admin</span>
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-2 text-center">
          <div className="text-lg font-bold text-cyan-400">42</div>
          <div className="text-gray-400">Aktif Uye</div>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2 text-center">
          <div className="text-lg font-bold text-emerald-400">6</div>
          <div className="text-gray-400">Antrenor</div>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-2 text-center">
          <div className="text-lg font-bold text-amber-400">%94</div>
          <div className="text-gray-400">Yoklama</div>
        </div>
      </div>
      <div className="bg-gray-800/50 rounded-lg p-2">
        <div className="text-gray-400 mb-1">Bugunun Dersleri</div>
        <div className="space-y-1">
          <div className="flex justify-between"><span className="text-white">Cimnastik Mini</span><span className="text-cyan-400">15:00</span></div>
          <div className="flex justify-between"><span className="text-white">Cimnastik Midi</span><span className="text-cyan-400">17:00</span></div>
        </div>
      </div>
    </div>
  )
}

function TabletScreenVeli() {
  return (
    <div className="p-3 space-y-2 text-[10px] min-h-[200px]">
      <div className="flex items-center justify-between mb-2">
        <span className="font-bold text-pink-400 text-xs">Veli Paneli</span>
        <span className="text-gray-500">Hos geldiniz</span>
      </div>
      <div className="bg-pink-500/10 border border-pink-500/20 rounded-lg p-2">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-6 h-6 rounded-full bg-pink-500/30 flex items-center justify-center text-[8px]">EY</div>
          <div>
            <div className="text-white font-medium">Elif Yilmaz</div>
            <div className="text-gray-400">8 yas - Cimnastik</div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        <div className="bg-emerald-500/10 rounded-lg p-2 text-center">
          <div className="text-sm font-bold text-emerald-400">12/14</div>
          <div className="text-gray-400">Yoklama</div>
        </div>
        <div className="bg-amber-500/10 rounded-lg p-2 text-center">
          <div className="text-sm font-bold text-amber-400">4.2</div>
          <div className="text-gray-400">Ort. Yildiz</div>
        </div>
      </div>
      <div className="bg-gray-800/50 rounded-lg p-2">
        <div className="text-gray-400 mb-1">Sonraki Ders</div>
        <div className="text-white">Cimnastik — Pazartesi 15:00</div>
      </div>
    </div>
  )
}

function TabletScreenGelisim() {
  return (
    <div className="p-3 space-y-2 text-[10px] min-h-[200px]">
      <div className="text-xs font-bold text-amber-400 mb-2">Sporcu Gelisim — Elif Yilmaz</div>
      {GELISIM_PARAMETRELERI.slice(0, 3).map((p) => (
        <div key={p.ad} className="flex items-center gap-2">
          <span className="text-sm">{p.emoji}</span>
          <span className="text-white w-16 truncate">{p.ad}</span>
          <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
            <div className={`h-full ${p.renk} rounded-full`} style={{ width: `${p.yuzde}%` }} />
          </div>
          <span className="text-yellow-400 text-[8px]">{"\u2605".repeat(p.yildiz)}</span>
        </div>
      ))}
    </div>
  )
}

function TabletScreenYoklama() {
  return (
    <div className="p-3 space-y-1.5 text-[10px] min-h-[200px]">
      <div className="text-xs font-bold text-blue-400 mb-2">Yoklama — 3 Mart 2026</div>
      {YOKLAMA_VERILERI.slice(0, 4).map((y, i) => (
        <div key={i} className="flex items-center gap-2 bg-gray-800/50 rounded-lg px-2 py-1.5">
          <div className={`w-2 h-2 rounded-full ${y.durum === "katildi" ? "bg-emerald-400" : "bg-red-400"}`} />
          <span className="text-white flex-1">{y.ogrenci}</span>
          <span className={y.durum === "katildi" ? "text-emerald-400" : "text-red-400"}>
            {y.durum === "katildi" ? "Katildi" : "Gelmedi"}
          </span>
        </div>
      ))}
    </div>
  )
}

function TabletScreenAidat() {
  return (
    <div className="p-3 space-y-1.5 text-[10px] min-h-[200px]">
      <div className="text-xs font-bold text-green-400 mb-2">Aidat Takibi — Mart 2026</div>
      {OGRENCILER.slice(0, 4).map((o, i) => (
        <div key={i} className="flex items-center gap-2 bg-gray-800/50 rounded-lg px-2 py-1.5">
          <span className="text-white flex-1">{o.ad}</span>
          <span className="text-gray-400">{o.aidat} TL</span>
          <span className={`px-1.5 py-0.5 rounded text-[8px] ${i < 3 ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
            {i < 3 ? "Odendi" : "Bekliyor"}
          </span>
        </div>
      ))}
    </div>
  )
}

function TabletScreenAI() {
  return (
    <div className="p-3 space-y-2 text-[10px] min-h-[200px]">
      <div className="text-xs font-bold text-cyan-400 mb-2">AI Asistan</div>
      <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-2">
        <div className="text-gray-400 mb-1">Robot Durumu</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-400" /><span className="text-white">CELF Robotu — Aktif</span></div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-400" /><span className="text-white">Veri Robotu — Aktif</span></div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-400" /><span className="text-white">Guvenlik — Aktif</span></div>
        </div>
      </div>
      <div className="bg-gray-800/50 rounded-lg p-2">
        <div className="text-gray-400 mb-1">Son Komut</div>
        <div className="text-white">&quot;Yoklama raporunu ozetle&quot;</div>
        <div className="text-cyan-400 mt-1">Bugunun yoklama orani: %94</div>
      </div>
    </div>
  )
}

function TabletScreenAntrenman() {
  return (
    <div className="p-3 space-y-2 text-[10px] min-h-[200px]">
      <div className="text-xs font-bold text-purple-400 mb-2">AI Antrenman Plani</div>
      <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-2">
        <div className="text-white font-medium mb-1">Elif Yilmaz — Haftalik Plan</div>
        <div className="space-y-1 text-gray-300">
          <div className="flex justify-between"><span>Pzt: Esneklik + Denge</span><span className="text-purple-400">45dk</span></div>
          <div className="flex justify-between"><span>Car: Kuvvet + Koordinasyon</span><span className="text-purple-400">45dk</span></div>
          <div className="flex justify-between"><span>Cum: Genel Antrenman</span><span className="text-purple-400">60dk</span></div>
        </div>
      </div>
      <div className="text-gray-500 text-center">AI tarafindan olusturuldu</div>
    </div>
  )
}

function getTabletContent(tip: string) {
  switch (tip) {
    case "ai-panel": return <TabletScreenAI />
    case "tesis-panel": return <TabletScreenDashboard />
    case "sporcu-gelisim": return <TabletScreenGelisim />
    case "antrenman-ai": return <TabletScreenAntrenman />
    case "veli-panel": return <TabletScreenVeli />
    case "aidat-takip": return <TabletScreenAidat />
    case "yoklama": return <TabletScreenYoklama />
    default: return <TabletScreenDashboard />
  }
}

/* ================================================================
   MAIN COMPONENT
   ================================================================ */
export default function HomePage() {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ ad: "", email: "", telefon: "", tesis_turu: "", sehir: "" })
  const [formSending, setFormSending] = useState(false)
  const [formDone, setFormDone] = useState(false)
  const carouselRef = useRef<HTMLDivElement>(null)
  const [videoPlaying, setVideoPlaying] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formSending) return
    setFormSending(true)
    try {
      const res = await fetch("/api/demo-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.ad,
          email: formData.email,
          phone: formData.telefon || null,
          facility_type: formData.tesis_turu || null,
          city: formData.sehir || null,
          source: "www",
        }),
      })
      const data = await res.json()
      if (data?.ok) {
        setFormDone(true)
        setFormData({ ad: "", email: "", telefon: "", tesis_turu: "", sehir: "" })
        setTimeout(() => {
          setShowForm(false)
          setFormDone(false)
        }, 2000)
      } else {
        alert(data?.error || "Kayit sirasinda hata olustu.")
      }
    } catch {
      alert("Baglanti hatasi. Lutfen tekrar deneyin.")
    } finally {
      setFormSending(false)
    }
  }

  const scrollCarousel = useCallback((direction: "left" | "right") => {
    if (!carouselRef.current) return
    carouselRef.current.scrollBy({
      left: direction === "left" ? -340 : 340,
      behavior: "smooth",
    })
  }, [])

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <YisaLogoInline href="/" />
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-400">
            <a href="#ozellikler" className="hover:text-white transition-colors">Ozellikler</a>
            <a href="#gelisim" className="hover:text-white transition-colors">Gelisim</a>
            <a href="#fiyatlar" className="hover:text-white transition-colors">Fiyatlar</a>
            <a href="#iletisim" className="hover:text-white transition-colors">Iletisim</a>
            <Link href="/fuar" className="hover:text-white transition-colors">Fuar</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white text-sm">
                Giris Yap
              </Button>
            </Link>
            <Button
              onClick={() => setShowForm(true)}
              size="sm"
              className="bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-white font-semibold rounded-xl px-5"
            >
              Ucretsiz Demo
            </Button>
          </div>
        </div>
      </nav>

      {/* 1. HERO */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950" />
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: "2s" }} />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
                <span className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  Teknolojiyi
                </span>
                <br />
                <span className="text-white">Spora Baslattik</span>
              </h1>
              <p className="text-gray-400 text-lg sm:text-xl mb-10 max-w-lg mx-auto lg:mx-0">
                AI destekli spor tesisi yonetim platformu.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  onClick={() => setShowForm(true)}
                  size="lg"
                  className="bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-white font-bold rounded-2xl px-10 h-14 text-lg shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all hover:scale-105"
                >
                  Ucretsiz Demo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/10 text-gray-300 hover:text-white hover:bg-white/5 rounded-2xl px-8 h-14 text-lg"
                  onClick={() => setVideoPlaying(true)}
                >
                  <Play className="mr-2 h-5 w-5" />
                  Tanitim Izle
                </Button>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <TabletMockup className="w-[300px] sm:w-[360px] lg:w-[400px]">
                <TabletScreenDashboard />
              </TabletMockup>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex items-start justify-center p-1.5">
            <div className="w-1.5 h-3 bg-white/40 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* 2. TANITIM */}
      <section className="py-20 sm:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">Neden YiSA-S?</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">Tesisinizi robotlar yonetsin, siz spora odaklanin.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Bot, title: "AI Robotlar", desc: "7/24 otomatik yonetim", renk: "cyan" },
              { icon: Users, title: "Veli Takibi", desc: "Canli gelisim izleme", renk: "pink" },
              { icon: BarChart3, title: "Veri Analizi", desc: "Bilimsel sporcu gelisimi", renk: "amber" },
              { icon: Zap, title: "Otomasyon", desc: "Yoklama, aidat, hatirlatma", renk: "emerald" },
            ].map((f) => {
              const Icon = f.icon
              const colorMap: Record<string, string> = {
                cyan: "from-cyan-500/20 to-cyan-500/5 border-cyan-500/20 text-cyan-400",
                pink: "from-pink-500/20 to-pink-500/5 border-pink-500/20 text-pink-400",
                amber: "from-amber-500/20 to-amber-500/5 border-amber-500/20 text-amber-400",
                emerald: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/20 text-emerald-400",
              }
              const c = colorMap[f.renk] || colorMap.cyan
              return (
                <div key={f.title} className={`rounded-2xl border bg-gradient-to-b ${c} p-6 hover:scale-105 transition-transform`}>
                  <Icon className="h-10 w-10 mb-4" />
                  <h3 className="text-white font-semibold text-lg mb-1">{f.title}</h3>
                  <p className="text-gray-400 text-sm">{f.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 3. OZELLIKLER CAROUSEL */}
      <section id="ozellikler" className="py-20 sm:py-28 bg-gray-900/50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-2">
                <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">Ozellikler</span>
              </h2>
              <p className="text-gray-400">Tablet ekraninda tum ozellikler</p>
            </div>
            <div className="hidden sm:flex gap-2">
              <button
                onClick={() => scrollCarousel("left")}
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => scrollCarousel("right")}
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div
            ref={carouselRef}
            className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory"
            style={{ scrollbarWidth: "none" }}
          >
            {OZELLIKLER.map((oz) => {
              const Icon = oz.icon
              return (
                <div key={oz.baslik} className="flex-shrink-0 w-[300px] sm:w-[320px] snap-center">
                  <div className="rounded-3xl border border-white/5 bg-gray-900 overflow-hidden hover:border-white/10 transition-colors group">
                    <div className="p-6 pb-0">
                      <TabletMockup className="w-full max-w-[260px]">
                        {getTabletContent(oz.tabletIcerik)}
                      </TabletMockup>
                    </div>
                    <div className="p-6 pt-4">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${oz.renk} flex items-center justify-center mb-3`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-white font-semibold text-lg mb-1">{oz.baslik}</h3>
                      <p className="text-gray-400 text-sm">{oz.slogan}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 4. SPORCU GELISIM */}
      <section id="gelisim" className="py-20 sm:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="flex justify-center">
              <TabletMockup className="w-[300px] sm:w-[340px]">
                <div className="p-4 space-y-3 text-xs min-h-[280px]">
                  <div className="text-sm font-bold text-amber-400 mb-3">Sporcu Gelisim — Elif Yilmaz (8 yas)</div>
                  {GELISIM_PARAMETRELERI.map((p) => (
                    <div key={p.ad} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{p.emoji}</span>
                          <span className="text-white font-medium">{p.ad}</span>
                        </div>
                        <span className="text-[10px]">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className={i < p.yildiz ? "text-yellow-400" : "text-gray-700"}>{"\u2605"}</span>
                          ))}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2.5 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${p.renk} rounded-full transition-all duration-1000`}
                            style={{ width: `${p.yuzde}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-gray-500 w-20 text-right">{p.referans}</span>
                      </div>
                      <div className="text-[10px] text-gray-400">{p.seviye}</div>
                    </div>
                  ))}
                </div>
              </TabletMockup>
            </div>
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Sporcu Gelisim Takibi</span>
              </h2>
              <p className="text-gray-400 text-lg mb-8">
                Cocuk bile kendi gelisimini anlasin. Yildizlar, rozetler ve renkli gostergelerle.
              </p>
              <div className="grid grid-cols-2 gap-3 mb-8">
                {GELISIM_PARAMETRELERI.slice(0, 4).map((p) => (
                  <div key={p.ad} className="bg-gray-900 border border-white/5 rounded-xl p-3 flex items-center gap-3">
                    <span className="text-2xl">{p.emoji}</span>
                    <div>
                      <div className="text-white font-medium text-sm">{p.ad}</div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: p.yildiz }).map((_, i) => (
                          <Star key={i} className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                        ))}
                        <span className="text-xs text-gray-500 ml-1">{p.seviye}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Token Sistemi */}
              <div className="bg-gray-900 border border-white/5 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Coins className="h-5 w-5 text-amber-400" />
                  <h3 className="text-white font-semibold">Detayli Analiz — Token Sistemi</h3>
                </div>
                <p className="text-gray-400 text-sm mb-4">
                  Referans degerleri yas grubuna ve dunya normlarina gore hesaplanir.
                </p>
                <div className="space-y-2">
                  {TOKEN_PAKETLERI.map((t) => (
                    <div
                      key={t.sure}
                      className={`flex items-center justify-between p-3 rounded-xl border ${t.aktif ? "border-emerald-500/30 bg-emerald-500/5" : "border-white/5 bg-white/[0.02]"}`}
                    >
                      <div className="flex items-center gap-2">
                        {t.token === 0 ? (
                          <Sparkles className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <Lock className="h-4 w-4 text-gray-500" />
                        )}
                        <span className="text-white text-sm">{t.sure}</span>
                      </div>
                      <span className={`text-sm font-medium ${t.aktif ? "text-emerald-400" : "text-amber-400"}`}>
                        {t.fiyat}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. VELI PANELI */}
      <section className="py-20 sm:py-28 bg-gray-900/50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">Veli Paneli</span>
              </h2>
              <p className="text-gray-400 text-lg mb-6">
                Veliler cocuklarinin gelisimini canli takip etsin.
              </p>
              <div className="space-y-4">
                {[
                  "Yoklama durumu anlik goruntulensin",
                  "Gelisim grafikleri ve yildiz puanlari",
                  "Ders programi ve sonraki antrenman",
                  "Aidat durumu ve odeme gecmisi",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-pink-500/20 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3.5 w-3.5 text-pink-400" />
                    </div>
                    <span className="text-gray-300 text-sm">{item}</span>
                  </div>
                ))}
              </div>
              <Button
                onClick={() => setShowForm(true)}
                className="mt-8 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white font-semibold rounded-xl px-8 h-12"
              >
                Demo Ile Deneyin
              </Button>
            </div>
            <div className="order-1 lg:order-2 flex justify-center">
              <TabletMockup className="w-[300px] sm:w-[340px]">
                <TabletScreenVeli />
              </TabletMockup>
            </div>
          </div>
        </div>
      </section>

      {/* 6. KAYIT TRENDI */}
      <section className="py-20 sm:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Aylik Kayit Trendi</span>
            </h2>
            <p className="text-gray-400">Ogrenci hareketlerini tek bakista gorun</p>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-8">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-emerald-500" /><span className="text-gray-400 text-sm">Baslayan</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-red-500" /><span className="text-gray-400 text-sm">Ayrilan</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-pink-400" /><span className="text-gray-400 text-sm">Kiz</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-blue-400" /><span className="text-gray-400 text-sm">Erkek</span></div>
            </div>
            <div className="bg-gray-900 border border-white/5 rounded-2xl p-6">
              <div className="flex items-end justify-between gap-2 h-48">
                {KAYIT_TREND.map((k) => {
                  const maxVal = 10
                  return (
                    <div key={k.ay} className="flex-1 flex flex-col items-center gap-1">
                      <div className="flex items-end gap-0.5 h-36 w-full justify-center">
                        <div
                          className="w-2 sm:w-3 bg-emerald-500 rounded-t-sm"
                          style={{ height: `${(k.baslayan / maxVal) * 100}%` }}
                          title={`Baslayan: ${k.baslayan}`}
                        />
                        <div
                          className="w-2 sm:w-3 bg-red-500 rounded-t-sm"
                          style={{ height: `${(k.ayrilan / maxVal) * 100}%`, minHeight: k.ayrilan > 0 ? "4px" : "0px" }}
                          title={`Ayrilan: ${k.ayrilan}`}
                        />
                        <div
                          className="w-2 sm:w-3 bg-pink-400 rounded-t-sm"
                          style={{ height: `${(k.kiz / maxVal) * 100}%` }}
                          title={`Kiz: ${k.kiz}`}
                        />
                        <div
                          className="w-2 sm:w-3 bg-blue-400 rounded-t-sm"
                          style={{ height: `${(k.erkek / maxVal) * 100}%` }}
                          title={`Erkek: ${k.erkek}`}
                        />
                      </div>
                      <span className="text-gray-500 text-xs">{k.ay}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. YOKLAMA */}
      <section className="py-20 sm:py-28 bg-gray-900/50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="flex justify-center">
              <TabletMockup className="w-[300px] sm:w-[340px]">
                <TabletScreenYoklama />
              </TabletMockup>
            </div>
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Yoklama Sistemi</span>
              </h2>
              <p className="text-gray-400 text-lg mb-6">Tek tikla yoklama, detayli devamsizlik takibi.</p>
              <div className="bg-gray-900 border border-white/5 rounded-2xl overflow-hidden">
                <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
                  <ClipboardCheck className="h-4 w-4 text-blue-400" />
                  <span className="text-sm font-medium text-white">3 Mart 2026 — Cimnastik Mini</span>
                </div>
                <div className="divide-y divide-white/5">
                  {YOKLAMA_VERILERI.filter((y) => y.tarih === "2026-03-03").map((y, i) => (
                    <div key={i} className="px-4 py-2.5 flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${y.durum === "katildi" ? "bg-emerald-400" : "bg-red-400"}`} />
                      <span className="text-white text-sm flex-1 min-w-0">{y.ogrenci}</span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${y.durum === "katildi" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}
                      >
                        {y.durum === "katildi" ? "Katildi" : "Katilmadi"}
                      </span>
                      {y.aciklama && (
                        <span className="text-xs text-gray-500 hidden sm:inline">{y.aciklama}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FIYATLANDIRMA */}
      <section id="fiyatlar" className="py-20 sm:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Fiyatlandirma</span>
            </h2>
            <p className="text-gray-400">Yazilim kullanma ucretidir. Donanim ve fiziksel hizmetler dahil degildir.</p>
          </div>
          <div className="max-w-2xl mx-auto mb-12 bg-gray-900 border border-amber-500/20 rounded-2xl p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Coins className="h-5 w-5 text-amber-400" />
              <span className="text-white font-semibold">Token Sistemi</span>
            </div>
            <p className="text-gray-400 text-sm">
              Tokenlar gelismis AI analizleri, detayli raporlar ve premium ozellikler icin kullanilir. Her paket aylik token icermektedir.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {PAKETLER.map((pkg) => (
              <div
                key={pkg.ad}
                className={`rounded-3xl border overflow-hidden transition-all hover:scale-105 ${pkg.vurgu ? "border-cyan-500/50 bg-gradient-to-b from-cyan-500/10 to-transparent ring-1 ring-cyan-500/20 shadow-lg shadow-cyan-500/10" : "border-white/5 bg-gray-900"}`}
              >
                {pkg.vurgu && (
                  <div className="bg-gradient-to-r from-cyan-500 to-emerald-500 text-center py-1.5 text-xs font-semibold text-white">
                    En Populer
                  </div>
                )}
                <div className="p-4 pb-0">
                  <TabletMockup className="w-full max-w-[200px]">
                    <div className="p-2 text-[8px] min-h-[100px]">
                      <div className="text-[10px] font-bold text-cyan-400 mb-1">{pkg.ad} Panel</div>
                      <div className="grid grid-cols-2 gap-1">
                        <div className="bg-cyan-500/10 rounded p-1 text-center">
                          <div className="text-[10px] font-bold text-cyan-400">
                            {pkg.ad === "Starter" ? "50" : pkg.ad === "Pro" ? "200" : "\u221E"}
                          </div>
                          <div className="text-gray-500">Uye</div>
                        </div>
                        <div className="bg-emerald-500/10 rounded p-1 text-center">
                          <div className="text-[10px] font-bold text-emerald-400">
                            {pkg.ad === "Starter" ? "1" : pkg.ad === "Pro" ? "3" : "\u221E"}
                          </div>
                          <div className="text-gray-500">Sube</div>
                        </div>
                      </div>
                    </div>
                  </TabletMockup>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-1">{pkg.ad}</h3>
                  <div className="mb-4">
                    <span className={`text-3xl font-bold ${pkg.vurgu ? "text-cyan-400" : "text-white"}`}>{pkg.fiyat}</span>
                    <span className="text-gray-500 text-sm">{pkg.periyot}</span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {pkg.ozellikler.map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                        <Check className={`h-4 w-4 flex-shrink-0 ${pkg.vurgu ? "text-cyan-400" : "text-emerald-400"}`} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={() => setShowForm(true)}
                    className={`w-full rounded-xl h-11 font-semibold ${pkg.vurgu ? "bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-white" : "bg-white/5 border border-white/10 text-white hover:bg-white/10"}`}
                  >
                    Basvur
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. SSS */}
      <section className="py-20 sm:py-28 bg-gray-900/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">Sikca Sorulanlar</span>
          </h2>
          <div className="space-y-4">
            {FAQ_ITEMS.map((item, i) => (
              <FaqItem key={i} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* 10. ILETISIM */}
      <section id="iletisim" className="py-20 sm:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">Hemen Baslayalim</span>
            </h2>
            <p className="text-gray-400 text-lg mb-10">Ucretsiz demo ile tanisin, tesisinizi dijitallestirin.</p>
            <Button
              onClick={() => setShowForm(true)}
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-white font-bold rounded-2xl px-12 h-14 text-lg shadow-lg shadow-cyan-500/25 mb-12"
            >
              Ucretsiz Demo Talep Et
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-cyan-400" />
                </div>
                <span className="text-gray-300 text-sm">info@yisa-s.com</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <Phone className="h-5 w-5 text-emerald-400" />
                </div>
                <a href="tel:+905332491903" className="text-gray-300 text-sm hover:text-white">0533 249 1903</a>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-pink-400" />
                </div>
                <span className="text-gray-300 text-sm">Tuzla, Istanbul</span>
              </div>
            </div>
            <div className="mb-8">
              <Link
                href="/fuar"
                className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-cyan-400 transition-colors border border-white/5 rounded-full px-5 py-2 hover:border-cyan-500/30"
              >
                <Trophy className="h-4 w-4" />
                Fuar Sayfamizi Ziyaret Edin
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-8 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <YisaLogoInline />
            <span className="text-gray-500 text-sm">&copy; 2026 YiSA-S — Tum haklari saklidir.</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://wa.me/905332491903" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-green-400 transition-colors">
              <MessageCircle className="h-5 w-5" />
            </a>
            <a href="https://instagram.com/yisas" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-pink-400 transition-colors text-sm">
              Instagram
            </a>
          </div>
        </div>
      </footer>

      {/* FLOATING WHATSAPP */}
      <a
        href="https://wa.me/905332491903"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-green-600 hover:bg-green-500 flex items-center justify-center shadow-lg shadow-green-600/30 transition-all hover:scale-110"
        aria-label="WhatsApp ile iletisime gecin"
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </a>

      {/* VIDEO MODAL */}
      {videoPlaying && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-6"
          onClick={() => setVideoPlaying(false)}
        >
          <div
            className="relative max-w-4xl w-full aspect-video rounded-2xl overflow-hidden bg-gray-900 border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-4">
                <Play className="h-8 w-8 text-white ml-1" />
              </div>
              <p className="text-gray-400 text-sm">Tanitim videosu yakinda eklenecek</p>
            </div>
            <button
              onClick={() => setVideoPlaying(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-light"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* DEMO FORM MODAL */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-6"
          onClick={() => setShowForm(false)}
        >
          <div
            className="relative bg-gray-900 border border-white/10 rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-white mb-2">Ucretsiz Demo Talep Et</h3>
            <p className="text-gray-400 text-sm mb-6">Formu doldurun, sizinle iletisime gececegiz.</p>
            {formDone ? (
              <div className="py-8 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-emerald-400" />
                </div>
                <p className="text-emerald-400 font-medium">Basvurunuz alindi. Tesekkurler!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  placeholder="Ad Soyad"
                  value={formData.ad}
                  onChange={(e) => setFormData({ ...formData, ad: e.target.value })}
                  className="bg-white/5 border-white/10 h-12 rounded-xl text-white placeholder:text-gray-500"
                  required
                />
                <Input
                  type="email"
                  placeholder="E-posta"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-white/5 border-white/10 h-12 rounded-xl text-white placeholder:text-gray-500"
                  required
                />
                <Input
                  placeholder="Telefon"
                  value={formData.telefon}
                  onChange={(e) => setFormData({ ...formData, telefon: e.target.value })}
                  className="bg-white/5 border-white/10 h-12 rounded-xl text-white placeholder:text-gray-500"
                />
                <Input
                  placeholder="Tesis turu (orn. Cimnastik)"
                  value={formData.tesis_turu}
                  onChange={(e) => setFormData({ ...formData, tesis_turu: e.target.value })}
                  className="bg-white/5 border-white/10 h-12 rounded-xl text-white placeholder:text-gray-500"
                />
                <Input
                  placeholder="Sehir"
                  value={formData.sehir}
                  onChange={(e) => setFormData({ ...formData, sehir: e.target.value })}
                  className="bg-white/5 border-white/10 h-12 rounded-xl text-white placeholder:text-gray-500"
                  required
                />
                <Button
                  type="submit"
                  disabled={formSending}
                  className="w-full bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-white font-semibold rounded-xl h-12"
                >
                  {formSending ? "Gonderiliyor..." : "Demo Talep Et"}
                </Button>
              </form>
            )}
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white text-xl"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ================================================================
   FAQ ITEM COMPONENT
   ================================================================ */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-white/5 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.02] transition-colors"
      >
        <span className="text-white font-medium pr-4">{q}</span>
        <ChevronRight className={`h-5 w-5 text-gray-500 flex-shrink-0 transition-transform ${open ? "rotate-90" : ""}`} />
      </button>
      {open && <div className="px-5 pb-5 text-gray-400 text-sm">{a}</div>}
    </div>
  )
}
