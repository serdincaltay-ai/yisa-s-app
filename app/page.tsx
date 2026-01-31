'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { canAccessDashboard } from '@/lib/auth/roles'

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
        setError('Bu hesap panel erişimine yetkili değil.')
        setLoading(false)
      } else {
        router.push('/dashboard')
      }
    }
  }

  return (
    <div className="min-h-svh flex flex-col justify-between relative overflow-hidden">
      {/* Zeminden metalik parlayan lacivert arka plan */}
      <div className="absolute inset-0 bg-[#060914]" aria-hidden />
      <div
        className="absolute inset-0 opacity-100"
        style={{
          background: `
            radial-gradient(ellipse 120% 80% at 50% 100%, 
              rgba(59, 130, 246, 0.15) 0%, 
              rgba(30, 58, 138, 0.25) 20%,
              rgba(15, 23, 42, 0.4) 40%,
              rgba(6, 9, 20, 0.9) 70%,
              #030508 100%),
            linear-gradient(180deg, 
              transparent 0%, 
              rgba(100, 116, 139, 0.03) 50%,
              transparent 100%)
          `,
        }}
        aria-hidden
      />
      {/* Metalik parıltı animasyonu */}
      <div
        className="absolute inset-0 opacity-40 animate-shimmer"
        style={{
          background: `
            linear-gradient(105deg,
              transparent 0%,
              transparent 40%,
              rgba(148, 163, 184, 0.08) 45%,
              rgba(203, 213, 225, 0.12) 50%,
              rgba(148, 163, 184, 0.08) 55%,
              transparent 60%,
              transparent 100%
            )
          `,
          backgroundSize: '200% 100%',
        }}
        aria-hidden
      />
      {/* Zeminden yükselen metalik ışık */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[60%] opacity-30"
        style={{
          background: `
            radial-gradient(ellipse 100% 60% at 50% 120%,
              rgba(96, 165, 250, 0.2) 0%,
              rgba(59, 130, 246, 0.08) 15%,
              rgba(30, 64, 175, 0.04) 30%,
              transparent 60%
            )
          `,
        }}
        aria-hidden
      />
      {/* Alt metalik çizgi */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px opacity-60"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(148, 163, 184, 0.5), rgba(203, 213, 225, 0.6), rgba(148, 163, 184, 0.5), transparent)',
        }}
        aria-hidden
      />

      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          {/* Pill - BETA */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/40 border border-slate-600/50 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_2px_rgba(96,165,250,0.5)]" />
              <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">Patron Girişi</span>
            </div>
          </div>

          {/* Başlık */}
          <div className="text-center mb-10">
            <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
              YİSA-S
            </h1>
            <p className="text-slate-400/80 text-sm mt-3 font-mono">
              Komuta Merkezi
            </p>
          </div>

          {/* Giriş formu - cam efekti */}
          <form
            onSubmit={handleLogin}
            className="relative rounded-2xl p-8 overflow-hidden"
            style={{
              background: 'rgba(15, 23, 42, 0.5)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(71, 85, 105, 0.3)',
              boxShadow: 'inset 0 1px 0 0 rgba(148, 163, 184, 0.05), 0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            }}
          >
            {/* Form üst metalik parıltı */}
            <div
              className="absolute top-0 left-0 right-0 h-px opacity-70"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(203, 213, 225, 0.3), rgba(148, 163, 184, 0.4), rgba(203, 213, 225, 0.3), transparent)',
              }}
            />

            <h2 className="text-lg font-semibold text-white mb-6 text-center">Giriş Yap</h2>

            {unauthorized && (
              <div className="mb-4 p-3 rounded-lg text-sm border border-amber-500/30 bg-amber-500/10 text-amber-400">
                Yetkisiz erişim. Sadece Patron veya yetkili kullanıcılar girebilir.
              </div>
            )}
            {error && (
              <div className="mb-4 p-3 rounded-lg text-sm border border-red-500/30 bg-red-500/10 text-red-400">
                {error}
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label className="block text-sm text-slate-400 mb-2">E-posta</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="patron@yisa-s.com"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">Şifre</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl font-semibold text-white uppercase tracking-wider text-sm transition-all duration-300 disabled:opacity-50 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                style={{
                  background: 'linear-gradient(135deg, #1e3a5f 0%, #1e40af 50%, #1e3a8a 100%)',
                  border: '1px solid rgba(96, 165, 250, 0.3)',
                  boxShadow: 'inset 0 1px 0 0 rgba(148, 163, 184, 0.15), 0 4px 14px 0 rgba(30, 64, 175, 0.4)',
                }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Giriş yapılıyor...
                  </span>
                ) : (
                  'Giriş Yap'
                )}
              </button>
            </div>
          </form>

          <p className="text-center text-slate-500 text-xs mt-8 font-mono">
            © 2026 YİSA-S
          </p>
        </div>
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-svh flex items-center justify-center bg-[#060914]">
        <div className="w-8 h-8 border-2 border-slate-600 border-t-blue-500 rounded-full animate-spin" />
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  )
}
