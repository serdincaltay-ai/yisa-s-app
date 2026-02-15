# Öncelikli Kontrol Özeti

**Tarih:** 3 Şubat 2026  
**Proje dizini:** `C:\Users\info\OneDrive\Desktop\YISA_S_APP\yisa-s-app`

---

## 1. /vitrin sayfası deploy edildi mi? Test et

**Kod tarafı (mevcut):**
- `/vitrin` route build’e dahil (Next.js route listesinde `ƒ /vitrin`).
- Vitrin sayfası: form (Ad, E-posta*, Tesis türü), seçimler (web, logo, şablon, tesis yönetimi, robot), canlı fiyat, "Seçimleri gönder" → `POST /api/demo-requests` (name, email, facility_type, notes JSON, source: `vitrin`).
- Gönderim sonrası mesaj: **"Talebiniz alındı. Patron onayından sonra tesis paneliniz kurulacak."**
- Üst açıklama (fuar): **"İstediğiniz hizmetleri seçin, fiyatı anında görün. Anlaştığımızda tesis paneliniz hazır."**

**Canlı test (sizin yapacaklarınız):**
1. Canlı site URL’inizi açın (örn. `https://app.yisa-s.com` veya Vercel URL).
2. Adres çubuğuna `/vitrin` ekleyip Enter (örn. `https://app.yisa-s.com/vitrin`).
3. Sayfa açılıyor mu, form ve canlı fiyat görünüyor mu kontrol edin.
4. E-posta doldurup "Seçimleri gönder" deyin; "Talebiniz alındı. Patron onayından sonra tesis paneliniz kurulacak." mesajı çıkıyor mu ve Supabase `demo_requests` tablosunda `source = 'vitrin'` kayıt oluşuyor mu kontrol edin.

**Not:** `source = 'vitrin'` için Supabase’te migration gerekir: `supabase/migrations/20260203_demo_requests_source_vitrin.sql`. Bu migration’ı Supabase Dashboard → SQL Editor’da çalıştırın veya `supabase db push` ile uygulayın.

---

## 2. Ana sayfadaki "Vitrin" butonu çalışıyor mu?

**Kod tarafı (mevcut):**
- Nav: **"Sistemi Tanıyın — Franchise"** → `href="/vitrin"`.
- Nav: **"Vitrin"** → `href="/vitrin"`.
- Hero: **"Sistemi Tanıyın — Franchise"** → `href="/vitrin"`.
- Footer: **"Sistemi Tanıyın"** → `href="/vitrin"`.

**Canlı test:** Ana sayfada "Vitrin" veya "Sistemi Tanıyın — Franchise" tıklayın; `/vitrin` sayfasına gidiyor mu kontrol edin.

**Ek linkler (mevcut):**
- **Patron Paneli** → `/patron/login`
- **Veli Girişi** → `https://veli.yisa-s.com` (yeni sekme)

---

## 3. Git push yapılmadıysa yap

Son push: `01cb26c` (fix: YisaLogo import + vitrin akışı). Çalışma dizini temizse ek push gerekmez.

**Yeni eklenen:** `supabase/migrations/20260203_demo_requests_source_vitrin.sql` (source’a `vitrin` ekler). Bunu commit edip push etmek için:

```powershell
cd C:\Users\info\OneDrive\Desktop\YISA_S_APP\yisa-s-app
git add supabase/migrations/20260203_demo_requests_source_vitrin.sql ONCELIKLI_KONTROL_OZET.md
git status
git commit -m "demo_requests source vitrin migration + kontrol ozeti"
git push
```

---

## Vitrin → Demo Talebi → Tenant akışı (mevcut)

| Adım | Nerede | Ne yapılıyor |
|------|--------|----------------|
| 1 | `/vitrin` | Kullanıcı seçim yapar (web, logo, şablon, tesis yönetimi, robot), e-posta girer, "Seçimleri gönder" der. |
| 2 | `POST /api/demo-requests` | name (form ad veya "Vitrin Talebi"), email, facility_type, notes (JSON: web, logo, sablonId, tesisSablonId, robot, toplamTek, aylik), source: `vitrin`. Tabloda status varsayılan `new`. |
| 3 | Patron paneli | Patron `demo_requests` listesinde talebi görür, onaylar. Mevcut akışta onay → tenant oluşturma (demo-requests route’ta `action=decide`, `decision=approve`). |
| 4 | Tenant | Onay sonrası tenant oluşur; kullanıcıya giriş bilgisi verilir, `/franchise` veya `/tesis` paneline girer. |

**Döküman sonu.**
