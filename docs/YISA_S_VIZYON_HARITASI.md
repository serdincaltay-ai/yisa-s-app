# YİSA-S VİZYON VE ÖZELLİK HARİTASI
## Patron'un Tarif Ettiği Tüm Özellikler — Kategorize ve Sıralanmış

**Tarih:** 15 Şubat 2026 | **Kaynak:** Patron görüşmesi

---

## KATEGORİ 1: VİTRİN SİTESİ (yisa-s.com) — Franchise Sahibini Etkileyecek

### 1.1 Giriş / Intro
- [ ] YİSA-S logosu ile animasyonlu intro (gri/neon efekt, dönen logo)
- [ ] Sayfa açılırken ses efekti (isteğe bağlı, mute butonu ile)
- [ ] Sabit üst barda mini logo (TV ekranı gibi header)
- [ ] Canlı hissettiren arayüz: hover'da büyüme/küçülme, ışık efektleri, neon glow

### 1.2 Ana Sayfa İçeriği
- [ ] Büyük hero görsel / video (dijital, teknolojik, canlı)
- [ ] "Tesisinizi kuralım, siz yönetin" mesajı
- [ ] "Gerekli tüm verileri sunayım, siz çalıştırın" değer önerisi
- [ ] Standart paket + ekstra paketler gösterimi
- [ ] Desteklenen branşlar listesi (jimnastik, yüzme, futbol, basketbol, vb.)
- [ ] Sürekli dönen slider: grafik örnekleri, değerlendirme şablonları, dashboard preview'ları

### 1.3 Demo / Tanıtım Alanı
- [ ] TV ekranı formatında demo video alanı
- [ ] Site preview: "Basınca açılıyor" formatında interaktif showcase
- [ ] Hazırlanan işlerin görüntülenmesi (göz ikonu ile önizleme)
- [ ] MD dosyası → MD olarak, video → video olarak, site → site olarak açılsın

### 1.4 Canlı Grafikler
- [ ] Öğrenci değerlendirme grafikleri (örnek verilerle)
- [ ] Sağlık değerlendirme grafikleri
- [ ] Gelişim takip grafikleri
- [ ] Günlük/aylık/yıllık hesaplama örnekleri
- [ ] Fatura tabloları (elektrik, kira, maaş örnekleri)

---

## KATEGORİ 2: FRANCHİSE PANELİ (*.yisa-s.com) — Tesis İşletmecisi

### 2.1 Kullanıcı Rolleri ve Giriş
- [ ] Veli (öğrenci velisi)
- [ ] Çalışan (sekreter, temizlik, güvenlik)
- [ ] Antrenör (branş antrenörü)
- [ ] Tesis Sahibi / Franchise İşletmecisi
- [ ] Her rol kendi panelini görür
- [ ] Şifreyle giriş zorunlu

### 2.2 Muhasebe Robotu / Kasa Defteri
- [ ] Günlük kasa defteri
- [ ] Aylık gelir-gider raporu
- [ ] Yıllık maliyet analizi
- [ ] Fatura yönetimi (elektrik, su, doğalgaz, kira)
- [ ] Maaş takibi (haftalık, aylık, yıllık toplam)
- [ ] Aidat tahsilat takibi
- [ ] Hatırlatmalar (ödeme tarihleri, sözleşme bitiş tarihleri)

### 2.3 Spor Bilim Veri Havuzu
- [ ] Branşlara göre hareket havuzları
- [ ] Antrenman bilimleri: dönemsel özellikler
- [ ] Yaşa göre hangi hareketin işlenmesi gerektiği
- [ ] Mental yapılar ve dönemsel mental durumlar
- [ ] Referans değerleri ve parametreler
- [ ] Veri tabanından çekilecek (Supabase)

### 2.4 Öğrenci Yönetimi
- [ ] Öğrenci CRUD
- [ ] Yoklama sistemi
- [ ] Sağlık değerlendirmesi
- [ ] Gelişim takibi
- [ ] Veli bilgilendirme

---

## KATEGORİ 3: PATRON PANELİ (app.yisa-s.com) — Serdinç

### 3.1 Onay/İzleme Merkezi
- [x] Onay kuyruğu (Görev 3 - TAMAMLANDI)
- [ ] Onay → Tenant zinciri (Görev 4)
- [ ] Tüm tesislerin anlık durumu
- [ ] Tüm tesislerin finansal özeti

### 3.2 İçerik Yönetimi
- [ ] Hazırlanan işlerin önizlemesi (video, site, doküman)
- [ ] "Göz" ikonu ile preview → onaylama/düzeltme
- [ ] Düzeltme notu bırakabilme ("şu yazıyı düzelt", "şu alanı değiştir")
- [ ] Zaman damgalı not: video'da "1:23'te şu yazıyı düzelt" gibi

### 3.3 Beyin Takımı (AI)
- [ ] Görev 5-6'da yapılacak

---

## KATEGORİ 4: GÜVENLİK

### 4.1 Erişim Kontrolü
- [ ] Her panel şifre korumalı
- [ ] Rol bazlı erişim (RBAC)
- [ ] Giriş yapılmadan hiçbir şey görülmez
- [ ] Kopyalama engeli (sağ tık, Ctrl+C, ekran görüntüsü uyarısı)
- [ ] Şifresiz giriş engellenmiş

### 4.2 Veri Koruma
- [ ] Ekran görüntüsü uyarısı / watermark
- [ ] Veri kopyalama engeli
- [ ] Session timeout

### 4.3 Patent Başvurusu
- [ ] Sistem tasarımı için patent araştırması
- [ ] Faydalı model veya patent başvurusu hazırlığı
- [ ] Tescil süreci takibi
- **Ne zaman:** MVP tamamlandıktan sonra, ama araştırma şimdiden başlayabilir

---

## KATEGORİ 5: TÜRKÇE KARAKTER & TASARIM

### 5.1 Türkçe Karakter Desteği
- [ ] Tüm UI'da Türkçe karakterler doğru görünmeli (ç, ğ, ı, İ, ö, ş, ü, Ç, Ğ, Ö, Ş, Ü)
- [ ] Font: Türkçe karakter destekli (Inter, Nunito, veya Poppins)
- [ ] Tüm form validasyonları Türkçe karakter kabul etmeli
- [ ] Veritabanı: UTF-8 encoding (Supabase zaten destekliyor)

### 5.2 Responsive / PWA
- [ ] Mobil öncelikli tasarım (320px - 1920px)
- [ ] PWA: Ana ekrana eklenebilir
- [ ] Offline fallback
- [ ] Touch-friendly (44x44px min buton)

---

## UYGULAMA SIRASI (ÖNCELİK)

| Öncelik | Ne? | Hangi Site? | Sprint |
|---------|-----|-------------|--------|
| 1 | Görev 4: Onay → Tenant Zinciri | Patron | Sprint 1 |
| 2 | Görev 5-6: Beyin Takımı | Patron | Sprint 4 |
| 3 | Görev 7-8: Vitrin + Demo Form | Vitrin | Sprint 1 |
| 4 | Görev 9-10: Öğrenci/Yoklama/Aidat | Franchise | Sprint 2-3 |
| 5 | Kullanıcı Rolleri (RBAC) | Franchise | Sprint 3 |
| 6 | Muhasebe Robotu | Franchise | Sprint 4 |
| 7 | Spor Bilim Veri Havuzu | Franchise | Sprint 5 |
| 8 | Vitrin animasyonlar/intro | Vitrin | Sprint 5 |
| 9 | Güvenlik (kopyalama engeli, watermark) | Hepsi | Sprint 6 |
| 10 | Patent Başvurusu | — | Sprint 6+ |

---

> Bu dosya patron vizyonunun tamamını içerir.
> Her sprint başında buraya bakılır, öncelik sırasına göre ilerlenir.
> Yeni fikirler eklendikçe güncellenir.

**YiSA-S — Teknolojiyi Spora Başlattık.**
**15 Şubat 2026 | Vizyon Haritası v1.0**
