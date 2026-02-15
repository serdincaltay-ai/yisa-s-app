# YİSA-S — Hızlı Komutlar

## Tek tıkla başlat

**BASLAT.ps1** — Çift tıkla veya sağ tık → "PowerShell ile Çalıştır"
- Migration çalıştır? (e/h) sorar
- Sonra `npm run dev` başlatır → http://localhost:3000

## Sadece migration

**MIGRASYON_CALISTIR.ps1** — Sadece veritabanı migration'larını çalıştırır.

Önce `.env.local`'de şu olmalı:
```
DATABASE_URL=postgresql://postgres.xxx:[SIFRE]@aws-0-xxx.pooler.supabase.com:6543/postgres
```
(Supabase → Settings → Database → Connection string → URI, port 6543)

## Manuel komutlar

```powershell
cd "C:\Users\info\OneDrive\Desktop\claude\proje\YISA_S_APP\yisa-s-app"

# Migration
node scripts/run-full-migrations.js

# Dev sunucu
npm run dev

# Production build
npm run build
```

## COO rutinleri (otomatik)

Vercel'de deploy edildiyse: `vercel.json` içinde cron tanımlı olabilir.
Veya harici servis (cron-job.org, Railway cron) ile periyodik çağrı:

```
GET/POST https://siteniz.vercel.app/api/coo/run-due
Header: Authorization: Bearer CRON_SECRET
```

`.env`'de `CRON_SECRET` tanımlayın.
