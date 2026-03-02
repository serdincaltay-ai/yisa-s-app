"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, X, CreditCard, Zap, Star } from "lucide-react"
import Link from "next/link"
import { YisaLogoInline } from "@/components/YisaLogo"

const PACKAGES = [
  {
    id: "starter",
    name: "Starter",
    price: "499",
    currency: "\u20ba",
    period: "/ay",
    kredi: 100,
    desc: "K\u00fc\u00e7\u00fck tesisler i\u00e7in ideal ba\u015flang\u0131\u00e7 paketi",
    features: [
      { text: "100 kredi / ay", included: true },
      { text: "50 \u00fcye kapasitesi", included: true },
      { text: "1 \u015fube", included: true },
      { text: "Temel robotlar (Kar\u015f\u0131lama, Acil Destek)", included: true },
      { text: "Veli paneli", included: true },
      { text: "E-posta destek", included: true },
      { text: "WhatsApp entegrasyonu", included: false },
      { text: "\u00d6ncelikli destek", included: false },
      { text: "Geli\u015fim grafikleri (Premium)", included: false },
      { text: "\u00c7oklu \u015fube", included: false },
    ],
    highlight: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "999",
    currency: "\u20ba",
    period: "/ay",
    kredi: 500,
    desc: "B\u00fcy\u00fcyen tesisler i\u00e7in en pop\u00fcler paket",
    features: [
      { text: "500 kredi / ay", included: true },
      { text: "200 \u00fcye kapasitesi", included: true },
      { text: "3 \u015fube", included: true },
      { text: "T\u00fcm robotlar", included: true },
      { text: "Veli paneli + geli\u015fim grafikleri", included: true },
      { text: "WhatsApp entegrasyonu", included: true },
      { text: "\u00d6ncelikli destek", included: true },
      { text: "Sosyal medya robotu", included: true },
      { text: "API eri\u015fimi", included: false },
      { text: "\u00d6zelle\u015ftirme", included: false },
    ],
    highlight: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "\u00d6zel",
    currency: "",
    period: "",
    kredi: 2000,
    desc: "B\u00fcy\u00fck organizasyonlar i\u00e7in \u00f6zel \u00e7\u00f6z\u00fcm",
    features: [
      { text: "2000+ kredi / ay", included: true },
      { text: "S\u0131n\u0131rs\u0131z \u00fcye", included: true },
      { text: "\u00c7oklu \u015fube", included: true },
      { text: "T\u00fcm robotlar + \u00f6zel entegrasyonlar", included: true },
      { text: "Dedicated destek", included: true },
      { text: "\u00d6zelle\u015ftirme", included: true },
      { text: "API eri\u015fimi", included: true },
      { text: "SLA garantisi", included: true },
      { text: "On-premise se\u00e7ene\u011fi", included: true },
      { text: "\u00d6zel robot geli\u015ftirme", included: true },
    ],
    highlight: false,
  },
]

const KREDI_ACIKLAMA = [
  { islem: "Robot komutu (CELF, Veri, G\u00fcvenlik)", kredi: 1 },
  { islem: "Rapor olu\u015fturma (ayl\u0131k/haftal\u0131k)", kredi: 5 },
  { islem: "Sosyal medya i\u00e7erik \u00fcretimi", kredi: 3 },
  { islem: "Veli bilgilendirme (toplu mesaj)", kredi: 2 },
  { islem: "Geli\u015fim grafi\u011fi g\u00fcncelleme", kredi: 1 },
  { islem: "AI analiz (sporcu performans)", kredi: 10 },
  { islem: "Yoklama takip (g\u00fcnl\u00fck)", kredi: 0 },
  { islem: "Aidat y\u00f6netimi", kredi: 0 },
]

export default function FiyatlarPage() {
  const [buying, setBuying] = useState<string | null>(null)

  const handleBuy = async (packageId: string) => {
    setBuying(packageId)
    try {
      const res = await fetch("/api/demo-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Paket Satin Alma: " + packageId,
          email: "satin-alma@yisa-s.com",
          facility_type: "Kredi Paketi",
          notes: JSON.stringify({ package_id: packageId, action: "purchase" }),
          source: "fiyatlar",
        }),
      })
      const data = await res.json()
      if (data?.ok) {
        alert("Talebiniz alindi! En kisa surede iletisime gececegiz.")
      } else {
        alert(data?.error || "Bir hata olustu.")
      }
    } catch {
      alert("Baglanti hatasi. Lutfen tekrar deneyin.")
    } finally {
      setBuying(null)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-5 border-b border-white/5 bg-[#0a0a0a]/90 backdrop-blur">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <YisaLogoInline href="/" />
          <div className="flex gap-4">
            <Link href="/"><Button variant="ghost" className="text-white/70 hover:text-white">Ana Sayfa</Button></Link>
            <Link href="/vitrin"><Button variant="ghost" className="text-white/70 hover:text-white">Vitrin</Button></Link>
            <Link href="/demo"><Button variant="ghost" className="text-white/70 hover:text-white">Demo</Button></Link>
            <Link href="/auth/login"><Button className="rounded-full bg-emerald-500 hover:bg-emerald-600 text-white">Giris Yap</Button></Link>
          </div>
        </div>
      </nav>

      <main className="pt-28 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm mb-6">
              <CreditCard className="h-4 w-4" />
              Kredi Sistemi
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Paketler ve Fiyatlar</h1>
            <p className="text-white/50 max-w-xl mx-auto">
              Kredi bazli sistem: Her pakette aylik kredi hakki. Robot komutlari, rapor olusturma ve AI analizler kredi ile calisir. Temel islemler (yoklama, aidat) ucretsiz.
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
                {pkg.highlight && (
                  <div className="flex items-center gap-1 text-emerald-400 text-xs font-medium mb-4">
                    <Star className="h-3 w-3 fill-current" />
                    En Populer
                  </div>
                )}
                <h2 className="text-2xl font-bold text-white/95 mb-2">{pkg.name}</h2>
                <p className="text-sm text-white/50 mb-4">{pkg.desc}</p>
                <div className="mb-2">
                  <span className="text-3xl font-bold text-emerald-400">{pkg.currency}{pkg.price}</span>
                  <span className="text-white/50">{pkg.period}</span>
                </div>
                <div className="flex items-center gap-2 mb-6 px-3 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                  <Zap className="h-4 w-4 text-cyan-400" />
                  <span className="text-sm font-medium text-cyan-400">{pkg.kredi} kredi / ay</span>
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

                <Button
                  className={`w-full rounded-xl h-12 mt-8 ${pkg.highlight ? "bg-emerald-500 hover:bg-emerald-600 text-white" : ""}`}
                  variant={pkg.highlight ? "default" : "outline"}
                  onClick={() => handleBuy(pkg.id)}
                  disabled={buying === pkg.id}
                >
                  {buying === pkg.id ? "Gonderiliyor..." : pkg.id === "enterprise" ? "Iletisime Gec" : "Satin Al"}
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-16 rounded-2xl border border-white/10 bg-white/5 p-8">
            <div className="flex items-center gap-2 mb-6">
              <Zap className="h-5 w-5 text-cyan-400" />
              <h3 className="text-lg font-semibold text-white/90">Kredi Sistemi Nasil Calisir?</h3>
            </div>
            <p className="text-sm text-white/50 mb-6">
              Her ay paketinize gore kredi hakki yuklenir. Robot komutlari, rapor olusturma ve AI analizler kredi harcar. Temel islemler (yoklama, aidat yonetimi) ucretsiz.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-white/70 font-medium">Islem</th>
                    <th className="text-center py-3 px-4 text-cyan-400 font-medium">Kredi</th>
                  </tr>
                </thead>
                <tbody>
                  {KREDI_ACIKLAMA.map((row, i) => (
                    <tr key={i} className="border-b border-white/5">
                      <td className="py-3 px-4 text-white/80">{row.islem}</td>
                      <td className="py-3 px-4 text-center">
                        {row.kredi === 0 ? (
                          <span className="text-emerald-400 font-medium">Ucretsiz</span>
                        ) : (
                          <span className="text-cyan-400">{row.kredi} kredi</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-8">
            <h3 className="text-lg font-semibold text-white/90 mb-4">Karsilastirma Tablosu</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-white/70 font-medium">Ozellik</th>
                    <th className="text-center py-3 px-4 text-white/70 font-medium">Starter</th>
                    <th className="text-center py-3 px-4 text-emerald-400 font-medium">Pro</th>
                    <th className="text-center py-3 px-4 text-white/70 font-medium">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Aylik kredi", "100", "500", "2000+"],
                    ["Uye limiti", "50", "200", "Sinirsiz"],
                    ["Sube", "1", "3", "Coklu"],
                    ["Robotlar", "Temel", "Tumu", "Tumu + ozel"],
                    ["Veli paneli", "\u2713", "\u2713", "\u2713"],
                    ["WhatsApp", "\u2014", "\u2713", "\u2713"],
                    ["Oncelikli destek", "\u2014", "\u2713", "Dedicated"],
                    ["API", "\u2014", "\u2014", "\u2713"],
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
              <Button size="lg" className="rounded-full bg-emerald-500 hover:bg-emerald-600 text-white px-8">Demo Talep Et</Button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="py-8 text-center border-t border-white/5">
        <div className="flex justify-center gap-6 text-sm">
          <Link href="/" className="text-white/50 hover:text-white/70">Ana Sayfa</Link>
          <Link href="/vitrin" className="text-white/50 hover:text-white/70">Vitrin</Link>
          <Link href="/demo" className="text-white/50 hover:text-white/70">Demo</Link>
        </div>
        <p className="text-white/40 text-xs mt-2">YISA-S - Yonetici Isletmeci Sporcu Antrenor Sistemi</p>
      </footer>
    </div>
  )
}
