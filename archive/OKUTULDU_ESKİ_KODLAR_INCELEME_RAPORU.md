# OKUTULDU Klasörü İnceleme Raporu

**Kaynak:** `YİSA-ESKİ KODLAR\OKUTULDU`  
**Tarih:** 4 Şubat 2026  
**Amaç:** Eksik bilgi, veritabanına eklenebilecek yapılar ve veritabanından çekilebilecek detayların tespiti.

---

## 1. OKUTULDU İÇERİĞİ ÖZETİ

### Okunabilir dosyalar (metin/SQL/MD)

| Dosya | İçerik |
|-------|--------|
| `çatı.txt` | Robot entegrasyonu, sayfa ilişkileri, Claude/Supabase/Vercel/GitHub kayıtlı site sorusu |
| `YISA-S-TAM-SISTEM-V3/*.md` | Platform mimarisi, tam sistem çatısı, kurulum, içerik QA, şablon mağazası, fiyatlandırma |
| `YISA-S-TAM-SISTEM-V3/*.sql` | Eski V3 veritabanı şemaları (multi-tenant, robot, QA, güvenlik, sigorta, safe mode) |

### Okunamayan / ikili

- `.docx`, `.pdf`, `.xlsx`, `.zip` — doğrudan metin çıkarılamadı.

---

## 2. BİZDE EKSİK OLABİLECEK BİLGİLER (Dokümantasyon)

Aşağıdakiler mevcut projede referans veya kural olarak yoksa eklenebilir.

### 2.1 Platform mimarisi (PLATFORM_MIMARISI.md)

- **Tenant/Branch/User modeli:** `tenants`, `branches`, `users` alanları (plan, modules_enabled, working_hours JSONB).
- **Şablon mirası:** Global → Tenant → Branch override zinciri.
- **Robot orkestrasyon akışı:** Router → Şube robotu → Veritabanından bilgi çekme → Cevap.
- **Modül listesi:** kasa, muhasebe, personel, sporcu, antrenör, veli, satış, takvim, raporlar, ai.
- **API endpoint yapısı:** `/api/tenants/`, `/api/branches/`, `/api/agents/chat`, `/api/templates/`.

**Öneri:** `archive/` veya `docs/` altında referans mimari dokümanı olarak saklanabilir; mevcut CELF/COO/CEO yapısına karşı “alternatif/gelecek” model olarak.

### 2.2 Tam sistem çatısı (TAM_SISTEM_CATISI.md)

- **18 kurumsal robot + firma robotları:** Patron Asistan, Ana Robot, 12 kurumsal birim (Muhasebe, İK, AR-GE, Pazar, İdari, Hukuk, Pazarlama, Teknik, Tasarım, CRM, Video, Fuar), 3 veri/şablon robotu, Admin Asistan.
- **Entegre AI platform tablosu:** Claude, GPT, Gemini, Together, V0, Cursor, GitHub, Vercel, Supabase; Canva/CapCut/Sora/Midjourney eklenebilir.
- **Güvenlik ve yetki matrisi:** Patron / Asistan / Ana / Kurumsal / Admin / Firma robot yetkileri.
- **Kurulum fazları:** Faz 1–8 (temel sistem → ana robot → kurumsal → veri/şablon → AI entegrasyonları → firma → güvenlik → lansman).

**Öneri:** Robot hiyerarşisi ve yetki matrisi, mevcut Master doküman veya ROBOT_ENTEGRASYON_ANAYASA ile karşılaştırılıp eksik maddeler Master’a not olarak eklenebilir.

### 2.3 İçerik QA ve şablon mağazası (ICERIK_QA_SABLON_MAGAZASI.md, SABLON_VERI_FIYATLANDIRMA.md)

- **Kalite puanlama (0–100):** Teknik %25, Görsel %30, İçerik %20, Marka %15, Kullanılabilirlik %10.
- **Şablon kategorileri:** Web, sosyal medya, çalışan, antrenör, veli iletişim, finans/muhasebe, AI davranış.
- **İşletme profili alanları:** Temel bilgiler, konum, iletişim, sosyal medya, marka kimliği (logo, renkler, font), tesis bilgileri (alan, kapasite, otopark, duş, engelli erişimi), Google yorumlar, galeri.
- **Firma sahibi vs şube müdürü yetkileri:** İki şifre / iki rol; müdür sadece atanan şablonları kullanır, fiyat görmez.

**Öneri:** COO Mağazası ve franchise vitrin mantığı için iş kuralı referansı; “işletme profili” alanları franchise/tenant ayarlarına eklenebilir.

### 2.4 Fiyatlandırma (SABLON_VERI_FIYATLANDIRMA.md)

- **Paketler:** Basic 2.000 TL/ay, Pro 5.000 TL/ay, Enterprise 15.000 TL/ay.
- **Limitler:** Şube, kullanıcı, sporcu, dahil AI token; ek şube +1.000 TL/ay.
- **Şablon/modül ekstra:** Muhasebe +1.000, Instagram +1.500, Web +2.000 TL/ay.
- **Token fiyatı:** 0,10 TL / 1K token; aylık kullanım özeti tablosu.
- **Tablo önerileri:** `template_library`, `subscription_plans`, `tenant_subscriptions`, `tenant_template_access`, `ai_usage_logs`, `ai_usage_monthly`, `billing_items`.

**Öneri:** Mevcut `packages` ve `tenant_purchases` ile uyumlu olacak şekilde alanlar genişletilebilir veya raporlama için referans fiyat listesi tutulabilir.

---

## 3. VERİTABANINA EKLENEBİLECEKLER

Mevcut projede **Supabase** ve **CELF/COO/CEO/Patron** tabloları var. Aşağıdakiler eski V3’ten uyarlanabilir; anayasa ve mevcut şemayı bozmadan eklenebilir.

### 3.1 İçerik kalite kontrolü (opsiyonel)

Eski V3: `content_qa_reviews` (içerik tipi, üretici robot, teknik/görsel/içerik/marka/kullanılabilirlik puanları, sonuç, revizyon, satışa onay).

**Bizde:** COO şablonları `coo_depo_drafts` / `coo_depo_approved` / `coo_depo_published` ile yönetiliyor; ayrı bir “QA puanı” alanı eklenebilir.

**Öneri:**  
- `coo_depo_approved` veya `coo_depo_published` tablosuna opsiyonel kolonlar: `quality_score INT`, `quality_tier TEXT` (premium/standard/basic).  
- Veya ileride ayrı `content_qa_reviews` tablosu açılabilir; şimdilik zorunlu değil.

### 3.2 İşletme / franchise profil alanları

Eski V3’te “işletme profili”: slogan, vergi no, adres, Google Maps, telefon, WhatsApp, sosyal medya, logo (ana/beyaz/siyah), favicon, ana/ikincil/accent renk, font, tesis alanı, kapasite, otopark, duş, kafeterya, klima, engelli erişimi, Google Business ID, ortalama puan, galeri.

**Bizde:** `tenants`, `franchises` veya `tenant_settings` benzeri yapılar var; bu alanlar eksikse eklenebilir.

**Öneri:**  
- `tenants` veya franchise tablosuna: `slogan`, `tax_id`, `address`, `map_url`, `working_hours JSONB`, `primary_color`, `secondary_color`, `logo_url`, `logo_dark_url`, `facility_area_m2`, `capacity`, `amenities JSONB` (otopark, duş, engelli_erisimi vb.), `google_place_id`, `google_rating`, `gallery_urls TEXT[]`.  
- Migration ile tek seferde eklenebilir; API ve UI sonra güncellenir.

### 3.3 Şablon mağazası / abonelik (ileride)

Eski V3: `template_library`, `subscription_plans`, `tenant_subscriptions`, `tenant_template_access`, `ai_usage_logs`, `ai_usage_monthly`, `billing_items`.

**Bizde:** `ceo_templates`, `tenant_templates`, `tenant_purchases`, `packages` var.

**Öneri:**  
- Fiyat ve limit mantığı için: `subscription_plans` (veya `packages` genişletmesi), `tenant_subscriptions` (veya `tenant_purchases` ile ilişkilendirilmiş abonelik dönemi).  
- AI kullanım faturalaması için: `ai_usage_logs` (tenant_id, tokens_input, tokens_output, model_used, created_at), `ai_usage_monthly` (tenant_id, year_month, total_tokens_used, tokens_included, overage_cost).  
- Önce ihtiyaç netleşsin; sonra migration yazılabilir.

### 3.4 Görev / QA formatı (standard_tasks, action_logs)

Eski V3: `standard_tasks` (amaç, çıktı formatı, hedef kitle, aciliyet, onay, iş akışı adımları, durum, QA sonucu), `action_logs`, `notifications`, `qa_scores`.

**Bizde:** `ceo_tasks`, `routine_tasks`, `task_results`, `approval_queue` var.

**Öneri:**  
- Mevcut görev tablolarına, eski V3’teki gibi `output_type`, `output_format`, `workflow_steps JSONB`, `qa_status`, `success_criteria` gibi alanlar ihtiyaç varsa eklenebilir.  
- Yeni tablo açmadan önce mevcut şemaya sütun eklemek tercih edilebilir.

---

## 4. VERİTABANINDAN BİLGİ ÇEKME (Sorgular / Kullanım)

Eski mimaride “veritabanından bilgi çekme” şu bağlamda geçiyor:

- **Robot cevabı:** Kullanıcı sorusu → Router → Şube robotu → **Şube veritabanından** (ödeme, sporcu, program vb.) veri çek → Cevap üret.

Yani “çekebileceğimiz detaylar” = API/robot tarafında hangi tablolardan hangi bilgilerin okunacağı.

### 4.1 Zaten kullanılabilecek tablolar (bizde var)

- **Sporcu / veli:** `athletes`, `athlete_health_records`  
- **Personel:** `staff`  
- **Ders / program:** `tenant_schedule`  
- **Ödeme / kasa:** `celf_kasa`, `payments`, `tenant_purchases`  
- **Onay:** `approval_queue`  
- **Şablon:** `ceo_templates`, `tenant_templates`, `coo_depo_*`  
- **Franchise / tenant:** `tenants`, `franchises`, `user_tenants`  
- **Paket:** `packages`  
- **Yoklama:** `attendance`  
- **Demo talepleri:** `demo_requests`  
- **Robot/denetim:** `celf_logs`, `audit_log`, `patron_commands`, `chat_messages`

Bu tablolardan API veya CELF/COO/CEO katmanında sorgu yazarak rapor, özet ve “veli/ödeme/program” cevapları üretilebilir.

### 4.2 Eklenecek tablo/kolonlarla çekilebilecek detaylar

- **İşletme profili:** Yukarıda önerilen kolonlar eklendikten sonra vitrin, iletişim ve harita bilgisi tek yerden okunabilir.  
- **Kalite puanı:** `quality_score` / `quality_tier` eklendiyse COO mağaza listeleme ve “öne çıkan” filtreleme yapılabilir.  
- **AI kullanım:** `ai_usage_logs` ve `ai_usage_monthly` eklendiyse franchise bazlı token kullanımı ve faturalama raporu çekilebilir.  
- **Abonelik dönemi:** `tenant_subscriptions` (veya genişletilmiş `tenant_purchases`) ile “paket geçerlilik tarihi” ve “dahil token” bilgisi çekilebilir.

---

## 5. ÖZET TABLO

| Konu | Bizde durum | Ekleme önerisi |
|------|-------------|----------------|
| Multi-tenant (tenants/branches/users) | Kısmen (tenants, user_tenants) | Branch ve modül/çalışma saatleri ihtiyaçsa eklenir |
| Şablon mirası (global→tenant→branch) | COO depo (draft/approved/published) | Mevcut yapı yeterli; dokümantasyonda referans tutulabilir |
| İçerik QA puanı | Yok | coo_depo_* için quality_score / quality_tier kolonları |
| İşletme profili (adres, tesis, logo, sosyal medya) | Kısmen | tenants/franchises’a ek kolonlar (migration) |
| Abonelik planları (Basic/Pro/Enterprise) | packages var | Limit ve token alanları genişletilebilir |
| AI kullanım log / aylık özet | Yok | ai_usage_logs, ai_usage_monthly (ileride) |
| Görev formatı (workflow_steps, qa_status) | ceo_tasks, routine_tasks var | İhtiyaç halinde ek alanlar |
| Firma sahibi / şube müdürü iki rol | roles, user_tenants var | İş kuralları dokümanda netleştirilir |

---

## 6. SONUÇ VE ÖNCELİKLER

1. **Sadece bilgi/referans:**  
   Platform mimarisi, tam sistem çatısı, içerik QA mantığı, şablon kategorileri, fiyatlandırma modeli ve işletme profili alanları `archive/` veya `docs/` altında referans doküman olarak eklenebilir; mevcut Master ve robot anayasasıyla çakışmayacak şekilde “alternatif/gelecek” notu ile.

2. **Veritabanına anında eklenebilecekler (migration ile):**  
   - İşletme profili alanları (tenants/franchises).  
   - COO şablonları için kalite puanı kolonları (opsiyonel).

3. **İleride eklenebilecekler:**  
   - AI kullanım logu ve aylık özet tabloları.  
   - Abonelik dönemi ve token limiti (subscription_plans / tenant_subscriptions veya packages/tenant_purchases genişletmesi).  
   - Ayrı `content_qa_reviews` veya `template_marketplace` tabloları (COO mağaza büyürse).

4. **Veritabanından çekilebilecek detaylar:**  
   - Tüm mevcut tablolar (athletes, staff, schedule, payments, approval_queue, ceo_templates, tenant_templates, coo_depo_*, tenants, packages, attendance, demo_requests) zaten API ve robot tarafında kullanılabilir.  
   - Ek kolon/tablolar eklendikçe işletme profili, kalite puanı, AI kullanımı ve abonelik bilgisi de aynı şekilde sorgulanabilir.

İsterseniz bir sonraki adımda: (a) sadece referans dokümanları archive’a yazmak, (b) işletme profili + kalite puanı için somut migration taslağı çıkarmak, veya (c) belirli bir tablo/API için örnek “veri çekme” sorgularını yazmak mümkün.
