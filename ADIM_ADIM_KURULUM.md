# YİSA-S — Adım Adım Kurulum (Tek SQL + Komutlar)

Bu doküman: **Şu anki sistemin tek SQL dosyası** ve **sırayla yapman gereken tek tek adımlar**. CELF 12 direktör, API atamaları, onay kuyruğu ve iptal hepsi bu SQL + kodda.

---

## Tek komut (hepsini bir seferde)

**SQL hariç** — SQL’i yalnızca **bir kez** Supabase SQL Editor’da çalıştırırsın. Onun dışında her seferinde:

- **Seçenek A:** Proje klasöründeki **`TEK_KOMUTLA_BASLAT.bat`** dosyasına çift tıkla.  
  → `npm install` + `npm run dev` otomatik çalışır, tarayıcıda **http://localhost:3000** açarsın.

- **Seçenek B:** Terminalde proje klasörüne girip tek komut:  
  **`npm run go`**  
  → Aynı işlem (install + dev).

---

## Tek SQL dosyamız (esquivel / tüm tablolar)

**Dosya:** `supabase/YISA-S_TUM_TABLOLAR_TEK_SQL.sql`

**İçinde ne var:**
- Patron komutu, chat, CEO, CELF, onay kuyruğu tabloları: `patron_commands`, `ceo_tasks`, `celf_logs`, `audit_log`
- Onay bekleyen işler: `patron_commands.status = pending`, `ceo_tasks.status = awaiting_approval` / `cancelled`
- CELF 12 direktörlük altyapısı: `director_rules`, `celf_audit_logs`, `ceo_routines`
- Maliyet / satış: `celf_cost_reports`, `patron_sales_prices`
- Roller: `role_permissions`

**API atamaları** (V0, Cursor, GitHub, Claude, GPT, Gemini, Together) kodda tanımlı; SQL’de sadece tablolar var. Direktör–API eşlemesi: `lib/robots/celf-center.ts` + `lib/ai/celf-execute.ts` + `lib/ai/celf-pool.ts`.

---

## Nasıl çalıştırırsın (adım adım)

### Adım 1 — Supabase’i aç
- Tarayıcıda Supabase projeni aç.
- Sol menüden **SQL Editor**’e gir.

### Adım 2 — Tek SQL’i çalıştır
- Bu projede `supabase/YISA-S_TUM_TABLOLAR_TEK_SQL.sql` dosyasını aç.
- İçeriğin **tamamını** kopyala.
- SQL Editor’e yapıştır.
- **Run** (veya F5) ile çalıştır.
- Hata yoksa: “Success” görürsün; tablolar oluşmuş demektir.

### Adım 3 — Eski veritabanın varsa (daha önce SQL çalıştırdıysan)
Sadece **yeni proje / ilk kez SQL çalıştırdıysan Adım 4’e geç.**

- SQL Editor’de **yeni sorgu** aç.
- `supabase/migrations/20260130_ceo_tasks_awaiting_approval.sql` içeriğini yapıştır → **Run**.
- Yine yeni sorgu aç.
- `supabase/migrations/20260130_ceo_tasks_idempotency.sql` içeriğini yapıştır → **Run**.

### Adım 4 — .env.local oluştur
- Proje kökünde (yisa-s-app klasöründe) `.env.local` dosyası oluştur.
- İçine şunları yaz (kendi değerlerinle doldur):

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
GOOGLE_API_KEY=...
OPENAI_API_KEY=...
ANTHROPIC_API_KEY=...
```

- CELF API’ler (V0, Cursor, GitHub) kullanacaksan ekle: `V0_API_KEY`, `CURSOR_API_KEY`, `GITHUB_TOKEN`, `GITHUB_REPO_OWNER`, `GITHUB_REPO_NAME`.

### Adım 5 — Bağımlılıkları yükle
- Terminali aç.
- Proje klasörüne gir:  
  `cd C:\Users\info\OneDrive\Desktop\YISA_S_APP\yisa-s-app`
- Komutu çalıştır:  
  `npm install`

### Adım 6 — Uygulamayı başlat
- Aynı klasörde:  
  `npm run dev`
- “Ready” yazınca bırakma; çalışır durumda kalsın.

### Adım 7 — Tarayıcıda aç
- Adres: **http://localhost:3000**
- Giriş yap (Supabase Auth ile). Ana sayfa / chat açılır.

### Adım 8 — Onay kuyruğunu dene
- Menüden **Onay Kuyruğu**’na git: **http://localhost:3000/dashboard/onay-kuyrugu**
- Bekleyen işlerde: **Onayla**, **İptal**, **Reddet** butonları görünür.
- Üstte bekleyen varsa: **Tümünü İptal Et** butonu çıkar (sadece Patron).

### Adım 9 — CELF API’yi dene (isteğe bağlı)
- Postman veya benzeri ile:  
  **POST** `http://localhost:3000/api/celf`  
  Body (JSON):  
  `{ "command": "Bütçe özeti", "director_key": "CFO", "run": true }`
- Yanıtta `ok: true` ve `text` gelirse CELF + API’ler çalışıyor demektir.

---

## Kısa özet (ne yaptın)

| Adım | Ne yaptın |
|------|-----------|
| 1–2 | Tek SQL’i Supabase’de çalıştırdın (tüm tablolar). |
| 3 | (Varsa) Eski DB için migration’ları çalıştırdın. |
| 4 | .env.local ile Supabase + API anahtarlarını verdin. |
| 5 | npm install ile paketleri yükledin. |
| 6 | npm run dev ile uygulamayı ayağa kaldırdın. |
| 7 | localhost:3000’de siteyi açtın. |
| 8 | Onay kuyruğunda İptal / Tümünü İptal Et’i kullandın. |
| 9 | (İsteğe bağlı) CELF API’yi test ettin. |

---

## Hangi komutu nerede çalıştırıyorsun

- **SQL:** Sadece Supabase **SQL Editor**’de (tarayıcı).
- **npm install / npm run dev:** Proje klasöründe **PowerShell** veya **CMD**:  
  `C:\Users\info\OneDrive\Desktop\YISA_S_APP\yisa-s-app`

Başka bir şey çalıştırmana gerek yok; kod (12 direktör, API atamaları, onay/iptal) zaten projede. SQL tabloları hazırladı, .env anahtarları verince sistem çalışır.

---

## 429 / ThrottlerException (son düzenleme)

**Too Many Requests** hatası gelirse: AI API çağrıları artık **429** durumunda **3 saniye bekleyip en fazla 2 kez** otomatik tekrar deniyor.  
Dosya: `lib/api/fetch-with-retry.ts`; kullanıldığı yerler: CELF (`celf-execute.ts`), chat, onay önerisi. Ekstra bir şey yapmana gerek yok; hata sürerse birkaç saniye bekleyip tekrar dene.
