# Neden Migration'lar Tek Tek Hata Veriyor?

## Özet

**İlk tarama yetersiz kaldı** çünkü yalnızca `supabase/migrations/` içindeki CREATE TABLE ile INSERT kolonlarını karşılaştırdım. Asıl sorun: **uzak veritabanı şeması migration dosyalarından değil, başka scriptlerden geliyor.**

---

## Kök Neden

| Durum | Açıklama |
|-------|----------|
| **Uzak DB nasıl oluştu?** | `YISA-S_TUM_TABLOLAR_TEK_SQL.sql`, `RUN_ALL_MIGRATIONS.sql`, `RUN_ROBOTS_CELF_ONLY.sql` gibi migration dışı scriptlerle |
| **Şema farkı** | Bu scriptlerdeki tablo şemaları, `supabase/migrations/` dosyalarındakinden farklı |
| **CREATE TABLE IF NOT EXISTS** | Tablo varsa hiçbir şey yapmıyor; mevcut (eski) şema aynen kalıyor |
| **Trigger'lar** | `prevent_core_rules_modify` gibi trigger'lar migration dosyalarında yok, uzak DB'de var |

---

## İlk Taramada Eksik Kalanlar

| Eksik | Açıklama |
|-------|----------|
| **Migration dışı scriptler** | `YISA-S_TUM_TABLOLAR_TEK_SQL.sql` vb. hiç taranmadı |
| **Trigger'lar** | `core_rules` UPDATE engelleyen trigger migration'larda yok |
| **packages** | `asama2_tenant_schema` farklı migration; uzak `packages` şeması farklı (kolon adları, unique constraint) |
| **Gerçek uzak şema** | Uzak DB’ye bağlanılmadığı için hangi kolonun eksik olduğu görülemedi |

---

## INSERT Kullanan Tüm Migration'lar ve Riskler

| Migration | Tablo | ON CONFLICT | Risk |
|-----------|-------|-------------|------|
| seed_robots_directorates | robots, celf_directorates, role_permissions, core_rules | var | ✅ Düzeltildi |
| asama2_tenant_schema | roles, packages | var | packages: unique index eklendi |
| add_cspo_directorate | celf_directorates | var | ✅ create_robot_tables ALTER'ları yeterli |
| ceo_routines_seed | ceo_routines | yok (WHERE NOT EXISTS) | ceo_routines şeması YISA-S_TUM’dan |
| franchise_subdomains | franchise_subdomains | var | Tablo bu migration'da oluşuyor, düşük risk |
| v0_template_library | v0_template_library | var | Tablo bu migration'da oluşuyor, düşük risk |
| gelisim_olcum | reference_values | yok | Tablo bu migration'da oluşuyor, düşük risk |

---

## Ne Yapılmalı?

1. **Şu anki migration'lar** – Yapılan düzeltmeler (`create_robot_tables` ALTER'ları, `core_rules` DO NOTHING, `packages` ALTER + unique index) yeterli olmalı.
2. **İleride** – Uzak DB’ye `supabase db pull` veya SQL ile şema kontrolü yapılırsa, migration’lar gerçek şemaya göre güncellenebilir.
3. **Tek seferde repair** – Tüm olası eksikleri gideren tek bir “legacy repair” migration yazılabilir; fakat hangi tablonun hangi kolondan eksik olduğu bilinmediği için tam kapsamlı olması zor.

---

## Özet

İlk tarama sadece migration dosyalarına baktı; uzak DB’nin farklı scriptlerle oluştuğu ve trigger’ların migration’larda olmadığı hesaba katılmadı. Bu yüzden her hata ayrı ayrı çıktı. Şu anki düzeltmelerle push devam ettirilebilir.
