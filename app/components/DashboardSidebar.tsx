'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import {
  LogOut,
  Home,
  Settings,
  BarChart3,
  Bot,
  Wallet,
  LayoutTemplate,
  Store,
  Users,
  ClipboardCheck,
  FileText,
} from 'lucide-react'

/** Patron paneli menüsü — sadece gerekli sayfalar */
const NAV = [
  { href: '/dashboard', label: 'Ana Sayfa', icon: Home },
  { href: '/dashboard/robots', label: 'Direktörler (Canlı)', icon: Bot },
  { href: '/dashboard/franchises', label: "Franchise / Vitrin", icon: Store },
  { href: '/dashboard/kasa-defteri', label: 'Kasa Defteri', icon: Wallet },
  { href: '/dashboard/sablonlar', label: 'Şablonlar', icon: LayoutTemplate },
  { href: '/dashboard/reports', label: 'Raporlar', icon: BarChart3 },
  { href: '/dashboard/settings', label: 'Ayarlar', icon: Settings },
]

export default function DashboardSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const [summary, setSummary] = useState<{ athletes: number; pendingApprovals: number; newApplications: number; activeFranchises: number } | null>(null)

  useEffect(() => {
    Promise.all([
      fetch('/api/stats').then((r) => r.json()).catch(() => ({})),
      fetch('/api/approvals').then((r) => r.json()).catch(() => ({ items: [] })),
    ]).then(([stats, approvals]) => {
      const items = Array.isArray((approvals as { items?: unknown[] }).items) ? (approvals as { items: { status?: string }[] }).items : []
      const pending = items.filter((i) => i.status === 'pending').length
      setSummary({
        athletes: (stats as { athletes?: number }).athletes ?? 0,
        pendingApprovals: pending > 0 ? pending : ((stats as { pendingApprovals?: number }).pendingApprovals ?? 0),
        newApplications: (stats as { newFranchiseApplications?: number; demoRequests?: number }).newFranchiseApplications ?? (stats as { demoRequests?: number }).demoRequests ?? 0,
        activeFranchises: (stats as { activeFranchises?: number }).activeFranchises ?? 0,
      })
    })
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <aside className="w-64 min-h-screen bg-slate-900 border-r border-slate-800 p-4 flex flex-col">
      <Link href="/dashboard" className="flex items-center gap-3 mb-6 hover:opacity-90 transition-opacity">
        <div className="relative w-10 h-10 flex-shrink-0">
          <Image src="/logo.png" alt="YİSA-S" fill className="object-contain" />
        </div>
        <div>
          <h1 className="font-bold text-white">YİSA-S</h1>
          <p className="text-xs text-slate-500">Yönetici İşletmeci Sporcu Antrenör Sistemi</p>
        </div>
      </Link>

      {/* Sistem Özeti */}
      {summary && (
        <div className="mb-4 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 space-y-2">
          <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Sistem Özeti</p>
          <div className="grid grid-cols-2 gap-1.5 text-xs">
            <div className="flex items-center gap-2 px-2 py-1 rounded bg-slate-800">
              <Users size={12} className="text-cyan-400" />
              <span className="text-slate-400">Öğrenci</span>
              <span className="font-mono text-white ml-auto">{summary.athletes}</span>
            </div>
            <div className="flex items-center gap-2 px-2 py-1 rounded bg-slate-800">
              <ClipboardCheck size={12} className="text-amber-400" />
              <span className="text-slate-400">Onay</span>
              <span className="font-mono text-amber-400 ml-auto">{summary.pendingApprovals}</span>
            </div>
            <div className="flex items-center gap-2 px-2 py-1 rounded bg-slate-800">
              <FileText size={12} className="text-emerald-400" />
              <span className="text-slate-400">Başvuru</span>
              <span className="font-mono text-white ml-auto">{summary.newApplications}</span>
            </div>
            <div className="flex items-center gap-2 px-2 py-1 rounded bg-slate-800">
              <Store size={12} className="text-blue-400" />
              <span className="text-slate-400">Franchise</span>
              <span className="font-mono text-white ml-auto">{summary.activeFranchises}</span>
            </div>
          </div>
        </div>
      )}

      <nav className="space-y-2 flex-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                active
                  ? 'bg-cyan-500/10 text-cyan-400'
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
