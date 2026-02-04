"use client"

/**
 * YİSA-S Ana Sayfa — V0 Brillance SaaS Landing Page şablonu
 * Kaynak: https://v0.dev/templates/zdiN8dHwaaT (Brillance SaaS Landing Page)
 * Yapı: Hero & CTA | Product Features | Social Proof | Pricing | FAQ | Footer
 */

import { useState } from "react"
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
  Store,
  Mail,
  MapPin,
  Check,
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
  },
  {
    icon: Zap,
    title: "Otomatik Yönetim",
    desc: "İşletmeyi robotlar yürütür. Ders programı, yoklama, kasa defteri.",
  },
  {
    icon: Users,
    title: "Veli Takibi",
    desc: "Çocuk gelişimi, ölçümler, antrenman programı. Veliler panelden takip eder.",
  },
  {
    icon: BarChart3,
    title: "Veri ile Eğitim",
    desc: "Parametreler, grafikler, raporlar. Bilimsel veriyle sporcu gelişimi.",
  },
]

const REFERANSLAR = [
  { ad: "Merve Görmezler", unvan: "Firma Sahibi, Sportif Direktör" },
  { ad: "Emre Han Dalgıç", unvan: "Uzman Antrenör" },
  { ad: "Özlem Kuşkan", unvan: "Antrenör" },
  { ad: "Alper Görmezler", unvan: "İşletme Müdürü" },
]

const FAQ_ITEMS = [
  {
    q: "YİSA-S nedir?",
    a: "Spor tesislerini AI robotlarla yöneten franchise sistemidir. Cimnastik, yüzme ve benzeri tesisler için otomatik yönetim, veli takibi ve veri odaklı eğitim sunar.",
  },
  {
    q: "Demo nasıl talep edilir?",
    a: "Bu sayfadaki Demo Talep Et butonuna tıklayın, formu doldurun. 10 iş günü içinde sizinle iletişime geçeceğiz.",
  },
  {
    q: "Hangi paket bana uygun?",
    a: "Küçük tesisler için Starter, orta ölçek için Pro, çok şubeli işletmeler için Enterprise önerilir. Detaylar için Fiyatlar sayfasına bakın.",
  },
  {
    q: "Pilot tesis nedir?",
    a: "Tuzla Beşiktaş Cimnastik Okulu ilk pilot tesisimizdir. Demo girişi ile paneli deneyebilirsiniz.",
  },
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
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Nav — V0 Brillance style */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 border-b border-white/5 bg-[#0a0a0a]/95 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <YisaLogoInline href="/" />
          <div className="flex items-center gap-2">
            <Link href="/patron/login">
              <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10 rounded-lg gap-2 text-sm">
                <Crown className="h-4 w-4" />
                Giriş
              </Button>
            </Link>
            <Link href="/vitrin">
              <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10 rounded-lg gap-2 text-sm">
                <Store className="h-4 w-4" />
                Vitrin
              </Button>
            </Link>
            <Link href="/fiyatlar">
              <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10 rounded-lg gap-2 text-sm">
                Fiyatlar
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero & CTA — Brillance: bold headline, sub-text, clear CTA */}
        <section className="min-h-[90vh] flex flex-col items-center justify-center px-6 text-center pt-20">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-6 max-w-3xl">
            Tesisinizi AI Robotlarla Yönetin
          </h1>
          <p className="text-white/60 max-w-xl mb-10 text-base sm:text-lg">
            Cimnastik ve spor tesisi yönetimi. Ders programı, yoklama, veli takibi — hepsi otomatik.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/patron/login">
              <Button size="lg" className="rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white px-8 h-12 font-semibold text-base">
                Giriş Yap
              </Button>
            </Link>
            <Button onClick={() => setShowForm(true)} size="lg" variant="outline" className="rounded-xl border-white/20 text-white/90 hover:bg-white/10 px-8 h-12 font-medium">
              Demo Talep Et
            </Button>
          </div>
        </section>

        {/* Product Features — Brillance: feature blocks with visuals */}
        <section className="max-w-6xl mx-auto px-6 py-24 border-t border-white/5">
          <h2 className="text-3xl font-bold text-center mb-4 text-white">
            Neler Sunuyoruz?
          </h2>
          <p className="text-center text-white/50 mb-16 max-w-2xl mx-auto">
            AI robotlar, otomatik yönetim ve veli takibi ile tesisinizi verimli yönetin.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f) => {
              const Icon = f.icon
              return (
              <Card key={f.title} className="bg-white/5 border-white/10 rounded-2xl overflow-hidden hover:bg-white/[0.07] transition-colors">
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 mb-2">
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg text-white">{f.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-white/60">{f.desc}</p>
                </CardContent>
              </Card>
            )
            })}
          </div>
        </section>

        {/* Social Proof & Integrations — Brillance: testimonials, trust */}
        <section className="max-w-6xl mx-auto px-6 py-24 border-t border-white/5">
          <h2 className="text-3xl font-bold text-center mb-4 text-white">
            İlk Pilot Tesisimiz
          </h2>
          <p className="text-center text-white/50 mb-12 max-w-xl mx-auto">
            Tuzla Beşiktaş Cimnastik Okulu — Demo girişi ile paneli deneyin.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {REFERANSLAR.map((r, i) => (
              <Card key={i} className="bg-white/5 border-white/10 rounded-2xl">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 shrink-0">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{r.ad}</p>
                    <p className="text-sm text-white/50">{r.unvan}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/patron/login">
              <Button className="rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white px-6 h-11">
                Giriş Yap — Deneyin
              </Button>
            </Link>
          </div>
        </section>

        {/* Pricing Plans — Brillance: tiered pricing cards */}
        <section className="max-w-5xl mx-auto px-6 py-24 border-t border-white/5">
          <h2 className="text-3xl font-bold text-center mb-4 text-white">
            Paketler
          </h2>
          <p className="text-center text-white/50 mb-16 max-w-xl mx-auto">
            İhtiyacınıza uygun paketi seçin.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PACKAGES.map((pkg) => (
              <Card
                key={pkg.name}
                className={`rounded-2xl overflow-hidden ${
                  pkg.highlight
                    ? "border-emerald-500/50 bg-emerald-500/5 ring-2 ring-emerald-500/30"
                    : "bg-white/5 border-white/10"
                }`}
              >
                <CardHeader>
                  <CardTitle className="text-xl text-white">{pkg.name}</CardTitle>
                  <CardDescription className="text-white/50">
                    <span className="text-2xl font-bold text-emerald-400">{pkg.price}</span>
                    <span className="text-sm font-normal">{pkg.period}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {pkg.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-white/80">
                        <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href="/fiyatlar" className="w-full">
                    <Button
                      variant={pkg.highlight ? "default" : "outline"}
                      className={`w-full rounded-xl ${pkg.highlight ? "bg-emerald-500 hover:bg-emerald-600" : "border-white/20 text-white hover:bg-white/10"}`}
                    >
                      Detay
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ — Brillance: accordion */}
        <section className="max-w-3xl mx-auto px-6 py-24 border-t border-white/5">
          <h2 className="text-3xl font-bold text-center mb-4 text-white">
            Sıkça Sorulan Sorular
          </h2>
          <p className="text-center text-white/50 mb-12">
            Merak ettiklerinizin yanıtları.
          </p>
          <Accordion type="single" collapsible className="w-full">
            {FAQ_ITEMS.map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger>{item.q}</AccordionTrigger>
                <AccordionContent>{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* CTA + Demo */}
        <section className="max-w-3xl mx-auto px-6 py-20 text-center border-t border-white/5">
          <Card className="bg-white/5 border-white/10 rounded-2xl p-8">
            <p className="text-lg text-white font-medium mb-6">
              Spor tesislerini teknoloji ve bilimle yönetiyoruz. Çocukların gelişimini veriyle takip ediyoruz.
            </p>
            <p className="text-white/50 text-sm mb-6">YİSA-S — Anayasamıza uygun.</p>
            <Button onClick={() => setShowForm(true)} size="lg" className="rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 px-8 h-12">
              Franchise / Demo Başvurusu
            </Button>
          </Card>
        </section>

        {/* Footer — Brillance: clean footer */}
        <footer className="py-16 border-t border-white/5">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex flex-col sm:flex-row items-center gap-6 text-sm text-white/50">
                <span className="flex items-center gap-2">
                  <Mail className="h-4 w-4" /> info@yisa-s.com
                </span>
                <span className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> İstanbul
                </span>
              </div>
              <div className="flex gap-8 text-sm">
                <Link href="/vitrin" className="text-white/50 hover:text-white transition-colors">Vitrin</Link>
                <Link href="/fiyatlar" className="text-white/50 hover:text-white transition-colors">Fiyatlar</Link>
                <Link href="/patron/login" className="text-white/50 hover:text-white transition-colors">Giriş</Link>
              </div>
            </div>
            <p className="text-center text-white/40 text-sm mt-10">
              YİSA-S · Robot yönetimli spor tesisi franchise
            </p>
          </div>
        </footer>
      </main>

      {/* Demo Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-6" onClick={() => setShowForm(false)}>
          <Card className="bg-[#111] border-white/10 rounded-2xl p-10 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <CardHeader>
              <CardTitle className="text-2xl">Demo Talep Formu</CardTitle>
              <CardDescription>10 iş günü içinde dönüş yapılacaktır.</CardDescription>
            </CardHeader>
            <CardContent>
              {formDone ? (
                <p className="text-emerald-400 text-center py-8 font-medium">Başvurunuz alındı. Teşekkürler!</p>
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
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
