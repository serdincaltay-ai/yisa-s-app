'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'

type Robot = {
  robot_key: string
  display_name: string
  layer: number
  is_active: boolean
  created_at: string
}

export default function RobotDashboard() {
  const [robots, setRobots] = useState<Robot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showActiveOnly, setShowActiveOnly] = useState(false)

  useEffect(() => {
    const fetchRobots = async () => {
      try {
        setLoading(true)
        setError(null)

        const { data, error } = await supabase
          .from('robots')
          .select('robot_key,display_name,layer,is_active,created_at')
          .order('created_at', { ascending: false })

        if (error) throw error
        setRobots((data ?? []) as Robot[])
      } catch (e: any) {
        setError(e?.message ?? 'Bir hata oluştu')
      } finally {
        setLoading(false)
      }
    }

    fetchRobots()
  }, [])

  const filteredRobots = useMemo(() => {
    const q = searchTerm.trim().toLowerCase()
    return robots.filter((r) => {
      const matchesSearch =
        q.length === 0 ||
        r.robot_key.toLowerCase().includes(q) ||
        r.display_name.toLowerCase().includes(q)

      const matchesActive = !showActiveOnly || r.is_active
      return matchesSearch && matchesActive
    })
  }, [robots, searchTerm, showActiveOnly])

  const grouped = useMemo(() => {
    const groups: Record<number, Robot[]> = {}
    for (const r of filteredRobots) {
      const layer = Number(r.layer ?? 0)
      if (!groups[layer]) groups[layer] = []
      groups[layer].push(r)
    }
    return groups
  }, [filteredRobots])

  const sortedLayers = useMemo(
    () => Object.keys(grouped).map(Number).sort((a, b) => a - b),
    [grouped]
  )

  const layerTitle = (layer: number) => {
    if (layer === 0) return 'Layer 0 — Ana Kadro'
    if (layer === 1) return 'Layer 1 — Destek / QA'
    return `Layer ${layer}`
  }

  if (loading) return <div className="p-6">Yükleniyor...</div>

  if (error) return <div className="p-6 text-red-400">Hata: {error}</div>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Robot Dashboard</h1>

      {/* Filtreler */}
      <div className="mb-4 flex flex-col md:flex-row gap-3 md:items-center">
        <input
          type="text"
          placeholder="Robot key veya isim ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-2 rounded-md border border-white/10 bg-black/20 w-full md:max-w-md"
        />

        <label className="flex items-center gap-2 select-none">
          <input
            type="checkbox"
            checked={showActiveOnly}
            onChange={(e) => setShowActiveOnly(e.target.checked)}
          />
          Sadece Aktifler
        </label>

        <div className="text-sm opacity-70 md:ml-auto">
          Toplam {filteredRobots.length} robot
        </div>
      </div>

      {/* Gruplar */}
      {sortedLayers.length === 0 ? (
        <div className="py-10 opacity-70">Arama kriterlerinize uygun robot bulunamadı.</div>
      ) : (
        <div className="space-y-6">
          {sortedLayers.map((layer) => (
            <div key={layer}>
              <div className="flex items-baseline gap-2 mb-3">
                <h2 className="text-lg font-semibold">{layerTitle(layer)}</h2>
                <span className="text-sm opacity-70">({grouped[layer].length})</span>
              </div>

              <div className="grid gap-3">
                {grouped[layer].map((r) => (
                  <div
                    key={r.robot_key}
                    className="border border-white/10 rounded-xl p-4 bg-black/20"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold">{r.display_name}</div>
                        <div className="opacity-80 mt-1">
                          Kod: {r.robot_key} · Layer: {r.layer}
                        </div>
                      </div>

                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          r.is_active
                            ? 'bg-green-600/80 text-white'
                            : 'bg-red-600/80 text-white'
                        }`}
                      >
                        {r.is_active ? 'Aktif' : 'Pasif'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
