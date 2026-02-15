# YİSA-S Sistem Özeti

**Tek kaynak — Ne nedir, kim kime gider, nereye gidiyoruz.**

---

## 1. TERMİNOLOJİ (Karıştırma!)

| Terim | Kim | Ne yapar |
|-------|-----|----------|
| **Müşteri** | Franchise alıcı — satacağımız insanlar | www.yisa-s.com’da franchise listesini görür, demo talep eder |
| **Veli** | Tesis üyesi — sporcunun velisi | Tesis subdomain’ine (örn. bjktuzlacimnastik.yisa-s.com) girer, tesis sistemine geçer |
| **Patron** | Siz | app.yisa-s.com → Patron paneli |
| **Franchise / Tesis** | Satılmış müşteri — aktif işletme | Kendi subdomain’inde kendi paneli |

**Önemli:** "Ziyaretçi" = veli (tesisin üyesi). www.yisa-s.com’daki insanlar = **müşteri** (franchise alıcı).

---

## 2. ADRESLER VE KİM NEREYE GİDER

| Adres | Kim | Ne |
|-------|-----|-----|
| **app.yisa-s.com** | Patron | Patron paneli, CELF, CEO, tüm yönetim |
| **www.yisa-s.com** | Müşteri (franchise alıcı) | Spor okulları / işletmeler listesi — satacağımız insanlar burada |
| **bjktuzlacimnastik.yisa-s.com** (vb.) | Franchise / Tesis + Veli | Tesis kendi sitesi, veliler buradan tesis sistemine girer |
| **veli.yisa-s.com** | Veliler | Veli paneli (tesis üyeleri) |
| **franchise.yisa-s.com** | — | → www.yisa-s.com’a yönlendirilir |

---

## 3. SİSTEM MOTORLARI (İletişim)

- **CELF** — Asistan merkezi, direktörlükler (CFO, CTO, CIO, CMO, vb.)
- **CEO** — Görev organizatörü, onay kuyruğu
- **COO** — Rutin işler, depo, yayın
- **Patron Robot** — Vercel, GitHub, Supabase ajanları
- **Chat** — Dashboard + CELF sohbet → `chat_messages`, `patron_commands`, `celf_logs`

Motorlar arası iletişim: API’ler, tablolar, direktörlük kuralları. Karıştırma — her biri kendi işini yapar.

---

## 4. AKTİF TABLOLAR (Temiz)

| Tablo | Amaç |
|-------|------|
| tenants | Aktif franchise / tesis |
| user_tenants | Kullanıcı–tesis ilişkisi |
| franchise_subdomains | Dinamik subdomain listesi |
| demo_requests | Müşteri demo talepleri |
| franchises | Müşteri adayları / lead’ler |
| chat_messages | Sohbet kayıtları |
| patron_commands | Patron komutları |
| ceo_tasks | CEO görevleri |
| celf_logs | CELF işlem logları |
| celf_kasa | CELF kasa |
| athletes, staff, payments, attendance | Tesis verileri |
| ceo_templates, tenant_templates | Şablonlar |
| robots, celf_directorates | Robot / direktörlük tanımları |

---

## 5. TEST VERİSİ — KARISTIRMA

- `test@test.com` sadece test script’lerinde; canlı veride kullanılmaz.
- Seed / demo verisi ayrı tutulur; karıştırılmaz.

---

## 6. NEREYE GİDİYORUZ

1. **Müşteri** (franchise alıcı) → www.yisa-s.com → franchise listesi → demo talep → vitrin mağaza (alışveriş)
2. **Patron** → app.yisa-s.com → demo onayı, satış onayı, **malzemeleri gönderir** (yisa-s.com)
3. **Franchise** → onay sonrası şifre alır → kendi subdomain’i
4. **Veli** (tesis üyesi) → tesis subdomain’i → tesis paneli

**Vitrin mağaza:** Müşteri demo bölümüne girer (talep veya franchise şifre ile) → alışveriş yapar → malzemeler Patron gönderir.

Detay: `VITRIN_MAGAZA_AKIS.md`

Sistem tertemiz; çöpler archive’da, karıştırma yok.
