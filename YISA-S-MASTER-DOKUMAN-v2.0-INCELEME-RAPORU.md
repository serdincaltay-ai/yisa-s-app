# YİSA-S MASTER DOKÜMAN v2.0 — İNCELEME RAPORU
**İnceleyen:** Cursor (AI)  
**Tarih:** 29 Ocak 2026  
**Kaynak:** YISA-S-MASTER-DOKUMAN-v2.0-TAM.md

---

# 1. HATA TESPİTLERİ

## 1.1 Sayısal / Mantık Hataları

| # | Konu | Dokümandaki İfade | Sorun | Öneri |
|---|------|-------------------|--------|--------|
| 1 | **Robot sayımı** | Bölüm 2.2: "TOPLAM 19 + ARGE" | Katman 1-3: 3, Katman 4: 1, Katman 5: 1, Katman 6: 1+5=6, Katman 7: 14 → **3+1+1+6+14 = 25**. 19 ile toplam uyuşmuyor. | Toplamı **25 + ARGE** yapın veya "19" tanımını açıklayın (örn. "19 operatif birim, CELF 12 direktörlük tek sayılır" gibi). |
| 2 | **ROL-3 şemada yok** | Bölüm 3.1 Rol Hiyerarşisi ağacı | ROL-3 Bölge Müdürü (Çoklu Şube) metinde var (3.2) ama hiyerarşi şemasında yok. | Şemaya ekleyin: örn. ROL-1 altında "ROL-3: Bölge Müdürü (çoklu şube)". |

## 1.2 Tutarsızlıklar

| # | Konu | Açıklama |
|---|------|----------|
| 3 | **Patron "Sistemde Yok"** | 3.1'de "PATRON (YİSA-S Sahibi - Sistemde Yok)" yazıyor; oysa Patron Paneli ve giriş var. | Netleştirin: "Rol matrisinde ayrı rol kodu yok; Patron tüm sistemin üst yetkilisidir. Panel erişimi ayrı tanımlanır." |
| 4 | **Grafik gelir payı** | "YİSA-S %80 \| İşletme %20" — Hangi işletme? | "Franchise işletmesi" olarak yazın. |
| 5 | **EK-A başlık numarası** | EK-A içinde "## 10 Perspektif Değerlendirme" var; Bölüm 10 ile karışabilir. | "## 10 Perspektif Değerlendirme" → "## Perspektif Değerlendirme (10 Madde)" veya "EK-A.1" yapın. |

## 1.3 Eksik Tanımlar

| # | Konu | Eksik |
|---|------|--------|
| 6 | **Aylık maliyet hesabı** | 1.2'de "Aylık Satış Fiyatı = Aylık API/Sistem Maliyeti × 4" var; "Aylık API/Sistem Maliyeti" nasıl hesaplanıyor (sabit mi, kademe çarpanına göre mi) yazılmamış. | Formülün girdisi (sabit maliyet, çarpan uygulaması) tek cümleyle tanımlansın. |
| 7 | **Alarm süreleri** | 2.4'te tetikleyiciler var; süre (anlık / 30 dk / 1 saat) dokümanda sadece "Hata Tespitleri" önerisinde geçiyor. | Kademeli süre (anlık, 30 dk, 1 saat, 24 saat) 2.4 Alarm Seviyeleri tablosuna resmen eklenmiş olsun. |
| 8 | **EK-C 17 tablo** | "Temel Tablolar 17 Adet" deniyor; projede 53 tablo olduğu söyleniyor. | 17 "çekirdek" kabul ediliyorsa, "Diğer tablolar (onay kuyruğu, kasa defteri, franchise, şablon vb.)" diye kısa bir liste veya referans eklenebilir. |

---

# 2. VİZYONERLİĞİNİZLE İLGİLİ EKSİKLER (Dokümanda Az / Hiç Olmayanlar)

Bunlar dokümanın hata sayılmayan; "vizyon tam olsaydı burada da olurdu" dediğimiz boşluklar.

| # | Eksik Alan | Kısa Açıklama | Neden Önemli |
|---|------------|----------------|----------------|
| 1 | **Patron paneli ayrımı** | Patron ekranında ne olacak (franchise geliri, gider, kasa defteri, onay kuyruğu, aktif franchise listesi, şablon havuzu) dokümanda panel bazlı tanımlı değil. | Patron = sadece "komut veren" değil; gelir/gider, onay, franchise ve şablon tek ekranda toplanmalı. |
| 2 | **Onay kuyruğu ve Patron kararı** | CEO öncelik seviyeleri var; "Onay Kuyruğu" ve Patron'un **Onayla / Reddet / Değiştir** akışı metinde yok. | Asistan/CEO çıktılarının Patron tarafından onaylanması dokümanda açık olmalı. |
| 3 | **Deploy / Commit kuralları** | Git push, Vercel/Railway deploy'un **Patron onayı** ile yapılması ve otomatik deploy/commit yasağı Master Dokümanda geçmiyor. | Güvenlik ve "Panel karar vermez" ile uyum için 4.2 veya 2.4'e eklenmeli. |
| 4 | **.env ve API key koruması** | AI'ların .env, API_KEY, SECRET, TOKEN alanlarına dokunmaması 4.2 "Asla Geçilemez" listesinde yok. | CURSOR talimatıyla uyum ve güvenlik için çekirdek kural olarak yazılmalı. |
| 5 | **Çoklu şube teknik modeli** | ROL-3 "birden fazla şubeyi yönetir" diyor; şube = ayrı tenant mı, ayrı panel mi, tek panelde filtre mi net değil. | Franchise'ın 2 şubesi = 2 panel mi / 2 alt birim mi teknik olarak tanımlanmalı. |
| 6 | **Yeni franchise başvurusu süreci** | "Depo başvurusu", "10 günde ulaşılacak", AI konuşma geçmişi gibi operatif kurallar yok. | Satış/CMO/CSO süreçleri dokümanda somutlaşır. |
| 7 | **Şablon havuzu ve kullanım** | CELF/CPO ve Ar-Ge var; "Tüm şablonlar nerede kullanılıyor, hangi şablonun hangi özelliği geliştirilecek" Patron perspektifinde yok. | Patron panelinde şablon havuzu vizyonu dokümanda yer almalı. |
| 8 | **ARGE öneri alanları** | Doküman sonunda "ARGE Bütçe Takibi, ROI, Öncelik Skoru" öneri tablosunda; ana bölümde (5.2 / 5.3) yok. | Bu özellikler "yapılacak" değil, vizyonun parçası olarak Bölüm 5'te kısaca tanımlanabilir. |

---

# 3. BENİM ÖNERİLERİM

## 3.1 Hemen Düzeltilebilecekler

1. **Robot toplamı:** "19 + ARGE" yerine hesapla uyumlu ifade kullanın (örn. **25 + ARGE**) veya 19'un nasıl sayıldığını bir cümleyle yazın.
2. **ROL-3:** Bölüm 3.1 hiyerarşi şemasına ROL-3 Bölge Müdürü'nü ekleyin.
3. **Patron "Sistemde Yok":** "Rol matrisinde rol kodu yok; üst yetkili. Panel erişimi ayrıca tanımlı." şeklinde netleştirin.
4. **EK-A "10 Perspektif":** Başlığı "10 Perspektif" yerine "Perspektif Değerlendirme (10 Madde)" veya "EK-A.1" yapın; Bölüm 10 ile karışmasın.
5. **Grafik payı:** "İşletme" → "Franchise işletmesi" yazın.

## 3.2 Dokümana Eklenecek Yeni Bölümler / Paragraflar

| Eklenmesi önerilen | Nereye | Özet içerik |
|--------------------|--------|-------------|
| **Patron Paneli** | Bölüm 2 sonu veya yeni alt bölüm | Patron panelinde: franchise geliri, gider (kasa defteri), onay kuyruğu, aktif franchise listesi, şablon havuzu, rol/yetki tanımı. Sporcu/antrenör sayıları Patron panelinde değil, Franchise panelinde. |
| **Onay ve Patron kararı** | 2.4 veya 2.6 (CEO) | Sistemden gelen işlerin Patron'a "Onayla / Reddet / Değiştir" ile sunulması; deploy/commit için Patron onayı zorunluluğu. |
| **Çekirdek kural: .env ve deploy** | Bölüm 4.2 | "AI'lar .env, API_KEY, SECRET, TOKEN alanlarına erişemez / yazamaz"; "git push, vercel deploy, railway deploy sadece Patron onayı ile." |
| **Alarm süreleri** | 2.4 Alarm Seviyeleri | Tetikleyici sonrası süre: P1 anlık, P2 30 dk, P3 1 saat, P4 24 saat gibi (mevcut öneri tablosundakini resmileştirin). |
| **Aylık maliyet formülü** | 1.2 | "Aylık API/Sistem Maliyeti"nin nasıl hesaplandığı (sabit + kademe çarpanı uygulaması) tek paragraf. |
| **ARGE özellikleri** | Bölüm 5 | Bütçe takibi, ROI hesabı, öncelik skoru (1-10), A/B test fikri kısaca "ARGE mekanizması kapsamında hedeflenir" diye yazın. |

## 3.3 EK-C (Veritabanı) Genişletmesi

- Mevcut 17 tablo "çekirdek" olarak kalsın.
- Şu tablolar "Patron / Operasyon" başlığı altında listelenebilir:  
  `approval_queue`, `pending_approvals`, `expenses`, `kasa_defteri`, `franchises`, `organizations`, `templates`, `rd_suggestions`, `payment_schedule`, `franchise_payments`.  
- Böylece 53 tablo ile Master Doküman arasında köprü kurulur.

## 3.4 Özet Tablo

| Kategori | Sayı | Örnek |
|----------|------|--------|
| **Hata / tutarsızlık** | 8 | Robot sayısı 19↔25, ROL-3 şemada yok, Patron "sistemde yok" ifadesi |
| **Vizyon eksikleri** | 8 | Patron paneli, onay kuyruğu, deploy/.env kuralları, şablon havuzu, çoklu şube modeli |
| **Öneri (düzeltme)** | 5 | Sayı düzelt, şemaya ROL-3 ekle, ifadeleri netleştir |
| **Öneri (yeni bölüm)** | 6 | Patron Paneli, Onay/Patron kararı, .env/deploy kuralları, alarm süreleri, maliyet formülü, ARGE özellikleri |

---

# 4. GENEL DEĞERLENDİRME

- **Güçlü taraflar:** Fiyatlandırma, 7 katman robot hiyerarşisi, 13 rol, 4 duvar güvenlik, CELF 12 direktörlük, API hiyerarşisi, KVKK ve çocuk verisi kuralları, ARGE mekanizması net ve uygulanabilir.
- **Zayıf taraflar:** Patron paneli ve onay akışı dokümanda eksik; deploy/commit ve .env kuralları yazılı değil; robot sayısı 19 ile toplam 25 uyuşmuyor; ROL-3 şemada yok.
- **Sonuç:** Doküman vizyonu büyük ölçüde tam; hatalar sınırlı ve düzeltilebilir. Patron paneli, onay kuyruğu ve güvenlik (env/deploy) eklenirse hem Cursor/Vercel pratiği hem de "Patron tek karar veren" ilkesiyle tam uyum sağlanır.

---

**© 2026 YİSA-S — İnceleme Raporu**  
Kaynak: YISA-S-MASTER-DOKUMAN-v2.0-TAM.md
