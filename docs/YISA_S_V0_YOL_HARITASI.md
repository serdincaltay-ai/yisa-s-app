# YİSA-S — v0.dev KAPSAMLI YOL HARİTASI VE KOMUT REHBERİ

**Tarih:** 9 Şubat 2026  
**Amaç:** Mevcut yisa-s-v0 sistemini v0.dev üzerinden çalıştırarak hedefe ulaşmak  
**Yöntem:** Her faz için doğrudan v0.dev'e verilecek komutlar — kopyala/yapıştır, çalıştır  
**Kilitli Mimari:** 4 Robot, 12 Direktörlük, Next.js 15.5 + Supabase + Vercel

---

## MEVCUT DURUM ÖZETİ

| Bileşen | Durum | Yüzde |
|---------|-------|-------|
| Patron Paneli (app.yisa-s.com) | Dashboard, AI chat, robot bar, oylama çalışıyor | %90 |
| Veritabanı (Supabase) | Temel tablolar mevcut, RLS eksik | %75 |
| API Altyapısı | ai-chat, auth, decisions, sim-updates, task-assignments | %80 |
| DNS/Domain | Cloudflare + Vercel wildcard aktif | %85 |
| Tenant Sistemi (*.yisa-s.com) | 3 tenant aktif, panel içerikleri eksik | %50 |
| yisa-s.com Vitrin | Demo formu yok, tanıtım sayfası yok | %10 |
| Franchise Paneli | Giriş var, modüller eksik | %30 |
| Veli Paneli | Hiç başlanmadı | %0 |
| Güvenlik Robotu | Dokümante, kodda değil | %0 |
| Veri Robotu | Tablolar var, şablon havuzu eksik | %10 |

---

## YOL HARİTASI — 7 FAZ

---

## FAZ 1: VİTRİN + DEMO FORMU (EN KRİTİK)
**Hedef:** yisa-s.com üzerinden firma sahiplerinin demo talebinde bulunması

### ADIM 1.1 — Supabase: demo_requests Tablosu

**v0.dev Komutu:**

```
Supabase PostgreSQL migration scripti oluştur. Dosya adı: scripts/003_demo_requests.sql

Tablo: demo_requests
Kolonlar:
- id (uuid, primary key, default gen_random_uuid())
- firma_adi (text, not null)
- yetkili_adi (text, not null)
- email (text, not null)
- telefon (text, not null)
- tesis_turu (text) — cimnastik, yüzme, fitness, karma vb.
- tesis_metrekare (integer)
- tesis_yukseklik (numeric)
- kira_tutari (numeric)
- muhit (text) — semt/mahalle bilgisi
- sehir (text, default 'İstanbul')
- sablon_secimi (text) — VIP, Başlangıç, Sabit
- paket (text) — 3000$ + token, sadece panel, tam paket
- mesaj (text) — ek notlar
- status (text, default 'bekliyor') — bekliyor, gorusuldu, onaylandi, reddedildi
- created_at (timestamptz, default now())
- updated_at (timestamptz, default now())

RLS: Sadece authenticated kullanıcılar okuyabilir. INSERT public (anonim form gönderimleri için).
Yisa-s-v0 projesi için, Next.js 15.5, Supabase client kullan.
```

---

### ADIM 1.2 — API: POST /api/demo-requests

**v0.dev Komutu:**

```
Next.js 15.5 API route oluştur. Dosya: app/api/demo-requests/route.ts

İşlev: POST isteğiyle gelen demo taleplerini Supabase demo_requests tablosuna kaydet.

Gereksinimler:
- Supabase server client kullan (lib/supabase/server.ts mevcut)
- Gelen body: { firma_adi, yetkili_adi, email, telefon, tesis_turu, tesis_metrekare, tesis_yukseklik, kira_tutari, muhit, sehir, sablon_secimi, paket, mesaj }
- Zorunlu alan kontrolü: firma_adi, yetkili_adi, email, telefon
- Email format doğrulama
- Başarılı: 201 + { success: true, id }
- Hata: 400/500 + { error: "mesaj" }
- CORS: yisa-s.com origin'den gelen isteklere izin ver
- Rate limiting düşün (aynı email'den 24 saatte max 3 talep)

Proje stack: Next.js 15.5, React 19, TypeScript, Supabase, Vercel
```

---

### ADIM 1.3 — API: GET /api/demo-requests (Patron için)

**v0.dev Komutu:**

```
Next.js 15.5 API route oluştur. Dosya: app/api/demo-requests/route.ts (GET handler ekle)

İşlev: Patron panelinden demo taleplerini listelemek.

Gereksinimler:
- Supabase server client, authenticated user kontrolü
- Query params: ?status=bekliyor (filtreleme), ?limit=20, ?offset=0
- Sıralama: created_at DESC (en yeni üstte)
- Response: { data: [...], count: toplam_sayi }
- Sadece authenticated patron erişebilir

Aynı dosyadaki POST handler'a dokunma, sadece GET ekle.
```

---

### ADIM 1.4 — API: PATCH /api/demo-requests/[id]

**v0.dev Komutu:**

```
Next.js 15.5 dynamic API route oluştur. Dosya: app/api/demo-requests/[id]/route.ts

İşlev: Patron bir demo talebini onaylayınca veya reddettiğinde status güncellemesi.

Gereksinimler:
- PATCH method
- Body: { status: "onaylandi" | "reddedildi" | "gorusuldu" }
- Authenticated user kontrolü (patron)
- Eğer status "onaylandi" ise → sim_updates tablosuna otomatik INSERT:
  {
    target_robot: "celf",
    command: "tenant_kurulum",
    payload: { firma_adi, slug, email, sablon_secimi, paket },
    status: "bekliyor",
    direktorluk: "Operasyon"
  }
- Slug üretimi: firma_adi'ndan türkçe karakter temizle, küçük harf, boşlukları - ile değiştir
- updated_at güncelle
- Response: { success: true, status, slug (eğer onaylandıysa) }
```

---

### ADIM 1.5 — Dashboard: Onay Kuyruğu Bölümü

**v0.dev Komutu:**

```
Mevcut dashboard.tsx'e "Onay Kuyruğu" bölümü ekle. React 19, TypeScript, Tailwind CSS, shadcn/ui kullan.

Tasarım:
- Sol paneldeki mevcut menüye "📋 Onay Kuyruğu" butonu ekle (tenantlar bölümünün altına)
- Tıklanınca sağ panelde demo talepleri listesi açılsın
- Her talep bir kart olarak gösterilsin:
  - Firma adı (büyük, bold)
  - Yetkili adı, email, telefon
  - Tesis türü, metrekare, muhit, şehir
  - Şablon seçimi, paket
  - Tarih (relative: "2 saat önce")
  - Status badge (bekliyor=sarı, görüşüldü=mavi, onaylandı=yeşil, reddedildi=kırmızı)
- Her kartta 3 buton:
  - "Görüşüldü" (mavi) → status: gorusuldu
  - "Onayla" (yeşil) → status: onaylandi → CELF tetiklenir
  - "Reddet" (kırmızı) → status: reddedildi
- Onay butonuna tıklayınca konfirmasyon dialog: "Bu firmayı onaylıyor musunuz? Tenant oluşturma süreci başlayacak."
- Loading state, error handling
- Fetch: GET /api/demo-requests?status=bekliyor
- Sayaç: Onay Kuyruğu butonunda bekleyen talep sayısını göster (badge)

Mevcut tasarım: Koyu tema (#1a1a2e arka plan), #e94560 accent, #0f3460 başlıklar
Stack: Next.js 15.5, React 19, shadcn/ui, Tailwind, Supabase
Türkçe arayüz.
```

---

### ADIM 1.6 — yisa-s.com Vitrin Sayfası

**v0.dev Komutu:**

```
Spor okulu yönetim sistemi tanıtım sayfası (landing page) oluştur. Tam sayfa, modern, responsive.

Marka: YİSA-S — "Teknolojiyi Spora Başlattık"
Hedef kitle: Spor okulu sahipleri ve franchise adayları
Stack: Next.js 15.5, Tailwind CSS, shadcn/ui, TypeScript

Bölümler (yukarıdan aşağıya):
1. HERO — Büyük başlık: "Teknolojiyi Spora Başlattık", alt başlık: "Türkiye'nin ilk AI destekli spor okulu yönetim sistemi", CTA butonu: "Ücretsiz Demo Talep Et", arka plan gradient koyu mavi-kırmızı

2. PROBLEM — "Spor Okulu Yönetmek Neden Zor?" — 4 ikon kartı: Aidat takibi, Yoklama karmaşası, Veli iletişimi, Çocuk gelişim takibi

3. ÇÖZÜM — "YİSA-S ile Tek Panelden Yönetin" — 6 özellik kartı: AI Beyin Takımı, Otomatik Aidat, Dijital Yoklama, Çocuk Gelişim Grafikleri, Veli Paneli, Franchise Yönetimi

4. NASIL ÇALIŞIR — 4 adım akış diyagramı: Demo Talep → Görüşme → Kurulum → Çalışmaya Başla

5. NEDEN BİZ — 3 kolon: "4 AI Robot", "12 Direktörlük", "7/24 Destek" — rakamlarla

6. PAKETLER — 3 fiyat kartı:
   - Başlangıç: Temel panel + 1 tesis
   - Profesyonel: AI robotlar + 3 tesis
   - VIP: Tam paket + sınırsız tesis + özel tasarım

7. DEMO FORMU — Form alanları: Firma adı, yetkili adı, email, telefon, tesis türü (dropdown: cimnastik, yüzme, fitness, karma), tesis metrekare, muhit, şehir (dropdown: İstanbul ilçeleri), şablon seçimi (radio: VIP, Başlangıç, Sabit), mesaj (textarea)
   - Form submit → POST fetch("/api/demo-requests") — CORS ile app.yisa-s.com'a gönder
   - Başarılı: "Talebiniz alındı! 24 saat içinde dönüş yapacağız." mesajı
   - Hata: "Bir sorun oluştu, lütfen tekrar deneyin."

8. FOOTER — YİSA-S logo, iletişim bilgileri, sosyal medya ikonları, "© 2026 YİSA-S"

Renk paleti: Koyu lacivert (#0f3460), kırmızı accent (#e94560), beyaz text, açık gri background bölümleri
Font: Inter veya Segoe UI
Türkçe arayüz, mobil öncelikli responsive tasarım.
Animasyonlar: Scroll-triggered fade-in, hero'da subtle gradient animation
```

---

## FAZ 2: TENANT OTOMATİK OLUŞTURMA
**Hedef:** Patron onayından sonra tenant'ın otomatik kurulması

### ADIM 2.1 — Tenant Oluşturma API

**v0.dev Komutu:**

```
Next.js 15.5 API route oluştur. Dosya: app/api/tenants/route.ts

İşlev: Yeni tenant (franchise tesis) oluşturma.

POST Handler:
- Body: { firma_adi, slug, email, yetkili_adi, sablon_secimi, paket }
- Slug doğrulama: sadece küçük harf, rakam, tire. Benzersiz olmalı.
- Supabase tenants tablosuna INSERT:
  {
    id: uuid,
    name: firma_adi,
    slug: slug,
    subdomain: slug + ".yisa-s.com",
    owner_email: email,
    owner_name: yetkili_adi,
    sablon: sablon_secimi,
    paket: paket,
    status: "kurulum_bekliyor",
    settings: { tema: "koyu", dil: "tr" },
    created_at: now()
  }
- Otomatik şablon kayıtları oluştur:
  - user_tenants: tenant_id + owner email ile admin rolü
  - groups: varsayılan 3 grup (Minikler, Yıldızlar, Gençler)
  - schedules: boş program şablonu
- Response: { success: true, tenant_id, subdomain }

GET Handler:
- Tüm tenant'ları listele (patron için)
- ?status= filtresi
- Response: { data: [...], count }

Authenticated user kontrolü zorunlu.
Stack: Next.js 15.5, Supabase server client, TypeScript
```

---

### ADIM 2.2 — Tenant Kurulum Tetikleme (CELF Bağlantısı)

**v0.dev Komutu:**

```
Mevcut dashboard.tsx'teki Onay Kuyruğu'na entegre et:

Patron "Onayla" butonuna tıkladığında sırasıyla:
1. PATCH /api/demo-requests/[id] → status: "onaylandi"
2. POST /api/tenants → tenant oluştur
3. sim_updates tablosuna INSERT:
   {
     target_robot: "celf",
     command: "tenant_baslangic_gorevleri",
     payload: {
       tenant_id,
       slug,
       direktorlukler: ["CTO", "CHRO", "CLO", "CFO", "CSPO", "CMO"]
     },
     status: "bekliyor",
     direktorluk: "Operasyon"
   }
4. Toast notification: "✅ [Firma Adı] tenant oluşturuldu. CELF başlangıç görevleri tetiklendi."

Error handling: Herhangi bir adım başarısız olursa rollback yap, kullanıcıya hata göster.
Mevcut sim-updates API'yi kullan (app/api/sim-updates/route.ts mevcut).
React 19, TypeScript, shadcn/ui toast component.
```

---

## FAZ 3: GÜVENLİK ROBOTU MVP
**Hedef:** Audit log, tenant izolasyonu, erişim kontrolü

### ADIM 3.1 — Audit Log Tablosu

**v0.dev Komutu:**

```
Supabase PostgreSQL migration scripti oluştur. Dosya: scripts/004_audit_log.sql

Tablo: audit_log
Kolonlar:
- id (uuid, primary key)
- event_type (text, not null) — tenant_created, role_changed, bulk_delete, login, login_failed, data_export, rls_violation
- actor_id (uuid) — işlemi yapan kullanıcı
- actor_email (text)
- tenant_id (uuid, nullable) — hangi tenant'ta oldu
- target_table (text, nullable) — etkilenen tablo
- target_id (uuid, nullable) — etkilenen kayıt
- details (jsonb) — ek detaylar
- ip_address (text, nullable)
- severity (text, default 'info') — info, warning, critical
- created_at (timestamptz, default now())

Index: event_type, tenant_id, created_at üzerinde
RLS: Sadece patron okuyabilir, sistem INSERT yapabilir.

Ayrıca bir audit_log_insert fonksiyonu oluştur (stored procedure):
CREATE OR REPLACE FUNCTION log_audit(...)
```

---

### ADIM 3.2 — Audit Log API + Dashboard Paneli

**v0.dev Komutu:**

```
2 dosya oluştur:

1. app/api/audit-log/route.ts
- GET: audit_log tablosundan son 100 kayıt, filtreleme (event_type, severity, tenant_id, tarih aralığı)
- Authenticated patron kontrolü
- Response: { data: [...], count }

2. Dashboard'a "🛡️ Güvenlik Logu" bölümü ekle:
- Sol panelde Güvenlik butonu
- Sağ panelde tablo görünümü:
  - Tarih, Olay Türü, Aktör, Tenant, Detay, Seviye
  - Seviye badge: info=gri, warning=sarı, critical=kırmızı
- Filtreler: Olay türü dropdown, seviye dropdown, tarih seçici
- Son 24 saat özet kartları: Toplam olay, Uyarı sayısı, Kritik sayısı
- Otomatik yenileme (30 saniye)

Koyu tema, Türkçe, shadcn/ui Table component.
```

---

### ADIM 3.3 — RLS Politikaları (Tüm Tenant Tabloları)

**v0.dev Komutu:**

```
Supabase RLS migration scripti oluştur. Dosya: scripts/005_rls_policies.sql

Aşağıdaki tablolara tenant_id bazlı RLS politikaları ekle:

Tablolar: students, staff, payments, attendance, health_records, groups, schedules, inventory

Her tablo için:
1. ALTER TABLE [tablo] ENABLE ROW LEVEL SECURITY;
2. Policy: tenant_users sadece kendi tenant_id'lerine ait verileri görebilir
3. Policy: patron (belirli email veya rol) tüm tenant'lara erişebilir
4. Policy: INSERT'te tenant_id zorunlu kontrolü

user_tenants tablosu üzerinden kontrol:
- auth.uid() → user_tenants'ta user_id eşleşmesi → tenant_id filtresi
- Patron rolü: user_tenants.role = 'patron' ise tüm tenant'lara erişim

Her RLS violation'da audit_log'a kayıt düşen trigger oluştur.

NOT: Mevcut tablolarda tenant_id kolonu yoksa ALTER TABLE ile ekle.
```

---

## FAZ 4: VERİ ROBOTU — ŞABLON HAVUZU
**Hedef:** Çocuk gelişim şablonları, antrenör yönlendirme

### ADIM 4.1 — Şablon Tabloları

**v0.dev Komutu:**

```
Supabase PostgreSQL migration scripti oluştur. Dosya: scripts/006_veri_robotu_tablolar.sql

3 tablo:

1. templates (Şablon Kütüphanesi)
- id (uuid)
- category (text) — antrenman, gelisim_olcum, beslenme, postür, mental
- title (text)
- description (text)
- content (jsonb) — şablon içeriği (sorular, ölçüm alanları, formüller)
- age_range (int4range) — yaş aralığı (örn: [6,10))
- sport_type (text) — cimnastik, yüzme, genel
- difficulty (text) — baslangic, orta, ileri
- created_by (text, default 'veri_robotu')
- is_active (boolean, default true)
- created_at (timestamptz)

2. gelisim_olcumleri (Çocuk Gelişim Ölçümleri)
- id (uuid)
- tenant_id (uuid, FK tenants)
- athlete_id (uuid, FK students)
- template_id (uuid, FK templates)
- olcum_tarihi (date)
- olcum_verileri (jsonb) — { boy: 120, kilo: 25, bmi: 17.4, esneklik: 8, surat: 4.2 }
- antrenor_notu (text)
- created_at (timestamptz)

3. referans_degerler (Yaşa Göre Normatif Değerler)
- id (uuid)
- yas (integer)
- cinsiyet (text)
- parametre (text) — boy, kilo, bmi, esneklik, surat, kuvvet
- min_deger (numeric)
- max_deger (numeric)
- optimal_deger (numeric)
- kaynak (text) — WHO, TGF, akademik çalışma adı
- created_at (timestamptz)

RLS: tenant_id bazlı izolasyon (gelisim_olcumleri için), templates ve referans_degerler herkes okuyabilir.
```

---

### ADIM 4.2 — Şablon API + Antrenör Yönlendirme

**v0.dev Komutu:**

```
Next.js 15.5 API route'ları oluştur:

1. app/api/templates/route.ts
- GET: Şablonları listele, filtre: category, sport_type, age_range
- POST: Yeni şablon ekle (patron/veri robotu)

2. app/api/gelisim-olcumleri/route.ts
- GET: Bir sporcunun tüm ölçümlerini getir (?athlete_id=xxx, ?tenant_id=xxx)
- POST: Yeni ölçüm kaydet
- tenant_id kontrolü zorunlu (RLS)

3. app/api/gelisim-analiz/route.ts
- POST: { athlete_id, tenant_id }
- İşlev: Sporcunun son ölçümlerini referans_degerler ile karşılaştır
- Response: {
    athlete: { ad, yas, vucut_tipi },
    analiz: {
      boy: { deger, referans_min, referans_max, durum: "normal/düşük/yüksek" },
      esneklik: { ... },
      kuvvet: { ... }
    },
    oneri: "Bu sporcu esnek yapıda, estetik hareketlere yönlendirilmeli..."
  }
- Öneri metni: vucut_tipi + ölçüm verileri + referans karşılaştırması ile AI'a sorulabilir veya rule-based olabilir

TypeScript, Supabase server client, authenticated user.
```

---

## FAZ 5: FRANCHISE PANELİ (TENANT İÇERİKLERİ)
**Hedef:** *.yisa-s.com subdomain'lerinde çalışan franchise paneli modülleri

### ADIM 5.1 — Franchise Dashboard

**v0.dev Komutu:**

```
Spor okulu franchise dashboard oluştur. Tenant subdomain altında çalışacak (örn: bjktuzcimnastik.yisa-s.com).

Stack: Next.js 15.5, React 19, Tailwind, shadcn/ui, TypeScript, Supabase

Layout:
- Sol sidebar: Logo (tenant'a özel), menü: Ana Sayfa, Öğrenciler, Yoklama, Aidat, Ders Programı, Antrenörler, Raporlar, Ayarlar
- Üst bar: Tenant adı, kullanıcı adı, çıkış butonu, bildirim ikonu
- Ana alan: Seçilen modülün içeriği

Ana Sayfa (Dashboard):
- 4 özet kartı: Toplam Öğrenci, Aktif Öğrenci, Bu Ay Gelir, Bugün Yoklama
- Grafik: Son 6 ay öğrenci sayısı (çizgi grafik, recharts)
- Grafik: Bu ay aidat durumu (pasta grafik: ödendi/bekliyor/gecikmiş)
- Son aktiviteler listesi (son 10 işlem)
- Yaklaşan dersler (bugün + yarın)

Auth: Supabase auth, login sayfası ayrı (mevcut franchise login kullanılacak)
tenant_id: URL'deki subdomain'den çöz, tüm sorgularda tenant_id filtresi
Koyu tema, Türkçe, mobil responsive, PWA uyumlu
```

---

### ADIM 5.2 — Öğrenci Modülü

**v0.dev Komutu:**

```
Franchise paneli için Öğrenci Yönetim modülü oluştur.

Öğrenci Listesi Sayfası:
- Tablo: Ad Soyad, Yaş, Grup, Veli Adı, Telefon, Durum (aktif/pasif/dondurulan), Son Yoklama
- Arama: isim, veli adı ile filtreleme
- Filtre: Grup, Durum, Yaş aralığı
- "Yeni Öğrenci Ekle" butonu
- Her satırda: Detay, Düzenle, Sil (soft delete) butonları

Öğrenci Detay Sayfası:
- Profil kartı: Ad, doğum tarihi, yaş, boy, kilo, vücut tipi, fotoğraf alanı
- Veli bilgileri: Ad, telefon, email, adres
- Sağlık bilgileri: Alerji, kronik hastalık, kan grubu, acil iletişim
- Ders geçmişi: Son 30 günlük yoklama (takvim görünümü, yeşil=katıldı, kırmızı=gelmedi, gri=izinli)
- Gelişim grafikleri: Boy/kilo trendi, performans metrikleri (recharts)
- Aidat durumu: Bakiye, son ödeme, borç

Yeni Öğrenci Formu:
- Çocuk bilgileri: Ad, soyad, TC kimlik, doğum tarihi, cinsiyet, boy, kilo
- Veli bilgileri: Ad, soyad, telefon, email, adres
- Tesis bilgileri: Grup seçimi, başlangıç tarihi, paket seçimi
- Sağlık bilgileri: Alerji, kronik hastalık, ilaç kullanımı, kan grubu
- Onay: KVKK onayı checkbox

API: students tablosu, tenant_id zorunlu, Supabase
Koyu tema, Türkçe, shadcn/ui form ve table components.
```

---

### ADIM 5.3 — Yoklama Modülü

**v0.dev Komutu:**

```
Franchise paneli için Yoklama modülü oluştur.

Yoklama Alma Sayfası:
- Üstte: Tarih seçici (default bugün), Grup seçici (dropdown), Ders saati seçici
- Öğrenci listesi: Checkbox ile toplu yoklama
  - Her öğrenci satırı: Fotoğraf (küçük avatar), Ad Soyad, Durum butonları (Katıldı ✅ / Gelmedi ❌ / İzinli 🟡)
  - Varsayılan: hepsi "Katıldı" işaretli
- Alt bar: "Yoklamayı Kaydet" butonu, toplam: X katıldı, Y gelmedi, Z izinli
- Kayıt sonrası: Toast "Yoklama kaydedildi" + dijital kredi düşürme (her katılım = 1 kredi)

Yoklama Geçmişi Sayfası:
- Takvim görünümü: Aylık takvimde her gün için yoklama özeti
- Tablo görünümü: Tarih, Grup, Katılan, Gelmeyen, İzinli, Antrenör
- Öğrenci bazlı devamsızlık raporu: Son 30 gün, devamsızlık oranı

API: attendance tablosu
- INSERT: tenant_id, athlete_id, group_id, date, status (katildi/gelmedi/izinli), antrenor_id
- Dijital kredi: Her "katildi" kaydında payments tablosunda bakiye düşür

Supabase, tenant_id zorunlu, Türkçe, koyu tema, shadcn/ui
```

---

### ADIM 5.4 — Aidat/Kasa Modülü

**v0.dev Komutu:**

```
Franchise paneli için Aidat ve Kasa Yönetim modülü oluştur.

Aidat Listesi Sayfası:
- Tablo: Öğrenci Adı, Veli Adı, Paket, Aylık Tutar, Son Ödeme, Bakiye, Durum
- Durum: Güncel (yeşil), Gecikmiş (kırmızı), Yaklaşıyor (sarı)
- Filtre: Durum, Grup, Ay
- "Ödeme Ekle" butonu
- Toplu işlem: Seçili öğrencilere SMS hatırlatma gönder (placeholder)

Ödeme Kayıt Formu:
- Öğrenci seçimi (searchable dropdown)
- Tutar, ödeme tarihi, ödeme yöntemi (nakit, havale, kredi kartı, dijital kredi)
- Açıklama
- Makbuz numarası (otomatik üret)

Kasa Defteri Sayfası:
- Günlük kasa özeti: Toplam gelir, toplam gider, bakiye
- Gelir/Gider tablosu: Tarih, Açıklama, Tür (gelir/gider), Tutar, Kategori
- Kategori: Aidat, Ek ders, Malzeme satışı, Kira, Personel, Fatura, Diğer
- Aylık grafik: Gelir vs Gider (bar chart, recharts)

Dijital Kredi Sistemi:
- Veli kredi yükler (örn: 20 ders = 2000 TL)
- Her ders katılımında 1 kredi düşer
- Bakiye azalınca uyarı

API: payments tablosu, tenant_id zorunlu
Supabase, TypeScript, koyu tema, Türkçe, shadcn/ui
```

---

## FAZ 6: VELİ PANELİ MVP
**Hedef:** Velilerin çocuklarını takip edebildiği minimal panel

### ADIM 6.1 — Veli Paneli

**v0.dev Komutu:**

```
Spor okulu veli paneli oluştur. Veliler bu panelden çocuklarını takip eder.

Auth: Supabase auth ile ayrı veli girişi. Email + şifre.
Veli-çocuk ilişkisi: parent_users tablosu (parent_user_id → athlete_id ilişkisi)

Sayfalar:

1. Giriş Sayfası:
- YİSA-S logosu, "Veli Paneli" başlığı
- Email + şifre formu
- "Şifremi unuttum" linki

2. Ana Sayfa:
- Çocuk kartları (birden fazla çocuk olabilir): Ad, yaş, grup, fotoğraf
- Her çocuk kartında: Son yoklama durumu, kalan kredi, bir sonraki ders

3. Çocuk Detay:
- Yoklama takvimi: Son 30 gün (yeşil/kırmızı/gri)
- Gelişim grafikleri: Boy/kilo trendi, performans (recharts)
- Aidat durumu: Bakiye, son ödemeler listesi
- Ders programı: Haftalık tablo görünümü

4. Duyurular:
- Tesis duyuruları listesi (tarih, başlık, içerik)
- Okundu/okunmadı işareti

5. Mesajlar (v2 — placeholder):
- Antrenörle mesajlaşma (şimdilik "yakında" yazısı)

Tasarım: Açık tema (veliler için), mobil öncelikli, PWA uyumlu
tenant_id: Subdomain'den çöz
RLS: Veli sadece kendi çocuklarının verilerini görebilir (parent_user_id filtresi)
Türkçe, shadcn/ui, Next.js 15.5, Supabase
```

---

## FAZ 7: CELF ZİNCİRİ + BAŞLANGIÇ GÖREVLERİ
**Hedef:** Tenant kurulunca 12 direktörlüğün otomatik iş üretmesi

### ADIM 7.1 — CELF Başlangıç Görev Motoru

**v0.dev Komutu:**

```
Next.js 15.5 API route oluştur. Dosya: app/api/celf-startup/route.ts

İşlev: Yeni tenant kurulduğunda 12 direktörlük için otomatik başlangıç görevleri oluşturma.

POST: { tenant_id, slug }

Otomatik üretilecek görevler (task_assignments tablosuna INSERT):

Saat 0-2: CTO Direktörlüğü
- "Veritabanı tablolarını tenant için hazırla"
- "API endpoint'lerini test et"
- "Subdomain yapılandırmasını kontrol et"

Saat 0-2: CHRO Direktörlüğü
- "14 rol tanımını oluştur (antrenör, kasa, yönetici...)"
- "Personel kayıt şablonunu hazırla"

Saat 2-6: CLO Direktörlüğü
- "KVKK aydınlatma metnini oluştur"
- "Üyelik sözleşmesi şablonunu hazırla"
- "Veli onay formunu oluştur"

Saat 2-5: CFO Direktörlüğü
- "Kasa defteri şablonunu oluştur"
- "Aidat planlarını tanımla"
- "Dijital kredi paketlerini ayarla"

Saat 2-6: CSPO Direktörlüğü
- "Kayıt formlarını hazırla"
- "Yaş gruplarına göre antrenman şablonları oluştur"
- "Gelişim ölçüm formunu hazırla"

Saat 4-8: CMO Direktörlüğü
- "Sosyal medya şablonlarını oluştur"
- "Hoş geldin e-postası şablonu hazırla"
- "Tesis tanıtım metnini yaz"

Saat 4-7: Tasarım Direktörlüğü
- "Logo önerileri hazırla (Fal AI)"
- "Kartvizit şablonu oluştur"
- "Web banner tasarla"

Saat 6-8: CPO Direktörlüğü
- "Üyelik paketlerini tanımla (başlangıç, standart, VIP)"
- "Fiyatlandırmayı hazırla"

Saat 6-9: CSO + CDO
- "Satış kiti hazırla"
- "Dashboard verilerini yapılandır"

Saat 7-9: CXO
- "Kullanım kılavuzu oluştur"
- "SSS sayfasını hazırla"

Sürekli: CRDO
- "Rakip analizi başlat"
- "İyileştirme önerileri raporla"

Her görev: { tenant_id, direktorluk, baslik, aciklama, oncelik, status: "bekliyor", tahmini_sure }

Response: { success: true, gorev_sayisi: X }
```

---

## KOMUT KULLANIM REHBERİ

### v0.dev'de Nasıl Kullanılır?

1. **v0.dev** adresine git
2. Yukarıdaki komutlardan birini kopyala
3. v0.dev chat alanına yapıştır
4. "Generate" butonuna tıkla
5. Üretilen kodu incele, "Add to Codebase" veya "Deploy" seç
6. Cursor'da birleştir, test et
7. Bir sonraki adıma geç

### Sıralama Kuralı

| Öncelik | Faz | Neden |
|---------|-----|-------|
| 1 | Faz 1 (Vitrin + Demo) | Müşteri kazanımı için olmazsa olmaz |
| 2 | Faz 2 (Tenant Oluşturma) | Onay → kurulum otomasyonu |
| 3 | Faz 3 (Güvenlik) | Veri güvenliği, tenant izolasyonu |
| 4 | Faz 5 (Franchise Panel) | Müşterinin kullanacağı panel |
| 5 | Faz 4 (Veri Robotu) | Çocuk gelişim, diferansiyasyon |
| 6 | Faz 6 (Veli Paneli) | Son kullanıcı erişimi |
| 7 | Faz 7 (CELF Zinciri) | Otomasyon, ölçekleme |

### Her Adım Sonrası Kontrol Listesi

- [ ] Kod v0.dev'de üretildi
- [ ] Cursor'a aktarıldı
- [ ] yisa-s-v0 klasöründe doğru yere kaydedildi
- [ ] Supabase migration çalıştırıldı
- [ ] Lokal test yapıldı (pnpm dev → localhost:3000)
- [ ] Vercel'e deploy edildi
- [ ] Bir sonraki adıma geçildi

---

## 4 ROBOT REFERANS TABLOSU

| Robot | Faz Bağlantısı | Kapsam |
|-------|----------------|--------|
| **YİSA-S CELF** | Faz 2, 7 | 12 direktörlük, beyin takımı, tenant kurulum tetikleme |
| **Veri Robotu** | Faz 4 | Şablon kütüphanesi, gelişim ölçümleri, referans değerler |
| **Güvenlik Robotu** | Faz 3 | Audit log, RLS, tenant izolasyonu, 3 Duvar |
| **YİSA-S Robotu** | Faz 1 | yisa-s.com vitrin, demo formu, ManyChat karşılama |

---

## TEKNOLOJİ YIĞINI

| Katman | Teknoloji |
|--------|-----------|
| Frontend | Next.js 15.5, React 19, TypeScript, Tailwind CSS |
| UI | shadcn/ui, Radix UI, Recharts |
| Backend | Next.js API Routes, Server Actions |
| Veritabanı | Supabase (PostgreSQL) |
| Auth | Supabase Auth + Cookie session |
| Dosya | Vercel Blob |
| AI | OpenAI, Anthropic, Google Gemini, Together AI, Fal AI |
| Hosting | Vercel (Edge) |
| DNS | Cloudflare (wildcard) |
| Repo | GitHub (serdincaltay-ai) |
| Mobil | PWA (manifest + service worker) |
| Bot | ManyChat (Instagram/Facebook) |

---

**Hazırlayan:** YİSA-S AI Sistemi  
**Tarih:** 9 Şubat 2026  
**Son Güncelleme:** Bu doküman her faz tamamlandığında güncellenir.
