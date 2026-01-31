# YİSA-S ROBOT SİSTEMİ — OMURGA (30 ADIM)
## Sıralı Kurulum ve Entegrasyon Planı

**Tarih:** 31 Ocak 2026  
**Son Güncelleme:** Kit 1-5 TAMAMLANDI ✓  
**Kaynak:** YİSA-S ANAYASA, SQL dosyaları, Komut Zinciri, AI Orkestrasyon, Birimler Arası Protokol

### ✓ TAMAMLANAN BİLEŞENLER (31 Ocak 2026)

| Kit | Adım | Açıklama | Durum |
|-----|------|----------|-------|
| 1 | 1-5 | Altyapı: Supabase, .env, Auth, RLS | ✓ |
| 2 | 6-10 | Çekirdek: 8 Robot, 13 Direktörlük, CIO, CEO, CELF | ✓ |
| 3 | 11-20 | İş Akışı: Onay sistemi, Auto-approve, Rutin görevler | ✓ |
| 4 | 21-25 | İlk Görevler: 13 direktörlük başlangıç görevleri | ✓ |
| 5 | 26-30 | Entegrasyon: Sistem durumu API, Test | ✓ |

### YENİ EKLENEN DOSYALAR

```
lib/robots/
├── cio-robot.ts          # CIO strateji katmanı (YENİ)
├── patron-assistant.ts   # Patron Asistanı robotu (YENİ)
├── auto-approve.ts       # Otomatik onay sistemi (YENİ)
├── directorate-initial-tasks.ts  # 13 direktörlük ilk görevleri (YENİ)
├── celf-center.ts        # +CSPO direktörlüğü eklendi
├── ceo-robot.ts          # +CSPO keyword'leri eklendi
└── hierarchy.ts          # Güncellenmiş hiyerarşi (8 katman)

lib/db/
└── cio-logs.ts           # CIO analiz logları (YENİ)

lib/ai/
├── gpt-service.ts        # +callGPT fonksiyonu eklendi
├── gemini-service.ts     # +callGemini fonksiyonu eklendi
└── celf-pool.ts          # +CSPO eklendi

app/api/
├── startup/route.ts      # Başlangıç görevleri API (YENİ)
├── system/status/route.ts # Sistem durumu API (YENİ)
└── chat/flow/route.ts    # +CIO entegrasyonu

supabase/migrations/
├── 20260131_add_cspo_directorate.sql    # CSPO ekleme
├── 20260131_cio_analysis_logs.sql       # CIO log tablosu
└── 20260131_seed_robots_directorates.sql # Seed verisi

supabase/
└── validate-system.sql   # Doğrulama scripti (YENİ)
```

---

# BÖLÜM 1: OMURGA ÖZETİ

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    YİSA-S HİYERARŞİSİ (Anayasadan)                               │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  PATRON (Serdinç Altay)                                                          │
│       │                                                                          │
│       ▼                                                                          │
│  PATRON ASİSTANI (Claude/GPT) — Özel işler, AR-GE, danışmanlık                  │
│       │                                                                          │
│       ▼                                                                          │
│  CIO (Strateji Beyin) — Komut yorumlama, önceliklendirme                         │
│       │                                                                          │
│       ▼                                                                          │
│  CEO (Operasyon Beyin) — Direktörlüklere dağıtım, toplama                        │
│       │                                                                          │
│       ▼                                                                          │
│  CELF (12 Direktörlük) — İş üretimi                                             │
│  CFO | CTO | CMO | CHRO | CLO | CSO | CPO | CDO | CISO | CCO | CSO-STR | CSPO  │
│       │                                                                          │
│       ▼                                                                          │
│  COO (Vitrin) — Franchise’lara hizmet                                           │
│       │                                                                          │
│       ▼                                                                          │
│  FRANCHISE’LAR (Tenant’lar)                                                      │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

# BÖLÜM 2: 30 ADIMLI SIRALI KURULUM

## KİT 1: ALTYAPI (Adım 1–6)

| # | Adım | Açıklama | Kaynak | Tahmini |
|---|------|----------|--------|---------|
| 1 | Supabase veritabanı kurulumu | YISA-S-TAM-KURULUM.sql veya 01→10 part sırasıyla çalıştır | 01_temel_tablolar.sql, YISA-S-TAM-KURULUM.sql | 1 saat |
| 2 | Tablo doğrulama | 10_final_dogrulama.sql ile tabloları, trigger’ları, RLS’i kontrol et | 10_final_dogrulama.sql | 30 dk |
| 3 | .env yapılandırması | NEXT_PUBLIC_SUPABASE_URL, ANON_KEY, SERVICE_ROLE_KEY, API anahtarları | .env.example | 15 dk |
| 4 | Auth ↔ users eşlemesi | Supabase Auth kullanıcıları ile users tablosu bağlantısı (auth_id) | roles.ts, patron lock | 1 saat |
| 5 | RLS ve `get_user_tenant_id()` | Tenant izolasyonu için yardımcı fonksiyonların çalıştığından emin ol | 06_rls_politikalari.sql | 30 dk |
| 6 | 7 robot + 12 direktörlük seed | robots ve celf_directorates seed verilerinin yüklü olduğunu doğrula | YISA-S-TAM-KURULUM Part 8 | 15 dk |

---

## KİT 2: ÇEKİRDEK ROBOTLAR (Adım 7–12)

| # | Adım | Açıklama | Kaynak | Tahmini |
|---|------|----------|--------|---------|
| 7 | Patron Asistanı (giriş noktası) | Patron komutlarını alan, analiz eden, CIO’ya ileten katman | yisa-s-ai-orkestrasyon.md, ai-protokol-sistemi.md | 2 saat |
| 8 | CIO mantığı | Komut yorumlama, direktörlük seçimi, önceliklendirme | yisa-s-komut-zinciri-protokol.md | 2 saat |
| 9 | CEO mantığı | Görev dağıtımı, CELF’e yönlendirme, sonuç toplama | yisa-s-birimler-arasi-protokol.md | 2 saat |
| 10 | CELF pool (12 direktörlük) | director_key → doğru AI’a yönlendirme (CFO→Claude, CMO→GPT, vb.) | YISA-S_ROBOT_GOREVLENDIRME_ILK_ISLER.md, ai-orkestrasyon | 2 saat |
| 11 | COO (Vitrin) mantığı | Onaylanan içerikleri vitrinde gösterme, franchise’lara sunma | komut-zinciri-protokol | 1 saat |
| 12 | Message Queue / Bağımlılık zinciri | Birimler arası iletişim CEO üzerinden, bağımlılık yönetimi | yisa-s-birimler-arasi-protokol.md (KURAL 1–4) | 2 saat |

---

## KİT 3: İŞ AKIŞI VE ONAY (Adım 13–18)

| # | Adım | Açıklama | Kaynak | Tahmini |
|---|------|----------|--------|---------|
| 13 | Patron komut → patron_commands tablosu | Her komut kaydı, durum akışı (beklemede→islemde→tamamlandi) | patron_commands, ceo_tasks | 1 saat |
| 14 | ceo_tasks tablosu ve akış | CEO’nun CELF’e dağıttığı görevlerin takibi | ceo_tasks_rows.sql | 1 saat |
| 15 | Onay kuyruğu (approval_queue) | Patron onayı gereken işlerin listesi ve işlenmesi | yisa-s-ai-protokol-sistemi.md | 1.5 saat |
| 16 | İş durumu akışı | RECEIVED → PLANNED → IN_PROGRESS → PRODUCED → READY_FOR_REVIEW → APPROVED/REVISION/CANCELLED | ai-protokol-sistemi (Bölüm 3.2) | 1 saat |
| 17 | Rutin vs yeni iş ayrımı | Rutin işlerde auto-approve, yeni işlerde patron onayı | ai-protokol-sistemi (Bölüm 5) | 1 saat |
| 18 | Audit log entegrasyonu | Tüm kritik işlemlerin audit_logs’a yazılması (KURAL 5) | 05_kritik_sistem, core_rules | 1 saat |

---

## KİT 4: DİREKTÖRLÜK İLK GÖREVLERİ (Adım 19–24)

| # | Adım | Direktörlük | İlk görev özeti | Kaynak |
|---|------|-------------|-----------------|--------|
| 19 | CFO | Muhasebe şablonları, kasa defteri, aidat takip, fiyatlandırma | ROBOT_GOREVLENDIRME 2.1 |
| 20 | CTO | Veritabanı, API, CI/CD, paneller, backup | ROBOT_GOREVLENDIRME 2.2 |
| 21 | CMO | 50+ slogan, mesaj şablonları, sosyal medya | ROBOT_GOREVLENDIRME 2.3 |
| 22 | CHRO | Rol tanımları, sözleşmeler, performans formları | ROBOT_GOREVLENDIRME 2.4, baslangic 2.1 |
| 23 | CLO | Franchise/üyelik sözleşmeleri, KVKK, izin belgeleri | ROBOT_GOREVLENDIRME 2.5, baslangic 2.2 |
| 24 | Diğer 7 direktörlük | CSO, CPO, CDO, CISO, CCO, CRDO, CSPO — şablon ve ilk görevler | ROBOT_GOREVLENDIRME 2.6–2.12 |

---

## KİT 5: ENTEGRASYON VE TEST (Adım 25–30)

| # | Adım | Açıklama | Kaynak | Tahmini |
|---|------|----------|--------|---------|
| 25 | AI Router (görev → AI seçimi) | Karar/analiz→Claude, içerik→GPT, hızlı→Gemini, batch→Together | yisa-s-ai-orkestrasyon.md | 2 saat |
| 26 | Token ekonomisi | Günlük limitler, direktörlük bütçeleri, franchise token | ai-protokol-sistemi Bölüm 7 | 1.5 saat |
| 27 | Tenant izolasyonu | RLS, tenant_id filtreleme, veri katmanları (Global/Agregatif/Tenant/Patron) | komut-zinciri Bölüm 5 | 1 saat |
| 28 | Güvenlik robotu (Siber) | 3 Duvar sistemi, log tarama, bypass önleme (KURAL 6) | ROBOT_GOREVLENDIRME 2.9 | 1.5 saat |
| 29 | Öneri sistemi | Her direktörlük günde 2–3 öneri → CEO → CIO → Patron sabah raporu | ai-protokol-sistemi Bölüm 6 | 1.5 saat |
| 30 | End-to-end test | “Yaz kampı tanıtım videosu” benzeri tam ürün akışı testi | yisa-s-birimler-arasi-protokol (Bölüm 3) | 2 saat |

---

# BÖLÜM 3: BAĞIMLILIK DİYAGRAMI

```
1 ──► 2 ──► 3 ──► 4 ──► 5 ──► 6     (Kit 1: Altyapı sıralı)
       │
       └──────────────────────────► 7 ──► 8 ──► 9 ──► 10 ──► 11 ──► 12  (Kit 2: Robotlar)
                                                                     │
                                                                     └──► 13 ──► 14 ──► 15 ──► 16 ──► 17 ──► 18  (Kit 3: İş akışı)
                                                                                                                   │
                                                                                                                   └──► 19 … 24  (Kit 4: Direktörlük görevleri)
                                                                                                                                  │
                                                                                                                                  └──► 25 ──► 26 ──► 27 ──► 28 ──► 29 ──► 30  (Kit 5: Entegrasyon)
```

---

# BÖLÜM 4: MEVCUT DURUM VE EKSİKLER

## Mevcut Uygulamada Var Olanlar

- Patron girişi (Supabase Auth)
- Dashboard (sidebar, ana sayfa, alt sayfalar)
- Chat/flow API (GPT → Gemini/Claude → Patron onay)
- CELF pool (direktörlük ataması)
- Patron onay UI (PatronApproval)
- ceo_tasks, patron_commands tabloları
- 7 robot seed
- Stats API, franchises, onay kuyruğu sayfaları

## Eksik veya Tamamlanması Gerekenler

| Eksik | Açıklama | İlgili Adım |
|-------|----------|-------------|
| CIO katmanı | Stratejik komuta, komut yorumlama — şu an doğrudan CEO/CELF’e gidiyor | 8 |
| Message Queue | Birimler arası standart mesaj formatı ve CEO üzerinden iletişim | 12 |
| Rutin vs yeni ayrımı | “Bu iş rutin olsun” ile auto-approve listesi | 17 |
| 12 direktörlük ilk görevleri | Her direktörlüğün kendi şablon/görev seti | 19–24 |
| Öneri sistemi | Günlük 2–3 öneri → sabah raporu | 29 |
| Token limitleri | Günlük/direktörlük bütçe kontrolü | 26 |
| Veri robotu | Bilgi deposu, şablon kütüphanesi (ayrı servis) | Altyapı |
| CRDO / CSPO | CELF’te CSO-STRATEJI ve CSPO (Spor) tanımlı mı kontrol et | 10, 24 |

---

# BÖLÜM 5: NASIL İLERLENECEK?

1. **Kit 1 (1–6):** Altyapı eksiksiz mi, kontrol et. Eksikse tamamla.
2. **Kit 2 (7–12):** Mevcut chat flow’u, CIO ve CEO mantığıyla uyumlu hale getir.
3. **Kit 3 (13–18):** Onay kuyruğu ve iş durumu akışını anayasa ile uyumlu yap.
4. **Kit 4 (19–24):** Her direktörlük için “ilk görev” şablonlarını tanımla (veya AI ile üret).
5. **Kit 5 (25–30):** Router, token, izolasyon, güvenlik, öneri ve son test.

---

**Her adım tamamlandıkça bu dokümana "✓" işareti koy. Atlama yapma. Eksik kalan yerleri birlikte netleştireceğiz.**
