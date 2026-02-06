"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import {
  Brain, Target, Users, Building2, TrendingUp,
  Sparkles, Bot, Globe, Shield, Bell, Send,
  CheckCircle2, XCircle, Eye, ArrowRight, Activity,
  RefreshCw, Zap, BarChart3, Lock, Database,
  Menu, X
} from "lucide-react"
import PatronCommandPanel from "@/components/PatronCommandPanel"

/* ─── TIPLER ─── */
type AIStatus = { ok: boolean; ms?: number; latency?: number; error?: string; text?: string }
type HealthData = { ok: number; total: number; results: Record<string, AIStatus> }
type PendingItem = { id: string; command: string; title: string; director_key?: string; output_payload?: { displayText?: string; denetim?: { puan: number; notlar: string[] } }; created_at: string }
type ChatMsg = { role: 'patron' | 'ai'; text: string; provider?: string }

/* ─── AI İKONLARI & RENKLERİ ─── */
const AI_META: Record<string, { emoji: string; color: string; glow: string }> = {
  claude: { emoji: '🟠', color: '#f97316', glow: '0 0 12px #f9731680' },
  gemini: { emoji: '🔵', color: '#3b82f6', glow: '0 0 12px #3b82f680' },
  gpt: { emoji: '🟢', color: '#10b981', glow: '0 0 12px #10b98180' },
  v0: { emoji: '🟣', color: '#a855f7', glow: '0 0 12px #a855f780' },
  together: { emoji: '🔴', color: '#ef4444', glow: '0 0 12px #ef444480' },
}

/* ─── ROBOT KARTI ─── */
function RobotCard({ name, status }: { name: string; status: AIStatus }) {
  const key = name.toLowerCase()
  const meta = AI_META[key] || { emoji: '⚪', color: '#94a3b8', glow: 'none' }
  const isOk = status.ok
  const ms = status.ms || status.latency || 0
  return (
    <div className="flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all duration-300 hover:scale-105" style={{ background: isOk ? `${meta.color}10` : '#1e293b', border: `1px solid ${isOk ? meta.color + '40' : '#1e293b'}`, boxShadow: isOk ? meta.glow : 'none' }}>
      <span className="text-2xl">{meta.emoji}</span>
      <span className="text-xs font-bold" style={{ color: isOk ? meta.color : '#ef4444' }}>{name}</span>
      <span className="text-[10px]" style={{ color: '#94a3b8' }}>{isOk ? `${ms}ms ✓` : '✗ kapalı'}</span>
    </div>
  )
}

/* ─── İSTATİSTİK KARTI ─── */
function StatCard({ icon: Icon, label, value, color, emoji }: { icon: any; label: string; value: string; color: string; emoji: string }) {
  return (
    <div className="p-4 rounded-2xl transition-all duration-300 hover:scale-[1.02]" style={{ background: '#111827', border: '1px solid #1e293b' }}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{emoji}</span>
        <span className="text-[11px]" style={{ color: '#94a3b8' }}>{label}</span>
      </div>
      <p className="text-2xl font-bold" style={{ color }}>{value}</p>
    </div>
  )
}

/* ─── ONAY KARTI ─── */
function OnayCard({ item, onApprove, onReject }: { item: PendingItem; onApprove: () => void; onReject: () => void }) {
  const [showDetail, setShowDetail] = useState(false)
  return (
    <div className="p-4 rounded-2xl transition-all duration-300" style={{ background: '#111827', border: '1px solid #1e293b' }}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">📋</span>
          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: '#f9731630', color: '#f97316' }}>{item.director_key || 'CELF'}</span>
        </div>
        <span className="text-[10px]" style={{ color: '#94a3b8' }}>{new Date(item.created_at).toLocaleString('tr-TR')}</span>
      </div>
      <p className="text-sm font-medium mb-2" style={{ color: '#f8fafc' }}>{item.title || item.command?.slice(0, 80)}</p>
      {item.output_payload?.denetim && (
        <div className="flex items-center gap-1 mb-2">
          <span className="text-[10px]">🛡️</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: '#3b82f620', color: '#3b82f6' }}>Denetim: {item.output_payload.denetim.puan}/100</span>
        </div>
      )}
      {showDetail && item.output_payload?.displayText && (
        <div className="p-3 rounded-xl mb-2 text-xs whitespace-pre-wrap" style={{ background: '#0a0e17', color: '#94a3b8', maxHeight: 200, overflow: 'auto' }}>
          {item.output_payload.displayText}
        </div>
      )}
      <div className="flex gap-2">
        <button onClick={() => setShowDetail(!showDetail)} className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs transition" style={{ background: '#3b82f615', color: '#3b82f6' }}>
          <Eye className="w-3 h-3" /> Gör
        </button>
        <button onClick={onApprove} className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs transition" style={{ background: '#10b98115', color: '#10b981' }}>
          <CheckCircle2 className="w-3 h-3" /> Onayla
        </button>
        <button onClick={onReject} className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs transition" style={{ background: '#ef444415', color: '#ef4444' }}>
          <XCircle className="w-3 h-3" /> Reddet
        </button>
      </div>
    </div>
  )
}

/* ─── ANA PANEL ─── */
export default function PatronPanel() {
  const [health, setHealth] = useState<HealthData | null>(null)
  const [pending, setPending] = useState<PendingItem[]>([])
  const [chatMsgs, setChatMsgs] = useState<ChatMsg[]>([])
  const [chatInput, setChatInput] = useState('')
  const [chatProvider, setChatProvider] = useState('GEMINI')
  const [chatLoading, setChatLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const f = () => fetch('/api/test/ai').then(r => r.json()).then(setHealth).catch(() => {})
    f(); const i = setInterval(f, 60000); return () => clearInterval(i)
  }, [])

  useEffect(() => {
    const f = () => fetch('/api/patron/pending').then(r => r.ok ? r.json() : { items: [] }).then(d => setPending(Array.isArray(d) ? d : d.items || [])).catch(() => {})
    f(); const i = setInterval(f, 15000); return () => clearInterval(i)
  }, [])

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [chatMsgs])

  async function handleDecision(id: string, decision: string) {
    try { await fetch('/api/patron/approve', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command_id: id, decision }) }); setPending(p => p.filter(x => x.id !== id)) } catch {}
  }

  async function sendChat() {
    if (!chatInput.trim() || chatLoading) return
    const msg = chatInput.trim(); setChatInput(''); setChatMsgs(p => [...p, { role: 'patron', text: msg }]); setChatLoading(true)
    try {
      const r = await fetch('/api/chat/flow', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: msg, provider: chatProvider, skip_spelling: true }) })
      const d = await r.json(); setChatMsgs(p => [...p, { role: 'ai', text: d.text || d.reply || d.error || 'Yanıt alınamadı', provider: d.provider || chatProvider }])
    } catch { setChatMsgs(p => [...p, { role: 'ai', text: '❌ Bağlantı hatası' }]) }
    setChatLoading(false)
  }

  const aiNames = ['Claude', 'Gemini', 'GPT', 'V0', 'Together']

  const sidebarItems = [
    { icon: Activity, label: 'Genel Bakış', href: '/patron', emoji: '🏠', active: true },
    { icon: Bot, label: 'CELF Direktörleri', href: '/dashboard/celf-direktorlukleri', emoji: '🤖' },
    { icon: Shield, label: 'Güvenlik', href: '/dashboard/guvenlik', emoji: '🛡️' },
    { icon: Target, label: 'Onay Havuzu', href: '/dashboard/onay-kuyrugu', emoji: '📋' },
    { icon: BarChart3, label: 'Raporlar', href: '/dashboard/raporlar', emoji: '📊' },
    { icon: Building2, label: 'Franchise', href: '/dashboard/franchise', emoji: '🏢' },
    { icon: Users, label: 'Kullanıcılar', href: '/dashboard/kullanicilar', emoji: '👥' },
    { icon: Database, label: 'Şablonlar', href: '/dashboard/sablonlar', emoji: '📄' },
    { icon: Lock, label: 'Kasa', href: '/dashboard/kasa', emoji: '💰' },
  ]

  return (
    <div className="min-h-screen" style={{ background: '#0a0e17', color: '#f8fafc' }}>
      {/* HEADER */}
      <header className="flex items-center justify-between px-4 md:px-6 py-3" style={{ borderBottom: '1px solid #1e293b', background: '#0f172a' }}>
        <div className="flex items-center gap-3">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden p-1"><Menu className="w-5 h-5" /></button>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg" style={{ background: 'linear-gradient(135deg, #f97316, #ef4444)' }}>⚡</div>
          <div>
            <span className="font-bold text-sm md:text-base">YİSA-S</span>
            <p className="text-[9px] md:text-[10px]" style={{ color: '#94a3b8' }}>Patron Kontrol Merkezi</p>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px]" style={{ background: health && health.ok >= 4 ? '#10b98120' : '#f9731620', color: health && health.ok >= 4 ? '#10b981' : '#f97316' }}>
            <Zap className="w-3 h-3" /> {health ? `${health.ok}/${health.total} AI` : '...'}
          </div>
          <div className="relative">
            <Bell className="w-5 h-5" style={{ color: '#94a3b8' }} />
            {pending.length > 0 && <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-[9px] font-bold flex items-center justify-center animate-pulse" style={{ background: '#ef4444', color: '#fff' }}>{pending.length}</span>}
          </div>
          <div className="w-8 h-8 rounded-full" style={{ background: 'linear-gradient(135deg, #f97316, #a855f7)' }} />
        </div>
      </header>

      <div className="flex">
        {/* SIDEBAR - MOBIL OVERLAY */}
        {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />}
        <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:static z-50 w-56 min-h-[calc(100vh-53px)] p-3 flex flex-col gap-0.5 transition-transform duration-300`} style={{ background: '#0f172a', borderRight: '1px solid #1e293b' }}>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden self-end p-1 mb-2"><X className="w-4 h-4" /></button>
          {sidebarItems.map(item => (
            <Link key={item.label} href={item.href} onClick={() => setSidebarOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs transition-all duration-200" style={{ background: item.active ? '#10b98115' : 'transparent', color: item.active ? '#10b981' : '#94a3b8', borderLeft: item.active ? '3px solid #10b981' : '3px solid transparent' }}>
              <span className="text-sm">{item.emoji}</span>
              {item.label}
            </Link>
          ))}
          <div className="mt-auto pt-3 px-3 text-[9px]" style={{ color: '#64748b', borderTop: '1px solid #1e293b' }}>
            <p>YİSA-S v3.0</p>
            <p>5 AI • 15 Direktörlük</p>
          </div>
        </aside>

        {/* ANA İÇERİK */}
        <main className="flex-1 p-3 md:p-6 space-y-4 md:space-y-6 min-w-0">

          {/* HOŞGELDİN BANNER */}
          <div className="rounded-2xl p-5 md:p-6 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', border: '1px solid #1e293b' }}>
            <div className="relative z-10">
              <p className="text-xs mb-1" style={{ color: '#f97316' }}>🏆 Hoşgeldiniz</p>
              <h1 className="text-2xl md:text-3xl font-bold mb-1">Patron Paneli</h1>
              <p className="text-xs" style={{ color: '#94a3b8' }}>Tüm AI robotları aktif. Sistem hazır.</p>
            </div>
            <div className="absolute top-2 right-4 text-5xl md:text-7xl opacity-10">⚡</div>
          </div>

          {/* İSTATİSTİKLER */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard icon={TrendingUp} label="Aylık Gelir" value="353K" color="#10b981" emoji="💰" />
            <StatCard icon={Users} label="Öğrenci" value="230" color="#3b82f6" emoji="👦" />
            <StatCard icon={Building2} label="Franchise" value="4" color="#f97316" emoji="🏢" />
            <StatCard icon={Target} label="Bekleyen Onay" value={String(pending.length)} color="#ef4444" emoji="📋" />
          </div>

          {/* AI ROBOT DURUMU */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🤖</span>
              <span className="text-sm font-medium">AI Robot Durumu</span>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
              {health?.results && aiNames.map(name => {
                const key = name.toLowerCase()
                const match = Object.entries(health.results).find(([k]) => k.toLowerCase() === key)
                return <RobotCard key={name} name={name} status={match ? match[1] : { ok: false }} />
              })}
              {!health && aiNames.map(n => <RobotCard key={n} name={n} status={{ ok: false }} />)}
            </div>
          </div>

          {/* MİMARİ AKIŞ */}
          <div className="rounded-2xl p-4" style={{ background: '#111827', border: '1px solid #1e293b' }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🔄</span>
              <span className="text-sm font-medium">Mimari Akış</span>
            </div>
            <div className="flex items-center justify-between overflow-x-auto gap-1 pb-2">
              {[
                { emoji: '👔', name: 'Patron', color: '#f97316' },
                { emoji: '🤖', name: 'Asistan', color: '#a855f7' },
                { emoji: '🛡️', name: 'Güvenlik', color: '#ef4444' },
                { emoji: '📦', name: 'Veri', color: '#3b82f6' },
                { emoji: '🎯', name: 'CEO', color: '#10b981' },
                { emoji: '🏭', name: 'CELF', color: '#06b6d4' },
                { emoji: '⚙️', name: 'COO', color: '#f59e0b' },
                { emoji: '✅', name: 'Çıktı', color: '#22c55e' },
              ].map((item, i) => (
                <div key={item.name} className="flex items-center gap-1 flex-shrink-0">
                  <div className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl" style={{ background: `${item.color}15`, border: `1px solid ${item.color}30` }}>
                    <span className="text-lg">{item.emoji}</span>
                    <span className="text-[9px] font-medium" style={{ color: item.color }}>{item.name}</span>
                  </div>
                  {i < 7 && <span className="text-[10px]" style={{ color: '#1e293b' }}>→</span>}
                </div>
              ))}
            </div>
          </div>

          {/* İKİ SÜTUN: ONAY + CHAT */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            {/* ONAY HAVUZU */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📋</span>
                  <span className="text-sm font-medium">Onay Havuzu</span>
                  {pending.length > 0 && <span className="text-[10px] px-2 py-0.5 rounded-full animate-pulse" style={{ background: '#ef444420', color: '#ef4444' }}>{pending.length}</span>}
                </div>
                <button onClick={() => fetch('/api/patron/pending').then(r => r.json()).then(d => setPending(Array.isArray(d) ? d : d.items || [])).catch(() => {})} className="p-1.5 rounded-lg transition" style={{ color: '#94a3b8', background: '#1e293b' }}><RefreshCw className="w-3.5 h-3.5" /></button>
              </div>
              <div className="space-y-3" style={{ maxHeight: 400, overflow: 'auto' }}>
                {pending.length === 0 && (
                  <div className="text-center py-8 rounded-2xl" style={{ background: '#111827' }}>
                    <span className="text-3xl mb-2 block">✅</span>
                    <p className="text-sm" style={{ color: '#94a3b8' }}>Bekleyen iş yok</p>
                  </div>
                )}
                {pending.map(item => (
                  <OnayCard key={item.id} item={item} onApprove={() => handleDecision(item.id, 'approved')} onReject={() => handleDecision(item.id, 'rejected')} />
                ))}
              </div>
            </div>

            {/* ASİSTAN CHAT */}
            <div className="flex flex-col rounded-2xl overflow-hidden" style={{ background: '#111827', border: '1px solid #1e293b', height: 440 }}>
              <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid #1e293b', background: '#0f172a' }}>
                <div className="flex items-center gap-2">
                  <span className="text-lg">💬</span>
                  <span className="text-sm font-medium">Asistan</span>
                </div>
                <select value={chatProvider} onChange={e => setChatProvider(e.target.value)} className="text-[11px] px-2 py-1 rounded-lg" style={{ background: '#0a0e17', color: '#f8fafc', border: '1px solid #1e293b' }}>
                  <option value="GEMINI">🔵 Gemini</option>
                  <option value="CLAUDE">🟠 Claude</option>
                  <option value="GPT">🟢 GPT</option>
                  <option value="CLOUD">🔴 Together</option>
                </select>
              </div>
              <div className="flex-1 overflow-auto p-4 space-y-3">
                {chatMsgs.length === 0 && (
                  <div className="text-center py-6">
                    <span className="text-4xl mb-3 block">🤖</span>
                    <p className="text-xs" style={{ color: '#94a3b8' }}>Merhaba Patron. Size nasıl yardımcı olabilirim?</p>
                  </div>
                )}
                {chatMsgs.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'patron' ? 'justify-end' : 'justify-start'}`}>
                    <div className="max-w-[85%] px-3 py-2 rounded-2xl text-sm" style={{ background: m.role === 'patron' ? 'linear-gradient(135deg, #10b981, #059669)' : '#1e293b', color: '#f8fafc' }}>
                      {m.text}
                      {m.provider && <span className="block text-[9px] mt-1 opacity-60">{m.provider}</span>}
                    </div>
                  </div>
                ))}
                {chatLoading && <div className="flex justify-start"><div className="px-3 py-2 rounded-2xl text-sm animate-pulse" style={{ background: '#1e293b' }}>💭 Düşünüyor...</div></div>}
                <div ref={chatEndRef} />
              </div>
              <div className="flex gap-2 p-3" style={{ borderTop: '1px solid #1e293b' }}>
                <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendChat()} placeholder="Mesaj yazın..." className="flex-1 px-3 py-2.5 rounded-xl text-sm outline-none" style={{ background: '#0a0e17', color: '#f8fafc', border: '1px solid #1e293b' }} />
                <button onClick={sendChat} disabled={chatLoading} className="p-2.5 rounded-xl transition" style={{ background: 'linear-gradient(135deg, #f97316, #ef4444)', color: '#fff' }}><Send className="w-4 h-4" /></button>
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
