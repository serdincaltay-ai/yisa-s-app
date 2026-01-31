# YİSA-S TAM SİSTEM AKIŞI — KURULUM RAPORU

**Tarih:** 30 Ocak 2026

Bu rapor, dokümandaki ve sesli anlattığınız mantıkla uyumlu **tam sistem akışının** Cursor’da nasıl kurulduğunu özetler.

---

## 1. MANTIK UYUMU

**Evet, dokümandaki sistem mantığı ile anlattığınız mekanizma aynı.** Kurulan akış:

- **Patron mesaj yazar** → **GPT imla düzeltir** → **“Bu mu demek istediniz?”** + [Evet Şirket İşi] [Evet Özel İş] [Hayır Düzelt]
- **Özel İş** → Asistan (Claude) kendi içinde halleder, **CELF’e gitmez** → İş bitince **“Kaydetmek ister misiniz?”** → Evet → `patron_private_tasks`’a kaydet
- **Şirket İşi** → Claude/CEO alır → CEO CELF’e yönlendirir → CELF direktörlük + AI’lar (GPT/Claude/Gemini/Together) çalışır → Sonuç CEO → Asistan → Patrona sunulur
- **Patron:** [Onayla] [Reddet] [Öneri İste] [Değiştir]
- **Onayla** sonrası: **“Bu görevi nasıl kaydetmek istersiniz?”** [Rutin Görev] [Bir Seferlik]
- **Rutin Görev** → Sıklık (Günlük/Haftalık/Aylık) seçilir → `ceo_routines`’a kaydedilir → **COO** zamanı gelince otomatik çalıştırır

---

## 2. YAPILAN DEĞİŞİKLİKLER

### 2.1 Yeni dosyalar

| Dosya | Açıklama |
|-------|----------|
| `lib/ai/gpt-service.ts` | `correctSpelling()` — imla düzeltme; `askConfirmation()` — “Bu mu demek istediniz?” seçenekleri |
| `lib/ai/claude-service.ts` | `analyze()`, `finalCheck()` — analiz ve son kontrol (CELF/özel iş için kullanılabilir) |
| `lib/ai/gemini-service.ts` | `research()` — araştırma |
| `lib/ai/celf-execute.ts` | `runCelfDirector(directorKey, message)` — CELF direktörlük AI çağrısı (flow + COO ortak) |
| `app/api/coo/run-due/route.ts` | Zamanı gelen `ceo_routines` kayıtlarını CELF ile çalıştırır, `next_run` günceller |

### 2.2 Güncellenen dosyalar

| Dosya | Değişiklik |
|-------|------------|
| `app/api/chat/flow/route.ts` | 1) İlk adım: `confirm_type` yoksa GPT imla düzelt → `spelling_confirmation` dön. 2) `confirm_type: 'company' | 'private'` ile şirket/özel ayrımı. 3) Özel iş: kaydetme yok, `ask_save: true` + `command_used` dön. 4) `save_private: true` + `private_command`, `private_result` ile özel kayıt. 5) CELF çağrısı `lib/ai/celf-execute.ts` üzerinden. |
| `app/api/approvals/route.ts` | `decision: 'suggest'` — öneri metni döner. `save_routine: true` + `schedule` — onaylanmış komuttan `ceo_routines` oluşturur. |
| `app/dashboard/page.tsx` | İmla onay paneli (Şirket/Özel/Hayır Düzelt). Özel iş sonrası “Kaydet?” paneli. Onay sonrası Rutin/Bir seferlik + sıklık paneli. `handleConfirmationChoice`, `handlePrivateSave`. |
| `app/components/PatronApproval.tsx` | **Öneri İste** butonu ve `onSuggest` callback. |

---

## 3. AKIŞ ÖZETİ

### 3.1 İlk adım (her mesajda)

1. Patron mesaj yazar → POST `/api/chat/flow` { message }
2. API: `securityCheck` → `correctSpelling(message)` → **spelling_confirmation** döner.
3. UI: **“Bu mu demek istediniz? [düzeltilmiş metin]”** + [Evet, Şirket İşi] [Evet, Özel İş] [Hayır, Düzelt].

### 3.2 Özel iş

1. Patron **Evet, Özel İş** seçer → POST `/api/chat/flow` { message: düzeltilmiş, confirm_type: 'private' }.
2. API: Claude ile yanıt üretir, **CELF’e gitmez**, **kaydetmez**.
3. Yanıt: `private_done`, `text`, `command_used`, `ask_save: true`.
4. UI: Sonucu gösterir + **“Kaydetmek ister misiniz?”** [Evet, Kaydet] [Hayır, Kaydetme].
5. **Evet, Kaydet** → POST `/api/chat/flow` { save_private: true, private_command, private_result, user_id } → `patron_private_tasks`’a yazılır.

### 3.3 Şirket işi

1. Patron **Evet, Şirket İşi** seçer → POST `/api/chat/flow` { message: düzeltilmiş, confirm_type: 'company' }.
2. API: CEO → CELF (direktörlük + `runCelfDirector`) → Sonuç `patron_commands`’a, Patrona **awaiting_patron_approval**.
3. UI: Sonuç + [Onayla] [Reddet] [Öneri İste] [Değiştir].
4. **Onayla** → POST `/api/approvals` { decision: 'approve', command_id } → UI: **“Bu görevi nasıl kaydetmek istersiniz?”** [Rutin Görev] [Bir Seferlik].
5. **Rutin Görev** → [Günlük] [Haftalık] [Aylık] → POST `/api/approvals` { command_id, save_routine: true, schedule } → `ceo_routines` oluşturulur.
6. **Bir Seferlik** → Sadece onay kaydı kalır, rutin oluşturulmaz.

### 3.4 Öneri İste

- Patron **Öneri İste** tıklar → POST `/api/approvals` { decision: 'suggest', command_id }.
- API: GPT ile mevcut çıktıya göre geliştirme önerileri üretir, döner.
- UI: Önerileri mesaj olarak gösterir.

### 3.5 COO rutin çalıştırma

- **GET veya POST** `/api/coo/run-due` (Vercel Cron veya harici tetikleyici ile periyodik çağrılabilir).
- Zamanı gelen `ceo_routines` kayıtları alınır, her biri için `runCelfDirector(director_key, command_template)` çalıştırılır, `last_result` ve `next_run` güncellenir.

---

## 4. TEST SENARYOLARI

1. **Özel iş:** “Benim için tatil planı araştır” → GPT düzeltir → Özel İş → Asistan cevaplar → Kaydet? → Evet → `patron_private_tasks`’ta kayıt.
2. **Şirket işi:** “Franchise gelir raporu hazırla” → GPT düzeltir → Şirket İşi → CEO → CELF (CFO/CDO) → Rapor Patrona sunulur → Onayla → Rutin/Bir seferlik.
3. **Öneri İste:** Sonuç ekranında Öneri İste → Öneriler gösterilir.
4. **Rutin kayıt:** Onayla → Rutin Görev → Haftalık → Rutin `ceo_routines`’a yazılır; COO `/api/coo/run-due` ile zamanı gelince çalıştırır.

---

## 5. ÖNEMLİ KURALLAR (KODDA UYGULANAN)

- Özel iş **CELF’e gitmez** ve **şirket verisine erişmez**.
- Şirket işi **mutlaka CELF üzerinden** geçer.
- Özel iş kaydı **sadece** Patron “Evet, Kaydet” dediğinde yapılır.
- Rutin görevler **COO** tarafından `/api/coo/run-due` ile çalıştırılır.
- Deploy/commit ve `.env` dokunulmadan bırakıldı.

---

## 6. CURSOR İLE ARADAKİ FARK

- **Mantık:** Anlattığınız akış (GPT düzeltme → Şirket/Özel seçimi → Özel’de “Kaydet?” → Şirket’te CEO → CELF → Onay → Rutin/Bir seferlik) ile kurulan sistem **aynı**.
- **Eksikler giderildi:** GPT imla servisi, şirket/özel UI, özel işte “Kaydet?” ve sadece Evet’te kayıt, CELF gerçek AI çağrısı (celf-execute), CEO→CELF→Patron döngüsü, Öneri İste, Rutin/Bir seferlik UI ve API, COO run-due API.

Bu yapı ile sistem, tarif ettiğiniz mantıkta çalışacak şekilde kurulmuş durumda.
