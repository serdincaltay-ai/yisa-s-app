'use client'

import { useEffect, useState } from 'react'
import { Wallet, Calendar, TrendingDown, RefreshCw, AlertCircle } from 'lucide-react'

type ExpenseItem = {
  id: string
  title: string
  amount: number
  type: string
  due_date?: string
  paid_at?: string
  created_at: string
}

type PaymentScheduleItem = {
  id: string
  franchise_name: string
  amount: number
  due_date: string
  status: string
}

export default function KasaDefteriPage() {
  const [expenses, setExpenses] = useState<ExpenseItem[]>([])
  const [schedule, setSchedule] = useState<PaymentScheduleItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/expenses')
      const data = await res.json()
      setExpenses(Array.isArray(data?.expenses) ? data.expenses : [])
      setSchedule(Array.isArray(data?.schedule) ? data.schedule : [])
    } catch {
      setError('Veri yüklenemedi.')
      setExpenses([])
      setSchedule([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0)
  const totalScheduled = schedule.reduce((s, p) => s + p.amount, 0)

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Kasa Defteri</h1>
          <p className="text-slate-400">Günlük / aylık masraflar, sabit ödemeler, kira, fatura, ödeme takvimi.</p>
        </div>
        <button
          type="button"
          onClick={fetchData}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm transition-colors disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Yenile
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-500">
          Yükleniyor…
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <TrendingDown className="text-rose-400" size={24} />
                <h2 className="text-lg font-semibold text-white">Toplam Gider</h2>
              </div>
              <p className="text-2xl font-bold text-rose-400">₺{totalExpenses.toLocaleString('tr-TR')}</p>
              <p className="text-slate-500 text-sm mt-1">{expenses.length} kayıt</p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="text-amber-400" size={24} />
                <h2 className="text-lg font-semibold text-white">Ödeme Takvimi (Toplam)</h2>
              </div>
              <p className="text-2xl font-bold text-amber-400">₺{totalScheduled.toLocaleString('tr-TR')}</p>
              <p className="text-slate-500 text-sm mt-1">{schedule.length} tahsilat</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Wallet size={20} /> Giderler
              </h2>
              {expenses.length === 0 ? (
                <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 text-center">
                  <AlertCircle className="mx-auto mb-2 text-slate-500" size={32} />
                  <p className="text-slate-500 text-sm">
                    <code>expenses</code> veya <code>kasa_defteri</code> tablosu oluşturulduğunda burada listelenecek.
                  </p>
                </div>
              ) : (
                <div className="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                    <table className="w-full text-left">
                      <thead className="sticky top-0 bg-slate-800">
                        <tr className="border-b border-slate-700">
                          <th className="px-4 py-3 text-slate-400 font-medium text-sm">Başlık</th>
                          <th className="px-4 py-3 text-slate-400 font-medium text-sm">Tür</th>
                          <th className="px-4 py-3 text-slate-400 font-medium text-sm">Tutar</th>
                          <th className="px-4 py-3 text-slate-400 font-medium text-sm">Tarih</th>
                        </tr>
                      </thead>
                      <tbody>
                        {expenses.map((e) => (
                          <tr key={e.id} className="border-b border-slate-700/50">
                            <td className="px-4 py-3 text-white text-sm">{e.title}</td>
                            <td className="px-4 py-3 text-slate-400 text-sm">{e.type}</td>
                            <td className="px-4 py-3 text-rose-400 font-medium">₺{e.amount.toLocaleString('tr-TR')}</td>
                            <td className="px-4 py-3 text-slate-500 text-sm">
                              {e.due_date ? new Date(e.due_date).toLocaleDateString('tr-TR') : e.created_at ? new Date(e.created_at).toLocaleDateString('tr-TR') : '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Calendar size={20} /> Ödeme Takvimi (Franchise)
              </h2>
              {schedule.length === 0 ? (
                <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 text-center">
                  <AlertCircle className="mx-auto mb-2 text-slate-500" size={32} />
                  <p className="text-slate-500 text-sm">
                    <code>payment_schedule</code> veya <code>franchise_payments</code> tablosu oluşturulduğunda burada listelenecek.
                  </p>
                </div>
              ) : (
                <div className="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                    <table className="w-full text-left">
                      <thead className="sticky top-0 bg-slate-800">
                        <tr className="border-b border-slate-700">
                          <th className="px-4 py-3 text-slate-400 font-medium text-sm">Franchise</th>
                          <th className="px-4 py-3 text-slate-400 font-medium text-sm">Tutar</th>
                          <th className="px-4 py-3 text-slate-400 font-medium text-sm">Vade</th>
                          <th className="px-4 py-3 text-slate-400 font-medium text-sm">Durum</th>
                        </tr>
                      </thead>
                      <tbody>
                        {schedule.map((p) => (
                          <tr key={p.id} className="border-b border-slate-700/50">
                            <td className="px-4 py-3 text-white text-sm">{p.franchise_name}</td>
                            <td className="px-4 py-3 text-amber-400 font-medium">₺{p.amount.toLocaleString('tr-TR')}</td>
                            <td className="px-4 py-3 text-slate-400 text-sm">
                              {new Date(p.due_date).toLocaleDateString('tr-TR')}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`text-xs px-2 py-1 rounded-lg ${
                                  p.status === 'paid' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                                }`}
                              >
                                {p.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
