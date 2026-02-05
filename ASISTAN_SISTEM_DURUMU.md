# Asistan Sistemi Durumu

**Sorularınızın cevapları — Asistanlar, CEO, CELF, yetki, sistem bilgisi**

---

## 1. Asistanlar çalışıyor mu? Her komutu yerine getirecek mi?

**Evet, çalışıyor.** Akış:

1. **Konuşma** (araştırma, soru, bilgi) → Asistan zinciri (GPT, Gemini, Claude, vb.) yanıtlar — CELF'e gitmez
2. **Komut** (yapılacak iş) → CEO → CELF → Sonuç **Patron onayına** gelir
3. **Onay** ("Onaylıyorum", "Evet onayla") → Bekleyen iş onaylanır, push/deploy yapılır

Her komut yerine getirilir — **deploy, push, commit** gibi kritik işler **Patron onayından sonra** uygulanır.

---

## 2. CEO yetkilendirildi mi? CELF ile işleri yapabiliyor mu?

**Evet.** Yetkilendirme:

| Kontrol | Kim | Ne |
|---------|-----|-----|
| **canTriggerFlow** | Patron, Süper Admin, Sistem Admini | CEO/CELF/onay kuyruğunu tetikleyebilir |
| **Patron e-posta** | NEXT_PUBLIC_PATRON_EMAIL | Otomatik flow yetkisi |
| **user_metadata.role** | Patron, Süper Admin, Sistem Admini | Flow yetkisi |

CEO, CELF ile birlikte çalışır:
- **CEO** → Görevi sınıflandırır, direktörlüğe yönlendirir (CFO, CTO, CIO, CMO, vb.)
- **CELF** → Direktörlük görevini çalıştırır (Gemini orkestratör, GPT/Claude/Gemini/Together)
- **Sonuç** → patron_commands, Onay Kuyruğu → Patron onaylar

---

## 3. Sistemin alt hepsiyle ilgili kim bilgi getirecek? Sistemli bilgi geliyor mu?

**Sistem bilgisi kaynakları:**

| Kaynak | Ne döner |
|--------|----------|
| **GET /api/system/status** | Robot hiyerarşisi, direktörlükler, veritabanı, AI servisleri, başlangıç görevleri |
| **GET /api/health** | Env, Supabase, uygulama sağlığı |
| **GET /api/stats** | Franchise, demo, onay kuyruğu, gelir, gider istatistikleri |
| **ceo_franchise_data** | Franchise veri havuzu (CEO/CELF kullanır) |
| **ceo_rules, ceo_templates** | Kurallar, şablonlar |

CELF orkestratörü bu endpoint'leri bilir. **Sistem durumu / genel durum** sorulduğunda (örn. "sistem durumu nedir", "ne durumda") flow otomatik olarak /api/system/status ve /api/health verisini asistan prompt'una enjekte eder — asistan gerçek veriyle yanıt verir.

---

## 4. Onaylayınca düzelir mi?

**Evet.** Patron onayı akışı:

1. Komut → CEO → CELF → Sonuç **Onay Kuyruğu**'na gelir
2. Patron **"Onaylıyorum"** veya **Onay Kuyruğu**'ndan onaylar
3. Onaylanan iş uygulanır (push, deploy, tenant oluşturma, vb.)

Onay Kuyruğu: `/dashboard/onay-kuyrugu`

---

## 5. Özet — Asistan olarak devam

| Soru | Cevap |
|------|-------|
| Asistanlar çalışıyor mu? | Evet |
| Her komut yerine getirilecek mi? | Evet — kritik işler onay sonrası |
| CEO yetkilendirildi mi? | Evet (Patron, Süper Admin, Sistem Admini) |
| CELF ile işleri yapabiliyor mu? | Evet |
| Sistem bilgisi kim getirir? | /api/system/status, /api/health, /api/stats — CELF bunları bilir |
| Onaylayınca düzelir mi? | Evet |

**Sistemi düzeltmek için:** Bu doküman mevcut durumu özetliyor. Eksik veya hatalı gördüğünüz yerleri söyleyin; asistan olarak devam edelim.
