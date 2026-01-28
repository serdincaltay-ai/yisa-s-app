'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { LogOut, Home, Users, Settings, BarChart3, MessageSquare, Send, Bot } from 'lucide-react'

type ChatMessage = { role: 'user' | 'assistant'; text: string }

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState('')
  const [chatSending, setChatSending] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/')
    } else {
      setUser(user)
    }
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleSendChat = async () => {
    const msg = chatInput.trim()
    if (!msg || chatSending) return
    setChatInput('')
    setChatMessages((prev) => [...prev, { role: 'user', text: msg }])
    setChatSending(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg }),
      })
      const data = await res.json()
      const text = data.error ? `Hata: ${data.error}` : (data.text ?? 'Yanıt alınamadı.')
      setChatMessages((prev) => [...prev, { role: 'assistant', text }])
    } catch {
      setChatMessages((prev) => [...prev, { role: 'assistant', text: 'Bağlantı hatası. Tekrar dene.' }])
    } finally {
      setChatSending(false)
    }
  }

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-amber-500">Yükleniyor...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 p-4">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
            <span className="text-slate-900 font-bold">Y</span>
          </div>
          <div>
            <h1 className="font-bold text-white">YİSA-S</h1>
            <p className="text-xs text-slate-500">Patron Paneli</p>
          </div>
        </div>

        {/* Menu */}
        <nav className="space-y-2">
          <a href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-500/10 text-amber-400">
            <Home size={20} />
            Ana Sayfa
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
            <Users size={20} />
            Sporcular
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
            <BarChart3 size={20} />
            Raporlar
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
            <MessageSquare size={20} />
            Mesajlar
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
            <Settings size={20} />
            Ayarlar
          </a>
        </nav>

        {/* Logout */}
        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <LogOut size={20} />
            Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Hoş Geldin, Patron! 👋</h1>
          <p className="text-slate-400">{user?.email}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <p className="text-slate-400 text-sm mb-1">Toplam Sporcu</p>
            <p className="text-3xl font-bold text-white">0</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <p className="text-slate-400 text-sm mb-1">Aktif Antrenör</p>
            <p className="text-3xl font-bold text-white">0</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <p className="text-slate-400 text-sm mb-1">Bu Ay Gelir</p>
            <p className="text-3xl font-bold text-amber-400">₺0</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <p className="text-slate-400 text-sm mb-1">Demo Talepleri</p>
            <p className="text-3xl font-bold text-emerald-400">0</p>
          </div>
        </div>

        {/* Robot Sohbet Alanı */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden flex flex-col">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-700">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Bot className="text-amber-400" size={22} />
            </div>
            <div>
              <h2 className="font-semibold text-white">YİSA-S Robot Asistan</h2>
              <p className="text-xs text-slate-500">Cursor kurulum robotu — sorularını yaz, yanıt al.</p>
            </div>
          </div>
          <div className="flex-1 min-h-[280px] max-h-[360px] overflow-y-auto p-4 space-y-4">
            {chatMessages.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                <p className="mb-1">Merhaba, ben YİSA-S asistanıyım.</p>
                <p className="text-sm">Aşağıya yazıp Enter veya Gönder ile soru sor.</p>
              </div>
            )}
            {chatMessages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    m.role === 'user'
                      ? 'bg-amber-500/20 text-amber-100'
                      : 'bg-slate-700/80 text-slate-200'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{m.text}</p>
                </div>
              </div>
            ))}
            {chatSending && (
              <div className="flex justify-start">
                <div className="bg-slate-700/80 rounded-2xl px-4 py-3 text-slate-400 text-sm">
                  Yanıt yazılıyor…
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <div className="p-4 border-t border-slate-700 flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendChat()}
              placeholder="Mesajını yaz..."
              className="flex-1 bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              disabled={chatSending}
            />
            <button
              onClick={handleSendChat}
              disabled={chatSending || !chatInput.trim()}
              className="px-5 py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 font-medium rounded-xl flex items-center gap-2 transition-colors"
            >
              <Send size={18} />
              Gönder
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
