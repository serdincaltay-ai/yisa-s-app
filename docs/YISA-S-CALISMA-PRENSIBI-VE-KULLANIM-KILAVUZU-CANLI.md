# YİSA-S — Çalışma Prensibi ve Kullanım Kılavuzu (Canlı)

> **CANLI DOSYA:** Çalışma prensibi veya kullanıcı arayüzünde (UI) değişiklik olduğunda bu dosya güncellenir.
>
> **Son güncelleme:** 05.03.2026 — Kod tabanı incelenerek 4 robot, 15 direktörlük, 3 site, rol-panel eşlemeleri detaylı yazıldı.

---

## A. Çalışma Prensibi (Sistem Nasıl İşliyor?)

### A.1 Robotlar ve Agentlar

YİSA-S sisteminde 4 ana robot ve 15 direktörlük (agent) bulunur. Her robot belirli bir sorumluluk alanına sahiptir.

#### 4 Ana Robot

| # | Robot | Görev | Konum (kod) | Tetikleyici |
|---|-------|-------|-------------|-------------|
| 1 | **YİSA-S CELF (CEO)** | Tüm direktörlükleri yönetir; görev dağıtımı, onay, şablon üretimi, rutin planlama | `lib/robots/ceo-robot.ts`, `celf-center.ts`, `celf-config-merged.ts` | Patron komutu, CIO analizi, COO cron |
| 2 | **Veri Robotu** | Şablon kütüphanesi yönetimi, görev sonuçlarını arşivleme (task_results), veri okuma/yazma | `lib/db/task-results.ts`, `api/templates/`, `api/task-results/` | CELF sonucu, API çağrısı |
| 3 | **Güvenlik Robotu** | Güvenlik kontrolü (securityCheck), audit log, RLS politikaları, yasak bölge koruması | `lib/robots/security-robot.ts`, `lib/security/forbidden-zones.ts`, `patron-lock.ts`, `siber-guvenlik.ts` | Her API çağrısı (flow, CEO, CELF, security endpoint) |
| 4 | **YİSA-S Robotu (Vitrin/ManyChat)** | Vitrin chatbot, demo talep toplama, NeebChat robot sayfası | `yisa-s-com/components/robot/`, `yisa-s-com/app/robot/` | Ziyaretçi etkileşimi |

#### 15 Direktörlük (CELF Agentları)

| # | Direktörlük | Kısaltma | Sorumluluk Alanı | Başlangıç Görev Sayısı |
|---|-------------|----------|------------------|------------------------|
| 1 | Chief Financial Officer | **CFO** | Finans, bütçe, kasa, aidat takibi | 2 görev |
| 2 | Chief Technology Officer | **CTO** | Teknik altyapı, deployment, kod kalitesi | 2 görev |
| 3 | Chief Information Officer | **CIO** | Bilgi analizi, çakışma kontrolü, yönlendirme | 1 görev |
| 4 | Chief Marketing Officer | **CMO** | Pazarlama, sosyal medya, kampanya | 2 görev |
| 5 | Chief Human Resources Officer | **CHRO** | İnsan kaynakları, personel, eğitim | 2 görev |
| 6 | Chief Legal Officer | **CLO** | Hukuk, sözleşme, KVKK uyumu | 2 görev |
| 7 | Chief Sales Officer (Satış) | **CSO_SATIS** | Satış, lead yönetimi, franchise satış | 2 görev |
| 8 | Chief Product Officer | **CPO** | Ürün geliştirme, özellik planlama | 2 görev |
| 9 | Chief Data Officer | **CDO** | Veri yönetimi, analiz, raporlama | 2 görev |
| 10 | Chief Information Security Officer | **CISO** | Bilgi güvenliği, penetrasyon testi, güvenlik politikası | 2 görev |
| 11 | Chief Communications Officer | **CCO** | İletişim, duyurular, medya | 2 görev |
| 12 | Chief Strategy Officer | **CSO_STRATEJI** | Strateji, vizyon, rakip analizi | 1 görev |
| 13 | Chief Sports Officer | **CSPO** | Spor programları, antrenör yönetimi, gelişim ölçüm | 3 görev |
| 14 | Chief Operating Officer | **COO** | Operasyon, rutin görevler, cron yönetimi | 2 görev |
| 15 | Research & Development | **RND** | Ar-Ge, yeni teknoloji, inovasyon | 2 görev |

**Kaynak:** `lib/robots/directorate-initial-tasks.ts` (476 satır) — Her direktörlüğün başlangıç görevleri burada tanımlı.

#### Robot Tetikleme Zinciri (Omurga)

```
Patron (kullanıcı)
  → Güvenlik Robotu (securityCheck)
    → CIO (analyzeCommand, conflictWarnings)
      → CEO (routeToDirector, createCeoTask)
        → CELF Direktörlük (runCelfDirector)
          → Veri Robotu (archiveTaskResult)
            → Patron Onay Kuyruğu (createPatronCommand)
              → Patron Onayı → Yayınlama

COO (Cron: /api/coo/run-due)
  → ceo_routines tablosu → CELF → archiveTaskResult
```

### A.2 Görevlendirmeler ve Veri Akışı

#### Tenant (Kiracı) Sistemi

YİSA-S çoklu kiracı (multi-tenant) mimarisi kullanır:

| Kavram | Açıklama | Tablo |
|--------|----------|-------|
| **Tenant** | Bir spor okulu/tesis | `tenants` |
| **Franchise** | Tenant'ın franchise kaydı | `franchises` |
| **Subdomain** | Tenant'a ait alt alan adı (slug.yisa-s.com) | `franchise_subdomains` |
| **User-Tenant bağlantısı** | Kullanıcı hangi tenant'a ait | `user_tenants` |

**Provisioning Zinciri (Yeni Tenant Oluşturma):**
1. `create_tenant` → tenants tablosuna kayıt
2. `setup_user` → Auth kullanıcısı + user_tenants bağlantısı
3. `create_franchise` → franchises kaydı
4. `create_subdomain` → franchise_subdomains kaydı
5. `seed_data` → Başlangıç verileri (şablonlar, ayarlar)
6. `update_status` → demo_requests durumu "converted"

#### 3 Çekirdek Site

| Site | Domain | Repo | Amaç |
|------|--------|------|------|
| **Patron Paneli** | app.yisa-s.com | tenant-yisa-s | Patron dashboard, CELF, onay kuyruğu, tüm yönetim |
| **Vitrin** | yisa-s.com | yisa-s-com | Tanıtım, demo formu, fiyatlandırma, blog, franchise |
| **Franchise Siteleri** | *.yisa-s.com | tenant-yisa-s | Her tesis için ayrı subdomain (ör. bjktuzlacimnastik.yisa-s.com) |

#### Rol-Panel Eşlemesi

| Rol | Giriş Sonrası Panel | URL |
|-----|---------------------|-----|
| Patron | Patron Dashboard | `/dashboard` |
| Franchise / Tesis Sahibi | Franchise Paneli | `/franchise` |
| Tesis Müdürü | Tesis Paneli | `/tesis` |
| Antrenör | Antrenör Paneli | `/antrenor` |
| Veli | Veli Paneli | `/veli` |
| Kayıt Görevlisi | Franchise/Panel | `/franchise` veya `/panel` |
| Temizlik Personeli | (Franchise) | `/franchise` (rol: cleaning) |

**Kaynak:** `lib/auth/resolve-role.ts` — Giriş yapan kullanıcının rolüne göre yönlendirme.

---

## B. Kullanım Kılavuzu (Ekran Ekran)

### B.1 Patron Paneli (app.yisa-s.com)

| Sayfa | URL | Açıklama |
|-------|-----|----------|
| Ana Sayfa / Dashboard | `/dashboard` | Genel bakış, asistan sohbet, CEO'ya Gönder butonu |
| CELF Direktörlükleri | `/dashboard/directors` | 15 direktörlüğün listesi ve görev durumu |
| Direktörler (Canlı) | `/dashboard/robots` | Aktif robotların durumu |
| Onay Kuyruğu | `/dashboard/onay-kuyrugu` veya `/patron/onay-kuyrugu` | Patron Komutları + Demo Talepleri sekmeleri; Onayla/Reddet |
| Franchise / Vitrin | `/dashboard/franchises` | Franchise listesi, satış yap, detay |
| Kasa Defteri | `/dashboard/kasa-defteri` | Gelir/gider takibi (expenses API) |
| Şablonlar | `/dashboard/sablonlar` | ceo_templates + v0_template_library |
| Raporlar | `/dashboard/reports` | Son görevler (task_results), CELF sonuçları |
| Ayarlar | `/dashboard/settings` | Sistem ayarları |

**Asistan Sohbet:** 11 asistan seçilebilir (GPT, Gemini, Claude, Together, V0, Cursor, Supabase, GitHub, Vercel, Railway, Fal). Mesaj yazılır → Gönder. "CEO'ya Gönder" butonu ile sohbet CELF'e komut olarak iletilir.

### B.2 Franchise Paneli (*.yisa-s.com/franchise)

| Sayfa | URL | Açıklama |
|-------|-----|----------|
| Dashboard | `/franchise` | Genel bakış, istatistikler |
| Öğrenci Yönetimi | `/franchise/ogrenci-yonetimi` | Öğrenci CRUD |
| Yoklama | `/franchise/yoklama` | Geldi/Gelmedi/Muaf |
| Aidatlar | `/franchise/aidatlar` veya `/panel/aidat` | Aidat listesi, ödeme takibi |
| İletişim | `/franchise/iletisim` | Duyurular, mesajlar |
| Belgeler | `/franchise/belgeler` | Sağlık raporu, sözleşme vb. |
| Personel | `/franchise/personel` veya `api/franchise/staff` | Personel listesi, davet, rol atama |
| Ders Programı | `/panel/program` | Haftalık ders programı |
| Kasa | `/kasa` | Gelir/gider raporu |

### B.3 Veli Paneli (veli.yisa-s.com veya /veli)

| Sayfa | URL | Açıklama |
|-------|-----|----------|
| Çocuk Seçimi | `/veli` | Kayıtlı çocukların listesi |
| Dashboard | `/veli/dashboard` | Seçili çocuğun özet bilgileri |
| Çocuk Detay | `/veli/cocuk/[id]` | Gelişim, yoklama, ödeme detayı |
| Gelişim | `/veli/gelisim` | Çocuğun gelişim takibi |
| Ödeme | `/veli/odeme` | Ödeme geçmişi ve durumu |
| Mesajlar | `/veli/mesajlar` | Antrenör ile iletişim |
| Duyurular | `/veli/duyurular` | Tesis duyuruları |
| Kredi | `/veli/kredi` | Kredi/puan durumu |
| Giriş | `/veli/giris` | Veli giriş sayfası |

**Veri kaynağı:** `api/veli/children` → athletes tablosu (parent_user_id = giriş yapan). İlk girişte parent_email ile otomatik bağlanır.

### B.4 Antrenör Paneli (/antrenor)

| Sayfa | URL | Açıklama |
|-------|-----|----------|
| Dashboard | `/antrenor` | Bugünkü dersler, atanan sporcular |
| Sporcular | `/antrenor/sporcular` | Sporcu listesi |
| Sporcu Detay | `/antrenor/sporcular/[id]` | Bireysel sporcu bilgileri |
| Gelişim | `/antrenor/sporcular/[id]/gelisim` | Sporcu gelişim takibi |
| Yoklama | `/antrenor/yoklama` | Ders yoklaması |
| Ölçüm | `/antrenor/olcum` | Sporcu ölçüm girişi |

### B.5 Tesis Müdürü Paneli (/tesis)

| Sayfa | URL | Açıklama |
|-------|-----|----------|
| Ana Sayfa | `/tesis` | Tek sayfa: sidebar menü (Ana Sayfa, Öğrenciler, Ders Programı, Sağlık Takibi, Antrenörler, Belgeler, Raporlar, Ayarlar) |

**Not:** Şu an mock veri ile çalışıyor. Gerçek API ve alt sayfalar yapılacak.

### B.6 Vitrin (yisa-s.com)

| Sayfa | URL | Açıklama |
|-------|-----|----------|
| Ana Sayfa | `/` | Hero, Features, Social Proof, Pricing, FAQ, Footer |
| Demo | `/demo` | Demo talep formu |
| Franchise | `/franchise` | Franchise başvuru bilgileri |
| Fiyatlandırma | `/fiyatlandirma` | Paket ve fiyat bilgileri |
| Özellikler | `/ozellikler` | Sistem özellikleri |
| Hakkımızda | `/hakkimizda` | Şirket bilgileri |
| Blog | `/blog` | Blog yazıları |
| Robot | `/robot` | NeebChat robot sayfası |
| Fuar | `/fuar` | Fuar hesaplama |
| Şablonlar | `/sablonlar` | Şablon galerisi |

---

## C. Supabase Altyapısı

### Temel Tablolar

| Tablo | Amaç |
|-------|------|
| `tenants` | Kiracı (spor okulu) kayıtları |
| `user_tenants` | Kullanıcı-tenant bağlantısı |
| `franchises` | Franchise kayıtları |
| `franchise_subdomains` | Subdomain yönetimi |
| `demo_requests` | Demo talepleri |
| `athletes` / `students` | Öğrenci/sporcu kayıtları |
| `staff` | Personel kayıtları |
| `payments` | Ödeme kayıtları |
| `student_attendance` | Yoklama kayıtları |
| `security_logs` | Güvenlik audit log |
| `ceo_templates` | CEO şablonları (66+) |
| `templates` | Genel şablonlar |
| `v0_template_library` | V0 şablon kütüphanesi |
| `task_results` | CELF görev sonuçları arşivi |
| `ceo_routines` | Rutin görevler (cron) |
| `approval_queue` / `patron_commands` | Onay kuyruğu |
| `sim_updates` | CELF tetikleme kayıtları |

### RLS (Row Level Security)

Tüm tablolarda RLS aktif. Temel fonksiyonlar:
- `rls_is_patron()` — Patron rolü kontrolü
- `rls_parent_athlete_ids()` — Velinin çocuklarını filtreleme
- `rls_trainer_athlete_ids()` — Antrenörün sporcularını filtreleme

**Kaynak:** `scripts/006_rls_policies.sql` (1539 satır)

---

## D. Nasıl Güncellenir

Bu dosya **çalışma prensibi veya UI değişikliği** olduğunda güncellenir:
- Yeni robot/agent eklendiğinde → A.1 tablosuna ekle
- Yeni sayfa/panel eklendiğinde → B bölümüne ekle
- Rol değişikliği olduğunda → A.2 rol-panel tablosunu güncelle
- Tablo eklendiğinde → C bölümünü güncelle

**Bu dosya canlı kılavuz dosyasıdır; prensip veya UI değişikliğinde anında güncellenir.**
