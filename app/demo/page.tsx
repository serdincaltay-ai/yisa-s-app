"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import {
  Bot,
  BarChart3,
  Dumbbell,
  Zap,
  Store,
  Users,
  BarChart2,
  Shield,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ChevronRight,
} from "lucide-react"
import { YisaLogo } from "@/components/YisaLogo"

/** Franchise fuarlarında gösterilecek tanıtım sayfası — giriş gerektirmez */
export default function FranchiseDemoPage() {
  const [formData, setFormData] = useState({ ad: "", telefon: "", sehir: "", firma: "" })

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Hero */}
      <header className="relative overflow-hidden border-b border-white/10">
        <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
          <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="absolute bottom-20 right-1/4 w-80 h-80 rounded-full bg-cyan-500/20 blur-3xl" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-16 text-center">
          <Link href="/" className="inline-block mb-10">
            <YisaLogo variant="full" showAcronym />
          </Link>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Cimnastik Tesisi Franchise Sistemi
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto mb-8">
            Robotlar tesisi yönetir. Siz yönetirsiniz. Fuarlarda tanıttığımız YİSA-S ile kendi spor tesisinizi açın.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/auth/login">
              <Button size="lg" className="rounded-full bg-emerald-500 hover:bg-emerald-600 text-white px-8 h-12 gap-2">
                Demo Paneli Dene
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <a href="#basvuru">
              <Button size="lg" variant="outline" className="rounded-full border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 px-8 h-12">
                Bilgi Al — Franchise
              </Button>
            </a>
          </div>
          <p className="mt-6 text-sm text-white/50 max-w-md mx-auto">
            Firma sahibi olarak <strong className="text-emerald-400">franchise.yisa-s.com</strong> adresine girip giriş yapın. Uygulamayı <strong>ana ekrana ekleyin</strong> — oradan tesisinizi yönetin.
          </p>
        </div>
      </header>

      {/* Özellikler */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-2xl font-bold text-center mb-12 text-white/90">
          Neler Sunuyoruz?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard icon={Bot} title="Robot Yönetimi" desc="Mailler, demolar, aidat takibi. AI destekli operasyon." />
          <FeatureCard icon={BarChart3} title="Veri ile Eğitim" desc="Çocuk gelişimi ölçümlerle takip. Grafikler, raporlar." />
          <FeatureCard icon={Store} title="Franchise Vitrin" desc="Kendi tesisinizi yönetin. Çoklu şube desteği." />
          <FeatureCard icon={Users} title="Veli İletişimi" desc="WhatsApp, e-posta otomasyonu. Velilerle sürekli iletişim." />
          <FeatureCard icon={Shield} title="Güvenli Altyapı" desc="Supabase, veri gizliliği. Sertifikalı sistem." />
          <FeatureCard icon={Zap} title="Teknoloji Öncüsü" desc="Cimnastikte ilk robot yönetimli franchise." />
        </div>
      </section>

      {/* Akış */}
      <section className="max-w-4xl mx-auto px-6 py-16 border-t border-white/5">
        <h2 className="text-2xl font-bold text-center mb-12 text-white/90">
          Nasıl Çalışır?
        </h2>
        <div className="space-y-6">
          {[
            { step: 1, title: "Franchise Anlaşması", desc: "Sözleşme imzalanır, eğitim planlanır." },
            { step: 2, title: "Sistem Kurulumu", desc: "YİSA-S paneli tesise özel yapılandırılır." },
            { step: 3, title: "Eğitim & Açılış", desc: "Personel eğitimi, açılış desteği." },
            { step: 4, title: "Sürekli Destek", desc: "Teknik destek, güncellemeler, COO robotları." },
          ].map(({ step, title, desc }) => (
            <div key={step} className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                {step}
              </div>
              <div>
                <h3 className="font-semibold text-white/90">{title}</h3>
                <p className="text-sm text-white/50 mt-1">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Başvuru Formu */}
      <section id="basvuru" className="max-w-md mx-auto px-6 py-20">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="h-6 w-6 text-amber-400" />
            <h2 className="text-xl font-bold text-white/90">Franchise Bilgi Formu</h2>
          </div>
          <p className="text-sm text-white/50 mb-6">
            Fuardan ayrıldıktan sonra 10 iş günü içinde sizinle iletişime geçeceğiz.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              alert("Bilgileriniz alındı. En kısa sürede dönüş yapacağız.")
            }}
            className="space-y-4"
          >
            <Input
              placeholder="Ad Soyad"
              value={formData.ad}
              onChange={(e) => setFormData({ ...formData, ad: e.target.value })}
              className="bg-white/5 border-white/10 h-12 rounded-xl"
              required
            />
            <Input
              placeholder="Telefon"
              type="tel"
              value={formData.telefon}
              onChange={(e) => setFormData({ ...formData, telefon: e.target.value })}
              className="bg-white/5 border-white/10 h-12 rounded-xl"
              required
            />
            <Input
              placeholder="Şehir"
              value={formData.sehir}
              onChange={(e) => setFormData({ ...formData, sehir: e.target.value })}
              className="bg-white/5 border-white/10 h-12 rounded-xl"
              required
            />
            <Input
              placeholder="Firma / Tesis Adı (varsa)"
              value={formData.firma}
              onChange={(e) => setFormData({ ...formData, firma: e.target.value })}
              className="bg-white/5 border-white/10 h-12 rounded-xl"
            />
            <Button type="submit" className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white h-12 font-medium">
              Gönder
            </Button>
          </form>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 py-16 text-center">
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-8">
          <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white/90 mb-2">Tuzla Beşiktaş Cimnastik Okulu</h2>
          <p className="text-white/60 mb-6">İlk pilot tesisimiz. Demo girişi ile paneli deneyebilirsiniz.</p>
          <Link href="/auth/login">
            <Button size="lg" className="rounded-full bg-white text-black hover:bg-white/90 px-8 h-12 gap-2">
              Demo Paneline Giriş
              <ChevronRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="py-8 text-center border-t border-white/5">
        <Link href="/" className="text-white/50 hover:text-white/70 text-sm">
          ← Ana sayfaya dön
        </Link>
        <p className="text-white/40 text-xs mt-2">YİSA-S · Yönetici İşletmeci Sporcu Antrenör Sistemi</p>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon: Icon,
  title,
  desc,
}: {
  icon: React.ElementType
  title: string
  desc: string
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/[0.07] transition">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 mb-4">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-semibold text-white/95 mb-2">{title}</h3>
      <p className="text-sm text-white/50">{desc}</p>
    </div>
  )
}
