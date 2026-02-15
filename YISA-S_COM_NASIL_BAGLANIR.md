# yisa-s.com Nasıl Bağlanır?

app.yisa-s.com tamam. Şimdi **yisa-s.com** (ana tanıtım sitesi) aynı projeye bağlanacak.

---

## Adım 1 — Vercel'de domain ekle

1. **https://vercel.com** → Giriş yap
2. **YİSA-S projesini** seç
3. **Settings** → **Domains**
4. **Add** butonuna tıkla
5. **yisa-s.com** yaz → Add
6. Tekrar **Add** → **www.yisa-s.com** yaz → Add

---

## Adım 2 — DNS ayarları (domain sağlayıcında)

Domain'i nereden aldıysan (GoDaddy, Namecheap, Cloudflare, Turhost vb.) orada:

### yisa-s.com için:
| Tip | İsim | Değer |
|-----|------|-------|
| **A** | `@` | `76.76.21.21` |
| **CNAME** | `www` | `cname.vercel-dns.com` |

(Vercel, domain eklediğinde size tam değerleri gösterecek — oradaki talimatlara uy.)

### www.yisa-s.com için:
| Tip | İsim | Değer |
|-----|------|-------|
| **CNAME** | `www` | `cname.vercel-dns.com` |

---

## Adım 3 — Doğrulama

1. Vercel'de domain ekledikten sonra **Verify** tıkla
2. DNS yayılımı 5–48 saat sürebilir (genelde 15–30 dk)
3. Yeşil tik görünce hazır

---

## Sonuç

| Adres | Ne gösterir |
|-------|-------------|
| **yisa-s.com** | Ana sayfa (landing, paketler, demo formu) |
| **www.yisa-s.com** | Aynı sayfa |
| **app.yisa-s.com** | Patron paneli / Giriş |

Hepsi **aynı Vercel projesine** bağlı. Tek deploy, üç domain.
