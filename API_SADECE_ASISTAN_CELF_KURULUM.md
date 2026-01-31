# YİSA-S — API Sadece Asistan + CELF Kurulumu

**Patron:** Serdinç ALTAY  
**Tarih:** 30 Ocak 2026  
**Kural:** API'ler (Claude, GPT, Gemini, Together, V0, Cursor, GitHub, Vercel, Supabase, Railway) **sadece 2 bölümde** çağrılır: **Asistan** + **CELF**. Diğer yerlerde (CEO, COO, güvenlik, direktörlükler vb.) API yok; sadece kurallar, sınırlı komutlar, tayin edilmiş botlar.

---

## 1. Bu kural konuşma zincirini düzeltir mi?

**Evet.** Asistanlar konuşma zinciri şu mantıkla çalışır:

- **Patron mesaj** → İmla (GPT, Asistan tarafı) → Özel/Şirket seçimi  
- **Özel iş** → Asistan içinde API'ler (Claude vb.) → Patron'a sonuç; CELF'e gitmez  
- **Şirket işi** → CEO (sadece kurallar, API yok) → CELF (API'ler burada çalışır) → Patron onayı  

CEO, COO, güvenlik robotu API **çağırmaz**; sadece kurallar ve CELF/Asistan tetiklemesi vardır. Bu yapı konuşma zincirini doğru ve karışıklıksız tutar.

---

## 2. Kurulum durumu (mevcut kod)

| Bölüm | Dosya / yer | API çağrısı? | Uyum |
|-------|-------------|--------------|------|
| **Asistan** | `app/api/chat/flow/route.ts` — imla: `gpt-service` (GPT); özel iş: `callClaude` (Claude) | Evet | ✅ |
| **CELF** | `lib/ai/celf-execute.ts` — `runCelfDirector`, `callClaude`; Claude, GPT, Gemini, Together | Evet | ✅ |
| **CEO** | `lib/robots/ceo-robot.ts` — `detectTaskType` (kural), `routeToDirector` (kural) | Hayır | ✅ |
| **COO** | `app/api/coo/run-due/route.ts` — CELF'i çağırır (`runCelfDirector`); API CELF içinde | Dolaylı (CELF) | ✅ |
| **Güvenlik** | `lib/robots/security-robot.ts` — kurallar, log | Hayır | ✅ |
| **Veri robotu** | `lib/robots/data-robot.ts` — DB işlemleri | Hayır | ✅ |

Kurulum bu kurala göre **uyumlu**. Yeni API çağrısı yalnızca Asistan veya CELF katmanına eklenir.

---

## 3. Referanslar

- **Şema:** `PATRON_ASISTAN_VIZYON_SEMA.md` — Bölüm 8 (API'ler sadece 2 bölümde)
- **Cursor kuralı:** `.cursor/rules/api-sadece-asistan-celf.mdc` — yeni kod bu kurala uyar
- **Flow:** `app/api/chat/flow/route.ts` — konuşma zinciri giriş noktası
- **CELF çalıştırıcı:** `lib/ai/celf-execute.ts` — CELF içi API'ler

---

## 4. Kurulum başlatıldı

- Şemada kural sabitlendi (Bölüm 8).  
- Mevcut akış bu kurala uygun.  
- Cursor kuralı eklendi; ileride CEO/COO/güvenlik vb. yerlerde doğrudan API eklenmez.

**Döküman sonu.**
