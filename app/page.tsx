'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function LoginPage() {
  const [email, setEmail] = useState('')

@@ -16,7 +21,7 @@ export default function LoginPage() {
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

@@ -25,14 +30,15 @@ export default function LoginPage() {
      setError('E-posta veya şifre hatalı')
      setLoading(false)
    } else {
      router.push('/dashboard')
      // Cookie'ye token kaydet
      document.cookie = `sb-access-token=${data.session?.access_token}; path=/; max-age=604800`
      router.push('/panel/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mx-auto mb-4">
            <span className="text-slate-900 font-bold text-2xl">Y</span>

@@ -41,7 +47,6 @@ export default function LoginPage() {
          <p className="text-slate-400">Patron Paneli</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-white mb-6 text-center">Giriş Yap</h2>


@@ -59,7 +64,6 @@ export default function LoginPage() {
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-amber-500 focus:outline-none"
              placeholder="patron@yisa-s.com"
            />
          </div>


@@ -71,24 +75,23 @@
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
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-slate-900 font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
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
