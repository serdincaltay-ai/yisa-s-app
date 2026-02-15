# YİSA-S — Kim Hangi Sayfaya Girer? (Mevcut Durum Kontrolü)

Aşağıdaki tabloyu kullanarak **bu kişi buraya girecek** şeklinde mevcut durumu kontrol edebilirsiniz.

---

## Giriş adresi ve rol

**Tüm kullanıcılar aynı siteden giriş yapar.** Adres örnekleri:

- Yerel: `http://localhost:3000`
- Canlı: `https://[siteniz].com`

---

## Kim → Hangi sayfa → Hangi URL

| Kim | Giriş URL’si | Giriş sonrası açılan sayfa | Sayfa URL’i |
|-----|----------------|-----------------------------|-------------|
| **Patron (siz)** | `/patron/login` veya `/auth/login` | Komuta merkezi (Dashboard) | `/dashboard` |
| **Franchise / Firma sahibi** (tesis onaylandıktan sonra) | `/auth/login` | Tesis paneli (Franchise Paneli) | `/franchise` |
| **Tesis müdürü / İşletme** | `/auth/login` | Tesis operasyon paneli | `/tesis` |
| **Antrenör** | `/auth/login` | Antrenör paneli | `/antrenor` |
| **Veli** | `/auth/login` | Veli paneli | `/veli` |
| **Vitrin müşterisi** (henüz tesis yok; sadece seçim) | Link ile **vitrin** sayfasına gider, giriş zorunlu değil | Vitrin — paket seçimi | `/vitrin` |

---

## Patron tarafında sayfalar (sadece Patron girer)

| Sayfa | URL | Ne için |
|-------|-----|--------|
| Patron giriş | `/patron/login` | Patron hesabıyla giriş |
| Komuta merkezi (ana sayfa) | `/dashboard` | Chat, özet |
| Onay Kuyruğu | `/dashboard/onay-kuyrugu` | Patron komutları + Demo talepleri (vitrin dahil) |
| Franchise / Vitrin listesi | `/dashboard/franchises` | Açılmış tenant’lar (Beşiktaş, Fenerbahçe vb.) |
| Şablonlar | `/dashboard/sablonlar` | 66 direktörlük şablonu |
| CELF Direktörlükleri | `/dashboard/directors` | Başlangıç görevleri |
| Direktörler (Canlı) | `/dashboard/robots` | Robotlar |
| Kasa Defteri | `/dashboard/kasa-defteri` | Finans |
| Raporlar | `/dashboard/reports` | Raporlar |
| Ayarlar | `/dashboard/settings` | Güvenlik, Patron onayı |

---

## Vitrin (firma sahibi adayı — seçim yapar)

| Sayfa | URL | Kim girer |
|-------|-----|-----------|
| Vitrin — paket seçimi | `/vitrin` | Sizin yönlendirdiğiniz müşteri (giriş zorunlu değil; seçim + form gönderir) |

---

## Firma sahibi / tesis tarafı (tenant onaylandıktan sonra)

| Sayfa | URL | Kim girer |
|-------|-----|-----------|
| Genel giriş | `/auth/login` | Firma sahibi, tesis müdürü, antrenör, veli (hepsi buradan) |
| Franchise paneli (tesis) | `/franchise` | Rol: franchise / firma_sahibi |
| Tesis paneli | `/tesis` | Rol: tesis_sahibi / isletme_muduru |
| Antrenör paneli | `/antrenor` | Rol: antrenor |
| Veli paneli | `/veli` | Rol: veli |

---

## Özet cümleler (kontrol için)

- **Patron:** `/patron/login` veya `/auth/login` (Patron e-postası) → **`/dashboard`**.
- **Firma sahibi:** `/auth/login` (firma sahibi e-postası) → **`/franchise`**.
- **Vitrin müşterisi:** Sizin verdiğiniz link **`/vitrin`** → Seçim yapar, “Seçimleri gönder” der.
- **Tesis müdürü / antrenör / veli:** **`/auth/login`** → Rolüne göre **`/tesis`**, **`/antrenor`** veya **`/veli`**.

Tüm girişler **aynı site** üzerinden; farklı kişiler **aynı giriş sayfası** (`/auth/login` veya Patron için `/patron/login`), **rol**e göre farklı panele düşer.
