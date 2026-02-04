'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LayoutTemplate, ExternalLink } from 'lucide-react'

export function PanelDesigns() {
  const designs = [
    {
      id: 1,
      name: 'Patron Komuta Merkezi',
      desc: 'AI asistan, onay kuyruğu, istatistikler',
      href: '/dashboard',
    },
    {
      id: 2,
      name: 'Franchise Vitrinleri',
      desc: 'Tesis listesi, detay sayfaları',
      href: '/dashboard/franchises',
    },
    {
      id: 3,
      name: 'Şablonlar',
      desc: 'CELF direktör şablonları',
      href: '/dashboard/sablonlar',
    },
    {
      id: 4,
      name: 'Raporlar',
      desc: 'Finans, maliyet, satış raporları',
      href: '/dashboard/reports',
    },
  ]

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <LayoutTemplate className="h-5 w-5" />
          Panel Tasarımları
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          YİSA-S dashboard sayfalarına hızlı erişim
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {designs.map((d) => (
            <Link key={d.id} href={d.href}>
              <div className="p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors group">
                <h3 className="font-medium text-foreground group-hover:text-primary">
                  {d.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">{d.desc}</p>
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground mt-2">
                  Git <ExternalLink className="h-3 w-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
