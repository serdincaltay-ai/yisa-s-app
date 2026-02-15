'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { FranchiseIntro } from '@/components/FranchiseIntro'
import { PanelRoleProvider, usePanelRole } from './PanelRoleContext'
import { usePathname, useRouter } from 'next/navigation'
import { Activity, Users, ArrowLeft, ClipboardCheck, Wallet, Banknote, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'

function PanelLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const role = usePanelRole()
  const isOwner = role === 'owner'
  const isCoach = role === 'coach'

  useEffect(() => {
    fetch('/api/franchise/kurulum')
      .then((r) => r.json())
      .then((d) => {
        if (d?.needsSetup && d?.isOwner) router.replace('/kurulum')
      })
      .catch(() => {})
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="flex min-h-screen bg-background">
      <FranchiseIntro tesisAdi="Demo Tesis" sahipAdi="Sayın Yönetici" />
      <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-border bg-card">
        <div className="flex h-16 items-center gap-2 border-b border-border px-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <Activity className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-foreground">YISA-S</h1>
            <p className="text-xs text-foreground/60">Franchise Paneli</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          <Link
            href="/franchise"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground/70 hover:bg-accent/20 hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
            Panelye Dön
          </Link>
          <Link
            href="/panel/ogrenciler"
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
              pathname?.startsWith('/panel/ogrenciler')
                ? 'bg-accent/30 text-accent-foreground'
                : 'text-foreground/70 hover:bg-accent/20 hover:text-foreground'
            }`}
          >
            <Users className="h-5 w-5" />
            Öğrenciler {isCoach && '(okunur)'}
          </Link>
          <Link
            href="/panel/yoklama"
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
              pathname?.startsWith('/panel/yoklama')
                ? 'bg-accent/30 text-accent-foreground'
                : 'text-foreground/70 hover:bg-accent/20 hover:text-foreground'
            }`}
          >
            <ClipboardCheck className="h-5 w-5" style={{ color: pathname?.startsWith('/panel/yoklama') ? undefined : '#00d4ff' }} />
            Yoklama
          </Link>
          {isOwner && (
            <>
              <Link
                href="/panel/odemeler"
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  pathname?.startsWith('/panel/odemeler')
                    ? 'bg-accent/30 text-accent-foreground'
                    : 'text-foreground/70 hover:bg-accent/20 hover:text-foreground'
                }`}
              >
                <Wallet className="h-5 w-5" style={{ color: pathname?.startsWith('/panel/odemeler') ? undefined : '#00d4ff' }} />
                Ödemeler
              </Link>
              <Link
                href="/panel/aidat"
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  pathname?.startsWith('/panel/aidat')
                    ? 'bg-accent/30 text-accent-foreground'
                    : 'text-foreground/70 hover:bg-accent/20 hover:text-foreground'
                }`}
              >
                <Banknote className="h-5 w-5" style={{ color: pathname?.startsWith('/panel/aidat') ? undefined : '#00d4ff' }} />
                Aidat
              </Link>
            </>
          )}
          <Link
            href="/panel/program"
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
              pathname?.startsWith('/panel/program')
                ? 'bg-accent/30 text-accent-foreground'
                : 'text-foreground/70 hover:bg-accent/20 hover:text-foreground'
            }`}
          >
            <Calendar className="h-5 w-5" style={{ color: pathname?.startsWith('/panel/program') ? undefined : '#00d4ff' }} />
            Ders Programı
          </Link>
        </nav>
        <div className="border-t border-border p-4">
          <Button variant="ghost" size="sm" className="w-full justify-start" onClick={handleLogout}>
            Çıkış Yap
          </Button>
        </div>
      </aside>
      <main className="ml-64 flex-1 min-w-0">
        {children}
      </main>
    </div>
  )
}

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <PanelRoleProvider>
      <PanelLayoutInner>{children}</PanelLayoutInner>
    </PanelRoleProvider>
  )
}
