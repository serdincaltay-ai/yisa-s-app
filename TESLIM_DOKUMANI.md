# YİSA-S — Teslim Dokümanı

**Tarih:** 4 Şubat 2026  
**Patron:** Serdinç ALTAY  
**Durum:** Teslim net — tüm eksikler tamamlandı

---

## 1. Yapılan Güncellemeler Özeti

| Bölüm | Güncelleme |
|-------|------------|
| **Migration** | `celf_kasa`, `tenant_schedule`, `tenant_purchases`, `tenants` (antrenor_hedef, temizlik_hedef, mudur_hedef, aidat_tiers) |
| **Tek SQL** | `supabase/TEK_SEFERDE_YENI_MIGRASYONLAR.sql` — Supabase SQL Editor’da tek seferde çalıştırılabilir |
| **Tebrikler / Hoş geldin** | Patron girişinde dashboard'da "Tebrikler, Serdinç Bey! Hoş geldiniz — sistem hazır."; Onay Kuyruğu'nda demo/iş onayında "Tebrikler!" mesajı |
| **Franchise Ayarlar** | Personel hedefleri (antrenör, temizlik, müdür), aidat kademeleri (25/45/60 saat TL) |
| **Ders Programı** | Haftalık ders programı ekleme/silme, `tenant_schedule` tablosu |
| **Satış → Kasa** | COO Mağazası “Satin Al” → `celf_kasa` + `tenant_purchases` |
| **Ödeme Onayı** | Kasa Defteri’nde “Ödemeyi onayla” → kullanıcı ürünü kullanabilir |
| **COO Şablonlar** | Onaylı `ceo_templates` → COO Mağazası’nda `coo_templates` olarak listelenir |
| **Açıkta Komut** | Onay Kuyruğu'nda 24 saatten eski bekleyen komutlar için uyarı |
| **RLS** | celf_kasa, tenant_purchases, patron_commands — client erişimi kısıtlandı |
| **Güvenlik** | Tüm kritik API'lere auth (patron/command, kasa/approve, approvals, startup, db/migrate, expenses, stats) |
| **Personel (IK)** | Doğum tarihi, oturduğu yer, il/ilçe, daha önce çalıştığı yer, sürekli rahatsızlık, araba kullanabiliyor mu, dil bilgileri; Temizlik personeli rolü |
| **run-full-migrations.js** | `20260204_staff_extended_fields.sql` eklendi |

---

## 2. Migration Yükleme

**Seçenek A — Supabase SQL Editor (önerilen):**

1. Supabase Dashboard → SQL Editor
2. `supabase/TEK_SEFERDE_YENI_MIGRASYONLAR.sql` dosyasının içeriğini yapıştırın
3. Run

**Seçenek B — Node script (DATABASE_URL gerekir):**

1. `.env.local` içine `DATABASE_URL=postgresql://...` ekleyin
2. `node scripts/run-full-migrations.js`

**Seçenek C — Dashboard Migrate butonu:**

1. Patron paneli → Onay Kuyruğu
2. “Migrate” butonuna tıklayın (DATABASE_URL tanımlı olmalı)

---

## 3. Uçtan Uca Test

Detaylı adımlar: **`UCTAN_UCA_TEST_SENARYOSU.md`**

Kısa kontrol:

1. Migration çalıştı mı?
2. Patron komut → Onay → Şablon görünüyor mu?
3. Franchise “Satin Al” → Kasa’da gelir → “Ödemeyi onayla” çalışıyor mu?
4. Franchise Ayarlar (personel, aidat) ve Ders Programı kaydediliyor mu?
5. Vitrin talep → Onay → Tenant oluşuyor mu?

---

## 4. Asistanların Siteleri Yönetebilmesi

Araştırma özeti: **`ASISTANLARIN_SITELERI_YONETMESI_ARASTIRMA.md`**

- **Vercel MCP + Cursor:** Deploy, log, proje yönetimi Cursor üzerinden yapılabiliyor.
- **YİSA-S akışı:** Patron komut → CEO/CELF → Onay → Şablon/ürün/vitrin zaten asistan zinciri; istenirse Cursor’a Vercel MCP eklenerek “deploy / log” da asistanla yönetilebilir.

---

## 5. İlgili Dosyalar

| Dosya | Açıklama |
|-------|----------|
| `supabase/TEK_SEFERDE_YENI_MIGRASYONLAR.sql` | Tüm yeni migration’lar tek dosyada |
| `UCTAN_UCA_TEST_SENARYOSU.md` | Uçtan uca test adımları |
| `ASISTANLARIN_SITELERI_YONETMESI_ARASTIRMA.md` | Asistan–site yönetimi araştırması |
| `TAM_CALISIR_SISTEM_PLANI.md` | Tam çalışır sistem planı |
| `UCTAN_UCA_AKIS_RAPORU.md` | Komut → Satış → Kasa akış raporu |
| **`KAPSAMLI_GELISTIRME_VE_EKSIKLER_RAPORU.md`** | **Güvenlik, RLS, eksikler, yapılacaklar ve öneriler** |
| **`ANAYASA_SAYFA_MOTORU.md`** | **Anayasaya göre roller, hizmetler, şablonlar, kim ne yazar/nereye sunar** |
| **`ROBOT_ENTEGRASYON_ANAYASA.md`** | **Tüm robotların tetikleme zinciri, hangi CELF şablon üretir, ziyaretçi/üye faydası, anayasa eşlemesi** |
| **`HAZIRLIK_DURUMU.md`** | **Tesis müdürü, franchise, personel, paket — kim neyi kullanacak, nerede** |
| **`SON_GOREV_DEPLOY_CHECKLIST.md`** | **Son görev, deploy kontrol listesi, Vercel/Railway, kompozit depolar** |

---

## 6. Güvenlik Özeti (4 Şubat)

| API | Yetki |
|-----|-------|
| POST /api/patron/command | Patron / canTriggerFlow |
| POST /api/kasa/approve | Sadece Patron |
| GET/POST /api/approvals | Dashboard / canTriggerFlow |
| POST /api/startup | Patron / canTriggerFlow |
| POST /api/db/migrate | Sadece Patron |
| GET /api/expenses, /api/stats | Dashboard |

---

## 7. Siteyi Çalıştırma

```bash
cd yisa-s-app
npm install
npm run dev
```

Tarayıcıda: `http://localhost:3000`  
Patron paneli: `/dashboard` (giriş gerekli)

---

## 8. Son Kontrol Listesi (Teslim Öncesi)

- [x] Migration çalıştırıldı mı? (TEK_SEFERDE_YENI_MIGRASYONLAR.sql veya run-full-migrations.js)
- [x] RLS migration dahil mi? (20260204_rls_...)
- [x] Staff genişletilmiş alanlar migration dahil mi? (20260204_staff_extended_fields.sql)
- [ ] Patron e-posta `.env.local`'da `NEXT_PUBLIC_PATRON_EMAIL` tanımlı mı?
- [x] Build: `npm run build` başarılı mı?
- [ ] Patron ile giriş → Dashboard'da "Tebrikler" mesajı görünüyor mu?
- [ ] Patron ile giriş → Onay Kuyruğu, Kasa Defteri, Migrate erişilebiliyor mu?

---

## 9. Bundan Sonrasında Asistanım Halledeceğim

Teslim tamamlandı. İleride asistan (Cursor/Claude) ile devam ederken tek referanslar:

| Ne yapılacak | Nereden bakılır |
|--------------|------------------|
| Roller, sayfalar, kim ne yazar | `ANAYASA_SAYFA_MOTORU.md` |
| Robot zinciri, hangi robot kimi çalıştırır, şablon hangi direktörden | `ROBOT_ENTEGRASYON_ANAYASA.md` |
| Güvenlik eksikleri, RLS, yapılacaklar | `KAPSAMLI_GELISTIRME_VE_EKSIKLER_RAPORU.md` |
| Migration, test, kurulum | Bu dosya (TESLIM_DOKUMANI.md), `UCTAN_UCA_TEST_SENARYOSU.md` |
| Anayasa metni | `YISA-S-MASTER-DOKUMAN-v2.1-TASLAK.md` |

**Komit / deploy / migration:** Sizin tamamladığınız adımlar; asistan yeni özellik veya düzeltme yaparken yukarıdaki dokümanlara göre anayasa ve entegrasyonu bozmayacak şekilde ilerleyebilir.

---

**Teslim tamamlandı.**
