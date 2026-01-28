'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { startTaskFlow, FLOW_DESCRIPTION } from '@/lib/assistant/task-flow'
import { Send, Bot, Check, X, Edit3, ChevronDown, ChevronUp } from 'lucide-react'

type ChatMessage = {
  role: 'user' | 'assistant'
  text: string
  assignedAI?: string
  taskType?: string
}

type PatronDecision = 'approve' | 'reject' | 'modify'

export default function DashboardPage() {
  const [user, setUser] = useState<{ email?: string } | null>(null)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState('')
  const [chatSending, setChatSending] = useState(false)
  const [lockError, setLockError] = useState<string | null>(null)
  const [decisions, setDecisions] = useState<Record<number, PatronDecision>>({})
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editText, setEditText] = useState('')
  const [showFlow, setShowFlow] = useState(false)
  const [stats, setStats] = useState({
    athletes: 0,
    coaches: 0,
    revenueMonth: 0,
    demoRequests: 0,
  })
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user ?? null))
  }, [])

  useEffect(() => {
    fetch('/api/stats')
      .then((r) => r.json())
      .then((d) =>
        setStats({
          athletes: Number(d?.athletes) || 0,
          coaches: Number(d?.coaches) || 0,
          revenueMonth: Number(d?.revenueMonth) || 0,
          demoRequests: Number(d?.demoRequests) || 0,
        })
      )
      .catch(() => {})
  }, [])

  const handleSendChat = async () => {
    const msg = chatInput.trim()
    if (!msg || chatSending) return

    setLockError(null)
    const flow = startTaskFlow(msg)

    if (!flow.lockCheck?.allowed) {
      setLockError(flow.output ?? 'Bu işlem AI için yasaktır.')
      return
    }

    setChatInput('')
    setChatMessages((prev) => [...prev, { role: 'user', text: msg }])
    setChatSending(true)

    const taskType = flow.routerResult?.taskType ?? 'unknown'
    const assignedAI = flow.routerResult?.assignedAI ?? 'GPT'

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: msg,
          taskType,
          assignedAI,
        }),
      })
      const data = await res.json()
      const text = data.error ? `Hata: ${data.error}` : (data.text ?? 'Yanıt alınamadı.')
      const ai = data.assignedAI ?? assignedAI
      const tt = data.taskType ?? taskType
      setChatMessages((prev) => [
        ...prev,
        { role: 'assistant', text, assignedAI: ai, taskType: tt },
      ])
    } catch {
      setChatMessages((prev) => [
        ...prev,
        { role: 'assistant', text: 'Bağlantı hatası. Tekrar dene.', assignedAI: 'CLAUDE', taskType: 'unknown' },
      ])
    } finally {
      setChatSending(false)
    }
  }

  const handlePatronDecision = (index: number, decision: PatronDecision) => {
    setDecisions((prev) => ({ ...prev, [index]: decision }))
    if (decision === 'modify') {
      const m = chatMessages[index]
      setEditText(m?.text ?? '')
      setEditingIndex(index)
    } else {
      setEditingIndex(null)
    }
  }

  const handleSaveEdit = () => {
    if (editingIndex == null) return
    setChatMessages((prev) => {
      const next = [...prev]
      const m = next[editingIndex]
      if (m && m.role === 'assistant') {
        next[editingIndex] = { ...m, text: editText }
      }
      return next
    })
    setDecisions((prev) => ({ ...prev, [editingIndex]: 'modify' }))
    setEditingIndex(null)
  }

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Hoş Geldin, Patron! 👋</h1>
        <p className="text-slate-400">{user?.email ?? '—'}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <p className="text-slate-400 text-sm mb-1">Toplam Sporcu</p>
          <p className="text-3xl font-bold text-white">{stats.athletes}</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <p className="text-slate-400 text-sm mb-1">Aktif Antrenör</p>
          <p className="text-3xl font-bold text-white">{stats.coaches}</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <p className="text-slate-400 text-sm mb-1">Bu Ay Gelir</p>
          <p className="text-3xl font-bold text-amber-400">₺{stats.revenueMonth.toLocaleString('tr-TR')}</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <p className="text-slate-400 text-sm mb-1">Demo Talepleri</p>
          <p className="text-3xl font-bold text-emerald-400">{stats.demoRequests}</p>
        </div>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden flex flex-col">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-700">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
            <Bot className="text-amber-400" size={22} />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-white">YİSA-S Robot Asistan</h2>
            <p className="text-xs text-slate-500">Router + Task Flow + Patron Lock — Onayla / Reddet / Değiştir</p>
          </div>
          <button
            type="button"
            onClick={() => setShowFlow((s) => !s)}
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm text-slate-400 hover:bg-slate-700/50 hover:text-white transition-colors"
          >
            İş akışı nasıl?
            {showFlow ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
        {showFlow && (
          <div className="px-6 py-4 border-b border-slate-700 bg-slate-900/50">
            <pre className="text-xs text-slate-300 whitespace-pre-wrap font-mono overflow-x-auto">
              {FLOW_DESCRIPTION}
            </pre>
          </div>
        )}
        <div className="flex-1 min-h-[280px] max-h-[360px] overflow-y-auto p-4 space-y-4">
          {chatMessages.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              <p className="mb-1">Merhaba, ben YİSA-S asistanıyım.</p>
              <p className="text-sm">Aşağıya yazıp Enter veya Gönder ile soru sor. Yasak komutlar engellenecektir.</p>
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
                } ${
                  m.role === 'assistant' && decisions[i] === 'approve'
                    ? 'ring-2 ring-emerald-500/50'
                    : ''
                } ${
                  m.role === 'assistant' && decisions[i] === 'reject'
                    ? 'opacity-60 ring-2 ring-red-500/30'
                    : ''
                }`}
              >
                {m.role === 'assistant' && (m.assignedAI || m.taskType) && (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400">
                      {m.assignedAI ?? 'CLAUDE'}
                    </span>
                    {m.taskType && m.taskType !== 'unknown' && (
                      <span className="text-[10px] text-slate-500">{m.taskType}</span>
                    )}
                  </div>
                )}
                {editingIndex === i && m.role === 'assistant' ? (
                  <div className="space-y-2">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      rows={4}
                      className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-amber-500/50 focus:outline-none"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleSaveEdit}
                        className="px-3 py-1.5 text-sm bg-amber-500 hover:bg-amber-400 text-slate-900 rounded-lg font-medium"
                      >
                        Kaydet
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingIndex(null)
                          if (editingIndex != null) {
                            setDecisions((prev) => {
                              const n = { ...prev }
                              delete n[editingIndex]
                              return n
                            })
                          }
                        }}
                        className="px-3 py-1.5 text-sm bg-slate-600 hover:bg-slate-500 text-slate-200 rounded-lg"
                      >
                        İptal
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm whitespace-pre-wrap">{m.text}</p>
                )}
                {m.role === 'assistant' && editingIndex !== i && (
                  <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-600/50">
                    <button
                      type="button"
                      onClick={() => handlePatronDecision(i, 'approve')}
                      className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                        decisions[i] === 'approve'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-slate-600/50 text-slate-400 hover:bg-slate-600 hover:text-white'
                      }`}
                    >
                      <Check size={12} />
                      Onayla
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePatronDecision(i, 'reject')}
                      className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                        decisions[i] === 'reject'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-slate-600/50 text-slate-400 hover:bg-slate-600 hover:text-white'
                      }`}
                    >
                      <X size={12} />
                      Reddet
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePatronDecision(i, 'modify')}
                      className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                        decisions[i] === 'modify'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-slate-600/50 text-slate-400 hover:bg-slate-600 hover:text-white'
                      }`}
                    >
                      <Edit3 size={12} />
                      Değiştir
                    </button>
                  </div>
                )}
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
        {lockError && (
          <div className="mx-4 mb-2 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex justify-between items-center">
            <span>{lockError}</span>
            <button
              type="button"
              onClick={() => setLockError(null)}
              className="text-red-400 hover:text-red-300"
            >
              ×
            </button>
          </div>
        )}
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
    </div>
  )
}
