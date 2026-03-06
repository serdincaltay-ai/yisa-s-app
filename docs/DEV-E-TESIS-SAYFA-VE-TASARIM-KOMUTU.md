# Tesis Sayfa ve Tasarim Komutu — Dev'e Komut

> **Amac:** Her franchise/tesis icin web sayfasi olusturma standartlari. 3 sablon seviyesi, haftalik ders programi grid, paket fiyatlari, giris panelleri ve premium ozellikler.
>
> **Hedef tesisler:** bjktuzlacimnastik.yisa-s.com, feneratasehir.yisa-s.com (ve gelecekte eklenecek tum tesisler)

---

## 1. Uc Web Sitesi Sablonu

Her tesis icin 3 sablon seviyesi sunulur. Tesisin paketi hangisiyse o sablon uygulanir.

### 1.1 Standart Sablon (24 ders/ay paketi)

| Bolum | Icerik |
|-------|--------|
| **Hero** | Tesis adi + logo, slogan ("Spor ile Buyuyen Nesiller"), tek CTA butonu ("Kayit Ol") |
| **Hakkimizda** | Tesis tanitim metni (2-3 paragraf), konum bilgisi |
| **Branslar** | Sunulan spor branslari listesi (ikon + isim + kisa aciklama) |
| **Ders Programi** | Haftalik grid (Bolum 2'ye bak) |
| **Fiyatlar** | Paket fiyatlari tablosu (Bolum 3'e bak) |
| **Iletisim** | Adres, telefon, e-posta, harita (Google Maps embed) |
| **Footer** | YiSA-S logosu, sosyal medya linkleri, telif hakki |

**Ozellikler:** Statik icerik, temel SEO, mobil uyumlu, koyu tema (zinc-950 arka plan).

### 1.2 Orta Sablon (48 ders/ay paketi)

Standart sablondaki her sey + asagidakiler:

| Ek Bolum | Icerik |
|----------|--------|
| **Galeri** | Tesis fotograflari (slider/grid, 6-12 gorsel) |
| **Antrenorler** | Antrenor profil kartlari (foto, isim, brans, deneyim) |
| **Basari Hikayeleri** | Ogrenci/sporcu basari kartlari (foto, isim, basari, alinti) |
| **Duyurular** | Son 3-5 duyuru karti (tarih, baslik, ozet) |
| **SSS (FAQ)** | Sik sorulan sorular (accordion/acilir-kapanir) |

**Ozellikler:** Dinamik icerik (Supabase'den cekilir), gelismis SEO, animasyonlar.

### 1.3 Premium Sablon (60 ders/ay paketi)

Orta sablondaki her sey + asagidakiler:

| Ek Bolum | Icerik |
|----------|--------|
| **Robot Karsilama** | YiSA-S robotu ile canli sohbet (NeebChat/ManyChat entegrasyonu). Ziyaretci sorularina otomatik yanit, demo talep toplama. |
| **Randevu Sistemi** | Online randevu alma formu. Brans + gun + saat secimi, otomatik onay/red, takvim entegrasyonu. |
| **Canli Istatistikler** | Toplam ogrenci, aktif brans sayisi, haftalik ders sayisi (Supabase'den canli) |
| **Video Tanitim** | Hero veya ayri bolumdeki tanitim videosu (YouTube/Vimeo embed) |
| **Veli Yorumlari** | Veli/ogrenci yorumlari slider (yildiz puanlama + yorum metni) |

**Ozellikler:** AI robot entegrasyonu, randevu otomasyonu, canli veri, video, tam SEO + OG meta.

---

## 2. Ders Programi — Haftalik Grid

Tum sablonlarda ortak. Haftalik ders programi grid gorunumu:

### Grid Yapisi

```
         | PZT      | SAL      | CAR      | PER      | CUM      | CMT      | PAZ      |
---------|----------|----------|----------|----------|----------|----------|----------|
08:00    |          | Cimnast. |          | Cimnast. |          | Yuzme    |          |
09:00    | Yuzme    |          | Yuzme    |          | Yuzme    | Cimnast. |          |
10:00    | Cimnast. | Yuzme    | Cimnast. | Yuzme    | Cimnast. | Atletizm |          |
11:00    |          | Atletizm |          | Atletizm |          |          |          |
12:00    |          |          |          |          |          |          |          |
13:00    | Cimnast. |          | Cimnast. |          | Cimnast. |          |          |
14:00    | Yuzme    | Cimnast. | Yuzme    | Cimnast. | Yuzme    |          |          |
15:00    | Atletizm | Yuzme    | Atletizm | Yuzme    | Atletizm |          |          |
16:00    | Cimnast. | Atletizm | Cimnast. | Atletizm | Cimnast. |          |          |
17:00    | Yuzme    | Cimnast. | Yuzme    | Cimnast. |          |          |          |
18:00    |          | Yuzme    |          | Yuzme    |          |          |          |
19:00    |          |          |          |          |          |          |          |
```

### Renk Kodlama

| Brans | Tailwind Rengi | HEX | Hucre Stili |
|-------|---------------|-----|-------------|
| **Cimnastik** | `bg-cyan-500/20 text-cyan-400 border-cyan-500/30` | #22d3ee | Turkuaz ton |
| **Yuzme** | `bg-blue-500/20 text-blue-400 border-blue-500/30` | #3b82f6 | Mavi ton |
| **Atletizm** | `bg-orange-500/20 text-orange-400 border-orange-500/30` | #f97316 | Turuncu ton |
| **Jimnastik** | `bg-purple-500/20 text-purple-400 border-purple-500/30` | #a855f7 | Mor ton |
| **Bos** | `bg-zinc-900/50` | — | Koyu, bos hucre |

### Teknik Detaylar

- Satir yuksekligi: `h-12` (48px)
- Hucre: `rounded-lg p-2 text-xs font-medium`
- Hover: `hover:scale-105 transition-transform`
- Mobil: Yatay scroll (`overflow-x-auto`), sticky ilk sutun (saat)
- Veri kaynagi: `schedule` tablosu veya `api/franchise/schedule`

---

## 3. Paket Fiyatlari

3 paket, tum tesis sayfalari icin standart:

| Paket | Ders/Ay | Fiyat (TL) | Eski Fiyat | Aciklama |
|-------|---------|------------|------------|----------|
| **Standart** | 24 ders | **30.000** | — | Ayda 24 ders, temel takip |
| **Orta** | 48 ders | **52.800** | — | Ayda 48 ders, gelismis takip + galeri |
| **Premium** | 60 ders | **60.000** | — | Ayda 60 ders, AI robot + randevu + tam ozellik |

### Fiyat Kartlari Tasarimi

```
+---------------------------+  +---------------------------+  +---------------------------+
| STANDART                  |  | ORTA              [Populer]|  | PREMIUM           [En Iyi]|
| 24 ders/ay                |  | 48 ders/ay                |  | 60 ders/ay                |
|                           |  |                           |  |                           |
|      30.000 TL            |  |      52.800 TL            |  |      60.000 TL            |
|      /ay                  |  |      /ay                  |  |      /ay                  |
|                           |  |                           |  |                           |
| [v] 24 ders               |  | [v] 48 ders               |  | [v] 60 ders               |
| [v] Temel takip           |  | [v] Gelismis takip        |  | [v] Tam takip             |
| [v] Veli paneli           |  | [v] Veli paneli           |  | [v] Veli paneli           |
| [v] Yoklama               |  | [v] Yoklama               |  | [v] Yoklama               |
|                           |  | [v] Galeri                |  | [v] Galeri                |
|                           |  | [v] Antrenor profil       |  | [v] Antrenor profil       |
|                           |  | [v] Duyurular             |  | [v] Duyurular             |
|                           |  |                           |  | [v] AI Robot karsilama    |
|                           |  |                           |  | [v] Randevu sistemi       |
|                           |  |                           |  | [v] Canli istatistik      |
|                           |  |                           |  | [v] Video tanitim         |
|                           |  |                           |  |                           |
| [    Secim Yap    ]       |  | [    Secim Yap    ]       |  | [    Secim Yap    ]       |
+---------------------------+  +---------------------------+  +---------------------------+
```

**Tasarim:**
- Grid: `grid grid-cols-1 md:grid-cols-3 gap-6`
- Kart: `bg-zinc-900 border border-zinc-800 rounded-2xl p-8`
- Populer kart: `border-cyan-400/50 shadow-[0_0_20px_rgba(34,211,238,0.1)]` + "Populer" badge
- Premium kart: `border-orange-500/50 shadow-[0_0_20px_rgba(249,115,22,0.1)]` + "En Iyi" badge
- Fiyat: `text-4xl font-bold text-white`
- Ozellik listesi: `text-sm text-zinc-400` + `text-emerald-400` tik ikonu
- CTA: Birincil buton stili (gradient cyan)

---

## 4. Giris ve Paneller

Her tesis sayfasinda giris butonu bulunur. Girise tiklayinca ilgili panele yonlendirilir:

| Giris Tipi | URL | Yonlendirme |
|-----------|-----|-------------|
| Veli Girisi | `/veli/giris` | `/veli/dashboard` |
| Antrenor Girisi | `/auth/login` | `/antrenor` |
| Tesis Muduru | `/auth/login` | `/tesis` |
| Franchise Sahibi | `/auth/login` | `/franchise` |

**Giris Butonu Konumu:** Navbar sag ust (masaustu), hamburger menu icinde (mobil).

---

## 5. Logo Kullanimi

| Konum | Logo |
|-------|------|
| **Navbar (sol ust)** | Tesis logosu (varsa) VEYA YiSA-S logosu. Max yukseklik: 40px. |
| **Hero** | Tesis logosu buyuk (opsiyonel, sadece premium sablonda). |
| **Footer** | "Powered by YiSA-S" + kucuk YiSA-S logosu. |

**Kural:** Sayfada ayni logo 1 kez gorunur. Navbar'da logo varsa hero'da tekrar gosterilmez.

---

## 6. Premium Ozellikleri — Detay

### 6.1 Robot Karsilama

- **Entegrasyon:** NeebChat / ManyChat widget'i sayfa sag altina yerlestirilir.
- **Tetikleyici:** Sayfa yuklendiginde 3 saniye sonra otomatik acilir ("Merhaba! Size nasil yardimci olabilirim?").
- **Yetenekler:** SSS yanitlama, ders programi bilgisi, fiyat bilgisi, demo talep formu doldurtma.
- **Tasarim:** Koyu tema ile uyumlu (zinc-900 arka plan, cyan accent).

### 6.2 Randevu Sistemi

- **Form alanlari:** Brans secimi, tercih edilen gun(ler), tercih edilen saat araligi, veli adi, telefon, e-posta, cocuk adi + yasi.
- **Isleyis:** Form gonderildiginde `demo_requests` veya ayri `appointments` tablosuna kayit. Tesis yoneticisine bildirim. Otomatik e-posta onay/red.
- **Takvim:** Brans + gun + saat secimi icin mevcut ders programindan bos slotlar gosterilir.
- **UI:** Modal veya ayri sayfa (`/[tesis-slug]/randevu`). Koyu tema, kart icinde form alanlari.

---

## 7. Dev'e Verilecek Tek Komut (Kopyala-Yapistir)

TESIS WEB SAYFALARI — 3 sablon olustur (Standart/Orta/Premium). DERS PROGRAMI: Haftalik grid PZT–PAZ, 08:00–19:00, renkli hucreler (cimnastik=turkuaz, yuzme=mavi, atletizm=turuncu). FIYATLAR: Standart 24 ders 30.000 TL, Orta 48 ders 52.800 TL, Premium 60 ders 60.000 TL — 3 kart yan yana. GIRIS: Navbar'da giris butonu, roller gore yonlendirme. LOGO: 1 kez, navbar veya hero. PREMIUM: Robot karsilama (NeebChat widget, 3sn sonra acilir), randevu sistemi (brans+gun+saat secimi, otomatik bildirim). Hedef: bjktuzlacimnastik.yisa-s.com, feneratasehir.yisa-s.com. Tasarim: Koyu tema (zinc-950), kutucuk kartlar, cyan/orange accent, Inter font, lucide-react ikonlar.
