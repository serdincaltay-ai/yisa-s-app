'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, CheckCircle, XCircle, Clock } from 'lucide-react'

type Sporcu = {
  id: string
  name: string
  surname?: string
  branch?: string
  level?: string
  group?: string
  status?: string
  sonYoklama: { tarih: string; durum: string } | null
}

export default function AntrenorSporcularPage() {
  const [items, setItems] = useState<Sporcu[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/antrenor/sporcular')
      .then((r) => r.json())
      .then((d) => setItems(d.items ?? []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <span className="text-muted-foreground">Yükleniyor...</span>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Sporcularım</h1>
        <p className="text-muted-foreground">Size atanan sporcuların listesi.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Sporcular ({items.length})
          </CardTitle>
          <CardDescription>Detay ve yoklama geçmişi için tıklayın</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {items.length === 0 ? (
            <p className="text-muted-foreground text-sm py-4">Henüz atanmış sporcu yok.</p>
          ) : (
            items.map((s) => (
              <Link
                key={s.id}
                href={`/antrenor/sporcular/${s.id}`}
                className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors"
              >
                <div>
                  <p className="font-medium">
                    {s.name} {s.surname ?? ''}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {[s.branch, s.level, s.group].filter(Boolean).join(' • ')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {s.sonYoklama && (
                    <>
                      {s.sonYoklama.durum === 'geldi' && (
                        <Badge variant="outline" className="text-green-600 border-green-600/50">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {s.sonYoklama.tarih}
                        </Badge>
                      )}
                      {s.sonYoklama.durum === 'gelmedi' && (
                        <Badge variant="outline" className="text-red-600 border-red-600/50">
                          <XCircle className="h-3 w-3 mr-1" />
                          {s.sonYoklama.tarih}
                        </Badge>
                      )}
                      {s.sonYoklama.durum === 'izinli' && (
                        <Badge variant="outline" className="text-amber-600 border-amber-600/50">
                          <Clock className="h-3 w-3 mr-1" />
                          {s.sonYoklama.tarih}
                        </Badge>
                      )}
                    </>
                  )}
                </div>
              </Link>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
