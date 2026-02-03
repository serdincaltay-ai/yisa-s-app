# YİSA-S — Giriş Paneli, Şifre, Test ve İş Akışı Şeması

Bu belge: **Patron nereden hangi şifreyle girer**, **çalışıp çalışmadığı nasıl test edilir**, **fuarda satış → vitrin → firma sahibi paneli** akışı ve **tenant (Beşiktaş / Fenerbahçe) panellerinin nerede olduğu** tek yerde toplanmıştır.

---

## 1. PATRON GİRİŞ PANELİ — Nereden, hangi şifreyle?

### 1.1 Giriş adresi (URL)

| Ortam | Patron giriş sayfası |
|-------|----------------------|
| **Yerel** | `http://localhost:3000/patron/login` |
| **Canlı** | `https://[siteniz].com/patron/login` |

Alternatif: **`/auth/login`** — Aynı sitede genel giriş. Patron e-postası ile girerseniz yine **Dashboard**’a düşersiniz.

### 1.2 Hangi şifreyle giriyorsunuz?

- **Şifre Supabase Auth’da tanımlı.** Uygulama içinde sabit bir “patron şifresi” yok.
- **E-posta:** `.env` içindeki **`NEXT_PUBLIC_PATRON_EMAIL`** (varsayılan: `serdincaltay@gmail.com`). Bu e-posta ile giren tek kullanıcı **Patron** sayılır.
- **Şifre:** Bu e-postanın Supabase **Authentication → Users** bölümünde kayıtlı şifresi. İlk kez kullanıyorsanız:
  - Supabase Dashboard → **Authentication** → **Users** → bu e-postayı ekleyin ve şifre verin, **veya**
  - Uygulamada **Sign up** (/auth/login veya ilk kayıt) ile bu e-postayla hesap oluşturup şifre belirleyin.

Özet: **Patron girişi = Patron e-postası + Supabase’de o e-postaya tanımlı şifre.**

### 1.3 Giriş sonrası nereye gidiyorsunuz?

- **`/patron/login`** ile giriş → Doğrudan **`/dashboard`** (Komuta Merkezi).
- **`/auth/login`** ile Patron e-postasıyla giriş → Rol “patron” çözümlenir → **`/dashboard`**.

**`/patron`** sayfası sadece özet/landing; asıl merkez **`/dashboard`**. Dashboard’a gitmek için menüden veya **「Komuta Merkezi」** butonundan girilir.

### 1.4 Patron girişini test etmek

1. Tarayıcıda açın: `http://localhost:3000/patron/login` (veya canlı sitede `/patron/login`).
2. **E-posta:** `NEXT_PUBLIC_PATRON_EMAIL` ile aynı (örn. serdincaltay@gmail.com).
3. **Şifre:** Supabase Auth’da bu e-posta için tanımlı şifre.
4. Giriş yapın → **Dashboard** açılmalı (sol menüde Ana Sayfa, Onay Kuyruğu, Franchise / Vitrin, Şablonlar vb.).
5. Açılmıyorsa: Supabase **Authentication → Users**’da bu e-postanın var olduğunu ve **Email confirmed** olduğunu kontrol edin.

---

## 2. FUAR → SATIŞ → VİTRİN → FİRMA SAHİBİ PANELİ — Tam akış

Aşağıdaki akış, sizin tarif ettiğiniz fuar ve vitrin hikâyesine göre düzenlendi.

```
[FUAR] Birisi “YİSA-S’e başvurmak istiyorum” diyor
        ↓
  Siz: “yisa-s.com’a gir, başvur” veya form dolduruyor (www/demo/fiyatlar/vitrin)
        ↓
  Başvuru → demo_requests tablosuna düşer (source: www / demo / fiyatlar / vitrin)
        ↓
  SİZ (Patron): Dashboard → Onay Kuyruğu → “Demo Talepleri” sekmesinde görürsünüz
        ↓
  Telefon/irtibat: “Ne istiyorsunuz? Site, logo, şablon, öğrenci sayısı, kullanıcılar…”
        ↓
  Müşteriyi VİTRİN sayfasına yönlendirirsiniz
        ↓
  Müşteri: /vitrin → Web, logo, şablon, tesis yönetimi, robot seçer → “Seçimleri gönder”
        ↓
  Talep yine demo_requests’e düşer (source: vitrin), notes içinde seçimler + fiyat
        ↓
  SİZ: Onay Kuyruğu → Demo Talepleri → Bu talebi “Onayla”
        ↓
  Sistem: Tenant (tesis) otomatik oluşturulur (örn. “Beşiktaş Tuzla Cimnastik”)
        ↓
  Ödeme: 1.500 $ peşin + seçime göre (sizin iş sürecinizde tamamlanır)
        ↓
  Müşteriye kullanıcı adı + şifre verirsiniz (Supabase’de bu e-posta ile kullanıcı olmalı)
        ↓
  FİRMA SAHİBİ GİRİŞİ: Aynı site → /auth/login → E-posta + şifre → Rol “franchise” ise /franchise (tesis paneli)
```

### 2.1 Vitrin sayfası (firma sahibi seçim yapıyor)

- **Adres:** `https://[siteniz].com/vitrin` (veya yerel: `http://localhost:3000/vitrin`).
- **Ne yapar:** Site istiyorum, logo istiyorum, şu şablon, şu yönetim, şu kadar öğrenci kapasitesi, robot eklesin gibi seçimler + canlı fiyat (1.500 $ peşin + ekler).
- **Gönder:** “Seçimleri gönder” → **POST /api/demo-requests** (source: vitrin) → Kayıt **demo_requests**’e yazılır.

### 2.2 Sizin vitrin/franchise yönetiminiz

- **Nereden:** **Dashboard → Onay Kuyruğu** → **「Demo Talepleri」** sekmesi.
- **Ne görürsünüz:** Tüm demo talepleri (www, demo, fiyatlar, vitrin). Ad, e-posta, tesis türü, şehir, **kaynak (source)**, tarih, durum.
- **Onayla:** O satır için “Onayla” → Sistem **tenant** oluşturur (ad + şehir ile isim, slug üretir). E-posta zaten Supabase Auth’da varsa bu kullanıcı tenant’a **owner** olarak bağlanır.
- **Reddet:** Talep reddedilir.

### 2.3 Firma sahibi paneli — Nerede, nasıl giriyor?

- **Giriş adresi:** **Aynı sitenin** **`/auth/login`** sayfası. Örnek: `https://[siteniz].com/auth/login`.
- **Kullanıcı adı:** Firma sahibine verdiğiniz **e-posta**.
- **Şifre:** Sizin/Supabase’de o e-posta için tanımladığınız şifre (veya davet ile kendisinin belirlediği).
- **Giriş sonrası:** Rol **franchise** / **firma_sahibi** ise otomatik **`/franchise`** (Franchise Paneli — tesis paneli) açılır.

Yani: **Firma sahibi, Tuzla Beşiktaş Jimnastik paneli = aynı uygulama, aynı domain, `/auth/login` → giriş → `/franchise`.** Farklı bir “Beşiktaş’a özel URL” yok; rol ve tenant ilişkisiyle aynı girişten kendi tesisine düşer.

### 2.4 Tenant (Beşiktaş, Fenerbahçe vb.) nerede oluşuyor?

- **Oluşturma:** Siz Onay Kuyruğu’nda demo talebini **Onayla** dediğinizde, kod **tenants** tablosuna bir kayıt ekler (ad, name, slug, durum: aktif). Slug örn. `besiktas-tuzla-cimnastik-abc12345`.
- **Nerede görünür:** **Dashboard → Franchise / Vitrin** (`/dashboard/franchises`). Bu sayfa **tenants** (veya franchises/organizations) listesini çeker; her satır bir tesis (Beşiktaş, Fenerbahçe vb.).
- **Firma sahibi:** Aynı sitede `/auth/login` ile girer; hesabı hangi tenant’a **owner** olarak bağlıysa, o tenant’ın verilerini **/franchise** panelinde görür (öğrenciler, antrenörler, aidat, COO mağazası vb.).

---

## 3. CELF / COO — Komut akışı, firma sahibine kullanıcılar ve sözleşmeler

### 3.1 Komut akışı (CELF motoru)

- **Patron** Dashboard’da chat’e yazar (komut).
- **Patron Asistan** → İmla/onay (Patron’da atlanır) → **CIO** (strateji/öncelik) → **CEO** (görev dağıtımı) → **CELF** (13 direktörlük: CFO, CLO, CHRO, CMO, CTO, CSO, CSPO, COO, CMDO, CCO, CDO, CISO).
- CELF ilgili direktörlüğü çalıştırır (şablon, rapor, kod vb.); sonuç Patron’a **direkt tamamlandı** veya **onay kuyruğu** ile döner.

### 3.2 COO robotu ve firma sahibi paneli

- **COO:** Operasyon / franchise tarafında tanımlı. Firma sahibi **/franchise** panelinde “COO mağazası”ndan ek hizmet/robot alımı yapabilir (kodda mock listeler var).
- **Tesis müdürü, temizlik personeli, 4 antrenör vb.:** Bunlar **kullanıcı (auth)** olarak sizin veya firma sahibinin oluşturması gereken hesaplar. Uygulama: **auth.users** + **user_tenants** (tenant_id, role: owner/admin/manager/trainer/staff/viewer). Firma sahibi kendi panelinde personel ekleyip rol atayabilir (uygulama bu CRUD’ı destekliyorsa). CELF/İK tarafında “sözleşme üret” gibi çıktılar şu an **onay kuyruğu / CELF çıktısı** olarak Patron’a gelir; istenirse ileride tenant paneline (firma sahibine) otomatik düşecek bir akış eklenebilir.

### 3.3 Firma sahibinin kullanıcı açması

- **Nerede:** Firma sahibi **/franchise** panelinde (personel, öğrenci ekleme vb.) kullanıcı oluşturma/davet akışı varsa oradan.
- **Şu an:** Tenant onaylandığında, demo_requests’teki **e-posta** zaten **auth.users**’da varsa otomatik **owner** yapılıyor. Diğer personel (tesis müdürü, antrenör) için ayrı auth kullanıcısı + **user_tenants** ile tenant’a bağlama gerekir; bu kısım kullanıcı yönetimi sayfalarına bağlı.

---

## 4. PATRON VERİYİ NEREDE GÖZLEMLİYOR?

| Ne | Nerede |
|----|--------|
| Demo / vitrin talepleri | **Dashboard → Onay Kuyruğu → Demo Talepleri** |
| Açılmış franchise’lar (Beşiktaş, Fenerbahçe vb.) | **Dashboard → Franchise / Vitrin** (`/dashboard/franchises`) — tenants listesi |
| Patron komutları / CELF çıktıları | **Dashboard → Onay Kuyruğu** (Patron Komutları sekmesi) ve **Dashboard ana sayfa** (chat) |
| Şablonlar (66 direktörlük şablonu) | **Dashboard → Şablonlar** (`/dashboard/sablonlar`) |
| Tek tıkla “bu tenant’ın verisi”: | Şu an **Franchise / Vitrin** sayfasında liste var; tek tenant detayı **/dashboard/franchises/[id]** ile açılabilir (varsa). İleride “tek tuşla bu tesisin özeti” genişletilebilir. |

---

## 5. VELİ VE ŞABLONLAR

- **Veli girişi:** **`/auth/login`** → Rol **veli** ise **`/veli`**.
- **Şablonlar:** **Dashboard → Şablonlar** — 66 şablon (kategori: CFO, CLO, CHRO, …). Hangi çocukların hangi değerlendirme/grafik şablonlarıyla işleneceği, tenant (firma) bazında kullanım ile genişletilebilir; şu an şablon havuzu burada.

---

## 6. ÖZET TABLO — Kim nereye hangi şifreyle giriyor?

| Kim | Giriş sayfası | Kullanıcı / şifre | Giriş sonrası |
|-----|----------------|--------------------|----------------|
| **Patron (siz)** | `/patron/login` veya `/auth/login` | Patron e-postası (NEXT_PUBLIC_PATRON_EMAIL) + Supabase Auth şifresi | `/dashboard` |
| **Franchise (firma sahibi)** | `/auth/login` | Sizin verdiğiniz e-posta + şifre (Supabase’de tanımlı) | `/franchise` (tesis paneli) |
| **Tesis müdürü / antrenör** | `/auth/login` | Tenant’a bağlı kullanıcı + şifre | `/tesis` veya `/antrenor` |
| **Veli** | `/auth/login` | Veli hesabı + şifre | `/veli` |

---

## 7. TEST LİSTESİ (Patron girişi ve akış)

1. **Patron girişi**
   - `http://localhost:3000/patron/login` aç.
   - Patron e-postası + Supabase’deki şifre ile girin → Dashboard açılmalı.
2. **Vitrin**
   - `http://localhost:3000/vitrin` aç → Seçim yap → “Seçimleri gönder” → Demo Talepleri’nde (source: vitrin) görünmeli.
3. **Vitrin yönetimi**
   - Dashboard → Onay Kuyruğu → Demo Talepleri → Bir talebi Onayla → Tenants’ta yeni kayıt oluşmalı.
4. **Franchise listesi**
   - Dashboard → Franchise / Vitrin → Onaylanan tenant’lar listelenmeli.
5. **Firma sahibi girişi**
   - Demo’da kullandığınız e-posta Supabase Auth’da varsa, o e-postayla `/auth/login` → rol franchise ise `/franchise` açılmalı.

---

## 8. SİZİN İSTEDİĞİNİZ vs MEVCUT DURUM

- **İstediğiniz:** Fuarda “yisa-s.com, başvur” → başvuru size gelsin → iletişim → vitrinde seçim → ödeme → kullanıcı/şifre → firma sahibi kendi paneline girsin (Beşiktaş/Fenerbahçe vb.); CELF/COO’dan tesis müdürü, antrenör, sözleşmeler; patron hepsini gözlemlesin.
- **Mevcut:** Başvuru **demo_requests** (www/demo/fiyatlar/vitrin), siz **Onay Kuyruğu → Demo Talepleri**’nde onaylıyorsunuz → **tenant** otomatik oluşuyor. Firma sahibi **aynı site, /auth/login**, franchise rolü ile **/franchise** panele giriyor. Tenant listesi **Franchise / Vitrin**’de. CELF komut akışı ve şablonlar çalışıyor; COO mağazası franchise panelinde var. **Eksik / kısmen olan:** Firma sahibine otomatik “tesis müdürü / 4 antrenör” kullanıcılarının CELF/COO tarafından tek tıkla açılması, sözleşmelerin doğrudan tenant paneline inmesi ve patronun “tek tuşla bu tesisin tüm verisi” ekranı — bunlar isteğe göre sonraki adımlarda rafine edilebilir.

Bu belge, giriş paneli (nereden, hangi şifre), test ve fuar→vitrin→firma sahibi paneli iş akışını tek şemada toplar. Güncellemek istediğiniz bir adım olursa söylemeniz yeterli.
