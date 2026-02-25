# YiSA-S PROTOTIP ve CALISMA PLANI

**Tarih:** 25 Subat 2026
**Durum:** v0-futuristic-dashboard-ng analizi + mevcut PR #31 dokumanlariyla entegre
**Kaynak Repo:** `serdincaltay-ai/v0-futuristic-dashboard-ng` (app-yisa-s prototip tabani)
**Hedef:** Patron onayina sunulacak prototip/wireframe aciklamalari + calisma plani

---

## A. SAYFA PROTOTIPLERI ve WIREFRAME ACIKLAMALARI

> **Tasarim Dili:** Dark theme (`bg-[#0a0a1a]` / `bg-[#0a0e17]` / `bg-[#060a13]`), turuncu/kirmizi accent (`#e94560`, `#f59e0b`), neon mavi (`#00d4ff`, `#818cf8`), font: monospace/Inter, shadcn/ui + Tailwind CSS, mobil PWA oncelikli responsive.

> **Renk Paleti (Degistirme):**
> - Arka plan: `#0a0a1a`, `#0a0e17`, `#060a13`
> - Accent: `#00d4ff` (neon mavi), `#e94560` (kirmizi), `#f59e0b` (turuncu/altin)
> - Border: `#2a3650`, `#0f3460/40`
> - Metin: `#e2e8f0` (ana), `#8892a8` (ikincil), `#cbd5e1` (acik)
> - Robot renkleri: Claude `#818cf8`, GPT `#10b981`, Gemini `#3b82f6`, Together `#06b6d4`, Cursor `#f59e0b`, Fal AI `#ec4899`

---

### A1. GIRIS SAYFASI (`/` — Login + Intro)

**Dosya:** `app/page.tsx` (334 satir)

**Wireframe Aciklamasi:**

```
+----------------------------------------------------------+
|                    [VIDEO INTRO — 4sn]                    |
|  Tam ekran video (intro.mp4), alt kisimda "ATLA" butonu  |
|  Bittikten sonra otomatik gecis →                        |
+----------------------------------------------------------+
|                                                          |
|           [PARTICLE CANVAS ARKA PLAN]                    |
|     60 parcacik + birbirine baglanan cizgiler            |
|     rgba(129,140,248,0.06) radial glow                   |
|                                                          |
|              [LOGO — yisa-s-logo.jpg]                    |
|             Yuvarlak, 20x20/24x24, border mor            |
|                                                          |
|         [ANIMATED RING — 3 katman donen halka]           |
|           Dis: ping animasyon (3s)                       |
|           Orta: spin mor (4s)                            |
|           Ic: spin turuncu ters yon (3s)                 |
|           Merkez: "YiSA" + "-S-" yazisi                  |
|                                                          |
|          YiSA-S PATRON PANELI                            |
|       Robot Orkestrasyon Sistemi                         |
|                                                          |
|  --- SLOGAN ANIMASYONU (intro fazinda) ---               |
|  Satir 1: "Teknolojiyi Spora Baslattik." ← soldan       |
|  Satir 2: "tuzlacimnastik" ↓ yukaridan                  |
|  Satir 3: "Yine Bir Ilk, Yine Yenilik." → sagdan        |
|  Satir 4: "YiSA-S Patron Paneli" ↑ asagidan             |
|  Her satir 1.4sn arayla belirir                          |
|                                                          |
|  --- LOGIN FORMU (login fazinda) ---                     |
|  +----------------------------------------------+        |
|  | [yesil nokta] GUVENLI GIRIS                  |        |
|  |                                               |        |
|  | Patron Sifresi                                |        |
|  | [_________________ input ___________________] |        |
|  |                                               |        |
|  | [======== GIRIS YAP ========] (#818cf8)       |        |
|  |                                               |        |
|  | [yesil] Supabase  [yesil] AI Gateway  [yesil] Blob   |
|  +----------------------------------------------+        |
|                                                          |
|  Franchise vitrin sayfasi (link → /vitrin)                |
|  v2.2 | Sifreli Erisim | yisa-s.com                     |
+----------------------------------------------------------+
```

**Renkler:** Arka plan `#060a13`, form kart `#0a0e17/80`, border `#2a3650/60`, buton `#818cf8`
**Mobil PWA:** Tam ekran, input `autoFocus`, min-height 44px touch target
**Bilesenler:** Canvas particle, video intro, animated rings, slide-in text animations

---

### A2. ANA DASHBOARD (`/` — Login sonrasi, `dashboard.tsx`)

**Dosya:** `dashboard.tsx` (1521 satir — ana canli panel)

**Wireframe Aciklamasi:**

```
+================================================================+
| HEADER (sticky top)                                             |
| [Logo] YiSA-S | [Saat] | [API Durum Panel Butonu]             |
+================================================================+
| ROBOT BAR (sticky, header altinda)                              |
| #0 PATRON(sari) | #1 GUVENLIK(kirmizi) | #2 VERI(cyan)        |
| #3 YiSA-S CELF(mor) | #4 YiSA-S(mavi)                        |
| Her robot: numara, etiket, rol, durum noktasi (aktif/pasif)    |
| Tiklaninca: detay kutusu (ROBOT_DETAILS aciklama)              |
| CELF seciliyse: sim_updates'ten "CELF IS KUYRUGU" + ONAYLA    |
+================================================================+
| WIDGET STRIP (sticky, robot bar altinda)                        |
| [Token/Maliyet] [Robot Durum] [Onay Sayisi] [Gorevler] [API]  |
| Surukle-birak, toggle acik/kapali (WidgetlerConfigPanel)       |
+================================================================+
|                                                                 |
| +--- SOL PANEL (280px) ---+  +--- SAG PANEL (chat) ----------+|
| |                          |  |                                ||
| | SEKMELER:                |  | PROJE BOLUMLERI               ||
| | [Bolumler] [Dosyalar]   |  | (secilen bolum icerigi)       ||
| | [Tenantlar] [Gorevler]  |  |                                ||
| | [Medya]                  |  | KARAR PANELI                  ||
| |                          |  | (tartisma/oylama/onay)        ||
| | ANAYASA (acilir/kapanir) |  |                                ||
| | constitution kurallari   |  | CHAT ALANI                    ||
| |                          |  | Beyin Takimi mesajlari         ||
| | LINKLER (dikey menu):    |  | [Claude] [GPT] [Gemini]       ||
| | > Onay Kuyrugu           |  | [Together] [Cursor] [Fal AI]  ||
| | > Tenantlar              |  | [MayChat]                     ||
| | > Beyin Takimi           |  | AI secim butonlari            ||
| | > Direktorlukler         |  |                                ||
| | > Gorevler               |  | +----------------------------+||
| | > Sistem Durumu          |  | | Mesaj yaz...               |||
| |                          |  | | [Gonder] [ATA] [HERKESE]   |||
| | TENANTLAR:               |  | | [CEO'ya Gonder]            |||
| | BJK Tuzla, Demo Salon   |  | | Dosya surukle-birak        |||
| | + maliyet kartlari      |  | +----------------------------+||
| +--------------------------+  +--------------------------------+|
|                                                                 |
| SIM UPDATES LISTESI (alt kisim)                                |
| Simulasyona gonderilen guncellemeler                           |
+================================================================+
```

**Renkler:** Header/robot bar `#0a0a1a`, sol panel `#0a0e17/80`, chat `#0a0a1a/90`
**Mobil PWA:** Sol panel gizlenir (hamburger menu), chat tam genislik, 44px touch targets
**Bilesenler:** DashboardWidgetStrip, WidgetlerConfigPanel, TokenMaliyetWidget, Robot bar, Chat panel, Decision panel, File upload, API status panel
**Ozel:** Akilli scroll — kullanici alttayken otomatik kayma, yukaridayken "Yeni mesajlar (N)" butonu

---

### A3. BEYIN TAKIMI (`/patron/beyin-takimi`)

**Dosya:** `app/patron/beyin-takimi/page.tsx` + `ModeSelector`, `RobotList`, `ChatPanel`, `MessageBubble`

**Wireframe Aciklamasi:**

```
+================================================================+
| HEADER: ← Panel | YiSA-S Patron                                |
+================================================================+
|                                                                 |
| Beyin Takimi                    [Tekli|Coklu|Zincir|Hepsi]    |
|                                                                 |
| +--- ROBOTLAR (sol 1/3) ---+  +--- CHAT PANEL (sag 2/3) ----+|
| |                           |  |                               ||
| | [C] CELF                  |  | Robot mesajlari               ||
| |     Claude Sonnet         |  | (balon formatinda)            ||
| |     #e94560 kirmizi       |  |                               ||
| |     Son mesaj: "..."      |  | Her robot kendi rengiyle      ||
| |                           |  | konusur                       ||
| | [V] Veri Robotu           |  |                               ||
| |     Gemini                |  | CELF: kirmizi #e94560         ||
| |     #00d4ff cyan          |  | Veri: cyan #00d4ff            ||
| |                           |  | Guvenlik: turuncu #ffa500     ||
| | [G] Guvenlik Robotu       |  | YiSA-S: mor #7b68ee          ||
| |     GPT-4o                |  |                               ||
| |     #ffa500 turuncu       |  | Modlar:                       ||
| |                           |  | Tekli: 1 robot sec, sohbet    ||
| | [Y] YiSA-S Robotu         |  | Coklu: birden fazla sec       ||
| |     GPT-4o-mini           |  | Zincir: sirali gorev ver      ||
| |     #7b68ee mor           |  | Hepsi: tum robotlara sor      ||
| |                           |  |                               ||
| | Status: /api/robot-status |  | +---------------------------+||
| |                           |  | | Mesaj yaz...              |||
| +---------------------------+  | +---------------------------+||
|                                +-------------------------------+|
+================================================================+
```

**Renkler:** Arka plan `#0a0a1a`, robot kartlari her birinin kendi neon rengi, border `#0f3460/40`
**Mobil PWA:** Ustuste yigilir — robotlar ust, chat alt. Robot kartlari yatay kaydirmali
**Bilesenler:** ModeSelector (4 mod), RobotList (4 robot + durum), ChatPanel (mesaj balonu), MessageBubble

---

### A4. C2 KOMUT MERKEZI (`/patron/komut-merkezi`)

**Dosya:** `app/patron/komut-merkezi/page.tsx` (401 satir)

**Wireframe Aciklamasi:**

```
+================================================================+
| HEADER: ← Panel | YiSA-S Patron                                |
+================================================================+
|                                                                 |
| [Terminal icon] C2 Komut Merkezi                                |
|                                                                 |
| SEKMELER (4 tab):                                              |
| [Komut Merkezi] [Gorev Panosu] [Patron Havuzu] [Merkez Kasa]  |
|                                                                 |
| === KOMUT MERKEZI SEKMESI ===                                  |
| +----------------------------------------------------------+   |
| | Komut Ver                                                 |   |
| | +------------------------------------------------------+  |   |
| | | textarea — "Orn: Franchise panelinde ogrenci CRUD     |  |   |
| | |            modulu kur"                                |  |   |
| | +------------------------------------------------------+  |   |
| | [Gonder (C2)] [Brain Team ile Gonder] [Parcala]         |  |   |
| |                                                          |  |   |
| | Son Epic (C2): abc123...                                 |  |   |
| | Brain Team Epic: def456... — 3 direktorluk, 8 gorev     |  |   |
| |                                                          |  |   |
| | EPIC KARTLARI (2 kolon grid):                           |  |   |
| | [Epic 1 — 5 gorev] [Epic 2 — 3 gorev]                  |  |   |
| +----------------------------------------------------------+   |
|                                                                 |
| === GOREV PANOSU SEKMESI (12 kolon kanban) ===                 |
| CTO | CFO | CMO | CPO | CLO | CISO | CDO | CSPO | CSO | ...  |
| Her kolon: gorev kartlari                                       |
| Kart: baslik, target (renk kodlu), provider, durum             |
| Butonlar: "Kilit Al" (queued), "Tamamla" (locked)             |
| Renk kodlari: queued=#6b7280, locked=#f59e0b,                 |
|               review=#8b5cf6, approved=#10b981, rejected=#ef4444|
|                                                                 |
| === PATRON HAVUZU SEKMESI ===                                  |
| Onay Bekleyenler (status=review)                               |
| Her gorev: baslik, target, [Onayla] [Reddet] butonlari        |
| Onayla: yesil #10b981, Reddet: kirmizi #ef4444                |
|                                                                 |
| === MERKEZ KASA SEKMESI ===                                    |
| [Toplam Gelir — yesil] [Toplam Gider — kirmizi] [Bakiye — cyan]|
| Yeni kayit formu: Tutar, Tur (gelir/gider), Aciklama          |
| Son 20 hareket listesi (yesil gelir, kirmizi gider)           |
+================================================================+
```

**Renkler:** Arka plan `#0a0e17`, aktif tab `#00d4ff/10` border, pasif `#2a3650`
**Mobil PWA:** Tablar yatay kaydirmali, kanban yatay scroll, kartlar dikey yigilir
**Bilesenler:** Tab system, textarea, epic kartlari, kanban board (12 kolon), LedgerForm
**API'ler:** `/api/celf2/command`, `/api/celf2/epics`, `/api/celf2/plan`, `/api/celf2/board`, `/api/celf2/lock`, `/api/celf2/complete`, `/api/celf2/approve`, `/api/celf2/central-ledger`, `/api/brain-team/parse-epic`, `/api/brain-team/distribute-tasks`

---

### A5. CELF ORGANIZASYON PANELI (`/patron/celf`)

**Dosya:** `app/patron/celf/page.tsx` (117 satir)

**Wireframe Aciklamasi:**

```
+================================================================+
| HEADER: ← Panel | YiSA-S Patron                                |
+================================================================+
|                                                                 |
| CELF organizasyon paneli                                       |
| Direktorluk kuyrugu ve gorev durumu.                           |
|                                                                 |
| +--- EPIKLER (sol 1/2) ---+ +--- SON GOREVLER (sag 1/2) ----+|
| |                          | |                                 ||
| | Epik listesi (son 10):   | | Gorev listesi (son 10):        ||
| | • "Franchise panel..."   | | [CMO] — Pazarlama plan...      ||
| |   [isleniyor] 3/5        | |   [running] #f59e0b            ||
| | • "Ogrenci CRUD..."      | | [CTO] — API endpoint...        ||
| |   [tamamlandi] 5/5       | |   [completed] #10b981          ||
| |                          | |                                 ||
| +--------------------------+ +---------------------------------+|
|                                                                 |
| [Komut merkezine git →]                                        |
+================================================================+
```

**Renkler:** Kart arka plan `#0a0e17/90`, border `#2a3650`
**Mobil PWA:** 2 kolon → tek kolon dikey yigilma
**API'ler:** `/api/celf2/epics`, `/api/celf2/board`

---

### A6. 12 DIREKTORLUK SAYFASI (`/patron/direktorlukler`)

**Dosya:** `app/patron/direktorlukler/page.tsx` + `DirectorCard.tsx`

**Wireframe Aciklamasi:**

```
+================================================================+
| HEADER: ← Panel | YiSA-S Patron                                |
+================================================================+
|                                                                 |
| Direktorlukler                                                  |
| CELF motoru — 12 direktorluk. Her biri icin kurallar ve gorev. |
|                                                                 |
| GRID (4 kolon desktop, 2 tablet, 1 mobil):                    |
|                                                                 |
| +----------+ +----------+ +----------+ +----------+            |
| | [Scale]  | | [Wallet] | | [Gear]   | | [Palette]|            |
| | HUKUK    | | MUHASEBE | | TEKNIK   | | TASARIM  |            |
| | #e94560  | | #00d4ff  | | #00d4ff  | | #e94560  |            |
| | Hukuk,   | | Butce,   | | Kod,     | | Gorsel,  |            |
| | KVKK,    | | maliyet, | | mimari,  | | marka,   |            |
| | sozlesme | | token    | | API      | | UI/UX    |            |
| +----------+ +----------+ +----------+ +----------+            |
| +----------+ +----------+ +----------+ +----------+            |
| | [Users]  | | [Flask]  | | [Shield] | | [Chart]  |            |
| | IK       | | AR-GE    | | GUVENLIK | | VERI     |            |
| | #e94560  | | #00d4ff  | | #ffa500  | | #00d4ff  |            |
| +----------+ +----------+ +----------+ +----------+            |
| +----------+ +----------+ +----------+ +----------+            |
| | [Activity]| [Handshake]| [Megaphone]| [Target] |            |
| | OPERASYON | MUSTERI    | PAZARLAMA  | STRATEJI  |            |
| | #e94560   | #00d4ff    | #00d4ff    | #e94560   |            |
| +----------+ +----------+ +----------+ +----------+            |
|                                                                 |
| Her kart tiklaninca → /patron/direktorlukler/[slug]            |
+================================================================+
```

**Direktorluk Detay Sayfasi (`/patron/direktorlukler/[slug]`):**

```
+================================================================+
| [← Geri] [Icon — neon renk] Hukuk Direktorlugu                |
|           Hukuk, KVKK, sozlesme, mevzuat uyumu                |
+================================================================+
|                                                                 |
| KOMUT PANEL (KomutPanel componenti):                           |
| +----------------------------------------------------------+   |
| | Komut gir → direktorluge ozel gorev ver                   |   |
| | [textarea] [Gonder butonu]                                |   |
| +----------------------------------------------------------+   |
|                                                                 |
| GOREV GECMISI:                                                 |
| +----------------------------------------------------------+   |
| | Komut metni                                               |   |
| | [Beklemede — turuncu] 15.02.2026 14:30                    |   |
| | Cikti: "KVKK politikasi guncellendi..."                   |   |
| +----------------------------------------------------------+   |
| | Komut metni 2                                             |   |
| | [Islendi — yesil] 14.02.2026 10:15                        |   |
| +----------------------------------------------------------+   |
+================================================================+
```

**Renkler:** Her direktorluk kendi neonColor'u (`#e94560` veya `#00d4ff` veya `#ffa500`), ikon glow efekti `boxShadow: 0 0 16px ${color}25`
**Mobil PWA:** Kartlar 1 kolon, detay sayfada sticky header
**API:** `/api/motor?directorate_slug=[slug]`

---

### A7. ONAY KUYRUGU — 10'a CIKART (`/patron/onay-kuyrugu`)

**Dosya:** `app/patron/onay-kuyrugu/page.tsx` + `PatronHavuzu.tsx`

**Wireframe Aciklamasi:**

```
+================================================================+
| HEADER: ← Panel | YiSA-S Patron                                |
+================================================================+
|                                                                 |
| 10'a Cikart — Patron Havuzu                                   |
| Patron komutlarini ve demo taleplerini inceleyin.              |
|                                                                 |
| SEKMELER: [Patron Komutlari] [Demo Talepleri]                 |
|                                                                 |
| === DEMO TALEPLERI ===                                         |
| Desktop: Tablo gorunumu                                        |
| +------+--------+----------+--------+--------+---------+      |
| | Isim | Tesis  | Telefon  | Tarih  | Durum  | Islem   |      |
| +------+--------+----------+--------+--------+---------+      |
| | ABC  | Salon  | 05xx...  | 2 saat | Beklmd | [O] [R] |      |
| +------+--------+----------+--------+--------+---------+      |
|                                                                 |
| Mobil: Kart gorunumu                                           |
| +----------------------------------------------------------+   |
| | Firma: ABC Spor                                           |   |
| | Yetkili: Ahmet B. | Tel: 05xx...                         |   |
| | Tesis: Salon | Sehir: Istanbul                            |   |
| | [beklemede — sari badge]                                  |   |
| | [Onayla — yesil] [Reddet — kirmizi]                      |   |
| +----------------------------------------------------------+   |
|                                                                 |
| MODAL (Onay):                                                  |
| "Bu firmayi onayliyor musunuz? Tenant olusturma baslayacak."  |
| [Onayla] [Iptal]                                               |
|                                                                 |
| MODAL (Red):                                                   |
| Red sebebi: [textarea]                                         |
| [Reddet] [Iptal]                                               |
+================================================================+
```

**Renkler:** Beklemede badge `#f59e0b`, onaylandi `#10b981`, reddedildi `#ef4444`
**Mobil PWA:** Responsive tablo/kart gecisi, modal tam ekran mobilde

---

### A8. PATRON DASHBOARD (`/patron/dashboard`)

**Dosya:** `app/patron/dashboard/page.tsx` + `DemoRequestsSection.tsx`

**Wireframe Aciklamasi:**

```
+================================================================+
| HEADER: ← Panel | YiSA-S Patron                                |
+================================================================+
|                                                                 |
| Dashboard                                                       |
| Yeni demo talepleri ve ozet bilgiler.                          |
|                                                                 |
| 4 WIDGET KARTI (grid 4 kolon):                                |
| +------------+ +------------+ +------------+ +------------+    |
| | Basvuru    | | Onay       | | Toplam     | | Demo       |    |
| | (bekleyen) | | bekleyen   | | gider      | | talepleri  |    |
| | 5          | | odeme: 3   | | 45.000 TL  | | 8          |    |
| | #e2e8f0    | | #f59e0b    | | #e2e8f0    | | #10b981    |    |
| +------------+ +------------+ +------------+ +------------+    |
|                                                                 |
| DEMO TALEPLERI LISTESI (DemoRequestsSection):                  |
| Bekleyen talepler tablosu                                      |
+================================================================+
```

**Renkler:** Widget kart `#0a0e17/90`, border `#2a3650`
**Mobil PWA:** 4 kolon → 2 kolon → 1 kolon responsive grid

---

### A9. TENANT IZLEME (`/patron/tenants`)

**Dosya:** `app/patron/tenants/page.tsx` + `TenantsList.tsx`

**Wireframe Aciklamasi:**

```
+================================================================+
| HEADER: ← Panel | YiSA-S Patron                                |
+================================================================+
|                                                                 |
| Tenant Izleme                                                   |
|                                                                 |
| OZET KARTLARI:                                                 |
| [Toplam Tenant: 5] [Aktif: 3] [Toplam Sporcu: 120]            |
| [Toplam Gelir: 450.000 TL]                                    |
|                                                                 |
| TENANT LISTESI:                                                |
| +------+--------+--------+--------+---------+--------+        |
| | Ad   | Slug   | Durum  | Token  | Sporcu  | Gelir  |        |
| +------+--------+--------+--------+---------+--------+        |
| | BJK  | bjk-t  | Aktif  | 500    | 45      | 180K   |        |
| | Demo | demo   | Pasif  | 100    | 0       | 0      |        |
| +------+--------+--------+--------+---------+--------+        |
|                                                                 |
| Her satir tiklaninca → /patron/tenants/[id] (detay)           |
+================================================================+
```

**Renkler:** Aktif durum `#10b981`, pasif `#8892a8`, gelir `#10b981`
**Mobil PWA:** Tablo → kart gorunumune gecis
**API:** Supabase direct — tenants, athletes, user_tenants, cash_register tablolari

---

### A10. GOREV YONETIMI — KANBAN (`/patron/tasks`)

**Dosya:** `app/patron/tasks/page.tsx` + `TasksKanban.tsx`

**Wireframe Aciklamasi:**

```
+================================================================+
| HEADER: ← Panel | YiSA-S Patron                                |
+================================================================+
|                                                                 |
| GOREV YONETIMI (TasksKanban)                                  |
|                                                                 |
| KANBAN KOLONLARI:                                              |
| [BACKLOG] [TODO] [IN_PROGRESS] [REVIEW] [DONE]                |
|                                                                 |
| Her gorev karti:                                               |
| +------------------------------------------+                   |
| | Gorev basligi (input'tan parse)           |                   |
| | task_type: FRANCHISE_KURULUM              |                   |
| | target_robot: CELF                        |                   |
| | scope: global | priority: 1               |                   |
| | Onay: [tarih] tarafindan: [kullanici]     |                   |
| +------------------------------------------+                   |
|                                                                 |
| Tenant filtresi: [Tum tenantlar ▼]                             |
+================================================================+
```

**Renkler:** Kanban kolon baslik `#00d4ff`, kart arka plan status bazli
**API:** Supabase direct — ceo_tasks, tenants tablolari

---

### A11. SISTEM DURUMU (`/patron/status`)

**Dosya:** `app/patron/status/page.tsx` + `StatusClient.tsx`

**Wireframe Aciklamasi:**

```
+================================================================+
| HEADER: ← Panel | YiSA-S Patron                                |
+================================================================+
|                                                                 |
| Sistem Durumu — Domain ve Supabase saglik ekrani               |
|                                                                 |
| SAYAC KARTLARI (grid):                                         |
| [Tenants: 5] [Athletes: 120] [Attendance: 2300]               |
| [Payments: 450] [CEO Tasks: 85] [CELF Logs: 340]              |
|                                                                 |
| SON CEO GOREVLERI (tablo):                                     |
| id | baslik | durum | tarih                                    |
|                                                                 |
| SON CELF LOGLARI (tablo):                                      |
| id | directorate_code | stage | tarih                          |
|                                                                 |
| DOMAIN DURUM KONTROLLERI:                                      |
| [yesil] app.yisa-s.com                                        |
| [yesil] yisa-s.com                                             |
| [yesil] *.yisa-s.com (wildcard)                                |
+================================================================+
```

**API:** Supabase direct — tenants, athletes, attendance, payments, ceo_tasks, celf_logs

---

### A12. VITRIN SAYFASI (`/vitrin`)

**Dosya:** `app/vitrin/page.tsx` (289 satir)

**Wireframe Aciklamasi:**

```
+================================================================+
| HERO — Kayan yazi animasyonu                                    |
| Radial gradient arka plan (mor glow)                           |
|                                                                 |
| "Tuzla Cimnastik Spor Kulubu" ← yukaridan (turuncu)          |
| "Teknolojiyi spora baslatan kulup." ← asagidan (cyan)         |
| "YiSA-S ile akilli yonetim." ← soldan (mor)                   |
|                                                                 |
| Franchise yetkilisi — Bu isi bu sektorde yapacagim             |
+================================================================+
| SLOGAN BOLUMU                                                   |
| "Robotlarla yonetiyoruz. Destek oluyoruz."                    |
| Alt aciklama metni                                              |
+================================================================+
| PANELLER — Carousel (donen)                                     |
| [Franchise Panel] [Antrenor Panel] [Tesis Muduru]              |
| [Franchise Sahibi] [Tesis Ana Sayfasi]                         |
| Her kart: baslik, slogan (renkli), detay, sol kenar renk      |
+================================================================+
| PAKET SECIMI — Canli fiyat                                     |
| [ ] Web sitesi  [ ] Logo  [ ] Sablon                           |
| [ ] Tesis yonetimi  [ ] Robot kotasi                           |
| Secime gore: Aylik: X TL — Yillik: Y TL                       |
| API: /api/vitrin/calculate-price                               |
+================================================================+
| HEMEN HESAPLAYALIM — ROI tablosu                               |
| Aidat (standart): 6.000 TL/ay                                 |
| Ogrenci sayisi: 100                                            |
| Aylik gelir: 600.000 TL                                        |
| Giderler: ~500.000 TL                                          |
| Aylik kar: ~100.000 TL (yesil)                                |
+================================================================+
| CTA: [Patron paneline git →]                                   |
+================================================================+
```

**Renkler:** Arka plan `#060a13`, carousel kenar renkleri panel bazli, CTA `#818cf8`
**Mobil PWA:** Full width carousel, responsive tablo
**API:** `/api/vitrin/calculate-price`

---

### A13. DASHBOARD ALT SAYFALARI

**Gorev Panosu (`/dashboard/gorev-panosu`):**
- 12 kolon kanban (CTO, CFO, CMO, CSPO, CPO, CDO, CHRO, CLO, CSO, CISO, CCO, CRDO)
- Epic filtresi (dropdown), ilerleme cizgisi
- Gorev kartlari: aciklama, ai_provider, status
- Modal: detay + [Uygula] [Reddet] butonlari
- API: `/api/celf/tasks/board`

**Kasa Defteri (`/dashboard/kasa-defteri`):**
- 3 ozet kart: Toplam gider, Onay bekleyen, Kayit sayisi
- Gider listesi tablosu (tarih, kategori, tutar)
- API: `/api/expenses`

**Komut Merkezi (`/dashboard/komut-merkezi`):**
- Patron komutu textarea + "Analiz Et" butonu
- Analiz sonrasi: Epic ID + gorev kartlari grid (3 kolon)
- [Tumunu Dagit] → sirayla execute
- [Onayla + Uygula (Tumu)] → tamamlananlari uygula
- Kart renkleri: queued gri, running mavi, completed yesil, failed kirmizi
- API: `/api/celf/tasks/command`, `/api/celf/tasks/execute/[id]`, `/api/celf/tasks/apply/[id]`

---

## B. v0-GOREVLER.md ENTEGRASYONU

> Kaynak: `v0-futuristic-dashboard-ng/v0-GOREVLER.md` (9 Subat 2026)

### B1. TAMAMLANAN BACKEND GOREVLERI (Cursor AI)

| # | Gorev | Dosya | Durum |
|---|-------|-------|-------|
| 1 | API tutarsizligi duzeltme | `app/api/sim-updates/route.ts` | TAMAMLANDI |
| 2 | TypeScript tipleri | `lib/types/index.ts` | TAMAMLANDI |
| 3 | Migration: tenants, demo_requests, user_tenants | `scripts/003_core_tables_part1.sql` | TAMAMLANDI |
| 4 | Migration: students, staff, groups | `scripts/004_core_tables_part2.sql` | TAMAMLANDI |
| 5 | Migration: attendance, payments, schedules, audit_log | `scripts/005_core_tables_part3.sql` | TAMAMLANDI |
| 6 | Demo Talep API (POST, GET, PATCH) | `app/api/demo-requests/route.ts` | TAMAMLANDI |
| 7 | Demo Talep Guncelleme API | `app/api/demo-requests/[id]/route.ts` | TAMAMLANDI |
| 8 | Tenant Olusturma API | `app/api/tenants/route.ts` | TAMAMLANDI |
| 9 | Slug Utility | `lib/utils/slug.ts` | TAMAMLANDI |
| 10 | Email Service (Resend) | `lib/emails/resend.ts` | TAMAMLANDI |
| 11 | CORS Yapilandirmasi | `next.config.mjs` | TAMAMLANDI |
| 12 | Rate Limiting | `lib/middleware/rate-limit.ts` | TAMAMLANDI |
| 13 | Error Handling | `lib/errors.ts` | TAMAMLANDI |
| 14 | Logging | `lib/logger.ts` | TAMAMLANDI |
| 15 | Environment Variables | `.env.example`, `lib/env.ts` | TAMAMLANDI |
| 16 | Subdomain Routing Middleware | `middleware.ts` | TAMAMLANDI |

### B2. v0-GOREVLER.md'den UI GOREVLERI (Plana Dahil)

| Gorev | Aciklama | v0 Durumu | Mevcut Durumu (app-yisa-s) |
|-------|----------|-----------|---------------------------|
| GOREV 1: Onay Kuyrugu UI | Dashboard'a onay kuyrugu bolumu | Planlandi | TAMAMLANDI — `/patron/onay-kuyrugu` sayfasi var |
| GOREV 2: Onay → Tenant Zinciri | Onayla → PATCH + POST tenant | Planlandi | KISMI — Onay var ama tam zincir eksik |
| GOREV 3: Vitrin Sayfasi | yisa-s.com landing page | Planlandi | TAMAMLANDI — `/vitrin` sayfasi var (carousel + fiyat) |
| GOREV 4: Demo Formu Validasyonu | Client-side validasyon | Planlandi | EKSIK — zod + react-hook-form entegrasyonu gerekli |

### B3. v0-BAGLAM-VE-BUTUN.md Beklentileri

**Kilitlenmis Mimari (Degistirme):**
- 4 Robot: CELF (Claude), Veri (Gemini), Guvenlik (GPT-4o), YiSA-S (GPT-4o-mini)
- CIO/CEO/COO kullanilmaz — sadece 4 robot
- sim_updates: status "beklemede"/"islendi", payload kolonu YOK
- target_direktorluk (Turkce parametre adi)
- Tum tenant verilerinde tenant_id zorunlu
- Koyu tema, Turkce arayuz, shadcn/ui

**Final Hedef (Tam Senaryo):**
1. Firma sahibi yisa-s.com'a girer
2. Demo talep formunu doldurur
3. demo_requests tablosuna INSERT
4. Patron app.yisa-s.com'da talebi gorur
5. Patron "Onayla" tiklar
6. Tenant otomatik olusturulur (slug, tablo, gruplar)
7. CELF baslangic gorevleri tetiklenir
8. 12 direktorluk kontrol eder
9. Subdomain aktif edilir
10. Franchise paneli hazir

### B4. SPRINT-0-1-TAMAMLANDI.md Ozeti

- **Sprint 0:** 6 altyapi gorevi tamamlandi (env, middleware, error handling, logging, types, rate limiting)
- **Sprint 1 Backend:** 5 gorev tamamlandi (demo API, slug, email, CORS, tenant API)
- **Sprint 1 UI:** %0 → v0.dev'e verilecekti → **app-yisa-s'te buyuk kismii tamamlandi**
- 3 migration dosyasi (003, 004, 005) hazir

---

## C. PWA GEREKSINIMLERI

### C1. Mevcut PWA Durumu

**manifest.json (MEVCUT):**
```json
{
  "name": "YiSA-S Patron Paneli",
  "short_name": "YiSA-S",
  "description": "AI Destekli Spor Okulu Yonetim Sistemi",
  "start_url": "/patron/onay-kuyrugu",
  "display": "standalone",
  "background_color": "#0a0a1a",
  "theme_color": "#0f3460",
  "orientation": "any",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any maskable" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable" }
  ]
}
```

**Service Worker (MEVCUT — sw.js):**
- Cache: `patron-v1` (sadece offline fallback)
- Install: anasayfa cache'e eklenir
- Activate: eski cache'ler silinir
- Fetch: navigate isteklerinde network-first, offline'da cache fallback

### C2. EKSIK PWA Gereksinimleri

| Gereksinim | Mevcut | Yapilacak |
|------------|--------|-----------|
| manifest.json | MEVCUT | Icon dosyalari (192/512) olusturulmali |
| Service Worker | MEVCUT (basit) | Gelismis cache stratejisi (API + statik) |
| Offline calisma | KISMI (sadece anasayfa) | Tum patron sayfalari + API cache |
| Push Notification | YOK | Web Push API + Supabase trigger |
| Install prompt | YOK | beforeinstallprompt event yakalama |
| App-like navigation | MEVCUT (standalone) | Gesture destegi, swipe-back |
| Splash screen | YOK | Ikon + arka plan renk (otomatik) |
| Badge API | YOK | Bekleyen onay sayisi badge |

### C3. PWA Gelistirme Plani

**Oncelik 1 — Icon + Install:**
```
- icon-192.png ve icon-512.png olustur (YiSA-S logosu, koyu arka plan)
- next.config.mjs'e PWA headers ekle
- Install prompt banner componenti yaz
- Apple touch icon + meta tag'leri ekle
```

**Oncelik 2 — Gelismis Cache:**
```
- sw.js'yi genislet:
  - Statik asset'ler: Cache-first (CSS, JS, font, ikon)
  - API istekleri: Network-first + stale-while-revalidate
  - Sayfa navigasyonu: Network-first + offline fallback
  - Patron sayfalari offline goruntuleme (son cache)
```

**Oncelik 3 — Push Notification:**
```
- Web Push API entegrasyonu
- Supabase database trigger → Edge Function → push
- Bildirim turleri:
  - Yeni demo talebi
  - Gorev tamamlandi
  - Onay bekleyen is
  - Sistem uyarisi
- Kullanici tercih paneli (hangi bildirimleri al)
- VAPID key yonetimi (env variable)
```

**Oncelik 4 — Offline + Badge:**
```
- IndexedDB ile offline veri saklama
  - Son talepler, gorevler, tenant listesi cache
  - Cevrimdisi degisiklikleri kuyruklama
  - Online olunca senkronizasyon
- Badge API: navigator.setAppBadge(count)
  - Bekleyen onay sayisi
  - Okunmamis mesaj sayisi
```

---

## D. FRANCHISE SUBE PANEL KONTROL REFERANSI

> Kaynak: tenant-yisa-s repo — mevcut franchise panel tasarimlari

### D1. Mevcut Franchise Panel Sayfalari (tenant-yisa-s)

Asagidaki sayfalar tenant-yisa-s'te MEVCUT ve calisir durumdadir. Bunlar franchise panelinin temelini olusturur:

| Sayfa Grubu | Sayfalar | Durum |
|-------------|----------|-------|
| Ana Panel | dashboard, ayarlar | MEVCUT |
| Ogrenci/Sporcu | sporcular, sporcu-detay, sporcu-ekle | MEVCUT |
| Yoklama | yoklama, yoklama-gecmisi | MEVCUT |
| Aidat/Odeme | aidatlar, odemeler, odeme-detay | MEVCUT |
| Ders/Program | dersler, ders-programi, takvim | MEVCUT |
| Personel | personel, personel-detay | MEVCUT |
| Veli | veli-paneli, veli-mesajlar, veli-odeme | MEVCUT |
| Tesis | tesisler, tesis-detay | MEVCUT |
| Raporlama | raporlar, gelir-gider, istatistikler | MEVCUT |
| Iletisim | iletisim, duyurular, bildirimler | MEVCUT |
| Belgeler | belgeler, sablon-yonetimi | MEVCUT |
| Grup/Sinif | gruplar, grup-detay | MEVCUT |
| Cocuk Gelisim | gelisim-takibi, gelisim-raporu, olcum-kaydi | MEVCUT |

### D2. Franchise Panel Gelistirme Gereksinimleri

Mevcut tasarimlar kullanilabilir ama asagidaki gelistirmeler yapilmalidir:

**UI Gelistirmeleri:**
1. **Dark theme uyumu** — Tum sayfalar `bg-zinc-950` + turuncu accent ile uyumlu hale getirilmeli
2. **PWA mobil optimizasyon** — 44px touch target, swipe gesture, bottom navigation
3. **Realtime guncellemeler** — Supabase realtime subscription (yoklama, mesaj, bildirim)
4. **Offline destek** — Yoklama alma, sporcu listesi goruntuleme offline calisabilmeli
5. **Veli paneli ayrimi** — Veli girisinde sadece kendi cocugunun verilerini gorur (RLS)

**Fonksiyonel Gelistirmeler:**
1. **Aidat otomatik hatirlatma** — Cron job ile vadeyi gecen aidatlar icin SMS/push
2. **Yoklama QR** — QR kod ile hizli yoklama alma (antrenor mobil)
3. **Gelisim grafikleri** — Recharts ile sporcu gelisim zaman serisi
4. **Duyuru sistemi** — Toplu SMS/push gonderimi (tum veliler veya grup bazli)
5. **Belge sablonlari** — PDF olusturma (saglik raporu, kayit formu, aidat makbuzu)

---

## E. SAYFA BAZINDA GOREV KOMUTLARI

> Her sayfa icin: hangi arac yapacak, oncelik (P0-P4), tahmini sure

### E1. PATRON PANELI SAYFALARI

| # | Sayfa | Gorev | Arac | Oncelik | Sure |
|---|-------|-------|------|---------|------|
| 1 | Login + Intro (`/`) | Video intro optimizasyonu + PWA install prompt | **V0** | P1 | 2 saat |
| 2 | Ana Dashboard (`dashboard.tsx`) | Widget surukle-birak + robot detay guclendir | **Cursor** | P1 | 4 saat |
| 3 | Beyin Takimi (`/patron/beyin-takimi`) | Gercek AI API entegrasyonu (simule degil, canli) | **Devin** | P0 | 8 saat |
| 4 | C2 Komut Merkezi (`/patron/komut-merkezi`) | Kanban DnD + real-time gorev takip | **Cursor** | P0 | 6 saat |
| 5 | CELF Panel (`/patron/celf`) | Canli direktorluk kuyrugu + ilerleme gorseli | **Cursor** | P1 | 3 saat |
| 6 | 12 Direktorluk (`/patron/direktorlukler`) | Her direktorluk icin ozel prompt + cikti render | **Devin** | P1 | 6 saat |
| 7 | Onay Kuyrugu (`/patron/onay-kuyrugu`) | Tam onay→tenant zinciri + compensating transaction | **Devin** | P0 | 4 saat |
| 8 | Patron Dashboard (`/patron/dashboard`) | Gercek veri widget'lari + trend grafik | **V0** | P2 | 3 saat |
| 9 | Tenant Izleme (`/patron/tenants`) | Detay sayfa + rol yonetimi + token izleme | **Cursor** | P1 | 5 saat |
| 10 | Gorev Yonetimi (`/patron/tasks`) | Kanban DnD + gorev atama + filtre | **Cursor** | P1 | 4 saat |
| 11 | Sistem Durumu (`/patron/status`) | Canli health check + uptime grafik | **V0** | P2 | 2 saat |
| 12 | Vitrin (`/vitrin`) | Demo formu validasyonu + zod + canli fiyat API | **V0** | P1 | 3 saat |

### E2. FRANCHISE PANEL SAYFALARI

| # | Sayfa/Modul | Gorev | Arac | Oncelik | Sure |
|---|-------------|-------|------|---------|------|
| 13 | Sporcu CRUD | Tam CRUD + arama + filtre + pagination | **Cursor** | P0 | 6 saat |
| 14 | Yoklama sistemi | QR yoklama + takvim gorunumu + rapor | **Devin** | P0 | 8 saat |
| 15 | Aidat yonetimi | Otomatik faturalama + hatirlatma + odeme takip | **Devin** | P0 | 8 saat |
| 16 | Ders programi | Haftalik/aylik takvim + surukle-birak + catisma kontrolu | **Cursor** | P1 | 6 saat |
| 17 | Veli paneli | Cocuk bilgi + gelisim grafik + aidat durum + mesajlasma | **V0** | P1 | 6 saat |
| 18 | Cocuk gelisim | Olcum kaydi + referans deger karsilastirma + grafik | **Devin** | P1 | 6 saat |
| 19 | Raporlama | Gelir-gider raporu + PDF export + trend analiz | **Cursor** | P2 | 5 saat |
| 20 | Duyuru sistemi | Toplu SMS/push + sablon + zamanlama | **Devin** | P2 | 4 saat |

### E3. ALTYAPI GOREVLERI

| # | Gorev | Arac | Oncelik | Sure |
|---|-------|------|---------|------|
| 21 | PWA gelismis cache + push notification | **Devin** | P0 | 6 saat |
| 22 | Supabase RLS politikalari tamamla | **Devin** | P0 | 4 saat |
| 23 | CI/CD pipeline (GitHub Actions) | **Devin** | P1 | 3 saat |
| 24 | Stripe/PayTR odeme entegrasyonu | **Devin** | P1 | 8 saat |
| 25 | Twilio/Netgsm SMS entegrasyonu | **Devin** | P1 | 4 saat |
| 26 | Test altyapisi (Vitest + Playwright) | **Devin** | P2 | 6 saat |
| 27 | i18n (Turkce/Ingilizce) | **Cursor** | P3 | 8 saat |
| 28 | Monitoring (Sentry + uptime) | **Devin** | P2 | 3 saat |

### E4. ONCELIK OZETI

| Oncelik | Gorev Sayisi | Toplam Sure | Aciklama |
|---------|-------------|-------------|----------|
| **P0 (Kritik)** | 8 gorev | ~50 saat | Beyin takimi canli AI, komut merkezi, onay zinciri, sporcu CRUD, yoklama, aidat, PWA, RLS |
| **P1 (Onemli)** | 11 gorev | ~55 saat | Dashboard widget, direktorluk prompt, tenant izleme, ders programi, veli panel, gelisim, odeme, SMS, CI/CD |
| **P2 (Iyilestirme)** | 6 gorev | ~23 saat | Patron dashboard, sistem durumu, raporlama, duyuru, test, monitoring |
| **P3 (Gelecek)** | 1 gorev | ~8 saat | i18n |
| **TOPLAM** | **28 gorev** | **~136 saat** | Tahmini 4-5 hafta (tek gelistirici) veya 2-3 hafta (paralel calisan Devin + Cursor + V0) |

### E5. ARAC DAGILIMI

| Arac | Gorev Sayisi | Toplam Sure | Kullanim Alani |
|------|-------------|-------------|----------------|
| **Devin** | 11 gorev | ~66 saat | Backend entegrasyon, API, PWA, RLS, odeme, SMS, test, monitoring, yoklama, aidat, gelisim, duyuru |
| **Cursor** | 9 gorev | ~42 saat | Dashboard UI, kanban, DnD, ders programi, tenant izleme, sporcu CRUD, raporlama, i18n |
| **V0** | 5 gorev | ~16 saat | Login intro, patron dashboard, sistem durumu, vitrin, veli panel |
| **Fal AI** | (destek) | — | Gorsel icerik, logo, marka tasarimi (gerektiginde) |

---

## F. SONRAKI ADIMLAR

### F1. Patron Onay Sureci

1. Bu dokuman Patron'a (Serdinc Altay) sunulur
2. Patron her sayfa prototipini inceleyip onaylar veya degisiklik ister
3. Onaylanan sayfalar icin P0 gorevlerinden baslanir
4. Her sprint sonunda demo + onay dongusu

### F2. Onerilen Sprint Plani

| Sprint | Sure | Icerik |
|--------|------|--------|
| **Sprint 2** | 2 hafta | P0 gorevleri: Beyin takimi canli AI, onay zinciri, sporcu CRUD, yoklama, aidat, PWA, RLS |
| **Sprint 3** | 2 hafta | P1 gorevleri: Dashboard widget, direktorluk, tenant izleme, ders programi, veli panel, odeme |
| **Sprint 4** | 1 hafta | P2 gorevleri: Raporlama, duyuru, test, monitoring |
| **Sprint 5** | 1 hafta | P3 + polish: i18n, performans, UX iyilestirme |

### F3. Referans Dokumanlar

- `YISA-S-PROJE-SEMA-VE-DURUM.md` — Mimari sema ve mevcut durum
- `YISA-S-EKSIKLER-VE-YAPILACAKLAR.md` — Eksikler analizi + OZET-RAPOR
- `YISA-S-GOREV-KOMUT-SISTEMI.md` — 12 arac komut sablonlari
- `v0-futuristic-dashboard-ng/v0-GOREVLER.md` — v0.dev UI gorevleri
- `v0-futuristic-dashboard-ng/v0-BAGLAM-VE-BUTUN.md` — Sistem baglami
- `v0-futuristic-dashboard-ng/docs/PATRON_PANEL_REFERANS.md` — Panel referans dokumani

---

**Hazirlayan:** Devin AI — YiSA-S Dokumantasyon Sistemi
**Tarih:** 25 Subat 2026
**Durum:** Patron onayina hazir — prototip aciklamalari + calisma plani + PWA gereksinimleri
**PR:** serdincaltay-ai/tenant-yisa-s#31
