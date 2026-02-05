'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  Home,
  Bot,
  ClipboardCheck,
  BarChart3,
  MessageSquare,
  Calendar,
  Settings,
  Bell,
  Menu,
  X,
} from 'lucide-react'
import PatronCommandPanel from '@/components/PatronCommandPanel'
import RobotStatusGrid from '@/components/patron/RobotStatusGrid'
import ApprovalQueue from '@/components/patron/ApprovalQueue'
import AssistantChat from '@/components/patron/AssistantChat'

const NAV = [
  { href: '/patron', label: 'Ana', icon: Home },
  { href: '/dashboard', label: 'Robot', icon: Bot },
  { href: '/dashboard/onay-kuyrugu', label: 'Onay', icon: ClipboardCheck },
  { href: '/dashboard/reports', label: 'Rapor', icon: BarChart3 },
  { href: '/dashboard', label: 'Chat', icon: MessageSquare },
  { href: '/dashboard', label: 'Takvim', icon: Calendar },
  { href: '/dashboard/settings', label: 'Ayarlar', icon: Settings },
]

export default function PatronPanel() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#0a0e17] text-[#f8fafc] flex">
      {/* Sidebar */}
      <aside
        className={`
          w-64 min-h-screen bg-[#0f172a] border-r border-[#1e293b] p-4 flex flex-col
          fixed lg:static inset-y-0 left-0 z-40 transform transition-transform duration-200
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <Link href="/" className="flex items-center gap-3 mb-6 hover:opacity-90">
          <div className="relative w-10 h-10 flex-shrink-0 rounded-xl overflow-hidden">
            <Image src="/logo.png" alt="YİSA-S" fill className="object-contain" />
          </div>
          <div>
            <h1 className="font-bold text-[#f8fafc]">YİSA-S</h1>
            <p className="text-[10px] text-[#94a3b8]">Yönetici İşletmeci Sporcu Antrenör</p>
          </div>
        </Link>

        <nav className="space-y-1 flex-1">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href + label}
              href={href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#94a3b8] hover:bg-[#1e293b] hover:text-[#f8fafc] transition-colors border-l-2 border-transparent hover:border-[#10b981]"
            >
              <Icon size={20} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="pt-4 border-t border-[#1e293b]">
          <p className="text-xs text-[#94a3b8] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#10b981]" />
            Sistem: Aktif
          </p>
        </div>
      </aside>

      {/* Mobil hamburger */}
      <button
        type="button"
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-[#111827] border border-[#1e293b] text-[#f8fafc]"
        aria-label="Menü"
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-30"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      )}

      {/* Main */}
      <main className="flex-1 overflow-auto pt-14 lg:pt-0 pl-0 lg:pl-0">
        <div className="p-4 md:p-6 space-y-6">
          {/* Header */}
          <header className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-lg overflow-hidden">
                <Image src="/logo.png" alt="YİSA-S" fill className="object-contain" />
              </div>
              <div>
                <span className="text-lg font-semibold text-[#f8fafc]">YİSA-S Patron Paneli</span>
                <p className="text-xs text-[#94a3b8]">Komut gönderin, onay kuyruğunu yönetin</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-mono text-[#94a3b8]">
                🕐 {new Date().toLocaleTimeString('tr-TR', { hour12: false })}
              </span>
              <button className="relative p-2 rounded-xl bg-[#111827] border border-[#1e293b] hover:border-[#3b82f6]/40 transition-colors">
                <Bell className="w-5 h-5 text-[#94a3b8]" />
              </button>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#10b981] to-[#3b82f6]" />
            </div>
          </header>

          {/* Robot Durum Kartları */}
          <div className="rounded-xl border border-[#1e293b] bg-[#111827] p-4">
            <h3 className="text-sm font-semibold text-[#f8fafc] mb-3">Robot Durumu</h3>
            <RobotStatusGrid />
          </div>

          {/* Orta: Onay Havuzu + Patron Komut */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ApprovalQueue />
            <div>
              <h3 className="text-sm font-semibold text-[#f8fafc] mb-3">CELF Komut</h3>
              <PatronCommandPanel />
            </div>
          </div>

          {/* Alt: Asistan Chat */}
          <div>
            <h3 className="text-sm font-semibold text-[#f8fafc] mb-3">Asistan Chat</h3>
            <AssistantChat />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 px-4 py-3 border-t border-[#1e293b] flex flex-wrap items-center justify-between gap-2 text-xs text-[#94a3b8]">
          <span>© YİSA-S 2026</span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#10b981]" />
            Sistem: Aktif | Robotlar: /api/system/health
          </span>
        </footer>
      </main>
    </div>
  )
}
