# YİSA-S Veri Kaynakları ve Robot Görevlendirmesi

**Referans:** YISA-S-MASTER-DOKUMAN-v2.1, ROBOT_ENTEGRASYON_ANAYASA.md, archive/OKUTULDU_ESKİ_KODLAR_INCELEME_RAPORU.md  
**Amaç:** Hangi verilerin nereden çekildiği, hangi robotun hangi veriyi kullandığı — anayasa uyumlu tek referans. Sistem omurgası değiştirilmez; ek veri/alanlar bu matrise göre atanır.

---

## 1. Veri Kaynakları Özeti

| Veri / Tablo | Açıklama | Eklenme / Not |
|--------------|----------|----------------|
| **tenants** | Patron birimi, slug, durum, paket, personel hedefleri, aidat kademeleri, **işletme profili (slogan, logo, renkler, working_hours)** | İşletme profili: migration 20260204_isletme_profili_kalite_puani |
| **franchises** | Franchise bilgisi, iletişim, adres, **işletme profili (slogan, vergi_no, map_url, tesis, kapasite, amenities, google_rating, gallery_urls)** | Aynı migration |
| **coo_depo_drafts / approved / published** | COO şablonları; **approved/published** için **quality_score, quality_tier** | Aynı migration |
| athletes, athlete_health_records | Sporcu ve sağlık verisi | Mevcut; CSPO readOnly |
| staff | Personel | Mevcut |
| tenant_schedule | Ders programı | Mevcut |
| celf_kasa, payments, tenant_purchases | Ödeme, kasa, satın almalar | Mevcut |
| approval_queue, patron_commands | Onay kuyruğu, patron komutları | Mevcut |
| ceo_templates, tenant_templates | Şablonlar | Mevcut |
| **v0_template_library** | V0 ücretsiz şablon kütüphanesi (tutor-dashboard, yisa-s-dashboard, cal-com-clone vb.) | migration 20260204_v0_template_library |
| coo_depo_* | COO taslak / onaylı / yayınlanmış | Mevcut + kalite alanları |
| packages | Paket tanımları | Mevcut |
| attendance | Yoklama | Mevcut |
| demo_requests | Vitrin demo talepleri | Mevcut |

---

## 2. Hangi Robot Hangi Veriyi Kullanır?

### 2.1 İşletme profili (tenants / franchises)

| Robot / Bileşen | Kullandığı veri | Görevlendirme yeri |
|-----------------|-----------------|---------------------|
| **Vitrin** | Franchise/işletme: ad, adres, iletişim, logo, harita, çalışma saatleri, tesis bilgisi | Vitrin sayfası, demo talebi öncesi bilgi; `franchises` + tenant bilgisi |
| **COO Mağazası** | Franchise’a sunulan şablon listesi; franchise’ın kendi logosu/renkleri (kişiselleştirme) | `/franchise` COO sekmesi; `franchises.logo_url`, `primary_color`, `secondary_color` |
| **CELF (CMO / CPO)** | Marka kimliği: logo, renkler, slogan — şablon üretirken | CELF direktörleri komutla çağrıldığında `tenants`/`franchises` işletme profili okunabilir |
| **Patron Asistanı** | Rapor/özet isteklerinde işletme adı, slug, durum | Flow içinde tenant/franchise bilgisi; raporlarda kullanım |

### 2.2 Kalite puanı (coo_depo_approved / coo_depo_published)

| Robot / Bileşen | Kullandığı veri | Görevlendirme yeri |
|-----------------|-----------------|---------------------|
| **COO** | quality_score, quality_tier | Mağaza listeleme, “öne çıkan” / “premium” filtreleme; sıralama |
| **Vitrin** | Yayınlanmış şablonlarda quality_tier | Vitrin’de premium şablon vurgulama (ileride) |
| **Patron Onay Kuyruğu** | Onay öncesi QA bilgisi (quality_score) | Onay ekranında opsiyonel gösterim; şablon onayı sonrası approved’a yazılabilir |

### 2.3 V0 şablon kütüphanesi (v0_template_library)

| Robot / Bileşen | Kullandığı veri | Görevlendirme yeri |
|-----------------|-----------------|---------------------|
| **CELF (CPO)** | slug, ad, source_path, icerik_ozeti, director_key | Şablon/UI üretirken V0 referansı; `v0_template_library` SELECT |
| **CELF (CMO)** | Vitrin/landing şablonları (product-launch-timer-landing, crowdfunding-community-platform) | Kampanya/vitrin sayfası üretimi |
| **CELF (CSPO)** | tutor-dashboard, skill-diagram-builder | Sporcu/eğitim paneli, beceri grafiği |
| **COO Mağazası** | is_free, quality_tier, slug | Ücretsiz şablon listesi; franchise'a sunum |

### 2.4 Diğer veri çeken robotlar (mevcut anayasa)

| Robot | Veri kaynağı | Kullanım |
|-------|--------------|----------|
| **CSPO** | athletes, athlete_health_records (readOnly) | Antrenman programı, seviye, ölçüm |
| **CIO** | ceo_tasks, routine_tasks, approval_queue, tablo şemaları | Analiz, planlama, conflict uyarıları |
| **CEO** | ceo_templates, robot_tasks, direktörlük kuralları | Görev dağıtımı, şablon ataması |
| **Veri Arşivleme** | task_results | CELF sonucu kayıt |
| **COO run-due** | ceo_routines, coo_depo_* | Rutin CELF işleri, depo güncelleme |

---

## 3. Görevlendirme İlkesi (Anayasa)

- **Omurga kilitleri:** Talep → CIO → CEO → CELF → COO depolama → Patron onayı → Yayınlama değiştirilmez.
- **Yeni veri gelince:** Hazırda araştırma/şablon varsa (örn. OKUTULDU raporu) o referans alınır; yoksa anayasaya uygun yeni tablo/kolon eklenir.
- **Robot ataması:** Yeni alan hangi robotun sorumluluk alanına giriyorsa (Vitrin, COO, CELF, Patron Asistanı) o robotun doküman ve kod tarafında “bu veriyi kullanır” olarak işaretlenir; sistem akışı bozulmaz.

---

## 4. OKUTULDU Raporu ile Uyum

- **İşletme profili alanları:** OKUTULDU §3.2 önerisi ile uyumlu; migration ile `tenants` ve `franchises`’a eklendi.
- **Kalite puanı:** OKUTULDU §3.1 önerisi ile uyumlu; `coo_depo_approved` ve `coo_depo_published` için `quality_score`, `quality_tier` eklendi.
- **Veritabanından çekilecek detaylar:** OKUTULDU §4’teki tablolar (athletes, staff, schedule, payments, ceo_templates, tenant_templates, coo_depo_*, tenants, franchises, packages, attendance, demo_requests) bu dokümandaki robot görevlendirmesi ile örtüşür; ek kolonlar eklendikçe aynı mantıkla “hangi robot kullanır” matrisi güncellenir.

- **V0 şablonları:** YİSA-ESKİ KODLAR\v0 şablonları `v0_template_library` tablosuna seed edildi; referans: `archive/REFERANS_V0_SABLONLARI.md`.
- **YISA-S-TAM-SISTEM-V3:** ZIP'ten çıkarılan mimari, kalite ağırlıkları, fiyatlandırma, işletme profili tam listesi; referans: `archive/REFERANS_YISA_S_TAM_SISTEM_V3_OZET.md`.

Bu doküman, anayasayı bozmadan veri ve robot atamalarının tek yeridir.
