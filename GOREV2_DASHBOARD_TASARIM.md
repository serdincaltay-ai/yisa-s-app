# GÖREV 2 — Dashboard Tasarım (3 Versiyon)

**Tarih:** 30 Ocak 2026  
**İstek:** V0 + Cursor ile 3 farklı teknolojik dashboard şablonu, YİSA-S marka renkleri, asistan penceresi, dosya yükleme, takvim/ajanda/notlar, WhatsApp/Instagram entegrasyonu. **Otomatik deploy YOK**, sadece sunum.

---

## YİSA-S marka renkleri (mevcut)

| Kullanım | Değer | Açıklama |
|----------|------|----------|
| **Primary** | `#F59E0B` (amber-500) | Ana vurgu, butonlar, linkler |
| **Background** | `#0F172A` (slate-900) | Ana arka plan |
| **Metin** | `#F8FAFC` (slate-50) | Ana metin |
| **İkincil** | slate-400, slate-600 | İkincil metin, kartlar |

CSS: `app/globals.css` — `--primary`, `--background`. Tüm 3 versiyonda bu palet kullanılacak.

---

## İstenen özellikler (ortak)

- **Asistan robotu:** Büyütülebilir, küçültülebilir, sürüklenebilir sohbet penceresi.
- **Dosya yükleme:** Ses, video, resim, döküman (tek veya çoklu).
- **Takvim, saat, ajanda, notlar:** Görünür widget’lar.
- **WhatsApp, Instagram entegrasyonu:** Bağlantı / mesaj açma alanları (placeholder veya basit link).
- **3 versiyon:** Patron seçecek; otomatik deploy yapılmayacak.

---

## VERSİYON 1 — Kompakt tek sayfa (grid)

- **Layout:** Tek sayfa, üstte saat + takvim mini, ortada 2–3 kolon (ajanda | notlar | özet kartları), sağ altta sürüklenebilir asistan penceresi.
- **Asistan:** Köşede floating; sürükle, resize (min 320px, max 600px), minimize ile ikon küçülür.
- **Dosya:** Asistan içinde “Dosya ekle” butonu → ses/video/resim/döküman seçimi; önizleme listesi.
- **Entegrasyon:** Üst bar’da “WhatsApp” / “Instagram” ikonları → ilgili sayfa veya sohbet açılır.
- **Teknoloji:** Next.js + Tailwind, CSS Grid, state ile pozisyon/boyut.

---

## VERSİYON 2 — Sidebar + ana alan (split)

- **Layout:** Sol sabit sidebar (navigasyon, takvim mini, notlar listesi), sağda büyük ana alan (ajanda detay, raporlar, kartlar). Asistan sağ alt köşede floating; sürükle/resize/minimize.
- **Asistan:** Aynı davranış (sürükle, büyüt/küçült, minimize).
- **Dosya:** Asistan sohbetinde ek dosya alanı; yüklenenler liste halinde.
- **Entegrasyon:** Sidebar altında “WhatsApp / Instagram” linkleri.
- **Teknoloji:** Next.js + Tailwind, flex + fixed sidebar, aynı floating component.

---

## VERSİYON 3 — Modüler kartlar (dashboard tiles)

- **Layout:** Serbest grid; her blok (takvim, saat, ajanda, notlar, “son işlemler”, entegrasyonlar) ayrı sürüklenebilir/küçültülebilir kart. Asistan da bir “kart” gibi köşede; sürükle/resize/minimize.
- **Asistan:** Diğer kartlarla aynı grid mantığında ama her zaman üstte (z-index) ve sohbet + dosya yükleme destekli.
- **Dosya:** Asistan penceresinde; ses/video/resim/döküman.
- **Entegrasyon:** Ayrı bir “Sosyal / İletişim” kartı: WhatsApp, Instagram butonları.
- **Teknoloji:** Next.js + Tailwind, grid + drag (state veya basit kütüphane).

---

## Ortak bileşen: Asistan penceresi (iskelet)

- **Sürükleme:** Başlık çubuğundan (mousedown/mousemove/mouseup) pozisyon güncellenir.
- **Boyut:** Sağ alt köşeden resize handle veya sabit 3 boyut (küçük / orta / büyük) butonları; min/max genişlik-yükseklik sınırı.
- **Minimize:** Başlıkta buton → pencere küçülür (sadece başlık çubuğu veya köşede ikon); tıklayınca tekrar açılır.
- **Dosya yükleme:** Input type file (accept: audio/*, video/*, image/*, .pdf,.doc,.docx); liste ile önizleme (ileride API’ye gönderim eklenir).
- **Takvim / saat / ajanda / notlar:** Ayrı widget bileşenleri; her versiyonda farklı yerleşim.

Projede `app/components/FloatingAssistantChat.tsx` iskeleti eklendi; sürükle, resize (3 boyut), minimize ve dosya alanı placeholder’ı içerir. Gerçek sohbet API’si mevcut flow’a bağlanabilir.

---

## Sonraki adımlar (deploy YOK)

1. **Patron:** 3 versiyondan birini (veya karışımını) seçer.
2. Seçilen versiyona göre dashboard layout sayfası (veya route) netleştirilir.
3. Takvim/saat/ajanda/notlar için veri kaynağı (Supabase veya local state) ve WhatsApp/Instagram linkleri tanımlanır.
4. Deploy sadece Patron onayı ile yapılır.

---

**Döküman sonu.**
