# Senkronizasyon Düzeltmeleri (30 Ocak 2026)

Claude ve değerlendirme raporlarındaki kritik senkronizasyon kırılmaları giderildi.

## 1. Flow API rol guard

- **Sorun:** Dokümanda "Patron (ve üst roller) dışında flow tetikleyemez" vardı; kodda zorlayıcı rol kontrolü yoktu.
- **Yapılan:** `lib/auth/roles.ts` içinde `FLOW_ALLOWED_ROLES` ve `canTriggerFlow(user)` eklendi. `app/api/chat/flow/route.ts` başında, Şirket İşi / Özel İş / Kaydet path’lerinde `canTriggerFlow` kontrolü yapılıyor; yetkisiz kullanıcı **403 Yetkisiz erişim** alıyor.
- **Dashboard:** Patron panelinde flow’a gönderilen `user` objesine `user_metadata` (rol bilgisi) eklendi; böylece Süper Admin / Sistem Admini de flow tetikleyebiliyor.

## 2. Tek bekleyen iş kuralı

- **Sorun:** Aynı kullanıcı aynı anda birden fazla bekleyen şirket işi açabiliyordu; CEO kuyruğu ve onay ekranı karışıyordu.
- **Yapılan:** `lib/db/ceo-celf.ts` içinde `getPendingCeoTaskCount(userId)` eklendi. Şirket işi path’inde, yeni CEO task oluşturmadan önce bu kullanıcı için bekleyen (pending / assigned / celf_running / awaiting_approval) iş sayısı kontrol ediliyor; en az 1 varsa **409** ve mesaj: *"Zaten bekleyen bir şirket işiniz var. Önce onu onaylayın veya reddedin."*

## 3. Güvenlik robotu “gate” davranışı

- **Sorun:** Deploy / commit / SQL gibi Patron onayı gerektiren işlemlerde güvenlik robotu sadece logluyordu; CELF’e gönderim engellenmiyordu.
- **Yapılan:** Şirket işi path’inde `securityCheck` sonrası `security.requiresApproval === true` ise CELF’e hiç girilmiyor; **403** ve mesaj: *"Bu işlem Patron onayı gerektirir. Önce onay alın."*

## 4. Onay durumu tek kaynak (ceo_tasks.status)

- **Sorun:** Onay durumu hem `ceo_tasks` hem `patron_commands` hem chat mesajlarından yorumlanıyordu; senkron bozuluyordu.
- **Yapılan:**
  - CELF bittikten sonra `ceo_tasks.status` artık **`awaiting_approval`** yapılıyor (önceden doğrudan `completed` yapılıyordu).
  - Patron Onayla/Reddet yapıldığında (`app/api/approvals/route.ts`) ilgili kayıtın `ceo_task_id`’si ile **ceo_tasks** güncelleniyor: Onay → `completed`, Red → `cancelled`.
  - `getPatronCommand` artık `ceo_task_id` de döndürüyor.
- **Veritabanı:** `ceo_tasks.status` için `awaiting_approval` değeri eklendi. Yeni kurulumlar için `supabase/YISA-S_TUM_TABLOLAR_TEK_SQL.sql` güncellendi. **Mevcut kurulumlar** için Supabase SQL Editor’da şu migration çalıştırılmalı:
  - `supabase/migrations/20260130_ceo_tasks_awaiting_approval.sql`

## Özet

| Madde | Durum |
|-------|--------|
| Flow API rol guard | ✅ |
| Tek bekleyen iş kuralı | ✅ |
| Güvenlik robotu CELF öncesi kilidi | ✅ |
| Onay tek kaynak (ceo_tasks) | ✅ |

**Mevcut veritabanı için:** Supabase Dashboard → SQL Editor → `supabase/migrations/20260130_ceo_tasks_awaiting_approval.sql` içeriğini yapıştırıp çalıştırın.

## 5. İlk adım (Gemini/imla) API kilidi (eklendi)

- **Sorun:** API’ye doğrudan `confirm_type: 'company'` gönderen biri imla adımını bypass edebiliyordu; davranış rastgele olabiliyordu.
- **Yapılan:** Şirket işi path’inde `confirmType === 'company'` ise body’de **`confirmed_first_step: true`** zorunlu. Gönderilmezse **400** ve mesaj: *"Şirket işi için önce 'Bu mu demek istediniz?' adımı tamamlanmalı."*
- **Dashboard:** İmla onayı sonrası "Şirket İşi" seçildiğinde istekte `confirmed_first_step: true` gönderiliyor; `first_step_required` yanıtı kullanıcıya gösteriliyor.
