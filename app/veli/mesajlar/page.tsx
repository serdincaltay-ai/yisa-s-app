'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
        if (selectedThreadId) fetch(`/api/veli/messages?thread_id=${encodeURIComponent(selectedThreadId)}`).then((r) => r.json()).then((d) => setMessages(Array.isArray(d?.messages) ? d.messages : []))
      }
    } catch {
      // ignore
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col pb-24">
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
        <div className="flex h-14 items-center gap-2 px-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/veli/dashboard"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <h1 className="font-bold text-gray-900">Mesajlaşma</h1>
        </div>
      </header>

      <main className="flex-1 p-4 flex flex-col">
        <p className="text-sm text-gray-600 mb-4">Antrenör ile iletişim — çocuğunuzun antrenörüyle mesajlaşın.</p>

        {loading && !selectedThreadId ? (
          <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-[#2563eb]" /></div>
        ) : selectedThreadId ? (
          <>
            <div className="flex justify-between items-center mb-2">
              <Button variant="ghost" size="sm" onClick={() => setSelectedThreadId(null)}>← Konuşma listesi</Button>
            </div>
            <Card className="flex-1 flex flex-col border-gray-200 min-h-[200px]">
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-8">Henüz mesaj yok. Aşağıdan yazıp gönderin (mesaj kaydı ileride aktif olacak).</p>
                ) : (
                  messages.map((m) => (
                    <div key={m.id} className={`flex ${m.from_veli ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${m.from_veli ? 'bg-[#2563eb] text-white' : 'bg-gray-100 text-gray-900'}`}>
                        {m.body}
                        <p className="text-xs opacity-80 mt-1">{new Date(m.created_at).toLocaleString('tr-TR')}</p>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
              <div className="p-3 border-t flex gap-2">
                <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Mesajınız..." onKeyDown={(e) => e.key === 'Enter' && handleSend()} />
                <Button onClick={handleSend} disabled={sending || !input.trim()}>
                  {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
            </Card>
          </>
        ) : (
          <Card className="border-gray-200">
            <CardHeader>
              <MessageSquare className="h-8 w-8 text-[#2563eb]" />
              <CardTitle>Antrenör ile iletişim</CardTitle>
              <CardDescription>Çocuğunuzun antrenörüyle mesajlaşın. Konuşma listesi ileride veli–antrenör eşleşmesine göre doldurulacak.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {threads.length === 0 ? (
                <p className="text-sm text-gray-600">Henüz konuşma yok. Tesis tarafından antrenör atandığında veya siz ilk mesajı gönderdiğinizde burada görünecek.</p>
              ) : (
                <ul className="space-y-2">
                  {threads.map((t) => (
                    <li key={t.id}>
                      <button type="button" onClick={() => setSelectedThreadId(t.id)} className="w-full text-left rounded-lg border p-3 hover:bg-gray-50">
                        <p className="font-medium">{t.title}</p>
                        {t.last_at && <p className="text-xs text-gray-500">{new Date(t.last_at).toLocaleDateString('tr-TR')}</p>}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <p className="text-xs text-gray-500">Mesajlaşma modülü: Konuşma ve mesaj kayıtları ileride veritabanı tabloları ile bağlanacak.</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
