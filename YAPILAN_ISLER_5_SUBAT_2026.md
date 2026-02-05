# YİSA-S — 5 Şubat 2026 Yapılan İşler Özeti

## Tamamlanan Görevler

### 1. CELF Chat — Çoklu AI Entegrasyonu
- **GPT, Gemini, Together** API'leri chat API'ye eklendi
- `lib/api/chat-providers.ts` — `callOpenAIChat`, `callGeminiChat`, `callTogetherChat`
- CELF sayfasında asistan seçimine göre ilgili API çağrılıyor
- **V0** seçildiğinde tasarım isteği doğrudan `v0Generate` ile işleniyor
- **Cursor** — kod istekleri CELF CTO üzerinden işlenir (bilgi mesajı)

### 2. CELF Motor — Direktör–AI Atamaları
- `lib/robots/celf-center.ts` — her direktörlük için `aiProviders` tanımlı
- `lib/ai/celf-execute.ts` — birincil/ikincil sırayla provider denemesi
- CPO → V0 + Cursor, CTO → Claude + Cursor + GitHub, CDO → Together + Claude vb.

### 3. Tasarım Robotları
- **V0** — CELF chat'te V0 seçilince tasarım promptu V0 API'ye gidiyor
- **Fal** — `/api/fal/intro-video` mevcut (intro video üretimi)

### 4. Vitrin → Tenant Akışı
- Vitrin talebi onaylandığında:
  - `franchises` kaydı oluşturuluyor
  - `tenant_purchases` — seçilen paket (şablon + tesis şablonu) kaydediliyor
  - Geçici şifre ile kullanıcı oluşturuluyor (mevcut demo-requests akışı)
- `requirePatronOrFlow` — onay ve ödeme kaydı için yetki kontrolü eklendi

### 5. COO Sigorta
- **`/api/coo/health`** — YİSA-S sağlık kontrolü
- Supabase bağlantısı ve temel env kontrolü
- COO bu endpoint'i periyodik çağırarak YİSA-S durumunu izleyebilir

### 6. Veritabanı Şeması
- `20260205_patron_commands_extended.sql` — `type`, `title`, `priority`, `source` kolonları
- `20260205_ticket_no.sql` — migration listesine eklendi
- `run-full-migrations.js` — yeni migration'lar eklendi

---

## Yeni / Güncellenen Dosyalar

| Dosya | Açıklama |
|-------|----------|
| `lib/api/chat-providers.ts` | GPT, Gemini, Together chat çağrıları |
| `app/api/chat/route.ts` | Çoklu AI routing, V0 entegrasyonu |
| `app/api/coo/health/route.ts` | COO sağlık kontrolü |
| `app/api/celf/send-to-ceo/route.ts` | CELF → CEO havuzu (önceki oturumda) |
| `app/api/demo-requests/route.ts` | Vitrin franchise + tenant_purchases, auth |
| `supabase/migrations/20260205_patron_commands_extended.sql` | patron_commands genişletme |
| `scripts/run-full-migrations.js` | Yeni migration'lar |

---

## Yapmanız Gerekenler

1. **Supabase migration'ları çalıştırın:**
   - `20260205_ticket_no.sql`
   - `20260205_patron_commands_extended.sql`
   - veya: `node scripts/run-full-migrations.js`

2. **API anahtarları (.env.local):**
   - `OPENAI_API_KEY` — GPT için
   - `GOOGLE_API_KEY` veya `GOOGLE_GEMINI_API_KEY` — Gemini için
   - `TOGETHER_API_KEY` — Together için
   - `V0_API_KEY` — V0 tasarım için
   - `FAL_API_KEY` veya `FAL_KEY` — Fal video için

3. **COO health:** Vercel Cron veya harici servis ile `/api/coo/health` periyodik çağrılabilir.
