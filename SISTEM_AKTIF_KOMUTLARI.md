# YİSA-S — Tüm Sistemin Aktifleşmesi İçin Gerekli Komutlar

**Amaç:** Yerel + canlı ortamda sistemin tam çalışması için tek seferde yapılacaklar ve komutlar.

---

## ÖN KOŞULLAR (Bir kez yapılır)

### 1. Ortam değişkenleri (.env.local)

Proje kökünde `.env.local` dosyası olmalı; yoksa `.env.example`'ı kopyalayıp değerleri doldurun:

```powershell
cd C:\Users\info\OneDrive\Desktop\YISA_S_APP\yisa-s-app
if (-not (Test-Path .env.local)) { Copy-Item .env.example .env.local; Write-Host ".env.local olusturuldu. Supabase URL, Anon Key ve ANTHROPIC_API_KEY degerlerini girin." -ForegroundColor Yellow } else { Write-Host ".env.local mevcut." -ForegroundColor Green }
```

**.env.local içeriği (örnek):**

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
ANTHROPIC_API_KEY=sk-ant-api03-...
NEXT_PUBLIC_SITE_URL=https://app.yisa-s.com
```

Supabase: Dashboard → Settings → API. Anthropic: console.anthropic.com.

### 2. Supabase (tablolar)

SQL Editor’da `supabase/v2.1-patron-operasyon-tablolari.sql` çalıştırılmış olmalı (tenants + 7 tablo). Zaten yaptınız ✅

### 3. Vercel (canlı site)

Vercel Dashboard → Proje → Settings → Environment Variables:  
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `ANTHROPIC_API_KEY`, `NEXT_PUBLIC_SITE_URL` tanımlı olmalı.  
Domain: app.yisa-s.com bağlı olmalı.

---

## TEK KOMUT — YEREL SİSTEMİ AKTİF ET

Proje klasöründe **PowerShell** veya **CMD** açıp:

### Seçenek A: Batch dosyası (tek tık)

```
C:\Users\info\OneDrive\Desktop\YISA_S_APP\yisa-s-app\CURSOR_KURULUM_KOMUTLARI.bat
```

Bu dosyaya **çift tıklayın**. `npm install` + `npm run dev` çalışır; tarayıcıda http://localhost:3000 açın.

### Seçenek B: PowerShell (tek satır)

```powershell
cd C:\Users\info\OneDrive\Desktop\YISA_S_APP\yisa-s-app; npm install; npm run dev
```

### Seçenek C: CMD (tek satır)

```cmd
cd /d C:\Users\info\OneDrive\Desktop\YISA_S_APP\yisa-s-app && npm install && npm run dev
```

**Sonuç:** Geliştirme sunucusu açılır. http://localhost:3000 ve http://localhost:3000/dashboard çalışır (`.env.local` doluysa giriş + robot aktif).

---

## TEK KOMUT — CANLI SİSTEMİ GÜNCELLE (Deploy tetikle)

Değişiklikleri GitHub’a gönderip Vercel’in otomatik deploy alması için:

```powershell
cd C:\Users\info\OneDrive\Desktop\YISA_S_APP\yisa-s-app
Remove-Item .git\index.lock -Force -ErrorAction SilentlyContinue
git add .
git status
git commit -m "chore: guncelleme"
git push origin main
```

Push sonrası Vercel otomatik deploy alır; birkaç dakika içinde app.yisa-s.com güncellenir.

---

## ÖZET — TÜM SİSTEM AKTİF NE DEMEK?

| Ortam | Gerekli komut / işlem | Kim |
|-------|------------------------|-----|
| **Yerel** | `CURSOR_KURULUM_KOMUTLARI.bat` çift tık **veya** `cd ... ; npm install ; npm run dev` | Siz |
| **.env.local** | Dosya var, Supabase URL + Anon Key + ANTHROPIC_API_KEY dolu | Siz |
| **Supabase** | v2.1 SQL çalıştırıldı (8 tablo) | ✅ Yapıldı |
| **Vercel** | Env’ler tanımlı, domain app.yisa-s.com | Siz (Dashboard) |
| **Canlı güncelleme** | `git push origin main` | Siz |

**Yerel sistemi şu an aktif etmek için:**  
Önce `.env.local` dolu olsun, sonra **CURSOR_KURULUM_KOMUTLARI.bat** çift tıklayın veya yukarıdaki PowerShell/CMD komutunu çalıştırın.
