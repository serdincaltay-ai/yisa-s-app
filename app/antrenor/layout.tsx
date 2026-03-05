'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { PanelHeader } from '@/components/PanelHeader'
import { AntrenorBottomNav } from '@/components/PanelBottomNav'

export default function AntrenorLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login?redirect=/antrenor')
        return
      }
      const res = await fetch('/api/franchise/role')
      const d = await res.json()
      const role = d?.role
      if (role !== 'coach') {
        router.replace('/panel')
        return
      }
      const onayRes = await fetch('/api/sozlesme/onay')
      const onayData = await onayRes.json()
      if (onayData?.needsPersonel) {
        router.replace('/sozlesme/personel')
        return
      }
      setAllowed(true)
      setLoading(false)
    }
    check()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <span className="text-zinc-400">Yukleniyor...</span>
      </div>
    )
  }

  if (!allowed) return null

  return (
    <div className="min-h-screen bg-zinc-950">
      <PanelHeader panelName="ANTRENOR PANELİ" />
      <div className="pb-20">{children}</div>
      <AntrenorBottomNav />
    </div>
  )
}
