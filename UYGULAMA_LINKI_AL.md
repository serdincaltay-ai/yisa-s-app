# Uygulama Linkini Al — Sadece Bunları Yap

Linki almak için **3 adım**. Hepsi bittiğinde Vercel size **tek bir link** verecek; o link senin uygulaman. Telefondan o linki açıp **Ana ekrana ekle** dersen uygulama gibi kullanırsın.

---

## Adım 1 — Projeyi GitHub’a at

1. Tarayıcıda [github.com](https://github.com) aç, giriş yap.
2. Sağ üst **+** → **New repository**.
3. **Repository name:** `yisa-s-app` yaz. **Create repository** de.
4. Bilgisayarda **Bu PC** → **İndirilenler** → **serdincaltay-ai-yisa-s-app** klasörünü aç.
5. Klasörün **içindeyken** üstteki adres çubuğuna tıkla, `cmd` yaz, Enter.
6. Açılan siyah pencerede **şunu** kopyalayıp yapıştır (kendi GitHub kullanıcı adını yaz):

```
git remote add origin https://github.com/BURAYA_GITHUB_KULLANICI_ADINIZI_YAZIN/yisa-s-app.git
git branch -M main
git add -A
git commit -m "Vercel icin hazir"
git push -u origin main
```

**BURAYA_GITHUB_KULLANICI_ADINIZI_YAZIN** yerine kendi kullanıcı adını yaz (örn. serdincaltay).  
Şifre isterse: GitHub’da **Settings** → **Developer settings** → **Personal access tokens** ile token oluşturup onu şifre gibi kullan.

---

## Adım 2 — Vercel’e bağla ve deploy et

1. Tarayıcıda [vercel.com](https://vercel.com) aç.
2. **Sign Up** → **Continue with GitHub** ile giriş yap.
3. **Add New…** → **Project**.
4. Listeden **yisa-s-app** reposunu seç → **Import**.
5. **Deploy** butonuna bas (şimdilik env eklemeden da olur).
6. Birkaç dakika bekle. Bittiğinde yeşil **Visit** veya üstte bir link görürsün:  
   **https://yisa-s-app-xxxxx.vercel.app**  
   **Bu link senin uygulaman.**

---

## Adım 3 — Giriş yapabilmek için (Supabase + env)

Uygulama açılsın ama giriş yapabilsin diye:

1. Vercel’de projeyi aç → **Settings** → **Environment Variables**.
2. Şu üç değişkeni ekle (değerleri kendi Supabase projenden al):

| Name | Value |
|------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase proje URL’in (https://xxx.supabase.co) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Service Role key |

3. **Save** de. Sonra **Deployments** → son deploy’un yanında **⋯** → **Redeploy** yap.

4. Supabase’de: [supabase.com](https://supabase.com) → projen → **Authentication** → **URL Configuration**.  
   **Redirect URLs** listesine Vercel linkini ekle (örn. `https://yisa-s-app-xxxxx.vercel.app`).

Bundan sonra o linkten giriş yapabilirsin.

---

## Özet

| Ne yaptın | Sonuç |
|-----------|--------|
| Adım 1 | Kod GitHub’da. |
| Adım 2 | Vercel linki var → **Bu link senin uygulaman.** |
| Adım 3 | Aynı linkten giriş yapabiliyorsun. |

**Uygulama linkin:** Deploy bittikten sonra Vercel’de gördüğün **https://...vercel.app** adresi. Onu kopyala; telefondan aç, Ana ekrana ekle.
