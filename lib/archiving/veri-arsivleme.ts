/**
 * YİSA-S Veri Arşivleme (Katman 3)
 * Arşivleme kuralları, saklama süreleri
 */

export const VERI_ARSIVLEME_KURALLARI = {
  /** Varsayılan saklama süreleri (gün) */
  SAKLAMA_SURELERI: {
    log: 90,
    chat: 365,
    rapor: 730,
    kullanici_verisi: 365 * 2,
  } as const,

  /** Arşivlenebilir tablo/alan tipleri */
  ARSIVLENEBILIR: ['log', 'chat', 'rapor', 'audit', 'backup'] as const,

  /** Arşiv formatı */
  FORMAT: 'json' as const,
}

export type ArsivlenebilirTip = (typeof VERI_ARSIVLEME_KURALLARI.ARSIVLENEBILIR)[number]

/**
 * Veri tipi için saklama süresi (gün)
 */
export function saklamaSuresi(tip: ArsivlenebilirTip): number {
  const key = tip === 'audit' ? 'log' : tip === 'backup' ? 'rapor' : tip
  return VERI_ARSIVLEME_KURALLARI.SAKLAMA_SURELERI[
    key as keyof typeof VERI_ARSIVLEME_KURALLARI.SAKLAMA_SURELERI
  ] ?? 90
}
