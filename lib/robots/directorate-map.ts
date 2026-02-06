/**
 * ═══════════════════════════════════════════════════════════════════
 * YİSA-S CELF DİREKTÖRLÜK İÇ YAPI HARİTASI — V3.0
 * ═══════════════════════════════════════════════════════════════════
 *
 * Her direktörlüğün İÇ yapısı, AI rolleri, komut yönlendirme ve
 * iç denetim döngüsünün tam haritası.
 *
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║  KRİTİK KURAL: Claude denetimi İÇERİDE olur.                ║
 * ║  Üretici üretir → Claude içeride denetler → sorun varsa     ║
 * ║  içeride düzelttirir → TEMİZ İŞ dışarı çıkar.               ║
 * ║  Dışarıya (CEO havuzuna) sadece kaliteli iş gönderilir.     ║
 * ╚═══════════════════════════════════════════════════════════════╝
 *
 * Tarih: 6 Şubat 2026
 */

// ─── 1. DİREKTÖRLÜK İÇ YAPI TANIMI ─────────────────────────

export interface DirectorateInternalStructure {
  /** Direktörlük kodu */
  key: string
  /** Türkçe ad */
  name: string

  /** ÜRETİCİ AI — işi ilk yapan */
  producer: {
    ai: string                     // GPT, CLAUDE, GEMINI, TOGETHER, V0, CURSOR
    role: string                   // Ne yapar
    system_prompt: string          // Üretici prompt'u
  }

  /** DENETÇİ — her zaman Claude (Altın Kural #4) */
  reviewer: {
    ai: 'CLAUDE'
    role: string                   // Nasıl denetler
    review_criteria: string[]      // Denetim kriterleri
    max_fix_rounds: number         // Kaç kez düzeltme yapabilir (sonsuz döngü önlemi)
  }

  /** GİRİŞ: Ne tür komutlar bu direktörlüğe girer */
  input: {
    trigger_keywords: string[]     // CEO yönlendirmesi için anahtar kelimeler
    accepted_job_types: string[]   // Kabul ettiği iş türleri
    example_commands: string[]     // Örnek komutlar (patron böyle yazar)
  }

  /** ÇIKIŞ: Direktörlükten ne çıkar */
  output: {
    produces: string[]             // Ne üretir
    output_format: string          // text, image, code, template, report, robot_config
    goes_to: string                // Nereye gider: 'ceo_pool' | 'store' | 'tenant'
  }

  /** SINIRLAR */
  boundaries: string[]             // Yapamayacağı şeyler
  /** Patron onayı gereken işlemler */
  needs_patron_approval: string[]
}

// ─── 2. 12 DİREKTÖRLÜĞÜN TAM HARİTASI ─────────────────────

export const DIRECTORATE_MAP: DirectorateInternalStructure[] = [
  {
    key: 'CFO',
    name: 'Finans Direktörlüğü',
    producer: {
      ai: 'GPT',
      role: 'Bütçe hesaplama, maliyet analizi, gelir-gider raporu, ödeme planı oluşturma',
      system_prompt: `Sen YİSA-S Finans Direktörüsün. SADECE muhasebe, bütçe, kasa, token ekonomisi, maliyet analizi ve ödeme takibi konularında çalışırsın.
Görevin: Patron veya sistem senden finansal bir iş istediğinde, net ve doğru finansal çıktı üret.
SINIRLAR: Fiyat değişikliği yapma (patron onayı gerekir). Ödeme silme/iptal etme yasak. Başka alanla ilgili yorum yapma.
FORMAT: Türkçe, tablo formatında, net rakamlarla yanıt ver.`,
    },
    reviewer: {
      ai: 'CLAUDE',
      role: 'Finansal doğruluk kontrolü, hesaplama denetimi, kural uyumu',
      review_criteria: [
        'Rakamlar doğru hesaplanmış mı?',
        'Sadece finans alanında mı kalınmış?',
        'Fiyat değişikliği gibi onay gerektiren işlem var mı?',
        'Gizli veri (maaş, kasa detayı) açıklanmış mı?',
      ],
      max_fix_rounds: 2,
    },
    input: {
      trigger_keywords: ['finans', 'bütçe', 'gelir', 'gider', 'tahsilat', 'maliyet', 'kasa', 'ödeme', 'fatura'],
      accepted_job_types: ['rapor', 'belge', 'general'],
      example_commands: [
        'Bu ayın gelir-gider raporunu çıkar',
        'Franchise token maliyetini hesapla',
        'Sabit ödemelerin listesini güncelle',
      ],
    },
    output: {
      produces: ['Maliyet raporu', 'Bütçe planı', 'Gelir-gider tablosu', 'Ödeme takvimi'],
      output_format: 'report',
      goes_to: 'ceo_pool',
    },
    boundaries: ['Fiyat değişikliği yapamaz', 'Ödeme silemez', 'Başka alanla ilgili yorum yapamaz'],
    needs_patron_approval: ['fiyat_degisikligi', 'odeme_iptali', 'butce_revizyon'],
  },

  {
    key: 'CTO',
    name: 'Teknoloji Direktörlüğü',
    producer: {
      ai: 'CURSOR',
      role: 'Kod yazma, API geliştirme, sistem mimarisi, hata düzeltme',
      system_prompt: `Sen YİSA-S Teknoloji Direktörüsün. SADECE yazılım geliştirme, API, sistem mimarisi ve deployment konularında çalışırsın.
Görevin: Kod üret, teknik çözüm sun, hata düzelt.
SINIRLAR: Deploy ve commit patron onayı ile. .env dosyasına erişme. Başka alanla ilgili yorum yapma.
FORMAT: Kod blokları ile temiz, açıklamalı TypeScript/JavaScript çıktı ver.`,
    },
    reviewer: {
      ai: 'CLAUDE',
      role: 'Kod kalitesi, güvenlik açığı, mimari uyum kontrolü',
      review_criteria: [
        'Kod çalışır durumda mı?',
        'Güvenlik açığı var mı (SQL injection, XSS vb.)?',
        '.env veya API key açıklanmış mı?',
        'Mevcut mimariyle uyumlu mu?',
        'Deploy/commit tetikleniyor mu (yasak)?',
      ],
      max_fix_rounds: 3,
    },
    input: {
      trigger_keywords: ['teknoloji', 'sistem', 'kod', 'api', 'performans', 'hata', 'bug', 'yazılım'],
      accepted_job_types: ['general', 'sablon', 'robot'],
      example_commands: [
        'Yeni API endpoint yaz: /api/athletes/report',
        'Dashboard performansını iyileştir',
        'Login sayfasındaki hatayı düzelt',
      ],
    },
    output: {
      produces: ['Kod', 'API endpoint', 'Teknik çözüm', 'Mimari doküman'],
      output_format: 'code',
      goes_to: 'ceo_pool',
    },
    boundaries: ['Deploy yapamaz', 'Commit yapamaz', '.env erişemez', 'Başka alanla ilgili yorum yapamaz'],
    needs_patron_approval: ['deploy', 'database_migration', 'commit'],
  },

  {
    key: 'CMO',
    name: 'Pazarlama Direktörlüğü',
    producer: {
      ai: 'GPT',
      role: 'Reklam metni, kampanya planı, sosyal medya stratejisi, içerik üretme',
      system_prompt: `Sen YİSA-S Pazarlama Direktörüsün. SADECE reklam, kampanya, sosyal medya stratejisi ve marka konularında çalışırsın.
Görevin: Yaratıcı, etkili pazarlama içeriği üret. Instagram/Facebook/TikTok paylaşım planı hazırla.
SINIRLAR: Marka değişikliği patron onayı ile. Bütçe kararı verme. Başka alanla ilgili yorum yapma.
FORMAT: Türkçe, yaratıcı, kısa ve etkili metinler.`,
    },
    reviewer: {
      ai: 'CLAUDE',
      role: 'İçerik kalitesi, marka uyumu, hukuki uygunluk',
      review_criteria: [
        'İçerik markaya uygun mu?',
        'Yanıltıcı bilgi var mı?',
        'Çocuklarla ilgili hassas içerik var mı?',
        'Sadece pazarlama alanında mı?',
      ],
      max_fix_rounds: 2,
    },
    input: {
      trigger_keywords: ['kampanya', 'reklam', 'sosyal medya', 'tanıtım', 'pazarlama', 'instagram', 'tiktok'],
      accepted_job_types: ['kampanya', 'tasarim', 'general'],
      example_commands: [
        'Yaz kampı için Instagram kampanyası hazırla',
        'Franchise tanıtım broşürü metni yaz',
        'Yeni şube açılışı sosyal medya planı',
      ],
    },
    output: {
      produces: ['Kampanya planı', 'Sosyal medya içeriği', 'Reklam metni', 'Tanıtım dokümanı'],
      output_format: 'text',
      goes_to: 'ceo_pool',
    },
    boundaries: ['Marka değişikliği yapamaz', 'Bütçe kararı veremez', 'Yayınlama yapamaz'],
    needs_patron_approval: ['brand_change', 'buyuk_butce_kampanya'],
  },

  {
    key: 'CHRO',
    name: 'İnsan Kaynakları Direktörlüğü',
    producer: {
      ai: 'GPT',
      role: 'Personel yönetimi, iş ilanı, performans değerlendirme, eğitim planı',
      system_prompt: `Sen YİSA-S İK Direktörüsün. SADECE personel yönetimi, işe alım, performans değerlendirme ve eğitim konularında çalışırsın.
SINIRLAR: Maaş bilgisi gizli — gösterme. İşten çıkarma kararı verme. Başka alanla ilgili yorum yapma.`,
    },
    reviewer: {
      ai: 'CLAUDE',
      role: 'Gizlilik kontrolü, hukuki uyum, kişisel veri koruması',
      review_criteria: ['Maaş bilgisi açıklanmış mı?', 'İşten çıkarma kararı verilmiş mi?', 'KVKK uyumlu mu?'],
      max_fix_rounds: 2,
    },
    input: {
      trigger_keywords: ['personel', 'eğitim', 'insan kaynakları', 'izin', 'performans', 'işe alım'],
      accepted_job_types: ['belge', 'rapor', 'general'],
      example_commands: ['Antrenör iş ilanı hazırla', 'Personel performans raporu çıkar'],
    },
    output: { produces: ['İş ilanı', 'Performans raporu', 'Eğitim planı'], output_format: 'text', goes_to: 'ceo_pool' },
    boundaries: ['Maaş bilgisi gösteremez', 'İşten çıkarma kararı veremez'],
    needs_patron_approval: ['role_change', 'dismissal'],
  },

  {
    key: 'CLO',
    name: 'Hukuk Direktörlüğü',
    producer: {
      ai: 'CLAUDE',
      role: 'Sözleşme taslağı, KVKK uyumu, franchise anlaşması, yasal metinler',
      system_prompt: `Sen YİSA-S Hukuk Direktörüsün. SADECE KVKK, sözleşmeler, franchise anlaşmaları ve yasal uyumluluk konularında çalışırsın.
ÖNEMLİ: Riskli işlemlerde veto hakkın var. Veri silme, sözleşme değişikliği gibi işlemleri patron onayı olmadan geçirme.`,
    },
    reviewer: {
      ai: 'CLAUDE',
      role: 'Hukuki doğruluk, KVKK uyumu, risk değerlendirmesi',
      review_criteria: ['Hukuki olarak doğru mu?', 'KVKK uyumlu mu?', 'Risk içeriyor mu?'],
      max_fix_rounds: 2,
    },
    input: {
      trigger_keywords: ['sözleşme', 'hukuk', 'kvkk', 'patent', 'uyum', 'anlaşma'],
      accepted_job_types: ['belge', 'general'],
      example_commands: ['Franchise sözleşme taslağı hazırla', 'KVKK uyum raporu çıkar'],
    },
    output: { produces: ['Sözleşme taslağı', 'Uyum raporu', 'Yasal metin'], output_format: 'text', goes_to: 'ceo_pool' },
    boundaries: ['Sözleşme imzalayamaz', 'Veri silemez', 'Veto hakkı var'],
    needs_patron_approval: ['sozlesme_degisikligi', 'veri_silme'],
  },

  {
    key: 'CSO',
    name: 'Strateji Direktörlüğü',
    producer: {
      ai: 'CLAUDE',
      role: 'İş stratejisi, büyüme planı, pazar analizi, rekabet değerlendirmesi',
      system_prompt: `Sen YİSA-S Strateji Direktörüsün. SADECE iş stratejisi, büyüme planı, pazar analizi ve rekabet konularında çalışırsın.`,
    },
    reviewer: {
      ai: 'CLAUDE',
      role: 'Strateji tutarlılığı, veri doğruluğu',
      review_criteria: ['Strateji mevcut hedeflerle uyumlu mu?', 'Veriler doğru mu?'],
      max_fix_rounds: 2,
    },
    input: {
      trigger_keywords: ['strateji', 'plan', 'hedef', 'büyüme', 'vizyon', 'pazar'],
      accepted_job_types: ['rapor', 'general'],
      example_commands: ['2026 büyüme planı hazırla', 'Rakip analizi yap'],
    },
    output: { produces: ['Strateji planı', 'Pazar analizi', 'Büyüme raporu'], output_format: 'report', goes_to: 'ceo_pool' },
    boundaries: ['Bütçe kararı veremez', 'Fiyat belirleyemez'],
    needs_patron_approval: ['strateji_degisikligi'],
  },

  {
    key: 'CDO',
    name: 'Tasarım Direktörlüğü',
    producer: {
      ai: 'V0',
      role: 'UI/UX tasarımı, logo, grafik, şablon, web sayfası tasarımı',
      system_prompt: `Sen YİSA-S Tasarım Direktörüsün. SADECE UI/UX, görsel içerik, logo, video, grafik ve şablon tasarımı konularında çalışırsın.
V0 ile UI bileşeni ve tasarım üret. Cursor ile kodu düzenle.`,
    },
    reviewer: {
      ai: 'CLAUDE',
      role: 'Tasarım kalitesi, marka uyumu, erişilebilirlik',
      review_criteria: ['Tasarım markaya uygun mu?', 'Erişilebilir mi?', 'Kaliteli mi?'],
      max_fix_rounds: 3,
    },
    input: {
      trigger_keywords: ['tasarım', 'tasarla', 'logo', 'ui', 'ux', 'grafik', 'şablon', 'sayfa'],
      accepted_job_types: ['logo', 'tasarim', 'sablon', 'video'],
      example_commands: ['Franchise için logo tasarla', 'Dashboard ana sayfa yeniden tasarla'],
    },
    output: { produces: ['Logo', 'UI tasarımı', 'Şablon', 'Grafik'], output_format: 'template', goes_to: 'ceo_pool' },
    boundaries: ['Marka değişikliği patron onaylı', 'Yayınlama yapamaz'],
    needs_patron_approval: ['brand_change', 'template_delete'],
  },

  {
    key: 'CISO',
    name: 'Bilgi Güvenliği Direktörlüğü',
    producer: {
      ai: 'CLAUDE',
      role: 'Güvenlik politikası, erişim kontrolü, şifreleme, denetim raporu',
      system_prompt: `Sen YİSA-S Bilgi Güvenliği Direktörüsün. SADECE siber güvenlik, erişim kontrol, şifreleme ve denetim konularında çalışırsın.`,
    },
    reviewer: {
      ai: 'CLAUDE',
      role: 'Güvenlik standartları uyumu, risk değerlendirmesi',
      review_criteria: ['Güvenlik standartlarına uygun mu?', 'Yeni risk oluşturuyor mu?'],
      max_fix_rounds: 2,
    },
    input: {
      trigger_keywords: ['güvenlik', 'audit', 'erişim', 'şifre', 'saldırı', 'koruma'],
      accepted_job_types: ['rapor', 'general'],
      example_commands: ['Güvenlik denetim raporu hazırla', 'Erişim politikası oluştur'],
    },
    output: { produces: ['Güvenlik raporu', 'Erişim politikası', 'Denetim raporu'], output_format: 'report', goes_to: 'ceo_pool' },
    boundaries: ['Erişim yetkisi veremez', 'Şifre sıfırlayamaz'],
    needs_patron_approval: ['access_grant', 'password_reset'],
  },

  {
    key: 'CCO',
    name: 'İletişim Direktörlüğü',
    producer: {
      ai: 'GEMINI',
      role: 'Müşteri mesajı, bildirim, veli iletişimi, destek yanıtı',
      system_prompt: `Sen YİSA-S İletişim Direktörüsün. SADECE müşteri iletişimi, WhatsApp, e-posta, bildirimler ve destek konularında çalışırsın.
FORMAT: Samimi, profesyonel, Türkçe.`,
    },
    reviewer: {
      ai: 'CLAUDE',
      role: 'İletişim kalitesi, kişisel veri koruması, ton kontrolü',
      review_criteria: ['Kişisel veri paylaşılmış mı?', 'Ton uygun mu?', 'Doğru bilgi mi?'],
      max_fix_rounds: 2,
    },
    input: {
      trigger_keywords: ['destek', 'şikayet', 'memnuniyet', 'ticket', 'mesaj', 'bildirim', 'whatsapp'],
      accepted_job_types: ['general'],
      example_commands: ['Velilere ders programı değişikliği bildirimi yaz', 'Şikayete yanıt hazırla'],
    },
    output: { produces: ['Mesaj taslağı', 'Bildirim', 'Destek yanıtı'], output_format: 'text', goes_to: 'ceo_pool' },
    boundaries: ['Mesaj gönderemez (sadece taslak)', 'Kişisel veri paylaşamaz'],
    needs_patron_approval: ['refund', 'complaint_close'],
  },

  {
    key: 'CPO',
    name: 'Ürün Direktörlüğü',
    producer: {
      ai: 'GPT',
      role: 'Ürün geliştirme, şablon oluşturma, paket tasarımı, yeni özellik tanımlama',
      system_prompt: `Sen YİSA-S Ürün Direktörüsün. SADECE ürün geliştirme, şablon oluşturma, paket tasarımı ve yeni özellik konularında çalışırsın.`,
    },
    reviewer: {
      ai: 'CLAUDE',
      role: 'Ürün kalitesi, kullanıcı deneyimi, teknik uygulanabilirlik',
      review_criteria: ['Ürün kullanıcı ihtiyacını karşılıyor mu?', 'Teknik olarak uygulanabilir mi?'],
      max_fix_rounds: 2,
    },
    input: {
      trigger_keywords: ['ürün', 'özellik', 'paket', 'modül'],
      accepted_job_types: ['sablon', 'robot', 'general'],
      example_commands: ['Premium paket içeriği hazırla', 'Yeni modül tanımla: sporcu takip'],
    },
    output: { produces: ['Paket tanımı', 'Özellik dokümanı', 'Şablon'], output_format: 'text', goes_to: 'ceo_pool' },
    boundaries: ['Şablon silemez', 'Fiyat belirleyemez'],
    needs_patron_approval: ['template_delete', 'brand_change'],
  },

  {
    key: 'CIO',
    name: 'Bilgi İşlem Direktörlüğü',
    producer: {
      ai: 'TOGETHER',
      role: 'Veri analizi, raporlama, dashboard tasarımı, istatistik',
      system_prompt: `Sen YİSA-S Bilgi İşlem Direktörüsün. SADECE veri analizi, raporlama, dashboard, istatistik ve AI model yönetimi konularında çalışırsın.`,
    },
    reviewer: {
      ai: 'CLAUDE',
      role: 'Veri doğruluğu, analiz kalitesi',
      review_criteria: ['Veriler doğru mu?', 'Analiz mantıklı mı?', 'Kişisel veri açıklanmış mı?'],
      max_fix_rounds: 2,
    },
    input: {
      trigger_keywords: ['veri', 'database', 'entegrasyon', 'tablo', 'istatistik', 'analiz'],
      accepted_job_types: ['rapor', 'general'],
      example_commands: ['Bu haftanın sporcu istatistiğini çıkar', 'Franchise karşılaştırma raporu'],
    },
    output: { produces: ['Veri analizi', 'İstatistik raporu', 'Dashboard verisi'], output_format: 'report', goes_to: 'ceo_pool' },
    boundaries: ['Veri silemez', 'Tablo yapısını değiştiremez'],
    needs_patron_approval: ['table_alter', 'bulk_delete', 'data_export'],
  },

  {
    key: 'SPORTIF',
    name: 'Sportif Direktörlük',
    producer: {
      ai: 'CLAUDE',
      role: 'Antrenman programı, çocuk gelişim takibi, ölçüm, branş yönlendirme',
      system_prompt: `Sen YİSA-S Sportif Direktörüsün. 15 uzman bilgi tabanına sahipsin (pedagog, fizyolog, psikolog, çocuk doktoru, ortopedist, fizyoterapist, anatomi uzmanı, kinesiyoloji, spor sakatlıkları, kondisyoner, antrenman bilimci, akademisyen, atletizm antrenörü, jimnastik uzmanı, yüzme antrenörü).
SADECE antrenman programları, çocuk gelişim takibi, ölçüm, branş yönlendirme konularında çalışırsın.
KRİTİK: Çocuk ham verisi AÇIKLAMA — sadece yorumlanmış öneri sun. Ortopedik risk tespit edersen Sportif Direktöre bildir.`,
    },
    reviewer: {
      ai: 'CLAUDE',
      role: 'Çocuk güvenliği, bilimsel doğruluk, KVKK uyumu',
      review_criteria: [
        'Çocuk ham verisi açıklanmış mı (YASAK)?',
        'Antrenman programı yaşa uygun mu?',
        'Ortopedik risk var mı (uyarı gerekir mi)?',
        'Bilimsel olarak doğru mu?',
      ],
      max_fix_rounds: 3,
    },
    input: {
      trigger_keywords: ['antrenman', 'sporcu', 'program', 'ölçüm', 'branş', 'hareket', 'spor', 'cimnastik', 'çocuk'],
      accepted_job_types: ['antrenman', 'rapor', 'general'],
      example_commands: [
        '7 yaş grubu için haftalık antrenman programı hazırla',
        'Sporcu ölçüm raporu çıkar',
        'Çocuğun branş yönlendirme analizi yap',
      ],
    },
    output: {
      produces: ['Antrenman programı', 'Ölçüm raporu', 'Branş yönlendirme', 'Gelişim raporu', 'Erken uyarı'],
      output_format: 'text',
      goes_to: 'ceo_pool',
    },
    boundaries: ['Çocuk ham verisi açıklayamaz', 'Tıbbi teşhis koyamaz', 'Sadece yorumlanmış öneri'],
    needs_patron_approval: ['seviye_atlama', 'yarismaci_secim'],
  },
]

// ─── 3. KOMUT YÖNLENDİRME STRATEJİSİ ──────────────────────
//
//  Patron bir komut yazıyor. Bu komut nereye gidecek?
//
//  ┌──────────────┐
//  │  PATRON      │  "Yaz kampı için antrenman programı hazırla"
//  │  (komut)     │
//  └──────┬───────┘
//         │
//         ▼
//  ┌──────────────┐
//  │  CEO ROBOT   │  Kural tabanlı yönlendirici (AI yok, if/else)
//  │  (yönlendir) │  "antrenman" kelimesi → SPORTIF direktörlüğe gönder
//  └──────┬───────┘
//         │
//         ▼
//  ┌──────────────────────────────────────────────────────┐
//  │  DİREKTÖRLÜK İÇ DÖNGÜ (örnek: SPORTİF)             │
//  │                                                       │
//  │  ┌──────────┐    ┌──────────┐    ┌──────────┐        │
//  │  │ ÜRETİCİ  │───▸│ DENETÇİ  │───▸│ TEMİZ    │        │
//  │  │ (Claude)  │    │ (Claude)  │    │ ÇIKTI    │        │
//  │  │ program   │    │ kontrol   │    │          │        │
//  │  │ üretir    │    │ eder      │    │          │        │
//  │  └──────────┘    └────┬─────┘    └──────────┘        │
//  │                       │                               │
//  │                  Sorun varsa:                          │
//  │                  düzeltme notu ile                     │
//  │                  ÜRETİCİ'ye geri                      │
//  │                  (max 2-3 tur)                         │
//  │                                                       │
//  └──────────────────────┬───────────────────────────────┘
//                         │
//                         ▼ TEMİZ İŞ
//  ┌──────────────┐
//  │  CEO HAVUZU  │  "10'a Çıkart" — Patron incelemesi
//  │  (bekle)     │
//  └──────┬───────┘
//         │
//         ▼
//  ┌──────────────┐
//  │  PATRON      │  Onayla → Mağaza/Deploy
//  │  (karar)     │  Reddet → Arşiv
//  │              │  Düzelt → CELF'e geri (yeni iş üretimi)
//  └──────────────┘
//
// ─── 4. İÇ DÖNGÜ DETAYI ────────────────────────────────────
//
//  Direktörlük içinde olan şey:
//
//  ADIM 1: Üretici AI çalışır
//    - Direktörlüğün system prompt'u ile sınırlandırılmış
//    - Sadece kendi alanında üretir
//
//  ADIM 2: Claude (denetçi) çıktıyı kontrol eder
//    - review_criteria'ya göre denetler
//    - "GEÇTİ" → İş temiz, dışarı çıkar
//    - "KALDI" → Düzeltme notu üretir
//
//  ADIM 3: (eğer kaldıysa) Üretici AI tekrar çalışır
//    - Claude'un düzeltme notunu görerek yeniden üretir
//    - Bu döngü max_fix_rounds kadar tekrarlanabilir
//    - Hâlâ geçemediyse → uyarı ile CEO havuzuna gönderilir
//
//  ADIM 4: Temiz çıktı CEO havuzuna gider
//
// ─── 5. SOLO / TAKIM / TAM KADRO MODLARI ───────────────────
//
//  SOLO: Tek direktörlük kendi işini yapar (varsayılan)
//    Örn: "Logo tasarla" → sadece CDO çalışır
//
//  TAKIM (2-5): Proje Masası açılır, ilgili direktörlükler çağrılır
//    Örn: "Yeni franchise paketi hazırla"
//      → CPO (ürün tanımı) + CDO (tasarım) + CFO (fiyatlama) + CMO (pazarlama metni)
//      → Her biri kendi parçasını üretir
//      → Claude hepsini denetler
//      → Parçalar birleştirilir
//      → Birleşik iş CEO havuzuna gider
//
//  TAM KADRO: Büyük sistem güncelleme
//    Tüm 12 direktörlük eş zamanlı çalışır
//

export function getDirectorateMap(key: string): DirectorateInternalStructure | undefined {
  return DIRECTORATE_MAP.find((d) => d.key === key)
}

export function getAllDirectorateMaps(): DirectorateInternalStructure[] {
  return DIRECTORATE_MAP
}
