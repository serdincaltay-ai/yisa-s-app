# YİSA-S — Canlı İş Akışı Şeması

> **CANLI DOSYA:** Projede herhangi bir değişiklik olduğunda bu dosya **aynı gün** güncellenir. Planlanan, devam eden ve tamamlanan işler burada takip edilir.
>
> **Son güncelleme:** 05.03.2026 — Kullanıcı paneli tasarım kilidi (koyu tema, alt nav) + Tesis sayfaları (3 şablon, ders programı grid, fiyat kartları) tamamlandı.
> **Son güncelleme:** 05.03.2026 — 3 Duvar entegrasyonu, güvenlik dashboard, CELF uçtan uca test, görev→dashboard yansıması tamamlandı. Genel ilerleme ~%93.
> **Son güncelleme:** 06.03.2026 — ManyChat webhook + CRM tabloları, Vitest test altyapısı (140 test), Stripe ödeme entegrasyonu, backup stratejisi. Genel ilerleme ~%95.

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
| Faz 1 | Vitrin + Demo formu + Tesis sayfaları | Büyük oranda tamam | ~%95 |
| Faz 2 | Tenant otomatik oluşturma | Tamamlandı | ~%95 |
| Faz 3 | Güvenlik robotu MVP | Büyük oranda tamam | ~%95 |
| Faz 4 | Veri robotu / Şablon havuzu | Büyük oranda tamam | ~%90 |
| Faz 5 | Franchise paneli | Büyük oranda tamam | ~%90 |
| Faz 6 | Veli paneli MVP + Stripe ödeme | Büyük oranda tamam | ~%97 |
| Faz 7 | CELF zinciri + Başlangıç görevleri + E2E testler | Büyük oranda tamam | ~%90 |

**Genel ilerleme:** ~%95 (ağırlıklı ortalama)

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
| 5 | İletişim modülü (anket eksik) | Faz 5 | Şubat 2026 | franchise/iletisim mevcut; anket yok |
| 6 | Belge yönetimi (geçerlilik uyarısı eksik) | Faz 5 | Şubat 2026 | franchise/belgeler mevcut; uyarı mekanizması yok |
| 7 | .env.example şema uyumu kontrolü | Tüm | Şubat 2026 | Her repoda .env.example mevcut; tam uyum kontrol edilmeli |
| 8 | Stripe ödeme akışı uçtan uca test (gerçek Stripe hesabıyla) | Faz 6 | 06.03.2026 | Kod hazır; gerçek hesap testi yapılmalı |

### 3.3 Yapılacak (Henüz Başlanmadı)

| # | İş | Faz | Öncelik | Not |
|---|-----|-----|---------|-----|
| ~~1~~ | ~~ManyChat / WhatsApp bot entegrasyonu~~ | ~~Faz 1~~ | ~~Orta~~ | **Yapıldı 06.03.2026** — PR #59: ManyChat webhook + CRM tabloları |
| ~~2~~ | ~~Gelişim ölçüm tabloları + API~~ | ~~Faz 4~~ | ~~Yüksek~~ | **Yapıldı 05.03.2026** — 3.1 #20 |
| ~~3~~ | ~~Çocuk gelişim referans değerleri seed~~ | ~~Faz 4~~ | ~~Yüksek~~ | **Yapıldı 05.03.2026** — 3.1 #21 |
| ~~4~~ | ~~Güvenlik dashboard paneli UI~~ | ~~Faz 3~~ | ~~Orta~~ | **Yapıldı 05.03.2026** — /dashboard/guvenlik (Bkz. 3.1 #33) |
| 5 | Bildirim / push notification altyapısı | Faz 6 | Orta | Push altyapısı yok |
| 6 | Tesis müdürü paneli — gerçek API + alt sayfalar | — | Orta | Mock veri; gerçek API gerekli |
| 7 | Temizlik personeli günlük checklist | — | Düşük | Rol var; panel yok |
| 8 | Kayıt görevlisi rol bazlı yönlendirme | — | Düşük | resolve-role'de yeni case |
| ~~9~~ | ~~Veli online aidat ödeme (İyzico/Paratika)~~ | ~~Faz 6~~ | ~~Orta~~ | **Yapıldı 06.03.2026** — PR #62+#64: Stripe Checkout Session + Webhook + expired handler |
| 10 | Yoklama SMS tetik entegrasyonu | Faz 5 | Orta | sms-provider ile entegre |
| 11 | Aidat hatırlatma mekanizması | Faz 5 | Orta | Sayfa var; hatırlatma yok |
| 12 | 7/24 Acil Destek otomatik alarm | — | Düşük | e-posta/push alarm |
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
