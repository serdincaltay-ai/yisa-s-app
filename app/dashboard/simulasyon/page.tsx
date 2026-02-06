'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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

// ─── Simülasyon Tipleri ─────────────────────────────────────

type NodeStatus = 'idle' | 'active' | 'completed' | 'failed' | 'waiting'

interface SimNode {
  id: string
  label: string
  shortLabel: string
  icon: keyof typeof ICON_MAP
  x: number
  y: number
  description: string
  status: NodeStatus
  detail?: string
  duration?: number // ms
}

interface SimConnection {
  from: string
  to: string
  label?: string
  animated?: boolean
}

interface LogEntry {
  timestamp: number
  node: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
}

// ─── İkon Haritası ─────────────────────────────────────────

const ICON_MAP = {
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

// ─── Sistem Düğümleri ──────────────────────────────────────

const INITIAL_NODES: SimNode[] = [
  // Satır 1: Giriş
  { id: 'patron', label: 'Patron Komutu', shortLabel: 'PATRON', icon: 'terminal', x: 80, y: 60, description: 'Patron doğal dille komut girer', status: 'idle' },
  { id: 'guvenlik', label: 'Güvenlik Robot', shortLabel: 'GÜVENLİK', icon: 'shield', x: 310, y: 60, description: 'İçerik güvenlik taraması (KVKK, zararlı içerik)', status: 'idle' },
  { id: 'cio', label: 'CIO Analiz', shortLabel: 'CIO', icon: 'brain', x: 540, y: 60, description: 'Strateji analizi ve sınıflandırma', status: 'idle' },

  // Satır 2: CEO + Yönlendirme
  { id: 'ceo', label: 'CEO Robot', shortLabel: 'CEO', icon: 'crown', x: 80, y: 200, description: 'Komutu ilgili direktörlüğe yönlendirir (90+ anahtar kelime)', status: 'idle' },
  { id: 'direktorluk', label: 'CELF Direktörlük', shortLabel: 'DİREKTÖRLÜK', icon: 'factory', x: 310, y: 200, description: '12 direktörlükten biri — iç döngü (üretici AI + Claude denetim)', status: 'idle' },
  { id: 'ic_dongu', label: 'İç Döngü', shortLabel: 'İÇ DÖNGÜ', icon: 'eye', x: 540, y: 200, description: 'Üretici AI → Claude iç denetim → düzeltme (maks 3 tur)', status: 'idle' },

  // Satır 3: Filtre + Motor
  { id: 'anayasa', label: 'Şirket Süzgeci', shortLabel: 'ANAYASA', icon: 'filter', x: 80, y: 340, description: 'Şirket anayasası kontrolü (misyon, vizyon, kurallar)', status: 'idle' },
  { id: 'celf_motor', label: 'CELF Motor', shortLabel: 'MOTOR', icon: 'settings', x: 310, y: 340, description: 'Merkez görevlendirici — tekrar engel, maliyet, kuyruk', status: 'idle' },
  { id: 'uretim', label: 'Üretim Havuzu', shortLabel: 'ÜRETİM', icon: 'cpu', x: 540, y: 340, description: 'Robot pipeline çalıştırıcı (GPT→V0→Claude sırası)', status: 'idle' },

  // Satır 4: Çıkış
  { id: 'claude_denetim', label: 'Claude Son Denetim', shortLabel: 'CLAUDE', icon: 'check', x: 80, y: 480, description: 'Altın Kural #4 — Son kalite denetimi', status: 'idle' },
  { id: 'ceo_pool', label: 'CEO Havuzu (10\'a Çıkart)', shortLabel: 'CEO HAVUZU', icon: 'package', x: 310, y: 480, description: 'Patron onayı bekleniyor — kart görünümünde', status: 'idle' },
  { id: 'deploy', label: 'Mağaza / Deploy', shortLabel: 'DEPLOY', icon: 'store', x: 540, y: 480, description: 'Onaylanan ürün mağazaya yayınlanır veya sisteme deploy edilir', status: 'idle' },
]

const CONNECTIONS: SimConnection[] = [
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
  { label: 'Sosyal Medya', command: 'Instagram için haftalık antrenman paylaşım planı hazırla', type: 'sosyal_medya' },
  { label: 'UI Tasarım', command: 'Franchise kayıt sayfası tasarla, modern ve mobil uyumlu', type: 'ui_sayfa' },
  { label: 'Rapor', command: 'Son 3 ayın franchise gelir analizini çıkar', type: 'metin_rapor' },
  { label: 'Antrenman', command: '12-14 yaş grubu futbol antrenman programı oluştur', type: 'antrenman' },
  { label: 'Kampanya', command: 'Yaz kampı erken kayıt indirimi kampanyası hazırla', type: 'kampanya' },
  { label: 'Kod/API', command: 'Franchise ödeme entegrasyonu API endpoint yaz', type: 'kod_api' },
]

// ─── Simülasyon Adımları ────────────────────────────────────

interface SimStep {
  nodeId: string
  duration: number // ms
  log: string
  logType: LogEntry['type']
  detail?: string
}

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

  return [
    { nodeId: 'patron', duration: 800, log: `Komut alındı: "${command.slice(0, 60)}..."`, logType: 'info' },
    { nodeId: 'guvenlik', duration: 1200, log: 'Güvenlik taraması... KVKK uygun, zararlı içerik yok.', logType: 'success', detail: 'KVKK: ✓ | Zararlı: ✗ | Kişisel Veri: ✗' },
    { nodeId: 'cio', duration: 1500, log: `CIO analiz: İçerik türü "${contentType}" tespit edildi.`, logType: 'info', detail: `Strateji: Standart akış | Öncelik: Normal | Tahmini token: ~3000` },
    { nodeId: 'ceo', duration: 1000, log: `CEO yönlendirdi → ${dirLabel}`, logType: 'info', detail: `Anahtar kelime eşleşmesi: 3 | Güven skoru: %92` },
    { nodeId: 'direktorluk', duration: 2000, log: `${dirLabel} görevi aldı, iç döngü başlatılıyor...`, logType: 'info', detail: `Üretici AI: Gemini | Denetçi: Claude | Maks tur: 3` },
    { nodeId: 'ic_dongu', duration: 2500, log: 'İç döngü: Tur 1 — Üretici çıktı verdi → Claude denetim GEÇTİ ✓', logType: 'success', detail: 'Tur 1/3 | Claude: "İçerik yeterli, YİSA-S bağlamında."' },
    { nodeId: 'anayasa', duration: 1000, log: 'Şirket süzgeci: Misyon uyumlu ✓, uydurma firma yok ✓', logType: 'success', detail: 'Kontroller: Çocuk verisi ✗ | Uydurma ✗ | Tıbbi ✗ | Türkçe ✓' },
    { nodeId: 'celf_motor', duration: 1500, log: `CELF Motor: Tekrar kontrol ✓, pipeline atandı: [${pipeline}]`, logType: 'info', detail: `Hash: ${Math.random().toString(36).slice(2, 10)} | Tekrar: Hayır | Bütçe: 27.000/30.000 token` },
    { nodeId: 'uretim', duration: 3000, log: `Üretim havuzu: ${pipeline} çalıştırılıyor...`, logType: 'info', detail: `Pipeline: ${pipeline} → Claude Son Denetim` },
    { nodeId: 'claude_denetim', duration: 1500, log: 'Claude son denetim: DURUM: GEÇTİ — Kalite yeterli.', logType: 'success', detail: 'Görev uyumu: ✓ | YİSA-S bağlam: ✓ | Yazım: ✓ | Güvenlik: ✓' },
    { nodeId: 'ceo_pool', duration: 1000, log: 'CEO Havuzu\'na eklendi — Patron onayı bekleniyor.', logType: 'warning', detail: 'Kart #YS-0042 | 10\'a Çıkart formatında' },
    { nodeId: 'deploy', duration: 800, log: 'Patron ONAYLADI → Mağazaya yayınlanıyor...', logType: 'success', detail: 'Monte noktası: /dashboard/vitrin | Hedef: Tüm franchise\'lar' },
  ]
}

// ─── Renk Yardımcıları ─────────────────────────────────────

function statusColor(status: NodeStatus): string {
  switch (status) {
    case 'idle': return 'border-slate-600 bg-slate-800/60'
    case 'active': return 'border-cyan-400 bg-cyan-950/80 shadow-[0_0_20px_rgba(34,211,238,0.3)]'
    case 'completed': return 'border-emerald-500 bg-emerald-950/60'
    case 'failed': return 'border-red-500 bg-red-950/60'
    case 'waiting': return 'border-amber-500 bg-amber-950/60'
    default: return 'border-slate-600 bg-slate-800/60'
  }
}

function statusDot(status: NodeStatus): string {
  switch (status) {
    case 'idle': return 'bg-slate-500'
    case 'active': return 'bg-cyan-400 animate-pulse'
    case 'completed': return 'bg-emerald-400'
    case 'failed': return 'bg-red-400'
    case 'waiting': return 'bg-amber-400 animate-pulse'
    default: return 'bg-slate-500'
  }
}

function logTypeColor(type: LogEntry['type']): string {
  switch (type) {
    case 'info': return 'text-cyan-300'
    case 'success': return 'text-emerald-300'
    case 'warning': return 'text-amber-300'
    case 'error': return 'text-red-300'
    default: return 'text-slate-300'
  }
}

// ─── SVG Bağlantı Çizgileri ─────────────────────────────────

const NODE_W = 190
const NODE_H = 80

function ConnectionLines({ connections, nodes, activeConnection }: {
  connections: SimConnection[]
  nodes: SimNode[]
  activeConnection: string | null
}) {
  const getNodeCenter = (id: string) => {
    const n = nodes.find(n => n.id === id)
    if (!n) return { x: 0, y: 0 }
    return { x: n.x + NODE_W / 2, y: n.y + NODE_H / 2 }
  }

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <path d="M0,0 L8,3 L0,6" fill="#475569" />
        </marker>
        <marker id="arrow-active" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <path d="M0,0 L8,3 L0,6" fill="#22d3ee" />
        </marker>
      </defs>
      {connections.map((conn) => {
        const from = getNodeCenter(conn.from)
        const to = getNodeCenter(conn.to)
        const isActive = activeConnection === `${conn.from}-${conn.to}`

        // Determine path direction
        const dx = to.x - from.x
        const dy = to.y - from.y

        let startX = from.x, startY = from.y, endX = to.x, endY = to.y

        // Adjust start/end to node edges
        if (Math.abs(dx) > Math.abs(dy)) {
          // Horizontal connection
          startX = dx > 0 ? from.x + NODE_W / 2 : from.x - NODE_W / 2
          endX = dx > 0 ? to.x - NODE_W / 2 : to.x + NODE_W / 2
        } else {
          // Vertical connection
          startY = dy > 0 ? from.y + NODE_H / 2 : from.y - NODE_H / 2
          endY = dy > 0 ? to.y - NODE_H / 2 : to.y + NODE_H / 2
        }

        // Create smooth path with curves for diagonal connections
        const midX = (startX + endX) / 2
        const midY = (startY + endY) / 2
        const path = Math.abs(dx) > 10 && Math.abs(dy) > 10
          ? `M ${startX} ${startY} Q ${startX} ${midY} ${midX} ${midY} Q ${endX} ${midY} ${endX} ${endY}`
          : `M ${startX} ${startY} L ${endX} ${endY}`

        return (
          <g key={`${conn.from}-${conn.to}`}>
            <path
              d={path}
              fill="none"
              stroke={isActive ? '#22d3ee' : '#334155'}
              strokeWidth={isActive ? 2.5 : 1.5}
              strokeDasharray={isActive ? undefined : '6 4'}
              markerEnd={isActive ? 'url(#arrow-active)' : 'url(#arrow)'}
              className={isActive ? 'drop-shadow-[0_0_6px_rgba(34,211,238,0.5)]' : ''}
            />
            {conn.label && (
              <text
                x={midX}
                y={midY - 8}
                textAnchor="middle"
                className="text-[10px] fill-slate-500"
              >
                {conn.label}
              </text>
            )}
            {/* Animated dot along the path when active */}
            {isActive && (
              <circle r="4" fill="#22d3ee" className="drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">
                <animateMotion dur="1s" repeatCount="indefinite">
                  <mpath href={`#path-${conn.from}-${conn.to}`} />
                </animateMotion>
              </circle>
            )}
            {/* Hidden path for animation reference */}
            <path
              id={`path-${conn.from}-${conn.to}`}
              d={path}
              fill="none"
              stroke="none"
            />
          </g>
        )
      })}
    </svg>
  )
}

// ─── İstatistik Paneli ──────────────────────────────────────

function StatsPanel({ nodes, logs, elapsedMs }: {
  nodes: SimNode[]
  logs: LogEntry[]
  elapsedMs: number
}) {
  const completed = nodes.filter(n => n.status === 'completed').length
  const total = nodes.length
  const failed = nodes.filter(n => n.status === 'failed').length
  const active = nodes.find(n => n.status === 'active')

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3 text-center">
        <div className="text-2xl font-bold text-cyan-400">{completed}/{total}</div>
        <div className="text-xs text-slate-400 mt-1">Tamamlanan Adım</div>
      </div>
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3 text-center">
        <div className="text-2xl font-bold text-emerald-400">{logs.filter(l => l.type === 'success').length}</div>
        <div className="text-xs text-slate-400 mt-1">Başarılı Kontrol</div>
      </div>
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3 text-center">
        <div className="text-2xl font-bold text-amber-400">{(elapsedMs / 1000).toFixed(1)}s</div>
        <div className="text-xs text-slate-400 mt-1">Geçen Süre</div>
      </div>
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3 text-center">
        <div className="text-2xl font-bold text-purple-400">{active?.shortLabel || '—'}</div>
        <div className="text-xs text-slate-400 mt-1">Aktif Robot</div>
      </div>
    </div>
  )
}

// ─── Mimari Notlar Paneli ───────────────────────────────────

function ArchitectureNotes() {
  const notes = [
    { icon: '🔴', title: 'İki-Geçiş CEO Havuzu', desc: 'Şu an tek geçiş var. 1. geçiş: gereksinim belgesi + Patron pipeline seçimi, 2. geçiş: üretim sonucu + Patron onayı olmalı.', severity: 'critical' },
    { icon: '🟡', title: 'Token Takibi Bellekte', desc: 'CELF Motor token bütçesi sunucu bellekte — restart\'ta sıfırlanır. DB\'ye taşınmalı.', severity: 'warning' },
    { icon: '🟡', title: 'Üretim Havuzu Bağlantısız', desc: 'uretim-havuzu.ts hiçbir yerden çağrılmıyor. job-generator.ts ile entegre edilmeli.', severity: 'warning' },
    { icon: '🟢', title: 'Claude İç Denetim', desc: 'Her direktörlükte Claude iç denetim doğru çalışıyor (Altın Kural #4).', severity: 'ok' },
    { icon: '🟢', title: 'Tekrar Engeli', desc: 'CELF Motor hash tabanlı tekrar tespiti aktif (15dk pencere).', severity: 'ok' },
    { icon: '🔴', title: 'State Machine Eksik', desc: 'İş durumları basit string — proper state machine ile geçişler kontrol edilmeli.', severity: 'critical' },
  ]

  return (
    <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-4">
      <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-400" />
        Mimari Analiz Notları
      </h3>
      <div className="space-y-2">
        {notes.map((note, i) => (
          <div key={i} className="flex items-start gap-2 text-xs">
            <span className="mt-0.5 shrink-0">{note.icon}</span>
            <div>
              <span className="font-medium text-slate-200">{note.title}:</span>{' '}
              <span className="text-slate-400">{note.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── ANA SAYFA BİLEŞENİ ─────────────────────────────────────

export default function SimulasyonPage() {
  const [nodes, setNodes] = useState<SimNode[]>(INITIAL_NODES)
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [command, setCommand] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [activeConnection, setActiveConnection] = useState<string | null>(null)
  const [selectedNode, setSelectedNode] = useState<SimNode | null>(null)
  const [currentStepIndex, setCurrentStepIndex] = useState(-1)
  const [elapsedMs, setElapsedMs] = useState(0)

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const abortRef = useRef(false)
  const logEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll log
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  // Elapsed timer
  useEffect(() => {
    if (isRunning && !isPaused) {
      timerRef.current = setInterval(() => {
        setElapsedMs((prev: number) => prev + 100)
      }, 100)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [isRunning, isPaused])

  const reset = useCallback(() => {
    abortRef.current = true
    setNodes(INITIAL_NODES)
    setLogs([])
    setIsRunning(false)
    setIsPaused(false)
    setActiveConnection(null)
    setSelectedNode(null)
    setCurrentStepIndex(-1)
    setElapsedMs(0)
    if (timerRef.current) clearInterval(timerRef.current)
    setTimeout(() => { abortRef.current = false }, 100)
  }, [])

  const runSimulation = useCallback(async (cmd: string) => {
    if (isRunning) return
    reset()
    // Wait for reset
    await new Promise(r => setTimeout(r, 150))
    abortRef.current = false
    setIsRunning(true)

    const steps = buildSimSteps(cmd)

    for (let i = 0; i < steps.length; i++) {
      if (abortRef.current) break

      const step = steps[i]
      setCurrentStepIndex(i)

      // Set current node active
      setNodes((prev: SimNode[]) => prev.map((n: SimNode) =>
        n.id === step.nodeId
          ? { ...n, status: 'active' as NodeStatus, detail: step.detail }
          : n
      ))

      // Set active connection (from previous node)
      if (i > 0) {
        const prevNode = steps[i - 1].nodeId
        setActiveConnection(`${prevNode}-${step.nodeId}`)
      }

      // Add log
      setLogs((prev: LogEntry[]) => [...prev, {
        timestamp: Date.now(),
        node: step.nodeId,
        message: step.log,
        type: step.logType,
      }])

      // Wait for step duration
      await new Promise<void>((resolve) => {
        const checkPause = setInterval(() => {
          if (abortRef.current) { clearInterval(checkPause); resolve(); return }
        }, 100)

        setTimeout(() => {
          clearInterval(checkPause)
          resolve()
        }, step.duration)
      })

      if (abortRef.current) break

      // Mark node completed
      setNodes((prev: SimNode[]) => prev.map((n: SimNode) =>
        n.id === step.nodeId
          ? { ...n, status: (step.logType === 'error' ? 'failed' : step.nodeId === 'ceo_pool' ? 'waiting' : 'completed') as NodeStatus }
          : n
      ))
    }

    setActiveConnection(null)
    setIsRunning(false)
    setCurrentStepIndex(-1)

    if (!abortRef.current) {
      setLogs((prev: LogEntry[]) => [...prev, {
        timestamp: Date.now(),
        node: 'system',
        message: 'Simülasyon tamamlandı! Tüm akış başarıyla çalıştı.',
        type: 'success',
      }])
    }
  }, [isRunning, reset])

  return (
    <div className="min-h-screen bg-[#0a0e17] text-white p-4 lg:p-6">
      {/* Başlık */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <Zap className="w-7 h-7 text-cyan-400" />
          YİSA-S Canlı Simülasyon
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Sistem akışını görsel olarak izleyin — komut girin, robotların çalışmasını takip edin
        </p>
      </div>

      {/* Komut Girişi */}
      <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={command}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCommand(e.target.value)}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => { if (e.key === 'Enter' && command.trim() && !isRunning) runSimulation(command.trim()) }}
              placeholder="Patron komutu girin... (örn: Franchise için logo tasarla)"
              className="w-full bg-slate-900/80 border border-slate-600 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30"
              disabled={isRunning}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => command.trim() && runSimulation(command.trim())}
              disabled={isRunning || !command.trim()}
              className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
            >
              {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              {isRunning ? 'Çalışıyor...' : 'Başlat'}
            </button>
            <button
              onClick={reset}
              className="px-3 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Örnek komutlar */}
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="text-xs text-slate-500">Örnekler:</span>
          {SAMPLE_COMMANDS.map((s) => (
            <button
              key={s.label}
              onClick={() => { setCommand(s.command); if (!isRunning) runSimulation(s.command) }}
              disabled={isRunning}
              className="px-2.5 py-1 text-xs bg-slate-700/60 hover:bg-slate-600/60 disabled:opacity-40 text-slate-300 rounded-md transition-colors border border-slate-600/50"
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* İstatistikler */}
      <div className="mb-6">
        <StatsPanel nodes={nodes} logs={logs} elapsedMs={elapsedMs} />
      </div>

      {/* Ana İçerik: Flow Diagram + Log */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Flow Diagram — 2/3 */}
        <div className="xl:col-span-2">
          <div className="bg-slate-800/20 border border-slate-700/50 rounded-xl p-4 overflow-x-auto">
            <div className="relative" style={{ width: 730, height: 580, minWidth: 730 }}>
              {/* Bağlantı çizgileri */}
              <ConnectionLines
                connections={CONNECTIONS}
                nodes={nodes}
                activeConnection={activeConnection}
              />

              {/* Düğümler */}
              {nodes.map(node => {
                const IconComponent = ICON_MAP[node.icon]
                return (
                  <motion.div
                    key={node.id}
                    className={`absolute cursor-pointer border-2 rounded-xl p-3 transition-all duration-300 ${statusColor(node.status)}`}
                    style={{
                      left: node.x,
                      top: node.y,
                      width: NODE_W,
                      height: NODE_H,
                      zIndex: 10,
                    }}
                    onClick={() => setSelectedNode(node)}
                    initial={false}
                    animate={node.status === 'active' ? { scale: [1, 1.03, 1] } : { scale: 1 }}
                    transition={{ duration: 0.8, repeat: node.status === 'active' ? Infinity : 0, repeatType: 'reverse' }}
                  >
                    <div className="flex items-center gap-2">
                      <IconComponent className={`w-4 h-4 shrink-0 ${
                        node.status === 'active' ? 'text-cyan-400' :
                        node.status === 'completed' ? 'text-emerald-400' :
                        node.status === 'failed' ? 'text-red-400' :
                        node.status === 'waiting' ? 'text-amber-400' :
                        'text-slate-400'
                      }`} />
                      <span className="text-xs font-semibold text-white truncate">{node.shortLabel}</span>
                      <div className={`w-2 h-2 rounded-full ml-auto shrink-0 ${statusDot(node.status)}`} />
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1.5 leading-tight line-clamp-2">
                      {node.detail || node.description}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Seçili düğüm detayı */}
          <AnimatePresence>
            {selectedNode && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-3 bg-slate-800/50 border border-slate-600 rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-white">{selectedNode.label}</h3>
                  <button
                    onClick={() => setSelectedNode(null)}
                    className="text-xs text-slate-500 hover:text-slate-300"
                  >
                    Kapat
                  </button>
                </div>
                <p className="text-xs text-slate-400">{selectedNode.description}</p>
                {selectedNode.detail && (
                  <div className="mt-2 bg-slate-900/50 rounded-lg p-2 text-xs text-cyan-300 font-mono">
                    {selectedNode.detail}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sağ Panel: Log + Notlar — 1/3 */}
        <div className="space-y-4">
          {/* Canlı Log */}
          <div className="bg-slate-800/30 border border-slate-700 rounded-xl">
            <div className="px-4 py-3 border-b border-slate-700/50 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-semibold text-slate-300">Canlı Akış Logu</span>
              {isRunning && <Loader2 className="w-3 h-3 text-cyan-400 animate-spin ml-auto" />}
            </div>
            <div className="p-3 h-[320px] overflow-y-auto font-mono text-xs space-y-1.5 custom-scrollbar">
              {logs.length === 0 && (
                <div className="text-slate-500 text-center py-8">
                  Simülasyon başlatmak için bir komut girin...
                </div>
              )}
              {logs.map((log, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-2"
                >
                  <ChevronRight className={`w-3 h-3 mt-0.5 shrink-0 ${logTypeColor(log.type)}`} />
                  <span className={logTypeColor(log.type)}>{log.message}</span>
                </motion.div>
              ))}
              <div ref={logEndRef} />
            </div>
          </div>

          {/* Mimari Notlar */}
          <ArchitectureNotes />

          {/* Akış Özeti */}
          <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
              <Truck className="w-4 h-4 text-purple-400" />
              Komut Yolculuğu (14 Adım)
            </h3>
            <div className="space-y-1 text-xs text-slate-400">
              {[
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
              ].map((step, i) => {
                const completed = currentStepIndex >= i
                const active = currentStepIndex === i
                return (
                  <div key={i} className={`flex items-center gap-2 py-0.5 ${active ? 'text-cyan-300 font-medium' : completed ? 'text-emerald-400' : ''}`}>
                    {completed ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                    ) : active ? (
                      <Loader2 className="w-3 h-3 text-cyan-400 animate-spin shrink-0" />
                    ) : (
                      <Clock className="w-3 h-3 text-slate-600 shrink-0" />
                    )}
                    <span>{i + 1}. {step}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Custom scrollbar CSS */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #475569;
        }
      `}</style>
    </div>
  )
}
