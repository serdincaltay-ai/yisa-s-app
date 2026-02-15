# YISA-S-TAM-SISTEM-V3.zip — Çıkarılan Bilgi Özeti

**Kaynak:** YİSA-ESKİ KODLAR\YISA-S-TAM-SISTEM-V3.zip (çıkarıldı: YISA-S-TAM-SISTEM-V3-extracted)  
**Tarih:** 4 Şubat 2026

---

## 1. ZIP İÇERİĞİ

| Dosya | İçerik |
|-------|--------|
| **PLATFORM_MIMARISI.md** | tenants, branches, users, roles, templates, agents; şablon mirası (Global→Tenant→Branch); modül listesi; API yapısı |
| **TAM_SISTEM_CATISI.md** | 18 kurumsal robot + firma robotları; Patron Asistan, Ana Robot, 12 birim, 3 veri/şablon robotu; AI platform tablosu; güvenlik matrisi |
| **ICERIK_QA_SABLON_MAGAZASI.md** | Kalite puanlama (Teknik %25, Görsel %30, İçerik %20, Marka %15, Kullanılabilirlik %10); işletme profili alanları; firma sahibi vs müdür yetkileri |
| **SABLON_VERI_FIYATLANDIRMA.md** | Paketler (Basic 2.000, Pro 5.000, Enterprise 15.000 TL/ay); token 0.10 TL/1K; tablo önerileri |
| **KURUMSAL_YAPI_ROBOTLAR.md** | 12 kurumsal birim detayı; görev ve rapor tanımları |
| **ICERIK_QA_MARKETPLACE_SQL.sql** | content_qa_reviews, template_marketplace, business_profile tabloları |
| **PLATFORM_FULL_SQL.sql** | Tam platform şeması |
| **GUVENLIK_ROBOTU.md**, **SAFE_MODE_SISTEMI.md** | Güvenlik ve safe mode mantığı |
| **FIRMA_ROBOT_SISTEMI.md** | Firma robotu maliyet ve kurulum |

---

## 2. MEVCUT SİSTEME UYUMLU BİLGİLER (Zaten Uygulandı / Uygulanabilir)

| Konu | V3'te | Bizde | Durum |
|------|-------|-------|-------|
| İşletme profili alanları | slogan, vergi_no, logo, renkler, tesis, google_rating, galeri | tenants, franchises migration | ✅ 20260204_isletme_profili_kalite_puani |
| Kalite puanı | quality_score, quality_tier | coo_depo_approved, coo_depo_published | ✅ Aynı migration |
| Kalite ağırlıkları | Teknik 25%, Görsel 30%, İçerik 20%, Marka 15%, Kullanılabilirlik 10% | — | Referans: QA hesaplama formülü |
| Şablon kategorileri | Web, sosyal medya, çalışan, antrenör, veli, finans, AI | ceo_templates, v0_template_library | Uyumlu |
| Firma sahibi / müdür iki rol | Owner tam yetki, Manager sınırlı | user_tenants, roles | Dokümanda netleştirilebilir |

---

## 3. İLERİDE KULLANILABİLECEK REFERANSLAR

### 3.1 Tablo Önerileri (SABLON_VERI_FIYATLANDIRMA)

- `template_library` — platform şablon havuzu (bizde: ceo_templates, v0_template_library)
- `subscription_plans` — Basic/Pro/Enterprise (bizde: packages)
- `tenant_subscriptions` — firma abonelik dönemi
- `tenant_template_access` — firma şablon erişimi (bizde: tenant_templates)
- `ai_usage_logs`, `ai_usage_monthly` — token kullanım faturalaması
- `billing_items` — fatura kalemleri
- `content_qa_reviews` — detaylı QA (bizde: coo_depo quality_score/quality_tier yeterli olabilir)

### 3.2 İşletme Profili Tam Listesi (ICERIK_QA_SABLON_MAGAZASI §5)

Temel: ad, slogan, vergi_no, kuruluş yılı  
Konum: adres, il/ilçe, Google Maps, embed  
İletişim: telefon, WhatsApp, e-posta, web  
Sosyal medya: Instagram, Facebook, TikTok, YouTube, Twitter  
Marka: logo (ana/beyaz/siyah), favicon, ana/ikincil/accent renk, font  
Tesis: alan m², kapasite, otopark, duş, kafeterya, klima, engelli erişimi  
Google: place_id, ortalama puan, yorum sayısı  
Galeri: tesis, etkinlik, logo görselleri  

*(Bunların çoğu migration ile franchises/tenants'a eklendi.)*

### 3.3 Paket Fiyatları (Referans)

- Basic: 2.000 TL/ay, 1 şube, 5 kullanıcı, 10K token
- Pro: 5.000 TL/ay, 3 şube, 20 kullanıcı, 50K token
- Enterprise: 15.000 TL/ay, sınırsız
- Ek şube: +1.000 TL/ay
- Muhasebe: +1.000 TL/ay, Instagram: +1.500 TL/ay, Web: +2.000 TL/ay
- Token: 0.10 TL / 1K token

### 3.4 12 Kurumsal Birim (CELF Direktör Eşlemesi)

V3'teki isimler → Mevcut DirectorKey:  
Muhasebe→CFO, İK→CHRO, AR-GE→RND, Pazar Araştırma→CMO/CDO, İdari→COO, Hukuk→CLO, Pazarlama→CMO, Teknik→CTO, Tasarım→CPO, CRM→CSO_SATIS/CCO, Video→(yok), Fuar→(yok)

---

## 4. ÖZET

YISA-S-TAM-SISTEM-V3.zip **önemli referans bilgi** içeriyor:

1. **Zaten uygulanan:** İşletme profili, kalite puanı (migration ile)
2. **Dokümantasyon:** Kalite ağırlıkları, işletme profili tam listesi, yetki yapısı
3. **İleride:** ai_usage_logs, tenant_subscriptions, content_qa_reviews (ihtiyaç halinde)
4. **Fiyatlandırma:** Referans paket ve token fiyatları

Anayasa ve mevcut şemayı bozmadan, bu dokümanlar `archive/` veya `docs/` altında referans olarak kullanılabilir. Çıkarılan klasör: `YİSA-ESKİ KODLAR\YISA-S-TAM-SISTEM-V3-extracted`.
