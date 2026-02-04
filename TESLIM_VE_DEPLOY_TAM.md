# YİSA-S — Teslim ve Deploy Tam Rehber

**Tarih:** 4 Şubat 2026  
**Durum:** Commit push tamamlandı. Vercel ve Railway deploy talimatları.

---

## 1. GIT DURUMU

```
✅ Commit: feat: isletme profili, kalite puani, v0 sablon kutuphanesi, V3 referans, veri kaynaklari dokumantasyonu
✅ Push: origin main (87719a3)
```

**Repo:** https://github.com/serdincaltay-ai/yisa-s-app

---

## 2. VERCEL DEPLOY

### 2.1 Otomatik Deploy (GitHub bağlıysa)

GitHub'a push yaptığınızda Vercel otomatik deploy yapar.  
**Kontrol:** Vercel Dashboard → Proje → Deployments

### 2.2 Manuel Deploy (CLI)

```bash
cd yisa-s-app
npx vercel --prod
```

### 2.3 Vercel Domain Ayarları

1. Vercel Dashboard → Proje → **Settings** → **Domains**
2. **Patron paneli:** `app.yisa-s.com` ekleyin (bu uygulama)
3. DNS: CNAME `app.yisa-s.com` → `cname.vercel-dns.com`
4. `yisa-s.com` tanıtım sitesine aittir (ayrı proje)

### 2.4 Vercel Environment Variables

Vercel → Proje → Settings → Environment Variables:

| Değişken | Açıklama | Production |
|----------|----------|------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase proje URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | ✅ |
| `DATABASE_URL` | Supabase connection string (server) | ✅ |
| `ANTHROPIC_API_KEY` | Claude API | ✅ |
| `OPENAI_API_KEY` | GPT (opsiyonel) | ✅ |
| `NEXT_PUBLIC_PATRON_EMAIL` | Patron e-posta | ✅ |

---

## 3. RAILWAY DEPLOY

### 3.1 Railway'a Bağlama

1. https://railway.app → Login (GitHub ile)
2. **New Project** → **Deploy from GitHub repo**
3. `serdincaltay-ai/yisa-s-app` seçin
4. Root directory: `yisa-s-app` (monorepo ise)
5. Build: `npm install && npm run build`
6. Start: `npm run start`

### 3.2 Railway Domain

1. Railway → Proje → **Settings** → **Networking**
2. **Generate Domain** tıklayın → `xxx.up.railway.app` verilir
3. Özel domain: **Custom Domain** → `app.yisa-s.com` ekleyin
4. DNS: CNAME `app.yisa-s.com` → `xxx.up.railway.app`

### 3.3 Railway Environment Variables

Railway → Proje → **Variables**:

Aynı değişkenler (NEXT_PUBLIC_SUPABASE_URL, DATABASE_URL, ANTHROPIC_API_KEY, vb.)

---

## 4. DOMAIN ÖZET (Çift Platform)

| Platform | Varsayılan Domain | Özel Domain Örneği |
|----------|-------------------|---------------------|
| **Vercel** | `yisa-s-app.vercel.app` | `yisa-s.com`, `app.yisa-s.com` |
| **Railway** | `xxx.up.railway.app` | `app.yisa-s.com`, `api.yisa-s.com` |

**Öneri:** Vercel = frontend (SSR/static), Railway = yedek veya API ağırlıklı. İkisinde de aynı kod deploy edilebilir.

---

## 5. DEPLOY KOMUTLARI (Hızlı)

```bash
# 1. Vercel production deploy
cd yisa-s-app
npx vercel --prod

# 2. Railway (GitHub bağlıysa otomatik; manuel için)
# Railway Dashboard'dan "Redeploy" veya GitHub push
```

---

## 6. MİGRASYON (Supabase)

Deploy öncesi veya sonrası migration çalıştırın:

```bash
cd yisa-s-app
npm run db:tek-seferde
# veya
node scripts/run-tek-seferde-migration.js
```

**Yeni migration'lar (4 Şubat):**
- `20260204_isletme_profili_kalite_puani.sql`
- `20260204_v0_template_library.sql`
- `20260204_demo_requests_source_manychat.sql`

Supabase Dashboard → SQL Editor'de de çalıştırılabilir.

---

## 7. TESLİM ÖZETİ

| Öğe | Durum |
|-----|-------|
| Git commit + push | ✅ |
| İşletme profili (tenants, franchises) | ✅ Migration |
| Kalite puanı (coo_depo) | ✅ Migration |
| V0 şablon kütüphanesi | ✅ Migration + seed |
| Veri kaynakları dokümantasyonu | ✅ docs/VERI_KAYNAKLARI_ROBOT_GOREVLENDIRME.md |
| OKUTULDU, V3, V0 referansları | ✅ archive/ |
| Vercel deploy | ✅ Tamamlandı |
| Patron paneli domain | app.yisa-s.com (Vercel → Settings → Domains) |
| Tanıtım (ayrı) | yisa-s.com (YISA_S_SITE_KOMPLE) |
| Railway deploy | İsteğe bağlı; Dashboard'dan GitHub bağlayın |
| Domain | Her iki platformda Settings → Domains |

---

## 8. CANLI ADRESLER (Deploy Sonrası)

**Patron Paneli (bu uygulama):** https://app.yisa-s.com  
**Tanıtım sitesi (ayrı proje):** https://yisa-s.com  
**Vercel varsayılan:** https://yisa-s-app.vercel.app

| Sayfa | Adres |
|-------|-------|
| Patron giriş | https://app.yisa-s.com/patron/login |
| Dashboard | https://app.yisa-s.com/dashboard |
| Auth (firma/tesis/veli) | https://app.yisa-s.com/auth/login |
| Vitrin | https://app.yisa-s.com/vitrin |
| Franchise paneli | https://app.yisa-s.com/franchise |
| Ana sayfa | https://app.yisa-s.com |

---

**Sistem teslim edildi. Deploy ve domain ayarlarını yukarıdaki adımlarla tamamlayın.**
