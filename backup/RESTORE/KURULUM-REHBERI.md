# YİSA-S Kurulum Rehberi

Bu rehber, yedek paketinden YİSA-S sistemini sıfırdan kurmak için adım adım talimatları içerir.

---

## Ön Gereksinimler

- **Node.js** 18+ ve **npm**
- **Supabase** hesabı (https://supabase.com)
- **Git** (isteğe bağlı, deploy için)

---

## 1. Proje Dosyalarını Hazırlama

- Proje kökünde `backup/` klasörü ve içeriği mevcut olmalı.
- Eğer sadece yedek paketi varsa: proje kodunu (Next.js uygulaması) ayrıca indirin veya klonlayın; `backup/` klasörünü proje köküne kopyalayın.

---

## 2. Bağımlılıkları Yükleme

Proje kökünde:

```bash
npm install
```

---

## 3. Veritabanı Tablolarını Oluşturma (Supabase)

1. Supabase Dashboard → **SQL Editor** açın.
2. **Sırayla** aşağıdaki dosyaları açıp **Run** ile çalıştırın:
   - `backup/SQL/01-temel-tablolar.sql` — Tüm tablolar ve indeksler
   - `backup/SQL/02-rls-policies.sql` — RLS politikaları ve trigger'lar
   - `backup/SQL/03-seed-data.sql` — İlk konfigürasyon yedeği (system_backups)

3. Hata almadan tamamlandığını kontrol edin.

---

## 4. Ortam Değişkenleri

1. Proje kökünde `.env.local` dosyası oluşturun (yoksa).
2. `backup/CONFIG/env.example` dosyasını referans alarak aşağıdakileri doldurun:
   - `NEXT_PUBLIC_SUPABASE_URL` — Supabase proje URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon key
   - `ANTHROPIC_API_KEY` — Claude API anahtarı
   - (İsteğe bağlı) `OPENAI_API_KEY`, `GOOGLE_API_KEY`, `TOGETHER_API_KEY`
   - (Servis yazma için) `SUPABASE_SERVICE_ROLE_KEY`
   - (Deploy sonrası) `NEXT_PUBLIC_SITE_URL`

3. `.env.local` dosyasını asla repoya eklemeyin.

---

## 5. Build ve Test

```bash
npm run build
```

Hata yoksa:

```bash
npm run dev
```

Tarayıcıda `http://localhost:3000` açıp giriş/chat/onay akışını test edin.

---

## 6. Sonraki Adımlar

1. **Supabase Auth**: Gerekirse kullanıcı kaydı ve e-posta doğrulama ayarlarını yapın.
2. **Patron kullanıcısı**: İlk giriş için Patron e-posta ile kullanıcı oluşturun; gerekirse `user_metadata.role = 'Patron'` atayın.
3. **Deploy**: Vercel/Railway vb. ile deploy ederken `.env.local` yerine platformun environment değişkenlerini kullanın.
4. **Git**: Otomatik commit/push yapmayın; Patron onayı ile yapın (talimat uyumu).

---

## Dosya Referansları

| Klasör / Dosya | Açıklama |
|----------------|----------|
| `backup/SQL/01-temel-tablolar.sql` | Tüm tablolar |
| `backup/SQL/02-rls-policies.sql` | RLS ve trigger'lar |
| `backup/SQL/03-seed-data.sql` | İlk system_backups kaydı |
| `backup/CONFIG/env.example` | Ortam değişkenleri şablonu |
| `backup/CONFIG/robot-hierarchy.json` | 7 katman hiyerarşi |
| `backup/CONFIG/celf-directors.json` | 12 direktörlük |
| `backup/CONFIG/forbidden-commands.json` | Yasaklı komutlar |
| `backup/CONFIG/role-permissions.json` | 13 rol yetkileri |
| `backup/YISA-S-OMURGA-v1.0.md` | Omurga dokümanı (tam referans) |
| `backup/VERSION.md` | Versiyon ve değişiklik geçmişi |

---

## Tek Tık Kurulum (Windows / Linux-Mac)

- **Windows**: `backup/RESTORE/kurulum.bat` çift tıklayın (npm install + build; SQL ve .env manuel).
- **Linux / Mac**: Terminalde `chmod +x backup/RESTORE/kurulum.sh` sonra `./backup/RESTORE/kurulum.sh` çalıştırın.

Bu scriptler yalnızca bağımlılık ve build adımlarını yapar; Supabase SQL ve `.env.local` sizin tarafınızdan yapılmalıdır.
