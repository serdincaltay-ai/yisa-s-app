/**
 * YİSA-S Siber Güvenlik (Katman 2)
 * Log kontrolleri, yasak işlemler, erişim kuralları
 */

import { FORBIDDEN_FOR_AI } from './patron-lock'

export const SIBER_GUVENLIK_KURALLARI = {
  /** Denetlenecek log alanları */
  LOG_ALANLARI: ['auth', 'api', 'database', 'deploy', 'access'] as const,

  /** Güvenlik audit'inde aranacak anahtar kelimeler */
  AUDIT_KEYWORDS: [
    'failed',
    'error',
    'unauthorized',
    'denied',
    'invalid',
    'brute',
    'suspicious',
  ],

  /** AI'ların dokunamayacağı alanlar (patron-lock ile uyumlu) */
  YASAK_ALANLAR: FORBIDDEN_FOR_AI,

  /** Erişim seviyesi: 0 = en kısıtlı, 3 = tam */
  ERISIM_SEVIYELERI: {
    okuma: 0,
    yazma: 1,
    silme: 2,
    yonetim: 3,
  } as const,
}

export type LogAlani = (typeof SIBER_GUVENLIK_KURALLARI.LOG_ALANLARI)[number]

/**
 * Verilen log alanı için audit uygulanabilir mi?
 */
export function logAlaniDenetlenebilir(alan: string): boolean {
  return (SIBER_GUVENLIK_KURALLARI.LOG_ALANLARI as readonly string[]).includes(alan)
}
