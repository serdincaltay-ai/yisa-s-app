# YİSA-S — Kapsamlı Rol, Görev, Fayda ve Hizmet Dokümanı

**Patron:** Serdinç ALTAY  
**Tarih:** 6 Şubat 2026  
**Amaç:** Asistana vermeden önce tek referans — roller, görevler, veritabanı, faydalar, hizmetler. Yapıya uygun olanlar önce, uyumlu olabilecekler sonda. Eksikler ve tespitler.

---

# BÖLÜM 1: ÖNERİLER (Asistana Vermeden Önce)

## 1.1 Benim Önerilerim

| # | Öneri | Neden |
|---|-------|-------|
| 1 | **Rolleri önce tamamlayın** — `role_permissions` veya `user_tenants.role` ile tüm roller (ROL-0 … ROL-12) eşlensin. Panel yönlendirmesi rol bazlı olsun. | Rol tutarsızlığı olmaz; franchise/veli/antrenör doğru panele gider. |
| 2 | **Görevleri rol bazlı tanımlayın** — Her rolün "görev sırası" (ROL_PANEL_GOREVLENDIRME_ANAYASA.md'deki gibi) kodda ve DB'de net olsun. | Asistan hangi rol için ne yapacağını bilir. |
| 3 | **Sağlık verisi — çocuk ham veri açılmaz** — `athlete_health_records` sadece CSPO readOnly; veliye sadece özet. KVKK + anayasa kuralı. | Güvenlik ve yasal uyum. |
| 4 | **10 perspektif değerlendirme** — Fiziksel uygunluk, teknik, koordinasyon, denge, öğrenme hızı, dikkat, motivasyon, psikolojik dayanıklılık, disiplin, gelişim sürekliliği. Bunları `evaluations` veya yeni tabloda saklayın. | Sporcu analiz sistemi (EK-A) ile uyum. |
| 5 | **Veli haftalık rapor şablonu** — REFERANS_CALISMA_STANDARDI_VELI_RAPORU.md'deki şablon otomatik raporlarda kullanılsın. | Veli faydası somutlaşır. |

## 1.2 Geliştirme Önceliği

1. **Rol sistemi** — role_permissions, user_tenants.role, resolve-role
2. **Panel yönlendirme** — Rol → /franchise, /tesis, /antrenor, /veli
3. **Görev akışları** — Her rol için "görev sırası" UI'da
4. **Sağlık/gelişim** — athlete_health_records, evaluations, veli özeti
5. **COO Mağazası** — Şablon satışı, franchise panelinde

---

# BÖLÜM 2: ROLLER (Tam Liste)

## 2.1 Anayasa Rol Kodları (lib/auth/roles.ts)

| Kod | Rol | Hiyerarşi | Panel |
|-----|-----|-----------|-------|
| — | Patron | 0 | /dashboard |
| ROL-1 | Alt Admin (Franchise Sahibi) | 1 | /franchise |
| ROL-2 | Tesis Müdürü | 2 | /tesis |
| ROL-3 | Bölge Müdürü | 3 | /franchise (çoklu şube) |
| ROL-4 | Sportif Direktör | 4 | /franchise (sporcu seviye) |
| ROL-5 | Uzman Antrenör | 5 | /antrenor |
| ROL-6 | Antrenör | 6 | /antrenor |
| ROL-7 | Yardımcı/Stajyer | 7 | /antrenor |
| ROL-8 | Kayıt Personeli | 8 | /franchise (kayıt) |
| ROL-9 | Temizlik Personeli | 9 | /franchise (temizlik) |
| ROL-10 | Veli | 10 | /veli |
| ROL-11 | Sporcu | 11 | /veli veya /sporcu |
| ROL-12 | Misafir Sporcu | 12 | Sınırlı |

## 2.2 ROLE_LEVELS (Alternatif / Eski)

Ziyaretçi, Ücretsiz Üye, Ücretli Üye, Deneme Üyesi, Eğitmen, Tesis Yöneticisi, Tesis Sahibi, Bölge Müdürü, Franchise Sahibi, Franchise Yöneticisi, Sistem Admini, Süper Admin, Patron

**Not:** İki rol seti var; tek referansa indirgenmeli.

---

# BÖLÜM 3: GÖREVLER (Rol Bazlı)

## 3.1 Patron

| Sıra | Görev | Nerede |
|------|-------|--------|
| 1 | Giriş → Dashboard | /dashboard |
| 2 | Chat (komut gönder) | /dashboard |
| 3 | Direktörler (ne üretiyor) | /dashboard/directors |
| 4 | CELF | /dashboard/celf |
| 5 | Onay Kuyruğu (10'a Çıkart) | /dashboard/onay-kuyrugu |
| 6 | Franchise / Vitrin | /dashboard/franchises |
| 7 | Kasa Defteri | /dashboard/kasa-defteri |
| 8 | Şablonlar | /dashboard/sablonlar |
| 9 | Raporlar | /dashboard/reports |

## 3.2 Franchise Firma Sahibi (ROL-1)

| Sıra | Görev | Nerede |
|------|-------|--------|
| 1 | Genel Bakış | /franchise |
| 2 | Öğrenciler (sporcu ekle/düzenle) | /franchise |
| 3 | Antrenörler / Personel | /franchise |
| 4 | Ders Programı | /franchise |
| 5 | Aidat Takibi | /franchise |
| 6 | Yoklama | /franchise |
| 7 | COO Mağazası | /franchise |
| 8 | Ayarlar | /franchise |

## 3.3 Tesis Müdürü (ROL-2)

| Sıra | Görev | Nerede |
|------|-------|--------|
| 1 | Tesis özeti (günlük yoklama) | /tesis |
| 2 | Yoklama girişi | /tesis |
| 3 | Personel listesi | /tesis |
| 4 | Ders programı (görüntüleme) | /tesis |

## 3.4 Sportif Direktör (ROL-4)

| Sıra | Görev | Nerede |
|------|-------|--------|
| 1 | Sporcu listesi (seviye, branş) | /franchise |
| 2 | Kazanım/bel görünümü | /franchise |
| 3 | CSPO antrenman önerileri | /franchise |
| 4 | Seviye atama | /franchise |

## 3.5 Uzman Antrenör (ROL-5)

| Sıra | Görev | Nerede |
|------|-------|--------|
| 1 | Bugünkü derslerim | /antrenor |
| 2 | Yoklama girişi | /antrenor |
| 3 | Sporcu notları (ölçüm, gelişim) | /antrenor |
| 4 | CSPO antrenman önerisi | /antrenor |

## 3.6 Antrenör (ROL-6)

| Sıra | Görev | Nerede |
|------|-------|--------|
| 1 | Derslerim | /antrenor |
| 2 | Yoklama | /antrenor |
| 3 | Sporcu notu (kısa) | /antrenor |

## 3.7 Yardımcı Antrenör (ROL-7)

| Sıra | Görev | Nerede |
|------|-------|--------|
| 1 | Yoklama (mevcut/yarımcı) | /antrenor |
| 2 | Basit not (tek satır) | /antrenor |

## 3.8 Kayıt Personeli (ROL-8)

| Sıra | Görev | Nerede |
|------|-------|--------|
| 1 | Yeni kayıt formu | /franchise |
| 2 | Aidat listesi | /franchise |
| 3 | Ödeme girişi | /franchise |

## 3.9 Temizlik Personeli (ROL-9)

| Sıra | Görev | Nerede |
|------|-------|--------|
| 1 | Günlük temizlik checklist | /franchise (temizlik modülü) |
| 2 | Tamamlandı işaretle | /franchise |
| 3 | Sorun bildir | /franchise |

## 3.10 Veli (ROL-10)

| Sıra | Görev | Nerede |
|------|-------|--------|
| 1 | Çocuklarım listesi | /veli |
| 2 | Çocuk seç → Gelişim grafikleri | /veli |
| 3 | Ödeme / Aidat | /veli |
| 4 | Sağlık özeti (ham veri yok) | /veli |

## 3.11 Sporcu (ROL-11)

| Sıra | Görev | Nerede |
|------|-------|--------|
| 1 | Gelişim grafiğim | /veli veya /sporcu |
| 2 | Seviye / kazanım | /veli |
| 3 | Son antrenmanlar (özet) | /veli |

## 3.12 Demo / Müşteri (Franchise Alıcı)

| Sıra | Görev | Nerede |
|------|-------|--------|
| 1 | Paket seç (web, logo, şablon, tesis) | /vitrin |
| 2 | Form doldur (ad, email, tesis türü) | /vitrin |
| 3 | Demo Talep Et | /vitrin |
| 4 | (Onay sonrası) Sınırlı demo paneli | /vitrin |

---

# BÖLÜM 4: VERİTABANI — Sağlık ve Diğer Veriler

## 4.1 Sağlık ile İlgili Tablolar

| Tablo | Açıklama | Erişim |
|-------|----------|--------|
| **athlete_health_records** | Sporcu sağlık geçmişi (record_type, notes, recorded_at) | CSPO readOnly; antrenman programı hazırlarken kullanır. Veliye ham veri açılmaz. |
| **athletes** | Sporcu temel bilgileri (parent_email, doğum tarihi vb.) | Tenant bazlı RLS |
| **evaluations** | (Varsa) Değerlendirme kayıtları | — |

## 4.2 Tüm Çekirdek Tablolar

| Tablo | Açıklama |
|-------|----------|
| tenants | Tesis / franchise birimi |
| user_tenants | Kullanıcı–tesis ilişkisi, rol |
| athletes | Sporcular |
| athlete_health_records | Sağlık geçmişi |
| staff | Personel (antrenör, temizlik, kayıt vb.) |
| attendance | Yoklama |
| payments | Ödemeler |
| tenant_schedule | Ders programı |
| demo_requests | Demo talepleri |
| franchises | Müşteri adayları / lead |
| franchise_subdomains | Dinamik subdomain |
| patron_commands | Patron komutları, onay kuyruğu |
| ceo_tasks | CEO görevleri |
| celf_logs | CELF işlem logları |
| celf_kasa | Kasa hareketleri |
| ceo_templates | Şablon havuzu |
| tenant_templates | Tenant şablonları |
| coo_depo_drafts, approved, published | COO mağaza |
| chat_messages | Sohbet kayıtları |
| role_permissions | Rol yetkileri |
| robots, celf_directorates | Robot / direktörlük |

## 4.3 Şablonlar (ceo_templates) — Sağlık İlgili

| Şablon | Direktör | Açıklama |
|--------|----------|----------|
| Saglik Tarama | CSPO | Sporcu sağlık tarama formu (kalp, solunum, esneklik, boy_kilo) |
| Tesis Acilis Checklist | COO | Temizlik, malzeme, personel, güvenlik kontrolleri |

---

# BÖLÜM 5: FAYDALAR — Kim Ne Kazanır?

## 5.1 Sporcuya Fayda

| Fayda | Açıklama |
|-------|----------|
| Gelişim takibi | Fiziksel ve teknik gelişim grafikleri; dünkü haliyle karşılaştırma (başkalarıyla değil) |
| Seviye / kazanım | Net seviye bilgisi, motive edici |
| Kişiye özel antrenman | CSPO ölçümlere göre bireysel antrenman önerisi |
| 10 perspektif değerlendirme | Fiziksel uygunluk, teknik, koordinasyon, denge, öğrenme hızı, dikkat, motivasyon, psikolojik dayanıklılık, disiplin, gelişim sürekliliği |
| Güvenli gelişim | Antrenör kararı; yapay zeka destek, nihai karar antrenörde |
| Veri tabanı erişimi | Akademik makaleler, federasyon bilgileri (paket dahilinde) |

## 5.2 Veliye Fayda

| Fayda | Açıklama |
|-------|----------|
| Çocuk takibi | Çocuklarım listesi, özet kartlar |
| Gelişim grafikleri | Anlaşılır, düzenli |
| Ödeme / aidat | Aidat takibi, ödeme bilgisi |
| Sağlık özeti | Genel özet; ham veri açılmaz (KVKK, çocuk koruma) |
| Haftalık veli raporu | Güçlü yönler, gelişim alanları, antrenör gözlemi, tavsiye |
| Aile danışmanlığı | VIP pakette |

## 5.3 İşletmeye (Franchise / Tesis) Fayda

| Fayda | Açıklama |
|-------|----------|
| Tesis yönetim paneli | Sporcu kayıt, ders programı, yoklama, kasa |
| Sporcu grafikleri | Gelişim grafikleri, tablolar, ölçümler |
| Kişiye özel antrenman | Ölçümlere göre bireysel öneri |
| Veli paneli | Çocuk takibi, ödeme — veli memnuniyeti |
| Antrenör paneli | Ders, yoklama, not |
| Karşılama robotu | Web sitesinde ziyaretçi karşılama |
| 7/24 Acil destek | Sistem sorununda Patron'a alarm |
| COO Mağazası | Ek şablon, logo, web sitesi satın alma |
| Çoklu şube | Bölge müdürü tüm şubelere erişir |

## 5.4 İşletmeciye (Franchise Sahibi) Fayda

| Fayda | Açıklama |
|-------|----------|
| Tek panel | Tesis, personel, gelir, rapor tek ekranda |
| Canlı fiyat | Vitrinde seçim yapınca fiyat hemen çıkar |
| Tenant yönetimi | Kendi tesisini, üyelerini, personelini yönetir |
| Patron desteği | Onay kuyruğu, CELF, şablon havuzu |

## 5.5 Çalışana (Antrenör, Personel) Fayda

| Fayda | Açıklama |
|-------|----------|
| Antrenör | Derslerim, yoklama, sporcu notu, CSPO önerisi |
| Kayıt personeli | Kayıt formu, aidat, ödeme girişi |
| Temizlik | Günlük checklist, tamamla, sorun bildir |
| Sportif direktör | Sporcu seviye, kazanım, CSPO |
| Tesis müdürü | Operasyon özeti, yoklama, personel |

---

# BÖLÜM 6: HİZMETLER (Ne Sunuyoruz?)

## 6.1 Temel Paket (Her Franchise'da)

| Hizmet | Açıklama |
|--------|----------|
| Tesis yönetim paneli | Sporcu, ders, yoklama, kasa |
| Sporcu grafikleri | Gelişim, tablolar, ölçümler |
| Kişiye özel antrenman | CSPO ölçümlere göre |
| Veli paneli | Çocuk takibi, ödeme, grafik |
| Antrenör paneli | Ders, yoklama, not |
| Karşılama robotu | Web sitesi ziyaretçi |
| 7/24 Acil destek robotu | Patron alarm |
| Veri tabanı erişimi | Akademik, federasyon |

## 6.2 Seçmeli Modüller (Vitrin)

| Hizmet | Açıklama |
|--------|----------|
| Logo tasarımı | Marka kimliği |
| Web sitesi kurulumu | Franchise özel site |
| Kurumsal kimlik | Kartvizit, broşür |
| Robot kotası | CELF/merkez kullanımı |
| Ek şube | Çoklu tesis |

## 6.3 COO Mağazası (Franchise Panelinden)

| Hizmet | Açıklama |
|--------|----------|
| Sosyal medya paketi | CMO kampanya, içerik planı |
| Web sitesi şablonu | CPO/CMO ürünleri |
| Ek şablonlar | Rapor, form, checklist |

## 6.4 Paket Fiyatları (Referans)

| Paket | Saat | Değerlendirme | Fiyat |
|-------|------|---------------|-------|
| VIP | 60 | 20 | ₺60.000 |
| Plus | 48 | 12 | ₺54.000 |
| Standart | 24 | 8 | ₺30.000 |

Giriş ücreti: 1.500 $ (peşin). Aylık: seçime göre.

---

# BÖLÜM 7: YAPIYA UYGUN (Önce Yapılacaklar)

| # | Madde | Neden |
|---|-------|-------|
| 1 | Rol → panel yönlendirme | Mevcut resolve-role, middleware ile uyumlu |
| 2 | Her rol için görev sırası | ROL_PANEL_GOREVLENDIRME_ANAYASA.md ile uyumlu |
| 3 | athlete_health_records — CSPO readOnly | Mevcut migration, anayasa kuralı |
| 4 | Veli — sağlık özeti (ham veri yok) | Çocuk ham veri açılmaz kuralı |
| 5 | 10 perspektif değerlendirme | EK-A, REFERANS_CALISMA_STANDARDI ile uyumlu |
| 6 | Vitrin → demo_requests → Onay → tenant | Mevcut akış |
| 7 | Patron → CELF → Onay Kuyruğu | Mevcut flow |
| 8 | COO Mağazası (coo_depo_*) | Mevcut tablolar |

---

# BÖLÜM 8: UYUMLU OLABİLECEKLER (Sonda)

| # | Madde | Not |
|---|-------|-----|
| 1 | Halkla İlişkiler rolü | CMO kampanya, sosyal medya — ayrı rol veya Franchise Sahibi altında |
| 2 | İkinci çocuklu veli | Çocuk seçici UI — /veli'de tabs |
| 3 | İkinci şubeli firma sahibi | Şube seçici — tenant veya branch_id |
| 4 | PHV (Peak Height Velocity) takip | 6 zorunlu + 14 seçimlik parametre — EK-A |
| 5 | Grafik satış modeli | Standart 75-100 TL, Premium 150-200 TL — YİSA-S %80, franchise %20 |
| 6 | Kademe çarpanı | Öğrenci, personel, şube, branş sayısına göre fiyat |
| 7 | Kardeş indirimi, yenileme indirimi | REFERANS_FIYAT_LISTESI |
| 8 | Oyun saati | Cumartesi, Pazar; ders fiyatının %50'si |

---

# BÖLÜM 9: EKSİKLER VE TESPİTLER

## 9.1 Rol Sistemi

| Tespit | Öneri |
|--------|-------|
| İki rol seti var (ROLE_SYSTEM_13, ROLE_LEVELS, ANAYASA_ROL_KODLARI) | Tek referans: ANAYASA_ROL_KODLARI + role_permissions tablosu |
| user_metadata.role kullanılıyor; user_tenants.role ile eşleşmiyor olabilir | Rol çözümlemesi: auth.users.user_metadata.role VEYA user_tenants.role |
| ROL-3 Bölge Müdürü — çoklu şube | tenant_schedule, branches tablosu veya tenant'ta şube alanı |

## 9.2 Görev / Panel

| Tespit | Öneri |
|--------|-------|
| /tesis, /antrenor sayfaları var ama rol bazlı giriş tam değil | resolve-role ile /auth/login sonrası yönlendirme |
| Temizlik personeli için ayrı modül | /franchise içinde "Temizlik" sekmesi veya /tesis altı |
| Sporcu paneli (/sporcu) | Veli üzerinden veya ayrı çocuk dostu ekran |

## 9.3 Veritabanı

| Tespit | Öneri |
|--------|-------|
| evaluations tablosu | 10 perspektif puanları için gerekli; migration |
| branches tablosu | Çoklu şube için; tenant_id → branches |
| Haftalık veli raporu | Otomatik rapor için template + task |

## 9.4 Sağlık

| Tespit | Öneri |
|--------|-------|
| athlete_health_records — record_type, notes | Daha yapılandırılmış alanlar (kalp, solunum, esneklik, boy_kilo) eklenebilir |
| Veli sağlık özeti | Ham veri değil; "Genel durum: İyi" gibi özet alan |
| CSPO erişimi | readOnly; antrenman önerisi üretirken kullanır |

## 9.5 Diğer

| Tespit | Öneri |
|--------|-------|
| COO Mağazası satın alma akışı | tenant_purchases, odeme_onaylandi — Patron onayı sonrası aktivasyon |
| Malzeme gönderimi | Satış sonrası Patron manuel; ileride otomasyon |
| Karşılama robotu, 7/24 Acil destek | Vitrin robotları — kodda mock veya ayrı entegrasyon |

---

# BÖLÜM 10: ASİSTANA VERİLECEK KOMUT ÖRNEKLERİ

Asistan bu dokümana göre şunları yapabilir:

1. **"Rolleri tamamla"** — role_permissions, user_tenants.role, resolve-role güncelle
2. **"Her rol için görev sırası UI'da göster"** — ROL_PANEL_GOREVLENDIRME_ANAYASA.md'ye göre
3. **"evaluations tablosu oluştur"** — 10 perspektif için migration
4. **"Veli haftalık rapor şablonu"** — REFERANS_CALISMA_STANDARDI_VELI_RAPORU.md'deki şablon
5. **"Temizlik personeli checklist"** — Günlük temizlik modülü
6. **"Çoklu şube için branches"** — Bölge müdürü senaryosu

---

**Döküman sonu.**  
Bu dosya asistana verilmeden önce Patron tarafından gözden geçirilebilir. Eksik veya hatalı gördüğünüz maddeleri işaretleyin.
