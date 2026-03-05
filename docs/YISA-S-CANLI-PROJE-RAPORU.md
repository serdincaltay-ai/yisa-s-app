# YİSA-S — Canlı Proje Raporu

> **CANLI DOSYA:** Bu dosya, eski şema/durum/analiz raporlarından çıkarılan iş maddelerinin tek listesidir. **Bir iş yapıldığında, düzeltildiğinde veya eklendiğinde hemen burada güncellenir.** Hedef: Bu rapordan hiçbir madde hedeften düşürülmeden, "yapıldı" / "düzeltildi" / "yapılacak" durumu canlı tutulacak.
>
> **Güncelleme kuralı:** İşi tamamladığınızda ilgili satırda **Durum** → Yapıldı veya Düzeltildi; **Son güncelleme** → bugünün tarihi (GG.AA.YYYY); **Not** → kısa açıklama yazın.

**Son rapor güncellemesi:** 05.03.2026 — Veli paneli canlı veri testi (BJK users + parent bağlantısı) tamamlandı; tüm kaynak belgelerden yapılmayan iş maddeleri güncellendi.

---

## Durum Değerleri

| Kodu | Anlamı |
|------|--------|
| **Yapılacak** | Henüz başlanmadı |
| **İşleniyor** | Üzerinde çalışılıyor |
| **Yapıldı** | Tamamlandı |
| **Düzeltildi** | Var olan bir şey güncellendi/düzeltildi |
| **Mevcut** | Zaten kodda/şemada mevcut (ek iş yok) |

---

## 0. 7 Faz — Yapılan / Yapılmayan (Dev Değerlendirmesi)

*Kaynak: YISA_S_V0_YOL_HARITASI.md. Kod tabanı (tenant-yisa-s, app-yisa-s, yisa-s-com) incelenerek adım adım değerlendirildi. Detay: YISA-S-7-FAZ-DURUMU.md.*

### Faz 1 — Vitrin + Demo + Tesis Sayfaları (~%95)

| Faz | Adım | Madde / iş | Durum | Son güncelleme | Not |
|-----|-------|------------|--------|----------------|-----|
| Faz 1 | 1.1 | Core migration (tenants, demo_requests, user_tenants, students, staff, payments, attendance) | Yapıldı | 05.03.2026 | scripts/006_rls_policies.sql + API'ler bu tabloları kullanıyor |
| Faz 1 | 1.2 | Demo formu sayfası (yisa-s.com/demo) | Yapıldı | 05.03.2026 | yisa-s-com/app/demo/DemoForm.tsx |
| Faz 1 | 1.3 | POST /api/demo-requests (yeni talep kayıt) | Yapıldı | 05.03.2026 | tenant-yisa-s + yisa-s-com'da mevcut |
| Faz 1 | 1.4 | GET /api/demo-requests (patron listesi) | Yapıldı | 05.03.2026 | tenant-yisa-s/app/api/demo-requests/route.ts |
| Faz 1 | 1.5 | Onay/Red (approve/reject) | Yapıldı | 05.03.2026 | POST action=decide → provisionTenant() / rejectDemoRequest() |
| Faz 1 | 1.6 | Onay kuyruğu sayfası | Yapıldı | 05.03.2026 | patron/onay-kuyrugu + api/onay-kuyrugu |
| Faz 1 | — | ManyChat entegrasyonu | Yapılacak | 05.03.2026 | Webhook/bot bağlantısı kodda yok |
| Faz 1 | — | Vitrin sayfaları (ozellikler, fiyatlandirma, hakkimizda vb.) | Yapıldı | 05.03.2026 | yisa-s-com/app: 10+ sayfa mevcut |
| Faz 1 | — | Tesis sayfaları 3 şablon sistemi (standard/medium/premium) | **Yapıldı** | 05.03.2026 | tenant-yisa-s: 3 şablon + config + GRID + robot |
| Faz 1 | — | Haftalık ders programı GRID bileşeni | **Yapıldı** | 05.03.2026 | WeeklyScheduleGrid.tsx: saatler×günler, renk kodlu |
| Faz 1 | — | Robot karşılama + randevu sistemi (premium) | **Yapıldı** | 05.03.2026 | RobotGreeting.tsx + PremiumTemplate randevu modalı |
| Faz 1 | — | Paket fiyatları güncellemesi (24→30K, 48→52.8K, 60→60K) | **Düzeltildi** | 05.03.2026 | tenant-yisa-s + v0-web-page-content-edit-bjktesis |

### Faz 2 — Tenant Oluşturma (~%95)

| Faz | Adım | Madde / iş | Durum | Son güncelleme | Not |
|-----|-------|------------|--------|----------------|-----|
| Faz 2 | 2.1 | provisionTenant zinciri (6 adım: tenant→user→franchise→subdomain→seed→status) | Yapıldı | 05.03.2026 | lib/services/tenant-provisioning.ts (501 satır) |
| Faz 2 | 2.2 | CELF otomatik tetikleme (sim_updates üzerinden) | Yapıldı | 05.03.2026 | provisionTenant → triggerCelfStartup (Step 7) eklendi; sim_updates tablosuna tenant_baslangic_gorevleri INSERT yapılıyor; 12 direktörlük bilgisi command JSON'a dahil |
| Faz 2 | — | Subdomain oluşturma (franchise_subdomains) | Yapıldı | 05.03.2026 | createSubdomain() mevcut |
| Faz 2 | — | feneratasehir subdomain desteği | **Yapıldı** | 05.03.2026 | FRANCHISE_SUBDOMAINS_DEFAULT'a eklendi |
| Faz 2 | — | Rollback / compensating transaction | Yapıldı | 05.03.2026 | rollback() fonksiyonu mevcut |

### Faz 3 — Güvenlik Robotu MVP (~%80)

| Faz | Adım | Madde / iş | Durum | Son güncelleme | Not |
|-----|-------|------------|--------|----------------|-----|
| Faz 3 | 3.1 | Audit log tablosu + API | Yapıldı | 05.03.2026 | security_logs, createSecurityLog(), api/security |
| Faz 3 | 3.2 | RLS politikaları (tüm tablolar) | Yapıldı | 05.03.2026 | 006_rls_policies.sql (1539 satır) — kapsamlı |
| Faz 3 | 3.3 | Güvenlik paneli (dashboard UI) | Yapılacak | 05.03.2026 | API endpoint var; ayrı güvenlik dashboard sayfası yok |
| Faz 3 | — | 3 Duvar sistemi tam entegrasyonu | İşleniyor | 05.03.2026 | forbidden-zones.ts, patron-lock.ts, siber-guvenlik.ts mevcut; tam entegrasyon eksik |

### Faz 4 — Veri Robotu / Şablon Havuzu (~%90)

| Faz | Adım | Madde / iş | Durum | Son güncelleme | Not |
|-----|-------|------------|--------|----------------|-----|
| Faz 4 | 4.1 | Şablon tabloları (ceo_templates, templates, v0_template_library) | Yapıldı | 05.03.2026 | api/templates (305 satır) — 3 tablodan çekiyor |
| Faz 4 | 4.2 | Gelişim ölçüm tabloları (gelisim_olcumleri, referans_degerler, sport_templates) | **Yapıldı** | 05.03.2026 | scripts/011_veri_robotu_tablolar.sql — 3 tablo + RLS + index |
| Faz 4 | — | Gelişim analiz API (referans karşılaştırma + branş önerisi) | **Yapıldı** | 05.03.2026 | api/gelisim-analiz/route.ts — POST endpoint, vücut tipi tahmini, branş önerisi |
| Faz 4 | — | Gelişim ölçümleri GET/POST API | **Yapıldı** | 05.03.2026 | api/gelisim-olcumleri/route.ts — şablon bazlı JSONB ölçüm kaydı |
| Faz 4 | — | Çocuk gelişim referans değerleri seed (WHO/TGF) | **Yapıldı** | 05.03.2026 | scripts/012_referans_degerler_seed.sql — 10 parametre, yaş 5-15, E/K |
| Faz 4 | — | Veli/gelisim birleşik sorgu (athlete_measurements + gelisim_olcumleri) | **Yapıldı** | 05.03.2026 | api/veli/gelisim/route.ts güncellendi |

### Faz 5 — Franchise Paneli (~%90)

| Faz | Adım | Madde / iş | Durum | Son güncelleme | Not |
|-----|-------|------------|--------|----------------|-----|
| Faz 5 | 5.1 | Dashboard | Yapıldı | 05.03.2026 | app/franchise/page.tsx |
| Faz 5 | 5.2 | Öğrenci modülü (CRUD) | Yapıldı | 05.03.2026 | franchise/ogrenci-yonetimi, panel/ogrenciler, api/students |
| Faz 5 | 5.3 | Yoklama modülü | Yapıldı | 05.03.2026 | franchise/yoklama, panel/yoklama, api/attendance |
| Faz 5 | 5.4 | Aidat/kasa modülü | Yapıldı | 05.03.2026 | panel/odemeler, panel/aidat, kasa, api/payments, api/kasa |
| Faz 5 | — | Ders programı | Yapıldı | 05.03.2026 | panel/program, api/franchise/schedule |
| Faz 5 | — | Personel yönetimi | Yapıldı | 05.03.2026 | api/franchise/personel, api/franchise/staff |

### Faz 6 — Veli Paneli MVP (~%90)

| Faz | Adım | Madde / iş | Durum | Son güncelleme | Not |
|-----|-------|------------|--------|----------------|-----|
| Faz 6 | 6.1 | Veli paneli sayfaları | Yapıldı | 05.03.2026 | app/veli: dashboard, cocuk, gelisim, mesajlar, odeme, duyurular, kredi, giris |
| Faz 6 | — | Veli API'leri | Yapıldı | 05.03.2026 | api/veli: children, attendance, payments, messages, health, gelisim, schedule, movements, ai-insights |
| Faz 6 | — | Bildirim / push notification | Yapılacak | 05.03.2026 | Push notification altyapısı yok |
| Faz 6 | — | Veli paneli canlı veri testi (BJK parent bağlantısı + auth) | **Yapıldı** | 05.03.2026 | 2 test veli kullanıcısı oluşturuldu; 3 sporcu parent_user_id ile bağlandı; demo auth → gerçek signInWithPassword; user_tenants role='veli' eklendi |

### Faz 7 — CELF Zinciri + Başlangıç Görevleri (~%80)

| Faz | Adım | Madde / iş | Durum | Son güncelleme | Not |
|-----|-------|------------|--------|----------------|-----|
| Faz 7 | 7.1 | Başlangıç görev motoru | Yapıldı | 05.03.2026 | directorate-initial-tasks.ts (15 direktörlük, 25+ görev), api/startup |
| Faz 7 | — | 15 direktörlük CELF yapısı | Yapıldı | 05.03.2026 | celf-center.ts, celf-config-merged.ts, hierarchy.ts |
| Faz 7 | — | CEO/COO/CIO robot | Yapıldı | 05.03.2026 | ceo-robot.ts, coo-robot.ts, cio-robot.ts |
| Faz 7 | — | Patron onay → CELF tetik uçtan uca akış | Yapıldı | 05.03.2026 | provisionTenant zincirinde Step 7 (triggerCelfStartup) ile sim_updates → CELF tetikleme bağlandı |
| Faz 7 | — | Görev sonuçlarının dashboard'a yansıması | İşleniyor | 05.03.2026 | task_results arşivleme var; dashboard gösterimi kısmen |

---

## 1. Yol Haritası ve Proje Süreci — Maddeler

*Kaynak: YISA_S_V0_YOL_HARITASI.md, YISA_S_V0_YOL_HARITASI_v2.md, YISA_S_VIZYON_HARITASI.md, YISA_S_TAM_YOL_HARITASI_DEGERLENDIRME.md, DEV-YOL-HARITASI-VS-MEVCUT-SUREC.md*

| # | Kaynak dosya | Madde / iş | Durum | Son güncelleme | Not |
|---|---------------|-------------|--------|----------------|-----|
| 1.1 | YISA_S_V0_YOL_HARITASI | 7 faz tanımı ve adım planı | Mevcut | 05.03.2026 | 7 faz docs/ içinde tanımlı; adım bazlı değerlendirme yukarıda |
| 1.2 | YISA_S_V0_YOL_HARITASI | ManyChat / WhatsApp bot entegrasyonu | Yapılacak | 05.03.2026 | Vitrin chat bot bağlantısı henüz yok |
| 1.3 | YISA_S_V0_YOL_HARITASI_v2 | Gelişim ölçüm sistemi (referans değerler, yaş bazlı analiz) | **Yapıldı** | 05.03.2026 | Faz 4 tamamlandı — 3 tablo, 3 API, WHO/TGF seed |
| 1.4 | YISA_S_VIZYON_HARITASI | CELF zinciri tam otomasyon (boşta robot yok) | İşleniyor | 05.03.2026 | Başlangıç görev motoru var; uçtan uca otomasyon test edilmeli |
| 1.5 | YISA_S_TAM_YOL_HARITASI_DEGERLENDIRME | Mobil uygulama / PWA optimizasyonu | Yapılacak | 05.03.2026 | icon.svg PWA var; native mobil uygulama planlanmamış |
| 1.6 | YISA_S_VIZYON_HARITASI | Uluslararası genişleme (çoklu dil, para birimi) | Yapılacak | 05.03.2026 | Şu an sadece Türkçe / TRY |

---

## 2. İlerleme Haritası — Maddeler

*Kaynak: YISA-S-IS-AKISI-VE-ASAMALAR.md, YISA-S-FINAL-IS-HARITASI.md*

| # | Kaynak dosya | Madde / iş | Durum | Son güncelleme | Not |
|---|---------------|-------------|--------|----------------|-----|
| 2.1 | FINAL-IS-HARITASI | BJK Tuzla logosu tenant'a ekle | Yapılacak | 05.03.2026 | public/tenants/bjktuzlacimnastik/logo.png — kullanıcı ekleyecek |
| 2.2 | FINAL-IS-HARITASI | 137 öğrenci/ödeme/yoklama verisi Supabase kontrolü | **Yapıldı** | 05.03.2026 | **140 sporcu, 1575 ödeme, 3022 yoklama** — hedef aşıldı. student_attendance=0 (attendance tablosu kullanılıyor). athlete_measurements=0, users=0 (parent_user_id bağlı değil). |
| 2.3 | FINAL-IS-HARITASI | Eksik veri varsa migration/seed ile BJK tenant'a eşle | **Yapıldı** | 05.03.2026 | parent_user_id bağlantısı kuruldu (3 sporcu, 2 veli); user_tenants role='veli' eklendi; kırık trigger (trg_update_athletes) düzeltildi. Kalan eksik: athlete_measurements=0 (gelişim ölçümü henüz girilmemiş). |
| 2.4 | FINAL-IS-HARITASI | .env.example şema uyumu (3 çekirdek repo) | İşleniyor | 05.03.2026 | Her repoda .env.example mevcut; tam uyum kontrol edilmeli |
| 2.5 | IS-AKISI-VE-ASAMALAR | A→B→C→D→E akışı | Yapıldı | 05.03.2026 | Tüm aşamalar tamamlandı |

---

## 3. Şema, Durum ve Analiz — Maddeler

*Kaynak: MEVCUT_DURUM_ANAYASA_KONTROL_RAPORU, KULLANICI-PANELLERI-DURUM-RAPORU, GOREV_SONLANDIRMA_RAPORU, TENANT_PENCEREDE_YAPILACAKLAR, MIGRATION_EKSIK_KOLONLAR_RAPORU, ROL_PANEL_GOREVLENDIRME_ANAYASA*

| # | Kaynak dosya | Madde / iş | Durum | Son güncelleme | Not |
|---|---------------|-------------|--------|----------------|-----|
| 3.1 | ANAYASA_KONTROL | Güvenlik robotu — tüm API'lerde securityCheck | Yapıldı | 05.03.2026 | Flow, CEO, CELF, Security API hepsi kullanıyor |
| 3.2 | ANAYASA_KONTROL | Veri arşivleme — archiveTaskResult (flow, CELF API, COO) | Düzeltildi | 05.03.2026 | 4 Şubat'ta düzeltildi; 3 kaynakta da çalışıyor |
| 3.3 | ANAYASA_KONTROL | 7/24 Acil Destek otomatik alarm (e-posta/push) | Yapılacak | 05.03.2026 | Patron manuel izliyor; otomatik alarm yok |
| 3.4 | ANAYASA_KONTROL | ceo_routines.data_sources kullanımı | Yapılacak | 05.03.2026 | CELF'e context olarak geçirilebilir |
| 3.5 | PANELLER-DURUM | Tesis müdürü paneli — gerçek API + alt sayfalar | Yapılacak | 05.03.2026 | Tek sayfa mock veri; /tesis/ogrenciler, /tesis/dersler vb. yok |
| 3.6 | PANELLER-DURUM | Temizlik personeli — günlük checklist sayfası/API | Yapılacak | 05.03.2026 | Rol var (cleaning); ayrı panel/checklist yok |
| 3.7 | PANELLER-DURUM | Kayıt görevlisi — rol bazlı ayrı yönlendirme | Yapılacak | 05.03.2026 | Şu an franchise/panel kullanıyor; resolve-role'de yeni case |
| 3.8 | PANELLER-DURUM | Veli paneli canlı veri testi (parent_user_id + giriş) | **Yapıldı** | 05.03.2026 | 2 test veli (veli1@bjktuzla.test, veli2@bjktuzla.test) oluşturuldu; 3 sporcu parent_user_id ile bağlandı; demo→gerçek auth; veli/giris signInWithPassword, veli/dashboard /api/veli/children kullanıyor |
| 3.9 | TENANT_YAPILACAKLAR | Yoklama SMS tetik entegrasyonu | Yapılacak | 05.03.2026 | sms_templates + sms-provider ile entegre edilecek |
| 3.10 | TENANT_YAPILACAKLAR | Aidat hatırlatma / toplu düzenleme | Yapılacak | 05.03.2026 | franchise/aidatlar sayfası mevcut; hatırlatma mekanizması eksik |
| 3.11 | TENANT_YAPILACAKLAR | İletişim modülü (duyurular, anketler, eğitmen-veli mesajlaşma) | İşleniyor | 05.03.2026 | franchise/iletisim ve mesajlar var; anket yok |
| 3.12 | TENANT_YAPILACAKLAR | Belge yönetimi (sağlık raporu geçerlilik uyarıları, veli yükleme) | İşleniyor | 05.03.2026 | franchise/belgeler mevcut; geçerlilik uyarı mekanizması eksik |
| 3.13 | TENANT_YAPILACAKLAR | Veli online aidat ödeme (İyzico/Paratika entegrasyonu) | Yapılacak | 05.03.2026 | Ödeme UI var; payment gateway entegrasyonu yok |
| 3.14 | GOREV_SONLANDIRMA | API anahtarları .env'de tanımlı (AI asistanlar çalışsın) | İşleniyor | 05.03.2026 | Supabase anahtarları mevcut; AI provider anahtarları ortamda kontrol edilmeli |
| 3.15 | MIGRATION_EKSIK | Eksik kolonlar ve migration uyumu | İşleniyor | 05.03.2026 | Bazı eksik kolonlar raporlanmış; TEK_SEFERDE ile giderilmesi önerilmiş |
| 3.16 | ROL_PANEL_ANAYASA | 13 rol tanımı ve panel eşlemesi | Yapıldı | 05.03.2026 | resolve-role.ts + panel yönlendirmesi mevcut |

---

## 4. İş Akışı / Giriş / Şema — Maddeler

*Kaynak: IS_SEMASI_YISA_S, UC_SITE_BAGLANTI_VE_AKIS, VERI_KAYNAKLARI_ROBOT_GOREVLENDIRME*

| # | Kaynak dosya | Madde / iş | Durum | Son güncelleme | Not |
|---|---------------|-------------|--------|----------------|-----|
| 4.1 | IS_SEMASI | Patron → CIO → CEO → CELF zinciri | Yapıldı | 05.03.2026 | Omurga sağlam; tüm tetikleme noktaları kodda |
| 4.2 | IS_SEMASI | COO cron (run-due) → rutin görevler | Yapıldı | 05.03.2026 | /api/coo/run-due çalışıyor |
| 4.3 | UC_SITE_BAGLANTI | 3 site arası subdomain yönlendirme | Yapıldı | 05.03.2026 | yisa-s.com → tenant-yisa-s → *.yisa-s.com |
| 4.4 | UC_SITE_BAGLANTI | Vitrin → demo → onay → tenant oluşturma akışı | Yapıldı | 05.03.2026 | Uçtan uca akış kodda mevcut |
| 4.5 | VERI_KAYNAKLARI | Veri robotu → şablon kütüphanesi okuma/yazma | Yapıldı | 05.03.2026 | ceo_templates, templates, v0_template_library |
| 4.6 | VERI_KAYNAKLARI | Güvenlik robotu → security_logs yazma/okuma | Yapıldı | 05.03.2026 | securityCheck + createSecurityLog |
| 4.7 | IS_SEMASI | Franchise tenant izolasyonu (RLS ile) | Yapıldı | 05.03.2026 | 006_rls_policies.sql kapsamlı |

---

## 5. Nasıl Güncellenir

1. Bir işi **tamamladığınızda** veya **düzelttiğinizde** bu dosyayı açın.
2. İlgili satırda:
   - **Durum** → `Yapıldı` veya `Düzeltildi` yapın.
   - **Son güncelleme** → O günün tarihi (örn. 05.03.2026).
   - **Not** → Kısa açıklama (örn. "API eklendi", "RLS migration uygulandı").
3. Yeni bir madde (eski rapordan) eklendiğinde yeni satır ekleyin; durumu **Yapılacak** veya **Mevcut** olarak işaretleyin.
4. Bu dosyayı commit ederken commit mesajında "Canlı rapor güncellendi: [madde no] Yapıldı" gibi belirtin.

**Bu dosya canlı proje dosyasıdır; yapıldı / düzeltildi / eklendi anında buraya işlenir.**
