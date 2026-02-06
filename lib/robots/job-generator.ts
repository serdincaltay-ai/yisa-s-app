/**
 * ═══════════════════════════════════════════════════════════════════
 * YİSA-S CELF İş Üretim Motoru — V3.0 (Tam Entegrasyon)
 * ═══════════════════════════════════════════════════════════════════
 *
 * Tam akış:
 *  1. Patron komut verir / görev oluşur
 *  2. KOMUT TAKİP başlar (kargo takibi gibi)
 *  3. MONTE NOKTASI tespit edilir (nereye kurulacak)
 *  4. ŞİRKET SÜZGECİ (anayasa) kontrol eder
 *  5. CEO Robot → doğru direktörlüğe yönlendirir
 *  6. DİREKTÖRLÜK İÇ DÖNGÜSÜ (üretim + Claude iç denetim)
 *  7. CELF MOTOR → üretim hattı belirler + kuyruğa alır
 *  8. TEMİZ İŞ → CEO Havuzu'na (Patron görür + takip eder)
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
  createKomutTakip,
  type KomutTakipSnapshot,
  type TenantCustomization,
} from '@/lib/robots/komut-takip'
import { dispatchToProduction } from '@/lib/robots/celf-motor'
import { resolveProductionPipeline } from '@/lib/robots/sistem-haritasi'
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
  /** Tenant özelleştirme bağlamı (renk, logo, branş vb.) */
  tenant_context?: TenantCustomization
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
  /** Komut takip haritası (tam yolculuk) */
  journey?: KomutTakipSnapshot
  /** CELF Motor önerileri */
  suggestions?: string[]
  /** Uyarılar */
  warnings?: string[]
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

    // ══════════════════════════════════════════════════════════════
    // 6. KOMUT TAKİP BAŞLAT — Kargo takibi gibi
    // ══════════════════════════════════════════════════════════════
    const takip = createKomutTakip({
      job_id: jobId,
      ticket_no: ticketNo,
      command: req.command,
      director_key: directorKey,
      tenant_context: req.tenant_context,
    })

    // Güvenlik kontrolü adımı (şimdilik otomatik geç)
    takip.startStep('guvenlik_kontrol', 'Kontrol ediliyor', 'GUVENLIK')
    takip.completeStep('guvenlik_kontrol', 'Güvenlik kontrolü geçti')

    // CIO analiz adımı
    takip.startStep('cio_analiz', 'Öncelik ve bütçe analizi', 'CIO')
    const pipelineInfo = resolveProductionPipeline(req.command)
    takip.completeStep('cio_analiz', `Direktörlük: ${directorKey}, Üretim hattı: ${pipelineInfo.suggested_robots.join('→')}`, {
      director_key: directorKey,
      suggested_pipeline: pipelineInfo.suggested_robots,
    })

    // CEO yönlendirme
    takip.startStep('ceo_yonlendirme', `${directorKey} direktörlüğüne yönlendiriliyor`, 'CEO_ROBOT')
    takip.completeStep('ceo_yonlendirme', `${directorKey} direktörlüğüne yönlendirildi`)

    // Log: İş oluşturuldu
    await addJobLog({ job_id: jobId, action: 'created', actor: 'CELF', details: { director_key: directorKey, job_type: jobType } })

    // ══════════════════════════════════════════════════════════════
    // 7. DİREKTÖRLÜK İÇ DÖNGÜSÜ — Üretim + Denetim İÇERİDE
    // ══════════════════════════════════════════════════════════════
    takip.startStep('direktorluk_uretim', `${directorKey} üretiyor`, directorKey)
    await addJobLog({ job_id: jobId, action: 'internal_loop_started', actor: 'CELF', details: { director_key: directorKey } })
    await updateJobStatus(jobId, 'producing')

    const loopResult = await runDirectorateInternalLoop(directorKey, req.command)

    // İç döngü başarısız olduysa
    if ('success' in loopResult && !loopResult.success) {
      takip.failStep('direktorluk_uretim', loopResult.error)
      await updateJobStatus(jobId, 'rejected', {
        output_data: { error: loopResult.error, stage: loopResult.stage, journey: takip.toJSON() },
      })
      await addJobLog({ job_id: jobId, action: 'internal_loop_failed', actor: 'CELF', details: { error: loopResult.error, stage: loopResult.stage } })
      return { success: false, job_id: jobId, ticket_no: ticketNo, error: loopResult.error, journey: takip.toJSON() }
    }

    const result = loopResult as InternalLoopResult

    takip.completeStep('direktorluk_uretim', `${result.provider} ile üretildi (${result.rounds} tur)`)

    // Denetim adımı
    takip.startStep('direktorluk_denetim', 'Claude iç denetim', 'CLAUDE')
    takip.completeStep('direktorluk_denetim', result.review_passed ? 'GEÇTİ' : `KALDI (${result.rounds} tur sonra uyarılı geçirildi)`)

    // ══════════════════════════════════════════════════════════════
    // 8. ŞİRKET SÜZGECİ — Anayasa kontrolü
    // ══════════════════════════════════════════════════════════════
    const suzgecSonucu = takip.runSirketSuzgeci(result.output)

    const allWarnings: string[] = []
    const allSuggestions: string[] = []

    if (!suzgecSonucu.passed) {
      allWarnings.push(...suzgecSonucu.violations.map(v => `[ANAYASA] ${v}`))
    }
    allSuggestions.push(...suzgecSonucu.suggestions)

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
        sirket_suzgeci: suzgecSonucu.passed,
      },
    })

    // ══════════════════════════════════════════════════════════════
    // 9. CELF MOTOR — Üretim hattı görevlendirme + kuyruk
    // ══════════════════════════════════════════════════════════════
    takip.startStep('celf_motor_gorevlendirme', 'CELF Motor görevlendiriyor', 'CELF_MOTOR')

    const dispatchResult = await dispatchToProduction({
      job_id: jobId,
      command: req.command,
      source_directorate: directorKey,
      directorate_output: result.output,
      idea_producer: result.provider as 'CLAUDE' | 'GPT' | 'GEMINI' | 'V0' | 'CURSOR' | 'TOGETHER',
      priority: req.priority ?? 'normal',
    })

    if (dispatchResult.dispatched) {
      takip.completeStep('celf_motor_gorevlendirme', `Hat: ${dispatchResult.assigned_pipeline.join('→')}, Kuyruk: #${dispatchResult.queue_position}`)
      takip.addProductionSteps(dispatchResult.assigned_pipeline)
    } else {
      // Tekrar engeli veya başka sebep
      takip.completeStep('celf_motor_gorevlendirme', dispatchResult.warnings[0] ?? 'Görevlendirme atlandı')
    }

    allWarnings.push(...dispatchResult.warnings)
    allSuggestions.push(...dispatchResult.suggestions)

    // ══════════════════════════════════════════════════════════════
    // 10. CEO HAVUZU'NA GÖNDER — Patron görecek
    // ══════════════════════════════════════════════════════════════
    takip.startStep('ceo_havuzu_gereksinim', 'CEO havuzuna gönderiliyor', 'CELF')

    await updateJobStatus(jobId, 'ceo_pool', {
      output_data: {
        final_output: result.output,
        provider: result.provider,
        review_passed: result.review_passed,
        rounds: result.rounds,
        round_details: result.round_details,
        warning: result.warning,
        sirket_suzgeci: suzgecSonucu,
        celf_motor: {
          content_type: dispatchResult.content_type,
          assigned_pipeline: dispatchResult.assigned_pipeline,
          estimated_tokens: dispatchResult.estimated_tokens,
          queue_position: dispatchResult.queue_position,
        },
        monte: takip.toJSON().monte,
        journey: takip.toJSON(),
        ...(result.github_commit ? { github_commit: result.github_commit } : {}),
      },
      output_preview: result.output.slice(0, 500),
      ai_provider: result.provider,
    })

    takip.completeStep('ceo_havuzu_gereksinim', 'CEO havuzuna düştü — Patron inceleyecek')

    await addJobLog({
      job_id: jobId,
      action: 'sent_to_ceo',
      actor: 'CELF',
      details: {
        review_passed: result.review_passed,
        sirket_suzgeci: suzgecSonucu.passed,
        monte: takip.toJSON().monte,
        pipeline: dispatchResult.assigned_pipeline,
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
      journey: takip.toJSON(),
      suggestions: allSuggestions.length > 0 ? allSuggestions : undefined,
      warnings: allWarnings.length > 0 ? allWarnings : undefined,
    }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : String(err) }
  }
}

// ─── DÜZELTME SONRASI YENİDEN ÜRETİM ────────────────────────

export async function regenerateJob(
  jobId: string,
  correctionNotes: string
): Promise<JobGenerationResult> {
  const { getJobById } = await import('@/lib/db/robot-jobs')
  const { data: originalJob, error } = await getJobById(jobId)

  if (error || !originalJob) {
    return { success: false, error: error ?? 'Orijinal iş bulunamadı' }
  }

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
