'use client'

import React from "react"

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error

      const userId = data.user?.id
      const meta = data.user?.user_metadata || {}

      let role = meta.role as string | undefined
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single()
      if (profile?.role) role = profile.role

      role = role || 'veli'

      const panel = meta.panel as string | undefined
      const redirectMap: Record<string, string> = {
        patron: '/patron',
        franchise: '/franchise',
        firma_sahibi: '/franchise',
        isletme_muduru: '/tesis',
        tesis_sahibi: '/tesis',
        antrenor: '/antrenor',
        veli: '/veli',
      }
      let path = redirectMap[role] ?? redirectMap[meta.role as string] ?? '/veli'
      if (role === 'franchise' && panel === 'tesis') path = '/tesis'
      if (!path || !path.startsWith('/')) path = '/veli'
      router.push(path)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Giris hatasi')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center relative overflow-hidden">

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <FloatingBall size={300} color="emerald" top="20%" left="-5%" delay={0} />
        <FloatingBall size={200} color="cyan" bottom="20%" right="-5%" delay={2} />
      </div>

      <div className="relative z-10 w-full max-w-md p-8">

        <Link href="/" className="flex items-center justify-center gap-2 mb-12">
          <span className="text-3xl font-bold tracking-tight">YISA-S</span>
        </Link>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
          <h1 className="text-2xl font-bold mb-2">Giris Yap</h1>
          <p className="text-white/40 mb-8">Hesabiniza giris yapin</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="E-posta"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/5 border-white/10 h-14 rounded-2xl text-lg"
                required
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Sifre"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/5 border-white/10 h-14 rounded-2xl text-lg"
                required
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full h-14 rounded-2xl bg-white text-black hover:bg-white/90 text-lg font-medium"
              disabled={isLoading}
            >
              {isLoading ? 'Giris yapiliyor...' : 'Giris Yap'}
            </Button>
          </form>

          <p className="text-center text-white/40 mt-4 text-sm">
            Ilk kez giris yapiyorsaniz sifrenizi degistirmeniz onerilir.
          </p>
          <p className="text-center text-white/40 mt-6">
            Hesabiniz yok mu?{' '}
            <Link href="/auth/sign-up" className="text-white hover:underline">
              Kayit olun
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

function FloatingBall({
  size,
  color,
  top,
  left,
  right,
  bottom,
  delay
}: {
  size: number
  color: "emerald" | "cyan"
  top?: string
  left?: string
  right?: string
  bottom?: string
  delay: number
}) {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const animate = () => {
      const time = Date.now() / 1000 + delay
      setPosition({
        x: Math.sin(time * 0.5) * 30,
        y: Math.cos(time * 0.3) * 20
      })
    }

    const interval = setInterval(animate, 50)
    return () => clearInterval(interval)
  }, [delay])

  const colorMap = {
    emerald: "from-emerald-500/20 to-emerald-500/5",
    cyan: "from-cyan-500/20 to-cyan-500/5"
  }

  return (
    <div
      className={`absolute rounded-full bg-gradient-to-br ${colorMap[color]} blur-3xl`}
      style={{
        width: size,
        height: size,
        top,
        left,
        right,
        bottom,
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: 'transform 0.5s ease-out'
      }}
    />
  )
}
