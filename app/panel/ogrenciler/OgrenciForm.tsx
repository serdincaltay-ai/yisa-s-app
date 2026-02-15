'use client'

import React, { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

export type OgrenciFormData = {
  ad: string
  soyad: string
  dogum_tarihi: string
  cinsiyet: string
  brans: string
  seviye: string
  grup: string
  veli_ad: string
  veli_telefon: string
  veli_email: string
  saglik_notu: string
}

const BRANSLAR = [
  'Artistik Cimnastik',
  'Ritmik Cimnastik',
  'Trampolin',
  'Genel Jimnastik',
  'Temel Hareket Eğitimi',
  'Diğer',
]

const emptyForm: OgrenciFormData = {
  ad: '',
  soyad: '',
  dogum_tarihi: '',
  cinsiyet: '',
  brans: '',
  seviye: '',
  grup: '',
  veli_ad: '',
  veli_telefon: '',
  veli_email: '',
  saglik_notu: '',
}

type OgrenciFormProps = {
  initial?: Partial<OgrenciFormData> | null
  onSubmit: (data: OgrenciFormData) => Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
}

export function OgrenciForm({ initial, onSubmit, onCancel, isSubmitting }: OgrenciFormProps) {
  const [form, setForm] = React.useState<OgrenciFormData>(emptyForm)

  useEffect(() => {
    if (initial) {
      setForm({
        ad: initial.ad ?? '',
        soyad: initial.soyad ?? '',
        dogum_tarihi: initial.dogum_tarihi ?? '',
        cinsiyet: initial.cinsiyet ?? '',
        brans: initial.brans ?? '',
        seviye: initial.seviye ?? '',
        grup: initial.grup ?? '',
        veli_ad: initial.veli_ad ?? '',
        veli_telefon: initial.veli_telefon ?? '',
        veli_email: initial.veli_email ?? '',
        saglik_notu: initial.saglik_notu ?? '',
      })
    } else {
      setForm(emptyForm)
    }
  }, [initial])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(form)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initial ? 'Öğrenci Düzenle' : 'Yeni Öğrenci'}</CardTitle>
        <CardDescription>
          {initial ? 'Bilgileri güncelleyin' : 'Ad ve soyad zorunludur'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="ad">Ad *</Label>
              <Input
                id="ad"
                value={form.ad}
                onChange={(e) => setForm((f) => ({ ...f, ad: e.target.value }))}
                placeholder="Ad"
                required
              />
            </div>
            <div>
              <Label htmlFor="soyad">Soyad</Label>
              <Input
                id="soyad"
                value={form.soyad}
                onChange={(e) => setForm((f) => ({ ...f, soyad: e.target.value }))}
                placeholder="Soyad"
              />
            </div>
            <div>
              <Label htmlFor="dogum_tarihi">Doğum Tarihi</Label>
              <Input
                id="dogum_tarihi"
                type="date"
                value={form.dogum_tarihi}
                onChange={(e) => setForm((f) => ({ ...f, dogum_tarihi: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="cinsiyet">Cinsiyet</Label>
              <select
                id="cinsiyet"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={form.cinsiyet}
                onChange={(e) => setForm((f) => ({ ...f, cinsiyet: e.target.value }))}
              >
                <option value="">Seçiniz</option>
                <option value="E">Erkek</option>
                <option value="K">Kız</option>
                <option value="diger">Diğer</option>
              </select>
            </div>
            <div>
              <Label htmlFor="brans">Branş</Label>
              <select
                id="brans"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={form.brans}
                onChange={(e) => setForm((f) => ({ ...f, brans: e.target.value }))}
              >
                <option value="">Seçiniz</option>
                {BRANSLAR.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="seviye">Seviye</Label>
              <Input
                id="seviye"
                value={form.seviye}
                onChange={(e) => setForm((f) => ({ ...f, seviye: e.target.value }))}
                placeholder="Örn: Başlangıç"
              />
            </div>
            <div>
              <Label htmlFor="grup">Grup</Label>
              <Input
                id="grup"
                value={form.grup}
                onChange={(e) => setForm((f) => ({ ...f, grup: e.target.value }))}
                placeholder="Grup adı"
              />
            </div>
            <div>
              <Label htmlFor="veli_ad">Veli Adı</Label>
              <Input
                id="veli_ad"
                value={form.veli_ad}
                onChange={(e) => setForm((f) => ({ ...f, veli_ad: e.target.value }))}
                placeholder="Veli adı soyadı"
              />
            </div>
            <div>
              <Label htmlFor="veli_telefon">Veli Telefon</Label>
              <Input
                id="veli_telefon"
                type="tel"
                value={form.veli_telefon}
                onChange={(e) => setForm((f) => ({ ...f, veli_telefon: e.target.value }))}
                placeholder="05XX XXX XX XX"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="veli_email">Veli E-posta</Label>
              <Input
                id="veli_email"
                type="email"
                value={form.veli_email}
                onChange={(e) => setForm((f) => ({ ...f, veli_email: e.target.value }))}
                placeholder="ornek@email.com"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="saglik_notu">Sağlık Notu (opsiyonel)</Label>
            <Textarea
              id="saglik_notu"
              value={form.saglik_notu}
              onChange={(e) => setForm((f) => ({ ...f, saglik_notu: e.target.value }))}
              placeholder="Alerji, kronik rahatsızlık vb."
              rows={2}
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {initial ? 'Güncelle' : 'Kaydet'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              İptal
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
