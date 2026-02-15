# YİSA-S — Kim Ne Yapar, Nasıl Girilir, Satış Akışı (Çalışma Şeması)

Bu dokümanda: **siz (Patron) ne yapacaksınız**, **firma sahibi nereden girecek**, **vitrin nasıl yönetilir**, **robotlar ne yapıyor** — mevcut koda göre tek yerde toplandı.

---

## 1. GİRİŞLER — Kim nereden girer, nereye gider?

| Kim | Giriş adresi | Giriş sonrası |
|-----|--------------|----------------|
| **Patron (siz)** | `/patron/login` veya `/auth/login` (Patron e-postası) | `/patron` (özet sayfa) → **「Komuta Merkezi」** ile **`/dashboard`** |
| **Franchise müşterisi** (henüz tesis yok; vitrinde seçim yapacak) | Sizin gönderdiğiniz link: **`/vitrin`** · Giriş: `/auth/login` (sizin verdiğiniz e-posta/şifre) | **`/vitrin`** — Web, logo, şablon, tesis yönetimi seçer; canlı fiyat görür; "Seçimleri gönder" der |
| **Firma sahibi** (tesis açıldıktan sonra) | **`/auth/login`** (rol: franchise / firma_sahibi) | **`/franchise`** — Tesis paneli (öğrenciler, antrenörler, aidat, COO mağazası vb.) |
| **Tesis müdürü / antrenör / personel** | **`/auth/login`** | Rolüne göre **`/tesis`** veya **`/antrenor`** |
| **Veli** | **`/auth/login`** | **`/veli`** |

**Not:** Patron e-postası `.env` içinde `NEXT_PUBLIC_PATRON_EMAIL` (varsayılan: serdincaltay@gmail.com). Bu e-posta ile giren tek kişi Patron sayılır.

---

## 2. PATRON PANELİ — Siz ne yapacaksınız, vitrini nereden yönetiyorsunuz?

### 2.1 Giriş ve ana merkez

1. **`/patron/login`** veya **`/auth/login`** (Patron e-postası) ile girin.
2. **`/patron`** açılır; burada **「Komuta Merkezi」** butonuna tıklayın → **`/dashboard`** (komuta merkezi).

### 2.2 Dashboard menüsü (sol sidebar)

| Menü | Sayfa | Ne yapar? |
|------|--------|-----------|
| **Ana Sayfa** | `/dashboard` | Chat (Patron asistan), özet bilgiler |
| **CELF Direktörlükleri** | `/dashboard/directors` | Direktörlük başlangıç görevleri |
| **Direktörler (Canlı)** | `/dashboard/robots` | Robotlar canlı |
| **Onay Kuyruğu** | `/dashboard/onay-kuyrugu` | **Patron komutları** (onayla/reddet) + **Demo talepleri** (vitrin/franchise talepleri) |
| **Franchise / Vitrin** | `/dashboard/franchises` | Açılmış franchise’lar (tenant listesi) |
| **Kasa Defteri** | `/dashboard/kasa-defteri` | Finans |
| **Şablonlar** | `/dashboard/sablonlar` | 66 direktörlük şablonu |
| **Raporlar** | `/dashboard/reports` | Raporlar |
| **Ayarlar** | `/dashboard/settings` | Güvenlik kilidi, Patron onayı ayarları |

### 2.3 Vitrini nasıl yönetiyorsunuz?

- **Vitrin sayfası:** Müşteri **`/vitrin`** sayfasına gidip seçim yapar (web, logo, şablon, tesis yönetimi, robot). Fiyat canlı hesaplanır (1.500 $ peşin + seçimlere göre artış). "Seçimleri gönder" deyince talep **`demo_requests`** tablosuna **source = vitrin** ile yazılır.
- **Sizin yönetiminiz:**  
  **Dashboard → Onay Kuyruğu** (`/dashboard/onay-kuyrugu`) → **「Demo Talepleri」** sekmesi.  
  Burada vitrinden (ve www/demo/fiyatlar kaynaklı) gelen talepleri görürsünüz. **Onayla** derseniz sistem otomatik **tenant** (tesis) oluşturur; **Reddet** derseniz talep reddedilir.
- **Franchise listesi:** **Dashboard → Franchise / Vitrin** (`/dashboard/franchises`) — Açılmış franchise’ları (tenant’ları) listeler.

Özet: **Vitrin = müşterinin seçim yaptığı sayfa (`/vitrin`). Sizin vitrin yönetiminiz = Onay Kuyruğu’ndaki Demo Talepleri + Franchise sayfası.**

---

## 3. SATIŞ AKIŞI — 1.500 $ peşin, firma sahibine nasıl satış yapılır?

### 3.1 Fiyat (vitrin sayfasında tanımlı)

- **Giriş ücreti (peşin):** 1.500 $ (sabit)  
- **Aylık baz:** 499 ₺/ay (kodda `AYLIK_BAZ`)  
- **Ek seçimler:** Logo (+800), şablon (0–700), tesis yönetimi (0–800), robot (+200 tek / +150 aylık) — vitrin sayfasında canlı hesaplanır.

### 3.2 Adımlar

1. **Müşteri vitrine gelir**  
   Sizin gönderdiğiniz link: **`/vitrin`**. (Giriş yapmadan da seçim yapıp form gönderebilir; kaynak yine `vitrin` olur.)

2. **Seçim yapar, "Seçimleri gönder" der**  
   Ad, e-posta, tesis türü (örn. Cimnastik) + seçimler (web, logo, şablon, tesis yönetimi, robot) ve hesaplanan **toplam tek seferlik** / **aylık** fiyat `notes` içinde kaydedilir. API: **POST /api/demo-requests** (source: `vitrin`).

3. **Siz Onay Kuyruğu’nda onaylarsınız**  
   **Dashboard → Onay Kuyruğu → Demo Talepleri** → İlgili talebi **Onayla**.  
   Sistem otomatik **tenant** (tesis) oluşturur; slug örn. `besiktas-tuzla-cimnastik-<id>`.

4. **Müşteriye ne verirsiniz?**  
   - Giriş bilgisi: e-posta + şifre (sizin oluşturup ileteceğiniz).  
   - **Firma sahibi girişi:** **`/auth/login`** → rol **franchise** / **firma_sahibi** ise **`/franchise`** (tesis paneli).  
   - Ödeme (1.500 $ peşin + seçime göre artış) sizin iş sürecinizde; uygulama şu an ödeme entegrasyonu yapmıyor.

5. **Firma sahibi tesis panelinde ne yapar?**  
   **`/franchise`**: Öğrenciler (sporcular), antrenörler, ders programı, aidat, yoklama, COO mağazası, pazarlama, personel, raporlar, ayarlar. Kendi tesisinin verilerini yönetir.

### 3.3 Üyeler (sporcular/veliler) nereye gidecek?

- **Firma sahibi / tesis müdürü** personel ve sporcular için **kullanıcı (e-posta + şifre)** oluşturur veya davet eder (şu anki yapı: auth + roller).  
- **Giriş adresi hep aynı:** **`/auth/login`**.  
- **Rol ne ise o panele gider:**  
  - **franchise / firma_sahibi** → `/franchise`  
  - **tesis_sahibi / isletme_muduru** → `/tesis`  
  - **antrenor** → `/antrenor`  
  - **veli** → `/veli`  

Yani: Firma sahibi, üyelerine ve personeline “şu adresten giriş yapın: [site]/auth/login” der; sistem rollere göre doğru paneli açar.

---

## 4. ROBOTLAR — Kim ne yapıyor? (Mevcut kod)

Hiyerarşi (`lib/robots/hierarchy.ts`) ve akışa göre:

| Katman | Robot / bileşen | Ne yapar? |
|--------|------------------|-----------|
| 0 | **PATRON** | Tek yetkili; komut verir; onay kuyruğu ve demo taleplerinde karar verir. |
| 1 | **PATRON ASİSTAN** | Chat’te komutu alır; özel işte doğrudan yanıt; şirket işinde CIO/CEO/CELF zincirini tetikler. |
| 2 | **CIO** | Komutu yorumlar, önceliklendirir, strateji uyarısı verir; “şirket işi” için CEO’ya gönderir. |
| 3 | **SİBER GÜVENLİK** | Yasaklı terim, Patron onayı gerektiren işlemleri engeller veya onaya sunar. |
| 4 | **VERİ ARŞİVLEME (Data robot)** | Görev sonucunu arşivler; şablon/çıktı saklama. |
| 5 | **CEO ORGANİZATÖR** | Kural tabanlı; AI yok; görevi direktörlüğe (CELF) dağıtır; ceo_tasks, patron_commands ile kayıt. |
| 6 | **YİSA-S CELF MERKEZ** | 13 direktörlük (CFO, CLO, CHRO, CMO, CTO, CSO, CSPO, COO, CMDO, CCO, CDO, CISO, CSPO); komuta göre ilgili direktörlük çalışır; şablon/rapor/kod üretir. |
| 7 | **COO YARDIMCI** | Operasyon koordinasyonu; franchise panelinde “COO mağazası” (ek robot/şablon satışı). |
| 8 | **YİSA-S VİTRİN** | Franchise hizmetleri; vitrin sayfası ve demo talebi akışı ile bağlantılı. |

**Akış özeti:** Patron chat’e yazar → Patron Asistan (imla/onay Patron’da atlanır) → CIO → CEO → CELF (direktörlük) → Sonuç Patron’a (direkt “tamamlandı” veya onay kuyruğu). Güvenlik robotu komut başında; arşiv robotu çıktıyı kaydeder.

---

## 5. MEVCUT DURUM — Ne çalışıyor, nerede test edilir?

| Özellik | Nerede | Durum |
|--------|--------|--------|
| Patron girişi | `/patron/login` veya `/auth/login` (Patron e-postası) | Çalışıyor → `/patron` → Komuta Merkezi → `/dashboard` |
| Vitrin (müşteri seçimi) | `/vitrin` | Çalışıyor; seçim + canlı fiyat; "Seçimleri gönder" → demo_requests (source=vitrin) |
| Vitrin yönetimi (siz) | `/dashboard/onay-kuyrugu` → Demo Talepleri | Çalışıyor; Onayla → tenant oluşur; Reddet → reddedilir |
| Franchise listesi | `/dashboard/franchises` | Açılmış franchise’ları listeler |
| Patron chat | `/dashboard` (ana sayfa) | Patron komutu doğrudan işlenir; onay/bekleyen iş engeli yok |
| 66 şablon | `/dashboard/sablonlar` | Liste, kategori filtresi, tıklayınca içerik (JSON) |
| Firma sahibi paneli | `/auth/login` (rol: franchise) → `/franchise` | Tesis paneli; öğrenci, antrenör, aidat, COO mağazası vb. |
| Demo talebi onayı | `/dashboard/onay-kuyrugu` → Demo Talepleri → Onayla | Tenant oluşturulur |

---

## 6. KISA YOL ÖZETİ — “Ne yapacağım, nereden?”

- **Patron giriş:** `/patron/login` veya `/auth/login` (Patron e-postası) → **Komuta Merkezi** → `/dashboard`.
- **Vitrini yönetmek:** **Dashboard → Onay Kuyruğu → Demo Talepleri** — vitrinden gelen talepleri burada onaylıyor veya reddediyorsunuz.
- **Franchise’ları görmek:** **Dashboard → Franchise / Vitrin** (`/dashboard/franchises`).
- **Firma sahibi girişi:** Müşteriye verdiğiniz e-posta/şifre ile **`/auth/login`** → rol franchise ise **`/franchise`** (tesis paneli).
- **Firma sahibi, üyelerine nereye gireceğini söyler:** Hep **`/auth/login`**; sistem rollere göre `/franchise`, `/tesis`, `/antrenor`, `/veli` açar.

Bu doküman, mevcut kod ve sayfalara göre “kim ne yapar, vitrin nereden yönetilir, firma sahibi nereden girer” sorularının tek yerde toplanmış halidir.
