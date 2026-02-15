'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function FranchiseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login?redirect=/franchise&from=franchise')
        return
      }
      if (pathname !== '/kurulum') {
        const res = await fetch('/api/franchise/kurulum')
        const data = await res.json()
        if (data?.needsSetup && data?.isOwner) {
          router.replace('/kurulum')
          return
        }
      }
      setLoading(false)
    }
    check()
  }, [router, pathname])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground">Yükleniyor...</div>
      </div>
    )
  }

  return <>{children}</>
}
