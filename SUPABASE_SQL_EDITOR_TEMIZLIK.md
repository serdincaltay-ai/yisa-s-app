# Supabase SQL Editor — 377 Private Sorgu Temizliği

**Durum:** SQL Editor'da 377 kayıtlı private sorgu var. Bunların çoğu muhtemelen tekrar veya eski sürüm. Projede **kaynak dosya** olarak sadece ~46 SQL dosyası var.

---

## 1. Kaynak Dosyalar (Bunları Tutun)

Projedeki **gerçek** SQL dosyaları — bunlara karşılık gelen sorguları tutabilirsiniz:

### Migration'lar (supabase/migrations/)
```
20260130_ceo_tasks_awaiting_approval.sql
20260130_ceo_tasks_idempotency.sql
20260131_add_cspo_directorate.sql
20260131_cio_analysis_logs.sql
20260131_create_robot_tables.sql
20260131_seed_robots_directorates.sql
20260202_asama2_tenant_schema.sql
20260202_athletes_parent_email.sql
20260202_attendance.sql
20260202_demo_requests.sql
20260202_payments.sql
20260202_tenant_templates.sql
20260203_ceo_templates_ve_sablonlar.sql
20260203_demo_requests_payment.sql
20260203_demo_requests_source_vitrin.sql
20260203_patron_commands_komut_sonuc_durum.sql
20260204_athlete_health_records.sql
20260204_celf_kasa.sql
20260204_ceo_routines_seed.sql
20260204_ceo_templates_columns.sql
20260204_coo_depo_drafts_approved_published.sql
20260204_demo_requests_source_manychat.sql
20260204_isletme_profili_kalite_puani.sql
20260204_rls_celf_kasa_tenant_purchases_patron_commands.sql
20260204_staff_extended_fields.sql
20260204_tenant_settings_schedule.sql
20260204_v0_template_library.sql
```

### Ana SQL Dosyaları (supabase/)
```
YENI_MIGRASYONLAR_TEK_SQL.sql    ← İlk kurulum / temel tablolar
VITRIN_TEK_SQL.sql               ← Vitrin (demo_requests source)
SABLONLAR_TEK_SQL.sql            ← 66 şablon seed
RUN_ALL_MIGRATIONS.sql            ← Tüm migration'ları çalıştırır
TEK_SEFERDE_YENI_MIGRASYONLAR.sql
YISA-S_TUM_TABLOLAR_TEK_SQL.sql
patron-chat-ceo-tables.sql
celf-audit-and-ceo-central.sql
celf-cost-reports-and-sales-prices.sql
robot-system-tables.sql
coo-rules-table.sql
v2.1-patron-operasyon-tablolari.sql
seed-franchise-tuzla-besiktas.sql
validate-system.sql
```

---

## 2. Temizlik Stratejisi

**Önemli:** Supabase Management API snippet **silme** desteklemiyor (sadece listeleme var). Temizlik **Dashboard üzerinden manuel** yapılır.

Sorguları listelemek için:
```bash
# .env.local'e SUPABASE_ACCESS_TOKEN ekleyin (https://supabase.com/dashboard/account/tokens)
node scripts/supabase-snippets-list.js
```

### Adım 1: Favorilere Al (Tutulacaklar)
Yukarıdaki dosyalara karşılık gelen sorguları **FAVORITES**'a taşıyın veya not alın. Örn:
- "Migrations: Tenant, Finance, Staff & COO Enhancements"
- "Tenant & Finance Migrations — Cash, Schedules, Purchases"
- "Kasa, Tenant Ayarları ve COO Depo Göçleri"
- vb.

### Adım 2: Silinecekleri Belirle
Aşağıdakileri **güvenle silebilirsiniz**:
- Aynı migration'ın farklı isimli kopyaları
- "test", "eski", "backup", "kopya" içeren sorgular
- Artık kullanılmayan tek seferlik sorgular
- Tarihli eski sürümler (örn. "20260115_xxx" gibi çok eski)

### Adım 3: Dashboard'da Silme
1. **SQL Editor** → **PRIVATE (377)** listesinde her sorguya tıklayın
2. Sağ üstteki **⋮** (üç nokta) menüsüne tıklayın
3. **Delete** seçin

*Not: Bazı Supabase sürümlerinde delete/rename eksik olabiliyor; güncel sürümde olmalı.*

---

## 3. Önerilen Minimum Set (Tutulacak ~15–20 Sorgu)

Gerçekten ihtiyaç duyduğunuz sorgular:

| Sıra | Açıklama | Proje Dosyası |
|------|----------|---------------|
| 1 | Temel tablolar + vitrin | YENI_MIGRASYONLAR_TEK_SQL.sql |
| 2 | Vitrin (ayrı) | VITRIN_TEK_SQL.sql |
| 3 | CEO şablonları | migrations/20260203_ceo_templates_ve_sablonlar.sql |
| 4 | 66 şablon seed | SABLONLAR_TEK_SQL.sql |
| 5 | Patron komut kolonları | migrations/20260203_patron_commands_komut_sonuc_durum.sql |
| 6 | Tüm migration'lar | RUN_ALL_MIGRATIONS.sql |

Bunların dışındaki **350+ sorgu** büyük olasılıkla tekrar veya eski sürüm — silinebilir.

---

## 4. Özet

| Öğe | Sayı | Aksiyon |
|-----|------|---------|
| SQL Editor'da kayıtlı | 377 | Çoğu silinebilir |
| Proje kaynak dosyaları | ~46 | Bunlara karşılık gelenleri tutun |
| Önerilen minimum | ~15–20 | Favorilere alıp diğerlerini silin |

Temizlik sonrası SQL Editor daha sade ve yönetilebilir olacaktır.
