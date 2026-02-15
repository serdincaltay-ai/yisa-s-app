'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Package, Wallet, Loader2 } from 'lucide-react'
import { OdemeTable, type OdemeRow } from './OdemeTable'
import { PaketSatModal } from './PaketSatModal'
import { OdemeAlModal } from './OdemeAlModal'

type Athlete = { id: string; name: string | null; surname: string | null }
type Package = { id: string; name: string; seans_count: number; price: number; max_taksit: number }

export default function OdemelerPage() {
  const [payments, setPayments] = useState<OdemeRow[]>([])
  const [athletes, setAthletes] = useState<Athlete[]>([])
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [showPaketSat, setShowPaketSat] = useState(false)
  const [odemeAlTarget, setOdemeAlTarget] = useState<OdemeRow | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [athletesRes, paymentsRes, packagesRes] = await Promise.all([
        fetch('/api/franchise/athletes?status=active'),
        fetch(`/api/payments${statusFilter ? `?status=${statusFilter}` : ''}`),
        fetch('/api/packages'),
      ])
      const athletesData = await athletesRes.json()
      const paymentsData = await paymentsRes.json()
      const packagesData = await packagesRes.json()

      setAthletes(Array.isArray(athletesData.items) ? athletesData.items : [])
      setPayments(Array.isArray(paymentsData.items) ? paymentsData.items : [])
      setPackages(Array.isArray(packagesData.items) ? packagesData.items : [])
    } catch {
      setPayments([])
      setAthletes([])
      setPackages([])
      setToast({ message: 'Veriler yüklenemedi', type: 'error' })
    } finally {
      setLoading(false)
    }
  }, [statusFilter])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)')
    setIsMobile(mq.matches)
    const h = () => setIsMobile(window.matchMedia('(max-width: 640px)').matches)
    mq.addEventListener('change', h)
    return () => mq.removeEventListener('change', h)
  }, [])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 4000)
    return () => clearTimeout(t)
  }, [toast])

  return (
    <div className="p-6 space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Ödemeler</h1>
          <p className="text-muted-foreground">Paket satışı ve ödeme takibi</p>
        </div>
        <Button
          onClick={() => setShowPaketSat(true)}
          className="min-h-[44px]"
          style={{ borderColor: '#00d4ff', color: '#00d4ff' }}
        >
          <Package className="h-4 w-4 mr-2" />
          Paket Sat
        </Button>
      </header>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <label className="text-sm font-medium">Filtre:</label>
        <select
          className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Tümü</option>
          <option value="odendi">Ödendi</option>
          <option value="bekliyor">Bekliyor</option>
          <option value="gecikmis">Gecikmiş</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <OdemeTable
          rows={payments}
          onOdemeAl={(row) => setOdemeAlTarget(row)}
          isMobile={isMobile}
        />
      )}

      <PaketSatModal
        open={showPaketSat}
        onClose={() => setShowPaketSat(false)}
        onSuccess={() => { fetchData(); setToast({ message: 'Paket satışı kaydedildi', type: 'success' }); }}
        athletes={athletes}
        packages={packages}
      />

      <OdemeAlModal
        open={!!odemeAlTarget}
        onClose={() => setOdemeAlTarget(null)}
        onSuccess={() => { fetchData(); setToast({ message: 'Ödeme kaydedildi', type: 'success' }); setOdemeAlTarget(null); }}
        payment={odemeAlTarget}
      />

      {toast && (
        <div
          className={`fixed bottom-4 right-4 z-50 px-4 py-2 rounded-lg shadow-lg ${
            toast.type === 'success' ? 'bg-green-600/90' : 'bg-destructive/90'
          } text-white`}
        >
          {toast.message}
        </div>
      )}
    </div>
  )
}
