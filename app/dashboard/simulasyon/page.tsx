'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import {
  Play,
  RotateCcw,
  Terminal,
  Shield,
  Brain,
  Crown,
  Factory,
  CheckCircle2,
  Clock,
  Zap,
  AlertTriangle,
  ChevronRight,
  Cpu,
  Eye,
  Package,
  Store,
  Filter,
  Truck,
  BarChart3,
  Settings2,
  Loader2,
} from 'lucide-react'

// ─── Tipler ─────────────────────────────────────────────────

type NodeStatus = 'idle' | 'active' | 'completed' | 'failed' | 'waiting'

interface SimNode {
  id: string
  label: string
  shortLabel: string
  icon: string
  x: number
  y: number
  description: string
  status: NodeStatus
  detail?: string
}

interface LogEntry {
  timestamp: number
  node: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
}

interface SimStep {
  nodeId: string
  duration: number
  log: string
  logType: LogEntry['type']
  detail?: string
}

// ─── İkon Haritası ──────────────────────────────────────────

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  terminal: Terminal,
  shield: Shield,
  brain: Brain,
  crown: Crown,
  factory: Factory,
  check: CheckCircle2,
  cpu: Cpu,
  eye: Eye,
  package: Package,
  store: Store,
  filter: Filter,
  truck: Truck,
  chart: BarChart3,
  settings: Settings2,
  zap: Zap,
}

// ─── Sistem Düğümleri ───────────────────────────────────────

const INITIAL_NODES: SimNode[] = [
  { id: 'patron',         label: 'Patron Komutu',           shortLabel: 'PATRON',      icon: 'terminal', x: 80,  y: 60,  description: 'Patron doğal dille komut girer',                          status: 'idle' },
  { id: 'guvenlik',       label: 'Güvenlik Robot',          shortLabel: 'GÜVENLİK',   icon: 'shield',   x: 310, y: 60,  description: 'İçerik güvenlik taraması (KVKK, zararlı içerik)',         status: 'idle' },
  { id: 'cio',            label: 'CIO Analiz',              shortLabel: 'CIO',         icon: 'brain',    x: 540, y: 60,  description: 'Strateji analizi ve sınıflandırma',                      status: 'idle' },
  { id: 'ceo',            label: 'CEO Robot',               shortLabel: 'CEO',         icon: 'crown',    x: 80,  y: 200, description: 'Komutu ilgili direktörlüğe yönlendirir (90+ kelime)',     status: 'idle' },
  { id: 'direktorluk',    label: 'CELF Direktörlük',        shortLabel: 'DİREKTÖRLÜK',icon: 'factory',  x: 310, y: 200, description: '12 direktörlükten biri — iç döngü (AI + Claude)',         status: 'idle' },
  { id: 'ic_dongu',       label: 'İç Döngü',                shortLabel: 'İÇ DÖNGÜ',   icon: 'eye',      x: 540, y: 200, description: 'Üretici AI → Claude iç denetim → düzeltme (maks 3 tur)', status: 'idle' },
  { id: 'anayasa',        label: 'Şirket Süzgeci',          shortLabel: 'ANAYASA',     icon: 'filter',   x: 80,  y: 340, description: 'Şirket anayasası kontrolü (misyon, vizyon, kurallar)',    status: 'idle' },
  { id: 'celf_motor',     label: 'CELF Motor',              shortLabel: 'MOTOR',       icon: 'settings', x: 310, y: 340, description: 'Merkez görevlendirici — tekrar engel, maliyet, kuyruk',   status: 'idle' },
  { id: 'uretim',         label: 'Üretim Havuzu',           shortLabel: 'ÜRETİM',     icon: 'cpu',      x: 540, y: 340, description: 'Robot pipeline çalıştırıcı (GPT→V0→Claude)',              status: 'idle' },
  { id: 'claude_denetim', label: 'Claude Son Denetim',      shortLabel: 'CLAUDE',      icon: 'check',    x: 80,  y: 480, description: 'Altın Kural #4 — Son kalite denetimi',                   status: 'idle' },
  { id: 'ceo_pool',       label: "CEO Havuzu (10'a Çıkart)",shortLabel: 'CEO HAVUZU',  icon: 'package',  x: 310, y: 480, description: 'Patron onayı bekleniyor — kart görünümünde',             status: 'idle' },
  { id: 'deploy',         label: 'Mağaza / Deploy',         shortLabel: 'DEPLOY',      icon: 'store',    x: 540, y: 480, description: 'Onaylanan ürün mağazaya yayınlanır veya deploy edilir',  status: 'idle' },
]

const CONNECTIONS = [
  { from: 'patron', to: 'guvenlik', label: 'Komut' },
  { from: 'guvenlik', to: 'cio', label: 'Güvenli' },
  { from: 'cio', to: 'ceo', label: 'Analiz' },
  { from: 'ceo', to: 'direktorluk', label: 'Yönlendir' },
  { from: 'direktorluk', to: 'ic_dongu', label: 'Üretim' },
  { from: 'ic_dongu', to: 'anayasa', label: 'Çıktı' },
  { from: 'anayasa', to: 'celf_motor', label: 'Onay' },
  { from: 'celf_motor', to: 'uretim', label: 'Dispatch' },
  { from: 'uretim', to: 'claude_denetim', label: 'Ürün' },
  { from: 'claude_denetim', to: 'ceo_pool', label: 'Denetim' },
  { from: 'ceo_pool', to: 'deploy', label: 'Patron Onay' },
]

// ─── Örnek Komutlar ─────────────────────────────────────────

const SAMPLE_COMMANDS = [
  { label: 'Sosyal Medya', command: 'Instagram için haftalık antrenman paylaşım planı hazırla' },
  { label: 'UI Tasarım', command: 'Franchise kayıt sayfası tasarla, modern ve mobil uyumlu' },
  { label: 'Rapor', command: 'Son 3 ayın franchise gelir analizini çıkar' },
  { label: 'Antrenman', command: '12-14 yaş grubu futbol antrenman programı oluştur' },
  { label: 'Kampanya', command: 'Yaz kampı erken kayıt indirimi kampanyası hazırla' },
  { label: 'Kod/API', command: 'Franchise ödeme entegrasyonu API endpoint yaz' },
]

// ─── Simülasyon Adımları ────────────────────────────────────

function buildSimSteps(command: string): SimStep[] {
  const isDesign = /tasarla|sayfa|ui|logo|grafik/i.test(command)
  const isCode = /kod|api|endpoint|entegrasyon/i.test(command)
  const isSocial = /instagram|sosyal|paylaşım|tweet/i.test(command)

  let dirLabel = 'CMO Direktörlüğü'
  let pipeline = 'GEMINI → V0'
  let contentType = 'sosyal_medya'

  if (isDesign) { dirLabel = 'CPO Direktörlüğü'; pipeline = 'V0 → CURSOR'; contentType = 'ui_sayfa' }
  if (isCode) { dirLabel = 'CTO Direktörlüğü'; pipeline = 'CURSOR'; contentType = 'kod_api' }
  if (isSocial) { dirLabel = 'CMO Direktörlüğü'; pipeline = 'GEMINI → GPT'; contentType = 'sosyal_medya' }

  const hash = Math.random().toString(36).slice(2, 10)

  return [
    { nodeId: 'patron', duration: 800, log: `Komut alındı: "${command.slice(0, 50)}..."`, logType: 'info' },
    { nodeId: 'guvenlik', duration: 1200, log: 'Güvenlik taraması... KVKK uygun, zararlı içerik yok.', logType: 'success', detail: 'KVKK: ✓ | Zararlı: ✗ | Kişisel Veri: ✗' },
    { nodeId: 'cio', duration: 1500, log: `CIO analiz: İçerik türü "${contentType}" tespit edildi.`, logType: 'info', detail: `Strateji: Standart | Öncelik: Normal | Token: ~3000` },
    { nodeId: 'ceo', duration: 1000, log: `CEO yönlendirdi → ${dirLabel}`, logType: 'info', detail: `Kelime eşleşme: 3 | Güven: %92` },
    { nodeId: 'direktorluk', duration: 2000, log: `${dirLabel} görevi aldı, iç döngü başlıyor...`, logType: 'info', detail: `Üretici: Gemini | Denetçi: Claude | Maks: 3 tur` },
    { nodeId: 'ic_dongu', duration: 2500, log: 'İç döngü Tur 1 — Claude denetim GEÇTİ ✓', logType: 'success', detail: 'Tur 1/3 | Claude: "İçerik yeterli."' },
    { nodeId: 'anayasa', duration: 1000, log: 'Şirket süzgeci: Misyon uyumlu ✓', logType: 'success', detail: 'Çocuk verisi ✗ | Uydurma ✗ | Tıbbi ✗ | TR ✓' },
    { nodeId: 'celf_motor', duration: 1500, log: `CELF Motor: Pipeline [${pipeline}] atandı`, logType: 'info', detail: `Hash: ${hash} | Tekrar: Hayır | Bütçe: 27K/30K` },
    { nodeId: 'uretim', duration: 3000, log: `Üretim: ${pipeline} çalıştırılıyor...`, logType: 'info', detail: `Pipeline: ${pipeline} → Claude Denetim` },
    { nodeId: 'claude_denetim', duration: 1500, log: 'Claude son denetim: GEÇTİ — Kalite yeterli.', logType: 'success', detail: 'Görev ✓ | Bağlam ✓ | Yazım ✓ | Güvenlik ✓' },
    { nodeId: 'ceo_pool', duration: 1000, log: "CEO Havuzu'na eklendi — Patron onayı bekleniyor.", logType: 'warning', detail: "Kart #YS-0042 | 10'a Çıkart" },
    { nodeId: 'deploy', duration: 800, log: 'Patron ONAYLADI → Mağazaya yayınlanıyor...', logType: 'success', detail: 'Hedef: Tüm franchise\'lar' },
  ]
}

// ─── Yardımcı Fonksiyonlar ──────────────────────────────────

const NODE_W = 190
const NODE_H = 80

function statusBorder(s: NodeStatus): string {
  if (s === 'active')    return '2px solid #22d3ee'
  if (s === 'completed') return '2px solid #10b981'
  if (s === 'failed')    return '2px solid #ef4444'
  if (s === 'waiting')   return '2px solid #f59e0b'
  return '2px solid #475569'
}

function statusBg(s: NodeStatus): string {
  if (s === 'active')    return 'rgba(8, 145, 178, 0.25)'
  if (s === 'completed') return 'rgba(6, 78, 59, 0.4)'
  if (s === 'failed')    return 'rgba(127, 29, 29, 0.4)'
  if (s === 'waiting')   return 'rgba(120, 53, 15, 0.4)'
  return 'rgba(30, 41, 59, 0.6)'
}

function statusDotColor(s: NodeStatus): string {
  if (s === 'active')    return '#22d3ee'
  if (s === 'completed') return '#34d399'
  if (s === 'failed')    return '#f87171'
  if (s === 'waiting')   return '#fbbf24'
  return '#64748b'
}

function iconColor(s: NodeStatus): string {
  if (s === 'active')    return '#22d3ee'
  if (s === 'completed') return '#34d399'
  if (s === 'failed')    return '#f87171'
  if (s === 'waiting')   return '#fbbf24'
  return '#94a3b8'
}

function logColor(type: LogEntry['type']): string {
  if (type === 'success') return '#6ee7b7'
  if (type === 'warning') return '#fcd34d'
  if (type === 'error')   return '#fca5a5'
  return '#67e8f9'
}

// ─── JOURNEY STEPS ──────────────────────────────────────────

const JOURNEY = [
  'Patron → Güvenlik Tarama',
  'Güvenlik → CIO Strateji',
  'CIO → CEO Yönlendirme',
  'CEO → Direktörlük Atama',
  'Direktörlük → İç Döngü (AI+Claude)',
  'İç Döngü → Şirket Süzgeci',
  'Süzgeç → CELF Motor Dispatch',
  'Motor → Üretim Havuzu (Pipeline)',
  'Pipeline → Claude Son Denetim',
  'Denetim → CEO Havuzu',
  'CEO Havuzu → Patron Karar',
  'Patron → Deploy / Mağaza',
]

// ─── ARCHITECTURE NOTES ─────────────────────────────────────

const ARCH_NOTES = [
  { color: '#ef4444', title: 'İki-Geçiş CEO Havuzu', desc: 'Şu an tek geçiş var. 1. geçiş: gereksinim + pipeline seçimi, 2. geçiş: üretim sonucu + onay olmalı.' },
  { color: '#f59e0b', title: 'Token Takibi Bellekte', desc: "CELF Motor token bütçesi sunucu bellekte — restart'ta sıfırlanır. DB'ye taşınmalı." },
  { color: '#f59e0b', title: 'Üretim Havuzu Bağlantısız', desc: 'uretim-havuzu.ts hiçbir yerden çağrılmıyor. Entegre edilmeli.' },
  { color: '#10b981', title: 'Claude İç Denetim', desc: 'Her direktörlükte Claude iç denetim doğru çalışıyor (Altın Kural #4).' },
  { color: '#10b981', title: 'Tekrar Engeli', desc: 'CELF Motor hash tabanlı tekrar tespiti aktif (15dk pencere).' },
  { color: '#ef4444', title: 'State Machine Eksik', desc: 'İş durumları basit string — proper state machine gerekli.' },
]

// ─── ANA COMPONENT ──────────────────────────────────────────

export default function SimulasyonPage() {
  const [nodes, setNodes] = useState<SimNode[]>(INITIAL_NODES)
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [command, setCommand] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [activeConn, setActiveConn] = useState<string | null>(null)
  const [selectedNode, setSelectedNode] = useState<SimNode | null>(null)
  const [stepIndex, setStepIndex] = useState(-1)
  const [elapsed, setElapsed] = useState(0)

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const abortRef = useRef(false)
  const logEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setElapsed((p: number) => p + 100)
      }, 100)
    } else if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [isRunning])

  const reset = useCallback(() => {
    abortRef.current = true
    setNodes(INITIAL_NODES)
    setLogs([])
    setIsRunning(false)
    setActiveConn(null)
    setSelectedNode(null)
    setStepIndex(-1)
    setElapsed(0)
    if (timerRef.current) clearInterval(timerRef.current)
    setTimeout(() => { abortRef.current = false }, 100)
  }, [])

  const run = useCallback(async (cmd: string) => {
    if (isRunning) return
    reset()
    await new Promise(r => setTimeout(r, 150))
    abortRef.current = false
    setIsRunning(true)

    const steps = buildSimSteps(cmd)

    for (let i = 0; i < steps.length; i++) {
      if (abortRef.current) break
      const step = steps[i]
      setStepIndex(i)

      setNodes((prev: SimNode[]) => prev.map((n: SimNode) =>
        n.id === step.nodeId ? { ...n, status: 'active' as NodeStatus, detail: step.detail } : n
      ))

      if (i > 0) setActiveConn(`${steps[i - 1].nodeId}->${step.nodeId}`)

      setLogs((prev: LogEntry[]) => [...prev, { timestamp: Date.now(), node: step.nodeId, message: step.log, type: step.logType }])

      await new Promise<void>(resolve => {
        const t = setTimeout(() => resolve(), step.duration)
        const c = setInterval(() => { if (abortRef.current) { clearTimeout(t); clearInterval(c); resolve() } }, 100)
      })

      if (abortRef.current) break

      const finalStatus: NodeStatus = step.logType === 'error' ? 'failed' : step.nodeId === 'ceo_pool' ? 'waiting' : 'completed'
      setNodes((prev: SimNode[]) => prev.map((n: SimNode) =>
        n.id === step.nodeId ? { ...n, status: finalStatus } : n
      ))
    }

    setActiveConn(null)
    setIsRunning(false)
    setStepIndex(-1)

    if (!abortRef.current) {
      setLogs((prev: LogEntry[]) => [...prev, { timestamp: Date.now(), node: 'system', message: 'Simülasyon tamamlandı! Tüm akış başarıyla çalıştı.', type: 'success' }])
    }
  }, [isRunning, reset])

  // SVG bağlantı hesaplama
  const getCenter = (id: string) => {
    const n = nodes.find((nd: SimNode) => nd.id === id)
    if (!n) return { x: 0, y: 0 }
    return { x: n.x + NODE_W / 2, y: n.y + NODE_H / 2 }
  }

  const completed = nodes.filter((n: SimNode) => n.status === 'completed').length
  const successLogs = logs.filter((l: LogEntry) => l.type === 'success').length
  const activeNode = nodes.find((n: SimNode) => n.status === 'active')

  return (
    <div style={{ minHeight: '100vh', background: '#0a0e17', color: '#fff', padding: '24px' }}>
      {/* Başlık */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 12 }}>
          <Zap style={{ width: 28, height: 28, color: '#22d3ee' }} />
          YİSA-S Canlı Simülasyon
        </h1>
        <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>
          Sistem akışını görsel olarak izleyin — komut girin, robotların çalışmasını takip edin
        </p>
      </div>

      {/* Komut Girişi */}
      <div style={{ background: 'rgba(30,41,59,0.4)', border: '1px solid #334155', borderRadius: 12, padding: 16, marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <input
            type="text"
            value={command}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCommand(e.target.value)}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => { if (e.key === 'Enter' && command.trim() && !isRunning) run(command.trim()) }}
            placeholder="Patron komutu girin... (örn: Franchise için logo tasarla)"
            disabled={isRunning}
            style={{
              flex: 1, minWidth: 250, background: 'rgba(15,23,42,0.8)', border: '1px solid #475569',
              borderRadius: 8, padding: '10px 16px', fontSize: 14, color: '#fff', outline: 'none',
            }}
          />
          <button
            onClick={() => command.trim() && run(command.trim())}
            disabled={isRunning || !command.trim()}
            style={{
              padding: '10px 20px', background: isRunning || !command.trim() ? '#334155' : '#0891b2',
              color: isRunning || !command.trim() ? '#64748b' : '#fff', border: 'none', borderRadius: 8,
              fontSize: 14, fontWeight: 600, cursor: isRunning || !command.trim() ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', gap: 8,
            }}
          >
            {isRunning ? <Loader2 style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} /> : <Play style={{ width: 16, height: 16 }} />}
            {isRunning ? 'Çalışıyor...' : 'Başlat'}
          </button>
          <button
            onClick={reset}
            style={{ padding: '10px 14px', background: '#334155', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}
          >
            <RotateCcw style={{ width: 16, height: 16 }} />
          </button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12, alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: '#64748b' }}>Örnekler:</span>
          {SAMPLE_COMMANDS.map(s => (
            <button
              key={s.label}
              onClick={() => { setCommand(s.command); if (!isRunning) run(s.command) }}
              disabled={isRunning}
              style={{
                padding: '4px 10px', fontSize: 12, background: 'rgba(51,65,85,0.6)', color: '#cbd5e1',
                border: '1px solid rgba(71,85,105,0.5)', borderRadius: 6, cursor: isRunning ? 'not-allowed' : 'pointer',
                opacity: isRunning ? 0.4 : 1,
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* İstatistikler */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { value: `${completed}/${nodes.length}`, label: 'Tamamlanan Adım', color: '#22d3ee' },
          { value: String(successLogs), label: 'Başarılı Kontrol', color: '#34d399' },
          { value: `${(elapsed / 1000).toFixed(1)}s`, label: 'Geçen Süre', color: '#fbbf24' },
          { value: activeNode?.shortLabel || '—', label: 'Aktif Robot', color: '#a78bfa' },
        ].map((stat, i) => (
          <div key={i} style={{ background: 'rgba(30,41,59,0.5)', border: '1px solid #334155', borderRadius: 8, padding: 12, textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Ana İçerik */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        {/* Sol: Flow Diagram */}
        <div>
          <div style={{ background: 'rgba(30,41,59,0.2)', border: '1px solid rgba(51,65,85,0.5)', borderRadius: 12, padding: 16, overflowX: 'auto' }}>
            <div style={{ position: 'relative', width: 730, height: 580, minWidth: 730 }}>
              {/* SVG Çizgiler */}
              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}>
                <defs>
                  <marker id="arr" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                    <path d="M0,0 L8,3 L0,6" fill="#475569" />
                  </marker>
                  <marker id="arr-a" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                    <path d="M0,0 L8,3 L0,6" fill="#22d3ee" />
                  </marker>
                </defs>
                {CONNECTIONS.map(conn => {
                  const f = getCenter(conn.from)
                  const t = getCenter(conn.to)
                  const dx = t.x - f.x
                  const dy = t.y - f.y
                  let sx = f.x, sy = f.y, ex = t.x, ey = t.y
                  if (Math.abs(dx) > Math.abs(dy)) {
                    sx = dx > 0 ? f.x + NODE_W / 2 : f.x - NODE_W / 2
                    ex = dx > 0 ? t.x - NODE_W / 2 : t.x + NODE_W / 2
                  } else {
                    sy = dy > 0 ? f.y + NODE_H / 2 : f.y - NODE_H / 2
                    ey = dy > 0 ? t.y - NODE_H / 2 : t.y + NODE_H / 2
                  }
                  const mx = (sx + ex) / 2
                  const my = (sy + ey) / 2
                  const d = Math.abs(dx) > 10 && Math.abs(dy) > 10
                    ? `M ${sx} ${sy} Q ${sx} ${my} ${mx} ${my} Q ${ex} ${my} ${ex} ${ey}`
                    : `M ${sx} ${sy} L ${ex} ${ey}`
                  const isAct = activeConn === `${conn.from}->${conn.to}`
                  return (
                    <g key={`${conn.from}-${conn.to}`}>
                      <path d={d} fill="none" stroke={isAct ? '#22d3ee' : '#334155'} strokeWidth={isAct ? 2.5 : 1.5}
                        strokeDasharray={isAct ? undefined : '6 4'} markerEnd={isAct ? 'url(#arr-a)' : 'url(#arr)'} />
                      {conn.label && <text x={mx} y={my - 8} textAnchor="middle" style={{ fontSize: 10, fill: '#64748b' }}>{conn.label}</text>}
                    </g>
                  )
                })}
              </svg>

              {/* Düğümler */}
              {nodes.map(node => {
                const Icon = ICONS[node.icon] || Cpu
                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    style={{
                      position: 'absolute', left: node.x, top: node.y, width: NODE_W, height: NODE_H,
                      border: statusBorder(node.status), background: statusBg(node.status),
                      borderRadius: 12, padding: 12, cursor: 'pointer', zIndex: 10,
                      transition: 'all 0.3s ease',
                      boxShadow: node.status === 'active' ? '0 0 20px rgba(34,211,238,0.3)' : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Icon style={{ width: 16, height: 16, color: iconColor(node.status), flexShrink: 0 }} />
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{node.shortLabel}</span>
                      <div style={{
                        width: 8, height: 8, borderRadius: '50%', marginLeft: 'auto', flexShrink: 0,
                        background: statusDotColor(node.status),
                        animation: (node.status === 'active' || node.status === 'waiting') ? 'pulse 1.5s ease-in-out infinite' : 'none',
                      }} />
                    </div>
                    <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 6, lineHeight: 1.3, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const }}>
                      {node.detail || node.description}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Seçili düğüm */}
          {selectedNode && (
            <div style={{ marginTop: 12, background: 'rgba(30,41,59,0.5)', border: '1px solid #475569', borderRadius: 12, padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{selectedNode.label}</span>
                <button onClick={() => setSelectedNode(null)} style={{ fontSize: 12, color: '#64748b', background: 'none', border: 'none', cursor: 'pointer' }}>Kapat</button>
              </div>
              <p style={{ fontSize: 12, color: '#94a3b8' }}>{selectedNode.description}</p>
              {selectedNode.detail && (
                <div style={{ marginTop: 8, background: 'rgba(15,23,42,0.5)', borderRadius: 8, padding: 8, fontSize: 12, color: '#67e8f9', fontFamily: 'monospace' }}>
                  {selectedNode.detail}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sağ Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Canlı Log */}
          <div style={{ background: 'rgba(30,41,59,0.3)', border: '1px solid #334155', borderRadius: 12 }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(51,65,85,0.5)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Terminal style={{ width: 16, height: 16, color: '#22d3ee' }} />
              <span style={{ fontSize: 14, fontWeight: 600, color: '#cbd5e1' }}>Canlı Akış Logu</span>
              {isRunning && <Loader2 style={{ width: 14, height: 14, color: '#22d3ee', marginLeft: 'auto', animation: 'spin 1s linear infinite' }} />}
            </div>
            <div style={{ padding: 12, height: 320, overflowY: 'auto', fontFamily: 'monospace', fontSize: 12 }}>
              {logs.length === 0 && (
                <div style={{ color: '#64748b', textAlign: 'center', paddingTop: 60 }}>
                  Simülasyon başlatmak için bir komut girin...
                </div>
              )}
              {logs.map((log: LogEntry, i: number) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
                  <ChevronRight style={{ width: 12, height: 12, marginTop: 2, flexShrink: 0, color: logColor(log.type) }} />
                  <span style={{ color: logColor(log.type) }}>{log.message}</span>
                </div>
              ))}
              <div ref={logEndRef} />
            </div>
          </div>

          {/* Mimari Notlar */}
          <div style={{ background: 'rgba(30,41,59,0.3)', border: '1px solid #334155', borderRadius: 12, padding: 16 }}>
            <h3 style={{ fontSize: 13, fontWeight: 600, color: '#cbd5e1', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertTriangle style={{ width: 16, height: 16, color: '#fbbf24' }} />
              Mimari Analiz Notları
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {ARCH_NOTES.map((note, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: note.color, marginTop: 4, flexShrink: 0 }} />
                  <div>
                    <span style={{ fontWeight: 600, color: '#e2e8f0' }}>{note.title}:</span>{' '}
                    <span style={{ color: '#94a3b8' }}>{note.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Komut Yolculuğu */}
          <div style={{ background: 'rgba(30,41,59,0.3)', border: '1px solid #334155', borderRadius: 12, padding: 16 }}>
            <h3 style={{ fontSize: 13, fontWeight: 600, color: '#cbd5e1', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Truck style={{ width: 16, height: 16, color: '#a78bfa' }} />
              Komut Yolculuğu (12 Adım)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {JOURNEY.map((step, i) => {
                const done = stepIndex > i
                const current = stepIndex === i
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '2px 0', fontSize: 12,
                    color: current ? '#67e8f9' : done ? '#34d399' : '#64748b', fontWeight: current ? 600 : 400 }}>
                    {done ? <CheckCircle2 style={{ width: 12, height: 12, color: '#34d399', flexShrink: 0 }} />
                    : current ? <Loader2 style={{ width: 12, height: 12, color: '#22d3ee', flexShrink: 0, animation: 'spin 1s linear infinite' }} />
                    : <Clock style={{ width: 12, height: 12, color: '#334155', flexShrink: 0 }} />}
                    <span>{i + 1}. {step}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
        @keyframes pulse { 0%, 100% { opacity: 1 } 50% { opacity: 0.4 } }
      `}} />
    </div>
  )
}
