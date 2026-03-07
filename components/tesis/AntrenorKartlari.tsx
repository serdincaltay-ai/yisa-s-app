'use client'

import React from 'react'
import { Dumbbell, Award, CheckCircle, XCircle } from 'lucide-react'

type AntrenorKart = {
  isim: string
  brans: string
  lisans_turu?: string
  is_competitive_coach?: boolean
  foto?: string
}

interface AntrenorKartlariProps {
  antrenorler: AntrenorKart[]
}

export function AntrenorKartlari({ antrenorler }: AntrenorKartlariProps) {
  if (!antrenorler || antrenorler.length === 0) return null

  return (
    <div>
      <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <Award className="h-5 w-5 text-cyan-400" strokeWidth={1.5} />
        Yarışmacı Antrenörler
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {antrenorler.map((a) => (
          <div key={a.isim} className="glass-panel p-5 text-center border border-zinc-800">
            {/* Avatar */}
            <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-cyan-400/10 text-cyan-400 font-bold text-xl mb-3">
              {a.foto ? (
                <img src={a.foto} alt={a.isim} className="h-16 w-16 rounded-full object-cover" />
              ) : (
                a.isim.split(' ').map((n) => n[0]).join('')
              )}
            </div>
            <h3 className="font-semibold text-white text-sm">{a.isim}</h3>
            <p className="text-xs text-cyan-400 mt-1 flex items-center justify-center gap-1">
              <Dumbbell className="h-3 w-3" strokeWidth={1.5} />
              {a.brans}
            </p>
            {a.lisans_turu && (
              <p className="text-[10px] text-zinc-500 mt-1">Lisans: {a.lisans_turu}</p>
            )}
            <div className="mt-2 flex items-center justify-center gap-1">
              {a.is_competitive_coach ? (
                <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  <CheckCircle className="h-3 w-3" strokeWidth={1.5} />
                  Yarışmacı Sporcu Çalıştırma: Evet
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[10px] text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded-full border border-zinc-700">
                  <XCircle className="h-3 w-3" strokeWidth={1.5} />
                  Yarışmacı Sporcu Çalıştırma: Hayır
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
