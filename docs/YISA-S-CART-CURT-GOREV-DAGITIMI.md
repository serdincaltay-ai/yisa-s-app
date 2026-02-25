# YiSA-S CART-CURT GOREV DAGITIM DOKUMANI

**Tarih:** 25 Subat 2026
**Mod:** CART-CURT (Hizli Prototipleme)
**Durum:** Master gorev dagitimi — tum araclar icin

---

## A. ARACLARIN GOREV LISTESI

### A1. DEVIN GOREVLERI

| # | Gorev | Repo | Detay | Oncelik | Tahmini Sure | Durum |
|---|-------|------|-------|---------|-------------|-------|
| D1 | Scroll-snap CSS + Inter font entegrasyonu | **tenant-yisa-s** | `globals.css` scroll-snap kuralları + `tailwind.config` Inter font tanimlamasi + `layout.tsx` font yukleme | **P0** | 2 saat | BEKLIYOR |
| D2 | v0-3-d-landing-page bos icerik duzeltme | **v0-3-d-landing-page** | Sayfa 3/11 bos icerik duzeltme + font tutarliligi (Inter ailesi) + eksik bolum icerikleri | **P0** | 3 saat | BEKLIYOR |

**Devin Teknik Notlar:**
- D1: `globals.css`'e scroll-snap kurallarini ekle (`scroll-snap-type: y mandatory`, `.snap-section` sinifi)
- D1: `tailwind.config.ts`'de `fontFamily.sans` olarak Inter tanimla
- D1: `app/layout.tsx`'de `next/font/google` ile Inter import et
- D2: v0-3-d-landing-page reposunda 11 bolumden bos/eksik olanlari tespit et ve icerik ekle
- D2: Tum sayfalarda font tutarliligini kontrol et (Inter disinda font varsa degistir)

---

### A2. CURSOR GOREVLERI

| # | Gorev | Repo | Detay | Oncelik | Tahmini Sure | Durum |
|---|-------|------|-------|---------|-------------|-------|
| C1 | TypeScript strict mode + `any` kullanimlari duzelt | **tenant-yisa-s** | `tsconfig.json` strict mode aktif et, tum `any` kullanimlarini tip-guvenli hale getir | **P1** | 4 saat | BEKLIYOR |
| C2 | API route error handling standardize et | **app-yisa-s** | Tum `/api/*` route'larda tutarli hata yakalama + `lib/errors.ts` kullanimi + HTTP status kodlari standardizasyonu | **P1** | 4 saat | BEKLIYOR |

**Cursor Teknik Notlar:**
- C1: `tsconfig.json` → `"strict": true`, `"noImplicitAny": true` ekle
- C1: Tum `.ts/.tsx` dosyalarda `any` arama yap, dogru tiplere donustur
- C1: Ozellikle `lib/db/*.ts`, `app/api/**/*.ts` dosyalarina odaklan
- C2: Her API route'da `try/catch` + standart hata formati: `{ error: string, code: string, status: number }`
- C2: `lib/errors.ts` icindeki mevcut hata siniflarini kullan (AppError, ValidationError, AuthError)
- C2: Tum route'larda tutarli `NextResponse.json()` donusu sagla

---

### A3. V0 GOREVLERI (UCRETSIZ SABLONLARDAN FORK)

| # | Gorev | Kaynak Sablon | Hedef | Detay | Oncelik | Tahmini Sure | Durum |
|---|-------|--------------|-------|-------|---------|-------------|-------|
| V1 | Patron Dashboard | **Cyberpunk Dashboard** | **app-yisa-s** `/patron/dashboard` | COMMAND CENTER → CELF, AGENT → SPORCU/ANTRENOR, neon renkler → cyan-400/orange-500, metrikleri YiSA-S verileriyle degistir | **P0** | 4 saat | BEKLIYOR |
| V2 | Veli Paneli | **Shadcn Dashboard** | **tenant-yisa-s** `/veli/dashboard` | Cocuk gelisim grafigi (recharts), odeme/aidat durum tablosu, takvim bileseni, mesaj listesi | **P1** | 4 saat | BEKLIYOR |
| V3 | Antrenor Paneli | **M.O.N.K.Y Dashboard** | **tenant-yisa-s** `/antrenor` | Yoklama alma arayuzu, olcum kaydi formu, sinif/grup yonetimi, sporcu listesi | **P1** | 4 saat | BEKLIYOR |
| V4 | CFO Paneli | **Financial Dashboard** | **app-yisa-s** `/patron/direktorlukler/muhasebe` | Gelir-gider grafik, butce takibi, maliyet analiz, franchise bazli kasa | **P2** | 3 saat | BEKLIYOR |

**V0 Fork Kurallari:**
- Sablon fork edildikten sonra SADECE gerekli bolumler alinir (tamamini kopyalama)
- Renk paleti: `YISA-S-SITE-ISKELET-VE-TASARIM-STANDARTLARI.md` A bolumune uygun olmali
- Font: SADECE Inter — sablon farkli font kullaniyorsa degistir
- Turkce: Tum metinler Turkce olacak, placeholder'lar Turkce
- Ikon: `lucide-react` kullan, sablon farkli kutuphane kullaniyorsa degistir
- Dark theme: `bg-zinc-950` zemin zorunlu

**V0 Donusum Haritasi (Cyberpunk → YiSA-S):**
| Cyberpunk Terimi | YiSA-S Karsiligi |
|-----------------|-----------------|
| COMMAND CENTER | CELF Merkez |
| AGENT | Sporcu / Antrenor |
| MISSION | Gorev |
| THREAT LEVEL | Oncelik Seviyesi |
| OPERATIONS | Operasyonlar (COO Direktorlugu) |
| NEURAL NETWORK | Beyin Takimi (4 AI Robot) |
| CYBER DEFENSE | Guvenlik Robotu (3 Duvar) |

---

### A4. FAL AI GOREVLERI ($55.55 bakiye)

| # | Gorev | Cikti Formati | Detay | Oncelik | Tahmini Maliyet | Durum |
|---|-------|--------------|-------|---------|----------------|-------|
| F1 | Intro video 8sn YAZISIZ | **MP4** 16:9, 720p, 8sn | Ingilizce prompt: "Futuristic dark sports academy, neon cyan lights, athletes training, AI hologram dashboard, cinematic 8 seconds, NO TEXT NO WORDS NO LETTERS" | **P0** | ~$2-3 | BEKLIYOR |
| F2 | 6 brans gorseli | **PNG** 1920x1080 | Her brans icin 1 gorsel: basketbol, voleybol, futbol, yuzme, tenis, jimnastik. Dark theme, neon accent, atletik, profesyonel. YAZISIZ. | **P1** | ~$3-6 | BEKLIYOR |
| F3 | Patron profil gorseli | **PNG** 512x512 | Profesyonel erkek, dark theme arka plan, takim elbise, guvenilir gorunum, kurumsal portre. YAZISIZ. | **P2** | ~$0.50 | BEKLIYOR |

**Fal AI Prompt Kurallari:**
- Tum promptlar **INGILIZCE** yazilacak (Turkce prompt kalite dusurur)
- Her promptun sonuna **"NO TEXT NO WORDS NO LETTERS NO WRITING"** eklenmeli
- Video: `fal-ai/fast-svd` veya `fal-ai/runway/gen3` modeli
- Gorsel: `fal-ai/flux/schnell` veya `fal-ai/flux/dev` modeli
- Cozunurluk: Video 720p (1280x720), gorsel 1920x1080
- **TURKCE YAZI YASAK** — yazilar sonra CapCut/CSS ile eklenir

**Tahmini Toplam Maliyet:** ~$6-10 (bakiye: $55.55 → kalan: ~$45-49)

---

### A5. CAPCUT GOREVLERI

| # | Gorev | Girdi | Cikti | Detay | Oncelik | Durum |
|---|-------|-------|-------|-------|---------|-------|
| CC1 | Intro videoya Turkce overlay | F1 ciktisi (8sn MP4) | **MP4** 16:9, 720p | Fal AI videosuna Turkce yazi overlay ekle: "Teknolojiyi Spora Baslatiyoruz" — Inter Bold, beyaz metin, `#22d3ee` glow efekti, fade-in animasyon | **P0** | BEKLIYOR |

**CapCut Kurallari:**
- Font: **Inter Bold** (yoksa en yakin sans-serif)
- Turkce karakterler: ö, ü, ç, ş, ğ, ı dogru gorunmeli — test et
- Metin renk: `#ffffff` (beyaz) + `text-shadow: 0 0 20px #22d3ee` (cyan glow)
- Pozisyon: Alt-orta (%20 yukari), ortalanmis
- Animasyon: 0-2sn fade-in, 2-6sn gorunur, 6-8sn fade-out
- Export: MP4 H.264, 720p minimum

---

### A6. CANVA GOREVLERI

| # | Gorev | Boyut | Detay | Oncelik | Durum |
|---|-------|-------|-------|---------|-------|
| CA1 | Instagram story sablonu | **1080x1920** | YiSA-S marka sablonu: dark bg (#09090b), cyan accent, Inter font, logo ust-orta, alt kisimda CTA alani. 3 varyant: duyuru, etkinlik, promosyon | **P1** | BEKLIYOR |
| CA2 | Facebook kapak | **1200x628** | YiSA-S Facebook kapak: dark gradient bg, cyan glow, ortada slogan ("AI Destekli Spor Okulu Yonetimi"), sol ust logo, sag alt website | **P2** | BEKLIYOR |

**Canva Kurallari:**
- Renk paleti: `YISA-S-SITE-ISKELET-VE-TASARIM-STANDARTLARI.md` A1 bolumune uygun
- Font: Inter (Canva'da mevcut)
- Logo: Tek kez, kucuk (ust kisimda)
- Turkce karakterler: Canva'da sorunsuz, ama export sonrasi kontrol et
- Export: PNG (gorsel), MP4 (animasyonlu ise)

---

### A7. CREATI STUDIO GOREVLERI

| # | Gorev | Cikti | Detay | Oncelik | Durum |
|---|-------|-------|-------|---------|-------|
| CR1 | AI ambassador tanitim videosu | **MP4** 16:9, 1080p, 30-60sn | AI ambassador (avatar) YiSA-S'i tanitiyor. Dark theme, profesyonel. Video YAZISIZ uretilecek, Turkce altyazi/overlay sonra CapCut ile eklenecek. | **P2** | BEKLIYOR |

**Creati Studio Kurallari:**
- Video iceriginde metin/yazi YASAK (Turkce karakter bozulmasi riski)
- Avatar stili: Profesyonel, kurumsal, guven veren
- Arka plan: Koyu/dark, teknolojik gorunum
- Ses: Opsiyonel (muzik veya sessiz, konusma yok)
- Turkce yazi sonra CapCut ile overlay olarak eklenecek

---

## B. BITINCE NE OLACAK MATRISI

### B1. Kod Gorevleri (PR + Deploy)

| Gorev | Aksiyon | Repo | Branch | PR | Deploy | Onaylayan |
|-------|---------|------|--------|----|----|-----------|
| D1 — Scroll-snap + Inter | PR olustur → merge → deploy | **tenant-yisa-s** | `feature/cart-curt-css` | Evet | Vercel auto-deploy | Patron |
| D2 — v0 landing bos icerik | PR olustur → merge → deploy | **v0-3-d-landing-page** | `fix/empty-sections` | Evet | Vercel auto-deploy | Patron |
| C1 — TS strict mode | PR olustur → merge → deploy | **tenant-yisa-s** | `fix/typescript-strict` | Evet | Vercel auto-deploy | Patron |
| C2 — API error handling | PR olustur → merge → deploy | **app-yisa-s** | `fix/api-error-handling` | Evet | Vercel auto-deploy | Patron |
| V1 — Patron Dashboard | PR olustur → merge → deploy | **app-yisa-s** | `feature/patron-dashboard-v2` | Evet | Vercel auto-deploy | Patron |
| V2 — Veli Paneli | PR olustur → merge → deploy | **tenant-yisa-s** | `feature/veli-panel-v2` | Evet | Vercel auto-deploy | Patron |
| V3 — Antrenor Paneli | PR olustur → merge → deploy | **tenant-yisa-s** | `feature/antrenor-panel-v2` | Evet | Vercel auto-deploy | Patron |
| V4 — CFO Paneli | PR olustur → merge → deploy | **app-yisa-s** | `feature/cfo-panel` | Evet | Vercel auto-deploy | Patron |

### B2. Medya Gorevleri (Manuel Teslim)

| Gorev | Aksiyon | Cikti | Nereye Konulacak | Onaylayan |
|-------|---------|-------|------------------|-----------|
| F1 — Intro video | Fal AI uret → indir | MP4 8sn | `public/videos/intro.mp4` (tenant-yisa-s) | Patron |
| F2 — Brans gorselleri | Fal AI uret → indir | 6x PNG | `public/images/branches/` (tenant-yisa-s) | Patron |
| F3 — Patron profil | Fal AI uret → indir | PNG 512x512 | `public/images/patron-avatar.png` | Patron |
| CC1 — Intro overlay | CapCut isle → export | MP4 8sn | F1'in uzerine yazilir → `public/videos/intro-tr.mp4` | Patron |
| CA1 — IG story | Canva'da tasarla → export | 3x PNG | `docs/media/social/` (arsiv) | Patron |
| CA2 — FB kapak | Canva'da tasarla → export | PNG | `docs/media/social/` (arsiv) | Patron |
| CR1 — Ambassador video | Creati uret → indir | MP4 30-60sn | `public/videos/ambassador.mp4` | Patron |

### B3. Akis Semasi

```
URETIM AKISI:

Fal AI (F1: video YAZISIZ) ──→ CapCut (CC1: Turkce overlay ekle) ──→ tenant-yisa-s/public/videos/intro-tr.mp4
Fal AI (F2: gorseller)     ──→ tenant-yisa-s/public/images/branches/ (dogrudan)
Fal AI (F3: avatar)         ──→ tenant-yisa-s/public/images/ (dogrudan)
Canva (CA1, CA2)            ──→ docs/media/social/ (arsiv, deploy yok)
Creati (CR1: video YAZISIZ) ──→ CapCut (Turkce overlay) ──→ tenant-yisa-s/public/videos/ambassador-tr.mp4

V0 sablonlari (V1-V4)      ──→ Fork + uyarla ──→ PR olustur ──→ Patron onay ──→ merge ──→ Vercel auto-deploy
Devin gorevleri (D1-D2)     ──→ Kod yaz ──→ PR olustur ──→ Patron onay ──→ merge ──→ Vercel auto-deploy
Cursor gorevleri (C1-C2)    ──→ Kod yaz ──→ PR olustur ──→ Patron onay ──→ merge ──→ Vercel auto-deploy
```

### B4. Oncelik Sirasi ve Bagimliliklari

```
SIRA 1 (PARALEL — P0):
  D1 (scroll-snap CSS)     ← bagimsiz, hemen basla
  F1 (intro video)         ← bagimsiz, hemen basla
  V1 (patron dashboard)   ← bagimsiz, hemen basla

SIRA 2 (P0, BAGIMLI):
  CC1 (intro overlay)      ← F1 bitmesini bekler
  D2 (v0 landing duzelt)  ← D1 bitmesini bekler (font tutarliligi)

SIRA 3 (PARALEL — P1):
  C1 (TS strict mode)     ← bagimsiz
  C2 (API error handling) ← bagimsiz
  V2 (veli paneli)        ← bagimsiz
  V3 (antrenor paneli)    ← bagimsiz
  F2 (brans gorselleri)   ← bagimsiz
  CA1 (IG story)          ← bagimsiz

SIRA 4 (P2):
  V4 (CFO paneli)         ← bagimsiz
  F3 (patron profil)      ← bagimsiz
  CA2 (FB kapak)          ← bagimsiz
  CR1 (ambassador video)  ← bagimsiz
```

---

## C. TURKCE KARAKTER KURALI

### C1. Problem

AI gorsel/video uretim araclari (Fal AI, Creati Studio, Midjourney vb.) Turkce karakterleri bozar:
- `ö` → `o` veya garip glyph
- `ş` → `s` veya eksik
- `ı` (noktasiz i) → `i` (noktali) veya bos
- `ç` → `c`
- `ğ` → `g`
- `ü` → `u`

### C2. Cozum: IKI ASAMALI URETIM

```
ASAMA 1: AI URETIMI (YAZISIZ)
┌─────────────────────────────────────────┐
│ Fal AI / Creati Studio                   │
│                                          │
│ Video veya gorsel YAZISIZ uretilir       │
│ Prompt'ta "NO TEXT" zorunlu              │
│ Sadece gorsel/video icerik               │
│                                          │
│ Cikti: ham_video.mp4 / ham_gorsel.png    │
└─────────────────────────────────────────┘
              │
              ▼
ASAMA 2: TURKCE YAZI EKLEME
┌─────────────────────────────────────────┐
│ CapCut (video) / CSS overlay (web)       │
│                                          │
│ Turkce yazilar bu asamada eklenir        │
│ Font: Inter (Turkce karakter destekli)   │
│ Kontrol: ö, ş, ı, ç, ğ, ü test edilir  │
│                                          │
│ Cikti: final_video_tr.mp4               │
└─────────────────────────────────────────┘
```

### C3. Prompt Sablon Kurali

**Video Prompt (Fal AI):**
```
[SAHNE ACIKLAMASI — INGILIZCE]. Cinematic, dark theme, neon cyan accent lights.
Duration: [SURE]. Resolution: [COZUNURLUK].
IMPORTANT: NO TEXT, NO WORDS, NO LETTERS, NO WRITING, NO SUBTITLES, NO CAPTIONS anywhere in the video.
```

**Gorsel Prompt (Fal AI):**
```
[GORSEL ACIKLAMASI — INGILIZCE]. Professional photography style, dark background (#09090b),
neon cyan accent (#22d3ee), cinematic lighting. Resolution: 1920x1080.
IMPORTANT: NO TEXT, NO WORDS, NO LETTERS, NO WRITING, NO WATERMARK anywhere in the image.
```

### C4. Web Tarafinda Turkce Overlay

Site uzerinde video/gorsel uzerine Turkce yazi eklemek icin CSS overlay kullanilir:

```tsx
// Video Overlay Ornegi
<div className="relative">
  <video src="/videos/intro.mp4" autoPlay muted loop />
  <div className="absolute inset-0 flex items-end justify-center pb-20">
    <h2 className="text-4xl font-bold text-white drop-shadow-[0_0_20px_rgba(34,211,238,0.5)]">
      Teknolojiyi Spora Baslatiyoruz
    </h2>
  </div>
</div>
```

### C5. Turkce Karakter Test Kontrol Listesi

Her medya ciktisinda asagidaki karakterler kontrol edilmeli:

| Karakter | Test Kelimesi | Dogru | Yanlis |
|----------|--------------|-------|--------|
| **ö** | Öğrenci | Öğrenci | Ogrenci |
| **ü** | Ücret | Ücret | Ucret |
| **ç** | Çalışma | Çalışma | Calisma |
| **ş** | Şube | Şube | Sube |
| **ğ** | Değer | Değer | Deger |
| **ı** | Işık | Işık | Isik |
| **İ** | İstanbul | İstanbul | Istanbul |

---

## D. GENEL KURALLAR

### D1. Tum Araclar Icin Ortak Kurallar

1. **Renk paleti:** `YISA-S-SITE-ISKELET-VE-TASARIM-STANDARTLARI.md` A1 bolumune uy
2. **Font:** SADECE Inter ailesi (Bold/SemiBold/Medium/Regular)
3. **Logo:** 1 kez goruntuleme kurali — her sayfada tekrar YASAK
4. **Ikon:** `lucide-react`, stroke-width 1.5
5. **Dark theme:** `bg-zinc-950` ana zemin, her zaman
6. **Turkce:** Turkce karakter bozulmasi YASAK — AI uretimde yazisiz, sonra overlay
7. **PR:** Tum kod degisiklikleri PR uzerinden, Patron onayiyla merge
8. **Arsiv:** Medya dosyalari `docs/media/` veya `public/` altina kayit

### D2. Iletisim Protokolu

| Durum | Aksiyon |
|-------|---------|
| Gorev tamamlandi | PR linki + preview URL paylas |
| Gorev bloke | Patrona sormadan 3 alternatif dene, sonra sor |
| Medya hazir | Dosyayi attach et, Patron onay bekle |
| Hata/bug | Screenshot + hata mesaji paylas |
| Oncelik degisikligi | Patron'dan konfirmasyon al |

---

## E. OZET TABLO

| Arac | Gorev Sayisi | P0 | P1 | P2 | Toplam Sure | Repo |
|------|-------------|----|----|----|-----------|----|
| **Devin** | 2 | 2 | 0 | 0 | ~5 saat | tenant-yisa-s, v0-3-d-landing-page |
| **Cursor** | 2 | 0 | 2 | 0 | ~8 saat | tenant-yisa-s, app-yisa-s |
| **V0** | 4 | 1 | 2 | 1 | ~15 saat | app-yisa-s, tenant-yisa-s |
| **Fal AI** | 3 | 1 | 1 | 1 | ~2 saat | (medya ciktisi) |
| **CapCut** | 1 | 1 | 0 | 0 | ~1 saat | (medya isleme) |
| **Canva** | 2 | 0 | 1 | 1 | ~2 saat | (medya ciktisi) |
| **Creati** | 1 | 0 | 0 | 1 | ~1 saat | (medya ciktisi) |
| **TOPLAM** | **15 gorev** | **5** | **6** | **4** | **~34 saat** | |

---

**Hazirlayan:** Devin AI — YiSA-S CART-CURT Modu
**Tarih:** 25 Subat 2026
**Durum:** Patron onayina hazir — master gorev dagitim plani
**Iliskili Dokuman:** `docs/YISA-S-SITE-ISKELET-VE-TASARIM-STANDARTLARI.md`
