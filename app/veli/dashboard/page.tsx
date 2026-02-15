'use client'

import React, { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { VeliIntro } from '@/components/VeliIntro'
import { Activity, Users, Calendar, Loader2, Coins, TrendingUp } from 'lucide-react'

type Child = {
  id: string
  name: string
  surname?: string | null
  birth_date?: string | null
  branch?: string | null
  level?: string | null
  ders_kredisi?: number | null
}

export default function VeliDashboardPage() {
  const [children, setChildren] = useState<Child[]>([])
  const [loading, setLoading] = useState(true)
  const [attendanceMap, setAttendanceMap] = useState<Record<string, { rate: number; lastDate: string | null }>>({})

  const fetchChildren = useCallback(async () => {
    const res = await fetch('/api/veli/demo/children')
    const data = await res.json()
    setChildren(Array.isArray(data.items) ? data.items : [])
  }, [])

  useEffect(() => {
    fetchChildren().finally(() => setLoading(false))
  }, [fetchChildren])

  useEffect(() => {
    children.forEach((c) => {
      fetch(`/api/veli/demo/attendance?athlete_id=${c.id}&days=30`)
        .then((r) => r.json())
        .then((d) => {
          setAttendanceMap((prev) => ({
            ...prev,
            [c.id]: {
              rate: d?.attendanceRate ?? 0,
              lastDate: d?.items?.[0]?.lesson_date ?? null,
            },
          }))
        })
    })
  }, [children])

  const ageFromBirth = (d: string | null | undefined) => {
    if (!d) return null
    const diff = new Date().getTime() - new Date(d).getTime()
    return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000))
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      <VeliIntro />
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2563eb] text-white">
              <Activity className="h-5 w-5" />
            </div>
            <span className="font-bold text-gray-900">YİSA-S Veli</span>
          </div>
        </div>
      </header>

      <main className="p-4">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-[#2563eb]" />
          </div>
        ) : children.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Users className="h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Çocuk Kaydı Yok</h2>
            <p className="text-sm text-gray-600 max-w-sm">
              Hesabınıza bağlı çocuk bulunamadı. Tesisinizle iletişime geçin — çocuğunuzu kaydettiklerinde e-posta adresinizi veli olarak tanımlamaları gerekir.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Çocuklarım</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {children.map((c) => {
                const att = attendanceMap[c.id]
                return (
                  <Link key={c.id} href={`/veli/cocuk/${c.id}`}>
                    <Card className="border-gray-200 bg-white hover:border-[#2563eb]/50 hover:shadow-md transition-all cursor-pointer min-h-[120px]">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#2563eb]/10 text-[#2563eb] font-semibold">
                            {(c.name?.[0] ?? '?') + (c.surname?.[0] ?? '')}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-gray-900 truncate">
                              {c.name} {c.surname ?? ''}
                            </p>
                            <p className="text-sm text-gray-600">
                              {ageFromBirth(c.birth_date) ?? '—'} yaş · {c.branch ?? '—'}
                            </p>
                            <div className="mt-2 flex items-center gap-3 text-xs">
                              <span className="text-gray-500">
                                Son yoklama: {att?.lastDate ? new Date(att.lastDate).toLocaleDateString('tr-TR') : '—'}
                              </span>
                              <span className={`font-medium ${att && att.rate >= 80 ? 'text-green-600' : att && att.rate > 0 ? 'text-amber-600' : 'text-gray-500'}`}>
                                Devam: %{att?.rate ?? 0}
                              </span>
                              <span className="font-medium text-[#2563eb]">
                                Kalan ders: {(c.ders_kredisi ?? 0)}
                              </span>
                            </div>
                          </div>
                          <Calendar className="h-5 w-5 shrink-0 text-gray-400" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white">
        <div className="flex items-center justify-around py-2 min-h-[56px]">
          <Link href="/veli/dashboard" className="flex flex-col items-center gap-1 px-4 py-2 text-[#2563eb]">
            <Activity className="h-5 w-5" />
            <span className="text-xs font-medium">Dashboard</span>
          </Link>
          <Link href="/veli/dashboard" className="flex flex-col items-center gap-1 px-4 py-2 text-gray-500 hover:text-gray-700">
            <Users className="h-5 w-5" />
            <span className="text-xs">Çocuklarım</span>
          </Link>
          <Link href="/veli/kredi" className="flex flex-col items-center gap-1 px-4 py-2 text-gray-500 hover:text-gray-700">
            <Coins className="h-5 w-5" />
            <span className="text-xs">Kredi</span>
          </Link>
          <Link href="/veli/gelisim" className="flex flex-col items-center gap-1 px-4 py-2 text-gray-500 hover:text-gray-700">
            <TrendingUp className="h-5 w-5" />
            <span className="text-xs">Gelişim</span>
          </Link>
          <Link href="/veli/duyurular" className="flex flex-col items-center gap-1 px-4 py-2 text-gray-500 hover:text-gray-700">
            <Calendar className="h-5 w-5" />
            <span className="text-xs">Duyurular</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
