# Geçmiş Komutlar ve CELF Motor Mimarisi

**Tarih:** 30 Ocak 2026  
**Amaç:** Geçmiş konuşmalarda verilen komutları ve Asistan/CELF mimarisini tek yerde toplamak.

---

## 1. Bulunan Komutlar (Geçmiş Sohbetlerden)

### KOMUT 1: Sistem Altyapı Kontrolü + Dashboard Tasarımı

```
İki görev var, paralel başlat:

GÖREV 1 - ALTYAPI KONTROL:
Sistem durumunu kontrol et:
- Supabase'te hangi tablolar var?
- Chat mesajları kaydoluyor mu?
- Patron komutları loglanıyor mu?
- CELF mekanizması aktif mi?
- Audit log var mı?
Eksikleri listele.

GÖREV 2 - DASHBOARD TASARIM:
V0 ve Cursor'a görev ver:
- V0'dan 3 farklı teknolojik dashboard şablonu al
- YİSA-S marka renklerine uyarla
- Asistan robotu: büyütülebilir, küçültülebilir, sürüklenebilir sohbet penceresi
- Dosya yükleme: ses, video, resim, döküman
- Takvim, saat, ajanda, notlar
- WhatsApp, Instagram entegrasyonu
- 3 versiyon hazırla, ben seçeceğim

Otomatik deploy YAPMA, bana sun.
BAŞLA.
```

---

### KOMUT 2: CELF Motor – Tam AI Entegrasyonu (İki AI Havuzu)

```
CELF MOTOR - TAM AI ENTEGRASYONU

İKİ AYRI AI HAVUZU OLUŞTUR:

1. ASİSTAN AI HAVUZU (lib/ai/assistant-pool.ts)
   - primary: GEMINI, fallback: GPT, CLAUDE
   - Amaç: Patron iletişimi, imla düzeltme, sınıflandırma
   - Anahtarlar: GOOGLE_API_KEY, OPENAI_API_KEY, ANTHROPIC_API_KEY

2. CELF AI HAVUZU (lib/ai/celf-pool.ts)
   - Orkestratör: CELF Gemini (görevlendirme)
   - Direktörlükler:
     CFO → GPT (finans)
     CTO → CLAUDE + CURSOR + GITHUB (kod)
     CPO → V0 + CURSOR (tasarım)
     CDO → TOGETHER (veri)
     CMO, CHRO, CLO, ... diğerleri
   - Deploy: VERCEL_TOKEN, RAILWAY_TOKEN, GITHUB_TOKEN

3. .ENV.LOCAL YAPISI
   # Asistan
   GOOGLE_API_KEY, OPENAI_API_KEY, ANTHROPIC_API_KEY
   # CELF (ayrı key isteğe bağlı)
   CELF_GEMINI_KEY, CELF_OPENAI_KEY, CELF_ANTHROPIC_KEY, CELF_TOGETHER_KEY
   # Dış sistemler
   V0_API_KEY, CURSOR_API_KEY, GITHUB_TOKEN, VERCEL_TOKEN, RAILWAY_TOKEN
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY

4. CELF AKIŞ (lib/ai/celf-execute.ts)
   - CELF Gemini: komutu analiz et → hangi direktörlük(ler) gerekli
   - Her direktörlük kendi API'sini çağırsın (V0, Cursor, Claude, GPT, Together)
   - Sonuçları birleştir → CEO → Patron onayına sun
   - Patron Onayla → GitHub commit, Vercel deploy, Railway deploy
   - Patron Reddet → iptal
   - Patron Düzelt → yeni talimatla CELF'e geri gönder

Otomatik deploy YAPMA. Kodu hazırla, Patron onayı bekle.
BAŞLA.
```

---

## 2. Mimari Özet (Geçmiş Sohbetlerden)

```
PATRON KOMUTU
    ↓
ASİSTAN (Gemini imla + sınıflandırma)  ← ASİSTAN AI HAVUZU
    ↓
CEO (Şirket işi mi, Özel iş mi?)
    ↓
CELF MOTOR (Gemini görevlendirici)     ← CELF AI HAVUZU
    ↓
├─ CFO → GPT (finans)
├─ CTO → Claude + Cursor + GitHub (kod)
├─ CPO → V0 + Cursor (tasarım)
├─ CDO → Together (veri analiz)
└─ ... diğer direktörlükler
    ↓
CELF sonuçları toplar
    ↓
CEO → Patron Onayı (Onayla / Reddet / Düzelt)
    ↓
PATRON onaylarsa → GitHub commit, Vercel deploy, Railway deploy
```

---

## 3. Mevcut Kodda Olanlar (YİSA-S projesi)

| Bileşen | Durum | Dosya |
|--------|--------|--------|
| Asistan (imla, sınıflandırma) | ✅ | `lib/ai/gpt-service.ts`, `lib/ai/gemini-service.ts` |
| CEO (şirket/özel ayrımı, direktör yönlendirme) | ✅ | `lib/robots/ceo-robot.ts` |
| CELF 12 direktörlük (config) | ✅ | `lib/robots/celf-center.ts` |
| CELF çalıştırıcı (Gemini, GPT, Claude, Together) | ✅ | `lib/ai/celf-execute.ts` |
| CELF ayrı anahtarlar (CELF_* fallback) | ✅ | `celf-execute.ts` içinde |
| Flow API (rol guard, ilk adım, tek bekleyen iş, idempotency) | ✅ | `app/api/chat/flow/route.ts` |
| Patron onayı → ceo_tasks güncelleme | ✅ | `app/api/approvals/route.ts` |

---

## 4. CELF Motor Entegrasyonları (Güncel)

| Entegrasyon | Durum | Dosya | Token |
|-------------|--------|--------|--------|
| CELF Pool (direktörlük API config) | ✅ | `lib/ai/celf-pool.ts` | — |
| V0 (tasarım üretimi) | ✅ | `lib/api/v0-client.ts` | V0_API_KEY |
| Cursor (görev/inceleme) | ✅ | `lib/api/cursor-client.ts` | CURSOR_API_KEY |
| GitHub (commit hazırlık / push) | ✅ | `lib/api/github-client.ts` | GITHUB_TOKEN |
| CPO → V0 + Cursor | ✅ | `lib/ai/celf-execute.ts` | — |
| CTO → Claude + Cursor + GitHub hazırlık | ✅ | `lib/ai/celf-execute.ts` | GITHUB_REPO_OWNER, GITHUB_REPO_NAME |
| Vercel / Railway deploy | 🔜 Patron onayı sonrası | — | VERCEL_TOKEN, RAILWAY_TOKEN |

Otomatik deploy yapılmıyor; commit hazırlanır, push ve deploy Patron onayından sonra tetiklenir.

---

## 5. Token Referansı (Geçmiş Komutlardan)

| Token | Kullanım | Nereden |
|-------|----------|--------|
| GOOGLE_API_KEY | Asistan + CELF Gemini | Google AI Studio |
| OPENAI_API_KEY | Asistan yedek + CELF direktörlük | OpenAI |
| ANTHROPIC_API_KEY | Asistan yedek + CELF Claude | Anthropic |
| TOGETHER_API_KEY | CELF veri/analiz | Together AI |
| V0_API_KEY | CELF CPO tasarım | v0.dev |
| CURSOR_API_KEY | CELF CTO/CPO kod/tasarım | cursor.sh |
| GITHUB_TOKEN | Commit/push (Patron onayı sonrası) | github.com → Settings → Developer settings → PAT |
| VERCEL_TOKEN | Deploy (Patron onayı sonrası) | vercel.com → Settings → Tokens |
| RAILWAY_TOKEN | Deploy (Patron onayı sonrası) | railway.app → Settings → Tokens |

İsteğe bağlı (ayrı kota): CELF_GEMINI_KEY, CELF_OPENAI_KEY, CELF_ANTHROPIC_KEY, CELF_TOGETHER_KEY.

---

**Bu dosya:** Geçmiş komutları ve CELF/Asistan mimarisini tek referans olarak tutar. Yeni Cursor sohbetinde "GECMIS_KOMUTLAR_VE_CELF_MIMARISI.md'ye bak, CELF'e V0 ve Cursor entegrasyonu ekle" gibi talimat verebilirsiniz.
