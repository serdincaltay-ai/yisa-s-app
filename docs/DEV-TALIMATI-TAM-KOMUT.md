# Dev Tam Komut — 7 Faz, Yapılmayan İşler, Çalışma Prensibi, Canlı İş Akışı ve Kullanım Kılavuzu

> **Bu dosya dev'e verilecek tek tam komuttur.** Dev aşağıdaki işleri yapacak; çıktılar **canlı** tutulacak — projede veya dokümantasyonda yapılan her değişiklik ilgili dosyada **hemen** güncellenecek.

---

## 1. Yapılacak İşler Özeti

| # | Görev | Çıktı dosya |
|---|--------|--------------|
| 1 | **7 faz değerlendirmesi** — Her fazdaki işlerin hangileri yapıldı, hangileri yapılmadı | YISA-S-CANLI-PROJE-RAPORU.md (7 faz bölümü) + YISA-S-7-FAZ-DURUMU.md güncellemesi |
| 2 | **Yapılmayan işler** — Tüm belgelerden (final harita, durum raporları, analiz, yol haritaları) "yapılması gereken ama yapılmamış" maddeleri çıkar | YISA-S-CANLI-PROJE-RAPORU.md |
| 3 | **Çalışma prensibi + kullanım kılavuzu** — Karakterler (robotlar, 12 agent, tenant, siteler), kim ne yapıyor, hangi agent hangi sayfayı/panel bilgisini kontrol ediyor | YISA-S-CALISMA-PRENSIBI-VE-KULLANIM-KILAVUZU-CANLI.md |
| 4 | **Canlı iş akışı şeması** — Finalde ne yapılacaktı / şu an ne yapılıyor / yapıldı; projede değişiklik olunca **zorunlu güncelleme** | YISA-S-CANLI-IS-AKISI-SEMASI.md |
| 5 | **Canlı kullanım kılavuzu** — Ekran/sekme/buton/agent eşlemesi; ufak değişiklikte bile **zorunlu güncelleme** | YISA-S-CALISMA-PRENSIBI-VE-KULLANIM-KILAVUZU-CANLI.md (aynı dosyada kullanım kılavuzu bölümü) |

---

## 2. Adım 1 — 7 Faz Değerlendirmesi

**Kaynak:** YISA_S_V0_YOL_HARITASI.md (7 faz: Vitrin+Demo, Tenant, Güvenlik Robotu, Veri Robotu, Franchise Paneli, Veli Paneli, CELF Zinciri).

**Yapılacak:**
1. Her fazı tek tek aç; her fazdaki **adımları** (ADIM 1.1, 1.2, … 7.1 vb.) listele.
2. Her adım için **yapıldı mı / yapılmadı mı** değerlendir (kod/API/sayfa kontrolü ile).
3. Sonucu **YISA-S-CANLI-PROJE-RAPORU.md** içinde "7 Faz — Yapılan / Yapılmayan" tablosuna işle.
4. **YISA-S-7-FAZ-DURUMU.md** dosyasını bu değerlendirmeye göre güncelle (hangi fazda hangi adımlar tamam, hangileri eksik).

**Kural:** 7 faz değerlendirmesi de canlı raporda yer alacak; ileride bir faz adımı tamamlandığında aynı tabloda durum "Yapıldı" olarak güncellenecek.

---

## 3. Adım 2 — Yapılmayan İşlerin Tüm Belgelerden Çıkarılması

**Kaynak belgeler (hepsini tek tek kontrol et):**
- YISA-S-FINAL-IS-HARITASI.md (Bölüm 1 tablo, Bölüm 3 eksiklik listesi)
- YISA-S-IS-AKISI-VE-ASAMALAR.md
- YISA-S-TUM-PROJELER-SEMA-VE-ZORUNLULUKLAR.md
- DEV-IN-YOL-HARITASI-VE-ANALIZ-DOSYALARI.md listesindeki tüm dosyalar (yol haritası, ilerleme, şema, durum, analiz, iş akışı)
- YISA-S-FINAL-IS-HARITASI ve durum haritası/raporlarda "şu iş böyle olmadı" / "yapılacaktı" diye maddeler oluşturduğumuz tüm belgeler

**Yapılacak:**
1. Her belgeden **yapılması gereken ama henüz yapılmamış** maddeleri çıkar.
2. Bu maddeleri **YISA-S-CANLI-PROJE-RAPORU.md** dosyasına ekle (Kaynak, Madde, Durum, Son güncelleme, Not). Zaten yapılmış olanları "Yapıldı" veya "Mevcut" işaretle.
3. 7 fazdan çıkan yapılmayan işleri de aynı rapora ayrı bir bölüm veya aynı tabloda "Kaynak: 7 Faz – Faz X" şeklinde işle.

**Kural:** Yapılmayan iş listesi canlı kalacak; bir iş yapıldığında raporda ilgili satır güncellenecek.

---

## 4. Adım 3 — Çalışma Prensibi ve Karakterler

**Çıktı:** YISA-S-CALISMA-PRENSIBI-VE-KULLANIM-KILAVUZU-CANLI.md (Bölüm: Çalışma Prensibi).

**İçerik (yazılacak):**
1. **Karakterler (kim var):**
   - **4 Robot:** YİSA-S CELF (12 direktörlük), Veri Robotu, Güvenlik Robotu, YİSA-S Robotu (vitrin/ManyChat). Her birinin görevi, nerede kullanıldığı, deploy/çalıştırma prensibi.
   - **12 Agent (direktörlük):** CELF içindeki 12 direktörlük (CTO, CHRO, CLO, CFO, CSPO, CMO, Tasarım, CPO, CSO, CDO, CXO, CRDO vb.). Her birinin görevi ne, ne yapar, nasıl tetiklenir.
   - **Tenant:** Franchise/tesis; hangi sitede, hangi veriyi kullanır, hangi panelle yönetilir.
   - **Siteler:** app.yisa-s.com, yisa-s.com, *.yisa-s.com — hangi repo, kim girer, ne görür.
2. **Görevlendirmeler:** Kim ne yapıyor; veri panelinden ne alınır, nereye yazılır; hangi robot/agent hangi işi yapar.
3. **Çalıştırma prensibi:** Sistem nasıl çalışır (giriş → rol → panel → veri akışı); deploy için hangi repo/robot kullanılır.

**Kural:** Proje yapısı veya rol/robot tanımı değişirse bu bölüm **hemen** güncellenecek (canlı).

---

## 5. Adım 4 — Canlı İş Akışı Şeması

**Çıktı:** YISA-S-CANLI-IS-AKISI-SEMASI.md

**İçerik:**
- **Finalde ne yapılacaktı** (hedefler, maddeler).
- **Şu an ne yapılıyor** (devam eden işler).
- **Yapıldı** (tamamlanan maddeler, tarih).
- Görsel/metin akış: örn. A → B → C → D → E veya faz bazlı "Faz 1–7 durum" tablosu.

**Zorunlu kural:** Projede **herhangi bir değişiklik** yapıldığında (özellik ekleme, düzeltme, iş tamamlama) bu dosya **aynı gün** güncellenecek. Yapılan değişiklik bu şemada "yapıldı" veya "şu an yapılıyor" olarak işlenecek; hedeften düşürülmeyecek.

---

## 6. Adım 5 — Canlı Kullanım Kılavuzu

**Çıktı:** YISA-S-CALISMA-PRENSIBI-VE-KULLANIM-KILAVUZU-CANLI.md (Bölüm: Kullanım Kılavuzu).

**İçerik (çok ince detay):**
- **Ekran/sayfa/sekme eşlemesi:** Vitrin sayfasındaki şu sekme nedir, hangi bileşen; franchise panelindeki şu alan ne; veli panelindeki şu buton ne yapar.
- **Hangi agent/robot neyi kontrol ediyor:** Bu sayfayı çalıştıran agent hangisi; bu paneldeki veriyi hangi robot/API sağlıyor; bu sekme hangi direktörlük/agent ile ilişkili.
- **Kullanıcı/site durumu:** Hangi kullanıcı tipi hangi siteye girer, hangi ekranı görür; karışmaması için tablo.
- Piller nereye, hangi düğme ne işe yarar tarzı **ince detaylar** — her önemli ekran öğesi ve onu besleyen sistem bileşeni (agent/robot/API) yazılacak.

**Zorunlu kural:** Projede **ufak bir değişiklik** bile yapıldığında (yeni sekme, buton, panel alanı, agent ilişkisi) kullanım kılavuzu **hemen** güncellenecek. Bu dosya canlı kullanım kılavuzudur; değişiklik yapıldıkça orası da değişecek.

---

## 7. Canlılık Kuralları (Zorunlu)

| Dosya | Ne zaman güncellenir |
|-------|----------------------|
| **YISA-S-CANLI-PROJE-RAPORU.md** | Bir iş yapıldığında / düzeltildiğinde; 7 fazda bir adım tamamlandığında. |
| **YISA-S-CANLI-IS-AKISI-SEMASI.md** | Projede herhangi bir değişiklik (özellik, düzeltme, iş tamamlama) yapıldığında. |
| **YISA-S-CALISMA-PRENSIBI-VE-KULLANIM-KILAVUZU-CANLI.md** | Çalışma prensibi, karakter veya ekran/panel/agent eşlemesi değiştiğinde; ufak UI/akış değişikliğinde. |

**Genel kural:** Projede değişiklik yapıldı → ilgili canlı dosya(lar) **hemen** güncellenecek; hedeften düşürülmeyecek.

---

## 8. Dev'e Vereceğiniz Komut (Kopyala-Yapıştır)

Aşağıdaki metni dev'e iletebilirsiniz:

```
Görev: Aşağıdakileri yap ve çıktıları canlı tut.

1) 7 FAZ DEĞERLENDİRMESİ
- YISA_S_V0_YOL_HARITASI.md içindeki 7 fazı (Faz 1–7) ve her fazdaki adımları tek tek değerlendir.
- Her adım için: yapıldı mı / yapılmadı mı karar ver (koda/API’ye/sayfaya bakarak).
- Sonucu YISA-S-CANLI-PROJE-RAPORU.md’ye "7 Faz — Yapılan / Yapılmayan" olarak işle.
- YISA-S-7-FAZ-DURUMU.md’yi bu değerlendirmeye göre güncelle.

2) YAPILMAYAN İŞLER
- DEV-TALIMATI-ESKI-RAPORLAR-VE-CANLI-RAPOR.md’deki tüm belge listesini + YISA-S-FINAL-IS-HARITASI, YISA-S-IS-AKISI-VE-ASAMALAR, YISA-S-TUM-PROJELER-SEMA-VE-ZORUNLULUKLAR ve durum/analiz/harita belgelerini tek tek tara.
- "Yapılması gereken ama yapılmamış" tüm maddeleri çıkar; YISA-S-CANLI-PROJE-RAPORU.md’ye ekle (Kaynak, Madde, Durum, Son güncelleme, Not). Yapılmış olanları Yapıldı/Mevcut işaretle.

3) ÇALIŞMA PRENSİBİ + KULLANIM KILAVUZU (CANLI)
- YISA-S-CALISMA-PRENSIBI-VE-KULLANIM-KILAVUZU-CANLI.md dosyasını oluştur/güncelle.
- İçerik:
  a) Çalışma prensibi: 4 Robot (CELF, Veri, Güvenlik, YİSA-S vitrin) ve 12 Agent (direktörlük) kimdir, görevi ne, nerede kullanılır, nasıl çalıştırılır. Tenant, siteler (app.yisa-s.com, yisa-s.com, *.yisa-s.com), kim ne yapar, veri panelinden ne alınır, görevlendirmeler.
  b) Kullanım kılavuzu: Ekrandaki her önemli öğe (vitrin sekmesi, franchise panel alanı, veli butonu vb.) nedir; hangi agent/robot o sayfayı/panel bilgisini kontrol ediyor; hangi API/veri kaynağı. İnce detay seviyesinde yaz. Kullanıcı tipleri ve hangi siteye ne gördüğü tablosu.
- Kural: Projede veya dokümantasyonda ufak bir değişiklik yapıldığında bu dosya hemen güncellenecek (canlı).

4) CANLI İŞ AKIŞI ŞEMASI
- YISA-S-CANLI-IS-AKISI-SEMASI.md dosyasını oluştur/güncelle.
- İçerik: Finalde ne yapılacaktı / şu an ne yapılıyor / yapıldı (maddeler veya tablo). Proje akışı (A→B→C→D→E) ve 7 faz durumu burada özetlenecek.
- Zorunlu kural: Projede herhangi bir değişiklik yapıldığında bu dosya aynı gün güncellenecek; yapılan iş burada işlenecek.

Tüm bu dosyalar canlıdır: değişiklik yapıldıkça ilgili dosya güncellenecek, hedeften düşürülmeyecek.
```

---

**Talimat sonu.**
