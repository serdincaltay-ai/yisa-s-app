'use client'

import React from 'react'
import Link from 'next/link'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Eye, Pencil, Trash2 } from 'lucide-react'

export type StudentRow = {
  id: string
  ad_soyad: string | null
  tc_kimlik: string | null
  dogum_tarihi: string | null
  cinsiyet: string | null
  veli_adi: string | null
  veli_telefon: string | null
  veli_email: string | null
  brans: string | null
  grup_id: string | null
  saglik_notu: string | null
  status: string | null
  created_at: string | null
}

function yasHesapla(dogumTarihi: string | null): number | null {
  if (!dogumTarihi) return null
  const diff = Date.now() - new Date(dogumTarihi).getTime()
  return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000))
}

type OgrenciTableProps = {
  students: StudentRow[]
  onEdit: (s: StudentRow) => void
  onDelete: (s: StudentRow) => void
  isMobile?: boolean
}

export function OgrenciTable({ students, onEdit, onDelete, isMobile }: OgrenciTableProps) {
  if (isMobile) {
    return (
      <div className="grid gap-4 sm:hidden">
        {students.map((s) => (
          <Card key={s.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <Link
                    href={`/panel/ogrenciler/${s.id}`}
                    className="font-semibold text-foreground hover:underline"
                  >
                    {s.ad_soyad ?? '—'}
                  </Link>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    TC: {s.tc_kimlik ?? '—'} · {yasHesapla(s.dogum_tarihi) ?? '?'} yaş
                  </p>
                  <p className="text-sm text-muted-foreground">{s.brans ?? '—'}</p>
                  <Badge variant={s.status === 'aktif' ? 'default' : 'secondary'} className="mt-2">
                    {s.status ?? 'aktif'}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" asChild>
                    <Link href={`/panel/ogrenciler/${s.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => onEdit(s)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => onDelete(s)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="hidden sm:block rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ad Soyad</TableHead>
            <TableHead>TC</TableHead>
            <TableHead>Yaş</TableHead>
            <TableHead>Branş</TableHead>
            <TableHead>Veli Tel</TableHead>
            <TableHead>Durum</TableHead>
            <TableHead className="text-right">İşlem</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((s) => (
            <TableRow key={s.id}>
              <TableCell>
                <Link
                  href={`/panel/ogrenciler/${s.id}`}
                  className="font-medium hover:underline"
                >
                  {s.ad_soyad ?? '—'}
                </Link>
              </TableCell>
              <TableCell className="text-muted-foreground">{s.tc_kimlik ?? '—'}</TableCell>
              <TableCell>{yasHesapla(s.dogum_tarihi) ?? '—'}</TableCell>
              <TableCell>{s.brans ?? '—'}</TableCell>
              <TableCell className="text-muted-foreground">{s.veli_telefon ?? '—'}</TableCell>
              <TableCell>
                <Badge variant={s.status === 'aktif' ? 'default' : 'secondary'}>
                  {s.status ?? 'aktif'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/panel/ogrenciler/${s.id}`}>
                      <Eye className="h-4 w-4 mr-1" />
                      Detay
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onEdit(s)}>
                    <Pencil className="h-4 w-4 mr-1" />
                    Düzenle
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onDelete(s)}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Sil
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
