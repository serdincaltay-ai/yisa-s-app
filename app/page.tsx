"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ArrowRight,
  Bot,
  BarChart3,
  Dumbbell,
  Heart,
  Target,
  Zap,
  Shield,
  FileCheck,
  User,
  LogIn,
} from "lucide-react"
import Link from "next/link"
import { YisaLogoInline } from "@/components/YisaLogo"

const SLIDER_SLOGANS = [
  "Teknolojiyi spora başlattık.",
  "Teknolojide spor artık bizim.",
  "Sistem spor disiplini oluşturur.",
  "Başlayanlar bırakamıyor — 3–4 sene gelir.",
  "Cimnastik tesisi yönetimi — robotlar yürütür.",
  "Zorlamak yok. Kendiyle yarışacak.",
  "Spor hayatını kur. Takip ediyoruz.",
]

const SLOGANS = [
  "Zorlamak yok.",
  "Zorla yaptırmak yok.",
  "Kızmak yok — sabırlı olacağız.",
  "Soğutmayacağız, sevdireceğiz.",
  "Kendiyle yarışacak — dünden daha iyi.",
  "Müsabaka ortamı değil.",
]

const REFERANSLAR = [
  { ad: "Merve Görmezler", unvan: "Firma Sahibi, Sportif Direktör" },
  { ad: "Emre Han Dalgıç", unvan: "Uzman Antrenör" },
  { ad: "Özlem Kuşkan", unvan: "Antrenör" },
  { ad: "Alper Görmezler", unvan: "İşletme Müdürü" },
]

export default function Home() {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ ad: "", telefon: "", sehir: "" })
  const [sliderIndex, setSliderIndex] = useState(0)

  useEffect(() => {
    const t = setInterval(() => {
      setSliderIndex((i) => (i + 1) % SLIDER_SLOGANS.length)
    }, 4500)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden relative">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <FloatingBall size={380} color="emerald" top="8%" left="-5%" delay={0} />
        <FloatingBall size={260} color="cyan" top="55%" right="-8%" delay={2} />
        <FloatingBall size={160} color="purple" bottom="15%" left="25%" delay={4} />
      </div>
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <YisaLogoInline href="/" />
            <span className="hidden md:inline text-sm text-white/50">Cimnastik ve spor tesisi yönetimi · Robotlar yürütür</span>
          </div>
          <Link href="/auth/login">
            <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10 rounded-full gap-2">
              <LogIn className="h-4 w-4" />
              Giriş — İşletmeci Paneli
            </Button>
          </Link>
        </div>
      </nav>

      <main className="relative z-10">
        <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center pt-16">
          <p className="text-white/70 text-sm sm:text-base mb-6 max-w-2xl">
            Cimnastik ve spor tesisi yönetimi. İşletmeyi robotlar yürütür — siz yönetirsiniz.
          </p>
          <div className="min-h-[3rem] flex items-center justify-center mb-6">
            <p key={sliderIndex} className="text-lg sm:text-xl text-emerald-400 font-medium animate-fade-in max-w-xl">
              {SLIDER_SLOGANS[sliderIndex]}
            </p>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight mb-6 max-w-4xl">
            <span className="block text-white/95">Spor yap.</span>
            <span className="block text-white/95">Spor hayatını devam ettir.</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mt-2">
              Cimnastik ile çocuğun spor hayatı — biz çok önemsiyoruz.
            </span>
          </h1>
          <p className="text-lg text-white/50 max-w-xl mb-10">
            Bugünkü çocuğun bugününü düşünmüyoruz. Yarını kuruyoruz.
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-12 text-sm text-white/60 max-w-3xl">
            {SLOGANS.map((s, i) => (
              <span key={i}>{s}</span>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/auth/login">
              <Button size="lg" className="rounded-full bg-white text-black hover:bg-white/90 px-8 h-12 text-base font-medium w-full sm:w-auto">
                Giriş Yap — Panelimi Aç
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button
              onClick={() => setShowForm(true)}
              size="lg"
              variant="outline"
              className="rounded-full border-white/20 bg-white/5 hover:bg-white/10 px-8 h-12 text-base w-full sm:w-auto"
            >
              Franchise Başvurusu
            </Button>
          </div>
          <p className="mt-8 text-xs text-white/40 max-w-md">
            Bu sayfa <strong className="text-white/60">demo işletmeci</strong> içindir. Giriş yapın, üyelerinizi görün, kampanyalarınızı çalıştırın.
          </p>
        </section>

        <section className="max-w-5xl mx-auto px-6 py-20 border-t border-white/5">
          <h2 className="text-2xl font-bold text-center mb-3 text-white/90">
            CO Vitrin — Buradan alın, paneline çekin
          </h2>
          <p className="text-center text-white/50 mb-14 max-w-xl mx-auto text-sm">
            Giriş yapın. İstediklerinizi buradan alın, sürekli paneline atalım. Üyelerinizi görün, üyeye reklam çıkarın — hepsi panelde.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <BentoCard icon={Bot} title="Robotlar tesisi yönetir" desc="Mailler, demolar, aidat takibi. Çok kolay." color="emerald" />
            <BentoCard icon={Dumbbell} title="Antrenör veritabanından beslenir" desc="Parametreler, çocuk faydası, ölçümlerle eğitim." color="cyan" />
            <BentoCard icon={BarChart3} title="Ölçümlerle eğitim" desc="Çocuk gelişimi veriyle takip. Grafikler, raporlar." color="purple" />
            <BentoCard icon={Zap} title="Teknolojiyi spora başlattık" desc="Bilimsel veri, etik değerler. Sınırlarımız net." color="amber" />
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-6 py-20 border-t border-white/5">
          <h2 className="text-2xl font-bold text-center mb-4 text-white/90">
            Çocuk kendiyle yarışır. Dünden daha iyi.
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <DemoChartCard title="Esneklik" value={78} trend="+5" />
            <DemoChartCard title="Kuvvet" value={65} trend="+8" />
            <DemoChartCard title="Sürat" value={72} trend="+3" />
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/70 flex items-center gap-1.5 w-fit">
              <Heart className="h-3.5 w-3.5 text-emerald-400" /> Sağlık taraması
            </span>
            <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/70 flex items-center gap-1.5 w-fit">
              <Target className="h-3.5 w-3.5 text-cyan-400" /> Branş yönlendirme
            </span>
            <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/70 flex items-center gap-1.5 w-fit">
              <FileCheck className="h-3.5 w-3.5 text-purple-400" /> Raporlar
            </span>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-6 py-20 border-t border-white/5">
          <h2 className="text-2xl font-bold text-center mb-2 text-white/90">
            İlk pilot tesisimiz
          </h2>
          <p className="text-center text-white/50 mb-12 text-sm">
            Tuzla Beşiktaş Cimnastik Okulu — Demo girişi için kullanıcı adı ve şifrenizle paneli deneyin.
          </p>
          <div className="rounded-2xl bg-white/5 border border-white/10 p-8">
            <p className="text-center font-semibold text-white/90 mb-6">Tuzla Beşiktaş Cimnastik Okulu</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {REFERANSLAR.map((r, i) => (
                <div key={i} className="flex items-center gap-4 rounded-xl bg-white/5 border border-white/10 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-medium text-white/90">{r.ad}</p>
                    <p className="text-sm text-white/50">{r.unvan}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link href="/auth/login">
                <Button className="rounded-full bg-emerald-500 hover:bg-emerald-600 text-white px-6">
                  Giriş Yap — Deneyin
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-6 py-16 text-center border-t border-white/5">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-8">
            <Shield className="h-10 w-10 text-emerald-400 mx-auto mb-4" />
            <p className="text-lg text-white/90 font-medium mb-4">
              Spor tesislerini teknoloji ve bilimle yönetiyoruz. Çocukların gelişimini veriyle takip ediyoruz. İşletmecinin işini kolaylaştırıyoruz.
            </p>
            <p className="text-white/50 text-xs mb-6">YISA-S — Anayasamıza uygun.</p>
            <Button onClick={() => setShowForm(true)} size="lg" className="rounded-full bg-emerald-500 text-white hover:bg-emerald-600 px-6 h-11">
              Franchise Başvurusu
            </Button>
          </div>
        </section>

        <footer className="py-8 text-center border-t border-white/5 space-y-2">
          <p className="text-white/40 text-sm">YISA-S · Tesis işletmecileri için robot yönetimli spor tesisi franchise</p>
          <p className="text-white/30 text-xs">Cursor ile geliştirildi — bu proje olmadan aylar sürerdi.</p>
        </footer>
      </main>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-6" onClick={() => setShowForm(false)}>
          <div className="bg-[#111] border border-white/10 rounded-3xl p-10 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-bold mb-2">Franchise Başvurusu</h3>
            <p className="text-white/40 mb-8">10 gün içinde dönüş yapılacaktır.</p>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                alert("Başvurunuz alındı!")
                setShowForm(false)
              }}
              className="space-y-4"
            >
              <Input placeholder="Ad Soyad" value={formData.ad} onChange={(e) => setFormData({ ...formData, ad: e.target.value })} className="bg-white/5 border-white/10 h-12 rounded-xl" required />
              <Input placeholder="Telefon" value={formData.telefon} onChange={(e) => setFormData({ ...formData, telefon: e.target.value })} className="bg-white/5 border-white/10 h-12 rounded-xl" required />
              <Input placeholder="Şehir" value={formData.sehir} onChange={(e) => setFormData({ ...formData, sehir: e.target.value })} className="bg-white/5 border-white/10 h-12 rounded-xl" required />
              <Button type="submit" className="w-full rounded-xl bg-white text-black hover:bg-white/90 h-12 font-medium">Gönder</Button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function BentoCard({
  icon: Icon,
  title,
  desc,
  color,
}: {
  icon: React.ElementType
  title: string
  desc: string
  color: "emerald" | "cyan" | "purple" | "amber"
}) {
  const colors = {
    emerald: "from-emerald-500/20 to-emerald-500/5 text-emerald-400",
    cyan: "from-cyan-500/20 to-cyan-500/5 text-cyan-400",
    purple: "from-purple-500/20 to-purple-500/5 text-purple-400",
    amber: "from-amber-500/20 to-amber-500/5 text-amber-400",
  }
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/[0.07] transition">
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${colors[color]} mb-3`}>
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-base font-semibold text-white/95 mb-1">{title}</h3>
      <p className="text-sm text-white/50">{desc}</p>
    </div>
  )
}

function DemoChartCard({ title, value, trend }: { title: string; value: number; trend: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="flex justify-between items-center mb-3">
        <span className="text-white/70 font-medium text-sm">{title}</span>
        <span className="text-emerald-400 text-xs">{trend}</span>
      </div>
      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
        <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-700" style={{ width: `${value}%` }} />
      </div>
      <p className="text-xl font-bold text-white/90 mt-2">{value}/100</p>
    </div>
  )
}

function FloatingBall({
  size,
  color,
  top,
  left,
  right,
  bottom,
  delay,
}: {
  size: number
  color: "emerald" | "cyan" | "purple"
  top?: string
  left?: string
  right?: string
  bottom?: string
  delay: number
}) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  useEffect(() => {
    const animate = () => {
      const time = Date.now() / 1000 + delay
      setPosition({ x: Math.sin(time * 0.5) * 25, y: Math.cos(time * 0.3) * 15 })
    }
    const interval = setInterval(animate, 50)
    return () => clearInterval(interval)
  }, [delay])
  const colorMap = {
    emerald: "from-emerald-500/20 to-emerald-500/5",
    cyan: "from-cyan-500/20 to-cyan-500/5",
    purple: "from-purple-500/20 to-purple-500/5",
  }
  return (
    <div
      className={`absolute rounded-full bg-gradient-to-br ${colorMap[color]} blur-3xl`}
      style={{ width: size, height: size, top, left, right, bottom, transform: `translate(${position.x}px, ${position.y}px)`, transition: "transform 0.5s ease-out" }}
    />
  )
}
