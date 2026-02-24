# YİSA-S vs MobilSporcu — Birleştirilmiş Karşılaştırma Analizi

**Tarih:** Şubat 2025  
**MobilSporcu referans:** mobilsporcu.com/web-admin (Anasayfa analizi)  
**YİSA-S:** yisa-s-app (Franchise / Panel / Veli / Antrenör)

**Not:** Sözleşme & KVKK altyapısı `20260220_sozlesme_onaylari.sql` migration ile tanımlı: `sozlesme_onaylari` tablosu, RLS, `athletes.fotograf_izni`, `athletes.video_izni`.

---

## ÖZET — Hızlı Bakış Tabloları

### Tablo A: MobilSporcu'da var, YİSA-S'de YOK (Eksikler)

| # | MobilSporcu'da Var | YİSA-S Durumu | Öncelik |
|---|-------------------|---------------|---------|
| 1 | SMS kredisi (sidebar: 863) | Yok | Yüksek |
| 2 | SMS ayarları | Yok | Yüksek |
| 3 | İletişim merkezi (toplu mesaj) | Yok | Yüksek |
| 4 | Duyurular (aktif) | Placeholder "Yakında" | Yüksek |
| 5 | Ajanda (etkinlik, hatırlatma) | Yok | Orta |
| 6 | Yaklaşan doğum günleri (sağ panel, 6 adet) | Yok | Orta |
| 7 | Yaklaşan kayıt bitişleri (7 gün içi) | Yok | Orta |
| 8 | Sporcu Katılım Raporu (tarih aralığı + gün sayısı + sınıf filtresi) | Sadece son 7 gün özet | Orta |
| 9 | Giriş Yapan paneli (son giriş logları) | Yok | Orta |
| 10 | İsim arama modal (çalışan) | Header'da placeholder (işlevsiz) | Orta |
| 11 | Gelişmiş arama (İsim/Email/Telefon checkbox) | Yok | Orta |
| 12 | Ön kayıt uyarı banner ("177 Adet") | Yok | Düşük |
| 13 | Sporcu Sayaç (bar chart) | Sadece sayılar | Düşük |
| 14 | Fotoğraflar modülü | Yok | Düşük |
| 15 | Video bağlantı paylaşımı | Yok | Düşük |
| 16 | Yazılım güncellemeleri modal (changelog) | Yok | Düşük |
| 17 | Dil seçimi (TR/EN) | Yok | Düşük |
| 18 | Kullanıcı hareketleri sayfası | Yok | Düşük |
| 19 | Google Maps entegrasyonu | Yok | Düşük |
| 20 | Tawk.to canlı destek widget | Yok | Düşük |

---

### Tablo B: YİSA-S'de var, MobilSporcu'da DAHA GELİŞMİŞ (Geliştirilebilir)

| # | Ortak Özellik | MobilSporcu'daki Gelişmişlik | YİSA-S'de Geliştirilebilir |
|---|---------------|------------------------------|----------------------------|
| 1 | Dashboard mini-stat | Şube, Eğitmen, Veli, Sporcu | Kredi odaklı; Şube/Veli sayısı eklenebilir |
| 2 | Katılım / rapor | DateRangePicker, gün sayısı filtresi (1+, 2+...5+), sınıf seçici, DataTables | Tarih aralığı + gün sayısı filtresi + branş eklenebilir |
| 3 | Yoklama | Sınıf bazlı filtre | Branş filtresi var; sınıf/grup eklenebilir |
| 4 | Arama | Modal, İsim/Email/Telefon ayrı checkbox | Header arama çalışır hale getirilebilir |
| 5 | Tablo yönetimi | DataTables (sıralama, sayfalama) | Basit tablolar; client-side filtre/sıralama eklenebilir |
| 6 | Raporlama | Ayrı menü, katılım raporu tablosu | Raporlar tab placeholder; katılım raporu formatı zenginleştirilebilir |

---

### Tablo C: YİSA-S'de var, MobilSporcu'da YOK (Artılarımız)

| # | YİSA-S'de Var | MobilSporcu'da | Açıklama |
|---|---------------|----------------|----------|
| 1 | Sözleşme & KVKK onay ekranları | Yok | Franchise, personel, veli ayrı; middleware zorunluluğu |
| 2 | `sozlesme_onaylari` tablosu | Yok | tenant_id, user_id, sozlesme_tipi, onay_durumu, ip_adresi |
| 3 | `athletes.fotograf_izni`, `video_izni` | Yok | Veli onayı ile güncelleniyor |
| 4 | Modern stack (Next.js, TypeScript, Supabase) | PHP monolitik | Güncel mimari |
| 5 | Multi-tenant & subdomain | Tek tenant | *.yisa-s.com |
| 6 | PWA (manifest, Service Worker) | Yok | Ana ekrana ekleme |
| 7 | Dijital kredi sistemi | Yok | ders_kredisi, toplam_kredi, paket satış |
| 8 | Gelişim ölçümü (antrenör) | Yok | Ölçüm ekranı, geçmiş |
| 9 | Patron / CELF / COO yapısı | Yok | Merkezi yönetim, onay kuyruğu |
| 10 | Rol tabanlı UI (owner, coach, kasa) | Basit rol | Detaylı yetki ayrımı |
| 11 | Veli self-registration | Yok | Üye ol + KVKK sonrası yönlendirme |
| 12 | Yoklama durumları (present, absent, excused, late) | — | 4 durum |
| 13 | Kasa aylık rapor (gelir-gider grafik) | — | Var |
| 14 | Mağaza modülü | Yok | COO / franchise mağaza |

---

### Tablo D: Genel Özet

| Kategori | MobilSporcu | YİSA-S |
|----------|-------------|--------|
| **Güçlü** | SMS, iletişim, ajanda, doğum günü, kayıt bitiş, raporlama, fotoğraf, video, TR/EN, canlı destek | Sözleşme/KVKK, modern stack, multi-tenant, PWA, gelişim ölçümü, patron yapısı |
| **Zayıf** | Eski stack, tek tenant, sözleşme yok | SMS, duyurular, ajanda, doğum günü, gelişmiş arama, fotoğraf modülü |
| **Ortak** | Öğrenci, yoklama, aidat, kasa | Var |

---

### Sözleşme & KVKK Altyapısı (YİSA-S — `20260220_sozlesme_onaylari.sql`)

| Tablo/Kolon | Açıklama |
|-------------|----------|
| `sozlesme_onaylari` | id, tenant_id, user_id, sozlesme_tipi, onay_durumu, onay_tarihi, ip_adresi |
| `sozlesme_tipi` değerleri | franchise_sozlesme, is_sozlesmesi, gelisim_bedeli, sistem_guvenligi, kvkk, fotograf_izni, video_izni |
| RLS | Kullanıcı sadece kendi onaylarını görür/ekler |
| `athletes.fotograf_izni` | Veli onayı ile güncellenir |
| `athletes.video_izni` | Veli onayı ile güncellenir |

**MobilSporcu'da bu altyapı yok** — sözleşme onayları ve KVKK aydınlatma akışı YİSA-S'e özgü.

---

## 1. MobilSporcu — Yapı Özeti

### 1.1 Mimari
| Özellik | MobilSporcu |
|---------|-------------|
| **Stack** | PHP monolitik MVC, server-side rendering |
| **Routing** | Query string: `index.php?p=sayfa-adi` (42 route) |
| **Oturum** | PHPSESSID cookie (PHP session) |
| **Encoding** | UTF-8, Standards mode |

### 1.2 Header (Üst Çubuk)
- Logo/Brand: Kurum adı + şehir (örn: "TUZLA CİMNASTİK SK - İSTANBUL")
- Hamburger menü (sidebar toggle)
- Yazılım güncellemeleri butonu → Modal (timeline formatında güncelleme notları)
- Dil seçimi (TR/EN)
- İsim arama → Modal (text input + Ara)
- Gelişmiş arama → Modal (İsim / Email / Telefon checkbox filtreleri)
- Kullanıcı dropdown: Bilgilerim, Çıkış

### 1.3 Sol Sidebar Menü
- SMS Krediniz: 863
- Son güncellenme bilgisi
- Anasayfa
- Ajanda
- Kurumsal (alt menü)
- Kayıt (Ön Kayıt, Şubeler, Branşlar...)
- Muhasebe ve Aidatlar
- Raporlama
- Sporcu Takip
- İletişim Merkezi
- Video Bağlantı Paylaşımı
- Fotoğraflar
- Kullanıcı Hareketleri
- Uygulama Tercihleri
- SMS Ayarları

### 1.4 Dashboard Bileşenleri
| Bileşen | İçerik |
|---------|--------|
| Ön kayıt uyarı banner | "177 Adet" vb. |
| Mini-stat kartları (4) | Şube: 1, Eğitmen: 4, Veli: 873, Sporcu: 137 |
| Sporcu Katılım Raporu | Tablo (#, Sporcu İsim, Toplam Gelmediği Gün Sayısı) + DateRangePicker, gün sayısı filtresi, sınıf seçici |
| Sporcu Sayaç | CSS bar chart, legend |
| Giriş Yapan | Son giriş yapan kullanıcılar (isim + tarih), scroll |
| Sağ panel (toggle-right-box) | Yaklaşan Doğum Günleri (6), Yaklaşan Kayıt Bitişleri (0) |

### 1.5 Kütüphaneler (48 CSS, 67 JS)
jQuery 1.10, Bootstrap 3, jQuery UI, Moment.js, Select2, DateRangePicker, SweetAlert, CKEditor, Font Awesome, iCheck, DataTables, Lightbox, FancyBox, Animate.css, Modernizr, Google Maps, GTM, Tawk.to.

---

## 2. YİSA-S — Yapı Özeti

### 2.1 Mimari
| Özellik | YİSA-S |
|---------|--------|
| **Stack** | Next.js 16 (App Router), TypeScript, Supabase |
| **Routing** | Dosya tabanlı: `/franchise`, `/panel/ogrenciler`, `/veli/dashboard` vb. |
| **Auth** | Supabase Auth (JWT, cookie) |
| **Multi-tenant** | Subdomain (*.yisa-s.com), x-tenant-id header |

### 2.2 Franchise Paneli Sidebar
- Genel Bakış, Öğrenciler, Antrenörler, Ders Programı
- Ödemeler, Yoklama, Sağlık Takibi
- COO Mağazası, Pazarlama, Personel (IK), Raporlar, Mağaza, Ayarlar

### 2.3 Panel (Tesis Müdürü / Sekreter / Antrenör)
- Öğrenciler, Yoklama, Kasa (yetkiye göre)
- Ödemeler, Aidat, Mağaza, Personel
- Ders Programı
- Antrenör Paneli linki (antrenör için)

### 2.4 Veli Paneli
- Dashboard: Çocuklarım kartları (yaş, branş, son yoklama, devam %, kalan ders)
- Çocuk profil, Kredi, Gelişim, Duyurular
- Bottom nav: Dashboard, Çocuklarım, Kredi, Gelişim, Duyurular

### 2.5 Antrenör Paneli
- Bugünün dersleri, atanan sporcu sayısı, son yoklamalar
- Sporcularım, Yoklama, Ölçüm
- Sporcu gelişim geçmişi (ölçüm)

### 2.6 API Envanteri (Franchise / Panel / Veli / Antrenör)
| Modül | Endpoint'ler |
|-------|-------------|
| Franchise | `/api/franchise/tenant`, `/athletes`, `/staff`, `/schedule`, `/payments`, `/attendance`, `/kasa`, `/kasa/rapor`, `/kurulum`, `/settings`, `/kredi-ozet`, `/template-use` |
| Panel | `/api/franchise/*` (ortak) |
| Veli | `/api/veli/children`, `/api/veli/demo/children`, `/api/veli/demo/attendance`, `/api/veli/demo/payments`, `/api/veli/gelisim`, `/api/veli/kredi`, `/api/veli/uye-ol` |
| Antrenör | `/api/antrenor/dashboard`, `/api/antrenor/sporcular`, `/api/antrenor/yoklama`, `/api/antrenor/olcum`, `/api/antrenor/schedules` |
| Sözleşme | `/api/sozlesme/onay` (GET/POST) |
| Diğer | `/api/franchise/role`, `/api/payments`, `/api/student-packages`, `/api/packages` |

---

## 3. Özellik Bazlı Karşılaştırma (Detaylı)

### 3.1 Dashboard & Genel Görünüm

| Özellik | MobilSporcu | YİSA-S | Detay |
|---------|-------------|--------|-------|
| Mini-stat kartları | 4 (Şube, Eğitmen, Veli, Sporcu) | 4 (Öğrenci, Antrenör, Aylık Gelir, Kredi) | YİSA-S'te kredi odaklı |
| Ön kayıt banner | "177 Adet" uyarı | Yok | MobilSporcu'da belirgin |
| Grafik (bar/line) | Sporcu Sayaç bar chart | Yok (sadece sayılar) | MobilSporcu daha zengin |
| Son giriş logları | Giriş Yapan paneli | Yok | YİSA-S'te yok |
| Doğum günleri | Sağ panel, 6 adet, "X gün sonra" | Yok | YİSA-S'te yok |
| Kayıt bitişleri | Sağ panel, 7 gün içi | Yok | YİSA-S'te yok |
| Kredi özeti | — | Biten krediler listesi | YİSA-S'e özgü |

### 3.2 Öğrenci / Sporcu Yönetimi

| Özellik | MobilSporcu | YİSA-S | Detay |
|---------|-------------|--------|-------|
| CRUD | Var | Var (`/panel/ogrenciler`, `/api/franchise/athletes`) | Benzer |
| Katılım raporu | Tarih aralığı + gün sayısı filtresi + sınıf | Tarih bazlı yoklama, son 7 gün özet | MobilSporcu daha detaylı filtre |
| Sporcu profil | Tıklanabilir link | `/panel/ogrenciler/[id]` | Benzer |
| Dijital kredi | — | Var (`ders_kredisi`, `toplam_kredi`) | YİSA-S'e özgü |
| Gelişim ölçümü | — | Antrenör ölçüm ekranı, geçmiş | YİSA-S'e özgü |

### 3.3 Yoklama

| Özellik | MobilSporcu | YİSA-S | Detay |
|---------|-------------|--------|-------|
| Tarih seçimi | — | Var | Var |
| Branş filtresi | Sınıf seçici | Var | Var |
| Durumlar | — | present, absent, excused, late | YİSA-S daha zengin |
| Özet | — | Son 7 gün geldi/gelmedi | Var |

### 3.4 Muhasebe & Kasa

| Özellik | MobilSporcu | YİSA-S | Detay |
|---------|-------------|--------|-------|
| Kasa defteri | Muhasebe menüsü | `/kasa`, gelir/gider, kategori | Var |
| Aylık rapor | — | `/kasa/rapor`, gelir-gider grafik | Var |
| Aidat takip | Muhasebe ve Aidatlar | `/panel/aidat`, `/panel/odemeler` | Var |
| Paket satış | — | PaketSatModal, OdemeAlModal | Var |

### 3.5 İletişim & Bildirim

| Özellik | MobilSporcu | YİSA-S | Detay |
|---------|-------------|--------|-------|
| SMS kredisi | Sidebar'da 863 | Yok | MobilSporcu'da görünür |
| SMS ayarları | Menüde var | Yok | YİSA-S'te yok |
| İletişim merkezi | Menüde var | Yok | Toplu mesaj / iletişim yok |
| Duyurular | — | `/veli/duyurular` placeholder | "Yakında aktif" |
| Canlı destek | Tawk.to widget | Yok | MobilSporcu'da var |

### 3.6 Medya & Paylaşım

| Özellik | MobilSporcu | YİSA-S | Detay |
|---------|-------------|--------|-------|
| Fotoğraflar | Menüde modül | Yok | Galeri / yönetim yok |
| Video bağlantı paylaşımı | Menüde var | Yok | YİSA-S'te yok |
| Fotoğraf/Video izni | — | Veli KVKK sayfasında | YİSA-S'te sözleşme ile |

### 3.7 Raporlama

| Özellik | MobilSporcu | YİSA-S | Detay |
|---------|-------------|--------|-------|
| Raporlama menüsü | Var | Raporlar tab (placeholder) | "Detaylı raporlar veritabanı sonrası" |
| Katılım raporu | Sporcu Katılım Raporu tablosu | Yoklama özeti (farklı format) | MobilSporcu daha rapor odaklı |
| Kasa raporu | — | `/kasa/rapor` aylık | Var |

### 3.8 Ajanda & Takvim

| Özellik | MobilSporcu | YİSA-S | Detay |
|---------|-------------|--------|-------|
| Ajanda | Menüde var | Yok | Etkinlik / hatırlatma yok |
| Ders programı | — | `/panel/program` | Var (gün/saat/ders) |
| Doğum günü hatırlatma | Sağ panel | Yok | MobilSporcu'da var |
| Kayıt bitiş hatırlatma | Sağ panel | Yok | MobilSporcu'da var |

### 3.9 Arama & Filtreleme

| Özellik | MobilSporcu | YİSA-S | Detay |
|---------|-------------|--------|-------|
| İsim arama | Modal, Ara butonu | Header'da placeholder input (işlevsiz) | MobilSporcu aktif |
| Gelişmiş arama | İsim/Email/Telefon checkbox | Yok | MobilSporcu'da var |
| DataTables | Yüklü (tabloda kullanım belirsiz) | Basit tablolar | MobilSporcu daha gelişmiş tablo |

### 3.10 Sözleşme & KVKK (YİSA-S’e Özgü)

| Özellik | MobilSporcu | YİSA-S |
|---------|-------------|--------|
| Franchise sözleşmesi | — | `/sozlesme/franchise` (accordion 8 madde) |
| Personel sözleşmeleri | — | `/sozlesme/personel` (3 tab) |
| Veli KVKK + izinler | — | `/sozlesme/veli` (KVKK zorunlu, foto/video opsiyonel) |
| Onay zorunluluğu | — | Middleware: onay yoksa ilgili sayfaya yönlendirme |
| `athletes.fotograf_izni`, `video_izni` | — | Veritabanında güncelleniyor |

### 3.11 Teknik & Altyapı

| Özellik | MobilSporcu | YİSA-S |
|---------|-------------|--------|
| Dil seçimi (TR/EN) | Var | Yok |
| Yazılım güncellemeleri | Modal, timeline | Yok |
| Kullanıcı hareketleri | Menüde sayfa | Yok |
| Google Maps | Entegre | Yok |
| PWA | Yok | Var (manifest, Service Worker) |
| Subdomain / multi-tenant | — | Var (*.yisa-s.com) |
| Rol tabanlı erişim | Yönetici/Antrenör/Veli | owner, coach, kasa, personel, veli |

---

## 4. Eksiklik Matrisi (YİSA-S Tarafı)

### 4.1 Kritik (Operasyonel Etki Yüksek)
| # | Eksik | MobilSporcu Karşılığı | Öncelik |
|---|-------|----------------------|---------|
| 1 | SMS entegrasyonu | SMS kredisi, SMS ayarları, toplu mesaj | Yüksek |
| 2 | Duyurular (aktif) | — | Yüksek |
| 3 | İletişim merkezi | Toplu mesaj / veli iletişimi | Yüksek |

### 4.2 Önemli (UX İyileştirme)
| # | Eksik | MobilSporcu Karşılığı | Öncelik |
|---|-------|----------------------|---------|
| 4 | Ajanda / takvim | Etkinlik, hatırlatma | Orta |
| 5 | Yaklaşan doğum günleri | Sağ panel widget | Orta |
| 6 | Kayıt bitiş hatırlatmaları | Sağ panel widget | Orta |
| 7 | Sporcu katılım raporu (filtreli) | Tarih aralığı, gün sayısı, sınıf | Orta |
| 8 | Gelişmiş isim arama | Modal, İsim/Email/Telefon | Orta |
| 9 | Ön kayıt uyarı banner | "177 Adet" vb. | Düşük |

### 4.3 Nice-to-Have
| # | Eksik | MobilSporcu Karşılığı |
|---|-------|----------------------|
| 10 | Fotoğraf modülü | Galeri, yönetim |
| 11 | Video bağlantı paylaşımı | Link paylaşımı |
| 12 | Giriş logları (son giriş yapanlar) | Giriş Yapan paneli |
| 13 | Yazılım güncellemeleri modal | Changelog |
| 14 | Dil seçimi (TR/EN) | Çoklu dil |
| 15 | Google Maps | Harita |
| 16 | Tawk.to / canlı destek | Chat widget |

---

## 5. YİSA-S Artıları (MobilSporcu’da Zayıf / Yok)

| # | Artı | Açıklama |
|---|------|----------|
| 1 | Sözleşme & KVKK onay akışı | Franchise, personel, veli için ayrı ekranlar, middleware zorunluluğu |
| 2 | Modern stack | Next.js 16, TypeScript, Supabase |
| 3 | Multi-tenant & subdomain | Her tesis kendi subdomain’i |
| 4 | PWA | Ana ekrana ekleme, offline hazırlık |
| 5 | Dijital kredi sistemi | Öğrenci ders kredisi, paket satış |
| 6 | Gelişim ölçümü | Antrenör ölçüm ekranı, geçmiş |
| 7 | Patron / CELF / COO yapısı | Merkezi yönetim, onay kuyruğu, robotlar |
| 8 | Rol tabanlı UI | Owner, coach, kasa erişimi ayrımı |
| 9 | Veli self-registration | Üye ol formu, KVKK sonrası otomatik yönlendirme |
| 10 | Mağaza modülü | COO ürünleri, franchise mağaza |

---

## 6. Özet Tablo

| Kategori | MobilSporcu | YİSA-S |
|----------|-------------|--------|
| **Güçlü alanlar** | SMS, iletişim, ajanda, doğum günü/kayıt bitiş, raporlama, fotoğraf/video | Sözleşme/KVKK, modern mimari, multi-tenant, PWA, gelişim ölçümü, patron yapısı |
| **Zayıf alanlar** | Eski stack, tek tenant, sözleşme/KVKK yok | SMS, duyurular, ajanda, doğum günü, gelişmiş arama, fotoğraf modülü |
| **Ortak** | Öğrenci, yoklama, aidat, kasa, rapor | Var |

---

## 7. Önerilen Uygulama Sırası (YİSA-S için)

1. **Duyurular** — Velilere tesis duyurusu (tablo + API + veli sayfası)
2. **Yaklaşan doğum günleri** — Dashboard sağ panel veya widget
3. **Kayıt bitiş hatırlatmaları** — `athletes` / `student_packages` vade takibi
4. **SMS entegrasyonu** — Netgsm / İleti Merkezi API, kredi takibi
5. **İletişim merkezi** — Toplu e-posta / SMS şablonları
6. **Ajanda** — Etkinlik takvimi
7. **Gelişmiş arama** — Header arama modal’ı (isim, email, telefon)
8. **Sporcu katılım raporu (gelişmiş)** — Tarih aralığı, gün sayısı filtresi

---

*Bu doküman YİSA-S yisa-s-app codebase incelemesi ve MobilSporcu analiz dokümanına dayanmaktadır.*
