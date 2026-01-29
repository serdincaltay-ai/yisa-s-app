# npm install / build / lint — Sonuç Raporu

**Tarih:** 29 Ocak 2026  
**Proje:** yisa-s-app

---

## 1. npm install

**Sonuç:** ❌ Başarısız (bu ortamda)

**Hata:**
```
npm error code ENOTCACHED
npm error request to https://registry.npmjs.org/@rushstack%2feslint-patch failed: 
cache mode is 'only-if-cached' but no cached response is available.
```

**Sebep:** Bu ortamda (Cursor sandbox) npm ağa çıkamıyor; "only-if-cached" modunda çalışıyor, paketler indirilemedi.

**Ne yapmalı:** Komutları **kendi bilgisayarınızda**, proje klasöründe **PowerShell** veya **CMD** ile çalıştırın (Cursor dışında). Orada `npm install` ağa çıkıp paketleri kuracaktır.

```powershell
cd "C:\Users\info\OneDrive\Desktop\YISA_S_APP\yisa-s-app"
npm install
```

---

## 2. npm run build

**Sonuç:** ⏳ Başladı, zaman aşımına uğradı

**Çıktı (kısmi):**
```
> next build
  ▲ Next.js 14.2.35
  - Environments: .env.local
```

**Durum:** Build başladı, Next.js ve .env.local yüklendi; bu ortamda 3 dakika zaman aşımı nedeniyle kesildi. Kendi terminalinizde çalıştırırsanız tamamlanması gerekir.

**Ne yapmalı:** `npm install` başarılı olduktan sonra:
```powershell
npm run build
```

---

## 3. npm run lint

**Sonuç:** ❌ Başarısız

**Hata:**
```
⨯ ESLint must be installed: npm install --save-dev eslint
```

**Sebep:** `eslint` ve `eslint-config-next` `package.json` içinde tanımlı ama `npm install` bu ortamda çalışmadığı için `node_modules` içine kurulmadı.

**Ne yapmalı:** Önce kendi terminalinizde `npm install` çalıştırın. Ardından:
```powershell
npm run lint
```

---

## Özet

| Komut          | Bu ortamda | Sizin terminalde (npm install sonrası) |
|----------------|------------|----------------------------------------|
| npm install    | ❌         | ✅ Çalıştırın                           |
| npm run build  | ⏳ Zaman aşımı | ✅ Çalıştırın                        |
| npm run lint   | ❌ (eslint yok) | ✅ Çalıştırın                       |

---

## Sizin yapmanız gerekenler

1. **PowerShell** veya **CMD** açın (Cursor dışında).
2. Proje klasörüne gidin:
   ```powershell
   cd "C:\Users\info\OneDrive\Desktop\YISA_S_APP\yisa-s-app"
   ```
3. Sırayla çalıştırın:
   ```powershell
   npm install
   npm run build
   npm run lint
   ```
4. Build veya lint **hata** verirse, hata mesajını kopyalayıp buraya yapıştırın; ona göre düzeltme yapılır.

---

## Kod tarafında düzeltme

Bu ortamda ağ/cache kısıtı olduğu için **kodda bir değişiklik yapılmadı**.  
`package.json` ve `.eslintrc.json` doğru; sorun yalnızca bu ortamda `npm install`’ın çalışmaması.

Kendi terminalinizde build/lint hata verirse, o hata çıktısını paylaşırsanız düzeltmeyi yapabilirim.
