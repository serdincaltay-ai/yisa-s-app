# YİSA-S — v0.dev OPTİMİZE YOL HARİTASI (v3 — FINAL)

**Tarih:** 9 Şubat 2026  
**Versiyon:** v3-FINAL — Proje dokümantasyonuyla doğrulanmış  
**Strateji:** Bağlam → Kilitle → Küçük görevler → Test → Deploy

---

## v3 DEĞERLENDİRME SONUCU

| Kriter | Durum | Not |
|--------|-------|-----|
| Bağlam komutu stratejisi | ✅ Doğru | v0'a önce sistemi anlat, sonra görev ver — doğru yaklaşım |
| 4 robot mimarisi | ✅ Doğru | Proje dokümanlarıyla uyumlu |
| sim_updates yapısı | ✅ Doğru | status: beklemede/islendi, payload yok, command'a JSON |
| API tutarsızlığı uyarısı | ✅ Doğru | target_directorate → target_direktorluk düzeltilmeli |
| Migration sıralaması | ✅ Doğru | Part 1-2-3 bölünmesi v0 token limitlerine uygun |
| Faz sıralaması | ⚠️ Küçük revize | Veri Robotu (v2'deki Faz 4) v3'te kaldırılmış — eklenmeli |
| Franchise dosya konumu | ⚠️ Revize gerekli | app/franchise/[tenant]/ yerine mevcut yapıya uygun olmalı |
| Veli paneli | ⚠️ Eksik | v3'te tamamen kaldırılmış — en azından placeholder olmalı |
| 002 migration detayı | ⚠️ Eksik | directorates, directorate_reviews, token_costs doğru eklentiler |
| RLS politikaları | ⚠️ Çok açık | Şimdilik "true" ile açılmış — güvenlik için kabul edilebilir başlangıç |

---

## YAPILAN DÜZELTMELER VE EKLEMELER

### 1. Bağlam Komutuna Eklenenler

**002_patron_system_upgrade.sql tabloları eklendi:**
Mevcut dokümanlar (11_SISTEM_REFERANS) sadece 001'deki tabloları gösteriyor, ama v3'te 002'deki ek tabloları da doğru şekilde belirtmişsiniz: `directorates`, `directorate_reviews`, `token_costs`. Bu doğru ve bağlamda kalmalı.

**Dashboard.tsx konumu netleştirildi:**
11_SISTEM_REFERANS'a göre `dashboard.tsx` app/ klasörünün dışında, kök dizindedir (`yisa-s-v0/dashboard.tsx`). v3'te bu doğru gösterilmiş.

### 2. Eksik Fazlar Eklendi

v3'te Veri Robotu ve Veli Paneli fazları kaldırılmıştı. Bunları aşağıda "İLERİ SEVİYE FAZLAR" olarak ekliyorum çünkü bunlar YİSA-S'ın diferansiyasyon noktaları:

### 3. RLS Politikaları Hakkında Not

v3'teki migration'larda RLS `USING (true)` ile açılmış. Bu "herkes her şeyi görebilir" demek. Kabul edilebilir bir başlangıç noktası, ama Faz 5 (Güvenlik) tamamlandığında tenant_id bazlı politikalarla değiştirilmeli.

### 4. Franchise Panel Dosya Yolu

`app/franchise/[tenant]/page.tsx` yerine, mevcut subdomain routing yapısıyla uyumlu bir çözüm düşünülmeli. Mevcut sistemde `*.yisa-s.com` wildcard DNS var, Next.js middleware ile subdomain → tenant çözümlemesi daha uygun:

```
middleware.ts → subdomain kontrol → tenant_id çöz → cookie/header ile ilet
```

---

# BÖLÜM 1: BAĞLAM KOMUTU — ONAY

v3'teki bağlam komutu **doğru ve kapsamlı**. Aşağıdaki küçük eklemeyle kullanıma hazır:

### Bağlam Komutuna Eklenecek Satırlar (Madde 3, "Mevcut Supabase Tabloları" altına):

```
### Ek Tablolar (002_patron_system_upgrade.sql)
- directorates — 12 direktörlük tanımları
- directorate_reviews — direktörlük incelemeleri
- token_costs — token maliyet takibi
```

### Bağlam Komutuna Eklenecek (Madde 4, "Kurallar" altına):

```
11. Franchise paneli için subdomain routing: middleware.ts ile subdomain → tenant_id çözümle.
12. RLS başlangıçta açık (true) bırakılır, Faz 5'te tenant_id bazlı sıkılaştırılır.
```

Geri kalan bağlam komutu olduğu gibi kullanılabilir.

---

# BÖLÜM 2: GÖREV KOMUTLARI — ONAY VE EKLEMELER

## Faz 1-5: ✅ ONAYLANDI (Olduğu gibi kullanılabilir)

| Görev | Durum | Not |
|-------|-------|-----|
| 1.0 API düzeltme | ✅ | target_directorate → target_direktorluk |
| 1.1 TypeScript tipleri | ✅ | Attendance, Payment, Schedule, AuditLog interface'leri de eklenebilir |
| 1.2 Migration Part 1 | ✅ | tenants, demo_requests, user_tenants |
| 1.3 Migration Part 2 | ✅ | students, staff, groups |
| 1.4 Migration Part 3 | ✅ | attendance, payments, schedules, audit_log |
| 2.1 Demo API | ✅ | CORS + POST + GET |
| 2.2 Demo güncelleme | ✅ | Slug üretimi + sim_updates + compensating |
| 2.3 Onay Kuyruğu UI | ✅ | Dashboard entegrasyonu |
| 3.1 Tenant API | ✅ | CRUD + şablon kayıtlar |
| 3.2 Tenant zinciri | ✅ | Rollback mekanizması |
| 4.1 Vitrin sayfası | ✅ | Landing page + demo formu |
| 5.1 Audit Log | ✅ | API + Dashboard |

---

## EKLENEN FAZLAR: İLERİ SEVİYE

### FAZ 6A: VERİ ROBOTU — ŞABLON HAVUZU

> **v3'te eksikti, eklendi. Bu faz YİSA-S'ın rakiplerden ayrışma noktasıdır.**

```
GÖREV 6A.1 — Veri Robotu Migration + API

Supabase migration: scripts/006_veri_robotu.sql

1. templates tablosu:
- id (uuid pk), category (text: antrenman/gelisim_olcum/beslenme/postur/mental)
- title, description, content (jsonb), age_min (int), age_max (int)
- sport_type, difficulty, created_by (default 'veri_robotu'), is_active (default true)
- created_at (timestamptz)
RLS: Herkes okuyabilir.

2. gelisim_olcumleri tablosu:
- id (uuid pk), tenant_id (FK tenants), athlete_id (FK students)
- template_id (FK templates), olcum_tarihi (date)
- olcum_verileri (jsonb: {boy, kilo, bmi, esneklik, surat, kuvvet})
- antrenor_notu (text), created_at (timestamptz)
RLS: tenant_id bazlı.

3. referans_degerler tablosu:
- id (uuid pk), yas (int), cinsiyet (text), parametre (text)
- min_deger, max_deger, optimal_deger (numeric), kaynak (text)
- created_at (timestamptz)
RLS: Herkes okuyabilir.

API:
- app/api/templates/route.ts — GET (filtre: category, sport_type), POST
- app/api/gelisim-olcumleri/route.ts — GET (?athlete_id, ?tenant_id), POST. tenant_id zorunlu.
```

---

### FAZ 6B: RLS SIKILAŞTIRMA

> **v3'te Faz 5 sadece audit log içeriyordu. RLS ayrı görev olarak eklendi.**

```
GÖREV 6B.1 — RLS Tenant Bazlı Politikalar

Dosya: scripts/007_rls_tenant_policies.sql

Tabloları güncelle: students, staff, groups, attendance, payments, schedules, gelisim_olcumleri

Her tablo için mevcut "true" politikalarını kaldır, yerine:

-- SELECT: Kullanıcı sadece kendi tenant'ını görsün
DROP POLICY IF EXISTS "[tablo]_select" ON public.[tablo];
CREATE POLICY "[tablo]_tenant_select" ON public.[tablo] FOR SELECT
  USING (
    tenant_id IN (
      SELECT ut.tenant_id FROM public.user_tenants ut
      WHERE ut.user_id = auth.uid()
    )
  );

-- Patron erişimi (tüm tenant'lar):
-- user_tenants.role = 'patron' kontrolü yukarıdaki sorguya dahildir
-- (patron tüm tenant'larda user_tenants kaydına sahiptir)

-- INSERT: tenant_id zorunlu
CREATE POLICY "[tablo]_tenant_insert" ON public.[tablo] FOR INSERT
  WITH CHECK (
    tenant_id IN (
      SELECT ut.tenant_id FROM public.user_tenants ut
      WHERE ut.user_id = auth.uid()
    )
  );

-- UPDATE ve DELETE: Aynı mantık

NOT: Bu migration'ı çalıştırmadan önce patron kullanıcısının
tüm mevcut tenant'larda user_tenants kaydı olduğundan emin ol.
```

---

### FAZ 7: VELİ PANELİ MVP

> **v3'te eksikti, eklendi.**

```
GÖREV 7.1 — Veli Paneli

Veli paneli oluştur. Veliler çocuklarını bu panelden takip eder.

Auth: Supabase auth, ayrı veli girişi (email + şifre).
Veli-çocuk ilişkisi: user_tenants (role: "veli") + students.veli_email eşleşmesi.

Sayfalar:
1. Giriş: YİSA-S logo, "Veli Paneli", email + şifre
2. Ana sayfa: Çocuk kartları (ad, yaş, grup, son yoklama, kalan kredi)
3. Çocuk detay: Yoklama takvimi (30 gün), gelişim grafikleri, aidat, ders programı
4. Duyurular: Tesis duyuruları
5. Mesajlar: "Yakında" placeholder

Tasarım: AÇIK tema (beyaz arka plan, mavi aksanlar — veliler için)
tenant_id: Subdomain'den çöz
RLS: Veli sadece kendi çocuklarını görebilir
Mobil öncelikli, PWA, Türkçe
```

---

### FAZ 8: CELF BAŞLANGIÇ GÖREVLERİ

> **v2'de vardı, v3'te kaldırılmıştı. Eklendi.**

```
GÖREV 8.1 — CELF Başlangıç Görev Motoru

API: app/api/celf-startup/route.ts

POST: { tenant_id, slug }
Authenticated patron kontrolü.

Yeni tenant kurulduğunda 12 direktörlük için başlangıç görevleri oluştur.
task_assignments tablosuna toplu INSERT (~30 görev):

| Direktörlük | Görevler |
|-------------|----------|
| CTO | Veritabanı hazırla, API test, subdomain kontrol |
| CHRO | 14 rol tanımı, personel kayıt şablonu |
| CLO | KVKK aydınlatma, üyelik sözleşmesi, veli onay formu |
| CFO | Kasa defteri, aidat planları, dijital kredi paketleri |
| CSPO | Kayıt formları, antrenman şablonları, gelişim ölçüm |
| CMO | Sosyal medya, hoş geldin e-postası, tanıtım metni |
| Tasarım | Logo önerileri, kartvizit, web banner |
| CPO | Üyelik paketleri, fiyatlandırma |
| CSO/CDO | Satış kiti, dashboard verileri |
| CXO | Kullanım kılavuzu, SSS |
| CRDO | Rakip analizi, iyileştirme önerileri |

sim_updates'e bilgilendirme:
{
  target_robot: "celf",
  target_direktorluk: "Strateji",
  command: JSON.stringify({ type: "baslangic_tamamlandi", tenant_id, gorev_sayisi }),
  status: "beklemede"
}

Response: { success: true, gorev_sayisi }
```

---

# BÖLÜM 3: GÜNCELLENMİŞ ÖNCELİK TABLOSU

| Sıra | Görev | Faz | Kritiklik | Tahmini Süre |
|------|-------|-----|-----------|--------------|
| 1 | Bağlam komutu | — | ZORUNLU | 5 dk |
| 2 | API düzeltme (1.0) | 1 | ZORUNLU | 5 dk |
| 3 | TypeScript tipleri (1.1) | 1 | Yüksek | 10 dk |
| 4 | Migration Part 1-3 (1.2-1.4) | 1 | Yüksek | 30 dk |
| 5 | Demo API + güncelleme (2.1-2.2) | 2 | Yüksek | 20 dk |
| 6 | Onay Kuyruğu UI (2.3) | 2 | Yüksek | 30 dk |
| 7 | Tenant API + zincir (3.1-3.2) | 3 | Yüksek | 25 dk |
| 8 | Vitrin sayfası (4.1) | 4 | Orta | 45 dk |
| 9 | Audit Log (5.1) | 5 | Orta | 20 dk |
| 10 | Franchise paneli (6.1) | 6 | Orta | 60+ dk |
| 11 | Veri Robotu (6A.1) | 6A | Orta | 30 dk |
| 12 | RLS sıkılaştırma (6B.1) | 6B | Orta | 20 dk |
| 13 | Veli paneli (7.1) | 7 | Düşük | 45 dk |
| 14 | CELF başlangıç (8.1) | 8 | Düşük | 25 dk |

**Toplam tahmini süre:** ~6-7 saat (v0 üretim + Cursor birleştirme + test)

---

# BÖLÜM 4: KONTROL LİSTESİ VE NOTLAR

## Her Adım Sonrası

- [ ] v0.dev'de kod üretildi
- [ ] Cursor'a aktarıldı
- [ ] yisa-s-v0 klasöründe doğru yere kaydedildi
- [ ] TypeScript hata yok
- [ ] Supabase migration çalıştırıldı (varsa)
- [ ] Lokal test yapıldı (pnpm dev)
- [ ] CORS test edildi (varsa — farklı origin'den)
- [ ] Vercel'e deploy edildi
- [ ] Bir sonraki görev belirlendi

## Kritik Notlar

1. **API tutarsızlığı (Görev 1.0) mutlaka ilk yapılsın** — diğer görevler buna bağlı
2. **Migration sırası:** 1.2 → 1.3 → 1.4 (FK bağımlılıkları nedeniyle)
3. **RLS başlangıçta açık** — Faz 6B'de sıkılaştırılacak
4. **Subdomain routing** — Franchise paneli için middleware.ts gerekli
5. **CORS** — Vitrin (yisa-s.com) → API (app.yisa-s.com) arası zorunlu
6. **Slug benzersizliği** — UNIQUE constraint + uygulama seviyesinde kontrol

## v3 vs v2 Karşılaştırma

| Kriter | v2 | v3 |
|--------|----|----|
| Görev boyutu | Büyük, karmaşık | Küçük, v0 uyumlu ✅ |
| Migration | Tek dosya (devasa) | 3 parça (Part 1-2-3) ✅ |
| Veri Robotu | Vardı | Eksikti → eklendi |
| Veli Paneli | Vardı | Eksikti → eklendi |
| CELF Başlangıç | Vardı | Eksikti → eklendi |
| RLS detayı | Genel | Ayrı faz olarak ayrıldı ✅ |
| API düzeltme | Yoktu | Görev 1.0 olarak eklendi ✅ |
| Tahmini süreler | Yoktu | Her görev için belirtildi ✅ |

---

## SONUÇ

v3 dokümanı **doğru temele oturuyor**. Yukarıdaki eklemelerle (Veri Robotu, Veli Paneli, CELF Başlangıç, RLS sıkılaştırma) tam kapsamlı hale getirildi.

**İlk 3 adımı hemen yapabilirsiniz:**
1. v0.dev'e bağlam komutunu yapıştırın
2. Görev 1.0 (API düzeltme) verin
3. Görev 1.1 (TypeScript tipleri) verin

---

**Hazırlayan:** YİSA-S AI Sistemi  
**Tarih:** 9 Şubat 2026 | v3-FINAL  
