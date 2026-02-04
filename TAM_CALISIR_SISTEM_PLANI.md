# Tam Çalışır Sistem — Uygulama Planı

**Tarih:** 4 Şubat 2026  
**Patron:** Serdinç ALTAY

---

## 1. Akış Özeti

```
Patron komut verir (Dashboard)
    → CEO/CELF işler
    → Onay Kuyruğu
    → Onayla → ceo_templates
    → COO Mağazası / Vitrin

Merve Görmezler (şifre ile giriş)
    → Vitrin: paket seçer, talep gönderir
    → Patron onaylar → tenant + kullanıcı oluşur
    → Franchise paneli: COO Mağazasından satın alır
    → Satış → celf_kasa + tenant_purchases

Patron Kasa Defteri
    → Satışları görür
    → "Ödemeyi onayla" tıklar
    → Kullanıcı ürünü kullanabilir
```

---

## 2. Yapılan Değişiklikler

### 2.1 Franchise Tesis Ayarları
- **Personel hedefleri:** Antrenör, temizlik, müdür sayıları
- **Aidat kademeleri:** 25 saat, 45 saat, 60 saat (TL/ay)
- **API:** `GET/PATCH /api/franchise/settings`
- **UI:** Ayarlar sekmesi — form ile kaydet

### 2.2 Haftalık Ders Programı
- **Tablo:** `tenant_schedule` (gun, saat, ders_adi, brans)
- **API:** `GET/POST/DELETE /api/franchise/schedule`
- **UI:** Ders Programı sekmesi — grid, ders ekle/sil

### 2.3 Satış → Kasa → Ödeme Onayı
- **Satış:** COO Mağazası "Satin Al" → `/api/sales` → `celf_kasa` + `tenant_purchases`
- **Kasa Defteri:** Gelir listesi, "Ödemeyi onayla" butonu
- **Onay:** `POST /api/kasa/approve` → `odeme_onaylandi = true` → kullanıcı ürünü kullanabilir

### 2.4 Migration
- `20260204_tenant_settings_schedule.sql`
- `20260204_celf_kasa.sql` (zaten vardı)
- Dashboard "Migrate" butonu veya `node scripts/run-full-migrations.js`

---

## 3. Kullanım Senaryosu (Merve Görmezler)

1. **Patron:** Demo talebini onayla → Merve'ye e-posta + geçici şifre
2. **Merve:** Giriş yap → Vitrin'de paket seç → Talep gönder
3. **Patron:** Talep onayla → Tenant oluşur
4. **Merve:** Franchise paneli → Ayarlar: 4 antrenör, 2 temizlik, 1 müdür; aidat 25h=500₺, 45h=700₺, 60h=900₺
5. **Merve:** Ders Programı → Haftalık dersleri ekle
6. **Merve:** COO Mağazası → Sosyal Medya Robotu "Satin Al" → 500₺
7. **Patron:** Kasa Defteri → 500₺ satışı görür → "Ödemeyi onayla"
8. **Merve:** Artık Sosyal Medya Robotunu kullanabilir

---

## 4. Belge / Bilgi Kaydı

CELF direktörlerinin ürettiği raporlar ve belgeler:
- **Mevcut:** `ceo_templates` (şablon içeriği), `patron_commands` (komut çıktısı)
- **Öneri:** Supabase Storage bucket `documents` — CELF çıktıları oraya yazılabilir
- **Tablo:** `celf_documents` (id, director_key, document_type, storage_path, created_at)

Bu yapı sonraki aşamada eklenebilir.
