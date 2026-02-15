# Uçtan Uca Test Senaryosu

**Tarih:** 4 Şubat 2026

---

## Ön Hazırlık

1. **Migration:** Supabase SQL Editor'da `supabase/TEK_SEFERDE_YENI_MIGRASYONLAR.sql` dosyasını çalıştırın.
2. **Ortam:** `.env.local` içinde `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (veya `NEXT_PUBLIC_SUPABASE_ANON_KEY`) tanımlı olsun.
3. **Çalışan site:** `npm run dev` ile uygulama açık olsun.

---

## Test 1: Patron → Komut → Onay → Şablon

| Adım | Yapılacak | Beklenen |
|------|------------|----------|
| 1 | Patron girişi → Dashboard | Giriş başarılı |
| 2 | Asistan seç (örn. Claude) → "CFO'ya aylık gider raporu şablonu hazırla" → Gönder | Komut CEO'ya gider, sonuç onay kuyruğunda |
| 3 | Onay Kuyruğu → İlgili işi gör → Onayla | Durum "onaylandı", şablon ceo_templates'e yazılır |
| 4 | Şablonlar sayfası → Kategori CFO | Yeni şablon listede |

---

## Test 2: COO Mağazası → Satış → Kasa

| Adım | Yapılacak | Beklenen |
|------|------------|----------|
| 1 | Franchise kullanıcısı ile giriş (veya demo onaylı tenant) | Franchise paneli açılır |
| 2 | COO Mağazası → Şablonlar / Robotlar | coo_templates listesi gelir |
| 3 | Bir üründe "Satin Al" (örn. Sosyal Medya Robotu 500₺) | "Satin alindi. Tutar CELF Kasaya kaydedildi." |
| 4 | Patron → Kasa Defteri | Gelir listesinde 500₺ satış görünür |
| 5 | "Ödemeyi onayla" tıkla | "Onaylandı" yazar, buton kaybolur |

---

## Test 3: Franchise Ayarlar ve Ders Programı

| Adım | Yapılacak | Beklenen |
|------|------------|----------|
| 1 | Franchise paneli → Ayarlar | Tesis bilgisi, personel hedefleri, aidat kademeleri |
| 2 | Antrenör 4, Temizlik 2, Müdür 1; 25h=500, 45h=700, 60h=900 → Kaydet | "Ayarlar kaydedildi." |
| 3 | Ders Programı → Ders Ekle → Pazartesi 09:00, "Başlangıç Grubu" | Grid'de ilgili hücrede ders adı |
| 4 | Bir ders hücresinde "Sil" | Ders kalkar |

---

## Test 4: Vitrin → Demo Talep → Onay

| Adım | Yapılacak | Beklenen |
|------|------------|----------|
| 1 | /vitrin → Web, logo, şablon seç → Ad/email gir → Seçimleri gönder | "Talebiniz alındı." |
| 2 | Patron → Onay Kuyruğu → Demo Talepleri | Yeni talep listelenir |
| 3 | Onayla | Tenant oluşur, geçici şifre mesajı (e-posta varsa) |

---

## Test 5: Açıkta Kalan Komut

| Adım | Yapılacak | Beklenen |
|------|------------|----------|
| 1 | Onay Kuyruğu sayfası | 24 saatten eski pending komut varsa sarı uyarı banner'ı |

---

## Hızlı Kontrol Listesi

- [ ] Migration çalıştı (celf_kasa, tenant_schedule, tenant_purchases, tenants kolonları)
- [ ] Patron komut → Onay → Şablon
- [ ] COO Satin Al → Kasa gelir → Ödemeyi onayla
- [ ] Franchise Ayarlar (personel, aidat) kaydediliyor
- [ ] Ders Programı ders ekle/sil
- [ ] Vitrin talep → Onay → Tenant
