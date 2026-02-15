# YİSA-S — Patron → Asistan → Direktör Hiyerarşisi ve Onay Akışı

Bu belge: **Komutu kim gönderir**, **asistan ne yapar**, **direktörler nerede devreye girer**, **onaylarsanız ne olur** ve **mevcut ekranlar** tek yerde toplar.

---

## 1. Hiyerarşik yapı

```
Patron (siz)
    │
    ▼
Asistan (CIO + CEO + CELF ağ geçidi)
    │
    ├── CIO: Komutu analiz eder, hangi direktörlüğe gideceğine karar verir
    ├── CEO: Görev tipi (rapor, kod, tasarım vb.) ve direktör atar
    └── CELF: İlgili direktörlük AI'ını çalıştırır (tek bir alanda, sınırlı prompt)
    │
    ▼
Direktörlükler (CELF_DIRECTORATES)
    CFO, CTO, CIO, CMO, CHRO, CLO, CSO_SATIS, CPO, CDO, CISO, CCO, CSO_STRATEJI, CSPO
    Her biri kendi tetikleyici kelimeleri ve veri erişimi ile çalışır; dışına çıkmaz.
    │
    ▼
Çıktı → Patron Onay Kuyruğu (veya Patron ise doğrudan tamamlandı)
```

- **Komutu gönderen:** Her zaman **Patron** (veya yetkili rol). Dashboard chat’e yazan kişi = komutu veren.
- **Asistan:** Sizin komutunuzu alır → CIO/CEO ile yönlendirir → CELF ile ilgili **direktörlüğe** sevk eder. Direktörler sadece kendi alanında (örn. cimnastik seviye = CSPO, finans = CFO) çalışır; prompt’lar o alanla sınırlıdır.
- **Onay Kuyruğu:** Sadece **patron komutları** buradan gelir. Buradaki her satır = bir patron komutu; “Gönderen” sütunu komutu veren e-posta (genelde Patron).

---

## 2. Onay Kuyruğu — Ne görürsünüz?

| Sütun | Açıklama |
|-------|----------|
| **Gönderen** | Komutu gönderen kişi (Patron e-posta veya "Patron"). Buradan gelen tüm komutlar patron komutudur. |
| **Tip / Direktör** | Görev tipi (rapor, kod vb.) + Hangi direktörlük üretti (örn. CSPO, CFO). |
| **Başlık** | Komut metni (örn. "Cimnastik için 10 seviyeli sporcu değerlendirme sistemi oluştur"). |
| **Asistan özeti** | Kısa açıklama: Hangi direktör hazırladı, ne yapıldı, onaylarsanız ne olur (uygulamaya geçer / GitHub push vb.). |
| **Durum** | Bekliyor / Onaylandı / Reddedildi / İptal. |
| **İşlem** | Onayla / Reddet / İptal; onaylı ve commit varsa **Push Et**. |

- **“Bu işi kim gönderdi?”** → **Gönderen** sütunundaki e-posta. Hepsi patron komutu olduğu için kaynak = Patron (siz veya sizin yetkilendirdiğiniz dashboard kullanıcısı).
- **“İçeriğini / neden bu yapılmış?”** → **Asistan özeti** ve **Başlık**. İsterseniz satıra tıklayıp tam çıktıyı (displayText) gösteren detay/modal eklenebilir; şu an özet tabloda gösteriliyor.

---

## 3. Onaylarsanız ne olur?

- **Onayla:** İş onaylanır; `patron_commands.status = 'approved'`, `durum = 'tamamlandi'`. Commit hazırsa **Push Et** ile GitHub’a gönderilir; kod/rapor uygulamaya geçer.
- **Reddet:** Kayıt reddedilir; iş uygulamaya alınmaz.
- **İptal:** Bekleyen veya onaylanmış kayıt iptal edilir.
- **Değiştir / Geliştir:** Şu an UI’da “Değiştir” ayrı akış; ileride “Bunu geliştirin” ile asistan yeniden çalıştırılabilir.

---

## 4. Direktörler sayfası ile ilişki

- **Dashboard → CELF Direktörlükleri** (`/dashboard/directors`): Her direktörlük (CFO, CTO, CSPO vb.) için başlangıç görevleri ve tetikleme butonları.
- **Bekleyen onaylar:** Aynı sayfada “X iş onay bekliyor” ve direktör kartında “Onay Kuyruğunda görüntüle” linki. Böylece “Şu direktörlükte şu iş bekliyor” görülür; oradan **Onay Kuyruğu**’na gidip içeriğe bakıp Onayla/Reddet/Push yaparsınız.

Akış: **Patron komutu** → Asistan (CIO/CEO/CELF) → **Direktör** (örn. CSPO) çıktı üretir → **Onay Kuyruğu**’na düşer → Siz **Direktörler** veya **Onay Kuyruğu**’ndan görürsünüz → Onaylarsanız iş uygulamaya / GitHub’a geçer.

---

## 5. Özet — İstediğiniz düzenlemelerin karşılığı

| İstek | Mevcut durum |
|-------|----------------|
| “Komutu kim gönderdi?” | **Gönderen** sütunu: Patron e-posta (veya "Patron"). Buradan gelenler hep patron komutu. |
| “Asistan burada açıklasın” | **Asistan özeti** alanı: Hangi direktör, ne yapıldı, onaylarsanız ne olur. |
| “Onaylarsam direkt çalışsın / push” | Onayla → durum tamamlandı; commit varsa **Push Et** ile GitHub’a push. |
| “Onay Kuyruğu sadece patron komutları” | Evet; kaynak `patron_commands`, hepsi patron (veya yetkili) tarafından tetiklenir. |
| “Direktörler sayfasında bekleyen iş” | Direktör kartında “X beklemede” + “Onay Kuyruğunda görüntüle” linki; üstte “X iş onay bekliyor”. |
| “Onayla / Reddet / İptal / Geliştir” | Onayla, Reddet, İptal mevcut; “Geliştir” ileride asistanı yeniden tetikleyecek şekilde eklenebilir. |

Bu yapı ile “Bu komutu kim gönderdi?” = Gönderen sütunu; “Ne yapılmak isteniyor, neden?” = Başlık + Asistan özeti; onaylarsanız iş uygulamaya/Push ile geçer.
