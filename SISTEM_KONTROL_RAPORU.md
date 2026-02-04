# YİSA-S Sistem Kontrol Raporu

**Tarih:** 4 Şubat 2026

---

## 1. Şablonlar Sistemi — Nasıl Çalışır?

### Görüntüleme
- **Sayfa:** `/dashboard/sablonlar`
- **İçerik:** `ceo_templates` tablosundan tüm şablonlar listelenir
- **Modal:** Şablona tıklayınca içerik JSON formatında açılır — **içeriği kontrol edebilirsiniz**
- **Kategori filtresi:** CFO, CLO, CHRO, CMO, CTO, CSO, CSPO, COO, CMDO, CCO, CDO, CISO, RND

### Kim Ne Hazırlıyor?
| Rol | Görev |
|-----|-------|
| **CELF Direktörleri** (CFO, CMO, CTO, vb.) | Şablon içeriğini üretir (rapor, dashboard, email, bildirim) |
| **CEO Robot** | Direktör çıktılarını toplar, Patron onayına sunar |
| **Patron (siz)** | Havuzda onaylarsınız → `ceo_templates`'e kaydedilir |
| **Franchise** | COO Mağazasından şablonu "Kullan" ile alır |

### Formatlar (v0, HT50, vb.)
- **Mevcut format:** JSON (`content` / `icerik` alanı)
- **v0 Studio:** UI şablonları için — `template_type: 'ui'` olanlar v0 prompt’a dönüştürülebilir
- **HT50 / diğer:** İleride `template_type` veya `format` sütunu ile genişletilebilir
- **Komut zinciri:** Şablon hazırlama = CELF görevi → Onay → Kayıt. **Siz sadece push/deploy yaparsınız.**

### Komut Zinciri — Kim Ne Yapar?
1. **Siz (Patron):** "Finans raporu şablonu hazırla" → Gönder
2. **CIO:** Mesajı analiz eder
3. **CEO:** CFO’ya görev atar
4. **CELF/CFO:** Şablon üretir → Havuzda bekler
5. **Siz:** Havuzda "Onayla" → `ceo_templates`'e kaydedilir
6. **Siz:** `git push` → Deploy (gerekirse)

**Düzenleme/düzeltme:** CELF asistanları üzerinden "Şablonu güncelle" komutu verirsiniz → Yine Havuz → Onay → Kayıt.

---

## 2. Patron Paneli — Tasarım

- **Ana sayfa:** `/dashboard` — Sohbet, Havuz, istatistikler, takvim
- **Sidebar:** Ana Sayfa, CELF, Onay Kuyruğu, Franchise, Şablonlar, Raporlar, Ayarlar
- **Mobil:** Sidebar hamburger menü ile açılır; kartlar tek sütun

---

## 3. Asistanlar — Nasıl Çalışır?

- **Robot seçimi:** GPT, Gemini, Claude, Together, V0, Cursor, Supabase, GitHub, Vercel, Railway, Fal
- **Sohbet:** Seçilen robot yanıt verir (LLM veya araç)
- **CEO'ya Gönder:** Son mesaj komut olarak CEO’ya gider → CELF → Havuz
- **Havuz:** Onayla → push, commit, deploy (otomatik)
- **Sistem üzerinden ilerleme:** Evet — tüm işler asistanlar üzerinden; siz sadece onay ve deploy.

---

## 4. Mobil (Telefon) Uyumluluk

- Viewport, PWA meta etiketleri mevcut
- Sidebar mobilde hamburger ile açılır
- Kartlar ve formlar touch-friendly
- `user-scalable: false` kaldırıldı (zoom engeli) — erişilebilirlik için

---

## 5. Hata Kontrolü

- Build: ✅ Başarılı
- API: `/api/templates`, `/api/approvals`, `/api/chat/flow` çalışıyor
- Deploy: Vercel üzerinden otomatik
