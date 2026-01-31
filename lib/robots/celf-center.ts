/**
 * YİSA-S CELF Merkez - 12 Direktörlük (Katman 5)
 * Her direktörlük tetikleyici kelimeler, iş tanımı ve atanmış AI ile gerçek çalışma.
 * Tarih: 30 Ocak 2026
 */

export type DirectorKey =
  | 'CFO'
  | 'CTO'
  | 'CIO'
  | 'CMO'
  | 'CHRO'
  | 'CLO'
  | 'CSO_SATIS'
  | 'CPO'
  | 'CDO'
  | 'CISO'
  | 'CCO'
  | 'CSO_STRATEJI'
  | 'CSPO' // Spor Direktörlüğü - Anayasa uyumu

export type CelfAIProvider = 'GPT' | 'CLAUDE' | 'GEMINI' | 'TOGETHER' | 'V0' | 'CURSOR'

export interface Directorate {
  name: string
  tasks: string[]
  triggers: string[]
  work: string
  aiProviders: CelfAIProvider[]
  hasVeto?: boolean
  /** Erişebildiği veriler */
  dataAccess?: string[]
  /** Sadece okuyabildiği veriler */
  readOnly?: string[]
  /** Silmesi/değiştirmesi yasak veriler */
  protectedData?: string[]
  /** Patron onayı gerektiren işlemler */
  requiresApproval?: string[]
}

export const CELF_DIRECTORATES: Record<DirectorKey, Directorate> = {
  CFO: {
    name: 'Finans',
    tasks: ['bütçe', 'gelir', 'gider', 'tahsilat', 'maliyet'],
    triggers: ['gelir', 'gider', 'bütçe', 'tahsilat', 'maliyet', 'finans'],
    work: 'Supabase finansal veri, rapor',
    aiProviders: ['GEMINI', 'GPT'], // Gemini önce denenir; key yoksa GPT'ye düşer
    dataAccess: ['payments', 'invoices', 'expenses', 'revenue'],
    readOnly: ['franchise_contracts'],
    protectedData: ['pricing_history'],
    requiresApproval: ['fiyat_degisikligi', 'odeme_iptali'],
  },
  CTO: {
    name: 'Teknoloji',
    tasks: ['sistem', 'kod', 'api', 'performans', 'hata'],
    triggers: ['sistem', 'kod', 'api', 'performans', 'hata', 'teknoloji'],
    work: 'Sistem durumu, kod yaz/düzelt',
    aiProviders: ['GPT', 'CURSOR'],
    dataAccess: ['system_logs', 'api_health', 'deployments'],
    readOnly: ['user_data'],
    protectedData: ['env_variables', 'api_keys'],
    requiresApproval: ['deploy', 'database_migration'],
  },
  CIO: {
    name: 'Bilgi Sistemleri',
    tasks: ['veri', 'database', 'entegrasyon', 'tablo'],
    triggers: ['veri', 'database', 'entegrasyon', 'tablo', 'bilgi'],
    work: 'Supabase sorguları, veri yönetimi',
    aiProviders: ['GPT'],
    dataAccess: ['tables', 'integrations'],
    readOnly: ['user_data'],
    protectedData: ['audit_logs'],
    requiresApproval: ['table_alter', 'bulk_delete'],
  },
  CMO: {
    name: 'Pazarlama',
    tasks: ['kampanya', 'reklam', 'sosyal medya', 'tanıtım'],
    triggers: ['kampanya', 'reklam', 'sosyal medya', 'tanıtım', 'pazarlama'],
    work: 'İçerik üret, kampanya planla',
    aiProviders: ['GPT', 'CLAUDE'],
    dataAccess: ['campaigns', 'content'],
    readOnly: ['franchise_data'],
    protectedData: [],
    requiresApproval: ['brand_change'],
  },
  CHRO: {
    name: 'İnsan Kaynakları',
    tasks: ['personel', 'eğitim', 'performans', 'izin'],
    triggers: ['personel', 'eğitim', 'performans', 'izin', 'insan kaynakları'],
    work: 'Personel yönetimi, eğitim planı',
    aiProviders: ['CLAUDE'],
    dataAccess: ['personnel', 'training'],
    readOnly: ['contracts'],
    protectedData: ['salary_data'],
    requiresApproval: ['role_change', 'dismissal'],
  },
  CLO: {
    name: 'Hukuk',
    tasks: ['sözleşme', 'patent', 'uyum', 'kvkk'],
    triggers: ['sözleşme', 'patent', 'uyum', 'kvkk', 'hukuk'],
    work: 'Hukuki kontrol, sözleşme hazırla',
    aiProviders: ['CLAUDE'],
    hasVeto: true,
    dataAccess: ['contracts', 'compliance_logs', 'kvkk_records'],
    readOnly: ['tüm veriler'],
    protectedData: ['legal_documents'],
    requiresApproval: ['sözleşme_değişikliği', 'veri_silme'],
  },
  CSO_SATIS: {
    name: 'Satış',
    tasks: ['müşteri', 'sipariş', 'crm', 'satış'],
    triggers: ['müşteri', 'sipariş', 'crm', 'satış'],
    work: 'Müşteri yönetimi, satış takibi',
    aiProviders: ['GPT'],
    dataAccess: ['orders', 'crm', 'customers'],
    readOnly: ['pricing_history'],
    protectedData: [],
    requiresApproval: ['discount_override'],
  },
  CPO: {
    name: 'Ürün',
    tasks: ['şablon', 'tasarım', 'özellik', 'ui', 'sayfa'],
    triggers: ['şablon', 'tasarım', 'özellik', 'ui', 'sayfa', 'ürün'],
    work: 'Tasarım üret, şablon hazırla',
    aiProviders: ['V0', 'CURSOR'],
    dataAccess: ['website_templates', 'brand_settings', 'ui_components'],
    readOnly: ['active_franchise_templates'],
    protectedData: ['franchise_customizations'],
    requiresApproval: ['template_delete', 'brand_change'],
  },
  CDO: {
    name: 'Veri',
    tasks: ['analiz', 'rapor', 'dashboard', 'istatistik'],
    triggers: ['analiz', 'rapor', 'dashboard', 'istatistik', 'veri'],
    work: 'Veri analizi, rapor oluştur',
    aiProviders: ['GEMINI', 'GPT'],
    dataAccess: ['analytics', 'reports', 'dashboards'],
    readOnly: ['raw_user_data'],
    protectedData: ['audit_logs'],
    requiresApproval: ['data_export', 'bulk_delete'],
  },
  CISO: {
    name: 'Bilgi Güvenliği',
    tasks: ['güvenlik', 'audit', 'erişim', 'şifre'],
    triggers: ['güvenlik', 'audit', 'erişim', 'şifre'],
    work: 'Güvenlik kontrolü, audit log',
    aiProviders: ['CLAUDE'],
    dataAccess: ['security_logs', 'access_logs'],
    readOnly: ['user_data'],
    protectedData: ['audit_logs'],
    requiresApproval: ['access_grant', 'password_reset'],
  },
  CCO: {
    name: 'Müşteri',
    tasks: ['destek', 'şikayet', 'memnuniyet', 'ticket'],
    triggers: ['destek', 'şikayet', 'memnuniyet', 'ticket'],
    work: 'Müşteri desteği, şikayet çözümü',
    aiProviders: ['CLAUDE'],
    dataAccess: ['tickets', 'feedback'],
    readOnly: ['customer_contracts'],
    protectedData: [],
    requiresApproval: ['refund', 'complaint_close'],
  },
  CSO_STRATEJI: {
    name: 'Strateji',
    tasks: ['plan', 'hedef', 'büyüme', 'vizyon'],
    triggers: ['plan', 'hedef', 'büyüme', 'vizyon', 'strateji'],
    work: 'Strateji planı, hedef belirleme',
    aiProviders: ['GPT', 'GEMINI'],
    dataAccess: ['reports', 'analytics'],
    readOnly: ['financial_summary'],
    protectedData: [],
    requiresApproval: ['strategy_publish'],
  },
  CSPO: {
    name: 'Spor',
    tasks: ['antrenman', 'hareket', 'sporcu', 'program', 'seviye', 'branş', 'ölçüm'],
    triggers: ['antrenman', 'hareket', 'sporcu', 'program', 'seviye', 'branş', 'ölçüm', 'spor', 'jimnastik', 'kamp'],
    work: 'Hareket havuzu, antrenman programı, sporcu değerlendirme, seviye sistemi',
    aiProviders: ['CLAUDE', 'GPT'],
    dataAccess: ['athletes', 'movements', 'training_programs', 'evaluations'],
    readOnly: ['health_records'],
    protectedData: ['medical_data'],
    requiresApproval: ['seviye_atlama', 'yarismaci_secim'],
  },
}

export const CELF_DIRECTORATE_KEYS = Object.keys(CELF_DIRECTORATES) as DirectorKey[]

/** Direktörlük için önerilen AI sağlayıcıları döner (gerçek çağrı API/flow'da yapılır) */
export function getDirectorAIProviders(directorKey: DirectorKey): CelfAIProvider[] {
  return CELF_DIRECTORATES[directorKey]?.aiProviders ?? ['GPT']
}

/** Direktörlüğün veto hakkı var mı */
export function directorHasVeto(directorKey: DirectorKey): boolean {
  return CELF_DIRECTORATES[directorKey]?.hasVeto ?? false
}

/** Veri erişim kontrolü: requiredData direktörlüğün dataAccess veya readOnly içinde mi? */
export function checkDataAccess(directorKey: DirectorKey, requiredData: string[]): { passed: boolean; message?: string } {
  const dir = CELF_DIRECTORATES[directorKey]
  if (!dir) return { passed: false, message: 'Direktörlük bulunamadı' }
  const access = dir.dataAccess ?? []
  const readOnly = dir.readOnly ?? []
  const allowed = new Set([...access, ...readOnly])
  const denied = requiredData.filter((d) => !allowed.has(d))
  if (denied.length > 0) return { passed: false, message: `Bu veriye erişim yetkiniz yok: ${denied.join(', ')}` }
  return { passed: true }
}

/** Koruma kontrolü: affectedData protectedData içinde mi? */
export function checkProtection(directorKey: DirectorKey, affectedData: string[]): { passed: boolean; message?: string } {
  const dir = CELF_DIRECTORATES[directorKey]
  if (!dir) return { passed: true }
  const protectedData = dir.protectedData ?? []
  const blocked = affectedData.filter((d) => protectedData.includes(d))
  if (blocked.length > 0) return { passed: false, message: `Bu veri korumalı, değiştirilemez: ${blocked.join(', ')}` }
  return { passed: true }
}

/** Onay kontrolü: operation requiresApproval içinde mi? */
export function checkApprovalRequired(directorKey: DirectorKey, operation: string): { required: boolean; message?: string } {
  const dir = CELF_DIRECTORATES[directorKey]
  if (!dir) return { required: false }
  const requires = dir.requiresApproval ?? []
  const lower = operation.toLowerCase()
  const found = requires.some((r) => lower.includes(r.toLowerCase()))
  if (found) return { required: true, message: 'Bu işlem için Patron onayı gerekir.' }
  return { required: false }
}

/** Veto kontrolü: CLO ve riskli işlemlerde veto uygulanabilir */
export function checkVeto(directorKey: DirectorKey, operation: string, riskKeywords: string[] = ['sil', 'silme', 'düzenle', 'değiştir', 'kvkk', 'veri_silme']): { veto: boolean; message?: string } {
  if (!directorHasVeto(directorKey)) return { veto: false }
  const lower = operation.toLowerCase()
  const risky = riskKeywords.some((k) => lower.includes(k))
  if (risky) return { veto: true, message: 'Hukuki risk nedeniyle işlem durduruldu. CLO veto hakkını kullandı.' }
  return { veto: false }
}

export interface CelfAuditResult {
  passed: boolean
  warnings: string[]
  errors: string[]
  vetoBlocked?: boolean
}

/** Tüm CELF denetimlerini çalıştırır (veri erişim, koruma, onay, veto) */
export function runCelfChecks(params: {
  directorKey: DirectorKey
  taskId?: string
  requiredData?: string[]
  affectedData?: string[]
  operation?: string
}): CelfAuditResult {
  const { directorKey, requiredData = [], affectedData = [], operation = '' } = params
  const warnings: string[] = []
  const errors: string[] = []

  const dataAccess = checkDataAccess(directorKey, requiredData)
  if (!dataAccess.passed) errors.push(dataAccess.message ?? 'Veri erişim reddedildi')

  const protection = checkProtection(directorKey, affectedData)
  if (!protection.passed) errors.push(protection.message ?? 'Korumalı veri ihlali')

  const approval = checkApprovalRequired(directorKey, operation)
  if (approval.required) warnings.push(approval.message ?? 'Patron onayı gerekli')

  const veto = checkVeto(directorKey, operation)
  if (veto.veto) {
    errors.push(veto.message ?? 'CLO veto')
    return { passed: false, warnings, errors, vetoBlocked: true }
  }

  return {
    passed: errors.length === 0,
    warnings,
    errors,
    vetoBlocked: false,
  }
}
