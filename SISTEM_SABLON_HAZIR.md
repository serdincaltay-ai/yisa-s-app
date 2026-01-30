# YİSA-S Sistem Şablonu — Kurulum Özeti

**Patron:** Serdinç ALTAY  
**Tarih:** 30 Ocak 2026  

Bu doküman, sistemi çalıştırabilmeniz için **yapmanız gereken adımları** ve **şablonun hazır olduğunu** özetler. Gerekli komutları çalıştırıp .env’i doldurduktan sonra asistanla işlerinize devam edebilirsiniz.

---

## 1. Ön koşul

- **Node.js** (v18+) yüklü olsun.
- **Supabase** projesi açılmış olsun (Dashboard → Project URL + anon key + service role key alınacak).

---

## 2. Kurulum adımları

### 2.1 Proje klasörü ve bağımlılıklar

```bash
cd C:\Users\info\OneDrive\Desktop\YISA_S_APP\yisa-s-app
npm install
```

### 2.2 Ortam değişkenleri (.env.local)

Proje kökünde `.env.local` dosyası oluşturun (veya mevcutsa düzenleyin). En az şunlar olmalı:

```env
# Supabase (zorunlu)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...

# Service role (chat, CEO/CELF, maliyet/satış tabloları yazmak için)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# AI (CELF / Asistan — istediğiniz kadarını doldurun)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=...   veya   GOOGLE_GEMINI_API_KEY=...
```

- **NEXT_PUBLIC_SUPABASE_URL** ve **NEXT_PUBLIC_SUPABASE_ANON_KEY** yoksa uygulama açılmaz.
- **SUPABASE_SERVICE_ROLE_KEY** yoksa API route’lar bazı tablolara yazamaz (patron_commands, celf_logs, celf_cost_reports, patron_sales_prices vb.).

### 2.3 Supabase’de SQL çalıştırma

Supabase Dashboard → **SQL Editor** ile aşağıdaki script’leri **sırayla** çalıştırın (tablolar zaten varsa hata vermez):

1. **Merkez tablolar (CEO, CELF, patron, chat):**  
   `supabase/patron-chat-ceo-tables.sql`  
   `supabase/celf-audit-and-ceo-central.sql`  
   `supabase/robot-system-tables.sql`  
   (Projenizde hangi SQL dosyaları kullanılıyorsa onları çalıştırın.)

2. **CELF maliyet + Patron satış fiyatları:**  
   `supabase/celf-cost-reports-and-sales-prices.sql`

Böylece `celf_cost_reports` ve `patron_sales_prices` tabloları oluşur; CELF maliyet raporu yazıp Patron satış fiyatı belirleyebilirsiniz.

### 2.4 Uygulamayı çalıştırma

```bash
npm run dev
```

Tarayıcıda `http://localhost:3000` açın. Giriş/panel sayfaları projenize göre kullanılır.

---

## 3. Sistem şablonu hazır

- **CELF maliyet raporları:** CFO direktörlüğü "maliyet / finans / bütçe" ile tetiklenir; raporu kalıcı kaydetmek için `POST /api/cost-reports` (Asistan ile veya doğrudan) kullanılır. Bkz. `CELF_MALIYET_SATIS_TEMEL.md`.
- **Patron satış fiyatları:** Maliyeti gördükten sonra `PATCH /api/sales-prices` ile fiyat belirlenir; demo/franchise tarafında `GET /api/sales-prices` ile fiyatlar okunur.
- **API’ler:** Sadece Asistan + CELF AI çağırır; CEO/COO/güvenlik kurallar ve CELF tetiklemesi yapar. Bkz. `API_SADECE_ASISTAN_CELF_KURULUM.md`.

Yukarıdaki adımları uyguladıktan sonra **sistem şablonu kurulmuş olur**; gerekli komutları çalıştırıp .env’i doldurarak asistanla işlerinize devam edebilirsiniz.

---

**Döküman sonu.**
