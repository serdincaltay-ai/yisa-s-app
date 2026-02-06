# YİSA-S SİSTEM MİMARİSİ v3.0
## Tam Kapsamlı Mimari Doküman — Şubat 2026
### Kurucu: Serdinç ALTAY | Mimari Danışman: Claude (Opus 4.5)

---

## BÖLÜM 1: GENEL YAPI — 5 ROBOT + PATRON

### 1.1 Patron (İnsan — Sen)
- Robot değil, insan. Sistemin tek karar vericisi ve onay makamı.
- CEO Robotu üzerinden tüm işleri izler, onaylar, reddeder, düzeltme gönderir.
- CELF'e Patron Asistanı üzerinden iş gönderir, sohbet eder, fikir alışverişi yapar.
- Panelde tüm robotları, direktörlükleri, tenantları, mağazayı ve istatistikleri görür.

### 1.2 CEO Robotu (10'a Çıkart Havuzu)
- Patrona doğrudan bağlı onay havuzu.
- Tüm robotlardan gelen tamamlanmış işler buraya düşer.
- Patron burada: video izler, logo seçer, tasarım değerlendirir, belge inceler, istatistik kontrol eder.
- Onay → Deploy, push, komit, arşiv, mağazaya gönderim otomatik yapılır.
- Red → CELF'e düzeltme notu ile geri gönderilir.
- Rutin işler → Patron onayı beklemeden otomatik ilerler (önceden tanımlı kurallarla).
- "Onaylanan İşler" kenarda hatırlatma olarak durur (hangi robottan ne gelmiş).
- İkiz Robot (Sigorta): YİSA-S robotunun tam yedek kopyası. Ana robot çökerse ikiz devralır. Güncelleme gelmeden önce mevcut durumun yedeğini alır, sonra günceller.

### 1.3 Güvenlik Robotu (Bağımsız Katman)
- CELF'ten ve diğer robotlardan bağımsız çalışır. Tüm sistemi dışarıdan izler.
- Saldırı koruması, hatalı kullanıcı tespiti, yetkisiz işlem engelleme.
- Görev çakışması kontrolü: Aynı görev peş peşe mi geliyor? Gereksiz tekrar var mı?
- Virus/saldırı tespitinde patron onayı beklemeden sistemi korumaya alır, sonra bildirim.
- Token harcama anomalisi tespiti (bir AI neden sürekli token harcıyor, iş var mı yok mu).
- Son sağlıklı noktaya geri dönüş (rollback) yeteneği.

### 1.4 Veri Robotu (Bağımsız Katman)
- Veritabanı yönetimi, yedekleme, arşiv. CELF'ten bağımsız.
- Onaylanan işler buraya arşivlenir. Tenant verileri izole saklanır (RLS).
- Sportif referans veritabanı burada: uzman bilgi tabanı, hareket havuzu, ölçüm standartları.
- Anonim istatistik verileri burada toplanır (araştırma amaçlı).
- Sadece patrona tam veri sunumu.

### 1.5 YİSA-S CELF (Ana Üretim Motoru)
- İçerisinde: CELP (12 Direktörlük), Patron Asistanı, Proje Masası, İş Kuyruğu Motoru.
- Tüm üretim, analiz, içerik ve operasyon işlemleri burada gerçekleşir.
- Robot üreticisi: Tenant'lara dağıtılacak botları (muhasebe, sosyal medya, antrenör vb.) üretir ve sınırlarını belirler.

### 1.6 YİSA-S (Mağaza + Tenant Yönetimi)
- CELF'in ürettiği robotları alır, tenant'lara dağıtır.
- Mağaza: Şablonlar, robotlar, paketler satılır. Demo talepleri buradan gelir.
- Ödeme sonrası tenant otomatik oluşturulur. Her tenant subdomain: ornek.yisa-s.com
- Tenant onboarding: Kullanıcı, üye, sporcu, antrenör, çalışan, işletmeci onboard akışları.

---

## BÖLÜM 2: PATRON PANELİ — CEO ROBOTU (panel.yisa-s.com)

### 2.1 Panel Widget'ları (Tümü Patron Görünümünde)

| No | Widget | Açıklama |
|----|--------|----------|
| 1 | **10'a Çıkart Havuzu** | Tüm robotlardan gelen tamamlanmış işler: video, logo, tasarım, belge, istatistik, antrenman programı, ders programı, demo talebi. Patron izler, seçer, onaylar/reddeder. |
| 2 | **Kasa ve Ödemeler** | Şirket kasası, sabit ödemeler, gelecek ödemeler, ödeme günleri/tarihleri, IBAN bilgileri, gelir takibi, token satışları, maliyet raporu. Kasa defteri. |
| 3 | **Başvurular ve Demo Talepleri** | Yeni franchise talepleri, demo istekleri (hangi paket, hangi robotlar seçilmiş, token tercihi). |
| 4 | **İletişim Merkezi** | WhatsApp, Instagram DM, Google Business, e-posta, telefon — tek panelde. Sürükle-bırak ile kenara yerleştirilebilir widget'lar. |
| 5 | **İçerik ve Reklam** | Kampanyalar, sosyal medya paylaşımları, üretilen içerikler. |
| 6 | **Robot Durumu** | Hangi robot ne yapıyor, token harcamaları, iş yükü, çalışan/bekleyen görevler. Her robotun token limiti ve tüketim hızı görünür. |
| 7 | **Patron Asistanı** | Özel AI sohbet alanı. Claude, GPT, Gemini, Cursor, v0, Together.ai seçimi. Detaylar Bölüm 4'te. |
| 8 | **Dashboard** | Genel istatistikler, franchise sayısı, öğrenci sayısı, aktif robot. Grafikler ve görsellerle anlatım (yazı değil). |
| 9 | **Güvenlik** | Güvenlik uyarıları, saldırı raporları, sistem durumu, son yedekleme. |
| 10 | **YİSA-S Mağaza** | Mağaza kontrolü: Kim hangi ürüne tıklıyor, kim demo yapmaya çalışıyor, standart paket mi premium mi deniyor, kayıt alıyorlar mı. |
| 11 | **Tenant İzleme** | Tüm franchise'ların durumu, aktif kullanıcılar, token kullanımı. 1'den 100'e kadar tenant, flipcard gibi tıkla-gir. Geliştirmeye ihtiyaç var mı tespiti. |
| 12 | **Takvim ve Ajanda** | Toplantılar, özel günler, görevler, hatırlatmalar, hesap makinesi. |

### 2.2 Onay Akışı (10'a Çıkart Havuzu Detay)
1. İş tamamlandığında CEO havuzuna düşer.
2. Patron görür: video ise izler, logo ise seçer (5 logo geldi → "bu at, bu at, bu kalsın, bu kalsın"), tasarım ise değerlendirir.
3. Onay basıldığında → otomatik olarak: deploy, push, komit, veritabanına kayıt, mağazaya/vitrine gönderim.
4. Red basıldığında → CELF'e düzeltme notu ile geri.
5. Onaylanan işler kenarda "hatırlatma" olarak kalır (hangi robottan ne gelmiş, tarih sırası).

---

## BÖLÜM 3: PATRON ASİSTANI — DETAYLI ÇALIŞMA MODELİ

### 3.1 Temel Mantık
- CELF içinde yer alan, sadece patrona ait özel asistan birimi.
- Panelde tüm AI'lar liste halinde görünür (1-8 arası robot). Her birinin altında uzmanlık alanı yazar.
- Patron istediği AI'a basar → o AI yeşil olur (aktif) → sohbet başlar.

### 3.2 Çoklu AI Sohbet Modeli
- Patron Claude ile konuşuyor → sohbet devam ediyor.
- "Bunu komut olarak gönder" → Claude, CELF iş kuyruğuna veya CEO havuzuna iletir.
- Claude'u kapatıp GPT'ye basıyor → GPT, Claude'un yazdığı sohbeti okuyabiliyor → "Sen ne diyorsun buna?" diye sorulabiliyor.
- GPT'yi kapatıp v0'a basıyor → "Al bunu kodla" denilebiliyor.
- Aynı anda 2 AI aktif olabiliyor: "Sen de buna bir öneride bulun" → ikisi aynı chat ortamında.
- Sohbet söndürülünce orada duruyor, tekrar açılınca kaldığı yerden devam.

### 3.3 İş Gönderme Seçenekleri
- "Bunu CEO havuzuna gönder" → 10'a Çıkart'a düşer.
- "Bunu kendime kaydet" → Patron kendi panelinde bakar, siler, düzenler. Havuza göndermeden.
- "Bunu direkt deploy et" → Patron kendi yetkisiyle direkt yayına alır (CEO onayı bypass — sadece patron yapabilir).

---

## BÖLÜM 4: CELP — 12 DİREKTÖRLÜK

### 4.1 Direktörlük Listesi

| Kod | Direktörlük | Üretici | Denetçi | Temel Görev |
|-----|-------------|---------|---------|-------------|
| CFO | Finans | GPT | Claude | Muhasebe, bütçe, kasa, token ekonomisi, maliyet, ödeme takibi |
| CTO | Teknoloji | Cursor | Claude | Yazılım geliştirme, API, sistem mimarisi, deployment |
| CMO | Pazarlama | GPT | Claude | Reklam, kampanya, sosyal medya stratejisi, marka |
| CHRO | İnsan Kaynakları | GPT | Claude | Personel, işe alım, performans, roller, kullanıcı dağıtımı |
| CLO | Hukuk | Claude | Claude | KVKK, sözleşmeler, franchise anlaşmaları, yasal uyumluluk |
| CSO | Strateji | Claude | Claude | İş stratejisi, büyüme planı, pazar analizi, rekabet |
| CDO | Tasarım | v0/Cursor | Claude | UI/UX, görsel içerik, logo, video, grafik, şablon |
| CISO | Bilgi Güvenliği | Claude | Claude | Siber güvenlik politikaları, erişim kontrol, şifreleme, denetim |
| CCO | İletişim | Gemini | Claude | Müşteri iletişimi, WhatsApp, e-posta, bildirimler, destek |
| CPO | Ürün | GPT | Claude | Ürün geliştirme, şablon oluşturma, paket tasarımı, yeni özellik |
| CIO | Bilgi İşlem | Together.ai | Claude | Veri analizi, raporlama, dashboard, istatistik, AI model yönetimi |
| SPORTİF | Sportif Direktörlük | Claude | Claude | Antrenman programları, çocuk gelişim takibi, ölçüm, branş yönlendirme |

### 4.2 Her Direktörlükte Prompt Kuralı (KRİTİK)
- Her direktörlüğün içinde o alana özel bir **system prompt** tanımlıdır.
- AI o direktörlüğe girdiğinde sadece o prompt'a göre çalışır.
- Prompt dışına çıkamaz, başka alanla ilgili iş yapamaz.
- Örnek: CFO prompt'u → "Sen bir finans uzmanısın. Sadece muhasebe, bütçe, kasa, ödeme takibi, maliyet analizi konularında çalışırsın. Başka konularda yorum yapma."

### 4.3 İşbirliği Modları
- **SOLO:** Tek direktörlük kendi işini yapar.
- **TAKIM (2-5):** Proje Masası açılır, ilgili direktörlükler çağrılır. Her biri kendi parçasını üretir, Claude denetler, parçalar birleştirilir.
- **TAM KADRO:** Büyük ürün lansmanı, sistem güncelleme. 12 direktörlük eş zamanlı.

### 4.4 CELF'in Robot Üretici Rolü
- CELF, tenant'lara dağıtılacak işletme robotlarını üretir.
- Her robot için: ne yapacağı, sınırları, hangi şablonlarla çalışacağı, hangi prompt ile çalışacağı belirlenir.
- Örnek: "Muhasebe Robotu: Şu özelliklerde çalışacak, şu sınırları var, şu şablonları takip edecek, firma yetkilisine yardımcı olacak."
- Sosyal medya robotu, antrenör robotu, satış robotu vb. hepsi bu şekilde üretilir ve sınırları belirlenir.

---

## BÖLÜM 5: SPORTİF YAPI — UZMAN BİLGİ TABANI VE ANTRENMAN SİSTEMİ

### 5.1 Uzman Bilgi Tabanı (Veri Robotunda)

| No | Uzmanlık Alanı | Katkısı |
|----|----------------|---------|
| 1 | Pedagog | Çocuk psikolojisi, yaşa uygun yaklaşım, motivasyon |
| 2 | Fizyolog | Kas-iskelet gelişimi, enerji sistemleri, yaşa göre yüklenme |
| 3 | Psikolog | Mental hazır bulunuşluk, motivasyon, sosyal gelişim |
| 4 | Çocuk Doktoru | Genel sağlık, büyüme-gelişme normları, hastalık/ilaç durumu |
| 5 | Ortopedist | Skolyoz, kifoz, lordoz, düz taban, çarpık bacak, pelvis, postür |
| 6 | Fizyoterapist | Rehabilitasyon, sakatlık sonrası dönüş, koruyucu egzersiz |
| 7 | Anatomi Uzmanı | Vücut yapısı, eklem açıklıkları, kas grupları |
| 8 | Kinesiyoloji Uzmanı | Hareket analizi, biyomekanik, performans optimizasyonu |
| 9 | Spor Sakatlıkları ve Rehabilitasyon Uzmanı | Sakatlık risk tespiti, önleme, rehabilitasyon protokolleri |
| 10 | Kondisyoner | Fiziksel hazırlık, kuvvet-dayanıklılık programları |
| 11 | Antrenman Bilimci | Periyodizasyon, yüklenme-dinlenme dengesi, adaptasyon |
| 12 | Akademisyen | Bilimsel araştırma verileri, güncel literatür |
| 13 | Atletizm Antrenörü | Koşu, atlama, atma temel becerileri |
| 14 | Jimnastik Uzman Antrenörü | Akrobasi, denge, esneklik, teknik hareketler |
| 15 | Yüzme Antrenörü | Su sporları, koordinasyon, solunum teknikleri |

### 5.2 Çocuk Değerlendirme Kalemleri (15-30 Kalem)

**Fiziksel Ölçümler:**
- Boy, kilo, kol uzunluğu, bacak uzunluğu, vücut tipi (ektomorf/mezomorf/endomorf)
- Anne-baba boyu, kardeş bilgileri (boy tahmini için)

**Performans Testleri:**
- Yükseğe zıplama, ileri zıplama
- Asılı kalma (kolların üzerinde bekleme süresi)
- Mekik testi
- Esneklik: öne uzanma (oturarak/ayakta), köprü hareketi (omuz eklemi açıklığı, kalça eklemi)
- Bacak açıklığı (spagat — sağ, sol, orta)
- Sürat ve çabukluk testleri

**Esneklik Detay:**
- Omuz eklemi açıklığı
- Kalça eklemi açıklığı
- Bacak açıklığı (sağ spagat, sol spagat, orta spagat)
- Köprü hareketi kalitesi

**Ortopedik Değerlendirme:**
- Düz taban tespiti
- İçe/dışa basma
- Çarpık bacak (X-O)
- Pelvis bozukluğu
- Skolyoz / Kifoz / Lordoz tahmini (ERKEN UYARI)
- Postür bozukluğu

**Mental ve Davranışsal (Sohbet Bazlı):**
- Uyuma saati
- Beslenme alışkanlığı
- Sosyal davranış
- Motivasyon seviyesi
- Disiplin ve çalışma isteği
- Hangi hareketleri seviyor (oyun tercihi)

### 5.3 Akıllı Antrenman Programı Üretimi (Agent Mantığı)

**Karar Ağacı:**
```
EĞER çocuk kuvvetli AMA esnek değil:
  → Akrobasi yönelik çalışmalar + esneklik geliştirme
  → Kuvvet antrenmanıyla çok yormama

EĞER çocuk esnek AMA kuvvetli değil:
  → Esnekliğe yönelik jimnastik hareketleri (çocuğun sevdiği)
  → Kuvvet eksikliği olan yönlerde güçlendirme çalışması

EĞER çocuk her ikisinde de iyi:
  → Teknik antrenman ağırlıklı, branş yönlendirme

EĞER çocuk her ikisinde de zayıf:
  → Temel motor beceri geliştirme, oyun bazlı antrenman
```

### 5.4 Anonim İstatistik ve Araştırma
- Tüm veriler tenant içinde görünür (franchise sahibi, antrenör).
- Patron tarafında anonim olarak toplanır: istatistik ve araştırma amaçlı.
- KVKK uyumlu: çocuk ham verisi açılmaz, sadece anonim istatistik.

---

## BÖLÜM 6: TENANT İŞLETME ROBOTLARI

### 6.1 Tenant'a Dağıtılan Robotlar

| Robot | Görevi | Sınırları |
|-------|--------|-----------|
| **Muhasebe Robotu** | Kasa defteri, ödeme takibi, aidat toplama, sabit ödemeler, gelir-gider | Sadece finansal işlemler. Prompt'u ile sınırlı. |
| **Sosyal Medya Robotu** | Paylaşım planı, şablon hazırlama, kampanya, fotoğraf isteme, içerik üretme | Sadece sosyal medya. Tesis müdüründen onay gerekli. |
| **Antrenör Robotu (Agent)** | Antrenman programı, ölçüm, branş yönlendirme, hareket havuzu yönetimi | Sportif alan. Ortopedik uyarıları Sportif Direktöre bildirir. |
| **Satış Robotu** | Ders programı reklamı, kampanya, oyun saatleri duyurusu, üye kazanma | Sadece satış ve pazarlama. |
| **İK Robotu** | Personel yönetimi, kullanıcı rolleri, belgeler, sözleşmeler | Sadece insan kaynakları. |
| **İletişim Robotu** | WhatsApp mesajları, bildirimler, veli iletişimi, randevu | Sadece iletişim. |

### 6.2 Robot Sınırlandırma Kuralları
- Her robot sadece kendi prompt'u ile çalışır.
- Verilen görev dışına çıkamaz.
- Kendi başına silme, değiştirme, yayınlama yapamaz.
- Agent (bot) olarak çalışır, AI değil — sınırlı karar yeteneği, belirli şablonlarla.

### 6.3 Tenant Onboarding Akışı
- Kullanıcı onboard → Üye/Sporcu onboard → Antrenör onboard → Çalışan onboard → İşletmeci onboard.
- Her adımda gerekli bilgiler alınır, roller atanır, paneller açılır.

---

## BÖLÜM 7: TOKEN EKONOMİSİ

### 7.1 Token Düşüş Mantığı
- Demo talep eden firma: paket seçer, robotlarını seçer, token miktarını belirler.
- İşlem bazlı token düşüşü: Her "tamamlanmış görev" bir token maliyeti taşır.
- Muhasebe Direktörlüğü (CFO) bu modeli yönetir.

### 7.2 Token Takip
- Her robotun kendi üzerinde token limiti ve tüketim hızı görünür.
- Patron panelinde: "Bu robot neden çok token harcıyor? İş var mı yok mu?" takibi.
- Limit aşımında sistem durur, patron bilgilendirilir.
- Güvenlik Robotu anomali tespiti yapar.

---

## BÖLÜM 8: İKİZ ROBOT (SİGORTA) SİSTEMİ

### 8.1 Amaç
- YİSA-S robotunun (ana sistemin) tam yedek kopyası.
- Firmalar (tenant'lar) burada olduğu için sistem çökemez.

### 8.2 Çalışma Prensibi
- İkiz, ana robotla paralel çalışır.
- Güncelleme gelmeden önce → mevcut durumun yedeğini alır → sonra günceller.
- Ana robot çökerse → ikiz otomatik devralır.

### 8.3 CEO Robotu ile İlişki
- CEO Robotu tenant yönetimini yapar.
- İkiz, CEO Robotunun sigorta katmanıdır.
- CEO çökerse → ikiz devralır, patron bilgilendirilir.

---

## BÖLÜM 9: ALTIN KURALLAR (GÜNCELLENMİŞ)

| No | Kural | Değiştirilebilir |
|----|-------|------------------|
| 1 | Robotlar kendi başına işlem yapamaz — patron onayı zorunlu | HAYIR |
| 2 | Güvenlik acil müdahale yetkisi — tek istisna | HAYIR |
| 3 | Veri izolasyonu (RLS) — her tenant izole | HAYIR |
| 4 | Claude her zaman denetçi | HAYIR |
| 5 | AI uzmanlık sınırlaması — prompt dışı iş yapılamaz | HAYIR |
| 6 | Token takibi zorunlu | HAYIR |
| 7 | Proje Masası geçicidir — iş bitince kapanır | HAYIR |
| 8 | Her iş ticketlıdır (iş kodu) | HAYIR |
| 9 | Asistan sadece patrona ait | HAYIR |
| 10 | Çocuk ham verisi açılmaz | HAYIR |
| 11 | Audit log silinmez | HAYIR |
| 12 | Görev çakışması kontrolü | HAYIR |

---

*Versiyon: 3.0 | Tarih: 5 Şubat 2026 | Durum: ONAY BEKLİYOR*
*Kurucu: Serdinç ALTAY*
