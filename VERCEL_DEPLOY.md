# Vercel’e Yayınlama (Deploy) — Adım Adım

Projeyi Vercel’e yükleyince size bir link verilir (örn. `https://yisa-s-app.vercel.app`). Bu linki telefondan açıp “Ana ekrana ekle” diyerek uygulama gibi kullanabilirsiniz.

---

## 1. GitHub’a Yükleme (Henüz yoksa)

1. [GitHub](https://github.com) hesabı açın.
2. Yeni repo oluşturun (örn. `yisa-s-app`).
3. Bilgisayarda proje klasöründe:

```bash
cd C:\Users\info\Downloads\serdincaltay-ai-yisa-s-app
git remote add origin https://github.com/KULLANICI_ADINIZ/yisa-s-app.git
git branch -M main
git push -u origin main
```

(KULLANICI_ADINIZ yerine kendi GitHub kullanıcı adınızı yazın.)

---

## 2. Vercel’e Bağlama

1. [vercel.com](https://vercel.com) adresine gidin, **Sign Up** ile GitHub ile giriş yapın.
2. **Add New…** → **Project**.
3. **Import Git Repository** → GitHub’daki `yisa-s-app` reposunu seçin.
4. **Import** deyin.

---

## 3. Ortam Değişkenleri (Environment Variables)

Vercel’de projeyi seçtikten sonra **Settings** → **Environment Variables** bölümüne gidin. Aşağıdakileri ekleyin (değerleri kendi `.env.local` dosyanızdan alabilirsiniz):

| Ad | Değer | Zorunlu |
|----|--------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase proje URL (https://xxx.supabase.co) | Evet |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Anon Key | Evet |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Service Role Key (chat, onay, API için) | Evet |

**İsteğe bağlı (Asistan / CELF için):**

| Ad | Açıklama |
|----|----------|
| `OPENAI_API_KEY` | OpenAI (GPT) |
| `ANTHROPIC_API_KEY` | Anthropic (Claude) |
| `GOOGLE_API_KEY` | Google (Gemini) |

Bunlar yoksa giriş sayfası ve dashboard açılır; asistan cevap vermeyebilir.

---

## 4. Deploy

1. **Deploy** butonuna basın (veya GitHub’a her push’ta otomatik deploy açıksa zaten çalışır).
2. Build bitince size bir link verilir: `https://yisa-s-app-xxx.vercel.app` (veya kendi domain’iniz).

Bu link **canlı sitedir**. Telefondan bu linki açıp **Ana ekrana ekle** diyerek uygulama gibi kullanabilirsiniz.

---

## 5. Sorun Çıkarsa

| Sorun | Çözüm |
|-------|--------|
| Build failed | Vercel → Deployments → ilgili deploy → **Building** log’una bakın. Eksik env var veya TypeScript hatası olabilir. |
| Sayfa açılmıyor / 500 | **Settings** → **Environment Variables** ile `NEXT_PUBLIC_SUPABASE_URL` ve `NEXT_PUBLIC_SUPABASE_ANON_KEY` doğru mu kontrol edin. |
| Giriş yapamıyorum | Supabase Dashboard’da **Authentication** → **URL Configuration** içinde **Site URL** ve **Redirect URLs** listesine Vercel linkinizi ekleyin (örn. `https://yisa-s-app.vercel.app`). |

---

*Son güncelleme: 31 Ocak 2026 — TypeScript ve tsconfig düzeltmeleri yapıldı; build Vercel’de çalışmalı.*
