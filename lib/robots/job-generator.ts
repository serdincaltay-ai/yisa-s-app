/**
 * ═══════════════════════════════════════════════════════════════════
 * YİSA-S CELF İş Üretim Motoru — V3.0 (İç Döngü)
 * ═══════════════════════════════════════════════════════════════════
 *
 * KRİTİK DEĞİŞİKLİK: Claude denetimi artık İÇERİDE yapılıyor.
 *
 * Akış:
 *  1. Patron komut verir / görev oluşur
 *  2. CEO Robot → doğru direktörlüğe yönlendirir
 *  3. DİREKTÖRLÜK İÇ DÖNGÜSÜ:
 *     a. Üretici AI çalışır
 *     b. Claude İÇERİDE denetler
 *     c. Sorun varsa → düzeltme notu → üretici tekrar çalışır
 *     d. Temiz iş çıkana kadar döngü (max N tur)
 *  4. Sadece TEMİZ İŞ CEO Havuzu'na (10'a Çıkart) düşer
 *  5. Patron onaylar/reddeder/düzeltme gönderir
 *
 * Tarih: 6 Şubat 2026
 */

import { routeToDirector } from '@/lib/robots/ceo-robot'
import { type DirectorKey } from '@/lib/robots/celf-center'
import {
  runDirectorateInternalLoop,
  type InternalLoopResult,
} from '@/lib/robots/celf-internal-loop'
import {
  createRobotJob,
  updateJobStatus,
  addJobLog,
  generateTicketNo,
  type JobType,
  type ContentType,
} from '@/lib/db/robot-jobs'

// ─── Tipler ──────────────────────────────────────────────────

export interface JobGenerationRequest {
  command: string                    // Patron komutu / görev açıklaması
  director_key?: DirectorKey         // Belirli direktörlük (opsiyonel — yoksa CEO yönlendirir)
  job_type?: JobType                 // İş türü (logo, tasarim, rapor, vb.)
  content_type?: ContentType
  priority?: 'low' | 'normal' | 'high' | 'critical'
  tenant_id?: string                 // Hedef tenant (varsa)
  target_audience?: string
}

export interface JobGenerationResult {
  success: boolean
  job_id?: string
  ticket_no?: string
  status?: string
  output_preview?: string
  /** İç döngü tur detayları */
  rounds?: number
  review_passed?: boolean
  error?: string
}

// ─── İş Türü Algılama ───────────────────────────────────────

function detectJobType(command: string): JobType {
  const lower = command.toLowerCase()
  if (/logo/.test(lower)) return 'logo'
  if (/tasarım|tasarla|ui|ux|sayfa/.test(lower)) return 'tasarim'
  if (/video|animasyon/.test(lower)) return 'video'
  if (/belge|doküman|sözleşme/.test(lower)) return 'belge'
  if (/şablon|template/.test(lower)) return 'sablon'
  if (/robot|bot|agent/.test(lower)) return 'robot'
  if (/antrenman|program|ölçüm|sporcu/.test(lower)) return 'antrenman'
  if (/rapor|analiz|istatistik/.test(lower)) return 'rapor'
  if (/kampanya|reklam|sosyal medya/.test(lower)) return 'kampanya'
  return 'general'
}

function detectContentType(jobType: JobType): ContentType {
  const map: Record<JobType, ContentType> = {
    logo: 'image',
    tasarim: 'template',
    video: 'video',
    belge: 'text',
    sablon: 'template',
    robot: 'robot_config',
    antrenman: 'text',
    rapor: 'report',
    kampanya: 'text',
    general: 'text',
  }
  return map[jobType] ?? 'text'
}

// ─── Görev Çakışması Kontrolü (Altın Kural #12) ─────────────

async function checkDuplicateJob(command: string, directorKey: string): Promise<boolean> {
  const { getJobsByFilter } = await import('@/lib/db/robot-jobs')
  const { data } = await getJobsByFilter({ director_key: directorKey, limit: 5 })
  if (!data || data.length === 0) return false

  const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
  const recent = data.filter(
    (job) => job.created_at > fiveMinAgo && job.title.toLowerCase() === command.slice(0, 200).toLowerCase()
  )

  return recent.length > 0
}

// ─── ANA İŞ ÜRETİM FONKSİYONU ──────────────────────────────

export async function generateJob(req: JobGenerationRequest): Promise<JobGenerationResult> {
  try {
    // 1. Direktörlük belirle (CEO Robot yönlendirmesi)
    const directorKey = req.director_key ?? routeToDirector(req.command) ?? 'CPO'

    // 2. İş türü algıla
    const jobType = req.job_type ?? detectJobType(req.command)
    const contentType = req.content_type ?? detectContentType(jobType)

    // 3. Görev çakışması kontrolü (Altın Kural #12)
    const isDuplicate = await checkDuplicateJob(req.command, directorKey)
    if (isDuplicate) {
      return {
        success: false,
        error: 'Bu görev son 5 dakika içinde zaten gönderilmiş. Tekrarlayan görev engellendi (Kural #12).',
      }
    }

    // 4. Ticket oluştur
    const ticketNo = generateTicketNo()

    // 5. Veritabanında iş kaydı oluştur (status: producing)
    const { id: jobId, error: createError } = await createRobotJob({
      ticket_no: ticketNo,
      source_robot: 'CELF',
      director_key: directorKey,
      title: req.command.slice(0, 200),
      description: req.command,
      job_type: jobType,
      content_type: contentType,
      priority: req.priority ?? 'normal',
      tenant_id: req.tenant_id,
      target_audience: req.target_audience,
    })

    if (createError || !jobId) {
      return { success: false, error: createError ?? 'İş kaydı oluşturulamadı' }
    }

    // Log: İş oluşturuldu
    await addJobLog({ job_id: jobId, action: 'created', actor: 'CELF', details: { director_key: directorKey, job_type: jobType } })

    // ══════════════════════════════════════════════════════════════
    // 6. DİREKTÖRLÜK İÇ DÖNGÜSÜ — Üretim + Denetim İÇERİDE
    // ══════════════════════════════════════════════════════════════
    await addJobLog({ job_id: jobId, action: 'internal_loop_started', actor: 'CELF', details: { director_key: directorKey } })
    await updateJobStatus(jobId, 'producing')

    const loopResult = await runDirectorateInternalLoop(directorKey, req.command)

    // İç döngü başarısız olduysa (sistem hatası)
    if ('success' in loopResult && !loopResult.success) {
      await updateJobStatus(jobId, 'rejected', {
        output_data: { error: loopResult.error, stage: loopResult.stage },
      })
      await addJobLog({ job_id: jobId, action: 'internal_loop_failed', actor: 'CELF', details: { error: loopResult.error, stage: loopResult.stage } })
      return { success: false, job_id: jobId, ticket_no: ticketNo, error: loopResult.error }
    }

    // İç döngü başarılı — sonuçları al
    const result = loopResult as InternalLoopResult

    // Tur detaylarını logla
    for (const rd of result.round_details) {
      await addJobLog({
        job_id: jobId,
        action: rd.review_verdict === 'GEÇTİ' ? 'internal_review_passed' : 'internal_review_failed',
        actor: 'CLAUDE',
        details: {
          round: rd.round,
          verdict: rd.review_verdict,
          note: rd.review_note.slice(0, 500),
          correction: rd.correction_note?.slice(0, 500),
        },
      })
    }

    await addJobLog({
      job_id: jobId,
      action: 'internal_loop_completed',
      actor: 'CELF',
      details: {
        provider: result.provider,
        rounds: result.rounds,
        review_passed: result.review_passed,
        warning: result.warning,
      },
    })

    // ══════════════════════════════════════════════════════════════
    // 7. TEMİZ İŞ → CEO Havuzu'na (10'a Çıkart)
    // ══════════════════════════════════════════════════════════════
    await updateJobStatus(jobId, 'ceo_pool', {
      output_data: {
        final_output: result.output,
        provider: result.provider,
        review_passed: result.review_passed,
        rounds: result.rounds,
        round_details: result.round_details,
        warning: result.warning,
        ...(result.github_commit ? { github_commit: result.github_commit } : {}),
      },
      output_preview: result.output.slice(0, 500),
      ai_provider: result.provider,
    })

    await addJobLog({
      job_id: jobId,
      action: 'sent_to_ceo',
      actor: 'CELF',
      details: {
        review_passed: result.review_passed,
        note: result.review_passed
          ? 'İç denetimden geçti — temiz iş CEO havuzuna gönderildi.'
          : `İç denetimden geçemedi (${result.rounds} tur) — uyarılı olarak CEO havuzuna gönderildi.`,
      },
    })

    const outputPreview = result.review_passed
      ? result.output.slice(0, 500)
      : `[İÇ DENETİM UYARISI: ${result.warning?.slice(0, 200)}]\n\n${result.output.slice(0, 300)}`

    return {
      success: true,
      job_id: jobId,
      ticket_no: ticketNo,
      status: 'ceo_pool',
      output_preview: outputPreview,
      rounds: result.rounds,
      review_passed: result.review_passed,
    }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : String(err) }
  }
}

// ─── DÜZELTME SONRASI YENİDEN ÜRETİM ────────────────────────
// Patron "Düzelt" dediğinde, orijinal iş yeniden iç döngüye girer.

export async function regenerateJob(
  jobId: string,
  correctionNotes: string
): Promise<JobGenerationResult> {
  const { getJobById } = await import('@/lib/db/robot-jobs')
  const { data: originalJob, error } = await getJobById(jobId)

  if (error || !originalJob) {
    return { success: false, error: error ?? 'Orijinal iş bulunamadı' }
  }

  // Patron düzeltme notu ile yeniden iç döngüye gir
  const enhancedCommand = `${originalJob.description ?? originalJob.title}\n\n[PATRON DÜZELTME NOTU]: ${correctionNotes}`

  return generateJob({
    command: enhancedCommand,
    director_key: originalJob.director_key as DirectorKey | undefined ?? undefined,
    job_type: originalJob.job_type as JobType,
    content_type: originalJob.content_type as ContentType,
    priority: originalJob.priority as 'low' | 'normal' | 'high' | 'critical',
    tenant_id: originalJob.tenant_id ?? undefined,
    target_audience: originalJob.target_audience,
  })
}
