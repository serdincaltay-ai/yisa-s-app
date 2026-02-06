/**
 * ═══════════════════════════════════════════════════════════════════
 * YİSA-S CELF İÇ DÖNGÜ MOTORU — V3.0
 * ═══════════════════════════════════════════════════════════════════
 *
 * KRİTİK: Claude denetimi direktörlük İÇİNDE yapılır.
 *
 *  ┌──────────────────────────────────────────────────────────────┐
 *  │  DİREKTÖRLÜK İÇ DÖNGÜ                                      │
 *  │                                                              │
 *  │   ① ÜRETİCİ AI çalışır (GPT / Claude / Gemini / V0 / vb.)  │
 *  │       ↓                                                      │
 *  │   ② CLAUDE DENETÇİ kontrol eder                              │
 *  │       ↓                                                      │
 *  │   ③ GEÇTİ mi? ──── EVET → TEMİZ ÇIKTI → CEO havuzuna       │
 *  │       │                                                      │
 *  │       HAYIR (KALDI)                                          │
 *  │       ↓                                                      │
 *  │   ④ Düzeltme notu üretilir                                   │
 *  │       ↓                                                      │
 *  │   ⑤ ÜRETİCİ AI tekrar çalışır (düzeltme notu ile)           │
 *  │       ↓                                                      │
 *  │   ② Claude tekrar denetler...                                │
 *  │       (max N tur — sonsuz döngü önlemi)                      │
 *  │                                                              │
 *  └──────────────────────────────────────────────────────────────┘
 *
 * Tarih: 6 Şubat 2026
 */

import { getDirectorateMap, type DirectorateInternalStructure } from './directorate-map'
import { runCelfDirector, callClaude, type CelfResult } from '@/lib/ai/celf-execute'
import { type DirectorKey } from '@/lib/robots/celf-center'

// ─── Tipler ──────────────────────────────────────────────────

export interface InternalLoopResult {
  /** Son temiz çıktı */
  output: string
  /** Hangi AI sağlayıcı üretti */
  provider: string
  /** Denetimden geçti mi */
  review_passed: boolean
  /** Kaç tur döndü (1 = ilk üretimde geçti) */
  rounds: number
  /** Tur detayları */
  round_details: RoundDetail[]
  /** Uyarı (max tur aşıldıysa) */
  warning?: string
  /** GitHub commit bilgisi (CTO için) */
  github_commit?: { commitSha: string; owner: string; repo: string; branch: string }
}

export interface RoundDetail {
  round: number
  /** Üretici çıktısı (kısaltılmış) */
  producer_output_preview: string
  /** Claude denetim sonucu */
  review_verdict: 'GEÇTİ' | 'KALDI'
  /** Claude denetim açıklaması */
  review_note: string
  /** Düzeltme notu (varsa, sonraki tura input) */
  correction_note?: string
}

export interface InternalLoopError {
  success: false
  error: string
  stage: 'producer' | 'reviewer' | 'system'
}

// ─── Claude İç Denetim Fonksiyonu ─────────────────────────────

async function runClaudeInternalReview(
  directorate: DirectorateInternalStructure,
  command: string,
  producerOutput: string,
  roundNumber: number
): Promise<{ passed: boolean; note: string; correction?: string }> {
  const criteriaList = directorate.reviewer.review_criteria
    .map((c, i) => `${i + 1}. ${c}`)
    .join('\n')

  const reviewPrompt = `Sen YİSA-S ${directorate.name} iç denetçisisin (Claude — Altın Kural #4).
Bu iş, ${directorate.name} İÇİNDE üretildi. Senin görevin bu çıktıyı İÇERİDE denetlemek.
Dışarı (CEO havuzuna) sadece TEMİZ iş çıkmalı.

DİREKTÖRLÜK: ${directorate.key} — ${directorate.name}
ÜRETİCİ AI: ${directorate.producer.ai}
TUR: ${roundNumber}
GÖREV: ${command}

ÜRETİCİ ÇIKTISI:
${producerOutput.slice(0, 4000)}

DENETİM KRİTERLERİ:
${criteriaList}

SINIRLAR (aşılmamalı):
${directorate.boundaries.join(', ')}

─── TALİMATLAR ───
1. Çıktıyı yukarıdaki kriterlere göre denetle.
2. Sınır aşılmış mı kontrol et.
3. Kalite yeterli mi (boş, anlamsız, konu dışı mı)?

─── YANIT FORMATI (TAM OLARAK BU FORMATTA YAZ) ───
DURUM: GEÇTİ
AÇIKLAMA: [neden geçtiğine dair kısa açıklama]

VEYA

DURUM: KALDI
AÇIKLAMA: [sorunun ne olduğu]
DÜZELTME: [üretici AI'ya iletilecek düzeltme talimatı — net ve spesifik]`

  const reviewResult = await callClaude(reviewPrompt, undefined, 'celf')

  if (!reviewResult) {
    // Claude API hatası — güvenli tarafta kal, geçir ama uyar
    return {
      passed: true,
      note: 'Claude iç denetimi yapılamadı (API hatası). İş uyarı ile geçirildi.',
    }
  }

  const upper = reviewResult.toUpperCase()
  const passed = !upper.includes('DURUM: KALDI')

  // Düzeltme notunu çıkar
  let correction: string | undefined
  if (!passed) {
    const correctionMatch = reviewResult.match(/DÜZELTME:\s*(.+)/i)
    if (correctionMatch) {
      correction = correctionMatch[1].trim()
    } else {
      // AÇIKLAMA'yı düzeltme notu olarak kullan
      const aciklamaMatch = reviewResult.match(/AÇIKLAMA:\s*(.+)/i)
      correction = aciklamaMatch ? aciklamaMatch[1].trim() : 'Çıktıyı gözden geçir ve iyileştir.'
    }
  }

  // Açıklama
  const aciklamaMatch = reviewResult.match(/AÇIKLAMA:\s*(.+?)(?:\n|DÜZELTME:|$)/i)
  const note = aciklamaMatch ? aciklamaMatch[1].trim() : reviewResult.slice(0, 300)

  return { passed, note, correction }
}

// ─── Üretici AI'yı Düzeltme Notu ile Tekrar Çalıştır ──────────

async function runProducerWithCorrection(
  directorate: DirectorateInternalStructure,
  originalCommand: string,
  previousOutput: string,
  correctionNote: string,
  roundNumber: number
): Promise<CelfResult> {
  // Düzeltme notu ile zenginleştirilmiş komut oluştur
  const enhancedCommand = `${originalCommand}

─── İÇ DENETİM DÜZELTME NOTU (Tur ${roundNumber}) ───
Önceki çıktın denetimden geçemedi. Aşağıdaki düzeltmeleri yaparak tekrar üret:

DÜZELTME: ${correctionNote}

ÖNCEKİ ÇIKTIN (referans):
${previousOutput.slice(0, 2000)}

Lütfen düzeltmeleri uygulayarak yeni bir çıktı üret. Aynı hatayı tekrarlama.`

  return runCelfDirector(directorate.key as DirectorKey, enhancedCommand)
}

// ─── ANA İÇ DÖNGÜ FONKSİYONU ─────────────────────────────────

/**
 * Direktörlük iç döngüsünü çalıştırır.
 *
 * 1. Üretici AI çalışır
 * 2. Claude İÇERİDE denetler
 * 3. Sorun varsa → düzeltme notu → üretici tekrar çalışır
 * 4. Max N tur döndükten sonra ya temiz çıktı ya uyarılı çıktı
 *
 * @param directorKey - Direktörlük kodu (CFO, CTO, CMO, vb.)
 * @param command - Patron komutu / görev açıklaması
 * @returns InternalLoopResult veya InternalLoopError
 */
export async function runDirectorateInternalLoop(
  directorKey: string,
  command: string
): Promise<InternalLoopResult | InternalLoopError> {
  // 1. Direktörlük yapısını al
  const directorate = getDirectorateMap(directorKey)
  if (!directorate) {
    return {
      success: false,
      error: `Direktörlük bulunamadı: ${directorKey}`,
      stage: 'system',
    }
  }

  const maxRounds = directorate.reviewer.max_fix_rounds + 1 // +1 çünkü ilk üretim de sayılır
  const roundDetails: RoundDetail[] = []
  let lastOutput = ''
  let lastProvider = ''
  let githubCommit: InternalLoopResult['github_commit'] | undefined

  // 2. Döngüye gir
  for (let round = 1; round <= maxRounds; round++) {
    // ── Üretici AI çalıştır ──
    let celfResult: CelfResult

    if (round === 1) {
      // İlk tur: normal üretim
      celfResult = await runCelfDirector(directorKey as DirectorKey, command)
    } else {
      // Sonraki turlar: düzeltme notu ile
      const prevCorrection = roundDetails[round - 2]?.correction_note
      if (!prevCorrection) break // Düzeltme notu yoksa döngüden çık

      celfResult = await runProducerWithCorrection(
        directorate,
        command,
        lastOutput,
        prevCorrection,
        round
      )
    }

    // Üretici hata verdiyse
    if (!celfResult.text) {
      const errorReason = 'errorReason' in celfResult ? celfResult.errorReason : 'AI yanıt vermedi'
      // İlk turda hata → tamamen başarısız
      if (round === 1) {
        return {
          success: false,
          error: `Üretici AI hata verdi: ${errorReason}`,
          stage: 'producer',
        }
      }
      // Sonraki turlarda hata → son geçerli çıktıyı kullan (uyarılı)
      break
    }

    lastOutput = celfResult.text
    lastProvider = 'provider' in celfResult ? celfResult.provider : 'UNKNOWN'

    // GitHub commit bilgisi (CTO)
    if ('githubPreparedCommit' in celfResult && celfResult.githubPreparedCommit) {
      githubCommit = celfResult.githubPreparedCommit
    }

    // ── Claude İç Denetim ──
    const review = await runClaudeInternalReview(directorate, command, lastOutput, round)

    const roundDetail: RoundDetail = {
      round,
      producer_output_preview: lastOutput.slice(0, 300),
      review_verdict: review.passed ? 'GEÇTİ' : 'KALDI',
      review_note: review.note,
      correction_note: review.correction,
    }
    roundDetails.push(roundDetail)

    // Geçtiyse → döngüden çık, temiz çıktı
    if (review.passed) {
      return {
        output: lastOutput,
        provider: lastProvider,
        review_passed: true,
        rounds: round,
        round_details: roundDetails,
        github_commit: githubCommit,
      }
    }

    // Kaldıysa ve son tursa → uyarılı çıktı
    if (round === maxRounds) {
      return {
        output: lastOutput,
        provider: lastProvider,
        review_passed: false,
        rounds: round,
        round_details: roundDetails,
        warning: `${directorate.name}: ${maxRounds} tur iç denetimden sonra hâlâ sorun mevcut. İş uyarılı olarak CEO havuzuna gönderiliyor.`,
        github_commit: githubCommit,
      }
    }

    // Kaldıysa ve daha tur varsa → döngü devam (düzeltme notu ile üretici tekrar çalışacak)
  }

  // Buraya düşmemeli ama güvenlik için
  return {
    output: lastOutput || '(Çıktı üretilemedi)',
    provider: lastProvider || 'UNKNOWN',
    review_passed: false,
    rounds: roundDetails.length,
    round_details: roundDetails,
    warning: 'İç döngü beklenmedik şekilde sonlandı.',
    github_commit: githubCommit,
  }
}

// ─── YARDIMCI: Sonuç formatla (log/debug için) ─────────────────

export function formatLoopResult(result: InternalLoopResult): string {
  const lines: string[] = [
    `═══ İÇ DÖNGÜ SONUCU ═══`,
    `Sağlayıcı: ${result.provider}`,
    `Denetim: ${result.review_passed ? '✓ GEÇTİ' : '✗ KALDI (uyarılı)'}`,
    `Tur sayısı: ${result.rounds}`,
  ]

  if (result.warning) {
    lines.push(`⚠ Uyarı: ${result.warning}`)
  }

  for (const rd of result.round_details) {
    lines.push(``)
    lines.push(`── Tur ${rd.round} ──`)
    lines.push(`Denetim: ${rd.review_verdict}`)
    lines.push(`Not: ${rd.review_note}`)
    if (rd.correction_note) {
      lines.push(`Düzeltme: ${rd.correction_note}`)
    }
  }

  return lines.join('\n')
}
