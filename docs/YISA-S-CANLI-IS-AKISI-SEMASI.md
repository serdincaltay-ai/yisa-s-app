# YİSA-S — Canlı İş Akışı Şeması

> **CANLI DOSYA:** Projede herhangi bir değişiklik olduğunda bu dosya **aynı gün** güncellenir. Planlanan, devam eden ve tamamlanan işler burada takip edilir.
>
> **Son güncelleme:** 05.03.2026 — Kullanıcı paneli tasarım kilidi (koyu tema, alt nav) + Tesis sayfaları (3 şablon, ders programı grid, fiyat kartları) tamamlandı.
> **Son güncelleme:** 05.03.2026 — 3 Duvar entegrasyonu, güvenlik dashboard, CELF uçtan uca test, görev→dashboard yansıması tamamlandı. Genel ilerleme ~%93.
> **Son güncelleme:** 06.03.2026 — ManyChat webhook + CRM tabloları, Vitest test altyapısı (140 test), Stripe ödeme entegrasyonu, backup stratejisi. Genel ilerleme ~%95.
> **Son güncelleme:** 06.03.2026 — Push notification (PR #61), SMS entegrasyonu (PR #67), Email sistemi (PR #68), Aidat hatırlatma cron (PR #71), Sağlık kayıtları + belge geçerlilik (PR #72), Sentry hata izleme (PR #74), Tesis müdürü paneli (PR #75), CI/CD pipeline (PR #76), Google Analytics (PR #77), Veli profil (PR #79), Temizlik checklist (PR #80), Kayıt görevlisi (PR #82), Acil alarm sistemi (PR #83), API dokümantasyonu (PR #85), Env doğrulama (PR #86), demotesis config (PR #87), Anket sistemi (PR #89), E2E testler. Genel ilerleme ~%97.

---

## 1. A-B-C-D-E Akışı — Durum Özeti

```
[ A. Kurulum & Harita ]  -->  [ B. Birleştirme ]  -->  [ C. Final iş haritası ]
         TAMAMLANDI                TAMAMLANDI                 TAMAMLANDI
                                                                 |
                                                                 v
[ E. Teslim ]  <--  [ D. Eksiklik tespiti & giderilmesi ]
  TAMAMLANDI              TAMAMLANDI
```

| Aşama | Durum | Tarih | Not |
|-------|-------|-------|-----|
| **A. Kurulum & Harita** | Tamamlandı | Şubat 2026 | 3 repo build alındı, şemalar yazıldı |
| **B. Birleştirme** | Tamamlandı | Şubat 2026 | tenant-yisa-s'e bileşenler çekildi; referans dokümanlar oluşturuldu |
| **C. Final İş Haritası** | Tamamlandı | Şubat 2026 | YISA-S-FINAL-IS-HARITASI.md oluşturuldu |
| **D. Eksiklik Tespiti** | Tamamlandı | Şubat 2026 | Kod tabanı taraması yapıldı; PWA ikonları eklendi |
| **E. Teslim** | Tamamlandı | Şubat 2026 | 3 repo build başarılı; raporlar güncel |

---

## 2. 7 Faz Durum Özeti

*Detay: YISA-S-7-FAZ-DURUMU.md ve YISA-S-CANLI-PROJE-RAPORU.md Bölüm 0*

| Faz | İçerik | Durum | Tamamlanma |
|-----|--------|-------|------------|
| Faz 1 | Vitrin + Demo formu + Tesis sayfaları + ManyChat + GA | Büyük oranda tamam | ~%97 |
| Faz 2 | Tenant otomatik oluşturma | Tamamlandı | ~%95 |
| Faz 3 | Güvenlik robotu MVP + Acil alarm + Sentry | Büyük oranda tamam | ~%97 |
| Faz 4 | Veri robotu / Şablon havuzu | Büyük oranda tamam | ~%92 |
| Faz 5 | Franchise paneli + Temizlik + Kayıt görevlisi + Anketler + Belgeler | Büyük oranda tamam | ~%95 |
| Faz 6 | Veli paneli MVP + Stripe + Profil + Push + Email + SMS | Büyük oranda tamam | ~%97 |
| Faz 7 | CELF zinciri + Başlangıç görevleri + E2E + CI/CD + API docs | Büyük oranda tamam | ~%95 |

**Genel ilerleme:** ~%97 (ağırlıklı ortalama)

---

## 3. Finalde Ne Yapılacaktı / Şu An Ne Durumda / Ne Yapıldı

### 3.1 Yapıldı (Tamamlanan İşler)

| # | İş | Faz | Tamamlanma Tarihi |
|---|-----|-----|-------------------|
| 1 | Core migration (tüm temel tablolar) | Faz 1 | Ocak 2026 |
| 2 | Demo formu + demo_requests API | Faz 1 | Ocak 2026 |
| 3 | Patron onay kuyruğu (approve/reject) | Faz 1 | Ocak 2026 |
| 4 | provisionTenant zinciri (6 adım + rollback) | Faz 2 | Ocak 2026 |
| 5 | Subdomain oluşturma sistemi | Faz 2 | Ocak 2026 |
| 6 | RLS politikaları (1539 satır, tüm tablolar) | Faz 3 | Ocak 2026 |
| 7 | Güvenlik robotu (securityCheck, audit log) | Faz 3 | Şubat 2026 |
| 8 | Şablon kütüphanesi (ceo_templates, templates, v0_template_library) | Faz 4 | Şubat 2026 |
| 9 | Franchise paneli (dashboard, öğrenci, yoklama, aidat, program, personel) | Faz 5 | Şubat 2026 |
| 10 | Veli paneli sayfaları + API'ler | Faz 6 | Şubat 2026 |
| 11 | Antrenör paneli (dashboard, sporcular, yoklama, ölçüm) | Faz 5-6 | Şubat 2026 |
| 12 | 15 direktörlük CELF yapısı + başlangıç görevleri | Faz 7 | Şubat 2026 |
| 13 | CEO/COO/CIO robot | Faz 7 | Şubat 2026 |
| 14 | Veri arşivleme (archiveTaskResult) düzeltmesi | Faz 4 | 04.02.2026 |
| 15 | COO cron (run-due) + rutin görevler | Faz 7 | Şubat 2026 |
| 16 | Vitrin sayfaları (10+ sayfa) | Faz 1 | Şubat 2026 |
| 17 | Patron asistan sohbet (11 AI provider) | Faz 7 | Şubat 2026 |
| 18 | A-B-C-D-E akışı tamamlandı | Tüm | Şubat 2026 |
| 19 | Canlı dokümantasyon sistemi kuruldu | Tüm | 05.03.2026 |
| 20 | Gelişim ölçüm tabloları + API (gelisim_olcumleri, referans_degerler, sport_templates) | Faz 4 | 05.03.2026 |
| 21 | Çocuk gelişim referans değerleri seed (WHO/TGF, yaş 5-15, E/K) | Faz 4 | 05.03.2026 |
| 22 | Gelişim analiz endpoint'i (referans karşılaştırma + branş önerisi) | Faz 4 | 05.03.2026 |
| 23 | 137 öğrenci veri kontrolü: **140 sporcu, 1575 ödeme, 3022 yoklama** (BJK tenant) | Veri | 05.03.2026 |
| 24 | Veli paneli canlı veri: 2 test veli + 3 sporcu parent bağlantısı + gerçek auth (signInWithPassword) | Faz 6 | 05.03.2026 |
| 25 | Kırık trigger düzeltmesi (trg_update_athletes → guncelleme_tarihi) | Düzeltme | 05.03.2026 |
| 26 | Kullanıcı paneli tasarım kilidi: Veli + Antrenör paneli koyu tema, kutucuk layout, alt navigasyon | Faz 6 | 05.03.2026 |
| 27 | Antrenör paneli sidebar → bottom nav dönüşümü | Faz 6 | 05.03.2026 |
| 28 | Veli ders programı sayfası (gün seçici, ders kartları, haftalık özet) | Faz 6 | 05.03.2026 |
| 29 | Tesis web sayfaları: 2 tesis (BJK Tuzla=premium, Fener Atasehir=orta) + 3 şablon | Faz 1 | 05.03.2026 |
| 30 | Haftalık ders programı grid (PZT-PAZ, 08:00-19:00, renk kodlu branşlar) | Faz 1 | 05.03.2026 |
| 31 | Paket fiyatları kartları (24/48/60 ders — 30.000/52.800/60.000 TL) | Faz 1 | 05.03.2026 |
| 32 | Premium özellikler: Robot karşılama widget + Randevu sistemi modal | Faz 1 | 05.03.2026 |
| 26 | 3 şablon sistemi (standard/medium/premium) + tenant config | Faz 1 | 05.03.2026 |
| 27 | Haftalık ders programı GRID bileşeni (08:00-19:00, PZT-PAZ, renk kodlu) | Faz 1 | 05.03.2026 |
| 28 | Robot karşılama + randevu sistemi (premium şablon) | Faz 1 | 05.03.2026 |
| 29 | Paket fiyatları güncellendi: 24→30.000, 48→52.800, 60→60.000 TL | Faz 1 | 05.03.2026 |
| 30 | feneratasehir subdomain desteği eklendi | Faz 2 | 05.03.2026 |
| 31 | tenant-site/page.tsx şablon yönlendirici (template router) olarak yeniden yazıldı | Faz 1 | 05.03.2026 |
| 32 | 3 Duvar birleşik güvenlik middleware (uc-duvar.ts): Yasak Bölgeler + Siber Güvenlik + CELF Denetim | Faz 3 | 05.03.2026 |
| 33 | Güvenlik dashboard UI (/dashboard/guvenlik): 3 duvar kartları, alarm istatistikleri, seviye dağılımı, log listesi | Faz 3 | 05.03.2026 |
| 34 | 3 Duvar API endpoint'leri: POST /api/guvenlik/uc-duvar (kontrol) + GET /api/guvenlik/durum (dashboard verisi) | Faz 3 | 05.03.2026 |
| 35 | CELF uçtan uca test endpoint'i (POST /api/celf/test-akis): 7 adımlı akış doğrulama | Faz 7 | 05.03.2026 |
| 36 | Raporlar sayfası genişletildi: Özet kartları, direktörlük dağılımı, AI sağlayıcı grafiği, filtre sistemi | Faz 7 | 05.03.2026 |
| 37 | Sidebar'a Güvenlik linki eklendi | Faz 3 | 05.03.2026 |
| 38 | ManyChat webhook entegrasyonu — crm_contacts + crm_activities + demo_requests yazma | Faz 1 | 06.03.2026 |
| 39 | CRM tabloları migration (crm_contacts, crm_activities) + RLS politikaları | Faz 1 | 06.03.2026 |
| 40 | Vitest test altyapısı + CELF pipeline E2E testler (140 test, 3 suite) | Faz 7 | 06.03.2026 |
| 41 | Stripe ödeme entegrasyonu — Checkout Session + Webhook + Veli/Franchise UI | Faz 6 | 06.03.2026 |
| 42 | Stripe expired checkout düzeltmesi — orijinal durum geri yükleme + catch rollback | Faz 6 | 06.03.2026 |
| 43 | Backup stratejisi dokümantasyonu + backup-check API endpoint + Vercel cron | Ops | 06.03.2026 |
| 44 | Push notification altyapısı (Web Push API + VAPID + push_subscriptions) | Faz 6 | 06.03.2026 |
| 45 | SMS entegrasyonu (Twilio/Netgsm provider + sms_templates + tetikleyiciler) | Faz 6 | 06.03.2026 |
| 46 | Email bildirim sistemi (Resend + bildirim şablonları + toplu gönderim) | Faz 6 | 06.03.2026 |
| 47 | Aidat hatırlatma cron (/api/coo/aidat-hatirlatma, günlük 09:00 UTC) | Faz 5 | 06.03.2026 |
| 48 | Sağlık kayıtları geçerlilik uyarısı + belge kontrol cron (haftalık Pazartesi 08:00 UTC) | Faz 5 | 06.03.2026 |
| 49 | Sentry hata izleme entegrasyonu (client + server + edge config, global-error.tsx) | Faz 7 | 06.03.2026 |
| 50 | Tesis müdürü paneli geliştirmeleri | Faz 5 | 06.03.2026 |
| 51 | CI/CD pipeline (lint + build + test + Vitest JUnit raporu + artifact upload) | Faz 7 | 06.03.2026 |
| 52 | Google Analytics entegrasyonu (@next/third-parties, koşullu render) | Faz 1 | 06.03.2026 |
| 53 | Veli profil sayfası (/veli/profil + GET/PATCH API + push_preferences migration) | Faz 6 | 06.03.2026 |
| 54 | Temizlik kontrol listesi (/temizlik + API + cleaning_checklists migration + RLS) | Faz 5 | 06.03.2026 |
| 55 | Kayıt görevlisi rolü (/kayit + POST /api/kayit/ogrenci + veli auth + rollback) | Faz 5 | 06.03.2026 |
| 56 | Acil alarm sistemi (/api/alarm/acil + acil-alarm.ts + AcilAlarmBanner + cooldown) | Faz 3 | 06.03.2026 |
| 57 | API dokümantasyonu (OpenAPI 3.0 spec + Swagger UI /api-docs) | Faz 7 | 06.03.2026 |
| 58 | .env şema doğrulama scripti (scripts/check-env.ts + CI entegrasyonu) | Faz 7 | 06.03.2026 |
| 59 | demotesis tenant config (medium şablon + tesis sayfası + subdomain) | Faz 1 | 06.03.2026 |
| 60 | Anket sistemi (survey questions + responses migration + respond/results API + franchise/veli anketler UI) | Faz 5 | 06.03.2026 |
| 61 | E2E testler (Playwright: auth-login, demo-form, veli-panel specs) | Faz 7 | 06.03.2026 |
| 62 | kartalcimnastik tenant config (standard şablon + tesis sayfası + ders programı) | Faz 1 | 06.03.2026 |

### 3.2 Devam Eden (İşleniyor)

| # | İş | Faz | Başlangıç | Engel / Not |
|---|-----|-----|-----------|-------------|
| ~~1~~ | ~~CELF otomatik tetikleme (provisionTenant -> CELF)~~ | ~~Faz 2~~ | ~~Şubat 2026~~ | **Yapıldı** — provisionTenant → triggerCelfStartup |
| 2 | 3 Duvar sistemi tam entegrasyonu | Faz 3 | Şubat 2026 | Parçalar mevcut; entegrasyon tamamlanacak |
| 3 | Patron onay -> CELF tetik uçtan uca test | Faz 7 | Şubat 2026 | Her parça var; tam akış test edilmeli |
| 4 | Görev sonuçlarının dashboard'a yansıması | Faz 7 | Şubat 2026 | task_results arşivleme var; gösterim kısmen |
| ~~1~~ | ~~CELF otomatik tetikleme (provisionTenant -> CELF)~~ | ~~Faz 2~~ | ~~Şubat 2026~~ | **Yapıldı 05.03.2026** — provisionTenant Step 7 triggerCelfStartup ile bağlandı (Bkz. 3.1 #19) |
| ~~2~~ | ~~3 Duvar sistemi tam entegrasyonu~~ | ~~Faz 3~~ | ~~Şubat 2026~~ | **Yapıldı 05.03.2026** — uc-duvar.ts birleşik middleware: 3 duvar kontrol, API, dashboard (Bkz. 3.1 #32-34) |
| ~~3~~ | ~~Patron onay -> CELF tetik uçtan uca test~~ | ~~Faz 7~~ | ~~Şubat 2026~~ | **Yapıldı 05.03.2026** — /api/celf/test-akis: 7 adımlı e2e doğrulama (Bkz. 3.1 #35) |
| ~~4~~ | ~~Görev sonuçlarının dashboard'a yansıması~~ | ~~Faz 7~~ | ~~Şubat 2026~~ | **Yapıldı 05.03.2026** — Raporlar sayfası genişletildi: özet, dağılım, filtre (Bkz. 3.1 #36) |
| ~~5~~ | ~~İletişim modülü (anket eksik)~~ | ~~Faz 5~~ | ~~Şubat 2026~~ | **Yapıldı 06.03.2026** — PR #89: Anket sistemi (questions + responses migration, respond/results API, franchise/veli anketler UI) |
| ~~6~~ | ~~Belge yönetimi (geçerlilik uyarısı eksik)~~ | ~~Faz 5~~ | ~~Şubat 2026~~ | **Yapıldı 06.03.2026** — PR #72: Sağlık kayıtları geçerlilik + belge kontrol cron + uyarı gönderme |
| ~~7~~ | ~~.env.example şema uyumu kontrolü~~ | ~~Tüm~~ | ~~Şubat 2026~~ | **Yapıldı 06.03.2026** — PR #86: scripts/check-env.ts + CI entegrasyonu |
| 8 | Stripe ödeme akışı uçtan uca test (gerçek Stripe hesabıyla) | Faz 6 | 06.03.2026 | Kod hazır; gerçek hesap testi yapılmalı |

### 3.3 Yapılacak (Henüz Başlanmadı)

| # | İş | Faz | Öncelik | Not |
|---|-----|-----|---------|-----|
| ~~1~~ | ~~ManyChat / WhatsApp bot entegrasyonu~~ | ~~Faz 1~~ | ~~Orta~~ | **Yapıldı 06.03.2026** — PR #59: ManyChat webhook + CRM tabloları |
| ~~2~~ | ~~Gelişim ölçüm tabloları + API~~ | ~~Faz 4~~ | ~~Yüksek~~ | **Yapıldı 05.03.2026** — 3.1 #20 |
| ~~3~~ | ~~Çocuk gelişim referans değerleri seed~~ | ~~Faz 4~~ | ~~Yüksek~~ | **Yapıldı 05.03.2026** — 3.1 #21 |
| ~~4~~ | ~~Güvenlik dashboard paneli UI~~ | ~~Faz 3~~ | ~~Orta~~ | **Yapıldı 05.03.2026** — /dashboard/guvenlik (Bkz. 3.1 #33) |
| ~~5~~ | ~~Bildirim / push notification altyapısı~~ | ~~Faz 6~~ | ~~Orta~~ | **Yapıldı 06.03.2026** — PR #61: Web Push API + VAPID + push_subscriptions |
| ~~6~~ | ~~Tesis müdürü paneli — gerçek API + alt sayfalar~~ | ~~—~~ | ~~Orta~~ | **Yapıldı 06.03.2026** — PR #75: Tesis müdürü paneli geliştirmeleri |
| ~~7~~ | ~~Temizlik personeli günlük checklist~~ | ~~—~~ | ~~Düşük~~ | **Yapıldı 06.03.2026** — PR #80: /temizlik checklist (3 vardiya × 4 alan, checkbox + not, ilerleme çubuğu) |
| ~~8~~ | ~~Kayıt görevlisi rol bazlı yönlendirme~~ | ~~—~~ | ~~Düşük~~ | **Yapıldı 06.03.2026** — PR #82: kayit_gorevlisi rolü, /kayit formu, POST /api/kayit/ogrenci, veli auth + rollback |
| ~~9~~ | ~~Veli online aidat ödeme (İyzico/Paratika)~~ | ~~Faz 6~~ | ~~Orta~~ | **Yapıldı 06.03.2026** — PR #62+#64: Stripe Checkout Session + Webhook + expired handler |
| ~~10~~ | ~~Yoklama SMS tetik entegrasyonu~~ | ~~Faz 5~~ | ~~Orta~~ | **Yapıldı 06.03.2026** — PR #67: SMS entegrasyonu (provider + şablonlar + tetikleyiciler) |
| ~~11~~ | ~~Aidat hatırlatma mekanizması~~ | ~~Faz 5~~ | ~~Orta~~ | **Yapıldı 06.03.2026** — PR #71: /api/coo/aidat-hatirlatma cron (günlük 09:00 UTC) |
| ~~12~~ | ~~7/24 Acil Destek otomatik alarm~~ | ~~—~~ | ~~Düşük~~ | **Yapıldı 06.03.2026** — PR #83: /api/alarm/acil + acil-alarm.ts + AcilAlarmBanner + cooldown |
| 13 | BJK Tuzla logosu ekleme | — | Düşük | Kullanıcı ekleyecek |
| ~~14~~ | ~~137 öğrenci veri kontrolü (Supabase)~~ | ~~—~~ | ~~Yüksek~~ | **Yapıldı 05.03.2026** — 3.1 #23: 140 sporcu, 1575 ödeme, 3022 yoklama |
| ~~15~~ | ~~Veli paneli canlı veri testi~~ | ~~Faz 6~~ | ~~Yüksek~~ | **Yapıldı 05.03.2026** — 3.1 #24: 2 test veli, 3 sporcu bağlandı, gerçek auth |
| 16 | Mobil uygulama / PWA optimizasyonu | — | Düşük | Uzun vadeli |
| 17 | Uluslararası genişleme (çoklu dil) | — | Düşük | Uzun vadeli |

---

## 4. Proje Değişikliği Kaydı

| Tarih | Değişiklik | Etkileyen Dosya(lar) |
|-------|-----------|----------------------|
| 05.03.2026 | **Kullanıcı paneli tasarım kilidi:** Veli + Antrenör panelleri koyu tema (zinc-950), kutucuk layout, alt navigasyon (5 öğe); Antrenör sidebar→bottom nav; Veli ders programı sayfası; PanelBottomNav + PanelHeader shared bileşenler | components/PanelBottomNav.tsx, PanelHeader.tsx, app/veli/*, app/antrenor/* |
| 05.03.2026 | **Tesis sayfaları:** 2 tesis (BJK Tuzla=premium, Fener Atasehir=orta); 3 şablon (standart/orta/premium); haftalık ders programı grid; paket fiyatları (3 kart); premium: robot karşılama + randevu modal; shared bileşenler (DersProgramiGrid, PaketFiyatlari, TesisNavbar, TesisFooter) | app/tesis/[slug]/page.tsx, components/tesis/* |
| 05.03.2026 | **Faz 3 + Faz 7 tamamlandı:** 3 Duvar birleşik middleware (uc-duvar.ts); güvenlik dashboard (/dashboard/guvenlik); CELF uçtan uca test endpoint; raporlar sayfası genişletildi; sidebar güvenlik linki | lib/security/uc-duvar.ts, app/dashboard/guvenlik/page.tsx, app/api/guvenlik/*, app/api/celf/test-akis/route.ts, app/dashboard/reports/page.tsx, app/components/DashboardSidebar.tsx |
| 05.03.2026 | **Veli paneli canlı veri:** 2 test veli (veli1@bjktuzla.test, veli2@bjktuzla.test) oluşturuldu; 3 sporcu parent_user_id ile bağlandı; demo→gerçek auth; kırık trigger düzeltildi; user_tenants role='veli' eklendi | app/veli/giris/page.tsx, app/veli/dashboard/page.tsx, scripts/013_veli_canli_veri_setup.sql |
| 05.03.2026 | **137 öğrenci veri kontrolü:** BJK tenant (8cc3ea1d) — athletes=140, payments=1575, attendance=3022. Hedef aşıldı. Eksik: athlete_measurements=0, users=0 (parent_user_id bağlı değil). | docs/YISA-S-CANLI-PROJE-RAPORU.md, docs/YISA-S-CANLI-IS-AKISI-SEMASI.md |
| 05.03.2026 | **Faz 4 tamamlandı:** gelisim_olcumleri + referans_degerler + sport_templates tabloları; GET/POST gelisim-olcumleri API; gelisim-analiz endpoint; WHO/TGF referans seed; veli/gelisim birleşik sorgu | scripts/011, scripts/012, app/api/gelisim-olcumleri, app/api/gelisim-analiz, app/api/veli/gelisim |
| 05.03.2026 | **3 şablon sistemi (PR #52):** standard/medium/premium şablonlar, haftalık GRID, robot karşılama, randevu, paket fiyat güncellemesi, feneratasehir subdomain | tenant-site/page.tsx, components/tenant-templates/*, lib/tenant-template-config.ts, lib/subdomain.ts |
| 05.03.2026 | Canlı dokümantasyon sistemi kuruldu: 7-faz değerlendirmesi, çalışma prensibi kılavuzu, iş akışı şeması, canlı proje raporu | YISA-S-7-FAZ-DURUMU.md, YISA-S-CANLI-PROJE-RAPORU.md, YISA-S-CALISMA-PRENSIBI-VE-KULLANIM-KILAVUZU-CANLI.md, YISA-S-CANLI-IS-AKISI-SEMASI.md |
| 06.03.2026 | **ManyChat webhook + CRM (PR #59):** crm_contacts + crm_activities tabloları, HMAC-SHA256 doğrulama, partial response desteği, RLS politikaları | app/api/webhooks/manychat/route.ts, supabase/migrations/20260306120000_crm_contacts_activities.sql |
| 06.03.2026 | **Vitest test altyapısı + CELF E2E (PR #60):** 140 test (3 suite: provisioning, patron chain, directorate routing), mock Supabase client, vitest.config.ts | __tests__/*, vitest.config.ts, package.json |
| 06.03.2026 | **Stripe ödeme entegrasyonu (PR #62+#64):** Checkout Session oluşturma, webhook handler (completed+expired), processing status lock, race condition koruması, orijinal durum geri yükleme | lib/stripe/client.ts, app/api/payments/create-checkout/route.ts, app/api/webhooks/stripe/route.ts, app/veli/odeme/page.tsx, app/franchise/aidatlar/page.tsx |
| 06.03.2026 | **Backup stratejisi (PR #84):** Supabase günlük otomatik backup + haftalık pg_dump dokümantasyonu, /api/admin/backup-check endpoint, Vercel cron (Pazartesi 03:00 UTC) | docs/BACKUP-STRATEJISI.md, app/api/admin/backup-check/route.ts, vercel.json |
| 06.03.2026 | **Push notification (PR #61):** Web Push API + VAPID anahtarları + push_subscriptions tablosu + POST /api/notifications/send | lib/notifications/web-push.ts, lib/db/push-subscriptions.ts, app/api/notifications/send/route.ts |
| 06.03.2026 | **SMS entegrasyonu (PR #67):** Twilio/Netgsm provider + SMS şablonları + yoklama/ödeme tetikleyicileri | lib/sms-provider.ts, lib/sms-triggers.ts |
| 06.03.2026 | **Email bildirim sistemi (PR #68):** Resend entegrasyonu + bildirim şablonları + toplu gönderim | app/api/notifications/send/route.ts |
| 06.03.2026 | **Aidat hatırlatma cron (PR #71):** Vadesi geçen/yaklaşan aidatlar için push bildirim, günlük 09:00 UTC | app/api/coo/aidat-hatirlatma/route.ts, vercel.json |
| 06.03.2026 | **Sağlık kayıtları + belge geçerlilik (PR #72):** saglik_raporu_gecerlilik alanı, belgeler kontrol/uyarı-gönder API, belge-kontrol cron (haftalık Pazartesi 08:00 UTC) | app/api/franchise/health-records/route.ts, app/api/franchise/belgeler/kontrol/route.ts, app/api/franchise/belgeler/uyari-gonder/route.ts, app/api/coo/belge-kontrol/route.ts |
| 06.03.2026 | **Sentry hata izleme (PR #74):** @sentry/nextjs entegrasyonu (client + server + edge config), global-error.tsx, instrumentation.ts | sentry.client.config.ts, sentry.server.config.ts, sentry.edge.config.ts, app/global-error.tsx, instrumentation.ts |
| 06.03.2026 | **Tesis müdürü paneli (PR #75):** Tesis müdürü rol geliştirmeleri | app/tesis-muduru/ |
| 06.03.2026 | **CI/CD pipeline (PR #76):** lint + build + Vitest test + JUnit XML raporu + artifact upload (30 gün saklama) + deploy.yml (manual dispatch + patron onayı) | .github/workflows/ci.yml, .github/workflows/deploy.yml |
| 06.03.2026 | **Google Analytics (PR #77):** @next/third-parties/google, koşullu render (NEXT_PUBLIC_GA_MEASUREMENT_ID) | app/layout.tsx, .env.example |
| 06.03.2026 | **Veli profil (PR #79):** /veli/profil sayfası (ad/soyad/telefon/email + bildirim tercihleri), GET/PATCH /api/veli/profil, push_preferences migration | app/veli/profil/page.tsx, app/api/veli/profil/route.ts, supabase/migrations/20260306190000_push_preferences.sql |
| 06.03.2026 | **Temizlik checklist (PR #80):** /temizlik sayfası (3 vardiya × 4 alan, checkbox + not, ilerleme çubuğu), GET/POST /api/temizlik/checklist, cleaning_checklists migration + RLS | app/temizlik/page.tsx, app/api/temizlik/checklist/route.ts |
| 06.03.2026 | **Kayıt görevlisi (PR #82):** kayit_gorevlisi rolü, /kayit öğrenci kayıt formu, POST /api/kayit/ogrenci (athletes + payments + veli auth + rollback), 12 review bot bulgusu düzeltildi | app/kayit/page.tsx, app/api/kayit/ogrenci/route.ts, lib/auth/resolve-role.ts |
| 06.03.2026 | **Acil alarm sistemi (PR #83):** POST /api/alarm/acil, acil-alarm.ts (cooldown + dedup + push), AcilAlarmBanner patron dashboard bileşeni | app/api/alarm/acil/route.ts, lib/security/acil-alarm.ts, components/patron/AcilAlarmBanner.tsx |
| 06.03.2026 | **API dokümantasyonu (PR #85):** OpenAPI 3.0 spec (1445 satır, 30+ endpoint), Swagger UI /api-docs sayfası | lib/openapi-spec.ts, app/api/openapi/route.ts, app/api-docs/page.tsx |
| 06.03.2026 | **Env doğrulama (PR #86):** scripts/check-env.ts — .env.example vs runtime kontrol, CI entegrasyonu | scripts/check-env.ts, .github/workflows/ci.yml |
| 06.03.2026 | **demotesis config (PR #87):** demotesis medium şablon + tesis sayfası + subdomain + ders programı | lib/tenant-template-config.ts, app/tesis/[slug]/page.tsx, lib/subdomain.ts |
| 06.03.2026 | **Anket sistemi (PR #89):** survey_questions + survey_responses migration, POST respond + GET results API, franchise/anketler + veli/anketler UI | app/api/franchise/surveys/[id]/respond/route.ts, app/api/franchise/surveys/[id]/results/route.ts, app/franchise/anketler/page.tsx, app/veli/anketler/page.tsx |
| 06.03.2026 | **kartalcimnastik config (PR #78):** standard şablon + tesis sayfası + ders programı (Artistik + Ritmik) | lib/tenant-template-config.ts, app/tesis/[slug]/page.tsx |
| 06.03.2026 | **E2E testler:** Playwright specs (auth-login, demo-form, veli-panel) | e2e/auth-login.spec.ts, e2e/demo-form.spec.ts, e2e/veli-panel.spec.ts |
| 05.03.2026 | 3 şablon sistemi (standard/medium/premium), haftalık GRID, robot karşılama, randevu, paket fiyat güncellemesi, feneratasehir subdomain | tenant-site/page.tsx, components/tenant-templates/*, lib/tenant-template-config.ts, lib/subdomain.ts |
| 04.02.2026 | Veri arşivleme düzeltmesi: COO run-due ve CELF API'de archiveTaskResult eklendi | MEVCUT_DURUM_ANAYASA_KONTROL_RAPORU.md |
| 04.02.2026 | ceo_routines seed eklendi; task_results tüketimi (GET API + Raporlar sayfası) | GOREV_SONLANDIRMA_RAPORU.md |
| Şubat 2026 | A-B-C-D-E akışı tamamlandı; PWA ikonları eklendi; referans dokümanlar oluşturuldu | YISA-S-IS-AKISI-VE-ASAMALAR.md, YISA-S-FINAL-IS-HARITASI.md |

---

## 5. Nasıl Güncellenir

1. Projede **herhangi bir değişiklik** olduğunda (kod, API, sayfa, tablo, konfigürasyon) bu dosyayı **aynı gün** açın.
2. Değişikliğin türüne göre:
   - Tamamlandıysa → Bölüm 3.1'e ekleyin
   - Devam ediyorsa → Bölüm 3.2'ye ekleyin veya mevcut satırı güncelleyin
   - Yeni iş eklendiyse → Bölüm 3.3'e ekleyin
3. **Bölüm 4 (Değişiklik Kaydı)** tablosuna yeni satır ekleyin: Tarih, Değişiklik, Etkileyen Dosya(lar).
4. Faz tamamlanma yüzdeleri değiştiyse Bölüm 2 tablosunu güncelleyin.

**Bu dosya canlı iş akışı şemasıdır; projede değişiklik olduğunda aynı gün güncellenir.**
