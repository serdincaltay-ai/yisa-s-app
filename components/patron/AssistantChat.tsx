'use client'

import { useState, useRef, useEffect } from 'react'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AI_PROVIDERS } from '@/lib/patron/ai-providers'

type Message = { role: 'user' | 'assistant'; text: string; provider?: string; providerColor?: string }

const PROVIDER_TO_FLOW: Record<string, string> = {
  claude: 'CLAUDE',
  gpt: 'GPT',
  gemini: 'GEMINI',
  together: 'CLOUD',
  cursor: 'CURSOR',
  v0: 'V0',
}

export default function AssistantChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedAI, setSelectedAI] = useState<(typeof AI_PROVIDERS)[number]>(AI_PROVIDERS[0])
  const [healthStatus, setHealthStatus] = useState<Record<string, boolean>>({})
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/system/health')
      .then((r) => r.json())
      .then((d) => {
        const map: Record<string, boolean> = {}
        for (const r of d.robots ?? []) {
          map[r.name] = r.status === 'ok'
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
      const flowProvider = PROVIDER_TO_FLOW[selectedAI.id] ?? 'GEMINI'
      const body: Record<string, unknown> = {
        message: msg,
        skip_spelling: true,
        assistant_provider: flowProvider,
      }
      if (selectedAI.systemPrompt) {
        body.system_prompt = selectedAI.systemPrompt
      }

      const res = await fetch('/api/chat/flow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()

      const reply = data.text ?? data.error ?? 'Yanıt alınamadı.'
      const prov = data.ai_provider ?? data.ai_providers?.[0] ?? selectedAI.name
      const provColor = AI_PROVIDERS.find((p) => p.name === prov || p.apiKey === prov)?.color ?? selectedAI.color
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: reply, provider: prov, providerColor: provColor },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: 'Bağlantı hatası.', provider: undefined, providerColor: undefined },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-xl border border-[#1e293b] bg-[#111827] overflow-hidden flex flex-col">
      <div className="px-4 py-3 border-b border-[#1e293b] flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[#f8fafc]">🤖 AI:</span>
          <select
            value={selectedAI.id}
            onChange={(e) => {
              const p = AI_PROVIDERS.find((x) => x.id === e.target.value)
              if (p) setSelectedAI(p)
            }}
            className="text-xs bg-[#0a0e17] border border-[#1e293b] rounded px-2 py-1.5 text-[#f8fafc] min-w-[120px]"
            style={{ borderLeftColor: selectedAI.color, borderLeftWidth: 3 }}
          >
            {AI_PROVIDERS.map((p) => {
              const health = p.apiKey === 'CLOUD' ? healthStatus['Together'] : healthStatus[p.apiKey]
              return (
                <option key={p.id} value={p.id}>
                  {p.name} {health ? '✅' : health === false ? '❌' : ''}
                </option>
              )
            })}
          </select>
        </div>
        <span className="text-xs text-[#10b981]">✅ Aktif</span>
      </div>

      <div className="px-4 py-2 border-b border-[#1e293b] bg-[#0a0e17]/50">
        <p className="text-xs text-[#94a3b8]">
          {selectedAI.name} ile sohbet ediyorsunuz — {selectedAI.role}
        </p>
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
                  ? 'bg-[#1e293b] text-[#f8fafc] border border-[#334155]'
                  : 'bg-[#0a0e17] border text-[#f8fafc]'
              }`}
              style={
                m.role === 'assistant' && m.providerColor
                  ? { borderLeftWidth: 4, borderLeftColor: m.providerColor }
                  : m.role === 'assistant'
                    ? { borderLeftWidth: 4, borderLeftColor: '#1e293b' }
                    : undefined
              }
            >
              {m.provider && m.role === 'assistant' && (
                <div className="flex items-center gap-1.5 mb-1">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: m.providerColor ?? '#94a3b8' }}
                  />
                  <span className="text-[10px] text-[#94a3b8]">{m.provider}</span>
                </div>
              )}
              <p className="text-sm whitespace-pre-wrap">{m.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div
              className="bg-[#0a0e17] border border-[#1e293b] rounded-xl px-4 py-2 text-sm text-[#94a3b8]"
              style={{ borderLeftWidth: 4, borderLeftColor: selectedAI.color }}
            >
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
          <Send size={18} className="mr-1" /> Gönder 🚀
        </Button>
      </div>
    </div>
  )
}
