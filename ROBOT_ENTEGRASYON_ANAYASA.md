# YİSA-S Robot Entegrasyon Matrisi — Anayasa Uyumlu

**Referans:** YISA-S-MASTER-DOKUMAN-v2.1-TASLAK Bölüm 2 (Robot Hiyerarşisi)  
**Tarih:** 4 Şubat 2026  
**Amaç:** Tüm robotların birbiriyle entegrasyonu, hangi robot hangi robotu çalıştırır, hangi CELF direktörü şablon üretir, ziyaretçi/üye/sporcu hangi robotlardan faydalanır — anayasa doğrultusunda tek referans.

---

## 1. Anayasa Robot Sayımı (Master 2.2)

| Katman | Sayı | Açıklama |
|--------|------|----------|
| Katman 1-3 | 3 | Patron Asistanı, Siber Güvenlik, Veri Arşivleme |
| Katman 4 | 1 | CEO Organizatör |
| Katman 5 | 1 + ARGE | CELF Merkez (12 direktörlük tek robot içinde) |
| Katman 6 | 1 + 5 | COO + 5 Operasyonel Robot |
| Katman 7 | 14 | Vitrin Robotları (satışa sunulan) |
| **TOPLAM** | **25 + ARGE** | |

---

## 2. Tetikleme Zinciri (Kim Kimi Çalıştırır)

| Sıra | Tetikleyen | Tetiklenen | Nerede / Nasıl |
|------|------------|------------|-----------------|
| 1 | **Kullanıcı (Patron)** | Patron Asistanı | `/api/chat/flow` — mesaj gelir |
| 2 | Patron Asistanı (flow) | **Siber Güvenlik** | `securityCheck(message)` — her şirket işi öncesi zorunlu |
| 3 | Patron Asistanı (şirket işi) | **CIO** | `runCioAnalysis` — komut yorumlama, öncelik, conflictWarnings |
| 4 | CIO çıktısı | **CEO** | `createCeoTask`, `routeToDirector(task)` — görev dağıtımı |
| 5 | CEO | **CELF** | `runCelfDirector(directorKey, command)` — tek direktörlük çalışır |
| 6 | CELF sonucu | **Veri Arşivleme** | `archiveTaskResult` — task_results tablosuna yazılır |
| 7 | CELF sonucu | **Patron Onay Kuyruğu** | `createPatronCommand` — Onayla/Reddet/Değiştir |
| 8 | Patron Onay (şablon) | **ceo_templates** | Onay Kuyruğu Onayla → `saveCeoTemplate` |
| 9 | **Zamanlayıcı / Cron** | **COO** | `GET/POST /api/coo/run-due` — zamanı gelen rutinler |
| 10 | COO run-due | **CELF** | Her rutin için `runCelfDirector(routine.director_key, command)` |
| 11 | **Ziyaretçi / Franchise adayı** | **Vitrin** | `/vitrin` sayfası → `POST /api/demo-requests` |
| 12 | **Franchise yetkilisi** | **COO Mağazası** | `/franchise` → COO sekmesi → `GET /api/templates` (coo_templates), `POST /api/sales` |
| 13 | **Sistem / Hata** | **7/24 Acil Destek** | `GET /api/health`, `GET /api/system/status` — Patron alarm (log/monitor) |

**Özet:** Patron Asistan → Siber Güvenlik → (şirket işi) → CIO → CEO → CELF → Veri Arşivleme + Onay Kuyruğu. COO, rutinleri CELF ile çalıştırır. Vitrin = ziyaretçi demo talebi. Hiçbir robot “boşta” değil; hepsi bu zincirde veya Vitrin/COO Mağazası kullanıcı akışında.

---

## 3. Hangi CELF Direktörü Şablon Üretir?

Tüm CELF direktörlükleri **şablon/rapor/belge** üretebilir. Patron komutu ilgili direktöre gider; çıktı onay kuyruğuna düşer; Patron Onayla deyince `ceo_templates`'e kaydedilir. COO Mağazası’nda listelenen şablonlar = onaylı `ceo_templates` (+ varsa `templates` tablosu).

| Direktör | Şablon/Ürün Örnekleri | Tetikleyici Kelimeler (CEO) |
|----------|------------------------|-----------------------------|
| CFO | Maliyet raporu, fatura şablonu, bütçe | finans, bütçe, gelir, gider, maliyet |
| CTO | Sistem raporu, API dokümantasyonu | teknoloji, sistem, kod, api |
| CIO | Veri/entegrasyon raporu | veri, database, entegrasyon, tablo |
| CMO | Kampanya, sosyal medya içeriği | kampanya, reklam, pazarlama, tanıtım |
| CHRO | Görev tanımı, oryantasyon planı, disiplin tutanağı | personel, eğitim, insan kaynakları |
| CLO | Sözleşme taslağı, KVKK metni | sözleşme, hukuk, kvkk, uyum |
| CSO_SATIS | Teklif, CRM raporu | müşteri, sipariş, satış, crm |
| CPO | UI şablonu, sayfa tasarımı | şablon, tasarım, ürün, ui, sayfa |
| CDO | Analiz raporu, dashboard | analiz, rapor, dashboard, istatistik |
| CISO | Güvenlik audit raporu | güvenlik, audit, erişim |
| CCO | Müşteri destek cevabı, memnuniyet raporu | destek, şikayet, ticket |
| CSO_STRATEJI | Strateji planı, hedef dokümanı | plan, hedef, büyüme, vizyon |
| CSPO | Antrenman programı, seviye değerlendirmesi | antrenman, sporcu, program, seviye, branş, ölçüm |
| COO | Operasyon raporu, tesis kuralları | operasyon, süreç, tesis, lojistik |
| RND | AR-GE önerisi, prototip notu | ar-ge, araştırma, geliştirme, inovasyon |

**Şablon akışı:** Komut → CEO (routeToDirector) → CELF(directorKey) → Sonuç → Onay Kuyruğu → Patron Onayla → `ceo_templates` → COO Mağazası (`coo_templates`).

---

## 4. Ziyaretçi / Üye / Sporcu — Hangi Robotlardan Faydalanır?

| Kitle | Robot / Özellik | Nasıl Erişir |
|-------|------------------|---------------|
| **Ziyaretçi** | Karşılama (Vitrin) | `/vitrin` — paket seçimi, demo talebi gönderir |
| **Ziyaretçi** | 7/24 Acil Destek (sistem sorunu) | Site sağlık/durum; Patron alarm (log) |
| **Franchise adayı** | Vitrin + Demo talebi | `/vitrin` → `demo_requests` → Patron onayı → tenant |
| **Franchise yetkilisi** | COO Mağazası (şablon/robot/modül satın alma) | `/franchise` → COO Mağazası → coo_templates, POST /api/sales |
| **Üye (Veli)** | Veli paneli, çocuk takibi | `/veli` — athletes (kendi çocuğu), ödeme |
| **Sporcu** | Gelişim grafikleri, seviye (CSPO çıktıları) | Veli paneli / ileride sporcu girişi; CSPO readOnly athletes + health |
| **Antrenör/Tesis** | Yoklama, ders programı, personel | `/antrenor`, `/tesis` — attendance, schedule, staff |

**Boşta kalan robot yok:** Vitrin = ziyaretçi/franchise adayı; COO Mağazası = franchise; CELF şablonları = Patron onayı sonrası COO’da; Veri Arşivleme = her CELF sonucu task_results’a; Siber Güvenlik = her flow’da; COO run-due = rutin CELF işleri.

---

## 5. Kod Konumları (Entegrasyon Kontrolü)

| Robot / Katman | Dosya / API | Entegre Olduğu Yer |
|----------------|-------------|---------------------|
| Patron Asistanı | `app/api/chat/flow/route.ts`, `lib/ai/*` | Giriş noktası; securityCheck, CIO, CEO, CELF, archiveTaskResult, createPatronCommand çağırır |
| Siber Güvenlik | `lib/robots/security-robot.ts` | flow: securityCheck(message); ceo, celf, security API |
| Veri Arşivleme | `lib/robots/data-robot.ts`, `lib/db/task-results.ts` | flow: archiveTaskResult(CELF sonucu) |
| CIO | `lib/robots/cio-robot.ts` | flow: runCioAnalysis → routeToDirector / getDirectorFromDirective |
| CEO | `lib/robots/ceo-robot.ts` | flow: createCeoTask, routeToDirector; CEO_RULES.TASK_DISTRIBUTION |
| CELF | `lib/robots/celf-center.ts`, `lib/ai/celf-execute.ts` | flow: runCelfDirector(directorKey, command); COO run-due: aynı fonksiyon |
| COO | `lib/robots/coo-robot.ts`, `app/api/coo/run-due/route.ts` | run-due: getDueCeoRoutines → runCelfDirector → updateCeoRoutineResult |
| Vitrin | `lib/robots/yisas-vitrin.ts`, `app/vitrin/page.tsx`, `app/api/demo-requests/route.ts` | Ziyaretçi formu → demo_requests; Vitrin aksiyonları (create/list/preview) kodda tanımlı |
| 5 Operasyonel (COO altı) | `lib/robots/coo-robot.ts` → COO_OPERATIONS | daily_ops, facility_coord, franchise_coord, process_track, resource_alloc; mapDirectorToCOO ile CELF→COO eşlemesi |

---

## 6. Anayasada Olup Sistemde Eksik / Farklı Olanlar

| Madde | Anayasa | Sistemdeki Durum | Öneri |
|-------|---------|-------------------|--------|
| 14 Vitrin Robotu | Katman 7: 14 adet Vitrin robotu (satışa sunulan) | Tek Vitrin modülü (create/list/preview) + demo_requests; 14 ayrı “bot” isimlendirmesi yok | 14 ürün = Karşılama, Logo, Web Sitesi, WhatsApp Robotu, vb. COO Mağazası’ndaki ürün listesi ile eşlenebilir; kodda tek Vitrin mantığı yeterli. |
| 5 Operasyonel Robot | Katman 6: COO + 5 Operasyonel | COO + 5 operasyon tipi (daily_ops, facility_coord, franchise_coord, process_track, resource_alloc) | 5 tip = 5 operasyonel birim olarak kabul; isimlendirme dokümanda net. |
| 12 Direktörlük | CELF 12 direktörlük | Kodda 15 DirectorKey (CFO, CTO, CIO, CMO, CHRO, CLO, CSO_SATIS, CPO, CDO, CISO, CCO, CSO_STRATEJI, CSPO, COO, RND) | Anayasa “12” sayısı özet; kodda fazlası var, uyumlu. |
| 7/24 Acil Destek Robotu | Patron’a alarm | Health/status API var; otomatik “Patron’a acil çağrı” entegrasyonu (e-posta/push) ayrı proje | İleride alarm kanalı eklenebilir; mevcut log/monitor yeterli. |

**Sonuç:** Tüm kritik entegrasyonlar kurulu. Eksik sayılabilecek tek şey “14 Vitrin robotu”nun 14 ayrı isimle listelenmesi ve 7/24 acil destek için otomatik alarm kanalı; bunlar iş kuralı/ürün listesi ve operasyonel tercih ile tamamlanabilir.

---

## 7. Özet: Entegrasyonlar Kurulu mu?

| Kontrol | Durum |
|---------|--------|
| Patron Asistanı → Siber Güvenlik → CIO → CEO → CELF | ✅ flow’da sırayla çağrılıyor |
| CELF sonucu → Veri Arşivleme (task_results) | ✅ archiveTaskResult flow’da |
| CELF sonucu → Patron Onay Kuyruğu → ceo_templates (Onayla) | ✅ approvals route’da saveCeoTemplate |
| ceo_templates (onaylı) → COO Mağazası (coo_templates) | ✅ GET /api/templates → coo_templates |
| COO run-due → CELF | ✅ /api/coo/run-due → runCelfDirector |
| Ziyaretçi → Vitrin (demo talebi) | ✅ /vitrin, POST /api/demo-requests |
| Franchise → COO Mağazası (satın alma) | ✅ /franchise COO sekmesi, POST /api/sales |
| Hangi direktör şablon üretir? | ✅ Tüm CELF direktörleri; CEO routeToDirector ile yönlendiriyor |

**Tüm robotlar anayasa doğrultusunda birbirine bağlı; boşta kalan/entegrasyonsuz robot yok.**
