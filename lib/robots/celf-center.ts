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

export type CelfAIProvider = 'GPT' | 'CLAUDE' | 'GEMINI' | 'TOGETHER' | 'V0' | 'CURSOR'

export interface Directorate {
  name: string
  tasks: string[]
  /** Tetikleyici kelimeler (CEO routeToDirector ile eşleşir) */
  triggers: string[]
  /** İş açıklaması */
  work: string
  /** Bu direktörlük için önerilen AI sağlayıcılar (sıra önemli) */
  aiProviders: CelfAIProvider[]
  /** Veto hakkı var mı (CLO) */
  hasVeto?: boolean
}

export const CELF_DIRECTORATES: Record<DirectorKey, Directorate> = {
  CFO: {
    name: 'Finans',
    tasks: ['bütçe', 'gelir', 'gider', 'tahsilat', 'maliyet'],
    triggers: ['gelir', 'gider', 'bütçe', 'tahsilat', 'maliyet', 'finans'],
    work: 'Supabase finansal veri, rapor',
    aiProviders: ['GPT', 'GEMINI'],
  },
  CTO: {
    name: 'Teknoloji',
    tasks: ['sistem', 'kod', 'api', 'performans', 'hata'],
    triggers: ['sistem', 'kod', 'api', 'performans', 'hata', 'teknoloji'],
    work: 'Sistem durumu, kod yaz/düzelt',
    aiProviders: ['GPT', 'CURSOR'],
  },
  CIO: {
    name: 'Bilgi Sistemleri',
    tasks: ['veri', 'database', 'entegrasyon', 'tablo'],
    triggers: ['veri', 'database', 'entegrasyon', 'tablo', 'bilgi'],
    work: 'Supabase sorguları, veri yönetimi',
    aiProviders: ['GPT'],
  },
  CMO: {
    name: 'Pazarlama',
    tasks: ['kampanya', 'reklam', 'sosyal medya', 'tanıtım'],
    triggers: ['kampanya', 'reklam', 'sosyal medya', 'tanıtım', 'pazarlama'],
    work: 'İçerik üret, kampanya planla',
    aiProviders: ['GPT', 'CLAUDE'],
  },
  CHRO: {
    name: 'İnsan Kaynakları',
    tasks: ['personel', 'eğitim', 'performans', 'izin'],
    triggers: ['personel', 'eğitim', 'performans', 'izin', 'insan kaynakları'],
    work: 'Personel yönetimi, eğitim planı',
    aiProviders: ['CLAUDE'],
  },
  CLO: {
    name: 'Hukuk',
    tasks: ['sözleşme', 'patent', 'uyum', 'kvkk'],
    triggers: ['sözleşme', 'patent', 'uyum', 'kvkk', 'hukuk'],
    work: 'Hukuki kontrol, sözleşme hazırla',
    aiProviders: ['CLAUDE'],
    hasVeto: true,
  },
  CSO_SATIS: {
    name: 'Satış',
    tasks: ['müşteri', 'sipariş', 'crm', 'satış'],
    triggers: ['müşteri', 'sipariş', 'crm', 'satış'],
    work: 'Müşteri yönetimi, satış takibi',
    aiProviders: ['GPT'],
  },
  CPO: {
    name: 'Ürün',
    tasks: ['şablon', 'tasarım', 'özellik', 'ui', 'sayfa'],
    triggers: ['şablon', 'tasarım', 'özellik', 'ui', 'sayfa', 'ürün'],
    work: 'Tasarım üret, şablon hazırla',
    aiProviders: ['V0', 'CURSOR'],
  },
  CDO: {
    name: 'Veri',
    tasks: ['analiz', 'rapor', 'dashboard', 'istatistik'],
    triggers: ['analiz', 'rapor', 'dashboard', 'istatistik', 'veri'],
    work: 'Veri analizi, rapor oluştur',
    aiProviders: ['GEMINI', 'GPT'],
  },
  CISO: {
    name: 'Bilgi Güvenliği',
    tasks: ['güvenlik', 'audit', 'erişim', 'şifre'],
    triggers: ['güvenlik', 'audit', 'erişim', 'şifre'],
    work: 'Güvenlik kontrolü, audit log',
    aiProviders: ['CLAUDE'],
  },
  CCO: {
    name: 'Müşteri',
    tasks: ['destek', 'şikayet', 'memnuniyet', 'ticket'],
    triggers: ['destek', 'şikayet', 'memnuniyet', 'ticket'],
    work: 'Müşteri desteği, şikayet çözümü',
    aiProviders: ['CLAUDE'],
  },
  CSO_STRATEJI: {
    name: 'Strateji',
    tasks: ['plan', 'hedef', 'büyüme', 'vizyon'],
    triggers: ['plan', 'hedef', 'büyüme', 'vizyon', 'strateji'],
    work: 'Strateji planı, hedef belirleme',
    aiProviders: ['GPT', 'GEMINI'],
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
