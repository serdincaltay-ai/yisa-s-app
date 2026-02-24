# YİSA-S Uluslararası Karşılaştırma Raporu

**Tarih:** 15 Şubat 2026  
**Kapsam:** Spor kulübü aidat takip, ders seçme, veli/patron/antrenör panelleri, yapay zeka, tüm özellikler

---

## İçindekiler
1. [Özet ve Genel Değerlendirme](#1-özet-ve-genel-değerlendirme)
2. [Sistem Bazlı Detaylı Özellik Listesi](#2-sistem-bazlı-detaylı-özellik-listesi)
3. [Özellik Bazlı Karşılaştırma Tabloları](#3-özellik-bazlı-karşılaştırma-tabloları)
4. [Yapay Zeka ve Otomasyon](#4-yapay-zeka-ve-otomasyon)
5. [Prizes.com Panel Değerlendirmesi](#5-prizescom-panel-değerlendirmesi)
6. [Sonuç ve Öneriler](#6-sonuç-ve-öneriler)

**Tamamlayıcı rapor:** Veli/çocuk/antrenör panel **akışları** (giriş, kayıt, ön kayıt, rezervasyon) için bkz. [VELI_COCUK_ANTRENOR_PANEL_AKISLARI_ARASTIRMA.md](./VELI_COCUK_ANTRENOR_PANEL_AKISLARI_ARASTIRMA.md).

---

## 1. Özet ve Genel Değerlendirme

### 1.1 Karşılaştırılan Sistemler

| Bölge | Sistem | Web / Panel | Odak Alanı |
|-------|--------|-------------|------------|
| Türkiye | **YİSA-S** | yisa-s-app (Franchise) | Cimnastik, spor okulları, multi-tenant |
| Türkiye | **GymTekno** | gymtekno.com, panel.gymtekno.com | Spor salonu, pilates, reformer |
| Türkiye | **Mobil Sporcu** | mobilsporcu.com/web-admin | Spor eğitim kurumları |
| Avrupa | **Glofox** (ABC Glofox) | glofox.com | Fitness studio, class booking |
| Amerika | **Mindbody** | mindbodyonline.com | Fitness, yoga, pilates, wellness |
| Amerika | **LeagueApps** | leagueapps.com | Genç spor, kulüp, turnuva |
| Amerika | **SportsEngine Motion** | sportsengine.com/motion | Cimnastik, yüzme, dans |
| Japonya | **Sgrum** | sgrum.com | Spor kulübü, okul, takım |
| Çin | **小禾帮 (Xiao He Bang)** | xiaohebang.cn | Basketbol, antrenman kurumları |
| Çin | **菲特云 (Fei Te Yun)** | fityun.cn | Spor eğitimi, yoga, dans |

---

## 2. Sistem Bazlı Detaylı Özellik Listesi

### 2.1 YİSA-S (Bizim Sistem)

**Teknoloji:** Next.js 16, TypeScript, Supabase, PWA, multi-tenant (*.yisa-s.com)

| Kategori | Özellik | Açıklama |
|----------|---------|----------|
| **Veli Paneli** | Çocuk kartları | Yaş, branş, son yoklama, devam %, kalan ders |
| | Kredi satın alma | Paket seçimi, veli tarafından ödeme |
| | Gelişim grafiği | Boy, kilo, esneklik; tarih bazlı grafik |
| | Self-registration | Üye ol + KVKK onayı zorunlu |
| | Duyurular | Placeholder ("Yakında aktif") |
| **Patron/Franchise** | Multi-tenant | Her tesis kendi subdomain |
| | Onay kuyruğu | CELF, COO, Patron onay zinciri |
| | Kasa raporu | Aylık gelir-gider grafik |
| | Mağaza modülü | COO ürünleri, franchise satış |
| **Antrenör** | Bugünün dersleri | Ders listesi, sporcu sayısı |
| | Yoklama | 4 durum: present, absent, excused, late |
| | Gelişim ölçümü | Boy, kilo, esneklik, genel değerlendirme |
| **Aidat/Ödeme** | Dijital kredi | ders_kredisi, toplam_kredi |
| | Paket satışı | OdemeAlModal, PaketSatModal |
| | Kasa defteri | Gelir/gider, kategori |
| **Sözleşme/KVKK** | Franchise, personel, veli | Ayrı ekranlar, middleware zorunluluğu |
| | Fotoğraf/video izni | athletes.fotograf_izni, video_izni |
| **Eksikler** | SMS | Yok |
| | Ajanda, doğum günü | Yok |
| | Fotoğraf modülü | Yok |
| | İletişim merkezi | Yok |

---

### 2.2 GymTekno (Türkiye)

**Teknoloji:** Bulut, web panel, mobil uygulama

| Kategori | Özellik | Açıklama |
|----------|---------|----------|
| **Geçiş Kontrol** | QR Kod | Kişiye özel dinamik QR, turnike |
| | Kiosk | Üye ve personel giriş-çıkış takibi |
| **Ödeme** | Sanal cüzdan | Mobil üzerinden temassız ödeme |
| | Borç takibi | Bakiye, taksit (örn. 15.000₺ paket, 7.500₺ ödenen) |
| | Taksit planı | Vade tarihi, kalan tutar gösterimi |
| **İletişim** | Otomatik SMS | Üyelik bitişi, borç hatırlatma, etkinlik |
| | Toplu / kişiye özel | SMS kredisi ile |
| **Ders/Seans** | Online ders | Canlı ders, seanslık satış |
| | Rezervasyon | Mobil uygulama üzerinden |
| **Yönetim** | Mali tablolar | Tüm işlemler kayıt altı |
| | Abone/antrenör | Kayıt, ölçüm verileri |
| | Randevu | Takvim, bildirim |
| | Egzersiz/beslenme | Resim, YouTube video ile program |
| | Market modülü | Ürün satışı, stok güncelleme |
| **Güvenlik** | Yedekleme | Günde 2 defa |
| | Firewall | Donanım destekli |

**Yapay zeka:** Yok (bildirilen özellik yok)

---

### 2.3 Mobil Sporcu (Türkiye)

**Teknoloji:** PHP monolitik, web-admin, mobil uygulama

| Kategori | Özellik | Açıklama |
|----------|---------|----------|
| **İletişim** | SMS kredisi | Sidebar'da görünür (örn. 863) |
| | SMS ayarları | Menüde var |
| | İletişim merkezi | Toplu mesaj |
| | Anket/onay | Velilere gönderim |
| | Online mesajlaşma | Kurum içi |
| **Dashboard** | Mini-stat | Şube, eğitmen, veli, sporcu sayısı |
| | Sporcu Katılım Raporu | Tarih aralığı, gün sayısı filtresi (1+…5+), sınıf seçici |
| | Sporcu Sayaç | Bar chart |
| | Giriş Yapan | Son giriş logları |
| | Doğum günleri | Sağ panel, 6 adet |
| | Kayıt bitişleri | 7 gün içi uyarı |
| **Medya** | Fotoğraflar | Modül var |
| | Video bağlantı paylaşımı | Var |
| **Raporlama** | Katılım raporu | DataTables, filtre |
| | PDF/Excel | İndirme |
| **Ek Modüller** | Yoklama | Var |
| | İlaç takip | Var |
| | Yemek modülü | Var |
| | Belge yükleme | Var |
| **Diğer** | Dil seçimi | TR/EN |
| | Google Maps | Entegrasyon |
| | Tawk.to canlı destek | Var |
| | Yazılım güncellemeleri | Changelog modal |
| | Gelişmiş arama | İsim/Email/Telefon checkbox |

**Eksikler:** Sözleşme/KVKK yok, tek tenant, dijital kredi yok, gelişim ölçümü yok

**Yapay zeka:** Yok

---

### 2.4 Glofox (Avrupa – ABC Glofox)

**Teknoloji:** Bulut, Member App, Pro App (iOS/Android)

| Kategori | Özellik | Açıklama |
|----------|---------|----------|
| **Uygulama** | Member App | Ders programı, rezervasyon, ödeme, 7/24 erişim |
| | Pro App | Personel: üyelik satışı, sınıf ekleme, check-in, perakende satış |
| **Rezervasyon** | Gerçek zamanlı | Tüm platformlarda anlık güncelleme |
| | Waitlist | Otomatik bekleme listesi |
| | Online/Facebook | Web ve sosyal medya entegrasyonu |
| **Ödeme** | Otomatik tahsilat | No-show azaltma |
| | Otomatik hatırlatma | Başarısız işlemde yeniden deneme |
| **İletişim** | Email / in-app | Rezervasyon onayı, değişiklik, waitlist |
| **Onboarding** | Dijital | Profil fotoğrafı, feragatname, lead yakalama |
| **Çok şube** | Tek görünüm | Tüm stüdyolar tek panel |
| **Otomasyon** | XLerate | Doğum günü, ziyaret kilometre taşı, abandoned-cart |
| | %70+ müşteri | Otomatik akışlar kullanıyor |

**Yapay zeka:** "Members at Risk" raporu – makine öğrenmesi, 15 veri noktası ile churn tahmini

---

### 2.5 Mindbody (Amerika – Global)

**Teknoloji:** Bulut, Mindbody App (2.8M+ aylık kullanıcı), Mindbody Business App

| Kategori | Özellik | Açıklama |
|----------|---------|----------|
| **Yapay Zeka** | **Messenger[ai]** | 24/7 AI ön büro asistanı |
| | Marka sesi | Özelleştirilmiş yanıtlar |
| | Otomatik rezervasyon | Sms/webchat ile |
| | Paket/üyelik satışı | AI üzerinden |
| | Human handoff | Karmaşık sorularda insana yönlendirme |
| **Tüketici Ağı** | Mindbody App | 2.8M+ aylık aktif kullanıcı |
| | Yeni müşteri | Uygulama içi keşif |
| **Finansman** | Mindbody Capital | İşletme finansmanı |
| **Rezervasyon** | Çoklu hizmet | Bir işlemde birden fazla rezervasyon |
| | Bağımlı (çocuk) | Ebeveyn adına çocuk rezervasyonu |
| | Takvim widget | Müsait/güncel olmayan günler |
| **Ödeme** | Autopay | Otomatik tahsilat |
| | Analytics 2.0 | Düşen/süresi dolan autopay takibi |
| **CRM** | Lead yönetimi | Takip, randevu, dönüşüm |
| **Entegrasyon** | Webhooks | %99.99 teslimat |
| | Attentive | Pazarlama senkronizasyonu |
| **Personel** | Ekip yönetimi | Program, performans, bordro |

---

### 2.6 LeagueApps (Amerika – Genç Spor)

**Teknoloji:** Bulut, mobil uygulama, WordPress web

| Kategori | Özellik | Açıklama |
|----------|---------|----------|
| **Kayıt** | Özelleştirilebilir alanlar | Koç, gönüllü, oyuncu için ayrı |
| | Bölüm bazlı | Takım kaptanı/koç bölüm seçimi |
| | Aile hesabı | Ebeveyn erişimi, fatura görüntüleme |
| **Ödeme** | Taksit planları | Program bazlı, birden fazla plan |
| | AutoPay | Otomatik tahsilat (2021’de $730M+ tahsilat) |
| | Kısmi ödeme | Var |
| | Hatırlatma e-postası | Otomatik |
| | Fatura, makbuz | Tam kapsamlı |
| **Platform** | Kayıt, iletişim, ödeme, program, rapor, tesis, web | Hepsi tek platform |
| | Mobil uygulama | Takım, ebeveyn, oyuncu |
| | WordPress web | Özel site |
| **Fiyatlandırma** | Gelir payı | Ücret gelirle orantılı |
| | İade | İade edilen işlemlerde işlem ücreti iadesi |

**Yapay zeka:** Belirtilmedi

---

### 2.7 SportsEngine Motion (Amerika – Cimnastik/Yüzme)

**Teknoloji:** Bulut, ücretsiz veli uygulaması (4.8/5 puan)

| Kategori | Özellik | Açıklama |
|----------|---------|----------|
| **Veli Uygulaması** | Ücretsiz | Aileler için |
| | Beceri takibi | Yüzlerce beceri, aile ile paylaşım |
| | Video | Kayıt, düzenleme, aile ile paylaşım |
| | Fotoğraf/video | Görüntüleme |
| | Program | Görüntüleme |
| | Ödeme | Hesap bakiyesi, ödeme |
| **Personel Uygulaması** | Rostere, yoklama, güncelleme, ödeme | Telefondan |
| **Finansal** | Billing Manager | Vadesi geçen hesaplar |
| | Otomatik tahsilat | Tekrarlayan ödemeler |
| | Esnek taksit | Aile dostu planlar |
| **İletişim** | Sınırsız SMS, email, push | Ücretsiz |
| **Ders/Yoklama** | Tablet check-in | Yüzücüler için self-servis |
| | Özel ders, kamp | Rezervasyon |
| **Poz satışı** | Telefon/tablet | Ürün satışı |
| **Video Producer** | Vault, tumble, rutin | Beceri ve ilerleme kaydı |
| **Desteklenen sporlar** | Cimnastik, yüzme, dans, dövüş sporları, all-star cheer | |

**Yapay zeka:** Belirtilmedi

---

### 2.8 Sgrum (Japonya)

**Teknoloji:** Mobil uygulama, ~2000 kuruluş, 40+ pro spor kulübü

| Kategori | Özellik | Açıklama |
|----------|---------|----------|
| **İletişim** | Mesaj, fotoğraf, PDF | Toplu/grup/bireysel |
| | Aile paylaşımı | Bilgileri aile ile paylaşma |
| | Devamsızlık bildirimi | Uygulama üzerinden |
| **Program** | Etkinlik takvimi | Etkinlik, not, devam/devamsızlık |
| | Ders rezervasyonu | Talep, değişim |
| **Ödeme** | Aylık ücret | Kredi kartı, market ödemesi |
| | Etkinlik/deneyim | Kredi kartı ile katılım ücreti |
| **Diğer** | Anket | Uygulama üzerinden |
| | Ürün satışı | Malzeme, forma |

**Yapay zeka:** Yok

---

### 2.9 小禾帮 Xiao He Bang (Çin)

**Teknoloji:** Bulut, WeChat mini program (veli tarafı)

| Kategori | Özellik | Açıklama |
|----------|---------|----------|
| **Öğrenci Yönetimi** | Detaylı profil | İletişim, okul, sipariş, ders tüketimi |
| | Toplu import/export | Veri aktarımı |
| **Yoklama** | Yüz tanıma | Otomatik |
| | Kart okuma | RFID benzeri |
| | Manuel | Elle işaretleme |
| | Otomatik ders düşümü | Yoklama ile birlikte |
| **Ders** | Kayıt, yenileme, transfer, dolum, iade | Tek ekranda |
| | Online izin / telafi | Var |
| **Veli (WeChat)** | Randevu, izin, kalan ders, bildirim | |
| | Öğrenme durumu | Ödev, geri bildirim |
| | Anket | Sonrası geri bildirim |
| **Gelişim** | Elektronik albüm | Fotoğraf arşivi |
| | Büyüme dosyası | İlerleme takibi |
| **Personel** | Koç saat/maaş | Otomatik hesaplama |

**Yapay zeka:** Belirtilmedi (yüz tanıma donanım/yazılım kullanımı muhtemel)

---

### 2.10 菲特云 Fei Te Yun (Çin)

**Teknoloji:** SAAS, WeChat mini program, çoklu uç

| Kategori | Özellik | Açıklama |
|----------|---------|----------|
| **Veli/Öğrenci** | Program görüntüleme | Ders, saha |
| | Tek tık randevu | Saha rezervasyonu |
| | Online kayıt/dolum | Kart, paket satın alma |
| | Kalan ders, bakiye | Detay |
| **Aile-okul** | Büyüme dosyası | Öğrenci gelişim kaydı |
| | Öğretmen-öğrenci değerlendirme | Karşılıklı puanlama |
| | Ders hatırlatma | |
| | Yoklama, notlar | Görüntüleme |
| **Mağaza** | Ürün, paket | Satın alma |
| | Kampanya | Promosyonlar |
| | Deneyim dersi | Başvuru |
| | Komisyon dağıtımı | |
| **Check-in** | Çoklu yöntem | Parmak izi, kart, manuel vb. |
| | Otomatik hatırlatma | Unutma önleme |
| | Paylaşım | Check-in ekran görüntüsü |
| **Yönetim** | Çok uçlu | Yönetim, koç, öğrenci, satış |

---

## 3. Özellik Bazlı Karşılaştırma Tabloları

### 3.1 Aidat / Ödeme Takibi

| Özellik | YİSA-S | GymTekno | Mobil Sporcu | Glofox | Mindbody | LeagueApps | SportsEngine | Sgrum | Xiao He Bang | Fei Te Yun |
|---------|:------:|:--------:|:------------:|:------:|:--------:|:----------:|:------------:|:-----:|:------------:|:----------:|
| Borç/alacak takibi | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Taksit planı | — | ✓ | — | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Sanal cüzdan | — | ✓ | — | — | — | — | — | — | — | ✓ |
| Otomatik SMS/hatırlatma | — | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ WeChat | ✓ WeChat |
| Dijital kredi/ders paketi | ✓ | Paket | — | Seans | Paket | Paket | Paket | Aylık | Ders saati | Paket |
| Senet/feragatname | — | — | — | ✓ | ✓ | — | — | — | — | — |
| AutoPay | — | — | — | ✓ | ✓ | ✓ | ✓ | ✓ | — | — |
| Kısmi ödeme | — | ✓ | — | ✓ | ✓ | ✓ | — | — | — | — |

---

### 3.2 Ders Seçme / Program Yönetimi

| Özellik | YİSA-S | GymTekno | Mobil Sporcu | Glofox | Mindbody | LeagueApps | SportsEngine | Sgrum | Xiao He Bang | Fei Te Yun |
|---------|:------:|:--------:|:------------:|:------:|:--------:|:----------:|:------------:|:-----:|:------------:|:----------:|
| Haftalık program | ✓ | ✓ | — | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Branş/oda filtre | ✓ | ✓ | Sınıf | ✓ | ✓ | ✓ | ✓ | — | ✓ | ✓ |
| Kapasite gösterimi | ✓ | ✓ | — | ✓ | ✓ | ✓ | ✓ | — | ✓ | ✓ |
| Online rezervasyon | — | ✓ | — | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Katılımcı ekleme | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | ✓ | ✓ |
| Bekleme listesi | — | — | — | ✓ | ✓ | ✓ | ✓ | — | — | — |
| Self-check-in | — | — | — | ✓ | ✓ | — | ✓ Tablet | — | ✓ | ✓ |
| Ders değişimi/telafi | — | — | — | ✓ | ✓ | — | ✓ | ✓ | ✓ | ✓ |

---

### 3.3 Veli Paneli (Çocuk Odaklı)

| Özellik | YİSA-S | GymTekno | Mobil Sporcu | Glofox | Mindbody | LeagueApps | SportsEngine | Sgrum | Xiao He Bang | Fei Te Yun |
|---------|:------:|:--------:|:------------:|:------:|:--------:|:----------:|:------------:|:-----:|:------------:|:----------:|
| Çocuk kartları | ✓ | — | — | — | ✓ Bağımlı | ✓ | ✓ | — | ✓ | ✓ |
| Kalan ders/kredi | ✓ | — | — | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Ödeme geçmişi | ✓ | — | — | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Yoklama/devam % | ✓ | — | — | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Gelişim grafiği | ✓ Boy/kilo | — | — | — | — | — | ✓ Beceri | — | ✓ Albüm | ✓ Dosya |
| Self-registration | ✓ | — | — | ✓ | ✓ | ✓ | ✓ | — | ✓ | ✓ |
| Bildirim (SMS/push/WeChat) | Yakında | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Video/foto paylaşımı | — | — | — | — | — | ✓ | ✓ | ✓ | ✓ | ✓ |
| Aile hesabı (çoklu çocuk) | ✓ | — | — | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

---

### 3.4 Patron / Franchise / Yönetim Paneli

| Özellik | YİSA-S | GymTekno | Mobil Sporcu | Glofox | Mindbody | LeagueApps | SportsEngine | Sgrum | Xiao He Bang | Fei Te Yun |
|---------|:------:|:--------:|:------------:|:------:|:--------:|:----------:|:------------:|:-----:|:------------:|:----------:|
| Çok şube | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | ✓ | ✓ |
| Multi-tenant | ✓ | — | — | ✓ | ✓ | ✓ | ✓ | — | — | ✓ |
| Kasa / gelir raporu | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Onay kuyruğu (merkezi) | ✓ CELF | — | — | — | — | — | — | — | — | — |
| Rol bazlı erişim | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Mağaza/ürün satışı | ✓ | ✓ | — | — | — | ✓ | ✓ | ✓ | — | ✓ |
| CRM / lead yönetimi | — | — | — | ✓ | ✓ | ✓ | ✓ | — | — | ✓ |
| Personel/bordro | — | — | — | ✓ | ✓ | — | — | — | ✓ | ✓ |

---

### 3.5 Antrenör Paneli

| Özellik | YİSA-S | GymTekno | Mobil Sporcu | Glofox | Mindbody | LeagueApps | SportsEngine | Sgrum | Xiao He Bang | Fei Te Yun |
|---------|:------:|:--------:|:------------:|:------:|:--------:|:----------:|:------------:|:-----:|:------------:|:----------:|
| Bugünün dersleri | ✓ | ✓ | — | ✓ | ✓ | ✓ | ✓ | — | ✓ | ✓ |
| Yoklama alma | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | ✓ | ✓ |
| Gelişim ölçümü | ✓ Boy/kilo/esneklik | ✓ Ölçüm | — | — | ✓ | — | ✓ Beceri | — | ✓ | ✓ |
| Sporcu listesi | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | ✓ | ✓ |
| Mobil erişim | PWA | ✓ App | ✓ App | ✓ Pro App | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

---

### 3.6 Çocuk Gelişim ve Medya

| Özellik | YİSA-S | GymTekno | Mobil Sporcu | Glofox | Mindbody | LeagueApps | SportsEngine | Sgrum | Xiao He Bang | Fei Te Yun |
|---------|:------:|:--------:|:------------:|:------:|:--------:|:----------:|:------------:|:-----:|:------------:|:----------:|
| Boy/kilo grafiği | ✓ | — | — | — | — | — | — | — | — | — |
| Beceri takibi | — | — | — | — | — | — | ✓ Sınırsız | — | ✓ | ✓ |
| Video kayıt/paylaşım | — | — | ✓ | — | — | ✓ | ✓ Producer | ✓ | ✓ | — |
| Fotoğraf albümü | — | — | ✓ | — | — | ✓ | ✓ | ✓ | ✓ | ✓ |
| Elektronik büyüme dosyası | — | — | — | — | — | — | ✓ | — | ✓ | ✓ |

---

### 3.7 İletişim ve Destek

| Özellik | YİSA-S | GymTekno | Mobil Sporcu | Glofox | Mindbody | LeagueApps | SportsEngine | Sgrum | Xiao He Bang | Fei Te Yun |
|---------|:------:|:--------:|:------------:|:------:|:--------:|:----------:|:------------:|:-----:|:------------:|:----------:|
| SMS | — | ✓ Otomatik | ✓ | — | ✓ | ✓ | ✓ Sınırsız | ✓ | — | ✓ |
| Toplu mesaj/email | Yakında | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ WeChat | ✓ WeChat |
| Canlı destek widget | — | — | ✓ Tawk.to | — | — | — | — | — | — | — |
| Anket | — | — | ✓ | — | — | ✓ | — | ✓ | ✓ | ✓ |
| Dil seçimi (TR/EN) | — | — | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | — |

---

## 4. Yapay Zeka ve Otomasyon

| Sistem | Yapay Zeka / Akıllı Özellik | Açıklama |
|--------|-----------------------------|----------|
| **YİSA-S** | Yok | Şu an AI modülü yok |
| **GymTekno** | Yok | |
| **Mobil Sporcu** | Yok | |
| **Glofox** | **Members at Risk** | ML, 15 veri noktası ile churn tahmini; kayıp riski olan üyeleri önceden tespit |
| **Glofox** | XLerate otomasyon | Doğum günü, ziyaret kilometre taşı, sepet terki |
| **Mindbody** | **Messenger[ai]** | 24/7 AI ön büro; rezervasyon, paket satışı, SMS/webchat; marka sesi |
| **Mindbody** | AI/ML vurgusu | "Harness the power of AI/ML" – genel vaat |
| **LeagueApps** | Belirtilmedi | |
| **SportsEngine** | Belirtilmedi | |
| **Sgrum** | Yok | |
| **Xiao He Bang** | Yüz tanıma | Yoklama için (donanım/yazılım) |
| **Fei Te Yun** | Belirtilmedi | |

**Özet:** Sadece **Mindbody** (Messenger[ai]) ve **Glofox** (Members at Risk, XLerate) açıkça yapay zeka / otomasyon özelliği sunuyor.

---

## 5. Prizes.com Panel Değerlendirmesi

**Bağlam:** Eski panel (prizes.com benzeri), ekran görüntülerine göre.

### 5.1 Prizes.com Tarzı Panelde Olanlar

| Özellik | Açıklama |
|---------|----------|
| Rutin ders yönetimi | Haftalık program (Pzt–Cmt), şube/oda/antrenör filtreleri |
| Ders kartları | Branş, antrenör, hedef sınıf, saat, kapasite (10/0, 15/0 vb.) |
| Katılımcı Ekle | Her kartta mavi buton |
| Müsait Zamanlar | Personel bazlı haftalık müsaitlik takvimi |
| Renkli program grid | Cimnastik, pilates, kiralama vb. hücre renkleri |
| Katılımcıları Göster | Checkbox ile detay görünümü |

### 5.2 Tespit Edilen Sorunlar

| Sorun | Açıklama |
|-------|----------|
| Zaman gösterimi | 00:00/01:00, 01:00/02:00 – muhtemelen 12:00/13:00 olması gereken saatler |
| UX tutarsızlığı | Kullanıcı ifadesi: "Çok komik, çok değişik başka bir şekilde" |
| Veli paneli | Yok – sadece admin/patron görünümü |
| Aidat takibi | Doğrudan görünmüyor |
| Sözleşme/KVKK | Yok |

### 5.3 YİSA-S ile Karşılaştırma

| Alan | Prizes.com | YİSA-S |
|------|------------|--------|
| Rutin ders | ✓ | ✓ |
| Kapasite | ✓ | ✓ |
| Katılımcı ekleme | ✓ | ✓ |
| Veli paneli | ✗ | ✓ |
| Kredi sistemi | ✗ | ✓ |
| Gelişim ölçümü | ✗ | ✓ |
| Sözleşme/KVKK | ✗ | ✓ |
| Multi-tenant | ✗ | ✓ |
| PWA | ✗ | ✓ |

---

## 6. Sonuç ve Öneriler

### 6.1 YİSA-S’in Güçlü Yönleri

- **Sözleşme & KVKK:** Franchise, personel, veli onayları; fotoğraf/video izni – rakiplerde nadir
- **Multi-tenant:** Subdomain ile her tesis ayrı
- **Dijital kredi:** ders_kredisi, paket satışı
- **Gelişim ölçümü:** Boy, kilo, esneklik – antrenör ve veli tarafında
- **Patron/CELF/COO:** Merkezi onay, franchise yapısı
- **Rol tabanlı UI:** owner, coach, kasa ayrımı
- **Modern stack:** Next.js, TypeScript, Supabase, PWA
- **Veli self-registration:** KVKK sonrası otomatik yönlendirme

### 6.2 YİSA-S’in Eksik / Geliştirilebilir Yönleri

- **SMS entegrasyonu** – GymTekno, Mobil Sporcu, Glofox, Mindbody’de var
- **Duyurular** – Placeholder; aktif hale getirilmeli
- **İletişim merkezi** – Toplu mesaj, Mobil Sporcu’da var
- **Ajanda, doğum günü, kayıt bitiş hatırlatmaları** – Mobil Sporcu’da var
- **Fotoğraf modülü** – Mobil Sporcu, SportsEngine, Çin sistemlerinde var
- **Video paylaşımı** – SportsEngine, Sgrum, Xiao He Bang’de var
- **Yapay zeka** – Mindbody (Messenger[ai]), Glofox (Members at Risk) örnek alınabilir
- **Gelişmiş arama** – İsim/email/telefon filtreleri
- **Sporcu katılım raporu** – Tarih aralığı, gün sayısı filtreleri

### 6.3 Bölgesel Farklar

| Bölge | Öne çıkan | Not |
|-------|-----------|-----|
| Türkiye | Aidat, kasa, yoklama, SMS | Sözleşme/KVKK YİSA-S’te güçlü |
| Avrupa/Amerika | Otomasyon, AI, tüketici ağı | Mindbody, Glofox önde |
| Japonya | Aylık abonelik, aile paylaşımı | Sgrum sade, işlevsel |
| Çin | WeChat entegrasyonu, yüz tanıma | Mini program ile veli erişimi |

### 6.4 Öncelikli Geliştirme Önerileri

1. **SMS entegrasyonu** – Netgsm vb. API
2. **Duyurular modülü** – Velilere aktif bildirim
3. **İletişim merkezi** – Toplu mesaj, şablonlar
4. **Doğum günü / kayıt bitiş widget’ları** – Dashboard’a
5. **Ajanda / etkinlik takvimi**
6. **Fotoğraf modülü** – Galeri, veli paylaşımı
7. **Gelişmiş katılım raporu** – Tarih aralığı, gün sayısı
8. **Yapay zeka (uzun vadede)** – Churn tahmini veya basit chatbot

---

*Bu rapor `docs/YISA_S_ULUSLARARASI_KARSILASTIRMA_RAPORU.md` olarak kaydedilmiştir. Güncelleme: 15 Şubat 2026.*
