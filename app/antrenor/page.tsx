'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Users, Calendar, CheckCircle, XCircle, TrendingUp, ClipboardCheck, Ruler, Loader2 } from 'lucide-react'

type BugunDers = { id: string; gun: string; saat: string; ders_adi: string; brans?: string }
type YoklamaOzet = { tarih: string; geldi: number; gelmedi: number }

export default function AntrenorDashboard() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<{
    bugunDersleri: BugunDers[]
    sporcuSayisi: number
    sonYoklamalar: YoklamaOzet[]
    bugunTarih: string
    haftalikDersSayisi?: number
    toplamYoklama?: number
    devamOrani?: number
  } | null>(null)

  useEffect(() => {
    fetch('/api/antrenor/dashboard')
      .then((r) => r.json())
      .then((d) => {
        const yoklamalar: YoklamaOzet[] = d.sonYoklamalar ?? []
        const toplamGeldi = yoklamalar.reduce((s: number, y: YoklamaOzet) => s + y.geldi, 0)
        const toplamHepsi = yoklamalar.reduce((s: number, y: YoklamaOzet) => s + y.geldi + y.gelmedi, 0)
        setData({
          bugunDersleri: d.bugunDersleri ?? [],
          sporcuSayisi: d.sporcuSayisi ?? 0,
          sonYoklamalar: yoklamalar,
          bugunTarih: d.bugunTarih ?? '',
          haftalikDersSayisi: d.haftalikDersSayisi ?? 0,
          toplamYoklama: toplamHepsi,
          devamOrani: toplamHepsi > 0 ? Math.round((toplamGeldi / toplamHepsi) * 100) : 0,
        })
      })
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
      </div>
    )
  }

  const d = data ?? { bugunDersleri: [], sporcuSayisi: 0, sonYoklamalar: [], bugunTarih: '', haftalikDersSayisi: 0, toplamYoklama: 0, devamOrani: 0 }

  return (
    <main className="p-4 space-y-4">
      {/* Hos geldiniz */}
      <div className="bg-zinc-900 border border-cyan-400/20 rounded-2xl p-4 shadow-[0_0_20px_rgba(34,211,238,0.05)]">
        <p className="text-sm text-zinc-400">Hos geldiniz</p>
        <h1 className="text-xl font-bold text-white">Antrenor Paneli</h1>
        <p className="text-sm text-zinc-400">
          Bugun {d.bugunDersleri.length} ders, {d.sporcuSayisi} sporcu
        </p>
      </div>

      {/* Istatistik Kartlari */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
          <Users className="h-5 w-5 text-cyan-400 mb-2" strokeWidth={1.5} />
          <p className="text-2xl font-bold text-white">{d.sporcuSayisi}</p>
          <p className="text-xs text-zinc-500">Atanan Sporcu</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
          <Calendar className="h-5 w-5 text-cyan-400 mb-2" strokeWidth={1.5} />
          <p className="text-2xl font-bold text-white">{d.bugunDersleri.length}</p>
          <p className="text-xs text-zinc-500">Bugunun Dersleri</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
          <ClipboardCheck className="h-5 w-5 text-cyan-400 mb-2" strokeWidth={1.5} />
          <p className="text-2xl font-bold text-white">{d.haftalikDersSayisi ?? 0}</p>
          <p className="text-xs text-zinc-500">Haftalik Ders</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
          <TrendingUp className="h-5 w-5 text-cyan-400 mb-2" strokeWidth={1.5} />
          <p className="text-2xl font-bold text-white">%{d.devamOrani ?? 0}</p>
          <p className="text-xs text-zinc-500">Devam Orani</p>
        </div>
      </div>

      {/* Hizli Erisim */}
      <div className="grid grid-cols-3 gap-3">
        <Link href="/antrenor/yoklama">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 hover:border-cyan-400/30 transition-all duration-300 text-center">
            <ClipboardCheck className="h-6 w-6 text-cyan-400 mx-auto mb-2" strokeWidth={1.5} />
            <p className="text-xs font-medium text-white">Yoklama Al</p>
          </div>
        </Link>
        <Link href="/antrenor/sporcular">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 hover:border-cyan-400/30 transition-all duration-300 text-center">
            <Users className="h-6 w-6 text-cyan-400 mx-auto mb-2" strokeWidth={1.5} />
            <p className="text-xs font-medium text-white">Sporcularim</p>
          </div>
        </Link>
        <Link href="/antrenor/olcum">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 hover:border-cyan-400/30 transition-all duration-300 text-center">
            <Ruler className="h-6 w-6 text-cyan-400 mx-auto mb-2" strokeWidth={1.5} />
            <p className="text-xs font-medium text-white">Olcum Girisi</p>
          </div>
        </Link>
      </div>

      {/* Bugunun Programi */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-1">
          <Calendar className="h-4 w-4 text-cyan-400" strokeWidth={1.5} />
          Bugunun Programi
        </h3>
        <p className="text-xs text-zinc-500 mb-3">{d.bugunTarih}</p>
        {d.bugunDersleri.length === 0 ? (
          <p className="text-sm text-zinc-500">Bugun ders yok.</p>
        ) : (
          <div className="space-y-2">
            {d.bugunDersleri.map((ders) => (
              <div key={ders.id} className="flex items-center justify-between rounded-xl border border-zinc-700 p-3">
                <div>
                  <p className="font-medium text-white">{ders.ders_adi}</p>
                  <p className="text-xs text-zinc-400">{ders.saat} {ders.brans ? `· ${ders.brans}` : ''}</p>
                </div>
                <span className="rounded-full bg-cyan-400/10 text-cyan-400 text-xs px-3 py-1">Ders</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Son Yoklamalar */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
        <h3 className="text-sm font-semibold text-white mb-1">Son Yoklamalar Ozeti</h3>
        <p className="text-xs text-zinc-500 mb-3">Son gunlerin geldi / gelmedi sayilari</p>
        {d.sonYoklamalar.length === 0 ? (
          <p className="text-sm text-zinc-500">Henuz yoklama yok.</p>
        ) : (
          <div className="space-y-2">
            {d.sonYoklamalar.map((y) => (
              <div key={y.tarih} className="flex items-center justify-between rounded-xl border border-zinc-700 p-3">
                <span className="text-sm font-medium text-white">{y.tarih}</span>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <CheckCircle className="h-4 w-4" strokeWidth={1.5} />
                    {y.geldi}
                  </span>
                  <span className="flex items-center gap-1 text-red-400">
                    <XCircle className="h-4 w-4" strokeWidth={1.5} />
                    {y.gelmedi}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
