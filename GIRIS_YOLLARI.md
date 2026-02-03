# 3 Giriş Yeri — Nereden, Nasıl Girilir?

**Patron:** Serdinç ALTAY  
**Amaç:** Patron paneli, franchise müşterisi vitrin (seçim) ve tenant (tesis) paneli için 3 giriş noktasının adresleri ve kullanımı.

---

## Özet: 3 Giriş Yeri

| # | Kim | Nereden giriş? | Giriş sonrası nereye gider? |
|---|-----|----------------|-----------------------------|
| **1** | **Patron (siz)** | Patron panel giriş sayfası | Dashboard (komuta merkezi) |
| **2** | **Franchise müşterisi** (henüz tesis oluşmamış; site kurmak için seçim yapacak) | Vitrin / seçim sayfası | Web, logo, şablon, tesis yönetimi seçer; fiyatı görür |
| **3** | **Tenant (tesis)** — franchise firma sahibi + antrenörler + personel | Tesis / franchise panel girişi | Kendi tesis paneli (üyeler, aidat, yoklama, personel) |

---

## 1. Patron paneli — Sizin girişiniz

**Kim:** Sadece siz (Serdinç ALTAY — Patron).

**Nereden giriş yapılır?**

- **Adres 1 (önerilen):**  
  **`/patron/login`**  
  Tam URL örnek: `https://app.yisa-s.com/patron/login` (canlı) veya `http://localhost:3000/patron/login` (yerel).

- **Adres 2:**  
  Ana sayfadaki **「Patron Paneli — Giriş」** butonu → **`/auth/login`**  
  Burada e-posta ve şifre ile giriş yaparsınız. Sistem sizi **Patron** e-postası ile tanırsa otomatik **Dashboard**’a yönlendirir.

**Giriş sonrası:**  
**`/dashboard`** — Komuta merkezi (robotlar, onay kuyruğu, franchise’lar, kasa defteri, şablonlar vb.).

**Not:** Patron e-postası `.env` içinde `NEXT_PUBLIC_PATRON_EMAIL` ile tanımlı (varsayılan: serdincaltay@gmail.com). Bu e-posta ile giren tek kişi **Patron** sayılır ve dashboard’a girebilir.

---

## 2. Franchise müşterisi — Vitrin (seçim) girişi

**Kim:** Anlaştığınız franchise müşterisi (örnek: Beşiktaş Tuzla Cimnastik Okulu). Henüz tenant (tesis) oluşturulmamış; sadece **site kurmak / paket seçmek** için ne istediğini seçecek.

**Ne yapacak?**  
Web sitesi ister mi, logo ister mi, hangi şablonları istiyor, tesis yönetimi için hangi şablonlar — bunları işaretleyecek. Sistem **canlı fiyat** gösterecek; seçimler bitince **nihai fiyat** görünecek.

**Nereden giriş yapılır?**

- **Vitrin (seçim) sayfası:**  
  **`/vitrin`**  
  Tam URL örnek: `https://app.yisa-s.com/vitrin` veya franchise alt alanında `https://franchise.yisa-s.com/vitrin`.

- **Nasıl gelir?**  
  1. **Demo talep** formu doldurulur (ana sayfa veya `/demo`).  
  2. Siz (Patron) demo talebini onaylarsınız.  
  3. Müşteriye e-posta ile **giriş bilgisi + vitrin linki** gönderilir: “Site kurmak için seçimlerinizi yapın: [link]”.  
  4. Müşteri bu linke tıklar; giriş yapıp **`/vitrin`** sayfasında web, logo, şablon, tesis yönetimi seçeneklerini işaretler ve fiyatı görür.

**Giriş:** Aynı **`/auth/login`** ekranı. Müşteriye verdiğiniz e-posta + şifre ile girer; rolü “franchise” (veya vitrin için atanmış rol) ise **vitrin** sayfasına yönlendirilir (tenant henüz yoksa).

**Özet:** Beşiktaş Tuzla Cimnastik Okulu gibi franchise müşterisi, **vitrin** sayfasına gelip “bizden çekmek istediği şeyleri” (web, logo, şablonlar, tesis yönetimi) seçer; sistemde fiyat görünür.

---

## 3. Tenant (tesis) paneli — Firma sahibi + personel girişi

**Kim:** Tenant (tesis) oluşturulduktan sonra:
- **Franchise firma sahibi** (Beşiktaş Tuzla’nın sahibi),
- **Antrenörler**,
- **Temizlik personeli**, resepsiyon, tesis müdürü vb. **tüm tesis personeli**.

**Ne yapacak?**  
Kendi tesislerinin panelinde: üyeler (sporcular), aidat, yoklama, personel listesi, ayarlar vb.

**Nereden giriş yapılır?**

- **Tek giriş adresi:**  
  **`/auth/login`**  
  (Ana sayfadaki “Giriş Yap” veya “Franchise / Tesis Girişi” benzeri linkler de bu sayfaya gider.)

- **Giriş sonrası rolüne göre yönlendirme:**

| Rol (sistemde) | Giriş sonrası sayfa |
|----------------|---------------------|
| **franchise** / **firma_sahibi** (Franchise Sahibi) | **`/franchise`** — Tesis genel paneli (firma sahibi görünümü) |
| **tesis_sahibi** / **isletme_muduru** (Tesis Sahibi / Tesis Müdürü) | **`/tesis`** — Tesis operasyon paneli |
| **antrenor** | **`/antrenor`** — Antrenör paneli |
| **veli** | **`/veli`** — Veli paneli |

**Özet:** Beşiktaş Tuzla Cimnastik Okulu tenant’ı oluşturulduktan sonra, firma sahibi ve tüm personel **aynı giriş sayfasından** (`/auth/login`) e-posta + şifre ile girer; sistem rollere göre **`/franchise`**, **`/tesis`** veya **`/antrenor`** sayfalarına yönlendirir.

---

## Örnek: Beşiktaş Tuzla Cimnastik Okulu

| Aşama | Kim | Nereden girer? | Ne yapar? |
|-------|-----|----------------|-----------|
| 1 | **Patron (siz)** | `/patron/login` veya `/auth/login` (Patron e-postası) | Dashboard’dan merkez robot, CELF, franchise’ları, onay kuyruğunu yönetirsiniz. |
| 2 | **Beşiktaş Tuzla (franchise müşterisi)** — henüz tesis yok | Demo onayı sonrası verdiğiniz link → **`/vitrin`** (giriş: `/auth/login`) | Web, logo, şablon, tesis yönetimi seçer; sistemde fiyatı görür. |
| 3 | **Beşiktaş Tuzla** — tesis (tenant) açıldıktan sonra | **`/auth/login`** | Firma sahibi → `/franchise`; antrenör/personel → `/tesis` veya `/antrenor`. Tüm tesis personeli buradan girer. |

---

## Mevcut mu?

| Giriş | Sayfa / Route | Durum |
|-------|----------------|-------|
| **1. Patron** | `/patron/login`, `/auth/login` → `/dashboard` | Var; Patron e-postası ile dashboard açılıyor. |
| **2. Franchise vitrin (seçim)** | `/vitrin` | Vitrin sayfası eklendi; seçimler (web, logo, şablon, tesis yönetimi) + canlı fiyat gösterilir. Giriş: `/auth/login` (franchise rolü veya demo linki). |
| **3. Tenant (tesis)** | `/auth/login` → rolüne göre `/franchise`, `/tesis`, `/antrenor` | Var; franchise/tesis_sahibi/antrenor rolleri ile ilgili sayfalara yönlendirme yapılıyor. |

**Döküman sonu.**
