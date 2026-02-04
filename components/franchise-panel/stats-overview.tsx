import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Briefcase, CheckCircle, Clock } from 'lucide-react'

export function StatsOverview() {
  const stats = [
    {
      title: 'Aktif Franchise Ortakları',
      value: '24',
      icon: Users,
      change: '+12%',
      changeType: 'positive' as const,
    },
    {
      title: 'Devam Eden Projeler',
      value: '18',
      icon: Briefcase,
      change: '+5%',
      changeType: 'positive' as const,
    },
    {
      title: 'Tamamlanan İşler',
      value: '156',
      icon: CheckCircle,
      change: '+23%',
      changeType: 'positive' as const,
    },
    {
      title: 'Bekleyen Onaylar',
      value: '7',
      icon: Clock,
      change: '-8%',
      changeType: 'negative' as const,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
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
              <p
                className={`text-xs ${
                  stat.changeType === 'positive'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {stat.change} geçen aydan
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
