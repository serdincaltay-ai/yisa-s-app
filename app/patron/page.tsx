"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import {
  Brain, Target, Users, Building2, TrendingUp,
  Sparkles, Bot, Globe, Shield, Bell, Send,
  CheckCircle2, XCircle, Eye, ArrowRight, Activity,
  RefreshCw
} from "lucide-react"
import PatronCommandPanel from "@/components/PatronCommandPanel"

/* ─── TIPLER ─── */
type AIStatus = { ok: boolean; ms?: number; error?: string; text?: string }
type HealthData = { ok: number; total: number; results: Record<string, AIStatus> }
type PendingItem = { id: string; command: string; title: string; director_key?: string; output_payload?: { displayText?: string; denetim?: { puan: number; notlar: string[] } }; created_at: string }
type ChatMsg = { role: 'patron' | 'ai'; text: string; provider?: string }

/* ─── ROBOT DURUM KARTI ─── */
function RobotCard({ name, status }: { name: string; status: AIStatus }) {
  const color = status.ok ? '#10b981' : '#ef4444'
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: '#111827', border: '1px solid #1e293b' }}>
      <div className="w-2.5 h-2.5 rounded-full" style={{ background: color, boxShadow: status.ok ? `0 0 8px ${color}` : 'none' }} />
      <span className="text-xs font-medium" style={{ color: '#f8fafc' }}>{name}</span>
      {status.ok && status.ms && <span className="text-[10px] ml-auto" style={{ color: '#94a3b8' }}>{status.ms}ms</span>}
    </div>
  )
}

/* ─── ONAY KARTI ─── */
function OnayCard({ item, onApprove, onReject }: { item: PendingItem; onApprove: () => void; onReject: () => void }) {
  const [showDetail, setShowDetail] = useState(false)
  return (
    <div className="p-4 rounded-xl" style={{ background: '#111827', border: '1px solid #1e293b' }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs px-2 py-0.5 rounded font-medium" style={{ background: '#10b981', color: '#fff' }}>{item.director_key || 'CELF'}</span>
        <span className="text-[10px]" style={{ color: '#94a3b8' }}>{new Date(item.created_at).toLocaleString('tr-TR')}</span>
      </div>
      <p className="text-sm font-medium mb-2" style={{ color: '#f8fafc' }}>{item.title || item.command?.slice(0, 100)}</p>
      {item.output_payload?.denetim && (
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: '#3b82f6', color: '#fff' }}>Denetim: {item.output_payload.denetim.puan}/100</span>
        </div>
      )}
      {showDetail && item.output_payload?.displayText && (
        <div className="p-3 rounded-lg mb-2 text-xs" style={{ background: '#0a0e17', color: '#94a3b8', maxHeight: 200, overflow: 'auto' }}>
          {item.output_payload.displayText}
        </div>
      )}
      <div className="flex gap-2">
        <button onClick={() => setShowDetail(!showDetail)} className="p-1.5 rounded-lg transition" style={{ background: '#3b82f620' }}><Eye className="w-4 h-4" style={{ color: '#3b82f6' }} /></button>
        <button onClick={onApprove} className="p-1.5 rounded-lg transition" style={{ background: '#10b98120' }}><CheckCircle2 className="w-4 h-4" style={{ color: '#10b981' }} /></button>
        <button onClick={onReject} className="p-1.5 rounded-lg transition" style={{ background: '#ef444420' }}><XCircle className="w-4 h-4" style={{ color: '#ef4444' }} /></button>
      </div>
    </div>
  )
}

/* ─── ANA SAYFA ─── */
export default function PatronPanel() {
  const [health, setHealth] = useState<HealthData | null>(null)
  const [pending, setPending] = useState<PendingItem[]>([])
  const [chatMsgs, setChatMsgs] = useState<ChatMsg[]>([])
  const [chatInput, setChatInput] = useState('')
  const [chatProvider, setChatProvider] = useState('GEMINI')
  const [chatLoading, setChatLoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Health check - 60 saniyede bir
  useEffect(() => {
    const fetchHealth = () => fetch('/api/test/ai').then(r => r.json()).then(setHealth).catch(() => {})
    fetchHealth()
    const i = setInterval(fetchHealth, 60000)
    return () => clearInterval(i)
  }, [])

  // Pending komutlar
  useEffect(() => {
    const fetchPending = () =>
      fetch('/api/patron/pending').then(r => r.ok ? r.json() : []).then(d => setPending(Array.isArray(d) ? d : d.items || [])).catch(() => {})
    fetchPending()
    const i = setInterval(fetchPending, 15000)
    return () => clearInterval(i)
  }, [])

  // Chat scroll
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [chatMsgs])

  // Onayla/Reddet
  async function handleDecision(id: string, decision: string) {
    try {
      await fetch('/api/patron/approve', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command_id: id, decision }) })
      setPending(prev => prev.filter(p => p.id !== id))
    } catch { /* */ }
  }

  // Chat gönder
  async function sendChat() {
    if (!chatInput.trim() || chatLoading) return
    const msg = chatInput.trim()
    setChatInput('')
    setChatMsgs(prev => [...prev, { role: 'patron', text: msg }])
    setChatLoading(true)
    try {
      const res = await fetch('/api/chat/flow', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: msg, provider: chatProvider, skip_spelling: true }) })
      const data = await res.json()
      setChatMsgs(prev => [...prev, { role: 'ai', text: data.text || data.reply || data.error || 'Yanıt alınamadı', provider: data.provider || chatProvider }])
    } catch {
      setChatMsgs(prev => [...prev, { role: 'ai', text: 'Bağlantı hatası' }])
    }
    setChatLoading(false)
  }

  const aiNames = ['Gemini', 'Claude', 'GPT', 'V0', 'Together']

  return (
    <div className="min-h-screen" style={{ background: '#0a0e17', color: '#f8fafc' }}>
      {/* HEADER */}
      <header className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #1e293b' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-lg" style={{ background: '#f97316', color: '#fff' }}>Y</div>
          <div>
            <span className="font-bold">YİSA-S</span>
            <p className="text-[10px]" style={{ color: '#94a3b8' }}>Patron Kontrol Merkezi</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: '#10b98130', color: '#10b981', border: '1px solid #10b98150' }}>
            Dashboard <ArrowRight className="w-3 h-3" />
          </Link>
          <div className="relative">
            <Bell className="w-5 h-5" style={{ color: '#94a3b8' }} />
            {pending.length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] flex items-center justify-center" style={{ background: '#ef4444', color: '#fff' }}>{pending.length}</span>}
          </div>
        </div>
      </header>

      <div className="flex">
        {/* SOL SIDEBAR */}
        <aside className="w-56 min-h-[calc(100vh-65px)] p-4 flex flex-col gap-1" style={{ background: '#0f172a', borderRight: '1px solid #1e293b' }}>
          {[
            { icon: Activity, label: 'Genel Bakış', href: '/patron', active: true },
            { icon: Bot, label: 'CELF Direktörleri', href: '/dashboard/celf-direktorlukleri' },
            { icon: Shield, label: 'Güvenlik', href: '/dashboard/guvenlik' },
            { icon: Target, label: 'Onay Havuzu', href: '/dashboard/onay-kuyrugu' },
            { icon: TrendingUp, label: 'Raporlar', href: '/dashboard/raporlar' },
            { icon: Building2, label: 'Franchise', href: '/dashboard/franchise' },
            { icon: Users, label: 'Kullanıcılar', href: '/dashboard/kullanicilar' },
          ].map(item => (
            <Link key={item.label} href={item.href} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition" style={{ background: item.active ? '#10b98115' : 'transparent', color: item.active ? '#10b981' : '#94a3b8', borderLeft: item.active ? '3px solid #10b981' : '3px solid transparent' }}>
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
          <div className="mt-auto pt-4 text-[10px]" style={{ color: '#94a3b8', borderTop: '1px solid #1e293b' }}>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: '#10b981' }} />
              Sistem: {health ? `${health.ok}/${health.total} AI aktif` : 'Yükleniyor...'}
            </div>
          </div>
        </aside>

        {/* ANA İÇERİK */}
        <main className="flex-1 p-6 space-y-6">

          {/* ROBOT DURUM GRID */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4" style={{ color: '#f97316' }} />
              <span className="text-sm font-medium">AI Robot Durumu</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: health && health.ok === health.total ? '#10b98130' : '#f9731630', color: health && health.ok === health.total ? '#10b981' : '#f97316' }}>
                {health ? `${health.ok}/${health.total}` : '...'}
              </span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {health?.results && aiNames.map(name => {
                const key = name.toLowerCase()
                const match = Object.entries(health.results).find(([k]) => k.toLowerCase() === key)
                return <RobotCard key={name} name={name} status={match ? match[1] : { ok: false, error: 'yok' }} />
              })}
              {!health && aiNames.map(n => <RobotCard key={n} name={n} status={{ ok: false, error: 'yükleniyor' }} />)}
            </div>
          </div>

          {/* İKİ SÜTUN: ONAY + CHAT */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* ONAY HAVUZU */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4" style={{ color: '#f97316' }} />
                  <span className="text-sm font-medium">Onay Havuzu</span>
                  {pending.length > 0 && <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: '#ef444430', color: '#ef4444' }}>{pending.length} bekliyor</span>}
                </div>
                <button onClick={() => fetch('/api/patron/pending').then(r => r.json()).then(d => setPending(Array.isArray(d) ? d : d.items || [])).catch(() => {})} className="p-1 rounded" style={{ color: '#94a3b8' }}><RefreshCw className="w-3.5 h-3.5" /></button>
              </div>
              <div className="space-y-3" style={{ maxHeight: 400, overflow: 'auto' }}>
                {pending.length === 0 && <p className="text-sm" style={{ color: '#94a3b8' }}>Bekleyen iş yok</p>}
                {pending.map(item => (
                  <OnayCard key={item.id} item={item} onApprove={() => handleDecision(item.id, 'approved')} onReject={() => handleDecision(item.id, 'rejected')} />
                ))}
              </div>
            </div>

            {/* ASİSTAN CHAT */}
            <div className="flex flex-col rounded-xl" style={{ background: '#111827', border: '1px solid #1e293b', height: 440 }}>
              <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid #1e293b' }}>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" style={{ color: '#f97316' }} />
                  <span className="text-sm font-medium">Asistan</span>
                </div>
                <select value={chatProvider} onChange={e => setChatProvider(e.target.value)} className="text-xs px-2 py-1 rounded" style={{ background: '#0a0e17', color: '#f8fafc', border: '1px solid #1e293b' }}>
                  <option value="GEMINI">Gemini</option>
                  <option value="CLAUDE">Claude</option>
                  <option value="GPT">GPT</option>
                  <option value="CLOUD">Together</option>
                </select>
              </div>
              <div className="flex-1 overflow-auto p-4 space-y-3">
                {chatMsgs.length === 0 && <p className="text-xs" style={{ color: '#94a3b8' }}>Merhaba Patron. Size nasıl yardımcı olabilirim?</p>}
                {chatMsgs.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'patron' ? 'justify-end' : 'justify-start'}`}>
                    <div className="max-w-[80%] px-3 py-2 rounded-xl text-sm" style={{ background: m.role === 'patron' ? '#10b981' : '#1e293b', color: '#f8fafc' }}>
                      {m.text}
                      {m.provider && <span className="block text-[9px] mt-1" style={{ color: m.role === 'patron' ? '#fff8' : '#94a3b8' }}>{m.provider}</span>}
                    </div>
                  </div>
                ))}
                {chatLoading && <div className="flex justify-start"><div className="px-3 py-2 rounded-xl text-sm" style={{ background: '#1e293b' }}>Düşünüyor...</div></div>}
                <div ref={chatEndRef} />
              </div>
              <div className="flex gap-2 p-3" style={{ borderTop: '1px solid #1e293b' }}>
                <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendChat()} placeholder="Mesaj yazın..." className="flex-1 px-3 py-2 rounded-lg text-sm outline-none" style={{ background: '#0a0e17', color: '#f8fafc', border: '1px solid #1e293b' }} />
                <button onClick={sendChat} disabled={chatLoading} className="p-2 rounded-lg transition" style={{ background: '#10b981', color: '#fff' }}><Send className="w-4 h-4" /></button>
              </div>
            </div>
          </div>

          {/* CELF KOMUT PANELİ */}
          <PatronCommandPanel />
        </main>
      </div>
    </div>
  )
}
