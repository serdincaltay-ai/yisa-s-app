# YİSA-S — TAM YOL HARİTASI DEĞERLENDİRME RAPORU

**Tarih:** 9 Şubat 2026  
**İncelenen Doküman:** YISA-S-v0-TAM-YOL-HARITASI.md (50 görev, 5 blok)  
**Karşılaştırma Kaynağı:** Proje dokümanları (00-11 HTML, KAPSAMLI_YOL_HARITASI_PROMPT.md, SIFIR_KOMUT_PROMPT.md, YiSA-S_Proje_Dokumantasyonu.md)

---

## ÖZET KARAR

| Bölüm | Durum | Not |
|--------|-------|-----|
| Bölüm 1: Bağlam Komutu | ✅ ONAY | Doğru, kapsamlı, proje dokümanlarıyla uyumlu |
| Bölüm 2: Sistem Özeti | ✅ ONAY | Final hedef ve senaryo doğru tanımlanmış |
| Blok 1 (Görev 1-10) | ✅ ONAY | Temel altyapı — hemen uygulanabilir |
| Blok 2 (Görev 11-20) | ✅ ONAY | Vitrin + detaylandırma — küçük düzeltmelerle |
| Blok 3 (Görev 21-30) | ⚠️ KOŞULLU ONAY | Direktörlük otomasyonu — kapsam riskli, aşamalı ilerle |
| Blok 4 (Görev 31-40) | ⚠️ ERTELENEBİLİR | Workflow engine — faydalı ama erken; Blok 1-3 bitince değerlendir |
| Blok 5 (Görev 41-50) | ⚠️ ERTELENEBİLİR | Otomasyon botları — Blok 1-3 bitince değerlendir |

---

## BÖLÜM 1: BAĞLAM KOMUTU — DEĞERLENDİRME

### ✅ Doğru Olanlar
- 4 robot yapısı proje dokümanlarıyla tam uyumlu
- Teknoloji yığını doğru (Next.js 15.5, React 19, Supabase, Vercel)
- sim_updates yapısı doğru (beklemede/islendi, payload yok, target_direktorluk)
- API tutarsızlığı uyarısı doğru ve kritik
- Mevcut durum yüzdeleri proje dokümanlarıyla tutarlı
- Klasör yapısı doğru (dashboard.tsx kök dizinde)

### ⚠️ Küçük Eklemeler Önerilir
1. **lib/workflows/ ve lib/robots/ klasörleri** bağlam komutunda "oluşturulacak" olarak gösterilmiş — bu doğru, ama v0'a "henüz mevcut değil, oluşturulacak" demek yerine "ileride oluşturulacak, şimdilik görmezden gel" demek daha net olabilir.
2. **002_patron_system_upgrade.sql tabloları** (directorates, directorate_reviews, token_costs) bağlamda belirtilmiş — bu doğru ve önemli bir eklenti.
3. **"Robotlar arası iş akışı → %0" ve "Otomasyon botları → %0"** v3'te yoktu, buraya doğru eklenmiş.

### Sonuç: Bağlam komutu olduğu gibi kullanılabilir.

---

## BÖLÜM 2: SİSTEM ÖZETİ — DEĞERLENDİRME

### ✅ Güçlü Yanlar
- Uçtan uca senaryo (yisa-s.com → demo → onay → tenant → franchise → veli) doğru
- Robot bağlantı diyagramı akış olarak tutarlı
- Veritabanı şeması kapsamlı (15 tablo)
- Başarı kriterleri ölçülebilir

### ⚠️ Dikkat Noktaları

**1. Kapsam Büyüklüğü:**
50 görev agresif bir hedef. v0.dev'in tek oturumda 50 görevi hatırlaması zor olabilir. 10'ar blok stratejisi bu riski azaltıyor ama yine de her bloğun başında bağlamı kısa hatırlatmak gerekebilir.

**2. Franchise Paneli ve Veli Paneli Eksik:**
Bölüm 2'deki "Üretilecek Bileşenler" listesinde Franchise Paneli (öğrenci, yoklama, aidat) ve Veli Paneli görevleri Blok 1-5'te detaylı görev olarak yer almıyor. Bu, "ileri aşama" olarak kabul edilebilir ama Bölüm 2'de "Faz 6" veya "Blok 6" olarak açıkça belirtilmeli.

**3. YiSA-S Proje Dokümanı ile Karşılaştırma:**
Proje dokümanına göre veritabanında zaten bazı tablolar var (tenants, students, staff, payments, attendance, health_records, groups, schedules, inventory) ama bunlar "yisa-s-app" ortamındaymış, yisa-s-v0'da değil. Migration'ların bu durumu hesaba katması doğru.

---

## BLOK 1 (GÖREV 1-10): TEMEL ALTYAPI — DETAYLI İNCELEME

| Görev | İçerik | Doğruluk | Not |
|-------|--------|----------|-----|
| 1 | API tutarsızlığı düzeltme | ✅ | target_directorate → target_direktorluk — kritik |
| 2 | TypeScript tipleri | ✅ | Eksik interface'ler var (Staff, Group, Attendance, Payment, Schedule, AuditLog) — ama tipler ilerledikçe eklenebilir |
| 3 | Migration Part 1 (tenants, demo_requests, user_tenants) | ✅ | SQL doğru, index ve RLS başlangıç olarak uygun |
| 4 | Migration Part 2 (students, staff, groups) | ✅ | FK ilişkileri doğru |
| 5 | Migration Part 3 (attendance, payments, schedules, audit_log) | ✅ | FK ilişkileri doğru |
| 6 | Demo Talep API (POST + CORS) | ✅ | CORS, rate limit, validasyon dahil |
| 7 | Demo Talep Güncelleme API | ✅ | Slug üretimi, sim_updates INSERT, compensating |
| 8 | Dashboard Onay Kuyruğu | ✅ | UI detayları yeterli |
| 9 | Tenant Oluşturma API | ✅ | Otomatik grup + user_tenants + audit_log |
| 10 | Onay → Tenant Zinciri | ✅ | Rollback mekanizması dahil |

### Blok 1 Sonuç: HEMEN UYGULANABİLİR. Hiçbir değişiklik gerekmez.

---

## BLOK 2 (GÖREV 11-20): VİTRİN VE DEMO — DETAYLI İNCELEME

| Görev | İçerik | Doğruluk | Not |
|-------|--------|----------|-----|
| 11 | Vitrin sayfası | ✅ | Landing page detaylı tanımlanmış |
| 12 | Form validasyonu | ✅ | IP + email rate limit |
| 13 | Email (Resend) | ✅ | 3 şablon tanımlı |
| 14 | CORS yapılandırması | ✅ | next.config.mjs + middleware |
| 15 | Slug algoritması | ✅ | Türkçe → ASCII, benzersizlik |
| 16 | Otomatik grup oluşturma | ✅ | Görev 9'un detaylandırması — tamam |
| 17 | Hoş geldin email | ✅ | Template |
| 18 | Tenant listesi UI | ✅ | Dashboard entegrasyonu |
| 19 | Tenant detay sayfası | ✅ | İstatistikler dahil |
| 20 | Audit Log API + UI | ✅ | Filtre, badge, dashboard |

### ⚠️ Dikkat: Görev 12, 15, 16 — Blok 1'deki Görev 6, 7, 9 ile Örtüşme
Görev 12 (validasyon), 15 (slug), 16 (grup) aslında Görev 6, 7, 9'un detaylandırılmış versiyonları. v0.dev'e verilirken "Görev 6'yı güncelle" şeklinde verilmeli, yeni dosya oluşturma olarak değil.

### Blok 2 Sonuç: UYGULANABİLİR. Görev örtüşmeleri "güncelleme" olarak verilmeli.

---

## BLOK 3 (GÖREV 21-30): CELF VE DİREKTÖRLÜKLER — DETAYLI İNCELEME

| Görev | İçerik | Risk | Not |
|-------|--------|------|-----|
| 21 | CELF başlangıç görevleri | ✅ Düşük | task_assignments'e INSERT — basit |
| 22 | Direktörlük filtresi botu | ⚠️ Orta | Supabase webhook + pg_notify — karmaşık |
| 23 | AI API entegrasyonları (12 dk.) | ⚠️ YÜKSEK | 12 farklı AI çağrısı = yüksek maliyet + karmaşıklık |
| 24 | directorate_reviews CRUD | ✅ Düşük | Basit API |
| 25 | Paralel direktörlük kontrolü | ⚠️ Orta | Promise.all + timeout yönetimi |
| 26 | Bağımlılık yönetimi | ⚠️ YÜKSEK | Topolojik sıralama — aşırı mühendislik riski |
| 27 | Onay/Red mekanizması | ✅ Düşük | İf/else mantığı |
| 28 | Bildirimler | ⚠️ Orta | Yeni notifications tablosu gerekli (migration'da yok) |
| 29 | CELF durumu UI | ✅ Düşük | Dashboard bölümü |
| 30 | Direktörlük raporları | ✅ Düşük | Basit aggregation |

### ⚠️ Kritik Uyarılar:

**1. Görev 23 — AI Maliyet Riski:**
12 direktörlük × her biri AI API çağrısı = her tenant kurulumunda 12 API çağrısı. Bu, token maliyetini ciddi artırır. Öneri: İlk aşamada sadece 3-4 kritik direktörlüğü (Hukuk, Güvenlik, Teknik, Operasyon) aktif et, diğerlerini "otomatik onay" yap.

**2. Görev 26 — Aşırı Mühendislik (Over-engineering):**
Topolojik sıralama, bağımlılık grafiği MVP için çok karmaşık. Öneri: İlk aşamada basit sıralı kontrol yeterli (Hukuk → Teknik → Diğerleri). Bağımlılık grafiği ileride eklenebilir.

**3. Görev 28 — Eksik Migration:**
notifications tablosu migration'larda (003-005) tanımlanmamış. Bu görev öncesinde migration eklenmelidir.

### Blok 3 Sonuç: KOŞULLU ONAY. Görev 23'te maliyet kontrolü, Görev 26'da basitleştirme, Görev 28'de migration eklenmesi gerekli.

---

## BLOK 4 (GÖREV 31-40): İŞ AKIŞI MOTORU — DEĞERLENDİRME

### ⚠️ Genel Değerlendirme: ERTELENEBİLİR

**Neden?**
- 5 yeni tablo (workflow_templates, workflow_instances, workflow_steps, workflow_logs, robot_messages) — altyapı maliyeti yüksek
- Workflow engine karmaşık bir yazılım bileşeni — v0.dev'den üretilen kod üretim kalitesinde olmayabilir
- Blok 1-3 zaten temel iş akışını karşılıyor (demo → onay → tenant → CELF)
- robot_messages tablosu mevcut sim_updates ile çakışıyor — iki paralel mesajlaşma sistemi kafa karıştırır

**Öneri:**
Blok 1-3 tamamlanıp test edildikten sonra, gerçekten workflow engine'e ihtiyaç duyuluyorsa Blok 4'e geçilsin. Aksi halde sim_updates + task_assignments mevcut ihtiyaçları karşılar.

**Eğer yapılacaksa dikkat:**
- Görev 31-34 (migration'lar) bir arada çalıştırılmalı (FK bağımlılıkları)
- robot_messages vs sim_updates karışıklığı netleştirilmeli

---

## BLOK 5 (GÖREV 41-50): OTOMASYON BOTLARI — DEĞERLENDİRME

### ⚠️ Genel Değerlendirme: ERTELENEBİLİR

**Neden?**
- Supabase webhook'lar + Vercel cron = dış bağımlılık yönetimi
- Görev 41 (Demo Talep Botu) ve Görev 42 (Tenant Kurulum Botu) aslında Blok 1'deki Görev 7 ve 9-10'un webhook versiyonları — aynı iş iki kez tanımlanmış
- CELF İşlemci Botu (Görev 43) her 5 dakikada bir cron çalıştırma → maliyet
- Güvenlik Robotu middleware (Görev 45) → her API isteğinde audit log yazma performans riski taşır

**Öneri:**
- Blok 1-3'teki API tabanlı yaklaşım (patron butonla tetikler) ilk MVP için yeterli
- Webhook/cron otomasyonu gerçek kullanıcı gelince (10+ tenant) eklensin
- Başlangıçta "yarı otomatik" (patron tetikler, sistem işler) yaklaşımı daha güvenli

---

## FRANCHISE PANELİ VE VELİ PANELİ — EKSİK BLOK

Dokümanın önemli bir eksikliği: **50 görevin hiçbiri doğrudan Franchise Panel UI veya Veli Panel UI içermiyor.** Bölüm 2'de "Kullanıcı Arayüzleri" altında listeleniyor ama görev listesinde yok.

### Önerilen Ek Blok 6: Franchise + Veli Paneli (Görev 51-60)

| # | Görev |
|---|-------|
| 51 | Franchise dashboard (4 kart, grafikler) |
| 52 | Öğrenci listesi + detay sayfası |
| 53 | Öğrenci kayıt formu (KVKK dahil) |
| 54 | Yoklama alma modülü |
| 55 | Yoklama geçmişi + takvim |
| 56 | Aidat listesi + ödeme kayıt |
| 57 | Kasa defteri + raporlar |
| 58 | Ders programı modülü |
| 59 | Veli paneli (çocuk takibi, gelişim, aidat) |
| 60 | Subdomain routing (middleware.ts) |

Bu blok olmadan sistem "yönetim aracı" olarak çalışır ama "franchise ürünü" olmaz.

---

## VERİ ROBOTU — EKSİK FAZ

Veri Robotu (templates, gelişim ölçümleri, referans değerler) YİSA-S'ın en büyük diferansiyasyon noktası. Dokümanın 50 görevinde bu içerik yok. Blok 5'teki Görev 46 sadece "cron ile şablon güncelleme" diyor — asıl şablon yapısı ve API eksik.

### Önerilen Ek: Veri Robotu Görevleri

| # | Görev |
|---|-------|
| — | templates tablosu migration + API |
| — | gelisim_olcumleri tablosu + API |
| — | referans_degerler tablosu + seed data |
| — | Gelişim analiz API (ölçüm vs referans karşılaştırma) |

---

## ÖNCELİK ÖNERİSİ

| Sıra | Blok | Tahmini Süre | Kritiklik |
|------|------|-------------|-----------|
| 1 | Bağlam komutu | 5 dk | ZORUNLU |
| 2 | Blok 1 (Görev 1-10) | 3-4 saat | KRİTİK — her şey buna bağlı |
| 3 | Blok 2 (Görev 11-20) | 3-4 saat | YÜKSEK — müşteri kazanımı |
| 4 | Franchise + Veli (Önerilen Blok 6) | 4-5 saat | YÜKSEK — ürünün kendisi |
| 5 | Blok 3 (Görev 21-30, basitleştirilmiş) | 3 saat | ORTA — otomasyon |
| 6 | Veri Robotu (Önerilen ek) | 2 saat | ORTA — diferansiyasyon |
| 7 | Blok 4-5 (İş akışı + Botlar) | 5+ saat | DÜŞÜK — 10+ tenant olduktan sonra |

**Toplam MVP tahmini:** ~15-20 saat (Blok 1 + 2 + Franchise/Veli + Blok 3 basit)

---

## SONUÇ VE TAVSİYELER

### Hemen Yapılabilir (Değişikliksiz):
1. **Bağlam komutunu v0.dev'e yapıştır** — olduğu gibi
2. **Blok 1 (Görev 1-10)** — sırayla ver, hepsinde teknik doğruluk var
3. **Blok 2 (Görev 11-14, 17-20)** — örtüşen görevleri (12, 15, 16) "güncelleme" olarak ver

### Dikkatle İlerle:
4. **Blok 3 (Görev 21-30)** — Görev 23'te AI sayısını azalt, Görev 26'yı basitleştir, Görev 28'den önce notifications migration ekle

### Ertele:
5. **Blok 4-5 (Görev 31-50)** — Workflow engine ve otomasyon botları MVP sonrasına bırak
6. Bu yerine **Franchise Paneli + Veli Paneli + Veri Robotu** görevlerini önceliklendir

### Doküman düzenlemesi:
- Bölüm 4 (Kullanım Rehberi) dosyada 2 kez tekrarlanmış — bir tanesi silinmeli
- Blok 6 (Franchise/Veli) ve Veri Robotu görevleri eklenmeli

---

**Hazırlayan:** YİSA-S AI Sistemi  
**Tarih:** 9 Şubat 2026
