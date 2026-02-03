# Ne Yapıyoruz, Ne Satıyoruz — Tablo (ESP Tanıtım / Franchise Fuarları)

**Patron:** Serdinç ALTAY  
**Amaç:** Franchise fuarlarında tanıtım ve satış için tek sayfa özet — YiSA-S / ESP sisteminin ne olduğu, ne sattığımız, sattığımız paketin içinde neler olduğu.

---

## 1. YAPI ÖZETİ — Evet, Bu Şekilde

| Katman | Ne? |
|--------|-----|
| **Patron paneli** | Merkezden yönetim: merkez robot, CELF robot, eski YiSA sistemi, ESP tanıtım versiyonu. Hepsi tek panelden. |
| **ESP sisteminin tanıtım versiyonu** | Franchise fuarlarında tanıtacağımız ve satacağımız ürün. “Ne yapıyoruz, ne satıyoruz” bu tabloda. |
| **Franchise müşterisi** | Anlaştığımız kişi; kendi seçimlerini yapar (web, logo, şablonlar, tesis yönetimi). Seçim sonrası sistemde fiyatı görür. |
| **Tenant (tesis)** | Sattığımız paket açıldığında oluşan “birim”. İçine franchise firma sahibi, üyeler, antrenörler, temizlik personeli, tesisin tüm personeli girer. **Tenant’ı da patron panelinden yönetiriz.** |

**Kısa cevap:** Evet, yapı bu şekilde. Patron paneli → merkez robot + CELF + eski sistem + ESP tanıtım; fuarlarda ESP’yi satıyoruz; franchise müşterisi seçim yapıyor, fiyat sistemde görünüyor; tenant (tesis) oluşuyor, içine firma sahibi, üyeler, antrenörler, personel giriyor; tenant yönetimi yine patron panelinden.

---

## 2. NE YAPIYORUZ | NE SATIYORUZ | SATTIĞIMIZDA NE OLUYOR

| Ne yapıyoruz? | Ne satıyoruz? | Sattığımız şeyin içinde ne var? |
|---------------|---------------|----------------------------------|
| **Patron panelinden** merkez robotu, CELF robotu ve eski YiSA sistemini yönetiyoruz. | **ESP sisteminin tanıtım versiyonunu** — franchise fuarlarında tanıtım ve satış. | **Franchise müşterisi (firma sahibi)** anlaşır; **seçimlerini** yapar. |
| ESP’yi fuarlarda tanıtıp satıyoruz. | Paket: web sitesi, logo, şablonlar, tesis yönetimi vb. seçeneklerden oluşan **özelleştirilmiş sistem**. | **Sistemde fiyat** görünür (seçimlere göre canlı hesaplanır). |
| Franchise müşterisi ile anlaşınca **tenant (tesis)** açıyoruz. | Tenant = bir franchise birimi; içinde firma sahibi, üyeler, antrenörler, personel. | **Tenant’ın içine:** franchise firma sahibi girer, üyeler girer, antrenörler girer, temizlik personeli ve tesisin tüm personeli girer. |
| **Tenant’ı (tesisi) patron panelinden yönetiyoruz.** | Firma sahibi kendi panelinde tesisini/üyelerini/personelini görür; üst yönetim ve onay **Patron panelinde**. | **Tüm bu tenant yapısı** (kim girdi, roller, paket kullanımı) **patron panelinden** takip ve yönetilir. |

---

## 3. FRANCHISE MÜŞTERİSİ SEÇİMLERİ (Demo / Paket)

Franchise müşterisi anlaşınca şunları seçer (sistemde işaretler):

| Seçim | Açıklama |
|-------|----------|
| Web sitesi | Kendi web sitesi istiyor mu? |
| Logo | Logo hizmeti istiyor mu? |
| Hangi şablonlar? | Hangi şablonları (panel, rapor, tesis ekranı vb.) istiyor? |
| Tesis yönetimi | Hangi şablonlarla tesisini yönetmek istiyor? |
| Robot / asistan | Robot (CELF/merkez) kullanımı istiyor mu? Kota/limit ile. |
| Ek şube | İkinci şube varsa aynı mantık; ek giriş ücreti + toplam öğrenci kademesi. |

Seçimler yapıldıktan sonra **sistemde nihai fiyat** gösterilir (canlı fiyat: “bunu eklersen şu kadar artar” mantığı).

---

## 4. TENANT (TESİS) İÇİNDEKİLER — Kimler Girer?

| Rol | Açıklama |
|-----|----------|
| **Franchise firma sahibi** | Tenant’ı oluşturan / yöneten; kendi panelinde tesisini, gelirini, personelini görür. |
| **Üyeler** | Sporcu/veli vb.; tenant’a kayıtlı kullanıcılar. |
| **Antrenörler** | Tesisin antrenörleri; tenant’a atanır. |
| **Temizlik personeli** | Tesis personeli; tenant’a atanır. |
| **Tesisin tüm personeli** | Yönetici, resepsiyon, diğer roller; hepsi tenant altında. |

**Hepsi patron panelinden görülebilir ve gerekirse yönetilir** (franchise listesi → tenant seç → üyeler/personel/roller).

---

## 5. ÖZET CÜMLE (Fuarda Söylenecek)

- **Ne yapıyoruz?** Merkez robot, CELF robot ve eski YiSA sistemini tek patron panelinden yönetiyoruz; ESP’nin tanıtım versiyonunu franchise fuarlarında tanıtıp satıyoruz.
- **Ne satıyoruz?** ESP sisteminin franchise paketini: web, logo, şablonlar, tesis yönetimi, isteğe bağlı robot kotası. Müşteri seçimini yapar, sistemde fiyatı görür.
- **Sattığımız şeyin içinde ne var?** Anlaşılan franchise müşterisi için bir **tenant (tesis)** açılır; içine firma sahibi, üyeler, antrenörler, temizlik ve tüm personel girer; bu tenant yapısı **patron panelinden** yönetilir.

---

## 6. 3 GİRİŞ YERİ — Nereden, Nasıl Girilir?

| # | Kim | Nereden giriş? | Giriş sonrası |
|---|-----|----------------|---------------|
| **1** | **Patron (siz)** | **`/patron/login`** veya ana sayfa → Patron Paneli → **`/auth/login`** (Patron e-postası ile) | **`/dashboard`** — Komuta merkezi |
| **2** | **Franchise müşterisi** (site kurmak için seçim) | Demo onayı sonrası verilen link → **`/vitrin`** (giriş: **`/auth/login`**) | Web, logo, şablon, tesis yönetimi seçer; **canlı fiyat** görür |
| **3** | **Tenant (tesis)** — firma sahibi + antrenörler + personel | **`/auth/login`** (tek giriş) | Rolüne göre: **`/franchise`** (firma sahibi), **`/tesis`** (tesis müdürü), **`/antrenor`** (antrenör) |

**Detaylı adresler ve Beşiktaş Tuzla örneği:** `GIRIS_YOLLARI.md` dosyasına bakın.

---

## 7. FUAR GÖSTERİSİNDE SATTIĞIMIZ — Kısa Rehber

| Fuarda ne gösterilir / ne söylenir? | Nerede gösterilir? |
|-------------------------------------|---------------------|
| **Patron paneli** — Merkez robot, CELF, onay kuyruğu, franchise listesi | Siz **`/patron/login`** ile giriş yapıp **`/dashboard`** açarsınız; ekranda gösterirsiniz. |
| **Vitrin (seçim)** — Müşteri web, logo, şablon, tesis yönetimi seçer; fiyat canlı çıkar | **`/vitrin`** sayfası — tablet/ekranda açık; "İstediklerinizi işaretleyin, fiyat hemen görünür" denir. |
| **Tenant (tesis) paneli** — Firma sahibi ve personel girişi | "Anlaşınca size giriş bilgisi veriyoruz; aynı siteden **Giriş Yap** deyip kendi tesis panelinize düşüyorsunuz." Giriş: **`/auth/login`** → rolüne göre `/franchise`, `/tesis` veya `/antrenor`. |

**Örnek cümle (fuarda):** "Bizim sistemde 3 giriş var: Ben patron panelinden yönetiyorum; siz franchise müşterisi olarak vitrin sayfasından ne istediğinizi seçiyorsunuz, fiyat çıkıyor; tesis açıldıktan sonra siz ve personeliniz aynı girişten kendi panellerinize giriyorsunuz."

**Döküman sonu.**
