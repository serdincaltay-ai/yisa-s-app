'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { PanelHeader } from '@/components/PanelHeader'
import { VeliBottomNav } from '@/components/PanelBottomNav'
import { ArrowLeft, MessageSquare, Send, Loader2 } from 'lucide-react'

type Thread = { id: string; title: string; last_at?: string }
type Message = { id: string; body: string; from_veli: boolean; created_at: string }

export default function VeliMesajlarPage() {
  const [threads, setThreads] = useState<Thread[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    fetch('/api/veli/messages')
      .then((r) => r.json())
      .then((d) => {
        setThreads(Array.isArray(d?.threads) ? d.threads : [])
        setMessages(Array.isArray(d?.messages) ? d.messages : [])
      })
      .catch(() => setThreads([]))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!selectedThreadId) return
    setLoading(true)
    fetch(`/api/veli/messages?thread_id=${encodeURIComponent(selectedThreadId)}`)
      .then((r) => r.json())
      .then((d) => setMessages(Array.isArray(d?.messages) ? d.messages : []))
      .catch(() => setMessages([]))
      .finally(() => setLoading(false))
  }, [selectedThreadId])

  const handleSend = async () => {
    if (!input.trim() || sending) return
    setSending(true)
    try {
      const res = await fetch('/api/veli/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ thread_id: selectedThreadId, message: input.trim() }),
      })
      const data = await res.json()
      if (data?.ok) {
        setInput('')
        if (selectedThreadId) {
          fetch(`/api/veli/messages?thread_id=${encodeURIComponent(selectedThreadId)}`)
            .then((r) => r.json())
            .then((d) => setMessages(Array.isArray(d?.messages) ? d.messages : []))
        }
      }
    } catch {
      // ignore
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 pb-20">
      <PanelHeader panelName="VELİ PANELİ" />

      <main className="p-4 space-y-4">
        <div className="flex items-center gap-2">
          <Link href="/veli/dashboard" className="text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5" strokeWidth={1.5} />
          </Link>
          <h1 className="text-xl font-bold text-white">Mesajlaşma</h1>
        </div>

        <p className="text-sm text-zinc-400">Antrenör ile iletişim — çocuğunuzun antrenörüyle mesajlaşın.</p>

        {loading && !selectedThreadId ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
          </div>
        ) : selectedThreadId ? (
          <>
            <button
              onClick={() => setSelectedThreadId(null)}
              className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              ← Konuşma listesi
            </button>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col min-h-[300px]">
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                  <p className="text-sm text-zinc-500 text-center py-8">Henüz mesaj yok.</p>
                ) : (
                  messages.map((m) => (
                    <div key={m.id} className={`flex ${m.from_veli ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                        m.from_veli
                          ? 'bg-cyan-400/20 text-cyan-100 border border-cyan-400/20'
                          : 'bg-zinc-800 text-zinc-200 border border-zinc-700'
                      }`}>
                        {m.body}
                        <p className="text-[10px] opacity-60 mt-1">{new Date(m.created_at).toLocaleString('tr-TR')}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="p-3 border-t border-zinc-800 flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Mesajınız..."
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  className="flex-1 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-white text-sm placeholder:text-zinc-500 focus:border-cyan-400 focus:outline-none"
                />
                <button
                  onClick={handleSend}
                  disabled={sending || !input.trim()}
                  className="rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 px-4 py-2.5 text-zinc-950 disabled:opacity-50"
                >
                  {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <MessageSquare className="h-8 w-8 text-cyan-400 mb-3" strokeWidth={1.5} />
            <h3 className="font-semibold text-white mb-1">Antrenör ile iletişim</h3>
            <p className="text-sm text-zinc-400 mb-4">Çocuğunuzun antrenörüyle mesajlaşın.</p>
            {threads.length === 0 ? (
              <p className="text-sm text-zinc-500">Henüz konuşma yok. Tesis tarafından antrenör atandığında burada görünecek.</p>
            ) : (
              <div className="space-y-2">
                {threads.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedThreadId(t.id)}
                    className="w-full text-left rounded-xl border border-zinc-700 p-3 hover:border-cyan-400/30 transition-all"
                  >
                    <p className="font-medium text-white">{t.title}</p>
                    {t.last_at && <p className="text-xs text-zinc-500">{new Date(t.last_at).toLocaleDateString('tr-TR')}</p>}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <VeliBottomNav />
    </div>
  )
}
