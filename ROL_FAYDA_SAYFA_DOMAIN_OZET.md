# YİSA-S — Rol, Fayda, Sayfa ve Domain Özeti

**Tarih:** 6 Şubat 2026  
**Kaynak:** KAPSAMLI_ROL_GOREV_FAYDA_HIZMET.md, VERI_ROL_GOREV_FAYDA/*.csv, SUBDOMAIN_YAPISI.md, KIM_HANGI_SAYFAYA_GIRER.md, REFERANS_CALISMA_STANDARDI_VELI_RAPORU.md, ANAYASA_SAYFA_MOTORU.md ve konuşmalardan derlenmiştir.

---

## 1. ROLLER VE ÖZELLİKLERİ

| Rol | Kod | Panel | Kim / Ne |
|-----|-----|-------|----------|
| **Patron** | — | `/dashboard` | Sistem sahibi |
| **Franchise Sahibi** | ROL-1 | `/franchise` | İşletme sahibi |
| **Tesis Müdürü** | ROL-2 | `/tesis` | Tesis operasyon |
| **Bölge Müdürü** | ROL-3 | `/franchise` | Çoklu şube |
| **Sportif Direktör** | ROL-4 | `/franchise` | Sporcu seviye, kazanım |
| **Uzman Antrenör** | ROL-5 | `/antrenor` | Ders, yoklama, not | 
| **Antrenör** | ROL-6 | `/antrenor` | Ders, yoklama |
| **Yardımcı/Stajyer** | ROL-7 | `/antrenor` | Yoklama, basit not |
| **Kayıt Personeli** | ROL-8 | `/franchise` | Kayıt, aidat, ödeme |
| **Temizlik Personeli** | ROL-9 | `/franchise` | Temizlik checklist |
| **Veli** | ROL-10 | `/veli` | Çocuk takibi, ödeme, grafik |
| **Sporcu** | ROL-11 | `/veli` veya `/sporcu` | Kendi gelişim grafikleri |
| **Misafir Sporcu** | ROL-12 | Sınırlı | Deneme |

---

## 2. ROL BAZLI FAYDALAR

### 2.1 Sporcuya Fayda
| Fayda | Açıklama |
|-------|----------|
| Gelişim takibi | Fiziksel ve teknik gelişim grafikleri; dünkü haliyle karşılaştırma (başkalarıyla değil) |
| Seviye / kazanım | Net seviye bilgisi, motive edici |
| Kişiye özel antrenman | CSPO ölçümlere göre bireysel antrenman önerisi |
| 10 perspektif değerlendirme | Fiziksel uygunluk, teknik, koordinasyon, denge, öğrenme hızı, dikkat, motivasyon, psikolojik dayanıklılık, disiplin, gelişim sürekliliği |
| Güvenli gelişim | Antrenör kararı; yapay zeka destek, nihai karar antrenörde |
| Veri tabanı erişimi | Akademik makaleler, federasyon bilgileri (paket dahilinde) |

### 2.2 Veliye Fayda
| Fayda | Açıklama |
|-------|----------|
| Çocuk takibi | Çocuklarım listesi, özet kartlar |
| Gelişim grafikleri | Anlaşılır, düzenli |
| Ödeme / aidat | Aidat takibi, ödeme bilgisi |
| Sağlık özeti | Genel özet; ham veri açılmaz (KVKK, çocuk koruma) |
| Haftalık veli raporu | Güçlü yönler, gelişim alanları, antrenör gözlemi, tavsiye |
| Aile danışmanlığı | VIP pakette |

### 2.3 İşletmeye (Franchise / Tesis) Fayda
| Fayda | Açıklama |
|-------|----------|
| Tesis yönetim paneli | Sporcu kayıt, ders programı, yoklama, kasa |
| Sporcu grafikleri | Gelişim grafikleri, tablolar, ölçümler |
| Kişiye özel antrenman | Ölçümlere göre bireysel öneri |
| Veli paneli | Çocuk takibi, ödeme — veli memnuniyeti |
| Antrenör paneli | Ders, yoklama, not |
| Karşılama robotu | Web sitesinde ziyaretçi karşılama |
| 7/24 Acil destek | Sistem sorununda Patron'a alarm |
| COO Mağazası | Ek şablon, logo, web sitesi satın alma |
| Çoklu şube | Bölge müdürü tüm şubelere erişir |

### 2.4 İşletmeciye (Franchise Sahibi) Fayda
| Fayda | Açıklama |
|-------|----------|
| Tek panel | Tesis, personel, gelir, rapor tek ekranda |
| Canlı fiyat | Vitrinde seçim yapınca fiyat hemen çıkar |
| Tenant yönetimi | Kendi tesisini, üyelerini, personelini yönetir |
| Patron desteği | Onay kuyruğu, CELF, şablon havuzu |

### 2.5 Çalışana (Antrenör, Personel) Fayda
| Fayda | Açıklama |
|-------|----------|
| Antrenör | Derslerim, yoklama, sporcu notu, CSPO önerisi |
| Kayıt personeli | Kayıt formu, aidat, ödeme girişi |
| Temizlik | Günlük checklist, tamamla, sorun bildir |
| Sportif direktör | Sporcu seviye, kazanım, CSPO |
| Tesis müdürü | Operasyon özeti, yoklama, personel |

---

## 3. VELİ PANELİ

**URL:** `/veli`  
**Domain:** `veli.yisa-s.com` (veliler tesis sistemine buradan girer)

### Veli özellikleri
- Çocuklarım listesi
- Çocuk seç → Gelişim grafikleri
- Ödeme / Aidat
- Sağlık özeti (ham veri yok — KVKK)

### Haftalık veli raporu şablonu (REFERANS_CALISMA_STANDARDI_VELI_RAPORU.md)
| Alan | İçerik |
|------|--------|
| Sporcu adı | |
| Hafta | |
| Antrenör | |
| Genel durum | Olumlu / Dengeli / Geliştirilmeli |
| Güçlü yönler | Madde madde |
| Gelişim alanları | Madde madde |
| Antrenör gözlemi | Serbest metin |
| Tavsiye | Evde destek, dinlenme, motivasyon notları |
| Genel değerlendirme | *Amaç: sağlıklı, güvenli ve sürdürülebilir gelişim.* |

---

## 4. KULLANICI / SPORCU PANELİ

| Rol | Panel | Özellikler |
|-----|-------|------------|
| **Sporcu (ROL-11)** | `/veli` veya `/sporcu` | Gelişim grafiğim, Seviye / kazanım, Son antrenmanlar (özet) |
| **Veli (ROL-10)** | `/veli` | Çocuk takibi, grafik, ödeme, sağlık özeti |

**Sporcunun çalıştırıcısı (antrenör):** Veritabanında `athletes` tablosunda sporcu kaydı; antrenör `staff` tablosunda. Ders programı `tenant_schedule` ile ilişkilendirilir. Antrenör `attendance` ile yoklama girer.

---

## 5. VERİTABANI — Sağlık ve Sporcu Kayıtları

| Tablo | Açıklama | Erişim |
|-------|----------|--------|
| **athletes** | Sporcu temel bilgileri (parent_email, doğum tarihi, level, branch) | Tenant bazlı RLS |
| **athlete_health_records** | Sporcu sağlık geçmişi (record_type, notes, recorded_at) | CSPO readOnly; veliye ham veri açılmaz |
| **evaluations** | Değerlendirme kayıtları (10 perspektif) | Eksik — migration gerekli |
| **staff** | Personel (antrenör, temizlik, kayıt vb.) | Tenant bazlı |
| **attendance** | Yoklama | Antrenör / Tesis |
| **payments** | Ödemeler | Franchise / Kayıt |

### 10 perspektif değerlendirme (çocuk sağlık/gelişim)
1. Fiziksel uygunluk  
2. Teknik yeterlilik  
3. Koordinasyon  
4. Denge  
5. Öğrenme hızı  
6. Dikkat ve odak  
7. Motivasyon  
8. Psikolojik dayanıklılık  
9. Disiplin ve davranış  
10. Gelişim sürekliliği  

**Puanlama:** 1–10 arası; karşılaştırma için değil, bireysel gelişim takibi için.

### Sağlık şablonları (ceo_templates)
- **Saglik Tarama** (CSPO): Sporcu sağlık tarama formu (kalp, solunum, esneklik, boy_kilo)
- **Tesis Acilis Checklist** (COO): Temizlik, malzeme, personel, güvenlik kontrolleri

---

## 6. DOMAINLER VE SAYFALAR

### 6.1 Domainler (SUBDOMAIN_YAPISI.md)

| Domain | Kim | Ne |
|--------|-----|-----|
| **app.yisa-s.com** | Patron | Patron paneli |
| **www.yisa-s.com** | Müşteri (franchise alıcı) | Spor okulları / işletmeler listesi |
| **veli.yisa-s.com** | Veliler | Veli paneli — tesis sistemine girerler |
| **franchise.yisa-s.com** | — | → www.yisa-s.com'a yönlendirilir |
| **bjktuzlacimnastik.yisa-s.com** | Tuzla Cimnastik | Kendi sitesi / panel |
| **fenerbahceatasehir.yisa-s.com** | Ataşehir, Ümraniye, Kurtköy | Kendi sitesi / panel |
| **kartalcimnastik.yisa-s.com** | Kartal Cimnastik | Kendi sitesi / panel |

### 6.2 Giriş ve Rol Yönlendirmesi

| Kim | Giriş URL | Giriş sonrası |
|-----|-----------|---------------|
| Patron | `/patron/login` veya `/auth/login` | `/dashboard` |
| Franchise / Firma sahibi | `/auth/login` | `/franchise` |
| Tesis müdürü | `/auth/login` | `/tesis` |
| Antrenör | `/auth/login` | `/antrenor` |
| Veli | `/auth/login` | `/veli` |
| Vitrin müşterisi | `/vitrin` (giriş zorunlu değil) | Paket seçimi |

### 6.3 Sayfa URL’leri (Özet)

| Sayfa | URL | Kim |
|-------|-----|-----|
| Patron Komuta Merkezi | `/dashboard` | Patron |
| Onay Kuyruğu | `/dashboard/onay-kuyrugu` | Patron |
| Franchise / Vitrin | `/dashboard/franchises` | Patron |
| Franchise paneli (tesis) | `/franchise` | Franchise Sahibi, Tesis Müdürü |
| Tesis paneli | `/tesis` | Tesis Müdürü |
| Antrenör paneli | `/antrenor` | Antrenör |
| Veli paneli | `/veli` | Veli |
| Vitrin | `/vitrin` | Müşteri adayı |

---

## 7. İŞLETME / FRANCHISE YETKİLİSİ

**Rol:** ROL-1 (Franchise Sahibi)  
**Panel:** `/franchise`  
**Görevler:** Genel Bakış, Öğrenciler, Antrenörler/Personel, Ders Programı, Aidat Takibi, Yoklama, COO Mağazası, Ayarlar  

**Faydalar:** Tek panel, canlı fiyat, tenant yönetimi, Patron desteği  

**İşletme değişmez:** Franchise yetkilisi işletme sahibi olarak kalır; rol değişmez.

---

## 8. KAYNAK DOSYALAR

| Dosya | İçerik |
|-------|--------|
| `KAPSAMLI_ROL_GOREV_FAYDA_HIZMET.md` | Rol, görev, fayda, veritabanı, hizmet |
| `VERI_ROL_GOREV_FAYDA/roller.csv` | Rol listesi |
| `VERI_ROL_GOREV_FAYDA/faydalar.csv` | Fayda listesi |
| `VERI_ROL_GOREV_FAYDA/gorevler.csv` | Görev listesi |
| `VERI_ROL_GOREV_FAYDA/hizmetler.csv` | Hizmet listesi |
| `VERI_ROL_GOREV_FAYDA/veritabani_saglik.csv` | Sağlık tabloları |
| `SUBDOMAIN_YAPISI.md` | Domainler |
| `KIM_HANGI_SAYFAYA_GIRER.md` | Sayfa / rol eşlemesi |
| `archive/REFERANS_CALISMA_STANDARDI_VELI_RAPORU.md` | Veli rapor şablonu, 10 perspektif |
| `ANAYASA_SAYFA_MOTORU.md` | Sayfa / API / rol detayı |

---

**Döküman sonu.**
