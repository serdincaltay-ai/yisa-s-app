'use client'

import React, { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, CreditCard, Loader2, CheckCircle, XCircle } from 'lucide-react'

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
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null)
  const searchParams = useSearchParams()

  const success = searchParams.get('success') === 'true'
  const cancelled = searchParams.get('cancelled') === 'true'

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

  const handleStripeCheckout = async (paymentId: string) => {
    setCheckoutLoading(paymentId)
    try {
      const res = await fetch('/api/payments/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_id: paymentId }),
      })
      const data = await res.json() as { ok?: boolean; url?: string; error?: string }

      if (data.ok && data.url) {
        window.location.href = data.url
      } else {
        alert(data.error ?? 'Ödeme sayfası oluşturulamadı.')
      }
    } catch {
      alert('Bağlantı hatası. Lütfen tekrar deneyin.')
    } finally {
      setCheckoutLoading(null)
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
      <p className="text-sm text-gray-600 mb-6">
        Stripe ile güvenli online ödeme. Bekleyen aidatlarınızı kartınızla ödeyebilirsiniz.
      </p>

      {/* Başarı/İptal mesajları */}
      {success && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 text-green-700 border border-green-200 mb-4">
          <CheckCircle className="h-5 w-5" />
          <span className="text-sm font-medium">Ödemeniz başarıyla tamamlandı! Teşekkür ederiz.</span>
        </div>
      )}
      {cancelled && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 mb-4">
          <XCircle className="h-5 w-5" />
          <span className="text-sm font-medium">Ödeme iptal edildi. Dilediğiniz zaman tekrar deneyebilirsiniz.</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-[#2563eb]" /></div>
      ) : (
        <>
          <Card className="border-gray-200 mb-6">
            <CardHeader>
              <CreditCard className="h-8 w-8 text-[#2563eb]" />
              <CardTitle>Bekleyen Aidatlar</CardTitle>
              <CardDescription>
                Ödeme yapılmamış aidatlar listelenir. Her aidat için ayrı ayrı Stripe ile ödeme yapabilirsiniz.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {pending.length === 0 ? (
                <p className="text-sm text-gray-600">Bekleyen aidatınız yok.</p>
              ) : (
                <>
                  <p className="text-sm font-medium text-gray-900">
                    Toplam borç: {totalDebt.toLocaleString('tr-TR')} TL
                  </p>
                  <ul className="space-y-3">
                    {pending.map((p) => (
                      <li key={p.id} className="flex items-center justify-between py-3 px-3 border border-gray-100 rounded-lg">
                        <div>
                          <span className="text-sm font-medium text-gray-900">
                            {p.athlete_name}
                          </span>
                          <span className="text-sm text-gray-500 ml-2">
                            {p.period_month}/{p.period_year}
                          </span>
                          <p className="text-sm font-bold text-gray-900 mt-1">
                            {p.amount.toLocaleString('tr-TR')} TL
                          </p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleStripeCheckout(p.id)}
                          disabled={checkoutLoading !== null}
                        >
                          {checkoutLoading === p.id ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-1" />
                          ) : (
                            <CreditCard className="h-4 w-4 mr-1" />
                          )}
                          Öde
                        </Button>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </CardContent>
          </Card>

          <p className="text-xs text-gray-500">
            Güvenli ödeme: Stripe altyapısı ile kredi/banka kartı ödemesi yapılır.
            Kart bilgileriniz sunucularımızda saklanmaz.
          </p>
        </>
      )}
    </div>
  )
}
