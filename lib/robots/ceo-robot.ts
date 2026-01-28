/**
 * YİSA-S CEO Robot - Kural tabanlı organizatör
 * AI YOK. Sadece if/else kuralları.
 * Asistandan gelen işleri CELF'e dağıtır, sonuçları toplar.
 * Deploy / Commit-Push: Sadece Patron onayı ile.
 * Tarih: 28 Ocak 2026
 */

import { CELF_DIRECTORATES, type DirectorKey } from './celf-center'

export const CEO_RULES = {
  /** İş dağıtım kuralları: görev anahtar kelimesi → Direktörlük */
  TASK_DISTRIBUTION: {
    finans: 'CFO',
    bütçe: 'CFO',
    gelir: 'CFO',
    gider: 'CFO',
    tahsilat: 'CFO',
    teknoloji: 'CTO',
    sistem: 'CTO',
    kod: 'CTO',
    api: 'CTO',
    performans: 'CTO',
    veri: 'CIO',
    database: 'CIO',
    entegrasyon: 'CIO',
    bilgi: 'CIO',
    kampanya: 'CMO',
    reklam: 'CMO',
    'sosyal medya': 'CMO',
    pazarlama: 'CMO',
    personel: 'CHRO',
    eğitim: 'CHRO',
    'insan kaynakları': 'CHRO',
    sözleşme: 'CLO',
    patent: 'CLO',
    uyum: 'CLO',
    hukuk: 'CLO',
    müşteri: 'CSO_SATIS',
    sipariş: 'CSO_SATIS',
    crm: 'CSO_SATIS',
    satış: 'CSO_SATIS',
    şablon: 'CPO',
    tasarım: 'CPO',
    ürün: 'CPO',
    özellik: 'CPO',
    analiz: 'CDO',
    rapor: 'CDO',
    dashboard: 'CDO',
    güvenlik: 'CISO',
    audit: 'CISO',
    erişim: 'CISO',
    destek: 'CCO',
    şikayet: 'CCO',
    memnuniyet: 'CCO',
    plan: 'CSO_STRATEJI',
    hedef: 'CSO_STRATEJI',
    büyüme: 'CSO_STRATEJI',
    strateji: 'CSO_STRATEJI',
  } as Record<string, DirectorKey>,

  /** Deploy / Commit kuralları - PATRON ONAYI ŞART */
  DEPLOY_RULES: {
    autoDeployAllowed: false,
    autoCommitAllowed: false,
    requirePatronApproval: true,
  },
}

export type CEOAction = 'distribute' | 'collect' | 'deploy' | 'commit' | 'push' | 'unknown'

/**
 * Görev metninden hangi direktörlüğe gideceğini bulur (kural tabanlı).
 */
export function routeToDirector(taskDescription: string): DirectorKey | null {
  const lower = taskDescription.toLowerCase().trim()
  const words = lower.split(/\s+/)

  for (const word of words) {
    const key = word.replace(/[^a-zçğıöşü\w]/gi, '')
    if (!key) continue
    const director = CEO_RULES.TASK_DISTRIBUTION[key]
    if (director) return director
  }

  // Tek kelime değilse tam eşleşme dene
  for (const [term, director] of Object.entries(CEO_RULES.TASK_DISTRIBUTION)) {
    if (lower.includes(term)) return director
  }

  return null
}

/**
 * Deploy/commit işlemi yapılabilir mi? (Patron onayı gerekir.)
 */
export function canDeployOrCommit(action: CEOAction): { allowed: boolean; reason: string } {
  if (action !== 'deploy' && action !== 'commit' && action !== 'push') {
    return { allowed: true, reason: 'Dağıtım/commit işlemi değil.' }
  }
  if (CEO_RULES.DEPLOY_RULES.requirePatronApproval && !CEO_RULES.DEPLOY_RULES.autoDeployAllowed) {
    return {
      allowed: false,
      reason: 'Deploy/Commit için Patron onayı gerekir. Otomatik işlem yapılmaz.',
    }
  }
  return { allowed: true, reason: 'Onaylı.' }
}

/**
 * CEO aksiyonunu komut metninden çıkarır.
 */
export function detectCEOAction(input: string): CEOAction {
  const lower = input.toLowerCase()
  if (/\bdeploy\b|vercel deploy|railway deploy/.test(lower)) return 'deploy'
  if (/\bcommit\b|git commit/.test(lower)) return 'commit'
  if (/\bpush\b|git push/.test(lower)) return 'push'
  if (/\bdağıt\b|topla|distribute|collect/.test(lower)) return 'distribute'
  return 'unknown'
}
