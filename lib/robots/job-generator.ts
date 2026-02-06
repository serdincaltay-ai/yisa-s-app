/**
 * YİSA-S CELF İş Üretim Motoru — V3.0
 *
 * Akış:
 *  1. CELF direktörlük iş alır (komut/görev)
 *  2. Üretici AI çalışır (GPT, Claude, Gemini, V0, vb.)
 *  3. Claude denetler (her zaman — Altın Kural #4)
 *  4. İş CEO Havuzu'na (10'a Çıkart) düşer
 *  5. Patron onaylar/reddeder/düzeltme gönderir
 *  6. Onay → Mağaza/Deploy | Red → CELF'e geri | Düzeltme → CELF tekrar üretir
 *
 * Tarih: 6 Şubat 2026
 */

import { routeToDirector } from '@/lib/robots/ceo-robot'
import { runCelfDirector, callClaude, type CelfResult } from '@/lib/ai/celf-execute'
import { type DirectorKey } from '@/lib/robots/celf-center'
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
  skip_review?: boolean              // Claude denetimini atla (sadece rutin/güvenli işler)
}

export interface JobGenerationResult {
  success: boolean
  job_id?: string
  ticket_no?: string
  status?: string
  output_preview?: string
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

// ─── Claude Denetim ─────────────────────────────────────────

async function reviewWithClaude(
  directorKey: string,
  command: string,
  output: string
): Promise<{ passed: boolean; review: string }> {
  const reviewPrompt = `Sen YİSA-S CELF denetçisisin (Claude). Aşağıdaki iş çıktısını denetle.

Direktörlük: ${directorKey}
Görev: ${command}

Çıktı:
${output.slice(0, 3000)}

Kurallar:
1. Çıktı, görevle uyumlu mu?
2. Prompt sınırları aşılmış mı (başka alanla ilgili içerik var mı)?
3. KVKK/güvenlik ihlali var mı?
4. Kalite yeterli mi (boş/anlamsız yanıt değil mi)?

Yanıtın formatı:
DURUM: GEÇTİ veya DURUM: KALDI
AÇIKLAMA: [kısa açıklama]`

  const result = await callClaude(reviewPrompt, undefined, 'celf')

  if (!result) {
    return { passed: true, review: 'Claude denetimi yapılamadı (API hatası) — iş havuza gönderiliyor.' }
  }

  const passed = !result.toUpperCase().includes('DURUM: KALDI')
  return { passed, review: result }
}

// ─── Görev Çakışması Kontrolü (Altın Kural #12) ─────────────

async function checkDuplicateJob(command: string, directorKey: string): Promise<boolean> {
  // Basit çakışma kontrolü — aynı komutun son 5 dk içinde gönderilmesi
  // İleride daha gelişmiş benzerlik kontrolü eklenebilir
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
    // 1. Direktörlük belirle
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

    // 6. CELF Direktörlüğünde AI çalıştır
    await addJobLog({ job_id: jobId, action: 'celf_started', actor: 'CELF', details: { director_key: directorKey } })

    const celfResult: CelfResult = await runCelfDirector(directorKey as DirectorKey, req.command)

    if (!celfResult.text) {
      await updateJobStatus(jobId, 'rejected', {
        output_data: { error: 'errorReason' in celfResult ? celfResult.errorReason : 'AI yanıt vermedi' },
      })
      await addJobLog({ job_id: jobId, action: 'celf_failed', actor: 'CELF', details: { reason: 'errorReason' in celfResult ? celfResult.errorReason : 'no_output' } })
      return { success: false, job_id: jobId, ticket_no: ticketNo, error: 'errorReason' in celfResult ? celfResult.errorReason : 'AI çıktı üretemedi' }
    }

    const aiProvider = 'provider' in celfResult ? celfResult.provider : 'UNKNOWN'

    // İş çıktısını kaydet
    await updateJobStatus(jobId, 'celf_review', {
      output_data: {
        raw_output: celfResult.text,
        provider: aiProvider,
        ...('githubPreparedCommit' in celfResult && celfResult.githubPreparedCommit
          ? { github_commit: celfResult.githubPreparedCommit }
          : {}),
      },
      output_preview: celfResult.text.slice(0, 500),
      ai_provider: aiProvider,
    })

    await addJobLog({ job_id: jobId, action: 'celf_completed', actor: 'CELF', details: { provider: aiProvider } })

    // 7. Claude denetimi (Altın Kural #4: Claude her zaman denetçi)
    if (!req.skip_review) {
      const review = await reviewWithClaude(directorKey, req.command, celfResult.text)
      await addJobLog({ job_id: jobId, action: 'claude_reviewed', actor: 'CLAUDE', details: { passed: review.passed, review: review.review.slice(0, 500) } })

      if (!review.passed) {
        // Denetimden geçemedi — yine de CEO havuzuna gönder (patron karar versin)
        await updateJobStatus(jobId, 'ceo_pool', {
          output_data: {
            raw_output: celfResult.text,
            provider: aiProvider,
            claude_review: review.review,
            review_passed: false,
          },
        })
        await addJobLog({ job_id: jobId, action: 'sent_to_ceo', actor: 'CLAUDE', details: { note: 'Denetimden geçmedi ama patron incelemesi için havuza gönderildi' } })

        return {
          success: true,
          job_id: jobId,
          ticket_no: ticketNo,
          status: 'ceo_pool',
          output_preview: `[DENETİM UYARISI] ${review.review.slice(0, 200)}\n\n${celfResult.text.slice(0, 300)}`,
        }
      }
    }

    // 8. CEO Havuzu'na (10'a Çıkart) gönder
    await updateJobStatus(jobId, 'ceo_pool')
    await addJobLog({ job_id: jobId, action: 'sent_to_ceo', actor: 'CELF', details: { review_passed: true } })

    return {
      success: true,
      job_id: jobId,
      ticket_no: ticketNo,
      status: 'ceo_pool',
      output_preview: celfResult.text.slice(0, 500),
    }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : String(err) }
  }
}

// ─── DÜZELTME SONRASI YENİDEN ÜRETIM ────────────────────────

export async function regenerateJob(
  jobId: string,
  correctionNotes: string
): Promise<JobGenerationResult> {
  const { getJobById } = await import('@/lib/db/robot-jobs')
  const { data: originalJob, error } = await getJobById(jobId)

  if (error || !originalJob) {
    return { success: false, error: error ?? 'Orijinal iş bulunamadı' }
  }

  // Düzeltme notu ile yeni komut oluştur
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
