# YİSA-S Uçtan Uca Test Rehberi

## Hazırlık

1. **Sunucu**: `npm run dev` veya `node node_modules/next/dist/bin/next dev`
2. **Tarayıcı**: http://localhost:3000
3. **Giriş**: Patron email (serdincaltay@gmail.com) ile giriş yapın

---

## Test 1: Şirket İşi → CEO → CELF → Patron Onay

1. Dashboard'a gidin
2. Chat'e yazın: **"Finans raporu hazırla"**
3. Bekleyin: İmla düzeltmesi gelecek → **"Evet, Şirket İşi"** tıklayın
4. Kontrol: CFO direktörlüğüne gitmeli, AI yanıt üretmeli
5. Sonuç: **Patron Onay** paneli açılmalı
6. **Onayla** tıklayın
7. **Rutin Görev** veya **Bir Seferlik** seçin

**Beklenen**: CFO (Gemini/GPT) yanıt üretir, onay kuyruğuna eklenir.

---

## Test 2: Özel İş → Asistan (CELF'e gitmez)

1. Chat'e yazın: **"Benim için tatil önerileri listele"**
2. İmla sonrası **"Evet, Özel İş"** seçin
3. Kontrol: Claude yanıt vermeli, CELF'e gitmemeli
4. **Kaydetmek ister misiniz?** → İsteğe bağlı Kaydet

---

## Test 3: Spor Direktörlüğü (CSPO)

1. Chat'e yazın: **"Hareket havuzunu kontrol et"**
2. Şirket İşi seçin
3. Kontrol: CSPO direktörlüğüne gitmeli
4. Onaylayın

---

## Test 4: Başlangıç Görevleri

1. Dashboard'da **"Tüm Robotları Başlat"** butonuna tıklayın
2. Kontrol: Direktörlükler ilk görevlerini yapacak
3. Onay gerektiren görevler **Onay Kuyruğu**'na düşer
4. **Onay Kuyruğu** sayfasına gidin: `/dashboard/onay-kuyrugu`

---

## Test 5: Vitrin'e İş Gönderme

1. Onay kuyruğundan bir işi **Onayla**
2. Franchise/Vitrin sayfasına gidin: `/dashboard/franchises`
3. Onaylanan içerik franchise vitrinlerine deploy edilir (COO süreci)

**Not**: Vitrin'e otomatik gönderim, onaylanan `patron_commands` kayıtlarına dayanır. COO/Vitrin entegrasyonu için franchise ve tenant kayıtları gerekir.

---

## Kontrol Listesi

| Adım | Kontrol | Durum |
|------|---------|-------|
| 1 | Giriş yapılabiliyor | |
| 2 | İstatistikler görünüyor | |
| 3 | Takvim/saatli görünüm açılıyor | |
| 4 | Chat gönderiliyor | |
| 5 | İmla onayı geliyor | |
| 6 | Şirket işi CFO'ya gidiyor | |
| 7 | Patron onay paneli açılıyor | |
| 8 | Onayla → Rutin/Bir seferlik | |
| 9 | Başlangıç görevleri tetikleniyor | |
| 10 | Onay kuyruğu çalışıyor | |

---

## Hata Durumunda

- **"API anahtarları yok"**: `.env.local` içinde GOOGLE_API_KEY, OPENAI_API_KEY kontrol edin
- **"Supabase bağlantısı yok"**: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
- **"robots tablosu yok"**: `supabase/RUN_ALL_MIGRATIONS.sql` çalıştırın
- **"Yetkisiz"**: Giriş yapılmış mı? PATRON_EMAIL veya yetkili rol
