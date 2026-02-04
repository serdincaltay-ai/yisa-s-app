# V0 Şablon Kütüphanesi — Referans

**Kaynak:** YİSA-ESKİ KODLAR\v0 şablonları (Vercel v0.dev ücretsiz şablonları)  
**Veritabanı:** `v0_template_library` tablosu (migration 20260204_v0_template_library)

## Amaç

- V0'dan ücretsiz profesyonel tasarımları veritabanına kaydetmek
- CELF/CPO'nun bu şablonlardan veri almasını sağlamak
- Franchise'lara ücretsiz şablon olarak sunulabilir

## Kaynak Yolu

Şablon dosyaları: `YİSA-ESKİ KODLAR\v0 şablonları\{source_path}`

Örnek: `tutor-dashboard` → `YİSA-ESKİ KODLAR\v0 şablonları\tutor-dashboard`

## Veritabanındaki Şablonlar (Seed)

| slug | ad | direktör | kategori | kalite |
|------|-----|----------|---------|--------|
| tutor-dashboard | Eğitim Yönetim Paneli | CSPO | dashboard | premium |
| yisa-s-dashboard | YİSA-S Dashboard | CPO | dashboard | premium |
| extr-up-admin-panel | Admin Paneli | CTO | dashboard | premium |
| futuristic-dashboard | Fütüristik Dashboard | CPO | dashboard | premium |
| cal-com-clone | Randevu / Takvim | COO | takvim | premium |
| minimalist-profile-cards | Profil Kartları | CPO | ui | standard |
| product-launch-timer-landing | Landing / Lansman | CMO | vitrin | premium |
| skill-diagram-builder | Beceri Diyagramı | CSPO | grafik | premium |
| neobrutalist-ui-design | Neobrutalist UI | CPO | ui | standard |
| crowdfunding-community-platform | Topluluk Platformu | CMO | vitrin | standard |
| integrations-page | Entegrasyon Sayfası | CTO | ui | standard |
| home-management-app | Yönetim Uygulaması | COO | dashboard | standard |
| product-launch-timer | Lansman Zamanlayıcı | CMO | vitrin | standard |
| 3-d-card-animation | 3D Kart Animasyonu | CPO | ui | standard |
| automation-rule-setup | Otomasyon Kuralları | CTO | ui | standard |

## Kullanım

- **CELF/CPO:** `v0_template_library` tablosundan `SELECT` ile şablon listesi alınır; `source_path` ile dosya konumu bilinir.
- **COO Mağazası:** `is_free = true` olanlar ücretsiz olarak listelenebilir.
- **tenant_templates:** `template_source = 'v0_template_library'` ile franchise ataması yapılabilir (ileride).

## Anayasa Uyumu

- Sistem omurgası değiştirilmez.
- Sadece yeni tablo ve referans veri eklenir.
- CELF/CPO mevcut akışta bu tabloyu okuyabilir.
