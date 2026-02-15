# YİSA-S — ManyChat Kurulum Rehberi

**Pro Plan üyeliğiniz var.** Bu rehber ManyChat'i YISA-S'e bağlamak için yapmanız gerekenleri listeler.

---

## 1. ManyChat Tarafında Yapılacaklar

### 1.1 API Key Alma

1. **ManyChat Dashboard** → https://app.manychat.com
2. **Settings** (sol menü) → **API**
3. **Generate your API Key** tıklayın
4. Oluşan anahtarı kopyalayın (bir kez gösterilir; kaydedin)

> **Not:** API Key sadece Pro ve üzeri planlarda mevcuttur. Sizde var.

### 1.2 Webhook Kurulumu (Lead / Mesaj gelince YISA-S'e göndermek için)

1. ManyChat → **Settings** → **Webhooks** (veya ilgili bot ayarları)
2. **Webhook URL** alanına yazın:
   ```
   https://[SITENIZ].vercel.app/api/webhooks/manychat
   ```
   Örnek: `https://yisa-s-app.vercel.app/api/webhooks/manychat`
3. **Events** seçin (örnekler):
   - `subscriber_added` — Yeni abone
   - `message_sent` — Mesaj gönderildi
   - `postback` — Buton tıklaması
4. **Webhook Secret** (varsa) kaydedin — imza doğrulama için kullanılacak

### 1.3 Flow'ta External Request (Pro özelliği)

Lead toplama flow'unuzda:
1. **Flow Builder** → **Perform Actions** → **External Request**
2. **URL:** `https://[SITENIZ].vercel.app/api/webhooks/manychat`
3. **Method:** POST
4. **Body:** Subscriber bilgileri (first_name, last_name, email, phone vb.)

---

## 2. YISA-S Projesinde Yapılacaklar

### 2.1 Ortam Değişkenleri (.env.local)

`.env.local` dosyasına ekleyin:

```env
# ManyChat (Pro plan)
MANYCHAT_API_KEY=your_api_key_here
MANYCHAT_WEBHOOK_SECRET=your_webhook_secret_here
```

- `MANYCHAT_API_KEY` — ManyChat Settings → API'den aldığınız anahtar
- `MANYCHAT_WEBHOOK_SECRET` — Webhook ayarlarında varsa; imza doğrulama için

### 2.2 Vercel / Railway Değişkenleri

Canlı sitede çalışması için Vercel/Railway Variables'a da ekleyin:
- `MANYCHAT_API_KEY`
- `MANYCHAT_WEBHOOK_SECRET`

### 2.3 Webhook API Route (Kod)

✅ **Kuruldu.** `app/api/webhooks/manychat/route.ts`
- ManyChat'ten gelen POST isteklerini alır
- İmza doğrulaması (MANYCHAT_WEBHOOK_SECRET varsa)
- Lead → `demo_requests` (source: manychat)
- Migration: `20260204_demo_requests_source_manychat.sql` (TEK_SEFERDE'de)

---

## 3. Kurulum Sırası (Özet)

| Sıra | Kim | Ne Yapılır |
|------|-----|------------|
| 1 | Siz | ManyChat → Settings → API → API Key oluştur |
| 2 | Siz | ManyChat → Webhooks → URL: `https://[siteniz]/api/webhooks/manychat` |
| 3 | Siz | .env.local'e `MANYCHAT_API_KEY` ve `MANYCHAT_WEBHOOK_SECRET` ekle |
| 4 | Geliştirici | `app/api/webhooks/manychat/route.ts` oluştur |
| 5 | Siz | Vercel Variables'a aynı değişkenleri ekle |
| 6 | Siz | Deploy sonrası ManyChat flow'ta External Request ile test |

---

## 4. Nereye Bağlanacak? (Anayasa Uyumu)

| Alan | Açıklama |
|------|----------|
| **Vitrin / demo_requests** | ManyChat'ten gelen lead → `demo_requests` → Patron Onay Kuyruğu |
| **Franchise → Pazarlama** | İleride: ManyChat kampanya gönderimi, lead listesi |

İlk kurulumda **webhook → demo_requests** akışı yeterli. Pazarlama sekmesi sonraki aşamada eklenebilir.

---

## 5. Test

1. ManyChat'te test flow oluşturun
2. External Request ile `POST /api/webhooks/manychat` çağırın
3. YISA-S → Onay Kuyruğu → Demo Talepleri'nde yeni kayıt görünmeli

---

## 6. ManyChat API Dokümantasyonu

- Swagger: https://api.manychat.com/swagger
- Destek: https://support.manychat.com
