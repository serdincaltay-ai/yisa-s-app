# YİSA-S Mimari Yeniden Yapılanma

**Tarih:** 2 Şubat 2026  
**Amaç:** Dosya birleştirme sırasında bozulan mimariyi hedef yapıya göre düzeltmek.

---

## 1. HEDEF MİMARİ

```
┌─────────────────────────────────────────────────────────────────┐
│                    www.yisa-s.com                                │
│              (Tanıtım Sitesi — Fuarlar için)                     │
│         Demo talep formu, fiyatlar, özellikler, paket seçimi     │
└─────────────────────┬───────────────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
┌───────────────┐ ┌───────────────┐ ┌───────────────┐
│  PATRON       │ │ FRANCHISE     │ │   VELİ        │
│  PANELİ       │ │  PANELİ       │ │  PANELİ       │
│               │ │               │ │               │
│ app.yisa-s.com│ │ franchise     │ │ veli.yisa-s   │
│               │ │ .yisa-s.com   │ │ .com          │
│ - Robot       │ │               │ │               │
│   yönetim     │ │ - Kendi sitesi│ │ - Çocuk takibi│
│ - Tüm         │ │ - Fiyat       │ │ - Ödeme       │
│   franchise   │ │ - Üye         │ │ - Mesaj       │
│ - Onay kuyruğu│ │ - Ders        │ │ - Proje/Forum │
│ - Kasa defteri│ │ - Şablon      │ │               │
│ - Şablonlar   │ │   seçimi      │ │               │
└───────────────┘ └───────────────┘ └───────────────┘
```

---

## 2. AKIŞ ÖZETİ (Anayasa)

1. **Tanıtım sitesi (www):** Firma sahibi paket seçer (web, logo, sosyal medya, robot kotası vb.) → canlı fiyat → "Bunu istiyorum" → nihai fiyat.
2. **Patron onayı:** Franchise anlaşması → Patron onaylar → sistemde franchise + şablon açılır.
3. **Franchise paneli:** Firma sahibi kendi şifresiyle girer → aldığı özelliklere göre panel (sporcular, antrenörler, ders, gelir). CELF motor bu yapıyı görür.
4. **Kullanıcı rolleri:** Firma sahibi kendi tesisinde roller tanımlar (antrenör, kayıt personeli, veli vb.). Her kullanıcı kendi şifresiyle kendi paneline gider.
5. **Veli paneli:** Veliler çocuk takibi, ödeme, mesaj için kendi alanına girer.

---

## 3. MEVCUT DURUM ANALİZİ

### 3.1 Yedekler

| Konum | İçerik |
|-------|--------|
| `backup/` | CONFIG (celf-directors, role-permissions, robot-hierarchy), SQL (temel tablolar), RESTORE (kurulum), YISA-S-OMURGA-v1.0.md |
| `archive/` | Eski dokümanlar (DOMAIN.md, GELISTIRME_RAPORU, COMMIT_DEPLOY vb.) |
| `futuristic-dashboard-extracted/` | Dashboard UI bileşenleri (60+ tsx) |

**Not:** Ayrı çalışan "eski panel" kodunun tam yedeği yok. Tüm paneller şu an **tek repo** içinde route bazlı birleşmiş.

### 3.2 Mevcut Route Yapısı (tek uygulama)

| Route | Amaç | Sorun |
|-------|------|-------|
| `/` | Ana sayfa | Tanıtım + 3 giriş butonu karışık |
| `/demo` | Franchise tanıtım | İçerik iyi, domain ayrımı yok |
| `/auth/login` | Tek giriş | Tüm roller buradan; rol dağılımı karmaşık |
| `/dashboard` | Patron paneli | app.yisa-s.com olmalı |
| `/patron` | Patron landing | Gereksiz tekrarlayan sayfa |
| `/patron/login` | Eski patron giriş | Şimdi /auth/login kullanılıyor |
| `/franchise` | Franchise paneli | franchise.yisa-s.com olmalı; şablon seçimi eksik |
| `/veli` | Veli paneli | veli.yisa-s.com olmalı |
| `/antrenor`, `/tesis` | Diğer roller | Franchise altında olmalı |

### 3.3 Eksik / Karışık Parçalar

- **Şablon seçimi:** Firma sahibi paket/özellik seçemiyor; seçtiği şablona göre "temel" oluşmuyor.
- **Franchise → kullanıcı rolleri:** Firma sahibi kendi tesisinde rol atayamıyor; kullanıcılar kendi paneline yönlenmiyor.
- **CELF motor:** Franchise'ın çalışma yapısını görüyor olmalı; şu an tek tenant gibi.
- **Domain ayrımı:** Hepsi aynı domain'de; subdomain (app, franchise, veli) yok.

---

## 4. PARÇALARIN HEDEF KONUMLARI

### 4.1 www.yisa-s.com (Tanıtım)

**Kaynak:** `app/page.tsx` (ana sayfa) + `app/demo/page.tsx` birleşimi

**İçerik:**
- Slogan, özellikler
- Demo talep formu
- Paket seçici (web, logo, sosyal medya, robot kotası…) → canlı fiyat
- Fiyat kademeleri (öğrenci sayısı, 2. şube, robot limiti)
- "Bunu istiyorum" → nihai fiyat + başvuru

**Mevcut dosyalar:** `app/page.tsx`, `app/demo/page.tsx`

---

### 4.2 app.yisa-s.com (Patron Paneli)

**Kaynak:** `app/dashboard/*`, `app/patron/*`, Patron'a özel API'ler

**İçerik:**
- Franchise gelir/gider, kasa defteri
- Onay kuyruğu, Robot Asistan, CELF
- Franchise listesi (tıklanınca o franchise'a giriş)
- Şablon havuzu
- Kullanıcı & rol tanımları (genel sistem)
- Yeni franchise başvuruları

**Mevcut dosyalar:**
- `app/dashboard/` (layout, page, facilities, franchises, kasa-defteri, onay-kuyrugu, reports, robots, sablonlar, settings, users)
- `app/patron/` (login artık /auth/login'e yönlendirilebilir)
- `app/components/DashboardSidebar.tsx`, `PatronApproval.tsx`
- API: `/api/approvals`, `/api/chat/flow`, `/api/ceo`, `/api/celf`, `/api/patron/command`, `/api/stats`, `/api/startup`, `/api/cost-reports`, `/api/sales-prices`, vb.

---

### 4.3 franchise.yisa-s.com (Franchise Paneli)

**Kaynak:** `app/franchise/page.tsx` + şablon seçimi + CELF franchise görünümü

**İçerik:**
- Firma sahibi girişi
- Aldığı pakete göre: sporcular, antrenörler, ders, gelir, üye yönetimi
- Şablon seçimi (ilk kurulumda): web, logo, sosyal medya, robot kotası → bu seçim "temel" oluşturur
- Kendi kullanıcı rolleri (antrenör, kayıt, veli) atama
- CELF motor bu tesisin yapısını görür

**Mevcut dosyalar:**
- `app/franchise/page.tsx` (FranchiseDashboard)
- API: `/api/franchises`, `/api/templates`, `/api/sales-prices` (okuma)
- Eksik: şablon seçici akışı, tenant/franchise bazlı rol atama

---

### 4.4 veli.yisa-s.com (Veli Paneli)

**Kaynak:** `app/veli/page.tsx`

**İçerik:**
- Veli girişi
- Çocuk takibi, ödeme, mesaj
- Proje / forum alanı

**Mevcut dosyalar:** `app/veli/page.tsx`

---

### 4.5 Ortak / Paylaşılan

**Auth:** `app/auth/`, `lib/auth/`, `lib/supabase/`  
**API (paylaşılan):** `/api/health`, `/api/ai`, `/api/agents`, vb.  
**Veritabanı:** Supabase (tenants, franchises, role_permissions, kullanicilar, roller)

---

## 5. UYGULAMA SEÇENEKLERİ

### Seçenek A: Tek Repo, Subdomain ile Yönlendirme

- **Tek Next.js projesi**, Vercel'de subdomain rewrites
- `www.yisa-s.com` → `/` (tanıtım)
- `app.yisa-s.com` → `/dashboard` veya `/patron` (layout farklı)
- `franchise.yisa-s.com` → `/franchise` (tenant_id host/header'dan)
- `veli.yisa-s.com` → `/veli`

**Artı:** Tek deploy, ortak API  
**Eksi:** Middleware'de host kontrolü; franchise için tenant çözümü gerekir

---

### Seçenek B: Tek Repo, Path ile Ayrım

- `/` = tanıtım
- `/app/*` veya `/patron/*` = Patron (layout: DashboardLayout)
- `/franchise/*` = Franchise (layout: FranchiseLayout)
- `/veli/*` = Veli (layout: VeliLayout)

**Artı:** Basit, subdomain gerekmez  
**Eksi:** Domain ayrımı yok (hepsi app.yisa-s.com'da)

---

### Seçenek C: Ayrı Repo/Projeler

- `yisa-s-site` → www.yisa-s.com
- `yisa-s-app` → app.yisa-s.com (sadece Patron)
- `yisa-s-franchise` → franchise.yisa-s.com
- `yisa-s-veli` → veli.yisa-s.com

**Artı:** Tam ayrım  
**Eksi:** 4 repo, ortak lib/API paylaşımı zor

---

## 6. UYGULANAN ADIMLAR (Seçenek A)

1. **Yedek alındı:** `backup/MEVCUT_2026-02-02/`
2. **Subdomain routing:** `lib/subdomain.ts`, `lib/supabase/middleware.ts` — app, franchise, veli, www
3. **Dynamic PWA manifest:** `app/api/manifest/route.ts` — her subdomain kendi manifest
4. **Layout metadata:** Host bazlı title/description
5. **Vercel kurulum:** `VERCEL_SUBDOMAIN_KURULUM.md`
3. **Layout ayrımı:**
   - `/` + `/demo` → TanıtımLayout (giriş yok)
   - `/dashboard` + `/patron` → PatronLayout (canAccessDashboard)
   - `/franchise` → FranchiseLayout (franchise tenant)
   - `/veli` → VeliLayout (veli rolü)
4. **Giriş noktaları:**
   - Tanıtımda: "Patron Girişi" → `/auth/login` (patron → /dashboard)
   - "Franchise Girişi" → `/auth/login` (franchise → /franchise)
   - "Veli Girişi" → `/auth/login` (veli → /veli)
5. **Şablon seçimi:** Franchise ilk girişte veya başvuru onayı sonrası paket seçer → tenant + özellikler kaydedilir
6. **CELF/Franchise:** `tenant_id` / `franchise_id` ile API filtreleme; CELF motor franchise yapısını okusun

---

## 7. DOSYA KONUMU ÖZETİ

| Hedef | Mevcut | Aksiyon |
|-------|--------|---------|
| Tanıtım | `app/page.tsx`, `app/demo/` | Birleştir / netleştir; demo form + paket seçici |
| Patron | `app/dashboard/`, `app/patron/` | Dashboard = ana Patron; patron/login kaldırılabilir |
| Franchise | `app/franchise/` | Şablon seçimi + tenant bazlı rol ekle |
| Veli | `app/veli/` | Proje/forum alanı belirginleştir |
| Auth | `app/auth/`, `lib/auth/` | Rol → path eşlemesi (resolve-role) koru |
| API | `app/api/` | Tenant/franchise filtreleme ekle |

---

**Belge sonu.** Onay sonrası adım adım uygulanacak.
