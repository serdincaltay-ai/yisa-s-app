# Patron Paneli — Nasıl Çalışır? Kaç Panel Var?

Bu doküman: **Senin panelin nasıl çalışıyor**, **CELF nedir**, **hangi kısaltmalar ne anlama geliyor**, **Cursor ne yapıyor** sorularına cevap verir.

---

## 1. Cursor Ne Yapar? Siteyi Bozuyor mu?

**Hayır.** Cursor, kod yazarken sana yardım eden bir AI asistanıdır. **Canlı sitede hiçbir şeyi değiştirmez.**

- Cursor = Kod editörü içinde çalışan yardımcı
- Sen "şunu yap" dersen → Cursor kod dosyalarını düzenler
- Değişiklikler **sadece sen `git push` yaptığında** Vercel’e gider ve site güncellenir
- Yani: **Sen yapmadıkça site değişmez.** Cursor bilerek bozmaz; sadece senin talimatına göre kod yazar.

---

## 2. Senin Panelin Kaç Tane? (Patron)

**Tek ana panel:** `/dashboard` (Komuta Merkezi)

Sol menüde **9 sayfa** var:

| # | Menü | URL | Ne için |
|---|------|-----|---------|
| 1 | Ana Sayfa | `/dashboard` | Chat, özet, komut gönder |
| 2 | Direktörler | `/dashboard/directors` | 12 direktör ne üretiyor, ne çalışıyor |
| 3 | CELF | `/dashboard/celf` | CELF merkez, direktörlere komut |
| 4 | 10'a Çıkart | `/dashboard/onay-kuyrugu` | Onay bekleyen işler, demo talepleri |
| 5 | Franchise / Vitrin | `/dashboard/franchises` | Açılmış tesisler |
| 6 | Franchise Yönetim | `/dashboard/franchise-yonetim` | Tesis yönetimi |
| 7 | Kasa Defteri | `/dashboard/kasa-defteri` | Finans |
| 8 | Şablonlar | `/dashboard/sablonlar` | Direktörlük şablonları |
| 9 | Raporlar | `/dashboard/reports` | Raporlar |

**Özet:** Sen **1 panel** kullanıyorsun; içinde **9 sayfa** var.

---

## 3. CELF Nedir? Hangi Kısaltmalar Ne?

**CELF** = Merkezdeki 12 direktörlük sistemi. Komut gönderdiğinde CEO bu direktörlere dağıtır.

### Direktör Kısaltmaları (C, H, S vs.)

| Kodu | Adı | Ne ile ilgili |
|------|-----|----------------|
| **CFO** | Finans | Bütçe, gelir, gider, tahsilat |
| **CTO** | Teknoloji | Kod, API, sistem, deploy |
| **CIO** | Bilgi Sistemleri | Veri, database, tablo |
| **CMO** | Pazarlama | Kampanya, reklam, sosyal medya |
| **CHRO** | İnsan Kaynakları | Personel, eğitim, performans |
| **CLO** | Hukuk | Sözleşme, patent, KVKK |
| **CSO_SATIS** | Satış | Müşteri, sipariş, CRM |
| **CPO** | Ürün | Şablon, tasarım, UI |
| **CDO** | Veri | Analiz, rapor, dashboard |
| **CISO** | **Güvenlik** | Audit, erişim, şifre |
| **CCO** | Müşteri | Destek, şikayet |
| **CSO_STRATEJI** | Strateji | Plan, hedef, büyüme |
| **CSPO** | Spor | Antrenman önerisi, sağlık tarama |
| **COO** | Operasyon | Tesis açılış, rutin işler |
| **RND** | AR-GE | Araştırma, geliştirme |

**"C"** = Chief (Baş), **"O"** = Officer (Yönetici). Örn: **CISO** = Chief Information Security Officer = Bilgi Güvenliği = **Güvenlik**.

---

## 4. Çalışma Mantığı Nerede?

| Doküman | İçerik |
|---------|--------|
| **SITE_CALISMA_MANTIGI.md** | Site nasıl çalışıyor, subdomain’ler, demo → satış → tesis akışı |
| **KIM_HANGI_SAYFAYA_GIRER.md** | Kim hangi sayfaya girer |
| **ROBOT_ENTEGRASYON_ANAYASA.md** | Patron Asistan → Siber Güvenlik → CEO → CELF zinciri |
| **CELF_MERKEZ_12_DIREKTORLUK.md** | 12 direktörlük listesi |

---

## 5. Akış Özeti (Sen Ne Yapıyorsun?)

1. **Chat’e yazıyorsun** → Patron Asistan cevaplar
2. **"CEO'ya Gönder"** veya **"10'a Çıkart'a Gönder"** dersen → Komut CEO’ya gider
3. **CEO** → Komutu uygun direktöre yollar (CFO, CTO, CISO, CSPO vb.)
4. **Direktör** → İşi yapar (şablon, kod, rapor vb.)
5. **Sonuç** → **10'a Çıkart** sayfasında bekler
6. **Sen onaylarsın** → Push, deploy, veritabanı güncellemesi yapılır

**Güvenlik (CISO):** Deploy, commit, SQL gibi işlemlerde önce güvenlik kontrolü yapılır; sonra CELF’e gönderilir.

---

## 6. CERF mi CELF mi?

Projede **CELF** var, **CERF** yok. CELF = Merkez direktörlük sistemi.

---

## 7. Özet Cümleler

- **Cursor:** Kod asistanı; siteyi sen değiştirmedikçe değiştirmez.
- **Panel sayısı:** 1 Patron paneli, 9 sayfa.
- **CELF:** 12 direktörlük (CFO, CTO, CISO, CSPO, COO vb.).
- **CISO:** Güvenlik direktörü.
- **Çalışma mantığı:** `SITE_CALISMA_MANTIGI.md` ve `ROBOT_ENTEGRASYON_ANAYASA.md`.
