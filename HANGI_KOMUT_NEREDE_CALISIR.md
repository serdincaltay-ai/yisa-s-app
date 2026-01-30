# YİSA-S — Hangi Komut Nerede Çalıştırılır

Bu doküman: **terminal/Windows komutları** ile **uygulama içi komutların (API/akış)** nerede çalıştığını özetler.

---

## 1. Terminal / Windows komutları (nerede çalışır)

Bu komutlar **proje kökünde** (`yisa-s-app` klasöründe) çalıştırılır.

| Komut | Nerede çalıştırılır | Ne yapar |
|-------|---------------------|----------|
| `npm run go` | Proje kökü (terminal) | `npm install` + `npm run dev`; uygulama http://localhost:3000 |
| `npm run dev` | Proje kökü | Next.js geliştirme sunucusunu başlatır |
| `npm run build` | Proje kökü | Next.js production build |
| `npm run start` | Proje kökü | Production sunucuyu başlatır (build sonrası) |
| `TEK_KOMUTLA_BASLAT.bat` | Proje kökü (çift tık) | Aynı işlem: `npm install` + `npm run dev` |
| `git-commit-push.bat` | Proje kökü | Git commit + push (Patron onayı sonrası kullanım) |
| `git-commit-deploy-tam-sistem.bat` | Proje kökü | Commit + push + deploy akışı |
| `CURSOR_KURULUM_KOMUTLARI.bat` | Proje kökü | Cursor kurulum adımları |

**Özet:** Tüm npm ve .bat komutları **proje dizininde** (`cd` ile proje köküne geçtikten sonra) çalıştırılır.

---

## 2. Uygulama içi komutlar — hangi API / nerede

Tarayıcı veya dış sistem uygulamayı **http://localhost:3000** (veya deploy URL) üzerinden çağırır. Komutlar şu API route’larda işlenir:

| Ne / Kim tetikler | API route | Nerede çalışır (kod) | Ne yapar |
|-------------------|-----------|----------------------|----------|
| Patron mesaj (ilk adım) | `POST /api/chat/flow` | `app/api/chat/flow/route.ts` | İmla düzeltme (GPT/Gemini) → "Bu mu demek istediniz?" + [Şirket İşi] [Özel İş] |
| Patron → Özel iş | `POST /api/chat/flow` (confirm_type: private) | `app/api/chat/flow/route.ts` → `callClaude(..., 'asistan')` | Asistan (Claude); CELF’e gitmez |
| Patron → Şirket işi | `POST /api/chat/flow` (confirm_type: company) | `app/api/chat/flow/route.ts` → CEO kuralları → `runCelfDirector()` | CEO (kural) → CELF (AI) → sonuç onay kuyruğuna |
| CELF doğrudan çalıştırma | `POST /api/celf` (body: command, run: true) | `app/api/celf/route.ts` → `runCelfDirector()` | Direktörlük seçimi + gerçek AI çalıştırma (V0, Cursor, Claude, GPT, Gemini, Together) |
| CELF sadece yönlendirme | `POST /api/celf` (run yok veya false) | `app/api/celf/route.ts` | Hangi direktörlüğe gideceği + ai_providers döner; AI çalışmaz |
| Rutin görevler (zamanı gelen) | `GET/POST /api/coo/run-due` | `app/api/coo/run-due/route.ts` → `runCelfDirector()` | ceo_routines’dan vadesi gelenleri alır, CELF ile çalıştırır, next_run günceller |
| Patron onayı (Onayla/Reddet/İptal) | `POST /api/approvals` | `app/api/approvals/route.ts` | command_id + decision; Onayla/Reddet/İptal/Öneri/Değiştir; cancel_all: tümünü iptal |
| Onay kuyruğu listesi | `GET /api/approvals` | `app/api/approvals/route.ts` | Bekleyen işleri (patron_commands, approval_queue vb.) listeler |
| CEO rutin şablonları | `GET/POST /api/ceo/routines` | `app/api/ceo/routines/route.ts` | Rutin tanımları |
| Sağlık kontrolü | `GET /api/health` | `app/api/health/route.ts` | Uygulama ayakta mı |

---

## 3. Komut akışı özeti

```
Patron mesaj
    → POST /api/chat/flow (confirm_type yok)
        → İmla (GPT/Gemini) → "Bu mu demek istediniz?"
    → Patron "Özel iş" seçer
        → POST /api/chat/flow (confirm_type: private)
            → callClaude(..., 'asistan') → Sonuç + "Kaydet?"
    → Patron "Şirket işi" seçer
        → POST /api/chat/flow (confirm_type: company)
            → securityCheck → CEO (routeToDirector, detectTaskType) → CELF (runCelfDirector)
            → Sonuç onay kuyruğuna → Patron dashboard’da Onayla/Reddet/İptal

Rutin (zamanı gelince)
    → GET veya POST /api/coo/run-due
        → getDueCeoRoutines() → her biri için runCelfDirector() → next_run güncelle

Doğrudan CELF (test veya dış tetikleyici)
    → POST /api/celf { command, director_key?, run: true }
        → runCelfDirector(directorKey, command) → AI yanıtı
```

---

## 4. Kısa cevap: “Hangi komut nerede çalışır?”

| Komut türü | Nerede çalışır |
|------------|----------------|
| `npm run go`, `npm run dev`, `.bat` dosyaları | **Proje kökü** (terminal veya Windows’ta proje klasörü) |
| Patron sohbet / özel iş / şirket işi | **POST /api/chat/flow** → kod: `app/api/chat/flow/route.ts` |
| CELF tek komut çalıştırma | **POST /api/celf** (run: true) → kod: `app/api/celf/route.ts` → `lib/ai/celf-execute.ts` |
| Rutin görevler | **GET/POST /api/coo/run-due** → kod: `app/api/coo/run-due/route.ts` |
| Onay / İptal / Tümünü iptal | **POST /api/approvals** → kod: `app/api/approvals/route.ts` |

Bu düzenlemelerin hepsi mevcut proje kodunda; ekstra komut çalıştırmana gerek yok.
