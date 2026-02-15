'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function VeliLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!pathname) return
    const isGiris = pathname === '/veli/giris'
    const isDemoLoggedIn = typeof window !== 'undefined' && sessionStorage.getItem('veli-demo-logged-in')
    if (isGiris) {
      setLoading(false)
      return
    }
    if (!isDemoLoggedIn) {
      router.replace('/veli/giris')
      return
    }
    if (pathname === '/veli') {
      router.replace('/veli/dashboard')
      return
    }
    setLoading(false)
  }, [pathname, router])

  if (loading && pathname !== '/veli/giris') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-gray-500">Yükleniyor...</div>
      </div>
    )
  }

  return <>{children}</>
}
