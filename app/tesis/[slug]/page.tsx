'use client'

import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import { TesisNavbar } from '@/components/tesis/TesisNavbar'
import { TesisFooter } from '@/components/tesis/TesisFooter'
import { DersProgramiGrid } from '@/components/tesis/DersProgramiGrid'
import { PaketFiyatlari } from '@/components/tesis/PaketFiyatlari'
import {
  Activity, MapPin, Phone, Mail, ChevronDown, ChevronUp,
  Dumbbell, Waves, Timer, Star, Users, Calendar as CalendarIcon,
  BarChart3, Play, MessageCircle, X
} from 'lucide-react'

/* ── Tesis data ── */
type TesisData = {
  adi: string
  slug: string
  slogan: string
  hakkimizda: string
  konum: string
  telefon: string
  email: string
  sablon: 'standart' | 'orta' | 'premium'
  branslar: { isim: string; icon: string; aciklama: string }[]
  antrenorler?: { isim: string; brans: string; deneyim: string }[]
  basarilar?: { isim: string; basari: string; alinti: string }[]
  duyurular?: { tarih: string; baslik: string; ozet: string }[]
  sss?: { soru: string; cevap: string }[]
  videoUrl?: string
  yorumlar?: { isim: string; yildiz: number; yorum: string }[]
}

const TESISLER: Record<string, TesisData> = {
  bjktuzlacimnastik: {
    adi: 'BJK Tuzla Cimnastik',
    slug: 'bjktuzlacimnastik',
    slogan: 'Spor ile Buyuyen Nesiller',
    hakkimizda: 'BJK Tuzla Cimnastik, Istanbul Tuzla bolgesinde cocuk ve gencler icin profesyonel cimnastik, yuzme ve atletizm egitimi sunan bir spor tesisidir. Deneyimli antrenor kadromuz ile her yasa grubuna uygun programlar sunuyoruz. Tesisimiz modern ekipmanlar ve guvenli ortam ile sporcularin gelisimini en ust duzeyde desteklemektedir.',
    konum: 'Tuzla, Istanbul',
    telefon: '+90 (216) 000 00 00',
    email: 'info@bjktuzlacimnastik.yisa-s.com',
    sablon: 'premium',
    branslar: [
      { isim: 'Cimnastik', icon: 'dumbbell', aciklama: 'Artistik ve ritmik cimnastik egitimi' },
      { isim: 'Yuzme', icon: 'waves', aciklama: 'Temel ve ileri seviye yuzme kurslari' },
      { isim: 'Atletizm', icon: 'timer', aciklama: 'Kosu, atlama ve atma disiplinleri' },
    ],
    antrenorler: [
      { isim: 'Ali Yilmaz', brans: 'Cimnastik', deneyim: '12 yil' },
      { isim: 'Ayse Demir', brans: 'Yuzme', deneyim: '8 yil' },
      { isim: 'Mehmet Kaya', brans: 'Atletizm', deneyim: '10 yil' },
    ],
    basarilar: [
      { isim: 'Elif Ozturk', basari: 'Turkiye Sampiyonu 2025', alinti: 'BJK Tuzla beni sampiyon yapti!' },
      { isim: 'Can Arslan', basari: 'Bolge Birincisi 2025', alinti: 'Antrenorlerim sayesinde basardim.' },
    ],
    duyurular: [
      { tarih: '2026-03-01', baslik: 'Yaz Kampi Basvurulari Basladi', ozet: '2026 yaz kampi icin erken kayit avantajlarindan yararlanin.' },
      { tarih: '2026-02-15', baslik: 'Yeni Yuzme Havuzu Acildi', ozet: 'Olimpik olculerde yeni yuzme havuzumuz hizmetinizde.' },
      { tarih: '2026-02-01', baslik: 'Karne Hediyesi', ozet: 'Karne getiren ogrencilerimize ozel indirim firsati.' },
    ],
    sss: [
      { soru: 'Kayit icin ne gerekiyor?', cevap: 'Kimlik fotokopisi, 2 vesikalik fotograf ve saglik raporu ile kayit olabilirsiniz.' },
      { soru: 'Deneme dersi var mi?', cevap: 'Evet, tum branslarimizda 1 ucretsiz deneme dersi hakkiniz bulunmaktadir.' },
      { soru: 'Yasi kac olan cocuklar baslayabilir?', cevap: '4 yasindan itibaren tum branslarimiza kayit yapilabilir.' },
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    yorumlar: [
      { isim: 'Fatma H.', yildiz: 5, yorum: 'Cocugumun gelisiminden cok memnunuz. Antrenorler harika!' },
      { isim: 'Ahmet K.', yildiz: 5, yorum: 'Profesyonel bir tesis. Temizlik ve guvenlik ust duzeyde.' },
      { isim: 'Zeynep D.', yildiz: 4, yorum: 'Yuzme kursu mukemmel. Kizim 3 ayda ogrenmeyi basladi.' },
    ],
  },
  feneratasehir: {
    adi: 'Fener Atasehir',
    slug: 'feneratasehir',
    slogan: 'Gelecegin Sampiyonlari Burada Yetisiyor',
    hakkimizda: 'Fener Atasehir, Istanbul Atasehir bolgesinde faaliyet gosteren profesyonel bir spor akademisidir. Cimnastik, yuzme ve atletizm dallarinda uzman egitmenler esliginde cocuklarinizin sportif gelisimini destekliyoruz.',
    konum: 'Atasehir, Istanbul',
    telefon: '+90 (216) 111 11 11',
    email: 'info@feneratasehir.yisa-s.com',
    sablon: 'orta',
    branslar: [
      { isim: 'Cimnastik', icon: 'dumbbell', aciklama: 'Artistik cimnastik egitimi' },
      { isim: 'Yuzme', icon: 'waves', aciklama: 'Cocuk ve yetiskin yuzme kurslari' },
      { isim: 'Atletizm', icon: 'timer', aciklama: 'Genel atletizm ve kosu egitimi' },
    ],
    antrenorler: [
      { isim: 'Burak Celik', brans: 'Cimnastik', deneyim: '9 yil' },
      { isim: 'Selin Yildiz', brans: 'Yuzme', deneyim: '7 yil' },
    ],
    basarilar: [
      { isim: 'Deniz Koc', basari: 'Il Ucuncusu 2025', alinti: 'Burada egitim almak harika!' },
    ],
    duyurular: [
      { tarih: '2026-03-01', baslik: 'Mart Ayi Programi', ozet: 'Mart ayi ders programi guncellendi.' },
      { tarih: '2026-02-20', baslik: 'Kayit Indirimi', ozet: 'Mart ayina ozel %10 erken kayit indirimi.' },
    ],
    sss: [
      { soru: 'Ders saatleri nedir?', cevap: 'Hafta ici 09:00-18:00, hafta sonu 09:00-14:00 arasi derslerimiz vardir.' },
      { soru: 'Online odeme yapabilir miyim?', cevap: 'Evet, veli paneli uzerinden kredi karti ile odeme yapabilirsiniz.' },
    ],
  },
}

const BRANS_ICONS: Record<string, React.ElementType> = {
  dumbbell: Dumbbell,
  waves: Waves,
  timer: Timer,
}

export default function TesisPage() {
  const params = useParams()
  const slug = params?.slug as string | undefined
  const tesis = slug ? TESISLER[slug] : undefined

  if (!tesis) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Tesis Bulunamadi</h1>
          <p className="text-zinc-400">Aradiginiz tesis sayfasi mevcut degil.</p>
        </div>
      </div>
    )
  }

  const isOrta = tesis.sablon === 'orta' || tesis.sablon === 'premium'
  const isPremium = tesis.sablon === 'premium'

  return (
    <div className="min-h-screen bg-zinc-950">
      <TesisNavbar tesisAdi={tesis.adi} slug={tesis.slug} />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-transparent" />
        <div className="mx-auto max-w-7xl px-4 md:px-8 py-20 md:py-32 relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 to-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.2)]">
              <Activity className="h-8 w-8 text-zinc-950" strokeWidth={1.5} />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white">{tesis.adi}</h1>
          </div>
          <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mb-8">{tesis.slogan}</p>
          <div className="flex flex-wrap gap-4">
            <a href="#fiyatlar" className="rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 px-8 py-3 text-sm font-medium text-zinc-950 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all">
              Kayit Ol
            </a>
            <a href="#program" className="rounded-xl border border-zinc-700 px-8 py-3 text-sm font-medium text-white hover:border-zinc-600 transition-all">
              Ders Programi
            </a>
          </div>
        </div>
      </section>

      {/* Hakkimizda */}
      <section id="hakkimizda" className="py-16 border-t border-zinc-800/50">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <h2 className="text-2xl font-bold text-white mb-6">Hakkimizda</h2>
          <p className="text-zinc-400 leading-relaxed max-w-3xl">{tesis.hakkimizda}</p>
          <div className="mt-6 flex items-center gap-2 text-sm text-zinc-500">
            <MapPin className="h-4 w-4 text-cyan-400" strokeWidth={1.5} />
            {tesis.konum}
          </div>
        </div>
      </section>

      {/* Branslar */}
      <section id="branslar" className="py-16 border-t border-zinc-800/50">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <h2 className="text-2xl font-bold text-white mb-8">Branslar</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tesis.branslar.map((b) => {
              const Icon = BRANS_ICONS[b.icon] ?? Dumbbell
              return (
                <div key={b.isim} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-cyan-400/30 transition-all duration-300">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400 mb-4">
                    <Icon className="h-6 w-6" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-semibold text-white mb-2">{b.isim}</h3>
                  <p className="text-sm text-zinc-400">{b.aciklama}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Ders Programi */}
      <section id="program" className="py-16 border-t border-zinc-800/50">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <h2 className="text-2xl font-bold text-white mb-2">Haftalik Ders Programi</h2>
          <p className="text-zinc-400 mb-8">PZT-PAZ, 08:00-19:00 arasi ders saatleri</p>
          <DersProgramiGrid />
        </div>
      </section>

      {/* Fiyatlar */}
      <section id="fiyatlar" className="py-16 border-t border-zinc-800/50">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <h2 className="text-2xl font-bold text-white mb-2">Paket Fiyatlari</h2>
          <p className="text-zinc-400 mb-8">Size en uygun paketi secin</p>
          <PaketFiyatlari />
        </div>
      </section>

      {/* Galeri (Orta+) */}
      {isOrta && (
        <section id="galeri" className="py-16 border-t border-zinc-800/50">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <h2 className="text-2xl font-bold text-white mb-8">Galeri</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="aspect-video rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                  <span className="text-zinc-600 text-sm">Gorsel {i}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Antrenorler (Orta+) */}
      {isOrta && tesis.antrenorler && (
        <section id="antrenorler" className="py-16 border-t border-zinc-800/50">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <h2 className="text-2xl font-bold text-white mb-8">Antrenorlerimiz</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {tesis.antrenorler.map((a) => (
                <div key={a.isim} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center">
                  <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-cyan-400/10 text-cyan-400 font-bold text-xl mb-4">
                    {a.isim.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <h3 className="font-semibold text-white">{a.isim}</h3>
                  <p className="text-sm text-cyan-400 mt-1">{a.brans}</p>
                  <p className="text-xs text-zinc-500 mt-1">{a.deneyim} deneyim</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Basari Hikayeleri (Orta+) */}
      {isOrta && tesis.basarilar && (
        <section className="py-16 border-t border-zinc-800/50">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <h2 className="text-2xl font-bold text-white mb-8">Basari Hikayeleri</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tesis.basarilar.map((b) => (
                <div key={b.isim} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-400/10 text-amber-400">
                      <Star className="h-5 w-5" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="font-semibold text-white">{b.isim}</p>
                      <p className="text-xs text-cyan-400">{b.basari}</p>
                    </div>
                  </div>
                  <p className="text-sm text-zinc-400 italic">&ldquo;{b.alinti}&rdquo;</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Duyurular (Orta+) */}
      {isOrta && tesis.duyurular && (
        <section className="py-16 border-t border-zinc-800/50">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <h2 className="text-2xl font-bold text-white mb-8">Duyurular</h2>
            <div className="space-y-4">
              {tesis.duyurular.map((d) => (
                <div key={d.baslik} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                  <p className="text-xs text-zinc-500 mb-1">{d.tarih}</p>
                  <h3 className="font-semibold text-white mb-2">{d.baslik}</h3>
                  <p className="text-sm text-zinc-400">{d.ozet}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SSS (Orta+) */}
      {isOrta && tesis.sss && <SSSBolumu sss={tesis.sss} />}

      {/* Canli Istatistikler (Premium) */}
      {isPremium && (
        <section className="py-16 border-t border-zinc-800/50">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <h2 className="text-2xl font-bold text-white mb-8">Canli Istatistikler</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-zinc-900 border border-cyan-400/20 rounded-2xl p-6 text-center shadow-[0_0_20px_rgba(34,211,238,0.05)]">
                <Users className="h-8 w-8 text-cyan-400 mx-auto mb-3" strokeWidth={1.5} />
                <p className="text-3xl font-bold text-white">140+</p>
                <p className="text-sm text-zinc-400 mt-1">Aktif Ogrenci</p>
              </div>
              <div className="bg-zinc-900 border border-cyan-400/20 rounded-2xl p-6 text-center shadow-[0_0_20px_rgba(34,211,238,0.05)]">
                <Dumbbell className="h-8 w-8 text-cyan-400 mx-auto mb-3" strokeWidth={1.5} />
                <p className="text-3xl font-bold text-white">3</p>
                <p className="text-sm text-zinc-400 mt-1">Aktif Brans</p>
              </div>
              <div className="bg-zinc-900 border border-cyan-400/20 rounded-2xl p-6 text-center shadow-[0_0_20px_rgba(34,211,238,0.05)]">
                <CalendarIcon className="h-8 w-8 text-cyan-400 mx-auto mb-3" strokeWidth={1.5} />
                <p className="text-3xl font-bold text-white">60+</p>
                <p className="text-sm text-zinc-400 mt-1">Haftalik Ders</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Video (Premium) */}
      {isPremium && tesis.videoUrl && (
        <section className="py-16 border-t border-zinc-800/50">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <h2 className="text-2xl font-bold text-white mb-8">Tanitim Videosu</h2>
            <div className="aspect-video rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 flex items-center justify-center">
              <div className="text-center">
                <Play className="h-16 w-16 text-cyan-400 mx-auto mb-4" strokeWidth={1.5} />
                <p className="text-zinc-400">Video yakinda eklenecek</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Veli Yorumlari (Premium) */}
      {isPremium && tesis.yorumlar && (
        <section className="py-16 border-t border-zinc-800/50">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <h2 className="text-2xl font-bold text-white mb-8">Veli Yorumlari</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {tesis.yorumlar.map((y) => (
                <div key={y.isim} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < y.yildiz ? 'text-amber-400 fill-amber-400' : 'text-zinc-700'}`}
                        strokeWidth={1.5}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-zinc-400 mb-3 italic">&ldquo;{y.yorum}&rdquo;</p>
                  <p className="text-xs text-zinc-500 font-medium">{y.isim}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Iletisim */}
      <section id="iletisim" className="py-16 border-t border-zinc-800/50">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <h2 className="text-2xl font-bold text-white mb-8">Iletisim</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
                  <MapPin className="h-6 w-6" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-sm text-zinc-500">Adres</p>
                  <p className="text-white">{tesis.konum}</p>
                </div>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
                  <Phone className="h-6 w-6" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-sm text-zinc-500">Telefon</p>
                  <p className="text-white">{tesis.telefon}</p>
                </div>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
                  <Mail className="h-6 w-6" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-sm text-zinc-500">E-posta</p>
                  <p className="text-white">{tesis.email}</p>
                </div>
              </div>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex items-center justify-center min-h-[300px]">
              <div className="text-center p-8">
                <MapPin className="h-12 w-12 text-zinc-600 mx-auto mb-3" strokeWidth={1.5} />
                <p className="text-zinc-500 text-sm">Harita yakinda eklenecek</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TesisFooter tesisAdi={tesis.adi} />

      {/* Robot Karsilama -- Premium only */}
      {isPremium && <RobotKarsilama />}

      {/* Randevu Modal -- Premium only */}
      {isPremium && <RandevuButonu />}
    </div>
  )
}

/* SSS Accordion */
function SSSBolumu({ sss }: { sss: { soru: string; cevap: string }[] }) {
  const [acik, setAcik] = useState<number | null>(null)

  return (
    <section className="py-16 border-t border-zinc-800/50">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <h2 className="text-2xl font-bold text-white mb-8">Sik Sorulan Sorular</h2>
        <div className="space-y-3 max-w-3xl">
          {sss.map((s, i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
              <button
                onClick={() => setAcik(acik === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-medium text-white text-sm">{s.soru}</span>
                {acik === i ? (
                  <ChevronUp className="h-5 w-5 text-cyan-400 shrink-0" strokeWidth={1.5} />
                ) : (
                  <ChevronDown className="h-5 w-5 text-zinc-500 shrink-0" strokeWidth={1.5} />
                )}
              </button>
              {acik === i && (
                <div className="px-5 pb-5 text-sm text-zinc-400">{s.cevap}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* Robot Karsilama Widget (Premium) */
function RobotKarsilama() {
  const [acik, setAcik] = useState(false)

  React.useEffect(() => {
    const timer = setTimeout(() => setAcik(true), 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <button
        onClick={() => setAcik(!acik)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-cyan-400 text-zinc-950 shadow-[0_0_30px_rgba(34,211,238,0.3)] hover:shadow-[0_0_40px_rgba(34,211,238,0.4)] transition-all"
      >
        <MessageCircle className="h-6 w-6" strokeWidth={1.5} />
      </button>

      {acik && (
        <div className="fixed bottom-24 right-6 z-50 w-80 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between bg-gradient-to-r from-cyan-500 to-cyan-400 px-4 py-3">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-zinc-950" strokeWidth={1.5} />
              <span className="font-semibold text-zinc-950 text-sm">YISA-S Asistan</span>
            </div>
            <button onClick={() => setAcik(false)} className="text-zinc-950 hover:text-zinc-800">
              <X className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>
          <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
            <div className="bg-zinc-800 rounded-xl rounded-tl-sm p-3 text-sm text-zinc-300">
              Merhaba! Size nasil yardimci olabilirim? Ders programi, fiyatlar veya kayit hakkinda bilgi alabiliriz.
            </div>
            <div className="flex flex-wrap gap-2">
              {['Ders Programi', 'Fiyatlar', 'Demo Talep'].map((s) => (
                <button key={s} className="rounded-full bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 text-xs px-3 py-1.5 hover:bg-cyan-400/20 transition-colors">
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="border-t border-zinc-800 p-3 flex gap-2">
            <input
              type="text"
              placeholder="Mesajinizi yazin..."
              className="flex-1 rounded-xl bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
            />
            <button className="rounded-xl bg-cyan-400 px-3 py-2 text-zinc-950">
              <BarChart3 className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}

/* Randevu Butonu (Premium) */
function RandevuButonu() {
  const [modalAcik, setModalAcik] = useState(false)

  return (
    <>
      <button
        onClick={() => setModalAcik(true)}
        className="fixed bottom-6 right-24 z-50 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 px-6 py-3 text-sm font-medium text-zinc-950 shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] transition-all"
      >
        Randevu Al
      </button>

      {modalAcik && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-zinc-800">
              <h2 className="text-lg font-bold text-white">Randevu Al</h2>
              <button onClick={() => setModalAcik(false)} className="text-zinc-500 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-medium text-zinc-400 block mb-1.5">Brans</label>
                <select className="w-full rounded-xl bg-zinc-800 border border-zinc-700 px-4 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none">
                  <option>Cimnastik</option>
                  <option>Yuzme</option>
                  <option>Atletizm</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-400 block mb-1.5">Tercih Edilen Gun</label>
                <select className="w-full rounded-xl bg-zinc-800 border border-zinc-700 px-4 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none">
                  <option>Pazartesi</option>
                  <option>Sali</option>
                  <option>Carsamba</option>
                  <option>Persembe</option>
                  <option>Cuma</option>
                  <option>Cumartesi</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-400 block mb-1.5">Tercih Edilen Saat</label>
                <select className="w-full rounded-xl bg-zinc-800 border border-zinc-700 px-4 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none">
                  <option>09:00 - 10:00</option>
                  <option>10:00 - 11:00</option>
                  <option>13:00 - 14:00</option>
                  <option>14:00 - 15:00</option>
                  <option>15:00 - 16:00</option>
                  <option>16:00 - 17:00</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-400 block mb-1.5">Veli Adi</label>
                <input type="text" className="w-full rounded-xl bg-zinc-800 border border-zinc-700 px-4 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none" placeholder="Adiniz Soyadiniz" />
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-400 block mb-1.5">Telefon</label>
                <input type="tel" className="w-full rounded-xl bg-zinc-800 border border-zinc-700 px-4 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none" placeholder="05XX XXX XX XX" />
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-400 block mb-1.5">E-posta</label>
                <input type="email" className="w-full rounded-xl bg-zinc-800 border border-zinc-700 px-4 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none" placeholder="email@ornek.com" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-zinc-400 block mb-1.5">Cocuk Adi</label>
                  <input type="text" className="w-full rounded-xl bg-zinc-800 border border-zinc-700 px-4 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none" placeholder="Cocuk adi" />
                </div>
                <div>
                  <label className="text-xs font-medium text-zinc-400 block mb-1.5">Cocuk Yasi</label>
                  <input type="number" className="w-full rounded-xl bg-zinc-800 border border-zinc-700 px-4 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none" placeholder="Yas" />
                </div>
              </div>
              <button className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 px-4 py-3 text-sm font-medium text-zinc-950 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all mt-2">
                Randevu Talebi Gonder
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
