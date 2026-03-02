"use client"

/**
 * YiSA-S Ana Sayfa -- TV-Buton Layout
 * Sol: Fixed dikey navbar 60px, icon+label butonlar (11 section)
 * Sag: 100vh content, butona basinca section slide (CSS transition 0.4s)
 * Sayfa ASLA asagi scroll etmez, sadece sag content degisir
 * Mobilde: Alt tab bar
 */

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Bot,
  Zap,
  Users,
  BarChart3,
  User,
  Crown,
  Mail,
  MapPin,
  Check,
  Home,
  HelpCircle,
  Calendar,
  Layers,
  Trophy,
  CreditCard,
  Building2,
  Cpu,
  Globe,
  Phone,
  MessageCircle,
  Brain,
  Database,
  Shield,
  Dumbbell,
  Waves,
  Target,
  Store,
} from "lucide-react"
import Link from "next/link"
import { YisaLogoInline } from "@/components/YisaLogo"

/* ----------------------------------------------------------------
   NAV SECTIONS -- TV-Buton sidebar items (11 bolum)
   ---------------------------------------------------------------- */
const NAV_SECTIONS = [
  { id: "hero", label: "Ana", icon: Home },
  { id: "neden", label: "Neden", icon: Zap },
  { id: "ders", label: "Program", icon: Calendar },
  { id: "paneller", label: "Paneller", icon: Layers },
  { id: "branslar", label: "Branslar", icon: Trophy },
  { id: "kredi", label: "Fiyat", icon: CreditCard },
  { id: "direktorler", label: "Ekip", icon: Building2 },
  { id: "robotlar", label: "Robotlar", icon: Cpu },
  { id: "franchise", label: "Franchise", icon: Globe },
  { id: "sss", label: "SSS", icon: HelpCircle },
  { id: "iletisim", label: "Iletisim", icon: Phone },
] as const

type SectionId = (typeof NAV_SECTIONS)[number]["id"]

/* ----------------------------------------------------------------
   DATA
   ---------------------------------------------------------------- */
const PACKAGES = [
  {
    name: "Starter",
    price: "499",
    period: "/ay",
    features: ["50 uye", "1 sube", "Temel robotlar", "Veli paneli", "E-posta destek"],
    highlight: false,
  },
  {
    name: "Pro",
    price: "999",
    period: "/ay",
    features: ["200 uye", "3 sube", "Tum robotlar", "WhatsApp entegrasyonu", "Oncelikli destek", "Gelisim grafikleri"],
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Ozel",
    period: "",
    features: ["Sinirsiz uye", "Coklu sube", "Ozel entegrasyonlar", "Dedicated destek", "Ozellestirme", "API erisimi"],
    highlight: false,
  },
]

const FEATURES = [
  { icon: Bot, title: "AI Robotlar", desc: "Mailler, demolar, aidat takibi. Karsilama ve acil destek robotlari." },
  { icon: Zap, title: "Otomatik Yonetim", desc: "Isletmeyi robotlar yurutur. Ders programi, yoklama, kasa defteri." },
  { icon: Users, title: "Veli Takibi", desc: "Cocuk gelisimi, olcumler, antrenman programi. Veliler panelden takip eder." },
  { icon: BarChart3, title: "Veri ile Egitim", desc: "Parametreler, grafikler, raporlar. Bilimsel veriyle sporcu gelisimi." },
]

const REFERANSLAR = [
  { ad: "Merve Gormezler", unvan: "Firma Sahibi, Sportif Direktor" },
  { ad: "Emre Han Dalgic", unvan: "Uzman Antrenor" },
  { ad: "Ozlem Kuskan", unvan: "Antrenor" },
  { ad: "Alper Gormezler", unvan: "Isletme Muduru" },
]

const FAQ_ITEMS = [
  { q: "YiSA-S nedir?", a: "Spor tesislerini AI robotlarla yoneten franchise sistemidir. Cimnastik, yuzme ve benzeri tesisler icin otomatik yonetim, veli takibi ve veri odakli egitim sunar." },
  { q: "Demo nasil talep edilir?", a: "Bu sayfadaki Demo Talep Et butonuna tiklayin, formu doldurun. 10 is gunu icinde sizinle iletisime gececegiz." },
  { q: "Hangi paket bana uygun?", a: "Kucuk tesisler icin Starter, orta olcek icin Pro, cok subeli isletmeler icin Enterprise onerilir." },
  { q: "Pilot tesis nedir?", a: "Tuzla Besiktas Cimnastik Okulu ilk pilot tesisimizdir. Demo girisi ile paneli deneyebilirsiniz." },
]

const DERS_PROGRAMI = [
  { gun: "Pazartesi", saat: "15:00-16:30", brans: "Cimnastik", grup: "Mini (5-7)", antrenor: "Ozlem K." },
  { gun: "Pazartesi", saat: "17:00-18:30", brans: "Cimnastik", grup: "Midi (8-12)", antrenor: "Emre H." },
  { gun: "Sali", saat: "15:00-16:30", brans: "Yuzme", grup: "Baslangic", antrenor: "Merve G." },
  { gun: "Sali", saat: "17:00-18:30", brans: "Basketbol", grup: "U12", antrenor: "Alper G." },
  { gun: "Carsamba", saat: "15:00-16:30", brans: "Cimnastik", grup: "Mini (5-7)", antrenor: "Ozlem K." },
  { gun: "Persembe", saat: "15:00-16:30", brans: "Voleybol", grup: "U14", antrenor: "Emre H." },
  { gun: "Cuma", saat: "15:00-16:30", brans: "Tenis", grup: "Baslangic", antrenor: "Merve G." },
  { gun: "Cumartesi", saat: "10:00-12:00", brans: "Futbol", grup: "U10", antrenor: "Alper G." },
]

const BRANSLAR = [
  { name: "Cimnastik", icon: Target, color: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/30" },
  { name: "Yuzme", icon: Waves, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30" },
  { name: "Basketbol", icon: Dumbbell, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30" },
  { name: "Voleybol", icon: Dumbbell, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
  { name: "Futbol", icon: Dumbbell, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/30" },
  { name: "Tenis", icon: Target, color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/30" },
]

const PANELLER = [
  { title: "Veli Paneli", desc: "Cocuk gelisimi, odeme takibi, antrenman takvimi, mesajlasma.", icon: User, color: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/30" },
  { title: "Sporcu Paneli", desc: "Antrenman programi, olcum sonuclari, gelisim grafikleri.", icon: Dumbbell, color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/30" },
  { title: "Antrenor Paneli", desc: "Yoklama, sinif yonetimi, sporcu olcumleri, haftalik plan.", icon: Users, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
]

const ROBOTLAR = [
  { name: "CELF Robotu", desc: "Merkezi karar motoru, gorev dagitimi, onay surecleri.", icon: Brain, color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/30" },
  { name: "Veri Robotu", desc: "Veritabani izleme, performans metrikleri, raporlama.", icon: Database, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
  { name: "Guvenlik Robotu", desc: "Siber guvenlik, erisim kontrolu, 4 seviye alarm.", icon: Shield, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/30" },
  { name: "YiSA-S Robotu", desc: "Sistem durumu, PWA izleme, deployment kontrolu.", icon: Bot, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/30" },
]

/* ----------------------------------------------------------------
   MAIN COMPONENT
   ---------------------------------------------------------------- */
export default function HomePage() {
  const [activeSection, setActiveSection] = useState<SectionId>("hero")
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ ad: "", email: "", telefon: "", tesis_turu: "", sehir: "", brans: "" })
  const [formSending, setFormSending] = useState(false)
  const [formDone, setFormDone] = useState(false)
  const [mobileMore, setMobileMore] = useState(false)

  const handleNav = useCallback((id: SectionId) => {
    setActiveSection(id)
    setMobileMore(false)
  }, [])

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
          branch: formData.brans || null,
          source: "www",
        }),
      })
      const data = await res.json()
      if (data?.ok) {
        setFormDone(true)
        setFormData({ ad: "", email: "", telefon: "", tesis_turu: "", sehir: "", brans: "" })
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

  const renderSection = () => {
    switch (activeSection) {
      case "hero":
        return <SectionHero onDemo={() => setShowForm(true)} />
      case "neden":
        return <SectionNeden />
      case "ders":
        return <SectionDers />
      case "paneller":
        return <SectionPaneller />
      case "branslar":
        return <SectionBranslar />
      case "kredi":
        return <SectionKredi />
      case "direktorler":
        return <SectionDirektorler />
      case "robotlar":
        return <SectionRobotlar />
      case "franchise":
        return <SectionFranchise onDemo={() => setShowForm(true)} />
      case "sss":
        return <SectionSSS />
      case "iletisim":
        return <SectionIletisim onDemo={() => setShowForm(true)} />
      default:
        return <SectionHero onDemo={() => setShowForm(true)} />
    }
  }

  return (
    <div className="tv-layout">
      {/* DESKTOP: Sol fixed navbar + Sag content */}
      <div className="hidden md:flex h-screen w-screen overflow-hidden">
        {/* Sol Navbar - 60px fixed */}
        <nav className="tv-sidebar">
          <Link href="/" className="mb-2 flex-shrink-0">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/20 flex items-center justify-center hover:bg-cyan-500/30 transition-colors">
              <span className="text-cyan-400 font-bold text-sm">Y</span>
            </div>
          </Link>
          <div className="flex flex-col gap-0.5 flex-1 overflow-y-auto py-1">
            {NAV_SECTIONS.map((sec) => {
              const Icon = sec.icon
              const isActive = activeSection === sec.id
              return (
                <button
                  key={sec.id}
                  onClick={() => handleNav(sec.id)}
                  className={`tv-sidebar-btn ${isActive ? "tv-sidebar-btn-active" : ""}`}
                  title={sec.label}
                >
                  <Icon className="h-4 w-4 mb-0.5 flex-shrink-0" strokeWidth={isActive ? 2 : 1.5} />
                  <span className="text-[9px] leading-tight font-medium truncate w-full text-center">{sec.label}</span>
                </button>
              )
            })}
          </div>
          <Link href="/auth/login" className="flex-shrink-0 mt-1">
            <div className="tv-sidebar-btn hover:text-cyan-400">
              <Crown className="h-4 w-4 mb-0.5" strokeWidth={1.5} />
              <span className="text-[9px] leading-tight font-medium">Giris</span>
            </div>
          </Link>
        </nav>

        {/* Sag Content - slide transition 0.4s */}
        <main className="flex-1 h-screen overflow-hidden relative bg-gray-950">
          <div key={activeSection} className="tv-content-slide">
            {renderSection()}
          </div>
        </main>
      </div>

      {/* MOBILE: Ust header + Content + Alt tab bar */}
      <div className="flex md:hidden flex-col h-screen w-screen overflow-hidden">
        <header className="flex items-center justify-between px-4 py-2.5 border-b border-gray-800 bg-gray-950/95 backdrop-blur-md flex-shrink-0">
          <YisaLogoInline href="/" />
          <Link href="/auth/login">
            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white text-xs h-8 px-2">
              <Crown className="h-3.5 w-3.5 mr-1" /> Giris
            </Button>
          </Link>
        </header>

        <main className="flex-1 overflow-y-auto relative bg-gray-950">
          <div key={activeSection} className="tv-content-slide">
            {renderSection()}
          </div>
        </main>

        {/* Mobile alt tab bar */}
        <nav className="tv-mobile-tabbar">
          {NAV_SECTIONS.slice(0, 5).map((sec) => {
            const Icon = sec.icon
            const isActive = activeSection === sec.id
            return (
              <button
                key={sec.id}
                onClick={() => handleNav(sec.id)}
                className={`tv-mobile-tab ${isActive ? "tv-mobile-tab-active" : ""}`}
              >
                <Icon className="h-4 w-4" strokeWidth={isActive ? 2 : 1.5} />
                <span className="text-[8px] mt-0.5">{sec.label}</span>
              </button>
            )
          })}
          <div className="relative">
            <button
              onClick={() => setMobileMore(!mobileMore)}
              className={`tv-mobile-tab ${["kredi", "direktorler", "robotlar", "franchise", "sss", "iletisim"].includes(activeSection) ? "tv-mobile-tab-active" : ""}`}
            >
              <Layers className="h-4 w-4" strokeWidth={1.5} />
              <span className="text-[8px] mt-0.5">Daha</span>
            </button>
            {mobileMore && (
              <div className="absolute bottom-full right-0 mb-2 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl p-2 min-w-[140px] z-50">
                {NAV_SECTIONS.slice(5).map((sec) => {
                  const Icon = sec.icon
                  const isActive = activeSection === sec.id
                  return (
                    <button
                      key={sec.id}
                      onClick={() => handleNav(sec.id)}
                      className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-colors ${
                        isActive ? "bg-cyan-500/20 text-cyan-400" : "text-gray-400 hover:text-white hover:bg-gray-800"
                      }`}
                    >
                      <Icon className="h-4 w-4" strokeWidth={1.5} />
                      {sec.label}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </nav>
      </div>

      <FloatingWhatsApp />

      {/* Demo Form Modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-6"
          onClick={() => setShowForm(false)}
        >
          <Card
            className="bg-gray-900 border-gray-700 rounded-2xl p-6 sm:p-10 w-full max-w-md shadow-xl shadow-pink-500/10"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <CardHeader>
              <CardTitle className="text-2xl">Demo Talep Formu</CardTitle>
              <CardDescription>10 is gunu icinde donus yapilacaktir.</CardDescription>
            </CardHeader>
            <CardContent>
              {formDone ? (
                <p className="text-emerald-400 text-center py-8 font-medium">Basvurunuz alindi. Tesekkurler!</p>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input placeholder="Ad Soyad" value={formData.ad} onChange={(e) => setFormData({ ...formData, ad: e.target.value })} className="bg-gray-800 border-gray-700 h-12 rounded-xl text-white placeholder:text-gray-500" required />
                  <Input type="email" placeholder="E-posta" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="bg-gray-800 border-gray-700 h-12 rounded-xl text-white placeholder:text-gray-500" required />
                  <Input placeholder="Telefon" value={formData.telefon} onChange={(e) => setFormData({ ...formData, telefon: e.target.value })} className="bg-gray-800 border-gray-700 h-12 rounded-xl text-white placeholder:text-gray-500" />
                  <Input placeholder="Tesis turu (orn. Cimnastik)" value={formData.tesis_turu} onChange={(e) => setFormData({ ...formData, tesis_turu: e.target.value })} className="bg-gray-800 border-gray-700 h-12 rounded-xl text-white placeholder:text-gray-500" />
                  <Input placeholder="Sehir" value={formData.sehir} onChange={(e) => setFormData({ ...formData, sehir: e.target.value })} className="bg-gray-800 border-gray-700 h-12 rounded-xl text-white placeholder:text-gray-500" required />
                  <select value={formData.brans} onChange={(e) => setFormData({ ...formData, brans: e.target.value })} className="flex h-12 w-full rounded-xl border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white">
                    <option value="">Brans Seciniz (opsiyonel)</option>
                    <option value="Cimnastik">Cimnastik</option>
                    <option value="Yuzme">Yuzme</option>
                    <option value="Basketbol">Basketbol</option>
                    <option value="Voleybol">Voleybol</option>
                    <option value="Futbol">Futbol</option>
                    <option value="Tenis">Tenis</option>
                    <option value="Diger">Diger</option>
                  </select>
                  <Button type="submit" disabled={formSending} className="w-full rounded-xl bg-pink-500 text-white hover:bg-pink-600 h-12 font-medium">
                    {formSending ? "Gonderiliyor..." : "Gonder"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

/* ----------------------------------------------------------------
   SECTION COMPONENTS -- her biri 100vh content
   ---------------------------------------------------------------- */

function SectionHero({ onDemo }: { onDemo: () => void }) {
  return (
    <div className="h-full flex flex-col items-center justify-center px-6 text-center relative overflow-hidden min-h-[calc(100vh-56px)] md:min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-pink-500/5 pointer-events-none" />
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 max-w-3xl relative">
        Tesisinizi AI Robotlarla Yonetin
      </h1>
      <p className="text-gray-400 max-w-xl mb-10 text-sm sm:text-base md:text-lg relative">
        Cimnastik ve spor tesisi yonetimi. Ders programi, yoklama, veli takibi -- hepsi otomatik.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 relative">
        <Link href="/auth/login">
          <Button size="lg" className="rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white px-8 h-12 font-semibold text-base shadow-lg shadow-emerald-500/25">
            Giris Yap
          </Button>
        </Link>
        <Button onClick={onDemo} size="lg" variant="outline" className="rounded-xl border-pink-500/40 text-pink-300 hover:bg-pink-500/20 px-8 h-12 font-medium">
          Demo Talep Et
        </Button>
      </div>
    </div>
  )
}

function SectionNeden() {
  return (
    <div className="h-full flex flex-col items-center justify-center px-6 overflow-y-auto py-8 md:py-12">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-white">Neler Sunuyoruz?</h2>
      <p className="text-center text-gray-400 mb-8 md:mb-12 max-w-2xl mx-auto text-sm md:text-base">AI robotlar, otomatik yonetim ve veli takibi ile tesisinizi verimli yonetin.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl w-full">
        {FEATURES.map((f, i) => {
          const Icon = f.icon
          const accents = [
            { bg: "bg-pink-500/20", text: "text-pink-400", border: "border-pink-500/30" },
            { bg: "bg-blue-500/20", text: "text-blue-400", border: "border-blue-500/30" },
            { bg: "bg-amber-500/20", text: "text-amber-400", border: "border-amber-500/30" },
            { bg: "bg-emerald-500/20", text: "text-emerald-400", border: "border-emerald-500/30" },
          ]
          const a = accents[i % accents.length]
          return (
            <Card key={f.title} className={`bg-gray-900 border ${a.border} rounded-2xl overflow-hidden hover:shadow-lg transition-all`}>
              <CardHeader className="pb-2">
                <div className={`flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl ${a.bg} ${a.text} mb-2`}>
                  <Icon className="h-5 w-5 md:h-6 md:w-6" />
                </div>
                <CardTitle className="text-base md:text-lg text-white">{f.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs md:text-sm text-gray-400">{f.desc}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

function SectionDers() {
  return (
    <div className="h-full flex flex-col items-center justify-center px-4 md:px-6 overflow-y-auto py-8 md:py-12">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-white">Ders Programi</h2>
      <p className="text-center text-gray-400 mb-6 md:mb-8 max-w-2xl text-sm md:text-base">Pilot tesis -- Tuzla BJK Cimnastik Okulu haftalik program.</p>
      <div className="max-w-4xl w-full overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left p-2 md:p-3 text-gray-400 text-xs md:text-sm font-medium">Gun</th>
              <th className="text-left p-2 md:p-3 text-gray-400 text-xs md:text-sm font-medium">Saat</th>
              <th className="text-left p-2 md:p-3 text-gray-400 text-xs md:text-sm font-medium">Brans</th>
              <th className="text-left p-2 md:p-3 text-gray-400 text-xs md:text-sm font-medium hidden sm:table-cell">Grup</th>
              <th className="text-left p-2 md:p-3 text-gray-400 text-xs md:text-sm font-medium hidden sm:table-cell">Antrenor</th>
            </tr>
          </thead>
          <tbody>
            {DERS_PROGRAMI.map((d, i) => (
              <tr key={i} className="border-b border-gray-800 hover:bg-gray-900/50 transition-colors">
                <td className="p-2 md:p-3 text-xs md:text-sm text-white font-medium">{d.gun}</td>
                <td className="p-2 md:p-3 text-xs md:text-sm text-cyan-400">{d.saat}</td>
                <td className="p-2 md:p-3 text-xs md:text-sm text-white">{d.brans}</td>
                <td className="p-2 md:p-3 text-xs md:text-sm text-gray-400 hidden sm:table-cell">{d.grup}</td>
                <td className="p-2 md:p-3 text-xs md:text-sm text-gray-400 hidden sm:table-cell">{d.antrenor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 md:mt-8">
        <Link href="/kayit">
          <Button className="rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white px-6 h-10 md:h-11 text-sm md:text-base">
            Deneme Dersi Al
          </Button>
        </Link>
      </div>
    </div>
  )
}

function SectionPaneller() {
  return (
    <div className="h-full flex flex-col items-center justify-center px-6 overflow-y-auto py-8 md:py-12">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-white">3 Panel, Tek Sistem</h2>
      <p className="text-center text-gray-400 mb-8 md:mb-12 max-w-2xl text-sm md:text-base">Veli, sporcu ve antrenor panelleri ayni veritabanina bagli calisir.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl w-full">
        {PANELLER.map((panel) => {
          const Icon = panel.icon
          return (
            <Card key={panel.title} className={`bg-gray-900 border ${panel.border} rounded-2xl hover:shadow-lg transition-all`}>
              <CardHeader className="text-center">
                <div className={`h-14 w-14 md:h-16 md:w-16 mx-auto rounded-2xl ${panel.bg} flex items-center justify-center mb-2`}>
                  <Icon className={`h-7 w-7 md:h-8 md:w-8 ${panel.color}`} strokeWidth={1.5} />
                </div>
                <CardTitle className="text-lg md:text-xl text-white">{panel.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs md:text-sm text-gray-400 text-center">{panel.desc}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

function SectionBranslar() {
  return (
    <div className="h-full flex flex-col items-center justify-center px-6 overflow-y-auto py-8 md:py-12">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-white">Spor Branslari</h2>
      <p className="text-center text-gray-400 mb-8 md:mb-12 max-w-2xl text-sm md:text-base">6 farkli bransta profesyonel egitim ve takip sistemi.</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl w-full">
        {BRANSLAR.map((b) => {
          const Icon = b.icon
          return (
            <Card key={b.name} className={`bg-gray-900 border ${b.border} rounded-2xl hover:shadow-lg transition-all text-center`}>
              <CardContent className="p-4 md:p-6">
                <div className={`h-12 w-12 md:h-14 md:w-14 mx-auto rounded-2xl ${b.bg} flex items-center justify-center mb-3 md:mb-4`}>
                  <Icon className={`h-6 w-6 md:h-7 md:w-7 ${b.color}`} strokeWidth={1.5} />
                </div>
                <p className="text-base md:text-lg font-semibold text-white">{b.name}</p>
                <p className="text-[10px] md:text-xs text-gray-400 mt-1">Ders programi, yoklama, olcum</p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

function SectionKredi() {
  return (
    <div className="h-full flex flex-col items-center justify-center px-6 overflow-y-auto py-8 md:py-12">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-white">Paketler</h2>
      <p className="text-center text-gray-400 mb-8 md:mb-12 max-w-xl text-sm md:text-base">Ihtiyaciniza uygun paketi secin.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl w-full">
        {PACKAGES.map((pkg) => (
          <Card
            key={pkg.name}
            className={`rounded-2xl overflow-hidden ${
              pkg.highlight
                ? "border-pink-500/50 bg-pink-500/10 ring-2 ring-pink-500/30 shadow-lg shadow-pink-500/10"
                : "bg-gray-900 border-gray-800"
            }`}
          >
            <CardHeader>
              <CardTitle className="text-lg md:text-xl text-white">{pkg.name}</CardTitle>
              <CardDescription className="text-gray-400">
                <span className={`text-xl md:text-2xl font-bold ${pkg.highlight ? "text-pink-400" : "text-emerald-400"}`}>{pkg.price}</span>
                <span className="text-sm font-normal">{pkg.period}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 md:space-y-3">
                {pkg.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs md:text-sm text-gray-300">
                    <Check className={`h-3.5 w-3.5 md:h-4 md:w-4 shrink-0 ${pkg.highlight ? "text-pink-400" : "text-emerald-400"}`} />
                    {f}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Link href="/fiyatlar" className="w-full">
                <Button variant={pkg.highlight ? "default" : "outline"} className={`w-full rounded-xl text-sm ${pkg.highlight ? "bg-pink-500 hover:bg-pink-600" : "border-gray-600 text-white hover:bg-gray-800"}`}>
                  Detay
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

function SectionDirektorler() {
  return (
    <div className="h-full flex flex-col items-center justify-center px-6 overflow-y-auto py-8 md:py-12">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-white">Ilk Pilot Tesisimiz</h2>
      <p className="text-center text-gray-400 mb-8 md:mb-12 max-w-xl text-sm md:text-base">Tuzla Besiktas Cimnastik Okulu -- Demo girisi ile paneli deneyin.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 max-w-3xl w-full">
        {REFERANSLAR.map((r, i) => (
          <Card key={i} className="bg-gray-900 border-gray-800 rounded-2xl hover:border-pink-500/30 transition-colors">
            <CardContent className="flex items-center gap-3 md:gap-4 p-4 md:p-6">
              <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-pink-500/20 text-pink-400 shrink-0">
                <User className="h-5 w-5 md:h-6 md:w-6" />
              </div>
              <div>
                <p className="font-semibold text-white text-sm md:text-base">{r.ad}</p>
                <p className="text-xs md:text-sm text-gray-400">{r.unvan}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-8 md:mt-10">
        <Link href="/patron/login">
          <Button className="rounded-xl bg-pink-500 hover:bg-pink-600 text-white px-6 h-10 md:h-11 shadow-lg shadow-pink-500/20 text-sm md:text-base">
            Giris Yap -- Deneyin
          </Button>
        </Link>
      </div>
    </div>
  )
}

function SectionRobotlar() {
  return (
    <div className="h-full flex flex-col items-center justify-center px-6 overflow-y-auto py-8 md:py-12">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-white">4 AI Robot</h2>
      <p className="text-center text-gray-400 mb-8 md:mb-12 max-w-2xl text-sm md:text-base">Tesisinizi 7/24 yoneten yapay zeka robotlari.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl w-full">
        {ROBOTLAR.map((robot) => {
          const Icon = robot.icon
          return (
            <Card key={robot.name} className={`bg-gray-900 border ${robot.border} rounded-2xl hover:shadow-lg transition-all`}>
              <CardHeader className="pb-2">
                <div className={`h-10 w-10 md:h-12 md:w-12 rounded-xl ${robot.bg} flex items-center justify-center mb-2`}>
                  <Icon className={`h-5 w-5 md:h-6 md:w-6 ${robot.color}`} strokeWidth={1.5} />
                </div>
                <CardTitle className="text-base md:text-lg text-white">{robot.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs md:text-sm text-gray-400">{robot.desc}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>
      <div className="mt-8 md:mt-10">
        <Link href="/robot">
          <Button variant="outline" className="rounded-xl border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/20 px-6 h-10 md:h-11 text-sm md:text-base">
            Robot Komuta Merkezi
          </Button>
        </Link>
      </div>
    </div>
  )
}

function SectionFranchise({ onDemo }: { onDemo: () => void }) {
  return (
    <div className="h-full flex flex-col items-center justify-center px-6 overflow-y-auto py-8 md:py-12">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-white">Franchise Sistemi</h2>
      <p className="text-center text-gray-400 mb-8 md:mb-12 max-w-2xl text-sm md:text-base">Kendi spor tesisinizi YiSA-S altyapisiyla yonetin. Subdomain, ozel tema, beyaz etiket destegi.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl w-full">
        <Card className="bg-gray-900 border-cyan-500/30 rounded-2xl">
          <CardHeader className="pb-2">
            <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-2">
              <Globe className="h-5 w-5 md:h-6 md:w-6 text-cyan-400" strokeWidth={1.5} />
            </div>
            <CardTitle className="text-base md:text-lg text-white">Subdomain</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs md:text-sm text-gray-400">tesisiniz.yisa-s.com adresiyle aninda yayinda.</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-emerald-500/30 rounded-2xl">
          <CardHeader className="pb-2">
            <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-2">
              <Store className="h-5 w-5 md:h-6 md:w-6 text-emerald-400" strokeWidth={1.5} />
            </div>
            <CardTitle className="text-base md:text-lg text-white">Ozel Domain</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs md:text-sm text-gray-400">CNAME ile kendi domaininizi baglayin.</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-pink-500/30 rounded-2xl">
          <CardHeader className="pb-2">
            <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-pink-500/10 flex items-center justify-center mb-2">
              <Layers className="h-5 w-5 md:h-6 md:w-6 text-pink-400" strokeWidth={1.5} />
            </div>
            <CardTitle className="text-base md:text-lg text-white">Embed Widget</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs md:text-sm text-gray-400">Mevcut sitenize iframe ile entegre edin.</p>
          </CardContent>
        </Card>
      </div>
      <div className="mt-8 md:mt-10">
        <Button onClick={onDemo} className="rounded-xl bg-amber-500 text-black hover:bg-amber-400 px-8 h-10 md:h-12 font-semibold text-sm md:text-base">
          Franchise Basvurusu
        </Button>
      </div>
    </div>
  )
}

function SectionSSS() {
  return (
    <div className="h-full flex flex-col items-center justify-center px-6 overflow-y-auto py-8 md:py-12">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-white">Sikca Sorulan Sorular</h2>
      <p className="text-center text-gray-400 mb-8 md:mb-12 text-sm md:text-base">Merak ettiklerinizin yanitlari.</p>
      <div className="max-w-3xl w-full">
        <Accordion type="single" collapsible className="w-full">
          {FAQ_ITEMS.map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-sm md:text-base">{item.q}</AccordionTrigger>
              <AccordionContent className="text-xs md:text-sm">{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}

function SectionIletisim({ onDemo }: { onDemo: () => void }) {
  return (
    <div className="h-full flex flex-col items-center justify-center px-6 overflow-y-auto py-8 md:py-12">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-white">Iletisim</h2>
      <p className="text-center text-gray-400 mb-8 md:mb-12 max-w-xl text-sm md:text-base">Sorulariniz icin bize ulasin.</p>
      <div className="max-w-md w-full space-y-4 md:space-y-6">
        <Card className="bg-gray-900 border-gray-800 rounded-2xl">
          <CardContent className="p-4 md:p-6 space-y-3 md:space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 md:h-5 md:w-5 text-cyan-400 shrink-0" />
              <span className="text-gray-300 text-sm md:text-base">info@yisa-s.com</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 md:h-5 md:w-5 text-emerald-400 shrink-0" />
              <a href="tel:+905332491903" className="text-gray-300 hover:text-white transition-colors text-sm md:text-base">0533 249 1903</a>
            </div>
            <div className="flex items-center gap-3">
              <MessageCircle className="h-4 w-4 md:h-5 md:w-5 text-green-400 shrink-0" />
              <a href="https://wa.me/905332491903" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors text-sm md:text-base">
                WhatsApp ile Yazin
              </a>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 md:h-5 md:w-5 text-pink-400 shrink-0" />
              <span className="text-gray-300 text-sm md:text-base">Tuzla, Istanbul</span>
            </div>
          </CardContent>
        </Card>
        <div className="flex flex-col gap-3">
          <Button onClick={onDemo} className="rounded-xl bg-amber-500 text-black hover:bg-amber-400 h-10 md:h-12 font-semibold w-full text-sm md:text-base">
            Franchise / Demo Basvurusu
          </Button>
          <a href="https://wa.me/905332491903" target="_blank" rel="noopener noreferrer" className="w-full">
            <Button variant="outline" className="rounded-xl border-green-500/40 text-green-400 hover:bg-green-500/20 h-10 md:h-12 w-full text-sm md:text-base">
              <MessageCircle className="h-4 w-4 mr-2" /> WhatsApp
            </Button>
          </a>
        </div>
      </div>
      <p className="text-center text-gray-500 text-xs md:text-sm mt-8 md:mt-10">&copy; 2026 YiSA-S — Tum haklari saklidir.</p>
      <div className="flex items-center justify-center gap-4 mt-4">
        <a href="https://instagram.com/yisas" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-pink-400 transition-colors text-sm">Instagram</a>
        <a href="https://facebook.com/yisas" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-400 transition-colors text-sm">Facebook</a>
      </div>
    </div>
  )
}

/* Floating WhatsApp Button — tum sectionlarda gorunur */
function FloatingWhatsApp() {
  return (
    <a
      href="https://wa.me/905332491903"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 md:bottom-6 left-6 z-40 flex items-center gap-2 px-4 py-3 rounded-full bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-600/30 transition-all hover:scale-105"
      aria-label="WhatsApp ile iletisime gecin"
    >
      <MessageCircle className="h-5 w-5" />
      <span className="hidden sm:inline text-sm font-medium">WhatsApp</span>
    </a>
  )
}
