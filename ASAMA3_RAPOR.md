# AŞAMA 3 RAPOR — Franchise Paneli (franchise.yisa-s.com)

**Tarih:** 2 Şubat 2026  
**Durum:** ✅ Tamamlandı — Kilitleme 🔒

---

## Yapılan İşler

### 1. Franchise Layout
- `app/franchise/layout.tsx`: Auth kontrolü — giriş yoksa `/auth/login?redirect=/franchise` yönlendirme

### 2. API Routes
- **GET /api/franchise/tenant**: Kullanıcının tenant bilgisini döner (user_tenants veya tenants.owner_id)
- **GET/POST /api/franchise/athletes**: Tenant'a ait sporcuları listeler, yeni sporcu ekler
- **GET/POST /api/franchise/staff**: Tenant'a ait personeli listeler, yeni personel ekler

### 3. Dashboard
- Tesis özeti: Üye sayısı, antrenör sayısı, aylık gelir (tenant/franchise verisinden)
- Son kayıtlar: athletes tablosundan
- Bugünün dersleri: staff verisi ile
- Tenant atanmamışsa uyarı banner'ı

### 4. Sol Menü
- Dashboard, Ogrenciler, Antrenorler, Ders Programı, **Aidat Takibi**, Saglik Takibi, COO Magazasi, Pazarlama, Personel (IK), Raporlar, Ayarlar
- Aidat Takibi: Placeholder (payments entegrasyonu sonraki aşamada)

### 5. Üye (Ogrenci) Ekleme
- Form: Ad, soyad, doğum tarihi, cinsiyet, branş, seviye, veli e-posta
- Kaydet → athletes tablosuna POST
- Tenant atanmamışsa form devre dışı

### 6. Personel Ekleme
- Form: Ad, soyad, e-posta, telefon, rol (antrenör, müdür, admin, kayıt, diğer), branş
- Kaydet → staff tablosuna POST
- Kayıtlı personel listesi gösterilir

### 7. Ayarlar
- Tesis adı ve paket (tenant verisinden, salt okunur)
- "Patron onayı ile güncellenir" notu

---

## Dosya Değişiklikleri

| Dosya | İşlem |
|-------|-------|
| app/franchise/layout.tsx | Yeni — auth koruması |
| app/franchise/page.tsx | Güncellendi — gerçek veri, formlar |
| app/api/franchise/tenant/route.ts | Yeni |
| app/api/franchise/athletes/route.ts | Yeni |
| app/api/franchise/staff/route.ts | Yeni |

---

## Önkoşul

Kullanıcının `user_tenants` veya `tenants.owner_id` ile bir tenant'a atanmış olması gerekir. Atanmamış kullanıcılar paneli görür ancak üye/personel ekleyemez (uyarı gösterilir).

**Tenant atama:** Patron panelinden demo talebi onaylandığında tenant oluşturulup user_tenants'a eklenmeli (AŞAMA 5'te).
