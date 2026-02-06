/**
 * ═══════════════════════════════════════════════════════════════════════════
 * YİSA-S KOMUT TAKİP HARİTASI — Her İşin Yolculuğu
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Kargo takibi gibi — her iş nereye gitti, ne oldu, şu an nerede.
 *
 *  Örnek Takip:
 *  ┌─────────────────────────────────────────────────────────────┐
 *  │ İŞ: #JOB-260206-1423-A7B2                                  │
 *  │ KOMUT: "Personel yönetim paneli tasarla"                    │
 *  │                                                              │
 *  │ ● Patron komutu alındı .................. 14:23  ✓          │
 *  │ ● Güvenlik kontrolü ..................... 14:23  ✓          │
 *  │ ● CIO analiz: CHRO + CPO, HIGH öncelik . 14:23  ✓          │
 *  │ ● CEO → CHRO'ya yönlendirdi ............ 14:23  ✓          │
 *  │ ● CHRO iç döngü: GPT üretir ............ 14:24  ✓          │
 *  │ ● CHRO iç döngü: Claude denetledi ...... 14:24  ✓ GEÇTİ   │
 *  │ ● CEO havuzuna düştü .................... 14:24  ✓          │
 *  │ ○ Patron üretim hattı seçimi ........... bekliyor           │
 *  │ ○ CELF Motor görevlendirme ............. bekliyor           │
 *  │ ○ Üretim: V0 tasarım ................... bekliyor           │
 *  │ ○ Üretim: Cursor kod ................... bekliyor           │
 *  │ ○ Claude son denetim ................... bekliyor           │
 *  │ ○ Patron son onay ...................... bekliyor           │
 *  │ ○ Dağıtım ............................. bekliyor           │
 *  │                                                              │
 *  │ MONTE NOKTASI: /dashboard/personel-yonetim                  │
 *  │ HEDEF: Tüm tenant'lar (tesis müdürü + çalışan rolleri)     │
 *  │ RENK/TEMA: Tenant'a göre özelleştirilecek                  │
 *  └─────────────────────────────────────────────────────────────┘
 *
 * Tarih: 6 Şubat 2026
 */

// ─── Adım Tanımları ──────────────────────────────────────────

export type JourneyStepId =
  | 'patron_komutu'
  | 'guvenlik_kontrol'
  | 'cio_analiz'
  | 'ceo_yonlendirme'
  | 'direktorluk_uretim'
  | 'direktorluk_denetim'
  | 'ceo_havuzu_gereksinim'
  | 'patron_uretim_secimi'
  | 'celf_motor_gorevlendirme'
  | 'uretim_adim'             // Dinamik — her robot için tekrarlanır
  | 'claude_son_denetim'
  | 'ceo_havuzu_urun'
  | 'patron_son_karar'
  | 'dagitim'

export type StepStatus = 'pending' | 'in_progress' | 'completed' | 'failed' | 'skipped'

export interface JourneyStep {
  /** Adım ID */
  id: JourneyStepId
  /** Adım sırası */
  order: number
  /** Türkçe açıklama */
  label: string
  /** Detay (ne oldu) */
  detail?: string
  /** Kim yaptı */
  actor?: string
  /** Durum */
  status: StepStatus
  /** Başlama zamanı */
  started_at?: string
  /** Bitiş zamanı */
  completed_at?: string
  /** Ek veri */
  metadata?: Record<string, unknown>
}

// ─── Monte Noktası — İş Nereye Kurulacak ────────────────────

export interface MonteNoktasi {
  /** Hedef sayfa/panel yolu (örn: /dashboard/personel-yonetim) */
  target_path?: string
  /** Hedef bileşen adı (örn: PersonelPanel) */
  target_component?: string
  /** Vitrine mi gidecek */
  goes_to_store: boolean
  /** Vitrin kategorisi */
  store_category?: 'sablon' | 'robot' | 'paket' | 'icerik' | 'hizmet'
  /** Hangi tenant'lara kurulacak */
  target_tenants: 'all' | 'specific' | 'none'
  /** Belirli tenant ID'leri */
  specific_tenant_ids?: string[]
  /** Hangi roller görecek */
  visible_to_roles: string[]
  /** Tenant özelleştirmesi gerekiyor mu (renk, logo vb.) */
  needs_tenant_customization: boolean
  /** Çalışma zamanlaması (rutin ise) */
  schedule?: { type: 'daily' | 'weekly' | 'monthly'; time?: string; day?: string }
  /** Teknik gereksinimler */
  tech_specs?: {
    responsive: boolean
    min_width?: string
    frameworks?: string[]
  }
}

// ─── Tenant Özelleştirme Bağlamı ─────────────────────────────
//
// Beşiktaş siyah-beyaz, Galatasaray sarı-kırmızı...
// Her tenant'ın kendi renkleri, logosu, ismi var.
// Üretim sırasında bunlar bilinmeli.

export interface TenantCustomization {
  tenant_id: string
  tenant_name: string
  /** Marka renkleri */
  brand_colors: {
    primary: string       // Ana renk (hex)
    secondary: string     // İkincil renk
    accent?: string       // Vurgu rengi
    background?: string
    text?: string
  }
  /** Logo URL */
  logo_url?: string
  /** Şehir / Konum */
  location?: string
  /** Branş (cimnastik, yüzme, atletizm vb.) */
  sport_branch?: string
  /** Özel tercihler */
  preferences?: Record<string, string>
}

// ─── Şirket Süzgeci (Anayasa) ────────────────────────────────
//
// Tüm işler bu süzgeçten geçer.
// Şirketin misyonu, vizyonu, değişmez kuralları.

export interface SirketSuzgeci {
  /** Kontrol geçti mi */
  passed: boolean
  /** Kontrol notları */
  notes: string[]
  /** İhlal edilen kurallar */
  violations: string[]
  /** Öneriler (ihlal yoksa bile iyileştirme) */
  suggestions: string[]
}

export const SIRKET_ANAYASASI = {
  misyon: 'Çocukların sportif gelişimini desteklemek, ailelere güvenilir spor ortamı sunmak',
  vizyon: 'Türkiye\'nin en yaygın ve güvenilir çocuk spor franchise ağı olmak',

  degismez_kurallar: [
    'Çocuk güvenliği her şeyin üstündedir',
    'Çocuk ham verisi ASLA açıklanmaz — sadece yorumlanmış öneri sunulur',
    'KVKK\'ya tam uyum zorunludur',
    'Patron onayı olmadan deploy/commit yapılmaz',
    'Yanıltıcı veya zararlı içerik üretilmez',
    'Uydurma firma/kişi/proje adı kullanılmaz — sadece YİSA-S bağlamı',
    'Tekrarlayan görev engellenir (Altın Kural #12)',
    'Claude HER direktörlükte denetçidir (Altın Kural #4)',
    'Fiyat değişikliği Patron onayı gerektirir',
    'Marka/logo değişikliği Patron onayı gerektirir',
  ],

  marka_standartlari: {
    isim: 'YİSA-S',
    slogan: 'Sporda Geleceğin Temeli',
    ana_renkler: { primary: '#1a56db', secondary: '#e5e7eb', accent: '#f59e0b' },
    font: 'Inter',
    logo_kullanimi: 'Logo her zaman orijinal oranlarda kullanılır, deforme edilmez',
    dil: 'Türkçe (UI ve içerikler)',
    ton: 'Profesyonel, samimi, güvenilir, çocuk dostu',
  },

  icerik_standartlari: [
    'Türkçe karakter doğru kullanılmalı (ı/i, ö/o, ü/u, ç/c, ş/s, ğ/g)',
    'Çocuklarla ilgili içerik hassas ve güvenli olmalı',
    'Reklam metinleri yanıltıcı olmamalı',
    'Tıbbi teşhis/tavsiye verilmemeli — sadece sportif yönlendirme',
    'Sosyal medya içeriği marka tonuna uygun olmalı',
  ],
}

// ─── Tam Yolculuk Haritası Sınıfı ───────────────────────────

export class KomutTakip {
  private job_id: string
  private ticket_no: string
  private command: string
  private steps: JourneyStep[] = []
  private monte: MonteNoktasi
  private tenant_context?: TenantCustomization
  private created_at: string

  constructor(params: {
    job_id: string
    ticket_no: string
    command: string
    monte?: Partial<MonteNoktasi>
    tenant_context?: TenantCustomization
  }) {
    this.job_id = params.job_id
    this.ticket_no = params.ticket_no
    this.command = params.command
    this.created_at = new Date().toISOString()
    this.tenant_context = params.tenant_context

    // Monte noktası varsayılanları
    this.monte = {
      goes_to_store: false,
      target_tenants: 'none',
      visible_to_roles: ['patron'],
      needs_tenant_customization: false,
      ...params.monte,
    }

    // Başlangıç adımlarını oluştur
    this.initializeSteps()
  }

  private initializeSteps() {
    this.steps = [
      { id: 'patron_komutu', order: 1, label: 'Patron komutu alındı', status: 'completed', started_at: this.created_at, completed_at: this.created_at },
      { id: 'guvenlik_kontrol', order: 2, label: 'Güvenlik kontrolü', status: 'pending' },
      { id: 'cio_analiz', order: 3, label: 'CIO analiz (öncelik, bütçe, çakışma)', status: 'pending' },
      { id: 'ceo_yonlendirme', order: 4, label: 'CEO yönlendirme', status: 'pending' },
      { id: 'direktorluk_uretim', order: 5, label: 'Direktörlük üretim', status: 'pending' },
      { id: 'direktorluk_denetim', order: 6, label: 'Direktörlük iç denetim (Claude)', status: 'pending' },
      { id: 'ceo_havuzu_gereksinim', order: 7, label: 'CEO havuzuna düştü (gereksinim)', status: 'pending' },
      { id: 'patron_uretim_secimi', order: 8, label: 'Patron üretim hattı seçimi', status: 'pending' },
      { id: 'celf_motor_gorevlendirme', order: 9, label: 'CELF Motor görevlendirme', status: 'pending' },
      // uretim_adim'lar dinamik olarak eklenecek (robot sayısına göre)
      { id: 'claude_son_denetim', order: 100, label: 'Claude son denetim', status: 'pending' },
      { id: 'ceo_havuzu_urun', order: 101, label: 'CEO havuzuna düştü (ürün)', status: 'pending' },
      { id: 'patron_son_karar', order: 102, label: 'Patron son kararı', status: 'pending' },
      { id: 'dagitim', order: 103, label: 'Dağıtım', status: 'pending' },
    ]
  }

  // ─── Adım Güncelleme ──────────────────────────────────────

  /** Adımı başlat */
  startStep(stepId: JourneyStepId, detail?: string, actor?: string) {
    const step = this.steps.find(s => s.id === stepId)
    if (step) {
      step.status = 'in_progress'
      step.started_at = new Date().toISOString()
      if (detail) step.detail = detail
      if (actor) step.actor = actor
    }
  }

  /** Adımı tamamla */
  completeStep(stepId: JourneyStepId, detail?: string, metadata?: Record<string, unknown>) {
    const step = this.steps.find(s => s.id === stepId)
    if (step) {
      step.status = 'completed'
      step.completed_at = new Date().toISOString()
      if (detail) step.detail = detail
      if (metadata) step.metadata = { ...step.metadata, ...metadata }
    }
  }

  /** Adım başarısız */
  failStep(stepId: JourneyStepId, detail: string) {
    const step = this.steps.find(s => s.id === stepId)
    if (step) {
      step.status = 'failed'
      step.completed_at = new Date().toISOString()
      step.detail = detail
    }
  }

  /** Üretim adımları ekle (robot pipeline belirlenince) */
  addProductionSteps(pipeline: string[]) {
    // Önceki üretim adımlarını temizle
    this.steps = this.steps.filter(s => s.id !== 'uretim_adim')

    // Her robot için adım ekle
    pipeline.forEach((robot, idx) => {
      this.steps.push({
        id: 'uretim_adim',
        order: 10 + idx,
        label: `Üretim: ${robot}`,
        detail: `Robot ${idx + 1}/${pipeline.length}`,
        actor: robot,
        status: 'pending',
      })
    })

    // Sırala
    this.steps.sort((a, b) => a.order - b.order)
  }

  // ─── Monte Noktası ────────────────────────────────────────

  /** Monte noktasını güncelle */
  updateMonte(monte: Partial<MonteNoktasi>) {
    this.monte = { ...this.monte, ...monte }
  }

  /** Monte noktasını otomatik tespit et */
  autoDetectMonte(command: string, directorKey: string) {
    const lower = command.toLowerCase()

    // Vitrine mi gidecek?
    if (/vitrin|mağaza|store|yayınla|satış/.test(lower)) {
      this.monte.goes_to_store = true
      if (/şablon|template/.test(lower)) this.monte.store_category = 'sablon'
      else if (/robot|bot/.test(lower)) this.monte.store_category = 'robot'
      else if (/paket/.test(lower)) this.monte.store_category = 'paket'
      else this.monte.store_category = 'icerik'
    }

    // Panel/sayfa → hedef yol tespit
    if (/panel|sayfa|dashboard|ekran/.test(lower)) {
      this.monte.target_path = this.guessTargetPath(lower)
      this.monte.target_tenants = 'all'
      this.monte.needs_tenant_customization = true
      this.monte.visible_to_roles = this.guessVisibleRoles(lower)
      this.monte.tech_specs = { responsive: true, frameworks: ['next.js', 'tailwind', 'radix-ui'] }
    }

    // Antrenman → tenant sporcuları
    if (/antrenman|sporcu|ölçüm/.test(lower)) {
      this.monte.target_tenants = 'all'
      this.monte.needs_tenant_customization = true // Branş, yaş grubu vb.
    }

    // Sosyal medya → rutin olabilir
    if (/sosyal medya|instagram|tiktok/.test(lower)) {
      this.monte.needs_tenant_customization = true // Her tenant kendi renkleri
    }
  }

  private guessTargetPath(lower: string): string {
    if (/personel|insan kaynakları|ik/.test(lower)) return '/dashboard/personel-yonetim'
    if (/sporcu|antrenman|ölçüm/.test(lower)) return '/dashboard/sporcu-takip'
    if (/muhasebe|finans|gelir|gider/.test(lower)) return '/dashboard/muhasebe'
    if (/iletişim|destek|bildirim/.test(lower)) return '/dashboard/iletisim'
    if (/satış|crm|müşteri/.test(lower)) return '/dashboard/satis'
    return '/dashboard'
  }

  private guessVisibleRoles(lower: string): string[] {
    const roles: string[] = ['patron']

    if (/çalışan|personel|sicil/.test(lower)) roles.push('calisan')
    if (/müdür|yönetici|tesis/.test(lower)) roles.push('tesis_muduru')
    if (/antrenör|eğitmen/.test(lower)) roles.push('antrenor')
    if (/veli|aile/.test(lower)) roles.push('veli')

    // Tesis sahibi her zaman görür
    if (!roles.includes('tesis_muduru')) roles.push('tesis_muduru')

    return roles
  }

  // ─── Şirket Süzgeci ───────────────────────────────────────

  /** İşi şirket anayasasından geçir */
  runSirketSuzgeci(output: string): SirketSuzgeci {
    const notes: string[] = []
    const violations: string[] = []
    const suggestions: string[] = []
    const lower = output.toLowerCase()

    // Çocuk güvenliği
    if (/tc kimlik|doğum tarihi|adres|telefon.*çocuk|çocuk.*telefon/.test(lower)) {
      violations.push('Çocuk kişisel verisi açıklanmış olabilir — KVKK ihlali riski')
    }

    // Uydurma firma/kişi kontrolü
    const fakePatterns = /abc şirketi|xyz firması|örnek firma|test şirketi|john doe|jane doe/i
    if (fakePatterns.test(output)) {
      violations.push('Uydurma firma/kişi adı tespit edildi — YİSA-S bağlamı dışı')
    }

    // Tıbbi teşhis
    if (/teşhis|tanı koyuyoruz|hastalık|reçete/.test(lower)) {
      violations.push('Tıbbi teşhis/tavsiye içeriyor — sadece sportif yönlendirme yapılmalı')
    }

    // Yanıltıcı reklam
    if (/garanti|kesinlikle|mutlaka başarılı|%100/.test(lower)) {
      suggestions.push('Yanıltıcı olabilecek ifadeler var — "garanti", "%100" gibi kesin ifadelerden kaçınılmalı')
    }

    // Türkçe karakter kontrolü (basit)
    if (/\bbasari\b|\bgorev\b|\bmusteri\b|\bogrenci\b/.test(lower)) {
      suggestions.push('Türkçe karakter eksikliği olabilir (başarı→basari, müşteri→musteri)')
    }

    // Marka kontrolü
    if (/yisa-s/i.test(output) && !/YİSA-S/.test(output)) {
      suggestions.push('Marka adı "YİSA-S" olarak yazılmalı (büyük harf, tire ile)')
    }

    // Tenant özelleştirme hatırlatması
    if (this.monte.needs_tenant_customization && this.tenant_context) {
      notes.push(`Tenant renkleri uygulanmalı: ${this.tenant_context.brand_colors.primary} / ${this.tenant_context.brand_colors.secondary}`)
      if (this.tenant_context.sport_branch) {
        notes.push(`Branş: ${this.tenant_context.sport_branch} — içerik buna uygun olmalı`)
      }
    }

    if (violations.length === 0) {
      notes.push('Şirket anayasası kontrolünden geçti ✓')
    }

    return {
      passed: violations.length === 0,
      notes,
      violations,
      suggestions,
    }
  }

  // ─── Çıktı — Tam Harita ───────────────────────────────────

  /** Tam yolculuk haritasını JSON olarak döndür */
  toJSON(): KomutTakipSnapshot {
    const completedSteps = this.steps.filter(s => s.status === 'completed').length
    const totalSteps = this.steps.length
    const currentStep = this.steps.find(s => s.status === 'in_progress')
      ?? this.steps.find(s => s.status === 'pending')

    return {
      job_id: this.job_id,
      ticket_no: this.ticket_no,
      command: this.command,
      created_at: this.created_at,

      // İlerleme
      progress: {
        completed: completedSteps,
        total: totalSteps,
        percentage: Math.round((completedSteps / totalSteps) * 100),
        current_step: currentStep?.label ?? 'Tamamlandı',
        current_step_id: currentStep?.id,
      },

      // Adımlar
      steps: this.steps,

      // Monte noktası
      monte: this.monte,

      // Tenant bağlamı
      tenant_context: this.tenant_context,
    }
  }

  /** Özet metin (log/debug) */
  toSummary(): string {
    const snap = this.toJSON()
    const lines = [
      `═══ KOMUT TAKİP: ${snap.ticket_no} ═══`,
      `Komut: ${snap.command.slice(0, 80)}`,
      `İlerleme: %${snap.progress.percentage} (${snap.progress.completed}/${snap.progress.total})`,
      `Şu an: ${snap.progress.current_step}`,
      '',
    ]

    for (const step of snap.steps) {
      const icon = step.status === 'completed' ? '●'
        : step.status === 'in_progress' ? '◐'
        : step.status === 'failed' ? '✗'
        : '○'
      const time = step.completed_at
        ? new Date(step.completed_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
        : step.started_at
          ? new Date(step.started_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
          : ''
      const detail = step.detail ? ` — ${step.detail}` : ''
      lines.push(`${icon} ${step.label}${detail} ${time}`)
    }

    if (snap.monte.target_path) {
      lines.push('')
      lines.push(`MONTE NOKTASI: ${snap.monte.target_path}`)
    }
    if (snap.monte.goes_to_store) {
      lines.push(`VİTRİN: ${snap.monte.store_category ?? 'genel'}`)
    }
    if (snap.monte.needs_tenant_customization) {
      lines.push(`TENANT ÖZELLEŞTİRME: Gerekiyor`)
    }

    return lines.join('\n')
  }
}

// ─── Snapshot Tipi (DB'ye kaydedilecek) ──────────────────────

export interface KomutTakipSnapshot {
  job_id: string
  ticket_no: string
  command: string
  created_at: string

  progress: {
    completed: number
    total: number
    percentage: number
    current_step: string
    current_step_id?: JourneyStepId
  }

  steps: JourneyStep[]
  monte: MonteNoktasi
  tenant_context?: TenantCustomization
}

// ─── Yardımcı: Takip oluştur ────────────────────────────────

/**
 * Yeni bir komut takip haritası oluşturur.
 * İş oluşturulduğu anda çağrılır.
 */
export function createKomutTakip(params: {
  job_id: string
  ticket_no: string
  command: string
  director_key?: string
  tenant_context?: TenantCustomization
}): KomutTakip {
  const takip = new KomutTakip({
    job_id: params.job_id,
    ticket_no: params.ticket_no,
    command: params.command,
    tenant_context: params.tenant_context,
  })

  // Monte noktasını otomatik tespit et
  if (params.director_key) {
    takip.autoDetectMonte(params.command, params.director_key)
  }

  return takip
}
