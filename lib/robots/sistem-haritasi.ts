/**
 * ═══════════════════════════════════════════════════════════════════════════
 * YİSA-S TAM SİSTEM HARİTASI — V3.0
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Bu dosya tüm sistemin MERKEZİ HARİTASIDIR.
 * Her robot nerede durur, nasıl çağrılır, ne üretir, nereye gönderir —
 * hepsi burada tanımlıdır.
 *
 * Tarih: 6 Şubat 2026
 * Patron: Serdinç ALTAY
 */

// ═══════════════════════════════════════════════════════════════════════════
// BÖLÜM 1: ASİSTAN KUTUSU — Tüm Robotlar Burada Bekler
// ═══════════════════════════════════════════════════════════════════════════
//
//  ┌─────────────────────────────────────────────────────────────────────┐
//  │                      ASİSTAN KUTUSU                                 │
//  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐     │
//  │  │  CLAUDE  │ │   GPT   │ │ GEMINI  │ │   V0    │ │ CURSOR  │     │
//  │  │ (denetçi│ │ (metin  │ │ (görsel │ │ (UI/UX  │ │ (kod    │     │
//  │  │  analiz │ │  planlam│ │  video  │ │  tasarım│ │  hata   │     │
//  │  │  hukuk) │ │  rapor) │ │  prompt)│ │  bileşen│ │  düzelt)│     │
//  │  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘     │
//  │       │           │           │           │           │           │
//  │       └───────────┴───────────┴───────────┴───────────┘           │
//  │                          HAZIRDA BEKLİYORLAR                      │
//  │                                                                    │
//  │  Görev geldiğinde → ilgili robot(lar) göreve çıkar                │
//  │  Görev bittiğinde → kutuya geri döner                             │
//  │  Rutin iş varsa → düzene sokar, kutuya döner                     │
//  │  Geliştirme gerekiyorsa → not bırakır, kutuya döner              │
//  └─────────────────────────────────────────────────────────────────────┘

export type AIRobot = 'CLAUDE' | 'GPT' | 'GEMINI' | 'V0' | 'CURSOR' | 'TOGETHER'

export interface RobotProfile {
  id: AIRobot
  name: string
  /** Ana uzmanlık alanları */
  specialties: string[]
  /** Bu robot ne üretir */
  produces: string[]
  /** Hangi görev türlerinde çalışır */
  task_types: string[]
  /** Token maliyeti (düşük/orta/yüksek) */
  cost: 'low' | 'medium' | 'high'
}

export const ROBOT_PROFILES: Record<AIRobot, RobotProfile> = {
  CLAUDE: {
    id: 'CLAUDE',
    name: 'Claude (Anthropic)',
    specialties: ['denetim', 'analiz', 'hukuk', 'güvenlik', 'strateji', 'antrenman', 'kod inceleme'],
    produces: ['denetim raporu', 'analiz', 'strateji dokümanı', 'hukuki metin', 'düzeltme notu', 'antrenman programı'],
    task_types: ['denetim', 'analiz', 'rapor', 'belge', 'antrenman', 'güvenlik'],
    cost: 'medium',
  },
  GPT: {
    id: 'GPT',
    name: 'GPT (OpenAI)',
    specialties: ['metin üretim', 'planlama', 'rapor', 'içerik', 'bütçe', 'iş ilanı'],
    produces: ['metin', 'rapor', 'plan', 'iş ilanı', 'kampanya metni', 'bütçe tablosu'],
    task_types: ['rapor', 'belge', 'kampanya', 'general', 'planlama'],
    cost: 'medium',
  },
  GEMINI: {
    id: 'GEMINI',
    name: 'Gemini (Google)',
    specialties: ['görsel prompt', 'video prompt', 'sosyal medya', 'pazarlama', 'orkestrasyon', 'iletişim'],
    produces: ['görsel prompt', 'video planı', 'sosyal medya içeriği', 'reklam metni', 'bildirim', 'orkestrasyon kararı'],
    task_types: ['kampanya', 'tasarim', 'video', 'iletisim', 'orkestrasyon'],
    cost: 'low',
  },
  V0: {
    id: 'V0',
    name: 'V0 (Vercel)',
    specialties: ['UI tasarım', 'bileşen', 'sayfa tasarımı', 'şablon', 'logo'],
    produces: ['React bileşeni', 'UI tasarımı', 'sayfa şablonu', 'logo tasarımı', 'dashboard tasarımı'],
    task_types: ['tasarim', 'sablon', 'logo', 'ui'],
    cost: 'high',
  },
  CURSOR: {
    id: 'CURSOR',
    name: 'Cursor (AI Code)',
    specialties: ['kod yazma', 'hata ayıklama', 'kod inceleme', 'geliştirme', 'API'],
    produces: ['kod', 'API endpoint', 'hata düzeltme', 'kod inceleme raporu', 'teknik çözüm'],
    task_types: ['kod', 'hata', 'api', 'gelistirme'],
    cost: 'high',
  },
  TOGETHER: {
    id: 'TOGETHER',
    name: 'Together.ai (Llama)',
    specialties: ['veri analizi', 'istatistik', 'raporlama', 'toplu işlem'],
    produces: ['veri analizi', 'istatistik raporu', 'dashboard verisi'],
    task_types: ['rapor', 'analiz', 'veri'],
    cost: 'low',
  },
}

// ═══════════════════════════════════════════════════════════════════════════
// BÖLÜM 2: YETKİ HİYERARŞİSİ — Kim Kime Emir Verir
// ═══════════════════════════════════════════════════════════════════════════
//
//  ┌──────────────────────────────────────────────────────┐
//  │                    PATRON                             │
//  │         (En üst yetki — her şeyi onaylar)            │
//  └──────────────────────┬───────────────────────────────┘
//                         │
//          ┌──────────────┼──────────────┐
//          │              │              │
//          ▼              ▼              ▼
//  ┌──────────────┐ ┌──────────┐ ┌───────────────┐
//  │ GÜVENLİK     │ │   CIO    │ │ PATRON        │
//  │ ROBOTU       │ │ (Strateji│ │ ASİSTANI      │
//  │ (3 duvar)    │ │  beyin)  │ │ (özel işler)  │
//  └──────────────┘ └────┬─────┘ └───────────────┘
//                         │
//                         ▼
//  ┌──────────────────────────────────────────────────────┐
//  │                  CEO ROBOT                            │
//  │          (Kural tabanlı yönlendirici — AI YOK)       │
//  │     90+ anahtar kelime ile direktörlüğe yönlendirir  │
//  └──────────────────────┬───────────────────────────────┘
//                         │
//          ┌──────────────┼──────────────┐
//          │              │              │
//          ▼              ▼              ▼
//  ┌──────────────────────────────────────────────────────┐
//  │                 CELF MERKEZ                           │
//  │            (12 Direktörlük + COO)                    │
//  │                                                       │
//  │  ┌─────┐ ┌─────┐ ┌─────┐ ┌──────┐ ┌─────┐ ┌─────┐  │
//  │  │ CFO │ │ CTO │ │ CMO │ │ CHRO │ │ CLO │ │ CSO │  │
//  │  └─────┘ └─────┘ └─────┘ └──────┘ └─────┘ └─────┘  │
//  │  ┌─────┐ ┌─────┐ ┌──────┐ ┌─────┐ ┌─────┐ ┌──────┐ │
//  │  │ CDO │ │CISO │ │ CCO  │ │ CPO │ │ CIO │ │SPORT │ │
//  │  └─────┘ └─────┘ └──────┘ └─────┘ └─────┘ └──────┘ │
//  └──────────────────────┬───────────────────────────────┘
//                         │
//                         ▼ (üretim gerekiyorsa)
//  ┌──────────────────────────────────────────────────────┐
//  │              ÜRETİM HAVUZU                           │
//  │       (Tasarım/Kod/İçerik üretim robotları)          │
//  │  V0 — CURSOR — GEMINI — GPT — CLAUDE — TOGETHER     │
//  └──────────────────────┬───────────────────────────────┘
//                         │
//                         ▼
//  ┌──────────────────────────────────────────────────────┐
//  │              CEO HAVUZU (10'a Çıkart)                │
//  │         Patron görür, onaylar/reddeder               │
//  └──────────────────────────────────────────────────────┘

export interface AuthorityLevel {
  level: number
  role: string
  name: string
  can_approve: string[]
  reports_to: string | null
}

export const AUTHORITY_HIERARCHY: AuthorityLevel[] = [
  {
    level: 1,
    role: 'PATRON',
    name: 'Serdinç ALTAY',
    can_approve: ['deploy', 'commit', 'fiyat', 'marka', 'strateji', 'isten_cikarma', 'veri_silme', 'sozlesme', 'butce_revizyon', 'store_publish'],
    reports_to: null,
  },
  {
    level: 2,
    role: 'GUVENLIK',
    name: 'Güvenlik Robotu (3 Duvar)',
    can_approve: ['erisim_engelle', 'ip_ban'],
    reports_to: 'PATRON',
  },
  {
    level: 2,
    role: 'CIO',
    name: 'Strateji Beyni',
    can_approve: ['onceliklendirme', 'token_butce'],
    reports_to: 'PATRON',
  },
  {
    level: 2,
    role: 'PATRON_ASISTAN',
    name: 'Patron Asistanı',
    can_approve: [],
    reports_to: 'PATRON',
  },
  {
    level: 3,
    role: 'CEO_ROBOT',
    name: 'CEO Organizatör (Kural Tabanlı)',
    can_approve: ['direktorluk_yonlendirme'],
    reports_to: 'CIO',
  },
  {
    level: 4,
    role: 'CELF',
    name: 'CELF Merkez (12 Direktörlük)',
    can_approve: ['ic_denetim', 'ic_duzeltme'],
    reports_to: 'CEO_ROBOT',
  },
  {
    level: 4,
    role: 'CLO',
    name: 'Hukuk Direktörlüğü (VETO hakkı)',
    can_approve: ['veto', 'kvkk_engelleme'],
    reports_to: 'CEO_ROBOT',
  },
  {
    level: 5,
    role: 'URETIM_HAVUZU',
    name: 'Üretim Robotu Havuzu',
    can_approve: [],
    reports_to: 'CELF',
  },
]

// ═══════════════════════════════════════════════════════════════════════════
// BÖLÜM 3: GÖREV TÜRLERİ — Rutin / Tek Seferlik / Kalıcı
// ═══════════════════════════════════════════════════════════════════════════
//
//  ┌─────────────────────────────────────────────────────────────────┐
//  │  TEK SEFERLİK (one-time)                                       │
//  │  Patron komut verdi → yapıldı → bitti.                         │
//  │  Örn: "Logo tasarla", "Franchise sözleşmesi yaz"               │
//  │  CEO havuzuna gider → Patron onaylar → Biter.                  │
//  └─────────────────────────────────────────────────────────────────┘
//
//  ┌─────────────────────────────────────────────────────────────────┐
//  │  RUTİN (routine)                                                │
//  │  Patron "Bu rutin olsun" dedi → düzenli tekrarlanır.           │
//  │  Örn: "Her hafta sosyal medya içeriği üret"                     │
//  │       "Her ay gelir-gider raporu çıkar"                        │
//  │  İlk sefer CEO havuzuna → Patron onaylarsa → COO zamanlayıcı  │
//  │  Sonraki seferler: otomatik üretilir, CEO havuzuna düşer.     │
//  │  Patron isterse tenant'a da gönderilir (şablon olarak).       │
//  └─────────────────────────────────────────────────────────────────┘
//
//  ┌─────────────────────────────────────────────────────────────────┐
//  │  KALICI (permanent)                                             │
//  │  Sistemde kalıcı değişiklik yapan işler.                       │
//  │  Örn: "Panel tasarla", "Yeni modül ekle", "Robot konfigüre et"│
//  │  Mutlaka Patron onayı gerekir.                                  │
//  │  Onay sonrası: Deploy/Store/Tenant'a kurulum.                  │
//  └─────────────────────────────────────────────────────────────────┘

export type TaskDuration = 'tek_seferlik' | 'rutin' | 'kalici'

export interface TaskClassification {
  duration: TaskDuration
  /** Rutin ise: zamanlama */
  schedule?: 'daily' | 'weekly' | 'monthly'
  /** Patron onayı zorunlu mu */
  requires_patron_approval: boolean
  /** Tenant'a gönderilecek mi */
  goes_to_tenant: boolean
  /** Sadece CELF düzeyinde mi (şirket işi) */
  celf_only: boolean
}

// ═══════════════════════════════════════════════════════════════════════════
// BÖLÜM 4: ÜRETİM HAVUZU — Tasarım/Kod/İçerik Robot Görevlendirme
// ═══════════════════════════════════════════════════════════════════════════
//
//  Bir direktörlük "böyle bir şey üretilmeli" dediğinde,
//  üretimi hangi robot(lar) yapacak?
//
//  ┌──────────────────────────────────────────────────────────────────┐
//  │                  ÜRETİM HAVUZU                                   │
//  │                                                                   │
//  │  İş geldi → İçerik türüne göre robot(lar) belirlenir            │
//  │                                                                   │
//  │  ┌──────────────────────────────────────────────────────────┐    │
//  │  │  İÇERİK TÜRÜ → ROBOT SIRASI (Pipeline)                  │    │
//  │  ├──────────────────────────────────────────────────────────┤    │
//  │  │                                                          │    │
//  │  │  UI/SAYFA/PANEL tasarımı:                                │    │
//  │  │    → V0 (tasarlar) → Cursor (koda çevirir)              │    │
//  │  │                                                          │    │
//  │  │  Logo/Grafik tasarımı:                                    │    │
//  │  │    → V0 (tek başına yeterli)                              │    │
//  │  │                                                          │    │
//  │  │  Sosyal medya içerik/reklam:                              │    │
//  │  │    → Gemini (planlar + prompt yazar) → V0 (görsel üretir)│    │
//  │  │                                                          │    │
//  │  │  Video/Animasyon planı:                                   │    │
//  │  │    → Gemini (senaryo + prompt) → V0 (kare tasarımı)      │    │
//  │  │                                                          │    │
//  │  │  Kod/API/Teknik:                                          │    │
//  │  │    → Cursor (yazar) → Claude (inceler)                   │    │
//  │  │                                                          │    │
//  │  │  Metin/Rapor/Belge:                                       │    │
//  │  │    → GPT (yazar) → Claude (denetler)                     │    │
//  │  │                                                          │    │
//  │  │  Antrenman programı:                                      │    │
//  │  │    → Claude (yazar — 15 uzman) → Claude (denetler)       │    │
//  │  │                                                          │    │
//  │  │  Veri analizi / İstatistik:                               │    │
//  │  │    → Together (analiz) → Claude (denetler)               │    │
//  │  │                                                          │    │
//  │  │  Pazarlama kampanya planı:                                │    │
//  │  │    → Gemini (plan) → GPT (metin) → V0 (görsel)          │    │
//  │  │                                                          │    │
//  │  │  Hukuki metin / Sözleşme:                                │    │
//  │  │    → Claude (yazar) → Claude (denetler — VETO hakkı)     │    │
//  │  │                                                          │    │
//  │  │  Şablon (e-posta, bildirim):                              │    │
//  │  │    → GPT (metin) → V0 (tasarım)                          │    │
//  │  │                                                          │    │
//  │  └──────────────────────────────────────────────────────────┘    │
//  │                                                                   │
//  │  Son robot bitirince → Claude denetler → CEO havuzuna gönderir  │
//  └──────────────────────────────────────────────────────────────────┘

export type ProductionContentType =
  | 'ui_sayfa'        // Panel, sayfa, dashboard tasarımı
  | 'logo_grafik'     // Logo, ikon, grafik
  | 'sosyal_medya'    // Instagram, TikTok, Facebook içerik
  | 'video'           // Video/animasyon planı
  | 'kod_api'         // Yazılım, API endpoint
  | 'metin_rapor'     // Rapor, doküman, belge
  | 'antrenman'       // Antrenman programı, ölçüm
  | 'veri_analiz'     // İstatistik, dashboard verisi
  | 'kampanya'        // Pazarlama kampanya planı (çok aşamalı)
  | 'hukuki'          // Sözleşme, KVKK metni
  | 'sablon'          // E-posta şablonu, bildirim şablonu
  | 'robot_config'    // Robot konfigürasyonu

export interface ProductionPipeline {
  /** İçerik türü */
  content_type: ProductionContentType
  /** Türkçe açıklama */
  description: string
  /** Robot sırası — hangi robotlar sırayla çalışır */
  robot_sequence: AIRobot[]
  /** Son aşama her zaman Claude denetimi mi */
  claude_final_review: boolean
  /** Tahmini token maliyeti */
  estimated_tokens: number
  /** Patron onayı zorunlu mu */
  requires_patron_approval: boolean
  /** Hangi direktörlükler bu türde iş gönderebilir */
  source_directorates: string[]
}

export const PRODUCTION_PIPELINES: ProductionPipeline[] = [
  // ─── UI / SAYFA / PANEL TASARIMI ─────────────────────────────
  {
    content_type: 'ui_sayfa',
    description: 'UI/UX tasarımı, panel, sayfa, dashboard — V0 tasarlar, Cursor koda çevirir',
    robot_sequence: ['V0', 'CURSOR'],
    claude_final_review: true,
    estimated_tokens: 8000,
    requires_patron_approval: true,  // Kalıcı değişiklik
    source_directorates: ['CPO', 'CTO', 'CHRO', 'CDO', 'CCO', 'SPORTIF'],
  },

  // ─── LOGO / GRAFİK ───────────────────────────────────────────
  {
    content_type: 'logo_grafik',
    description: 'Logo, ikon, grafik tasarım — V0 tek başına yeterli',
    robot_sequence: ['V0'],
    claude_final_review: true,
    estimated_tokens: 4000,
    requires_patron_approval: true,  // Marka ile ilgili
    source_directorates: ['CPO', 'CMO', 'CDO'],
  },

  // ─── SOSYAL MEDYA İÇERİK ─────────────────────────────────────
  {
    content_type: 'sosyal_medya',
    description: 'Sosyal medya içerik — Gemini planlar + prompt yazar, V0 görsel üretir',
    robot_sequence: ['GEMINI', 'V0'],
    claude_final_review: true,
    estimated_tokens: 5000,
    requires_patron_approval: false,  // Rutin olabilir
    source_directorates: ['CMO', 'CCO', 'CSO'],
  },

  // ─── VİDEO / ANİMASYON ───────────────────────────────────────
  {
    content_type: 'video',
    description: 'Video/animasyon planı — Gemini senaryo + prompt, V0 kare tasarımı',
    robot_sequence: ['GEMINI', 'V0'],
    claude_final_review: true,
    estimated_tokens: 6000,
    requires_patron_approval: true,
    source_directorates: ['CMO', 'CPO', 'CDO'],
  },

  // ─── KOD / API / TEKNİK ──────────────────────────────────────
  {
    content_type: 'kod_api',
    description: 'Yazılım geliştirme — Cursor yazar, Claude inceler',
    robot_sequence: ['CURSOR'],
    claude_final_review: true,
    estimated_tokens: 6000,
    requires_patron_approval: true,  // Deploy gerekir
    source_directorates: ['CTO', 'CIO', 'CPO'],
  },

  // ─── METİN / RAPOR / BELGE ───────────────────────────────────
  {
    content_type: 'metin_rapor',
    description: 'Rapor, doküman, belge — GPT yazar, Claude denetler',
    robot_sequence: ['GPT'],
    claude_final_review: true,
    estimated_tokens: 3000,
    requires_patron_approval: false,
    source_directorates: ['CFO', 'CHRO', 'CSO', 'CDO', 'CIO', 'CCO'],
  },

  // ─── ANTRENMAN PROGRAMI ───────────────────────────────────────
  {
    content_type: 'antrenman',
    description: 'Antrenman programı, ölçüm — Claude (15 uzman bilgi tabanı) yazar + denetler',
    robot_sequence: ['CLAUDE'],
    claude_final_review: true,
    estimated_tokens: 5000,
    requires_patron_approval: false,
    source_directorates: ['SPORTIF'],
  },

  // ─── VERİ ANALİZİ ────────────────────────────────────────────
  {
    content_type: 'veri_analiz',
    description: 'Veri analizi, istatistik — Together analiz eder, Claude denetler',
    robot_sequence: ['TOGETHER'],
    claude_final_review: true,
    estimated_tokens: 4000,
    requires_patron_approval: false,
    source_directorates: ['CDO', 'CIO', 'CFO', 'SPORTIF'],
  },

  // ─── KAMPANYA PLANI (ÇOK AŞAMALI) ────────────────────────────
  {
    content_type: 'kampanya',
    description: 'Pazarlama kampanya — Gemini plan, GPT metin, V0 görsel',
    robot_sequence: ['GEMINI', 'GPT', 'V0'],
    claude_final_review: true,
    estimated_tokens: 10000,
    requires_patron_approval: true,
    source_directorates: ['CMO', 'CSO', 'CCO'],
  },

  // ─── HUKUKİ METİN ────────────────────────────────────────────
  {
    content_type: 'hukuki',
    description: 'Sözleşme, KVKK metni — Claude yazar + denetler (VETO hakkı)',
    robot_sequence: ['CLAUDE'],
    claude_final_review: true,
    estimated_tokens: 4000,
    requires_patron_approval: true,  // Her zaman
    source_directorates: ['CLO'],
  },

  // ─── ŞABLON ───────────────────────────────────────────────────
  {
    content_type: 'sablon',
    description: 'E-posta/bildirim şablonu — GPT metin, V0 tasarım',
    robot_sequence: ['GPT', 'V0'],
    claude_final_review: true,
    estimated_tokens: 5000,
    requires_patron_approval: false,  // Rutin olabilir
    source_directorates: ['CCO', 'CMO', 'CHRO', 'CPO'],
  },

  // ─── ROBOT KONFİGÜRASYON ─────────────────────────────────────
  {
    content_type: 'robot_config',
    description: 'Tenant robot konfigürasyonu — Claude yapılandırır',
    robot_sequence: ['CLAUDE'],
    claude_final_review: true,
    estimated_tokens: 3000,
    requires_patron_approval: true,
    source_directorates: ['CTO', 'CPO', 'CIO'],
  },
]

// ═══════════════════════════════════════════════════════════════════════════
// BÖLÜM 5: DİREKTÖRLÜK → ÜRETİM HAVUZU AKIŞI
// ═══════════════════════════════════════════════════════════════════════════
//
//  Bir direktörlük iş ürettiğinde, doğrudan üretim robotuna GİTMEZ.
//  CEO HAVUZU üzerinden geçer.
//
//  ┌──────────────────────────────────────────────────────────────────────┐
//  │                                                                      │
//  │  ① DİREKTÖRLÜK İÇ ÇALIŞMA                                         │
//  │     ┌──────────┐                                                     │
//  │     │ CHRO     │  "Personel paneli gerekiyor, şu bilgiler           │
//  │     │ (İK)     │   gösterilsin, bu roller erişsin"                  │
//  │     └────┬─────┘                                                     │
//  │          │                                                           │
//  │          │ İÇERİDE:                                                  │
//  │          │  GPT → gereksinim dokümanı yazar                         │
//  │          │  Claude → denetler, düzeltir                             │
//  │          │  TEMİZ çıktı: "Personel paneli gereksinim dokümanı"     │
//  │          │                                                           │
//  │          ▼                                                           │
//  │  ② CEO HAVUZU'NA DÜŞER                                             │
//  │     ┌───────────────────────────────────────────────────────┐       │
//  │     │ CEO HAVUZU (10'a Çıkart)                              │       │
//  │     │                                                        │       │
//  │     │ İŞ: Personel Paneli Gereksinim Dokümanı               │       │
//  │     │ GÖNDEREN: CHRO (İnsan Kaynakları)                     │       │
//  │     │ FİKRİ GELİŞTİREN: GPT                                 │       │
//  │     │ DENETLEYEN: Claude                                     │       │
//  │     │ İÇERİK TÜRÜ: ui_sayfa                                 │       │
//  │     │                                                        │       │
//  │     │ ÖNERİLEN ÜRETİM HATTI:                                │       │
//  │     │   V0 (tasarlar) → Cursor (koda çevirir)               │       │
//  │     │                                                        │       │
//  │     │ PATRON SEÇENEKLERİ:                                   │       │
//  │     │   [✓] Önerilen hattı onayla                           │       │
//  │     │   [ ] Sadece V0 çalışsın                              │       │
//  │     │   [ ] Sadece Cursor çalışsın                          │       │
//  │     │   [ ] Özel hat belirle: ___                           │       │
//  │     │                                                        │       │
//  │     │ [ONAYLA]  [REDDET]  [DÜZELT]                          │       │
//  │     └───────────────────────────────────────────────────────┘       │
//  │                                                                      │
//  │          │ Patron "ONAYLA" dedi + üretim hattını seçti              │
//  │          ▼                                                           │
//  │  ③ ÜRETİM HAVUZU'NA GİDER                                          │
//  │     ┌──────────────────────────────────────────────────────┐        │
//  │     │ ÜRETİM HAVUZU                                        │        │
//  │     │                                                        │        │
//  │     │ Robot 1 (V0): Panel tasarımını yapar                  │        │
//  │     │     ↓                                                  │        │
//  │     │ Robot 2 (Cursor): Koda çevirir                        │        │
//  │     │     ↓                                                  │        │
//  │     │ Claude: Son denetim                                    │        │
//  │     │     ↓                                                  │        │
//  │     │ TEMİZ ÜRÜN → CEO havuzuna geri (onay için)            │        │
//  │     └──────────────────────────────────────────────────────┘        │
//  │                                                                      │
//  │          ▼                                                           │
//  │  ④ PATRON SON ONAYI                                                 │
//  │     Patron ürünü görür:                                              │
//  │     → Onayla → Store/Deploy/Tenant'a gönder                         │
//  │     → Reddet → Arşiv                                                 │
//  │     → Düzelt → Üretim havuzuna geri (düzeltme notu ile)            │
//  │                                                                      │
//  └──────────────────────────────────────────────────────────────────────┘

// ═══════════════════════════════════════════════════════════════════════════
// BÖLÜM 6: İÇERİK TÜRÜ TESPİTİ — Hangi Pipeline Çalışacak
// ═══════════════════════════════════════════════════════════════════════════

/** İçerik türünü komuttan otomatik tespit et */
export function detectProductionContentType(command: string): ProductionContentType {
  const lower = command.toLowerCase()

  // UI/Sayfa/Panel
  if (/panel|sayfa|dashboard|ekran|arayüz|bileşen|component/.test(lower)) return 'ui_sayfa'

  // Logo/Grafik
  if (/logo|ikon|icon|grafik|amblem/.test(lower)) return 'logo_grafik'

  // Video
  if (/video|animasyon|clip|reel/.test(lower)) return 'video'

  // Sosyal medya
  if (/instagram|tiktok|facebook|sosyal medya|paylaşım|story|reels/.test(lower)) return 'sosyal_medya'

  // Kod/API
  if (/kod|api|endpoint|yazılım|geliştir|hata.*düzelt|bug|feature/.test(lower)) return 'kod_api'

  // Antrenman
  if (/antrenman|program|sporcu|ölçüm|branş|hareket|cimnastik/.test(lower)) return 'antrenman'

  // Kampanya (çok aşamalı)
  if (/kampanya|lansman|tanıtım.*planı/.test(lower)) return 'kampanya'

  // Hukuki
  if (/sözleşme|kvkk|hukuk|patent|anlaşma|yasal/.test(lower)) return 'hukuki'

  // Veri analizi
  if (/analiz|istatistik|dashboard.*veri|grafik.*veri/.test(lower)) return 'veri_analiz'

  // Şablon
  if (/şablon|template|e-posta|bildirim|mail/.test(lower)) return 'sablon'

  // Robot konfigürasyon
  if (/robot.*kur|robot.*ayarla|robot.*konfigür/.test(lower)) return 'robot_config'

  // Rapor/Belge (varsayılan metin türü)
  if (/rapor|belge|doküman|yazı|ilan|metin|liste/.test(lower)) return 'metin_rapor'

  return 'metin_rapor' // varsayılan
}

/** İçerik türüne göre üretim pipeline'ını bul */
export function getProductionPipeline(contentType: ProductionContentType): ProductionPipeline | undefined {
  return PRODUCTION_PIPELINES.find(p => p.content_type === contentType)
}

// ═══════════════════════════════════════════════════════════════════════════
// BÖLÜM 7: PATRON ONAY vs TENANT ONAYI — Kim Karar Verir
// ═══════════════════════════════════════════════════════════════════════════
//
//  ┌──────────────────────────────────────────────────────────────────────┐
//  │                                                                      │
//  │  PATRON ONAYLAR (CELF düzeyinde — şirket işi):                      │
//  │  ─────────────────────────────────────────────                       │
//  │  • Yeni tasarım/panel/sayfa (kalıcı değişiklik)                     │
//  │  • Logo/marka ile ilgili her şey                                     │
//  │  • Deploy / commit (her zaman)                                       │
//  │  • Fiyat değişikliği                                                 │
//  │  • Strateji değişikliği                                              │
//  │  • Sözleşme / hukuki metin                                           │
//  │  • Personel işlemleri (işe alım, çıkarma)                           │
//  │  • Veri silme                                                        │
//  │  • Mağazaya yayınlama                                               │
//  │  • Büyük bütçeli kampanya                                            │
//  │  • İlk kez oluşturulan şablonlar                                    │
//  │                                                                      │
//  │  TENANT KENDİ İŞİNİ YAPAR (tenant düzeyinde):                      │
//  │  ─────────────────────────────────────────────                       │
//  │  • Kendi rutin sosyal medya paylaşımları                            │
//  │  • Kendi sporcu raporları                                            │
//  │  • Kendi muhasebe kayıtları                                          │
//  │  • Kendi personel sicil görüntüleme                                  │
//  │  • Kendi müşteri bildirimleri (onaylanmış şablonlardan)             │
//  │  • Kendi antrenman programı (önceden onaylanmış parametrelerle)     │
//  │                                                                      │
//  │  KURAL: Tenant, Patron'un onayladığı ŞABLONLARI kullanır.          │
//  │  Yeni şablon oluşturamaz. Sistemde kalıcı değişiklik yapamaz.      │
//  │  Tenant robotları günlük token limiti içinde çalışır.              │
//  │                                                                      │
//  └──────────────────────────────────────────────────────────────────────┘

export type ApprovalAuthority = 'patron' | 'tenant' | 'otomatik'

export interface ApprovalRule {
  condition: string
  authority: ApprovalAuthority
  reason: string
}

export const APPROVAL_RULES: ApprovalRule[] = [
  // ── PATRON ONAYLAR ──
  { condition: 'kalici_degisiklik', authority: 'patron', reason: 'Sistemde kalıcı değişiklik — Patron onayı şart' },
  { condition: 'deploy_commit', authority: 'patron', reason: 'Deploy/commit — Patron onayı şart' },
  { condition: 'fiyat_degisikligi', authority: 'patron', reason: 'Fiyat değişikliği — Patron onayı şart' },
  { condition: 'marka_degisikligi', authority: 'patron', reason: 'Marka/logo değişikliği — Patron onayı şart' },
  { condition: 'strateji_degisikligi', authority: 'patron', reason: 'Strateji değişikliği — Patron onayı şart' },
  { condition: 'hukuki_islem', authority: 'patron', reason: 'Hukuki işlem — Patron + CLO onayı' },
  { condition: 'veri_silme', authority: 'patron', reason: 'Veri silme — Patron onayı şart' },
  { condition: 'personel_islem', authority: 'patron', reason: 'İşe alım/çıkarma — Patron onayı şart' },
  { condition: 'store_yayinlama', authority: 'patron', reason: 'Mağazaya yayınlama — Patron onayı şart' },
  { condition: 'yeni_sablon', authority: 'patron', reason: 'İlk kez oluşturulan şablon — Patron onayı şart' },
  { condition: 'buyuk_kampanya', authority: 'patron', reason: 'Büyük bütçeli kampanya — Patron onayı şart' },

  // ── TENANT KENDİ İŞİNİ YAPAR ──
  { condition: 'rutin_sosyal_medya', authority: 'tenant', reason: 'Onaylı şablondan sosyal medya paylaşımı' },
  { condition: 'kendi_raporlari', authority: 'tenant', reason: 'Kendi sporcu/muhasebe raporları' },
  { condition: 'kendi_bildirimleri', authority: 'tenant', reason: 'Onaylı şablondan bildirim gönderimi' },
  { condition: 'sicil_goruntuleme', authority: 'tenant', reason: 'Kendi personel sicil görüntüleme' },

  // ── OTOMATİK (onay gerektirmeyen) ──
  { condition: 'rutin_rapor', authority: 'otomatik', reason: 'Önceden onaylanmış rutin rapor üretimi' },
  { condition: 'yazim_kontrolu', authority: 'otomatik', reason: 'Yazım hatası düzeltme (Claude otomatik)' },
]

// ═══════════════════════════════════════════════════════════════════════════
// BÖLÜM 8: CEO HAVUZU İÇİ GÖREV KARTI — Patron Ne Görür
// ═══════════════════════════════════════════════════════════════════════════

export interface CeoPoolCard {
  /** İş ID */
  job_id: string
  /** Ticket numarası */
  ticket_no: string
  /** İşin başlığı */
  title: string
  /** İçerik özeti */
  summary: string

  // ── KİM GÖNDERDİ ──
  /** Gönderen direktörlük */
  source_directorate: string
  /** Fikri geliştiren AI */
  idea_producer: AIRobot
  /** Denetleyen AI (her zaman Claude) */
  reviewer: 'CLAUDE'

  // ── NE YAPILACAK ──
  /** İçerik türü */
  content_type: ProductionContentType
  /** Önerilen üretim hattı */
  suggested_pipeline: AIRobot[]
  /** Patron seçebileceği alternatif hatlar */
  alternative_pipelines: {
    label: string
    robots: AIRobot[]
  }[]

  // ── GÖREV SINIFLANDIRMASI ──
  /** Tek seferlik / rutin / kalıcı */
  task_duration: TaskDuration
  /** Rutin ise zamanlama */
  schedule?: string
  /** Onay otoritesi */
  approval_authority: ApprovalAuthority

  // ── PATRON SEÇENEKLERİ ──
  /** Patron ne yapabilir */
  patron_actions: ('onayla' | 'reddet' | 'duzelt' | 'hat_degistir' | 'rutin_yap')[]
}

// ═══════════════════════════════════════════════════════════════════════════
// BÖLÜM 9: TAM GÖREV SEYRİ — Baştan Sona Akış
// ═══════════════════════════════════════════════════════════════════════════
//
//  ① PATRON KOMUT VERİR
//     "Personel yönetim paneli tasarla, çalışan ve müdür rolü olsun"
//           │
//           ▼
//  ② GÜVENLİK KONTROLÜ
//     Siber güvenlik robotu kontrol eder (zararlı mı?)
//           │
//           ▼
//  ③ CIO ANALİZİ
//     Öncelik, token bütçesi, çakışma kontrolü
//     Sonuç: "CHRO + CPO çalışmalı, öncelik HIGH, ~8000 token"
//           │
//           ▼
//  ④ CEO ROBOT YÖNLENDİRME
//     Anahtar kelimeler: "personel" → CHRO, "panel" → CPO
//     Karar: Ana direktörlük CHRO, yardımcı CPO
//           │
//           ▼
//  ⑤ DİREKTÖRLÜK İÇ DÖNGÜSÜ (CHRO)
//     ┌─────────────────────────────────────────────────┐
//     │ GPT: Personel paneli gereksinim dokümanı yazar  │
//     │ Claude: Denetler — KVKK uyumlu mu?              │
//     │ → "GEÇTİ" → TEMİZ çıktı                       │
//     └─────────────────────────────────────────────────┘
//           │
//           ▼
//  ⑥ CEO HAVUZU'NA DÜŞER
//     Patron görür:
//     - İŞ: Personel Paneli Gereksinim Dokümanı
//     - GÖNDEREN: CHRO
//     - FİKRİ GELİŞTİREN: GPT
//     - İÇERİK TÜRÜ: ui_sayfa
//     - ÖNERİLEN HAT: V0 → Cursor
//     - ALTERNATİFLER: [Sadece V0] [Sadece Cursor] [Özel]
//           │
//           ▼
//  ⑦ PATRON ONAYLAR + ÜRETİM HATTINI SEÇER
//     "Onayla — V0 + Cursor çalışsın"
//           │
//           ▼
//  ⑧ ÜRETİM HAVUZU ÇALIŞIR
//     ┌─────────────────────────────────────────────────┐
//     │ V0: Panel tasarımını yapar (React bileşeni)     │
//     │     ↓                                            │
//     │ Cursor: Koda çevirir, hata ayıklar              │
//     │     ↓                                            │
//     │ Claude: Son denetim (güvenlik, kalite)           │
//     │     ↓                                            │
//     │ TEMİZ ÜRÜN                                       │
//     └─────────────────────────────────────────────────┘
//           │
//           ▼
//  ⑨ CEO HAVUZU'NA GERİ DÜŞER (ÜRETİM SONUCU)
//     Patron son ürünü görür:
//     - İŞ: Personel Paneli (tasarlanmış + kodlanmış)
//     - ÜRETİMCİLER: V0 + Cursor
//     - DENETÇİ: Claude
//     - ÖNİZLEME: [Panel ekran görüntüsü / kod]
//           │
//           ▼
//  ⑩ PATRON SON KARAR
//     → "Onayla" → Deploy / Store / Tenant'a kur
//     → "Reddet" → Arşiv
//     → "Düzelt" → Üretim havuzuna geri
//     → "Rutin yap" → COO zamanlayıcıya ekle
//
//  ⑪ DAĞITIM
//     ┌─────────────────────────────────────────────────┐
//     │ Deploy → Sisteme entegre et (CTO)               │
//     │ Store → Mağazaya yayınla (tenant'lar görsün)    │
//     │ Tenant → Direkt tenant'a kur                    │
//     │ Rutin → COO zamanlayıcıya ekle                 │
//     │ Şablon → Tenant'ların kullanımına aç            │
//     └─────────────────────────────────────────────────┘

export type JobPhase =
  | 'patron_komutu'          // ① Patron komut verdi
  | 'guvenlik_kontrol'       // ② Güvenlik kontrolü
  | 'cio_analiz'             // ③ CIO analizi
  | 'ceo_yonlendirme'        // ④ CEO yönlendirme
  | 'direktorluk_ic_dongu'   // ⑤ Direktörlük iç döngüsü
  | 'ceo_havuzu_gereksinim'  // ⑥ CEO havuzunda (gereksinim dokümanı)
  | 'patron_uretim_onayi'    // ⑦ Patron üretim hattını seçer
  | 'uretim_havuzu'          // ⑧ Üretim havuzu çalışır
  | 'ceo_havuzu_urun'        // ⑨ CEO havuzunda (üretilmiş ürün)
  | 'patron_son_karar'       // ⑩ Patron son kararı
  | 'dagitim'                // ⑪ Dağıtım (deploy/store/tenant)

export interface JobJourney {
  phase: JobPhase
  description: string
  actor: string
  next_phases: JobPhase[]
}

export const JOB_JOURNEY: JobJourney[] = [
  { phase: 'patron_komutu', description: 'Patron komut verir', actor: 'PATRON', next_phases: ['guvenlik_kontrol'] },
  { phase: 'guvenlik_kontrol', description: 'Güvenlik robotu kontrol eder', actor: 'GUVENLIK', next_phases: ['cio_analiz'] },
  { phase: 'cio_analiz', description: 'CIO öncelik/bütçe/çakışma analizi', actor: 'CIO', next_phases: ['ceo_yonlendirme'] },
  { phase: 'ceo_yonlendirme', description: 'CEO doğru direktörlüğe yönlendirir', actor: 'CEO_ROBOT', next_phases: ['direktorluk_ic_dongu'] },
  { phase: 'direktorluk_ic_dongu', description: 'Direktörlük içinde üretim + Claude denetimi', actor: 'CELF', next_phases: ['ceo_havuzu_gereksinim'] },
  { phase: 'ceo_havuzu_gereksinim', description: 'Gereksinim/fikir CEO havuzunda — Patron görür', actor: 'CEO_HAVUZU', next_phases: ['patron_uretim_onayi'] },
  { phase: 'patron_uretim_onayi', description: 'Patron üretim hattını seçer + onaylar', actor: 'PATRON', next_phases: ['uretim_havuzu'] },
  { phase: 'uretim_havuzu', description: 'Seçilen robotlar sırayla üretim yapar', actor: 'URETIM_HAVUZU', next_phases: ['ceo_havuzu_urun'] },
  { phase: 'ceo_havuzu_urun', description: 'Üretilmiş ürün CEO havuzunda — Patron görür', actor: 'CEO_HAVUZU', next_phases: ['patron_son_karar'] },
  { phase: 'patron_son_karar', description: 'Patron son kararı verir', actor: 'PATRON', next_phases: ['dagitim'] },
  { phase: 'dagitim', description: 'Ürün dağıtılır (deploy/store/tenant)', actor: 'SISTEM', next_phases: [] },
]

// ═══════════════════════════════════════════════════════════════════════════
// BÖLÜM 10: YAZI KONTROLÜ — Claude Yazım Denetimi
// ═══════════════════════════════════════════════════════════════════════════
//
//  Her çıktıda Claude otomatik yazım kontrolü yapar:
//  - Türkçe karakter hataları (ı/i, ö/o, ü/u, ç/c, ş/s, ğ/g)
//  - Kelime tekrarı
//  - Cümle yapısı
//  - Sosyal medya şablonlarında özellikle dikkat
//
//  Bu kontrol İÇ DENETİM'in bir parçasıdır.
//  Ayrı bir adım değil — Claude denetim kriterlerinden biridir.

export const YAZIM_KONTROL_KRITERLERI = [
  'Türkçe karakterler doğru kullanılmış mı (ı/i, ö/o, ü/u, ç/c, ş/s, ğ/g)?',
  'Kelime tekrarı var mı?',
  'Cümle yapısı anlaşılır mı?',
  'Sosyal medya içeriğinde hashtag formatı doğru mu?',
  'Tenant/franchise ismi doğru yazılmış mı?',
  'YİSA-S marka adı doğru kullanılmış mı?',
]

// ═══════════════════════════════════════════════════════════════════════════
// BÖLÜM 11: HELPER FONKSİYONLAR
// ═══════════════════════════════════════════════════════════════════════════

/** Komuttan içerik türünü tespit et ve pipeline'ı bul */
export function resolveProductionPipeline(command: string): {
  content_type: ProductionContentType
  pipeline: ProductionPipeline | undefined
  suggested_robots: AIRobot[]
} {
  const contentType = detectProductionContentType(command)
  const pipeline = getProductionPipeline(contentType)
  return {
    content_type: contentType,
    pipeline,
    suggested_robots: pipeline?.robot_sequence ?? ['GPT'],
  }
}

/** Patron alternatif üretim hatlarını al */
export function getAlternativePipelines(contentType: ProductionContentType): { label: string; robots: AIRobot[] }[] {
  const alternatives: { label: string; robots: AIRobot[] }[] = []

  switch (contentType) {
    case 'ui_sayfa':
      alternatives.push(
        { label: 'Sadece V0 (tasarım)', robots: ['V0'] },
        { label: 'Sadece Cursor (kod)', robots: ['CURSOR'] },
        { label: 'V0 + Cursor (tam)', robots: ['V0', 'CURSOR'] },
        { label: 'Gemini (plan) + V0 + Cursor', robots: ['GEMINI', 'V0', 'CURSOR'] },
      )
      break
    case 'logo_grafik':
      alternatives.push(
        { label: 'Sadece V0', robots: ['V0'] },
        { label: 'Gemini (prompt) + V0', robots: ['GEMINI', 'V0'] },
      )
      break
    case 'sosyal_medya':
      alternatives.push(
        { label: 'Sadece Gemini', robots: ['GEMINI'] },
        { label: 'Gemini + V0 (görsel)', robots: ['GEMINI', 'V0'] },
        { label: 'GPT (metin) + V0 (görsel)', robots: ['GPT', 'V0'] },
      )
      break
    case 'video':
      alternatives.push(
        { label: 'Sadece Gemini', robots: ['GEMINI'] },
        { label: 'Gemini + V0', robots: ['GEMINI', 'V0'] },
      )
      break
    case 'kod_api':
      alternatives.push(
        { label: 'Sadece Cursor', robots: ['CURSOR'] },
        { label: 'Claude + Cursor', robots: ['CLAUDE', 'CURSOR'] },
      )
      break
    case 'metin_rapor':
      alternatives.push(
        { label: 'Sadece GPT', robots: ['GPT'] },
        { label: 'Sadece Claude', robots: ['CLAUDE'] },
        { label: 'GPT + Claude', robots: ['GPT', 'CLAUDE'] },
      )
      break
    case 'kampanya':
      alternatives.push(
        { label: 'Gemini + GPT + V0 (tam)', robots: ['GEMINI', 'GPT', 'V0'] },
        { label: 'Gemini + V0 (görsel kampanya)', robots: ['GEMINI', 'V0'] },
        { label: 'GPT + V0 (metin + görsel)', robots: ['GPT', 'V0'] },
        { label: 'Sadece Gemini', robots: ['GEMINI'] },
      )
      break
    case 'sablon':
      alternatives.push(
        { label: 'GPT + V0 (metin + tasarım)', robots: ['GPT', 'V0'] },
        { label: 'Sadece GPT (metin)', robots: ['GPT'] },
        { label: 'Sadece V0 (tasarım)', robots: ['V0'] },
      )
      break
    default:
      alternatives.push(
        { label: 'Sadece Claude', robots: ['CLAUDE'] },
        { label: 'Sadece GPT', robots: ['GPT'] },
      )
  }

  return alternatives
}

/** CEO havuzu kartı oluştur */
export function buildCeoPoolCard(params: {
  job_id: string
  ticket_no: string
  title: string
  summary: string
  source_directorate: string
  idea_producer: AIRobot
  command: string
  task_duration: TaskDuration
  schedule?: string
}): CeoPoolCard {
  const contentType = detectProductionContentType(params.command)
  const pipeline = getProductionPipeline(contentType)

  return {
    job_id: params.job_id,
    ticket_no: params.ticket_no,
    title: params.title,
    summary: params.summary,
    source_directorate: params.source_directorate,
    idea_producer: params.idea_producer,
    reviewer: 'CLAUDE',
    content_type: contentType,
    suggested_pipeline: pipeline?.robot_sequence ?? ['GPT'],
    alternative_pipelines: getAlternativePipelines(contentType),
    task_duration: params.task_duration,
    schedule: params.schedule,
    approval_authority: pipeline?.requires_patron_approval ? 'patron' : 'otomatik',
    patron_actions: ['onayla', 'reddet', 'duzelt', 'hat_degistir', 'rutin_yap'],
  }
}
