'use client'

import React, { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Loader2, Calendar, Activity, Users, Megaphone } from 'lucide-react'

type ChildDetail = {
  id: string
  name: string
  surname?: string | null
  birth_date?: string | null
  branch?: string | null
  level?: string | null
}

type AttendanceItem = { lesson_date: string; status: string }
type PaymentItem = { period_month?: number; period_year?: number; amount: number; status: string; due_date?: string; paid_date?: string }
type ScheduleItem = { gun: string; saat: string; ders_adi: string; brans?: string | null }

const AYLAR: Record<number, string> = {
  1: 'Ocak', 2: 'Şubat', 3: 'Mart', 4: 'Nisan', 5: 'Mayıs', 6: 'Haziran',
  7: 'Temmuz', 8: 'Ağustos', 9: 'Eylül', 10: 'Ekim', 11: 'Kasım', 12: 'Aralık',
}

export default function VeliCocukPage() {
  const params = useParams()
  const id = params?.id as string | undefined
  const [child, setChild] = useState<ChildDetail | null>(null)
  const [attendance, setAttendance] = useState<AttendanceItem[]>([])
  const [payments, setPayments] = useState<PaymentItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    if (!id) return
    const [childrenRes, attRes, payRes] = await Promise.all([
      fetch('/api/veli/demo/children'),
      fetch(`/api/veli/demo/attendance?athlete_id=${id}&days=30`),
      fetch(`/api/veli/demo/payments?athlete_id=${id}`),
    ])
    const childrenData = await childrenRes.json()
    const attData = await attRes.json()
    const payData = await payRes.json()
    const ch = (childrenData.items ?? []).find((c: { id: string }) => c.id === id)
    setChild(ch ?? null)
    setAttendance(Array.isArray(attData.items) ? attData.items : [])
    setPayments(Array.isArray(payData.items) ? payData.items : [])
  }, [id])

  useEffect(() => {
    fetchData().finally(() => setLoading(false))
  }, [fetchData])

  const ageFromBirth = (d: string | null | undefined) => {
    if (!d) return null
    return Math.floor((Date.now() - new Date(d).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
  }

  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (29 - i))
    return d.toISOString().slice(0, 10)
  })

  const attByDate = new Map(attendance.map((a) => [a.lesson_date, a.status]))

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-[#2563eb]" />
      </div>
    )
  }

  if (!child) {
    return (
      <div className="min-h-screen bg-white p-4">
        <Button variant="ghost" asChild>
          <Link href="/veli/dashboard"><ArrowLeft className="h-4 w-4 mr-2" />Geri</Link>
        </Button>
        <p className="text-gray-600 mt-4">Çocuk bulunamadı.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white pb-24">
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
        <div className="flex h-14 items-center gap-2 px-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/veli/dashboard"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div>
            <h1 className="font-bold text-gray-900">{child.name} {child.surname ?? ''}</h1>
            <p className="text-xs text-gray-600">{ageFromBirth(child.birth_date) ?? '—'} yaş · {child.branch ?? '—'} · {child.level ?? '—'}</p>
          </div>
        </div>
      </header>

      <main className="p-4 space-y-6">
        <Card className="border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Yoklama Takvimi (Son 30 Gün)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-1">
              {last30Days.map((d) => {
                const status = attByDate.get(d)
                const bg = status === 'present' ? 'bg-green-500' : status === 'absent' ? 'bg-red-500' : status === 'excused' || status === 'late' ? 'bg-amber-500' : 'bg-gray-200'
                return (
                  <div
                    key={d}
                    className={`aspect-square rounded flex items-center justify-center text-[10px] ${status ? `${bg} text-white` : 'bg-gray-100 text-gray-500'}`}
                    title={`${new Date(d).toLocaleDateString('tr-TR')}: ${status === 'present' ? 'Geldi' : status === 'absent' ? 'Gelmedi' : status || '—'}`}
                  >
                    {new Date(d).getDate()}
                  </div>
                )
              })}
            </div>
            <div className="mt-2 flex gap-4 text-xs text-gray-600">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-500" /> Geldi</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-500" /> Gelmedi</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-500" /> İzinli/Gecikti</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Aidat Durumu (Son 3 Ay)</CardTitle>
          </CardHeader>
          <CardContent>
            {payments.length === 0 ? (
              <p className="text-sm text-gray-600">Ödeme kaydı yok.</p>
            ) : (
              <div className="space-y-2">
                {payments.slice(0, 6).map((p, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                    <div>
                      <p className="font-medium text-gray-900">
                        {AYLAR[p.period_month ?? 0]} {p.period_year} · {p.amount.toLocaleString('tr-TR')} TL
                      </p>
                      <p className="text-xs text-gray-500">Vade: {p.due_date ? new Date(p.due_date).toLocaleDateString('tr-TR') : '—'}</p>
                    </div>
                    <Badge
                      className={p.status === 'paid' ? 'bg-green-100 text-green-800' : p.status === 'overdue' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}
                    >
                      {p.status === 'paid' ? 'Ödendi' : p.status === 'overdue' ? 'Gecikmiş' : 'Bekleyen'}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4" /> Ders Programı
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Haftalık program tesisiniz tarafından yönetilmektedir. Detay için tesisinizle iletişime geçin.</p>
          </CardContent>
        </Card>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white">
        <div className="flex items-center justify-around py-2 min-h-[56px]">
          <Link href="/veli/dashboard" className="flex flex-col items-center gap-1 px-4 py-2 text-gray-500">
            <Activity className="h-5 w-5" />
            <span className="text-xs">Dashboard</span>
          </Link>
          <Link href="/veli/dashboard" className="flex flex-col items-center gap-1 px-4 py-2 text-[#2563eb]">
            <Users className="h-5 w-5" />
            <span className="text-xs font-medium">Çocuklarım</span>
          </Link>
          <Link href="/veli/duyurular" className="flex flex-col items-center gap-1 px-4 py-2 text-gray-500">
            <Megaphone className="h-5 w-5" />
            <span className="text-xs">Duyurular</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
