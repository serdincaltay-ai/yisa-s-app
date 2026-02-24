'use client'

import React, { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, CreditCard, Loader2 } from 'lucide-react'

type PaymentItem = {
  id: string
  athlete_id: string
  athlete_name: string
  amount: number
  payment_type: string
  period_month?: number
  period_year?: number
  due_date?: string | null
  status: string
}

export default function VeliOdemePage() {
  const [payments, setPayments] = useState<PaymentItem[]>([])
  const [totalDebt, setTotalDebt] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchPayments = useCallback(async () => {
    try {
      const res = await fetch('/api/veli/demo/payments')
      const data = await res.json()
      setPayments(Array.isArray(data?.items) ? data.items : [])
      setTotalDebt(Number(data?.totalDebt) || 0)
    } catch {
      setPayments([])
      setTotalDebt(0)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPayments()
  }, [fetchPayments])

  const pending = payments.filter((p) => p.status === 'pending' || p.status === 'overdue')
  const hasIntegration = typeof process.env.NEXT_PUBLIC_IYZICO_KEY !== 'undefined' || typeof process.env.NEXT_PUBLIC_PARATIKA_MERCHANT_ID !== 'undefined'

  const handleOnlineOdeme = () => {
    if (hasIntegration) {
      // İyzico/Paratika entegre edildiğinde: seçili aidatlar için checkout URL alınıp yönlendirilecek
      alert('Ödeme sayfasına yönlendirileceksiniz. (Entegrasyon tamamlandığında bu alan kullanılacak.)')
    } else {
      alert('Online aidat ödemesi İyzico veya Paratika entegrasyonu sonrası aktif olacak. Ortam değişkenleri: NEXT_PUBLIC_IYZICO_KEY veya NEXT_PUBLIC_PARATIKA_MERCHANT_ID.')
    }
  }

  return (
    <div className="min-h-screen bg-white p-4 pb-24">
      <header className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/veli/dashboard"><ArrowLeft className="h-4 w-4" /> Geri</Link>
        </Button>
      </header>

      <h1 className="text-xl font-bold text-gray-900 mb-2">Online Aidat Ödeme</h1>
      <p className="text-sm text-gray-600 mb-6">İyzico / Paratika entegrasyonu ile güvenli ödeme. Bekleyen aidatlarınızı kartınızla online ödeyebilirsiniz.</p>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-[#2563eb]" /></div>
      ) : (
        <>
          <Card className="border-gray-200 mb-6">
            <CardHeader>
              <CreditCard className="h-8 w-8 text-[#2563eb]" />
              <CardTitle>Bekleyen aidatlar</CardTitle>
              <CardDescription>Ödeme yapılmamış aidatlar listelenir; İyzico veya Paratika ile online ödeyebilirsiniz.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {pending.length === 0 ? (
                <p className="text-sm text-gray-600">Bekleyen aidatınız yok.</p>
              ) : (
                <>
                  <p className="text-sm font-medium text-gray-900">Toplam borç: {totalDebt.toLocaleString('tr-TR')} TL</p>
                  <ul className="space-y-2">
                    {pending.map((p) => (
                      <li key={p.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                        <span className="text-sm">{p.athlete_name} — {p.period_month}/{p.period_year}</span>
                        <span className="font-medium">{p.amount.toLocaleString('tr-TR')} TL</span>
                      </li>
                    ))}
                  </ul>
                  <Button onClick={handleOnlineOdeme} className="w-full sm:w-auto">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Online öde (İyzico/Paratika)
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          <p className="text-xs text-gray-500">
            Entegrasyon: İyzico veya Paratika API anahtarları yapılandırıldığında &quot;Online öde&quot; ile ödeme sayfasına yönlendirileceksiniz.
          </p>
        </>
      )}
    </div>
  )
}
