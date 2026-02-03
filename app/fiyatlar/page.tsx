"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"
import Link from "next/link"
import { YisaLogoInline } from "@/components/YisaLogo"

const PACKAGES = [
  {
    id: "starter",
    name: "Starter",
    price: "499",
    currency: "₺",
    period: "/ay",
    desc: "Küçük tesisler için ideal başlangıç paketi",
    features: [
      { text: "50 üye", included: true },
      { text: "1 şube", included: true },
      { text: "Temel robotlar (Karşılama, Acil Destek)", included: true },
      { text: "Veli paneli", included: true },
      { text: "E-posta destek", included: true },
      { text: "WhatsApp entegrasyonu", included: false },
      { text: "Öncelikli destek", included: false },
      { text: "Gelişim grafikleri (Premium)", included: false },
      { text: "Çoklu şube", included: false },
      { text: "API erişimi", included: false },
    ],
    highlight: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "999",
    currency: "₺",
    period: "/ay",
    desc: "Büyüyen tesisler için en popüler paket",
    features: [
      { text: "200 üye", included: true },
      { text: "3 şube", included: true },
      { text: "Tüm robotlar", included: true },
      { text: "Veli paneli", included: true },
      { text: "WhatsApp entegrasyonu", included: true },
      { text: "Öncelikli destek", included: true },
      { text: "Gelişim grafikleri", included: true },
      { text: "E-posta destek", included: true },
      { text: "API erişimi", included: false },
      { text: "Özelleştirme", included: false },
    ],
    highlight: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Özel",
    currency: "",
    period: "",
    desc: "Büyük organizasyonlar için özel çözüm",
    features: [
      { text: "Sınırsız üye", included: true },
      { text: "Çoklu şube", included: true },
      { text: "Tüm robotlar + özel entegrasyonlar", included: true },
      { text: "Dedicated destek", included: true },
      { text: "Özelleştirme", included: true },
      { text: "API erişimi", included: true },
      { text: "Veli paneli", included: true },
      { text: "Gelişim grafikleri", included: true },
      { text: "SLA garantisi", included: true },
      { text: "On-premise seçeneği", included: true },
    ],
    highlight: false,
  },
]

export default function FiyatlarPage() {

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-5 border-b border-white/5 bg-[#0a0a0a]/90 backdrop-blur">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <YisaLogoInline href="/" />
          <div className="flex gap-4">
            <Link href="/">
              <Button variant="ghost" className="text-white/70 hover:text-white">
                Ana Sayfa
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="ghost" className="text-white/70 hover:text-white">
                Demo
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button className="rounded-full bg-emerald-500 hover:bg-emerald-600 text-white">
                Giriş Yap
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-28 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Paketler ve Fiyatlar</h1>
            <p className="text-white/50 max-w-xl mx-auto">
              İhtiyacınıza uygun paketi seçin. Tüm paketlerde giriş ücreti (1.500 $) ayrıca uygulanır.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className={`rounded-2xl border p-8 flex flex-col transition-all ${
                  pkg.highlight
                    ? "border-emerald-500/50 bg-emerald-500/5 scale-[1.02]"
                    : "border-white/10 bg-white/5 hover:border-white/20"
                }`}
              >
                <h2 className="text-2xl font-bold text-white/95 mb-2">{pkg.name}</h2>
                <p className="text-sm text-white/50 mb-4">{pkg.desc}</p>
                <div className="mb-6">
                  <span className="text-3xl font-bold text-emerald-400">
                    {pkg.currency}{pkg.price}
                  </span>
                  <span className="text-white/50">{pkg.period}</span>
                </div>

                <ul className="space-y-3 flex-1">
                  {pkg.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm">
                      {f.included ? (
                        <Check className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                      ) : (
                        <X className="h-5 w-5 text-white/30 flex-shrink-0" />
                      )}
                      <span className={f.included ? "text-white/80" : "text-white/40"}>{f.text}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/demo#basvuru" className="mt-8 block">
                  <Button
                    className={`w-full rounded-xl h-12 ${
                      pkg.highlight ? "bg-emerald-500 hover:bg-emerald-600 text-white" : ""
                    }`}
                    variant={pkg.highlight ? "default" : "outline"}
                  >
                    {pkg.id === "enterprise" ? "İletişime Geç" : "Başvur"}
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-16 rounded-2xl border border-white/10 bg-white/5 p-8">
            <h3 className="text-lg font-semibold text-white/90 mb-4">Karşılaştırma Tablosu</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-white/70 font-medium">Özellik</th>
                    <th className="text-center py-3 px-4 text-white/70 font-medium">Starter</th>
                    <th className="text-center py-3 px-4 text-emerald-400 font-medium">Pro</th>
                    <th className="text-center py-3 px-4 text-white/70 font-medium">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Üye limiti", "50", "200", "Sınırsız"],
                    ["Şube", "1", "3", "Çoklu"],
                    ["Robotlar", "Temel", "Tümü", "Tümü + özel"],
                    ["Veli paneli", "✓", "✓", "✓"],
                    ["WhatsApp", "—", "✓", "✓"],
                    ["Öncelikli destek", "—", "✓", "Dedicated"],
                    ["API", "—", "—", "✓"],
                    ["Özelleştirme", "—", "—", "✓"],
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-white/5">
                      <td className="py-3 px-4 text-white/80">{row[0]}</td>
                      <td className="py-3 px-4 text-center text-white/60">{row[1]}</td>
                      <td className="py-3 px-4 text-center text-emerald-400">{row[2]}</td>
                      <td className="py-3 px-4 text-center text-white/60">{row[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link href="/demo#basvuru">
              <Button size="lg" className="rounded-full bg-emerald-500 hover:bg-emerald-600 text-white px-8">
                Demo Talep Et
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="py-8 text-center border-t border-white/5">
        <Link href="/" className="text-white/50 hover:text-white/70 text-sm">
          ← Ana sayfaya dön
        </Link>
      </footer>
    </div>
  )
}
