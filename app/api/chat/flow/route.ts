/**
 * SEÇENEK 2 - TAM SİSTEM AKIŞI
 * 1) Patron mesaj → Gemini (önce) veya GPT imla düzelt → "Bu mu demek istediniz?" + [Şirket İşi] [Özel İş] [Hayır Düzelt]
 * 2) Özel İş → Asistan (Claude/Gemini) halleder, CELF'e gitmez → "Kaydet?" → Evet ise patron_private_tasks
 * 3) Şirket İşi → CEO → CELF → Sonuç Patron onayına → Onayla/Reddet/Öneri/Değiştir → Rutin/Bir seferlik
 * Patron Kararı: 30 Ocak 2026
 *
 * KURAL: API'ler sadece 2 bölümde — Asistan (imla GPT, özel iş Claude) + CELF (runCelfDirector).
 * CEO/COO/güvenlik API çağırmaz; sadece kurallar ve CELF tetiklemesi. Bkz. API_SADECE_ASISTAN_CELF_KURULUM.md
 */

import { NextRequest, NextResponse } from 'next/server'
import {
  detectTaskType,
  routeToDirector,
  isRoutineRequest,
  getRoutineScheduleFromMessage,
} from '@/lib/robots/ceo-robot'
import { CELF_DIRECTORATES, runCelfChecks, type DirectorKey } from '@/lib/robots/celf-center'
import { securityCheck } from '@/lib/robots/security-robot'
import { archiveTaskResult } from '@/lib/robots/data-robot'
import { saveChatMessage } from '@/lib/db/chat-messages'
import { savePrivateTask } from '@/lib/db/patron-private'
import { logCelfAudit } from '@/lib/db/celf-audit'
import {
  createCeoTask,
  updateCeoTask,
  createPatronCommand,
  insertCelfLog,
  getPendingCeoTaskCount,
} from '@/lib/db/ceo-celf'
import { canTriggerFlow } from '@/lib/auth/roles'
import { correctSpelling, askConfirmation } from '@/lib/ai/gpt-service'
import { runCelfDirector, callClaude } from '@/lib/ai/celf-execute'

function taskTypeToLabel(taskType: string): string {
  const map: Record<string, string> = {
    research: 'araştırma',
    design: 'tasarım',
    code: 'kod',
    report: 'rapor',
    general: 'genel',
  }
  return map[taskType] ?? taskType
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const message = typeof body.message === 'string' ? body.message : (body.message ?? 'Merhaba')
    const user = body.user ?? null
    const userId = typeof body.user_id === 'string' ? body.user_id : (user?.id as string | undefined)
    const ipAddress = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? undefined
    const confirmType = body.confirm_type as 'company' | 'private' | undefined
    const confirmedFirstStep = body.confirmed_first_step === true
    const idempotencyKey = typeof body.idempotency_key === 'string' ? body.idempotency_key.trim() || undefined : undefined
    const correctedMessage = typeof body.corrected_message === 'string' ? body.corrected_message : undefined
    const savePrivate = body.save_private === true
    const privateCommand = typeof body.private_command === 'string' ? body.private_command : undefined
    const privateResult = typeof body.private_result === 'string' ? body.private_result : undefined

    const messageToUse = correctedMessage ?? message

    // ─── Rol guard: Flow (CEO/CELF/onay) sadece Patron ve üst roller tetikleyebilir ─
    const flowUser = user ?? (userId ? { user_metadata: { role: undefined } } : null)
    if (savePrivate || confirmType === 'private' || confirmType === 'company') {
      if (!flowUser || !canTriggerFlow(flowUser)) {
        return NextResponse.json(
          { error: 'Yetkisiz erişim. Flow sadece Patron ve yetkili roller tarafından tetiklenebilir.', blocked: true },
          { status: 403 }
        )
      }
    }

    // ─── Özel iş "Kaydet?" → Evet: patron_private_tasks'a kaydet ─────────────
    if (savePrivate && userId && privateCommand && privateResult != null) {
      const saved = await savePrivateTask({
        patron_id: userId,
        command: privateCommand,
        result: privateResult,
        task_type: 'genel',
        ai_providers: ['CLAUDE'],
      })
      if (saved.error) {
        return NextResponse.json({ error: saved.error }, { status: 500 })
      }
      return NextResponse.json({
        status: 'private_saved',
        message: 'Kendi alanınıza kaydedildi.',
        flow: 'Patron özel iş → Kaydet',
      })
    }

    // ─── a) Önce securityCheck ─────────────────────────────────────────────
    const security = await securityCheck({
      message: messageToUse,
      userId,
      ipAddress,
      logToDb: true,
    })
    if (!security.allowed) {
      return NextResponse.json(
        { error: security.reason ?? 'Bu işlem AI için yasaktır.', blocked: true },
        { status: 403 }
      )
    }

    // ─── 1) İLK ADIM: confirm_type yoksa Gemini (önce) veya GPT imla düzelt + "Bu mu demek istediniz?" ─
    if (!confirmType) {
      const spell = await correctSpelling(message)
      const confirmation = askConfirmation(spell.correctedMessage)
      const spellingProvider = spell.provider ?? 'GPT'
      return NextResponse.json({
        status: 'spelling_confirmation',
        flow: spellingProvider === 'GEMINI' ? 'Gemini imla düzeltme' : 'GPT imla düzeltme',
        spellingProvider,
        correctedMessage: confirmation.correctedMessage,
        promptText: confirmation.promptText,
        choices: confirmation.choices,
        message: 'Bu mu demek istediniz? Şirket işi / Özel iş / Hayır düzelt seçin.',
      })
    }

    // ─── 2) ÖZEL İŞ: CELF'e gitmez, asistan halleder, kaydetme sonra sorulur ─
    if (confirmType === 'private') {
      if (!userId) {
        return NextResponse.json({ error: 'Özel iş için giriş gerekli.' }, { status: 401 })
      }
      const privateResultText = await callClaude(
        messageToUse,
        'Sen Patronun kişisel asistanısın. Şirket verisine erişmeden, kısa ve Türkçe yanıt ver. CELF\'e gitme.',
        'asistan'
      )
      const resultText = privateResultText ?? 'Yanıt oluşturulamadı.'
      await saveChatMessage({
        user_id: userId,
        message: messageToUse,
        response: resultText,
        ai_providers: ['CLAUDE'],
      })
      return NextResponse.json({
        status: 'private_done',
        flow: 'Patron özel iş (CELF\'e gitmez)',
        text: resultText,
        command_used: messageToUse,
        ask_save: true,
        message: 'İş tamamlandı. Kendi alanınıza kaydetmek ister misiniz?',
      })
    }

    // ─── 3) ŞİRKET İŞİ: CEO → CELF (direktörlük + denetim) → Patron Onay ───────
    // İlk adım kilidi: Şirket işi için imla/onay adımı zorunlu (API bypass engeli)
    if (confirmType === 'company' && !confirmedFirstStep) {
      return NextResponse.json(
        {
          status: 'first_step_required',
          message: 'Şirket işi için önce "Bu mu demek istediniz?" adımı tamamlanmalı. İmla düzeltmesi sonrası Şirket İşi seçin.',
          blocked: true,
        },
        { status: 400 }
      )
    }
    // Güvenlik robotu: Patron onayı gerektiren işlemde CELF'e göndermiyoruz
    if (security.requiresApproval) {
      return NextResponse.json(
        {
          status: 'requires_patron_approval',
          message: 'Bu işlem Patron onayı gerektirir. Önce onay alın.',
          blocked: true,
        },
        { status: 403 }
      )
    }
    // Tek bekleyen iş kuralı: aynı kullanıcı için zaten bekleyen iş varsa yeni açma
    const pending = await getPendingCeoTaskCount(userId)
    if (pending.error) {
      return NextResponse.json({ error: pending.error }, { status: 500 })
    }
    if (pending.count >= 1) {
      return NextResponse.json(
        {
          status: 'pending_task_exists',
          message: 'Zaten bekleyen bir şirket işiniz var. Önce onu onaylayın veya reddedin.',
          blocked: true,
        },
        { status: 409 }
      )
    }

    const taskType = detectTaskType(messageToUse)
    let directorKey = routeToDirector(messageToUse)
    if (!directorKey) directorKey = 'CCO' as DirectorKey
    const taskTypeLabel = taskTypeToLabel(taskType)

    const ceoTaskResult = await createCeoTask({
      user_id: userId,
      task_description: messageToUse,
      task_type: taskTypeLabel,
      director_key: directorKey,
      idempotency_key: idempotencyKey,
    })
    const ceoTaskId = ceoTaskResult.id ?? undefined
    if (ceoTaskId) {
      await insertCelfLog({
        ceo_task_id: ceoTaskId,
        director_key: directorKey,
        action: 'ceo_classify',
        input_summary: messageToUse.substring(0, 200),
        output_summary: `${taskTypeLabel} → ${directorKey}`,
      })
    }

    // ─── CELF iç denetim: veri erişim, koruma, onay, veto ───────────────────
    const celfAudit = runCelfChecks({
      directorKey,
      taskId: ceoTaskId,
      requiredData: [],
      affectedData: [],
      operation: messageToUse,
    })
    if (ceoTaskId) {
      await logCelfAudit({
        task_id: ceoTaskId,
        director_key: directorKey,
        check_type: 'data_access',
        check_result: celfAudit.errors.length ? 'failed' : 'passed',
        details: { errors: celfAudit.errors, warnings: celfAudit.warnings },
      })
      await logCelfAudit({
        task_id: ceoTaskId,
        director_key: directorKey,
        check_type: celfAudit.vetoBlocked ? 'veto' : 'approval',
        check_result: celfAudit.vetoBlocked ? 'failed' : (celfAudit.warnings.length ? 'warning' : 'passed'),
        details: { vetoBlocked: celfAudit.vetoBlocked, warnings: celfAudit.warnings },
      })
    }
    if (!celfAudit.passed) {
      return NextResponse.json({
        status: 'celf_check_failed',
        flow: 'CEO → CELF denetim',
        errors: celfAudit.errors,
        warnings: celfAudit.warnings,
        veto_blocked: celfAudit.vetoBlocked,
        message: celfAudit.errors[0] ?? 'CELF denetimi geçilemedi.',
      })
    }

    // ─── c) CELF: İlgili direktörlük AI'ını çalıştır ───────────────────────
    const celfResult = await runCelfDirector(directorKey, messageToUse)
    const errorReason = (celfResult as { text: string | null; errorReason?: string }).errorReason
    const displayText = celfResult.text ?? (errorReason && errorReason.trim()) ?? 'Yanıt oluşturulamadı. API anahtarlarını (.env) kontrol edin.'
    const aiProvider = celfResult.text ? (celfResult as { provider: string }).provider : '—'
    const aiProviders = celfResult.text ? [(celfResult as { provider: string }).provider] : []

    // ─── d) CEO sonucu toplar: task_results'a kaydet ───────────────────────
    await archiveTaskResult({
      taskId: ceoTaskId,
      directorKey,
      aiProviders,
      inputCommand: messageToUse,
      outputResult: displayText,
      status: 'completed',
    })

    // Onay tek kaynak: ceo_tasks.status. CELF bitti, Patron onayı bekleniyor → awaiting_approval
    if (ceoTaskId) {
      await updateCeoTask(ceoTaskId, {
        status: 'awaiting_approval',
        result_payload: {
          taskType: taskTypeLabel,
          director_key: directorKey,
          displayText,
          aiProvider,
        },
      })
      await insertCelfLog({
        ceo_task_id: ceoTaskId,
        director_key: directorKey,
        action: 'celf_execute',
        input_summary: messageToUse.substring(0, 200),
        output_summary: displayText.substring(0, 300),
        payload: { providers: aiProviders },
      })
    }

    // ─── e) Patrona sun: Her zaman onay kuyruğuna al ───────────────────────
    const githubPrepared = celfResult.text && 'githubPreparedCommit' in celfResult ? celfResult.githubPreparedCommit : undefined
    const cmd = await createPatronCommand({
      user_id: userId,
      command: messageToUse,
      ceo_task_id: ceoTaskId,
      output_payload: {
        displayText,
        task_type: taskTypeLabel,
        director_key: directorKey,
        director_name: CELF_DIRECTORATES[directorKey]?.name ?? directorKey,
        ai_providers: aiProviders,
        flow: 'CEO → CELF → Patron Onay',
        ...(githubPrepared && { github_prepared_commit: githubPrepared }),
      },
    })
    const commandId = cmd.id

    if (ceoTaskId && commandId) {
      await updateCeoTask(ceoTaskId, { patron_command_id: commandId })
    }

    if (userId) {
      await saveChatMessage({
        user_id: userId,
        message: messageToUse,
        response: 'Patron onayı bekleniyor. Onay kuyruğunu kontrol edin.',
        ai_providers: aiProviders.length ? aiProviders : [],
      })
    }

    const routineRequest = isRoutineRequest(messageToUse)
    const routineSchedule = getRoutineScheduleFromMessage(messageToUse)

    // ─── f) Yanıt: Her zaman awaiting_patron_approval; sonuç onaydan sonra gösterilir ─
    return NextResponse.json({
      status: 'awaiting_patron_approval',
      flow: 'CEO → CELF → Patron Onay',
      text: displayText,
      error_reason: errorReason ?? undefined,
      command_id: commandId,
      ceo_task_id: ceoTaskId,
      director_key: directorKey,
      director_name: CELF_DIRECTORATES[directorKey]?.name ?? directorKey,
      task_type: taskTypeLabel,
      ai_provider: aiProvider,
      routine_request: routineRequest,
      routine_schedule: routineSchedule ?? undefined,
      message: 'Sonuç Patron onayına sunuldu. Onayla / Reddet / Değiştir ile karar verin.',
    })
  } catch (e) {
    const err = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ error: 'Flow hatası', detail: err }, { status: 500 })
  }
}
