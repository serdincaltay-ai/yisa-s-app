'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import {
  Home,
  Users,
  Calendar,
  HeartPulse,
  Dumbbell,
  FileText,
  ClipboardList,
  LogOut,
  Activity,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const MENU = [
  { href: '/tesis', label: 'Ana Sayfa', icon: Home },
  { href: '/tesis/ogrenciler', label: 'Ogrenciler', icon: Users },
  { href: '/tesis/dersler', label: 'Ders Programi', icon: Calendar },
  { href: '/tesis/saglik', label: 'Saglik Takibi', icon: HeartPulse },
  { href: '/tesis/antrenorler', label: 'Antrenorler', icon: Dumbbell },
  { href: '/tesis/belgeler', label: 'Belgeler', icon: FileText },
  { href: '/tesis/raporlar', label: 'Raporlar', icon: ClipboardList },
]

export default function TesisLayout({
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
        router.push('/auth/login?redirect=/tesis&from=tesis')
        return
      }
      setLoading(false)
    }
    check()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground">Yukleniyor...</div>
      </div>
    )
  }

  // /tesis/[slug] sayfasi icin layout uygulanmasin
  if (pathname?.match(/^\/tesis\/[a-z0-9-]+$/i) && !MENU.some((m) => m.href === pathname)) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-sidebar">
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Activity className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <span className="font-bold text-sidebar-foreground">YISA-S</span>
              <p className="text-xs text-sidebar-foreground/60">Tesis Paneli</p>
            </div>
          </div>

          <nav className="flex-1 space-y-1 p-4">
            {MENU.map((item) => {
              const Icon = item.icon
              const aktif = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                    aktif
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                      : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="border-t border-sidebar-border p-4">
            <Button
              variant="ghost"
              className="w-full justify-start text-sidebar-foreground/60 hover:text-sidebar-foreground"
              onClick={async () => {
                await supabase.auth.signOut()
                router.push('/')
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Cikis Yap
            </Button>
          </div>
        </div>
      </aside>

      <main className="ml-64 flex-1">
        {children}
      </main>
    </div>
  )
}
