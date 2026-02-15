# AŞAMA 2 RAPOR — Veritabanı Şeması (Supabase)

**Tarih:** 2 Şubat 2026  
**Durum:** ✅ Tamamlandı — Kilitleme 🔒

---

## Yapılan İşler

### 1. Tenants Genişletme
- `owner_id` (auth.users referansı)
- `package_type` (starter, pro, enterprise)
- `name` (ad ile eşleştirme)
- İndeks: `idx_tenants_owner_id`

### 2. user_tenants Tablosu
- `user_id`, `tenant_id`, `role`
- Roller: owner, admin, manager, trainer, staff, viewer
- UNIQUE(user_id, tenant_id)
- RLS: Kullanıcı kendi kayıtlarını görür; service tümünü yönetir

### 3. roles Tablosu
- Referans tablosu: id, name, level, description
- Seed: Patron, Franchise Sahibi, Tesis Müdürü, Antrenör, Kayıt Personeli, Veli, Sporcu

### 4. packages Tablosu
- name, slug, price, currency, features (JSONB), robot_quota, max_members, max_branches
- Seed: Starter (499₺), Pro (999₺), Enterprise (özel)
- ON CONFLICT (slug) DO UPDATE ile idempotent seed

### 5. athletes Tablosu
- tenant_id, parent_user_id (veli), name, surname, birth_date, gender, branch, level, status
- RLS: Kullanıcı sadece kendi tenant'ındaki sporcuları görür/düzenler
- İndeksler: tenant_id, parent_user_id, status

### 6. staff Tablosu
- tenant_id, user_id, name, surname, email, phone, role (admin, manager, trainer, receptionist, other), branch
- RLS: tenant izolasyonu
- Antrenör ve müdür ekleme için kullanılacak

### 7. Tenants RLS
- SELECT: owner veya user_tenants'ta atanmış kullanıcılar
- Service role tüm işlemler için

---

## Migration Dosyası

`supabase/migrations/20260202_asama2_tenant_schema.sql`

**Çalıştırma:** Supabase SQL Editor'da bu dosyanın içeriğini yapıştırıp Run.  
**Önkoşul:** `tenants` tablosu mevcut olmalı (v2.1 veya YISA-S_TUM_TABLOLAR_TEK_SQL ile oluşturulmuş).

---

## Stats API Güncellemesi

- `athletes` tablosu öncelikli (athletesTables)
- `staff` tablosu coaches sayısı için eklendi (coachesTables)
