# YİSA-S Kurulum Adımları (Hatasız)

## 1. Bağımlılıklar

```bash
npm install
```

## 2. Ortam Değişkenleri

`.env.local` dosyası zaten oluşturuldu. Kontrol için:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GOOGLE_API_KEY`

## 3. Supabase Migration (ÖNEMLİ)

### Seçenek A: Otomatik (DATABASE_URL ile)

1. Supabase Dashboard → **Settings** → **Database**
2. **Connection string** → **URI** kopyala
3. `.env.local`'e ekle:
   ```
   DATABASE_URL=postgresql://postgres.xxx:[PASSWORD]@aws-0-xxx.pooler.supabase.com:6543/postgres
   ```
4. Çalıştır:
   ```bash
   npm run db:migrate
   ```

### Seçenek B: Manuel (SQL Editor)

1. [Supabase SQL Editor](https://supabase.com/dashboard/project/bgtuqdkfppcjmtrdsldl/sql)
2. **New query**
3. `supabase/RUN_ALL_MIGRATIONS.sql` içeriğini yapıştır
4. **Run**

**Not:** Önce `supabase/YISA-S_TUM_TABLOLAR_TEK_SQL.sql` çalıştırılmamışsa, onu önce çalıştırın. RUN_ALL_MIGRATIONS yalnızca robot/direktörlük tablolarını ekler.

## 4. Uygulama

```bash
npm run dev
```

- Giriş: http://localhost:3000
- Dashboard: http://localhost:3000/dashboard
- Sistem durumu: http://localhost:3000/api/system/status

## Sorun Giderme

| Sorun | Çözüm |
|-------|-------|
| "Supabase bağlantısı yok" | .env.local'de SUPABASE_URL ve keys kontrolü |
| "robots tablosu yok" | RUN_ALL_MIGRATIONS.sql çalıştırın |
| "Yanıt oluşturulamadı" | OPENAI_API_KEY, GOOGLE_API_KEY kontrolü |
| Migration script hata | DATABASE_URL doğru mu? pg: `npm install pg --save-dev` |
