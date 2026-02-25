# YiSA-S SITE ISKELET VE TASARIM STANDARTLARI

**Tarih:** 25 Subat 2026
**Mod:** CART-CURT (Hizli Prototipleme)
**Durum:** Patron onayina hazir

---

## A. KURUMSAL KIMLIK STANDARTLARI

### A1. Renk Paleti

| Kullanim | Tailwind Sinifi | HEX | Aciklama |
|----------|----------------|-----|----------|
| **Ana Zemin** | `bg-zinc-950` | `#09090b` | Tum sayfa arka plani |
| **Kart Zemin** | `bg-zinc-900` | `#18181b` | Kart, panel, modal arka planlari |
| **Kart Hover** | `bg-zinc-800` | `#27272a` | Hover ve aktif kart durumu |
| **Accent (Birincil)** | `text-cyan-400` / `border-cyan-400` | `#22d3ee` | Basliklar, linkler, aktif durumlar, CTA butonlari |
| **Accent (Ikincil)** | `text-orange-500` / `border-orange-500` | `#f97316` | Vurgular, badge'ler, onemli uyarilar |
| **Metin (Ana)** | `text-white` | `#ffffff` | Ana basliklar ve govde metni |
| **Metin (Ikincil)** | `text-zinc-400` | `#a1a1aa` | Alt basliklar, aciklamalar, placeholder |
| **Metin (Soluk)** | `text-zinc-500` | `#71717a` | Deaktif durumlar, footnote |
| **Border** | `border-zinc-800` | `#27272a` | Kart kenarliklari, ayiricilar |
| **Border Aktif** | `border-cyan-400/50` | `#22d3ee80` | Aktif/secili kart kenarligi |
| **Basari** | `text-emerald-400` | `#34d399` | Basarili islem, aktif durum |
| **Hata** | `text-red-400` | `#f87171` | Hata mesajlari, tehlike |
| **Uyari** | `text-amber-400` | `#fbbf24` | Uyari, beklemede |

**Gradient Kullanimi:**
```
Buton: bg-gradient-to-r from-cyan-500 to-cyan-400
Hero arka plan: bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950
Kart glow: shadow-[0_0_15px_rgba(34,211,238,0.1)]
```

### A2. Tipografi (Font)

**SADECE Inter ailesi kullanilacak. Baska font YASAK.**

| Kullanim | Font | Agirlik | Boyut | Line Height | Tailwind |
|----------|------|---------|-------|-------------|----------|
| **Ana Baslik (H1)** | Inter | Bold (700) | 48px | 1.1 | `text-5xl font-bold` |
| **Sayfa Basligi (H2)** | Inter | Bold (700) | 36px | 1.2 | `text-4xl font-bold` |
| **Bolum Basligi (H3)** | Inter | SemiBold (600) | 24px | 1.3 | `text-2xl font-semibold` |
| **Alt Baslik (H4)** | Inter | SemiBold (600) | 20px | 1.4 | `text-xl font-semibold` |
| **Govde Metni** | Inter | Regular (400) | 16px | 1.6 | `text-base font-normal` |
| **Kucuk Govde** | Inter | Regular (400) | 14px | 1.5 | `text-sm font-normal` |
| **Buton Metni** | Inter | Medium (500) | 14px | 1 | `text-sm font-medium` |
| **Etiket/Badge** | Inter | Medium (500) | 12px | 1 | `text-xs font-medium` |
| **Kucuk Metin** | Inter | Regular (400) | 12px | 1.4 | `text-xs font-normal` |

**Font Yukleme (next.config / layout.tsx):**
```tsx
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })
// <body className={inter.className}>
```

### A3. Logo Kurali

> **KURAL:** Logo SADECE 1 (bir) kez gorunecek. Her sayfada tekrar YASAK.

| Konum | Gorunum | Boyut |
|-------|---------|-------|
| **Sol ust navbar** veya **Hero intro** | YiSA-S logosu (beyaz/cyan) | max-h: 40px |
| Diger sayfalar/bolumler | Logo GOSTERILMEZ | - |
| Footer | Sadece "YiSA-S" text (logo ikon degil) | text-sm |

### A4. Ikon Stili

| Ozellik | Deger |
|---------|-------|
| **Kutuphane** | `lucide-react` |
| **Stroke Width** | `1.5` |
| **Varsayilan Boyut** | `20px` (w-5 h-5) |
| **Buyuk Ikon** | `24px` (w-6 h-6) — kart ikonlari, hero |
| **Kucuk Ikon** | `16px` (w-4 h-4) — buton icindeki, badge |
| **Renk** | Bulundugu metnin rengiyle ayni (currentColor) |
| **Hover** | `text-cyan-400` gecisi |

```tsx
import { GraduationCap, Shield, Brain } from 'lucide-react'
// <GraduationCap className="w-5 h-5 text-cyan-400" strokeWidth={1.5} />
```

### A5. Buton Standartlari

| Tip | Tailwind Siniflari |
|-----|-------------------|
| **Birincil (CTA)** | `bg-gradient-to-r from-cyan-500 to-cyan-400 text-zinc-950 font-medium px-6 py-3 rounded-xl hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all` |
| **Ikincil** | `border border-zinc-700 text-zinc-300 font-medium px-6 py-3 rounded-xl hover:border-cyan-400/50 hover:text-cyan-400 transition-all` |
| **Ghost** | `text-zinc-400 font-medium px-4 py-2 rounded-lg hover:text-white hover:bg-zinc-800 transition-all` |
| **Tehlike** | `bg-red-500/10 text-red-400 border border-red-500/20 font-medium px-6 py-3 rounded-xl hover:bg-red-500/20 transition-all` |

### A6. Kart Standartlari

```
Standart Kart:
  bg-zinc-900 border border-zinc-800 rounded-2xl p-6
  hover:border-cyan-400/30 hover:shadow-[0_0_15px_rgba(34,211,238,0.05)]
  transition-all duration-300

Vurgulu Kart (onemli):
  bg-zinc-900 border border-cyan-400/20 rounded-2xl p-6
  shadow-[0_0_20px_rgba(34,211,238,0.1)]

Deaktif Kart:
  bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6 opacity-60
```

### A7. Spacing ve Grid

| Ozellik | Deger |
|---------|-------|
| **Sayfa max-width** | `max-w-7xl mx-auto` (1280px) |
| **Bolum padding** | `px-6 py-20` (mobil: `px-4 py-12`) |
| **Kart gap** | `gap-6` (24px) |
| **Grid 2 kolon** | `grid grid-cols-1 md:grid-cols-2 gap-6` |
| **Grid 3 kolon** | `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6` |
| **Grid 4 kolon** | `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4` |

### A8. Animasyon Standartlari

| Animasyon | Kullanim | CSS/Tailwind |
|-----------|----------|-------------|
| **Fade In** | Sayfa gecisleri | `animate-fadeIn` (opacity 0→1, 0.5s) |
| **Slide Up** | Kart/bolum girisi | `animate-slideUp` (translateY 20px→0, 0.5s) |
| **Glow Pulse** | Aktif durum | `animate-pulse` (shadow pulse) |
| **Hover Scale** | Kart hover | `hover:scale-[1.02] transition-transform` |
| **Scroll Snap** | Bolum gecisi | `scroll-snap-type: y mandatory` |

---

## B. SAYFA WIREFRAME (11 BOLUM — SCROLL-SNAP)

> **Tasarim Prensibi:** Site UZUN olmayacak. `scroll-snap` kullanilacak, her bolum tam ekran (`100vh`).
> Kullanici kaydirdiginda yeni bolum kayarak gelecek (sneaker/showcase tarzi).
> Toplam 11 bolum, her biri `min-h-screen snap-start` ile isaretli.

**Genel Sayfa Yapisi:**
```
<main className="h-screen overflow-y-auto snap-y snap-mandatory">
  <section id="hero" className="min-h-screen snap-start">...</section>
  <section id="neden" className="min-h-screen snap-start">...</section>
  <section id="ders" className="min-h-screen snap-start">...</section>
  <section id="paneller" className="min-h-screen snap-start">...</section>
  <section id="branslar" className="min-h-screen snap-start">...</section>
  <section id="kredi" className="min-h-screen snap-start">...</section>
  <section id="direktorlukler" className="min-h-screen snap-start">...</section>
  <section id="robotlar" className="min-h-screen snap-start">...</section>
  <section id="sube" className="min-h-screen snap-start">...</section>
  <section id="sistem" className="min-h-screen snap-start">...</section>
  <section id="footer" className="min-h-screen snap-start">...</section>
</main>
```

---

### B1. HERO (Bolum 1 — Logo + Slogan + CTA)

```
+================================================================+
| BOLUM 1: HERO                                    [100vh snap]  |
|================================================================|
|                                                                 |
|  [Navbar — sabit, sticky top]                                  |
|  +------------------------------------------------------------+|
|  | [YiSA-S Logo 40px]              [Neden] [Brans] [Demo] [>] ||
|  +------------------------------------------------------------+|
|                                                                 |
|                    (ortalanmis, dikey merkez)                   |
|                                                                 |
|              ██╗   ██╗██╗███████╗ █████╗                       |
|              ╚██╗ ██╔╝██║██╔════╝██╔══██╗                      |
|               ╚████╔╝ ██║███████╗███████║                      |
|                ╚██╔╝  ██║╚════██║██╔══██║                      |
|                 ██║   ██║███████║██║  ██║                       |
|                 ╚═╝   ╚═╝╚══════╝╚═╝  ╚═╝                     |
|                                                                 |
|          "AI Destekli Spor Okulu Yonetim Sistemi"              |
|             text-zinc-400 text-xl font-normal                  |
|                                                                 |
|     +------------------+    +------------------+               |
|     | DEMO TALEP ET    |    | KESFET  ↓        |               |
|     | (CTA birincil)   |    | (ikincil buton)  |               |
|     +------------------+    +------------------+               |
|                                                                 |
|          [asagi ok animasyonu — scroll ipucu]                  |
|                  ↓ chevron-down pulse                           |
+================================================================+
```

**Detay:**
- Arka plan: `bg-zinc-950` + radial gradient glow ortada (cyan %5 opasite)
- Logo: Tek gorundugu yer (navbar sol ust) — max-h 40px
- Slogan: `text-xl text-zinc-400`
- CTA buton: `bg-gradient-to-r from-cyan-500 to-cyan-400 text-zinc-950`
- Kesfet buton: `border border-zinc-700 text-zinc-300`
- Scroll ipucu: Chevron-down ikonu, `animate-bounce`, `text-zinc-500`
- Navbar: `fixed top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800`

**Mobil (PWA):**
- Logo 32px, slogan `text-base`
- Butonlar ust uste (stack), tam genislik
- Navbar hamburger menu (sag ust)

---

### B2. NEDEN YiSA-S (Bolum 2 — 6 Kart 3x2)

```
+================================================================+
| BOLUM 2: NEDEN YiSA-S?                          [100vh snap]  |
|================================================================|
|                                                                 |
|        "Neden YiSA-S?" text-4xl font-bold text-white          |
|        "Spor okulunuzu dijitallestirin" text-zinc-400          |
|                                                                 |
|  +-------------------+ +-------------------+ +-----------------+
|  | [Brain icon]      | | [Shield icon]     | | [Calendar icon] |
|  | AI DESTEKLI       | | GUVENLI           | | DERS PROGRAMI   |
|  | YONETIM           | | ALTYAPI           | | OTOMASYONU      |
|  |                   | |                   | |                 |
|  | 4 AI robotu ile   | | 3 katmanli siber  | | Haftalik/aylik  |
|  | akilli gorev      | | guvenlik, RLS,    | | takvim, catisma |
|  | dagitimi          | | RBAC              | | kontrolu        |
|  +-------------------+ +-------------------+ +-----------------+
|                                                                 |
|  +-------------------+ +-------------------+ +-----------------+
|  | [CreditCard icon] | | [Users icon]      | | [BarChart icon] |
|  | DIJITAL KREDI     | | VELI PANELI       | | RAPORLAMA       |
|  | SISTEMI           | |                   | |                 |
|  |                   | |                   | |                 |
|  | Online odeme,     | | Veli mobil        | | Gelir/gider,    |
|  | aidat takibi,     | | erisim, cocuk     | | sporcu gelisim, |
|  | hatirlatma        | | gelisim takibi    | | trend analiz    |
|  +-------------------+ +-------------------+ +-----------------+
|                                                                 |
+================================================================+
```

**Detay:**
- Grid: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
- Kart: `bg-zinc-900 border border-zinc-800 rounded-2xl p-6`
- Ikon: `w-10 h-10 text-cyan-400 mb-4` (lucide-react)
- Baslik: `text-lg font-semibold text-white`
- Aciklama: `text-sm text-zinc-400 mt-2`
- Hover: `hover:border-cyan-400/30 hover:shadow-[0_0_15px_rgba(34,211,238,0.05)]`

**6 Kart Icerigi:**
1. **AI Destekli Yonetim** — Brain icon — "4 AI robotu ile akilli gorev dagitimi ve otomasyon"
2. **Guvenli Altyapi** — Shield icon — "3 katmanli siber guvenlik, RLS, RBAC erisim kontrolu"
3. **Ders Programi Otomasyonu** — Calendar icon — "Haftalik/aylik takvim, catisma kontrolu, otomatik planlama"
4. **Dijital Kredi Sistemi** — CreditCard icon — "Online odeme, aidat takibi, otomatik hatirlatma"
5. **Veli Paneli** — Users icon — "Veli mobil erisim, cocuk gelisim takibi, mesajlasma"
6. **Raporlama** — BarChart icon — "Gelir/gider analizi, sporcu gelisim grafikleri, trend raporlari"

**Mobil:** 1 kolon, kartlar full-width, dikey scroll

---

### B3. DERS PROGRAMI (Bolum 3 — Tablo)

```
+================================================================+
| BOLUM 3: DERS PROGRAMI                          [100vh snap]  |
|================================================================|
|                                                                 |
|      "Ders Programi" text-4xl font-bold text-white            |
|      "Haftalik program gorunumu" text-zinc-400                 |
|                                                                 |
|  +------------------------------------------------------------+|
|  | Saat  | Pzt      | Sal      | Car      | Per      | Cum   ||
|  |-------|----------|----------|----------|----------|-------||
|  | 09:00 | Jimnast. |          | Jimnast. |          |       ||
|  |       | [cyan]   |          | [cyan]   |          |       ||
|  | 10:00 |          | Yuzme    |          | Yuzme    |       ||
|  |       |          | [orange] |          | [orange] |       ||
|  | 11:00 | Futbol   | Futbol   |          | Futbol   | Futb. ||
|  |       | [green]  | [green]  |          | [green]  | [grn] ||
|  | 14:00 | Basketb. |          | Basketb. |          | Bask. ||
|  |       | [purple] |          | [purple] |          | [pur] ||
|  | 15:00 |          | Atletizm |          | Atletizm |       ||
|  |       |          | [amber]  |          | [amber]  |       ||
|  | 16:00 | Tenis    |          | Tenis    |          | Tenis ||
|  |       | [pink]   |          | [pink]   |          | [pnk] ||
|  +------------------------------------------------------------+|
|                                                                 |
|  [< Onceki Hafta]                        [Sonraki Hafta >]    |
|                                                                 |
+================================================================+
```

**Detay:**
- Tablo: `bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800`
- Baslik satiri: `bg-zinc-800 text-zinc-300 text-sm font-medium`
- Hucre: `p-3 border-b border-zinc-800`
- Brans renkleri: Her brans kendi accent rengiyle isaretli (`bg-cyan-400/10 text-cyan-400` vb.)
- Navigasyon: Hafta ileri/geri butonlari (ghost buton stili)

**Mobil:** Yatay scroll, sadece 3 gun gorunur, swipe ile kaydirma

---

### B4. PANELLER (Bolum 4 — 3 Kart: Veli / Sporcu / Antrenor)

```
+================================================================+
| BOLUM 4: PANELLER                                [100vh snap]  |
|================================================================|
|                                                                 |
|    "Her Kullanici Icin Ozel Panel" text-4xl font-bold         |
|    "Rola ozel arayuzler" text-zinc-400                         |
|                                                                 |
|  +------------------+ +------------------+ +------------------+|
|  |    [Heart icon]  | | [Trophy icon]    | | [Whistle icon]   ||
|  |                  | |                  | |                  ||
|  |   VELI PANELI    | |  SPORCU PANELI   | | ANTRENOR PANELI  ||
|  |                  | |                  | |                  ||
|  | +- Cocuk bilgi   | | +- Ders takvimi  | | +- Sporcu liste  ||
|  | +- Gelisim graf. | | +- Antrenor msg  | | +- Yoklama al   ||
|  | +- Aidat durum   | | +- Gelisim graf. | | +- Olcum kaydi  ||
|  | +- Mesajlasma    | | +- Yoklama       | | +- Grup yonet.  ||
|  | +- Duyurular     | | +- Kredi bakiye  | | +- Gelisim rap. ||
|  |                  | |                  | |                  ||
|  | [Panele Git →]   | | [Panele Git →]   | | [Panele Git →]  ||
|  +------------------+ +------------------+ +------------------+|
|                                                                 |
+================================================================+
```

**Detay:**
- Grid: `grid grid-cols-1 md:grid-cols-3 gap-6`
- Kart: `bg-zinc-900 border border-zinc-800 rounded-2xl p-8`
- Ikon: `w-12 h-12 text-cyan-400 mb-6` (merkezi)
- Baslik: `text-xl font-semibold text-white text-center mb-4`
- Liste: `text-sm text-zinc-400` — her madde onunde `+` isareti
- CTA: `text-cyan-400 text-sm font-medium` — sag ok ile

**Mobil:** 1 kolon, kartlar full-width

---

### B5. BRANSLAR (Bolum 5 — 6 Kart)

```
+================================================================+
| BOLUM 5: BRANSLAR                                [100vh snap]  |
|================================================================|
|                                                                 |
|       "Spor Branslari" text-4xl font-bold text-white          |
|       "Desteklenen branslar" text-zinc-400                     |
|                                                                 |
|  +------------------+ +------------------+ +------------------+|
|  | [⚽ icon]        | | [🏊 icon]        | | [🏀 icon]       ||
|  |                  | |                  | |                  ||
|  |     FUTBOL       | |      YUZME       | |    BASKETBOL     ||
|  |                  | |                  | |                  ||
|  | 12 grup, 180     | | 8 grup, 96       | | 6 grup, 72       ||
|  | sporcu           | | sporcu           | | sporcu           ||
|  +------------------+ +------------------+ +------------------+|
|                                                                 |
|  +------------------+ +------------------+ +------------------+|
|  | [🤸 icon]        | | [🎾 icon]        | | [🏃 icon]       ||
|  |                  | |                  | |                  ||
|  |   JIMNASTIK      | |     TENIS        | |   ATLETIZM       ||
|  |                  | |                  | |                  ||
|  | 4 grup, 48       | | 6 grup, 36       | | 4 grup, 40       ||
|  | sporcu           | | sporcu           | | sporcu           ||
|  +------------------+ +------------------+ +------------------+|
|                                                                 |
+================================================================+
```

**Detay:**
- Grid: `grid grid-cols-2 md:grid-cols-3 gap-6`
- Kart: `bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center`
- Ikon: Brans ikonu — `w-12 h-12 mx-auto mb-4` (lucide: `Dribbble`, `Waves`, `Circle`, `PersonStanding`, `Target`, `Timer`)
- Baslik: `text-lg font-semibold text-white`
- Alt bilgi: `text-sm text-zinc-400 mt-2` — "X grup, Y sporcu"
- Hover: Kart kenarligi bransa ozel renk alir

**Mobil:** 2 kolon grid korunur, kucuk kartlar

---

### B6. KREDI SISTEMI (Bolum 6 — 3 Paket)

```
+================================================================+
| BOLUM 6: KREDI SISTEMI                          [100vh snap]  |
|================================================================|
|                                                                 |
|     "Dijital Kredi Sistemi" text-4xl font-bold text-white     |
|     "Esnek odeme ve paket secenekleri" text-zinc-400           |
|                                                                 |
|  +------------------+ +------------------+ +------------------+|
|  |                  | | ★ EN POPULER ★   | |                  ||
|  |  BASLANGIC       | |  STANDART        | |  PREMIUM         ||
|  |                  | |  [cyan border]   | |                  ||
|  |  ₺500 / ay      | |  ₺1.200 / ay     | |  ₺2.500 / ay    ||
|  |                  | |                  | |                  ||
|  | ✓ 50 sporcu      | | ✓ 150 sporcu     | | ✓ Sinirsiz       ||
|  | ✓ 3 brans        | | ✓ 8 brans        | | ✓ Tum branslar   ||
|  | ✓ Temel rapor    | | ✓ Gelismis rapor | | ✓ Ozel rapor     ||
|  | ✓ Veli panel     | | ✓ Veli + Ant.    | | ✓ Tam erisim     ||
|  | ✗ AI robotlari   | | ✓ 2 AI robot     | | ✓ 4 AI robot     ||
|  | ✗ Ozel destek    | | ✓ Email destek   | | ✓ 7/24 destek    ||
|  |                  | |                  | |                  ||
|  | [Secimi Yap]     | | [Secimi Yap]     | | [Secimi Yap]     ||
|  +------------------+ +------------------+ +------------------+|
|                                                                 |
+================================================================+
```

**Detay:**
- Grid: `grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch`
- Standart kart: `bg-zinc-900 border border-zinc-800 rounded-2xl p-8`
- Populer kart: `bg-zinc-900 border-2 border-cyan-400 rounded-2xl p-8 shadow-[0_0_30px_rgba(34,211,238,0.15)]` + ust badge
- Fiyat: `text-3xl font-bold text-white` + `text-sm text-zinc-400` (/ ay)
- Ozellik listesi: `text-sm` — `✓ text-emerald-400`, `✗ text-zinc-600`
- CTA: Birincil buton (populer), ikincil buton (diger)

**Mobil:** 1 kolon, populer kart en ustte

---

### B7. DIREKTORLUKLER (Bolum 7 — 12 Kart 4x3)

```
+================================================================+
| BOLUM 7: DIREKTORLUKLER                         [100vh snap]  |
|================================================================|
|                                                                 |
|   "12 Direktorluk" text-4xl font-bold text-white              |
|   "CELF Robotu altinda calisir" text-zinc-400                  |
|                                                                 |
|  +-----------+ +-----------+ +-----------+ +-----------+       |
|  | [Code]    | | [Wallet]  | | [Megaph.] | | [Palette] |       |
|  | CTO       | | CFO       | | CMO       | | CPO       |       |
|  | Teknik    | | Muhasebe  | | Pazarlama | | Tasarim   |       |
|  | #22d3ee   | | #34d399   | | #f97316   | | #e879f9   |       |
|  +-----------+ +-----------+ +-----------+ +-----------+       |
|                                                                 |
|  +-----------+ +-----------+ +-----------+ +-----------+       |
|  | [Settings]| | [Users]   | | [Scale]   | | [Medal]   |       |
|  | COO       | | CHRO      | | CLO       | | CSPO      |       |
|  | Operasyon | | IK        | | Hukuk     | | Spor Bil. |       |
|  | #fbbf24   | | #fb923c   | | #60a5fa   | | #4ade80   |       |
|  +-----------+ +-----------+ +-----------+ +-----------+       |
|                                                                 |
|  +-----------+ +-----------+ +-----------+ +-----------+       |
|  | [Headph.] | | [Lock]    | | [Database]| | [Compass] |       |
|  | CCO       | | CISO      | | CDO       | | CSO       |       |
|  | Musteri   | | Guvenlik  | | Veri      | | Strateji  |       |
|  | #f472b6   | | #ef4444   | | #818cf8   | | #2dd4bf   |       |
|  +-----------+ +-----------+ +-----------+ +-----------+       |
|                                                                 |
+================================================================+
```

**Detay:**
- Grid: `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4`
- Kart: `bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center`
- Ikon: `w-8 h-8 mb-2` — her direktorluge ozel renk
- Baslik: `text-sm font-semibold text-white`
- Alt baslik: `text-xs text-zinc-400`
- Ust kenarlik: `border-t-2` direktorluk rengiyle (her kart farkli)

**12 Direktorluk Renk Haritasi:**
| Direktorluk | Renk | HEX | Ikon |
|-------------|------|-----|------|
| CTO | Cyan | `#22d3ee` | Code |
| CFO | Emerald | `#34d399` | Wallet |
| CMO | Orange | `#f97316` | Megaphone |
| CPO | Fuchsia | `#e879f9` | Palette |
| COO | Amber | `#fbbf24` | Settings |
| CHRO | Orange-warm | `#fb923c` | Users |
| CLO | Blue | `#60a5fa` | Scale |
| CSPO | Green | `#4ade80` | Medal |
| CCO | Pink | `#f472b6` | Headphones |
| CISO | Red | `#ef4444` | Lock |
| CDO | Violet | `#818cf8` | Database |
| CSO | Teal | `#2dd4bf` | Compass |

**Mobil:** 2 kolon, kucuk kartlar (p-3)

---

### B8. AI ROBOTLARI (Bolum 8 — 4+2 Robot)

```
+================================================================+
| BOLUM 8: AI ROBOTLARI                           [100vh snap]  |
|================================================================|
|                                                                 |
|    "AI Robot Sistemi" text-4xl font-bold text-white            |
|    "4 ana robot + AI motorlari" text-zinc-400                  |
|                                                                 |
|  +-------------------------+ +-------------------------+       |
|  | [🔴 CELF ROBOTU]       | | [🔵 VERI ROBOTU]       |       |
|  | Claude Sonnet           | | Gemini                  |       |
|  | #e94560 kirmizi         | | #00d4ff cyan             |       |
|  |                         | |                         |       |
|  | "12 direktorluk         | | "Veri yonetimi,         |       |
|  |  orkestrasyonu,         | |  arsivleme, sablon      |       |
|  |  gorev dagitimi"        | |  kutuphanesi"           |       |
|  |                         | |                         |       |
|  | [Aktif ●]    340 gorev  | | [Aktif ●]    1.2TB     |       |
|  +-------------------------+ +-------------------------+       |
|                                                                 |
|  +-------------------------+ +-------------------------+       |
|  | [🟠 GUVENLIK ROBOTU]   | | [🟣 YiSA-S ROBOTU]    |       |
|  | GPT-4o                  | | GPT-4o-mini             |       |
|  | #ffa500 turuncu         | | #7b68ee mor             |       |
|  |                         | |                         |       |
|  | "3 Duvar sistemi,       | | "Franchise hizmetleri,  |       |
|  |  siber guvenlik,        | |  vitrin, sube            |       |
|  |  erisim kontrolu"       | |  yonetimi"              |       |
|  |                         | |                         |       |
|  | [Aktif ●]    99.9%      | | [Aktif ●]    85 sube   |       |
|  +-------------------------+ +-------------------------+       |
|                                                                 |
|  +----------+ +----------+ +----------+ +----------+          |
|  | Together | | Fal AI   | | Cursor   | | V0       |          |
|  | Ekonomik | | Gorsel   | | Kod      | | UI       |          |
|  +----------+ +----------+ +----------+ +----------+          |
|                                                                 |
+================================================================+
```

**Detay:**
- Ana robotlar: `grid grid-cols-1 md:grid-cols-2 gap-6`
- Robot kart: `bg-zinc-900 border rounded-2xl p-6` — sol kenarlik robot rengiyle `border-l-4`
- Robot ismi: `text-xl font-semibold` robot rengiyle
- AI motoru: `text-sm text-zinc-400`
- Aciklama: `text-sm text-zinc-300 mt-3`
- Durum: `flex items-center gap-2` — yesil dot + metrik
- Alt satir yardimci motorlar: `grid grid-cols-2 md:grid-cols-4 gap-4` kucuk kartlar

**4 Ana Robot:**
1. **CELF Robotu** — `#e94560` kirmizi — Claude Sonnet — 12 direktorluk orkestrasyonu
2. **Veri Robotu** — `#00d4ff` cyan — Gemini — Veri yonetimi, arsivleme
3. **Guvenlik Robotu** — `#ffa500` turuncu — GPT-4o — 3 Duvar, siber guvenlik
4. **YiSA-S Robotu** — `#7b68ee` mor — GPT-4o-mini — Franchise hizmetleri

**Yardimci Motorlar:** Together AI, Fal AI, Cursor, V0

**Mobil:** 1 kolon, ana robotlar full-width, yardimci 2 kolon

---

### B9. SUBE YONETIMI (Bolum 9 — Tab + KPI)

```
+================================================================+
| BOLUM 9: SUBE YONETIMI                          [100vh snap]  |
|================================================================|
|                                                                 |
|   "Sube Yonetimi" text-4xl font-bold text-white               |
|   "Franchise performans takibi" text-zinc-400                  |
|                                                                 |
|  [Genel Bakis] [Subeler] [Performans]  ← tab secimi           |
|  ━━━━━━━━━━━━━                                                 |
|                                                                 |
|  KPI KARTLARI (4lu grid):                                      |
|  +------------+ +------------+ +------------+ +------------+  |
|  | 12         | | 1.240      | | ₺148.000   | | %92        |  |
|  | Aktif Sube | | Toplam     | | Aylik      | | Yoklama    |  |
|  | [cyan]     | | Sporcu     | | Gelir      | | Orani      |  |
|  |  +2 bu ay  | |  +45 yeni  | |  +12% art. | |  -1% azal. |  |
|  +------------+ +------------+ +------------+ +------------+  |
|                                                                 |
|  SUBE LISTESI (tablo):                                         |
|  +------------------------------------------------------------+|
|  | Sube Adi    | Sporcu | Gelir     | Yoklama | Durum       ||
|  |-------------|--------|-----------|---------|-------------||
|  | BJK Tuzla   |   120  | ₺24.000  |   %95   | [● Aktif]   ||
|  | GS Kadikoy  |    98  | ₺19.600  |   %91   | [● Aktif]   ||
|  | FB Besiktas |    85  | ₺17.000  |   %88   | [● Aktif]   ||
|  | Demo Salon  |    15  | ₺3.000   |   %72   | [○ Demo]    ||
|  +------------------------------------------------------------+|
|                                                                 |
+================================================================+
```

**Detay:**
- Tab: `flex gap-1 bg-zinc-900 rounded-xl p-1` — aktif tab `bg-zinc-800 text-white`, pasif `text-zinc-400`
- KPI kart: `bg-zinc-900 border border-zinc-800 rounded-xl p-4`
- KPI deger: `text-2xl font-bold text-white`
- KPI etiket: `text-xs text-zinc-400`
- KPI degisim: `text-xs` — artis `text-emerald-400`, azalis `text-red-400`
- Tablo: `bg-zinc-900 rounded-xl overflow-hidden`
- Durum badge: `px-2 py-0.5 rounded-full text-xs` — Aktif `bg-emerald-400/10 text-emerald-400`, Demo `bg-amber-400/10 text-amber-400`

**Mobil:** KPI 2 kolon, tablo yatay scroll

---

### B10. SISTEM DURUMU (Bolum 10 — 4 Status)

```
+================================================================+
| BOLUM 10: SISTEM DURUMU                          [100vh snap]  |
|================================================================|
|                                                                 |
|    "Sistem Durumu" text-4xl font-bold text-white               |
|    "Canli platform metrikleri" text-zinc-400                   |
|                                                                 |
|  +-------------------------+ +-------------------------+       |
|  | SUPABASE                | | VERCEL                  |       |
|  | [● Aktif]               | | [● Aktif]               |       |
|  |                         | |                         |       |
|  | Uptime: 99.98%          | | Uptime: 99.95%          |       |
|  | Tablolar: 70+           | | Deploy: 3 repo          |       |
|  | RLS: Aktif              | | CDN: Global             |       |
|  | Son yedek: 2 saat once  | | Son deploy: 15dk once   |       |
|  +-------------------------+ +-------------------------+       |
|                                                                 |
|  +-------------------------+ +-------------------------+       |
|  | AI MOTORLARI            | | GUVENLIK                |       |
|  | [● Aktif]               | | [● Aktif]               |       |
|  |                         | |                         |       |
|  | Claude: ● Aktif         | | 3 Duvar: ● Aktif        |       |
|  | GPT-4o: ● Aktif         | | RLS: ● Aktif            |       |
|  | Gemini: ● Aktif         | | RBAC: ● Aktif           |       |
|  | Together: ● Aktif       | | Audit Log: ● Aktif      |       |
|  +-------------------------+ +-------------------------+       |
|                                                                 |
|  Son 24 Saat: ████████████████████░░ %92 basarili istek       |
|                                                                 |
+================================================================+
```

**Detay:**
- Grid: `grid grid-cols-1 md:grid-cols-2 gap-6`
- Kart: `bg-zinc-900 border border-zinc-800 rounded-2xl p-6`
- Baslik: `text-lg font-semibold text-white flex items-center gap-2`
- Durum dot: `w-2 h-2 rounded-full bg-emerald-400 animate-pulse`
- Metrikler: `text-sm text-zinc-400` — deger `text-white`
- Ilerleme cubugu: `bg-zinc-800 rounded-full h-2` icerisinde `bg-cyan-400`

**Mobil:** 1 kolon

---

### B11. FOOTER (Bolum 11 — Demo Form + Iletisim)

```
+================================================================+
| BOLUM 11: FOOTER                                 [100vh snap]  |
|================================================================|
|                                                                 |
|    "Hemen Baslayın" text-4xl font-bold text-white             |
|    "Ucretsiz demo talep edin" text-zinc-400                    |
|                                                                 |
|  +------------------------------------------------------------+|
|  |                    DEMO TALEP FORMU                        ||
|  |                                                            ||
|  |  [Ad Soyad          ]  [Telefon            ]              ||
|  |  [E-posta            ]  [Spor Okulu Adi     ]              ||
|  |  [Sehir      ▼]        [Ogrenci Sayisi  ▼]                ||
|  |                                                            ||
|  |  [Mesajiniz (opsiyonel)                                ]   ||
|  |                                                            ||
|  |                    [DEMO TALEP ET]                         ||
|  |                    (CTA birincil buton)                    ||
|  +------------------------------------------------------------+|
|                                                                 |
|  +------------------------------------------------------------+|
|  |  YiSA-S                | Hizli Linkler  | Iletisim         ||
|  |  AI Destekli Spor      | Neden YiSA-S   | info@yisa-s.com  ||
|  |  Okulu Yonetimi        | Branslar       | +90 XXX XXX XX   ||
|  |                        | Fiyatlar       | Istanbul, TR     ||
|  |  © 2026 YiSA-S         | Demo           |                  ||
|  |  Tum haklari saklidir  | Blog           | [Twitter] [IG]   ||
|  +------------------------------------------------------------+|
|                                                                 |
+================================================================+
```

**Detay:**
- Form container: `bg-zinc-900 border border-zinc-800 rounded-2xl p-8 max-w-2xl mx-auto`
- Input: `bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder:text-zinc-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400`
- Grid: `grid grid-cols-1 md:grid-cols-2 gap-4`
- CTA: Birincil buton, tam genislik `w-full`
- Footer alt: `border-t border-zinc-800 mt-12 pt-8` — 3 kolon grid
- Footer metin: `text-sm text-zinc-500`
- Sosyal ikonlar: `w-5 h-5 text-zinc-500 hover:text-cyan-400`

**Mobil:** Form 1 kolon, footer 1 kolon stack

---

## C. TEKNIK NOTLAR

### C1. Scroll-Snap Uygulamasi

```css
/* globals.css */
html {
  scroll-behavior: smooth;
}

.snap-container {
  height: 100vh;
  overflow-y: auto;
  scroll-snap-type: y mandatory;
  -webkit-overflow-scrolling: touch;
}

.snap-section {
  min-height: 100vh;
  scroll-snap-align: start;
  scroll-snap-stop: always;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

### C2. Navbar Scroll Gostergesi

```
Navbar'da aktif bolumu gosteren dot/indicator:
[●] Hero  [○] Neden  [○] Ders  [○] Panel  ... [○] Footer

IntersectionObserver ile aktif bolum tespit edilir.
Tiklaninca ilgili bolume smooth scroll yapilir.
```

### C3. Performans Kurallari

| Kural | Aciklama |
|-------|----------|
| **Lazy Load** | Her bolum `lazy` yuklenir (sadece gorunur olunca) |
| **Image Optimize** | Next.js `<Image>` ile optimize, WebP format |
| **Font Preload** | Inter fontu `preload` ile yuklenir |
| **CSS Minimize** | Kullanilmayan Tailwind siniflari `purge` edilir |
| **Animation** | `prefers-reduced-motion` kullanicilari icin animasyon kapatilir |

### C4. Dosya Yapisi (Onerilen)

```
app/
  page.tsx                    ← Ana sayfa (scroll-snap container)
  components/
    sections/
      HeroSection.tsx         ← B1
      NedenSection.tsx        ← B2
      DersProgramiSection.tsx ← B3
      PanellerSection.tsx     ← B4
      BranslarSection.tsx     ← B5
      KrediSection.tsx        ← B6
      DirektorlukSection.tsx  ← B7
      RobotlarSection.tsx     ← B8
      SubeSection.tsx         ← B9
      SistemSection.tsx       ← B10
      FooterSection.tsx       ← B11
    ui/
      Navbar.tsx              ← Sticky navbar + scroll indicator
      SectionWrapper.tsx      ← snap-start wrapper
      KPI-Card.tsx            ← Tekrar kullanilabilir KPI karti
      FeatureCard.tsx         ← Tekrar kullanilabilir ozellik karti
```

---

**Hazirlayan:** Devin AI — YiSA-S CART-CURT Modu
**Tarih:** 25 Subat 2026
**Durum:** Patron onayina hazir — iskelet + tasarim standartlari + 11 bolum wireframe
**Sonraki Adim:** Patron onayindan sonra V0/Cursor ile bilesenleri kodlamaya basla
