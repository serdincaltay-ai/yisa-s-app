'use client'

import React from 'react'
import { Shield, Phone, Users, Building2 } from 'lucide-react'

type IlTemsilcisi = {
  adi: string
  bransi: string
  telefon: string
}

type YarisanKulup = {
  isim: string
  sehir?: string
}

interface FederasyonBilgileriProps {
  ilTemsilcisi?: IlTemsilcisi
  yarisanKulupler?: YarisanKulup[]
}

export function FederasyonBilgileri({ ilTemsilcisi, yarisanKulupler }: FederasyonBilgileriProps) {
  if (!ilTemsilcisi && (!yarisanKulupler || yarisanKulupler.length === 0)) return null

  return (
    <div>
      <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <Shield className="h-5 w-5 text-cyan-400" strokeWidth={1.5} />
        Federasyon Bilgileri
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* İl Temsilcisi */}
        {ilTemsilcisi && (
          <div className="glass-panel p-5 border border-zinc-800">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-cyan-400" strokeWidth={1.5} />
              İl Temsilcisi
            </h3>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-zinc-500">Ad</p>
                <p className="text-sm text-white font-medium">{ilTemsilcisi.adi}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500">Branş</p>
                <p className="text-sm text-white">{ilTemsilcisi.bransi}</p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-cyan-400" strokeWidth={1.5} />
                <a href={`tel:${ilTemsilcisi.telefon}`} className="text-sm text-cyan-400 hover:text-cyan-300">
                  {ilTemsilcisi.telefon}
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Yarisan Kulupler */}
        {yarisanKulupler && yarisanKulupler.length > 0 && (
          <div className="glass-panel p-5 border border-zinc-800">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Users className="h-4 w-4 text-cyan-400" strokeWidth={1.5} />
              Federasyonda Yarışan Kulüpler
            </h3>
            <div className="space-y-2">
              {yarisanKulupler.map((k) => (
                <div key={k.isim} className="flex items-center gap-2 rounded-xl border border-zinc-700 p-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-400 text-xs font-bold shrink-0">
                    {k.isim[0]}
                  </div>
                  <div>
                    <p className="text-sm text-white font-medium">{k.isim}</p>
                    {k.sehir && <p className="text-[10px] text-zinc-500">{k.sehir}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
