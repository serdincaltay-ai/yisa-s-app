# Vercel Domain Ekleme — Adım Adım

**Şifre/auth koduna dokunulmaz.** Sadece Vercel Dashboard ayarları.

---

## 1. Vercel'e Giriş

1. https://vercel.com → Giriş yap
2. **yisa-s-app** projesini aç

---

## 2. Domain Ekleme

1. Proje → **Settings** → **Domains**
2. **Add** tıkla
3. Aşağıdakileri **sırayla** ekle:

| Domain | Durum |
|--------|-------|
| `app.yisa-s.com` | Zaten varsa atla |
| `franchise.yisa-s.com` | Ekle |
| `veli.yisa-s.com` | Ekle |
| `yisa-s.com` | Ekle |
| `www.yisa-s.com` | Ekle |

---

## 3. DNS Ayarları (Domain sağlayıcınızda)

Domain sağlayıcınızda (GoDaddy, Cloudflare, vb.):

| Kayıt | Tip | Hedef |
|-------|-----|-------|
| `app` | CNAME | `cname.vercel-dns.com` |
| `franchise` | CNAME | `cname.vercel-dns.com` |
| `veli` | CNAME | `cname.vercel-dns.com` |
| `www` | CNAME | `cname.vercel-dns.com` |

Vercel, domain ekledikten sonra size tam hedef adresi gösterecek.

---

## 4. Beklenen Davranış (Kod Zaten Hazır)

| Adres | Giriş yok | Giriş var |
|-------|-----------|-----------|
| `app.yisa-s.com` | /auth/login | /dashboard |
| `franchise.yisa-s.com` | /auth/login | /franchise |
| `veli.yisa-s.com` | /auth/login | /veli |
| `yisa-s.com` | Landing (/) | Landing (/) |

---

**Not:** Bu dosya sadece rehber. Şifre, giriş veya Supabase ayarlarına dokunulmaz.
