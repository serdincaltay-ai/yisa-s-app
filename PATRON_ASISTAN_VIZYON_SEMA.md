# PATRON ASİSTAN SİSTEMİ — Anladığım Vizyon Şeması

**Patron:** Serdinç ALTAY (sistemde tek Patron; franchise firma sahipleri "firma sahibi / firma yetkilisi" — bkz. PATRON_VE_FRANCHISE_AYRIMI.md)  
**Tarih:** 30 Ocak 2026  
**Kaynak:** Patron tarafından sözlü anlatılan çalışma mantığı.

---

## 1. PATRON ASİSTANI — Pencere açıldığında kim konuşur?

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  PANEL AÇILIR  →  Benimle konuşan: PATRON ASİSTANI (tek robot, tek pencere)      │
│                                                                                 │
│  Bu robotun içinde TÜM AI’lar bir arada:                                        │
│  Gemini · Together · Claude · GPT · V0 · Cursor                                 │
│  GitHub · Vercel · Supabase · Railway                                            │
│                                                                                 │
│  Hepsi asistanımda toplanacak — tek yerden yönetim.                              │
│  Arkada hepsi Gemini'den görev bekler; karışmazlar.                              │
└─────────────────────────────────────────────────────────────────────────────────┘
```

**Önemli:** Dışarıya (size) **konuşan ağız = Gemini**. Komutu alan, soruları soran, sonucu getiren o. Arkada tüm API’ler (V0, Cursor, Gemini, Together, Claude, GPT, GitHub, Vercel, Supabase, Railway) aynı asistanın içinde; görevlendirmeyi Gemini yapar, onlar sadece görev bekler, karışmazlar.

---

## 2. ASİSTANIN ÇALIŞMA MANTIĞI — Adım adım

```
PATRON bir şey yazar / komut verir
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│  ADIM 1 — GEMİNİ ALIR                                                            │
│  Mesajı / komutu Gemini alır.                                                    │
└─────────────────────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│  ADIM 2 — İMLA DÜZELTME + ONAY SORUSU                                            │
│  "İmla hatalarını düzelttim. Düzelteyim mi? Düzeltilmiş hali: [metin].            │
│   Onaylıyorsanız onaya basın."                                                    │
│  Hemen yanında:  [ Özel iş ]  [ Şirket işi ]                                     │
└─────────────────────────────────────────────────────────────────────────────────┘
         │
         ├──────────────────────────┬─────────────────────────────────────────────┐
         ▼                          ▼                                             │
   ÖZEL İŞ                    ŞİRKET İŞİ                                          │
   (Patron kişisel)           (CELF / organizasyon)                              │
```

---

## 3. ÖZEL İŞ AKIŞI (Asistan kendi içinde halleder)

```
Özel iş seçildi
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│  GEMİNİ: Konu / iş tipine göre hangi AI’lar çalışacak? → GÖREVLENDİRİR           │
│                                                                                 │
│  · Tasarım      → Claude + V0 (şablon) + Cursor (kod düzenleme)                  │
│  · Kod / proje  → Claude + Cursor                                               │
│  · Araştırma    → Gemini / Together + Claude düzeltir                           │
│  · Danışma      → Claude (uzmanlık alanına göre)                                 │
│                                                                                 │
│  Mantık: "Bu konu şununla ilgili, şu AI’ler çalışacak" — görevlendirmeyi          │
│          Gemini yapar. Sonuç yine Gemini toplar.                                │
└─────────────────────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│  Sonuç PATRON’a döner:                                                           │
│  "Patron, özel işinizi bu şekilde hallettik."                                    │
│  (CELF’e GİTMEZ — hepsi asistan içinde.)                                         │
│  İstenirse: "Kaydet?" → patron_private_tasks vb.                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. ŞİRKET İŞİ AKIŞI (CELF devreye girer)

```
Şirket işi seçildi
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│  GEMİNİ: Konu alanı ne? → Claude (+ gerekirse Together) çağırır.                │
│  "Patronun istediği bu komutu CELF’te şöyle çalıştırabiliriz" önerisi.           │
│  İkisinin kararını alır → CEO’ya gönderir.                                       │
└─────────────────────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│  CEO                                                                             │
│  · Organizasyonu yapar                                                           │
│  · CELF motorunu çalıştırır  (CELF’i SADECE CEO çalıştırır)                       │
│  · Gelen komutları "10’a çıkart" gelir / gider — kendi veritabanı, rutin/        │
│    tek seferlik kayıt, takip.                                                   │
└─────────────────────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│  CELF (Beyin merkezi)                                                            │
│  · Direktörlükleri yöneten, işleyişleri takip eden bölüm; her zaman veritabanı   │
│    güncel bilgiye sahip; rutin işlerin takibini yapan aktif API’ler var.          │
│  · Asistandaki gibi TÜM API’ler CELF’te de var: Claude, GPT, Together, Gemini,   │
│    V0, Vercel, Cursor, GitHub, Supabase, Railway.                                │
│  · Direktörlükler (CFO, CTO, CMO, CLO, …) — hangi iş hangi direktörlük / hangi   │
│    API; görevlendirme CELF içinde (asistan mantığıyla).                          │
│  · Rutin işler: AR-GE, muhasebe, şablon, sosyal medya vb. — veritabanı güncel     │
│    kalır. CELF üretir/önerir; uygulama ayrı katmanda (COO, platform).            │
└─────────────────────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│  CELF çalışır → Sonucu CEO’ya verir → CEO Gemini’ye verir → GEMİNİ PATRON’A      │
│  sunar: "Bu işi böyle hazırladık. Onaylıyor musun?"                              │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. PATRON ONAY SEÇENEKLERİ (Şirket işi sonrası)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  Patron’a sunulan seçenekler:                                                     │
│                                                                                 │
│  · Onaylıyorum — Rutin iş      → CEO veritabanına rutin olarak kilitler,         │
│                                  CELF "bu artık rutin" der, COO’ya gider;        │
│                                  platformda (satış/franchise yapısı) ilgili      │
│                                  alanda "rutin iş olarak takip et" gibi.         │
│  · Onaylıyorum — Tek seferlik  → Sadece kayıt, rutin yapılmaz.                    │
│  · Düzeltmeye gönder           → Tekrar CELF’e gider, önerilere göre hazırlık,   │
│                                  yine Gemini → Patron onayı.                     │
│  · Asistan önerilerini söyle   → Öneri alınır, istenirse yine CELF’e gönderilir. │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 5b. ONAY SONRASI — Deploy / commit / veritabanı (Güvenlik robotu)

```
Patron onayladı (şirket işi — rutin veya tek seferlik)
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│  Deploy, commit, SQL vb. değişikliklerin komutu → GÜVENLİK ROBOTUNA gönderilir.  │
└─────────────────────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│  GÜVENLİK ROBOTU                                                                │
│  · İşlemi değerlendirir; uygun görürse bu işlemleri yapar.                       │
│  · Yapılan işleri, rutin değişiklik işlerini kaydeder.                           │
│  · Veritabanına güncelleme gönderir.                                             │
└─────────────────────────────────────────────────────────────────────────────────┘
```

Bu sayede deploy/commit/SQL gibi değişiklikler önce güvenlik robotundan geçer; onaylı işler kayıt altına alınır, veritabanı güncel tutulur.

---

## 6. CEO / COO / CELF — Rol özeti

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  CEO                                                                             │
│  · Komutlar gelir / gider; kendi veritabanı var, kendisi ulaşır.                                       │
│  · Komutları rutin veya tek seferlik kaydeder, işin devamını takip eder.          │
│  · CELF’i SADECE CEO çalıştırır.                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│  COO (Operasyon / Organizatör)                                                   │
│  · Rutin işleri platformda sunar, takip eder.                                    │
│  · Franchise’dan iş gelirse alır → CELF’e gönderir.                              │
│  · CELF değerlendirir, Patron’a sunulur; karar Patron’da. Sonrasında CEO        │
│    CELF’i yine çalıştırabilir.                                                   │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│  CELF                                                                            │
│  · Direktörlükleri yönetir, işleyişleri takip eder; veritabanı güncel bilgiye   │
│    sahip; rutin işlerin takibini yapan aktif API'ler (Claude, GPT, Together,    │
│    Gemini, V0, Vercel, Cursor, GitHub, Supabase, Railway) hep orada.            │
│  · Vitrin (sattığımız platform) kullanıcıları / franchise’ların gelişimini      │
│    destekleyecek iş de üretir (rutin iş olarak).                                  │
│  · Şirket rutin işleri: direktörlük robotlarını görevlendirir, aynı asistan      │
│    mantığı (tüm API’ler, uzmanlık alanları).                             │
│  · Sabit görev örneği: "Şablon + sosyal medya ekibi, firmamızla ilgili reklam     │
│    içeriği hazırla" — ilgili sistemden (franchise vb.) bilgi alır, şirket         │
│    mantığında çalışır.                                                           │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 7. TEK BAKIŞTA AKIŞ (Ne anladığım)

```
                    PATRON (yazar / komut verir)
                              │
                              ▼
                    ┌─────────────────────┐
                    │   GEMİNİ (ağız)     │  ← İmla düzelt, Özel/Şirket sor
                    │   Tüm AI’lar burada │
                    └─────────┬───────────┘
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
     ÖZEL İŞ                          ŞİRKET İŞİ
     Gemini → Claude/V0/              Gemini → Claude(+Together)
     Cursor/Together by               → CEO → CELF (tüm API'ler, direktörlükler)
     uzmanlık → Patron                → CEO → Gemini → PATRON ONAY
     (kaydet?)                        (Rutin/Tek/Düzelt/Öneri)
                                              │
                                              ▼
                                     Deploy/commit/SQL komutu → GÜVENLİK ROBOTU
                                     (uygunsa yapar, kaydeder, DB günceller)
                                              │
                                              ▼
                                     CEO DB + COO platform + rutin takip
```

---

## 8. API'LER SADECE 2 BÖLÜMDE (KİLİT KURAL)

- **API çağrısı yapılan yerler — sadece 2 bölüm:** (1) **Asistan içinde** — tüm API'ler, görevlendirmeyi Gemini yapar. (2) **CELF içinde** — tüm API'ler, direktörlükler için görevlendirme CELF yapar.
- **Diğer tüm yerlerde (CEO, COO, güvenlik, direktörlükler, veri robotu vb.) API yok.** Oralarda sadece: asistanın çalışmasından oluşan kurallar; CELF API'lerinin çalışmasından oluşan kurallar; sınırlı komutlar, robotlar, botlar; göreve tayin edilmiş / tarif edilmiş botlar çalışır.
- Bu kural, asistanlar konuşma zincirinin doğru çalışması için zorunludur. Kurulum bu kurala göre yapılır.

---

## 9. VİZYON ODAKLI ÇALIŞMA

Öneriler ve işler **tamamen vizyon doğrultusunda**. Vizyon:  
- Patron tek merkez; asistan (Gemini + tüm AI’lar) ona hizmet eder.  
- Özel iş asistan içinde kalır; şirket işi CELF ile organize edilir, Patron onayı ile rutin/tek seferlik kilitlenir.  
- CELF içi çalışma mantığı, Patron asistanındaki gibi: hangi iş hangi direktörlük / hangi API — en ergonomik şekilde **asistanlık (biz)** karar verir; kurulumu buna göre yaparız.
- **API'ler sadece Asistan + CELF;** diğer yerlerde sadece kurallar ve tayin edilmiş botlar.

---

**Bu belge, Patron’un anlattığı Patron Asistan + CELF + CEO/COO mantığının benim çıkardığım şemasıdır. Eksik veya yanlış varsa düzeltilir.**
