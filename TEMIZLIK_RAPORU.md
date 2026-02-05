# YİSA-S Temizlik Raporu

**Tarih:** 6 Şubat 2026  
**Amaç:** Terminoloji düzeltmesi, çöp ayrımı, sistem tertemiz.

---

## 1. YAPILANLAR

### Terminoloji düzeltmesi
- **Müşteri** = Franchise alıcı (satacağımız insanlar) — www.yisa-s.com
- **Veli** = Tesis üyesi — tesis subdomain’ine girer, tesis sistemine geçer
- "Ziyaretçi" / "Herkes" ifadeleri kaldırıldı, doğru terimler kullanıldı

### Güncellenen dosyalar
- `SUBDOMAIN_YAPISI.md` — Kim, nereye, ne için
- `SISTEM_OZETI.md` — Tek kaynak özet (yeni)

### Test verisi
- `test@test.com` → `demo@yisa-s.com` (TEST_POWERSHELL.ps1, PATRON_VIZYON_VE_CURSOR_HAZIRLIK.md)
- Canlı veriyle karıştırılmaz

### Arşiv
- `backup/` — README eklendi: "Arşiv, karıştırma"

---

## 2. AKTİF SİSTEM (Temiz)

- **chat_messages** — Mevcut sohbet sistemi (Dashboard + CELF) — KALIR
- **patron_commands, ceo_tasks, celf_logs** — Motor tabloları — KALIR
- **tenants, franchises, demo_requests** — Müşteri / franchise — KALIR
- **franchise_subdomains** — Dinamik subdomain — KALIR

Eski/deprecated tablo yok; hepsi kullanımda.

---

## 3. KARISTIRMA — YAPILMAYACAKLAR

- Test verisi canlı seed’e karışmaz
- backup/ ve archive/ referans için; aktif koda taşınmaz
- Şablonlar, içerikler ayrı; bu temizlik onları etkilemez
