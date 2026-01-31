'use client'

import { useState, useEffect, Suspense, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { canAccessDashboard } from '@/lib/auth/roles'

// 3D Voxel Background Component
function VoxelBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let time = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Voxel grid settings
    const gridSize = 20
    const cubeSize = 30
    const spacing = 50

    interface Cube {
      x: number
      y: number
      z: number
      phase: number
    }

    const cubes: Cube[] = []
    for (let x = -gridSize; x < gridSize; x++) {
      for (let z = -gridSize; z < gridSize; z++) {
        cubes.push({
          x: x * spacing,
          y: 0,
          z: z * spacing,
          phase: Math.sqrt(x * x + z * z) * 0.3,
        })
      }
    }

    const project = (x: number, y: number, z: number) => {
      const perspective = 800
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2 + 200
      const scale = perspective / (perspective + z + 500)
      return {
        x: centerX + x * scale,
        y: centerY + y * scale,
        scale,
      }
    }

    const drawCube = (x: number, y: number, z: number, size: number, alpha: number) => {
      const half = size / 2
      
      // Front face
      const p1 = project(x - half, y - half, z + half)
      const p2 = project(x + half, y - half, z + half)
      const p3 = project(x + half, y + half, z + half)
      const p4 = project(x - half, y + half, z + half)

      // Top face
      const p5 = project(x - half, y - half, z - half)
      const p6 = project(x + half, y - half, z - half)

      // Draw top face
      ctx.beginPath()
      ctx.moveTo(p1.x, p1.y)
      ctx.lineTo(p2.x, p2.y)
      ctx.lineTo(p6.x, p6.y)
      ctx.lineTo(p5.x, p5.y)
      ctx.closePath()
      ctx.fillStyle = `rgba(245, 158, 11, ${alpha * 0.6})`
      ctx.fill()

      // Draw front face
      ctx.beginPath()
      ctx.moveTo(p1.x, p1.y)
      ctx.lineTo(p2.x, p2.y)
      ctx.lineTo(p3.x, p3.y)
      ctx.lineTo(p4.x, p4.y)
      ctx.closePath()
      ctx.fillStyle = `rgba(245, 158, 11, ${alpha * 0.4})`
      ctx.fill()

      // Draw right face
      ctx.beginPath()
      ctx.moveTo(p2.x, p2.y)
      ctx.lineTo(p6.x, p6.y)
      const p7 = project(x + half, y + half, z - half)
      ctx.lineTo(p7.x, p7.y)
      ctx.lineTo(p3.x, p3.y)
      ctx.closePath()
      ctx.fillStyle = `rgba(245, 158, 11, ${alpha * 0.3})`
      ctx.fill()
    }

    const animate = () => {
      ctx.fillStyle = '#020617'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      time += 0.02

      // Sort cubes by z for proper rendering
      const sortedCubes = [...cubes].sort((a, b) => b.z - a.z)

      for (const cube of sortedCubes) {
        const wave = Math.sin(time + cube.phase) * 50
        const y = cube.y + wave - 100
        const distance = Math.sqrt(cube.x * cube.x + cube.z * cube.z)
        const alpha = Math.max(0.05, 0.3 - distance / 1500)
        
        if (cube.z + 500 > 0 && alpha > 0.01) {
          drawCube(cube.x, y, cube.z, cubeSize * (1 + Math.sin(time + cube.phase) * 0.2), alpha)
        }
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
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
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 relative overflow-hidden">
      {/* 3D Voxel Background */}
      <VoxelBackground />
      
      {/* Gradient Overlay */}
      <div className="fixed inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent pointer-events-none" style={{ zIndex: 1 }} />
      
      <div className="w-full max-w-md relative" style={{ zIndex: 10 }}>
        {/* Logo - YiSA-S */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-amber-500/40 border border-amber-400/20">
            <span className="text-slate-900 font-black text-5xl">Y</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-wider">
            <span className="text-amber-500">Yi</span>SA-S
          </h1>
          <p className="text-slate-400 mt-2 text-lg">Patron Paneli</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-6 text-center">Giriş Yap</h2>

          {unauthorized && (
            <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400 text-sm">
              Yetkisiz erişim. Panele sadece Patron, Süper Admin veya Sistem Admini girebilir.
            </div>
          )}
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
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
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
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
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-slate-900 font-bold rounded-xl hover:shadow-xl hover:shadow-amber-500/40 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        <p className="text-center text-slate-500 text-sm mt-8">
          © 2026 YİSA-S - Tüm hakları saklıdır
        </p>
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center animate-pulse">
          <span className="text-slate-900 font-black text-5xl">Y</span>
        </div>
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  )
}
