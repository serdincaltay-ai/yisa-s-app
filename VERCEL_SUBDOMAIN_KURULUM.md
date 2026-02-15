# Vercel Subdomain Kurulumu — Seçenek A

**Amaç:** app, franchise, veli subdomain'leri aynı projeye yönlendirilir.

## 1. Vercel Proje Ayarları

1. Vercel Dashboard → Projeniz → **Settings** → **Domains**
2. Aşağıdaki domain'leri ekleyin:

| Domain | Açıklama |
|--------|----------|
| `app.yisa-s.com` | Patron Paneli |
| `franchise.yisa-s.com` | Franchise Paneli |
| `veli.yisa-s.com` | Veli Paneli |
| `www.yisa-s.com` | Tanıtım (veya `yisa-s.com`) |

3. Her domain için DNS’te CNAME kaydı:
   - `app` → `cname.vercel-dns.com` (veya Vercel’in verdiği hedef)
   - `franchise` → aynı
   - `veli` → aynı
   - `www` → aynı

## 2. Davranış

| Adres | Giriş yok | Giriş var |
|-------|-----------|-----------|
| `app.yisa-s.com/` | → /auth/login | → /dashboard |
| `franchise.yisa-s.com/` | → /auth/login | → /franchise |
| `veli.yisa-s.com/` | → /auth/login | → /veli |
| `www.yisa-s.com/` | Tanıtım (/) | Tanıtım (/) |

## 3. PWA — Ana Ekrana Ekleme

Her subdomain kendi PWA’sına sahip:

- **app.yisa-s.com** → "YİSA-S Patron Paneli", start: /dashboard
- **franchise.yisa-s.com** → "YİSA-S Franchise Paneli", start: /franchise
- **veli.yisa-s.com** → "YİSA-S Veli Paneli", start: /veli

Franchise müşterisine: "Kendi sitenize (franchise.yisa-s.com) girin → Tarayıcı menüsü → Uygulamayı yükle / Ana ekrana ekle → Oradan yönetin."

## 4. Yerel Test

Subdomain’leri yerelde test etmek için `hosts` dosyasına ekleyin:

```
127.0.0.1 app.localhost
127.0.0.1 franchise.localhost
127.0.0.1 veli.localhost
```

Ardından: `http://app.localhost:3000`, `http://franchise.localhost:3000` vb.
