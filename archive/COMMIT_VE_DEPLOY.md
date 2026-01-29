# YİSA-S — Commit ve Deploy Adımları

Bu dosyadaki komutları **kendi bilgisayarında, proje klasöründe** çalıştır.

**Önce:** Cursor / VS Code veya başka bir Git aracını kapat. Bazen `.git/index.lock` takılı kalıyor; o varsa sil:

```
del .git\index.lock
```

---

## 1. Commit (değişiklikleri kaydet)

Proje klasöründe PowerShell veya CMD aç:

```bash
cd C:\Users\info\OneDrive\Desktop\YISA_S_APP\yisa-s-app
```

Sonra:

```bash
git add .gitignore app lib GELISTIRME_RAPORU_10_MADDE.md DOMAIN.md ROBOT_GOREVLERI.md COMMIT_VE_DEPLOY.md vercel.json next-env.d.ts next.config.js package.json package-lock.json postcss.config.js tailwind.config.js tsconfig.json
git commit -m "YİSA-S Patron Paneli: 10 maddelik geliştirme (G1+G2+G3) tamamlandı"
```

---

## 2. Push (GitHub'a gönder)

```bash
git push origin main
```

GitHub'a bağlıysa Vercel zaten otomatik deploy alır.  
Deploy'u Vercel / Railway panellerinden kontrol et.

---

## 3. Manuel Deploy (istersen)

**Vercel:**

```bash
npx vercel --prod
```

(Vercel CLI kurulu ve `vercel login` yapılmış olmalı.)

**Railway:**  
Railway projesi GitHub repo'ya bağlıysa push yeterli. Değilse Railway dashboard'dan "Deploy" tetikle.

---

## Yapılan Değişiklikler (özet)

- **G1:** Chat ↔ Router/TaskFlow/Patron Lock, yasak komut engeli, Onayla/Reddet/Değiştir, AI etiketi
- **G2:** Robot hiyerarşisi, FLOW_DESCRIPTION UI, ana panel istatistikleri (Supabase)
- **G3:** Rol bazlı erişim, Siber Güvenlik & Veri Arşivleme modülleri, Mesajlar sayfası

Yeni/ güncellenen klasörler: `lib/assistant`, `lib/auth`, `lib/robots`, `lib/security`, `lib/archiving`, `app/api/stats`, `app/components`, `app/dashboard/*`.
