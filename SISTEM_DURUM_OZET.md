# YİSA-S Patron Paneli — Sistem Durum Özeti

**Tarih:** 29 Ocak 2026  
**Sorular:** Şu an sistem ne durumda? Neleri kullanabiliyorum? Neler eksik? Ne yapmalı?

---

## 1. ŞU AN SİSTEM NE DURUMDA?

| Alan | Durum |
|------|--------|
| **Kod (GitHub)** | Repo güncel, main branch, push → Vercel deploy tetikleniyor |
| **Canlı site (Vercel)** | app.yisa-s.com deploy alıyor (env’ler tanımlıysa çalışır) |
| **Supabase** | 8 tablo + view’lar kurulu; Auth açık |
| **Yerel (.env.local)** | URL + ANTHROPIC_KEY var; **Supabase anon key** placeholder ise yerelde giriş açılmaz |
| **Asistan kuralları** | Master Doküman’a göre sabit; .cursor/rules + .cursorrules + ASSISTANT_KURALLARI.md |

**Kısa cevap:** Altyapı hazır; yerelde giriş için Supabase anon key, canlıda Vercel env’ler tam olmalı.

---

## 2. NELERİ KULLANABİLİYORSUN?

### Şu an kullanılabilir (hazırsa)

| Özellik | Nerede | Koşul |
|---------|--------|--------|
| **Giriş / Çıkış** | Anasayfa, Dashboard | Supabase URL + anon key + Auth’ta kullanıcı |
| **Dashboard** | /dashboard | Giriş yaptıktan sonra |
| **Robot sohbeti (Claude)** | Dashboard’da “YİSA-S Robot Asistan” | ANTHROPIC_API_KEY tanımlı |
| **Onay Kuyruğu sayfası** | /dashboard/onay-kuyrugu | Liste API + Supabase approval_queue (RLS uyumluysa) |
| **Franchise’lar sayfası** | /dashboard/franchises | Liste API + Supabase franchises |
| **Kasa Defteri** | /dashboard/kasa-defteri | Liste API + Supabase expenses |
| **Şablonlar** | /dashboard/sablonlar | Liste API + Supabase templates (örnek veriler var) |
| **Raporlar, Mesajlar, Ayarlar, Kullanıcılar, Tesisler, Robotlar** | İlgili menü sayfaları | Sayfalar var; veri bağlantısı API/tablo ile |

### Kullanım için gerekli

- **Yerel:** `.env.local` → `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `ANTHROPIC_API_KEY` dolu olmalı.
- **Canlı:** Vercel → Environment Variables aynı değişkenler + `NEXT_PUBLIC_SITE_URL`.
- **Giriş:** Supabase Authentication → Users’ta en az bir kullanıcı (e-posta + şifre).

---

## 3. NELER EKSİK?

### Kritik (sistem çalışsın diye)

| Eksik | Nerede | Ne yapmalı |
|-------|--------|-------------|
| **Supabase anon key** | .env.local | Placeholder ise Supabase Dashboard → Settings → API → “anon public” kopyala → .env.local’de `NEXT_PUBLIC_SUPABASE_ANON_KEY=` satırına yapıştır |
| **Vercel env’ler** | Vercel Dashboard | Production’da giriş/robot çalışsın istiyorsan: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, ANTHROPIC_API_KEY, NEXT_PUBLIC_SITE_URL ekle |
| **Auth kullanıcısı** | Supabase | Giriş yapabilmek için Authentication → Users’ta bir kullanıcı oluştur |

### İsteğe bağlı (veri / güvenlik)

| Eksik | Ne yapmalı |
|-------|------------|
| **RLS politikaları** | Supabase’te tablolara “Patron/service_role erişebilir” vb. politikalar eklenebilir; yoksa API service_role veya anon ile çalışır |
| **Domain app.yisa-s.com** | Vercel → Settings → Domains’te tanımlı mı kontrol et |
| **Dependabot güvenlik** | GitHub → Security → Dependabot uyarılarını gider (özellikle critical/high) |
| **Ödeme / sözleşme** | Tam “satışa hazır” için: ödeme entegrasyonu, sözleşme metni, destek kanalı |

---

## 4. NE YAPMALI? (Sırayla)

### Hemen (yerel giriş + robot çalışsın)

1. **.env.local — Supabase anon key**  
   - Supabase Dashboard → [Settings → API](https://supabase.com/dashboard/project/bgtuqdkfppcjmtrdsldl/settings/api)  
   - “anon public” key’i kopyala  
   - `.env.local` içinde `NEXT_PUBLIC_SUPABASE_ANON_KEY=SUPABASE_DASHBOARD_ANON_KEY_BURAYA_YAPISTIR` satırını bul, placeholder’ı sil, yapıştır, kaydet.

2. **Supabase — Kullanıcı**  
   - Authentication → Users → “Add user” → e-posta + şifre ile bir kullanıcı oluştur.  
   - Bu hesapla uygulamada giriş yapabilirsin.

3. **Yerel çalıştırma**  
   - `CURSOR_KURULUM_KOMUTLARI.bat` çift tık veya `npm run dev`  
   - http://localhost:3000 → giriş yap → Dashboard → robot sohbeti dene.

### Canlı site (app.yisa-s.com)

4. **Vercel — Env**  
   - Vercel → Proje → Settings → Environment Variables  
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `ANTHROPIC_API_KEY`, `NEXT_PUBLIC_SITE_URL` ekle (Production + Preview istersen).

5. **Vercel — Domain**  
   - Settings → Domains → app.yisa-s.com ekli mi kontrol et; yoksa ekle.

6. **Test**  
   - app.yisa-s.com aç → giriş yap → Dashboard ve robot çalışıyor mu kontrol et.

### İsteğe bağlı

7. **Güvenlik:** Dependabot uyarılarını gider; gerekirse API anahtarlarını yenile.  
8. **RLS:** Supabase’te tablo bazında politikaları ihtiyaca göre ekle.  
9. **Satışa hazırlık:** Ödeme, sözleşme, destek süreçlerini ekle.

---

## 5. ÖZET TABLO

| Soru | Kısa cevap |
|------|------------|
| **Sistem ne durumda?** | Altyapı hazır; GitHub + Vercel + Supabase bağlı; yerelde anon key, canlıda env tam olmalı. |
| **Neleri kullanabiliyorum?** | Giriş, dashboard, robot sohbeti, Onay Kuyruğu, Franchise’lar, Kasa Defteri, Şablonlar sayfaları (env + Auth tam ise). |
| **Neler eksik?** | .env.local’de gerçek Supabase anon key; Vercel’de env’ler; Supabase’te en az bir Auth kullanıcısı; isteğe bağlı RLS, domain, güvenlik. |
| **Ne yapmalı?** | 1) Anon key’i .env.local’e yapıştır. 2) Supabase’te kullanıcı oluştur. 3) Yerelde `npm run dev` ile test et. 4) Vercel’de env + domain kontrol et. 5) Canlıda giriş ve robotu test et. |

---

## 6. TEK SEFERDE BİTİR KOMUTU

**Yöntem 1 — Tek tık:**  
Proje klasöründe **TEK_SEFERDE_BITIR.bat** dosyasına **çift tıklayın**.

Bu dosya sırayla: lock kaldırır → .env.local yoksa oluşturur → npm install → Supabase API + Auth + Vercel sayfalarını tarayıcıda açar → npm run dev başlatır.  
Supabase’ten “anon public” key’i kopyalayıp .env.local’de `NEXT_PUBLIC_SUPABASE_ANON_KEY=` satırına yapıştırmanız ve Auth’ta bir kullanıcı oluşturmanız yeterli.

**Yöntem 2 — PowerShell (tek satır):**

```powershell
cd C:\Users\info\OneDrive\Desktop\YISA_S_APP\yisa-s-app; Remove-Item .git\index.lock -Force -ErrorAction SilentlyContinue; if (-not (Test-Path .env.local)) { Copy-Item .env.example .env.local }; npm install; Start-Process "https://supabase.com/dashboard/project/bgtuqdkfppcjmtrdsldl/settings/api"; Start-Process "https://supabase.com/dashboard/project/bgtuqdkfppcjmtrdsldl/auth/users"; npm run dev
```

---

Detaylı adımlar: **SUAN_DURUM_VE_DEVAM.md**, **SISTEM_AKTIF_KOMUTLARI.md**, **COMMIT_DEPLOY_KONTROL.md**.
