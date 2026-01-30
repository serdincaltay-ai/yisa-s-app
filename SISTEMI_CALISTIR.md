# YİSA-S — Sistemi Çalıştırma (Adım Adım)

**Tarih:** 30 Ocak 2026

---

## 1. Ortam (.env.local)

Proje kökünde `.env.local` dosyası olmalı. Yoksa `.env.example` içeriğini kopyalayıp `.env.local` yapın ve değerleri doldurun.

**Zorunlu:**
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase proje URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Anon key
- `SUPABASE_SERVICE_ROLE_KEY` — Chat/CEO/CELF yazmak için (service role)
- `GOOGLE_API_KEY` (veya `GOOGLE_GEMINI_API_KEY`) — İmla + CELF
- `OPENAI_API_KEY` — İmla yedek, GPT
- `ANTHROPIC_API_KEY` — Özel iş / Claude

---

## 2. Veritabanı (Supabase SQL)

**Seçenek A — Yeni kurulum (henüz tablo yok):**

1. Supabase Dashboard → **SQL Editor** → New query
2. `supabase/YISA-S_TUM_TABLOLAR_TEK_SQL.sql` dosyasının **tüm içeriğini** yapıştırın
3. **Run** — tüm tablolar, RLS, role_permissions tek seferde oluşur (içinde `awaiting_approval` dahil)

**Seçenek B — Tablolar zaten var (sadece senkron güncellemesi):**

1. Supabase Dashboard → **SQL Editor** → New query
2. Aşağıdaki migration’ı yapıştırıp **Run** edin:

```sql
-- ceo_tasks.status'a awaiting_approval ekler (onay tek kaynak)
ALTER TABLE ceo_tasks DROP CONSTRAINT IF EXISTS ceo_tasks_status_check;
ALTER TABLE ceo_tasks ADD CONSTRAINT ceo_tasks_status_check
  CHECK (status IN ('pending', 'assigned', 'celf_running', 'awaiting_approval', 'completed', 'failed', 'cancelled'));
```

(Dosya: `supabase/migrations/20260130_ceo_tasks_awaiting_approval.sql`)

---

## 3. Proje çalıştırma

```bash
cd C:\Users\info\OneDrive\Desktop\YISA_S_APP\yisa-s-app
npm install
npm run dev
```

Tarayıcıda: **http://localhost:3000**  
Patron paneli: **http://localhost:3000/dashboard** (giriş: Supabase Auth ile; Patron e-posta veya yetkili rol gerekir)

---

## 4. Hızlı kontrol

- **Sağlık:** http://localhost:3000/api/health — env ve Supabase durumu
- **Dashboard:** Giriş yapıp sohbet + Onay Kuyruğu sayfalarını açın

---

**Özet:** .env.local → Supabase’te SQL (A veya B) → npm install → npm run dev

---

## 5. Sadece migration çalıştırmak (tablolar zaten var)

Supabase Dashboard → SQL Editor → New query → aşağıdaki SQL’i yapıştırıp **Run**:

```sql
-- ceo_tasks.status'a awaiting_approval ekler
ALTER TABLE ceo_tasks DROP CONSTRAINT IF EXISTS ceo_tasks_status_check;
ALTER TABLE ceo_tasks ADD CONSTRAINT ceo_tasks_status_check
  CHECK (status IN ('pending', 'assigned', 'celf_running', 'awaiting_approval', 'completed', 'failed', 'cancelled'));
```

---

## 6. Idempotency (kopya CEO task engeli)

Aynı isteğin tekrar gelmesinde (çift tık, retry) yeni kayıt açılmaz; mevcut task döndürülür. **Önce temizlik, sonra kolon + index.**

Supabase SQL Editor → New query → aşağıdaki SQL’i **sırayla** veya tek seferde **Run**:

```sql
-- 1) Kopya temizliği (aynı user_id + task_description, en eski tutulur)
WITH ranked AS (
  SELECT id, row_number() OVER (PARTITION BY user_id, task_description ORDER BY created_at ASC) AS rn
  FROM ceo_tasks
)
DELETE FROM ceo_tasks WHERE id IN (SELECT id FROM ranked WHERE rn > 1);

-- 2) Kolon
ALTER TABLE ceo_tasks ADD COLUMN IF NOT EXISTS idempotency_key TEXT;

-- 3) Unique index
CREATE UNIQUE INDEX IF NOT EXISTS ceo_tasks_user_idempotency_unique
ON ceo_tasks (user_id, idempotency_key) WHERE idempotency_key IS NOT NULL;
```

Kod tarafı: Şirket işi isteğinde client UUID `idempotency_key` gönderir; API aynı key ile tekrar gelirse mevcut task’ı döndürür.
