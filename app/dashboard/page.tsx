'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { startTaskFlow, FLOW_DESCRIPTION } from '@/lib/assistant/task-flow'
import { QUALITY_FLOW } from '@/lib/ai-router'
import { checkPatronLock } from '@/lib/security/patron-lock'
import { isPatron } from '@/lib/auth/roles'
import { PatronApprovalUI } from '@/app/components/PatronApproval'
import {
  Send,
  Bot,
  Check,
  X,
  Edit3,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  Play,
  Store,
  Maximize2,
  Minimize2,
  Search,
  ClipboardCheck,
  RefreshCw,
  Ban,
  Loader2,
  Copy,
  Terminal,
} from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

type ChatMessage = {
  role: 'user' | 'assistant'
  text: string
  assignedAI?: string
  taskType?: string
  aiProviders?: string[]
}

type PatronDecision = 'approve' | 'reject' | 'modify'

const STEP_LABELS = ['GPT algılıyor...', 'Claude kontrol ediyor...', 'Patrona sunuluyor...']

export default function DashboardPage() {
  const [user, setUser] = useState<{
    id?: string
    email?: string
    user_metadata?: { role?: string }
  } | null>(null)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState('')
  const [chatSending, setChatSending] = useState(false)
  const [lockError, setLockError] = useState<string | null>(null)
  const [decisions, setDecisions] = useState<Record<number, PatronDecision>>({})
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editText, setEditText] = useState('')
  const [showFlow, setShowFlow] = useState(false)
  const [useQualityFlow, setUseQualityFlow] = useState(true)
  const [assistantProvider, setAssistantProvider] = useState<'GPT' | 'GEMINI' | 'CLAUDE' | 'CLOUD' | 'V0' | 'CURSOR' | 'SUPABASE' | 'GITHUB' | 'VERCEL' | 'RAILWAY' | 'FAL'>('GEMINI')
  const [targetDirector, setTargetDirector] = useState<string>('')
  const [asRoutine, setAsRoutine] = useState(false)
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
  const [approvedWaitingRoutineChoice, setApprovedWaitingRoutineChoice] = useState<{
    command_id: string
    message: string
    director_key?: string
  } | null>(null)
  const [routineStep, setRoutineStep] = useState<'choice' | 'schedule' | null>(null)
  const [pendingSpellingConfirmation, setPendingSpellingConfirmation] = useState<{
    correctedMessage: string
    originalMessage: string
  } | null>(null)
  const [pendingPrivateSave, setPendingPrivateSave] = useState<{
    command: string
    result: string
  } | null>(null)
  const [approvalBusy, setApprovalBusy] = useState(false)

  // Genişletilebilir paneller
  const [statsExpanded, setStatsExpanded] = useState(true)
  const [chatExpanded, setChatExpanded] = useState(true)
  const [calendarView, setCalendarView] = useState<'day' | 'week'>('day')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [startupStatus, setStartupStatus] = useState<{
    summary?: { director: string; total: number; pending: number; completed: number }[]
    total_pending?: number
    next_tasks?: { id: string; name: string; directorKey: string }[]
  } | null>(null)
  const [startupTasksLoading, setStartupTasksLoading] = useState(false)

  const [stats, setStats] = useState({
    franchiseRevenueMonth: 0,
    expensesMonth: 0,
    activeFranchises: 0,
    pendingApprovals: 0,
    newFranchiseApplications: 0,
  })
  const [approvalItems, setApprovalItems] = useState<{
    id: string
    type: string
    title: string
    status: string
    created_at: string
    displayText?: string
    output_payload?: Record<string, unknown>
  }[]>([])
  const [previewItem, setPreviewItem] = useState<{
    id: string
    title: string
    displayText: string
    status: string
  } | null>(null)
  const [approvalLoading, setApprovalLoading] = useState(false)
  const [approvalActingId, setApprovalActingId] = useState<string | null>(null)
  const [queueExpanded, setQueueExpanded] = useState(true)
  const [suggestedCommand, setSuggestedCommand] = useState<string | null>(null)
  const [commandCopied, setCommandCopied] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  function extractCommandFromText(text: string): string | null {
    if (!text || typeof text !== 'string') return null
    const codeBlock = text.match(/```(?:bash|sh|powershell|ps1|cmd)?\s*\n?([\s\S]*?)```/)
    if (codeBlock?.[1]) return codeBlock[1].trim()
    const cdMatch = text.match(/(?:cd\s+[^\n]+|npm\s+run\s+[^\n]+)/)
    if (cdMatch) return cdMatch[0].trim()
    const patronMatch = text.match(/Patron\s+şunu\s+çalıştır[:\s]+([^\n]+)/i)
    if (patronMatch) return patronMatch[1].trim()
    return null
  }

  function setCommandFromMessage(text: string) {
    const cmd = extractCommandFromText(text)
    if (cmd) setSuggestedCommand(cmd)
  }

  async function copySuggestedCommand() {
    if (!suggestedCommand) return
    await navigator.clipboard.writeText(suggestedCommand)
    setCommandCopied(true)
    setTimeout(() => setCommandCopied(false), 2000)
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user: u } }) =>
      setUser(
        u
          ? {
              id: u.id,
              email: u.email ?? undefined,
              user_metadata: u.user_metadata as { role?: string } | undefined,
            }
          : null
      )
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

  useEffect(() => {
    fetch('/api/startup')
      .then((r) => r.json())
      .then((d) => setStartupStatus(d))
      .catch(() => {})
  }, [])

  const fetchApprovalQueue = () => {
    setApprovalLoading(true)
    fetch('/api/approvals')
      .then((r) => r.json())
      .then((d) => setApprovalItems(Array.isArray(d?.items) ? d.items : []))
      .catch(() => setApprovalItems([]))
      .finally(() => setApprovalLoading(false))
  }
  useEffect(() => {
    fetchApprovalQueue()
    const t = setInterval(fetchApprovalQueue, 30000)
    return () => clearInterval(t)
  }, [])

  const handleSendAsCommand = async () => {
    const lastUserMsg = [...chatMessages].reverse().find((m) => m.role === 'user')
    const msg = lastUserMsg?.text?.trim() ?? chatInput.trim()
    if (!msg || chatSending) return
    setLockError(null)
    const lockCheck = checkPatronLock(msg)
    if (!lockCheck.allowed) {
      setLockError(lockCheck.reason ?? 'Bu işlem AI için yasaktır.')
      return
    }
    setChatSending(true)
    setCurrentStepLabel('CEO\'ya gönderiliyor...')
    try {
      const res = await fetch('/api/chat/flow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: msg,
          send_as_command: true,
          confirm_type: 'company',
          confirmed_first_step: true,
          as_routine: asRoutine,
          target_director: targetDirector || undefined,
          user: user ?? undefined,
          user_id: user?.id ?? undefined,
          assistant_provider: assistantProvider,
          idempotency_key: crypto.randomUUID(),
        }),
      })
      const data = await res.json()
      setCurrentStepLabel(null)
      if (data.error) {
        setChatMessages((prev) => [...prev, { role: 'assistant', text: `Hata: ${data.error}`, aiProviders: [] }])
      } else if (data.status === 'awaiting_patron_approval') {
        const displayTextRaw = typeof data.text === 'string' ? data.text : undefined
        setPendingApproval({
          output: data.output ?? {},
          aiResponses: data.aiResponses ?? [],
          flow: data.flow ?? QUALITY_FLOW.name,
          message: msg,
          command_id: data.command_id,
          displayText: displayTextRaw,
          director_key: data.director_key,
        })
        setChatMessages((prev) => [
          ...prev,
          { role: 'assistant', text: displayTextRaw ?? 'Komut CEO\'ya gönderildi. Havuzda onay bekliyor.', aiProviders: data.ai_providers ?? [] },
        ])
        fetchApprovalQueue()
      } else if (data.status === 'pending_task_exists') {
        setChatMessages((prev) => [...prev, { role: 'assistant', text: data.message ?? 'Zaten bekleyen bir iş var.', aiProviders: [] }])
      } else if (data.status === 'celf_check_failed') {
        const errs = Array.isArray((data as { errors?: string[] }).errors) ? (data as { errors: string[] }).errors : []
        setChatMessages((prev) => [...prev, { role: 'assistant', text: errs.length ? `⚠️ ${errs.join(' ')}` : (data.message ?? 'CELF denetimi geçilemedi.'), aiProviders: [] }])
      } else {
        setChatMessages((prev) => [...prev, { role: 'assistant', text: data.message ?? data.text ?? 'İşlem tamamlandı.', aiProviders: [] }])
      }
    } catch {
      setCurrentStepLabel(null)
      setChatMessages((prev) => [...prev, { role: 'assistant', text: 'Bağlantı hatası.', aiProviders: [] }])
    } finally {
      setChatSending(false)
    }
  }

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
          assistant_provider: assistantProvider,
          as_routine: asRoutine,
          target_director: targetDirector || undefined,
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
          const spellingProvider = data.spellingProvider === 'GEMINI' ? 'GEMINI' : 'GPT'
          setChatMessages((prev) => [
            ...prev,
            { role: 'assistant', text: `📝 Bu mu demek istediniz?\n\n"${corrected}"`, aiProviders: [spellingProvider] },
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
        } else if (data.status === 'patron_approval_done') {
          const text = typeof data.text === 'string' ? data.text : 'Patron onayı uygulandı.'
          setPendingApproval(null)
          setChatMessages((prev) => [
            ...prev,
            { role: 'assistant', text: `✅ ${text}`, aiProviders: [] },
          ])
          fetchApprovalQueue()
        } else if (data.status === 'patron_conversation_done') {
          const text = typeof data.text === 'string' ? data.text : 'Yanıt oluşturulamadı.'
          const prov = data.ai_provider ?? 'CLAUDE'
          setChatMessages((prev) => [
            ...prev,
            { role: 'assistant', text, aiProviders: [prov] },
          ])
        } else if (data.status === 'patron_direct_done') {
          const text = typeof data.text === 'string' ? data.text : 'İşlem tamamlandı.'
          setChatMessages((prev) => [
            ...prev,
            { role: 'assistant', text, aiProviders: data.ai_providers ?? [], taskType: data.output?.taskType },
          ])
        } else if (data.status === 'awaiting_patron_approval') {
          const displayTextRaw = typeof data.text === 'string' ? data.text : undefined
          const errorReason = typeof (data as { error_reason?: string }).error_reason === 'string' ? (data as { error_reason: string }).error_reason : undefined
          setPendingApproval({
            output: data.output ?? {},
            aiResponses: data.aiResponses ?? [],
            flow: data.flow ?? QUALITY_FLOW.name,
            message: msg,
            command_id: data.command_id,
            displayText: displayTextRaw,
            director_key: data.director_key,
          })
          const messageToShow = displayTextRaw || errorReason || 'Patron onayı bekleniyor. (Onay kuyruğuna bakın.)'
          setChatMessages((prev) => [
            ...prev,
            { role: 'assistant', text: messageToShow, aiProviders: data.ai_providers ?? [], taskType: data.output?.taskType },
          ])
          fetchApprovalQueue()
        } else if (data.status === 'pending_task_exists') {
          setChatMessages((prev) => [
            ...prev,
            { role: 'assistant', text: data.message ?? 'Zaten bekleyen bir iş var. Önce onay kuyruğundan onu onaylayın veya reddedin.', aiProviders: [] },
          ])
        } else if (data.status === 'celf_check_failed') {
          const errs = Array.isArray((data as { errors?: string[] }).errors) ? (data as { errors: string[] }).errors : []
          setChatMessages((prev) => [
            ...prev,
            { role: 'assistant', text: errs.length ? `⚠️ ${errs.join(' ')}` : (data.message ?? 'CELF denetimi geçilemedi.'), aiProviders: [] },
          ])
        } else if (data.status === 'strategy_change_requires_approval' || data.status === 'requires_patron_approval') {
          setChatMessages((prev) => [
            ...prev,
            { role: 'assistant', text: data.message ?? 'Bu işlem Patron onayı gerektirir.', aiProviders: [] },
          ])
        } else {
          const fallback = data.message ?? data.text ?? ((data as { detail?: string }).detail ? `Hata: ${(data as { detail: string }).detail}` : null)
          setChatMessages((prev) => [
            ...prev,
            { role: 'assistant', text: fallback ?? 'Yanıt alınamadı. API anahtarlarını (.env) kontrol edin.', aiProviders: data.ai_providers ?? [] },
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
          assistant_provider: assistantProvider,
          as_routine: asRoutine,
          ...(confirmType === 'company' && {
            confirmed_first_step: true,
            idempotency_key: crypto.randomUUID(),
          }),
          target_director: targetDirector || undefined,
        }),
      })
      const data = await res.json()
      setCurrentStepLabel(null)
      if (data.error) {
        setChatMessages((prev) => [
          ...prev,
          { role: 'assistant', text: `Hata: ${data.error}`, aiProviders: [] },
        ])
      } else if (data.status === 'first_step_required') {
        setChatMessages((prev) => [
          ...prev,
          { role: 'assistant', text: data.message ?? 'Önce imla adımı tamamlanmalı.', aiProviders: [] },
        ])
      } else if (data.status === 'spelling_confirmation') {
        const corrected = data.correctedMessage ?? correctedMessage
        const spellingProvider = data.spellingProvider === 'GEMINI' ? 'GEMINI' : 'GPT'
        setChatMessages((prev) => [
          ...prev,
          { role: 'assistant', text: `📝 Bu mu demek istediniz?\n\n"${corrected}"`, aiProviders: [spellingProvider] },
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
      } else if (data.status === 'patron_direct_done') {
        const text = typeof data.text === 'string' ? data.text : 'İşlem tamamlandı.'
        setChatMessages((prev) => [
          ...prev,
          { role: 'assistant', text, aiProviders: data.ai_providers ?? [], taskType: data.output?.taskType },
        ])
      } else if (data.status === 'awaiting_patron_approval') {
        const displayTextRaw = typeof data.text === 'string' ? data.text : undefined
        const errorReason = typeof (data as { error_reason?: string }).error_reason === 'string' ? (data as { error_reason: string }).error_reason : undefined
        setPendingApproval({
          output: data.output ?? {},
          aiResponses: data.aiResponses ?? [],
          flow: data.flow ?? QUALITY_FLOW.name,
          message: correctedMessage,
          command_id: data.command_id,
          displayText: displayTextRaw ?? (errorReason ? undefined : 'Rapor/işlem sonucu bekleniyor'),
          director_key: data.director_key,
        })
        const messageToShow = displayTextRaw || errorReason || 'Patron onayı bekleniyor. (Rapor içeriği için Onay kuyruğuna bakın.)'
        setChatMessages((prev) => [
          ...prev,
          { role: 'assistant', text: messageToShow, aiProviders: data.ai_providers ?? [], taskType: data.output?.taskType },
        ])
      } else if (data.status === 'pending_task_exists') {
        setChatMessages((prev) => [
          ...prev,
          { role: 'assistant', text: data.message ?? 'Zaten bekleyen bir iş var. Önce onay kuyruğundan onu onaylayın veya reddedin.', aiProviders: [] },
        ])
      } else if (data.status === 'celf_check_failed') {
        const errs = Array.isArray((data as { errors?: string[] }).errors) ? (data as { errors: string[] }).errors : []
        const msg = errs.length ? errs.join(' ') : (data.message ?? 'CELF denetimi geçilemedi.')
        setChatMessages((prev) => [
          ...prev,
          { role: 'assistant', text: `⚠️ ${msg}`, aiProviders: [] },
        ])
      } else if (data.status === 'strategy_change_requires_approval' || data.status === 'requires_patron_approval') {
        setChatMessages((prev) => [
          ...prev,
          { role: 'assistant', text: data.message ?? 'Bu işlem Patron onayı gerektirir.', aiProviders: [] },
        ])
      } else {
        const fallback = data.message ?? data.text ?? ((data as { detail?: string }).detail ? `Hata: ${(data as { detail: string }).detail}` : null)
        setChatMessages((prev) => [
          ...prev,
          { role: 'assistant', text: fallback ?? 'Yanıt alınamadı. API anahtarlarını (.env) kontrol edin.', aiProviders: data.ai_providers ?? [] },
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

  const handleQueueDecision = async (commandId: string, decision: 'approve' | 'reject' | 'cancel') => {
    setApprovalActingId(commandId + '_' + decision)
    try {
      const res = await fetch('/api/approvals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command_id: commandId, decision, user_id: user?.id }),
      })
      const data = await res.json()
      if (!res.ok) {
        setChatMessages((prev) => [...prev, { role: 'assistant', text: `Hata: ${data?.error ?? 'İşlem başarısız'}`, aiProviders: [] }])
        return
      }
      if (decision === 'approve' && data?.result) {
        const deployNote = data?.auto_deployed ? '\n\n🚀 Deploy edildi (GitHub push).' : ''
        setChatMessages((prev) => [...prev, { role: 'assistant', text: `✅ Onaylandı.${deployNote}\n\n${data.result}`, aiProviders: [] }])
      } else if (decision === 'reject' || decision === 'cancel') {
        setChatMessages((prev) => [...prev, { role: 'assistant', text: decision === 'cancel' ? 'İptal edildi.' : 'Reddedildi.', aiProviders: [] }])
      }
      fetchApprovalQueue()
    } catch {
      setChatMessages((prev) => [...prev, { role: 'assistant', text: 'İstek gönderilemedi.', aiProviders: [] }])
    } finally {
      setApprovalActingId(null)
    }
  }

  const handleCancelAllPending = async () => {
    const pending = approvalItems.filter((i) => i.status === 'pending')
    if (pending.length === 0) return
    if (!confirm(`${pending.length} bekleyen işin tamamını iptal etmek istediğinize emin misiniz? Bu işlem geri alınamaz.`)) return
    setApprovalActingId('cancel_all')
    try {
      const res = await fetch('/api/approvals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cancel_all: true, cancel_pending_only: true }),
      })
      const data = await res.json()
      if (!res.ok) {
        setChatMessages((prev) => [...prev, { role: 'assistant', text: `Hata: ${data?.error ?? 'Tümünü iptal başarısız'}`, aiProviders: [] }])
        return
      }
      setChatMessages((prev) => [...prev, { role: 'assistant', text: `✅ ${pending.length} bekleyen iş iptal edildi.`, aiProviders: [] }])
      fetchApprovalQueue()
    } catch {
      setChatMessages((prev) => [...prev, { role: 'assistant', text: 'İstek gönderilemedi.', aiProviders: [] }])
    } finally {
      setApprovalActingId(null)
    }
  }

  const runStartupTasks = async (action: 'run_all' | 'run_director') => {
    if (startupTasksLoading) return
    setStartupTasksLoading(true)
    try {
      const res = await fetch('/api/startup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: action === 'run_all' ? 'run_all' : 'run_director',
          director: action === 'run_director' ? 'CSPO' : undefined,
          user_id: user?.id,
          user,
        }),
      })
      const data = await res.json()
      if (data.error) {
        setChatMessages((prev) => [
          ...prev,
          { role: 'assistant', text: `Başlangıç hatası: ${data.error}`, aiProviders: [] },
        ])
      } else {
        setChatMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: `✅ Başlangıç görevleri tetiklendi. ${action === 'run_all' ? 'Tüm direktörlükler' : 'CSPO'} işe başlıyor. Onay kuyruğuna bakın (sağda).`,
            aiProviders: [],
          },
        ])
        fetch('/api/startup').then((r) => r.json()).then(setStartupStatus).catch(() => {})
      }
    } catch {
      setChatMessages((prev) => [
        ...prev,
        { role: 'assistant', text: 'Başlangıç tetiklenirken hata.', aiProviders: [] },
      ])
    } finally {
      setStartupTasksLoading(false)
    }
  }

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  useEffect(() => {
    const lastAssistant = [...chatMessages].reverse().find((m) => m.role === 'assistant')
    if (lastAssistant?.text) setCommandFromMessage(lastAssistant.text)
  }, [chatMessages])

  // Particle background
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    type P = { x: number; y: number; size: number; speedX: number; speedY: number; color: string; update: () => void; draw: () => void }
    const particles: P[] = []
    for (let i = 0; i < 60; i++) {
      const p: P = {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.4,
        color: `rgba(34, 211, 238, ${Math.random() * 0.3 + 0.1})`,
        update() {
          this.x += this.speedX
          this.y += this.speedY
          if (this.x > canvas!.width) this.x = 0
          if (this.x < 0) this.x = canvas!.width
          if (this.y > canvas!.height) this.y = 0
          if (this.y < 0) this.y = canvas!.height
        },
        draw() {
          ctx.fillStyle = this.color
          ctx.beginPath()
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
          ctx.fill()
        },
      }
      particles.push(p)
    }
    function animate() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach((p) => { p.update(); p.draw() })
      requestAnimationFrame(animate)
    }
    animate()
    const onResize = () => { if (canvas) { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight } }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const formatDate = (d: Date) =>
    d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })
  const prevDay = () => {
    const d = new Date(selectedDate)
    d.setDate(d.getDate() - 1)
    setSelectedDate(d)
  }
  const nextDay = () => {
    const d = new Date(selectedDate)
    d.setDate(d.getDate() + 1)
    setSelectedDate(d)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-slate-900 text-slate-100 relative overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-40 pointer-events-none" aria-hidden />
      <div className="relative z-10 p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Futuristik Header */}
        <header className="flex items-center justify-between py-4 border-b border-slate-700/50 mb-6">
          <div className="flex items-center space-x-3">
            <div className="relative w-9 h-9 flex-shrink-0">
              <Image src="/logo.png" alt="YİSA-S" fill className="object-contain" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                YİSA-S
              </span>
              <p className="text-xs text-slate-500">Yönetici İşletmeci Sporcu Antrenör Sistemi · Patron Komuta Merkezi</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-1 bg-slate-800/50 rounded-full px-3 py-1.5 border border-slate-700/50 backdrop-blur-sm">
              <Search className="h-4 w-4 text-slate-400" />
              <input type="text" placeholder="Ara..." className="bg-transparent border-none focus:outline-none text-sm w-32 placeholder:text-slate-500" />
            </div>
            <div className="flex items-center space-x-2 bg-slate-800/50 rounded-full px-3 py-1.5 border border-slate-700/50">
              <Clock className="h-4 w-4 text-cyan-500" />
              <span className="text-sm font-mono text-cyan-400">
                {new Date().toLocaleTimeString('tr-TR', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>
            <Avatar className="h-9 w-9 border border-cyan-500/30">
              <AvatarFallback className="bg-slate-800 text-cyan-400 text-sm">
                {(user?.email ?? 'P').charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Tebrikler / Hoş geldin — Patron girişinde gösterilir */}
        {user && isPatron(user) && (
          <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 backdrop-blur-sm">
            <p className="text-emerald-400 font-semibold">
              Tebrikler, Serdinç Bey! Hoş geldiniz — sistem hazır.
            </p>
            <p className="text-slate-400 text-sm mt-0.5">
              Patron Komuta Merkezi aktif. Komut gönderebilir, onay kuyruğunu yönetebilirsiniz.
            </p>
          </div>
        )}

        {/* Genişletilebilir İstatistikler - Futuristik Kartlar */}
        <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm overflow-hidden">
          <button
            type="button"
            onClick={() => setStatsExpanded(!statsExpanded)}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-700/30 transition-colors text-left"
          >
            <CardTitle className="text-slate-100 flex items-center gap-2 !text-lg !mb-0">
              <div className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
              SİSTEM ÖZETİ
            </CardTitle>
            {statsExpanded ? <Minimize2 size={18} className="text-slate-400" /> : <Maximize2 size={18} className="text-slate-400" />}
          </button>
          {statsExpanded && (
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {[
                  { label: 'Franchise Geliri', value: `₺${stats.franchiseRevenueMonth.toLocaleString('tr-TR')}`, color: 'cyan' },
                  { label: 'Gider', value: `₺${stats.expensesMonth.toLocaleString('tr-TR')}`, color: 'rose' },
                  { label: 'Aktif Franchise', value: String(stats.activeFranchises), color: 'white' },
                  { label: 'Onay Bekleyen', value: String(stats.pendingApprovals), color: 'amber' },
                  { label: 'Yeni Başvuru', value: String(stats.newFranchiseApplications), color: 'emerald' },
                ].map((s, i) => (
                  <div
                    key={i}
                    className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-4 relative overflow-hidden group hover:border-cyan-500/30 transition-colors"
                  >
                    <p className="text-slate-400 text-xs mb-1 uppercase tracking-wider">{s.label}</p>
                    <p className={`text-xl font-bold font-mono ${
                      s.color === 'cyan' ? 'text-cyan-400' :
                      s.color === 'rose' ? 'text-rose-400' :
                      s.color === 'amber' ? 'text-amber-400' :
                      s.color === 'emerald' ? 'text-emerald-400' : 'text-slate-100'
                    }`}>{s.value}</p>
                    <div className="absolute -bottom-4 -right-4 h-16 w-16 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 blur-xl" />
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Takvimli Görünüm */}
          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm overflow-hidden">
            <CardHeader className="py-4 border-b border-slate-700/50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2 !mb-0">
                  <Calendar size={18} className="text-cyan-500" />
                  Takvim
                </CardTitle>
                <div className="flex items-center gap-1">
                  <Button type="button" variant="ghost" size="icon" onClick={prevDay} className="h-8 w-8 text-slate-400 hover:text-cyan-400" title="Önceki gün">
                    <ChevronLeft size={18} />
                  </Button>
                  <span className="text-xs font-mono text-cyan-400 min-w-[100px] text-center">{formatDate(selectedDate)}</span>
                  <Button type="button" variant="ghost" size="icon" onClick={nextDay} className="h-8 w-8 text-slate-400 hover:text-cyan-400" title="Sonraki gün">
                    <ChevronRight size={18} />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-1.5 max-h-[280px] overflow-y-auto">
                {[7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22].map((h) => (
                  <div key={h} className="flex items-center gap-3 text-sm">
                    <span className="text-slate-500 w-10 font-mono text-xs">{h}:00</span>
                    <div className="flex-1 h-8 rounded-md bg-slate-800/50 border border-slate-700/50" />
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-3 font-mono">7–22 saatli görünüm</p>
            </CardContent>
          </Card>

        {/* Başlangıç Görevleri & Vitrin */}
        <div className="space-y-4">
          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader className="py-4">
              <CardTitle className="text-base !mb-0">Başlangıç Görevleri</CardTitle>
              <p className="text-xs text-slate-500 mt-1">
                <Badge variant="outline" className="bg-cyan-500/10 text-cyan-400 border-cyan-500/30 text-xs">
                  {startupStatus?.total_pending ?? 0} görev bekliyor
                </Badge>
              </p>
            </CardHeader>
            <CardContent className="pt-0">
              <Button
                onClick={() => runStartupTasks('run_all')}
                disabled={startupTasksLoading}
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white border border-cyan-500/30 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {startupTasksLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Tetikleniyor...
                  </span>
                ) : (
                  <>
                    <Play size={18} className="mr-2" />
                    Tüm Robotları Başlat
                  </>
                )}
              </Button>
              <p className="text-xs text-slate-500 mt-2">
                Direktörlükler ilk görevlerini yapacak.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader className="py-4">
              <CardTitle className="text-base flex items-center gap-2 !mb-0">
                <Store size={18} className="text-emerald-400" />
                Vitrin
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <a href="/dashboard/franchises">
                <Button variant="outline" className="w-full border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10">
                  Franchise Vitrinleri
                </Button>
              </a>
            </CardContent>
          </Card>
        </div>

        {/* Sistem Durumu */}
        <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader className="py-4">
            <CardTitle className="text-base !mb-0">Sistem Durumu</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <a href="/api/system/status" target="_blank" rel="noopener noreferrer" className="text-sm text-cyan-400 hover:underline font-mono">
              /api/system/status
            </a>
          </CardContent>
        </Card>
      </div>

      {/* Chat + Onay Kuyruğu - Aynı ekranda */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sol: Robot Asistan Chat */}
        <div className="lg:col-span-8">
      <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm overflow-hidden flex flex-col">
        <button
          type="button"
          onClick={() => setChatExpanded(!chatExpanded)}
          className="flex items-center gap-3 px-6 py-4 border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors w-full text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
            <Bot className="text-cyan-400" size={22} />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-white">YİSA-S Robot Asistan</h2>
            <p className="text-xs text-slate-500 font-mono">
              {useQualityFlow ? 'CIO → CEO → CELF → Patron Onay' : 'Router + Task Flow'}
            </p>
          </div>
          <Badge variant="outline" className="bg-cyan-500/10 text-cyan-400 border-cyan-500/30">
            <div className="h-1.5 w-1.5 rounded-full bg-cyan-500 mr-1.5 animate-pulse" />
            CANLI
          </Badge>
          <label className="flex items-center gap-2 text-sm text-slate-400">
            <input
              type="checkbox"
              checked={useQualityFlow}
              onChange={(e) => setUseQualityFlow(e.target.checked)}
              className="rounded border-slate-600 bg-slate-800 text-cyan-500 focus:ring-cyan-500/50"
            />
            <span>Seçenek 2</span>
          </label>
          <Button variant="ghost" size="sm" onClick={() => setShowFlow((s) => !s)} className="text-slate-400">
            {showFlow ? <ChevronUp size={16} /> : <ChevronDown size={16} />} Akış
          </Button>
          {chatExpanded ? <Minimize2 size={18} className="text-slate-400" /> : <Maximize2 size={18} className="text-slate-400" />}
        </button>
        {showFlow && (
          <div className="px-6 py-3 border-b border-slate-700 bg-slate-900/50">
            <pre className="text-xs text-slate-300 whitespace-pre-wrap font-mono">
              {useQualityFlow
                ? `PATRON → İmla (Gemini/GPT) → Şirket/Özel → CIO → CEO → CELF → Patron Onay`
                : FLOW_DESCRIPTION}
            </pre>
          </div>
        )}
        {chatExpanded && (
          <>
            {/* Robot seçim paneli — tüm AI ve platformlar */}
            <div className="px-4 pt-3 pb-2 border-b border-slate-700/50 space-y-3">
              <div>
                <p className="text-xs text-slate-500 mb-2 font-medium">1. Asistan seçin → Sohbet edin → Komut olarak gönder</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'GPT', label: 'GPT' },
                  { id: 'GEMINI', label: 'Gemini' },
                  { id: 'CLAUDE', label: 'Claude' },
                  { id: 'CLOUD', label: 'Together' },
                  { id: 'V0', label: 'V0' },
                  { id: 'CURSOR', label: 'Cursor' },
                  { id: 'SUPABASE', label: 'Supabase' },
                  { id: 'GITHUB', label: 'GitHub' },
                  { id: 'VERCEL', label: 'Vercel' },
                  { id: 'RAILWAY', label: 'Railway' },
                  { id: 'FAL', label: 'Fal' },
                ].map(({ id, label }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setAssistantProvider(id as typeof assistantProvider)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      assistantProvider === id
                        ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50'
                        : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-cyan-500/30 hover:text-slate-200'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-2 font-medium">2. Hedef direktör (komut gönderirken — boş = otomatik)</p>
                <select
                  value={targetDirector}
                  onChange={(e) => setTargetDirector(e.target.value)}
                  className="w-full max-w-xs bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                >
                  <option value="">Otomatik (CEO yönlendirir)</option>
                  <option value="CFO">CFO — Finans</option>
                  <option value="CTO">CTO — Teknoloji</option>
                  <option value="CIO">CIO — Bilgi Sistemleri</option>
                  <option value="CMO">CMO — Pazarlama</option>
                  <option value="CHRO">CHRO — İnsan Kaynakları</option>
                  <option value="CLO">CLO — Hukuk</option>
                  <option value="CSO_SATIS">CSO — Satış</option>
                  <option value="CPO">CPO — Ürün</option>
                  <option value="CDO">CDO — Veri</option>
                  <option value="CISO">CISO — Güvenlik</option>
                  <option value="CCO">CCO — Müşteri</option>
                  <option value="CSO_STRATEJI">CSO — Strateji</option>
                  <option value="CSPO">CSPO — Spor (antrenman, çocuk yaşı)</option>
                  <option value="COO">COO — Operasyon</option>
                  <option value="RND">RND — AR-GE</option>
                </select>
              </div>
              {/* LLM ve Araçlar açıklaması — robotların altında */}
              <div className="mt-3 pt-3 border-t border-slate-700/50 space-y-3 text-xs text-slate-400">
                <div>
                  <p className="font-medium text-slate-300 mb-1.5">🧠 LLM (Dil Modelleri)</p>
                  <ul className="space-y-1 pl-1">
                    <li><span className="text-cyan-400/90">Claude</span> — Akıl, analiz, karar</li>
                    <li><span className="text-cyan-400/90">GPT</span> — Genel amaçlı, çeşitlilik</li>
                    <li><span className="text-cyan-400/90">Gemini</span> — Hızlı, multimodal</li>
                    <li><span className="text-cyan-400/90">Together.ai</span> — Ucuz, batch işlemler</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-slate-300 mb-1.5">🛠️ Araçlar</p>
                  <ul className="space-y-1 pl-1">
                    <li><span className="text-amber-400/90">Cursor</span> — Kod yazma, düzenleme</li>
                    <li><span className="text-amber-400/90">v0</span> — UI/Frontend üretimi</li>
                    <li><span className="text-amber-400/90">GitHub</span> — Kod depolama, versiyon</li>
                    <li><span className="text-amber-400/90">Vercel</span> — Deploy, hosting</li>
                    <li><span className="text-amber-400/90">Supabase</span> — Veritabanı, auth, storage</li>
                    <li><span className="text-amber-400/90">Railway</span> — Backend worker&apos;lar</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="flex-1 min-h-[200px] max-h-[340px] overflow-y-auto p-4 space-y-4">
              {chatMessages.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  <p className="mb-1">Merhaba, ben YİSA-S asistanıyım.</p>
                  <p className="text-sm">Görev ver veya soru sor. Örnek: &quot;Finans raporu hazırla&quot;, &quot;Hareket havuzunu kontrol et&quot;</p>
                </div>
              )}
              {chatMessages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                      m.role === 'user' ? 'bg-cyan-500/20 text-cyan-100 border border-cyan-500/20' : 'bg-slate-700/80 text-slate-200 border border-slate-600/50'
                    } ${decisions[i] === 'approve' ? 'ring-2 ring-emerald-500/50' : ''} ${decisions[i] === 'reject' ? 'opacity-60' : ''}`}
                  >
                    {m.role === 'assistant' && (m.aiProviders?.length || m.assignedAI) && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {(m.aiProviders ?? [m.assignedAI]).filter(Boolean).map((ai) => (
                          <span key={ai} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-600 text-white">
                            {ai}
                          </span>
                        ))}
                      </div>
                    )}
                    {editingIndex === i && m.role === 'assistant' ? (
                      <div className="space-y-2">
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          rows={4}
                          className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white"
                        />
                        <div className="flex gap-2">
                          <button type="button" onClick={handleSaveEdit} className="px-3 py-1.5 text-sm bg-amber-500 text-slate-900 rounded-lg">
                            Kaydet
                          </button>
                          <button type="button" onClick={() => setEditingIndex(null)} className="px-3 py-1.5 text-sm bg-slate-600 rounded-lg">
                            İptal
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">{m.text}</p>
                    )}
                    {m.role === 'assistant' && editingIndex !== i && (
                      <div className="flex gap-2 mt-3 pt-2 border-t border-slate-600/50">
                        <button
                          type="button"
                          onClick={() => handlePatronDecision(i, 'approve')}
                          className={`px-2 py-1 rounded-lg text-xs ${decisions[i] === 'approve' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-600/50 text-slate-400 hover:text-white'}`}
                        >
                          <Check size={12} className="inline mr-1" /> Onayla
                        </button>
                        <button
                          type="button"
                          onClick={() => handlePatronDecision(i, 'reject')}
                          className={`px-2 py-1 rounded-lg text-xs ${decisions[i] === 'reject' ? 'bg-red-500/20 text-red-400' : 'bg-slate-600/50 text-slate-400 hover:text-white'}`}
                        >
                          <X size={12} className="inline mr-1" /> Reddet
                        </button>
                        <button
                          type="button"
                          onClick={() => handlePatronDecision(i, 'modify')}
                          className={`px-2 py-1 rounded-lg text-xs ${decisions[i] === 'modify' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-600/50 text-slate-400 hover:text-white'}`}
                        >
                          <Edit3 size={12} className="inline mr-1" /> Değiştir
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
                <div className="rounded-2xl border-2 border-amber-500/50 bg-amber-500/10 p-4 space-y-3">
                  <h3 className="font-semibold text-amber-400">📝 Bu mu demek istediniz?</h3>
                  <p className="text-sm text-slate-300">&quot;{pendingSpellingConfirmation.correctedMessage}&quot;</p>
                  <p className="text-xs text-amber-400/90 font-medium">→ Devam etmek için aşağıdaki butonlardan birine tıklayın</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleConfirmationChoice('company', pendingSpellingConfirmation!.correctedMessage)}
                      disabled={chatSending}
                      className="px-3 py-2 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 text-sm font-medium disabled:opacity-50"
                    >
                      Evet, Şirket İşi
                    </button>
                    <button
                      type="button"
                      onClick={() => handleConfirmationChoice('private', pendingSpellingConfirmation!.correctedMessage)}
                      disabled={chatSending}
                      className="px-3 py-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 text-sm font-medium disabled:opacity-50"
                    >
                      Evet, Özel İş
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setChatInput(pendingSpellingConfirmation!.correctedMessage)
                        setPendingSpellingConfirmation(null)
                      }}
                      className="px-3 py-2 rounded-lg bg-slate-600 text-slate-300 hover:bg-slate-500 text-sm"
                    >
                      Hayır, Düzelt
                    </button>
                  </div>
                </div>
              )}
              {approvedWaitingRoutineChoice && (
                <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4 space-y-3">
                  <h3 className="font-semibold text-emerald-400">Bu görevi nasıl kaydetmek istersiniz?</h3>
                  {routineStep === null || routineStep === 'choice' ? (
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setRoutineStep('schedule')}
                        className="px-3 py-2 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 text-sm font-medium"
                      >
                        Rutin Görev
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setApprovedWaitingRoutineChoice(null)
                          setRoutineStep(null)
                          setChatMessages((prev) => [...prev, { role: 'assistant', text: 'Bir seferlik olarak kaydedildi.', aiProviders: [] }])
                        }}
                        className="px-3 py-2 rounded-lg bg-slate-600 text-slate-300 hover:bg-slate-500 text-sm"
                      >
                        Bir Seferlik
                      </button>
                    </div>
                  ) : (
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
                                  text: data.message ?? `Rutin kaydedildi (${schedule === 'daily' ? 'Günlük' : schedule === 'weekly' ? 'Haftalık' : 'Aylık'}).`,
                                  aiProviders: [],
                                },
                              ])
                            } finally {
                              setApprovalBusy(false)
                            }
                          }}
                          disabled={approvalBusy}
                          className="px-3 py-2 rounded-lg bg-slate-600 text-slate-300 hover:bg-slate-500 text-sm disabled:opacity-50"
                        >
                          {schedule === 'daily' ? 'Günlük' : schedule === 'weekly' ? 'Haftalık' : 'Aylık'}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {pendingPrivateSave && (
                <div className="rounded-2xl border border-blue-500/40 bg-blue-500/10 p-4 space-y-3">
                  <h3 className="font-semibold text-blue-400">Kendi alanınıza kaydetmek ister misiniz?</h3>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => handlePrivateSave(true)} disabled={approvalBusy} className="px-3 py-2 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm font-medium">
                      Evet, Kaydet
                    </button>
                    <button type="button" onClick={() => { setPendingPrivateSave(null); setChatMessages((prev) => [...prev, { role: 'assistant', text: 'Kaydetmediniz.', aiProviders: [] }]) }} className="px-3 py-2 rounded-lg bg-slate-600 text-slate-300 text-sm">
                      Hayır
                    </button>
                  </div>
                </div>
              )}
              {pendingApproval && (
                approvalBusy ? (
                  <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-center text-amber-400">
                    <p className="font-medium">Çalışıyor...</p>
                    <p className="text-sm text-slate-400 mt-1">Patron kararı uygulanıyor</p>
                  </div>
                ) : (
                <PatronApprovalUI
                  pendingTask={pendingApproval}
                  onApprove={async () => {
                    setApprovalBusy(true)
                    const cmdId = pendingApproval.command_id
                    try {
                      const res = await fetch('/api/approvals', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ command_id: cmdId, decision: 'approve', user_id: user?.id }),
                      })
                      const data = await res.json()
                      const resultText = data.result ?? pendingApproval.displayText ?? 'İşlem tamamlandı.'
                      const deployNote = data?.auto_deployed ? '\n\n🚀 Deploy edildi.' : ''
                      setChatMessages((prev) => [
                        ...prev,
                        { role: 'assistant', text: `✅ Onaylandı.${deployNote}\n\n${resultText}`, aiProviders: pendingApproval.aiResponses.map((a) => a.provider), taskType: pendingApproval.output?.taskType as string },
                      ])
                      setPendingApproval(null)
                      fetchApprovalQueue()
                      if (cmdId) setApprovedWaitingRoutineChoice({ command_id: cmdId, message: pendingApproval.message, director_key: pendingApproval.director_key })
                    } catch {
                      setChatMessages((prev) => [...prev, { role: 'assistant', text: 'Onay hatası.', aiProviders: [] }])
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
                        body: JSON.stringify({ command_id: pendingApproval.command_id, decision: 'suggest', user_id: user?.id }),
                      })
                      const data = await res.json()
                      setChatMessages((prev) => [...prev, { role: 'assistant', text: `💡 Öneriler:\n\n${data.suggestions ?? 'Alınamadı.'}`, aiProviders: ['GPT'] }])
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
                        body: JSON.stringify({ command_id: pendingApproval.command_id, decision: 'reject', user_id: user?.id }),
                      })
                      setChatMessages((prev) => [...prev, { role: 'assistant', text: '❌ İptal edildi.', aiProviders: [] }])
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
                        body: JSON.stringify({ command_id: pendingApproval.command_id, decision: 'modify', modify_text: modifyText, user_id: user?.id }),
                      })
                      setChatInput(modifyText)
                      setChatMessages((prev) => [...prev, { role: 'assistant', text: 'Değişiklik kaydedildi. Yeni talimatı yazıp Gönder ile tekrar işleyin.', aiProviders: [] }])
                    } finally {
                      setPendingApproval(null)
                      setApprovalBusy(false)
                    }
                  }}
                />
                )
              )}
              <div ref={chatEndRef} />
            </div>
            {suggestedCommand && (
              <div className="mx-4 mb-2 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 relative">
                <button
                  type="button"
                  onClick={() => setSuggestedCommand(null)}
                  className="absolute top-2 right-2 p-1 rounded text-slate-400 hover:text-white hover:bg-slate-700"
                  aria-label="Kapat"
                >
                  <X size={16} />
                </button>
                <div className="flex items-center gap-2 mb-2">
                  <Terminal size={18} className="text-amber-400" />
                  <span className="text-sm font-medium text-amber-400">Patron — PowerShell&apos;te çalıştırın</span>
                </div>
                <pre className="bg-slate-950 rounded-lg p-3 text-xs text-slate-200 font-mono overflow-x-auto whitespace-pre-wrap">{suggestedCommand}</pre>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-amber-400/80">Asistan önerisi — kopyalayıp terminalde yapıştırın</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={copySuggestedCommand}
                    className="border-amber-500/50 text-amber-400 hover:bg-amber-500/20"
                  >
                    <Copy size={14} className="mr-1" />
                    {commandCopied ? 'Kopyalandı!' : 'Kopyala'}
                  </Button>
                </div>
              </div>
            )}
            {lockError && (
              <div className="mx-4 mb-2 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex justify-between">
                <span>{lockError}</span>
                <button type="button" onClick={() => setLockError(null)}>×</button>
              </div>
            )}
            <CardFooter className="border-t border-slate-700/50 p-4 flex flex-col gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={asRoutine}
                    onChange={(e) => setAsRoutine(e.target.checked)}
                    className="rounded border-slate-600 bg-slate-800 text-amber-500 focus:ring-amber-500/50"
                  />
                  <span>Rutin olarak yapılsın</span>
                </label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSendAsCommand}
                  disabled={chatSending || (!chatInput.trim() && !chatMessages.some((m) => m.role === 'user'))}
                  className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10"
                  title="Son mesajı veya yazdığınızı CEO'ya komut olarak gönderir"
                >
                  CEO&apos;ya Gönder
                </Button>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendChat()}
                  placeholder="Görev ver veya soru sor..."
                  className="flex-1 bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50"
                  disabled={chatSending}
                />
                <Button
                  onClick={handleSendChat}
                  disabled={chatSending || !chatInput.trim()}
                  className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white border border-cyan-500/30 px-5"
                >
                  <Send size={18} className="mr-2" />
                  Gönder
                </Button>
              </div>
            </CardFooter>
          </>
        )}
      </Card>
        </div>

        {/* Sağ: Onay Kuyruğu - Chat ile aynı ekranda */}
        <div className="lg:col-span-4">
          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm overflow-hidden h-full">
            <button
              type="button"
              onClick={() => setQueueExpanded(!queueExpanded)}
              className="w-full flex items-center justify-between px-6 py-4 border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors text-left"
            >
              <div className="flex items-center gap-2">
                <ClipboardCheck size={20} className="text-amber-400" />
                <span className="font-semibold text-white">Havuz (Onay Kuyruğu)</span>
                <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/30 text-xs">
                  {approvalItems.filter((i) => i.status === 'pending').length} bekliyor
                </Badge>
              </div>
              {queueExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
            {queueExpanded && (
              <CardContent className="p-4">
                <p className="text-xs text-amber-400/90 mb-3 font-medium">
                  📌 Direktör işleri burada. <strong>Onayla</strong> basınca push, commit, deploy otomatik. İçeriği görmek için Göster veya başlığa tıkla.
                </p>
                {approvalLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 size={24} className="animate-spin text-cyan-500" />
                  </div>
                ) : (
                  <>
                    {approvalItems.filter((i) => i.status === 'pending').length === 0 ? (
                      <div className="text-center py-4 text-slate-500 text-sm">
                        Bekleyen iş yok.
                      </div>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={handleCancelAllPending}
                          disabled={!!approvalActingId}
                          className="w-full mb-3 py-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30 text-xs font-medium hover:bg-rose-500/20 disabled:opacity-50"
                          title="Tekrarlayan veya gereksiz bekleyen tüm işleri iptal eder"
                        >
                          {approvalActingId === 'cancel_all' ? (
                            <Loader2 size={14} className="animate-spin inline mr-2" />
                          ) : (
                            <Ban size={14} className="inline mr-2" />
                          )}
                          Bekleyen tümünü iptal et
                        </button>
                    <div className="space-y-2 max-h-[280px] overflow-y-auto">
                      {approvalItems.filter((i) => i.status === 'pending').map((item) => {
                        const content = item.displayText ?? (item.output_payload as { displayText?: string })?.displayText ?? ''
                        const snippet = content ? content.slice(0, 80).replace(/\n/g, ' ') + (content.length > 80 ? '…' : '') : ''
                        return (
                        <div
                          key={item.id}
                          className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-cyan-500/40 transition-colors"
                        >
                          <button
                            type="button"
                            onClick={() => content && setPreviewItem({ id: item.id, title: item.title, displayText: content, status: item.status })}
                            className="w-full text-left group"
                          >
                            <p className="text-sm text-white truncate group-hover:text-cyan-300" title={item.title}>
                              {item.title.length > 50 ? item.title.slice(0, 50) + '…' : item.title}
                            </p>
                            {snippet && (
                              <p className="text-xs text-slate-500 mt-1 line-clamp-1">« {snippet} »</p>
                            )}
                            <p className="text-[10px] text-cyan-400 mt-1">
                              👁 Tıkla: İçeriği aç
                            </p>
                          </button>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {content && (
                              <button
                                type="button"
                                onClick={() => setPreviewItem({ id: item.id, title: item.title, displayText: content, status: item.status })}
                                className="px-3 py-1.5 rounded text-xs font-medium bg-cyan-500/30 text-cyan-300 hover:bg-cyan-500/40 border border-cyan-500/50"
                              >
                                📄 İçeriği Gör
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleQueueDecision(item.id, 'approve')}
                              disabled={!!approvalActingId}
                              className="px-2 py-1 rounded text-xs bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 disabled:opacity-50"
                            >
                              {approvalActingId === item.id + '_approve' ? <Loader2 size={12} className="animate-spin inline" /> : <Check size={12} className="inline" />} Onayla
                            </button>
                            <button
                              type="button"
                              onClick={() => handleQueueDecision(item.id, 'reject')}
                              disabled={!!approvalActingId}
                              className="px-2 py-1 rounded text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30 disabled:opacity-50"
                            >
                              <X size={12} className="inline" /> Reddet
                            </button>
                            <button
                              type="button"
                              onClick={() => handleQueueDecision(item.id, 'cancel')}
                              disabled={!!approvalActingId}
                              className="px-2 py-1 rounded text-xs bg-slate-600/50 text-slate-400 hover:bg-slate-600 disabled:opacity-50"
                            >
                              <Ban size={12} className="inline" /> İptal
                            </button>
                          </div>
                        </div>
                        )
                      })}
                    </div>
                      </>
                    )}
                    <button
                      type="button"
                      onClick={fetchApprovalQueue}
                  disabled={approvalLoading}
                  className="mt-3 w-full py-1.5 rounded text-xs text-slate-500 hover:text-slate-400 flex items-center justify-center gap-1"
                >
                  <RefreshCw size={12} className={approvalLoading ? 'animate-spin' : ''} />
                  Yenile
                </button>

                {/* Onaylanan İşler Havuzu — tıklayınca her zaman aç */}
                {approvalItems.filter((i) => i.status === 'approved').length > 0 && (
                  <div className="mt-6 pt-4 border-t border-slate-700/50">
                    <p className="text-xs font-medium text-emerald-400 mb-2">📁 Onaylanan İşler — Tıkla içeriği aç</p>
                    <div className="space-y-1 max-h-[160px] overflow-y-auto">
                      {approvalItems.filter((i) => i.status === 'approved').slice(0, 10).map((item) => {
                        const payload = item.output_payload as Record<string, unknown> | undefined
                        const dt = item.displayText ?? payload?.displayText ?? payload?.output_summary ?? (typeof payload?.text === 'string' ? payload.text : '')
                        const content = typeof dt === 'string' ? dt : (dt ? String(dt) : '')
                        return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setPreviewItem({
                            id: item.id,
                            title: item.title,
                            displayText: content || '(Bu işte kayıtlı içerik yok)',
                            status: item.status,
                          })}
                          className="w-full text-left px-3 py-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-sm text-slate-200 hover:bg-emerald-500/25 hover:border-emerald-500/50 transition-colors"
                        >
                          <span className="block truncate">{item.title.length > 40 ? item.title.slice(0, 40) + '…' : item.title}</span>
                          <span className="text-[10px] text-emerald-400/80 mt-0.5 block">👁 Tıkla içeriği gör</span>
                        </button>
                        )
                      })}
                    </div>
                  </div>
                )}
                  </>
                )}
              </CardContent>
            )}
          </Card>
        </div>
      </div>

      {/* Önizleme modal — içeriği büyütülmüş göster */}
      {previewItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setPreviewItem(null)}
        >
          <div
            className="bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
              <h3 className="font-semibold text-white truncate">{previewItem.title}</h3>
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                className="p-2 rounded-lg hover:bg-slate-700 text-slate-400"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-6 bg-white text-slate-900">
              {/<\/?[a-z][\s\S]*>/i.test(previewItem.displayText) ? (
                <div
                  className="prose prose-slate max-w-none"
                  dangerouslySetInnerHTML={{ __html: previewItem.displayText }}
                />
              ) : (
                <pre className="whitespace-pre-wrap text-sm font-sans">{previewItem.displayText}</pre>
              )}
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}
