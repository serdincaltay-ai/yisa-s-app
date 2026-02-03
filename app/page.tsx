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
  Crown,
  Store,
  LayoutTemplate,
  Users,
  Mail,
  Phone,
  Building2,
  MapPin,
} from "lucide-react"
import Link from "next/link"
import { YisaLogoInline } from "@/components/YisaLogo"

const PACKAGES = [
  {
    name: "Starter",
    price: "499",
    period: "/ay",
    features: ["50 üye", "1 şube", "Temel robotlar", "Veli paneli", "E-posta destek"],
    highlight: false,
  },
  {
    name: "Pro",
    price: "999",
    period: "/ay",
    features: ["200 üye", "3 şube", "Tüm robotlar", "WhatsApp entegrasyonu", "Öncelikli destek", "Gelişim grafikleri"],
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Özel",
    period: "",
    features: ["Sınırsız üye", "Çoklu şube", "Özel entegrasyonlar", "Dedicated destek", "Özelleştirme", "API erişimi"],
    highlight: false,
  },
]

const FEATURES = [
  {
    icon: Bot,
    title: "AI Robotlar",
    desc: "Mailler, demolar, aidat takibi. Karşılama ve acil destek robotları.",
    color: "emerald",
  },
  {
    icon: Zap,
    title: "Otomatik Yönetim",
    desc: "İşletmeyi robotlar yürütür. Ders programı, yoklama, kasa defteri.",
    color: "cyan",
  },
  {
    icon: Users,
    title: "Veli Takibi",
    desc: "Çocuk gelişimi, ölçümler, antrenman programı. Veliler panelden takip eder.",
    color: "purple",
  },
  {
    icon: BarChart3,
    title: "Veri ile Eğitim",
    desc: "Parametreler, grafikler, raporlar. Bilimsel veriyle sporcu gelişimi.",
    color: "amber",
  },
]

const REFERANSLAR = [
  { ad: "Merve Görmezler", unvan: "Firma Sahibi, Sportif Direktör" },
  { ad: "Emre Han Dalgıç", unvan: "Uzman Antrenör" },
  { ad: "Özlem Kuşkan", unvan: "Antrenör" },
  { ad: "Alper Görmezler", unvan: "İşletme Müdürü" },
]

export default function Home() {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    ad: "",
    email: "",
    telefon: "",
    tesis_turu: "",
    sehir: "",
  })
  const [formSending, setFormSending] = useState(false)
  const [formDone, setFormDone] = useState(false)

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
        alert(data?.error || "Kayıt sırasında hata oluştu.")
      }
    } catch {
      alert("Bağlantı hatası. Lütfen tekrar deneyin.")
    } finally {
      setFormSending(false)
    }
  }

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
            <span className="hidden md:inline text-sm text-white/50">Yönetici İşletmeci Sporcu Antrenör Sistemi</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/patron/login">
              <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10 rounded-full gap-2">
                <Crown className="h-4 w-4" />
                <span className="hidden sm:inline">Patron Paneli</span>
              </Button>
            </Link>
            <Link href="/vitrin">
              <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10 rounded-full gap-2">
                <Store className="h-4 w-4" />
                <span className="hidden sm:inline">Sistemi Tanıyın — Franchise</span>
              </Button>
            </Link>
            <Link href="/fiyatlar">
              <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10 rounded-full gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Fiyatlar</span>
              </Button>
            </Link>
            <Link href="/vitrin">
              <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10 rounded-full gap-2">
                <LayoutTemplate className="h-4 w-4" />
                <span className="hidden sm:inline">Vitrin</span>
              </Button>
            </Link>
            <a href="https://veli.yisa-s.com" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10 rounded-full gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Veli Girişi</span>
              </Button>
            </a>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        {/* Hero */}
        <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center pt-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight mb-6 max-w-4xl">
            <span className="block text-white/95">YİSA-S ile</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mt-2">
              Tesisinizi Yönetin
            </span>
          </h1>
          <p className="text-lg text-white/50 max-w-xl mb-10">
            Cimnastik ve spor tesisi yönetimi. AI robotlar işletmeyi yürütür — siz yönetirsiniz.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
            <Link href="/patron/login">
              <Button size="lg" className="rounded-full bg-white text-black hover:bg-white/90 px-8 h-12 text-base font-medium w-full sm:w-auto gap-2">
                <Crown className="h-5 w-5" />
                Patron Paneli — Giriş
                <ArrowRight className="ml-1 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/vitrin">
              <Button size="lg" variant="outline" className="rounded-full border-white/20 bg-white/5 hover:bg-white/10 px-8 h-12 text-base w-full sm:w-auto gap-2">
                <Store className="h-5 w-5" />
                Sistemi Tanıyın — Franchise
              </Button>
            </Link>
            <Button onClick={() => setShowForm(true)} size="lg" variant="outline" className="rounded-full border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 px-8 h-12">
              Demo Talep Et
            </Button>
          </div>
        </section>

        {/* Özellikler */}
        <section className="max-w-5xl mx-auto px-6 py-20 border-t border-white/5">
          <h2 className="text-2xl font-bold text-center mb-3 text-white/90">
            Neler Sunuyoruz?
          </h2>
          <p className="text-center text-white/50 mb-14 max-w-xl mx-auto text-sm">
            AI robotlar, otomatik yönetim ve veli takibi ile tesisinizi verimli yönetin.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((f) => (
              <BentoCard key={f.title} icon={f.icon} title={f.title} desc={f.desc} color={f.color as "emerald" | "cyan" | "purple" | "amber"} />
            ))}
          </div>
        </section>

        {/* Paketler */}
        <section className="max-w-5xl mx-auto px-6 py-20 border-t border-white/5">
          <h2 className="text-2xl font-bold text-center mb-3 text-white/90">
            Paketler
          </h2>
          <p className="text-center text-white/50 mb-14 max-w-xl mx-auto text-sm">
            İhtiyacınıza uygun paketi seçin. Detaylar için fiyatlar sayfasına bakın.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PACKAGES.map((pkg) => (
              <div
                key={pkg.name}
                className={`rounded-2xl border p-6 ${
                  pkg.highlight
                    ? "border-emerald-500/50 bg-emerald-500/5"
                    : "border-white/10 bg-white/5"
                }`}
              >
                <h3 className="text-xl font-bold text-white/90 mb-1">{pkg.name}</h3>
                <p className="text-2xl font-bold text-emerald-400 mb-4">
                  {pkg.price}
                  <span className="text-sm font-normal text-white/50">{pkg.period}</span>
                </p>
                <ul className="space-y-2 text-sm text-white/70">
                  {pkg.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-emerald-400">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/fiyatlar" className="mt-6 block">
                  <Button variant={pkg.highlight ? "default" : "outline"} className="w-full rounded-xl">
                    Detay
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Pilot Tesis */}
        <section className="max-w-4xl mx-auto px-6 py-20 border-t border-white/5">
          <h2 className="text-2xl font-bold text-center mb-2 text-white/90">İlk pilot tesisimiz</h2>
          <p className="text-center text-white/50 mb-12 text-sm">
            Tuzla Beşiktaş Cimnastik Okulu — Demo girişi ile paneli deneyin.
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
              <Link href="/patron/login">
                <Button className="rounded-full bg-emerald-500 hover:bg-emerald-600 text-white px-6">
                  Giriş Yap — Deneyin
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA + Demo */}
        <section className="max-w-3xl mx-auto px-6 py-16 text-center border-t border-white/5">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-8">
            <Shield className="h-10 w-10 text-emerald-400 mx-auto mb-4" />
            <p className="text-lg text-white/90 font-medium mb-4">
              Spor tesislerini teknoloji ve bilimle yönetiyoruz. Çocukların gelişimini veriyle takip ediyoruz.
            </p>
            <p className="text-white/50 text-xs mb-6">YISA-S — Anayasamıza uygun.</p>
            <Button onClick={() => setShowForm(true)} size="lg" className="rounded-full bg-emerald-500 text-white hover:bg-emerald-600 px-6 h-11">
              Franchise / Demo Başvurusu
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-white/5">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <h4 className="font-semibold text-white/90 mb-3">İletişim</h4>
                <div className="space-y-2 text-sm text-white/50">
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4" /> info@yisa-s.com
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4" /> +90 xxx xxx xx xx
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" /> İstanbul, Türkiye
                  </p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-white/90 mb-3">Bağlantılar</h4>
                <div className="space-y-2 text-sm">
                  <Link href="/" className="block text-white/50 hover:text-white/70">Ana Sayfa</Link>
                  <Link href="/vitrin" className="block text-white/50 hover:text-white/70">Sistemi Tanıyın</Link>
                  <Link href="/fiyatlar" className="block text-white/50 hover:text-white/70">Fiyatlar</Link>
                  <Link href="/patron/login" className="block text-white/50 hover:text-white/70">Giriş Yap</Link>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-white/90 mb-3">Sosyal Medya</h4>
                <div className="flex gap-4 text-white/50">
                  <a href="#" className="hover:text-white/80" aria-label="Twitter">𝕏</a>
                  <a href="#" className="hover:text-white/80" aria-label="LinkedIn">in</a>
                  <a href="#" className="hover:text-white/80" aria-label="Instagram">📷</a>
                </div>
              </div>
            </div>
            <p className="text-center text-white/40 text-sm">YİSA-S · Tesis işletmecileri için robot yönetimli spor tesisi franchise</p>
          </div>
        </footer>
      </main>

      {/* Demo Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-6" onClick={() => setShowForm(false)}>
          <div className="bg-[#111] border border-white/10 rounded-3xl p-10 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-bold mb-2">Demo Talep Formu</h3>
            <p className="text-white/40 mb-8">10 iş günü içinde dönüş yapılacaktır.</p>
            {formDone ? (
              <p className="text-emerald-400 text-center py-8">Başvurunuz alındı. Teşekkürler!</p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input placeholder="Ad Soyad" value={formData.ad} onChange={(e) => setFormData({ ...formData, ad: e.target.value })} className="bg-white/5 border-white/10 h-12 rounded-xl" required />
                <Input type="email" placeholder="E-posta" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="bg-white/5 border-white/10 h-12 rounded-xl" required />
                <Input placeholder="Telefon" value={formData.telefon} onChange={(e) => setFormData({ ...formData, telefon: e.target.value })} className="bg-white/5 border-white/10 h-12 rounded-xl" />
                <Input placeholder="Tesis türü (örn. Cimnastik)" value={formData.tesis_turu} onChange={(e) => setFormData({ ...formData, tesis_turu: e.target.value })} className="bg-white/5 border-white/10 h-12 rounded-xl" />
                <Input placeholder="Şehir" value={formData.sehir} onChange={(e) => setFormData({ ...formData, sehir: e.target.value })} className="bg-white/5 border-white/10 h-12 rounded-xl" required />
                <Button type="submit" disabled={formSending} className="w-full rounded-xl bg-white text-black hover:bg-white/90 h-12 font-medium">
                  {formSending ? "Gönderiliyor…" : "Gönder"}
                </Button>
              </form>
            )}
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
