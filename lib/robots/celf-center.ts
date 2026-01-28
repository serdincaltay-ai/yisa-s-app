/**
 * YİSA-S CELF Merkez - 12 Direktörlük
 * Katman 5: CELF Merkez Robot
 * Tarih: 28 Ocak 2026
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

export interface Directorate {
  name: string
  tasks: string[]
}

export const CELF_DIRECTORATES: Record<DirectorKey, Directorate> = {
  CFO: { name: 'Finans', tasks: ['bütçe', 'gelir', 'gider', 'tahsilat'] },
  CTO: { name: 'Teknoloji', tasks: ['sistem', 'kod', 'api', 'performans'] },
  CIO: { name: 'Bilgi Sistemleri', tasks: ['veri', 'database', 'entegrasyon'] },
  CMO: { name: 'Pazarlama', tasks: ['kampanya', 'reklam', 'sosyal medya'] },
  CHRO: { name: 'İnsan Kaynakları', tasks: ['personel', 'eğitim', 'performans'] },
  CLO: { name: 'Hukuk', tasks: ['sözleşme', 'patent', 'uyum'] },
  CSO_SATIS: { name: 'Satış', tasks: ['müşteri', 'sipariş', 'crm'] },
  CPO: { name: 'Ürün', tasks: ['şablon', 'tasarım', 'özellik'] },
  CDO: { name: 'Veri', tasks: ['analiz', 'rapor', 'dashboard'] },
  CISO: { name: 'Bilgi Güvenliği', tasks: ['güvenlik', 'audit', 'erişim'] },
  CCO: { name: 'Müşteri', tasks: ['destek', 'şikayet', 'memnuniyet'] },
  CSO_STRATEJI: { name: 'Strateji', tasks: ['plan', 'hedef', 'büyüme'] },
}

export const CELF_DIRECTORATE_KEYS = Object.keys(CELF_DIRECTORATES) as DirectorKey[]
