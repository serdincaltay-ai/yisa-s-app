# YiSA-S — tenant-yisa-s

Ana yonetim paneli uygulamasi. Franchise sahipleri, antrenorler, veliler ve Patron icin tek Next.js uygulamasi.

## Canli Adresler

| Uygulama | Domain |
|----------|--------|
| Ana panel (bu repo) | `app.yisa-s.com` / `*.yisa-s.com` |
| Patron CELF komut merkezi | `app-yisa-s` (ayri repo) |
| Vitrin sitesi | `yisa-s.com` |

---

## Repo Haritasi (Guncel)

| Repo | GitHub | Aciklama | Durum |
|------|--------|----------|-------|
| **tenant-yisa-s** | [serdincaltay-ai/tenant-yisa-s](https://github.com/serdincaltay-ai/tenant-yisa-s) | Ana uygulama — Franchise Panel, Veli Portali, Antrenor Paneli, Patron UI (`app.yisa-s.com` + `*.yisa-s.com`) | Aktif |
| **app-yisa-s** | [serdincaltay-ai/app-yisa-s](https://github.com/serdincaltay-ai/app-yisa-s) | Patron CELF komut merkezi — AI gorev dagitimi, 12 direktorluk, Beyin Takimi | Aktif |
| **yisa-s-com** | [serdincaltay-ai/yisa-s-com](https://github.com/serdincaltay-ai/yisa-s-com) | Vitrin / tanitim sitesi (`yisa-s.com`) — Lead generation, demo formu, fiyatlandirma | Aktif |

### Arsivlenmis / Kullanilmayan Repolar

| Repo | Aciklama | Durum |
|------|----------|-------|
| yisa-s-app | tenant-yisa-s'in kopyasi (ayni HEAD commit) | Arsivlenecek |
| yisa-s-app-uh | Eski versiyon (108 dosya, Windows yerel path referanslari) | Arsivlenecek |
| yisa-s | Bos repo (sadece issue template) | Arsivlenecek |

---

## Teknoloji

- **Framework:** Next.js 14 (App Router)
- **Veritabani:** Supabase (PostgreSQL + Auth + RLS)
- **Deploy:** Vercel
- **Dil:** TypeScript

## Kurulum

```bash
git clone https://github.com/serdincaltay-ai/tenant-yisa-s.git
cd tenant-yisa-s
npm install
```

`.env.local` dosyasi olusturun:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

Uygulamayi baslatin:

```bash
npm run dev
```

## Kullanici Rolleri

| Rol | Panel | Yol |
|-----|-------|-----|
| Patron (ROL-0) | Patron Paneli | `/patron/*` |
| Franchise Sahibi (ROL-1) | Franchise Paneli | `/franchise/*`, `/panel/*`, `/kurulum/*` |
| Antrenor (ROL-2) | Antrenor Paneli | `/antrenor/*` |
| Veli (ROL-3) | Veli Portali | `/veli/*` |
