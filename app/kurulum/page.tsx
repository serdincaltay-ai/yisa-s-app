'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Activity, ChevronLeft, ChevronRight, Check, Loader2 } from 'lucide-react'

const DAYS = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar']
const THEME_COLORS = ['#1a1a2e', '#0f172a', '#1e293b', '#0c4a6e', '#065f46', '#4c1d95', '#7c2d12']

type Tenant = {
  id: string
  ad?: string | null
  name?: string | null
  slug?: string | null
  sehir?: string | null
  ilce?: string | null
  logo_url?: string | null
  working_hours?: Record<string, string>
  primary_color?: string | null
  setup_completed?: boolean
  phone?: string | null
  address?: string | null
  description?: string | null
  selected_branches?: string[]
}

type SportsBranch = { id: string; kod: string; isim: string; kategori?: string | null }

export default function KurulumPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [sportsBranches, setSportsBranches] = useState<SportsBranch[]>([])
  const [needsSetup, setNeedsSetup] = useState(true)
  const [isOwner, setIsOwner] = useState(false)
  const [form, setForm] = useState({
    ad: '',
    name: '',
    phone: '',
    address: '',
    sehir: '',
    ilce: '',
    description: '',
    logo_url: '',
    primary_color: '#1a1a2e',
    working_hours: {} as Record<string, string>,
    selected_branches: [] as string[],
  })

  const fetchData = useCallback(async () => {
    const res = await fetch('/api/franchise/kurulum')
    const data = await res.json()
    if (res.status === 401) {
      router.push('/auth/login?redirect=/kurulum')
      return
    }
    if (res.status === 403) {
      router.push('/franchise')
      return
    }
    if (data.tenant) {
      setTenant(data.tenant)
      setForm((f) => ({
        ...f,
        ad: data.tenant.ad ?? data.tenant.name ?? '',
        name: data.tenant.name ?? data.tenant.ad ?? '',
        phone: data.tenant.phone ?? '',
        address: data.tenant.address ?? '',
        sehir: data.tenant.sehir ?? '',
        ilce: data.tenant.ilce ?? '',
        description: data.tenant.description ?? '',
        logo_url: data.tenant.logo_url ?? '',
        primary_color: data.tenant.primary_color ?? '#1a1a2e',
        working_hours: (data.tenant.working_hours as Record<string, string>) ?? {},
        selected_branches: Array.isArray(data.tenant.selected_branches) ? data.tenant.selected_branches : [],
      }))
    }
    setSportsBranches(Array.isArray(data.sportsBranches) ? data.sportsBranches : [])
    setNeedsSetup(data.needsSetup ?? true)
    setIsOwner(data.isOwner ?? false)
    setLoading(false)
  }, [router])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    if (!loading && !needsSetup) {
      router.replace('/franchise')
    }
  }, [loading, needsSetup, router])

  useEffect(() => {
    if (!loading && tenant && !isOwner) {
      router.replace('/franchise')
    }
  }, [loading, tenant, isOwner, router])

  const handleWorkingHoursChange = (day: string, value: string) => {
    setForm((f) => ({
      ...f,
      working_hours: { ...f.working_hours, [day]: value },
    }))
  }

  const handleBranchToggle = (id: string) => {
    setForm((f) => ({
      ...f,
      selected_branches: f.selected_branches.includes(id)
        ? f.selected_branches.filter((b) => b !== id)
        : [...f.selected_branches, id],
    }))
  }

  const handleSubmit = async () => {
    if (saving) return
    setSaving(true)
    try {
      const res = await fetch('/api/franchise/kurulum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ad: form.ad || form.name,
          name: form.name || form.ad,
          phone: form.phone || null,
          address: form.address || null,
          sehir: form.sehir || null,
          ilce: form.ilce || null,
          description: form.description || null,
          logo_url: form.logo_url || null,
          primary_color: form.primary_color,
          working_hours: form.working_hours,
          selected_branches: form.selected_branches,
        }),
      })
      const data = await res.json()
      if (data?.ok) {
        router.replace('/sozlesme/franchise')
      } else {
        alert(data?.error ?? 'Kayıt başarısız')
      }
    } catch {
      alert('Bağlantı hatası')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!tenant || !needsSetup || !isOwner) {
    return null
  }

  const totalSteps = 6
  const progress = (step / totalSteps) * 100

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-2xl px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Activity className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">YİSA-S</h1>
              <p className="text-sm text-muted-foreground">Tesis Kurulum Sihirbazı</p>
            </div>
          </div>
          <Progress value={progress} className="mt-4 h-2" />
          <p className="mt-2 text-xs text-muted-foreground">
            Adım {step} / {totalSteps}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>
              {step === 1 && 'Tesis Bilgileri'}
              {step === 2 && 'Logo'}
              {step === 3 && 'Çalışma Saatleri'}
              {step === 4 && 'Branş Seçimi'}
              {step === 5 && 'Tema Rengi'}
              {step === 6 && 'Özet'}
            </CardTitle>
            <CardDescription>
              {step === 1 && 'Tesisinizin temel bilgilerini girin'}
              {step === 2 && 'Logo URL adresinizi girin (MVP)'}
              {step === 3 && 'Günlük açılış-kapanış saatleri'}
              {step === 4 && 'Sunacağınız branşları seçin'}
              {step === 5 && 'Panel tema rengi'}
              {step === 6 && 'Tüm bilgileri kontrol edin'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 1 && (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Tesis Adı *</Label>
                  <Input
                    value={form.ad}
                    onChange={(e) => setForm((f) => ({ ...f, ad: e.target.value, name: e.target.value }))}
                    placeholder="Örn. BJK Tuzla Cimnastik"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Telefon</Label>
                  <Input
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    placeholder="0555 123 45 67"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label>Adres</Label>
                  <Input
                    value={form.address}
                    onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                    placeholder="Sokak, mahalle, bina no"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Şehir</Label>
                  <Input
                    value={form.sehir}
                    onChange={(e) => setForm((f) => ({ ...f, sehir: e.target.value }))}
                    placeholder="İstanbul"
                  />
                </div>
                <div className="space-y-2">
                  <Label>İlçe</Label>
                  <Input
                    value={form.ilce}
                    onChange={(e) => setForm((f) => ({ ...f, ilce: e.target.value }))}
                    placeholder="Tuzla"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label>Açıklama</Label>
                  <Textarea
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    placeholder="Kısa tesis tanıtımı"
                    rows={3}
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-2">
                <Label>Logo URL</Label>
                <Input
                  value={form.logo_url}
                  onChange={(e) => setForm((f) => ({ ...f, logo_url: e.target.value }))}
                  placeholder="https://..."
                />
                {form.logo_url && (
                  <div className="mt-4 flex items-center gap-4">
                    <img src={form.logo_url} alt="Logo önizleme" className="h-16 w-auto object-contain rounded" onError={(e) => (e.currentTarget.style.display = 'none')} />
                  </div>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                {DAYS.map((day) => (
                  <div key={day} className="flex items-center gap-4">
                    <Label className="w-28">{day}</Label>
                    <Input
                      value={form.working_hours[day] ?? ''}
                      onChange={(e) => handleWorkingHoursChange(day, e.target.value)}
                      placeholder="09:00-18:00"
                    />
                  </div>
                ))}
              </div>
            )}

            {step === 4 && (
              <div className="space-y-2">
                <Label>Branşlar (birden fazla seçebilirsiniz)</Label>
                <div className="grid gap-2 md:grid-cols-2">
                  {sportsBranches.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Branş listesi yükleniyor veya henüz tanımlı değil.</p>
                  ) : (
                    sportsBranches.map((b) => (
                      <label key={b.id} className="flex items-center gap-2 rounded-lg border p-3 cursor-pointer hover:bg-accent/20">
                        <input
                          type="checkbox"
                          checked={form.selected_branches.includes(b.id)}
                          onChange={() => handleBranchToggle(b.id)}
                          className="rounded border-input"
                        />
                        <span>{b.isim || b.kod}</span>
                      </label>
                    ))
                  )}
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-4">
                <Label>Tema Rengi</Label>
                <div className="flex flex-wrap gap-2">
                  {THEME_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, primary_color: color }))}
                      className={`h-10 w-10 rounded-lg border-2 transition-all ${
                        form.primary_color === color ? 'border-primary scale-110' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <Input
                  value={form.primary_color}
                  onChange={(e) => setForm((f) => ({ ...f, primary_color: e.target.value }))}
                  placeholder="#1a1a2e"
                  className="mt-2"
                />
              </div>
            )}

            {step === 6 && (
              <div className="space-y-4 text-sm">
                <div><strong>Tesis:</strong> {form.ad || form.name || '—'}</div>
                <div><strong>Telefon:</strong> {form.phone || '—'}</div>
                <div><strong>Adres:</strong> {form.address || '—'}</div>
                <div><strong>Şehir/İlçe:</strong> {[form.sehir, form.ilce].filter(Boolean).join(' / ') || '—'}</div>
                <div><strong>Branşlar:</strong> {form.selected_branches.length > 0 ? sportsBranches.filter((b) => form.selected_branches.includes(b.id)).map((b) => b.isim || b.kod).join(', ') : '—'}</div>
                <div><strong>Tema:</strong> <span className="inline-block w-4 h-4 rounded border" style={{ backgroundColor: form.primary_color }} /> {form.primary_color}</div>
              </div>
            )}

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Önceki
              </Button>
              {step < totalSteps ? (
                <Button
                  onClick={() => setStep((s) => Math.min(totalSteps, s + 1))}
                  disabled={step === 1 && !form.ad?.trim()}
                >
                  Sonraki
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Check className="h-4 w-4 mr-2" />}
                  Kurulumu Tamamla
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
