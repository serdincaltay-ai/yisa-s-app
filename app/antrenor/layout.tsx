'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Activity, LayoutDashboard, ClipboardCheck, Users, LogOut, Ruler } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const NAV = [
  { href: '/antrenor', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/antrenor/yoklama', label: 'Yoklama', icon: ClipboardCheck },
  { href: '/antrenor/sporcular', label: 'Sporcularım', icon: Users },
  { href: '/antrenor/olcum', label: 'Ölçüm', icon: Ruler },
]

export default function AntrenorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
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
      setAllowed(true)
      setLoading(false)
    }
    check()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <span className="text-muted-foreground">Yükleniyor...</span>
      </div>
    )
  }

  if (!allowed) return null

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-border bg-card">
        <div className="flex h-16 items-center gap-2 border-b border-border px-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <Activity className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-foreground">YISA-S</h1>
            <p className="text-xs text-foreground/60">Antrenör Paneli</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                pathname === href || (href !== '/antrenor' && pathname?.startsWith(href + '/'))
                  ? 'bg-primary/20 text-primary'
                  : 'text-foreground/70 hover:bg-muted hover:text-foreground'
              }`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-border p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground/70 hover:bg-muted hover:text-foreground"
          >
            <LogOut className="h-5 w-5" />
            Çıkış Yap
          </button>
        </div>
      </aside>
      <main className="ml-64 flex-1 min-w-0">{children}</main>
    </div>
  )
}
