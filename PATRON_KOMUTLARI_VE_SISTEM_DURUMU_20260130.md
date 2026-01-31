# YİSA-S — Patron Komutları + Sistem Durumu (Yedek Referans)

**Tarih:** 30 Ocak 2026  
**Amaç:** Sorun olduğunda buradan devam edebilmek için; şimdiye kadar iletilen tüm komutlar ile sistemin mevcut durumunun kaydı.

---

## 1. Patron tarafından iletilen komutlar / talepler (özet)

1. **Proje yoluna geç:** `cd <proje_yolu>` — Proje yolu olarak `TEK_SEFERLIK_ESKI_KOD.md` dosyasının bulunduğu klasör (yisa-s-app) kullanıldı.
2. **.env.local + CELF/Asistan ayrımı:** Notepad ile `.env.local` açılıp verilen anahtarların yazılması; CELF için ayrı, Asistan için ayrı env dokümanının doldurulması. `.env.local` oluşturuldu; `CELF_MERKEZ_API_ATAMALARI.md` içine "CELF için / Asistan için" .env bölümü eklendi; `GITHUB_REPO_OWNER`, `GITHUB_REPO_NAME` eklendi.
3. **Hangi komut nerede çalışır:** Komutların nerede çalıştığının dokümante edilmesi. `HANGI_KOMUT_NEREDE_CALISIR.md` oluşturuldu (terminal komutları + API route’lar + akış).
4. **Sistem çalışması + Cursor kurulum çakışması:** Sistemi çalıştırma ve deneme; Cursor robotunun kurulum görevinin engellenmesi; asistan robotun çalışmaması/çatışmanın giderilmesi; Cursor robotunun komutla/kuralla kaldırılması. `.cursor/rules/cursor-kurulum-yasak.mdc` eklendi; `SUAN_NE_YAPACAGIM_NASIL_DENEYECEGIM.md` oluşturuldu.
5. **Tüm bilgilerin yedeği:** Şimdiye kadar iletilen tüm komutlar + sistemin şu anki durumu + hazırlanan tüm dosyaların zip ile kaydedilmesi; sorun olduğunda buradan devam edilebilmesi. Bu doküman + proje ZIP yedeği oluşturuldu.

---

## 2. Sistemin şu anki durumu

### 2.1 Çalıştırma

- **Başlatma:** Proje kökünde `npm run go` veya `TEK_KOMUTLA_BASLAT.bat` (çift tık) → http://localhost:3000
- **Ortam:** `.env.local` — Supabase, AI API’ler (OpenAI, Anthropic, Google, Together), GitHub, Vercel, Cursor, V0, Railway, Patron e‑postası, SITE_URL tanımlı
- **Veritabanı:** Supabase; tablolar için `supabase/YISA-S_TUM_TABLOLAR_TEK_SQL.sql` (ve gerekirse migrations) bir kez çalıştırılmalı

### 2.2 Akış

- **Patron mesaj** → POST `/api/chat/flow` → İmla (GPT/Gemini) → "Bu mu demek istediniz?" → Şirket İşi / Özel İş
- **Özel iş** → Asistan (Claude); CELF’e gitmez
- **Şirket işi** → CEO (kural) → CELF (`runCelfDirector`) → Sonuç onay kuyruğuna → Patron Onayla/Reddet/İptal
- **CELF doğrudan:** POST `/api/celf` (body: `command`, `run: true`)
- **Rutinler:** GET/POST `/api/coo/run-due`
- **Onay:** POST `/api/approvals` (Onayla/Reddet/İptal; `cancel_all: true` ile tümünü iptal)

### 2.3 Cursor kuralları (.cursor/rules)

| Dosya | Açıklama |
|-------|----------|
| `api-sadece-asistan-celf.mdc` | API çağrıları sadece Asistan + CELF; CEO/COO/güvenlik API çağırmaz |
| `asistan-sabit.mdc` | Asistan tanımları Master Doküman’a göre sabit |
| `adim-adim-onay.mdc` | Adım adım ilerle; her adımda onay; onaydan sonra tek komut |
| `ilk-adim-gemini-kilit.mdc` | İlk adım imla = Gemini (önce), yedek GPT |
| `kural-degisikligi-patron-onayi.mdc` | Kural değişikliği sadece Patron onayı ile |
| `patron-tek-franchise-ayrim.mdc` | Patron / franchise ayrımı |
| `cursor-kurulum-yasak.mdc` | Cursor (IDE) otomatik kurulum görevi yapmaz; sadece Patron talimatıyla |

### 2.4 Referans dokümanlar (bu yedekte yer alanlar)

- **Kurulum / tek yol:** `TEK_SEFERLIK_ESKI_KOD.md`, `TEK_OZET_YOL.md`, `SUAN_NE_YAPACAGIM_NASIL_DENEYECEGIM.md`
- **Komutlar nerede:** `HANGI_KOMUT_NEREDE_CALISIR.md`
- **Env / CELF–Asistan:** `CELF_MERKEZ_API_ATAMALARI.md`, `API_SADECE_ASISTAN_CELF_KURULUM.md`, `.env.example`
- **Sistem dokümantasyonu:** `YISA-S_KAPSAMLI_SISTEM_DOKUMANTASYONU.md`, `YISA-S-MASTER-DOKUMAN-v2.1-TASLAK.md`
- **Bu yedek özeti:** `PATRON_KOMUTLARI_VE_SISTEM_DURUMU_20260130.md` (bu dosya)

---

## 3. Bu yedekten nasıl devam edilir

1. **ZIP’i aç** → Tüm dosyaları bir klasöre (örn. `yisa-s-app`) çıkar.
2. **.env.local:** ZIP’te varsa aynen kullan; yoksa `.env.example` ve `CELF_MERKEZ_API_ATAMALARI.md` ile yeniden oluştur.
3. **Bağımlılıklar:** Klasörde `npm install` çalıştır (ZIP’te `node_modules` yoksa).
4. **Supabase:** Tablolar yoksa `supabase/YISA-S_TUM_TABLOLAR_TEK_SQL.sql` (ve varsa migrations) çalıştır.
5. **Çalıştırma:** `npm run go` veya `TEK_KOMUTLA_BASLAT.bat` → http://localhost:3000
6. **Adımlar:** `SUAN_NE_YAPACAGIM_NASIL_DENEYECEGIM.md` ve `HANGI_KOMUT_NEREDE_CALISIR.md` takip edilir.

---

## 4. ZIP dosyası

- **Konum:** `c:\Users\info\OneDrive\Desktop\YISA_S_APP\YISA-S_YEDEK_20260130.zip`
- **İçerik:** Proje kökündeki tüm kaynak kod, doküman, config (app, lib, .cursor, supabase, backup, archive vb.); `node_modules`, `.next`, `.git` hariç (boyut / sürüm yönetimi için).
- **`.env.local`:** Proje klasöründeyse ZIP’e dahil edilmiş olabilir; gizli anahtarlar içerir, ZIP’i güvenli yerde tutun.
- **Geri yükleme:** ZIP’i açtıktan sonra `npm install` çalıştırın; `.env.local` yoksa `.env.example` ve `CELF_MERKEZ_API_ATAMALARI.md` ile yeniden oluşturun.

---

**Bu dosya + ZIP, sorun olduğunda “şimdiye kadarki komutlar ve mevcut durum” referansı ve yedek olarak kullanılır.**

© 2026 YİSA-S — Patron: Serdinç ALTAY
