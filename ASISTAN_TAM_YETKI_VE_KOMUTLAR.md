# YİSA-S — Asistan Tam Yetki ve Patron Komutları

Bu belge: **Patron sadece asistanla (GPT) konuşur**, **ödeme nerede görünür**, **CIO → Claude → V0 → CELF** sırası ve **doğrudan talimatlar** (V0 çalıştır, Cursor çalıştır, şu direktöre yaptır, hatırlat) tek yerde toplar.

---

## 1. Genel kurgu

- **Patron** sadece **Dashboard chat** (asistan / GPT) ile konuşur. Tüm talimatlar buradan girer.
- **Asistan** tam yetki ile çalışır: Sizi dinler, CIO ile ilk hazırlığı yapar, CIO cevabını **kılavuz** ile birlikte verir; sonrasında Claude değerlendirir, V0 kod/tasarım işini yapar, CELF direktörleri (CFO, CTO, CSPO vb.) ilgili alanda çalışır.
- **Akış:** Patron → **GPT (asistan)** → **CIO** (strateji, kılavuz) → **Claude** (değerlendirme) → **V0** (kod/tasarım) → **CELF** (direktörlük). Tasarım/şablon işlerinde V0 ve CELF birlikte kullanılır.

---

## 2. Ödeme: Firma sahibi parayı gönderince nereye giriyor?

- **Onay Kuyruğu → Demo Talepleri** sekmesinde, **onayladığınız** (converted) talepler listelenir.
- Her satırda **Ödeme** sütunu vardır:
  - **Bekliyor:** Henüz ödeme kaydı yok.
  - **Ödeme alındı** butonu: Firma sahibi (örn. Merve Görmez) parayı gönderdiğinde bu butona tıklayın → ödeme kaydedilir (tarih otomatik).
  - **Ödendi:** Tutar ve tarih görünür (isterseniz tutarı sonradan API ile güncelleyebilirsiniz).

**Nerede görünecek:** Dashboard → **Onay Kuyruğu** → **Demo Talepleri** → Ödeme sütunu. Ödeme alındı = "Ödeme alındı" tıklandığında `demo_requests.payment_status = 'odendi'`, `payment_at` dolar; aynı satırda "Ödendi · [tutar] · [tarih]" görünür.

**Supabase:** `demo_requests` tablosuna `payment_status`, `payment_amount`, `payment_at`, `payment_notes` kolonları eklendi (migration: `20260203_demo_requests_payment.sql`). Bunu çalıştırdıktan sonra ödeme alanları kullanılır.

---

## 3. Patron doğrudan talimatları (asistan üzerinden)

Asistan (GPT) ile konuşurken aşağıdaki kalıplar **otomatik yönlendirme** yapar:

| Ne derseniz | Ne olur |
|-------------|---------|
| **"V0 çalıştır"**, **"V0'da şunu yap"**, **"V0 ile tasarım"** | Görev V0 tarafına iletilir (tasarım/kod). |
| **"Cursor çalıştır"**, **"Cursor'a gönder"** | Görev Cursor tarafına iletilir. |
| **"CELF çalıştır"**, **"CELF'e gönder"** | Normal CELF akışı (CIO/CEO/CELF) çalışır. |
| **"CFO'ya şunu yaptır"**, **"CTO'ya rapor hazırla"**, **"CSPO'ya 10 seviyeli sistem yap"** | İlgili **direktör** (CFO, CTO, CSPO vb.) seçilir; görev metni direktöre gider. |
| **"CFO'yu hatırlat"**, **"CTO'yu hatırlat"** | İlgili direktör için hatırlatma / bekleyen iş vurgulanır. |

- **Direktör kısaltmaları:** CFO, CTO, CIO, CMO, CHRO, CLO, CSO (satış), CPO, CDO, CISO, CCO, CSO_STRATEJI, CSPO.
- Örnek: *"CSPO'ya cimnastik için 10 seviyeli sporcu değerlendirme sistemi oluştur"* → CSPO direktörlüğü seçilir, görev metni "cimnastik için 10 seviyeli sporcu değerlendirme sistemi oluştur" olarak CELF'e gider.

---

## 4. CIO → Claude → V0 → CELF sırası

- **CIO:** İlk hazırlık; komutu analiz eder, hangi direktörlüğe gideceğine karar verir, **kılavuz** (strateji notları) ile birlikte cevap verir.
- **Claude:** CIO çıktısını değerlendirir (CELF içinde veya asistan katmanında).
- **V0:** Kod ve tasarım işleri (sayfa, şablon, UI); CPO/CTO direktörlükleri V0’ı kullanır.
- **CELF:** Her direktörlük (CFO, CTO, CSPO vb.) kendi alanında çalışır; prompt’lar o alanla sınırlıdır.

Şu an sistemde **tek giriş noktası** chat; mesaj önce CIO’dan geçer, Patron “X’e yaptır” derse direktör zorla seçilir, sonra CELF o direktörle çalışır.

---

## 5. Kurulumu asistanın yapması

- **Sistem kurulumu:** Patron asistanla konuşarak talimat verir (örn. “Şu görevlendirmeleri yap”, “Şurayı kur”). Asistan (CIO/CEO/CELF) bu talimatları işler; gerekirse V0, Cursor, CELF direktörleri tetiklenir.
- **“V0 çalıştır”, “Cursor çalıştır”, “CELF çalıştır”:** Bu komutlar chat’te tanınır ve ilgili birime yönlendirilir.
- **“Şu direktöre şunu yaptır”, “Şu direktörü hatırlat”:** Aynı şekilde tanınır; ilgili direktör seçilir veya hatırlatma akışına alınır.

Tüm bu işlemler **tek proje** (yisa-s-app) ve **tek chat** (Dashboard) üzerinden yürür; ayrı bir “asistan uygulaması” yok.

---

## 6. Özet

| Konu | Cevap |
|------|--------|
| Para nerede görünecek? | **Onay Kuyruğu → Demo Talepleri** → Ödeme sütunu; "Ödeme alındı" → Ödendi + tarih (ve istenirse tutar). |
| Patron kime konuşuyor? | Sadece **asistan (GPT)**; tüm talimatlar Dashboard chat’ten. |
| V0 / Cursor / CELF / direktör komutları | Chat’te **"V0 çalıştır"**, **"Cursor çalıştır"**, **"CELF çalıştır"**, **"CFO'ya ... yaptır"**, **"CTO'yu hatırlat"** gibi ifadeler tanınır ve ilgili birime/direktöre yönlendirilir. |
| CIO kılavuzu | CIO analizi strateji notları ile birlikte cevap verir (mevcut CIO çıktısı). |
| Kurulum | Patron asistanla konuşarak talimat verir; asistan CIO → Claude → V0 → CELF zincirini kullanır. |

Bu yapı ile asistan tam yetki ile çalışır; ödeme kaydı tek yerden (Demo Talepleri) yönetilir ve Patron sadece chat üzerinden komut verir.
