# YİSA-S Robot Sistemi – Test ve Doğrulama

## Kurulum (Supabase)

1. Supabase SQL Editor'da sırayla çalıştırın:
   - `supabase/patron-chat-ceo-tables.sql` (zaten varsa atlayın)
   - `supabase/robot-system-tables.sql` → `routine_tasks`, `task_results`, `security_logs` tabloları

## Akış Doğrulama

### 1. Mesaj → CEO'ya gidiyor mu?

- **API:** `POST /api/ceo`  
  Body: `{ "message": "Gelir raporu hazırla", "user_id": "..." }`  
- **Beklenen:** `task_type`, `director_key` (CFO), `ceo_task_id`, `ok: true`

### 2. CEO → Doğru direktörlüğe yönlendiriyor mu?

- `POST /api/ceo` ile: "Kampanya planla" → `director_key: "CMO"`  
- "Sözleşme kontrol et" → `director_key: "CLO"`  
- "Sistem durumu" → `director_key: "CTO"`

### 3. CELF → Doğru AI sağlayıcıları dönüyor mu?

- **API:** `POST /api/celf`  
  Body: `{ "command": "Bütçe raporu", "director_key": "CFO" }`  
- **Beklenen:** `ai_providers: ["GPT", "GEMINI"]`, `director_name: "Finans"`

### 4. Sonuç → Kaydediliyor mu?

- **API:** `POST /api/chat/flow`  
  Body: `{ "message": "Kısa bir rapor özeti ver", "user_id": "..." }`  
- **Beklenen:** Yanıt döner; `task_results` tablosunda yeni kayıt (Supabase’te kontrol edin).

### 5. Onay → İşlem tamamlanıyor mu?

- `POST /api/chat/flow` ile onay gerektiren bir iş → `status: "awaiting_patron_approval"`, `command_id` döner.  
- Patron onayı: `PATCH /api/approvals` veya mevcut onay paneli ile `approve`/`reject`/`modify`.

### 6. Rutin → Kaydediliyor mu?

- **Rutin oluşturma:**  
  `POST /api/routine`  
  Body: `{ "task_type": "rapor", "director_key": "CDO", "command": "Günlük özet raporu", "schedule": "daily", "schedule_time": "09:00", "created_by": "..." }`  
  **Beklenen:** `ok: true`, `id` (routine_tasks’a kayıt).

- **Zamanı gelen rutinler:**  
  `GET /api/routine?due=true`  
  **Beklenen:** `data: [...]` (next_run <= now olan kayıtlar).

- **Rutin tamamlandı:**  
  `POST /api/routine/complete`  
  Body: `{ "id": "<routine_task_id>" }`  
  **Beklenen:** `ok: true`, `next_run` güncellenir.

### 7. Güvenlik

- **Kontrol:**  
  `POST /api/security`  
  Body: `{ "message": "git push yap" }`  
  **Beklenen:** `allowed: false`, `blocked: true`, `severity: "acil"`.

- **Log listesi:**  
  `GET /api/security?limit=50`  
  **Beklenen:** `data: [...]` (security_logs kayıtları).

## Dosya Özeti

| Bileşen | Dosya |
|--------|--------|
| Hiyerarşi | `lib/robots/hierarchy.ts` |
| CEO | `lib/robots/ceo-robot.ts` – detectTaskType, routeToDirector, isRoutineRequest, getRoutineScheduleFromMessage |
| CELF 12 Direktörlük | `lib/robots/celf-center.ts` – tetikleyiciler, aiProviders, hasVeto |
| COO | `lib/robots/coo-robot.ts` – getDueRoutines, markRoutineRun |
| Siber Güvenlik | `lib/robots/security-robot.ts` – securityCheck |
| Veri Arşivleme | `lib/robots/data-robot.ts` – archiveTaskResult |
| DB | `lib/db/routine-tasks.ts`, `task-results.ts`, `security-logs.ts` |
| API | `app/api/ceo/route.ts`, `app/api/celf/route.ts`, `app/api/routine/route.ts`, `app/api/routine/complete/route.ts`, `app/api/security/route.ts` |
| Chat akışı | `app/api/chat/flow/route.ts` – securityCheck, archiveTaskResult, routine_request / routine_schedule |

---

**Tüm robotlar bağlantılı, sistem hazır.**
