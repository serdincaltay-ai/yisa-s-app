"use client"

import React, { useState } from "react"
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Instagram,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Star,
  Users,
  Award,
  Calendar,
  Heart,
  Shield,
  Target,
  Sparkles,
  CheckCircle2,
  ArrowRight,
} from "lucide-react"

/* ------------------------------------------------------------------ */
/*  BJK Tuzla Cimnastik Okulu — Tenant Landing Page                   */
/*  Referans: hobigym.com yapısı                                       */
/* ------------------------------------------------------------------ */

const TESIS = {
  ad: "Tuzla Beşiktaş Cimnastik Okulu",
  kisa: "BJK Tuzla Cimnastik",
  slogan: "Çocuğunuzun Potansiyelini Keşfedin",
  aciklama:
    "Beşiktaş JK Spor Okulları bünyesinde, profesyonel antrenörler eşliğinde artistik cimnastik, ritmik cimnastik ve trampolin eğitimleri sunuyoruz. 4-14 yaş arası çocuklarınız için güvenli, eğlenceli ve gelişim odaklı ortam.",
  telefon: "0530 710 46 24",
  email: "info@bjktuzlacimnastik.com",
  instagram: "@besiktasjktuzlasporokulu",
  instagramUrl: "https://instagram.com/besiktasjktuzlasporokulu",
  whatsapp: "905307104624",
  adres: "Tuzla, İstanbul",
  calisma: "Hafta içi 10:00–20:00 · Cumartesi 09:00–17:00",
  harita: "https://maps.google.com/?q=Tuzla+Istanbul+Cimnastik",
}

const BRANSLAR = [
  {
    baslik: "Artistik Cimnastik",
    aciklama: "Yer hareketleri, paralel bar, halka ve atlama aletlerinde temel ve ileri düzey eğitim. 4-14 yaş.",
    ikon: "🤸",
    renk: "from-amber-500 to-orange-600",
  },
  {
    baslik: "Ritmik Cimnastik",
    aciklama: "Top, kurdele, çember ve ip ile ritim, esneklik ve zarafet çalışmaları. 5-12 yaş kız grupları.",
    ikon: "🎀",
    renk: "from-pink-500 to-rose-600",
  },
  {
    baslik: "Trampolin",
    aciklama: "Koordinasyon, denge ve havada kontrol becerileri. Eğlenceli ve güvenli ortamda trampolin eğitimi.",
    ikon: "🦘",
    renk: "from-blue-500 to-indigo-600",
  },
  {
    baslik: "Genel Fiziksel Gelişim",
    aciklama: "Tüm branşlara hazırlık: kuvvet, esneklik, çeviklik ve koordinasyon temelli çalışmalar.",
    ikon: "💪",
    renk: "from-emerald-500 to-green-600",
  },
]

const ANTRENORLER = [
  {
    ad: "Ayşe Korkmaz",
    uzmanlik: "Artistik Cimnastik",
    deneyim: "12 yıl",
    belge: "Cimnastik Federasyonu 3. Kademe",
    foto: null,
  },
  {
    ad: "Mehmet Yıldız",
    uzmanlik: "Trampolin & Artistik",
    deneyim: "8 yıl",
    belge: "Cimnastik Federasyonu 2. Kademe",
    foto: null,
  },
  {
    ad: "Zeynep Demir",
    uzmanlik: "Ritmik Cimnastik",
    deneyim: "10 yıl",
    belge: "Cimnastik Federasyonu 3. Kademe",
    foto: null,
  },
]

const PAKETLER = [
  {
    baslik: "Keşif Paketi",
    seans: 24,
    aciklama: "Haftada 2 ders · ~3 ay",
    fiyat: "4.800 ₺",
    ozellikler: ["24 ders hakkı", "1 branş seçimi", "İlk ölçüm dahil", "Gelişim raporu"],
    one_cikan: false,
  },
  {
    baslik: "Gelişim Paketi",
    seans: 48,
    aciklama: "Haftada 2-3 ders · ~4-6 ay",
    fiyat: "8.400 ₺",
    ozellikler: ["48 ders hakkı", "2 branş seçimi", "3 ölçüm dahil", "Detaylı gelişim raporu", "Kardeş kullanabilir"],
    one_cikan: true,
  },
  {
    baslik: "Şampiyon Paketi",
    seans: 60,
    aciklama: "Haftada 3 ders · ~5 ay",
    fiyat: "9.600 ₺",
    ozellikler: ["60 ders hakkı", "Tüm branşlar", "Sınırsız ölçüm", "Kişisel antrenman planı", "Kardeş kullanabilir", "Diğer şubelerde geçerli"],
    one_cikan: false,
  },
]

const SSS = [
  {
    soru: "Deneme dersi ücretsiz mi?",
    cevap: "Evet! İlk deneme dersimiz tamamen ücretsizdir. Çocuğunuz salonu, antrenörleri ve arkadaşlarını tanısın.",
  },
  {
    soru: "Kaç yaşından itibaren başlayabilir?",
    cevap: "4 yaşından itibaren cimnastiğe başlanabilir. Yaş gruplarına göre sınıflar oluşturulur.",
  },
  {
    soru: "Aidat sistemi nasıl çalışıyor?",
    cevap: "Aylık aidat yerine seans bazlı kredi sistemi kullanıyoruz. 24, 48 veya 60 derslik paketlerden birini seçebilirsiniz. Kredi hakkınızı istediğiniz branşta, istediğiniz gün kullanabilirsiniz.",
  },
  {
    soru: "Birden fazla branşa kayıt olabilir miyiz?",
    cevap: "Evet! Paketinize göre birden fazla branşta ders alabilirsiniz. 48 ve 60 derslik paketlerde kardeşler de aynı kredileri kullanabilir.",
  },
  {
    soru: "Ölçüm ve gelişim takibi nasıl yapılıyor?",
    cevap: "YİSA-S teknoloji altyapımız sayesinde çocuğunuzun fiziksel, teknik ve mental gelişimi düzenli olarak ölçülür. WHO ve Eurofit normlarına göre 10 perspektiften değerlendirme yapılır. Sonuçlar velilere dijital rapor olarak iletilir.",
  },
  {
    soru: "Kıyafet ve malzeme gerekli mi?",
    cevap: "Rahat spor kıyafeti ve çorap yeterlidir. İleri seviye için jimnastik mayosu önerilir. Tüm ekipman salonumuzda mevcuttur.",
  },
]

export default function TenantSitePage() {
  const [formData, setFormData] = useState({ ad: "", telefon: "", email: "", cocukYas: "", mesaj: "" })
  const [formGonderildi, setFormGonderildi] = useState(false)
  const [formHata, setFormHata] = useState("")
  const [gonderiyor, setGonderiyor] = useState(false)
  const [acikSSS, setAcikSSS] = useState<number | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.ad || !formData.telefon) {
      setFormHata("Ad ve telefon zorunludur.")
      return
    }
    setGonderiyor(true)
    setFormHata("")
    try {
      const res = await fetch("/api/demo-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          name: formData.ad,
          phone: formData.telefon,
          email: formData.email || undefined,
          notes: `Çocuk yaşı: ${formData.cocukYas}. ${formData.mesaj}`.trim(),
          source: "vitrin",
        }),
      })
      if (res.ok) {
        setFormGonderildi(true)
      } else {
        setFormHata("Bir hata oluştu, lütfen tekrar deneyin.")
      }
    } catch {
      setFormHata("Bağlantı hatası, lütfen tekrar deneyin.")
    } finally {
      setGonderiyor(false)
    }
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black text-white font-bold text-sm">BJK</div>
            <div>
              <p className="font-bold text-sm leading-tight">{TESIS.kisa}</p>
              <p className="text-xs text-gray-500">Beşiktaş JK Spor Okulları</p>
            </div>
          </div>
          <div className="hidden items-center gap-6 text-sm md:flex">
            <a href="#branslar" className="text-gray-600 hover:text-black transition">Branşlar</a>
            <a href="#antrenorler" className="text-gray-600 hover:text-black transition">Antrenörler</a>
            <a href="#paketler" className="text-gray-600 hover:text-black transition">Paketler</a>
            <a href="#sss" className="text-gray-600 hover:text-black transition">S.S.S</a>
            <a
              href="#kayit"
              className="rounded-full bg-black px-5 py-2 text-white font-medium hover:bg-gray-800 transition"
            >
              Ücretsiz Deneme
            </a>
          </div>
          <a
            href={`https://wa.me/${TESIS.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600 transition md:hidden"
          >
            <MessageCircle className="h-4 w-4" />
            Ara
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black py-20 md:py-32">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="relative mx-auto max-w-7xl px-4 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white/80">
            <Sparkles className="h-4 w-4 text-yellow-400" />
            Beşiktaş JK Spor Okulları Bünyesinde
          </div>
          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold leading-tight text-white md:text-6xl">
            {TESIS.slogan}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300 md:text-xl">
            {TESIS.aciklama}
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="#kayit"
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-lg font-bold text-gray-900 shadow-xl hover:bg-gray-100 transition"
            >
              Ücretsiz Deneme Dersi
              <ArrowRight className="h-5 w-5" />
            </a>
            <a
              href={`tel:${TESIS.telefon.replace(/\s/g, "")}`}
              className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 px-8 py-4 text-lg font-medium text-white hover:bg-white/10 transition"
            >
              <Phone className="h-5 w-5" />
              {TESIS.telefon}
            </a>
          </div>

          {/* Stats */}
          <div className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-6 md:grid-cols-4">
            {[
              { sayi: "200+", etiket: "Aktif Öğrenci" },
              { sayi: "4", etiket: "Branş" },
              { sayi: "3", etiket: "Uzman Antrenör" },
              { sayi: "10+", etiket: "Yıl Deneyim" },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl font-extrabold text-white md:text-4xl">{s.sayi}</p>
                <p className="mt-1 text-sm text-gray-400">{s.etiket}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Neden Biz */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold md:text-4xl">Neden BJK Tuzla Cimnastik?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              Profesyonel kadromuz ve modern tesisimizle çocuğunuzun fiziksel, mental ve sosyal gelişimini destekliyoruz.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { ikon: Shield, baslik: "Güvenli Ortam", aciklama: "Profesyonel ekipman, yumuşak zeminler ve sürekli gözetim altında antrenmanlar." },
              { ikon: Target, baslik: "Kişisel Gelişim Takibi", aciklama: "YİSA-S teknolojisiyle 10 perspektiften ölçüm ve WHO/Eurofit normlarına göre değerlendirme." },
              { ikon: Users, baslik: "Küçük Gruplar", aciklama: "Antrenör başına maksimum 10 öğrenci ile birebir ilgi ve kaliteli eğitim." },
              { ikon: Award, baslik: "Lisanslı Antrenörler", aciklama: "Cimnastik Federasyonu sertifikalı, deneyimli ve pedagoji eğitimli antrenör kadrosu." },
              { ikon: Heart, baslik: "Eğlenceli Öğrenme", aciklama: "Oyun tabanlı eğitim metoduyla çocuklar eğlenirken öğrenir ve gelişir." },
              { ikon: Calendar, baslik: "Esnek Program", aciklama: "Hafta içi ve hafta sonu seçenekleri. Kredi sistemiyle istediğiniz gün gelin." },
            ].map((item, i) => (
              <div key={i} className="rounded-2xl bg-white p-6 shadow-sm hover:shadow-md transition">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
                  <item.ikon className="h-6 w-6 text-gray-700" />
                </div>
                <h3 className="mt-4 text-lg font-bold">{item.baslik}</h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">{item.aciklama}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Branşlar */}
      <section id="branslar" className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold md:text-4xl">Branşlarımız</h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              4-14 yaş arası çocuklar için profesyonel cimnastik eğitim programları
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {BRANSLAR.map((b, i) => (
              <div key={i} className="group relative overflow-hidden rounded-2xl bg-gradient-to-br p-8 text-white shadow-lg" style={{ background: `linear-gradient(135deg, var(--tw-gradient-stops))` }}>
                <div className={`absolute inset-0 bg-gradient-to-br ${b.renk} opacity-90`} />
                <div className="relative">
                  <span className="text-4xl">{b.ikon}</span>
                  <h3 className="mt-4 text-2xl font-bold">{b.baslik}</h3>
                  <p className="mt-2 text-white/90 leading-relaxed">{b.aciklama}</p>
                  <a href="#kayit" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-white/80 hover:text-white transition">
                    Deneme dersi al <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Antrenörler */}
      <section id="antrenorler" className="bg-gray-50 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold md:text-4xl">Antrenörlerimiz</h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              Federasyon lisanslı, deneyimli ve pedagoji eğitimli kadromuzla tanışın
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {ANTRENORLER.map((a, i) => (
              <div key={i} className="rounded-2xl bg-white p-6 text-center shadow-sm hover:shadow-md transition">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-gray-200 to-gray-300">
                  <Users className="h-10 w-10 text-gray-500" />
                </div>
                <h3 className="mt-4 text-lg font-bold">{a.ad}</h3>
                <p className="text-sm font-medium text-gray-500">{a.uzmanlik}</p>
                <div className="mt-3 flex items-center justify-center gap-1">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <div className="mt-3 space-y-1 text-xs text-gray-500">
                  <p>{a.deneyim} deneyim</p>
                  <p>{a.belge}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Paketler */}
      <section id="paketler" className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold md:text-4xl">Seans Bazlı Paketler</h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              Aylık aidat yok! Kredi bazlı esnek sistem. İstediğiniz branşta, istediğiniz gün kullanın.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {PAKETLER.map((p, i) => (
              <div
                key={i}
                className={`relative rounded-2xl border-2 p-8 transition ${
                  p.one_cikan
                    ? "border-black bg-black text-white shadow-2xl scale-105"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                }`}
              >
                {p.one_cikan && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-yellow-400 px-4 py-1 text-xs font-bold text-black">
                    En Popüler
                  </div>
                )}
                <h3 className="text-xl font-bold">{p.baslik}</h3>
                <p className={`mt-1 text-sm ${p.one_cikan ? "text-gray-300" : "text-gray-500"}`}>{p.aciklama}</p>
                <div className="mt-4">
                  <span className="text-4xl font-extrabold">{p.fiyat}</span>
                  <span className={`text-sm ${p.one_cikan ? "text-gray-400" : "text-gray-500"}`}> / {p.seans} ders</span>
                </div>
                <ul className="mt-6 space-y-3">
                  {p.ozellikler.map((oz, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className={`h-4 w-4 shrink-0 ${p.one_cikan ? "text-green-400" : "text-green-500"}`} />
                      {oz}
                    </li>
                  ))}
                </ul>
                <a
                  href="#kayit"
                  className={`mt-8 block w-full rounded-full py-3 text-center text-sm font-bold transition ${
                    p.one_cikan
                      ? "bg-white text-black hover:bg-gray-100"
                      : "bg-black text-white hover:bg-gray-800"
                  }`}
                >
                  Hemen Başla
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SSS */}
      <section id="sss" className="bg-gray-50 py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold md:text-4xl">Sıkça Sorulan Sorular</h2>
          </div>
          <div className="mt-10 space-y-3">
            {SSS.map((item, i) => (
              <div key={i} className="rounded-xl bg-white shadow-sm">
                <button
                  onClick={() => setAcikSSS(acikSSS === i ? null : i)}
                  className="flex w-full items-center justify-between px-6 py-4 text-left"
                >
                  <span className="font-medium">{item.soru}</span>
                  {acikSSS === i ? (
                    <ChevronUp className="h-5 w-5 shrink-0 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 shrink-0 text-gray-400" />
                  )}
                </button>
                {acikSSS === i && (
                  <div className="border-t px-6 py-4">
                    <p className="text-sm text-gray-600 leading-relaxed">{item.cevap}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kayıt Formu */}
      <section id="kayit" className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 to-black shadow-2xl">
            <div className="grid md:grid-cols-2">
              <div className="p-8 md:p-12">
                <h2 className="text-3xl font-bold text-white md:text-4xl">Ücretsiz Deneme Dersi</h2>
                <p className="mt-4 text-gray-300">
                  Formu doldurun, sizi arayalım. Çocuğunuz için en uygun branş ve saati birlikte belirleyelim.
                </p>
                <div className="mt-8 space-y-4">
                  <div className="flex items-center gap-3 text-gray-300">
                    <Phone className="h-5 w-5 text-green-400" />
                    <a href={`tel:${TESIS.telefon.replace(/\s/g, "")}`} className="hover:text-white transition">{TESIS.telefon}</a>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <Instagram className="h-5 w-5 text-pink-400" />
                    <a href={TESIS.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition">{TESIS.instagram}</a>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <MapPin className="h-5 w-5 text-blue-400" />
                    <span>{TESIS.adres}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <Clock className="h-5 w-5 text-yellow-400" />
                    <span>{TESIS.calisma}</span>
                  </div>
                </div>
                <div className="mt-8 flex gap-3">
                  <a
                    href={`https://wa.me/${TESIS.whatsapp}?text=Merhaba, deneme dersi hakkında bilgi almak istiyorum.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-full bg-green-500 px-6 py-3 text-sm font-medium text-white hover:bg-green-600 transition"
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </a>
                  <a
                    href={TESIS.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 text-sm font-medium text-white hover:opacity-90 transition"
                  >
                    <Instagram className="h-4 w-4" />
                    Instagram
                  </a>
                </div>
              </div>

              <div className="bg-white p-8 md:p-12">
                {formGonderildi ? (
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                      <CheckCircle2 className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="mt-4 text-xl font-bold">Talebiniz Alındı!</h3>
                    <p className="mt-2 text-gray-600">En kısa sürede sizi arayacağız. Teşekkür ederiz.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Veli Adı Soyadı *</label>
                      <input
                        type="text"
                        required
                        value={formData.ad}
                        onChange={(e) => setFormData({ ...formData, ad: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                        placeholder="Adınız Soyadınız"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Telefon *</label>
                      <input
                        type="tel"
                        required
                        value={formData.telefon}
                        onChange={(e) => setFormData({ ...formData, telefon: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                        placeholder="05XX XXX XX XX"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">E-posta</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                        placeholder="ornek@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Çocuğunuzun Yaşı</label>
                      <input
                        type="text"
                        value={formData.cocukYas}
                        onChange={(e) => setFormData({ ...formData, cocukYas: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                        placeholder="Örn: 7"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Mesajınız</label>
                      <textarea
                        rows={3}
                        value={formData.mesaj}
                        onChange={(e) => setFormData({ ...formData, mesaj: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:border-black focus:outline-none focus:ring-1 focus:ring-black resize-none"
                        placeholder="Sormak istediğiniz bir şey varsa yazabilirsiniz..."
                      />
                    </div>
                    {formHata && <p className="text-sm text-red-600">{formHata}</p>}
                    <button
                      type="submit"
                      disabled={gonderiyor}
                      className="w-full rounded-full bg-black py-3 text-sm font-bold text-white hover:bg-gray-800 transition disabled:opacity-50"
                    >
                      {gonderiyor ? "Gönderiliyor..." : "Ücretsiz Deneme Dersi Talep Et"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-900 py-12 text-gray-400">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-black font-bold text-sm">BJK</div>
                <div>
                  <p className="font-bold text-white">{TESIS.kisa}</p>
                  <p className="text-xs">Beşiktaş JK Spor Okulları</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed">
                Profesyonel cimnastik eğitimi ile çocuğunuzun fiziksel ve mental gelişimini destekliyoruz.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white">İletişim</h4>
              <div className="mt-4 space-y-2 text-sm">
                <p className="flex items-center gap-2"><Phone className="h-4 w-4" /> {TESIS.telefon}</p>
                <p className="flex items-center gap-2"><Mail className="h-4 w-4" /> {TESIS.email}</p>
                <p className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {TESIS.adres}</p>
                <p className="flex items-center gap-2"><Clock className="h-4 w-4" /> {TESIS.calisma}</p>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-white">Sosyal Medya</h4>
              <div className="mt-4 flex gap-3">
                <a href={TESIS.instagramUrl} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 transition">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href={`https://wa.me/${TESIS.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 transition">
                  <MessageCircle className="h-5 w-5" />
                </a>
              </div>
              <div className="mt-6">
                <p className="text-xs text-gray-500">Powered by</p>
                <p className="text-sm font-medium text-gray-300">YİSA-S Spor Teknolojileri</p>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-800 pt-8 text-center text-xs">
            <p>&copy; 2026 {TESIS.ad}. Tüm hakları saklıdır. YİSA-S Franchise Sistemi</p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a
        href={`https://wa.me/${TESIS.whatsapp}?text=Merhaba, bilgi almak istiyorum.`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 transition hover:scale-110"
      >
        <MessageCircle className="h-7 w-7" />
      </a>
    </div>
  )
}
