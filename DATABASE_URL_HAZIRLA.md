# YİSA-S — DATABASE_URL Hazırlama

Migration (`npm run db:tek-seferde`) ve Railway deploy için Supabase veritabanı bağlantı bilgisi gerekir.

---

## 1. Supabase'den Connection String Al

1. **Supabase Dashboard** → Projeniz
2. **Settings** (sol menü) → **Database**
3. **Connection string** bölümü
4. **URI** sekmesi → **Session mode** (port **6543**)
5. Format:
   ```
   postgresql://postgres.[PROJECT_REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
   ```
6. `[YOUR-PASSWORD]` yerine Database şifrenizi yazın (proje oluştururken belirlediğiniz)

---

## 2. .env.local'e Ekle

```env
DATABASE_URL=postgresql://postgres.xxxxx:SIFRENIZ@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

- Başta/sonda boşluk olmasın
- Şifrede özel karakter varsa URL-encode edin (örn. `@` → `%40`)

---

## 3. Alternatif: Supabase SQL Editor (DATABASE_URL Gerekmez)

DATABASE_URL eklemek istemiyorsanız:

1. Supabase → **SQL Editor** → **New query**
2. `supabase/TEK_SEFERDE_YENI_MIGRASYONLAR.sql` dosyasının içeriğini kopyalayın
3. Yapıştırın → **Run**

Bu yöntem doğrudan Supabase'e bağlanır; yerel ortam değişkeni gerekmez.

---

## 4. Railway için

Railway Variables'a ekleyeceğiniz `DATABASE_URL` aynı connection string'tir. Supabase'den kopyalayıp Railway → Variables → Add Variable ile ekleyin.
