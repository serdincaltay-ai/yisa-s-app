'use client'

import React, { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { PanelHeader } from '@/components/PanelHeader'
import { VeliBottomNav } from '@/components/PanelBottomNav'
import { CreditCard, Loader2, ArrowLeft, CheckCircle, XCircle } from 'lucide-react'

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
      const res = await fetch('/api/veli/payments')
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
  const paid = payments.filter((p) => p.status === 'paid')

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
    <div className="min-h-screen bg-zinc-950 pb-20">
      <PanelHeader panelName="VELİ PANELİ" />

      <main className="p-4 space-y-4">
        <div className="flex items-center gap-2">
          <Link href="/veli/dashboard" className="text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5" strokeWidth={1.5} />
          </Link>
          <h1 className="text-xl font-bold text-white">Aidat & Ödemeler</h1>
        </div>

        {/* Başarı/İptal mesajları */}
        {success && (
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <CheckCircle className="h-5 w-5" strokeWidth={1.5} />
            <span className="text-sm font-medium">Ödemeniz başarıyla tamamlandı! Teşekkür ederiz.</span>
          </div>
        )}
        {cancelled && (
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <XCircle className="h-5 w-5" strokeWidth={1.5} />
            <span className="text-sm font-medium">Ödeme iptal edildi. Dilediğiniz zaman tekrar deneyebilirsiniz.</span>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
          </div>
        ) : (
          <>
            {/* Özet Kartları */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-zinc-900 border border-orange-500/30 rounded-2xl p-4">
                <p className="text-xs text-zinc-400">Bekleyen</p>
                <p className="text-2xl font-bold text-orange-400 mt-1">
                  {totalDebt > 0 ? `${totalDebt.toLocaleString('tr-TR')} ₺` : '0 ₺'}
                </p>
                <p className="text-xs text-zinc-500 mt-1">{pending.length} aidat</p>
              </div>
              <div className="bg-zinc-900 border border-emerald-500/30 rounded-2xl p-4">
                <p className="text-xs text-zinc-400">Ödenen</p>
                <p className="text-2xl font-bold text-emerald-400 mt-1">
                  {paid.reduce((s, p) => s + p.amount, 0).toLocaleString('tr-TR')} ₺
                </p>
                <p className="text-xs text-zinc-500 mt-1">{paid.length} aidat</p>
              </div>
            </div>

            {/* Bekleyen Aidatlar */}
            {pending.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-sm font-semibold text-white">Bekleyen Aidatlar</h2>
                {pending.map((p) => (
                  <div key={p.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 hover:border-cyan-400/30 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-white">{p.athlete_name}</p>
                        <p className="text-sm text-zinc-400">{p.payment_type} — {p.period_month}/{p.period_year}</p>
                        {p.due_date && (
                          <p className="text-xs text-zinc-500 mt-1">Son ödeme: {new Date(p.due_date).toLocaleDateString('tr-TR')}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-white">{p.amount.toLocaleString('tr-TR')} ₺</p>
                        <button
                          onClick={() => handleStripeCheckout(p.id)}
                          disabled={checkoutLoading !== null}
                          className="mt-2 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-400 px-4 py-1.5 text-xs font-medium text-zinc-950 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all disabled:opacity-50"
                        >
                          {checkoutLoading === p.id ? (
                            <Loader2 className="h-4 w-4 animate-spin inline mr-1" />
                          ) : (
                            <CreditCard className="h-4 w-4 inline mr-1" />
                          )}
                          Öde
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Ödeme Geçmişi */}
            {paid.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-sm font-semibold text-white">Ödeme Geçmişi</h2>
                {paid.map((p) => (
                  <div key={p.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-white">{p.athlete_name}</p>
                        <p className="text-sm text-zinc-400">{p.payment_type} — {p.period_month}/{p.period_year}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-zinc-300">{p.amount.toLocaleString('tr-TR')} ₺</p>
                        <CheckCircle className="h-5 w-5 text-emerald-400" strokeWidth={1.5} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {payments.length === 0 && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
                <CreditCard className="h-12 w-12 text-zinc-600 mx-auto mb-3" strokeWidth={1.5} />
                <p className="text-sm text-zinc-400">Henüz ödeme kaydı yok.</p>
              </div>
            )}

            {/* Toplam Bekleyen Özet */}
            {totalDebt > 0 && (
              <div className="bg-zinc-900 border border-orange-500/20 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-zinc-400">Toplam Bekleyen</p>
                  <p className="text-lg font-bold text-orange-400">{totalDebt.toLocaleString('tr-TR')} ₺</p>
                </div>
              </div>
            )}

            <p className="text-xs text-zinc-500">
              Güvenli ödeme: Stripe altyapısı ile kredi/banka kartı ödemesi yapılır.
              Kart bilgileriniz sunucularımızda saklanmaz.
            </p>
          </>
        )}
      </main>

      <VeliBottomNav />
    </div>
  )
}
