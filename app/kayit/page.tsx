'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Loader2,
  UserPlus,
  Save,
  CheckCircle,
  User,
  Baby,
  Phone,
  Mail,
  Calendar,
  Trophy,
  Banknote,
} from 'lucide-react'

/* ---------- Tip tanimlari ---------- */
interface OgrenciForm {
  ad: string
  soyad: string
  dogum_tarihi: string
  cinsiyet: string
  brans: string
}

interface VeliForm {
  veli_ad: string
  veli_telefon: string
  veli_email: string
}

interface AidatForm {
  aidat_tutar: string
}

const BRANSLAR = [
  'Artistik Cimnastik',
  'Ritmik Cimnastik',
  'Basketbol',
  'Voleybol',
  'Yuzme',
  'Futbol',
  'Tenis',
  'Atletizm',
]

export default function KayitGorevlisiPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [sonKayitlar, setSonKayitlar] = useState<{ ad: string; soyad: string; brans: string; tarih: string }[]>([])

  const [ogrenci, setOgrenci] = useState<OgrenciForm>({
    ad: '',
    soyad: '',
    dogum_tarihi: '',
    cinsiyet: '',
    brans: '',
  })

  const [veli, setVeli] = useState<VeliForm>({
    veli_ad: '',
    veli_telefon: '',
    veli_email: '',
  })

  const [aidat, setAidat] = useState<AidatForm>({
    aidat_tutar: '',
  })

  /* auth kontrolu */
  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login?redirect=/kayit&from=kayit')
        return
      }
      setLoading(false)
    }
    init()
  }, [router])

  /* ogrenci alanlari guncelle */
  const updateOgrenci = useCallback(
    (field: keyof OgrenciForm, value: string) => {
      setOgrenci((prev) => ({ ...prev, [field]: value }))
    },
    []
  )

  /* veli alanlari guncelle */
  const updateVeli = useCallback(
    (field: keyof VeliForm, value: string) => {
      setVeli((prev) => ({ ...prev, [field]: value }))
    },
    []
  )

  /* form temizle */
  const resetForm = useCallback(() => {
    setOgrenci({ ad: '', soyad: '', dogum_tarihi: '', cinsiyet: '', brans: '' })
    setVeli({ veli_ad: '', veli_telefon: '', veli_email: '' })
    setAidat({ aidat_tutar: '' })
  }, [])

  /* kaydet */
  const handleSubmit = async () => {
    if (!ogrenci.ad.trim()) {
      setToast({ message: 'Ogrenci adi zorunludur', type: 'error' })
      return
    }
    if (!veli.veli_ad.trim()) {
      setToast({ message: 'Veli adi zorunludur', type: 'error' })
      return
    }

    setSaving(true)
    setToast(null)
    try {
      const res = await fetch('/api/kayit/ogrenci', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...ogrenci,
          ...veli,
          aidat_tutar: aidat.aidat_tutar ? parseFloat(aidat.aidat_tutar) : 0,
        }),
      })
      const data = await res.json()
      if (data.ok) {
        setToast({ message: `${ogrenci.ad} ${ogrenci.soyad} basariyla kaydedildi!`, type: 'success' })
        setSonKayitlar((prev) => [
          {
            ad: ogrenci.ad,
            soyad: ogrenci.soyad,
            brans: ogrenci.brans || '-',
            tarih: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
          },
          ...prev.slice(0, 9),
        ])
        resetForm()
      } else {
        setToast({ message: data.error || 'Kayit basarisiz', type: 'error' })
      }
    } catch {
      setToast({ message: 'Baglanti hatasi', type: 'error' })
    } finally {
      setSaving(false)
      setTimeout(() => setToast(null), 4000)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl p-4 sm:p-6 space-y-6">
        {/* baslik */}
        <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <UserPlus className="h-6 w-6 text-primary" />
              Ogrenci Kayit
            </h1>
            <p className="text-muted-foreground text-sm">
              Yeni ogrenci kaydini bu formdan olusturun
            </p>
          </div>
          <Badge variant="outline" className="text-xs self-start">
            Kayit Gorevlisi
          </Badge>
        </header>

        {/* toast */}
        {toast && (
          <div
            className={`rounded-lg p-3 text-sm ${
              toast.type === 'success'
                ? 'bg-green-500/10 text-green-600 border border-green-500/30'
                : 'bg-red-500/10 text-red-600 border border-red-500/30'
            }`}
          >
            {toast.type === 'success' && <CheckCircle className="inline h-4 w-4 mr-1" />}
            {toast.message}
          </div>
        )}

        {/* ogrenci bilgileri */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Baby className="h-5 w-5 text-blue-500" />
              Ogrenci Bilgileri
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="ad">Ad *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="ad"
                    placeholder="Ogrenci adi"
                    value={ogrenci.ad}
                    onChange={(e) => updateOgrenci('ad', e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="soyad">Soyad</Label>
                <Input
                  id="soyad"
                  placeholder="Ogrenci soyadi"
                  value={ogrenci.soyad}
                  onChange={(e) => updateOgrenci('soyad', e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="dogum_tarihi">Dogum Tarihi</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="dogum_tarihi"
                    type="date"
                    value={ogrenci.dogum_tarihi}
                    onChange={(e) => updateOgrenci('dogum_tarihi', e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cinsiyet">Cinsiyet</Label>
                <select
                  id="cinsiyet"
                  value={ogrenci.cinsiyet}
                  onChange={(e) => updateOgrenci('cinsiyet', e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Seciniz</option>
                  <option value="E">Erkek</option>
                  <option value="K">Kiz</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="brans">Brans</Label>
                <div className="relative">
                  <Trophy className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <select
                    id="brans"
                    value={ogrenci.brans}
                    onChange={(e) => updateOgrenci('brans', e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="">Brans seciniz</option>
                    {BRANSLAR.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* veli bilgileri */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5 text-emerald-500" />
              Veli Bilgileri
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="veli_ad">Veli Adi Soyadi *</Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="veli_ad"
                  placeholder="Veli adi soyadi"
                  value={veli.veli_ad}
                  onChange={(e) => updateVeli('veli_ad', e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="veli_telefon">Telefon</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="veli_telefon"
                    type="tel"
                    placeholder="05XX XXX XX XX"
                    value={veli.veli_telefon}
                    onChange={(e) => updateVeli('veli_telefon', e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="veli_email">E-posta</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="veli_email"
                    type="email"
                    placeholder="veli@email.com"
                    value={veli.veli_email}
                    onChange={(e) => updateVeli('veli_email', e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              E-posta girilirse veli otomatik olarak sisteme kaydedilir ve veli paneline erisim saglanir.
            </p>
          </CardContent>
        </Card>

        {/* ilk aidat */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Banknote className="h-5 w-5 text-amber-500" />
              Ilk Aidat
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1.5">
              <Label htmlFor="aidat_tutar">Aidat Tutari (TRY)</Label>
              <div className="relative">
                <Banknote className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="aidat_tutar"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={aidat.aidat_tutar}
                  onChange={(e) => setAidat({ aidat_tutar: e.target.value })}
                  className="pl-9"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Bos birakilirsa aidat kaydedilmez. Tutar girilirse &quot;bekliyor&quot; durumunda olusturulur.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* kaydet butonu */}
        <Button
          onClick={handleSubmit}
          disabled={saving}
          className="w-full h-12 text-base"
          size="lg"
        >
          {saving ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Save className="mr-2 h-5 w-5" />
          )}
          Ogrenciyi Kaydet
        </Button>

        {/* son kayitlar */}
        {sonKayitlar.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Bu Oturumdaki Kayitlar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {sonKayitlar.map((k, i) => (
                  <div
                    key={`${k.ad}-${k.tarih}-${i}`}
                    className="flex items-center justify-between rounded-lg border p-2.5 text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="font-medium">{k.ad} {k.soyad}</span>
                      <Badge variant="secondary" className="text-xs">{k.brans}</Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">{k.tarih}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
