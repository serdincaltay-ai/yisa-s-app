'use client'

import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import {
  LogOut,
  Home,
  Users,
  Settings,
  BarChart3,
  Bot,
  Building2,
  MessageSquare,
} from 'lucide-react'

const NAV = [
  { href: '/dashboard', label: 'Ana Sayfa', icon: Home },
  { href: '/dashboard/robots', label: 'Robot Yönetimi', icon: Bot },
  { href: '/dashboard/users', label: 'Kullanıcı Yönetimi', icon: Users },
  { href: '/dashboard/facilities', label: 'Tesis Yönetimi', icon: Building2 },
  { href: '/dashboard/reports', label: 'Raporlar', icon: BarChart3 },
  { href: '/dashboard/messages', label: 'Mesajlar', icon: MessageSquare },
  { href: '/dashboard/settings', label: 'Ayarlar', icon: Settings },
]

export default function DashboardSidebar() {
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <aside className="w-64 min-h-screen bg-slate-900 border-r border-slate-800 p-4 flex flex-col">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
          <span className="text-slate-900 font-bold">Y</span>
        </div>
        <div>
          <h1 className="font-bold text-white">YİSA-S</h1>
          <p className="text-xs text-slate-500">Patron Paneli</p>
        </div>
      </div>

      <nav className="space-y-2 flex-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                active
                  ? 'bg-amber-500/10 text-amber-400'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={20} />
              {label}
            </Link>
          )
        })}
      </nav>

      <div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
        >
          <LogOut size={20} />
          Çıkış Yap
        </button>
      </div>
    </aside>
  )
}
