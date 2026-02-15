'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Wallet } from 'lucide-react'

export type OdemeRow = {
  id: string
  student_id: string
  ad_soyad?: string | null
  amount: number
  due_date: string
  taksit_no?: number
  toplam_taksit?: number
  status: string
  effective_status?: string
  kalan_seans?: number
  paket_adi?: string | null
}

function formatDate(s: string): string {
  try {
    return new Date(s).toISOString().slice(0, 10).split('-').reverse().join('.')
  } catch {
    return s
  }
}

function formatTL(n: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n)
}

function StatusBadge({ status }: { status: string }) {
  const s = status === 'gecikmis' ? 'gecikmis' : status === 'odendi' ? 'odendi' : 'bekliyor'
  const styles: Record<string, string> = {
    odendi: 'bg-[#00d4ff]/20 text-[#00d4ff] border-[#00d4ff]/50',
    bekliyor: 'bg-[#ffa500]/20 text-[#ffa500] border-[#ffa500]/50',
    gecikmis: 'bg-[#e94560]/20 text-[#e94560] border-[#e94560]/50',
  }
  const labels: Record<string, string> = {
    odendi: 'Ödendi',
    bekliyor: 'Bekliyor',
    gecikmis: 'Gecikmiş',
  }
  return (
    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium border ${styles[s] ?? styles.bekliyor}`}>
      {labels[s] ?? status}
    </span>
  )
}

type OdemeTableProps = {
  rows: OdemeRow[]
  onOdemeAl: (row: OdemeRow) => void
  isMobile?: boolean
}

export function OdemeTable({ rows, onOdemeAl, isMobile }: OdemeTableProps) {
  if (rows.length === 0) {
    return (
      <p className="text-muted-foreground text-center py-8">
        Ödeme kaydı bulunamadı.
      </p>
    )
  }

  if (isMobile) {
    return (
      <div className="grid gap-4 sm:hidden">
        {rows.map((r) => (
          <Card key={r.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-foreground">{r.ad_soyad ?? '—'}</p>
                  <p className="text-sm text-muted-foreground">{formatTL(r.amount)} · Vade: {formatDate(r.due_date)}</p>
                  {r.paket_adi && (
                    <p className="text-xs text-muted-foreground mt-1">{r.paket_adi}</p>
                  )}
                  {r.kalan_seans != null && (
                    <p className="text-xs text-muted-foreground">Kalan: {r.kalan_seans} seans</p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <StatusBadge status={r.effective_status ?? r.status} />
                  {(r.effective_status ?? r.status) !== 'odendi' && (
                    <Button size="sm" className="min-h-[44px]" onClick={() => onOdemeAl(r)}>
                      <Wallet className="h-4 w-4" />
                      Ödeme Al
                    </Button>
                  )}
                </div>
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
            <th className="h-12 px-4 text-left font-medium">Öğrenci</th>
            <th className="h-12 px-4 text-left font-medium">Paket</th>
            <th className="h-12 px-4 text-left font-medium">Tutar</th>
            <th className="h-12 px-4 text-left font-medium">Vade</th>
            <th className="h-12 px-4 text-left font-medium">Kalan Seans</th>
            <th className="h-12 px-4 text-left font-medium">Durum</th>
            <th className="h-12 px-4 text-right font-medium">İşlem</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-b last:border-0 hover:bg-muted/30">
              <td className="p-4 font-medium">{r.ad_soyad ?? '—'}</td>
              <td className="p-4 text-muted-foreground">{r.paket_adi ?? '—'}</td>
              <td className="p-4">{formatTL(r.amount)}</td>
              <td className="p-4 text-muted-foreground">{formatDate(r.due_date)}</td>
              <td className="p-4">{r.kalan_seans ?? '—'}</td>
              <td className="p-4">
                <StatusBadge status={r.effective_status ?? r.status} />
              </td>
              <td className="p-4 text-right">
                {(r.effective_status ?? r.status) !== 'odendi' && (
                  <Button size="sm" onClick={() => onOdemeAl(r)}>
                    <Wallet className="h-4 w-4 mr-1" />
                    Ödeme Al
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
