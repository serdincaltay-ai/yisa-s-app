'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { canAccessDashboard } from '@/lib/auth/roles'

// Pre-calculated positions to avoid hydration mismatch
const SQUARES = [
  { w: 60, h: 80, l: 5, t: 10 }, { w: 100, h: 60, l: 85, t: 5 }, { w: 70, h: 70, l: 15, t: 75 },
  { w: 90, h: 50, l: 70, t: 80 }, { w: 55, h: 90, l: 40, t: 20 }, { w: 80, h: 65, l: 25, t: 55 },
  { w: 65, h: 85, l: 90, t: 45 }, { w: 75, h: 75, l: 60, t: 65 }, { w: 50, h: 100, l: 10, t: 35 },
  { w: 95, h: 55, l: 50, t: 90 }, { w: 85, h: 70, l: 30, t: 8 }, { w: 60, h: 95, l: 75, t: 25 },
  { w: 70, h: 60, l: 45, t: 50 }, { w: 110, h: 45, l: 20, t: 85 }, { w: 55, h: 80, l: 95, t: 70 },
]

const PARTICLES = [
  { l: 8, t: 15 }, { l: 92, t: 8 }, { l: 23, t: 78 }, { l: 67, t: 42 }, { l: 45, t: 88 },
  { l: 12, t: 55 }, { l: 78, t: 22 }, { l: 35, t: 35 }, { l: 88, t: 65 }, { l: 55, t: 12 },
  { l: 18, t: 92 }, { l: 72, t: 75 }, { l: 42, t: 5 }, { l: 95, t: 38 }, { l: 28, t: 48 },
  { l: 62, t: 95 }, { l: 5, t: 28 }, { l: 82, t: 52 }, { l: 48, t: 68 }, { l: 15, t: 5 },
]

// Animated Grid Background
function AnimatedGrid() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(245,158,11,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(245,158,11,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      
      {/* Animated Squares */}
      <div className="absolute inset-0">
        {SQUARES.map((sq, i) => (
          <div
            key={i}
            className="absolute border border-amber-500/10 rounded-lg animate-pulse"
            style={{
              width: `${sq.w}px`,
              height: `${sq.h}px`,
              left: `${sq.l}%`,
              top: `${sq.t}%`,
              animationDelay: `${i * 0.2}s`,
              animationDuration: `${3 + (i % 4)}s`,
            }}
          />
        ))}
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {PARTICLES.map((p, i) => (
          <div
            key={`p-${i}`}
            className="absolute w-1 h-1 bg-amber-500/20 rounded-full animate-float"
            style={{
              left: `${p.l}%`,
              top: `${p.t}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${5 + (i % 5)}s`,
            }}
          />
        ))}
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-transparent to-slate-950" />
    </div>
  )
}

function LoginPageContent() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const unauthorized = searchParams.get('unauthorized') === '1'

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user && canAccessDashboard(user)) router.replace('/dashboard')
    })
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError('E-posta veya şifre hatalı')
      setLoading(false)
    } else {
      const user = data?.user
      if (user && !canAccessDashboard(user)) {
        await supabase.auth.signOut()
        setError('Bu hesap panel erişimine yetkili değil. Sadece Patron, Süper Admin veya Sistem Admini.')
        setLoading(false)
      } else {
        router.push('/dashboard')
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 relative">
      {/* Animated Background */}
      <AnimatedGrid />
      
      <div className="w-full max-w-md relative z-10">
        {/* Logo - YiSA-S */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/30">
            <svg viewBox="0 0 40 40" className="w-12 h-12">
              <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="#0F172A" fontSize="28" fontWeight="bold" fontFamily="Arial">Y</text>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-wide">
            <span className="text-amber-500">Yi</span>SA-S
          </h1>
          <p className="text-slate-400 mt-1">Patron Paneli</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-white mb-6 text-center">Giriş Yap</h2>

          {unauthorized && (
            <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400 text-sm">
              Yetkisiz erişim. Panele sadece Patron, Süper Admin veya Sistem Admini girebilir.
            </div>
          )}
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm text-slate-400 mb-2">E-posta</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-amber-500 focus:outline-none"
              placeholder="patron@yisa-s.com"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm text-slate-400 mb-2">Şifre</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-amber-500 focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-slate-900 font-semibold rounded-xl hover:shadow-lg hover:shadow-amber-500/30 transition-all disabled:opacity-50"
          >
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        <p className="text-center text-slate-500 text-sm mt-6">
          © 2026 YİSA-S - Tüm hakları saklıdır
        </p>
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400">Yükleniyor...</div>}>
      <LoginPageContent />
    </Suspense>
  )
}
