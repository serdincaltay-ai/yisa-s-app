'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, Loader2, User, Phone, Mail, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type StudentDetail = {
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
  updated_at: string | null
}

function formatDate(s: string | null): string {
  if (!s) return '—'
  try {
    return new Date(s).toLocaleDateString('tr-TR')
  } catch {
    return s
  }
}

function yasHesapla(dogumTarihi: string | null): number | null {
  if (!dogumTarihi) return null
  const diff = Date.now() - new Date(dogumTarihi).getTime()
  return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000))
}

export default function OgrenciDetayPage() {
  const params = useParams()
  const id = params?.id as string | undefined
  const [student, setStudent] = useState<StudentDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    setLoading(true)
    setError(null)
    fetch(`/api/students/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return
        if (data.error) {
          setError(data.error)
          setStudent(null)
        } else {
          setStudent(data)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError('Yüklenemedi')
          setStudent(null)
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error || !student) {
    return (
      <div className="p-6 space-y-4">
        <Button variant="outline" asChild>
          <Link href="/panel/ogrenciler">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Listeye Dön
          </Link>
        </Button>
        <p className="text-destructive">{error ?? 'Öğrenci bulunamadı'}</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/panel/ogrenciler">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Listeye Dön
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{student.ad_soyad ?? '—'}</CardTitle>
              <CardDescription>
                TC: {student.tc_kimlik ?? '—'} · {yasHesapla(student.dogum_tarihi) ?? '?'} yaş
              </CardDescription>
            </div>
            <Badge variant={student.status === 'aktif' ? 'default' : 'secondary'}>
              {student.status ?? 'aktif'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Kişisel Bilgiler</h3>
            <ul className="space-y-1 text-sm">
              <li className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                Doğum Tarihi: {formatDate(student.dogum_tarihi)}
              </li>
              <li className="flex items-center gap-2">
                Cinsiyet: {student.cinsiyet === 'E' ? 'Erkek' : student.cinsiyet === 'K' ? 'Kız' : student.cinsiyet ?? '—'}
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Branş ve Grup</h3>
            <p>{student.brans ?? '—'}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Veli Bilgileri</h3>
            <ul className="space-y-1 text-sm">
              <li className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                {student.veli_adi ?? '—'}
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                {student.veli_telefon ?? '—'}
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                {student.veli_email ?? '—'}
              </li>
            </ul>
          </div>

          {student.saglik_notu && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Sağlık Notu</h3>
              <p className="text-sm">{student.saglik_notu}</p>
            </div>
          )}

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            Kayıt: {formatDate(student.created_at)} · Güncelleme: {formatDate(student.updated_at)}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Yoklama Geçmişi</CardTitle>
          <CardDescription>İleride doldurulacak</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Yoklama kayıtları burada listelenecek.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Aidat Durumu</CardTitle>
          <CardDescription>İleride doldurulacak</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Aidat bilgisi burada gösterilecek.</p>
        </CardContent>
      </Card>
    </div>
  )
}
