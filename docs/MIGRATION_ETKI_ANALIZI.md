# YİSA-S Migration ve Bağlantı Tam Kontrol Raporu

**Tarih:** 15 Şubat 2026  
**Amaç:** Supabase migration değişikliklerinin sayfaları, v0, Vercel ve diğer projeleri etkileyip etkilemediğini doğrulamak.

---

## 1. "Uzak Bağlantı" Nedir?

| Terim | Açıklama |
|------|----------|
| **Uzak bağlantı** | Supabase'in bulutta barındırdığı veritabanı (hosted PostgreSQL). `bgtuqdkfppcjmtrdsldl.supabase.co` |
| **v0 bağlantısı** | v0.dev veya v0-futuristic-dashboard-ng projesi; Patron Paneli. Aynı Supabase'e bağlanır. |
| **Vercel** | Deployment platformu. Her proje (yisa-s-app, yisa-s-website, v0-futuristic-dashboard-ng) Vercel'de deploy edilir; env ile Supabase'e bağlanır. |

**Sonuç:** Üç site de **aynı Supabase projesine** (`bgtuqdkfppcjmtrdsldl`) bağlı. Migration değişikliği tüm siteleri etkiler.

---

## 2. Proje Bağlantı Matrisi

| Klasör | Site | Domain | Repo | Supabase |
|--------|------|--------|------|----------|
| yisa-s.com | Patron Paneli | app.yisa-s.com | v0-futuristic-dashboard-ng | bgtuqdkfppcjmtrdsldl |
| yisa-s-website | Vitrin | yisa-s.com | yisa-s-website | bgtuqdkfppcjmtrdsldl |
| **yisa-s-app** | Franchise | *.yisa-s.com | yisa-s-app | bgtuqdkfppcjmtrdsldl |

---

## 3. Yapılan Migration Değişikliği

### Değişiklik Özeti
- **Tablo:** `robots`
- **Eklenen:** `ai_model VARCHAR(50)` kolonu (`ALTER TABLE robots ADD COLUMN IF NOT EXISTS ai_model`)
- **Gerekçe:** `seed_robots_directorates` migration'ı INSERT sırasında `ai_model` kullanıyor; eski tabloda bu kolon yoktu.

### robots Tablosu Kullanımı (Uygulama Kodu)

| Dosya | Sorgu | ai_model Gerekli? |
|-------|-------|-------------------|
| `app/api/system/status/route.ts` | `supabase.from('robots').select('kod').limit(1)` | Hayır (sadece `kod`) |
| Diğer tüm API'ler | robots tablosu kullanılmıyor | Hayır |

**Sonuç:** Uygulama hiçbir yerde `ai_model` okumuyor veya yazmıyor. Kolon eklenmesi **sayfa/API davranışını değiştirmez**.

---

## 4. robots ile İlgili Bileşenler

| Bileşen | Veri Kaynağı | robots Tablosu? |
|---------|--------------|-----------------|
| `RobotStatusGrid` | `/api/system/health` | Hayır (GPT, Claude, Vercel vb. API key durumları) |
| `app/api/system/status` | `robots.select('kod')` | Evet, sadece bağlantı kontrolü |
| `lib/robots/*` | Sabit tanımlar (hierarchy, celf-center) | Hayır (veritabanı değil) |
| `AssistantChat` | Chat flow | `d.robots` = health API'den gelen liste |

**Sonuç:** robots tablosundan sadece `kod` kolonu okunuyor. `ai_model` eklenmesi mevcut UI/API'yi **etkilemez**.

---

## 5. Migration Listesi (Uygulanacaklar)

Push sırasında uygulanacak migration sırası:

1. `20260131120002_create_robot_tables` — tablolar + **ai_model ALTER**
2. `20260131120003_seed_robots_directorates` — robot/direktörlük seed
3. `20260202120000` – `20260220120000` — diğer tüm migration'lar

---

## 6. Vercel ve Diğer Ortamlar

- **vercel.json:** `crons` içinde `/api/coo/run-due` tanımlı; robots tablosu ile ilgisi yok.
- **Env:** `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` — Supabase bağlantısı. Migration şeması değişmediği sürece env değişikliği gerekmez.

---

## 7. Olası Riskler ve Önlemler

| Risk | Durum | Önlem |
|------|-------|-------|
| robots tablosu yok | Mevcut (CREATE IF NOT EXISTS) | Yok |
| ai_model kolonu yok | Eklendi (ALTER ADD COLUMN IF NOT EXISTS) | Migration repair + push |
| Duplicate schema_migrations | 20260131120002 zaten kayıtlı | `migration repair --status reverted 20260131120002` |
| Diğer tablolar | Değişiklik yok | - |

---

## 8. Doğrulama Adımları

Push sonrası önerilen kontroller:

1. **Supabase SQL Editor:**
   ```sql
   SELECT column_name FROM information_schema.columns WHERE table_name = 'robots' AND column_name = 'ai_model';
   -- 1 satır dönmeli
   SELECT COUNT(*) FROM robots WHERE durum = 'aktif';
   -- 8 olmalı (ROB-PATRON, ROB-CIO, ROB-SIBER, ROB-ARSIV, ROB-CEO, ROB-CELF, ROB-COO, ROB-VITRIN)
   ```

2. **API:**
   - `GET /api/system/status` — 200, database.connected: true
   - `GET /api/system/health` — robots listesi

3. **Sayfalar:**
   - `/dashboard` — RobotStatusGrid yüklenmeli
   - Franchise sayfaları (öğrenci, yoklama, kasa vb.) — normal çalışmalı

---

## 9. Özet

| Soru | Cevap |
|------|-------|
| ai_model eklenmesi sayfaları bozar mı? | **Hayır** |
| v0 / Vercel etkilenir mi? | Sadece şema değişikliği; uygulama kodu aynı kalacak |
| Uzak bağlantı = v0 mı? | Hayır. Uzak bağlantı = Supabase bulut DB. v0 = Patron Paneli repo'su |
| Başka etkilenen kolon var mı? | Hayır; sadece `robots.ai_model` eklendi |

**Sonuç:** Migration güvenli. Push sonrası sistem bozulmayacak.
