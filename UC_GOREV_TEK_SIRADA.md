# YİSA-S — Üç Görev Tek Sırada (Hata Yok)

**Tarih:** 4 Şubat 2026  
**Yetki:** Tam yetki verildi — bu üç görevi sırayla bitirin.

---

## Görev 1: Dependabot PR'larını Merge Et

### Neden GitHub Web'den?
- `gh` CLI yüklü değil; PR merge için GitHub web arayüzü kullanılacak.

### Adımlar
1. **GitHub** → https://github.com/serdincaltay-ai/yisa-s-app → **Pull requests**
2. **Open** filtresi
3. Dependabot PR'larını bulun (başlık: `Bump ... from X to Y` veya `chore(deps): ...`)
4. Her PR için:
   - **Files changed** → Değişiklikleri inceleyin
   - **Merge pull request** → **Confirm merge**
5. Merge sonrası: `main` branch'e `git pull` çekin

### Dependabot yoksa
- `.github/dependabot.yml` zaten var; haftalık PR açacak.
- Şu an açık PR yoksa bu adımı atlayın.

---

## Görev 2: Tek Seferde Migration Çalıştır

### Seçenek A — Supabase SQL Editor (Önerilen, hata riski düşük)

1. **Supabase Dashboard** → Projeniz → **SQL Editor**
2. **New query** tıklayın
3. `yisa-s-app/supabase/TEK_SEFERDE_YENI_MIGRASYONLAR.sql` dosyasını açın
4. **Tüm içeriği** kopyalayıp SQL Editor'e yapıştırın
5. **Run** tıklayın
6. "Success" mesajını görün

### Seçenek B — Yerelde `npm run db:tek-seferde`

1. **`.env.local`** dosyasına ekleyin (Supabase'den alın):
   ```
   DATABASE_URL=postgresql://postgres.[REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
   ```
2. Supabase: **Settings → Database → Connection string → URI** (Session mode, port 6543)
3. Şifreyi `[PASSWORD]` yerine yazın
4. Terminal:
   ```bash
   cd yisa-s-app
   npm run db:tek-seferde
   ```
5. "Migration tamamlandı." mesajını görün

---

## Görev 3: Railway Projeyi Bağla + Tüm Değişkenleri Ekle

### 3.1 Railway Projeyi Bağla

1. **Railway Dashboard** → **New Project**
2. **Deploy from GitHub repo** seçin
3. Repo: `serdincaltay-ai/yisa-s-app`
4. Root directory: `/` (repo kökü)
5. Build ayarları: `nixpacks.toml` zaten projede var

### 3.2 Tüm Ortam Değişkenleri (Railway Variables)

Railway → Proje → **Variables** sekmesi → Aşağıdakileri ekleyin:

| Değişken | Zorunlu | Açıklama |
|----------|---------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase proje URL (https://xxx.supabase.co) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Supabase service role key (yazma işlemleri) |
| `DATABASE_URL` | ✅ | Supabase DB connection string (migration için) |
| `NEXT_PUBLIC_PATRON_EMAIL` | Opsiyonel | Patron e-postası (serdincaltay@gmail.com) |
| `GOOGLE_API_KEY` | Opsiyonel | Asistan / CELF Gemini |
| `OPENAI_API_KEY` | Opsiyonel | Asistan / CELF GPT |
| `ANTHROPIC_API_KEY` | Opsiyonel | Asistan / CELF Claude |
| `TOGETHER_API_KEY` | Opsiyonel | CELF Together |
| `MANYCHAT_API_KEY` | Opsiyonel | ManyChat Pro — Vitrin lead, CMO pazarlama |
| `MANYCHAT_WEBHOOK_SECRET` | Opsiyonel | ManyChat webhook imza doğrulama |
| `FAL_API_KEY` | Opsiyonel | FAL AI — görsel üretim |
| `CRON_SECRET` | Opsiyonel | Vercel Cron güvenliği (COO run-due) |

### 3.3 Değişken Değerleri Nereden?

- **Supabase:** Dashboard → Settings → API (URL, anon key, service_role key)
- **Database:** Settings → Database → Connection string → URI
- **API anahtarları:** `.env.local` içindeki değerlerle aynı

### 3.4 Deploy

- Railway otomatik deploy alır (GitHub push sonrası)
- İlk deploy sonrası: **Settings → Domains** ile domain ekleyebilirsiniz

---

## Özet Kontrol Listesi

| # | Görev | Durum |
|---|-------|--------|
| 1 | Dependabot PR'larını merge et | |
| 2 | Migration çalıştır (Supabase SQL Editor veya `npm run db:tek-seferde`) | |
| 3 | Railway projeyi bağla + tüm değişkenleri ekle | |

---

## Hata Önleme

- **Migration:** SQL Editor kullanırsanız `DATABASE_URL` gerekmez; doğrudan Supabase'e bağlanır.
- **Railway:** Değişkenlerde başta/sonda boşluk olmasın.
- **Dependabot:** Merge öncesi `npm run build` yerelde çalıştırın; PR'da build kırılmamalı.

---

**Bu üç görevi tamamladığınızda sistem hazır.**
