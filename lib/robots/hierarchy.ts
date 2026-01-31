/**
 * YİSA-S Robot Hiyerarşisi (KİLİTLİ)
 * Katman 0–7, talimatla sabit.
 */

export interface HierarchyNode {
  layer: number
  name: string
  code: string
  detail?: string
  aiServices?: string[]
}

export const ROBOT_HIERARCHY: HierarchyNode[] = [
  { layer: 0, name: 'PATRON', code: 'ROB-PATRON', detail: 'Serdinç Altay', aiServices: [] },
  { layer: 1, name: 'PATRON ASİSTAN', code: 'ROB-ASISTAN', detail: 'Kişisel işler, özel depo', aiServices: ['claude', 'gpt', 'gemini', 'together', 'v0', 'cursor'] },
  { layer: 2, name: 'SİBER GÜVENLİK', code: 'ROB-SIBER', detail: '7/24 koruma, gatekeeper', aiServices: ['claude'] },
  { layer: 3, name: 'VERİ ARŞİVLEME', code: 'ROB-ARSIV', detail: 'Soft delete, backup', aiServices: [] },
  { layer: 4, name: 'CEO ORGANİZATÖR', code: 'ROB-CEO', detail: 'Kural tabanlı, görev dağıtımı', aiServices: [] },
  { layer: 5, name: 'YİSA-S CELF MERKEZ', code: 'ROB-CELF', detail: '12 Direktörlük', aiServices: ['claude', 'gpt', 'gemini', 'together'] },
  { layer: 6, name: 'COO YARDIMCI', code: 'ROB-COO', detail: 'Sanal mağaza, şablon satışı', aiServices: ['gpt', 'together'] },
  { layer: 7, name: 'YİSA-S VİTRİN', code: 'ROB-VITRIN', detail: 'Franchise arayüzü', aiServices: ['gpt'] },
]

// 12 Direktörlük Tanımları
export const DIRECTORATES = {
  CFO: { name: 'Finans Direktörlüğü', description: 'Muhasebe, aidat takip, bordro, token fiyatlandırma' },
  CTO: { name: 'Teknoloji Direktörlüğü', description: 'Veritabanı, API, authentication, CI/CD' },
  CIO: { name: 'Bilgi Direktörlüğü', description: 'Strateji, veri toplama, analiz' },
  CMO: { name: 'Pazarlama Direktörlüğü', description: 'Sosyal medya, kampanyalar, marka' },
  CHRO: { name: 'İnsan Kaynakları Direktörlüğü', description: 'Personel, roller, sözleşmeler, performans' },
  CLO: { name: 'Hukuk Direktörlüğü', description: 'KVKK, franchise sözleşmesi, izin belgeleri' },
  CSO_SATIS: { name: 'Satış Direktörlüğü', description: 'Satış sunumu, ROI hesaplama, CRM' },
  CPO: { name: 'Ürün Direktörlüğü', description: 'Panel tasarımları, UI/UX, paketler' },
  CDO: { name: 'Veri Direktörlüğü', description: 'Referans değerler, grafikler, raporlar' },
  CSPO: { name: 'Sportif Direktörlük', description: 'Hareket havuzu, değerlendirme kriterleri' },
  CMDO: { name: 'Medya Direktörlüğü', description: 'Video, görsel, içerik üretimi' },
  CRDO: { name: 'AR-GE Direktörlüğü', description: 'Araştırma, yeni özellikler, rakip analizi' },
  CISO: { name: 'Güvenlik Direktörlüğü', description: 'Siber güvenlik, veri koruma' },
  CXO: { name: 'Deneyim Direktörlüğü', description: 'Kullanıcı deneyimi, müşteri memnuniyeti' },
  CCO: { name: 'İletişim Direktörlüğü', description: 'Kurumsal iletişim, PR' },
  CSO_STRATEJI: { name: 'Strateji Direktörlüğü', description: 'Uzun vadeli planlama, büyüme' }
}

// 13 Rol Tanımları (ROL-0 - ROL-12)
export const ROLES = {
  'ROL-0': { name: 'Platform Admin', level: 0, description: 'Tam yetki' },
  'ROL-1': { name: 'İşletme Sahibi', level: 1, description: 'Franchise sahibi' },
  'ROL-2': { name: 'İşletme Müdürü', level: 2, description: 'Günlük operasyon' },
  'ROL-3': { name: 'Sportif Direktör', level: 3, description: 'Antrenman programı' },
  'ROL-4': { name: 'Uzman Antrenör', level: 4, description: 'Kıdemli antrenör' },
  'ROL-5': { name: 'Antrenör', level: 5, description: 'Standart antrenör' },
  'ROL-6': { name: 'Yardımcı Antrenör', level: 6, description: 'Asistan' },
  'ROL-7': { name: 'Stajyer Antrenör', level: 7, description: 'Öğrenci/stajyer' },
  'ROL-8': { name: 'Kayıt/Bilgilendirme', level: 8, description: 'Resepsiyon' },
  'ROL-9': { name: 'Temizlik/Bakım', level: 9, description: 'Tesis bakımı' },
  'ROL-10': { name: 'Güvenlik', level: 10, description: 'Tesis güvenliği' },
  'ROL-11': { name: 'Veli', level: 11, description: 'Sporcu velisi' },
  'ROL-12': { name: 'Sporcu', level: 12, description: 'Öğrenci sporcu' }
}

// Token Ekonomisi
export const TOKEN_ECONOMY = {
  basePrice: 0.0007, // USD per token
  exchangeRate: 35, // USD to TRY
  franchiseFee: 1500, // USD one-time
  example: {
    students: 100,
    monthlyTokens: 10000,
    monthlyCostTRY: 7000
  }
}

// 7 Çekirdek Kural (DEĞİŞTİRİLEMEZ)
export const CORE_RULES = [
  { id: 1, rule: 'Panel karar vermez - AI önerir, insan onaylar' },
  { id: 2, rule: 'Veri silinmez, gizlenir - Soft delete' },
  { id: 3, rule: 'Çocuk ham verisi açılmaz - Sporcu korumalı' },
  { id: 4, rule: 'Patron DB kayıp yaşamaz - Yedekleme zorunlu' },
  { id: 5, rule: 'Audit log silinmez - Denetim kaydı kalıcı' },
  { id: 6, rule: 'Güvenlik robotu bypass edilemez - Gatekeeper' },
  { id: 7, rule: 'Tek seferde tam erişim yoktur - Katmanlı yetki' }
]
