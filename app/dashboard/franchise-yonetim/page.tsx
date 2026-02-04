import { Suspense } from 'react'
import { DashboardHeader } from '@/components/franchise-panel/dashboard-header'
import { StatsOverview } from '@/components/franchise-panel/stats-overview'
import { FranchisePartners } from '@/components/franchise-panel/franchise-partners'
import { ProjectManagement } from '@/components/franchise-panel/project-management'
import { PanelDesigns } from '@/components/franchise-panel/panel-designs'

export default function FranchiseYonetimPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8 space-y-8">
        <Suspense fallback={<div className="text-muted-foreground">Yükleniyor...</div>}>
          <StatsOverview />
        </Suspense>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <FranchisePartners />
          <ProjectManagement />
        </div>

        <PanelDesigns />
      </main>
    </div>
  )
}
