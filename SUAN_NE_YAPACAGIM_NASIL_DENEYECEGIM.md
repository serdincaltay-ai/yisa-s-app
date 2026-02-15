# YİSA-S — Şimdi Ne Yapacağım / Nasıl Deneyeceğim

**Tarih:** 30 Ocak 2026  
**Amaç:** Sistemi çalıştırmak ve Asistan’ı denemek için tek sayfa rehber.

---

## 1. Cursor kurulum çakışması kapatıldı

- **Kural eklendi:** `.cursor/rules/cursor-kurulum-yasak.mdc`
- **Ne yapıyor:** Cursor (IDE) otomatik “kurulum görevi” yapmaz; sistem sadece **Patron talimatıyla** değiştirilir. Paneldeki **Asistan robot** ile çakışma engellenir.
- **Sonuç:** Cursor kendi kendine `npm install` / kurulum / akış değişikliği yapmaz; Asistan’ın çalışma alanı korunur.

---

## 2. Şimdi sen ne yapacaksın (sırayla)

### Adım 1 — Proje klasörüne geç

- Windows: Dosya Gezgini ile `YISA_S_APP\yisa-s-app` klasörüne git.
- Veya PowerShell/CMD:  
  `cd "c:\Users\info\OneDrive\Desktop\YISA_S_APP\yisa-s-app"`

### Adım 2 — Uygulamayı başlat

- **A)** `TEK_KOMUTLA_BASLAT.bat` dosyasına çift tıkla  
  **veya**  
- **B)** Aynı klasörde terminal açıp:  
  `npm run go`  
  (Bu: `npm install` + `npm run dev` çalıştırır.)

### Adım 3 — Tarayıcıyı aç

- Adres çubuğuna yaz: **http://localhost:3000**
- Giriş yap (varsa); Dashboard’a geç.

### Adım 4 — Asistan’ı dene

1. **Chat / Asistan** alanına bir mesaj yaz (örn. “Merhaba” veya “Bugün ne yapalım?”).
2. **“Bu mu demek istediniz?”** ekranı gelmeli; **Şirket İşi** veya **Özel İş** seç.
3. **Özel İş** seçersen: Asistan (Claude) yanıt verir; CELF’e gitmez.
4. **Şirket İşi** seçersen: CEO → CELF çalışır; sonuç **Onay kuyruğu**na düşer; Dashboard’dan Onayla/Reddet/İptal yapabilirsin.

---

## 3. Nasıl deneyeceğim (kısa test)

| Ne test ediyorsun | Ne yaparsın | Beklenen |
|-------------------|-------------|----------|
| Uygulama açılıyor mu | `npm run go` veya bat çift tık → http://localhost:3000 | Sayfa açılır |
| İmla / ilk adım | Chat’e mesaj yaz → “Bu mu demek istediniz?” | Şirket İşi / Özel İş seçenekleri |
| Özel iş (Asistan) | “Özel İş” seç → basit bir soru yaz | Claude yanıtı (CELF’e gitmez) |
| Şirket işi (CELF) | “Şirket İşi” seç → “Kısa bir durum özeti ver” | Sonuç onay kuyruğunda |
| Onay kuyruğu | Dashboard → Onay kuyruğu | Bekleyen iş listesi; Onayla / İptal |

---

## 4. Bir şey çalışmazsa

- **Sayfa açılmıyor:** Proje klasöründe `npm run go` çalıştırdığından emin ol; hata mesajını oku.
- **“Bu mu demek istediniz?” gelmiyor:** Tarayıcıda F12 → Console; `/api/chat/flow` isteği 200 mü kontrol et.
- **Asistan yanıt vermiyor:** `.env.local` içinde `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `GOOGLE_API_KEY` dolu mu kontrol et (TEK_SEFERLIK_ESKI_KOD.md ve CELF_MERKEZ_API_ATAMALARI.md).
- **Supabase hatası:** Supabase SQL’i bir kez çalıştırdıysan tablolar vardır; yoksa `supabase/YISA-S_TUM_TABLOLAR_TEK_SQL.sql` dosyasını Supabase SQL Editor’da çalıştır.

---

## 5. Komutlar nerede çalışır

- **Terminal komutları** (`npm run go`, `npm run dev`): Proje kökünde (`yisa-s-app` klasöründe).
- **Panel Asistan / CELF:** Tarayıcıda http://localhost:3000 → Chat ve Dashboard.
- Ayrıntı: **HANGI_KOMUT_NEREDE_CALISIR.md**

---

**Özet:** Cursor’un kurulum görevi kural ile engellendi; sistem senin verdiğin komutlarla çalışır. Şimdi `npm run go` (veya bat) ile başlat, http://localhost:3000 aç, chat’ten Asistan’ı dene.
