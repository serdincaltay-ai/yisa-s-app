# YİSA-S — Proje, Supabase, Vercel ve Dosya Raporu

Bu belge: **Mobil/PWA güncellemesi**, **hangi projede ne var**, **Supabase’de hangi dosyalar**, **Vercel’de hangi dosyalar**, **proje içinde hangi dosyalar aktif** ve **dokümantasyon (kitap) dosyaları** tek yerde toplar.

---

## 1. Mobil (telefon / PWA) — Değişiklikler otomatik mi?

**Evet. Otomatik.**

- Kullandığınız **mobil uygulama** ayrı bir native uygulama değil; **aynı web uygulaması** (Next.js). Telefonda tarayıcıdan veya **PWA** (Ana ekrana ekle) ile açtığınızda hep bu proje çalışır.
- **Akış:** Kod değişir → GitHub’a push → **Vercel** aynı repodan deploy alır → Canlı site güncellenir. Telefondan o canlı linki (veya localhost + aynı WiFi) açtığınızda **aynı güncel kod** çalışır.
- Yani yaptığımız tüm değişiklikler (onay kuyruğu, gönderen, asistan özeti, direktörler, vitrin, şablonlar vb.) **mobilde de aynı şekilde** geçerli; ayrıca bir “mobil proje” veya “apt” güncellemesi yok. **Tek proje, tek deploy.**

---

## 2. Hangi projede çalışıyoruz?

| Ortam | Proje / Konum | Açıklama |
|-------|----------------|----------|
| **Kod (ana proje)** | `C:\Users\info\OneDrive\Desktop\YISA_S_APP\yisa-s-app` | Next.js uygulaması; tüm değişiklikler burada. |
| **GitHub** | `serdincaltay-ai/yisa-s-app` | Repo; push edilen branch genelde `main`. |
| **Vercel** | Aynı repo bağlı proje | `main`’e push → Vercel otomatik build + deploy. |
| **Supabase** | Tek Supabase projesi (Dashboard’da seçtiğiniz) | Tablolar, Auth, SQL; `.env` içindeki `NEXT_PUBLIC_SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` bu projeyi gösterir. |

---

## 3. Supabase — Hangi proje, hangi dosyalar, hangi tablolar?

**Proje:** Uygulamanın `.env` / `.env.local` dosyasındaki `NEXT_PUBLIC_SUPABASE_URL` ile bağlandığı **tek Supabase projesi**.

**Çalıştırılan / kullanılan SQL dosyaları (sıra ile):**

| Sıra | Dosya | Nerede | Ne işe yarar |
|------|--------|--------|----------------|
| 1 | `supabase/YENI_MIGRASYONLAR_TEK_SQL.sql` | Supabase SQL Editor | Tablolar (tenants, user_tenants, demo_requests, athletes, payments, attendance, …) + vitrin kuralı |
| 2 | `supabase/migrations/20260203_ceo_templates_ve_sablonlar.sql` | Supabase SQL Editor | ceo_templates tablosu (ad, kategori, icerik, durum, olusturan) |
| 3 | `supabase/SABLONLAR_TEK_SQL.sql` | Supabase SQL Editor | 66 şablon INSERT (ceo_templates) |
| 4 | `supabase/migrations/20260203_patron_commands_komut_sonuc_durum.sql` | Supabase SQL Editor | patron_commands: komut, sonuc, durum, completed_at |
| 5 | `supabase/VITRIN_TEK_SQL.sql` | (İsteğe bağlı; 1’de vitrin var) | Sadece demo_requests source=vitrin kısıtı |

**Aktif kullanılan tablolar (kod tarafından okunup yazılan):**

- **Auth:** `auth.users` (Supabase Auth)
- **Patron / Onay:** `patron_commands`, `ceo_tasks`, `celf_logs`, `task_results`, `audit_log`
- **Şablonlar:** `ceo_templates`
- **Vitrin / Demo:** `demo_requests`
- **Tenant / Franchise:** `tenants`, `user_tenants`
- **Diğer:** `athletes`, `attendance`, `payments`, `staff`, `roles`, `packages`, `chat_messages`, `cio_analysis_logs`, `robots`, vb. (YENI_MIGRASYONLAR ve diğer migration’larda tanımlı)

**Supabase’de “hangi dosyaları kullanıyoruz” özeti:** Yukarıdaki SQL dosyaları Supabase SQL Editor’da **bir kez** çalıştırılır; günlük kullanımda uygulama bu tablolara **API üzerinden** (Next.js route’ları) bağlanır. Yani “aktif kullanılan” Supabase tarafı = bu tablolar ve Auth.

---

## 4. Vercel — Hangi proje, hangi dosyalar?

**Proje:** GitHub repo’su `serdincaltay-ai/yisa-s-app` ile bağlı **Vercel projesi**. Branch: genelde `main`.

**Deploy edilen:** Tüm `yisa-s-app` klasörü (repo root). Vercel:

- `vercel.json` → `framework: nextjs`, `buildCommand: npm run build`, `installCommand: npm install`
- Build sırasında **tüm** `app/`, `lib/`, `components/`, `package.json` vb. kullanılır; yani **projedeki tüm kaynak dosyalar** deploy’a dahil.

**Vercel’de “hangi dosyalar kullanılıyor” özeti:** Repodaki **tüm uygulama dosyaları** (Next.js sayfaları, API’ler, lib, bileşenler). Özellikle:

- `app/**/*.tsx`, `app/**/route.ts`
- `lib/**/*.ts`
- `components/**/*.tsx`
- `package.json`, `next.config.*`, `vercel.json`

---

## 5. Proje (kod) — Aktif kullanılan dosyalar

**Ana dizin:** `yisa-s-app/`

**Son dönemde birlikte çalıştığımız / değiştirdiğimiz dosyalar:**

| Alan | Dosyalar |
|------|----------|
| **Onay / Patron** | `app/api/approvals/route.ts`, `app/api/chat/flow/route.ts`, `app/dashboard/onay-kuyrugu/page.tsx`, `lib/db/ceo-celf.ts` |
| **Direktörler** | `app/dashboard/directors/page.tsx`, `lib/robots/celf-center.ts` |
| **Şablonlar** | `app/api/templates/route.ts`, `app/dashboard/sablonlar/page.tsx` |
| **Vitrin / Demo** | `app/vitrin/page.tsx`, `app/api/demo-requests/route.ts` |
| **Auth / Rol** | `lib/auth/roles.ts`, `lib/auth/resolve-role.ts`, `app/auth/login/page.tsx`, `app/patron/login/page.tsx` |
| **Dashboard** | `app/dashboard/page.tsx`, `app/dashboard/layout.tsx`, `app/dashboard/sablonlar/page.tsx` |

**Tüm projede aktif kullanılan önemli dosyalar (referans):**

- **Uygulama giriş / sayfalar:** `app/page.tsx`, `app/layout.tsx`, `app/patron/login/page.tsx`, `app/auth/login/page.tsx`, `app/vitrin/page.tsx`, `app/dashboard/**`, `app/franchise/page.tsx`, `app/veli/page.tsx`, `app/tesis/page.tsx`, `app/antrenor/page.tsx`
- **API:** `app/api/chat/flow/route.ts`, `app/api/approvals/route.ts`, `app/api/demo-requests/route.ts`, `app/api/templates/route.ts`, `app/api/startup/route.ts`, `app/api/franchise/**`, `app/api/veli/**`, `app/api/patron/**`
- **Veritabanı / Supabase:** `lib/db/ceo-celf.ts`, `lib/db/chat-messages.ts`, `lib/supabase.ts`, `lib/supabase/client.ts`, `lib/supabase/server.ts`
- **Robot / CELF:** `lib/robots/celf-center.ts`, `lib/robots/ceo-robot.ts`, `lib/robots/cio-robot.ts`, `lib/ai/celf-execute.ts`
- **PWA / Mobil:** `app/api/manifest/route.ts`, `lib/subdomain.ts` (PWA adı ve start_url panel’e göre)

---

## 6. Dokümantasyon (kitap) — Hangi dosyalar?

Proje içinde **referans / “kitap”** gibi kullandığınız dokümanlar:

| Dosya | İçerik |
|-------|--------|
| `HEPSINI_UYGULA_VE_TEST_SENARYOSU.md` | Tüm SQL sırası + vitrin → firma sahibi test senaryosu |
| `PATRON_ASISTAN_DIREKTOR_HIYERARSI.md` | Patron → Asistan → Direktör, onay akışı, kim ne yapar |
| `KIM_HANGI_SAYFAYA_GIRER.md` | Kim hangi URL’e girer (Patron, franchise, vitrin, veli vb.) |
| `DURUM_VE_PROJE_KOMUTLARI.md` | Yapılanlar, eksikler, komutlar, kontrol listesi |
| `GIRIS_VE_IS_AKISI_SEMASI.md` | Giriş paneli, şifre, fuar → vitrin → firma sahibi akışı |
| `KIM_NE_YAPAR_CALISMA_SEMASI.md` | Roller, robotlar, vitrin yönetimi |
| `supabase/SIRALAMA_NASIL_CALISTIRILIR.md` | SQL’leri çalıştırma sırası |
| `supabase/MIGRASYON_VITRIN_NEDEN.md` | Vitrin migration’ının neden ayrı anlatıldığı |
| `TELEFONDAN_KULLANIM.md` | Telefondan nasıl açılır (WiFi / link) |
| `UYGULAMA_LINKI_AL.md` | Uygulama linki (Vercel vb.) nasıl alınır |

---

## 7. Özet tablo — Nerede ne kullanılıyor?

| Nerede | Ne kullanılıyor |
|--------|------------------|
| **Mobil / PWA** | Aynı Next.js uygulaması; Vercel’e deploy = mobilde de güncel. Ayrı mobil proje yok. |
| **Supabase** | Tek proje; YENI_MIGRASYONLAR, ceo_templates, SABLONLAR, patron_commands, VITRIN SQL dosyaları + yukarıdaki tablolar. |
| **Vercel** | `serdincaltay-ai/yisa-s-app` repo’su; tüm `yisa-s-app` kaynak kodu (app, lib, components, vercel.json). |
| **Proje (kod)** | `yisa-s-app` içindeki app/, lib/, components/, supabase/; aktif sayfa ve API’ler yukarıda listelendi. |
| **Kitap / doküman** | Yukarıdaki .md dosyaları; test senaryosu, hiyerarşi, giriş sayfaları, SQL sırası. |

Bu rapor güncellenebilir; yeni migration veya yeni sayfa ekledikçe ilgili bölüme eklenebilir.
