'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, Clock, Eye } from 'lucide-react'

export function ProjectManagement() {
  const [projects] = useState([
    {
      id: 1,
      title: 'E-ticaret Panel Tasarımı',
      partner: 'AY Teknoloji',
      status: 'review',
      priority: 'high',
      dueDate: '2024-01-15',
    },
    {
      id: 2,
      title: 'Mobil Uygulama Arayüzü',
      partner: 'FD Dijital',
      status: 'in-progress',
      priority: 'medium',
      dueDate: '2024-01-20',
    },
    {
      id: 3,
      title: 'Dashboard Yenileme',
      partner: 'MK Solutions',
      status: 'pending',
      priority: 'low',
      dueDate: '2024-01-25',
    },
  ])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'review':
        return <Eye className="h-4 w-4" />
      case 'in-progress':
        return <Clock className="h-4 w-4" />
      case 'pending':
        return <Clock className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'review':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
      case 'in-progress':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
      case 'pending':
        return 'bg-muted text-muted-foreground border-border'
      default:
        return 'bg-muted text-muted-foreground border-border'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'review':
        return 'İncelemede'
      case 'in-progress':
        return 'Devam Ediyor'
      case 'pending':
        return 'Beklemede'
      default:
        return 'Bilinmiyor'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
      case 'medium':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
      case 'low':
        return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20'
      default:
        return 'bg-muted text-muted-foreground border-border'
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'Yüksek'
      case 'medium':
        return 'Orta'
      case 'low':
        return 'Düşük'
      default:
        return 'Normal'
    }
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Proje Yönetimi</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">{project.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {project.partner}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge
                      variant="outline"
                      className={getStatusColor(project.status)}
                    >
                      {getStatusIcon(project.status)}
                      <span className="ml-1">{getStatusText(project.status)}</span>
                    </Badge>
                    <Badge
                      variant="outline"
                      className={getPriorityColor(project.priority)}
                    >
                      {getPriorityText(project.priority)}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Son tarih: {project.dueDate}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
