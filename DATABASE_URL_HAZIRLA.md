# YİSA-S — DATABASE_URL Hazırlama

**Supabase** ve **Railway** için veritabanı bağlantısı.

---

## 1. Supabase — DATABASE_URL

1. **Supabase Dashboard** → Projenizi seçin
2. **Settings** (sol menü) → **Database**
3. **Connection string** bölümünde **URI** seçin
4. Şifreyi yazın (Database password). Format:

```
postgresql://postgres.[PROJECT_REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

**Örnek:**
```
postgresql://postgres.abcdefghijklmnop:MySecretPass123@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

5. **.env.local** dosyasına ekleyin:
```
DATABASE_URL=postgresql://postgres.xxx:SIFRENIZ@aws-0-xxx.pooler.supabase.com:6543/postgres
```

**Not:** `[YOUR-PASSWORD]` içinde özel karakter varsa URL-encode edin (örn. `@` → `%40`).

---

## 2. Migration çalıştırma (DATABASE_URL ile)

.env.local'da `DATABASE_URL` tanımlıysa:

```bash
cd yisa-s-app
npm run db:tek-seferde
```

Bu komut **TEK_SEFERDE_YENI_MIGRASYONLAR.sql** dosyasını çalıştırır (celf_kasa, tenant_schedule, tenant_purchases, staff alanları, COO depolar, RLS).

---

## 3. Alternatif: Supabase SQL Editor (DATABASE_URL olmadan)

1. Supabase Dashboard → **SQL Editor**
2. **New query**
3. `supabase/TEK_SEFERDE_YENI_MIGRASYONLAR.sql` dosyasının **tüm içeriğini** kopyalayıp yapıştırın
4. **Run** (veya Ctrl+Enter)

Böylece migration sunucuda çalışır; DATABASE_URL gerekmez.

---

## 4. Railway deploy — Ortam değişkenleri

Railway'da deploy için projeye şu değişkenleri ekleyin:

| Değişken | Açıklama |
|----------|----------|
| `DATABASE_URL` | Supabase connection string (yukarıdaki gibi) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase proje URL (https://xxx.supabase.co) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
| `NEXT_PUBLIC_PATRON_EMAIL` | Patron e-postası (opsiyonel) |

**Railway'da:** Project → Variables → Add Variable.

**Not:** Bu proje şu an **Vercel**'de deploy ediliyor (GitHub push ile). Railway kullanacaksanız repo'yu Railway'a bağlayıp yukarıdaki değişkenleri tanımlayın; build komutu: `npm run build`, start: `npm run start`.
