# Subdomain Sorun Raporu — DÜZELTME TAMAMLANDI

## 1. middleware.ts / proxy.ts

- **middleware.ts**: Next.js 16'da deprecated; kullanılmıyor
- **proxy.ts**: VAR — `updateSession` çağırıyor (Next.js 16 proxy convention)
- **lib/supabase/middleware.ts**: VAR — `updateSession` fonksiyonu
- **Not**: Next.js 16'da middleware → proxy yeniden adlandırıldı. proxy.ts kullanılıyor. Ancak bazı ortamlarda (Cloudflare arkası) proxy çalışmayabiliyor. Bu yüzden middleware.ts de eklenecek (export middleware) — Next.js 14/15 uyumluluğu için.

## 2. next.config.js

- Domain/rewrites: Sadece `/manifest.json` → `/api/manifest` rewrite var
- Subdomain ayarı yok

## 3. package.json

- Next.js: ^16.1.6

## 4. Sorunun kök nedeni

`lib/supabase/middleware.ts` satır 20–24:

```ts
const validSubdomains = getValidSubdomains(subdomains)  // ['app.', 'franchise.', 'veli.', 'bjktuzlacimnastik.', ...]
const hasValidSubdomain = validSubdomains.some((s) => hostname.startsWith(s))
if (!isLocal && !isRootSite && !hasValidSubdomain) {
  return NextResponse.redirect(url)  // → app.yisa-s.com
}
```

- **Eski durum**: Yanlış yazım (örn. bjktuzcimnastik) listede olmadığı için eşleşmiyordu
- `hasValidSubdomain` = false
- Sonuç: **app.yisa-s.com'a yönlendirme** → Patron paneli görünüyor

Ayrıca `getPanelFromHost` yalnızca listedeki subdomain'leri franchise_site sayıyor. Listede olmayan subdomain'ler `www` döner.

## 5. Login sayfası

- **app/auth/login/page.tsx** — Tek login sayfası (franchise + patron + veli hepsi kullanır)
- **app/patron/login/page.tsx** — Patron için ayrı login
- Karışma yok; rol çözümleme `resolveLoginRole` ile yapılıyor

---

## ADIM 2–4: Yapılan Düzeltmeler

### lib/subdomain.ts
- **getPanelFromHost**: Artık `*.yisa-s.com` altındaki tüm subdomain'ler (app, www, franchise, veli hariç) `franchise_site` sayılıyor
- **getFranchiseSlugFromHost**: Subdomain base doğrudan slug olarak dönüyor; DB listesine bağlı değil

### lib/supabase/middleware.ts
- **Valid subdomain**: Sadece liste kontrolü yerine `yisa-s.com` veya `*.yisa-s.com` olan hostlar geçerli kabul ediliyor
- `bjktuzlacimnastik.yisa-s.com`, `kartalcimnastik.yisa-s.com` vb. artık app.yisa-s.com'a yönlendirilmiyor

### Sonuç
- `bjktuzlacimnastik.yisa-s.com` → Franchise paneli (/franchise)
- `kartalcimnastik.yisa-s.com` → Franchise paneli
- Liste dışı subdomain'ler de franchise_site olarak işleniyor
