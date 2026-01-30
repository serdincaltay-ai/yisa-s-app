# YİSA-S — Tek seferlik (eski kod + son düzenlemeler)

Bu dosya: **Tek SQL**, **tek komutla başlatma** ve **son eklenen düzenlemeler** (429/ThrottlerException retry, onay kuyruğu iptal, CELF API atamaları) hepsi bir arada.

---

## 1. Tek SQL (bir kez Supabase’de)

**Dosya:** `supabase/YISA-S_TUM_TABLOLAR_TEK_SQL.sql`

- Supabase → **SQL Editor** → dosya içeriğini yapıştır → **Run**.
- İçerik: patron_commands, ceo_tasks, celf_logs, director_rules, onay kuyruğu, awaiting_approval/cancelled, maliyet/satış, roller.

**Eski DB varsa (daha önce SQL çalıştırdıysan) ayrıca:**
- `supabase/migrations/20260130_ceo_tasks_awaiting_approval.sql` → Run
- `supabase/migrations/20260130_ceo_tasks_idempotency.sql` → Run

---

## 2. Tek komut (her seferinde)

**SQL’i bir kez çalıştırdıktan sonra:**

- **A)** `TEK_KOMUTLA_BASLAT.bat` çift tıkla  
  veya  
- **B)** Terminalde: `npm run go`  
  → `npm install` + `npm run dev`; tarayıcıda **http://localhost:3000**

---

## 3. .env.local (bir kez)

Proje kökünde `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
GOOGLE_API_KEY=...
OPENAI_API_KEY=...
ANTHROPIC_API_KEY=...
```

İsteğe bağlı (CELF): `V0_API_KEY`, `CURSOR_API_KEY`, `GITHUB_TOKEN`, `GITHUB_REPO_OWNER`, `GITHUB_REPO_NAME`.

---

## 4. Son eklenen düzenlemeler (kodda zaten var)

- **429 / ThrottlerException / Too Many Requests**  
  Tüm AI API çağrıları (CELF, chat, onay önerisi) artık **429** gelince **3 saniye bekleyip en fazla 2 kez** tekrar deniyor.  
  Dosya: `lib/api/fetch-with-retry.ts`; kullanıldığı yerler: `lib/ai/celf-execute.ts`, `app/api/chat/route.ts`, `app/api/approvals/route.ts`.

- **Onay kuyruğu İptal / Tümünü İptal Et**  
  `/dashboard/onay-kuyrugu`: bekleyen işlerde **Onayla**, **İptal**, **Reddet**; üstte **Tümünü İptal Et** (sadece Patron).  
  API: `POST /api/approvals` → `decision: 'cancel'` (tek iptal) veya `cancel_all: true` (tümünü iptal).

- **CELF 12 direktör + API atamaları**  
  CPO: V0 + Cursor; CTO: Claude + Cursor + GitHub; diğerleri: Gemini orkestratör → GPT/CLaude/Gemini/Together.  
  Doküman: `CELF_MERKEZ_API_ATAMALARI.md`.  
  Çalıştırma: `POST /api/celf` → `run: true` ile gerçek AI çalışır.

- **Tek komutla başlatma**  
  `package.json`: `"go": "npm install && npm run dev"`  
  `TEK_KOMUTLA_BASLAT.bat`: aynı işlem (Windows çift tık).

---

## 5. Kısa sıra

1. SQL’i Supabase’de bir kez çalıştır.  
2. .env.local oluştur, anahtarları yaz.  
3. `TEK_KOMUTLA_BASLAT.bat` veya `npm run go` ile başlat.  
4. http://localhost:3000 aç.

Bu düzenlemelerin hepsi (429 retry, onay iptal, CELF API, tek komut) proje kodunda; ekstra komut çalıştırmana gerek yok.
