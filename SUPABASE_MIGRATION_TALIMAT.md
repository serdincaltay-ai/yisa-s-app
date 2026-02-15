# Supabase Migration — SQL Editor Talimatı

**Tarih:** 3 Şubat 2026

---

## Seçenek 1: Tek seferde (önerilen)

1. **Supabase Dashboard** → **SQL Editor** açın.
2. Proje içindeki **`supabase/YENI_MIGRASYONLAR_TEK_SQL.sql`** dosyasını açın, **tüm içeriği** kopyalayın.
3. SQL Editor’a yapıştırıp **Run** deyin.
4. Hata almazsanız tüm tablolar (tenants, user_tenants, athletes, staff, demo_requests, payments, attendance, tenant_templates, vb.) ve **demo_requests source = 'vitrin'** kısıtı oluşmuş demektir.

**Not:** Bu dosya artık `demo_requests` için `source IN ('www', 'demo', 'fiyatlar', 'vitrin')` kısıtını da ekliyor; ayrıca `20260203_demo_requests_source_vitrin.sql` çalıştırmanıza gerek kalmaz.

---

## Seçenek 2: Dosya dosya (sırayla)

SQL Editor’da aşağıdaki migration dosyalarını **sırayla** açıp içeriği yapıştırıp **Run** deyin:

1. `supabase/migrations/20260202_demo_requests.sql`
2. `supabase/migrations/20260202_asama2_tenant_schema.sql`
3. `supabase/migrations/20260202_payments.sql`
4. `supabase/migrations/20260202_attendance.sql`
5. `supabase/migrations/20260202_athletes_parent_email.sql`
6. `supabase/migrations/20260202_tenant_templates.sql`
7. `supabase/migrations/20260203_demo_requests_source_vitrin.sql`

---

## Migration sonrası kontrol

- **Table Editor**’da şunlar görünmeli: `tenants`, `user_tenants`, `athletes`, `staff`, `demo_requests`, `payments`, `attendance`, `tenant_templates`.
- Paneller (Dashboard, Franchise, Onay Kuyruğu, Kasa Defteri, vb.) veri çekerken bu tabloları kullanır; tablolar yoksa listeler boş görünür.

**Döküman sonu.**
