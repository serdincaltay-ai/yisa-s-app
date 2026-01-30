# GÖREV 1 — Altyapı Kontrol Raporu

**Tarih:** 30 Ocak 2026  
**Kapsam:** Supabase tabloları, chat, patron komutları, CELF, audit log — kod tarafı kontrolü.

---

## 1. Supabase’te beklenen tablolar

Tek script ile kurulması gereken tablolar (`supabase/YISA-S_TUM_TABLOLAR_TEK_SQL.sql`):

| Tablo | Kullanım |
|-------|----------|
| **chat_messages** | Her sohbet mesajı + yanıt |
| **patron_commands** | Patron komutları, onay kuyruğu (pending / approved / rejected / modified) |
| **ceo_tasks** | CEO görev kayıtları, director_key, sonuç |
| **celf_logs** | CELF her çalıştırmada log |
| **audit_log** | Onayla / Reddet / Değiştir aksiyonları |
| **celf_audit_logs** | CELF iç denetim (data_access, veto, approval kontrolleri) |
| **patron_private_tasks** | Özel iş kayıtları |
| **director_rules** | Direktörlük kuralları (dinamik) |
| **ceo_routines**, **ceo_rules**, **ceo_templates**, **ceo_approved_tasks**, **ceo_franchise_data** | CEO merkez |
| **routine_tasks**, **task_results**, **security_logs** | Robot sistemi |
| **tenants**, **approval_queue**, **expenses**, **franchises**, **templates**, **franchise_revenue**, **deploy_logs**, **api_usage** | v2.1 operasyon |
| **celf_cost_reports**, **patron_sales_prices** | Maliyet / satış fiyatı |
| **coo_rules** | COO kuralları |
| **role_permissions** | Kullanıcı rolleri (flow/CELF tetikleme yetkisi) |

**Kontrol:** Supabase Dashboard → Table Editor’da bu tabloların varlığını kontrol edin. Eksikse `YISA-S_TUM_TABLOLAR_TEK_SQL.sql` dosyasını SQL Editor’da tek seferde çalıştırın.

---

## 2. Chat mesajları kaydoluyor mu?

- **Kod:** `lib/db/chat-messages.ts` → `saveChatMessage()` → `chat_messages` tablosuna INSERT.
- **Çağrıldığı yerler:**
  - `app/api/chat/flow/route.ts`: Şirket işi akışında CELF sonrası “Patron onayı bekleniyor” yanıtı ile kaydediyor.
  - `app/api/chat/route.ts`: Basit chat API’de yanıt sonrası kaydediyor.
- **Koşul:** `getSupabaseServer()` null dönmemeli (`.env.local` içinde `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` veya anon key). Tablo yoksa INSERT hata verir.

**Eksik riski:** Supabase bağlantısı yok veya `chat_messages` tablosu yok → kayıt olmaz, API hata dönebilir.

---

## 3. Patron komutları loglanıyor mu?

- **Kod:** `lib/db/ceo-celf.ts` → `createPatronCommand()`, `updatePatronCommand()` → `patron_commands` tablosu.
- **Çağrıldığı yerler:**
  - `app/api/chat/flow/route.ts`: CELF çalıştıktan sonra `createPatronCommand()` ile “pending” kayıt oluşturuluyor.
  - `app/api/approvals/route.ts`: Onayla / Reddet / Değiştir ile `updatePatronCommand()` ve `insertAuditLog()` çağrılıyor.
- **Görüntüleme:** `GET /api/approvals` → `patron_commands` (ve approval_queue vb.) listeleniyor.

**Eksik riski:** `patron_commands` tablosu yoksa veya Supabase bağlantısı yoksa komutlar loglanmaz ve onay kuyruğu boş görünür.

---

## 4. CELF mekanizması aktif mi?

- **Kod:** `lib/ai/celf-execute.ts` → `runCelfDirector()`; `lib/robots/celf-center.ts` → direktörlük ve tetikleyiciler.
- **Log:** `lib/db/ceo-celf.ts` → `insertCelfLog()` → `celf_logs` tablosuna her CELF çalıştırmasında yazılıyor.
- **Çağrıldığı yerler:** `app/api/chat/flow/route.ts` (CEO → CELF akışı); CELF öncesi `logCelfAudit()` → `celf_audit_logs`.
- **Aktif olması için:** En az bir AI API anahtarı gerekli (örn. `GOOGLE_API_KEY` / `GOOGLE_GEMINI_API_KEY` veya `OPENAI_API_KEY`). Anahtar yoksa “Yanıt oluşturulamadı. API anahtarlarını (.env) kontrol edin.” mesajı çıkar; CELF log kaydı yine de oluşturulur (sonuç boş olabilir).

**Eksik riski:** API anahtarları yok veya hatalı → CELF yanıt üretemez; tablolar ve loglama kodu hazır.

---

## 5. Audit log var mı?

- **Kod:** `lib/db/ceo-celf.ts` → `insertAuditLog()` → `audit_log` tablosuna INSERT.
- **Çağrıldığı yer:** Sadece `app/api/approvals/route.ts` — Patron Onayla / Reddet / Değiştir kararı verildiğinde. Öneri İste (suggest) audit’e yazılmıyor.
- **İçerik:** action (approve / reject / modify), entity_type: `patron_command`, entity_id, user_id, payload.

**Eksik riski:** `audit_log` tablosu yoksa veya Supabase yazma yetkisi yoksa onay kararları audit’e düşmez.

---

## 6. Eksikler özeti

| # | Eksik / Risk | Ne yapılmalı |
|---|----------------|--------------|
| 1 | Tablolar Supabase’te yok | `YISA-S_TUM_TABLOLAR_TEK_SQL.sql` dosyasını Supabase SQL Editor’da çalıştırın. |
| 2 | Supabase bağlantısı yok | `.env.local` içinde `NEXT_PUBLIC_SUPABASE_URL` ve `SUPABASE_SERVICE_ROLE_KEY` (veya anon key) tanımlı olsun. |
| 3 | CELF yanıt üretemiyor | En az bir AI anahtarı: `GOOGLE_API_KEY` veya `GOOGLE_GEMINI_API_KEY` veya `OPENAI_API_KEY` (veya `ANTHROPIC_API_KEY`) ekleyin. |
| 4 | Audit sadece onay kararında | İstenirse “Öneri İste” ve diğer aksiyonlar da `insertAuditLog` ile audit_log’a eklenebilir. |

---

## 7. Hızlı doğrulama

1. Supabase Table Editor’da: `chat_messages`, `patron_commands`, `celf_logs`, `audit_log` tablolarını açıp son kayıtları kontrol edin.
2. Uygulamada bir “şirket işi” komutu verin → Patron onay kuyruğunda görünmeli; Onayla/Reddet sonrası `audit_log`’da yeni satır olmalı.
3. “Yanıt oluşturulamadı” alıyorsanız `.env.local` içindeki ilgili API anahtarlarını kontrol edin.

---

**Rapor sonu.**
