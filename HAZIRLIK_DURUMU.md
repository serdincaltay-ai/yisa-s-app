# YISA-S Hazırlık Durumu — Kim Neyi Kullanacak?

Bu dokümanda: tesis müdürü ders programı, franchise sosyal medya robotu, antrenör/çocuk ölçümleri, personel bilgi alanları ve paket/fiyat görünürlüğü tek tek “hazır mı, nerede, nasıl” şeklinde özetlenmiştir.

---

## 1. Tesis müdürü — haftalık ders programı

| Soru | Cevap |
|------|--------|
| **Kullanabilecek mi?** | Evet. Franchise paneline giriş yapan tesis müdürü (veya yetkili kullanıcı) haftalık ders programı oluşturabilir. |
| **Nerede?** | **Franchise paneli** → sol menü **“Ders Programi”** sekmesi. |
| **Robot üzerinden mi?** | Hayır. Doğrudan arayüzden: gün, saat, ders adı, atanacak antrenör (personel listesinden) seçilir; ekleme/silme listeleme yapılır. İleride bir “program üreten” robot eklenebilir; şu an zemin (veri yapısı ve API) hazır. |
| **Zemin hazır mı?** | Evet. `tenant_schedule` tablosu ve `/api/franchise/schedule` (GET/POST/DELETE) kullanılıyor; personel listesi Ders Programı sekmesine bağlı. |

---

## 2. Franchise / firma sahibi — Sosyal Medya Robotu

| Soru | Cevap |
|------|--------|
| **Kullanabilecek mi?** | Satın alabilir; satın alma sonrası “kullanım” arayüzü/entegrasyonu henüz yok. |
| **Nasıl kullanacak?** | 1) **Franchise paneli** → **COO Mağazası** → **Robotlar** → “Sosyal Medya Robotu” → **Satın Al**. 2) Ödeme CELF kasaya kaydedilir, Patron onayı sonrası `tenant_purchases` ile tesisin satın aldığı ürün kaydı oluşur. 3) Şu an robotun “açma/kapatma” veya “içerik planı çalıştırma” gibi doğrudan kullanım ekranı/akışı yok. |
| **Şablonlar hazır mı?** | Evet. CEO/CELF tarafında “Sosyal Medya İçerik Planı” gibi şablonlar tanımlı; COO Mağazası’nda **Şablonlar** sekmesinde hazır şablonlar listelenir ve **Kullan** ile tesisinize atanabilir. Sosyal medya robotu satın alındıktan sonra bu şablonlarla entegre çalışacak “zemin” (ürün kaydı) var; robotun kendisini çalıştıracak ekran/akış ileride eklenebilir. |

---

## 3. Antrenörler ve çocuk bilgileri / ölçümleri

| Soru | Cevap |
|------|--------|
| **Ölçümler nerede yapılacak?** | Veri yapısı: `athletes` (çocuk temel bilgiler), `athlete_health_records` (sağlık/kayıt notları). Arayüz: Franchise panelinde **Sağlık** sekmesi var; detaylı “ölçüm girişi” (boy, kilo, performans vb.) alanları ve antrenör yetkisiyle giriş akışı sınırlı/placeholder. |
| **Kim girecek?** | Hedef: Antrenör veya yetkili personel. Şu an franchise paneli girişi yapan kullanıcı (tesis müdürü / admin) bu verileri girebilir; antrenör rolüne özel “sadece kendi grubundaki çocuklar” kısıtı ve ölçüm formu netleştirilebilir. |
| **Hangi robot bilgilendirme yapacak?** | **CSPO** (CELF): `athletes` ve sağlık kayıtlarını okuyup antrenman programı / gelişim özeti üretebilir. Çocuk ham verisi dışarı açılmaz; analiz CELF tarafında. İletişim süreçleri (veliye otomatik özet vb.) için zemin var; raporlama şablonları ve tetikleyiciler ileride genişletilebilir. |

---

## 4. Başvuru yapan franchise yetkilisi — personel bilgileri (5 antrenör, 1 temizlik, 1 tesis müdürü)

| Soru | Cevap |
|------|--------|
| **Bu kişilerin bilgilerini girebilecek mi?** | Evet. Franchise paneli → **Personel (IK)** sekmesinden personel eklenir; rol olarak Antrenör, Müdür, Temizlik personeli vb. seçilebilir. |
| **Hangi alanlar hazır?** | **Mevcut:** Ad, Soyad, E-posta, Telefon, Rol (Antrenör, Müdür, Admin, Kayıt, Diğer), Branş. **Yeni eklenen (zemin hazır):** Doğum tarihi, Oturduğu yer (adres), İl, İlçe, Daha önce çalıştığı yer, Sürekli rahatsızlık, Araba kullanabiliyor mu, Dil bilgileri. Bu alanlar hem veritabanında (`staff` tablosu) hem Personel Ekle formunda mevcut; kullanıcılar doldurabilir. |
| **Temizlik / müdür seçimi** | Rol listesinde **Antrenör**, **Müdür**, **Temizlik personeli**, **Kayıt**, **Admin**, **Diğer** seçenekleri var. 5 antrenör, 1 temizlik, 1 tesis müdürü eklemek mümkün. |

---

## 5. Paket seçenekleri ve fiyatlar

| Soru | Cevap |
|------|--------|
| **Paket seçenekleri hazır mı?** | Evet. **Starter**, **Pro**, **Enterprise** paketleri tanımlı; özellik listesi ve fiyat (Starter 499 ₺/ay, Pro 999 ₺/ay, Enterprise “Özel”) gösteriliyor. |
| **Kullanıcılar nerede görecek?** | 1) **Vitrin:** `/vitrin` — Canlı fiyat hesaplama (giriş ücreti + aylık baz + paket/şablon seçimine göre). 2) **Fiyatlar sayfası:** `/fiyatlar` — Tüm paketler, özellikler ve fiyatlar. 3) **Ana sayfa:** Paket özeti ve “Fiyatlar” linki. Demo talebi veya franchise başvurusu bu paket bilgisiyle yapılabilir. |
| **Sadece rakam mı?** | Hayır. Fiyatlar sayfasında paket adı, açıklama, özellik listesi (check/çarpı) ve fiyat (₺/ay veya “Özel”) birlikte gösteriliyor. İsterseniz ek paket seçenekleri veya sadece rakam alanları ayrıca tanımlanabilir. |

---

## Özet tablo

| Konu | Hazır mı? | Nerede / Nasıl |
|------|-----------|-----------------|
| Tesis müdürü haftalık ders programı | Evet | Franchise → Ders Programi sekmesi |
| Franchise Sosyal Medya Robotu satın alma | Evet | Franchise → COO Mağazası → Robotlar → Satın Al |
| Sosyal medya robotu satın sonrası kullanım ekranı | Kısmen (zemin var) | Şablonlar COO’da; robot “çalıştırma” arayüzü eklenebilir |
| Çocuk bilgileri / ölçüm veri yapısı | Evet | `athletes`, `athlete_health_records`; Franchise Sağlık sekmesi |
| Antrenör ölçüm girişi / bilgilendirme robotu | Kısmen | CSPO analiz eder; antrenör formu detaylandırılabilir |
| Personel detay alanları (doğum, adres, dil, araba vb.) | Evet | Staff tablosu + Personel (IK) formu güncellendi |
| Paket seçenekleri ve fiyatlar | Evet | `/fiyatlar`, `/vitrin`, ana sayfa |

Bu doküman, “zemin hazır mı, şablonlar hazır mı, kullanıcılar nerede görecek” sorularına yanıt vermek için güncellenebilir.
