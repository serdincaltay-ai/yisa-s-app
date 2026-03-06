'use client'

import React, { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, FileText, Upload, AlertTriangle, Loader2, Plus, Bell, AlertCircle, CheckCircle2 } from 'lucide-react'

type HealthRecord = {
  id: string
  athlete_id: string
  athlete_name: string
  parent_user_id: string | null
  record_type: string
  notes: string | null
  recorded_at: string
  created_at: string
  saglik_raporu_gecerlilik: string | null
  gecerlilik_durumu: 'gecerli' | 'uyari' | 'suresi_dolmus' | 'belirsiz'
}
type Warning = {
  athlete_id: string
  athlete_name: string
  parent_user_id: string | null
  recorded_at: string | null
  saglik_raporu_gecerlilik: string | null
  gecerlilik_durumu: string
  message: string
  severity: 'red' | 'yellow'
}
type Athlete = { id: string; name: string; surname?: string | null }

function GecerlilikBadge({ durumu, gecerlilik }: { durumu: string; gecerlilik: string | null }) {
  if (durumu === 'suresi_dolmus') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
        <AlertCircle className="h-3 w-3" />
        Süresi dolmuş {gecerlilik && `(${new Date(gecerlilik + 'T00:00:00').toLocaleDateString('tr-TR')})`}
      </span>
    )
  }
  if (durumu === 'uyari') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
        <AlertTriangle className="h-3 w-3" />
        Yakında dolacak {gecerlilik && `(${new Date(gecerlilik + 'T00:00:00').toLocaleDateString('tr-TR')})`}
      </span>
    )
  }
  if (durumu === 'gecerli') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
        <CheckCircle2 className="h-3 w-3" />
        Geçerli {gecerlilik && `(${new Date(gecerlilik + 'T00:00:00').toLocaleDateString('tr-TR')})`}
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
      Belirsiz
    </span>
  )
}

export default function FranchiseBelgelerPage() {
  const [items, setItems] = useState<HealthRecord[]>([])
  const [warnings, setWarnings] = useState<Warning[]>([])
  const [athletes, setAthletes] = useState<Athlete[]>([])
  const [loading, setLoading] = useState(true)
  const [showUpload, setShowUpload] = useState(false)
  const [sending, setSending] = useState(false)
  const [sendingNotif, setSendingNotif] = useState<string | null>(null)
  const [form, setForm] = useState({ athlete_id: '', record_type: 'genel', notes: '', saglik_raporu_gecerlilik: '' })

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [recRes, athRes] = await Promise.all([
        fetch('/api/franchise/health-records'),
        fetch('/api/franchise/athletes'),
      ])
      const recData = await recRes.json()
      const athData = await athRes.json()
      setItems(Array.isArray(recData?.items) ? recData.items : [])
      setWarnings(Array.isArray(recData?.warnings) ? recData.warnings : [])
      setAthletes(Array.isArray(athData?.items) ? athData.items : [])
    } catch {
      setItems([])
      setWarnings([])
      setAthletes([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.athlete_id || sending) return
    setSending(true)
    try {
      const res = await fetch('/api/franchise/health-records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          athlete_id: form.athlete_id,
          record_type: form.record_type,
          notes: form.notes || undefined,
          saglik_raporu_gecerlilik: form.saglik_raporu_gecerlilik || undefined,
        }),
      })
      const data = await res.json()
      if (data?.ok) {
        setForm({ athlete_id: '', record_type: 'genel', notes: '', saglik_raporu_gecerlilik: '' })
        setShowUpload(false)
        fetchData()
      } else {
        alert(data?.error ?? 'Kayıt başarısız')
      }
    } catch {
      alert('İstek gönderilemedi')
    } finally {
      setSending(false)
    }
  }

  const handleSendWarning = async (w: Warning) => {
    if (!w.parent_user_id || sendingNotif) return
    setSendingNotif(w.athlete_id)
    try {
      const res = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: w.parent_user_id,
          notification_type: 'belge_uyari',
          title: 'Belge Geçerlilik Uyarısı',
          body: `${w.athlete_name} için ${w.message.toLowerCase()}. Lütfen sağlık raporunu yenileyiniz.`,
          url: '/veli/cocuk',
        }),
      })
      const data = await res.json()
      if (data?.ok) {
        alert('Bildirim başarıyla gönderildi')
      } else {
        alert(data?.error ?? 'Bildirim gönderilemedi')
      }
    } catch {
      alert('Bildirim gönderme hatası')
    } finally {
      setSendingNotif(null)
    }
  }

  const redWarnings = warnings.filter((w) => w.severity === 'red')
  const yellowWarnings = warnings.filter((w) => w.severity === 'yellow')

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/franchise">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Tesis paneline dön
          </Link>
        </Button>
      </div>

      <header>
        <h1 className="text-2xl font-bold text-foreground">Belge Yönetimi</h1>
        <p className="text-muted-foreground">Sağlık raporu, geçerlilik uyarıları, veli/eğitmen yükleme</p>
      </header>

      {/* Kirmizi uyarilar — suresi dolmus */}
      {redWarnings.length > 0 && (
        <Card className="border-red-500/50 bg-red-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
              <AlertCircle className="h-5 w-5" />
              Süresi dolmuş belgeler ({redWarnings.length})
            </CardTitle>
            <CardDescription>Bu belgelerin süresi dolmuş — yenileme zorunludur</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {redWarnings.map((w) => (
                <li key={`red-${w.athlete_id}`} className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="font-medium">{w.athlete_name}</span>
                    <span className="text-muted-foreground"> — {w.message}</span>
                    {w.saglik_raporu_gecerlilik && (
                      <span className="text-muted-foreground"> (Geçerlilik: {new Date(w.saglik_raporu_gecerlilik + 'T00:00:00').toLocaleDateString('tr-TR')})</span>
                    )}
                  </div>
                  {w.parent_user_id && (
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={sendingNotif === w.athlete_id}
                      onClick={() => handleSendWarning(w)}
                    >
                      {sendingNotif === w.athlete_id ? (
                        <Loader2 className="h-3 w-3 animate-spin mr-1" />
                      ) : (
                        <Bell className="h-3 w-3 mr-1" />
                      )}
                      Uyarı gönder
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Sarı uyarılar — yakında dolacak */}
      {yellowWarnings.length > 0 && (
        <Card className="border-amber-500/50 bg-amber-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
              <AlertTriangle className="h-5 w-5" />
              Geçerlilik uyarıları ({yellowWarnings.length})
            </CardTitle>
            <CardDescription>Sağlık raporu 30 gün içinde dolacak veya kaydı eski — yenileme önerilir</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {yellowWarnings.map((w) => (
                <li key={`yellow-${w.athlete_id}`} className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="font-medium">{w.athlete_name}</span>
                    <span className="text-muted-foreground"> — {w.message}</span>
                    {w.saglik_raporu_gecerlilik && (
                      <span className="text-muted-foreground"> (Geçerlilik: {new Date(w.saglik_raporu_gecerlilik + 'T00:00:00').toLocaleDateString('tr-TR')})</span>
                    )}
                    {!w.saglik_raporu_gecerlilik && w.recorded_at && (
                      <span className="text-muted-foreground"> (Son: {new Date(w.recorded_at).toLocaleDateString('tr-TR')})</span>
                    )}
                  </div>
                  {w.parent_user_id && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-amber-500 text-amber-700 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-950"
                      disabled={sendingNotif === w.athlete_id}
                      onClick={() => handleSendWarning(w)}
                    >
                      {sendingNotif === w.athlete_id ? (
                        <Loader2 className="h-3 w-3 animate-spin mr-1" />
                      ) : (
                        <Bell className="h-3 w-3 mr-1" />
                      )}
                      Uyarı gönder
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Sağlık raporu / kayıtlar
            </CardTitle>
            <CardDescription>Öğrenci sağlık kayıtları, geçerlilik takibi</CardDescription>
          </div>
          <Button size="sm" onClick={() => setShowUpload(!showUpload)}>
            <Plus className="h-4 w-4 mr-1" />
            Kayıt ekle
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {showUpload && (
            <form onSubmit={handleUpload} className="rounded-lg border p-4 space-y-3">
              <div>
                <Label>Öğrenci</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2" value={form.athlete_id} onChange={(e) => setForm((f) => ({ ...f, athlete_id: e.target.value }))} required>
                  <option value="">Seçin</option>
                  {athletes.map((a) => <option key={a.id} value={a.id}>{a.name} {a.surname ?? ''}</option>)}
                </select>
              </div>
              <div>
                <Label>Kayıt türü</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2" value={form.record_type} onChange={(e) => setForm((f) => ({ ...f, record_type: e.target.value }))}>
                  <option value="genel">Genel</option>
                  <option value="saglik_raporu">Sağlık raporu</option>
                  <option value="kontrol">Kontrol</option>
                </select>
              </div>
              <div>
                <Label>Son geçerlilik tarihi</Label>
                <Input
                  type="date"
                  value={form.saglik_raporu_gecerlilik}
                  onChange={(e) => setForm((f) => ({ ...f, saglik_raporu_gecerlilik: e.target.value }))}
                  placeholder="YYYY-MM-DD"
                />
                <p className="text-xs text-muted-foreground mt-1">Sağlık raporunun son geçerlilik tarihini girin (isteğe bağlı)</p>
              </div>
              <div>
                <Label>Not / açıklama</Label>
                <Textarea value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} placeholder="İsteğe bağlı" rows={2} />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={sending}>{sending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Kaydet'}</Button>
                <Button type="button" variant="outline" onClick={() => setShowUpload(false)}>İptal</Button>
              </div>
            </form>
          )}
          {loading ? (
            <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
          ) : items.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">Henüz sağlık kaydı yok. Kayıt ekleyebilir veya veli/eğitmen yüklemesi için tesis ayarlarını kullanabilirsiniz.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-medium">Öğrenci</th>
                    <th className="text-left py-2 font-medium">Tür</th>
                    <th className="text-left py-2 font-medium">Tarih</th>
                    <th className="text-left py-2 font-medium">Geçerlilik</th>
                    <th className="text-left py-2 font-medium">Not</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((r) => (
                    <tr key={r.id} className="border-b">
                      <td className="py-2">{r.athlete_name}</td>
                      <td className="py-2">{r.record_type}</td>
                      <td className="py-2">{new Date(r.recorded_at).toLocaleDateString('tr-TR')}</td>
                      <td className="py-2"><GecerlilikBadge durumu={r.gecerlilik_durumu} gecerlilik={r.saglik_raporu_gecerlilik} /></td>
                      <td className="py-2 text-muted-foreground">{r.notes || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-muted">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Veli / eğitmen yükleme
          </CardTitle>
          <CardDescription>Belge yükleme (dosya) ileride depolama entegrasyonu ile eklenecek. Şu an sağlık kaydı metin olarak yukarıdan eklenebilir.</CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}
