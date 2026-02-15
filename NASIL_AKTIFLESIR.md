# YİSA-S — Değişiklikleri Nasıl Çalıştırır / Aktifleştirirsiniz?

**Tarih:** 30 Ocak 2026

---

## Kısa cevap

Yaptığımız değişiklikler **zaten kodda**. Uygulamayı normal şekilde çalıştırdığınız anda **aktif** olurlar. Ayrı bir “açma” veya “aktifleştirme” adımı yok.

---

## Adım adım ne yapmalısınız?

### 1. Ortam hazır olsun

- Proje klasörü: `C:\Users\info\OneDrive\Desktop\YISA_S_APP\yisa-s-app`
- Bu klasörde **`.env.local`** dosyası olsun ve en azından şunlar dolu olsun:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `GOOGLE_API_KEY` veya `GOOGLE_GEMINI_API_KEY`
  - `OPENAI_API_KEY`
  - `ANTHROPIC_API_KEY`  
  (Detay için `.env.example` dosyasına bakın.)

### 2. Veritabanı (Supabase)

- Supabase’te tablolar zaten varsa: Sadece **Bölüm 5 ve 6**’daki migration’ları (awaiting_approval + idempotency) SQL Editor’da çalıştırmış olmanız yeterli.
- Tablolar yoksa: `SISTEMI_CALISTIR.md` içindeki **Bölüm 2**’yi uygulayın.

### 3. Uygulamayı çalıştırın

**PowerShell veya CMD** ile:

```bash
cd C:\Users\info\OneDrive\Desktop\YISA_S_APP\yisa-s-app
npm install
npm run dev
```

- İlk kez veya `package.json` değiştiyse: `npm install`
- Her çalıştırmada: `npm run dev`

### 4. Tarayıcıda açın

- Adres: **http://localhost:3000**
- Giriş yapın (Supabase Auth; Patron veya yetkili rol).
- Patron paneli: **http://localhost:3000/dashboard**

Bu noktada **tüm son değişiklikler aktif** olur.

---

## Yeni onay özellikleri nerede kullanılır?

| Ne yaptık? | Nerede kullanılır? |
|------------|--------------------|
| **Dashboard’da onay** | Ana sayfa sohbetinde “Patron Onayı Bekleniyor” çıktığında **Onayla / Reddet / Öneri İste / Değiştir** butonları. |
| **Onay Kuyruğu’nda onay** | Sol menü → **Onay Kuyruğu** → Listede bekleyen işlerin yanında **Onayla** ve **Reddet** butonları. |
| **Onay sonrası GitHub push** | Patron **Onayla** dediğinde, CTO akışında hazırlanan commit varsa otomatik GitHub’a push edilir. |

---

## GitHub push’un çalışması için (isteğe bağlı)

Onay özelliği **GitHub olmadan da** çalışır. Sadece “onay sonrası otomatik push” istiyorsanız `.env.local`’e ekleyin:

- `GITHUB_TOKEN` — GitHub Personal Access Token
- `GITHUB_REPO_OWNER` — repo sahibi (örn. kullaniciadi)
- `GITHUB_REPO_NAME` — repo adı

Bunlar yoksa: Onay/Red işlemleri yine çalışır; sadece commit push edilmez, gerekirse API yanıtında `github_push` ile ilgili mesaj görünür.

---

## Özet

1. `.env.local` + Supabase hazır.
2. `npm install` → `npm run dev`
3. **http://localhost:3000/dashboard** → Giriş yapın.
4. Onay: Dashboard sohbeti veya **Onay Kuyruğu** sayfasından **Onayla / Reddet**.

Ek bir “aktifleştirme” veya “ayar açma” adımı **yok**; uygulama çalışır çalışmaz bu özellikler devrededir.

Daha fazla detay için: **SISTEMI_CALISTIR.md**
