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
  ClipboardCheck,
  Menu,
  X,
} from 'lucide-react'

/** Patron paneli menüsü — sadece gerekli sayfalar */
const NAV = [
  { href: '/dashboard', label: 'Ana Sayfa', icon: Home },
  { href: '/dashboard/directors', label: 'CELF Direktörlükleri', icon: Bot },
  { href: '/dashboard/robots', label: 'Direktörler (Canlı)', icon: Bot },
  { href: '/dashboard/onay-kuyrugu', label: 'Onay Kuyruğu', icon: ClipboardCheck },
  { href: '/dashboard/franchises', label: 'Franchise / Vitrin', icon: Store },
  { href: '/dashboard/kasa-defteri', label: 'Kasa Defteri', icon: Wallet },
  { href: '/dashboard/sablonlar', label: 'Şablonlar', icon: LayoutTemplate },
  { href: '/dashboard/reports', label: 'Raporlar', icon: BarChart3 },
  { href: '/dashboard/settings', label: 'Ayarlar', icon: Settings },
]

export default function DashboardSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [summary, setSummary] = useState<{ athletes: number; pendingApprovals: number; newApplications: number; activeFranchises: number } | null>(null)

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

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

  const sidebarContent = (
    <>
      <Link href="/dashboard" className="flex items-center gap-3 mb-6 hover:opacity-90 transition-opacity">
        <div className="relative w-10 h-10 flex-shrink-0">
          <Image src="/logo.png" alt="YİSA-S" fill className="object-contain" />
        </div>
        <div>
          <h1 className="font-bold text-white">YİSA-S</h1>
          <p className="text-xs text-slate-500">Yönetici İşletmeci Sporcu Antrenör Sistemi</p>
        </div>
      </Link>

      {/* Kompakt özet — minimalist */}
      {summary && (
        <div className="mb-4 flex items-center justify-between gap-2 text-xs text-slate-500 border-b border-slate-800 pb-3">
          <span>Öğr: <span className="text-white font-mono">{summary.athletes}</span></span>
          <span>Onay: <span className="text-amber-400 font-mono">{summary.pendingApprovals}</span></span>
          <span>Başv: <span className="text-white font-mono">{summary.newApplications}</span></span>
          <span>Frn: <span className="text-white font-mono">{summary.activeFranchises}</span></span>
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
    </>
  )

  return (
    <>
      {/* Mobil hamburger */}
      <button
        type="button"
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
        aria-label="Menüyü aç"
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      {/* Overlay mobilde */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      )}
      <aside
        className={`
          w-64 min-h-screen bg-slate-900 border-r border-slate-800 p-4 flex flex-col
          fixed lg:static inset-y-0 left-0 z-40 transform transition-transform duration-200 ease-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {sidebarContent}
      </aside>
    </>
  )
}
