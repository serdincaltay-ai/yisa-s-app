# Patron Komutu — Test Adımları

**Tarih:** 30 Ocak 2026

## 1. Supabase Tabloları

Supabase Dashboard → **SQL Editor** → Yeni sorgu aç → aşağıdaki dosyanın içeriğini yapıştır → **Run**:

- **Dosya:** `supabase/patron-chat-ceo-tables.sql`

Oluşturulan tablolar:
- `chat_messages` — Her mesaj/yanıt kaydı
- `patron_commands` — Patron komutları ve onay kararları
- `ceo_tasks` — CEO sınıflandırma ve görev kayıtları
- `celf_logs` — CELF direktörlük işlem logları
- `audit_log` — Onay/red/değişiklik denetim kaydı

## 2. Ortam Değişkenleri

`.env.local` içinde:

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Zorunlu (giriş + okuma)
- `SUPABASE_SERVICE_ROLE_KEY` — Chat/CEO kayıtları için (Supabase → Settings → API → service_role key). Yoksa anon key ile RLS politikalarına tabi kalır.
- `ANTHROPIC_API_KEY` — Robot yanıtları için zorunlu
- İsteğe bağlı (Seçenek 2 flow): `OPENAI_API_KEY`, `GOOGLE_API_KEY`, `TOGETHER_API_KEY`

## 3. Test Sırası

### 3.1 Chat kaydı

1. Giriş yap (Supabase Auth kullanıcısı).
2. Dashboard’da “YİSA-S Robot Asistan” kutusuna bir mesaj yaz (Seçenek 2 açık veya kapalı fark etmez).
3. Gönder → yanıt gelmeli.
4. Supabase → **Table Editor** → `chat_messages` → Son eklenen satırda `user_id`, `message`, `response`, `ai_providers` dolu olmalı.

### 3.2 CEO + CELF akışı (Seçenek 2)

1. “Seçenek 2 (Kalite)” kutusu işaretli olsun.
2. Örn: “Bu ay özet rapor ver” veya “Kod örneği yaz” yazıp gönder.
3. Akış: CEO görevi sınıflandırır (araştırma/tasarım/kod/genel) → CELF’e yönlendirir → GPT/Gemini/Claude zinciri çalışır → Patron onayı beklenir.
4. Supabase’te kontrol:
   - `ceo_tasks`: Yeni kayıt, `task_type`, `director_key` dolu.
   - `celf_logs`: `ceo_classify` ve `celf_execute` kayıtları.
   - `patron_commands`: `status = pending` kayıt, `command_id` döner.

### 3.3 Onay sistemi

1. “Patron Onayı Bekleniyor” paneli görününce:
   - **Onayla** → `POST /api/approvals` (decision: approve) → `patron_commands.status = approved`, `audit_log` kaydı.
   - **Reddet** → decision: reject → `patron_commands.status = rejected`, `audit_log` kaydı.
   - **Değiştir** → Talimatı yazıp Gönder → decision: modify, `modify_text` kaydedilir; mesaj kutusuna yazılır, yeniden gönderilir.

2. Supabase’te:
   - `patron_commands`: İlgili satırda `status`, `decision`, `decision_at` güncellenmiş olmalı.
   - `audit_log`: Yeni satır, `action` = approve / reject / modify.

## 4. Özet

| Özellik | Nerede | Doğrulama |
|--------|--------|-----------|
| Chat kaydı | `/api/chat`, `/api/chat/flow` | `chat_messages` tablosu |
| CEO sınıflandırma | `detectTaskType` + `routeToDirector` | `ceo_tasks`, `celf_logs` |
| CELF yönlendirme | `ceo_tasks.director_key`, CELF log | `celf_logs` |
| Seçenek 2 akışı | GPT → Gemini/Together → Claude | `routeToAI`, yanıt metni |
| Onayla/Reddet/Değiştir | `POST /api/approvals` | `patron_commands`, `audit_log` |

Otomatik deploy yapılmadı; yerel test için `npm run dev` kullanın.
