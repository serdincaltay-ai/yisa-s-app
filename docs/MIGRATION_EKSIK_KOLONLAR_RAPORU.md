# Migration Eksik Kolon Raporu

**Tarih:** 15 Şubat 2026

## Sorun

Uzak veritabanı eski migration’larla oluşturulduğu için bazı tablolarda kolon eksik. `CREATE TABLE IF NOT EXISTS` çalıştığında tablo zaten varsa atlanıyor; mevcut şema güncellenmiyor. Sonraki seed migration’ları ise bu kolonları INSERT’te kullandığı için hata veriyor.

## Taranan migration’lar ve INSERT kullanan tablolar

| Migration | Tablo | Kullanılan Kolonlar |
|-----------|-------|---------------------|
| 20260131120003_seed_robots_directorates | robots | kod, isim, hiyerarsi_sirasi, aciklama, **ai_model**, durum |
| | celf_directorates | kod, isim, tam_isim, aciklama, sorumluluk_alanlari, sira |
| | role_permissions | rol_kodu, rol_adi, hiyerarsi_seviyesi, **aciklama** |
| | core_rules | kural_no, kural_kodu, baslik, **aciklama**, **kategori**, **zorunlu** |
| 20260131120000_add_cspo_directorate | celf_directorates | kod, isim, tam_isim, aciklama, sorumluluk_alanlari, sira |
| 20260202120000_asama2_tenant_schema | roles, packages | (CREATE ile birlikte) |
| 20260204120002_ceo_routines_seed | ceo_routines | (tablo YISA-S_TUM’dan) |
| 20260204120010_v0_template_library | v0_template_library | (CREATE ile birlikte) |
| 20260206120000_franchise_subdomains | franchise_subdomains | (CREATE ile birlikte) |
| 20260219120003_gelisim_olcum | reference_values | (CREATE ile birlikte) |

## Yapılan düzeltmeler

`20260131120002_create_robot_tables.sql` sonuna aşağıdaki ALTER’lar eklendi:

| Tablo | Eklenen kolonlar |
|-------|------------------|
| robots | ai_model |
| celf_directorates | tam_isim, aciklama, sorumluluk_alanlari, sira, ana_robot_id |
| role_permissions | aciklama |
| core_rules | aciklama, kategori, zorunlu |

## Diğer migration’lar

- **roles, packages, v0_template_library, franchise_subdomains, reference_values**: Kendi migration’larında `CREATE TABLE` ile oluşturuluyor; doğrudan INSERT kullanıyor. Sorun beklenmez.
- **ceo_routines**: `YISA-S_TUM_TABLOLAR_TEK_SQL.sql` veya eski migration’da oluşturulmuş olabilir. `ceo_routines_seed` migration’ı bu tabloya INSERT yapıyor; şema uyumluysa sorun çıkmaz.
- **role_permissions**: `YISA-S_TUM_TABLOLAR_TEK_SQL.sql` farklı şema kullanıyor (`role_code`, `role_name`). Uzak DB bizim migration’larla oluşturulduysa (`rol_kodu`, `rol_adi`) sadece `aciklama` eklendi.

## Çalıştırılacak komutlar

```powershell
npx supabase migration repair --status reverted 20260131120002
npx supabase db push
```
