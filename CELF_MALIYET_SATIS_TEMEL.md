# CELF Maliyet Raporları + Patron Satış Fiyatı — Temel

**Patron:** Serdinç ALTAY  
**Tarih:** 30 Ocak 2026  

---

## 1. Netleştirme

- **CELF** (özellikle CFO direktörlüğü) **maliyet raporları** üretir: Bu iş/paket/kademe için maliyetimiz şu (API, altyapı, operasyon, toplam).
- Raporlar **Patron’a** sunulur; Patron **maliyeti** görür.
- **Patron**, bu maliyete göre **satış fiyatını** kendisi belirler (demo paket, öğrenci kademesi, robot, veli ekstra vb. için).
- Temel: **Maliyet CELF’ten → Satış fiyatı Patron’dan.**

---

## 2. Öneri (Akış)

| Adım | Yapan | Ne yapılır |
|------|--------|------------|
| 1 | **CELF (CFO)** | İş/paket/kademe için maliyet hesaplar (API + altyapı + operasyon); rapor oluşturur, `celf_cost_reports` tablosuna yazar. |
| 2 | **Patron paneli** | Maliyet raporları listelenir; "Bu iş için maliyet: X TL/USD" gösterilir. |
| 3 | **Patron** | İlgili kalem için "Satış fiyatı belirle" der; `patron_sales_prices` tablosuna satış fiyatı yazılır (Patron onayı ile). |
| 4 | **Demo / franchise** | Firma yetkilisi paket seçerken veya sistem fiyat gösterirken `patron_sales_prices` kullanılır; maliyet raporu referans olarak tutulabilir. |

- **Maliyet raporu** = CELF (CFO) üretir, Patron okur.  
- **Satış fiyatı** = Patron belirler; güncelleme sadece Patron onayı ile.

---

## 3. Teknik temel

- **Tablo 1:** `celf_cost_reports` — Maliyet raporları (rapor tipi, dönem, maliyet dağılımı, direktörlük). CELF/CFO yazar.
- **Tablo 2:** `patron_sales_prices` — Satış fiyatları (ürün/kalem kodu, gösterim adı, satış fiyatı, para birimi, geçerlilik). Patron belirler; API PATCH ile güncelleme (Patron yetkisi kontrolü).
- **API:** `GET/POST /api/cost-reports` (liste + CELF rapor ekleme), `GET/PATCH /api/sales-prices` (liste + Patron satış fiyatı güncelleme).
- **Referans:** PATRON_VE_FRANCHISE_AYRIMI.md (demo, öğrenci kademesi, robot, veli); Master Doküman Bölüm 1 (fiyatlandırma formülü).

---

## 4. CELF robotuna maliyet raporu yaptırma

- **Patron/CEO:** Sohbet akışında "maliyet raporu", "finans", "bütçe", "maliyet" gibi ifadeler kullanın → sistem **CFO** direktörlüğüne yönlendirir; CELF (GPT/Gemini) maliyet analizi üretir.
- **Raporu kalıcı kaydetmek:** CELF metin sonucu döndükten sonra, raporu veritabanına yazmak için:
  - **Seçenek A:** Asistan ile "Bu sonucu maliyet raporu olarak kaydet" deyip gerekli alanları (report_type, description, product_key, cost_breakdown) verin; Asistan `POST /api/cost-reports` çağırır.
  - **Seçenek B:** Doğrudan `POST /api/cost-reports` ile body gönderin (report_type, description, cost_breakdown zorunlu).
- **Satış fiyatı:** Patron maliyet raporunu gördükten sonra `PATCH /api/sales-prices` ile ilgili product_key için satış fiyatı belirler.

---

**Döküman sonu.**
