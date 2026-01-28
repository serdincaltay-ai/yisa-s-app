/**
 * YİSA-S Robot Hiyerarşisi (KİLİTLİ)
 * Katman 0–7, talimatla sabit.
 */

export interface HierarchyNode {
  layer: number
  name: string
  detail?: string
}

export const ROBOT_HIERARCHY: HierarchyNode[] = [
  { layer: 0, name: 'PATRON', detail: 'Serdinç Altay' },
  { layer: 1, name: 'PATRON ASİSTAN', detail: 'Claude + GPT + Gemini + Together + V0 + Cursor' },
  { layer: 2, name: 'SİBER GÜVENLİK' },
  { layer: 3, name: 'VERİ ARŞİVLEME' },
  { layer: 4, name: 'CEO ORGANİZATÖR', detail: 'Kural tabanlı, AI yok' },
  { layer: 5, name: 'YİSA-S CELF MERKEZ', detail: '12 Direktörlük' },
  { layer: 6, name: 'COO YARDIMCI' },
  { layer: 7, name: 'YİSA-S VİTRİN' },
]
