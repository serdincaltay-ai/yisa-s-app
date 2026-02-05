'use client'

import { useState, useRef, useEffect } from 'react'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type Message = { role: 'user' | 'assistant'; text: string; provider?: string }

const AI_OPTIONS = ['GPT', 'Claude', 'Gemini', 'Together', 'Otomatik'] as const

export default function AssistantChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedAI, setSelectedAI] = useState<(typeof AI_OPTIONS)[number]>('Otomatik')
  const [healthStatus, setHealthStatus] = useState<Record<string, string>>({})
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/system/health')
      .then((r) => r.json())
      .then((d) => {
        const map: Record<string, string> = {}
        for (const r of d.robots ?? []) {
          map[r.name] = r.status === 'ok' ? 'ok' : 'error'
        }
        setHealthStatus(map)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    const msg = input.trim()
    if (!msg || loading) return

    setInput('')
    setMessages((prev) => [...prev, { role: 'user', text: msg }])
    setLoading(true)

    try {
      const providerMap: Record<string, string> = {
        GPT: 'GPT',
        Claude: 'CLAUDE',
        Gemini: 'GEMINI',
        Together: 'CLOUD',
        Otomatik: 'GEMINI',
      }
      const res = await fetch('/api/chat/flow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: msg,
          skip_spelling: true,
          assistant_provider: providerMap[selectedAI] ?? 'GEMINI',
        }),
      })
      const data = await res.json()

      const reply = data.text ?? data.error ?? 'Yanıt alınamadı.'
      const prov = data.ai_provider ?? data.ai_providers?.[0] ?? selectedAI
      setMessages((prev) => [...prev, { role: 'assistant', text: reply, provider: prov }])
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', text: 'Bağlantı hatası.', provider: undefined }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-xl border border-[#1e293b] bg-[#111827] overflow-hidden flex flex-col">
      <div className="px-4 py-3 border-b border-[#1e293b] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[#f8fafc]">🤖 AI Asistan</span>
          <select
            value={selectedAI}
            onChange={(e) => setSelectedAI(e.target.value as (typeof AI_OPTIONS)[number])}
            className="text-xs bg-[#0a0e17] border border-[#1e293b] rounded px-2 py-1 text-[#f8fafc]"
          >
            {AI_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt} {healthStatus[opt === 'Together' ? 'Together' : opt] === 'ok' ? '✅' : healthStatus[opt] === 'error' ? '❌' : ''}
              </option>
            ))}
          </select>
        </div>
        <span className="text-xs text-[#10b981]">✅ Aktif</span>
      </div>

      <div className="flex-1 min-h-[200px] max-h-[280px] overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <p className="text-sm text-[#94a3b8] text-center py-8">
            Merhaba Patron, mesaj yazıp gönderin.
          </p>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-xl px-4 py-2 ${
                m.role === 'user'
                  ? 'bg-[#3b82f6] text-white'
                  : 'bg-[#0a0e17] border border-[#1e293b] text-[#f8fafc]'
              }`}
            >
              {m.provider && m.role === 'assistant' && (
                <span className="text-[10px] text-[#94a3b8] block mb-1">{m.provider}</span>
              )}
              <p className="text-sm whitespace-pre-wrap">{m.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-[#0a0e17] border border-[#1e293b] rounded-xl px-4 py-2 text-sm text-[#94a3b8]">
              Yanıt yazılıyor…
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="p-4 border-t border-[#1e293b] flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
          placeholder="Mesaj yaz..."
          className="flex-1 bg-[#0a0e17] border-[#1e293b] text-[#f8fafc] placeholder:text-[#94a3b8]"
          disabled={loading}
        />
        <Button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="bg-[#10b981] hover:bg-[#059669]"
        >
          <Send size={18} className="mr-1" /> Gönder
        </Button>
      </div>
    </div>
  )
}
