# YİSA-S Patron Panel — Eylem Planı
**Tarih:** 29 Ocak 2026  
**Hedef:** Patron paneli ile Franchise Sahibi paneli ayrımı, roller, CELF kuralları, sonraki adımlar.

---

## 1. Panel Ayrımı (Yapıldı / Yapılacak)

### Patron paneli (sizin panel)
- **Olmaması gereken:** Sporcular, Antrenörler (bunlar franchise sahibi panelinde).
- **Olması gereken:**
  - Franchise satışlarından gelen gelir (bu ay)
  - Kasa defteri: günlük / aylık masraflar, sabit ödemeler, kira, fatura
  - Sabit faturalar ve kiralar
  - Franchise’lardan aylık tahsilat: kim hangi gün ne ödemeli (bugün şunun, yarın şunun)
  - Hangi franchise hangi paketi aldı, o paketten ne kadar alan kullanıyor
  - **Asistan:** Hangi robotlar aktif, asistan hangi AI’larla konuşuyor
  - **Onay kuyruğu:** Sistemden gelen onay bekleyen işler (öncelikli / bekleyen)
  - **Yeni franchise başvuruları:** Depo vb. başvuru, 10 günde ulaşılacak, AI ile konuşma geçmişi
  - **Aktif franchise sayısı**, tıklanınca o franchise paneline giriş (üye/sporcu sayısı, hata, tavsiye)
  - **Ar-Ge:** CEO üzerinden gelen güncellemeler, “şurayı geliştirelim”, şablon önerileri
  - **Şablon havuzu:** Tüm şablonlar, nerede hangi şablon kullanılıyor, hangi özellik geliştirilecek (sosyal medya, slogan, logo, kasa defteri, roller/paneller)
  - **Rol & yetki tanımları:** Hangi rol hangi görevi yapabilir, hangi alanlara girebilir, sınırlamalar

### Franchise Sahibi paneli (firma sahibi — kiraladığınız kullanıcı)
- Sporcular, Antrenörler bu panelde
- Kendi tesisleri, üyeleri, geliri
- Patron panelinde olmayacak

---

## 2. Rol Hiyerarşisi (13 Seviye)

| Seviye | Rol | Açıklama |
|--------|-----|----------|
| 1 | Ziyaretçi | Giriş yok |
| 2 | Ücretsiz Üye | Temel üyelik |
| 3 | Ücretli Üye | Tam üye |
| 4 | Deneme Üyesi | Deneme süresi |
| 5 | Eğitmen | Antrenman, sporcular |
| 6 | Tesis Yöneticisi | Tek tesis |
| 7 | Tesis Sahibi | Kendi tesis(ler) |
| 8 | Bölge Müdürü | Bölge tesisleri |
| 9 | Franchise Sahibi | Franchise sahipliği — **kendi panelinde sporcu/antrenör** |
| 10 | Franchise Yöneticisi | Franchise operasyon |
| 11 | Sistem Admini | Panel erişimi (Patron, Süper Admin, Sistem Admini) |
| 12 | Süper Admin | Tam panel |
| 13 | Patron | Tüm sistem, onay, CELF, şablonlar, kasa defteri |

- **Veli:** Kayıt, 2–3 çocuk, farklı yaş grupları — rol sınırları ile tanımlanacak.
- **Franchise müşterisi:** 2 şube = 2 ayrı panel (şube 1 VIP, şube 2 temel paket gibi); roller ve paket özellikleri buna göre.

---

## 3. CELF Motor ve CEO Kuralları

- **CEO Robot:** Kural tabanlı; işi CELF’e dağıtır, sonuçları toplar. Deploy/commit sadece Patron onayı ile.
- **CELF Merkez:** 12 direktörlük (CFO, CTO, CIO, CMO, CHRO, CLO, CSO Satış, CPO, CDO, CISO, CCO, CSO Strateji).
- **Yapılacak:**
  - CELF’ten gelen kuralların düzenli takibi: Hangi kurallar kullanıcıya/robotlara gidiyor?
  - Franchise’a satılan platformda firma sahibi: kullanıcı adı/şifre, hangi rolleri seçebilecek (VP paket özellikleri: “bunları seçebilirsin”).
  - CELF alt robot yönetimi ve otomatik rutin yönetim disiplini: ne aşamadayız, ne yapılacak — bu eylem planı ve sonraki sprint’lerde detaylandırılacak.

---

## 4. Yapılan Değişiklikler (Bu Tur)

1. **Patron ana sayfa kartları:** Sporcu/Antrenör kaldırıldı. Eklendi: Franchise Geliri (Bu Ay), Gider (Bu Ay), Aktif Franchise, Onay Bekleyen, Yeni Başvuru/Demo.
2. **API /api/stats:** Patron için `franchiseRevenueMonth`, `expensesMonth`, `activeFranchises`, `pendingApprovals`, `newFranchiseApplications` döndürülüyor (uygun tablolar varsa dolu, yoksa 0).
3. **Sidebar:** Onay Kuyruğu, Franchise’lar, Kasa Defteri, Şablonlar, Kullanıcı & Roller eklendi/güncellendi.
4. **Yeni sayfalar (placeholder):** `/dashboard/onay-kuyrugu`, `/dashboard/franchises`, `/dashboard/kasa-defteri`, `/dashboard/sablonlar` — içerik “hazırlanıyor” ve kısa açıklama.

---

## 5. Sonraki Adımlar (Eylem Planı)

| # | Eylem | Açıklama |
|---|--------|----------|
| 1 | **Franchise Sahibi paneli** | Ayrı layout/route (örn. `/franchise` veya role göre yönlendirme). Sporcu, antrenör, kendi gelir kartları bu panelde. |
| 2 | **Onay kuyruğu verisi** | `approval_queue` / `pending_approvals` tablosu (Supabase) + liste sayfasına bağlama. |
| 3 | **Franchise listesi** | `franchises` / `organizations` tablosundan aktif franchise listesi; satır tıklanınca o franchise’a giriş (subdomain veya tenant_id ile). |
| 4 | **Kasa defteri tablosu** | `expenses` / `kasa_defteri` (günlük/aylık masraf, kira, fatura); Kasa Defteri sayfasına bağlama. |
| 5 | **Ödeme takvimi** | Franchise’lardan aylık tahsilat tarihleri (kim hangi gün ödemeli) — veri modeli + Patron panelinde görünüm. |
| 6 | **Şablon havuzu** | Şablon tablosu, “nerede kullanılıyor”, Ar-Ge/CEO önerileri alanı; Şablonlar sayfasına bağlama. |
| 7 | **Rol & yetki ekranı** | Rollerin hangi sayfalara/görevlere erişebileceği (sınırlamalar); Patron’un düzenleyebileceği arayüz. |
| 8 | **Yeni franchise başvurusu** | Demo/lead kaydı, 10 gün kuralı, AI konuşma geçmişi alanı; Patron panelinde listeleme. |
| 9 | **CELF kural yönetimi** | CEO/CELF’ten gelen kuralların listesi ve “kim ne kullanıyor” takibi — ayrı sayfa veya Robot Yönetimi altı. |

---

## 6. Özet

- **Patron paneli:** Franchise gelir/gider, kasa defteri, onay kuyruğu, franchise listesi, şablonlar, roller, asistan/robotlar, Ar-Ge. Sporcu/antrenör yok.
- **Franchise Sahibi paneli:** Sporcular, antrenörler, kendi tesisleri ve geliri; ayrı panel olarak geliştirilecek.
- **Roller:** 13 seviye korunacak; veli ve çok şubeli franchise senaryoları rol ve paket özellikleri ile tanımlanacak.
- **CELF/CEO:** Kuralların takibi ve “ne aşamadayız, ne yapılacak” bu eylem planı ve sonraki sprint’lerde uygulanacak.

**Hazır, Patron onayınızı bekliyorum.** Sonraki adım olarak 1 (Franchise paneli ayrımı) veya 2–3 (onay kuyruğu + franchise listesi) ile devam edilebilir.
