# ESKİ ÇALIŞMALARDAN EKLENEBİLECEKLER RAPORU

**Tarih:** 4 Şubat 2026  
**Amaç:** Kalıcı arşiv ve eski site dosyalarından, mevcut YİSA-S anayasasına uygun, programı bozmayan eklemeleri tespit etmek.  
**Onay:** Bu rapor onaylandıktan sonra geliştirmeye geçilecektir.

---

## 1. ANAYASA UYUMLULUK ÖZETİ

Mevcut YİSA-S Master Doküman v2.1 ve anayasa kurallarına göre:

| Kural | Uygulama |
|-------|----------|
| Patron kontrolü | Tüm kritik işlemler onay kuyruğundan geçer |
| BJK renkleri | #000, #fff, #E30A17 |
| "AI" → "Yapay Zeka" | Metinlerde düzeltme |
| Emoji → Lucide ikon | UI'da ikon kullanımı |
| Hane bazlı paket | Mevcut yapı korunur |
| KVKK uyumlu | Veri işleme kurallarına uyum |
| Franchise modeli | Tenant bazlı yapı korunur |

---

## 2. BİLGİ EKLEYENLER (Dokümantasyon / Referans)

### 2.1 Ders Programı Şablonu (DERS_PROGRAMI.md)

**Kaynak:** `05_DOKUMANTASYON/DERS_PROGRAMI.md`

**Öneri:** `docs/` veya `archive/` altına referans şablon olarak eklenebilir.

| Eklenebilir | Açıklama |
|-------------|----------|
| Haftalık program tablosu | Saat × Gün matrisi (Minikler, Çocuk, Gelişim, Yarışmacı, Oyun Saati) |
| Yaş grupları detayı | Süre, kapasite, günler, içerik |
| Antrenör dağılım tablosu | Grup–gün eşlemesi |
| Kontenjan durumu | Kapasite / Dolu / Boş |
| Özel günler listesi | Bayram, tatil kapalı günler |
| Program değişiklik notları | En az 1 hafta önceden duyuru kuralı |

**Mevcut durum:** ScheduleTab ve `/api/franchise/schedule` zaten var. Bu şablon **varsayılan haftalık program** veya **dokümantasyon** olarak kullanılabilir.

---

### 2.2 Fiyat Listesi Şablonu (FIYAT_LISTESI.md)

**Kaynak:** `05_DOKUMANTASYON/FIYAT_LISTESI.md`

**Öneri:** Vitrin ve fiyat sayfaları için referans veri.

| Eklenebilir | Açıklama |
|-------------|----------|
| VIP / Plus / Standart detay | Saat, değerlendirme, geçerlilik, fiyat, kredi |
| Ekstra paketler | +5, +12, +15 özellik fiyatları |
| Branş paketleri (10 ders) | Artistik, Yüzme, Voleybol, Basketbol, Atletizm, Tenis hazırlık |
| Oyun saati fiyatı | Ders fiyatının %50'si |
| Ödeme seçenekleri | Nakit (önerilen), Kart, Havale, Taksit |
| Kampanyalar | Açılış, kardeş indirimi, yenileme indirimi |
| İade politikası | Nakit vs kart/havale farkı |

**Mevcut durum:** `/fiyatlar` ve `/vitrin` sayfaları var. Bu veriler **seed data** veya **COO Mağazası şablonları** olarak eklenebilir.

---

### 2.3 Hareket Havuzu (HAREKET_HAVUZU.md)

**Kaynak:** `05_DOKUMANTASYON/HAREKET_HAVUZU.md`

**Öneri:** Antrenman veritabanı / hareket kataloğu için referans.

| Eklenebilir | Açıklama |
|-------------|----------|
| Temel hareketler | Yürüyüş, koşu, denge, esneklik, kuvvet (Latince + Türkçe) |
| Jimnastik hareketleri | Yuvarlanma, akrobatik, denge aleti |
| Hareket seviyeleri | 1–5 (Yeşil–Kırmızı) |
| Yaş grubu hedefleri | 3–5, 6–9, 10–14, Yarışmacı |
| Çember (Hoop) terminolojisi | Cart ≠ Hoop uyarısı |
| Antrenör notları | Göster–Açıkla–Parçala–Yaptır–Düzelt–Tekrarla |
| Güvenlik kuralları | Isınma, spot, minder zorunluluğu |

**Mevcut durum:** Antrenman veri tabanı modülü var. Bu içerik **hareket havuzu seed** veya **antrenör rehberi** olarak eklenebilir.

---

### 2.4 Katalog İçerik Şablonu (KATALOG_ICERIK.md)

**Kaynak:** `05_DOKUMANTASYON/KATALOG_ICERIK.md`

**Öneri:** Vitrin ve COO Mağazası için katalog metni.

| Eklenebilir | Açıklama |
|-------------|----------|
| Program açıklamaları | Minik (3–5), Çocuk (6–9), Gelişim (10–14), Oyun Saati |
| "Bizi farklı kılan" maddeler | Her program için 4 maddelik liste |
| Paket fiyat özeti | VIP, Plus, Standart |
| İletişim bloğu | Adres, telefon, e-posta, Instagram, web |
| "Neden biz?" listesi | 8 maddelik özet |

---

### 2.5 Sosyal Medya Planı (SOSYAL_MEDYA_PLAN.md)

**Kaynak:** `05_DOKUMANTASYON/SOSYAL_MEDYA_PLAN.md`

**Öneri:** CMO / sosyal medya robotu için metin şablonları.

| Eklenebilir | Açıklama |
|-------------|----------|
| 5 paylaşım şablonu | Duyuru, Kayıt çağrısı, Antrenman görseli, Bilgi paylaşımı, Oyun saati |
| Haftalık içerik planı | Gün × içerik türü × saat |
| Görsel standartları | Renkler, font, logo kullanımı, boyutlar (1080×1080, 1080×1920) |
| Hedef hashtag'ler | Ana + ek |
| Reklam metinleri | Kayıt, deneme dersi |

---

### 2.6 Resmi Çalışma Standardı (# YİSA-S – RESMİ ÇALIŞMA STANDARDI.txt)

**Kaynak:** `# YİSA-S – RESMİ ÇALIŞMA STANDARDI.txt`

**Öneri:** Dokümantasyon ve ekip rehberi.

| Eklenebilir | Açıklama |
|-------------|----------|
| 7 adımlı çalışma akışı | Patron komutu → Beyin takımı → Tasarım → Mükemmelleştirme → Kayıt & Test → Veritabanı → Deploy → Patron sunumu |
| 10 perspektif değerlendirme | Fiziksel, teknik, koordinasyon, denge vb. |
| Haftalık veli raporu şablonu | Genel durum, güçlü yönler, gelişim alanları, antrenör gözlemi, tavsiye |
| Veli bilgilendirme metni | Sistem ne yapar, kim değerlendirir, temel ilke |
| Proje yapısı | docs, frontend, backend, database |

---

## 3. ŞABLON EKLEYENLER (HTML / UI)

### 3.1 Instagram Paylaşım Şablonları

**Kaynak:** `INSTAGRAM_4_PAYLASIM.html`, `instagram-post-template.html`, `instagram-story-template.html`, `instagram-tuzla-jimnastik.html`

**Öneri:** COO Mağazası veya CMO robotu için sosyal medya şablonları.

| Şablon | Boyut | Kullanım |
|--------|-------|----------|
| Kayıt duyurusu | 540×540 / 1080×1080 | "Beşiktaş JK Artistik Jimnastik Tuzla'da!" |
| Deneme dersi | 540×540 / 1080×1080 | "ÜCRETSİZ" etiketli |
| Oyun saati | 540×540 / 1080×1080 | "%50 İNDİRİMLİ" |
| Kampanya | 540×540 / 1080×1080 | VIP ₺60.000 → ₺48.000 |
| Post (Outfit font) | 1080×1080 | "Çocuğunuzun Potansiyelini Keşfedin" |
| Story | 1080×1920 | "Kayıtlar Açık!" + CTA |

**Not:** Emoji kullanımı anayasada Lucide ikonlarla değiştirilmeli. Renkler (#000, #E30A17, #fff) uyumlu.

---

### 3.2 Site Şablonları (SITE_SABLON_1–4)

**Kaynak:** `SITE_SABLON_1_DASHBOARD.html`, `SITE_SABLON_2_MINIMALIST.html`, `SITE_SABLON_3_HERO.html`, `SITE_SABLON_4_GRID.html`

**Öneri:** Franchise vitrin sayfası varyantları veya landing page seçenekleri.

| Şablon | Özellik |
|--------|---------|
| 1 – Dashboard | 3 kolonlu (sidebar + main + right), saat, CTA, duyurular, WhatsApp |
| 2 – Minimalist | Tek kolon, logo, hero, CTA butonları, özellik sayıları |
| 3 – Hero | (Dosya tam okunmadı – benzer yapı) |
| 4 – Grid | (Dosya tam okunmadı – grid layout) |

**Kullanım:** Franchise kurulumunda "Vitrin stili seç" seçeneği olarak veya demo sayfalar.

---

### 3.3 Admin Giriş – Şifre Kurtarma

**Kaynak:** `admin-giris.html`

**Öneri:** Mevcut Supabase Auth yapısına **ek** olarak, acil durum için şifre kurtarma akışı.

| Özellik | Açıklama |
|---------|----------|
| 3 güvenlik sorusu | Patron’a özel sorular (sistem tasarlayan, dörtlü takım sayısı, YİSA-S açılımı) |
| 8 haneli şifre | Mevcut kurala uygun |
| Deneme limiti | 3 hata sonrası kurtarma moduna geçiş |

**Not:** `admin-login.tsx` içindeki kurtarma soruları listesi de referans olarak kullanılabilir.

---

### 3.4 Antrenör Yoklama Ekranı

**Kaynak:** `antrenor-yoklama.html`

**Öneri:** Antrenör panelinde yoklama UI referansı.

| Özellik | Açıklama |
|---------|----------|
| Mevcut ders bilgisi | Saat, grup, salon, antrenör |
| İstatistikler | Kayıtlı / Geldi / Gelmedi |
| Sporcu listesi | Avatar, ad, yaş, paket, kredi |
| Geldi / Gelmedi butonları | Tek tıkla işaretleme |
| Kredi sistemi bilgisi | Normal 1, yarışmacı 1.5, oyun saati 0.5 |
| Kaydet butonu | Tüm sporcular işaretlenmeden devre dışı |

**Mevcut durum:** Antrenör paneli ve yoklama API’si var. Bu ekran **UI referansı** veya **mobil yoklama sayfası** olarak uyarlanabilir.

---

### 3.5 Kayıt Formu

**Kaynak:** `kayit-formu.html`

**Öneri:** Demo talebi / lead formu için adım adım yapı.

| Adım | İçerik |
|------|--------|
| 1 – Veli bilgileri | Ad, soyad, telefon, e-posta, meslek, yakınlık, adres |
| 2 – Çocuk bilgileri | Birden fazla çocuk, ad, doğum, cinsiyet, boy/kilo, sağlık, "spora gelecek mi" |
| 3 – Anket | Beklentiler (checkbox), yetenek beklentisi, önceki spor, haftalık gün, referans |
| 4 – Paket seçimi | Standart / Plus / VIP, ödeme (nakit / taksit / kart), taksit tarihleri |

**Mevcut durum:** `demo_requests` ve vitrin formları var. Bu yapı **çok adımlı kayıt formu** şablonu olarak kullanılabilir.

---

### 3.6 Ödeme Sayfası

**Kaynak:** `odeme.html`

**Öneri:** Ödeme akışı için referans.

| Özellik | Açıklama |
|---------|----------|
| Nakit avantajı vurgusu | Tam iade, günlük fiş, rezervde para |
| Ödeme seçenekleri | Nakit (önerilen), 2 taksit, kart |
| Taksit tarihi seçimi | 1. ve 2. taksit |
| Kart uyarısı | Fatura, vergi, iade zorluğu |
| Sipariş özeti | Paket adı, detay, fiyat, toplam |
| URL parametresi | `?paket=vip|plus|standart` |

---

### 3.7 Patron / Veli / Sportif Direktör Panelleri

**Kaynak:** `patron-dashboard.html`, `veli-panel.html`, `sportif-direktor-panel.html`

**Öneri:** Mevcut panellerle karşılaştırma ve eksik blokları tamamlama.

| Panel | Eklenebilir fikirler |
|-------|----------------------|
| Patron | KPI kartları (Aktif sporcu, Tahsilat, Katılım, Memnuniyet), Onay kuyruğu, Bugünün görevleri, Hızlı raporlar, Personel durumu |
| Veli | Kredi kartı, çocuk kartları, sonraki ders, katılım haftalık görünümü, ödeme durumu, değerlendirme özeti, AI chat float |
| Sportif Direktör | Haftalık ders programı grid, kontenjan bar’ları, antrenör listesi, istatistik kartları |

**Mevcut durum:** Bu paneller zaten Next.js ile mevcut. Eksik widget’lar bu şablonlardan alınabilir.

---

## 4. TEKNİK / PWA

### 4.1 manifest.json

**Kaynak:** `06_SITE_DOSYALARI/manifest.json`

**Öneri:** PWA manifest’i mevcut projede varsa güncelleme, yoksa ekleme.

| Alan | Değer |
|------|-------|
| name | BJK Tuzla Cimnastik Spor Okulu |
| short_name | BJK Tuzla |
| theme_color | #E30A17 |
| background_color | #000000 |
| categories | sports, fitness, education |
| lang | tr |

---

### 4.2 Service Worker (sw.js)

**Kaynak:** `06_SITE_DOSYALARI/sw.js`

**Öneri:** Offline cache ve push bildirimleri için referans.

| Özellik | Açıklama |
|---------|----------|
| Cache stratejisi | Ana sayfa, manifest, ikonlar |
| Push notification | BJK Tuzla Cimnastik başlığı, ikon, vibrate |

---

## 5. FİKİR / KONSEPT

### 5.1 Index.html – YİSA-S Asistan Modal

**Kaynak:** `index.html` içindeki asistan modal’ı

**Öneri:** Vitrin sayfasında ziyaretçi sohbeti.

| Özellik | Açıklama |
|---------|----------|
| Hızlı yanıtlar | Fiyatlar, Yaş grupları, Deneme dersi |
| getReply() mantığı | Anahtar kelime bazlı yanıt (fiyat, yaş, deneme, adres) |
| Kayıt formu linki | Deneme dersi cevabında |

**Mevcut durum:** Karşılama robotu ve vitrin var. Bu basit keyword mantığı **fallback** veya **hızlı demo** olarak kullanılabilir.

---

### 5.2 YİSA-S 2.0 Master (YISA_S_2_0_MASTER.md)

**Kaynak:** Arşivdeki eski master doküman

**Öneri:** Mevcut Master v2.1 ile karşılaştırma.

| Eksik / farklı olabilecek | Not |
|---------------------------|-----|
| 10 perspektif (farklı liste) | Eski: Temel düzey, Yarışmacı düzey, Eksiklik gözlemleme vb. |
| 6 zorunlu + 14 seçimlik parametre | Paket yapısı referansı |
| 4 VIP aksiyon parametresi | Kişisel plan, antrenör raporu, doktor yönlendirme, branş yönlendirme |
| Yaş grubu programları | 3–4’ten 11’e haftalık ders sayısı, kritik alanlar |
| 42 AI görevi | Rol bazlı görev dağılımı |

---

## 6. ÖZET – ONAY İÇİN LİSTE

Aşağıdaki maddeler onaylandıktan sonra uygulanacaktır:

### A. Dokümantasyon (Bilgi) — TAMAMLANDI (4 Şubat 2026)

- [x] Ders programı şablonu → `archive/REFERANS_DERS_PROGRAMI_SABLONU.md`
- [x] Fiyat listesi şablonu → `archive/REFERANS_FIYAT_LISTESI.md`
- [x] Hareket havuzu → `archive/REFERANS_HAREKET_HAVUZU.md`
- [x] Katalog içerik → `archive/REFERANS_KATALOG_ICERIK.md`
- [x] Sosyal medya planı → `archive/REFERANS_SOSYAL_MEDYA_PLANI.md`
- [x] Resmi çalışma standardı + veli raporu → `archive/REFERANS_CALISMA_STANDARDI_VELI_RAPORU.md`

### B. Şablonlar (UI / HTML)

- [ ] Instagram post/story şablonları → COO Mağazası veya `public/templates/`
- [ ] Site şablonları (1–4) → vitrin stili seçenekleri
- [ ] Admin şifre kurtarma akışı → acil durum
- [ ] Antrenör yoklama ekranı → UI referansı / mobil
- [ ] Kayıt formu (çok adımlı) → demo/lead formu
- [ ] Ödeme sayfası mantığı → ödeme akışı

### C. Teknik

- [ ] manifest.json → PWA
- [ ] sw.js → offline / push

### D. Fikir / Konsept

- [ ] Vitrin asistan keyword yanıtları
- [ ] Master v2.0 ile v2.1 karşılaştırması (perspektif, parametre, görev listesi)

---

## 7. UYARI – YAPILMAYACAKLAR

- Mevcut API yapısını değiştirmemek
- Rol ve yetki matrisini bozmamak
- Veritabanı şemasında anayasaya aykırı değişiklik yapmamak
- "AI" kelimesini kullanmamak ("Yapay Zeka" kullanılacak)
- Emoji yerine Lucide ikon tercih etmek
- Patron onayı olmadan otomatik deploy/commit yapmamak

---

**Sonuç:** Bu rapor, eski çalışmalardan anayasaya uygun, mevcut sistemi bozmayan tüm eklenebilir öğeleri listeler. Onayınızı belirttiğinizde, seçtiğiniz maddelere göre geliştirmeye geçilecektir.
