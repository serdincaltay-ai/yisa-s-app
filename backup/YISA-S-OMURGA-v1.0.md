# YİSA-S Omurga v1.0 — Tam Referans Dokümanı

Bu dosya, YİSA-S sisteminin tek seferde kurulabilmesi için tüm referans bilgilerini içerir.

---

## 1. 7 Katmanlı Robot Hiyerarşisi

| Katman | Ad | Açıklama |
|--------|----|----------|
| 0 | PATRON | Serdinç Altay — Tek yetkili, nihai karar mercii |
| 1 | PATRON ASİSTAN | Claude + GPT + Gemini + Together + V0 + Cursor |
| 2 | SİBER GÜVENLİK | Her işlemde güvenlik kontrolü, 4 seviye alarm |
| 3 | VERİ ARŞİVLEME | Tüm konuşma/karar/sonuç kaydı, AES-256, günlük 02:00 yedek |
| 4 | CEO ORGANİZATÖR | Kural tabanlı, AI yok; görevi sınıflandırır, CELF'e yönlendirir |
| 5 | YİSA-S CELF MERKEZ | 12 Direktörlük — ilgili AI'ı çalıştırır |
| 6 | COO YARDIMCI | Rutin görevleri zamanında çalıştırır |
| 7 | YİSA-S VİTRİN | Franchise müşterilerine sunulan botlar |

---

## 2. 12 CELF Direktörlüğü ve Görevleri

| Direktörlük | Ad | Tetikleyiciler | İş | AI Sağlayıcılar | Veto |
|-------------|----|----------------|----|-----------------|------|
| CFO | Finans | gelir, gider, bütçe, tahsilat, maliyet | Supabase finansal veri, rapor | GPT, GEMINI | — |
| CTO | Teknoloji | sistem, kod, api, performans, hata | Sistem durumu, kod yaz/düzelt | GPT, CURSOR | — |
| CIO | Bilgi Sistemleri | veri, database, entegrasyon, tablo | Supabase sorguları, veri yönetimi | GPT | — |
| CMO | Pazarlama | kampanya, reklam, sosyal medya, tanıtım | İçerik üret, kampanya planla | GPT, CLAUDE | — |
| CHRO | İnsan Kaynakları | personel, eğitim, performans, izin | Personel yönetimi, eğitim planı | CLAUDE | — |
| CLO | Hukuk | sözleşme, patent, uyum, kvkk | Hukuki kontrol, sözleşme hazırla | CLAUDE | **VAR** |
| CSO_SATIS | Satış | müşteri, sipariş, crm, satış | Müşteri yönetimi, satış takibi | GPT | — |
| CPO | Ürün | şablon, tasarım, özellik, ui, sayfa | Tasarım üret, şablon hazırla | V0, CURSOR | — |
| CDO | Veri | analiz, rapor, dashboard, istatistik | Veri analizi, rapor oluştur | GEMINI, GPT | — |
| CISO | Bilgi Güvenliği | güvenlik, audit, erişim, şifre | Güvenlik kontrolü, audit log | CLAUDE | — |
| CCO | Müşteri | destek, şikayet, memnuniyet, ticket | Müşteri desteği, şikayet çözümü | CLAUDE | — |
| CSO_STRATEJI | Strateji | plan, hedef, büyüme, vizyon | Strateji planı, hedef belirleme | GPT, GEMINI | — |

---

## 3. 13 Rol ve Yetkileri

| Seviye | Rol | Açıklama |
|--------|-----|----------|
| 0 | Ziyaretçi | Giriş yapmamış, sınırlı görüntüleme |
| 1 | Ücretsiz Üye | Temel üyelik, sınırlı özellikler |
| 2 | Ücretli Üye | Tam üyelik, tüm üye özellikleri |
| 3 | Deneme Üyesi | Deneme süresi, ücretli özellikler geçici |
| 4 | Eğitmen | Antrenman verme, kendi sporcuları |
| 5 | Tesis Yöneticisi | Tek tesis yönetimi |
| 6 | Tesis Sahibi | Kendi tesis(ler) yönetimi |
| 7 | Bölge Müdürü | Bölge genelinde tesisler |
| 8 | Franchise Sahibi | Franchise sahipliği |
| 9 | Franchise Yöneticisi | Franchise operasyon yönetimi |
| 10 | Sistem Admini | Sistem ayarları, kullanıcı/rol yönetimi |
| 11 | Süper Admin | Tam yetki, tüm panel erişimi |
| 12 | Patron | En üst yetki, tüm kararlar |

**Dashboard erişimi:** Patron, Süper Admin, Sistem Admini.

---

## 4. Seçenek 2 İş Akışı (Patron → Sonuç)

1. Patron mesaj yazar  
2. Asistan alır → Siber Güvenlik kontrol eder  
3. Güvenlik OK → CEO'ya gönderir  
4. CEO `detectTaskType()` ile sınıflandırır, `routeToDirector()` ile CELF direktörlüğü belirler  
5. CELF direktörlüğü ilgili AI'ı çağırır (GPT/Gemini/Claude/V0/Cursor)  
6. AI işi yapar  
7. Sonuç CELF → CEO'ya döner  
8. CEO sonucu Veri Arşivleme'ye kaydeder  
9. CEO → Asistana sunar  
10. Asistan → Patrona gösterir (Onayla / Reddet / Değiştir)  
11. Patron karar verir: ONAYLA → işlem tamamlanır; REDDET → iptal; DEĞİŞTİR → yeniden işlenir  
12. "Bu rutin olsun" derse → CEO `routine_tasks` tablosuna kaydeder; COO zamanı gelince otomatik çalıştırır  

---

## 5. Supabase Tablo Şemaları

### 5.1 chat_messages
- id (UUID, PK), user_id (UUID), message (TEXT), response (TEXT), ai_providers (TEXT[]), created_at (TIMESTAMPTZ)

### 5.2 patron_commands
- id (UUID, PK), user_id (UUID), command (TEXT), status (pending/approved/rejected/modified), decision, decision_at, modify_text, ceo_task_id, output_payload (JSONB), created_at, updated_at

### 5.3 ceo_tasks
- id (UUID, PK), user_id (UUID), task_description (TEXT), task_type (VARCHAR), director_key (VARCHAR), status (pending/assigned/celf_running/completed/failed/cancelled), result_payload (JSONB), patron_command_id (UUID), created_at, updated_at

### 5.4 celf_logs
- id (UUID, PK), ceo_task_id (UUID, FK ceo_tasks), director_key (VARCHAR), action, input_summary, output_summary, payload (JSONB), created_at

### 5.5 audit_log
- id (UUID, PK), action (VARCHAR), entity_type, entity_id (UUID), user_id (UUID), payload (JSONB), created_at

### 5.6 routine_tasks
- id (UUID, PK), task_type (TEXT), director_key (TEXT), command (TEXT), schedule (daily/weekly/monthly), schedule_time (TIME), last_run, next_run (TIMESTAMPTZ), is_active (BOOLEAN), created_by (UUID), created_at

### 5.7 task_results
- id (UUID, PK), task_id (UUID), routine_task_id (UUID, FK routine_tasks), director_key (TEXT), ai_providers (TEXT[]), input_command (TEXT), output_result (TEXT), status (completed/failed/cancelled), created_at

### 5.8 security_logs
- id (UUID, PK), event_type (TEXT), severity (sari/turuncu/kirmizi/acil), description (TEXT), user_id (UUID), ip_address (TEXT), blocked (BOOLEAN), created_at

### 5.9 system_backups
- id (UUID, PK), version (TEXT), backup_type (full/config/code), backup_data (JSONB), description (TEXT), created_by (UUID), created_at

---

## 6. API Endpoint'leri

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| POST | /api/ceo | Mesaj → güvenlik → sınıflandırma → ceo_task_id, director_key, routine_request |
| POST | /api/celf | director_key + command → direktör bilgisi, ai_providers |
| POST | /api/chat/flow | Patron mesajı → Seçenek 2 akışı → yanıt, command_id, routine_request |
| GET | /api/routine | Rutin listesi (due=true: zamanı gelenler) |
| POST | /api/routine | Rutin oluştur (task_type, director_key, command, schedule, schedule_time) |
| PATCH | /api/routine | Rutin aktif/pasif (id, is_active) |
| DELETE | /api/routine?id= | Rutin sil |
| POST | /api/routine/complete | Rutin tamamlandı → last_run, next_run güncelle (id) |
| POST | /api/security | Güvenlik kontrolü (message, action) |
| GET | /api/security | Güvenlik log listesi (limit) |
| (mevcut) | /api/approvals | Onay kuyruğu |
| (mevcut) | /api/expenses, /api/franchises, /api/stats, /api/templates | Diğer panel API'leri |

---

## 7. Güvenlik Kuralları

### 7.1 FORBIDDEN_FOR_AI (Yasak komutlar)
- .env, .env.local, .env.production, API_KEY, SECRET, PASSWORD, TOKEN  
- git push, git commit, vercel deploy, railway deploy, npm publish  
- DROP TABLE, DELETE FROM, TRUNCATE  
- delete_user, change_password, grant_permission, fiyat_degistir, kullanici_sil, yetki_degistir  

### 7.2 REQUIRE_PATRON_APPROVAL (Patron onayı gerekli)
- deploy, commit, push, merge, table create/alter  
- user delete, role change, price change, env change  
- fiyat_degistir, kullanici_sil, yetki_degistir  
- veritabani_degistir, robot_ayari_degistir, environment_variable_degistir  

### 7.3 4 Seviye Alarm (Siber Güvenlik)
- **Sarı**: Dikkat gerektiren olay  
- **Turuncu**: Ciddi uyarı  
- **Kırmızı**: Acil müdahale  
- **Acil**: Kritik güvenlik ihlali  

---

## 8. Kurulum Adımları (Özet)

1. Proje kökünde `backup/` klasörü mevcut olsun.  
2. `npm install`  
3. Supabase SQL Editor'da sırayla: `backup/SQL/01-temel-tablolar.sql`, `02-rls-policies.sql`, `03-seed-data.sql`  
4. `.env.local` oluştur; `backup/CONFIG/env.example` referans alınarak doldur.  
5. `npm run build`  
6. `npm run dev` ile test.  
7. Deploy: Patron onayı ile git push / Vercel-Railway deploy.  

Detaylı adımlar: **backup/RESTORE/KURULUM-REHBERI.md**  
Tek tık: **backup/RESTORE/kurulum.bat** (Windows), **backup/RESTORE/kurulum.sh** (Linux/Mac).

---

## 9. Versiyon Kontrolü (Her Major Değişiklikte)

1. **backup/VERSION.md** güncelle  
2. **system_backups** tablosuna yeni kayıt ekle (version, backup_type, backup_data)  
3. **backup/** klasörünü güncelle (SQL, CONFIG, RESTORE)  

---

*YİSA-S Omurga v1.0 — 30 Ocak 2026*
