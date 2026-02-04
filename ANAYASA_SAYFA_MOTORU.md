# YİSA-S Anayasa Sayfa Motoru

**Referans:** YISA-S-MASTER-DOKUMAN-v2.1-TASLAK (Sistem Anayasası)  
**Tarih:** 4 Şubat 2026  
**Amaç:** Rollerin faydaları, tüm hizmetler, tüm şablonlar, kim nerede ne yazar/nereye sunar — anayasaya göre tek referans.

---

## 1. Rol Hiyerarşisi (Anayasa Bölüm 3)

| Rol Kodu | Rol Adı | Panel / Giriş | Fayda / Ne Sunulur |
|----------|---------|----------------|---------------------|
| **PATRON** | Sistem sahibi (rol matrisinde ayrı kod yok) | `/patron/login` veya `/auth/login` → `/dashboard` | Komuta merkezi: Chat, onay kuyruğu, kasa, franchise listesi, şablon havuzu, robot durumu. Sporcu/antrenör sayıları **yok** (Franchise panelinde). |
| **ROL-2** | Alt Admin (Franchise Sahibi) | `/auth/login` → `/franchise` | Tesis paneli: Genel bakış, öğrenciler, antrenörler, ders programı, aidat, yoklama, sağlık, COO Mağazası, pazarlama, personel (IK), raporlar, ayarlar. Personel hedefleri (antrenör/temizlik/müdür), aidat kademeleri. |
| **ROL-3** | Tesis Müdürü | `/auth/login` → `/tesis` | Tesis operasyon paneli (tek tesis). |
| **ROL-4** | Sportif Direktör | (Franchise/tesis içi) | Sporcu programları, seviye/kazanım görünümü; CSPO çıktılarını alır. |
| **ROL-5** | Uzman Antrenör | `/auth/login` → `/antrenor` | Antrenör paneli: Ders yönetimi, yoklama, sporcu notları, kişiye özel antrenman önerileri (ölçümlere göre). |
| **ROL-6** | Antrenör | `/auth/login` → `/antrenor` | Aynı panel; kendi atandığı ders/sporcular. |
| **ROL-7** | Yardımcı/Stajyer | `/auth/login` → `/antrenor` (kısıtlı) | Yoklama, basit not girişi. |
| **ROL-8** | Kayıt Personeli | (Franchise/tesis) | Kayıt, aidat takibi, ödeme girişi. |
| **ROL-9** | Temizlik Personeli | (Franchise/tesis) | Temizlik/bakım takibi; tenant ayarında **temizlik_hedef** ile hedef sayı. |
| **ROL-10** | Veli | `/auth/login` → `/veli` | Çocuk takibi, ödeme, grafikler, sağlık özeti (çocuk ham veri açılmaz). |
| **ROL-11** | Sporcu | (Veli üzerinden veya ileride sporcu girişi) | Kendi gelişim grafikleri. |
| **ROL-12** | Misafir Sporcu | — | Sınırlı görüntüleme. |

**Personel hedefleri (tenants tablosu):**  
- `antrenor_hedef` — Hedef antrenör sayısı (Franchise Ayarlar’dan Franchise yetkilisi girer).  
- `temizlik_hedef` — Hedef temizlik personeli sayısı.  
- `mudur_hedef` — Hedef tesis müdürü sayısı.  

**Kim yazar:** Franchise Sahibi (ROL-2) veya yetkili franchise kullanıcısı, `/franchise` → Ayarlar sekmesi → `PATCH /api/franchise/settings`.

---

## 2. Tüm Hizmetler (Anayasa 1.3 Temel Paket + Vitrin)

| Hizmet | Açıklama | Nerede Sunulur | Kim Kullanır |
|--------|----------|-----------------|--------------|
| Tesis Yönetim Paneli | Sporcu kayıt, ders programı, yoklama, kasa defteri | `/franchise` (Genel Bakış, Öğrenciler, Ders Programı, Yoklama, Aidat) | Franchise Sahibi, Tesis Müdürü |
| Sporcu Grafikleri | Gelişim grafikleri, tablolar, ölçümler | `/veli` (çocuk), ileride raporlar | Veli, Antrenör, Sportif Direktör |
| Kişiye Özel Antrenman | Ölçümlere göre bireysel antrenman önerileri | CSPO (readOnly athletes + health) → Sportif Direktör / Antrenör | Antrenör, Uzman Antrenör |
| Veli Paneli | Çocuk takibi, ödeme, grafikler | `/veli` | Veli |
| Antrenör Paneli | Ders yönetimi, yoklama, sporcu notları | `/antrenor` | Antrenör, Uzman Antrenör, Yardımcı/Stajyer |
| Karşılama Robotu | Web sitesinde ziyaretçi karşılama | Vitrin / tanıtım | Ziyaretçi |
| 7/24 Acil Destek Robotu | Sistem sorunlarında Patron'a alarm | Patron / sistem | Patron |
| Veri Tabanı Erişimi | Akademik makaleler, federasyon bilgileri | (Planlanan modül) | Franchise |
| COO Mağazası | Şablonlar, robotlar, modüller satın alma | `/franchise` → COO Mağazası sekmesi | Franchise yetkilisi |
| Ders Programı | Haftalık ders programı | `/franchise` → Ders Programı, `tenant_schedule` | Franchise, Tesis Müdürü |
| Sağlık Takibi | Sporcu sağlık kayıtları (CSPO readOnly) | `/franchise` → Sağlık Takibi, `athlete_health_records` | Franchise, Antrenör (kısıtlı) |
| Aidat Takibi | Ödeme kademeleri (25/45/60 saat TL) | `/franchise` → Aidat Takibi, `tenants.aidat_tiers` | Franchise, Kayıt Personeli |

---

## 3. Çocukların Bel / Kazanım / Seviye

| Veri | Nerede Tutulur | Kim Yazar | Kim Okur | Nereye Sunulur |
|------|-----------------|-----------|----------|-----------------|
| Sporcu seviye (level) | `athletes.level` (TEXT) | Franchise paneli (Öğrenci ekle/düzenle) | Antrenör, Sportif Direktör, CSPO (readOnly), Veli (kendi çocuğu) | Antrenör paneli, Veli paneli, raporlar |
| Branş | `athletes.branch` | Aynı | Aynı | Grafikler, filtreler |
| Değerlendirme / kazanım | `evaluations` (planlanan), ileride bel/kuşak | Antrenör / CSPO çıktısı | Sportif Direktör, Antrenör | CSPO yaşa göre antrenman hazırlar → Sportif Direktöre sunar |
| Sağlık kaydı | `athlete_health_records` | Franchise / yetkili personel | CSPO readOnly, Antrenör (politikaya göre) | Sağlık Takibi sekmesi |

**Anayasa:** Çocuk ham veri açılmaz; LLM'ler çocuk verisiyle konuşmaz. CSPO sadece readOnly athletes + health_records.

---

## 4. Şablonlar — Kim Üretir, Nerede Kullanılır

| Şablon Kaynağı | Kim Üretir | Nereye Yazılır | Nereden Okunur | Nereye Sunulur |
|----------------|------------|-----------------|-----------------|----------------|
| Patron komut → CEO → CELF | Patron (Chat) + CELF direktörü (CFO, CTO, CSPO vb.) | `ceo_templates` (onay sonrası) | `GET /api/templates` | Patron: `/dashboard/sablonlar`. Franchise: `/franchise` → COO Mağazası (onaylı = `coo_templates`) |
| Sablonlar / templates tablosu | Seed veya manuel | `templates`, `sablonlar`, `ceo_templates` | Aynı API | COO Mağazası birleşik liste |
| Direktör kategorileri | — | CFO, CLO, CHRO, CMO, CTO, CSO, CSPO, COO, CMDO, CCO, CDO, CISO, RND | Filtre: `?kategori=CFO` | Patron şablonlar sayfası |

**Akış:**  
1. Patron "CFO'ya maliyet raporu şablonu hazırla" → CEO → CELF (CFO) → çıktı onay kuyruğuna.  
2. Patron Onay Kuyruğu’nda Onayla → `ceo_templates`’e kaydedilir, `is_approved = true`.  
3. Franchise COO Mağazası’nda bu şablon `coo_templates` içinde listelenir.  
4. Franchise "Satin Al" → `POST /api/sales` → `celf_kasa` + `tenant_purchases`. Patron "Ödemeyi onayla" → kullanım açılır.

---

## 5. Kim Nerede Ne Yazar — Özet Tablo

| Veri / İşlem | Kim Yazar | Nereye | API / Sayfa |
|--------------|-----------|--------|-------------|
| Patron komut | Patron | CEO → CELF → patron_commands | Chat → "CEO'ya Gönder" |
| Onay / Red | Patron | patron_commands, ceo_tasks | `/dashboard/onay-kuyrugu` |
| Kasa onayı | Patron | celf_kasa, tenant_purchases | `/dashboard/kasa-defteri` → Ödemeyi onayla |
| Migration | Patron | DB | `/api/db/migrate` (sadece Patron) |
| Şablon (onaylı) | Patron (onay) + CELF (üretim) | ceo_templates | Onay Kuyruğu Onayla |
| Franchise ayarları | Franchise yetkilisi | tenants (antrenor_hedef, temizlik_hedef, mudur_hedef, aidat_tiers) | `/franchise` → Ayarlar → `PATCH /api/franchise/settings` |
| Ders programı | Franchise / Tesis | tenant_schedule | `/franchise` → Ders Programı → `POST/DELETE /api/franchise/schedule` |
| Öğrenci (sporcu) | Franchise / Kayıt | athletes | `/franchise` → Öğrenciler → `/api/franchise/athletes` |
| Personel | Franchise / IK | staff | `/franchise` → Personel → `/api/franchise/staff` |
| Satış (COO Mağaza) | Franchise | celf_kasa, tenant_purchases | `/franchise` → COO Mağazası → `POST /api/sales` |
| Yoklama | Antrenör / Tesis | attendance | `/api/franchise/attendance` |
| Ödeme (aidat) | Kayıt / Franchise | payments | `/api/franchise/payments` |
| Demo / Vitrin talep | Ziyaretçi | demo_requests | `/vitrin` → `POST /api/demo-requests` |
| Demo onay / Tenant oluşturma | Patron | demo_requests, tenants, user_tenants | `/dashboard/onay-kuyrugu` (demo onayı) |

---

## 6. Sayfa → Rol → API Eşlemesi (Çalışır Vaziyet)

### 6.1 Patron Paneli (`/dashboard`)

| Sayfa | URL | API (GET/POST) | Auth |
|-------|-----|----------------|------|
| Ana sayfa | `/dashboard` | /api/chat/flow, /api/startup, /api/stats | canAccessDashboard |
| Onay Kuyruğu | `/dashboard/onay-kuyrugu` | GET/POST /api/approvals | requireDashboard / requirePatronOrFlow |
| Kasa Defteri | `/dashboard/kasa-defteri` | GET /api/expenses, POST /api/kasa/approve | requireDashboard / requirePatron |
| Franchise listesi | `/dashboard/franchises` | /api/franchises | requireDashboard |
| Şablonlar | `/dashboard/sablonlar` | GET/POST /api/templates | requireDashboard |
| Direktörler | `/dashboard/directors` | GET/POST /api/startup | requirePatronOrFlow |
| Robotlar | `/dashboard/robots` | /api/directors/status | requireDashboard |
| Raporlar | `/dashboard/reports` | — | requireDashboard |
| Ayarlar | `/dashboard/settings` | — | requireDashboard |
| Migrate | (Onay Kuyruğu içi veya ayrı) | POST /api/db/migrate | requirePatron |

### 6.2 Franchise Paneli (`/franchise`)

| Sekme | Veri Kaynağı | API |
|-------|--------------|-----|
| Genel Bakış | tenant, athletes, staff | /api/franchise/tenant, /api/franchise/athletes, /api/franchise/staff |
| Öğrenciler | athletes | GET/POST /api/franchise/athletes |
| Antrenörler | staff | GET/POST /api/franchise/staff |
| Ders Programı | tenant_schedule | GET/POST/DELETE /api/franchise/schedule |
| Aidat Takibi | payments, tenants.aidat_tiers | /api/franchise/payments |
| Yoklama | attendance | /api/franchise/attendance |
| Sağlık Takibi | athlete_health_records, athletes | /api/franchise/athletes (+ health) |
| COO Mağazası | coo_templates (ceo_templates onaylı) | GET /api/templates (coo_templates), POST /api/sales |
| Pazarlama | (Mock / ileride CMO) | — |
| Personel (IK) | staff | /api/franchise/staff |
| Raporlar | (Veri bağlantısı sonrası) | — |
| Ayarlar | tenants (hedefler, aidat_tiers) | GET/PATCH /api/franchise/settings |

### 6.3 Veli Paneli (`/veli`)

| Alan | Veri | API |
|------|------|-----|
| Çocuk özeti | athletes (parent_user_id = veli) | /api/veli/children |
| Sağlık | athlete_health_records (çocuk) | — |
| Antrenman / hareketler | (Planlanan) | — |
| Ödeme | payments | /api/veli/payments |

### 6.4 Vitrin (`/vitrin`)

| İşlem | API |
|-------|-----|
| Paket seçimi, form gönder | POST /api/demo-requests |
| Talep listesi (Patron) | GET /api/demo-requests (onay/red) |

### 6.5 Tesis (`/tesis`) ve Antrenör (`/antrenor`)

- **Tesis:** Tesis operasyon paneli; tenant + attendance + staff/athletes ile aynı API’ler (tenant_id ile filtre).
- **Antrenör:** Ders, yoklama, sporcu notları; `/api/franchise/attendance`, ileride antrenör-scoped athletes.

---

## 7. Sistem Çalışır Vaziyet Özeti

- **Patron:** Giriş → Dashboard → Chat (Asistan) → Komut → CEO → CELF → Onay Kuyruğu → Onayla/Reddet. Kasa Defteri’nde gelirleri görür, "Ödemeyi onayla" sadece Patron. Migrate sadece Patron.
- **Franchise yetkilisi:** Giriş → Franchise paneli → Ayarlar’da antrenör/temizlik/müdür hedefi ve aidat kademeleri. Ders programı ekler/siler. Öğrenci ve personel girer. COO Mağazası’ndan şablon/ürün satın alır → Satış CELF Kasaya yazılır → Patron onayı sonrası kullanım açılır.
- **Antrenör / Tesis müdürü / Temizlik:** Rolüne göre `/antrenor` veya `/tesis`; yoklama, ders, personel hedefleri (görüntüleme) ilgili sayfalarda.
- **Veli:** Çocuk takibi, ödeme, grafikler (çocuk verisi anayasa kurallarına uygun; ham veri açılmaz).
- **Şablonlar:** Patron + CELF üretir → Onay → ceo_templates → COO Mağazası’nda listelenir → Franchise satın alır → Patron kasa onayı.

Tüm bu akışlar anayasada tanımlı rol ve hizmetlerle uyumludur; sayfa motoru tek referans olarak bu dokümandan takip edilebilir.
