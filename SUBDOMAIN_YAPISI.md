# YİSA-S Subdomain Yapısı

## Vercel'de Eklenecek Domainler

Vercel → Settings → Domains → Add:

| Domain | Açıklama |
|--------|----------|
| bjktuzlacimnastik.yisa-s.com | Tuzla Cimnastik |
| fenerbahceatasehir.yisa-s.com | Ataşehir, Ümraniye, Kurtköy |
| kartalcimnastik.yisa-s.com | Kartal Cimnastik |

DNS (her biri için): CNAME → `cname.vercel-dns.com`

---

## Adresler ve Kullanım

| Adres | Kim | Ne |
|-------|-----|-----|
| **app.yisa-s.com** | Patron | Patron paneli |
| **www.yisa-s.com** | Müşteri (franchise alıcı) | Spor okulları / işletmeler listesi — satacağımız insanlar |
| **bjktuzlacimnastik.yisa-s.com** | Tuzla Cimnastik | Kendi sitesi / panel |
| **fenerbahceatasehir.yisa-s.com** | Ataşehir, Ümraniye, Kurtköy | Kendi sitesi / panel |
| **kartalcimnastik.yisa-s.com** | Kartal Cimnastik | Kendi sitesi / panel |
| **franchise.yisa-s.com** | — | → www.yisa-s.com'a yönlendirilir |
| **veli.yisa-s.com** | Veliler (tesis üyeleri) | Veli paneli — tesis sistemine girerler |

---

## Yeni Franchise Eklemek — Asistan Komutu

**CELF** sayfasında asistan seçip yaz:

```
subdomain ekle: madamfavori
```

veya

```
yeni franchise subdomain madamfavori
```

Sistem otomatik ekler:
- Veritabanına subdomain kaydedilir
- **VERCEL_TOKEN** varsa → Vercel'e domain otomatik eklenir
- Token yoksa → Manuel: Vercel → Domains → `madamfavori.yisa-s.com` (DNS: CNAME → cname.vercel-dns.com)

---

## Akışlar

**Müşteri (franchise alıcı):** www.yisa-s.com → franchise listesi → demo talep → vitrin mağaza (alışveriş) → malzemeler Patron gönderir

**Patron:** app.yisa-s.com → demo onayı, satış onayı, malzeme gönderimi (yisa-s.com)

**Franchise:** onay sonrası şifre → kendi subdomain’i (örn. bjktuzlacimnastik.yisa-s.com)

**Veli (tesis üyesi):** tesis subdomain’i → /auth/login (?t=bjktuzlacimnastik) → /franchise (tesis paneli)

Detay: `VITRIN_MAGAZA_AKIS.md`
