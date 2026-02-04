# Uçtan Uca Akış Raporu — Komut → Satış → Kasa

**Tarih:** 4 Şubat 2026  
**Durum:** Tamamlandı

---

## 1. Akış Özeti

| Adım | Ne Olur | Nerede |
|------|---------|--------|
| 1 | Patron komut verir (asistan/direktör seçerek) | Dashboard |
| 2 | CEO → CELF direktörlüğü işler | `/api/chat/flow` |
| 3 | Sonuç onay kuyruğuna düşer | `patron_commands` |
| 4 | Patron onaylar → Şablon `ceo_templates`'e kaydedilir | Onay Kuyruğu |
| 5 | Onaylı şablonlar COO Mağazasında görünür | Franchise / COO Mağazası |
| 6 | Franchise "Satin Al" tıklar → Satış kaydı | `/api/sales` |
| 7 | Tutar CELF Kasaya yazılır | `celf_kasa` |
| 8 | Kasa Defteri gelirleri listeler | `/dashboard/kasa-defteri` |

---

## 2. Yapılan Değişiklikler

### 2.1 ceo_templates → COO Mağazası
- **API:** `/api/templates` artık `coo_templates` döndürüyor (ceo_templates + templates birleşik)
- **Filtre:** Onaylı (`is_approved`) veya `durum=aktif` şablonlar mağazada
- **Franchise:** COOTab `coo_templates` kullanıyor (fallback: `templates`)

### 2.2 Satış → CELF Kasa
- **Tablo:** `celf_kasa` (gelir/gider hareketleri)
- **API:** `POST /api/sales` — amount, aciklama, product_key, template_id
- **Franchise:** "Satin Al" butonu → `/api/sales` çağrısı → `celf_kasa`'ya gelir yazılır

### 2.3 Kasa Defteri Gelir
- **API:** `/api/expenses` artık `gelirler` (celf_kasa gelir) döndürüyor
- **UI:** Kasa Defteri sayfasında "CELF Kasa Gelir" kartı ve satış listesi

### 2.4 Açıkta Kalan Komut Kontrolü
- **API:** `/api/approvals` `orphan_count` ve `unprocessed_count` döndürüyor
- **Orphan:** 24 saatten uzun süredir `pending` olan komutlar
- **UI:** Onay Kuyruğu sayfasında uyarı banner'ı

---

## 3. Migration

CELF Kasa tablosu için:
- `supabase/migrations/20260204_celf_kasa.sql`
- `node scripts/run-full-migrations.js` veya Dashboard "Migrate" butonu

---

## 4. Test Senaryosu

1. **Komut ver:** Dashboard → Asistan seç → "CFO'ya maliyet raporu şablonu hazırla" → Gönder
2. **Onayla:** Onay Kuyruğu → İlgili işi Onayla
3. **COO Mağazası:** Franchise paneli → COO Mağazası → Şablonlar sekmesi → Onaylı şablon görünmeli
4. **Satış yap:** Robot/Modül ürününde "Satin Al" tıkla
5. **Kasa kontrol:** Patron paneli → Kasa Defteri → CELF Kasa Gelir bölümünde satış listelenmeli

---

## 5. Açıkta Kalan Komut

Onay Kuyruğu sayfasında 24 saatten uzun süredir bekleyen komut varsa sarı uyarı banner'ı görünür. Bu komutları onaylayın veya iptal edin.
