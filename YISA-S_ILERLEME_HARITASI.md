# YİSA-S Sistem Anayasası Uyum — İlerleme Haritası

**Proje dizini:** `C:\Users\info\OneDrive\Desktop\YISA_S_APP\yisa-s-app`  
**Referans:** YISA-S-MASTER-DOKUMAN-v2.1-TASLAK

---

## AŞAMA DURUMU

| Aşama | Başlık | Durum | Kilitle |
|-------|--------|-------|---------|
| **1** | Tanıtım Sitesi (www.yisa-s.com) | ✅ Tamamlandı | 🔒 |
| **2** | Veritabanı Şeması (Supabase) | ✅ Tamamlandı | 🔒 |
| **3** | Franchise Paneli (franchise.yisa-s.com) | ✅ Tamamlandı | 🔒 |
| **4** | Veli Paneli (veli.yisa-s.com) | ✅ Tamamlandı | 🔒 |
| **5** | Patron Paneli Güçlendirme (app.yisa-s.com) | ✅ Tamamlandı | 🔒 |
| **6** | Aidat Takip Sistemi | ✅ Tamamlandı | 🔒 |
| **7** | Devamsızlık ve Yoklama | ✅ Tamamlandı | 🔒 |
| **8** | Otomatik Tenant Kurulumu | ✅ Tamamlandı | 🔒 |
| **9** | Veli-Çocuk Eşleştirme | ✅ Tamamlandı | 🔒 |

---

## AŞAMA 1 — Tanıtım Sitesi (Detay)

| Görev | Durum | Dosya |
|-------|-------|-------|
| 1.1 Ana sayfa: Hero "YİSA-S ile Tesisinizi Yönetin" | ✅ | app/page.tsx |
| 1.2 Ana sayfa: Özellikler (AI, otomatik yönetim, veli takibi) | ✅ | app/page.tsx |
| 1.3 Ana sayfa: Paketler bölümü (Starter, Pro, Enterprise) | ✅ | app/page.tsx |
| 1.4 Ana sayfa: Demo talep formu (Ad, e-posta, telefon, tesis türü, şehir) | ✅ | app/page.tsx |
| 1.5 Ana sayfa: Footer (İletişim, sosyal medya) | ✅ | app/page.tsx |
| 1.6 /demo: Form verileri Supabase'e kaydet | ✅ | app/demo, app/api/demo-requests |
| 1.7 /demo: Şablon galerisi (3-5 örnek) | ✅ | app/demo/page.tsx |
| 1.8 /fiyatlar: 3 paket kartı, karşılaştırmalı tablo | ✅ | app/fiyatlar/page.tsx |

---

## AŞAMA 2 — Veritabanı Şeması (Detay)

| Görev | Durum | Dosya |
|-------|-------|-------|
| tenants genişletme (owner_id, package_type, name) | ✅ | supabase/migrations/20260202_asama2_tenant_schema.sql |
| user_tenants tablosu | ✅ | Aynı migration |
| roles tablosu + seed | ✅ | Aynı migration |
| packages tablosu + seed | ✅ | Aynı migration |
| athletes tablosu + RLS | ✅ | Aynı migration |
| staff tablosu + RLS | ✅ | Aynı migration |
| tenants RLS | ✅ | Aynı migration |

---

## AŞAMA 3 — Franchise Paneli (Detay)

| Görev | Durum | Dosya |
|-------|-------|-------|
| Franchise layout + auth | ✅ | app/franchise/layout.tsx |
| Tenant API | ✅ | app/api/franchise/tenant |
| Athletes API (GET, POST) | ✅ | app/api/franchise/athletes |
| Staff API (GET, POST) | ✅ | app/api/franchise/staff |
| Dashboard gerçek veri | ✅ | app/franchise/page.tsx |
| Üye ekleme formu | ✅ | athletes tablosuna |
| Personel ekleme formu | ✅ | staff tablosuna |
| Aidat Takibi placeholder | ✅ | — |

---

## AŞAMA 4 — Veli Paneli (Detay)

| Görev | Durum | Dosya |
|-------|-------|-------|
| Veli layout + auth | ✅ | app/veli/layout.tsx |
| Children API (parent_user_id) | ✅ | app/api/veli/children |
| Çocuklarım listesi | ✅ | app/veli/page.tsx |
| Çocuk seçici (çoklu) | ✅ | app/veli/page.tsx |
| Genel, Sağlık, Antrenman, Aidat, AI sekmeleri | ✅ | app/veli/page.tsx |
| Bildirimler bölümü | ✅ | BildirimlerCard |
| Aidat durumu placeholder | ✅ | AidatTab |

---

## Sıralı İş Planı

1. **AŞAMA 1** tamamlanana kadar AŞAMA 2'ye geçilmez
2. Her aşama tamamlandığında rapor verilir ve "Kilitle" işaretlenir
3. npm run build ile doğrulama her aşamada yapılır
