# YİSA-S Rol Paneli Görevlendirme — Anayasaya Göre

**Referans:** ANAYASA_SAYFA_MOTORU.md, ROBOT_ENTEGRASYON_ANAYASA.md  
**Tarih:** 5 Şubat 2026  
**Amaç:** Her rol giriş yaptığında neyle karşılaşacak, robot mu çıkacak, nasıl bir sistem — sıralı görev listesi. v0 tasarım komutları için referans.

---

## 1. Genel Akış

| Adım | Kim | Ne Yapar |
|------|-----|----------|
| 1 | Cursor | Bu dokümandaki her rol için v0 prompt üretir |
| 2 | v0 | Tasarım çıktısı üretir |
| 3 | Cursor | Çıktıyı düzenler, şablona ekler |
| 4 | Patron | Şablonlar sayfasında görüntü olarak görür |

---

## 2. Rol Bazlı Panel Deneyimi — Sıralı Görev Listesi

### 2.1 Patron
- **Panel:** `/dashboard` (app.yisa-s.com)
- **Girişte:** Chat asistanı, onay kuyruğu, kasa, franchise listesi, şablon havuzu
- **Robot:** Patron Asistanı (Chat) — CIO → CEO → CELF zinciri
- **Görev sırası:**
  1. Giriş → Dashboard ana sayfa (istatistik kartları)
  2. Geniş Ekran / Şablonlar linkleri
  3. Robot Asistan Chat (komut gönder)
  4. Onay Kuyruğu (bekleyen işler)
  5. Oyna — Deploy butonu
  6. Kasa Defteri, Franchise listesi, Raporlar

**v0 Prompt:** "YİSA-S Patron paneli: app.yisa-s.com dashboard. Giriş sonrası Chat asistanı, onay kuyruğu, istatistik kartları (gelir, gider, onay, başvuru), Geniş Ekran ve Şablonlar linkleri. Renkli vurgular (pembe, mavi, amber). Modern, responsive."

---

### 2.2 Franchise Firma Sahibi (Alt Admin)
- **Panel:** `/franchise` (franchise.yisa-s.com)
- **Girişte:** Genel bakış, öğrenciler, antrenörler, ders programı, aidat, yoklama, COO Mağazası, ayarlar
- **Robot:** Karşılama yok; COO Mağazası’nda şablon satın alma
- **Görev sırası:**
  1. Giriş → Genel Bakış (öğrenci/personel sayıları)
  2. Öğrenciler sekmesi (sporcu ekle/düzenle)
  3. Antrenörler / Personel sekmesi
  4. Ders Programı (haftalık program düzenle)
  5. Aidat Takibi
  6. Yoklama
  7. COO Mağazası (şablon satın al)
  8. Ayarlar (antrenör_hedef, temizlik_hedef, mudur_hedef, aidat_tiers)

**v0 Prompt:** "YİSA-S Franchise paneli: firma sahibi giriş sonrası. Genel Bakış kartları, Öğrenciler listesi, Personel, Ders Programı haftalık tablo, Aidat, Yoklama, COO Mağazası. Sekmeli layout. Renkli, modern."

---

### 2.3 İkinci Şubesi Olan Firma Sahibi
- **Panel:** `/franchise` (branch_id veya tenant seçici ile)
- **Girişte:** Şube seçici (dropdown veya kartlar) — "Beşiktaş", "Fenerbahçe" vb.
- **Robot:** Yok; şube seçince normal franchise paneli
- **Görev sırası:**
  1. Giriş → Şube seçim ekranı (kartlar veya dropdown)
  2. Şube seç → O şubenin franchise paneli
  3. Şube değiştir butonu (header’da)

**v0 Prompt:** "YİSA-S çok şubeli firma sahibi: girişte şube seçim ekranı. Her şube bir kart (ad, adres, öğrenci sayısı). Seçince franchise paneli açılır. Header’da şube değiştir."

---

### 2.4 Tesis İşletme Müdürü
- **Panel:** `/tesis`
- **Girişte:** Tesis operasyon paneli (tek tesis) — yoklama, personel, ders programı
- **Robot:** Yok
- **Görev sırası:**
  1. Giriş → Tesis özeti (günlük yoklama, bugünkü dersler)
  2. Yoklama girişi
  3. Personel listesi (görüntüleme)
  4. Ders programı (görüntüleme, değişiklik talebi)

**v0 Prompt:** "YİSA-S Tesis Müdürü paneli: tek tesis operasyon. Günlük yoklama özeti, bugünkü dersler, personel listesi. Kompakt dashboard."

---

### 2.5 Sportif Direktör
- **Panel:** Franchise/tesis içi (veya `/antrenor` scoped)
- **Girişte:** Sporcu programları, seviye/kazanım görünümü; CSPO çıktıları
- **Robot:** CSPO (antrenman programı, seviye değerlendirmesi) — readOnly athletes + health
- **Görev sırası:**
  1. Sporcu listesi (seviye, branş, değerlendirme)
  2. Kazanım/bel görünümü
  3. CSPO antrenman önerileri (okuma)
  4. Seviye atama (Franchise ile koordineli)

**v0 Prompt:** "YİSA-S Sportif Direktör paneli: sporcu seviyeleri, kazanımlar, CSPO antrenman önerileri. Tablo + kart görünümü. Sporcu verisi readOnly."

---

### 2.6 Uzman Antrenör
- **Panel:** `/antrenor`
- **Girişte:** Ders yönetimi, yoklama, sporcu notları, kişiye özel antrenman önerileri
- **Robot:** CSPO (ölçümlere göre bireysel antrenman)
- **Görev sırası:**
  1. Bugünkü derslerim
  2. Yoklama girişi (mevcut/yarımcı)
  3. Sporcu notları (ölçüm, gelişim)
  4. CSPO antrenman önerisi (görüntüle)

**v0 Prompt:** "YİSA-S Uzman Antrenör paneli: bugünkü dersler, yoklama formu, sporcu notları, CSPO antrenman önerisi kartı. Mobil uyumlu."

---

### 2.7 Antrenör
- **Panel:** `/antrenor` (kısıtlı — kendi atandığı ders/sporcular)
- **Girişte:** Aynı panel; sadece atandığı gruplar
- **Robot:** Yok (veya CSPO özet)
- **Görev sırası:**
  1. Derslerim
  2. Yoklama
  3. Sporcu notu (kısa)

**v0 Prompt:** "YİSA-S Antrenör paneli: sadece atandığı dersler ve sporcular. Yoklama, kısa not. Minimal layout."

---

### 2.8 Yardımcı Antrenör / Stajyer
- **Panel:** `/antrenor` (en kısıtlı)
- **Girişte:** Yoklama, basit not girişi
- **Robot:** Yok
- **Görev sırası:**
  1. Yoklama (mevcut/yarımcı)
  2. Basit not (tek satır)

**v0 Prompt:** "YİSA-S Yardımcı Antrenör paneli: sadece yoklama formu ve tek satır not. Çok minimal."

---

### 2.9 Temizlik Personeli
- **Panel:** Franchise/tesis (temizlik modülü)
- **Girişte:** Temizlik/bakım takibi — günlük checklist
- **Robot:** Yok
- **Görev sırası:**
  1. Günlük temizlik checklist (salon, vestiyer, WC, vb.)
  2. Tamamlandı işaretle
  3. Sorun bildir (opsiyonel)

**v0 Prompt:** "YİSA-S Temizlik personeli paneli: günlük checklist (salon, vestiyer, WC). Checkbox, Tamamla butonu. Basit, mobil."

---

### 2.10 Halkla İlişkiler
- **Panel:** Franchise içi (Pazarlama/PR sekmesi)
- **Girişte:** Kampanya, sosyal medya, iletişim
- **Robot:** CMO (kampanya, içerik önerileri)
- **Görev sırası:**
  1. Sosyal medya planı (takvim)
  2. CMO kampanya önerileri
  3. İletişim listesi (veli/ziyaretçi)

**v0 Prompt:** "YİSA-S Halkla İlişkiler paneli: sosyal medya takvimi, kampanya önerileri, iletişim listesi. CMO entegrasyonu."

---

### 2.11 Kayıt Personeli
- **Panel:** Franchise/tesis
- **Girişte:** Kayıt, aidat takibi, ödeme girişi
- **Robot:** Yok
- **Görev sırası:**
  1. Yeni kayıt formu
  2. Aidat listesi (ödenen/bekleyen)
  3. Ödeme girişi

**v0 Prompt:** "YİSA-S Kayıt personeli paneli: yeni kayıt formu, aidat listesi, ödeme girişi. Tablo + form."

---

### 2.12 Veli
- **Panel:** `/veli` (veli.yisa-s.com)
- **Girişte:** Çocuk takibi, ödeme, grafikler, sağlık özeti (ham veri açılmaz)
- **Robot:** Yok (veya özet rapor)
- **Görev sırası:**
  1. Çocuklarım listesi (özet kartlar)
  2. Çocuk seç → Gelişim grafikleri
  3. Ödeme / Aidat
  4. Sağlık özeti (genel, ham veri yok)

**v0 Prompt:** "YİSA-S Veli paneli: çocuk kartları, gelişim grafikleri, ödeme, sağlık özeti. Çocuk ham veri gizli. Renkli, sıcak."

---

### 2.13 İkinci Çocuğu Olan Veli
- **Panel:** `/veli`
- **Girişte:** Çocuk seçici (Ahmet, Ayşe) — seçince o çocuğun detayı
- **Robot:** Yok
- **Görev sırası:**
  1. Çocuk seçim (tabs veya kartlar)
  2. Seçilen çocuk → Grafik, ödeme, sağlık
  3. Hızlı geçiş (çocuk değiştir)

**v0 Prompt:** "YİSA-S çok çocuklu veli: çocuk seçici tabs/kartlar. Seçilen çocuğun grafik, ödeme, sağlık. Hızlı geçiş."

---

### 2.14 Sporcu
- **Panel:** Veli üzerinden veya ileride `/sporcu`
- **Girişte:** Kendi gelişim grafikleri, seviye
- **Robot:** CSPO (readOnly — kendi verisi)
- **Görev sırası:**
  1. Gelişim grafiğim
  2. Seviye / kazanım
  3. Son antrenmanlar (özet)

**v0 Prompt:** "YİSA-S Sporcu paneli: kendi gelişim grafiği, seviye, son antrenmanlar. Çocuk dostu, motive edici."

---

### 2.15 Demo Kullanıcılar
- **Panel:** `/vitrin` veya `/demo` (giriş yok / sınırlı)
- **Girişte:** Demo talebi formu, paket seçimi
- **Robot:** Karşılama (Vitrin)
- **Görev sırası:**
  1. Paket seç (Starter, Pro, Enterprise)
  2. Form doldur (ad, email, tesis türü)
  3. Demo Talep Et
  4. (Onay sonrası) Sınırlı demo paneli (varsa)

**v0 Prompt:** "YİSA-S Demo/Vitrin: paket kartları, form (ad, email, tesis), Demo Talep Et butonu. Ziyaretçi karşılama."

---

### 2.16 Sosyal Medya Kullanmak İsteyen Franchise Müşterisi
- **Panel:** `/franchise` → COO Mağazası veya Pazarlama
- **Girişte:** Sosyal medya şablonları, CMO kampanya, içerik planı
- **Robot:** CMO (kampanya, post önerileri)
- **Görev sırası:**
  1. COO Mağazası → Sosyal Medya paketi satın al
  2. Pazarlama sekmesi → İçerik takvimi
  3. CMO önerileri (post, hashtag)

**v0 Prompt:** "YİSA-S Franchise sosyal medya: COO’dan sosyal medya paketi, içerik takvimi, CMO post önerileri. Pazarlama odaklı."

---

### 2.17 İnternet Sitesi Yaptırmak İsteyen Franchise Müşterisi
- **Panel:** `/franchise` → COO Mağazası
- **Girişte:** Web sitesi şablonları, CPO/CMO ürünleri
- **Robot:** CPO (sayfa tasarımı), CMO (içerik)
- **Görev sırası:**
  1. COO Mağazası → Web Sitesi şablonu seç
  2. Satin Al → Patron onayı
  3. Kişiselleştirme (logo, renk) — tenant ayarları

**v0 Prompt:** "YİSA-S Franchise web sitesi talebi: COO Mağazası’nda web şablonu seçimi, Satin Al, kişiselleştirme (logo, renk)."

---

### 2.18 Ders Programı / Haftalık Çalışma Saatleri Düzenlemek İsteyen
- **Panel:** `/franchise` → Ders Programı sekmesi
- **Girişte:** Haftalık program tablosu (tenant_schedule)
- **Robot:** Yok
- **Görev sırası:**
  1. Haftalık tablo (gün x saat)
  2. Ders ekle (gün, saat, grup, antrenör)
  3. Ders sil
  4. Yayınla / Kaydet → Tüm personel/veli görür

**Nerede düzenlenir:** `/franchise` → Ders Programı  
**Nasıl yayınlanır:** Kaydet → `tenant_schedule` güncellenir → API’den tüm paneller çeker

**v0 Prompt:** "YİSA-S Ders Programı düzenleyici: haftalık tablo (Pzt-Paz, 09:00-20:00), hücreye tıkla ders ekle, antrenör/grup seç. Kaydet butonu. Tablo görünümü net."

---

## 3. v0 Çalışma Sırası (Görev Kiliti)

| Sıra | Rol | v0 Prompt Özeti |
|------|-----|-----------------|
| 1 | Patron | Dashboard, Chat, onay kuyruğu |
| 2 | Franchise Firma Sahibi | Genel bakış, sekmesi, COO Mağazası |
| 3 | İkinci şube firma sahibi | Şube seçici |
| 4 | Tesis Müdürü | Operasyon, yoklama |
| 5 | Sportif Direktör | Sporcu seviye, CSPO |
| 6 | Uzman Antrenör | Ders, yoklama, not |
| 7 | Antrenör | Kısıtlı antrenör |
| 8 | Yardımcı Antrenör | Sadece yoklama |
| 9 | Temizlik Personeli | Checklist |
| 10 | Halkla İlişkiler | Sosyal medya, CMO |
| 11 | Kayıt Personeli | Kayıt, aidat, ödeme |
| 12 | Veli | Çocuk, grafik, ödeme |
| 13 | İkinci çocuk veli | Çocuk seçici |
| 14 | Sporcu | Gelişim grafiği |
| 15 | Demo | Vitrin form |
| 16 | Sosyal medya franchise | COO + Pazarlama |
| 17 | Web sitesi franchise | COO web şablonu |
| 18 | Ders programı | Haftalık tablo düzenleyici |

---

## 4. Sonraki Adım

1. **Cursor:** Her satır için tam v0 prompt üret (YİSA-S, Türkçe, renkli, modern)
2. **v0:** Sırayla çalıştır, çıktı al
3. **Cursor:** Çıktıları düzenle, `ceo_templates` veya şablonlar sayfasına ekle
4. **Patron:** Şablonlar sayfasında Geniş Ekranda görüntü olarak kontrol et
