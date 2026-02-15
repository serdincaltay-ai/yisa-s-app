'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Activity } from 'lucide-react'

export default function VeliGirisPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('veli-demo-logged-in', '1')
    }
    router.push('/veli/dashboard')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#2563eb] text-white mb-4">
            <Activity className="h-10 w-10" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">YİSA-S</h1>
          <p className="text-sm text-gray-600 mt-1">Veli Girişi</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-gray-700">E-posta</Label>
            <Input
              id="email"
              type="email"
              placeholder="ornek@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 bg-white border-gray-300 text-gray-900"
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-gray-700">Şifre</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 bg-white border-gray-300 text-gray-900"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white min-h-[44px]"
          >
            Giriş Yap
          </Button>
        </form>
        <p className="text-xs text-center text-gray-500">
          Demo: Herhangi bir e-posta ve şifre ile giriş yapabilirsiniz.
        </p>
      </div>
    </div>
  )
}
