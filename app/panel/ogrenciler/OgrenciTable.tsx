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

export type AthleteRow = {
  id: string
  name: string | null
  surname: string | null
  birth_date: string | null
  gender: string | null
  branch: string | null
  level: string | null
  group: string | null
  status: string | null
  parent_name: string | null
  parent_phone: string | null
  parent_email: string | null
  notes: string | null
  created_at: string | null
}

function yasHesapla(dogumTarihi: string | null): number | null {
  if (!dogumTarihi) return null
  const diff = Date.now() - new Date(dogumTarihi).getTime()
  return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000))
}

function adSoyad(a: AthleteRow): string {
  return [a.name, a.surname].filter(Boolean).join(' ').trim() || '—'
}

function durumBadge(status: string | null) {
  const s = status ?? 'active'
  if (s === 'active') return <Badge variant="default">Aktif</Badge>
  if (s === 'inactive') return <Badge variant="secondary">Pasif</Badge>
  if (s === 'trial') return <Badge variant="outline">Deneme</Badge>
  return <Badge variant="secondary">{s}</Badge>
}

type OgrenciTableProps = {
  students: AthleteRow[]
  onEdit: (s: AthleteRow) => void
  onDelete: (s: AthleteRow) => void
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
                    {adSoyad(s)}
                  </Link>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {yasHesapla(s.birth_date) ?? '?'} yaş · {s.branch ?? '—'}
                  </p>
                  <p className="text-sm text-muted-foreground">{s.parent_phone ?? '—'}</p>
                  <div className="mt-2">{durumBadge(s.status)}</div>
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
    <div className="rounded-lg border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Ad Soyad</TableHead>
            <TableHead>Yaş</TableHead>
            <TableHead>Branş</TableHead>
            <TableHead>Seviye</TableHead>
            <TableHead>Grup</TableHead>
            <TableHead>Durum</TableHead>
            <TableHead>Veli Telefon</TableHead>
            <TableHead className="w-24">İşlem</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((s) => (
            <TableRow key={s.id} className="hover:bg-muted/30">
              <TableCell className="font-medium">
                <Link href={`/panel/ogrenciler/${s.id}`} className="hover:underline">
                  {adSoyad(s)}
                </Link>
              </TableCell>
              <TableCell>{yasHesapla(s.birth_date) ?? '—'}</TableCell>
              <TableCell>{s.branch ?? '—'}</TableCell>
              <TableCell>{s.level ?? '—'}</TableCell>
              <TableCell>{s.group ?? '—'}</TableCell>
              <TableCell>{durumBadge(s.status)}</TableCell>
              <TableCell>{s.parent_phone ?? '—'}</TableCell>
              <TableCell>
                <div className="flex gap-1">
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
