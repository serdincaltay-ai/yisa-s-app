# YİSA-S — v0.dev KAPSAMLI YOL HARİTASI (REVİZE v2)

**Tarih:** 9 Şubat 2026  
**Revizyon Notu:** Geri bildirimler doğrultusunda düzeltmeler yapıldı  
**Strateji:** Önce v0'a sistemin tamamını anlat → kilitle → sonra adım adım görev ver

---

## REVİZYON TABLOSU — Neler Düzeltildi?

| Alan | Eski (Hatalı) | Yeni (Doğru) | Açıklama |
|------|---------------|--------------|----------|
| sim_updates.status | "bekliyor" | "beklemede" | Mevcut tabloda "beklemede" ve "islendi" kullanılıyor |
| sim_updates payload | Ayrı `payload` kolonu | `command` alanına JSON string | Tabloda payload kolonu yok |
| API parametre | Karışık kullanım | `target_direktorluk` (tablo kolon adı) | API'de target_directorate → tablo kolonu target_direktorluk |
| tenants tablosu | Faz 2'de oluştur | Faz 1 sonunda migration ekle | 001_create_tables.sql'de tenants yok, önceden hazırlanmalı |
| students/staff/payments | Var kabul edilmiş | Nerede tanımlı netleştirilmeli | yisa-s-v0'da değil, yisa-s-app'te olabilir; migration gerekli |
| CORS | Eksikti | POST + OPTIONS handler eklendi | yisa-s.com → app.yisa-s.com cross-origin |
| Franchise paneli konumu | Belirsiz | yisa-s-v0 monorepo (patron + franchise aynı repo) | Ayrı repo yerine tek proje |
| Slug benzersizliği | Belirtilmemişti | Unique constraint + kontrol | Duplicate slug önleme |
| Rollback | Eksikti | Compensating adımlar tanımlandı | Onay sırasında hata olursa geri alma |
| TypeScript tipleri | Yoktu | lib/types/ altında shared types | Tutarlılık için |

---

# BÖLÜM 1: v0'A İLK VERİLECEK BAĞLAM KOMUTU

> **Amaç:** Bu komut v0.dev'e yapıştırılarak AI'ın tüm sistemi anlaması sağlanır. Bundan sonra verilen her görev bu bağlam üzerinden yapılır.

```
# YİSA-S SİSTEM BAĞLAMI — v0.dev İÇİN KİLİTLENMİŞ REFERANS

Sen YİSA-S spor okulu yönetim sistemi için full-stack geliştirici asistanısın. Bu bağlamı oku, anla ve bundan sonra vereceğim her görevi bu yapıya uygun şekilde yap.

---

## 1. PROJENİN AMACI

YİSA-S, Serdinç Altay (Tuzla Cimnastik Spor Okulu sahibi) tarafından kurulan, spor tesislerinin kurumsal standartlarda yönetilmesini sağlayan, yapay zeka destekli merkezi platform ve franchise sistemidir.

Slogan: "Teknolojiyi Spora Başlattık"
Misyon: Türkiye'nin spor okulu yönetiminde ilk AI destekli otomasyon sistemi.
İş Modeli: Franchise'lara 3.000$ + token ile sistem satışı.

---

## 2. KİLİTLENMİŞ MİMARİ (Bunları Değiştirme)

### 4 Robot Sistemi (Başka robot yok, CIO/CEO/COO yok)
| # | Robot | Görev |
|---|-------|-------|
| 1 | YİSA-S CELF | Ana motor. 12 direktörlük (Hukuk, Muhasebe, Teknik, Tasarım, Pazarlama, İK, AR-GE, Güvenlik, Veri, Operasyon, Müşteri, Strateji). Beyin Takımı: Claude, GPT, Gemini, Together. Tasarım: v0, Cursor, Fal AI. |
| 2 | Veri Robotu | Şablon kütüphanesi, çocuk gelişim referansları, CELF çıktılarını güncel tutma |
| 3 | Güvenlik Robotu | RLS, tenant_id izolasyonu, audit log, 3 Duvar sistemi |
| 4 | YİSA-S Robotu | yisa-s.com vitrin, ManyChat karşılama, demo talebi yönlendirme |

İş akışı: Patron onay → CELF tetiklenir → 12 direktörlük çalışır

### Domain Yapısı
- app.yisa-s.com → Patron komuta merkezi (yisa-s-v0 projesi)
- yisa-s.com → Tanıtım, demo formu, vitrin, Şablon Mağazası
- *.yisa-s.com → Tenant subdomain (örn: bjktuzcimnastik.yisa-s.com)

### Teknoloji Yığını
- Frontend: Next.js 15.5, React 19, TypeScript, Tailwind CSS
- UI: shadcn/ui (Radix UI tabanlı), Recharts
- Backend: Next.js API Routes, Server Actions
- Veritabanı: Supabase (PostgreSQL)
- Auth: Supabase Auth + Cookie session
- Dosya: Vercel Blob
- AI: OpenAI, Anthropic Claude, Google Gemini, Together AI, Fal AI
- Hosting: Vercel (Edge), DNS: Cloudflare (wildcard)
- Bot: ManyChat (Instagram/Facebook)
- Repo: GitHub (serdincaltay-ai)
- Mobil: PWA (manifest + service worker)

---

## 3. MEVCUT DURUM (Kaldığımız Yer — 9 Şubat 2026)

### Çalışan (yisa-s-v0 projesi)
- Login sayfası (Supabase Auth, parçmen animasyonlu giriş) ✅
- Dashboard (dashboard.tsx): Robot bar, AI chat, bölüm bazlı mesajlar ✅
- Beyin Takımı: Claude, GPT, Gemini, Together, Cursor, Fal AI, MayChat ✅
- Karar/Oylama paneli (Tabloya Çek, Herkes Görüş, Oylamaya Geç) ✅
- Simülasyona Gönder → sim_updates tablosu, 12 direktörlük filtresi ✅
- Görev atama (task-assignments) ✅
- Dosya yükleme (Vercel Blob) ✅
- API durum paneli (maliyet, bakiye) ✅
- Anayasa görüntüleme ✅
- Tenant paneli (sol menü): BJK Tuzla Cimnastik, Kartal, Fener (statik) ✅
- PWA + mobil responsive ✅
- Wildcard DNS (Cloudflare) + Vercel domain ✅

### Mevcut API'ler (app/api/)
auth, ai-chat, api-status, constitution, decisions, decision-items, dokumantasyon, files, messages, sim-updates, task-assignments

### Mevcut Supabase Tabloları
| Tablo | Kolonlar |
|-------|----------|
| messages | section, member_id, text, msg_type |
| decisions | section, topic, status |
| decision_items | decision_id, member_id, proposals, vote |
| sim_updates | target_robot, target_direktorluk, command, status |
| files | folder, name, file_type, blob_url |
| constitution | anayasa içeriği |
| task_assignments | task_type, assigned_to, cost_per_run, is_routine |

### ÖNEMLİ: sim_updates Tablo Yapısı
- Kolonlar: target_robot, target_direktorluk, command, status
- status değerleri: "beklemede" ve "islendi" (başka değer kullanma)
- payload kolonu YOK — ek JSON bilgisi command alanına string olarak yazılır
- Örnek command: '{"type":"tenant_kurulum","firma_adi":"X","slug":"x","email":"a@b.com"}'
- API'de parametre adı: target_direktorluk (target_directorate değil)

### Mevcut Migration Dosyaları
- scripts/001_create_tables.sql → messages, decisions, decision_items, sim_updates, files, constitution, task_assignments
- scripts/002_patron_system_upgrade.sql → Patron sistemi güncellemeleri
- NOT: 001'de tenants, students, staff, payments, attendance, health_records, groups, schedules, inventory tabloları YOK. Bunlar ayrı migration ile oluşturulmalı.

### Eksik Olan (Yapılacak)
- demo_requests tablosu ve API → %0
- Onay Kuyruğu (gerçek demo talepleri) → %0
- tenants tablosu (migration yok) → %0
- Patron Onayla → CELF tetikleme → tenant otomatik oluşturma → %0
- yisa-s.com vitrin + demo formu → %10
- Güvenlik robotu (audit log, RLS) → dokümante, kodda %0
- Veri robotu (şablon havuzu) → %10
- Franchise paneli modülleri (aidat, yoklama, öğrenci) → %30
- Veli paneli → %0
- students, staff, payments, attendance, groups, schedules tabloları → yisa-s-v0'da yok

### Klasör Yapısı
```
yisa-s-v0/
├── app/
│   ├── page.tsx           → Login + Dashboard
│   ├── layout.tsx
│   ├── globals.css
│   ├── dokumantasyon/page.tsx
│   └── api/
│       ├── ai-chat/       → AI sohbet
│       ├── api-status/    → API maliyet, bakiye
│       ├── auth/          → Giriş/çıkış (Supabase)
│       ├── constitution/  → Anayasa metni
│       ├── decision-items/
│       ├── decisions/     → Karar tablosu
│       ├── dokumantasyon/ → Doküman indirme
│       ├── files/         → Dosya yükleme (Vercel Blob)
│       ├── messages/      → Mesajlar
│       ├── sim-updates/   → CELF kuyruğu
│       └── task-assignments/ → Görev atama
├── dashboard.tsx          → Patron paneli ana UI
├── components/ui/         → shadcn/ui bileşenleri
├── lib/supabase/          → client, server, middleware
├── public/
├── scripts/
│   ├── 001_create_tables.sql
│   └── 002_patron_system_upgrade.sql
├── package.json           → Next.js 15.5, React 19
└── tailwind.config.js
```

### Tasarım Dili
- Koyu tema: arka plan #1a1a2e, accent #e94560, başlıklar #0f3460
- shadcn/ui bileşenleri, Tailwind CSS
- Türkçe arayüz, mobil responsive

---

## 4. FİNAL HEDEF (Buraya Ulaşacağız)

### Tam Çalışan Sistem:
1. yisa-s.com → Firma sahibi demo talep eder
2. app.yisa-s.com → Patron talebi görür, onaylar
3. CELF tetiklenir → 12 direktörlük başlangıç görevlerini üretir
4. Tenant otomatik oluşur (slug.yisa-s.com)
5. Franchise paneli aktif: Öğrenci, yoklama, aidat, ders programı
6. Veli paneli: Çocuk takibi, gelişim grafikleri, aidat durumu
7. Güvenlik robotu: Audit log, RLS, tenant izolasyonu
8. Veri robotu: Çocuk gelişim şablonları, antrenör yönlendirme

### İlerleme Yüzdeleri (Final):
Patron Paneli: %100 | Vitrin: %100 | Tenant: %100 | Franchise: %100
Güvenlik: %100 | Veri Robotu: %100 | Veli Paneli: %100

---

## 5. KURALLAR (Her Görevde Geçerli)

1. 4 robot mantığından SAPMA. CIO, CEO, COO kullanma.
2. Tüm değişiklikler yisa-s-v0 klasöründe (monorepo — patron + franchise aynı proje).
3. sim_updates'te status: "beklemede" / "islendi" kullan. Başka değer kullanma.
4. sim_updates'te ek bilgi: command alanına JSON string yaz (payload kolonu yok).
5. API'lerde parametre adı: target_direktorluk (target_directorate değil).
6. Tüm tenant verilerinde tenant_id zorunlu.
7. TypeScript tipleri lib/types/ altında tanımla.
8. CORS: yisa-s.com → app.yisa-s.com arası POST + OPTIONS handle et.
9. Her adım: Yap, kaydet, test et. Bir seferde tek görev.
10. Türkçe arayüz, koyu tema, shadcn/ui.

---

## 6. BU BAĞLAMI ANLADIĞINA DAİR

Lütfen şunları onayla:
- 4 robot yapısını anladın
- Mevcut çalışan bileşenleri biliyorsun
- Eksikleri biliyorsun
- sim_updates tablo yapısını (status: beklemede/islendi, payload yok) biliyorsun
- Final hedefe nasıl ulaşılacağını biliyorsun

Onayından sonra sana tek tek görevler vereceğim. Her görevi bu bağlama uygun yap.
```

---

# BÖLÜM 2: ADIM ADIM GÖREV KOMUTLARI

> **Kullanım:** Bölüm 1'deki bağlam komutunu v0'a verdikten sonra, aşağıdaki görevleri sırayla verin.

---

## FAZ 1: VİTRİN + DEMO FORMU (EN KRİTİK)

### GÖREV 1.1 — Temel Migration: Eksik Tabloları Oluştur

```
Supabase PostgreSQL migration scripti oluştur.
Dosya: scripts/003_core_tables.sql

Oluşturulacak tablolar:

1. tenants
- id (uuid, primary key, default gen_random_uuid())
- name (text, not null)
- slug (text, not null, UNIQUE)
- subdomain (text, not null, UNIQUE) — slug + ".yisa-s.com"
- owner_email (text)
- owner_name (text)
- sablon (text) — VIP, Baslangic, Sabit
- paket (text)
- status (text, default 'kurulum_bekliyor') — kurulum_bekliyor, aktif, pasif, askida
- settings (jsonb, default '{"tema":"koyu","dil":"tr"}')
- created_at (timestamptz, default now())
- updated_at (timestamptz, default now())

2. demo_requests
- id (uuid, primary key, default gen_random_uuid())
- firma_adi (text, not null)
- yetkili_adi (text, not null)
- email (text, not null)
- telefon (text, not null)
- tesis_turu (text) — cimnastik, yuzme, fitness, karma
- tesis_metrekare (integer)
- tesis_yukseklik (numeric)
- kira_tutari (numeric)
- muhit (text)
- sehir (text, default 'İstanbul')
- sablon_secimi (text)
- paket (text)
- mesaj (text)
- status (text, default 'beklemede') — beklemede, gorusuldu, onaylandi, reddedildi
- created_at (timestamptz, default now())
- updated_at (timestamptz, default now())

3. user_tenants
- id (uuid, primary key)
- user_id (uuid, references auth.users)
- tenant_id (uuid, references tenants)
- role (text, default 'admin') — patron, admin, antrenor, kasa, veli
- created_at (timestamptz, default now())
- UNIQUE(user_id, tenant_id)

4. students (öğrenciler/sporcular)
- id (uuid, primary key)
- tenant_id (uuid, not null, references tenants)
- ad (text, not null)
- soyad (text, not null)
- tc_kimlik (text)
- dogum_tarihi (date)
- cinsiyet (text)
- boy (numeric)
- kilo (numeric)
- vucut_tipi (text) — esnek, kuvvetli, karma
- grup_id (uuid)
- veli_adi (text)
- veli_telefon (text)
- veli_email (text)
- adres (text)
- saglik_notu (text)
- kan_grubu (text)
- alerji (text)
- status (text, default 'aktif') — aktif, pasif, dondurulan
- created_at (timestamptz, default now())

5. staff (personel/antrenörler)
- id (uuid, primary key)
- tenant_id (uuid, not null, references tenants)
- user_id (uuid, references auth.users)
- ad (text, not null)
- soyad (text, not null)
- rol (text) — antrenor, kasa, yonetici, temizlik
- telefon (text)
- email (text)
- maas (numeric)
- status (text, default 'aktif')
- created_at (timestamptz, default now())

6. groups (sınıf/gruplar)
- id (uuid, primary key)
- tenant_id (uuid, not null, references tenants)
- name (text, not null) — Minikler, Yıldızlar, Gençler
- yas_baslangic (integer)
- yas_bitis (integer)
- max_ogrenci (integer, default 20)
- antrenor_id (uuid, references staff)
- created_at (timestamptz, default now())

7. attendance (yoklama)
- id (uuid, primary key)
- tenant_id (uuid, not null, references tenants)
- athlete_id (uuid, not null, references students)
- group_id (uuid, references groups)
- tarih (date, not null)
- status (text, not null) — katildi, gelmedi, izinli
- antrenor_id (uuid, references staff)
- created_at (timestamptz, default now())

8. payments (ödemeler)
- id (uuid, primary key)
- tenant_id (uuid, not null, references tenants)
- athlete_id (uuid, references students)
- tutar (numeric, not null)
- tur (text) — gelir, gider
- kategori (text) — aidat, ek_ders, malzeme, kira, personel, fatura, diger
- odeme_yontemi (text) — nakit, havale, kredi_karti, dijital_kredi
- aciklama (text)
- makbuz_no (text)
- tarih (date, default current_date)
- created_at (timestamptz, default now())

9. schedules (ders programı)
- id (uuid, primary key)
- tenant_id (uuid, not null, references tenants)
- group_id (uuid, references groups)
- gun (text) — Pazartesi, Sali, Carsamba...
- baslangic_saat (time)
- bitis_saat (time)
- antrenor_id (uuid, references staff)
- created_at (timestamptz, default now())

10. audit_log
- id (uuid, primary key)
- event_type (text, not null)
- actor_id (uuid)
- actor_email (text)
- tenant_id (uuid)
- target_table (text)
- target_id (uuid)
- details (jsonb)
- ip_address (text)
- severity (text, default 'info') — info, warning, critical
- created_at (timestamptz, default now())

Index'ler: tenant_id üzerinde tüm tablolarda, audit_log'da event_type + created_at
RLS: Şimdilik enable etme, ayrı migration'da yapılacak.
demo_requests INSERT: anonim (public) erişime açık (form gönderimleri için).

NOT: Mevcut tablolara (messages, decisions, vb.) dokunma.
```

---

### GÖREV 1.2 — TypeScript Tipleri

```
Shared TypeScript tipleri oluştur.
Dosya: lib/types/index.ts

Aşağıdaki tablolar için TypeScript interface'leri tanımla:
- DemoRequest (demo_requests tablosu)
- Tenant (tenants tablosu)
- UserTenant (user_tenants tablosu)
- Student (students tablosu)
- Staff (staff tablosu)
- Group (groups tablosu)
- Attendance (attendance tablosu)
- Payment (payments tablosu)
- Schedule (schedules tablosu)
- AuditLog (audit_log tablosu)
- SimUpdate (sim_updates tablosu — mevcut: target_robot, target_direktorluk, command, status)

Ayrıca:
- DemoRequestStatus type: "beklemede" | "gorusuldu" | "onaylandi" | "reddedildi"
- SimUpdateStatus type: "beklemede" | "islendi"
- TenantStatus type: "kurulum_bekliyor" | "aktif" | "pasif" | "askida"
- StudentStatus type: "aktif" | "pasif" | "dondurulan"
- AttendanceStatus type: "katildi" | "gelmedi" | "izinli"
- UserRole type: "patron" | "admin" | "antrenor" | "kasa" | "veli"

Export et, diğer dosyalardan import edilebilir olsun.
```

---

### GÖREV 1.3 — Demo Talep API (POST + CORS)

```
Demo talep API'si oluştur.
Dosya: app/api/demo-requests/route.ts

3 handler:

1. OPTIONS handler (CORS preflight):
- Access-Control-Allow-Origin: "https://yisa-s.com"
- Access-Control-Allow-Methods: "GET, POST, PATCH, OPTIONS"
- Access-Control-Allow-Headers: "Content-Type, Authorization"
- Return 204

2. POST handler (anonim — form gönderimleri):
- Body: DemoRequest tipinden (lib/types)
- Zorunlu alan kontrolü: firma_adi, yetkili_adi, email, telefon
- Email format doğrulama (regex)
- Rate limit: Aynı email'den 24 saatte max 3 talep (demo_requests tablosundan count kontrolü)
- Supabase service role client ile INSERT (anonim erişim)
- Response header'larında CORS ekle
- Başarılı: 201 + { success: true, id }
- Hata: 400 (validasyon) / 429 (rate limit) / 500

3. GET handler (authenticated — patron için):
- Supabase server client, authenticated user kontrolü
- Query params: ?status=beklemede, ?limit=20, ?offset=0
- Sıralama: created_at DESC
- Response: { data: DemoRequest[], count: number }
- CORS header ekle

lib/types'tan DemoRequest import et.
Supabase client: lib/supabase/server.ts (mevcut).
```

---

### GÖREV 1.4 — Demo Talep Güncelleme API

```
Demo talep güncelleme API'si oluştur.
Dosya: app/api/demo-requests/[id]/route.ts

PATCH handler:
- Authenticated user kontrolü (patron)
- Body: { status: "gorusuldu" | "onaylandi" | "reddedildi" }
- Supabase'den mevcut demo_request'i çek
- Status güncelle, updated_at güncelle

Eğer status "onaylandi":
- Slug üret: firma_adi'ndan → türkçe karakter temizle (ş→s, ç→c, ğ→g, ü→u, ö→o, ı→i, İ→i), küçük harf, boşlukları tire ile değiştir, özel karakter sil
- Slug benzersizliği kontrolü: tenants tablosunda aynı slug var mı? Varsa slug sonuna -2, -3 ekle
- sim_updates tablosuna INSERT:
  {
    target_robot: "celf",
    target_direktorluk: "Operasyon",
    command: JSON.stringify({
      type: "tenant_kurulum",
      firma_adi: demo_request.firma_adi,
      slug: slug,
      email: demo_request.email,
      sablon: demo_request.sablon_secimi,
      paket: demo_request.paket
    }),
    status: "beklemede"
  }

ÖNEMLİ: sim_updates'te:
- status değeri "beklemede" olacak ("bekliyor" DEĞİL)
- payload kolonu YOK, ek bilgi command alanına JSON string olarak yazılır
- Parametre adı: target_direktorluk (target_directorate DEĞİL)

Hata durumunda: Hiçbir değişiklik yapma (compensating — demo_request status'u geri al)

Response: { success: true, status, slug (onaylandıysa) }
CORS header ekle.
```

---

### GÖREV 1.5 — Dashboard: Onay Kuyruğu

```
Mevcut dashboard.tsx'e "Onay Kuyruğu" bölümü ekle.

Sol paneldeki menüye "📋 Onay Kuyruğu" butonu ekle (tenantlar bölümünün altına).
Buton üzerinde bekleyen talep sayısını badge olarak göster.

Tıklanınca sağ panelde demo talepleri listesi:
- Her talep kart olarak:
  - Firma adı (bold), yetkili adı, email, telefon
  - Tesis türü, metrekare, muhit, şehir
  - Şablon, paket
  - Tarih (relative: "2 saat önce" formatında)
  - Status badge: beklemede=sarı, gorusuldu=mavi, onaylandi=yeşil, reddedildi=kırmızı
- Her kartta 3 buton:
  - "Görüşüldü" (mavi) → PATCH status: gorusuldu
  - "Onayla" (yeşil) → Konfirmasyon dialog: "Bu firmayı onaylıyor musunuz? Tenant oluşturma süreci başlayacak." → PATCH status: onaylandi
  - "Reddet" (kırmızı) → PATCH status: reddedildi
- Onay başarılı olunca: Toast "✅ [Firma Adı] onaylandı. CELF tetiklendi. Slug: [slug]"

Fetch: GET /api/demo-requests?status=beklemede
Loading state, error handling, boş durum mesajı ("Bekleyen talep yok")

lib/types'tan DemoRequest import et.
Koyu tema (#1a1a2e), accent (#e94560), shadcn/ui components.
```

---

### GÖREV 1.6 — yisa-s.com Vitrin Sayfası

```
Spor okulu tanıtım landing page oluştur. Bu sayfa yisa-s.com'da yayınlanacak.

Marka: YİSA-S — "Teknolojiyi Spora Başlattık"
Hedef: Spor okulu sahipleri / franchise adayları

Bölümler (scroll):

1. HERO
- Başlık: "Teknolojiyi Spora Başlattık"
- Alt: "Türkiye'nin ilk AI destekli spor okulu yönetim sistemi"
- CTA: "Ücretsiz Demo Talep Et" (demo formuna scroll)
- Gradient arka plan: koyu lacivert → kırmızı

2. PROBLEM — "Spor Okulu Yönetmek Neden Zor?"
4 kart: Aidat takibi, Yoklama karmaşası, Veli iletişimi, Çocuk gelişim takibi

3. ÇÖZÜM — "YİSA-S ile Tek Panelden Yönetin"
6 kart: AI Beyin Takımı, Otomatik Aidat, Dijital Yoklama, Gelişim Grafikleri, Veli Paneli, Franchise Yönetimi

4. NASIL ÇALIŞIR — 4 adım akış:
Demo Talep → Görüşme → Kurulum (10 saat) → Çalışmaya Başla

5. NEDEN BİZ
3 kolon: "4 AI Robot", "12 Direktörlük", "7/24 Destek"

6. PAKETLER
3 fiyat kartı:
- Başlangıç: Temel panel + 1 tesis
- Profesyonel: AI robotlar + 3 tesis
- VIP: Tam paket + sınırsız tesis + özel tasarım

7. DEMO FORMU (id="demo-form")
Alanlar: firma_adi, yetkili_adi, email, telefon, tesis_turu (dropdown), tesis_metrekare, muhit, sehir (İstanbul ilçeleri dropdown), sablon_secimi (radio: VIP/Baslangic/Sabit), mesaj (textarea)
Submit: fetch("https://app.yisa-s.com/api/demo-requests", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) })
Başarı: "Talebiniz alındı! 24 saat içinde dönüş yapacağız."
Hata: "Bir sorun oluştu, lütfen tekrar deneyin."
Loading: Buton disabled + spinner

8. FOOTER
YİSA-S logo, iletişim, sosyal medya, © 2026

Renk: Lacivert #0f3460, kırmızı #e94560, beyaz text
Font: Inter
Mobil öncelikli responsive
Scroll animasyonları (fade-in)
Next.js 15.5, Tailwind, shadcn/ui, TypeScript
```

---

## FAZ 2: TENANT OTOMATİK OLUŞTURMA

### GÖREV 2.1 — Tenant Oluşturma API

```
Tenant CRUD API'si oluştur.
Dosya: app/api/tenants/route.ts

POST handler:
- Authenticated user kontrolü (patron)
- Body: { firma_adi, slug, email, yetkili_adi, sablon, paket }
- Slug validasyon: sadece [a-z0-9-], UNIQUE kontrolü (tenants tablosunda)
- Supabase tenants tablosuna INSERT
- Otomatik şablon kayıtlar:
  a) user_tenants: tenant_id + owner email, role: "admin"
  b) groups: 3 varsayılan grup INSERT (Minikler 4-7 yaş, Yıldızlar 8-12, Gençler 13-17)
  c) schedules: Boş program şablonu
- audit_log'a INSERT: event_type: "tenant_created", details: { slug, firma_adi }
- Response: { success: true, tenant_id, subdomain: slug + ".yisa-s.com" }

GET handler:
- Authenticated (patron)
- ?status= filtresi, ?limit=, ?offset=
- Response: { data: Tenant[], count }

lib/types import. Tenant tipleri kullan.
```

---

### GÖREV 2.2 — Dashboard: Onay → Tenant Oluşturma Zinciri

```
Dashboard Onay Kuyruğu'ndaki "Onayla" butonunu güncelle.

Sıralı işlem zinciri (Patron "Onayla" dediğinde):

1. PATCH /api/demo-requests/[id] → status: "onaylandi" (bu zaten sim_updates'e de yazar)
2. POST /api/tenants → tenant oluştur (slug, firma_adi, email, sablon, paket)
3. Başarılı: Toast "✅ [Firma Adı] tenant oluşturuldu. Subdomain: [slug].yisa-s.com. CELF başlangıç görevleri tetiklendi."

Hata senaryosu (compensating/rollback):
- Adım 1 başarılı ama adım 2 başarısız:
  → demo_requests status'unu "beklemede"ye geri al (PATCH)
  → Toast hata: "❌ Tenant oluşturulamadı. Demo talebi beklemeye alındı."
- Adım 1 başarısız: Hiçbir şey yapma, hata göster.

Her adımda loading state göster. Buton disabled olsun.
```

---

## FAZ 3: GÜVENLİK ROBOTU MVP

### GÖREV 3.1 — Audit Log API + Dashboard

```
2 dosya:

1. app/api/audit-log/route.ts
- GET: audit_log tablosundan kayıtlar
- Filtre: ?event_type=, ?severity=, ?tenant_id=, ?from= (tarih), ?to= (tarih)
- Limit: ?limit=100, ?offset=0
- Sıralama: created_at DESC
- Authenticated patron kontrolü

2. Dashboard'a "🛡️ Güvenlik Logu" bölümü:
- Sol panelde buton
- Sağ panelde tablo: Tarih, Olay, Aktör, Tenant, Detay, Seviye
- Seviye badge: info=gri, warning=sarı, critical=kırmızı
- Filtre dropdown'ları: Olay türü, seviye
- Özet kartları: Son 24 saat toplam, uyarı, kritik sayısı
- Auto-refresh: 30 saniye

Koyu tema, Türkçe, shadcn/ui Table.
```

---

### GÖREV 3.2 — RLS Politikaları

```
Supabase RLS migration scripti.
Dosya: scripts/004_rls_policies.sql

Aşağıdaki tablolara RLS ekle:
students, staff, payments, attendance, groups, schedules

Her tablo için:
1. ALTER TABLE [tablo] ENABLE ROW LEVEL SECURITY;
2. SELECT policy: auth.uid() → user_tenants'ta user_id eşleşmesi → o tenant_id'ye ait veriler
3. INSERT policy: tenant_id zorunlu, user_tenants'ta ilgili tenant'a erişimi olan user
4. UPDATE/DELETE: Aynı tenant_id kontrolü
5. Patron erişimi: user_tenants.role = 'patron' ise TÜM tenant'lara erişim

RLS violation'da audit_log'a kayıt yazan trigger OLUŞTURMA (performans riski var, ileride async queue ile yapılacak). Bunun yerine API seviyesinde loglama yapılacak.

demo_requests: INSERT public (anonim erişim), SELECT/UPDATE authenticated.
tenants: SELECT/INSERT/UPDATE authenticated.
audit_log: INSERT system, SELECT patron.
```

---

## FAZ 4: VERİ ROBOTU — ŞABLON HAVUZU

### GÖREV 4.1 — Şablon Tabloları + API

```
Supabase migration + API:

Migration dosyası: scripts/005_veri_robotu.sql

1. templates tablosu:
- id, category (antrenman/gelisim_olcum/beslenme/postur/mental), title, description, content (jsonb), age_min (int), age_max (int), sport_type, difficulty, created_by (default 'veri_robotu'), is_active (default true), created_at

2. gelisim_olcumleri tablosu:
- id, tenant_id (FK), athlete_id (FK students), template_id (FK templates), olcum_tarihi (date), olcum_verileri (jsonb: {boy, kilo, bmi, esneklik, surat, kuvvet}), antrenor_notu, created_at

3. referans_degerler tablosu:
- id, yas, cinsiyet, parametre (boy/kilo/bmi/esneklik/surat/kuvvet), min_deger, max_deger, optimal_deger, kaynak, created_at

RLS: gelisim_olcumleri → tenant_id bazlı. templates ve referans_degerler → herkes okuyabilir.

API dosyaları:
1. app/api/templates/route.ts — GET (filtre: category, sport_type, age), POST
2. app/api/gelisim-olcumleri/route.ts — GET (?athlete_id, ?tenant_id), POST. tenant_id zorunlu.
```

---

## FAZ 5: FRANCHISE PANELİ

### GÖREV 5.1 — Franchise Dashboard + Öğrenci Modülü

```
Franchise paneli oluştur. Tenant subdomain altında çalışacak (*.yisa-s.com).

Konum: yisa-s-v0 monorepo içinde. Tenant routing: URL'deki subdomain'den tenant_id çöz.

Layout:
- Sol sidebar: Tenant logo, menü (Ana Sayfa, Öğrenciler, Yoklama, Aidat, Ders Programı, Antrenörler, Raporlar, Ayarlar)
- Üst bar: Tenant adı, kullanıcı, çıkış, bildirim
- Ana alan: Seçilen modül

Ana Sayfa:
- 4 kart: Toplam Öğrenci, Aktif Öğrenci, Bu Ay Gelir, Bugün Yoklama
- Grafik: Son 6 ay öğrenci (line chart, recharts)
- Grafik: Bu ay aidat (pie: ödendi/bekliyor/gecikmiş)
- Son 10 aktivite, yaklaşan dersler

Öğrenci Modülü:
- Liste: tablo (ad, yaş, grup, veli, telefon, durum, son yoklama) + arama + filtre
- Detay: profil, veli bilgileri, sağlık, yoklama takvimi (30 gün), gelişim grafikleri, aidat
- Yeni kayıt formu: çocuk + veli + sağlık + KVKK onayı

Tüm sorgularda tenant_id filtresi zorunlu.
Auth: Supabase auth, tenant subdomain'den tenant_id çözümle.
Koyu tema, Türkçe, mobil responsive, PWA.
lib/types import.
```

---

### GÖREV 5.2 — Yoklama + Aidat Modülü

```
Franchise paneline Yoklama ve Aidat modülleri ekle.

YOKLAMA:
- Yoklama alma: Tarih + grup + saat seçimi → öğrenci listesi (checkbox: Katıldı/Gelmedi/İzinli)
- Kaydet: attendance tablosuna INSERT (tenant_id zorunlu)
- Dijital kredi: Her "katildi" kaydında payments tablosunda bakiye düşür (1 kredi)
- Geçmiş: Takvim görünümü (aylık) + tablo görünümü + devamsızlık raporu

AİDAT/KASA:
- Aidat listesi: Öğrenci, veli, paket, tutar, son ödeme, bakiye, durum (güncel/gecikmiş/yaklaşıyor)
- Ödeme kayıt: Öğrenci seçimi, tutar, tarih, yöntem, makbuz no (otomatik üret)
- Kasa defteri: Günlük özet, gelir/gider tablosu, kategori bazlı
- Grafik: Aylık gelir vs gider (bar chart, recharts)
- Dijital kredi: Veli yükler (20 ders = X TL), her ders 1 kredi düşer, bakiye azalınca uyarı

API: attendance + payments tabloları. tenant_id zorunlu.
Koyu tema, Türkçe, shadcn/ui.
```

---

## FAZ 6: VELİ PANELİ MVP

### GÖREV 6.1 — Veli Paneli

```
Veli paneli oluştur. Veliler çocuklarını bu panelden takip eder.

Auth: Supabase auth, ayrı veli girişi (email + şifre).
Veli-çocuk ilişkisi: user_tenants (role: "veli") + students tablosundaki veli_email eşleşmesi.

Sayfalar:

1. Giriş: YİSA-S logo, "Veli Paneli", email + şifre, şifremi unuttum
2. Ana sayfa: Çocuk kartları (ad, yaş, grup, son yoklama, kalan kredi, sonraki ders)
3. Çocuk detay: Yoklama takvimi (30 gün), gelişim grafikleri, aidat/bakiye, ders programı
4. Duyurular: Tesis duyuruları listesi
5. Mesajlar: "Yakında" placeholder

Tasarım: AÇIK tema (veliler için — beyaz arka plan, mavi aksanlar)
tenant_id: Subdomain'den çöz
RLS: Veli sadece kendi çocuklarını görebilir
Mobil öncelikli, PWA, Türkçe
```

---

## FAZ 7: CELF ZİNCİRİ

### GÖREV 7.1 — CELF Başlangıç Görev Motoru

```
API: app/api/celf-startup/route.ts

POST: { tenant_id, slug }

Yeni tenant kurulduğunda 12 direktörlük için başlangıç görevleri oluştur.
task_assignments tablosuna toplu INSERT:

| Saat | Direktörlük | Görevler |
|------|-------------|----------|
| 0-2 | CTO | Veritabanı hazırla, API test et, subdomain kontrol |
| 0-2 | CHRO | 14 rol tanımı, personel kayıt şablonu |
| 2-6 | CLO | KVKK aydınlatma, üyelik sözleşmesi, veli onay formu |
| 2-5 | CFO | Kasa defteri, aidat planları, dijital kredi paketleri |
| 2-6 | CSPO | Kayıt formları, yaş grubu antrenman şablonları, gelişim ölçüm |
| 4-8 | CMO | Sosyal medya şablonları, hoş geldin e-postası, tanıtım metni |
| 4-7 | Tasarım | Logo önerileri (Fal AI), kartvizit, web banner |
| 6-8 | CPO | Üyelik paketleri, fiyatlandırma |
| 6-9 | CSO/CDO | Satış kiti, dashboard verileri |
| 7-9 | CXO | Kullanım kılavuzu, SSS |
| Sürekli | CRDO | Rakip analizi, iyileştirme önerileri |

Her görev: { tenant_id, assigned_to: direktorluk, task_type: baslik, cost_per_run: 0, is_routine: false }
Toplam ~30 görev.

sim_updates'e de bilgilendirme INSERT:
{
  target_robot: "celf",
  target_direktorluk: "Strateji",
  command: JSON.stringify({ type: "baslangic_tamamlandi", tenant_id, gorev_sayisi }),
  status: "beklemede"
}

Response: { success: true, gorev_sayisi }
```

---

# BÖLÜM 3: KULLANIM REHBERİ

## v0.dev'de Adım Adım

1. v0.dev'e git
2. **İLK OLARAK** Bölüm 1'deki BAĞLAM KOMUTUNU yapıştır → v0 sistemi anlasın
3. v0'ın onayını bekle
4. Sonra Görev 1.1'den başlayarak sırayla komutları ver
5. Her görev çıktısını Cursor'da birleştir
6. Lokal test (pnpm dev → localhost:3000)
7. Supabase'de migration çalıştır
8. Vercel'e deploy
9. Sonraki göreve geç

## Öncelik Sırası

| Sıra | Görev | Kritiklik |
|------|-------|-----------|
| 1 | Bağlam komutu (Bölüm 1) | ZORUNLU — v0 sistemi anlamalı |
| 2 | Görev 1.1 (tablolar) | Altyapı — her şey buna bağlı |
| 3 | Görev 1.2 (tipler) | Tutarlılık |
| 4 | Görev 1.3-1.4 (API) | Demo akışı |
| 5 | Görev 1.5 (onay kuyruğu) | Patron arayüzü |
| 6 | Görev 1.6 (vitrin) | Müşteri kazanımı |
| 7 | Görev 2.1-2.2 (tenant) | Otomasyon |
| 8 | Görev 3.1-3.2 (güvenlik) | Veri koruma |
| 9 | Görev 5.1-5.2 (franchise) | Müşteri kullanımı |
| 10 | Görev 4.1 (veri robotu) | Diferansiyasyon |
| 11 | Görev 6.1 (veli paneli) | Son kullanıcı |
| 12 | Görev 7.1 (CELF) | Ölçekleme |

## Her Adım Sonrası Kontrol Listesi

- [ ] v0.dev'de kod üretildi
- [ ] Cursor'a aktarıldı
- [ ] yisa-s-v0 klasöründe doğru yere kaydedildi
- [ ] TypeScript hata yok (tsc --noEmit)
- [ ] Supabase migration çalıştırıldı (varsa)
- [ ] Lokal test yapıldı (pnpm dev)
- [ ] CORS test edildi (farklı origin'den POST)
- [ ] Vercel'e deploy edildi
- [ ] Bir sonraki görev belirlendi

---

**Hazırlayan:** YİSA-S AI Sistemi  
**Tarih:** 9 Şubat 2026 | Revize v2  
**Son Güncelleme:** Her faz tamamlandığında güncellenir.
