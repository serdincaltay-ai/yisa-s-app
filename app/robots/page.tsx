'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Home, Bot, ArrowLeft, MessageSquare } from 'lucide-react'
import RobotDashboard from '@/components/RobotDashboard'

interface Robot {
  id: string
  name: string
  code: string
  role: string
  description: string
  status: 'active' | 'standby' | 'offline'
  model: string
  color: string
  icon: string
  capabilities: string[]
}

export default function RobotsPage() {
  const router = useRouter()
  const [selectedRobot, setSelectedRobot] = useState<Robot | null>(null)

  const handleRobotSelect = (robot: Robot) => {
    setSelectedRobot(robot)
    // Navigate to chat with robot context
    router.push(`/panel/dashboard?robot=${robot.code}`)
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-slate-900" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">YİSA-S Robot Filosu</h1>
                  <p className="text-xs text-slate-400">7 Yapay Zeka Motorlu Kolektif Sistem</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <Home className="w-4 h-4" />
                Dashboard
              </button>
              <button
                onClick={() => router.push('/panel/dashboard')}
                className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-slate-900 rounded-lg hover:bg-amber-400 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                Robot ile Konuş
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Title Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Robot Yönetim Paneli</h2>
          <p className="text-slate-400">
            Tüm robotları görüntüle, durumlarını kontrol et ve yönet.
          </p>
        </div>

        {/* Robot Dashboard Component */}
        <RobotDashboard onRobotSelect={handleRobotSelect} />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <p className="text-center text-sm text-slate-500">
            YİSA-S Robot Sistemi v1.0 • Powered by AI
          </p>
        </div>
      </footer>
    </div>
  )
}
