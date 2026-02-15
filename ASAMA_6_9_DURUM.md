# Aşama 6–9 Durum Özeti

**Tarih:** 3 Şubat 2026

---

## 1. Migration — Sizin yapacaklarınız

**Supabase Dashboard → SQL Editor** açın.

### Seçenek A: Tek seferde (önerilen)

1. Proje içindeki **`supabase/YENI_MIGRASYONLAR_TEK_SQL.sql`** dosyasını açın.
2. **Tüm içeriği** kopyalayıp SQL Editor’a yapıştırın.
3. **Run** deyin.
4. Hata almazsanız tüm tablolar (tenants, user_tenants, athletes, staff, demo_requests, payments, attendance, tenant_templates) ve **demo_requests source = 'vitrin'** kısıtı oluşmuş demektir.

### Seçenek B: Dosya dosya (sırayla)

Aşağıdaki dosyaları **sırayla** SQL Editor’da açıp içeriği yapıştırıp **Run** deyin:

1. `supabase/migrations/20260202_demo_requests.sql`
2. `supabase/migrations/20260202_asama2_tenant_schema.sql`
3. `supabase/migrations/20260202_payments.sql`
4. `supabase/migrations/20260202_attendance.sql`
5. `supabase/migrations/20260202_athletes_parent_email.sql`
6. `supabase/migrations/20260202_tenant_templates.sql`
7. `supabase/migrations/20260203_demo_requests_source_vitrin.sql`

**Migration sonucunu** (hata var mı, tablolar görünüyor mu) not edin; Cursor çıktısıyla birlikte bildirebilirsiniz.

---

## 2. Aşama 6–9 — Cursor çıktısı (mevcut durum)

Kod tarafında **Aşama 6–9 zaten var**. Migration çalıştırıldıktan sonra paneller veri gösterecek.

| Aşama | Konu | Durum | Nerede |
|-------|------|--------|--------|
| **6** | Aidat (payments) | Var | `app/api/franchise/payments/route.ts` — GET (liste), POST (ekleme), PATCH (ödendi). Franchise panelinde Aidat sekmesi bu API’yi kullanıyor. |
| **7** | Yoklama (attendance) | Var | `app/api/franchise/attendance/route.ts` — GET (tarihe göre), POST (kayıtlar). Franchise panelinde Yoklama sekmesi bu API’yi kullanıyor. |
| **8** | Tenant kurulumu | Var | `app/api/demo-requests/route.ts` — Patron onayı (`action=decide`, `decision=approve`) → tenant oluşturulur, e-posta ile kullanıcı varsa `owner_id` ve `user_tenants` atanır. |
| **9** | Veli eşleştirme | Var | `app/api/veli/children/route.ts` — GET’te `parent_email = user.email` olan athletes otomatik `parent_user_id` ile güncellenir. `app/api/franchise/athletes/route.ts` — POST’ta `parent_email` alanı var; e-posta ile Auth kullanıcısı bulunup `parent_user_id` set ediliyor. |

**Özet:** Migration’ları Supabase’te çalıştırmanız yeterli. Tablolar oluştuktan sonra Dashboard, Franchise (Aidat, Yoklama, Öğrenciler), Onay Kuyruğu (tenant onayı), Veli paneli (çocuk listesi) veri ile çalışır.

---

## 3. Yapılan ek düzenleme

- **`supabase/YENI_MIGRASYONLAR_TEK_SQL.sql`** dosyasının sonuna **demo_requests source = 'vitrin'** kısıtı eklendi; tek dosyayı çalıştırırsanız ayrıca `20260203_demo_requests_source_vitrin.sql` çalıştırmanıza gerek kalmaz.
- **`SUPABASE_MIGRATION_TALIMAT.md`** oluşturuldu; migration adımları orada özetlendi.

**Döküman sonu.**
