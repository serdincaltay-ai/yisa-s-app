# AŞAMA 1 RAPOR — Tanıtım Sitesi (www.yisa-s.com)

**Tarih:** 2 Şubat 2026  
**Durum:** ✅ Tamamlandı — Kilitleme 🔒

---

## Yapılan İşler

### 1. Ana Sayfa (app/page.tsx)
- **Hero:** "YİSA-S ile Tesisinizi Yönetin" başlığı
- **Özellikler bölümü:** AI Robotlar, Otomatik Yönetim, Veli Takibi, Veri ile Eğitim
- **Paketler bölümü:** Starter (499₺/ay), Pro (999₺/ay), Enterprise (Özel)
- **Demo talep formu:** Ad, e-posta, telefon, tesis türü, şehir — modal içinde
- **Footer:** İletişim (e-posta, telefon, adres), Bağlantılar, Sosyal medya
- **Form → API:** `/api/demo-requests` POST ile Supabase `demo_requests` tablosuna kayıt

### 2. /demo Sayfası (app/demo/page.tsx)
- **Demo talep formu:** Supabase'e kayıt (source: "demo")
- **Şablon galerisi:** 5 örnek site tasarımı (Klasik, Modern, Minimal, Vitrin, Akademi)
- Form alanları: Ad, e-posta, telefon, tesis türü, şehir, firma adı

### 3. /fiyatlar Sayfası (app/fiyatlar/page.tsx)
- **3 paket kartı:** Starter, Pro, Enterprise
- **Karşılaştırmalı tablo:** Üye limiti, şube, robotlar, veli paneli, WhatsApp, destek, API, özelleştirme
- Başvur / İletişime Geç butonları

### 4. Veritabanı
- **Migration:** `supabase/migrations/20260202_demo_requests.sql`
  - `demo_requests` tablosu: name, email, phone, facility_type, city, notes, status, source, created_at
  - RLS: Herkes INSERT yapabilir

### 5. API
- **POST /api/demo-requests:** Form verilerini `demo_requests` tablosuna ekler

---

## Dosya Değişiklikleri

| Dosya | İşlem |
|-------|-------|
| app/page.tsx | Baştan düzenlendi |
| app/demo/page.tsx | Supabase entegrasyonu, şablon galerisi |
| app/fiyatlar/page.tsx | Yeni sayfa |
| app/api/demo-requests/route.ts | Yeni API |
| supabase/migrations/20260202_demo_requests.sql | Yeni migration |
| YISA-S_ILERLEME_HARITASI.md | Oluşturuldu |

---

## Sonraki Adım

**AŞAMA 2:** Veritabanı şeması (tenants, user_tenants, roles, packages, athletes vb.) ve RLS kuralları.

**Migration notu:** `demo_requests` tablosu için Supabase SQL Editor'da `supabase/migrations/20260202_demo_requests.sql` çalıştırılmalıdır.
