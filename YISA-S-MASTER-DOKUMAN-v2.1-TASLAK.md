# ═══════════════════════════════════════════════════════════════════════════════════════
# ██╗   ██╗██╗███████╗ █████╗       ███████╗
# ╚██╗ ██╔╝██║██╔════╝██╔══██╗      ██╔════╝
#  ╚████╔╝ ██║███████╗███████║█████╗███████╗
#   ╚██╔╝  ██║╚════██║██╔══██║╚════╝╚════██║
#    ██║   ██║███████║██║  ██║      ███████║
#    ╚═╝   ╚═╝╚══════╝╚═╝  ╚═╝      ╚══════╝
#
# YİSA-S MASTER DOKÜMAN v2.1 TASLAK
# YETENEK İZLEME VE SPORCU ANALİZ SİSTEMİ
# FRANCHİSE YÖNETİM PLATFORMU
#
# İnceleme raporuna göre güncellenmiş taslak (Cursor, 29 Ocak 2026)
# Kurucu & Tek Yetkili: Serdinç ALTAY
# Tarih: 29 Ocak 2026
# Durum: TASLAK — Patron onayı bekleniyor
# ═══════════════════════════════════════════════════════════════════════════════════════

---

# İÇİNDEKİLER

| Bölüm | Başlık | Durum |
|-------|--------|-------|
| 1 | Fiyatlandırma Modeli | ✅ Güncellendi |
| 2 | Robot Hiyerarşisi (7 Katman, 25 Bot + ARGE) + Patron Paneli | ✅ Güncellendi |
| 3 | Rol Sistemi (13 Rol + Yetki Matrisleri) | ✅ Güncellendi |
| 4 | Kilitli Çekirdek Kurallar ve Güvenlik | ✅ Güncellendi |
| 5 | Dinamik Sistem ve ARGE Mekanizması | ✅ Güncellendi |
| 6 | API Hiyerarşisi ve Entegrasyonlar | ✅ KİLİTLİ |
| 7 | Operasyonel Robotlar (5 Bot) | ✅ KİLİTLİ |
| 8 | Vitrin Robotları (14 Bot) | ✅ KİLİTLİ |
| 9 | Veri Akış Şemaları | ✅ KİLİTLİ |
| 10 | Franchise Senaryoları ve İş Kuralları | ✅ Güncellendi |
| EK-A | Sporcu Analiz Sistemi | ✅ Güncellendi |
| EK-B | Grafik Havuzu (30 Adet) | ✅ KİLİTLİ |
| EK-C | Veritabanı Şema Özeti | ✅ Genişletildi |

---

# ═══════════════════════════════════════════════════════════════════════════════════════
# BÖLÜM 1: FİYATLANDIRMA MODELİ
# ═══════════════════════════════════════════════════════════════════════════════════════

## 1.1 Franchise Giriş Modeli

| Kalem | Tutar | Açıklama |
|-------|-------|----------|
| Giriş Ücreti | 1.500 $ (sabit) | Tek seferlik, marka kullanım hakkı |
| Aylık Abonelik | Değişken | Seçilen modüllere göre hesaplanır |

## 1.2 Aylık Fiyatlama Formülü

```
Aylık Satış Fiyatı = Aylık API/Sistem Maliyeti × 4

Dağılım:
├── 1/4 → API maliyeti (Claude, GPT, Gemini, Together vb.)
├── 1/4 → Altyapı maliyeti (hosting, depolama, GB kullanımı)
├── 1/4 → Operasyonel masraflar (elektrik, abonelikler, şablon lisansları)
└── 1/4 → Patron karı
```

**Aylık API/Sistem Maliyeti hesabı:** Sabit birim maliyet (API + altyapı + operasyon) alınır; franchise için **kademe çarpanı** (1.1 Kademe Kriterleri: öğrenci, personel, şube, branş sayısına göre ×1.0 … ×2.5) uygulanır. Örneğin temel birim maliyet 100 $ ise ve kademe çarpanı ×1.5 ise Aylık API/Sistem Maliyeti = 150 $ olur; Aylık Satış Fiyatı = 150 × 4 = 600 $.

## 1.3 Temel Paket (Zorunlu - Her Franchise'da Var)

| Özellik | Açıklama |
|---------|----------|
| Tesis Yönetim Paneli | Sporcu kayıt, ders programı, yoklama, kasa defteri |
| Sporcu Grafikleri | Gelişim grafikleri, tablolar, ölçümler |
| Kişiye Özel Antrenman | Ölçümlere göre bireysel antrenman önerileri |
| Veli Paneli | Çocuk takibi, ödeme, grafikler |
| Antrenör Paneli | Ders yönetimi, yoklama, sporcu notları |
| Karşılama Robotu | Web sitesinde ziyaretçi karşılama |
| 7/24 Acil Destek Robotu | Sistem sorunlarında Patron'a alarm |
| Veri Tabanı Erişimi | Akademik makaleler, federasyon bilgileri |

## 1.4 Seçmeli Modüller (Tek Seferlik)

| Modül | Açıklama |
|-------|----------|
| Logo Tasarımı | Marka kimliği oluşturma |
| Web Sitesi Kurulumu | Franchise için özel site |
| Kurumsal Kimlik Paketi | Kartvizit, broşür, şablonlar |

## 1.5 Kademe Kriterleri

| Kriter | Kademe | Çarpan |
|--------|--------|--------|
| **Öğrenci Sayısı** | 0-100 | ×1.0 |
| | 101-200 | ×1.5 |
| | 201-300 | ×2.0 |
| | 300+ | Özel |
| **Personel Sayısı** | 1-5 | ×1.0 |
| | 6-10 | ×1.25 |
| | 11-20 | ×1.5 |
| | 20+ | Özel |
| **Şube Sayısı** | 1 | ×1.0 |
| | 2-3 | ×1.75 |
| | 4-5 | ×2.5 |
| | 5+ | Özel |
| **Branş Sayısı** | 1 | ×1.0 |
| | 2-3 | ×1.3 |
| | 4+ | ×1.5 |

---

# ═══════════════════════════════════════════════════════════════════════════════════════
# BÖLÜM 2: ROBOT HİYERARŞİSİ (7 KATMAN, 25 BOT + ARGE) + PATRON PANELİ
# ═══════════════════════════════════════════════════════════════════════════════════════

## 2.1 Sistem Akış Şeması

(Aynı — değişiklik yok)

## 2.2 Robot Sayımı

| Katman | Robot Sayısı | Açıklama |
|--------|--------------|----------|
| Katman 1-3 | 3 | Patron Asistanı, Siber Güvenlik, Veri Arşivleme |
| Katman 4 | 1 | CEO Organizatör |
| Katman 5 | 1 + ARGE | CELF Merkez (12 direktörlük tek robot içinde) |
| Katman 6 | 1 + 5 | COO + 5 Operasyonel Robot |
| Katman 7 | 14 | Vitrin Robotları (satışa sunulan) |
| **TOPLAM** | **25 + ARGE** | 3+1+1+6+14 = 25 operatif birim |

## 2.3–2.9 (Aynı — değişiklik yok, 2.4’e Tepki Süresi eklendi aşağıda)

## 2.4 [2] Siber Güvenlik Robotu — Güncelleme

**Alarm Seviyeleri (Tepki süresi eklendi):**

| Seviye | Renk | Tetikleyiciler | Tepki süresi | Aksiyon |
|--------|------|----------------|--------------|---------|
| 1 | 🟢 Yeşil | Normal operasyon | Günlük | Pasif izleme, günlük rapor |
| 2 | 🟡 Sarı | 3+ başarısız giriş, olağandışı erişim | Anlık | Asistan + CEO anlık uyarı |
| 3 | 🔴 Kırmızı | Yetkisiz veri erişimi, SQL injection | 30 dk | Otomatik kilit + Patron bilgilendir |
| 4 | ⚫ Siyah | DB ihlali, çocuk verisi sızıntısı | 24 saat max | TAM KARANTİNA + Patron acil çağrı |

## 2.6 [4] CEO Organizatör — Ekleme: Onay Kuyruğu ve Patron Kararı

Sistemden (Asistan, CELF, COO) gelen işler **Onay Kuyruğu**nda listelenir. Patron’a **Onayla / Reddet / Değiştir** ile sunulur. Deploy (Vercel, Railway) ve Commit/Push (Git) işlemleri **sadece Patron onayı** ile yapılır; otomatik deploy/commit **yasaktır**.

## 2.10 PATRON PANELİ (Yeni bölüm)

Patron’un tek ekranda gördüğü alanlar (Franchise panelinde sporcu/antrenör sayıları **yok**):

| Alan | Açıklama |
|------|----------|
| Franchise geliri | Franchise satışlarından bu ay gelen gelir |
| Gider (Kasa defteri) | Günlük/aylık masraflar, sabit ödemeler, kira, fatura |
| Onay kuyruğu | Bekleyen, onaylanan, reddedilen işler; Onayla/Reddet/Değiştir |
| Aktif franchise listesi | Tıklanınca ilgili franchise paneline giriş (üye/sporcu sayısı, hata, tavsiye) |
| Şablon havuzu | Tüm şablonlar, nerede kullanıldığı, hangi özelliğin geliştirileceği (Ar-Ge/CEO önerileri) |
| Rol & yetki tanımları | Hangi rol hangi alana girebilir, sınırlamalar |
| Asistan / Robot durumu | Hangi robotlar aktif, asistan hangi AI’larla konuşuyor |

Sporcu ve antrenör sayıları **Franchise Sahibi (ROL-1) panelinde** olur; Patron panelinde olmaz.

---

# ═══════════════════════════════════════════════════════════════════════════════════════
# BÖLÜM 3: ROL SİSTEMİ (13 ROL)
# ═══════════════════════════════════════════════════════════════════════════════════════

## 3.1 Rol Hiyerarşisi — Güncellenmiş

```
                    PATRON (YİSA-S Sahibi)
                    Rol matrisinde ayrı rol kodu yok; üst yetkili.
                    Panel erişimi ayrı tanımlanır.
                           ↓
                    ROL-1: ALT ADMİN (Franchise Sahibi)
                           ↓
            ┌──────────────┼──────────────┐
            ↓              ↓              ↓
    ROL-2: TESİS MÜDÜRÜ  ROL-3: BÖLGE MÜDÜRÜ  ROL-4: SPORTİF DİREKTÖR
            ↓              (Çoklu şube)       ↓
    ROL-8: KAYIT PERSONELİ                   ROL-5: UZMAN ANTRENÖR
            ↓                                ↓
    ROL-9: TEMİZLİK                          ROL-6: ANTRENÖR
                                                 ↓
                                            ROL-7: YARDIMCI/STAJYER
```

**Veli-Sporcu Yapısı:** (Aynı)

**Özel Roller:** ROL-0: Ziyaretçi | ROL-12: Misafir Sporcu

**Çoklu şube (ROL-3):** Franchise’ın birden fazla şubesi varsa, her şube ayrı tenant veya tek panelde şube filtresi ile yönetilir; Bölge Müdürü tüm şubelere konsolide erişir.

## 3.2 Rol Detayları

(Aynı — değişiklik yok)

---

# ═══════════════════════════════════════════════════════════════════════════════════════
# BÖLÜM 4: KİLİTLİ ÇEKİRDEK KURALLAR VE GÜVENLİK
# ═══════════════════════════════════════════════════════════════════════════════════════

## 4.1 7 Kilitli Çekirdek Kural (ASLA DEĞİŞMEZ)

(Aynı)

## 4.2 10 Asla Geçilemez Kural — Güncellenmiş

| # | Kural |
|---|-------|
| 1 | Çocuk ham veri açılmaz |
| 2 | KVKK'sız kamera olmaz |
| 3 | Hareket kilidi SD onayı olmadan kalkmaz |
| 4 | Finans silinmez |
| 5 | Patron DB veri kaybetmez |
| 6 | LLM'ler çocuk verisiyle konuşmaz |
| 7 | Audit log kapatılamaz |
| 8 | Tek seferde tam erişim yoktur |
| **9** | **AI'lar .env, API_KEY, SECRET, PASSWORD, TOKEN alanlarına erişemez / yazamaz** |
| **10** | **git push, vercel deploy, railway deploy sadece Patron onayı ile; otomatik deploy/commit yasaktır** |

---

# ═══════════════════════════════════════════════════════════════════════════════════════
# BÖLÜM 5: DİNAMİK SİSTEM VE ARGE MEKANİZMASI
# ═══════════════════════════════════════════════════════════════════════════════════════

## 5.1–5.3 (Aynı)

## 5.2 ARGE Öneri Tipleri + Hedeflenen Özellikler

Mevcut tiplere ek olarak ARGE mekanizması kapsamında **hedeflenen özellikler:** her öneri için tahmini **bütçe takibi**, **ROI (geri dönüş) hesabı**, **öncelik skoru (1-10)**, gerektiğinde **A/B test** (küçük grupta önce test). Rakip/sektör takibi modülü düşük öncelikte hedeflenir.

## 5.4 Raporlama Takvimi

(Aynı)

---

# BÖLÜM 6–9 (Değişiklik yok — aynen korunur)

---

# ═══════════════════════════════════════════════════════════════════════════════════════
# BÖLÜM 10: FRANCHİSE SENARYOLARI VE İŞ KURALLARI
# ═══════════════════════════════════════════════════════════════════════════════════════

## 10.1 Franchise Satış Süreci

(Aynı)

## 10.1b Yeni Franchise Başvurusu (Ekleme)

Depo vb. başvuru kaynağından gelen talepler **10 iş günü** içinde ulaşılacak şekilde işleme alınır. Karşılama/AI ile yapılan konuşma geçmişi Patron panelinde görüntülenebilir.

## 10.2 Franchise Ayrılma Protokolü

(Aynı)

## 10.3 Grafik Satış Modeli — Güncellenmiş

| Grafik | Fiyat | YİSA-S | Franchise işletmesi |
|--------|-------|--------|----------------------|
| Standart | 75-100 TL | %80 | %20 |
| Premium | 150-200 TL | %80 | %20 |

---

# ═══════════════════════════════════════════════════════════════════════════════════════
# EK-A: SPORCU ANALİZ SİSTEMİ
# ═══════════════════════════════════════════════════════════════════════════════════════

## EK-A.1 Perspektif Değerlendirme (10 Madde)

(Aynı tablo — başlık "10 Perspektif" yerine "Perspektif Değerlendirme (10 Madde)" olarak değiştirildi; Bölüm 10 ile karışmaz.)

## 6 Zorunlu + 14 Seçimlik Parametre / PHV Takip

(Aynı)

---

# EK-B (Aynı)

---

# ═══════════════════════════════════════════════════════════════════════════════════════
# EK-C: VERİTABANI ŞEMA ÖZETİ — Genişletilmiş
# ═══════════════════════════════════════════════════════════════════════════════════════

## Çekirdek Tablolar (17 Adet)

1. tenants, 2. users, 3. robots, 4. robot_tasks, 5. celf_directorates, 6. conversations, 7. messages, 8. athletes, 9. evaluations, 10. schedules, 11. attendance, 12. payments, 13. security_alerts, 14. audit_logs, 15. patron_commands, 16. role_permissions, 17. core_rules

## Patron / Operasyon Tabloları (Örnek)

Onay kuyruğu, kasa defteri, franchise listesi, şablon ve Ar-Ge için kullanılan veya kullanılacak tablolar (proje ile uyumlu): approval_queue, pending_approvals, workflow_tasks, expenses, kasa_defteri, franchises, organizations, tenants, templates, sablonlar, rd_suggestions, ceo_updates, payment_schedule, franchise_payments. Toplam tablo sayısı (çekirdek + operasyon) ihtiyaca göre 50+ seviyesinde tanımlanabilir.

---

# ═══════════════════════════════════════════════════════════════════════════════════════
# DOKÜMAN SONUÇ (v2.1 TASLAK)
# ═══════════════════════════════════════════════════════════════════════════════════════

| Bölüm | Yapılan değişiklik |
|-------|---------------------|
| 1.2 | Aylık API/Sistem Maliyeti hesabı (sabit + kademe çarpanı) eklendi |
| 2.2 | Robot toplamı 25 + ARGE olarak düzeltildi |
| 2.4 | Alarm tepki süreleri (anlık, 30 dk, 24 saat) eklendi |
| 2.6 | Onay kuyruğu ve Patron kararı (deploy/commit Patron onayı) eklendi |
| 2.10 | **Patron Paneli** bölümü eklendi |
| 3.1 | Patron "Sistemde Yok" netleştirildi; ROL-3 şemaya eklendi; çoklu şube notu |
| 4.2 | 9. ve 10. kural: .env/API key koruması, deploy/commit Patron onayı |
| 5.2 | ARGE hedeflenen özellikler (bütçe, ROI, öncelik skoru, A/B test) eklendi |
| 10.1b | Yeni franchise başvurusu (10 günde ulaşılacak) eklendi |
| 10.3 | "İşletme" → "Franchise işletmesi" |
| EK-A | "10 Perspektif" → "EK-A.1 Perspektif Değerlendirme (10 Madde)" |
| EK-C | Patron/Operasyon tabloları listesi eklendi |

---

**© 2026 YİSA-S - Tüm Hakları Saklıdır**  
📄 MASTER DOKÜMAN v2.1 — TASLAK (İnceleme raporuna göre güncellenmiş)

**Kurucu & Tek Yetkili:** Serdinç ALTAY  
**Taslak hazırlayan:** Cursor (İnceleme raporu uygulandı)
