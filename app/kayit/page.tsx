"use client"

import { useState } from "react"
import {
  ArrowRight,
  ArrowLeft,
  User,
  Baby,
  BarChart3,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Trophy,
  Ruler,
  Weight,
  Activity,
  Star,
} from "lucide-react"

/* ================================================================
   Veli Kayıt — Mobile-First Registration Flow
   Step 1: Hoş geldiniz (welcome)
   Step 2: Veli profil formu
   Step 3: Çocuk profil formu
   Step 4: Gelişim grafikleri (boy, kilo, performans)
   Step 5: Tamamlandı
   ================================================================ */

type Step = 1 | 2 | 3 | 4 | 5

interface VeliProfile {
  name: string
  email: string
  phone: string
  address: string
  city: string
}

interface ChildProfile {
  name: string
  birthdate: string
  gender: string
  sport: string
  level: string
  height: string
  weight: string
}

interface DevelopmentData {
  month: string
  height: number
  weight: number
  performance: number
}

const SPORTS = [
  "Cimnastik",
  "Basketbol",
  "Voleybol",
  "Yüzme",
  "Futbol",
  "Tenis",
]

const LEVELS = ["Başlangıç", "Orta", "İleri", "Yarışmacı"]

/** Ornek gelisim verisi */
const SAMPLE_DEVELOPMENT: DevelopmentData[] = [
  { month: "Oca", height: 120, weight: 25, performance: 40 },
  { month: "Şub", height: 121, weight: 25.5, performance: 45 },
  { month: "Mar", height: 121.5, weight: 26, performance: 52 },
  { month: "Nis", height: 122, weight: 26.2, performance: 58 },
  { month: "May", height: 123, weight: 26.5, performance: 65 },
  { month: "Haz", height: 124, weight: 27, performance: 72 },
]

const STEP_CONFIG = [
  { step: 1 as Step, label: "Hoş Geldiniz", icon: Star },
  { step: 2 as Step, label: "Veli Bilgileri", icon: User },
  { step: 3 as Step, label: "Çocuk Profili", icon: Baby },
  { step: 4 as Step, label: "Gelişim", icon: BarChart3 },
  { step: 5 as Step, label: "Tamamlandı", icon: CheckCircle2 },
]

export default function VeliKayitPage() {
  const [step, setStep] = useState<Step>(1)
  const [veli, setVeli] = useState<VeliProfile>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
  })
  const [child, setChild] = useState<ChildProfile>({
    name: "",
    birthdate: "",
    gender: "",
    sport: "",
    level: "",
    height: "",
    weight: "",
  })

  function nextStep() {
    if (step < 5) setStep((step + 1) as Step)
  }
  function prevStep() {
    if (step > 1) setStep((step - 1) as Step)
  }

  async function handleSubmit() {
    try {
      await fetch("/api/demo-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: veli.name,
          email: veli.email,
          phone: veli.phone,
          source: "veli_kayit",
          notes: JSON.stringify({ veli, child }),
        }),
      })
    } catch {
      // continue to success
    }
    nextStep()
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-[Inter] flex flex-col">
      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-1 py-4 px-4 bg-zinc-900 border-b border-zinc-800">
        {STEP_CONFIG.map((s, i) => (
          <div key={s.step} className="flex items-center">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold transition-all ${
                step >= s.step
                  ? "bg-cyan-600 text-white"
                  : "bg-zinc-800 text-zinc-500"
              }`}
            >
              {step > s.step ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <s.icon className="w-4 h-4" />
              )}
            </div>
            {i < STEP_CONFIG.length - 1 && (
              <div
                className={`w-6 md:w-12 h-0.5 mx-1 ${
                  step > s.step ? "bg-cyan-600" : "bg-zinc-800"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md">
          {/* STEP 1: Welcome */}
          {step === 1 && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-cyan-500/20 flex items-center justify-center">
                <Star className="w-10 h-10 text-cyan-400" />
              </div>
              <h1 className="text-3xl font-bold">
                YiSA-S&apos;e Hoş Geldiniz!
              </h1>
              <p className="text-zinc-400 leading-relaxed">
                Çocuğunuzun spor gelişimini takip etmek, ders programını
                görüntülemek ve ödemelerinizi kolayca yönetmek için kayıt
                olun.
              </p>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800">
                  <Calendar className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
                  <span className="text-xs text-zinc-400">
                    Ders Programı
                  </span>
                </div>
                <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800">
                  <BarChart3 className="w-5 h-5 text-orange-400 mx-auto mb-1" />
                  <span className="text-xs text-zinc-400">
                    Gelişim Takibi
                  </span>
                </div>
                <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800">
                  <Trophy className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                  <span className="text-xs text-zinc-400">
                    Başarılar
                  </span>
                </div>
              </div>
              <button
                onClick={nextStep}
                className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
              >
                Kayıt Ol
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: Veli Profile */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold mb-1">Veli Bilgileri</h2>
                <p className="text-sm text-zinc-400">
                  İletişim bilgilerinizi girin
                </p>
              </div>
              <div className="space-y-3">
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="Ad Soyad"
                    value={veli.name}
                    onChange={(e) =>
                      setVeli((p) => ({ ...p, name: e.target.value }))
                    }
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                  <input
                    type="email"
                    placeholder="E-posta"
                    value={veli.email}
                    onChange={(e) =>
                      setVeli((p) => ({ ...p, email: e.target.value }))
                    }
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                  <input
                    type="tel"
                    placeholder="Telefon"
                    value={veli.phone}
                    onChange={(e) =>
                      setVeli((p) => ({ ...p, phone: e.target.value }))
                    }
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="Adres"
                    value={veli.address}
                    onChange={(e) =>
                      setVeli((p) => ({ ...p, address: e.target.value }))
                    }
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="Şehir"
                    value={veli.city}
                    onChange={(e) =>
                      setVeli((p) => ({ ...p, city: e.target.value }))
                    }
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={prevStep}
                  className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Geri
                </button>
                <button
                  onClick={nextStep}
                  className="flex-1 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  Devam
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Child Profile */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold mb-1">Çocuk Profili</h2>
                <p className="text-sm text-zinc-400">
                  Çocuğunuzun bilgilerini girin
                </p>
              </div>
              <div className="space-y-3">
                <div className="relative">
                  <Baby className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="Çocuk Adı"
                    value={child.name}
                    onChange={(e) =>
                      setChild((p) => ({ ...p, name: e.target.value }))
                    }
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                  <input
                    type="date"
                    value={child.birthdate}
                    onChange={(e) =>
                      setChild((p) => ({
                        ...p,
                        birthdate: e.target.value,
                      }))
                    }
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <select
                  value={child.gender}
                  onChange={(e) =>
                    setChild((p) => ({ ...p, gender: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="">Cinsiyet</option>
                  <option value="erkek">Erkek</option>
                  <option value="kiz">Kız</option>
                </select>
                <select
                  value={child.sport}
                  onChange={(e) =>
                    setChild((p) => ({ ...p, sport: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="">Branş Seçin</option>
                  {SPORTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <select
                  value={child.level}
                  onChange={(e) =>
                    setChild((p) => ({ ...p, level: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="">Seviye</option>
                  {LEVELS.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <Ruler className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                    <input
                      type="text"
                      placeholder="Boy (cm)"
                      value={child.height}
                      onChange={(e) =>
                        setChild((p) => ({
                          ...p,
                          height: e.target.value,
                        }))
                      }
                      className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div className="relative">
                    <Weight className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                    <input
                      type="text"
                      placeholder="Kilo (kg)"
                      value={child.weight}
                      onChange={(e) =>
                        setChild((p) => ({
                          ...p,
                          weight: e.target.value,
                        }))
                      }
                      className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={prevStep}
                  className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Geri
                </button>
                <button
                  onClick={nextStep}
                  className="flex-1 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  Devam
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Development Graphs */}
          {step === 4 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold mb-1">Gelişim Takibi</h2>
                <p className="text-sm text-zinc-400">
                  Kayıt sonrası çocuğunuzun gelişimini buradan takip
                  edebileceksiniz
                </p>
              </div>

              {/* Height Graph */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Ruler className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-semibold">Boy Gelişimi (cm)</h3>
                </div>
                <div className="flex items-end gap-2 h-32">
                  {SAMPLE_DEVELOPMENT.map((d) => {
                    const pct = ((d.height - 118) / 8) * 100
                    return (
                      <div
                        key={d.month}
                        className="flex-1 flex flex-col items-center gap-1"
                      >
                        <span className="text-[10px] text-zinc-400">
                          {d.height}
                        </span>
                        <div
                          className="w-full bg-cyan-500/30 rounded-t-md"
                          style={{ height: `${Math.max(pct, 10)}%` }}
                        >
                          <div
                            className="w-full h-full bg-cyan-500 rounded-t-md opacity-70"
                            style={{ height: "100%" }}
                          />
                        </div>
                        <span className="text-[10px] text-zinc-500">
                          {d.month}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Weight Graph */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Weight className="w-4 h-4 text-orange-400" />
                  <h3 className="text-sm font-semibold">Kilo Takibi (kg)</h3>
                </div>
                <div className="flex items-end gap-2 h-32">
                  {SAMPLE_DEVELOPMENT.map((d) => {
                    const pct = ((d.weight - 24) / 4) * 100
                    return (
                      <div
                        key={d.month}
                        className="flex-1 flex flex-col items-center gap-1"
                      >
                        <span className="text-[10px] text-zinc-400">
                          {d.weight}
                        </span>
                        <div
                          className="w-full bg-orange-500/30 rounded-t-md"
                          style={{ height: `${Math.max(pct, 10)}%` }}
                        >
                          <div
                            className="w-full h-full bg-orange-500 rounded-t-md opacity-70"
                            style={{ height: "100%" }}
                          />
                        </div>
                        <span className="text-[10px] text-zinc-500">
                          {d.month}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Performance Graph */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-semibold">
                    Performans Puanı (0-100)
                  </h3>
                </div>
                <div className="flex items-end gap-2 h-32">
                  {SAMPLE_DEVELOPMENT.map((d) => {
                    return (
                      <div
                        key={d.month}
                        className="flex-1 flex flex-col items-center gap-1"
                      >
                        <span className="text-[10px] text-zinc-400">
                          {d.performance}
                        </span>
                        <div
                          className="w-full bg-emerald-500/30 rounded-t-md"
                          style={{
                            height: `${Math.max(d.performance, 5)}%`,
                          }}
                        >
                          <div
                            className="w-full h-full bg-emerald-500 rounded-t-md opacity-70"
                            style={{ height: "100%" }}
                          />
                        </div>
                        <span className="text-[10px] text-zinc-500">
                          {d.month}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={prevStep}
                  className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Geri
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  Kaydı Tamamla
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Success */}
          {step === 5 && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
              </div>
              <h1 className="text-2xl font-bold">Kayıt Tamamlandı!</h1>
              <p className="text-zinc-400 leading-relaxed">
                Teşekkürler! Kaydınız başarıyla oluşturuldu. En kısa
                sürede sizinle iletişime geçeceğiz.
              </p>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-left space-y-2">
                {veli.name && (
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Veli</span>
                    <span className="text-white">{veli.name}</span>
                  </div>
                )}
                {child.name && (
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Çocuk</span>
                    <span className="text-white">{child.name}</span>
                  </div>
                )}
                {child.sport && (
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Branş</span>
                    <span className="text-white">{child.sport}</span>
                  </div>
                )}
                {veli.phone && (
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Telefon</span>
                    <span className="text-white">{veli.phone}</span>
                  </div>
                )}
              </div>
              <a
                href="/"
                className="inline-block w-full py-3 bg-cyan-600 hover:bg-cyan-500 rounded-xl font-semibold text-sm text-center transition-colors"
              >
                Ana Sayfaya Dön
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
