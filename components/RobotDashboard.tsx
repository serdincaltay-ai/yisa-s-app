'use client'

import { useEffect, useState } from 'react'
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
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    const fetchRobots = async () => {
      setErrorMsg(null)
      try {
        const { data, error } = await supabase
          .from('robots')
          .select('robot_key,display_name,layer,is_active,created_at')
          .order('created_at', { ascending: false })

        if (error) throw error
        setRobots((data ?? []) as Robot[])
      } catch (e: any) {
        setErrorMsg(e?.message ?? 'Robot verisi alınamadı')
      } finally {
        setLoading(false)
      }
    }

    fetchRobots()
  }, [])

  if (loading) return <div style={{ padding: 24 }}>Yükleniyor…</div>

  if (errorMsg) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Robot Dashboard</h2>
        <p style={{ color: 'tomato' }}>Hata: {errorMsg}</p>
      </div>
    )
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>Robot Dashboard</h2>

      {robots.length === 0 ? (
        <p>Robot bulunamadı.</p>
      ) : (
        <div style={{ display: 'grid', gap: 12, marginTop: 12 }}>
          {robots.map((r) => (
            <div
              key={r.robot_key}
              style={{
                border: '1px solid #333',
                borderRadius: 10,
                padding: 12,
                background: 'rgba(255,255,255,0.03)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>{r.display_name}</strong>
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: 999,
                    background: r.is_active ? '#1a7f37' : '#b42318',
                    color: 'white',
                    fontSize: 12,
                  }}
                >
                  {r.is_active ? 'Aktif' : 'Pasif'}
                </span>
              </div>

              <div style={{ opacity: 0.85, marginTop: 6 }}>
                Kod: {r.robot_key} · Layer: {r.layer}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
