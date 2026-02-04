# YİSA-S — Son Görev / Deploy Kontrol Listesi

**Tarih:** 4 Şubat 2026  
**Patron:** Serdinç ALTAY  
**Durum:** Tam yetki — teslim net

---

## 1. Tamamlananlar

| Madde | Durum |
|-------|--------|
| Migration (staff genişletilmiş, RLS, celf_kasa, tenant_schedule, tenant_purchases) | ✅ |
| Tebrikler / Hoş geldin (Dashboard, Onay Kuyruğu) | ✅ |
| Personel alanları (doğum, adres, il/ilçe, önceki iş, rahatsızlık, araba, dil, temizlik rolü) | ✅ |
| Build (`npm run build`) | ✅ |
| Next.js turbopack root config (next.config.js) | ✅ |
| vercel.json (framework, buildCommand, installCommand) | ✅ |
| Vercel agent (lib/patron-robot/agents/vercel.ts) | ✅ |

---

## 2. Deploy Öncesi Kontrol

### Vercel
1. **Vercel Dashboard** → Proje **yisa-s-app** → Deployments
2. En son deploy **Ready** mı?
3. Ortam değişkenleri: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_PATRON_EMAIL` tanımlı mı?

### Railway (opsiyonel)
- Bu projede Railway kullanılmıyor; backend Next.js API (Vercel'de).

### Supabase
1. **TEK_SEFERDE_YENI_MIGRASYONLAR.sql** çalıştırıldı mı?
2. Auth → Users: Patron e-postası ile kullanıcı var mı?

---

## 3. Bilinen Durumlar

| Konu | Not |
|------|-----|
| **ESLint** | `npm run lint` bazen "Converting circular structure to JSON" hatası verebilir (Next.js + ESLint 9 FlatCompat bilinen sorun). **Build** (`npm run build`) TypeScript kontrolü yapar; deploy için yeterli. |
| **Lockfile uyarısı** | Birden fazla lockfile varsa Next.js uyarı verebilir. `next.config.js` içinde `experimental.turbo.root` ayarlandı. |
| **Relives** | Projede "Relives" servisi yok; Vercel + Railway kullanılıyor. |

---

## 4. Supabase migration (TEK_SEFERDE) — Nasıl çalıştırılır

**A) DATABASE_URL ile (yerelde veya CI):**
```bash
# .env.local içinde DATABASE_URL tanımlı olmalı (bkz. DATABASE_URL_HAZIRLA.md)
npm run db:tek-seferde
```

**B) Supabase SQL Editor (DATABASE_URL yok):**
1. Supabase Dashboard → SQL Editor → New query
2. `supabase/TEK_SEFERDE_YENI_MIGRASYONLAR.sql` dosyasının **tüm içeriğini** kopyala-yapıştır
3. Run

**C) Detay:** `DATABASE_URL_HAZIRLA.md`

---

## 5. Deploy Komutları

```bash
# 1. Değişiklikleri commit + push
git add -A
git commit -m "Son görev: migration, tebrikler, personel alanları, deploy config"
git push origin main

# 2. Vercel otomatik deploy alır (repo bağlıysa)
# 3. Railway: Projeyi Railway'a bağlayın, DATABASE_URL ve diğer env'leri ekleyin (bkz. DATABASE_URL_HAZIRLA.md)
```

---

## 6. Kitap / Doküman Referansları

| Dosya | İçerik |
|-------|--------|
| `TESLIM_DOKUMANI.md` | Teslim özeti, migration, güvenlik |
| `HAZIRLIK_DURUMU.md` | Kim neyi kullanacak, nerede |
| `KAPSAMLI_GELISTIRME_VE_EKSIKLER_RAPORU.md` | Eksikler, yapılacaklar |
| `ANAYASA_SAYFA_MOTORU.md` | Roller, sayfalar, API eşlemesi |
| `ROBOT_ENTEGRASYON_ANAYASA.md` | Robot zinciri, şablonlar |
| `DEPLOY_TAM_KOMUTLAR.md` | Supabase, GitHub, Vercel adımları |
| `CANLI_SITE_ADRESLERI.md` | Canlı linkler, panel URL'leri |

---

## 7. Kompozit Depolar (COO)

Anayasa: Talep → CIO planlama → CEO dağıtım → CELF üretim → **COO depolama** → Patron onayı → Yayınlama.

**Mevcut:** 
- `ceo_templates` — Onaylı şablonlar
- `tenant_purchases` — Franchise satın alımları
- `templates` — Veritabanı şablonları
- COO Mağazası — Şablonlar + robotlar listelenir

**İleride:** COO depo yapısı (drafts / approved / published) ayrı tablolarla genişletilebilir.

---

**Son görev tamamlandı. Deploy için yukarıdaki adımları uygulayın.**
