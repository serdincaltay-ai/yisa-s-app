# YİSA-S — Hepsini Uygula + Vitrin → Firma Sahibi Test Senaryosu

Bu belge: **tüm SQL'leri sırayla uygulama** ve **tek bir gerçek senaryoyu baştan sona test etme** adımlarını içerir.

---

## A. TÜM SQL'LERİ UYGULAMA (Supabase SQL Editor)

Aşağıdaki dosyaları **sırayla** Supabase Dashboard → **SQL Editor** → Yapıştır → **Run** yapın. Daha önce çalıştırdıklarınızı atlayıp bir sonrakinden devam edebilirsiniz.

| Sıra | Dosya | Ne yapar |
|------|--------|----------|
| 1 | `supabase/YENI_MIGRASYONLAR_TEK_SQL.sql` | Tablolar (tenants, user_tenants, demo_requests, athletes, …) + **vitrin kuralı** (demo_requests.source = 'vitrin' kabul) |
| 2 | `supabase/migrations/20260203_ceo_templates_ve_sablonlar.sql` | ceo_templates tablosu (ad, kategori, icerik, durum, olusturan) |
| 3 | `supabase/SABLONLAR_TEK_SQL.sql` | 66 şablon INSERT |
| 4 | `supabase/migrations/20260203_patron_commands_komut_sonuc_durum.sql` | patron_commands: komut, sonuc, durum, completed_at |
| 5 | `supabase/migrations/20260203_demo_requests_payment.sql` | demo_requests: ödeme alanları |
| 6 | `supabase/VITRIN_TEK_SQL.sql` | Sadece vitrin kuralı (1’i çalıştırdıysanız **atlayın**; 1’de zaten var) |

**Vitrin kuralı nedir?**  
`demo_requests` tablosunda `source` sütunu sadece `'www'`, `'demo'`, `'fiyatlar'` ile sınırlıysa, `/vitrin` sayfasından gelen talepler (`source: 'vitrin'`) hata verir. Bu SQL’ler `source IN ('www','demo','fiyatlar','vitrin')` olacak şekilde kısıtı günceller; böylece vitrin talepleri de kaydedilir.

---

## B. UYGULAMAYI ÇALIŞTIRMA

```powershell
cd C:\Users\info\OneDrive\Desktop\YISA_S_APP\yisa-s-app
npm run build
npm run dev
```

Tarayıcıda: **http://localhost:3000**

---

## C. KİM NASIL KULLANACAK — TEK SENARYO (Baştan Sona)

Aşağıdaki senaryoda: **siz Patron**, **müşteri vitrinden seçim yapacak**, **siz onaylayacaksınız**, **Beşiktaş’ın sahibi** (firma sahibi) giriş yapıp panelini görecek.

---

### 1) Patron (siz) — Giriş ve şifre

| Ne | Değer |
|----|--------|
| **Giriş URL** | http://localhost:3000/patron/login (veya /auth/login) |
| **E-posta** | `.env` içindeki `NEXT_PUBLIC_PATRON_EMAIL` (varsayılan: `serdincaltay@gmail.com`) |
| **Şifre** | Bu e-postanın **Supabase Auth**’daki şifresi (uygulama içinde sabit yok) |

**Yapmanız gereken:**  
- Supabase Dashboard → **Authentication** → **Users** → Patron e-postası var mı kontrol edin. Yoksa **Add user** ile ekleyin ve şifre belirleyin.  
- Tarayıcıda `/patron/login` → bu e-posta + şifre → giriş.  
- Giriş sonrası **Dashboard** (`/dashboard`) açılır.

---

### 2) Vitrin müşterisi (Beşiktaş’ı kuracak kişi)

Bu kişi **giriş yapmadan** vitrin sayfasına gider, paket seçer, formu gönderir.

| Ne | Değer |
|----|--------|
| **URL** | http://localhost:3000/vitrin |
| **Giriş** | Zorunlu değil |

**Adımlar:**  
1. **/vitrin** sayfasını açın (farklı tarayıcı veya gizli pencere ile “müşteri” gibi davranabilirsiniz).  
2. Web, logo, şablon (örn. Modern), tesis yönetimi (örn. Temel), robot seçin.  
3. **Ad:** örn. `Beşiktaş Tuzla Cimnastik`, **E-posta:** firma sahibi olarak kullanacağınız e-posta (örn. `besiktas@test.com`).  
4. **Seçimleri gönder**’e tıklayın.  
5. “Talebiniz alındı” benzeri mesaj görünmeli.

**Kontrol:**  
- Patron olarak giriş yapın → Dashboard → **Onay Kuyruğu** → **Demo Talepleri** sekmesi.  
- Yeni talebi görmelisiniz; **Kaynak (source)** sütununda **vitrin** yazmalı.

---

### 3) Patron — Ödeme / İrtibat (senaryo)

Senaryoda: “Müşteriyle konuştunuz, 1.500 $ peşin + seçime göre ödeme yapacak.”  
- Bu kısım **sizin iş süreciniz** (gerçek ödeme uygulama dışında).  
- Sonrasında **Onay Kuyruğu → Demo Talepleri**’nden bu talebi **Onayla** diyorsunuz.

---

### 4) Patron — Talebi onaylama (tenant oluşturma)

| Ne | Nerede |
|----|--------|
| **Sayfa** | Dashboard → **Onay Kuyruğu** → **Demo Talepleri** |
| **İşlem** | İlgili satırda **Onayla** butonuna tıklayın |

**Sistem ne yapar?**  
- `demo_requests` kaydı **converted** olur.  
- **Tenant** oluşturulur: adı talepteki **name** + varsa **city** (örn. “Beşiktaş Tuzla Cimnastik”).  
- Talep e-postası (**besiktas@test.com**) Supabase **Auth**’da **zaten varsa**:  
  - Bu kullanıcı tenant’ın **owner**’ı yapılır (`tenants.owner_id`, `user_tenants.role = 'owner'`).  
- E-posta Auth’da **yoksa**: Tenant yine oluşur ama owner atanmaz; sonra siz Auth’da bu e-postayı ekleyip elle owner bağlayabilir veya bir sonraki adımda kullanıcıyı oluşturup rol verirsiniz.

**Kontrol:**  
- Dashboard → **Franchise / Vitrin** (veya tenants listesi).  
- Yeni tenant (örn. “Beşiktaş Tuzla Cimnastik”) listelenmeli.

---

### 5) Firma sahibi (Beşiktaş) — Kullanıcı adı, şifre, rol

Firma sahibi **aynı siteden** giriş yapacak; rolü **franchise** olduğu için **Franchise paneli** (`/franchise`) açılacak.

**Kullanıcı adı = e-posta** (vitrinde yazdığınız, örn. `besiktas@test.com`).  
**Şifre:** Sizin belirleyip müşteriye ilettiğiniz şifre (Supabase Auth’da bu e-posta için tanımlı).

**Rol ataması (önemli):**  
Giriş sonrası **/franchise**’a düşmesi için bu kullanıcının **franchise** olarak tanınması gerekir. İki yol:

**Yol A — Supabase Auth user_metadata:**  
- Supabase → **Authentication** → **Users** → bu e-postayı bulun (veya önce **Add user** ile ekleyin, şifre verin).  
- **User**’a tıklayın → **Edit** → **User Metadata** kısmına ekleyin: `"role": "Franchise Sahibi"`.  
- Kaydedin. Girişte uygulama `user_metadata.role` ile rolü çözer ve **/franchise**’a yönlendirir.

**Yol B — profiles tablosu:**  
- `profiles` tablosu varsa: bu kullanıcının `id`’si (auth.users.id) ile bir satır ekleyin veya güncelleyin, `role = 'franchise'` (veya `'firma_sahibi'`) yapın.  
- `profiles` tablosu yoksa Yol A kullanın.

**Özet:**  
1. Vitrinde yazılan e-postayı Supabase Auth’da kullanıcı olarak oluşturun; şifre verin.  
2. User metadata’da `role: "Franchise Sahibi"` ekleyin (veya profiles’ta role = franchise).  
3. Müşteriye “Kullanıcı adı: bu e-posta, şifre: …” deyin.

---

### 6) Firma sahibi — Giriş ve site kurma (senaryo)

| Ne | Değer |
|----|--------|
| **Giriş URL** | http://localhost:3000/auth/login |
| **E-posta** | besiktas@test.com (veya vitrinde yazdığınız) |
| **Şifre** | Sizin verdiğiniz şifre |

**Beklenen:**  
- Giriş sonrası **Franchise paneli** (`/franchise`) açılır.  
- “Henüz atanmış tesisiniz yok…” yerine, onayladığınız tenant (Beşiktaş Tuzla Cimnastik) atanmışsa tesis bilgisi ve panel içeriği görünür.  
- Firma sahibi buradan üye/personel ekleyebilir, şablon kullanabilir, “sitesini kursun” akışını (mevcut sayfalar dahilinde) kullanır.

---

## D. ÖZET TABLO — Kim nereye girer, ne yapar

| Kim | Giriş / Sayfa | URL | Şifre / Not |
|-----|----------------|-----|--------------|
| **Patron (siz)** | Patron giriş → Dashboard | /patron/login → /dashboard | NEXT_PUBLIC_PATRON_EMAIL + Supabase Auth şifresi |
| **Vitrin müşterisi** | Vitrin (giriş yok) | /vitrin | Giriş yok; seçim yapıp form gönderir |
| **Patron** | Onay Kuyruğu → Demo Talepleri → Onayla | /dashboard/onay-kuyrugu | Talebi onaylayınca tenant oluşur |
| **Firma sahibi (Beşiktaş)** | Genel giriş → Franchise paneli | /auth/login → /franchise | Vitrindeki e-posta + sizin verdiğiniz şifre; Auth’da role = Franchise Sahibi (veya profiles.role = franchise) |

---

## E. KONTROL LİSTESİ (Senaryo bittikten sonra)

- [ ] Patron: `/patron/login` ile giriş → Dashboard açıldı.  
- [ ] Vitrin: `/vitrin` → Seçim yapıldı, “Seçimleri gönder” → Talebiniz alındı.  
- [ ] Onay Kuyruğu → Demo Talepleri’nde kayıt görünüyor, **source: vitrin**.  
- [ ] Aynı talepte **Onayla** → “Talep onaylandı, tenant oluşturuldu.”  
- [ ] Dashboard → Franchise / Vitrin’de yeni tenant (Beşiktaş …) listeleniyor.  
- [ ] Firma sahibi e-postası Auth’da kullanıcı, şifre ve rol (Franchise Sahibi veya profiles) ayarlı.  
- [ ] Firma sahibi `/auth/login` → giriş → **/franchise** açıldı, kendi tesisini görüyor.

Bu adımlar tamamsa vitrin kuralı, onay akışı ve firma sahibi paneli senaryosu çalışıyor demektir.
