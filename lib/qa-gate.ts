/**
 * QA GATE PROTOCOL - 4 Blok Validasyon Sistemi
 * ==============================================
 * Sistemin ön kapısı (gate) olarak çalışır.
 * Tüm görevler bu protokolden geçmek zorundadır.
 * 
 * 4 ZORUNLU BLOK:
 * 1. 🎯 GÖREV - Task tanımı
 * 2. ✅ KABUL KRİTERİ - Acceptance criteria
 * 3. 🔧 DEĞİŞECEK - Değişecek dosya/tablo listesi
 * 4. YÜRÜTME PLANI - Execution plan (adımlar)
 * 
 * OTOMATİK RED LİSTESİ:
 * - "via master"
 * - "undefined"
 * - "null"
 * - boş cevap
 * - "analiz edildi" (sadece analiz, aksiyon yok)
 */

// ==================== TYPE DEFINITIONS ====================

export interface QABlock {
  gorev: string | null           // 🎯 GÖREV
  kabulKriteri: string | null    // ✅ KABUL KRİTERİ
  degisecek: string | null       // 🔧 DEĞİŞECEK
  yurutmePlani: string | null    // YÜRÜTME PLANI
}

export interface QAValidationResult {
  valid: boolean
  missingBlocks: string[]
  rejectionReason: string | null
  autoRejectTriggered: boolean
  autoRejectPattern: string | null
  parsedBlocks: QABlock
  retryRequired: boolean
  retryCount: number
  originalInput: string
  timestamp: string
}

export interface QAGateConfig {
  maxRetries: number
  strictMode: boolean
  allowPartialBlocks: boolean
  logRejections: boolean
}

// ==================== AUTO-REJECT PATTERNS ====================

/**
 * Otomatik RED tetikleyen kalıplar
 * Bu kalıplardan herhangi biri tespit edilirse görev otomatik reddedilir
 */
export const AUTO_REJECT_PATTERNS: { pattern: RegExp; description: string }[] = [
  { pattern: /via\s+master/i, description: 'via master kullanımı yasak' },
  { pattern: /^undefined$/i, description: 'undefined yanıt' },
  { pattern: /^null$/i, description: 'null yanıt' },
  { pattern: /^\s*$/i, description: 'boş cevap' },
  { pattern: /^analiz edildi\.?$/i, description: 'sadece "analiz edildi" - aksiyon yok' },
  { pattern: /^incelendi\.?$/i, description: 'sadece "incelendi" - aksiyon yok' },
  { pattern: /^tamam\.?$/i, description: 'belirsiz yanıt' },
  { pattern: /^ok\.?$/i, description: 'belirsiz yanıt' },
  { pattern: /^anladım\.?$/i, description: 'aksiyon içermeyen yanıt' },
]

/**
 * Blok tanımlayıcıları - regex patterns
 */
export const BLOCK_PATTERNS = {
  gorev: /🎯\s*GÖREV[:\s]*([\s\S]*?)(?=✅|🔧|YÜRÜTME|$)/i,
  kabulKriteri: /✅\s*KABUL\s*KRİTER[İI][:\s]*([\s\S]*?)(?=🔧|YÜRÜTME|$)/i,
  degisecek: /🔧\s*DEĞİŞECEK(?:\s*DOSYA\/TABLO)?[:\s]*([\s\S]*?)(?=YÜRÜTME|$)/i,
  yurutmePlani: /YÜRÜTME\s*PLANI[:\s]*([\s\S]*?)$/i,
}

// ==================== DEFAULT CONFIG ====================

export const DEFAULT_QA_CONFIG: QAGateConfig = {
  maxRetries: 3,
  strictMode: true,
  allowPartialBlocks: false,
  logRejections: true,
}

// ==================== CORE VALIDATION FUNCTIONS ====================

/**
 * 4 Blok formatını parse eder
 */
export function parseBlocks(input: string): QABlock {
  const extract = (pattern: RegExp): string | null => {
    const match = input.match(pattern)
    if (match && match[1]) {
      const content = match[1].trim()
      return content.length > 0 ? content : null
    }
    return null
  }

  return {
    gorev: extract(BLOCK_PATTERNS.gorev),
    kabulKriteri: extract(BLOCK_PATTERNS.kabulKriteri),
    degisecek: extract(BLOCK_PATTERNS.degisecek),
    yurutmePlani: extract(BLOCK_PATTERNS.yurutmePlani),
  }
}

/**
 * Eksik blokları tespit eder
 */
export function findMissingBlocks(blocks: QABlock): string[] {
  const missing: string[] = []
  
  if (!blocks.gorev) missing.push('🎯 GÖREV')
  if (!blocks.kabulKriteri) missing.push('✅ KABUL KRİTERİ')
  if (!blocks.degisecek) missing.push('🔧 DEĞİŞECEK')
  if (!blocks.yurutmePlani) missing.push('YÜRÜTME PLANI')
  
  return missing
}

/**
 * Auto-reject pattern kontrolü
 */
export function checkAutoRejectPatterns(input: string): { triggered: boolean; pattern: string | null; description: string | null } {
  const trimmed = input.trim()
  
  for (const { pattern, description } of AUTO_REJECT_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        triggered: true,
        pattern: pattern.source,
        description,
      }
    }
  }
  
  return { triggered: false, pattern: null, description: null }
}

/**
 * Ana validasyon fonksiyonu
 */
export function validateQAGate(
  input: string,
  retryCount: number = 0,
  config: QAGateConfig = DEFAULT_QA_CONFIG
): QAValidationResult {
  const timestamp = new Date().toISOString()
  
  // Boş input kontrolü
  if (!input || input.trim().length === 0) {
    return {
      valid: false,
      missingBlocks: ['🎯 GÖREV', '✅ KABUL KRİTERİ', '🔧 DEĞİŞECEK', 'YÜRÜTME PLANI'],
      rejectionReason: 'Boş input - 4 blok formatı zorunludur',
      autoRejectTriggered: true,
      autoRejectPattern: 'boş cevap',
      parsedBlocks: { gorev: null, kabulKriteri: null, degisecek: null, yurutmePlani: null },
      retryRequired: retryCount < config.maxRetries,
      retryCount,
      originalInput: input,
      timestamp,
    }
  }

  // Auto-reject pattern kontrolü
  const autoReject = checkAutoRejectPatterns(input)
  if (autoReject.triggered) {
    return {
      valid: false,
      missingBlocks: [],
      rejectionReason: `Otomatik RED: ${autoReject.description}`,
      autoRejectTriggered: true,
      autoRejectPattern: autoReject.pattern,
      parsedBlocks: parseBlocks(input),
      retryRequired: retryCount < config.maxRetries,
      retryCount,
      originalInput: input,
      timestamp,
    }
  }

  // Blokları parse et
  const parsedBlocks = parseBlocks(input)
  const missingBlocks = findMissingBlocks(parsedBlocks)

  // Strict mode: tüm bloklar zorunlu
  if (config.strictMode && missingBlocks.length > 0) {
    return {
      valid: false,
      missingBlocks,
      rejectionReason: `Eksik bloklar: ${missingBlocks.join(', ')}`,
      autoRejectTriggered: false,
      autoRejectPattern: null,
      parsedBlocks,
      retryRequired: retryCount < config.maxRetries,
      retryCount,
      originalInput: input,
      timestamp,
    }
  }

  // Tüm validasyonlar geçti
  return {
    valid: true,
    missingBlocks: [],
    rejectionReason: null,
    autoRejectTriggered: false,
    autoRejectPattern: null,
    parsedBlocks,
    retryRequired: false,
    retryCount,
    originalInput: input,
    timestamp,
  }
}

// ==================== RETRY LOOP MECHANISM ====================

export interface RetryLoopState {
  currentAttempt: number
  maxAttempts: number
  lastValidation: QAValidationResult | null
  history: QAValidationResult[]
  isActive: boolean
  taskId: string
}

/**
 * Yeniden yazdırma döngüsü için state oluşturur
 */
export function createRetryLoop(taskId: string, maxAttempts: number = 3): RetryLoopState {
  return {
    currentAttempt: 0,
    maxAttempts,
    lastValidation: null,
    history: [],
    isActive: true,
    taskId,
  }
}

/**
 * Retry döngüsünde sonraki denemeyi işler
 */
export function processRetryAttempt(
  state: RetryLoopState,
  input: string,
  config: QAGateConfig = DEFAULT_QA_CONFIG
): { state: RetryLoopState; validation: QAValidationResult; shouldContinue: boolean } {
  const newAttempt = state.currentAttempt + 1
  const validation = validateQAGate(input, newAttempt, config)
  
  const newState: RetryLoopState = {
    ...state,
    currentAttempt: newAttempt,
    lastValidation: validation,
    history: [...state.history, validation],
    isActive: !validation.valid && newAttempt < state.maxAttempts,
  }

  return {
    state: newState,
    validation,
    shouldContinue: newState.isActive,
  }
}

// ==================== REJECTION MESSAGE GENERATOR ====================

/**
 * RED mesajı oluşturur ve yeniden yazdırma talimatı ekler
 */
export function generateRejectionMessage(validation: QAValidationResult): string {
  const lines: string[] = []
  
  lines.push('═══════════════════════════════════════════════════════')
  lines.push('                    ❌ QA GATE RED')
  lines.push('═══════════════════════════════════════════════════════')
  lines.push('')
  
  if (validation.autoRejectTriggered) {
    lines.push(`🚫 OTOMATİK RED SEBEBİ: ${validation.rejectionReason}`)
  } else {
    lines.push(`📋 RED SEBEBİ: ${validation.rejectionReason}`)
  }
  
  if (validation.missingBlocks.length > 0) {
    lines.push('')
    lines.push('❌ EKSİK BLOKLAR:')
    validation.missingBlocks.forEach(block => {
      lines.push(`   • ${block}`)
    })
  }
  
  lines.push('')
  lines.push('═══════════════════════════════════════════════════════')
  lines.push('              📝 ZORUNLU 4 BLOK FORMATI')
  lines.push('═══════════════════════════════════════════════════════')
  lines.push('')
  lines.push('🎯 GÖREV: [Görev tanımı]')
  lines.push('')
  lines.push('✅ KABUL KRİTERİ: [Kabul kriterleri]')
  lines.push('')
  lines.push('🔧 DEĞİŞECEK DOSYA/TABLO: [Değişecek dosya/tablo listesi]')
  lines.push('')
  lines.push('YÜRÜTME PLANI:')
  lines.push('- Adım 1: ...')
  lines.push('- Adım 2: ...')
  lines.push('')
  
  if (validation.retryRequired) {
    lines.push('═══════════════════════════════════════════════════════')
    lines.push('           🔄 YENİDEN YAZDIRMA DÖNGÜSÜ AKTİF')
    lines.push('═══════════════════════════════════════════════════════')
    lines.push('')
    lines.push(`⚠️ Deneme: ${validation.retryCount + 1}/3`)
    lines.push('')
    lines.push('Lütfen görevi yukarıdaki 4 blok formatında yeniden yazın.')
  } else {
    lines.push('═══════════════════════════════════════════════════════')
    lines.push('           ⛔ MAKSİMUM DENEME AŞILDI')
    lines.push('═══════════════════════════════════════════════════════')
    lines.push('')
    lines.push('Görev iptal edildi. Lütfen yeni bir görev oluşturun.')
  }
  
  return lines.join('\n')
}

/**
 * Başarılı geçiş mesajı
 */
export function generateSuccessMessage(validation: QAValidationResult): string {
  const lines: string[] = []
  
  lines.push('═══════════════════════════════════════════════════════')
  lines.push('                    ✅ QA GATE GEÇİŞ')
  lines.push('═══════════════════════════════════════════════════════')
  lines.push('')
  lines.push('4 Blok Validasyonu: BAŞARILI')
  lines.push('')
  lines.push('📋 GÖREV ÖZETİ:')
  
  if (validation.parsedBlocks.gorev) {
    lines.push(`🎯 ${validation.parsedBlocks.gorev.substring(0, 100)}...`)
  }
  
  lines.push('')
  lines.push('Görev işleme alındı.')
  lines.push('═══════════════════════════════════════════════════════')
  
  return lines.join('\n')
}

// ==================== EXPORT ALL ====================

export const QAGate = {
  validate: validateQAGate,
  parseBlocks,
  findMissingBlocks,
  checkAutoRejectPatterns,
  createRetryLoop,
  processRetryAttempt,
  generateRejectionMessage,
  generateSuccessMessage,
  patterns: BLOCK_PATTERNS,
  autoRejectPatterns: AUTO_REJECT_PATTERNS,
  defaultConfig: DEFAULT_QA_CONFIG,
}

export default QAGate
