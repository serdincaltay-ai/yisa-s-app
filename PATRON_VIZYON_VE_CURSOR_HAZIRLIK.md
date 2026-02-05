# Patron Vizyonu — Asistan, Robot Seçimi, CEO/CELF/COO Akışı

**Tarih:** 4 Şubat 2026  
**Amaç:** Patron’un tarif ettiği tam sistemi kaydetmek; Cursor komutları ve PowerShell hazırlığı için referans.

---

## 1. ÇALIŞMA KAPSAMI

- **Proje:** YISA_S_APP
- **Çalışma klasörü:** Sadece `yisa-s-app` içinde
- **Asistan:** Cursor içinden çalışacak; sistem içerisinden
- **Sıra:** PowerShell hazırlıkları → Unsura ile test → Uygulama

---

## 2. ASİSTAN = SOHBET (Her yazdığın onay değil, komut değil)

| Patron der | Ne olur |
|------------|---------|
| Bilgi almak | Asistan yanıtlar |
| Sohbet, geliştirme, tartışma | Hepsi kayıtlı kalır |
| "Bunu komut olarak gönder" (veya buton) | Asistan CEO'ya komut olarak gönderir |

**Özet:** Her yazdığın onay değil. Sohbet de olabilir. Konuştukların, ürettiklerin hepsi kayıtlı kalır. Sadece "komut olarak gönder" dediğinde (veya butona bastığında) Asistan CEO'ya gönderir.

---

## 3. ROBOT SEÇİMİ — Canlı panel (komut karışıklığı yok)

- **Panel:** Ekranda tüm robotlar listelenir — Patron **oradan seçer**
- **Seçtiğin robotla konuş:** Gemini seçtiysen Gemini ile, Claude seçtiysen Claude ile
- **Karışıklık yok:** Yazıyla "CEO'ya gönder" demek yerine ekrandan seçim

**Robotlar (panelde):** Gemini, Claude, Cursor, Cloud, vb. — hangisini seçersen onunla konuşursun.

---

## 4. KOMUT AKIŞI — Sadece Asistan CEO'ya gönderir

1. **Patron** seçtiği robotla konuşur; yazışmalar kayıtlı kalır
2. **"Komut olarak gönder"** (buton) → Asistan CEO'ya gönderir
3. CEO → CELF → Direktörlük çalışır (avukat, muhasebeci, pazarlamacı gibi)
4. Çıktı → **Havuz** (patron panelinde) — direktörlerin ürettiği işler
5. Patron havuzdan görür, düzeltme notu ekleyebilir
6. **Onayladığı anda:** Push, commit, deploy — hepsi otomatik
7. CEO alır → vitrin, veritabanı, ilgili yere gönderir
8. **Rutin:** "Rutin olarak yapılsın" seçtiysen → rutin görev olur, otomatik tekrarlanır

### Havuz ve Onay

- **Havuz:** Patron panelinde direktörlerin (CFO, CMO, CLO vb.) ürettiği işler listelenir
- **Her yazdığın onay değil:** Sohbet de olabilir; sadece havuzdaki işe "Onayla" bastığında onay olur
- **Onayladığında:** Push, commit, deploy otomatik; CEO vitrin/veritabanına gönderir

---

## 5. COO / VİTRİN / FRANCHISE

- **COO:** Vitrin = franchise sistemi
- **Demo:** Firma sahibi başvurur → Patron görüşür → Vitrin'de seçim yapar (web, logo, şablon, robot, öğrenci sayısı)
- **Ödeme:** 1.500 $ + seçimlere göre; tohum (aylık) — öğrenci artınca tohum düşer
- **Kullanıcı/şifre:** Patron "10'a çıkart, şu tenant'a kullanıcı adı ve şifre oluştur" der → CELF/COO oluşturur
- **Firma sahibi:** Vitrin'den seçer (personel, ders programı, Instagram/WhatsApp robotu, reklam, şablon, site, logo)
- **Ödeme alınınca:** COO → muhasebe; Patron onayı → tenant aktif, kullanıcı/şifre YISA-S'te kullanılır

---

## 6. YISA-S.COM — Firma sitesi

- **Adres:** yisa-s.com (veya yisaesas.com) — patron şirketinin sitesi
- **Bölümler:** Franchise, demo, hisse hikayesi, YISA-S tanıtımı
- **Demo başvurusu:** Form doldurur → demo_requests → Patron panelinde
- **Demo sonrası:** Kullanıcı adı/şifre verilir → Vitrin'den seçim → Ödeme → Tenant aktif

---

## 7. MEVCUT SİSTEM vs İSTENEN

| Özellik | Mevcut | İstenen |
|---------|--------|---------|
| CEO'ya gönder | Metin algılama | **Buton** — ekrandan tıkla, karışıklık yok |
| Robot seçim paneli | ❌ | Tüm robotlar panelde, seçtiğinle konuş |
| Başlangıç AI (Gemini) | Kısmen (imla) | Varsayılan sohbet = Gemini |
| Direktör sayfası / iş | Var (directors) | Çıktı orada dursun, Patron düzeltme yapsın |
| Onay → COO → DB | Kısmen | Tam akış: Onay → COO → CEO → şablonlar/veri havuzu |
| Vitrin / demo / tenant | Var | Tam flow: demo → vitrin → ödeme → tenant |
| Güvenlik, tenant, şablon, CELF, GitHub, Cursor, Vercel | Var | Hepsi aktif, Beşiktaş Tuzla ile başla |

---

## 8. CURSOR KOMUTLARI (Döndüğünüzde)

Aşağıdaki komutları Cursor'a verebilirsiniz:

```
1. "PATRON_VIZYON_VE_CURSOR_HAZIRLIK.md dosyasını oku. Asistan panelinde tüm robotlar listelensin (Gemini, Claude, Cursor, Cloud). Patron hangisini seçerse onunla konuşsun. Başlangıçta Gemini seçili."

2. "CEO'ya gönder: Metin yerine EKRANDA BUTON olsun. Konu netleşince Patron 'CEO'ya Gönder' butonuna tıklasın, Asistan CEO'ya göndersin. Komut karışıklığı olmasın."

3. "Sadece Asistan CEO'ya gönderir. Patron başka yere göndermez. CEO aldığı komuta göre iş yapar, veritabanına koyar (patron veri havuzu)."

4. "Direktörlük çıktıları kendi sayfasında dursun. Patron onaylayınca COO → CEO → veritabanı."

5. "Vitrin, demo, tenant, ödeme akışını tamamla. Beşiktaş Tuzla Cimnastik ile başla."
```

---

## 9. POWERSHELL HAZIRLIK

### 9.1 Ortam kontrolü

```powershell
cd C:\Users\info\OneDrive\Desktop\claude\proje\YISA_S_APP\yisa-s-app
if (Test-Path .env.local) { Write-Host "OK: .env.local var" } else { Write-Host "UYARI: .env.local yok" }
```

### 9.2 Bağımlılık ve çalıştırma

```powershell
cd C:\Users\info\OneDrive\Desktop\claude\proje\YISA_S_APP\yisa-s-app
npm install
npm run dev
```

### 9.3 API test (Unsura / manuel)

```powershell
# Health
Invoke-RestMethod -Uri "http://localhost:3000/api/health" -Method GET | ConvertTo-Json

# Chat flow (Patron sohbet)
$body = '{"message":"Merhaba, sistem durumu nedir?","user_id":"test"}'
Invoke-RestMethod -Uri "http://localhost:3000/api/chat/flow" -Method POST -Body $body -ContentType "application/json" | ConvertTo-Json -Depth 5

# Vitrin demo
$demo = '{"name":"Test","email":"demo@yisa-s.com","phone":"555","facility_type":"jimnastik","city":"Istanbul","source":"vitrin"}'
Invoke-RestMethod -Uri "http://localhost:3000/api/demo-requests" -Method POST -Body $demo -ContentType "application/json" | ConvertTo-Json
```

### 9.4 Mevcut TEST_POWERSHELL.ps1

`yisa-s-app/TEST_POWERSHELL.ps1` zaten var; Vitrin, Demo, Chat, Health testleri içerir. Çalıştırmak için:

```powershell
cd C:\Users\info\OneDrive\Desktop\claude\proje\YISA_S_APP\yisa-s-app
.\TEST_POWERSHELL.ps1
```

---

## 10. ÖZET — Yapılacaklar sırası

1. **PowerShell hazırlık:** .env.local, npm install, npm run dev
2. **Unsura ile test:** Health, Chat flow, Vitrin, Demo
3. **Cursor ile uygulama:**
   - Robot seçim paneli (Gemini/Claude/Cursor/Cloud)
   - "CEO'ya gönder" / "Cloud'a gönder" = komut tetikleyicisi
   - Direktör sayfasında iş + düzeltme + onay → COO → DB
   - Vitrin/demo/tenant/ödeme tam akışı
4. **Beşiktaş Tuzla Cimnastik:** İlk franchise olarak başlat

---

**Bu dosya:** Patron vizyonu, mevcut durum, Cursor komutları ve PowerShell hazırlığı tek yerde. Döndüğünüzde buradan devam edin.
