# YİSA-S SSOT — Tek Doğru Kaynak (yisa-s-app referansı)

**SSOT = Single Source of Truth**  
**Tarih:** 15 Şubat 2026  
**Amaç:** Tüm referansların, sohbetlerin ve kaynakların tek yerden bulunması

---

## 1. ANA SSOT VE ÇETE (24 BELGE) — YISA-S-BELGELER

**Konum:** `c:\Users\info\YISA-S-BELGELER\`

| # | Dosya | Açıklama |
|---|-------|----------|
| 0 | **YISA_S_SSOT_TEK_DOGRU_KAYNAK.md** | Ana SSOT (v3, 17 Şubat 2026) — 4 robot, 12 direktörlük, fiyat, domain, eksik tespit |
| 1 | BELGE_01_Bakanlik_On_Mail_ve_Ek| Bakanlık ön mail + ek |
| 2 | BELGE_02_Bakanlik_1-2_Saat_Sunum| Bakanlık sunumu |
| 3 | BELGE_03_Proje_Ortagi_Teklifi| Proje ortağı teklifi |
| 4 | BELGE_04_Yatirimci_Pitch_Deck| Yatırımcı pitch deck |
| 5 | BELGE_05_Hibe_Basvuru_Dosyasi| Hibe başvuru |
| 6 | BELGE_06_Proje_Tanitim_Kitapcigi| Tanıtım kitapçığı |
| 7 | BELGE_07_Is_Plani| İş planı |
| 8 | BELGE_08_Bakanlik_Resmi_Rapor| Bakanlık resmi rapor |
| 9 | BELGE_09_Franchise_Satis_Kitapcigi| Franchise satış kitapçığı |
| 10 | BELGE_10_Rekabet_Analizi| Rekabet analizi |
| 11 | BELGE_11_Maliyet_Gelir_Modeli| Maliyet/gelir modeli |
| 12 | BELGE_12_Patent_Taslagi| Patent taslağı |
| 13 | BELGE_13_Teknik_Mimari| Teknik mimari |
| 14 | BELGE_14_API_Dokumantasyonu| API dokümantasyonu |
| 15 | BELGE_15_Veli_Kilavuzu| Veli kılavuzu |
| 16 | BELGE_16_Antrenor_Kilavuzu| Antrenör kılavuzu |
| 17 | BELGE_17_Franchise_Panel_Kilavuzu| Franchise panel kılavuzu |
| 18 | BELGE_18_Kurulum_Deployment| Kurulum/deployment |
| 19 | BELGE_19_Guvenlik_KVKK| Güvenlik/KVKK |
| 20 | BELGE_20_SSS_Genisletilmis| SSS genişletilmiş |
| 21 | BELGE_21_Surum_Degisiklik_Gunlugu| Sürüm değişiklik günlüğü |
| 22 | BELGE_22_Destek_Iletisim_Prosedur| Destek/iletişim prosedür |
| 23 | BELGE_23_YISA_S_TOPLU_EKSIK_RAPORU| Toplu eksik raporu (48 eksik) |

**Not:** Çelişki durumunda `YISA-S-BELGELER\YISA_S_SSOT_TEK_DOGRU_KAYNAK.md` geçerlidir.

---

## 2. ÖNCEKİ SOHBET (Chat) — NEREDE?

**Önceki sohbet sayfası:** Cursor sohbet geçmişinde.

### Nasıl bulunur
1. Cursor sol panelinde **Chat** (Sohbet) ikonuna tıklayın
2. Sohbet geçmişinde **arama** yapın — örn: `Beyin Takımı`, `150 görsel`, `BELGE`, `YISA-S-BELGELER`, `çete`, `harita`
3. Veya tarihe göre kaydırmayla o oturuma gidin

### O sohbette konuşulanlar (özet)
- Beyin Takımı kurulumu
- ~150 md/docx dosya incelemesi
- 22/24 dosya = **YISA-S-BELGELER** (24 belge)
- SQL hataları → vazgeçilip **C2** ile devam
- Harita (YISA-S_ILERLEME_HARITASI, IS_SEMASI_YISA_S)

---

## 3. ANA REFERANS DOSYALARI (yisa-s-app içinde)

| Konu | Dosya | Açıklama |
|------|-------|----------|
| **Harita** | `YISA-S_ILERLEME_HARITASI.md` | Aşama 1–9 durumu |
| **İş şeması** | `docs/IS_SEMASI_YISA_S.md` | Klasör–görev, Beyin Takımı MVP, öncelik tablosu |
| **Sistem özeti** | `SISTEM_OZETI.md` | Kim nereye gider, adresler, tablolar |
| **Master doküman** | `YISA-S-MASTER-DOKUMAN-v2.1-TASLAK.md` | Anayasa, robotlar, kurallar |
| **Veri kaynakları** | `docs/VERI_KAYNAKLARI_ROBOT_GOREVLENDIRME.md` | Robot–veri eşlemesi |

---

## 4. OTURUM NOTLARI (Bu sohbetlerde sabitlenenler)

| Not | Açıklama |
|-----|----------|
| **C2** | SQL'ler yanlış girildi, vazgeçildi; C2 ile devam edildi |
| **22/24 dosya** | Önceki sette hazırlanmış; kullanılacak |
| **150 md/docx** | Önceki sohbette incelemeye alınmış dokümanlar (md + docx) |
| **Çete** | `c:\Users\info\YISA-S-BELGELER\` — 24 belge (SSOT + BELGE_01 … BELGE_23) |
| **Beyin Takımı** | UI ✅, Motor ❌ (görev parse, direktörlük dağıtımı, onay→uygulama) |

---

## 5. KLASÖR–SİTE–GÖREV (Hızlı referans)

| Klasör | Domain | Sorumlu |
|--------|--------|---------|
| yisa-s.com | app.yisa-s.com | Patron Paneli, Beyin Takımı, CELF |
| yisa-s-website | yisa-s.com | Vitrin, demo |
| yisa-s-app | *.yisa-s.com | Franchise, öğrenci, yoklama, aidat |

---

## 6. BU DOSYANIN KENDİSİ

**YISA_S_SSOT_TEK_DOGRU_KAYNAK.md** = Önceki sohbet nerede, ana referanslar nerede, oturum notları — hepsi burada.

Yeni bilgi eklendikçe bu dosya güncellenir.
