# CELF Merkez — API Atamaları (Nerede Hangi API Çalışıyor)

Bu doküman, 12 direktörlüğün hangi dış API'leri kullandığını ve **gerçek çağrının nerede yapıldığını** özetler.

---

## 1. Özel atama (doğrudan API çağrısı)

Bu direktörlüklerde `runCelfDirector` içinde **doğrudan** ilgili API'ler çağrılır; Gemini orkestratörü devreye girmez.

| Direktörlük | Kullanılan API'ler | Kod yeri | .env anahtarları |
|-------------|--------------------|----------|-------------------|
| **CPO** (Ürün) | **V0** (tasarım/UI) + **Cursor** (inceleme) | `lib/ai/celf-execute.ts` → `v0Generate`, `cursorSubmitTask` | `V0_API_KEY`, `CURSOR_API_KEY` |
| **CTO** (Teknoloji) | **Claude** (kod) + **Cursor** (inceleme) + **GitHub** (commit hazırlık, push yok) | `lib/ai/celf-execute.ts` → `callClaude`, `cursorReview`, `githubPrepareCommit` | `ANTHROPIC_API_KEY`, `CURSOR_API_KEY`, `GITHUB_TOKEN`, `GITHUB_REPO_OWNER`, `GITHUB_REPO_NAME` |

---

## 2. Orkestratör üzerinden (Gemini → DELEGATE)

Diğer 10 direktörlük için önce **Gemini** (görevlendirici) çağrılır. Gemini ya doğrudan yanıt verir ya da ilk satırda `DELEGATE:API_ADI` yazar; o API (GPT, CLAUDE, GEMINI, TOGETHER) çağrılır.

| Direktörlük | aiProviders (celf-center) | Dış API ataması (celf-pool) | .env anahtarları |
|-------------|---------------------------|-----------------------------|-------------------|
| CFO | GEMINI, GPT | gpt, gemini | `GOOGLE_API_KEY`, `OPENAI_API_KEY` |
| CIO | GPT | gpt | `OPENAI_API_KEY` |
| CMO | GPT, CLAUDE | gpt, claude | `OPENAI_API_KEY`, `ANTHROPIC_API_KEY` |
| CHRO | CLAUDE | claude | `ANTHROPIC_API_KEY` |
| CLO | CLAUDE | claude | `ANTHROPIC_API_KEY` |
| CSO_SATIS | GPT | gpt | `OPENAI_API_KEY` |
| CDO | GEMINI, GPT | together, gemini, gpt | `GOOGLE_API_KEY`, `OPENAI_API_KEY`, `TOGETHER_API_KEY` |
| CISO | CLAUDE | claude | `ANTHROPIC_API_KEY` |
| CCO | CLAUDE | claude | `ANTHROPIC_API_KEY` |
| CSO_STRATEJI | GPT, GEMINI | gpt, gemini | `GOOGLE_API_KEY`, `OPENAI_API_KEY` |

**Kod:** `lib/ai/celf-execute.ts` → `callGeminiOrchestrator` → `DELEGATE:GPT/CLAUDE/GEMINI/TOGETHER` → `callOpenAI` / `callClaude` / `callGemini` / `callTogether`.

---

## 3. API'lerin çalıştığı yerler

| Yer | Ne yapıyor |
|-----|-------------|
| **`lib/ai/celf-execute.ts`** | `runCelfDirector(directorKey, message)` — Tüm direktörlükler için gerçek AI/API çağrısı burada. CPO/CTO özel; diğerleri Gemini orkestratör. |
| **`app/api/chat/flow/route.ts`** | Patron “Şirket işi” seçince CEO → CELF: `runCelfDirector(directorKey, message)` çağrılır, sonuç Patron’a döner. |
| **`app/api/coo/run-due/route.ts`** | Rutin görevler zamanı gelince `runCelfDirector(director_key, command)` ile çalıştırılır. |
| **`app/api/celf/route.ts`** | POST: `run: true` ile **çalıştırma** (runCelfDirector), yoksa sadece **yönlendirme bilgisi** (director_key, ai_providers) döner. |

---

## 4. Dış API istemci dosyaları

| API | Dosya | Kullanıldığı direktörlük |
|-----|-------|---------------------------|
| V0 (tasarım) | `lib/api/v0-client.ts` | CPO |
| Cursor (kod/inceleme) | `lib/api/cursor-client.ts` | CTO, CPO |
| GitHub (commit hazırlık) | `lib/api/github-client.ts` | CTO (push sadece Patron onayı sonrası) |
| Claude | `lib/ai/celf-execute.ts` (callClaude) | CTO, CMO, CHRO, CLO, CISO, CCO + orkestratör |
| GPT | `lib/ai/celf-execute.ts` (callOpenAI) | CFO, CIO, CMO, CSO_SATIS, CDO, CSO_STRATEJI + orkestratör |
| Gemini | `lib/ai/celf-execute.ts` (callGeminiOrchestrator, callGemini) | Tüm orkestratör + CFO, CDO, CSO_STRATEJI |
| Together | `lib/ai/celf-execute.ts` (callTogether) | CDO + orkestratör |

---

## 5. .env.local: CELF için / Asistan için ayrım

Değerler **.env.local** içinde tutulur; bu dokümanda sadece değişken adları yazılır.

### CELF kullandığı .env değişkenleri

| Kullanım | Değişken(ler) | Açıklama |
|----------|----------------|----------|
| Orkestratör + CFO, CDO, CSO_STRATEJI | `CELF_GOOGLE_API_KEY` veya `GOOGLE_API_KEY` | Gemini |
| GPT (CFO, CIO, CMO, CSO_SATIS, CDO, CSO_STRATEJI) | `CELF_OPENAI_API_KEY` veya `OPENAI_API_KEY` | OpenAI |
| Claude (CTO, CMO, CHRO, CLO, CISO, CCO) | `CELF_ANTHROPIC_API_KEY` veya `ANTHROPIC_API_KEY` | Anthropic |
| Together (CDO) | `CELF_TOGETHER_API_KEY` veya `TOGETHER_API_KEY` | Together |
| CPO: V0 | `V0_API_KEY` | V0 tasarım |
| CPO/CTO: Cursor | `CURSOR_API_KEY` | Cursor inceleme |
| CTO: GitHub | `GITHUB_TOKEN`, `GITHUB_REPO_OWNER`, `GITHUB_REPO_NAME` | Commit hazırlık |
| İsteğe bağlı | `VERCEL_TOKEN`, `RAILWAY_TOKEN` | Deploy (Patron onayı sonrası) |

### Asistan kullandığı .env değişkenleri

| Kullanım | Değişken(ler) | Açıklama |
|----------|----------------|----------|
| İmla (Gemini) | `ASISTAN_GOOGLE_API_KEY` veya `GOOGLE_API_KEY` | gpt-service imla |
| Özel iş (Claude) | `ASISTAN_ANTHROPIC_API_KEY` veya `ANTHROPIC_API_KEY` | callClaude(context='asistan') |
| Chat / imla (GPT) | `ASISTAN_OPENAI_API_KEY` veya `OPENAI_API_KEY` | gpt-service |

**Not:** Aynı anahtarı hem CELF hem Asistan kullanabilir; tek satır (örn. `ANTHROPIC_API_KEY=...`) yeterli. İleride CELF ve Asistan için farklı hesaplar kullanmak istersen `.env.local`'e `CELF_ANTHROPIC_API_KEY` ve `ASISTAN_ANTHROPIC_API_KEY` ayrı yazılır.

---

## 6. Özet

- **CPO:** V0 + Cursor doğrudan.  
- **CTO:** Claude + Cursor + GitHub (commit hazırlık) doğrudan.  
- **Diğer 10:** Gemini orkestratör → DELEGATE ile GPT/CLAUDE/GEMINI/TOGETHER.  
- **Gerçek API çağrısı:** `runCelfDirector` (celf-execute.ts); tetikleyenler: chat/flow ve coo/run-due; isteğe bağlı POST /api/celf?run=true.  
- **Env:** CELF için `CELF_*` (yoksa genel key), Asistan için `ASISTAN_*` (yoksa genel key); değerler `.env.local`'de.
