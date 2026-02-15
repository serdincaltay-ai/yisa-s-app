'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, X, AlertCircle } from 'lucide-react'

export type YoklamaItem = {
  student_id: string
  ad_soyad: string | null
  brans: string | null
  attendance_id?: string
  status: 'katildi' | 'katilmadi' | 'bildirimli_iptal'
  note?: string | null
  seans_dustu?: boolean
}

type YoklamaListProps = {
  items: YoklamaItem[]
  onChange: (studentId: string, status: YoklamaItem['status']) => void
  isMobile?: boolean
}

export function YoklamaList({ items, onChange, isMobile }: YoklamaListProps) {
  if (items.length === 0) {
    return (
      <p className="text-muted-foreground text-center py-8">
        Bu tarih ve branşta öğrenci bulunamadı.
      </p>
    )
  }

  const btnClass = 'min-h-[44px] min-w-[44px] flex-1 flex items-center justify-center gap-1 text-sm font-medium transition-colors'
  const btnKatildi = `${btnClass} rounded-l-md border border-green-600 bg-green-600/20 text-green-400 hover:bg-green-600/40`
  const btnKatilmadi = `${btnClass} border-y border-red-600/50 bg-red-600/10 text-red-400 hover:bg-red-600/30`
  const btnIptal = `${btnClass} rounded-r-md border border-amber-600/50 bg-amber-600/20 text-amber-400 hover:bg-amber-600/40`

  if (isMobile) {
    return (
      <div className="grid gap-4 sm:hidden">
        {items.map((item) => (
          <Card key={item.student_id}>
            <CardContent className="p-4">
              <p className="font-medium text-foreground mb-3">{item.ad_soyad ?? '—'}</p>
              <div className="flex gap-1">
                <button
                  type="button"
                  className={item.status === 'katildi' ? `${btnKatildi} ring-2 ring-green-500` : btnKatildi}
                  onClick={() => onChange(item.student_id, 'katildi')}
                >
                  <Check className="h-5 w-5" />
                  Katıldı
                </button>
                <button
                  type="button"
                  className={item.status === 'katilmadi' ? `${btnKatilmadi} ring-2 ring-red-500` : btnKatilmadi}
                  onClick={() => onChange(item.student_id, 'katilmadi')}
                >
                  <X className="h-5 w-5" />
                  Katılmadı
                </button>
                <button
                  type="button"
                  className={item.status === 'bildirimli_iptal' ? `${btnIptal} ring-2 ring-amber-500` : btnIptal}
                  onClick={() => onChange(item.student_id, 'bildirimli_iptal')}
                >
                  <AlertCircle className="h-5 w-5" />
                  İptal
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="rounded-lg border overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="h-12 px-4 text-left font-medium">Ad Soyad</th>
            <th className="h-12 px-4 text-left font-medium">Branş</th>
            <th className="h-12 px-4 text-left font-medium w-64">Durum</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.student_id} className="border-b last:border-0 hover:bg-muted/30">
              <td className="p-4 font-medium">{item.ad_soyad ?? '—'}</td>
              <td className="p-4 text-muted-foreground">{item.brans ?? '—'}</td>
              <td className="p-2">
                <div className="flex gap-1">
                  <button
                    type="button"
                    className={item.status === 'katildi' ? `${btnKatildi} ring-2 ring-green-500` : btnKatildi}
                    onClick={() => onChange(item.student_id, 'katildi')}
                  >
                    <Check className="h-4 w-4" />
                    Katıldı
                  </button>
                  <button
                    type="button"
                    className={item.status === 'katilmadi' ? `${btnKatilmadi} ring-2 ring-red-500` : btnKatilmadi}
                    onClick={() => onChange(item.student_id, 'katilmadi')}
                  >
                    <X className="h-4 w-4" />
                    Katılmadı
                  </button>
                  <button
                    type="button"
                    className={item.status === 'bildirimli_iptal' ? `${btnIptal} ring-2 ring-amber-500` : btnIptal}
                    onClick={() => onChange(item.student_id, 'bildirimli_iptal')}
                  >
                    <AlertCircle className="h-4 w-4" />
                    İptal
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
