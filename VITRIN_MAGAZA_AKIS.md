# Vitrin Mağaza Akışı — www.yisa-s.com

**Müşteri (franchise alıcı) → demo → mağaza → alışveriş → malzeme (Patron gönderir)**

---

## 1. AKIŞ ÖZETİ

```
Müşteri (franchise alıcı)
    ↓
www.yisa-s.com
    ↓
Franchise listesi + Demo bölümü
    ↓
Demo talep VEYA franchise şifre ile giriş
    ↓
Vitrin mağaza — alışveriş (paket, şablon, logo, vb.)
    ↓
Satış → Patron onayı
    ↓
Malzemeleri yisa-s.com / Patron gönderiyor
```

---

## 2. KİM NE YAPIYOR

| Rol | Ne yapar |
|-----|----------|
| **Müşteri** | www.yisa-s.com → demo talep → vitrin mağazada alışveriş |
| **Patron** | Demo onayı, satış onayı, **malzemeleri gönderir** (yisa-s.com) |
| **Franchise** | Onay sonrası şifre alır → kendi subdomain’ine geçer |

---

## 3. MEVCUT DURUM

| Bileşen | Durum | Nerede |
|---------|-------|--------|
| Franchise listesi | Var | www.yisa-s.com ana sayfa |
| Demo talep formu | Var | `/demo`, `/vitrin` → POST /api/demo-requests |
| Vitrin paket seçimi | Var | `/vitrin` — web, logo, şablon, tesis şablonu |
| Demo onay → tenant | Var | Onay Kuyruğu → approve → tenant + geçici şifre |
| COO mağazası satış | Var | /api/sales → celf_kasa, tenant_purchases |
| coo_depo (şablonlar) | Var | drafts → approved → published |
| **Malzeme gönderimi** | Patron manuel | Satış sonrası Patron gönderir |

---

## 4. MALZEME GÖNDERİMİ

**Kim gönderiyor:** yisa-s.com / Patron

- Satış onaylandıktan sonra malzemeler (şablon, logo, site, vb.) Patron tarafından müşteriye gönderilir.
- Bu süreç şu an manuel; ileride otomasyon (e-posta, link, dosya) eklenebilir.

---

## 5. İLERİDE YAPILACAKLAR

1. **Vitrin mağaza tam flow** — Alışveriş sepeti, ödeme, sipariş onayı
2. **Franchise şifre ile demo girişi** — Onaylı müşteri şifre ile demo bölümüne girer, mağazadan alışveriş yapar
3. **Malzeme gönderimi otomasyonu** — Satış onayı → otomatik e-posta / link / dosya

---

## 6. ADRESLER

| Adres | Kim | Ne |
|-------|-----|-----|
| www.yisa-s.com | Müşteri | Franchise listesi, demo, vitrin mağaza |
| www.yisa-s.com/vitrin | Müşteri | Paket seçimi, demo talep |
| www.yisa-s.com/demo | Müşteri | Demo talep formu |
| app.yisa-s.com | Patron | Onay kuyruğu, satış, malzeme gönderimi |
