/**
 * YİSA-S Patron Lock - Güvenlik Kilitleri
 * AI'ların giremeyeceği alanlar, Patron onayı gerektiren işlemler
 * Tarih: 28 Ocak 2026
 */

/** AI'ların GİREMEYECEĞİ alanlar / ifadeler */
export const FORBIDDEN_FOR_AI: string[] = [
  '.env',
  '.env.local',
  '.env.production',
  'API_KEY',
  'SECRET',
  'PASSWORD',
  'TOKEN',
  'git push',
  'git commit',
  'vercel deploy',
  'railway deploy',
  'DROP TABLE',
  'DELETE FROM',
  'TRUNCATE',
]

/** Patron onayı gerektiren işlemler */
export const REQUIRE_PATRON_APPROVAL: string[] = [
  'deploy',
  'commit',
  'push',
  'merge',
  'table create',
  'table alter',
  'user delete',
  'role change',
  'price change',
  'env change',
]

export type PatronDecision = 'approve' | 'reject' | 'modify'

export interface PatronLockCheck {
  allowed: boolean
  reason?: string
  requiresApproval?: boolean
}

/**
 * Komut/ifade AI için yasak mı kontrol eder.
 */
export function isForbiddenForAI(input: string): boolean {
  const normalized = input.toLowerCase().trim()
  return FORBIDDEN_FOR_AI.some(
    (term) => normalized.includes(term.toLowerCase())
  )
}

/**
 * İşlem Patron onayı gerektiriyor mu kontrol eder.
 */
export function requiresPatronApproval(action: string): boolean {
  const normalized = action.toLowerCase().trim()
  return REQUIRE_PATRON_APPROVAL.some(
    (term) => normalized.includes(term.toLowerCase())
  )
}

/**
 * Tek seferde hem yasak hem onay kontrolü.
 */
export function checkPatronLock(input: string, action?: string): PatronLockCheck {
  if (isForbiddenForAI(input)) {
    return { allowed: false, reason: 'Bu alan/işlem AI için yasak.' }
  }
  const needsApproval = action ? requiresPatronApproval(action) : false
  if (needsApproval) {
    return {
      allowed: true,
      requiresApproval: true,
      reason: 'Bu işlem Patron onayı gerektirir.',
    }
  }
  return { allowed: true }
}
