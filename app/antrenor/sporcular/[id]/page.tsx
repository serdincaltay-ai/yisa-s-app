'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Save, CheckCircle, XCircle, Clock, Plus, Loader2 } from 'lucide-react'

type Athlete = {
  id: string
  name: string
  surname?: string
  branch?: string
  level?: string
  group?: string
  status?: string
  notes?: string
  birth_date?: string
}
type Yoklama = { id: string; tarih: string; durum: string }
type Movement = { id: string; movement_name: string; completed_at: string; notes?: string }

export default function AntrenorSporcuDetayPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string
  const [athlete, setAthlete] = useState<Athlete | null>(null)
  const [yoklamalar, setYoklamalar] = useState<Yoklama[]>([])
  const [movements, setMovements] = useState<Movement[]>([])
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newMovement, setNewMovement] = useState('')
  const [movementSaving, setMovementSaving] = useState(false)

  useEffect(() => {
    if (!id) return
    Promise.all([
      fetch(`/api/antrenor/sporcular/${id}`).then((r) => r.json()),
      fetch(`/api/antrenor/hareket?athlete_id=${id}`).then((r) => r.json()),
    ])
      .then(([d, m]) => {
        setAthlete(d.athlete ?? null)
        setNotes(d.athlete?.notes ?? '')
        setYoklamalar(d.yoklamalar ?? [])
        setMovements(m.items ?? [])
      })
      .catch(() => {
        setAthlete(null)
        setYoklamalar([])
      })
      .finally(() => setLoading(false))
  }, [id])

  const handleAddMovement = async () => {
    if (!id || !newMovement.trim()) return
    setMovementSaving(true)
    try {
      const res = await fetch('/api/antrenor/hareket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ athlete_id: id, movement_name: newMovement.trim() }),
      })
      const j = await res.json()
      if (res.ok && j.ok) {
        setNewMovement('')
        // Refresh movements
        const mRes = await fetch(`/api/antrenor/hareket?athlete_id=${id}`)
        const mData = await mRes.json()
        setMovements(mData.items ?? [])
      }
    } catch {
      /* ignore */
    } finally {
      setMovementSaving(false)
    }
  }

  const handleNotKaydet = async () => {
    if (!id) return
    setSaving(true)
    try {
      const res = await fetch(`/api/antrenor/sporcular/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      })
      const j = await res.json()
      if (res.ok && j.ok) {
        if (athlete) setAthlete({ ...athlete, notes })
      } else {
        alert(j.error ?? 'Kaydetme başarısız')
      }
    } catch {
      alert('Kaydetme başarısız')
    } finally {
      setSaving(false)
    }
  }

  if (loading || !id) {
    return (
      <div className="p-6 flex items-center justify-center">
        <span className="text-muted-foreground">Yükleniyor...</span>
      </div>
    )
  }

  if (!athlete) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Sporcu bulunamadı.</p>
        <Link href="/antrenor/sporcular" className="text-primary hover:underline mt-2 inline-block">
          ← Sporculara dön
        </Link>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/antrenor/sporcular/${id}/gelisim`} className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
          Gelişim grafiği
        </Link>
        <Link
          href="/antrenor/sporcular"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Sporculara dön
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {athlete.name} {athlete.surname ?? ''}
          </CardTitle>
          <CardDescription>
            {[athlete.branch, athlete.level, athlete.group].filter(Boolean).join(' • ')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2 text-sm">
            <p><span className="text-muted-foreground">Branş:</span> {athlete.branch ?? '—'}</p>
            <p><span className="text-muted-foreground">Seviye:</span> {athlete.level ?? '—'}</p>
            <p><span className="text-muted-foreground">Grup:</span> {athlete.group ?? '—'}</p>
            <p><span className="text-muted-foreground">Durum:</span> {athlete.status ?? '—'}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Not</CardTitle>
          <CardDescription>Sporcu hakkında not ekleyin veya güncelleyin</CardDescription>
        </CardHeader>
        <CardContent>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full min-h-[100px] rounded-lg border border-input bg-background px-4 py-2"
            placeholder="Not yazın..."
          />
          <Button onClick={handleNotKaydet} disabled={saving} className="mt-2">
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </Button>
        </CardContent>
      </Card>

      {/* Hareket Tamamlama */}
      <Card>
        <CardHeader>
          <CardTitle>Hareket Havuzu</CardTitle>
          <CardDescription>Sporcunun tamamladığı hareketleri işaretleyin</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMovement}
              onChange={(e) => setNewMovement(e.target.value)}
              className="flex-1 rounded-lg border border-input bg-background px-4 py-2 text-sm"
              placeholder="Hareket adı (ör: Takla, Köprü, Ters Takla)"
            />
            <Button onClick={handleAddMovement} disabled={movementSaving || !newMovement.trim()} size="sm">
              {movementSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            </Button>
          </div>
          {movements.length === 0 ? (
            <p className="text-muted-foreground text-sm">Henüz tamamlanan hareket yok.</p>
          ) : (
            <div className="space-y-2">
              {movements.map((m) => (
                <div key={m.id} className="flex items-center justify-between rounded-lg border p-2">
                  <div>
                    <span className="text-sm font-medium">{m.movement_name}</span>
                    {m.notes && <p className="text-xs text-muted-foreground">{m.notes}</p>}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(m.completed_at).toLocaleDateString('tr-TR')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Yoklama Geçmişi</CardTitle>
          <CardDescription>Son 50 yoklama kaydı</CardDescription>
        </CardHeader>
        <CardContent>
          {yoklamalar.length === 0 ? (
            <p className="text-muted-foreground text-sm">Henüz yoklama kaydı yok.</p>
          ) : (
            <div className="space-y-2">
              {yoklamalar.map((y) => (
                <div
                  key={y.id}
                  className="flex items-center justify-between rounded-lg border p-2"
                >
                  <span className="text-sm">{y.tarih}</span>
                  {y.durum === 'geldi' && (
                    <span className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm">
                      <CheckCircle className="h-4 w-4" /> Geldi
                    </span>
                  )}
                  {y.durum === 'gelmedi' && (
                    <span className="flex items-center gap-1 text-red-600 dark:text-red-400 text-sm">
                      <XCircle className="h-4 w-4" /> Gelmedi
                    </span>
                  )}
                  {y.durum === 'izinli' && (
                    <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 text-sm">
                      <Clock className="h-4 w-4" /> İzinli
                    </span>
                  )}
                  {y.durum === 'gec' && (
                    <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400 text-sm">
                      Geç
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
