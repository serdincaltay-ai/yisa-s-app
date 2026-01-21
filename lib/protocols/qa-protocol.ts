/**
 * QA PROTOCOL - Sistem Protokolleri
 * ==================================
 * QA Gate + 4-Block Validation merkezi protokol tanımları
 */

// ==================== PROTOCOL METADATA ====================

export const QA_PROTOCOL_VERSION = '1.0.0'
export const QA_PROTOCOL_NAME = 'QA Gate + 4-Block Validation Protocol'

// ==================== REQUIRED BLOCKS ====================

export interface BlockDefinition {
  id: string
  emoji: string
  name: string
  turkishName: string
  required: boolean
  description: string
  example: string
}

export const REQUIRED_BLOCKS: BlockDefinition[] = [
  {
    id: 'gorev',
    emoji: '🎯',
    name: 'TASK',
    turkishName: 'GÖREV',
    required: true,
    description: 'Görevin net tanımı',
    example: '🎯 GÖREV: QA Protokolünü sistemin ön kapısı olarak kur'
  },
  {
    id: 'kabulKriteri',
    emoji: '✅',
    name: 'ACCEPTANCE_CRITERIA',
    turkishName: 'KABUL KRİTERİ',
    required: true,
    description: 'Görevin kabul edilmesi için gerekli kriterler',
    example: '✅ KABUL KRİTERİ: 4 blok yoksa otomatik RED'
  },
  {
    id: 'degisecek',
    emoji: '🔧',
    name: 'FILES_TO_CHANGE',
    turkishName: 'DEĞİŞECEK DOSYA/TABLO',
    required: true,
    description: 'Değiştirilecek dosya veya tablo listesi',
    example: '🔧 DEĞİŞECEK: lib/qa-gate.ts, app/api/qa-gate/route.ts'
  },
  {
    id: 'yurutmePlani',
    emoji: '📋',
    name: 'EXECUTION_PLAN',
    turkishName: 'YÜRÜTME PLANI',
    required: true,
    description: 'Adım adım yürütme planı',
    example: 'YÜRÜTME PLANI:\n- Adım 1: 4 blok formatını tanımla\n- Adım 2: Validasyon fonksiyonları yaz'
  }
]

// ==================== AUTO-REJECT RULES ====================

export interface AutoRejectRule {
  id: string
  pattern: string
  flags: string
  description: string
  severity: 'critical' | 'high' | 'medium'
  action: 'reject' | 'warn'
}

export const AUTO_REJECT_RULES: AutoRejectRule[] = [
  {
    id: 'via_master',
    pattern: 'via\\s+master',
    flags: 'i',
    description: '"via master" kullanımı yasak',
    severity: 'critical',
    action: 'reject'
  },
  {
    id: 'undefined_response',
    pattern: '^undefined$',
    flags: 'i',
    description: 'undefined yanıt kabul edilmez',
    severity: 'critical',
    action: 'reject'
  },
  {
    id: 'null_response',
    pattern: '^null$',
    flags: 'i',
    description: 'null yanıt kabul edilmez',
    severity: 'critical',
    action: 'reject'
  },
  {
    id: 'empty_response',
    pattern: '^\\s*$',
    flags: '',
    description: 'Boş cevap kabul edilmez',
    severity: 'critical',
    action: 'reject'
  },
  {
    id: 'only_analyzed',
    pattern: '^analiz edildi\\.?$',
    flags: 'i',
    description: 'Sadece "analiz edildi" - aksiyon içermiyor',
    severity: 'high',
    action: 'reject'
  },
  {
    id: 'only_reviewed',
    pattern: '^incelendi\\.?$',
    flags: 'i',
    description: 'Sadece "incelendi" - aksiyon içermiyor',
    severity: 'high',
    action: 'reject'
  },
  {
    id: 'vague_ok',
    pattern: '^(tamam|ok|anladım)\\.?$',
    flags: 'i',
    description: 'Belirsiz/aksiyon içermeyen yanıt',
    severity: 'medium',
    action: 'reject'
  }
]

// ==================== RETRY CONFIGURATION ====================

export interface RetryConfig {
  maxRetries: number
  retryDelayMs: number
  exponentialBackoff: boolean
  backoffMultiplier: number
  maxDelayMs: number
}

export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  retryDelayMs: 1000,
  exponentialBackoff: true,
  backoffMultiplier: 2,
  maxDelayMs: 10000
}

// ==================== PROTOCOL ACTIONS ====================

export type ProtocolAction = 
  | 'VALIDATE'
  | 'APPROVE'
  | 'REJECT'
  | 'RETRY'
  | 'CANCEL'
  | 'FORCE_REWRITE'

export interface ProtocolResponse {
  action: ProtocolAction
  success: boolean
  message: string
  data?: any
  timestamp: string
}

// ==================== REWRITE LOOP ====================

export interface RewriteLoopConfig {
  enabled: boolean
  maxIterations: number
  autoTriggerOnReject: boolean
  preserveOriginalTask: boolean
  formatTemplate: string
}

export const REWRITE_LOOP_CONFIG: RewriteLoopConfig = {
  enabled: true,
  maxIterations: 3,
  autoTriggerOnReject: true,
  preserveOriginalTask: true,
  formatTemplate: `
═══════════════════════════════════════════════════════
              🔄 YENİDEN YAZDIRMA GEREKLİ
═══════════════════════════════════════════════════════

Aşağıdaki formatta yeniden yazın:

🎯 GÖREV: [Görev tanımı]

✅ KABUL KRİTERİ: [Kabul kriterleri]

🔧 DEĞİŞECEK DOSYA/TABLO: [Değişecek dosyalar]

YÜRÜTME PLANI:
- Adım 1: ...
- Adım 2: ...
- Adım 3: ...

═══════════════════════════════════════════════════════
`
}

// ==================== GATE STATUS TYPES ====================

export type GateStatus = 
  | 'OPEN'        // Görev geçebilir
  | 'BLOCKED'     // Validasyon başarısız
  | 'RETRY'       // Yeniden deneme bekliyor
  | 'CANCELLED'   // İptal edildi
  | 'PROCESSING'  // İşleniyor

export interface GateState {
  status: GateStatus
  taskId: string | null
  currentValidation: any | null
  retryCount: number
  lastUpdate: string
}

// ==================== PROTOCOL TEMPLATE ====================

export const FOUR_BLOCK_TEMPLATE = `
🎯 GÖREV: [Buraya görev tanımını yazın]

✅ KABUL KRİTERİ: [Buraya kabul kriterlerini yazın]

🔧 DEĞİŞECEK DOSYA/TABLO: [Değişecek dosya ve tabloları listeleyin]

YÜRÜTME PLANI:
- Adım 1: [İlk adım]
- Adım 2: [İkinci adım]
- Adım 3: [Üçüncü adım]
`

// ==================== EXPORT PROTOCOL OBJECT ====================

export const QAProtocol = {
  version: QA_PROTOCOL_VERSION,
  name: QA_PROTOCOL_NAME,
  requiredBlocks: REQUIRED_BLOCKS,
  autoRejectRules: AUTO_REJECT_RULES,
  retryConfig: DEFAULT_RETRY_CONFIG,
  rewriteLoopConfig: REWRITE_LOOP_CONFIG,
  template: FOUR_BLOCK_TEMPLATE,
  
  // Helper methods
  getBlockById: (id: string) => REQUIRED_BLOCKS.find(b => b.id === id),
  getRuleById: (id: string) => AUTO_REJECT_RULES.find(r => r.id === id),
  getAllBlockNames: () => REQUIRED_BLOCKS.map(b => `${b.emoji} ${b.turkishName}`),
  getAllCriticalRules: () => AUTO_REJECT_RULES.filter(r => r.severity === 'critical'),
}

export default QAProtocol
