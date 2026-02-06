/**
 * ═══════════════════════════════════════════════════════════════════════════
 * YİSA-S CELF MOTOR — Merkez Görevlendirici Robot
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * CELF Motor = Sistemin BEYNİ. Her iş buradan geçer.
 *
 * Ne yapar:
 *  1. Direktörlüklerden gelen işleri ALIR
 *  2. İçerik türünü tespit eder → hangi robotlar çalışacak
 *  3. TEKRAR KONTROL: Aynı iş zaten kuyrukta mı? (token tasarrufu!)
 *  4. İŞ SIRASI oluşturur (öncelik + sıra)
 *  5. Üretim havuzuna GÖNDERİR
 *  6. Yapılamayan işler için ÖNERİ sunar (bloklamaz, öneri verir)
 *  7. Token bütçesini TAKIP eder
 *
 * Maliyet Optimizasyonu:
 *  - Basit metin → GPT (ucuz) yerine Claude (pahalı) kullanma
 *  - Basit tasarım → V0 tek başına, Cursor'a gerek yok
 *  - Aynı iş 2 kez gelmesin → token israfı engelle
 *  - Rutin işler → önceden onaylanmış şablondan üret, AI çağrısı minimum
 *
 * Tarih: 6 Şubat 2026
 */

import {
  type ProductionContentType,
  type AIRobot,
  detectProductionContentType,
  getProductionPipeline,
  getAlternativePipelines,
  PRODUCTION_PIPELINES,
} from './sistem-haritasi'
import { getDirectorateMap } from './directorate-map'
import { addJobLog } from '@/lib/db/robot-jobs'

// ─── Tipler ──────────────────────────────────────────────────

export interface CelfDispatchRequest {
  /** İş ID (robot_jobs tablosundan) */
  job_id: string
  /** Orijinal patron komutu */
  command: string
  /** Gönderen direktörlük */
  source_directorate: string
  /** Direktörlük iç döngüsünden çıkan temiz çıktı */
  directorate_output: string
  /** Direktörlükte fikri geliştiren AI */
  idea_producer: AIRobot
  /** Patron tarafından belirlenmiş robot hattı (opsiyonel) */
  patron_override_pipeline?: AIRobot[]
  /** Öncelik */
  priority: 'low' | 'normal' | 'high' | 'critical'
}

export interface CelfDispatchResult {
  /** Görevlendirme başarılı mı */
  dispatched: boolean
  /** Üretim kuyruğu ID */
  queue_id?: string
  /** Belirlenen içerik türü */
  content_type: ProductionContentType
  /** Atanan robot sırası */
  assigned_pipeline: AIRobot[]
  /** Tahmini token maliyeti */
  estimated_tokens: number
  /** Kuyruk sırası */
  queue_position?: number
  /** Uyarılar (bloklamaz, bilgilendirir) */
  warnings: string[]
  /** Öneriler (yapılamayan/sınırlanan durumlar için) */
  suggestions: string[]
  /** Tekrar engeli mi */
  duplicate_blocked?: boolean
}

// ─── Kuyruk Yönetimi (Bellekte — DB'ye yazılacak) ────────────

interface QueueItem {
  job_id: string
  command_hash: string
  command_preview: string
  content_type: ProductionContentType
  pipeline: AIRobot[]
  priority: number  // 1=critical, 2=high, 3=normal, 4=low
  source_directorate: string
  status: 'queued' | 'in_progress' | 'completed' | 'failed'
  created_at: string
}

// Bellekteki kuyruk (uygulama yaşam döngüsü boyunca)
const productionQueue: QueueItem[] = []

// Basit hash fonksiyonu — aynı komutları tespit etmek için
function hashCommand(command: string): string {
  const normalized = command
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .slice(0, 300)  // İlk 300 karakter yeter
  // Basit hash: karakter kodlarının toplamı + uzunluk
  let hash = 0
  for (let i = 0; i < normalized.length; i++) {
    const chr = normalized.charCodeAt(i)
    hash = ((hash << 5) - hash) + chr
    hash |= 0 // 32bit integer
  }
  return `cmd_${Math.abs(hash).toString(36)}_${normalized.length}`
}

// Öncelik sayıya çevir
function priorityToNumber(p: string): number {
  switch (p) {
    case 'critical': return 1
    case 'high': return 2
    case 'normal': return 3
    case 'low': return 4
    default: return 3
  }
}

// ─── TEKRAR KONTROL (Token Tasarrufu!) ───────────────────────
//
// Aynı komut son 15 dakika içinde zaten gönderilmişse:
//  - Yeni iş BLOKLANIR
//  - Patron'a bilgi verilir: "Bu iş zaten kuyrukta, onay bekleniyor"
//  - Token israfı engellenir
//
// Benzer komut geldiyse (tam aynı değil ama yakın):
//  - Uyarı verilir ama bloklanmaz
//  - Patron karar verir

function checkDuplicate(command: string, sourceDirectorate: string): {
  is_duplicate: boolean
  is_similar: boolean
  existing_job_id?: string
  message: string
} {
  const hash = hashCommand(command)
  const fifteenMinAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString()

  // Tam tekrar kontrolü
  const exactMatch = productionQueue.find(
    q => q.command_hash === hash
      && q.status !== 'completed'
      && q.status !== 'failed'
      && q.created_at > fifteenMinAgo
  )

  if (exactMatch) {
    return {
      is_duplicate: true,
      is_similar: false,
      existing_job_id: exactMatch.job_id,
      message: `Bu iş zaten kuyrukta (${exactMatch.job_id}). Durumu: ${exactMatch.status}. Onay bekleniyor — tekrar göndermeye gerek yok. Token tasarrufu sağlandı.`,
    }
  }

  // Benzer komut kontrolü (aynı direktörlük + aynı içerik türü, 5 dk içinde)
  const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
  const contentType = detectProductionContentType(command)
  const similarMatch = productionQueue.find(
    q => q.source_directorate === sourceDirectorate
      && q.content_type === contentType
      && q.status !== 'completed'
      && q.status !== 'failed'
      && q.created_at > fiveMinAgo
  )

  if (similarMatch) {
    return {
      is_duplicate: false,
      is_similar: true,
      existing_job_id: similarMatch.job_id,
      message: `Benzer bir iş zaten kuyrukta: "${similarMatch.command_preview}". Devam etmek istiyor musunuz?`,
    }
  }

  return { is_duplicate: false, is_similar: false, message: '' }
}

// ─── TOKEN BÜTÇESİ KONTROL ──────────────────────────────────

const DAILY_TOKEN_BUDGET = 30000  // Günlük toplam bütçe
let dailyTokensUsed = 0
let lastResetDate = new Date().toDateString()

function checkTokenBudget(estimatedTokens: number): {
  within_budget: boolean
  remaining: number
  message: string
  suggestion?: string
} {
  // Gün değiştiyse sıfırla
  const today = new Date().toDateString()
  if (today !== lastResetDate) {
    dailyTokensUsed = 0
    lastResetDate = today
  }

  const remaining = DAILY_TOKEN_BUDGET - dailyTokensUsed

  if (estimatedTokens > remaining) {
    return {
      within_budget: false,
      remaining,
      message: `Günlük token bütçesi: ${remaining} kaldı, bu iş ~${estimatedTokens} token gerektirir.`,
      suggestion: `Öneri: Daha düşük maliyetli bir robot hattı seçilebilir. Örneğin V0+Cursor yerine sadece V0, veya Claude yerine GPT.`,
    }
  }

  return {
    within_budget: true,
    remaining: remaining - estimatedTokens,
    message: `Token bütçesi yeterli. Kalan: ${remaining - estimatedTokens}`,
  }
}

function consumeTokens(amount: number) {
  dailyTokensUsed += amount
}

// ─── MALİYET OPTİMİZASYONU — Akıllı Robot Seçimi ────────────
//
// Patron "maliyet düşük olsun" dedi. O zaman:
// - Basit metin işi → GPT (ucuz, yeterli)
// - Karmaşık analiz → Claude (gerekli)
// - Basit tasarım → V0 tek başına (Cursor'a gerek yok)
// - Karmaşık UI → V0 + Cursor (gerekli)
// - Sosyal medya → Gemini tek başına (çoğu zaman yeter)
// - Görsel gerektiren → Gemini + V0

function optimizePipeline(
  pipeline: AIRobot[],
  contentType: ProductionContentType,
  command: string
): {
  optimized: AIRobot[]
  savings_note?: string
} {
  const lower = command.toLowerCase()

  // Basit metin işi — tek robot yeterli
  if (contentType === 'metin_rapor') {
    if (pipeline.length > 1) {
      return {
        optimized: ['GPT'],
        savings_note: 'Basit metin işi — GPT tek başına yeterli, maliyet düşürüldü.',
      }
    }
  }

  // Basit liste/tablo — GPT yeterli
  if (/liste|tablo|madde/.test(lower) && contentType === 'metin_rapor') {
    return {
      optimized: ['GPT'],
      savings_note: 'Liste/tablo işi — GPT yeterli.',
    }
  }

  // Basit sosyal medya postu — Gemini tek başına
  if (contentType === 'sosyal_medya' && !/görsel|resim|tasarım|video/.test(lower)) {
    return {
      optimized: ['GEMINI'],
      savings_note: 'Metin bazlı sosyal medya — Gemini yeterli, V0 atlandı.',
    }
  }

  // Basit logo/ikon — V0 tek başına
  if (contentType === 'logo_grafik') {
    return {
      optimized: ['V0'],
      savings_note: 'Logo/grafik — V0 tek başına yeterli.',
    }
  }

  // Karmaşık kampanya — tam hat gerekli, optimizasyon yok
  if (contentType === 'kampanya') {
    return { optimized: pipeline }
  }

  return { optimized: pipeline }
}

// ─── ÖNERİ MOTORU — Yapılamayanlar İçin Alternatif Sunma ────

function generateSuggestions(
  contentType: ProductionContentType,
  warnings: string[]
): string[] {
  const suggestions: string[] = []

  if (warnings.some(w => w.includes('bütçe'))) {
    suggestions.push('Daha düşük maliyetli robot hattı seçilebilir.')
    const alternatives = getAlternativePipelines(contentType)
    if (alternatives.length > 0) {
      const cheapest = alternatives[0]
      suggestions.push(`Alternatif: "${cheapest.label}" hattı daha uygun maliyetli olabilir.`)
    }
  }

  if (warnings.some(w => w.includes('benzer'))) {
    suggestions.push('Önceki benzer iş sonucunu güncellemek, yeniden üretmekten daha verimli olabilir.')
  }

  return suggestions
}

// ─── ANA GÖREVLENDİRME FONKSİYONU ──────────────────────────

/**
 * CELF Motor — Merkez Görevlendirici
 *
 * Direktörlükten gelen temiz işi alır, üretim hattını belirler,
 * tekrar kontrolü yapar, token bütçesini kontrol eder,
 * kuyruğa ekler ve üretim havuzuna gönderir.
 */
export async function dispatchToProduction(req: CelfDispatchRequest): Promise<CelfDispatchResult> {
  const warnings: string[] = []
  const suggestions: string[] = []

  // 1. İçerik türünü tespit et
  const contentType = detectProductionContentType(req.command)
  const pipeline = getProductionPipeline(contentType)

  // 2. TEKRAR KONTROL — Aynı iş zaten kuyrukta mı?
  const dupeCheck = checkDuplicate(req.command, req.source_directorate)
  if (dupeCheck.is_duplicate) {
    await addJobLog({
      job_id: req.job_id,
      action: 'celf_motor_duplicate_blocked',
      actor: 'CELF_MOTOR',
      details: {
        existing_job_id: dupeCheck.existing_job_id,
        message: dupeCheck.message,
      },
    })

    return {
      dispatched: false,
      content_type: contentType,
      assigned_pipeline: [],
      estimated_tokens: 0,
      warnings: [dupeCheck.message],
      suggestions: ['Önceki işin sonucunu bekleyebilirsiniz.', 'Farklı bir iş göndermek isterseniz komut metnini değiştirin.'],
      duplicate_blocked: true,
    }
  }

  if (dupeCheck.is_similar) {
    warnings.push(dupeCheck.message)
  }

  // 3. Robot hattını belirle
  let assignedPipeline: AIRobot[]

  if (req.patron_override_pipeline && req.patron_override_pipeline.length > 0) {
    // Patron özel hat belirlediyse — ona uy
    assignedPipeline = req.patron_override_pipeline
  } else {
    // Otomatik hat — içerik türüne göre
    assignedPipeline = pipeline?.robot_sequence ?? ['GPT']
  }

  // 4. MALİYET OPTİMİZASYONU — Gereksiz robotu çıkar
  const optimized = optimizePipeline(assignedPipeline, contentType, req.command)
  assignedPipeline = optimized.optimized
  if (optimized.savings_note) {
    warnings.push(`💡 Maliyet optimizasyonu: ${optimized.savings_note}`)
  }

  // 5. TOKEN BÜTÇESİ KONTROL
  const estimatedTokens = pipeline?.estimated_tokens ?? 3000
  const budgetCheck = checkTokenBudget(estimatedTokens)

  if (!budgetCheck.within_budget) {
    warnings.push(budgetCheck.message)
    if (budgetCheck.suggestion) {
      suggestions.push(budgetCheck.suggestion)
    }
    // Bütçe aşılsa bile BLOKLAMAZ — uyarı verir, Patron karar verir
  }

  // 6. KUYRUĞA EKLE
  const commandHash = hashCommand(req.command)
  const queueItem: QueueItem = {
    job_id: req.job_id,
    command_hash: commandHash,
    command_preview: req.command.slice(0, 100),
    content_type: contentType,
    pipeline: assignedPipeline,
    priority: priorityToNumber(req.priority),
    source_directorate: req.source_directorate,
    status: 'queued',
    created_at: new Date().toISOString(),
  }

  productionQueue.push(queueItem)

  // Kuyruğu önceliğe göre sırala
  productionQueue.sort((a, b) => {
    if (a.status === 'in_progress' && b.status !== 'in_progress') return -1
    if (b.status === 'in_progress' && a.status !== 'in_progress') return 1
    return a.priority - b.priority
  })

  const queuePosition = productionQueue.filter(q => q.status === 'queued').indexOf(queueItem) + 1

  // 7. Öneriler oluştur
  suggestions.push(...generateSuggestions(contentType, warnings))

  // Alternatif hatlar bilgisi
  const alternatives = getAlternativePipelines(contentType)
  if (alternatives.length > 1) {
    suggestions.push(`Alternatif üretim hatları mevcut: ${alternatives.map(a => a.label).join(', ')}`)
  }

  // 8. Token tüketimini kaydet
  consumeTokens(estimatedTokens)

  // 9. Log
  await addJobLog({
    job_id: req.job_id,
    action: 'celf_motor_dispatched',
    actor: 'CELF_MOTOR',
    details: {
      content_type: contentType,
      assigned_pipeline: assignedPipeline,
      estimated_tokens: estimatedTokens,
      queue_position: queuePosition,
      cost_optimized: !!optimized.savings_note,
      warnings_count: warnings.length,
    },
  })

  return {
    dispatched: true,
    queue_id: `PQ-${req.job_id}`,
    content_type: contentType,
    assigned_pipeline: assignedPipeline,
    estimated_tokens: estimatedTokens,
    queue_position: queuePosition,
    warnings,
    suggestions,
  }
}

// ─── KUYRUK YÖNETİMİ ────────────────────────────────────────

/** Kuyruktan sıradaki işi al */
export function getNextInQueue(): QueueItem | null {
  return productionQueue.find(q => q.status === 'queued') ?? null
}

/** Kuyruktaki bir işin durumunu güncelle */
export function updateQueueItemStatus(jobId: string, status: QueueItem['status']) {
  const item = productionQueue.find(q => q.job_id === jobId)
  if (item) item.status = status
}

/** Kuyruk durumunu getir (CELF ekranı için) */
export function getQueueStatus(): {
  total: number
  queued: number
  in_progress: number
  completed: number
  failed: number
  items: QueueItem[]
  daily_tokens_used: number
  daily_tokens_remaining: number
} {
  return {
    total: productionQueue.length,
    queued: productionQueue.filter(q => q.status === 'queued').length,
    in_progress: productionQueue.filter(q => q.status === 'in_progress').length,
    completed: productionQueue.filter(q => q.status === 'completed').length,
    failed: productionQueue.filter(q => q.status === 'failed').length,
    items: productionQueue.slice(0, 50),  // Son 50 iş
    daily_tokens_used: dailyTokensUsed,
    daily_tokens_remaining: DAILY_TOKEN_BUDGET - dailyTokensUsed,
  }
}

/** Kuyruktan eski tamamlanmış işleri temizle (24 saat üzeri) */
export function cleanupQueue() {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const toRemove = productionQueue.filter(
    q => (q.status === 'completed' || q.status === 'failed') && q.created_at < oneDayAgo
  )
  for (const item of toRemove) {
    const idx = productionQueue.indexOf(item)
    if (idx !== -1) productionQueue.splice(idx, 1)
  }
}
