# YİSA-S Patron Paneli — Şu Anki Durum ve Nasıl Devam

**Tarih:** 29 Ocak 2026  
**Amaç:** Git/GitHub, Vercel, Supabase, Railway durumu; çakışma kontrolü; şimdiye kadar ne kurulu; nasıl devam edeceksiniz.

---

## 1. TEK KOMUTLA DURUM GÖRME

Proje klasöründe **PowerShell** açıp şunu çalıştırın:

```powershell
cd C:\Users\info\OneDrive\Desktop\YISA_S_APP\yisa-s-app
Write-Host "=== GIT DURUMU ===" -ForegroundColor Cyan
git status
Write-Host "`n=== SON 3 COMMIT ===" -ForegroundColor Cyan
git log --oneline -3
Write-Host "`n=== REMOTE (GITHUB) ===" -ForegroundColor Cyan
git remote -v
Write-Host "`n=== ÇAKIŞMA VAR MI? (Unmerged = çakışma) ===" -ForegroundColor Cyan
git status | Select-String -Pattern "Unmerged|both modified|conflict"
if (-not $?) { Write-Host "Çakışma yok." -ForegroundColor Green }
```

**Çakışma yoksa:** "nothing to commit, working tree clean" ve "Your branch is up to date with 'origin/main'" görürsünüz; "Unmerged" satırı çıkmaz.

---

## 2. ÇAKIŞMA KONTROLÜ

| Kontrol | Komut / Yer | Çakışma yoksa |
|---------|-------------|----------------|
| Git merge conflict | `git status` | "Unmerged paths" veya "both modified" **çıkmaz** |
| Lock dosyası | `.git/index.lock` | Dosya yoksa veya silinebiliyorsa sorun yok |
| Push reddi | `git push origin main` | "Everything up-to-date" veya "main -> main" |

**Çakışma çıkarsa:**  
Dosyada `<<<<<<<`, `=======`, `>>>>>>>` ara; manuel düzelt → `git add .` → `git commit -m "fix: çakışma giderildi"` → `git push origin main`.

**Lock hatası çıkarsa:**  
Proje klasöründeyken: `Remove-Item .git\index.lock -Force -ErrorAction SilentlyContinue` → tekrar `git add` / `git commit` / `git push`.

---

## 3. RAILWAY, GITHUB, VERCEL, SUPABASE — BİRLİKTE ÇALIŞIYOR MU?

### 3.1 Genel akış

```
[Yerel] git push origin main
    → GitHub (serdincaltay-ai/yisa-s-app)
        → Vercel otomatik deploy (app.yisa-s.com)
            → Canlı site Supabase'e istek atar (Auth + tablolar)
```

### 3.2 Tablo: Ne nerede, durum

| Servis | Bu projede (yisa-s-app) kullanımı | Kurulu mu? | Not |
|--------|-----------------------------------|------------|-----|
| **GitHub** | Repo: kaynak kodu, push = tetikleyici | ✅ Evet | origin → serdincaltay-ai/yisa-s-app |
| **Vercel** | Frontend + API (Next.js) deploy, domain app.yisa-s.com | ✅ Evet | vercel.json var; proje Vercel’e bağlı olmalı |
| **Supabase** | Auth (giriş) + veritabanı (tablolar) | ✅ Evet | 8 tablo kuruldu; .env.local’de URL + key gerekli |
| **Railway** | Bu projede **yok** | ❌ Bu repo’da yok | Patron paneli backend’i Next.js API (Vercel’de); Railway ayrı projede kullanılabilir |

**Sonuç:** GitHub + Vercel + Supabase **birlikte çalışıyor**. Railway bu Patron paneli repo’sunda kullanılmıyor; backend = Next.js API routes (Vercel’de).

---

## 4. ŞİMDİYE KADAR NE KURULU?

### 4.1 Kod / Repo (GitHub)

| Öğe | Durum |
|-----|--------|
| Next.js 14, React 18, TypeScript | ✅ |
| Supabase client, Auth (giriş/çıkış) | ✅ |
| Dashboard (sidebar, sayfalar) | ✅ |
| API routes: chat, stats, approvals, expenses, franchises, templates | ✅ |
| Sayfalar: Onay Kuyruğu, Franchise'lar, Kasa Defteri, Şablonlar, vb. | ✅ |
| Robot (Claude) sohbeti, Patron Lock, rol/guvenlik modülleri | ✅ |
| vercel.json (build/install) | ✅ |
| .env.example (Supabase, Anthropic, SITE_URL) | ✅ |

### 4.2 Supabase (Veritabanı)

| Öğe | Durum |
|-----|--------|
| tenants | ✅ 6 kolon |
| approval_queue | ✅ 16 kolon |
| expenses | ✅ 16 kolon |
| franchises | ✅ 32 kolon |
| templates | ✅ 14 kolon |
| franchise_revenue | ✅ 18 kolon |
| deploy_logs | ✅ 16 kolon |
| api_usage | ✅ 16 kolon |
| View'lar (v_patron_*) | ✅ |
| Örnek şablon verileri (templates INSERT) | ✅ |

### 4.3 Vercel

| Öğe | Durum |
|-----|--------|
| Proje GitHub’a bağlı | ✅ (push = deploy) |
| Build: npm install, npm run build | ✅ vercel.json’da |
| Domain app.yisa-s.com | Vercel Dashboard’da tanımlı olmalı |
| Env: NEXT_PUBLIC_SUPABASE_*, ANTHROPIC_API_KEY, NEXT_PUBLIC_SITE_URL | Vercel → Settings → Environment Variables’da tanımlanmalı |

### 4.4 Railway

| Öğe | Durum |
|-----|--------|
| yisa-s-app içinde Railway config | ❌ Yok (railway.toml yok) |
| Backend | Next.js API routes Vercel’de çalışıyor |

---

## 5. NASIL DEVAM ETMELİYİM?

### Adım 1: Durum komutunu çalıştırın

Yukarıdaki **"1. TEK KOMUTLA DURUM GÖRME"** bölümündeki PowerShell komutunu çalıştırın. Çakışma yoksa devam edin.

### Adım 2: Vercel’i kontrol edin

1. [vercel.com](https://vercel.com) → Proje **yisa-s-app** (veya repo adı).
2. **Deployments** → En üstteki deploy **Ready** (yeşil) mi?
3. **Settings → Environment Variables** → `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `ANTHROPIC_API_KEY`, `NEXT_PUBLIC_SITE_URL` tanımlı mı?
4. **Settings → Domains** → `app.yisa-s.com` ekli mi?

### Adım 3: Supabase’i kontrol edin

1. [supabase.com](https://supabase.com) → Projeniz.
2. **Table Editor** → 8 tablo (tenants, approval_queue, expenses, franchises, templates, franchise_revenue, deploy_logs, api_usage) görünüyor mu?
3. **Authentication → Users** → En az bir test kullanıcısı var mı?

### Adım 4: Canlı siteyi test edin

1. **app.yisa-s.com** (veya Vercel’in verdiği URL) açın.
2. Giriş yapın (Supabase Auth kullanıcısı ile).
3. Dashboard → Onay Kuyruğu, Franchise'lar, Kasa Defteri, Şablonlar sayfaları açılıyor mu? Liste boş olsa bile sayfa hata vermemeli.
4. F12 → Console: kırmızı hata var mı?

### Adım 5: RLS / API hataları varsa

- Sayfa açılıyor ama liste hep boş veya 403/500: Supabase **RLS** politikalarını kontrol edin; gerekirse service_role ile API’nin çalıştığından emin olun.
- **API route’lar** (`/api/franchises`, `/api/expenses` vb.) Supabase tablo/kolon adlarıyla uyumlu mu diye kodu kontrol edin (COMMIT_DEPLOY_KONTROL.md 3.4).

### Adım 6: İsteğe bağlı — Dependabot ve lock

- GitHub **Security → Dependabot** uyarılarını giderin (özellikle critical/high).
- `.git/index.lock` hatası tekrarlarsa: Cursor/VS Code’u kapatıp `Remove-Item .git\index.lock -Force -ErrorAction SilentlyContinue` → tekrar commit/push.

---

## 6. ÖZET TABLO

| Kontrol | Beklenen |
|---------|----------|
| Git çakışma | Yok |
| GitHub push | main → origin/main güncel |
| Vercel deploy | Son deploy Ready |
| Supabase tabloları | 8 tablo + view’lar kurulu |
| Railway (bu repo) | Kullanılmıyor |
| Devam | Vercel env + domain kontrolü → canlı test → RLS/API gerekirse düzelt |

Bu dosyayı güncel tutarak "şu anki durum" ve "nasıl devam" tek yerde kalır. Commit/deploy detayı için **COMMIT_DEPLOY_KONTROL.md** kullanın.
