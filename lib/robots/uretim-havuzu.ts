/**
 * ═══════════════════════════════════════════════════════════════════════════
 * YİSA-S ÜRETİM HAVUZU — Robot Pipeline Çalıştırıcı
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * CELF Motor görevlendirdi → Üretim Havuzu ÇALIŞTIRIR.
 *
 * Robot sırası (pipeline) boyunca her robot çalışır:
 *  1. İlk robot → orijinal komut + direktörlük çıktısı ile çalışır
 *  2. Sonraki robot → önceki robotun çıktısını alır, üzerine ekler
 *  3. Son aşama → Claude denetim (her zaman)
 *  4. Temiz ürün → CEO havuzuna geri
 *
 * Maliyet Prensibi:
 *  - Her robot SADECE kendi uzmanlık alanında çalışır
 *  - Gereksiz robot çağrılmaz
 *  - Başarısız olursa sonraki robota geçmez, hata raporu verir
 *
 * Tarih: 6 Şubat 2026
 */

import type { AIRobot, ProductionContentType } from './sistem-haritasi'
import { runCelfDirector, callClaude } from '@/lib/ai/celf-execute'
import type { DirectorKey } from './celf-center'
import { addJobLog, updateJobStatus } from '@/lib/db/robot-jobs'
import { updateQueueItemStatus } from './celf-motor'

// ─── Tipler ──────────────────────────────────────────────────

export interface ProductionRequest {
  /** İş ID */
  job_id: string
  /** Orijinal patron komutu */
  command: string
  /** Direktörlük çıktısı (gereksinim dokümanı vb.) */
  directorate_output: string
  /** Gönderen direktörlük */
  source_directorate: string
  /** Çalıştırılacak robot sırası */
  pipeline: AIRobot[]
  /** İçerik türü */
  content_type: ProductionContentType
}

export interface PipelineStepResult {
  /** Adım numarası (1'den başlar) */
  step: number
  /** Çalışan robot */
  robot: AIRobot
  /** Robot çıktısı */
  output: string
  /** Başarılı mı */
  success: boolean
  /** Hata mesajı (başarısızsa) */
  error?: string
  /** Tahmini token kullanımı */
  tokens_used: number
}

export interface ProductionResult {
  /** Üretim başarılı mı */
  success: boolean
  /** Son birleştirilmiş çıktı */
  final_output: string
  /** Her adımın detayı */
  steps: PipelineStepResult[]
  /** Claude son denetim sonucu */
  claude_review: {
    passed: boolean
    note: string
  }
  /** Toplam kullanılan token */
  total_tokens: number
  /** Kaç robot çalıştı */
  robots_used: number
  /** Uyarılar */
  warnings: string[]
}

// ─── Robot Çağrı Fonksiyonları ───────────────────────────────
//
// Her robot kendi uzmanlık alanına göre çağrılır.
// Önceki robotun çıktısı, sonraki robotun input'u olur.

async function callRobot(
  robot: AIRobot,
  command: string,
  previousOutput: string,
  contentType: ProductionContentType,
  sourceDirectorate: string
): Promise<{ output: string | null; error?: string }> {
  // Robot'a göre uygun prompt oluştur
  const context = previousOutput
    ? `\n\nÖNCEKİ AŞAMA ÇIKTISI:\n${previousOutput.slice(0, 3000)}`
    : ''

  const robotPrompt = buildRobotPrompt(robot, command, context, contentType)

  switch (robot) {
    case 'CLAUDE':
      return { output: await callClaude(robotPrompt, undefined, 'celf') }

    case 'GPT': {
      // GPT'yi CELF üzerinden çağır — Gemini orchestrator GPT'ye delege eder
      const result = await runCelfDirector('CFO' as DirectorKey, robotPrompt)
      if (result.text) return { output: result.text }
      return { output: null, error: 'errorReason' in result ? result.errorReason : 'GPT yanıt vermedi' }
    }

    case 'GEMINI': {
      // Gemini'yi CELF üzerinden çağır
      const result = await runCelfDirector('CMO' as DirectorKey, robotPrompt)
      if (result.text) return { output: result.text }
      return { output: null, error: 'errorReason' in result ? result.errorReason : 'Gemini yanıt vermedi' }
    }

    case 'V0': {
      // V0'ı CPO üzerinden çağır
      const result = await runCelfDirector('CPO' as DirectorKey, robotPrompt, { v0Only: true })
      if (result.text) return { output: result.text }
      return { output: null, error: 'errorReason' in result ? result.errorReason : 'V0 yanıt vermedi' }
    }

    case 'CURSOR': {
      // Cursor'ı CTO üzerinden çağır
      const result = await runCelfDirector('CTO' as DirectorKey, robotPrompt, { cursorOnly: true })
      if (result.text) return { output: result.text }
      return { output: null, error: 'errorReason' in result ? result.errorReason : 'Cursor yanıt vermedi' }
    }

    case 'TOGETHER': {
      // Together'ı CIO üzerinden çağır
      const result = await runCelfDirector('CIO' as DirectorKey, robotPrompt)
      if (result.text) return { output: result.text }
      return { output: null, error: 'errorReason' in result ? result.errorReason : 'Together yanıt vermedi' }
    }

    default:
      return { output: null, error: `Bilinmeyen robot: ${robot}` }
  }
}

function buildRobotPrompt(
  robot: AIRobot,
  command: string,
  context: string,
  contentType: ProductionContentType
): string {
  const roleMap: Record<AIRobot, string> = {
    CLAUDE: 'analiz, denetim ve karmaşık metin üretimi uzmanı',
    GPT: 'metin üretim, planlama ve raporlama uzmanı',
    GEMINI: 'görsel prompt, pazarlama içeriği ve orkestrasyon uzmanı',
    V0: 'UI/UX tasarım, bileşen ve şablon oluşturma uzmanı',
    CURSOR: 'kod yazma, hata ayıklama ve geliştirme uzmanı',
    TOGETHER: 'veri analizi ve istatistik uzmanı',
  }

  const contentGuide: Record<ProductionContentType, string> = {
    ui_sayfa: 'React bileşeni veya sayfa tasarımı üret. Tailwind CSS kullan.',
    logo_grafik: 'Logo veya grafik tasarım önerisi sun. SVG/detaylı açıklama ver.',
    sosyal_medya: 'Sosyal medya içeriği üret. Hashtag, görsel açıklama, metin planı dahil.',
    video: 'Video senaryo veya animasyon planı oluştur. Sahne sahne detaylandır.',
    kod_api: 'TypeScript/Next.js kodu yaz. Mevcut projeyle uyumlu olsun.',
    metin_rapor: 'Rapor veya belge üret. Türkçe, net, tablo formatında.',
    antrenman: 'Antrenman programı hazırla. Yaşa uygun, güvenli, bilimsel.',
    veri_analiz: 'Veri analizi veya istatistik raporu oluştur.',
    kampanya: 'Pazarlama kampanya planı hazırla. Bütçe, hedef kitle, zamanlama dahil.',
    hukuki: 'Hukuki metin veya sözleşme taslağı yaz. KVKK uyumlu.',
    sablon: 'E-posta veya bildirim şablonu oluştur. Profesyonel ve samimi.',
    robot_config: 'Robot konfigürasyonu hazırla. System prompt, limitler, kurallar dahil.',
  }

  return `Sen YİSA-S üretim robotusun. Rol: ${roleMap[robot]}.
GÖREV: ${command}
İÇERİK TÜRÜ: ${contentType} — ${contentGuide[contentType]}
${context}

Kurallar:
- SADECE kendi uzmanlık alanında çalış
- Türkçe, net ve profesyonel çıktı ver
- YİSA-S bağlamından çıkma
- Uydurma firma/isim/proje yazma`
}

// ─── Claude Son Denetim ──────────────────────────────────────

async function claudeFinalReview(
  command: string,
  finalOutput: string,
  contentType: ProductionContentType,
  robotsUsed: AIRobot[]
): Promise<{ passed: boolean; note: string }> {
  const reviewPrompt = `Sen YİSA-S üretim denetçisisin (Claude — Altın Kural #4).
Üretim havuzundan çıkan ürünü denetle.

GÖREV: ${command}
İÇERİK TÜRÜ: ${contentType}
ÇALIŞTIRILAN ROBOTLAR: ${robotsUsed.join(' → ')}

ÜRÜN:
${finalOutput.slice(0, 4000)}

DENETİM KRİTERLERİ:
1. İçerik görevle uyumlu mu?
2. YİSA-S bağlamında mı (uydurma firma/proje yok mu)?
3. Türkçe yazım hataları var mı?
4. Güvenlik/KVKK ihlali var mı?
5. Kalite yeterli mi (boş/anlamsız değil mi)?
6. Robot sınırları aşılmış mı?

YANIT FORMATI:
DURUM: GEÇTİ veya DURUM: KALDI
AÇIKLAMA: [kısa açıklama]`

  const result = await callClaude(reviewPrompt, undefined, 'celf')

  if (!result) {
    return { passed: true, note: 'Claude denetimi yapılamadı (API hatası). Uyarılı geçirildi.' }
  }

  const passed = !result.toUpperCase().includes('DURUM: KALDI')
  const noteMatch = result.match(/AÇIKLAMA:\s*(.+)/i)
  const note = noteMatch ? noteMatch[1].trim() : result.slice(0, 300)

  return { passed, note }
}

// ─── ANA ÜRETİM FONKSİYONU ──────────────────────────────────

/**
 * Üretim Havuzu — Pipeline Çalıştırıcı
 *
 * CELF Motor'un görevlendirdiği robot sırasını çalıştırır.
 * Her robot sırayla üretim yapar, sonraki öncekinin çıktısını alır.
 * Son aşamada Claude denetim yapar.
 */
export async function runProductionPipeline(req: ProductionRequest): Promise<ProductionResult> {
  const steps: PipelineStepResult[] = []
  const warnings: string[] = []
  let currentOutput = req.directorate_output // İlk input: direktörlük çıktısı
  let totalTokens = 0

  // Kuyruk durumunu güncelle
  updateQueueItemStatus(req.job_id, 'in_progress')

  await addJobLog({
    job_id: req.job_id,
    action: 'production_started',
    actor: 'URETIM_HAVUZU',
    details: {
      pipeline: req.pipeline,
      content_type: req.content_type,
      step_count: req.pipeline.length,
    },
  })

  // Her robot sırayla çalıştır
  for (let i = 0; i < req.pipeline.length; i++) {
    const robot = req.pipeline[i]
    const stepNumber = i + 1

    await addJobLog({
      job_id: req.job_id,
      action: `production_step_${stepNumber}`,
      actor: robot,
      details: { step: stepNumber, robot, status: 'started' },
    })

    const result = await callRobot(
      robot,
      req.command,
      currentOutput,
      req.content_type,
      req.source_directorate
    )

    // Token tahmini (robot başına)
    const estimatedStepTokens = robot === 'V0' || robot === 'CURSOR' ? 3000 : 1500

    if (result.output) {
      steps.push({
        step: stepNumber,
        robot,
        output: result.output,
        success: true,
        tokens_used: estimatedStepTokens,
      })
      // Sonraki robotun input'u bu robotun output'u
      currentOutput = result.output
      totalTokens += estimatedStepTokens

      await addJobLog({
        job_id: req.job_id,
        action: `production_step_${stepNumber}_completed`,
        actor: robot,
        details: { step: stepNumber, robot, output_preview: result.output.slice(0, 200) },
      })
    } else {
      // Robot başarısız — durma, uyarı ver ve devam et
      steps.push({
        step: stepNumber,
        robot,
        output: '',
        success: false,
        error: result.error,
        tokens_used: 500, // Başarısız çağrı da token harcar
      })
      totalTokens += 500

      warnings.push(`${robot} (adım ${stepNumber}) başarısız: ${result.error}. Önceki çıktı ile devam edildi.`)

      await addJobLog({
        job_id: req.job_id,
        action: `production_step_${stepNumber}_failed`,
        actor: robot,
        details: { step: stepNumber, robot, error: result.error },
      })

      // Başarısız robot sonrası devam et — önceki çıktıyı kullan
      // (bloklamaz, sonraki robot denenir)
    }
  }

  // Hiç çıktı üretilemediyse
  if (!currentOutput || currentOutput === req.directorate_output) {
    updateQueueItemStatus(req.job_id, 'failed')

    await addJobLog({
      job_id: req.job_id,
      action: 'production_failed',
      actor: 'URETIM_HAVUZU',
      details: { reason: 'Hiçbir robot çıktı üretemedi.' },
    })

    return {
      success: false,
      final_output: req.directorate_output, // En azından direktörlük çıktısını döndür
      steps,
      claude_review: { passed: false, note: 'Üretim başarısız — direktörlük çıktısı kullanıldı.' },
      total_tokens: totalTokens,
      robots_used: steps.filter(s => s.success).length,
      warnings,
    }
  }

  // Claude son denetim
  const robotsUsed = steps.filter(s => s.success).map(s => s.robot)
  const claudeReview = await claudeFinalReview(
    req.command,
    currentOutput,
    req.content_type,
    robotsUsed
  )
  totalTokens += 1000 // Claude denetim token'ı

  await addJobLog({
    job_id: req.job_id,
    action: 'production_claude_review',
    actor: 'CLAUDE',
    details: {
      passed: claudeReview.passed,
      note: claudeReview.note.slice(0, 500),
    },
  })

  if (!claudeReview.passed) {
    warnings.push(`Claude denetim: ${claudeReview.note}`)
  }

  // Kuyruk durumunu güncelle
  updateQueueItemStatus(req.job_id, 'completed')

  // İşi CEO havuzuna geri gönder
  await updateJobStatus(req.job_id, 'ceo_pool', {
    output_data: {
      production_output: currentOutput,
      pipeline_steps: steps.map(s => ({
        step: s.step,
        robot: s.robot,
        success: s.success,
        output_preview: s.output.slice(0, 300),
        error: s.error,
      })),
      claude_review: claudeReview,
      total_tokens: totalTokens,
      robots_used: robotsUsed,
    },
    output_preview: currentOutput.slice(0, 500),
    ai_provider: robotsUsed.join('+'),
  })

  await addJobLog({
    job_id: req.job_id,
    action: 'production_completed',
    actor: 'URETIM_HAVUZU',
    details: {
      success: true,
      robots_used: robotsUsed,
      total_tokens: totalTokens,
      claude_passed: claudeReview.passed,
    },
  })

  return {
    success: true,
    final_output: currentOutput,
    steps,
    claude_review: claudeReview,
    total_tokens: totalTokens,
    robots_used: robotsUsed.length,
    warnings,
  }
}
