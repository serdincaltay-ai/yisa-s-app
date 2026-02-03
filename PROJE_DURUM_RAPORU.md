# YİSA-S Proje Durum Raporu

**Tarih:** 2 Şubat 2026  
**Referans:** YISA-S-MASTER-DOKUMAN-v2.1-TASLAK (Sistem Anayasası)  
**Hazırlayan:** Cursor (Analiz)

---

## 1. SİSTEM ANAYASASINA GÖRE NE İSTENDİ?

### İstenen Akış
```
Patron → CELF motoru → Franchise vitrini → Satış → Tesis kurulumu
```

### Bu Akış Şu An Çalışıyor mu?

| Adım | Durum | Açıklama |
|------|-------|----------|
| **Patron** | ✅ Çalışıyor | Patron paneli (app.yisa-s.com), giriş, dashboard |
| **CELF motoru** | ✅ Kısmen çalışıyor | CEO → 13 direktörlük (CFO, CTO, CIO, CMO, CHRO, CLO, CSO_SATIS, CPO, CDO, CISO, CCO, CSO_STRATEJI, CSPO) tanımlı. Chat flow: imla → Şirket İşi/Özel İş → CEO → CELF → Patron onayı |
| **Franchise vitrini** | ⚠️ Kısmen | Tanıtım sayfası (www), demo sayfası (/demo), franchise paneli (/franchise) mock data ile |
| **Satış** | ❌ Eksik | Paket seçimi, fiyatlandırma, ödeme akışı yok. Franchise başvuru formu sadece `alert()` — DB'ye kaydetmiyor |
| **Tesis kurulumu** | ❌ Eksik | Otomatik tesis paneli kurulumu, site şablonu seçimi, tenant provisioning yok |

**Sonuç:** Akışın **ilk yarısı (Patron → CELF)** çalışıyor. **Satış ve tesis kurulumu** tarafı henüz implemente edilmemiş.

---

## 2. MEVCUT DURUM ANALİZİ — SUBDOMAIN BAZINDA

### 2.1 www.yisa-s.com (Tanıtım)

| Özellik | Durum | Detay |
|---------|-------|-------|
| Ana sayfa | ✅ | Tanıtım, sloganlar, CTA butonları |
| Patron Paneli linki | ✅ | /auth/login |
| Sistemi Tanıyın (Demo) | ✅ | /demo |
| Veli Girişi linki | ✅ | /auth/login?panel=veli |
| Franchise Başvurusu | ⚠️ | Form var; **DB'ye kaydetmiyor**, sadece `alert("Başvurunuz alındı!")` |
| CO Vitrin bölümü | ✅ | Metin ve kartlar |
| Pilot tesis (Tuzla Beşiktaş) | ✅ | Referans ve giriş CTA |

**Eksik:** Başvuru verisinin `demo_requests`, `demo_talepleri` veya `leads` tablosuna yazılması.

---

### 2.2 app.yisa-s.com (Patron Paneli)

| Özellik | Durum | Detay |
|---------|-------|-------|
| Giriş | ✅ | Supabase Auth, rol çözümleme |
| Dashboard ana sayfa | ✅ | Chat, onay kuyruğu, istatistikler, takvim |
| Asistan (CIPS) | ✅ | İmla düzeltme (Gemini/GPT) → Şirket İşi / Özel İş → CEO → CELF → Onay |
| Onay Kuyruğu | ✅ | Bekleyen / Onayla / Reddet / Değiştir |
| Direktörler (Canlı) | ✅ | /dashboard/robots — bugünkü iş sayıları |
| Franchise / Vitrin | ✅ | /dashboard/franchises — API'den franchise listesi |
| Kasa Defteri | ✅ | /dashboard/kasa-defteri |
| Şablonlar | ⚠️ | Sayfa var, içerik iskelet |
| Raporlar | ⚠️ | Sayfa var, içerik iskelet |
| Ayarlar | ⚠️ | Sayfa var |

**Eksik:** Şablonlar, raporlar ve ayarlar sayfalarının anlamlı içerikle doldurulması.

---

### 2.3 franchise.yisa-s.com (Franchise Paneli)

| Özellik | Durum | Detay |
|---------|-------|-------|
| Giriş yönlendirmesi | ✅ | Middleware: `/` → giriş varsa /franchise |
| Franchise paneli | ⚠️ | Tüm veriler **mock** (mockStudents, mockTrainers, mockCOOProducts) |
| Genel Bakış | ⚠️ | Mock |
| Öğrenciler | ⚠️ | Mock |
| Antrenörler | ⚠️ | Mock |
| Ders Programı | ⚠️ | Mock |
| Sağlık Takibi | ⚠️ | Mock |
| COO Mağazası | ⚠️ | Mock (Token ile satın alma UI var, API yok) |
| Pazarlama | ⚠️ | Mock |
| Personel (IK) | ⚠️ | Form var; kayıt API yok |
| Raporlar | ❌ | "Veritabanı bağlantısı sonrası aktif" |
| Ayarlar | ⚠️ | Form var, API yok |

**Eksik:** Gerçek Supabase/tenant verisi bağlantısı, öğrenci/antrenör CRUD API’leri.

---

### 2.4 veli.yisa-s.com (Veli Paneli)

| Özellik | Durum | Detay |
|---------|-------|-------|
| Giriş yönlendirmesi | ✅ | Middleware: `/` → giriş varsa /veli |
| Veli paneli | ⚠️ | Tüm veriler **mock** |
| Genel (çocuk özeti) | ⚠️ | mockChild |
| Sağlık | ⚠️ | mockHealthData |
| Antrenman | ⚠️ | mockMovements |
| AI Analiz | ⚠️ | mockAIInsights |
| Ödeme | ❌ | Token/harca butonu var, işlev yok |

**Eksik:** Gerçek veli→çocuk ilişkisi, ödeme API’leri, antrenör/tesis bağlantısı.

---

## 3. KULLANICI AKIŞLARI

### 3.1 PATRON (Sen)

| Soru | Cevap |
|------|-------|
| **Nereden giriş yapıyorum?** | `app.yisa-s.com` veya `www.yisa-s.com` → Patron Paneli linki → `/auth/login` |
| **Giriş yaptığımda ne görüyorum?** | Dashboard: Chat (Asistan), Onay Kuyruğu, İstatistikler (franchise geliri, gider, aktif franchise, onay bekleyen, başvuru), Takvim, Startup görevleri |
| **CELF direktörlüklerini nasıl yönetiyorum?** | Chat üzerinden: Mesaj yaz → İmla onayı → "Şirket İşi" → CEO → CELF direktörüne yönlendirme → Sonuç Onay Kuyruğu’na düşer → Onayla/Reddet/Değiştir |
| **Franchise vitrinini nasıl kontrol ediyorum?** | Sidebar → Franchise/Vitrin → `/dashboard/franchises`. API: `franchises`, `organizations` veya `tenants` tablosundan liste |
| **Robot sistemleri nasıl çalışıyor?** | CEO → CELF (13 direktörlük) → COO. Chat flow: `correctSpelling` (Gemini/GPT) → `routeToDirector` → `runCelfDirector` (Claude/GPT/Gemini). API’ler yalnızca Asistan + CELF içinde |

---

### 3.2 FRANCHISE MÜŞTERİSİ (Tesis sahibi olmak isteyen)

| Soru | Cevap |
|------|-------|
| **Tanıtım sitesine geldi, ne görüyor?** | www.yisa-s.com: Hero, özellikler, "Sistemi Tanıyın", pilot tesis, franchise başvuru formu |
| **Demo talep formu var mı?** | Evet (ana sayfa ve /demo). **Eksik:** Form DB’ye yazmıyor |
| **Paket seçimi nasıl yapacak?** | ❌ Yok |
| **Site şablonu nasıl seçecek?** | ❌ Yok |
| **Ödeme nereye yapacak?** | ❌ Yok |
| **Seçtikten sonra tesis paneli nasıl kurulacak?** | ❌ Otomatik kurulum yok |

---

### 3.3 FRANCHISE SAHİBİ (Satın almış, tesis kurmuş)

| Soru | Cevap |
|------|-------|
| **Nereden giriş yapıyor?** | `franchise.yisa-s.com` veya `/auth/login` → rol franchise → `/franchise` |
| **Kendi tesisini nasıl yönetiyor?** | Franchise paneli (mock). Gerçek tenant/tesis verisi yok |
| **Personel nasıl ekliyor?** | Personel (IK) formu var; kayıt API yok |
| **Üye/sporcu nasıl kaydediyor?** | UI var; API/DB bağlantısı yok |
| **Robot asistan var mı?** | COO Mağazası mock (Sosyal Medya, WhatsApp, Strateji robotları vb.); satın alma Token ile mock |

---

### 3.4 VELİ

| Soru | Cevap |
|------|-------|
| **Nereden giriş yapıyor?** | `veli.yisa-s.com` veya `/auth/login?panel=veli` → rol veli → `/veli` |
| **Çocuğunu nasıl takip ediyor?** | Mock çocuk verisi (Elif Yılmaz) |
| **Ödeme nasıl yapıyor?** | ❌ Ödeme akışı yok |
| **Antrenman programını nasıl görüyor?** | Mock haftalık program |

---

### 3.5 ANTRENÖR

| Soru | Cevap |
|------|-------|
| **Nereden giriş yapıyor?** | `/auth/login` → rol antrenör → `/antrenor` |
| **Ne görüyor, ne yapıyor?** | Antrenör paneli: bugünkü öğrenciler, ders programı, yoklama butonları — hepsi mock |

---

## 4. VERİTABANI DURUMU

### 4.1 Tablolar (Özet)

**Chat / CEO / CELF:**
- `chat_messages`, `patron_commands`, `ceo_tasks`, `celf_logs`, `patron_private_tasks`, `celf_audit_logs`

**Patron / Operasyon:**
- `approval_queue`, `pending_approvals`, `workflow_tasks`, `expenses`, `kasa_defteri`, `franchises`, `tenants`, `organizations`

**Şablon / AR-GE:**
- `templates`, `sablonlar`, `rd_suggestions`, `ceo_updates`, `director_rules`, `coo_rules`

**CELF / Maliyet:**
- `celf_cost_reports`, `patron_sales_prices`, `payment_schedule`, `franchise_payments`

**Diğer:**
- `audit_log`, `profiles`, `kullanicilar`, `roller`, `role_permissions`

### 4.2 Tenant (Multi-tenant) İzolasyonu

| Özellik | Durum |
|---------|-------|
| `tenants` tablosu | ✅ Tanımlı |
| `franchises.tenant_id` | ✅ FK |
| `approval_queue.tenant_id` | ✅ FK |
| `api_usage.tenant_id` | ✅ FK |
| RLS / tenant filtreleme | ⚠️ Bazı tablolarda politikalar var; tüm veri erişiminde tutarlı kullanım doğrulanmalı |
| `get_user_tenant_id` fonksiyonu | ✅ validate-system.sql içinde referans |

### 4.3 Kullanıcı Rolleri

| Kaynak | Durum |
|--------|-------|
| `profiles.role` | ✅ |
| `kullanicilar` + `roller.kod` | ✅ |
| `user_metadata.role` | ✅ |
| `resolveLoginRole` önceliği | PATRON_EMAIL > kullanicilar.roller > profiles > user_metadata |
| ROL-0 … ROL-12 (Anayasa) | `ANAYASA_ROL_KODLARI` ile tanımlı |

---

## 5. ROBOT SİSTEMİ

### 5.1 CEO, CELF, Direktörlükler

| Bileşen | Durum |
|---------|-------|
| CEO Organizatör | ✅ ceo-robot.ts, routeToDirector |
| CELF Merkez | ✅ celf-center.ts, 13 direktörlük |
| Direktörlükler | CFO, CTO, CIO, CMO, CHRO, CLO, CSO_SATIS, CPO, CDO, CISO, CCO, CSO_STRATEJI, CSPO |
| COO | ✅ coo-robot.ts |
| CIO (strateji analizi) | ✅ cio-robot.ts |
| Security Robot | ✅ security-robot.ts |
| Data Robot | ✅ data-robot.ts |

### 5.2 API Endpoint’leri

| Endpoint | Durum |
|----------|-------|
| `/api/chat/flow` | ✅ İmla → CEO → CELF → Onay |
| `/api/approvals` | ✅ Onay kuyruğu |
| `/api/stats` | ✅ İstatistikler |
| `/api/directors/status` | ✅ Direktör durumları |
| `/api/celf` | ✅ CELF çağrısı |
| `/api/ceo/*` | ✅ franchise-data, routines, rules, templates |
| `/api/patron/command` | ✅ |
| `/api/startup` | ✅ Başlangıç görevleri |
| `/api/franchises` | ✅ franchises/organizations/tenants |

### 5.3 AI Routing

| AI | Kullanım |
|----|----------|
| Gemini | İlk adım imla (önce), bazı direktörlükler |
| GPT | İmla yedek, CFO vb. |
| Claude | Özel iş, CLO, CHRO vb. |
| `celf-execute.ts` | runCelfDirector, callClaude |

---

## 6. EKSİK PARÇALAR LİSTESİ (Sistem Anayasasına Göre)

### 6.1 Franchise Satış Süreci
- [ ] Franchise başvuru formunun DB’ye (demo_requests/leads) yazılması
- [ ] Paket seçimi (Temel + Seçmeli modüller)
- [ ] Fiyatlandırma (Giriş 1.500 $ + aylık kademe çarpanı)
- [ ] Ödeme entegrasyonu (Stripe/iyzico vb.)
- [ ] Site şablonu seçimi
- [ ] Otomatik tenant + tesis paneli kurulumu (provisioning)

### 6.2 Franchise Paneli
- [ ] Tenant bazlı veri çekme (Supabase RLS)
- [ ] Öğrenci/sporcu CRUD API
- [ ] Antrenör CRUD API
- [ ] Ders programı ve yoklama API
- [ ] COO mağazası satın alma ve aktivasyon
- [ ] Karşılama robotu, 7/24 Acil Destek robotu (vitrin robotları)

### 6.3 Veli Paneli
- [ ] Veli–çocuk ilişkisi (DB)
- [ ] Gerçek çocuk verisi
- [ ] Ödeme (aidat, grafik satışı %80/%20)
- [ ] Antrenör ile mesajlaşma

### 6.4 Tesis Paneli
- [ ] Tesis müdürü / işletme müdürü için gerçek veri
- [ ] Token bakiye ve kullanım

### 6.5 Patron Paneli
- [ ] Şablonlar sayfasının doldurulması
- [ ] Raporlar sayfasının doldurulması
- [ ] Rol & yetki tanımları (Master Doküman 2.10)
- [ ] Asistan / Robot durumu ekranı (hangi robotlar aktif)

### 6.6 Güvenlik ve Uyum
- [ ] Siber Güvenlik Robotu alarm seviyeleri (yeşil/sarı/kırmızı/siyah) ve tepki süreleri
- [ ] Çocuk ham veri koruması (Master Doküman 4.2)
- [ ] KVKK/kamera kuralları

---

## 7. TAMAMLANMA YÜZDESİ

| Bileşen | Tahmini % | Açıklama |
|---------|-----------|----------|
| **Patron paneli** | 75% | Dashboard, chat, onay, franchise listesi, kasa. Şablon/rapor/ayar içerikleri eksik |
| **Franchise vitrini** | 40% | Tanıtım ve demo sayfaları var; başvuru DB’ye gitmiyor; paket/ödeme/tesis kurulumu yok |
| **Tesis paneli** | 25% | UI iskelet var; veri ve API yok |
| **Veli paneli** | 25% | UI mock; veri ve ödeme yok |
| **Antrenör paneli** | 20% | UI mock; veri yok |
| **Robot sistemi** | 70% | CEO, CELF, direktörlükler, chat flow çalışıyor; vitrin robotları ve COO mağazası eksik |
| **Veritabanı** | 60% | Tablolar ve ilişkiler tanımlı; tenant izolasyonu ve bazı RLS’ler tamamlanmalı |

### Genel Tamamlanma (ağırlıklı ortalama): ~45%

---

## 8. ÖNERİLEN ÖNCELİK SIRASI

1. **Franchise başvuru → DB:** Formu `demo_requests` veya `leads` tablosuna bağla
2. **Franchise paneli veri:** Tenant bazlı öğrenci/antrenör API’leri
3. **Veli–çocuk ilişkisi:** Veli panelinde gerçek veri
4. **Ödeme akışı:** En azından temel aidat/grafik satışı
5. **Tesis kurulumu:** Yeni franchise için tenant + şablon provisioning
6. **Vitrin robotları:** Karşılama, Acil Destek (Master Doküman 2.7–2.9)

---

**© 2026 YİSA-S — Proje Durum Raporu**
