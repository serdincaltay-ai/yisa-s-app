'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, Megaphone, Activity, Users } from 'lucide-react'

export default function VeliDuyurularPage() {
  return (
    <div className="min-h-screen bg-white pb-24">
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
        <div className="flex h-14 items-center gap-2 px-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/veli/dashboard"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <h1 className="font-bold text-gray-900">Duyurular</h1>
        </div>
      </header>

      <main className="p-4">
        <Card className="border-gray-200">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#2563eb]/10 text-[#2563eb] mb-4">
              <Megaphone className="h-8 w-8" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Yakında</h2>
            <p className="text-sm text-gray-600 max-w-sm">
              Duyurular yakında aktif olacak. Tesisinizden gelen önemli bilgiler burada görüntülenecek.
            </p>
          </CardContent>
        </Card>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white">
        <div className="flex items-center justify-around py-2 min-h-[56px]">
          <Link href="/veli/dashboard" className="flex flex-col items-center gap-1 px-4 py-2 text-gray-500">
            <Activity className="h-5 w-5" />
            <span className="text-xs">Dashboard</span>
          </Link>
          <Link href="/veli/dashboard" className="flex flex-col items-center gap-1 px-4 py-2 text-gray-500">
            <Users className="h-5 w-5" />
            <span className="text-xs">Çocuklarım</span>
          </Link>
          <Link href="/veli/duyurular" className="flex flex-col items-center gap-1 px-4 py-2 text-[#2563eb]">
            <Megaphone className="h-5 w-5" />
            <span className="text-xs font-medium">Duyurular</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
