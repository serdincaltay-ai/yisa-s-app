# YİSA-S Uluslararası Karşılaştırma Araştırma Planı

**Tarih:** 15 Şubat 2026  
**Durum:** Onay bekliyor — **çalışmaya başlamadan önce Patron onayı gerekir**  
**Kapsam:** Sadece araştırma ve dokümantasyon; kod/sistem değişikliği yok.

---

## 1. Amaç ve Kapsam

Spor kulübü **aidat takip sistemi** ve **ders seçme sistemi** açısından YİSA-S kayıt sistemini dünya genelindeki benzer sistemlerle karşılaştırmak. Özellikle:

- **Veli paneli:** Çocuk ödemelerini, derslerini takip etme
- **Patron / Franchise paneli:** İşletme yönetimi
- **Antrenör paneli:** Ders, yoklama, gelişim ölçümü
- **Çocuk gelişim grafikleri:** Boy/kilo, performans vb.

---

## 2. Karşılaştırılacak Sistemler

### 2.1 Türkiye

| # | Sistem | Kaynak | Not |
|---|--------|--------|-----|
| 1 | **GymTekno** | gymtekno.com, panel.gymtekno.com | Spor salonu, pilates, reformer, spor okulları |
| 2 | **Mobil Sporcu** | mobilsporcu.com | Mevcut analiz: `YISA_S_VS_MOBILSPORCU_DETAYLI_ANALIZ.md` |
| 3 | **Cim Tekno** | Araştırma gerekiyor | Cimnastik odaklı alternatif |

### 2.2 Yurt Dışı (Bölgesel)

| # | Bölge | Sistem | Kaynak | Odak |
|---|-------|--------|--------|------|
| 4 | Avrupa | **Glofox** (ABC Glofox) | glofox.com | Fitness studio, class booking |
| 5 | Amerika | **LeagueApps** veya **SportsEngine Motion** | leagueapps.com, sportsengine.com/motion | Genç spor, cimnastik, yüzme |
| 6 | Japonya | **Clubnet (Fitcom)** veya **Sgrum** | fitcom.co.jp, sgrum.com | Yüzme/tenis okulu, seviye takibi |
| 7 | Çin | **小禾帮 (Xiao He Bang)** veya **菲特云 (Fei Te Yun)** | xiaohebang.cn, fityun.cn | Basketbol/antrenman, WeChat aile bildirimi |

### 2.3 Dünya Genelinde Popüler (2 Sistem)

| # | Sistem | Kaynak | Not |
|---|--------|--------|-----|
| 8 | **Mindbody** | mindbodyonline.com | Fitness, yoga, pilates — AI destekli |
| 9 | **SportsEngine Motion** | sportsengine.com/motion | Cimnastik, yüzme — veli app 4.8/5 |

---

## 3. Prizes.com Panel Değerlendirmesi

**Bağlam:** Kullanıcının eski paneli (prizes.com benzeri) ile şu anki YİSA-S karşılaştırması.

### 3.1 Prizes.com Tarzı Panel (Ekran Görüntülerinden)

| Özellik | Açıklama |
|---------|----------|
| **Rutin Ders Yönetimi** | Haftalık program (Pazartesi–Cumartesi), oda/şube/antrenör filtreleri |
| **Ders Kartları** | Branş, antrenör, hedef sınıf, saat, kapasite (örn. 10/0, 15/0), "Katılımcı Ekle" |
| **Müsait Zamanlar** | Personel bazlı müsaitlik takvimi |
| **Renkli Program Grid** | Cimnastik, pilates, kiralama vb. hücre renkleri |
| **Sorunlar (kullanıcı ifadesi)** | "Çok komik, çok değişik başka bir şekilde" — zaman gösterimi (00:00/01:00), UX tutarsızlıkları |

### 3.2 Değerlendirme

- **Artılar:** Rutin ders, kapasite, katılımcı ekleme — operasyonel ihtiyaçları karşılıyor
- **Eksikler:** Veli paneli, çocuk odaklı grafik, aidat/kredi takibi, sözleşme/KVKK yok
- **YİSA-S farkı:** Multi-tenant, sözleşme/KVKK, kredi sistemi, gelişim ölçümü, veli self-registration

---

## 4. Karşılaştırma Matrisi (Planlanan Tablolar)

### Tablo 1: Aidat / Ödeme Takibi

| Özellik | YİSA-S | GymTekno | Mobil Sporcu | Glofox | LeagueApps / SportsEngine | Japonya | Çin |
|---------|--------|----------|--------------|--------|---------------------------|---------|-----|
| Borç/Alacak takibi | ✓ Kasa, aidat | ✓ Bakiye, taksit | ✓ Muhasebe | ✓ Otomatik billing | ✓ Ödeme planları | ✓ | ✓ |
| Taksit planı | — | ✓ | — | ✓ | ✓ | — | ✓ |
| Sanal cüzdan | — | ✓ | — | — | — | — | ✓ |
| Otomatik SMS hatırlatma | — | ✓ | ✓ | — | ✓ | ✓ | ✓ WeChat |
| Kredi/ders paketi | ✓ | Paket satış | — | Seans/class | Paket/üyelik | Seviye | Ders saati |

### Tablo 2: Ders Seçme / Program Yönetimi

| Özellik | YİSA-S | GymTekno | Mobil Sporcu | Glofox | SportsEngine Motion | Prizes.com |
|---------|--------|----------|--------------|--------|---------------------|------------|
| Haftalık program | ✓ | ✓ | — | ✓ | ✓ | ✓ |
| Branş/oda filtre | ✓ | ✓ | Sınıf | ✓ | ✓ | ✓ |
| Kapasite gösterimi | ✓ | ✓ | — | ✓ Waitlist | ✓ | ✓ 10/0 vb. |
| Online rezervasyon | — | ✓ Mobil | — | ✓ App | ✓ App | — |
| Katılımcı ekleme | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

### Tablo 3: Veli Paneli (Çocuk Odaklı)

| Özellik | YİSA-S | GymTekno | Mobil Sporcu | SportsEngine | Glofox | Çin (Xiao He Bang) |
|---------|--------|----------|--------------|--------------|--------|--------------------|
| Çocuk kartları | ✓ Dashboard | — | — | ✓ App | — | ✓ WeChat |
| Kalan ders/kredi | ✓ | — | — | ✓ | ✓ | ✓ Kalan saat |
| Ödeme geçmişi | ✓ API | — | — | ✓ Billing | ✓ | ✓ |
| Yoklama/devam % | ✓ | — | — | ✓ | ✓ | ✓ |
| Gelişim grafiği | ✓ Boy/kilo | — | — | ✓ Skills tracking | — | — |
| Self-registration | ✓ | — | — | ✓ | ✓ | ✓ |
| Bildirim | Duyurular (yakında) | ✓ SMS | ✓ | ✓ Sınırsız SMS/email | ✓ | ✓ WeChat |

### Tablo 4: Patron / Franchise Paneli

| Özellik | YİSA-S | GymTekno | Mobil Sporcu | Glofox | LeagueApps |
|---------|--------|----------|--------------|--------|------------|
| Çok şube | ✓ Multi-tenant | ✓ | ✓ | ✓ | ✓ |
| Kasa / gelir raporu | ✓ Aylık grafik | ✓ | ✓ | ✓ | ✓ |
| Onay kuyruğu (Patron) | ✓ CELF/COO | — | — | — | — |
| Rol bazlı erişim | ✓ owner, coach, kasa | ✓ | ✓ | ✓ | ✓ |
| Mağaza modülü | ✓ COO | ✓ Market | — | — | ✓ E-commerce |

### Tablo 5: Antrenör Paneli

| Özellik | YİSA-S | GymTekno | Mobil Sporcu | SportsEngine Motion | Glofox |
|---------|--------|----------|--------------|---------------------|--------|
| Bugünün dersleri | ✓ | ✓ | — | ✓ Mobil | ✓ |
| Yoklama alma | ✓ 4 durum | ✓ | ✓ | ✓ | ✓ |
| Gelişim ölçümü | ✓ Boy, kilo, esneklik | ✓ Ölçüm | — | ✓ Skills | ✓ Egzersiz |
| Sporcu listesi | ✓ | ✓ | ✓ | ✓ | ✓ |

### Tablo 6: Çocuk Gelişim Grafikleri

| Özellik | YİSA-S | Mobil Sporcu | SportsEngine Motion | Çin |
|---------|--------|--------------|---------------------|-----|
| Boy/kilo grafiği | ✓ Veli + antrenör | — | — | — |
| Beceri takibi | — | — | ✓ Sınırsız skills | ✓ |
| Video paylaşımı | — | ✓ | ✓ Video Producer | — |
| Genel değerlendirme | ✓ Antrenör notu | — | ✓ | ✓ |

---

## 5. YİSA-S Mevcut Durum Özeti

### 5.1 Var Olanlar

| Modül | Sayfa/API | Özellikler |
|-------|-----------|------------|
| **Veli** | `/veli/dashboard`, `/veli/kredi`, `/veli/gelisim`, `/veli/cocuk/[id]`, `/veli/duyurular` | Çocuk kartları, kalan ders, kredi satın alma, gelişim (boy/kilo grafik), yoklama oranı |
| **Panel (Franchise)** | `/panel/ogrenciler`, `/panel/yoklama`, `/panel/odemeler`, `/panel/aidat`, `/kasa`, `/kasa/rapor` | Öğrenci CRUD, yoklama, ödeme, aidat, kasa defteri, aylık rapor |
| **Antrenör** | `/antrenor`, `/antrenor/sporcular`, `/antrenor/yoklama`, `/antrenor/olcum` | Bugünün dersleri, yoklama, gelişim ölçümü |
| **Franchise** | `/franchise` | Genel bakış, ders programı, kredi özeti, ayarlar |
| **Sözleşme/KVKK** | `/sozlesme/franchise`, `/sozlesme/personel`, `/sozlesme/veli` | Franchise, personel, veli onayları |

### 5.2 Eksik / Geliştirilebilir (MobilSporcu analizinden)

- SMS entegrasyonu, duyurular (aktif), iletişim merkezi
- Ajanda, doğum günü, kayıt bitiş hatırlatmaları
- Gelişmiş arama, sporcu katılım raporu (filtreli)
- Fotoğraf modülü, video paylaşımı

---

## 6. Çalışma Adımları (Onay Sonrası)

1. **GymTekno:** Site + panel sayfalarından özellik çıkarımı (ödeme, taksit, sanal cüzdan, veli erişimi)
2. **Mobil Sporcu:** Mevcut `YISA_S_VS_MOBILSPORCU_DETAYLI_ANALIZ.md` ile güncel tutarlılık
3. **Cim Tekno:** Web araması ile özellik listesi (varsa)
4. **Glofox (Avrupa):** Özellik sayfası, parent/child booking dokümanı
5. **LeagueApps / SportsEngine (Amerika):** Youth sports, parent app, billing
6. **Japonya:** Clubnet/Sgrum — seviye yönetimi, aile bildirimi
7. **Çin:** Xiao He Bang / Fei Te Yun — WeChat, ders saati, aile takibi
8. **Mindbody, SportsEngine Motion:** Popüler global sistem özeti
9. **Prizes.com:** Ekran görüntülerinden özellik çıkarımı ve "öncesi/sonrası" değerlendirme
10. **Nihai rapor:** Tüm tabloların doldurulması, YİSA-S konumlandırma özeti

---

## 7. Çıktı

- **Dosya:** `docs/YISA_S_ULUSLARARASI_KARSILASTIRMA_RAPORU.md`
- **İçerik:** Yukarıdaki tabloların doldurulmuş hali + özet + öneriler
- **Süre:** Araştırma odaklı; kod yazılmayacak, sadece doküman üretilecek

---

## 8. Onay

**Patron onayı gereklidir.** Bu planı onaylıyorsanız "Onayla" veya "Başla" yazmanız yeterlidir. Onaydan sonra adım adım araştırma yapılacak ve rapor oluşturulacaktır.

---

*Bu doküman `ULUSLARARASI_KARSILASTIRMA_ARASTIRMA_PLANI.md` olarak kaydedildi.*
