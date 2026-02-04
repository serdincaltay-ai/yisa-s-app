# API Anahtarları ve Supabase — Durum

**Tarih:** 4 Şubat 2026  
**Özet:** Anahtarlar kaybolmadı. `yisa-s-app/.env.local` içinde hepsi mevcut.

---

## 1. Anahtarlar Nerede?

| Konum | Durum |
|-------|--------|
| **yisa-s-app/.env.local** | ✅ Tüm anahtarlar burada |
| Proje kökü .env.local | Boş (Next.js yisa-s-app'ten çalışır) |
| YISA-S_YEDEK_TEMP/.env.local | Yedek kopya |

---

## 2. yisa-s-app/.env.local İçeriği (Değişken Adları)

| Değişken | Kullanım |
|----------|----------|
| NEXT_PUBLIC_SUPABASE_URL | Supabase proje URL |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Giriş, Auth |
| SUPABASE_URL | API route'lar (yedek) |
| SUPABASE_SERVICE_ROLE_KEY | Yazma işlemleri (patron_commands, vb.) |
| ANTHROPIC_API_KEY | Claude |
| OPENAI_API_KEY | GPT |
| GOOGLE_API_KEY | Gemini |
| TOGETHER_API_KEY | Together.ai |
| GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO | CELF CTO commit |
| VERCEL_TOKEN | Deploy |
| CURSOR_API_KEY, V0_API_KEY | CPO |
| RAILWAY_TOKEN | Railway |
| MANYCHAT_API_KEY | Vitrin lead |
| FAL_API_KEY | Görsel üretim |
| NEXT_PUBLIC_PATRON_EMAIL | Patron e-postası (eklendi) |
| NEXT_PUBLIC_SITE_URL | Domain |

---

## 3. Hiçbir Anahtar Silinmedi

Son yapılan değişikliklerde `.env.local` dosyasına dokunulmadı. Sadece `NEXT_PUBLIC_PATRON_EMAIL` eklendi (kod bunu okuyordu, `.env`'de yoktu).

---

## 4. Supabase Bağlantısı

- **URL:** `https://bgtuqdkfppcjmtrdsldl.supabase.co`
- **Anon key:** Tanımlı
- **Service role key:** Tanımlı

Bağlantı çalışmıyorsa: `npm run dev` yisa-s-app klasöründen çalıştırılıyor mu kontrol edin.

---

## 5. Vercel / Canlı Deploy

Canlı sitede çalışması için Vercel → Proje → Settings → Environment Variables'a aynı değişkenleri ekleyin. `.env.local` sadece yerel geliştirme için kullanılır; Vercel kendi env'ini okur.
