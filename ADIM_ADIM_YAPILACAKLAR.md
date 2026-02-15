# YISA-S — Adım Adım Yapılacaklar

**Sıra:** PowerShell hazırlık → Unsura test → Cursor uygulama  
**Çalışma:** Sadece `yisa-s-app` klasörü  
**Asistan:** Cursor, sistem içinden

---

## ADIM 1: PowerShell hazırlık

```powershell
cd C:\Users\info\OneDrive\Desktop\claude\proje\YISA_S_APP\yisa-s-app
.\HAZIRLIK_POWERSHELL.ps1
```

Veya manuel:
```powershell
cd C:\Users\info\OneDrive\Desktop\claude\proje\YISA_S_APP\yisa-s-app
if (-not (Test-Path .env.local)) { Copy-Item .env.example .env.local }
npm install
npm run dev
```

---

## ADIM 2: Unsura ile test (sunucu açıkken)

```powershell
cd C:\Users\info\OneDrive\Desktop\claude\proje\YISA_S_APP\yisa-s-app
.\TEST_POWERSHELL.ps1
```

Kontrol edilecekler:
- Health: `http://localhost:3000/api/health`
- Vitrin: `http://localhost:3000/vitrin`
- Demo: POST `/api/demo-requests`
- Chat: POST `/api/chat/flow`

---

## ADIM 3: Cursor komutları (test sonrası uygulama)

Aşağıdaki komutları **sırayla** Cursor'a verin:

### Komut 1 — Robot seçim paneli
```
PATRON_VIZYON_VE_CURSOR_HAZIRLIK.md dosyasını oku. Asistan panelinde tüm robotlar listelensin (Gemini, Claude, Cursor, Cloud). Patron hangisini seçerse onunla konuşsun. Başlangıçta Gemini seçili. Komut karışıklığı olmasın — seçim ekrandan.
```

### Komut 2 — CEO'ya gönder = BUTON (metin değil)
```
CEO'ya gönder: Metin yerine EKRANDA BUTON olsun. Konu netleşince Patron "CEO'ya Gönder" butonuna tıklasın, Asistan CEO'ya göndersin. Sadece Asistan CEO'ya gönderir; Patron başka yere göndermez.
```

### Komut 3 — Havuz + Onay (her yazdığın onay değil)
```
Havuz: Direktörlerin (CFO, CMO, CLO vb.) ürettiği işler patron panelinde havuzda listelensin. Her yazdığı onay değil — sadece havuzda "Onayla" bastığında onay olsun. Onayladığında: push, commit, deploy otomatik; CEO vitrin/veritabanına göndersin. "Rutin olarak yapılsın" seçeneği olsun.
```

### Komut 4 — Vitrin / demo / tenant / ödeme
```
Vitrin, demo, tenant, ödeme akışını tamamla: demo_requests → Patron onayı → kullanıcı/şifre → vitrin seçim → ödeme (1.500$ + tohum) → tenant aktif. Beşiktaş Tuzla Cimnastik ile başla.
```

### Komut 5 — Altyapı aktif
```
Güvenlik robotu, tenant'lar, şablonlar, panel, CELF, GitHub, Cursor, Vercel hepsi aktif çalışsın. yisaesas.com sitesi franchise/demo bölümü hazır olsun.
```

---

## Vizyon özeti (referans)

| Öğe | Açıklama |
|-----|----------|
| Asistan | Sohbet; seçtiğin robotla konuş |
| Robot paneli | Tüm robotlar ekranda; seçtiğinle konuş, karışıklık yok |
| CEO'ya gönder | **Buton** — "komut olarak gönder" tıkla |
| Havuz | Direktörlerin işleri orada; Patron görür |
| Onay | Havuzda "Onayla" bas → push, commit, deploy otomatik |
| Rutin | "Rutin olarak yapılsın" seçilirse rutin görev olur |
| Vitrin | Demo → ödeme → tenant → firma sahibi seçim |
| Tohum | Aylık; öğrenci artınca düşer |

---

**Bu dosya:** Yapılacaklar sırası. PowerShell → Test → Cursor komutları.
