'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Briefcase, CheckCircle, Clock } from 'lucide-react'

export function StatsOverview() {
  const [stats, setStats] = useState<{
    activeFranchises?: number
    pendingApprovals?: number
    newFranchiseApplications?: number
    demoRequests?: number
  } | null>(null)

  useEffect(() => {
    fetch('/api/stats')
      .then((r) => r.json())
      .then((d) => setStats(d))
      .catch(() => {})
  }, [])

  const items = [
    {
      title: 'Aktif Franchise',
      value: stats?.activeFranchises ?? '—',
      icon: Users,
      change: null as string | null,
      changeType: 'positive' as const,
    },
    {
      title: 'Bekleyen Onay',
      value: stats?.pendingApprovals ?? '—',
      icon: Clock,
      change: null,
      changeType: 'negative' as const,
    },
    {
      title: 'Yeni Başvuru',
      value: stats?.newFranchiseApplications ?? stats?.demoRequests ?? '—',
      icon: Briefcase,
      change: null,
      changeType: 'positive' as const,
    },
    {
      title: 'Onay Bekleyen',
      value: stats?.pendingApprovals ?? '—',
      icon: CheckCircle,
      change: null,
      changeType: 'negative' as const,
    },
  ]
  // İkinci ve dördüncü aynı olmasın — sadece 3 kart
  const displayItems = [items[0], items[1], items[2]]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {displayItems.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title} className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              {stat.change && (
                <p
                  className={`text-xs ${
                    stat.changeType === 'positive'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {stat.change} geçen aydan
                </p>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
