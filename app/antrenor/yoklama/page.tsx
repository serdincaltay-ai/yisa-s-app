'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, Clock, Save } from 'lucide-react'

type Schedule = { id: string; gun: string; saat: string; ders_adi: string; brans?: string }
type Sporcu = { id: string; name: string; surname?: string; level?: string; group?: string; mevcutDurum: string | null }

export default function AntrenorYoklamaPage() {
  const router = useRouter()
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [sporcular, setSporcular] = useState<Sporcu[]>([])
  const [selectedSchedule, setSelectedSchedule] = useState('')
  const [durumMap, setDurumMap] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/antrenor/schedules')
      .then((r) => r.json())
      .then((d) => setSchedules(d.items ?? []))
      .catch(() => setSchedules([]))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!selectedSchedule) {
      setSporcular([])
      setDurumMap({})
      return
    }
    setLoading(true)
    fetch(`/api/antrenor/yoklama?scheduleId=${encodeURIComponent(selectedSchedule)}`)
      .then((r) => r.json())
      .then((d) => {
        const list = d.sporcular ?? []
        setSporcular(list)
        const m: Record<string, string> = {}
        list.forEach((s: Sporcu) => {
          const st = s.mevcutDurum
          if (st === 'present') m[s.id] = 'geldi'
          else if (st === 'excused') m[s.id] = 'izinli'
          else if (st === 'absent') m[s.id] = 'gelmedi'
          else m[s.id] = ''
        })
        setDurumMap(m)
      })
      .catch(() => {
        setSporcular([])
        setDurumMap({})
      })
      .finally(() => setLoading(false))
  }, [selectedSchedule])

  const setDurum = (athleteId: string, durum: string) => {
    setDurumMap((prev) => ({ ...prev, [athleteId]: durum }))
  }

  const handleKaydet = async () => {
    const records = Object.entries(durumMap)
      .filter(([, d]) => d === 'geldi' || d === 'gelmedi' || d === 'izinli')
      .map(([athlete_id, durum]) => ({ athlete_id, durum }))
    if (records.length === 0) return
    setSaving(true)
    try {
      const res = await fetch('/api/antrenor/yoklama', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ records }),
      })
      const j = await res.json()
      if (res.ok && j.ok) {
        router.refresh()
        const m: Record<string, string> = {}
        sporcular.forEach((s) => {
          m[s.id] = durumMap[s.id] ?? ''
        })
        setDurumMap(m)
      } else {
        alert(j.error ?? 'Kaydetme başarısız')
      }
    } catch {
      alert('Kaydetme başarısız')
    } finally {
      setSaving(false)
    }
  }

  const hasChanges = Object.values(durumMap).some((d) => d)

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Yoklama Al</h1>
        <p className="text-muted-foreground">Ders seçin ve sporcuların devam durumunu işaretleyin.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ders Seçimi</CardTitle>
          <CardDescription>Yoklama alacağınız dersi seçin</CardDescription>
        </CardHeader>
        <CardContent>
          <select
            value={selectedSchedule}
            onChange={(e) => setSelectedSchedule(e.target.value)}
            className="w-full max-w-md rounded-lg border border-input bg-background px-4 py-2"
          >
            <option value="">Ders seçin</option>
            {schedules.map((s) => (
              <option key={s.id} value={s.id}>
                {s.ders_adi} — {s.gun} {s.saat} {s.brans ? `(${s.brans})` : ''}
              </option>
            ))}
          </select>
        </CardContent>
      </Card>

      {loading && selectedSchedule ? (
        <p className="text-muted-foreground">Yükleniyor...</p>
      ) : sporcular.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Sporcular</CardTitle>
            <CardDescription>
              Her sporcu için durum seçin: Geldi / Gelmedi / İzinli
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {sporcular.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div>
                  <p className="font-medium">
                    {s.name} {s.surname ?? ''}
                  </p>
                  {(s.level || s.group) && (
                    <p className="text-xs text-muted-foreground">
                      {[s.level, s.group].filter(Boolean).join(' • ')}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={durumMap[s.id] === 'geldi' ? 'default' : 'outline'}
                    onClick={() => setDurum(s.id, 'geldi')}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Geldi
                  </Button>
                  <Button
                    size="sm"
                    variant={durumMap[s.id] === 'gelmedi' ? 'destructive' : 'outline'}
                    onClick={() => setDurum(s.id, 'gelmedi')}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Gelmedi
                  </Button>
                  <Button
                    size="sm"
                    variant={durumMap[s.id] === 'izinli' ? 'secondary' : 'outline'}
                    onClick={() => setDurum(s.id, 'izinli')}
                  >
                    <Clock className="h-4 w-4 mr-1" />
                    İzinli
                  </Button>
                </div>
              </div>
            ))}
            {hasChanges && (
              <Button onClick={handleKaydet} disabled={saving} className="mt-4">
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Kaydediliyor...' : 'Kaydet'}
              </Button>
            )}
          </CardContent>
        </Card>
      ) : selectedSchedule ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Bu derse atanmış sporcu bulunamadı.
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
