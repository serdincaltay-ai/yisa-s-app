# Şimdi hangi klasör? — Tek sıra (karışmasın)

Pencere sistemi karışmasın diye **tek tek klasör** ve **o klasörde yapılacak tek iş** burada. Sırayla gideceksiniz.

---

## Şu an (hemen) yapmanız gereken

### 1. Hangi klasörü açacaksınız?

**tenant-yisa-s** (Tesis / Franchise paneli)

Tam yol (kendi bilgisayarınıza göre düzenleyin):

```
C:\Users\info\OneDrive\Desktop\v0 yisa s dosyamız\tenant-yisa-s
```

Cursor'da: **File → Open Folder** → bu klasörü seçin. Başka bir şey açıkken sadece bu klasör açık olsun.

---

### 2. Bu klasörde ne yapacaksınız?

**1 numaralı iş — Yoklama modülü**

- **Ne:** GELDİ / GELMEDİ / MUAF ile yoklama almak, devamsızlık için SMS tetiği (app-yisa-s'teki sms/cron API'leri kullanılacak).
- **Nerede:** `app/franchise/yoklama/` sayfası veya tenant'taki yoklama route'u. Yoksa oluşturulacak.
- **Cursor'a ne diyeceksiniz (tenant-yisa-s klasörü açıkken):**  
  *"Yoklama modülünü yap: GELDİ, GELMEDİ, MUAF butonları; ders/sporcu listesi; kayıt attendance tablosuna. Devamsızlık durumunda app-yisa-s'teki aidat-reminder / SMS API'sini kullanacak tetik."*

Bu iş bitene kadar **başka klasöre geçmeyin.** Bittikten sonra aşağıdaki sıraya göre bir sonraki klasör / işe geçersiniz.

---

## Sonraki adımlar (sıra)

| Sıra | Klasör | Yapılacak iş (tek) |
|------|--------|----------------------|
| **1** | **tenant-yisa-s** | **Yoklama modülü** (yukarıda anlatılan) ← **ŞİMDİ BURADASINIZ** |
| 2 | tenant-yisa-s | Aidat yönetimi (hatırlatma, liste, toplu düzenleme) — `app/franchise/aidatlar/` |
| 3 | tenant-yisa-s | İletişim (duyurular, anketler, eğitmen–veli mesaj) — `app/franchise/iletisim/` |
| 4 | tenant-yisa-s | Belgeler (sağlık raporu, geçerlilik uyarıları, yükleme) — `app/franchise/belgeler/` |
| 5 | tenant-yisa-s | Veli dashboard (çocuk listesi, devamsızlık özeti) — `app/veli/dashboard/` |
| 6 | tenant-yisa-s | Veli: devamsızlık görüntüleme sayfası |
| 7 | tenant-yisa-s | Veli: online aidat ödeme (İyzico/Paratika) |
| 8 | tenant-yisa-s | Veli: mesajlaşma (antrenör ile) |
| 9 | yisa-s-com | Sadece kontrol / test (vitrin, demo, fuar zaten yapıldı denildi) |
| 10 | app-yisa-s | Bu klasörde kalan varsa (BU_KLASORDE_YAPILACAKLAR.md) |

---

## Özet (tek cümle)

**Şu an:** `tenant-yisa-s` klasörünü açın → orada **sadece yoklama modülünü** (1 numaralı iş) yapın → bittikten sonra aynı klasörde 2 numaralı işe (aidat) geçin. Klasör klasör, iş iş ilerleyin; karışıklık olmasın.

Detaylı görev listesi: `docs/GOREV_YONETIMI.md`.
