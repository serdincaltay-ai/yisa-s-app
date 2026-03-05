# YİSA-S — Çalışma Prensibi ve Kullanım Kılavuzu (Canlı)

> **CANLI DOSYA — ZORUNLU GÜNCELLEME:** Projede veya dokümantasyonda **ufak bir değişiklik** bile yapıldığında (yeni sekme, buton, panel, agent ilişkisi, robot görevi) bu dosya **hemen** güncellenecek. Çalışma prensibi ve kullanım kılavuzu tek yerde; değişiklik yapıldıkça burada da değişecek.

**Son güncelleme:** 27.02.2026 (şablon oluşturuldu; dev tarafından doldurulacak ve değişikliklerde güncellenecek)

---

# BÖLÜM A — ÇALIŞMA PRENSİBİ

---

## A.1 Karakterler (Kim Var)

### 4 Robot

| Robot | Görevi | Nerede kullanılır | Deploy / çalıştırma |
|-------|--------|-------------------|----------------------|
| **YİSA-S CELF** | 12 direktörlük, beyin takımı, tenant kurulum tetikleme | app.yisa-s.com (Patron), tenant-yisa-s | tenant-yisa-s / app-yisa-s; sim_updates, CELF API |
| **Veri Robotu** | Şablon kütüphanesi, gelişim ölçümleri, referans değerler | Franchise/veli panelleri, ölçüm sayfaları | Supabase tabloları (templates, referans_degerler); tenant-yisa-s API |
| **Güvenlik Robotu** | Audit log, RLS, tenant izolasyonu | Tüm tenant verisi, patron güvenlik paneli | Supabase RLS, audit_log; migration + API |
| **YİSA-S Robotu** | Vitrin, demo formu, ManyChat karşılama | yisa-s.com | yisa-s-com repo; demo_requests, NeebChat vb. |

*Dev: Yukarıdaki satırları kod/repo ile eşleştirip güncelleyecek; değişiklik olursa bu tablo hemen güncellenecek.*

### 12 Agent (CELF Direktörlükleri)

| # | Direktörlük | Görevi | Ne yapar / nasıl tetiklenir |
|---|--------------|--------|-----------------------------|
| 1 | CTO | Teknik altyapı, API, subdomain | Tenant kurulumunda tablo/API hazırlığı |
| 2 | CHRO | İnsan kaynakları, roller | Rol tanımları, personel şablonu |
| 3 | CLO | Hukuk, KVKK, sözleşmeler | KVKK metni, üyelik sözleşmesi şablonu |
| 4 | CFO | Kasa, aidat, fiyatlandırma | Kasa defteri şablonu, aidat planları |
| 5 | CSPO | Ürün, kayıt formları, gelişim | Kayıt formları, antrenman şablonları |
| 6 | CMO | Pazarlama, sosyal medya | Sosyal medya şablonu, hoş geldin e-postası |
| 7 | Tasarım | Logo, görsel, banner | Logo önerileri, kartvizit, web banner |
| 8 | CPO | Ürün paketleri, fiyat | Üyelik paketleri, fiyatlandırma |
| 9 | CSO | Satış | Satış kiti |
| 10 | CDO | Veri, dashboard | Dashboard veri yapılandırması |
| 11 | CXO | Müşteri deneyimi | Kullanım kılavuzu, SSS |
| 12 | CRDO | AR-GE, rakip analizi | Rakip analizi, iyileştirme önerileri |

*Dev: Tetikleme yollarını (API, sim_updates, CELF startup) kodla eşleştirip bu tabloyu dolduracak; değişiklikte güncelleyecek.*

### Tenant ve Siteler

| Öğe | Açıklama | Hangi site / repo | Kim girer / ne görür |
|-----|----------|-------------------|-----------------------|
| **Tenant (franchise)** | Tesis/işletme; kendi subdomain’i | *.yisa-s.com (tenant-yisa-s) | Franchise sahibi, tesis müdürü, antrenör, kayıt, veli |
| **app.yisa-s.com** | Patron + giriş yönlendirme | tenant-yisa-s (production) | Patron, franchise/antrenör/veli giriş sonrası yönlendirme |
| **yisa-s.com / www** | Vitrin, demo formu | yisa-s-com | Ziyaretçi, demo talep eden |

---

## A.2 Görevlendirmeler ve Veri Akışı

- **Veri panelinden ne alınır:** (Dev dolduracak — hangi panel hangi API/tablodan veri alıyor.)
- **Kim ne yapar:** (Dev dolduracak — rol bazlı görev özeti.)
- **Deploy:** Hangi site için hangi repo deploy edilir (tenant-yisa-s → app + *.yisa-s.com; yisa-s-com → yisa-s.com).

*Değişiklik oldukça bu bölüm güncellenecek.*

---

# BÖLÜM B — KULLANIM KILAVUZU (İNCE DETAY)

---

## B.1 Vitrin (yisa-s.com)

| Konum / öğe | Ne / açıklama | Hangi agent/robot/API besliyor |
|-------------|----------------|---------------------------------|
| Ana sayfa hero | Başlık, CTA | YİSA-S Robotu (vitrin) |
| Demo formu | Firma adı, yetkili, email, telefon, tesis türü vb. | POST /api/demo-requests (yisa-s-com veya tenant-yisa-s) |
| (Dev: her sekme/bölümü tek tek ekleyecek) | | |

---

## B.2 Patron / app.yisa-s.com

| Konum / öğe | Ne / açıklama | Hangi agent/robot/API besliyor |
|-------------|----------------|---------------------------------|
| Dashboard | Ana panel, robot bar, oylama | CELF, sim_updates, task_assignments |
| Onay kuyruğu | Demo talepleri listesi | GET /api/demo-requests |
| (Dev: sol menü, her sayfa, her panel alanı eklenebilir) | | |

---

## B.3 Franchise Paneli (*.yisa-s.com / tenant-yisa-s)

| Konum / öğe | Ne / açıklama | Hangi agent/robot/API besliyor |
|-------------|----------------|---------------------------------|
| Sol menü | Ana Sayfa, Öğrenciler, Yoklama, Aidat, … | tenant-yisa-s app/franchise, app/panel |
| Öğrenciler listesi | Tablo, filtre | /api/franchise/athletes veya panel API |
| (Dev: her sekme, her buton, her alan; hangi API/agent) | | |

---

## B.4 Veli Paneli

| Konum / öğe | Ne / açıklama | Hangi agent/robot/API besliyor |
|-------------|----------------|---------------------------------|
| Çocuklarım | Liste, çocuk kartları | /api/veli/children, /api/veli/demo/children |
| (Dev: her sayfa/sekme/buton) | | |

---

## B.5 Kullanıcı Tipleri ve Giriş / Görüntüleme

| Kullanıcı tipi | Giriş (site/URL) | Giriş sonrası panel | Gördüğü başlıca ekranlar |
|----------------|-------------------|----------------------|---------------------------|
| Patron | app.yisa-s.com veya /patron/login | /dashboard | Onay kuyruğu, franchise listesi, CELF, raporlar |
| Franchise sahibi | app.yisa-s.com veya tenant subdomain /auth/login | /franchise | Dashboard, öğrenciler, yoklama, aidat, ayarlar |
| Veli | /auth/login (veya veli.yisa-s.com) | /veli | Çocuklarım, ödeme, mesajlar, duyurular |
| Antrenör | /auth/login | /antrenor | Derslerim, sporcular, yoklama, ölçüm |

*Dev: Rol çözümlemesi (resolve-role) ve sayfa yapısına göre bu tabloyu tamamlayacak; değişiklikte güncelleyecek.*

---

## B.6 Ekran Öğesi → Agent / Robot / API Eşlemesi (Detay)

*Dev: Önemli her ekran öğesi (sekme, buton, form alanı, tablo) için hangi API’nin veya hangi agent/robotun o veriyi sağladığını bu bölüme ekleyecek. Örnek: "Vitrin sayfasındaki [X] sekmesi → YİSA-S Robotu; veri: …"*

| Sayfa / panel | Öğe (sekme, buton, alan) | Veriyi sağlayan / kontrol eden |
|---------------|---------------------------|--------------------------------|
| (Dev dolduracak) | | |

---

**Güncelleme kuralı:** Projede ekran, sekme, buton, panel, agent ilişkisi veya çalışma prensibi değiştiğinde bu dosyayı açıp ilgili bölümü hemen güncelleyin. Bu dosya canlı kullanım kılavuzudur.
