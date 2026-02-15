# Cursor Yaptıkları — Sizin Yapmanız Gerekenler

## Cursor Tarafında Tamamlananlar

1. **Build doğrulandı** — `npm run build` başarıyla tamamlandı.
2. **Tek SQL dosyası oluşturuldu** — `supabase/YENI_MIGRASYONLAR_TEK_SQL.sql`
   - payments (aidat)
   - attendance (yoklama)
   - athletes.parent_email
3. **`.env.example`** — Migration alternatifi notu eklendi.

---

## Sizin Yapmanız Gerekenler

### 1. Migration (zorunlu)

**Seçenek A — Supabase SQL Editor (önerilen):**
1. [Supabase Dashboard](https://supabase.com/dashboard) → Projeniz → SQL Editor
2. `supabase/YENI_MIGRASYONLAR_TEK_SQL.sql` dosyasını açın
3. İçeriği kopyalayıp SQL Editor’e yapıştırın → Run

**Ön koşul:** `tenants` ve `athletes` tabloları mevcut olmalı. Yoksa önce `supabase/migrations/20260202_asama2_tenant_schema.sql` çalıştırın.

**Seçenek B — npm script:**
- `.env.local` dosyasına `DATABASE_URL` ekleyin (Supabase → Settings → Database → Connection string)
- Terminal: `npm run db:migrate`  
  *(Bu script `RUN_ALL_MIGRATIONS.sql` kullanır; yeni tablolar için YENI_MIGRASYONLAR_TEK_SQL.sql tercih edilir.)*

### 2. Ortam değişkenleri

`.env.local` içinde olması gerekenler:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### 3. Uygulamayı çalıştırma

```bash
cd c:\Users\info\OneDrive\Desktop\YISA_S_APP\yisa-s-app
npm run dev
```

Tarayıcıda `http://localhost:3000` adresine gidin.

### 4. Test akışı

- Patron: `/dashboard` veya `app` subdomain
- Demo talep: `/demo` → form doldur → Patron onayı
- Franchise: `franchise` subdomain
- Veli: `veli` subdomain

---

## Özet

| Cursor yaptı | Siz yapacaksınız |
|--------------|------------------|
| Build kontrol | Migration çalıştır (SQL Editor) |
| Tek SQL dosyası | .env.local kontrol |
| Doküman | npm run dev → test |
