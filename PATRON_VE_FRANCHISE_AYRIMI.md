# Patron = Sadece Ben | Franchise = Firma Sahibi / Firma Yetkilisi

**Patron:** Serdinç ALTAY  
**Tarih:** 30 Ocak 2026  
**Kaynak:** Patron tarafından netleştirilen isimlendirme ve franchise/demo/fiyat mantığı.

---

## 1. PATRON TEK — SADECE BEN

- **Patron** sistemde **yalnızca Serdinç ALTAY** (YİSA-S sahibi).
- Franchise içindeki **firma sahipleri patron konumunda değildir**; **"Patron"** unvanı kullanılmaz.
- Onlar: **firma sahibi**, **firma yetkilisi** vb. adlarla anılır.
- Şablon/demo açılması, paket onayı vb. **benim (Patron) onayımla** yapılır: "Şu firmayla anlaştık, franchise sisteminde şablon/demo açılacak" diye onay veririm.

---

## 2. DEMO SÜRÜMÜ — Firma Yetkilisi Kendi Paketini Seçer

- **YİSA-S demo** kullanan **firma sahibi / firma yetkilisi** kişi, kendisi için bir **seçenek paketi** oluşturur:
  - Web tasarımı isterim
  - Logo isterim
  - Tesis işletim ve üretimini isterim
  - Sosyal medya desteği isterim
  - Panelimde şunlar şunlar olsun
  - Ekstra: Şubelerim var, şubelerde de görebileyim, oradan yöneteyim
  - vb. seçenekleri işaretler.
- Sistem **"bunu eklersen şu kadar artacak, bunu eklersen bu kadar artacak"** şeklinde **canlı fiyat** gösterir.
- En sonda **nihai fiyat** çıkar: "Ben bunları istiyorum" → toplam ücret netleşir.

---

## 3. FİYATLANDIRMA MANTIĞI

### 3.1 Öğrenci sayısına göre (sistem yükü)

- Öğrenci sayısı arttıkça **sistemdeki iş yükü** artar → fiyat kademelenir.
- Örnek kademeler:
  - 100 öğrenciye kadar → X
  - 150 öğrenciye kadar → Y
  - 200 öğrenciye kadar → Z
  - 250 öğrenciye kadar → W
  - 500 ve üzeri → ayrı kademe
- Bu kademeler **aylık/abonelik** tarafında uygulanır.

### 3.2 İkinci / ek şube

- **İkinci şube** (veya ek franchise birimi) için **aynı franchise giriş ücreti** tekrar alınır (örn. 1.500 $).
- Sonrasında **toplam öğrenci sayısı** (örn. iki şube toplam 500) üzerinden kademe uygulanır (500’den sonra şu kadar gibi).

### 3.3 Robot isteği (firma yetkilisi)

- Firma yetkilisi **"robot istiyorum"** derse:
  - Robot **token/harcama** yapacak; **ücret/limit** buna göre.
  - Sistem **sınırlandırarak** sunar: "Bu tür robotu istersen şu kadar ödemen gerekir; şu özelliklere sahip robot istersen bu robotun yapabilecekleri merkez beyinde sınırlı — şunları bu robota hazırlayabilirsin."
  - "Şunu mu istiyorsun → onu çıkarır; bunu mu istiyorsun → bunu çıkarır."
  - **Ne kadar çok kullanım (kelime/çalıştırma)** → o kadar **sistemdeki bütçe/limit azalır**.
  - **Limit aşımı:** "Bu ay limiti aştın; bu ay artık kullanamazsın; ekstra hak alabilirsin" — ekstra kotayı panelden seçip satın alabilir.
- Yani: Robot = aylık kullanım kotası; kota bitince ya ertesi aya kadar bekler ya da ek kota alır.

---

## 4. VELİ — Ekstra / Tam Kapsamlı Sistem

- **Veli**, franchise’ın aldığı özelliklerin **dışında** kendi çocukları (1 çocuk, 2 çocuk, 3 çocuk) için **ekstra özellik** veya **tam kapsamlı YİSA-S sistemi** talep edebilir.
- "Tam kapsamlı sistem istiyorum" dediğinde fiyat **kapsamına göre** (örn. 10’a çıkart mantığıyla) değişir.
- **Gelir dağılımı:**
  - **%20** → franchise (firma)
  - **%80** → doğrudan YİSA-S (Patron/sistem)
- Ne kadar çok talep (özellik, rapor, ölçüm vb.) → o kadar çok **API/değerlendirme** kullanımı → fiyatlandırma buna göre.

---

## 5. ÖZET TABLO

| Kavram | Anlamı |
|--------|--------|
| **Patron** | Sadece Serdinç ALTAY; tek. |
| **Firma sahibi / Firma yetkilisi** | Franchise’ı işleten kişi; "patron" değil. |
| **Demo** | Firma yetkilisi seçenekleri işaretler → "bunu eklersen şu kadar" → nihai fiyat. |
| **Öğrenci kademesi** | 100, 150, 200, 250, 500… → sistem yüküne göre fiyat. |
| **2. şube** | Aynı giriş ücreti (örn. 1.500 $); toplam öğrenciye göre kademe. |
| **Robot** | Aylık kota/limit; aşımda ek kota satın alınabilir. |
| **Veli ekstra** | %20 franchise, %80 YİSA-S; talep arttıkça API kullanımı artar. |

---

## 6. SİSTEMDE UYGULANACAK

- Tüm doküman ve kodda **"Patron"** yalnızca **Serdinç ALTAY** için kullanılır; franchise firma sahiplerine "patron" denmez.
- Rol/panel isimlendirmesinde franchise üst yetkili: **firma sahibi**, **firma yetkilisi** (veya ROL-1 Alt Admin vb. teknik kod) kullanılır.
- Demo paket oluşturucu, fiyat kademeleri (öğrenci, şube, robot kotası) ve veli %20/%80 dağılımı, ilgili modüllerde bu dokümana göre tanımlanır.

**Döküman sonu.**
