'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { startTaskFlow, FLOW_DESCRIPTION } from '@/lib/assistant/task-flow'
import { QUALITY_FLOW } from '@/lib/ai-router'
import { checkPatronLock } from '@/lib/security/patron-lock'
import { PatronApprovalUI } from '@/app/components/PatronApproval'
import { Send, Bot, Check, X, Edit3, ChevronDown, ChevronUp } from 'lucide-react'

type ChatMessage = {
  role: 'user' | 'assistant'
  text: string
  assignedAI?: string
  taskType?: string
  /** Seçenek 2 flow: bu yanıtta çalışan AI listesi */
  aiProviders?: string[]
}

type PatronDecision = 'approve' | 'reject' | 'modify'

const STEP_LABELS = ['GPT algılıyor...', 'Claude kontrol ediyor...', 'Patrona sunuluyor...']

export default function DashboardPage() {
  const [user, setUser] = useState<{ id?: string; email?: string } | null>(null)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState('')
  const [chatSending, setChatSending] = useState(false)
  const [lockError, setLockError] = useState<string | null>(null)
  const [decisions, setDecisions] = useState<Record<number, PatronDecision>>({})
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editText, setEditText] = useState('')
  const [showFlow, setShowFlow] = useState(false)
  /** Seçenek 2: flow modu (PATRON → GPT → [Gemini/...] → CLAUDE → ...) */
  const [useQualityFlow, setUseQualityFlow] = useState(true)
  const [currentStepLabel, setCurrentStepLabel] = useState<string | null>(null)
  const [pendingApproval, setPendingApproval] = useState<{
    output: Record<string, unknown>
    aiResponses: { provider: string; response: unknown }[]
    flow: string
    message: string
    command_id?: string
    displayText?: string
    director_key?: string
  } | null>(null)
  /** Onaylandı, rutin/bir seferlik seçimi bekleniyor */
  const [approvedWaitingRoutineChoice, setApprovedWaitingRoutineChoice] = useState<{
    command_id: string
    message: string
    director_key?: string
  } | null>(null)
  /** Rutin adımı: 'choice' = Rutin/Bir seferlik, 'schedule' = Günlük/Haftalık/Aylık */
  const [routineStep, setRoutineStep] = useState<'choice' | 'schedule' | null>(null)
  /** İmla düzeltme sonrası: "Bu mu demek istediniz?" paneli */
  const [pendingSpellingConfirmation, setPendingSpellingConfirmation] = useState<{
    correctedMessage: string
    originalMessage: string
  } | null>(null)
  /** Özel iş bitince: "Kaydetmek ister misiniz?" paneli */
  const [pendingPrivateSave, setPendingPrivateSave] = useState<{
    command: string
    result: string
  } | null>(null)
  /** Onay/Reddet/Değiştir işlemi sürerken */
  const [approvalBusy, setApprovalBusy] = useState(false)
  const [stats, setStats] = useState({
    franchiseRevenueMonth: 0,
    expensesMonth: 0,
    activeFranchises: 0,
    pendingApprovals: 0,
    newFranchiseApplications: 0,
  })
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user: u } }) =>
      setUser(u ? { id: u.id, email: u.email ?? undefined } : null)
    )
  }, [])

  useEffect(() => {
    if (!chatSending || !useQualityFlow) return
    let idx = 0
    setCurrentStepLabel(STEP_LABELS[0])
    const t = setInterval(() => {
      idx = (idx + 1) % STEP_LABELS.length
      setCurrentStepLabel(STEP_LABELS[idx])
    }, 2500)
    return () => clearInterval(t)
  }, [chatSending, useQualityFlow])

  useEffect(() => {
    fetch('/api/stats')
      .then((r) => r.json())
      .then((d) =>
        setStats({
          franchiseRevenueMonth: Number(d?.franchiseRevenueMonth) ?? Number(d?.revenueMonth) ?? 0,
          expensesMonth: Number(d?.expensesMonth) ?? 0,
          activeFranchises: Number(d?.activeFranchises) ?? 0,
          pendingApprovals: Number(d?.pendingApprovals) ?? 0,
          newFranchiseApplications: Number(d?.newFranchiseApplications) ?? Number(d?.demoRequests) ?? 0,
        })
      )
      .catch(() => {})
  }, [])

  const handleSendChat = async () => {
    const msg = chatInput.trim()
    if (!msg || chatSending) return

    setLockError(null)
    setPendingApproval(null)
    setPendingSpellingConfirmation(null)
    setPendingPrivateSave(null)

    const lockCheck = checkPatronLock(msg)
    if (!lockCheck.allowed) {
      setLockError(lockCheck.reason ?? 'Bu işlem AI için yasaktır.')
      return
    }

    setChatInput('')
    setChatMessages((prev) => [...prev, { role: 'user', text: msg }])
    setChatSending(true)

    if (useQualityFlow) {
      try {
        const res = await fetch('/api/chat/flow', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: msg,
            user: user ?? undefined,
            user_id: user?.id ?? undefined,
          }),
        })
        const data = await res.json()
        setCurrentStepLabel(null)

        if (data.error) {
          setChatMessages((prev) => [
            ...prev,
            { role: 'assistant', text: `Hata: ${data.error}`, aiProviders: [] },
          ])
        } else if (data.status === 'spelling_confirmation') {
          const corrected = data.correctedMessage ?? msg
          setChatMessages((prev) => [
            ...prev,
            { role: 'assistant', text: `📝 Bu mu demek istediniz?\n\n"${corrected}"`, aiProviders: ['GPT'] },
          ])
          setPendingSpellingConfirmation({ correctedMessage: corrected, originalMessage: msg })
        } else if (data.status === 'private_done') {
          const text = data.text ?? 'Yanıt oluşturulamadı.'
          setChatMessages((prev) => [
            ...prev,
            { role: 'assistant', text, aiProviders: ['CLAUDE'] },
          ])
          if (data.ask_save && data.command_used) {
            setPendingPrivateSave({ command: data.command_used, result: text })
          }
        } else if (data.status === 'private_saved') {
          setChatMessages((prev) => [
            ...prev,
            { role: 'assistant', text: '✅ Kendi alanınıza kaydedildi.', aiProviders: [] },
          ])
          setPendingPrivateSave(null)
        } else {
          const responses = data.aiResponses ?? []
          const aiProviders = responses
            .filter((r: { provider: string; response?: { status?: string; text?: string } }) => {
              const res = r.response
              return res && ((res as { status?: string }).status === 'ok' || typeof (res as { text?: string }).text === 'string')
            })
            .map((r: { provider: string }) => r.provider)
          const text = data.text ?? 'Yanıt oluşturuldu.'
          if (data.status === 'awaiting_patron_approval') {
            setPendingApproval({
              output: data.output ?? {},
              aiResponses: data.aiResponses ?? [],
              flow: data.flow ?? QUALITY_FLOW.name,
              message: msg,
              command_id: data.command_id,
              displayText: typeof data.text === 'string' ? data.text : undefined,
              director_key: data.director_key,
            })
          }
          setChatMessages((prev) => [
            ...prev,
            { role: 'assistant', text, aiProviders, taskType: data.output?.taskType },
          ])
        }
      } catch {
        setCurrentStepLabel(null)
        setChatMessages((prev) => [
          ...prev,
          { role: 'assistant', text: 'Bağlantı hatası. Tekrar dene.', aiProviders: [] },
        ])
      } finally {
        setChatSending(false)
      }
      return
    }

    const flow = startTaskFlow(msg)
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
          user_id: user?.id ?? undefined,
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

  /** İmla onayı: Evet Şirket İşi / Evet Özel İş → flow'a confirm_type ile tekrar istek */
  const handleConfirmationChoice = async (confirmType: 'company' | 'private', correctedMessage: string) => {
    if (chatSending || !correctedMessage.trim()) return
    setPendingSpellingConfirmation(null)
    setChatSending(true)
    setCurrentStepLabel(confirmType === 'company' ? 'Şirket işi işleniyor...' : 'Özel iş işleniyor...')
    try {
      const res = await fetch('/api/chat/flow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: correctedMessage,
          confirm_type: confirmType,
          corrected_message: correctedMessage,
          user: user ?? undefined,
          user_id: user?.id ?? undefined,
        }),
      })
      const data = await res.json()
      setCurrentStepLabel(null)
      if (data.error) {
        setChatMessages((prev) => [
          ...prev,
          { role: 'assistant', text: `Hata: ${data.error}`, aiProviders: [] },
        ])
      } else if (data.status === 'spelling_confirmation') {
        const corrected = data.correctedMessage ?? correctedMessage
        setChatMessages((prev) => [
          ...prev,
          { role: 'assistant', text: `📝 Bu mu demek istediniz?\n\n"${corrected}"`, aiProviders: ['GPT'] },
        ])
        setPendingSpellingConfirmation({ correctedMessage: corrected, originalMessage: correctedMessage })
      } else if (data.status === 'private_done') {
        const text = data.text ?? 'Yanıt oluşturulamadı.'
        setChatMessages((prev) => [
          ...prev,
          { role: 'assistant', text, aiProviders: ['CLAUDE'] },
        ])
        if (data.ask_save && data.command_used) {
          setPendingPrivateSave({ command: data.command_used, result: text })
        }
      } else if (data.status === 'private_saved') {
        setChatMessages((prev) => [
          ...prev,
          { role: 'assistant', text: '✅ Kendi alanınıza kaydedildi.', aiProviders: [] },
        ])
        setPendingPrivateSave(null)
      } else if (data.status === 'awaiting_patron_approval') {
        setPendingApproval({
          output: data.output ?? {},
          aiResponses: data.aiResponses ?? [],
          flow: data.flow ?? QUALITY_FLOW.name,
          message: correctedMessage,
          command_id: data.command_id,
          displayText: typeof data.text === 'string' ? data.text : undefined,
        })
        setChatMessages((prev) => [
          ...prev,
          { role: 'assistant', text: data.text ?? 'Patron onayı bekleniyor.', aiProviders: data.ai_providers ?? [], taskType: data.output?.taskType },
        ])
      } else {
        setChatMessages((prev) => [
          ...prev,
          { role: 'assistant', text: data.text ?? 'Yanıt oluşturuldu.', aiProviders: [] },
        ])
      }
    } catch {
      setCurrentStepLabel(null)
      setChatMessages((prev) => [
        ...prev,
        { role: 'assistant', text: 'Bağlantı hatası. Tekrar dene.', aiProviders: [] },
      ])
    } finally {
      setChatSending(false)
    }
  }

  /** Özel iş: Evet Kaydet → patron_private_tasks'a kaydet */
  const handlePrivateSave = async (save: boolean) => {
    if (!pendingPrivateSave || approvalBusy) return
    setPendingPrivateSave(null)
    if (!save) return
    setApprovalBusy(true)
    try {
      const res = await fetch('/api/chat/flow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          save_private: true,
          private_command: pendingPrivateSave.command,
          private_result: pendingPrivateSave.result,
          user_id: user?.id ?? undefined,
        }),
      })
      const data = await res.json()
      if (data.error) {
        setChatMessages((prev) => [
          ...prev,
          { role: 'assistant', text: `Kaydetme hatası: ${data.error}`, aiProviders: [] },
        ])
      } else {
        setChatMessages((prev) => [
          ...prev,
          { role: 'assistant', text: '✅ Kendi alanınıza kaydedildi.', aiProviders: [] },
        ])
      }
    } catch {
      setChatMessages((prev) => [
        ...prev,
        { role: 'assistant', text: 'Kaydetme sırasında bağlantı hatası.', aiProviders: [] },
      ])
    } finally {
      setApprovalBusy(false)
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

      {/* Patron paneli: franchise gelir, gider, aktif franchise, onay kuyruğu, yeni başvurular */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <p className="text-slate-400 text-sm mb-1">Franchise Geliri (Bu Ay)</p>
          <p className="text-2xl font-bold text-amber-400">₺{stats.franchiseRevenueMonth.toLocaleString('tr-TR')}</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <p className="text-slate-400 text-sm mb-1">Gider (Bu Ay)</p>
          <p className="text-2xl font-bold text-rose-400">₺{stats.expensesMonth.toLocaleString('tr-TR')}</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <p className="text-slate-400 text-sm mb-1">Aktif Franchise</p>
          <p className="text-2xl font-bold text-white">{stats.activeFranchises}</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <p className="text-slate-400 text-sm mb-1">Onay Bekleyen</p>
          <p className="text-2xl font-bold text-amber-400">{stats.pendingApprovals}</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <p className="text-slate-400 text-sm mb-1">Yeni Başvuru / Demo</p>
          <p className="text-2xl font-bold text-emerald-400">{stats.newFranchiseApplications}</p>
        </div>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden flex flex-col">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-700">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
            <Bot className="text-amber-400" size={22} />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-white">YİSA-S Robot Asistan</h2>
            <p className="text-xs text-slate-500">
              {useQualityFlow ? 'Seçenek 2: Kalite Optimize — GPT → [Gemini/...] → Claude → Patron' : 'Router + Task Flow + Patron Lock'}
            </p>
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-400">
            <input
              type="checkbox"
              checked={useQualityFlow}
              onChange={(e) => setUseQualityFlow(e.target.checked)}
              className="rounded border-slate-600 bg-slate-800 text-amber-500 focus:ring-amber-500/50"
            />
            <span>Seçenek 2 (Kalite)</span>
          </label>
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
              {useQualityFlow
                ? `PATRON → GPT (Algılama) → [GEMINI/TOGETHER/V0 gerekiyorsa] → CLAUDE (Düzeltme) → CURSOR (Kod) → GPT (Toplama) → CLAUDE (Son Kontrol) → PATRONA SUN\n\n${QUALITY_FLOW.name} — Kalite: ${QUALITY_FLOW.quality} — Tahmini: ${QUALITY_FLOW.monthlyCost}`
                : FLOW_DESCRIPTION}
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
                {m.role === 'assistant' && (m.aiProviders?.length ? m.aiProviders.length > 0 : m.assignedAI || m.taskType) && (
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {m.aiProviders?.length
                      ? m.aiProviders.map((ai) => (
                          <span
                            key={ai}
                            className="text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-md text-white"
                            style={{
                              backgroundColor:
                                ai === 'GPT' ? '#10a37f' :
                                ai === 'CLAUDE' ? '#d97706' :
                                ai === 'GEMINI' ? '#4285f4' :
                                ai === 'TOGETHER' ? '#6366f1' :
                                ai === 'V0' ? '#000' :
                                ai === 'CURSOR' ? '#00d8ff' :
                                '#64748b',
                              color: ai === 'CURSOR' ? '#000' : '#fff',
                            }}
                          >
                            {ai}
                          </span>
                        ))
                      : (
                        <>
                          <span className="text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400">
                            {m.assignedAI ?? 'CLAUDE'}
                          </span>
                          {m.taskType && m.taskType !== 'unknown' && (
                            <span className="text-[10px] text-slate-500">{m.taskType}</span>
                          )}
                        </>
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
                {currentStepLabel ?? 'Yanıt yazılıyor…'}
              </div>
            </div>
          )}
          {pendingSpellingConfirmation && (
            <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 space-y-3">
              <h3 className="font-semibold text-amber-400">📝 Bu mu demek istediniz?</h3>
              <p className="text-sm text-slate-300">&quot;{pendingSpellingConfirmation.correctedMessage}&quot;</p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleConfirmationChoice('company', pendingSpellingConfirmation!.correctedMessage)}
                  disabled={chatSending}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 text-sm font-medium transition-colors disabled:opacity-50"
                >
                  <Check size={14} />
                  Evet, Şirket İşi
                </button>
                <button
                  type="button"
                  onClick={() => handleConfirmationChoice('private', pendingSpellingConfirmation!.correctedMessage)}
                  disabled={chatSending}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 text-sm font-medium transition-colors disabled:opacity-50"
                >
                  <Check size={14} />
                  Evet, Özel İş
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setChatInput(pendingSpellingConfirmation!.correctedMessage)
                    setPendingSpellingConfirmation(null)
                  }}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-600 text-slate-300 hover:bg-slate-500 text-sm font-medium transition-colors"
                >
                  <X size={14} />
                  Hayır, Düzelt
                </button>
              </div>
            </div>
          )}
          {approvedWaitingRoutineChoice && (
            <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4 space-y-3">
              <h3 className="font-semibold text-emerald-400">📁 Bu görevi nasıl kaydetmek istersiniz?</h3>
              {routineStep === null || routineStep === 'choice' ? (
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setRoutineStep('schedule')}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 text-sm font-medium transition-colors"
                  >
                    📅 Rutin Görev
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setApprovedWaitingRoutineChoice(null)
                      setRoutineStep(null)
                      setChatMessages((prev) => [
                        ...prev,
                        { role: 'assistant', text: 'Bir seferlik olarak kaydedildi.', aiProviders: [] },
                      ])
                    }}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-600 text-slate-300 hover:bg-slate-500 text-sm font-medium transition-colors"
                  >
                    1️⃣ Bir Seferlik
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-slate-400">Sıklık seçin:</p>
                  <div className="flex flex-wrap gap-2">
                    {(['daily', 'weekly', 'monthly'] as const).map((schedule) => (
                      <button
                        key={schedule}
                        type="button"
                        onClick={async () => {
                          setApprovalBusy(true)
                          try {
                            const res = await fetch('/api/approvals', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                command_id: approvedWaitingRoutineChoice.command_id,
                                save_routine: true,
                                schedule,
                                user_id: user?.id,
                              }),
                            })
                            const data = await res.json()
                            setApprovedWaitingRoutineChoice(null)
                            setRoutineStep(null)
                            setChatMessages((prev) => [
                              ...prev,
                              {
                                role: 'assistant',
                                text: data.message ?? `Rutin kaydedildi (${schedule === 'daily' ? 'Günlük' : schedule === 'weekly' ? 'Haftalık' : 'Aylık'}). COO zamanı gelince çalıştıracak.`,
                                aiProviders: [],
                              },
                            ])
                          } catch {
                            setChatMessages((prev) => [
                              ...prev,
                              { role: 'assistant', text: 'Rutin kaydedilirken hata.', aiProviders: [] },
                            ])
                          } finally {
                            setApprovalBusy(false)
                          }
                        }}
                        disabled={approvalBusy}
                        className="px-3 py-2 rounded-lg bg-slate-600 text-slate-300 hover:bg-slate-500 text-sm font-medium disabled:opacity-50"
                      >
                        {schedule === 'daily' ? 'Günlük' : schedule === 'weekly' ? 'Haftalık' : 'Aylık'}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          {pendingPrivateSave && (
            <div className="rounded-2xl border border-blue-500/40 bg-blue-500/10 p-4 space-y-3">
              <h3 className="font-semibold text-blue-400">İş tamamlandı. Kendi alanınıza kaydetmek ister misiniz?</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handlePrivateSave(true)}
                  disabled={approvalBusy}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 text-sm font-medium transition-colors disabled:opacity-50"
                >
                  <Check size={14} />
                  Evet, Kaydet
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPendingPrivateSave(null)
                    setChatMessages((prev) => [
                      ...prev,
                      { role: 'assistant', text: 'Kaydetmediniz. İsterseniz başka bir iş yapabilirsiniz.', aiProviders: [] },
                    ])
                  }}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-600 text-slate-300 hover:bg-slate-500 text-sm font-medium transition-colors"
                >
                  <X size={14} />
                  Hayır, Kaydetme
                </button>
              </div>
            </div>
          )}
          {pendingApproval && (
            <>
              {approvalBusy ? (
                <div className="patron-approval-panel rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-center text-amber-400">
                  <p className="font-medium">Çalışıyor...</p>
                  <p className="text-sm text-slate-400 mt-1">Patron kararı uygulanıyor</p>
                </div>
              ) : (
                <PatronApprovalUI
                  pendingTask={pendingApproval}
                  onApprove={async () => {
                    setApprovalBusy(true)
                    const msg = pendingApproval.message
                    const cmdId = pendingApproval.command_id
                    try {
                      const res = await fetch('/api/approvals', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          command_id: cmdId,
                          decision: 'approve',
                          user_id: user?.id,
                        }),
                      })
                      const data = await res.json()
                      const resultText =
                        data.result ??
                        pendingApproval.displayText ??
                        (pendingApproval.aiResponses
                          .filter((a) => {
                            const r = a.response as { status?: string; text?: string }
                            return r?.status === 'ok' && typeof r.text === 'string'
                          })
                          .map((a) => (a.response as { text: string }).text)
                          .pop())
                      setChatMessages((prev) => [
                        ...prev,
                        {
                          role: 'assistant',
                          text: `✅ Onaylandı. Sonuç uygulandı.\n\n${resultText ?? 'İşlem tamamlandı.'}`,
                          aiProviders: pendingApproval.aiResponses
                            .filter((a) => (a.response as { status?: string })?.status === 'ok')
                            .map((a) => a.provider),
                          taskType: pendingApproval.output?.taskType as string,
                        },
                      ])
                      setPendingApproval(null)
                      if (cmdId) {
                        setApprovedWaitingRoutineChoice({
                          command_id: cmdId,
                          message: msg,
                          director_key: pendingApproval.director_key,
                        })
                      }
                    } catch {
                      setChatMessages((prev) => [
                        ...prev,
                        {
                          role: 'assistant',
                          text: 'Onay gönderilirken bağlantı hatası. Tekrar deneyin.',
                          aiProviders: [],
                        },
                      ])
                    } finally {
                      setApprovalBusy(false)
                    }
                  }}
                  onSuggest={async () => {
                    if (!pendingApproval?.command_id) return
                    setApprovalBusy(true)
                    try {
                      const res = await fetch('/api/approvals', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          command_id: pendingApproval.command_id,
                          decision: 'suggest',
                          user_id: user?.id,
                        }),
                      })
                      const data = await res.json()
                      const suggestions = data.suggestions ?? 'Öneri alınamadı.'
                      setChatMessages((prev) => [
                        ...prev,
                        {
                          role: 'assistant',
                          text: `💡 Geliştirme önerileri:\n\n${suggestions}`,
                          aiProviders: ['GPT'],
                        },
                      ])
                    } catch {
                      setChatMessages((prev) => [
                        ...prev,
                        { role: 'assistant', text: 'Öneri alınırken bağlantı hatası.', aiProviders: [] },
                      ])
                    } finally {
                      setApprovalBusy(false)
                    }
                  }}
                  onReject={async () => {
                    setApprovalBusy(true)
                    try {
                      await fetch('/api/approvals', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          command_id: pendingApproval.command_id,
                          decision: 'reject',
                          user_id: user?.id,
                        }),
                      })
                      setChatMessages((prev) => [
                        ...prev,
                        {
                          role: 'assistant',
                          text: '❌ İptal edildi.',
                          aiProviders: [],
                        },
                      ])
                    } catch {
                      setChatMessages((prev) => [
                        ...prev,
                        {
                          role: 'assistant',
                          text: 'Red gönderilirken hata. Tekrar deneyin.',
                          aiProviders: [],
                        },
                      ])
                    } finally {
                      setPendingApproval(null)
                      setApprovalBusy(false)
                    }
                  }}
                  onModify={async (modifyText) => {
                    setApprovalBusy(true)
                    try {
                      await fetch('/api/approvals', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          command_id: pendingApproval.command_id,
                          decision: 'modify',
                          modify_text: modifyText,
                          user_id: user?.id,
                        }),
                      })
                      setChatInput(modifyText)
                      setChatMessages((prev) => [
                        ...prev,
                        {
                          role: 'assistant',
                          text: 'Değişiklik kaydedildi. Yeni talimatı yukarıya yazıp Gönder ile tekrar işleyin.',
                          aiProviders: [],
                        },
                      ])
                    } catch {
                      setChatMessages((prev) => [
                        ...prev,
                        {
                          role: 'assistant',
                          text: 'Değişiklik gönderilirken hata. Tekrar deneyin.',
                          aiProviders: [],
                        },
                      ])
                    } finally {
                      setPendingApproval(null)
                      setApprovalBusy(false)
                    }
                  }}
                />
              )}
            </>
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
