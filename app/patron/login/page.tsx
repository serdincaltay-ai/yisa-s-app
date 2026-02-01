"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AnimatedOrbs } from "@/components/animated-orbs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Lock, User } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { canAccessDashboard } from "@/lib/auth/roles"

function PatronLoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const unauthorized = searchParams.get("unauthorized") === "1"
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user && canAccessDashboard(user)) router.replace("/dashboard")
    })
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    const email = formData.username.trim().includes("@") ? formData.username.trim() : `${formData.username.trim()}@yisa-s.com`
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: formData.password,
    })
    if (signInError) {
      setError("E-posta veya şifre hatalı.")
      setIsLoading(false)
      return
    }
    const user = data?.user
    if (user && !canAccessDashboard(user)) {
      await supabase.auth.signOut()
      setError("Bu hesap panel erişimine yetkili değil.")
      setIsLoading(false)
      return
    }
    router.push("/dashboard")
    setIsLoading(false)
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Animated Background */}
      <AnimatedOrbs />
      
      {/* Glass Login Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="backdrop-blur-xl bg-card/40 border border-border/50 rounded-2xl p-8 shadow-2xl">
          {/* Logo / Brand */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <span className="text-2xl font-bold text-primary">Y</span>
            </div>
            <h1 className="text-2xl font-semibold text-foreground">
              YiSA-S
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Patron Girisi
            </p>
          </div>

          {unauthorized && (
            <div className="mb-4 p-3 rounded-lg text-sm border border-amber-500/30 bg-amber-500/10 text-amber-400">
              Yetkisiz erişim. Sadece yetkili kullanıcılar girebilir.
            </div>
          )}
          {error && (
            <div className="mb-4 p-3 rounded-lg text-sm border border-red-500/30 bg-red-500/10 text-red-400">
              {error}
            </div>
          )}
          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm text-muted-foreground">
                E-posta
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="username"
                  type="email"
                  placeholder="patron@yisa-s.com"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="pl-10 h-12 bg-secondary/50 border-border/50 focus:border-primary/50 focus:ring-primary/20"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm text-muted-foreground">
                Sifre
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10 pr-10 h-12 bg-secondary/50 border-border/50 focus:border-primary/50 focus:ring-primary/20"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-200"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Giris Yapiliyor...
                </div>
              ) : (
                "Giris Yap"
              )}
            </Button>
          </form>

          {/* Footer */}
          <p className="text-center text-xs text-muted-foreground mt-6">
            YiSA-S Spor Tesisleri Yonetim Sistemi
          </p>
        </div>
      </div>
    </div>
  )
}

export default function PatronLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    }>
      <PatronLoginContent />
    </Suspense>
  )
}
