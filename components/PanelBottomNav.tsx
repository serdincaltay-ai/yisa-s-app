'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User, Calendar, Wallet, TrendingUp, Bell, LayoutDashboard, Users, ClipboardCheck, Ruler, Clock, CalendarDays } from 'lucide-react'

type NavItem = {
  href: string
  label: string
  icon: React.ElementType
}

const VELI_NAV: NavItem[] = [
  { href: '/veli/dashboard', label: 'Profil', icon: User },
  { href: '/veli/program', label: 'Program', icon: Calendar },
  { href: '/veli/odeme', label: 'Aidat', icon: Wallet },
  { href: '/veli/gelisim', label: 'Gelişim', icon: TrendingUp },
  { href: '/veli/duyurular', label: 'Bildirim', icon: Bell },
]

const ANTRENOR_NAV: NavItem[] = [
  { href: '/antrenor', label: 'Panel', icon: LayoutDashboard },
  { href: '/antrenor/sporcular', label: 'Sporcular', icon: Users },
  { href: '/antrenor/yoklama', label: 'Yoklama', icon: ClipboardCheck },
  { href: '/antrenor/bugunku-dersler', label: 'Dersler', icon: Calendar },
  { href: '/antrenor/profil', label: 'Profil', icon: User },
]

export function VeliBottomNav() {
  return <PanelBottomNav items={VELI_NAV} />
}

export function AntrenorBottomNav() {
  return <PanelBottomNav items={ANTRENOR_NAV} />
}

function PanelBottomNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (!pathname) return false
    if (href === '/antrenor') return pathname === '/antrenor'
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-800 bg-zinc-950/95 backdrop-blur-md">
      <div className="flex items-center justify-around py-2 min-h-[56px]">
        {items.map((item) => {
          const active = isActive(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${
                active
                  ? 'text-cyan-400'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Icon className="h-5 w-5" strokeWidth={1.5} />
              <span className={`text-[10px] ${active ? 'font-medium' : ''}`}>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
