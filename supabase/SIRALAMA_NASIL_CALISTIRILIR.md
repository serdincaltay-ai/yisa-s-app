# Doğru sıralama: Ne zaman ne yapıldı + Supabase’de nasıl çalıştırılır

## Konuşmada yapılanların sırası (kod tarafı)

1. **Patron komut akışı** — Onay/bekleyen iş atlandı, patron_direct_done, isPatron
2. **66 şablon** — ceo_templates, SABLONLAR_TEK_SQL, API, dashboard/sablonlar
3. **patron_commands** — komut/sonuc/durum/completed_at, migration + flow’da kayıt
4. **Migration dosyaları** — 20260203_ceo_templates_ve_sablonlar, 20260203_patron_commands_komut_sonuc_durum
5. **Tek SQL (şablonlar)** — SABLONLAR_TEK_SQL.sql (66 INSERT, template_name/content uyumu)
6. **Vitrin** — VITRIN_TEK_SQL, YENI_MIGRASYONLAR’da vitrin notu, açıklama

Bu sıra “ne yapıldı” sırasıdır. **Supabase’de SQL’leri çalıştırma sırası aşağıdaki gibi olmalı.**

---

## Supabase’de SQL çalıştırma sırası (1 → 2 → 3 → 4)

Tablolar ve kısıtlar birbirine bağlı olduğu için aşağıdaki sırayla çalıştırın.

### 1) Temel tablolar (ilk kurulum veya eksik varsa)

**Dosya:** `YENI_MIGRASYONLAR_TEK_SQL.sql`

- tenants, user_tenants, athletes, demo_requests, attendance, vb. + **vitrin** (demo_requests source = vitrin) zaten bu dosyanın sonunda.
- Bu dosyayı daha önce çalıştırdıysanız 1. adımı atlayabilirsiniz.

### 2) Vitrin (sadece source = 'vitrin' eklemek istiyorsanız)

**Dosya:** `VITRIN_TEK_SQL.sql`

- Sadece demo_requests’e `source = 'vitrin'` ekler.
- **1. adımda YENI_MIGRASYONLAR_TEK_SQL’i çalıştırdıysanız** vitrin zaten uygulanmıştır; 2. adımı atlayabilirsiniz.
- Eski bir kurulumda demo_requests var ama vitrin yoksa sadece bunu çalıştırın.

### 3) ceo_templates + 66 şablon

**Önce:** `migrations/20260203_ceo_templates_ve_sablonlar.sql`  
- ceo_templates’e ad, kategori, icerik, durum, olusturan kolonları (veya tablo oluşturma).

**Sonra:** `SABLONLAR_TEK_SQL.sql`  
- DELETE (eski seed), sonra 66 INSERT (template_name, template_type, content ile).

### 4) patron_commands kolonları

**Dosya:** `migrations/20260203_patron_commands_komut_sonuc_durum.sql`

- patron_commands’a komut, sonuc, durum, completed_at kolonları.

---

## Özet tablo

| Sıra | Ne zaman çalıştır | Dosya |
|------|--------------------|--------|
| 1 | İlk kurulum veya tablolar eksikse | **YENI_MIGRASYONLAR_TEK_SQL.sql** |
| 2 | Vitrin ayrı eklenecekse (1’i atladıysanız veya sadece vitrin eksikse) | **VITRIN_TEK_SQL.sql** |
| 3 | Şablonlar için | **20260203_ceo_templates_ve_sablonlar.sql** → sonra **SABLONLAR_TEK_SQL.sql** |
| 4 | Patron komut kaydı için | **20260203_patron_commands_komut_sonuc_durum.sql** |

---

## “Hepsini yeniden 1-2-3-4 diye mi yapayım?”

- **Kod tarafında** bir şeyi yeniden yapmanız gerekmez; Patron, 66 şablon, patron_commands, vitrin hepsi projeye eklendi.
- **Sadece Supabase’de** SQL’leri bu 1→2→3→4 sırasına göre çalıştırın. Daha önce bir adımı çalıştırdıysanız (ör. YENI_MIGRASYONLAR veya vitrin) o adımı atlayıp sıradakine geçin.
- Konuşmada yaptığımız sıra (Patron → 66 şablon → patron_commands → migrate → tek SQL → vitrin) “iş yapılış sırası”dır; Supabase’deki **çalıştırma sırası** yukarıdaki 1-2-3-4 ile aynıdır ve böyle uygulamanız yeterli.
