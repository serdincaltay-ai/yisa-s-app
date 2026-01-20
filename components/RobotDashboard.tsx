'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bot, 
  Power, 
  PowerOff, 
  RefreshCw, 
  ChevronDown, 
  ChevronUp,
  Activity,
  Zap,
  Settings,
  AlertCircle
} from 'lucide-react'

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
  created_at: string
  updated_at: string
}

interface RobotDashboardProps {
  onRobotSelect?: (robot: Robot) => void
}

export default function RobotDashboard({ onRobotSelect }: RobotDashboardProps) {
  const [robots, setRobots] = useState<Robot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedRobot, setExpandedRobot] = useState<string | null>(null)
  const [updatingRobot, setUpdatingRobot] = useState<string | null>(null)

  useEffect(() => {
    fetchRobots()
  }, [])

  const fetchRobots = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const res = await fetch('/api/robots')
      const data = await res.json()
      
      if (data.error) {
        // If table doesn't exist, try to seed
        if (data.error.includes('does not exist') || data.error.includes('relation')) {
          await seedRobots()
          return
        }
        throw new Error(data.error)
      }
      
      if (!data.robots || data.robots.length === 0) {
        await seedRobots()
        return
      }
      
      setRobots(data.robots)
    } catch (err) {
      console.error('Fetch error:', err)
      setError(err instanceof Error ? err.message : 'Robotlar yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  const seedRobots = async () => {
    try {
      const res = await fetch('/api/robots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'seed' })
      })
      const data = await res.json()
      
      if (data.error) {
        throw new Error(data.error)
      }
      
      // Fetch again after seeding
      const robotsRes = await fetch('/api/robots')
      const robotsData = await robotsRes.json()
      setRobots(robotsData.robots || [])
    } catch (err) {
      console.error('Seed error:', err)
      setError('Robotlar oluşturulamadı. Lütfen tekrar deneyin.')
    }
  }

  const toggleRobotStatus = async (robot: Robot) => {
    const newStatus = robot.status === 'active' ? 'standby' : 'active'
    setUpdatingRobot(robot.id)
    
    try {
      const res = await fetch('/api/robots', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: robot.id, status: newStatus })
      })
      
      const data = await res.json()
      
      if (data.error) {
        throw new Error(data.error)
      }
      
      setRobots(prev => prev.map(r => 
        r.id === robot.id ? { ...r, status: newStatus } : r
      ))
    } catch (err) {
      console.error('Toggle error:', err)
      setError('Robot durumu güncellenemedi')
    } finally {
      setUpdatingRobot(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-500'
      case 'standby': return 'bg-amber-500'
      case 'offline': return 'bg-red-500'
      default: return 'bg-slate-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Aktif'
      case 'standby': return 'Beklemede'
      case 'offline': return 'Çevrimdışı'
      default: return 'Bilinmiyor'
    }
  }

  const activeCount = robots.filter(r => r.status === 'active').length
  const standbyCount = robots.filter(r => r.status === 'standby').length

  if (loading) {
    return (
      <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-8">
        <div className="flex items-center justify-center gap-3">
          <RefreshCw className="w-5 h-5 text-amber-500 animate-spin" />
          <span className="text-slate-400">Robotlar yükleniyor...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-slate-900/50 rounded-2xl border border-red-800/50 p-8">
        <div className="flex flex-col items-center gap-4">
          <AlertCircle className="w-10 h-10 text-red-500" />
          <p className="text-red-400">{error}</p>
          <button
            onClick={fetchRobots}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-white transition-colors"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 rounded-xl border border-slate-700 p-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 rounded-lg">
              <Bot className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Toplam Robot</p>
              <p className="text-2xl font-bold text-white">{robots.length}</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800/50 rounded-xl border border-slate-700 p-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <Activity className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Aktif</p>
              <p className="text-2xl font-bold text-emerald-400">{activeCount}</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800/50 rounded-xl border border-slate-700 p-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 rounded-lg">
              <Zap className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Beklemede</p>
              <p className="text-2xl font-bold text-amber-400">{standbyCount}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Robots Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AnimatePresence>
          {robots.map((robot, index) => (
            <motion.div
              key={robot.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
              className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden hover:border-slate-600 transition-colors"
            >
              {/* Robot Header */}
              <div 
                className="p-4 cursor-pointer"
                onClick={() => setExpandedRobot(expandedRobot === robot.id ? null : robot.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {/* Robot Icon */}
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                      style={{ backgroundColor: `${robot.color}20` }}
                    >
                      {robot.icon}
                    </div>
                    
                    {/* Robot Info */}
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-white">{robot.name}</h3>
                        <span 
                          className="text-xs px-2 py-0.5 rounded-full font-mono"
                          style={{ 
                            backgroundColor: `${robot.color}20`,
                            color: robot.color 
                          }}
                        >
                          {robot.code}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400">{robot.role}</p>
                    </div>
                  </div>

                  {/* Status & Toggle */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${getStatusColor(robot.status)} animate-pulse`} />
                      <span className="text-xs text-slate-400">{getStatusText(robot.status)}</span>
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleRobotStatus(robot)
                      }}
                      disabled={updatingRobot === robot.id}
                      className={`p-2 rounded-lg transition-colors ${
                        robot.status === 'active' 
                          ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30' 
                          : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                      }`}
                    >
                      {updatingRobot === robot.id ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : robot.status === 'active' ? (
                        <Power className="w-4 h-4" />
                      ) : (
                        <PowerOff className="w-4 h-4" />
                      )}
                    </button>
                    
                    {expandedRobot === robot.id ? (
                      <ChevronUp className="w-4 h-4 text-slate-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-500" />
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              <AnimatePresence>
                {expandedRobot === robot.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-slate-700"
                  >
                    <div className="p-4 space-y-4">
                      <p className="text-sm text-slate-300">{robot.description}</p>
                      
                      {/* Model Info */}
                      <div className="flex items-center gap-2 text-xs">
                        <Settings className="w-3 h-3 text-slate-500" />
                        <span className="text-slate-500">Model:</span>
                        <span className="text-slate-300 font-mono">{robot.model}</span>
                      </div>
                      
                      {/* Capabilities */}
                      <div>
                        <p className="text-xs text-slate-500 mb-2">Yetenekler:</p>
                        <div className="flex flex-wrap gap-2">
                          {robot.capabilities.map((cap, i) => (
                            <span 
                              key={i}
                              className="text-xs px-2 py-1 rounded-md bg-slate-700 text-slate-300"
                            >
                              {cap}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => onRobotSelect?.(robot)}
                          className="flex-1 px-3 py-2 bg-amber-500/20 text-amber-400 rounded-lg text-sm hover:bg-amber-500/30 transition-colors"
                        >
                          Robot ile Konuş
                        </button>
                        <button
                          className="px-3 py-2 bg-slate-700 text-slate-300 rounded-lg text-sm hover:bg-slate-600 transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Refresh Button */}
      <div className="flex justify-center">
        <button
          onClick={fetchRobots}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Yenile
        </button>
      </div>
    </div>
  )
}
