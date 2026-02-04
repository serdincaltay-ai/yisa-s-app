# YİSA-S — Canlı Site Adresleri (Lokal Yok, Doğrudan Buradan Girin)

Lokal (localhost) kullanmadan **doğrudan canlı sitelere** girmek için adresler aşağıda. Vercel’e deploy ettikten sonra size verilen linki aşağıdaki **[SİTE]** yerine yazın.

---

## Canlı siteler (özet)

| Site | Adres | Açıklama |
|------|-------|----------|
| **Patron paneli** | https://app.yisa-s.com | Ana giriş — tek geçerli domain |
| **Franchise paneli** | https://franchise.yisa-s.com | Tesis yönetimi |
| **Veli paneli** | https://veli.yisa-s.com | Veli / çocuk takibi |
| **Tanıtım** | https://yisa-s.com | Bu proje — landing / tanıtım sayfası |
| **Vercel varsayılan** | https://yisa-s-app.vercel.app | → app.yisa-s.com'a yönlendirilir |
| **Railway (opsiyonel)** | https://xxx.up.railway.app | Yedek/API deploy — Vercel ile aynı kod |

**Not:** `yisa-s.com` ve `www.yisa-s.com` bu sitede kalır, tanıtım sayfası gösterilir. `yisa-s-app.vercel.app` → app.yisa-s.com'a yönlendirilir.

---

## Ana canlı adres

- **Vercel linki (örnek):** `https://yisa-s-app.vercel.app`  
  (Kendi projenizin linki: Vercel → Proje → Domain’ler)
- **Patron paneli:** `https://app.yisa-s.com`
- **Tanıtım (bu proje):** `https://yisa-s.com`

Aşağıdaki tüm adreslerde **[SİTE]** = `https://app.yisa-s.com` (Patron paneli).

---

## Kim nereden girer? (Tam adresler)

| Kim | Buradan girer (tam adres) | Giriş sonrası açılan sayfa |
|-----|----------------------------|-----------------------------|
| **Patron (siz)** | **[SİTE]/patron/login** veya **[SİTE]/auth/login** | Komuta merkezi → **[SİTE]/dashboard** |
| **Firma sahibi** (tesis onaylandıktan sonra) | **[SİTE]/auth/login** | Tesis paneli → **[SİTE]/franchise** |
| **Tesis müdürü** | **[SİTE]/auth/login** | Tesis paneli → **[SİTE]/tesis** |
| **Antrenör** | **[SİTE]/auth/login** | Antrenör paneli → **[SİTE]/antrenor** |
| **Veli** | **[SİTE]/auth/login** | Veli paneli → **[SİTE]/veli** |
| **Vitrin müşterisi** (henüz tesis yok) | **[SİTE]/vitrin** | Paket seçimi (giriş zorunlu değil) |

---

## Örnek (app.yisa-s.com)

| Kim | Adres |
|-----|--------|
| Patron | https://app.yisa-s.com/patron/login |
| Patron giriş sonrası | https://app.yisa-s.com/dashboard |
| Firma sahibi / Tesis / Antrenör / Veli giriş | https://app.yisa-s.com/auth/login |
| Firma sahibi giriş sonrası | https://app.yisa-s.com/franchise |
| Vitrin (müşteri seçim sayfası) | https://app.yisa-s.com/vitrin |
| Ana sayfa | https://app.yisa-s.com |

---

## Müşteri tesisin seçtiği “web sitesi” yapıldığında nerede girer?

- Vitrinde müşteri **web + logo + şablon** seçip onay aldıktan sonra, **tesise özel ayrı bir domain** (örn. besiktas.com) şu an otomatik açılmıyor.
- **Mevcut yapı:** Tesis (firma sahibi) **aynı canlı siteden** giriş yapar:
  - **[SİTE]/auth/login** → e-posta + şifre → rol “firma sahibi” ise **[SİTE]/franchise** açılır.
- Yani “yapılan web sitesi” = o tesisin **Franchise paneli** (aynı [SİTE], path `/franchise`). Müşteri size ödeme yaptıktan sonra ona verdiğiniz giriş bilgisiyle **[SİTE]/auth/login** adresinden girer; açılan sayfa **[SİTE]/franchise** olur.
- İleride her tesis için ayrı subdomain (örn. besiktas.yisa-s.com) veya ayrı public sayfa açılırsa, o zaman “tesisin web sitesi” adresi ayrıca verilir; şu an tek sitede herkes **path** ile ayrılıyor.

---

## Özel domain + subdomain kullanıyorsanız

Domain’iniz **yisa-s.com** ve DNS’te subdomain’leri ayarladıysanız:

| Kim | Adres |
|-----|--------|
| Patron | https://app.yisa-s.com (veya https://yisa-s.com/patron/login) |
| Firma sahibi / Tesis | https://franchise.yisa-s.com (veya https://yisa-s.com/auth/login) |
| Veli | https://veli.yisa-s.com |
| Ana sayfa / Vitrin | https://yisa-s.com veya https://www.yisa-s.com |

---

## Kısa özet

- **Lokal gerekmez.** Doğrudan canlı linki (Vercel veya kendi domain) kullanın.
- **Patron:** [SİTE]/patron/login → dashboard.
- **Firma sahibi / tesis:** [SİTE]/auth/login → franchise (veya tesis/antrenör/veli).
- **Vitrin müşterisi:** [SİTE]/vitrin.
- **Tesisin “yapılan sitesi”:** Şu an aynı sitede **[SİTE]/franchise**; giriş **[SİTE]/auth/login**.

[SİTE] yerine kendi Vercel veya domain adresinizi yazmanız yeterli.
