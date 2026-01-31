# YİSA-S — Asistan Çalışma Prensibi Sistemde Nasıl?

**Patron:** Serdinç ALTAY  
**Tarih:** 30 Ocak 2026

---

## 1. Sistemde nerede tanımlı?

Asistan çalışma prensibi **üç yerde** sabitlenmiş; hepsi birbiriyle uyumlu:

| # | Yer | Dosya | Ne söylüyor |
|---|-----|--------|-------------|
| 1 | **Cursor kuralları** | `.cursor/rules/asistan-sabit.mdc` | Asistan/robot tanımları ve çekirdek kurallar Master Doküman’a göre sabittir; değiştirilmez. |
| 2 | **Cursor kuralları** | `.cursor/rules/adim-adim-onay.mdc` | Adım adım ilerle; her adımda onay al; onaydan sonra **tek komut** uygula; zincir komut verme. |
| 3 | **Onay özeti** | `YISA-S_ONAY_OZETI.md` (proje dışı: `C:\Users\info\`) | Kapsamlı doküman onaylı; “asistan çalışma prensibi” metni burada da yazılı. |

**Hangisi “asıl” sayılır?**  
- **Ne yapılır / ne yapılmaz (yetki, çekirdek kurallar):** `asistan-sabit.mdc` + Master Doküman v2.1.  
- **Nasıl ilerlenir (adım → onay → tek komut):** `adim-adim-onay.mdc`.  
İkisi birlikte = “asistan çalışma prensibi” sistemde.

---

## 2. Sistemde nasıl uygulanıyor?

1. **Cursor’da:**  
   Her iki kural da `alwaysApply: true`. Cursor (bu IDE’deki asistan) projeyi açtığında bu kuralları okur; adım adım onay, tek komut kuralına göre davranır; asistan/robot tanımlarını ve çekirdek kuralları değiştirmez.

2. **Panel / Patron Asistanı (app.yisa-s.com):**  
   Akış `app/api/chat/flow/route.ts` ve ilgili servislerde. İş akışı (imla → onay sorusu → Şirket/Özel → CEO → CELF → Patron kararı) Kapsamlı Dokümantasyon Bölüm 5 ile uyumlu olacak şekilde kodda uygulanır. “Adım adım, onay, tek komut” prensibi **operasyonel olarak** Patron’un her mesajda tek işe odaklanması ve onay vermesiyle sağlanır.

3. **Tüm asistanlar için tek liste:**  
   Aynı prensibin **10 maddelik** hali `ASISTAN_CALISMA_PRENSIBI_10_MADDE.md` dosyasında toplandı. Cursor, Claude, panel asistanı veya başka bir arayüz — hangi asistan olursa olsun **bu 10 maddeyle birlikte başlar**.

---

## 3. Özet

- **Sistemde:** Çalışma prensibi `.cursor/rules` (asistan-sabit + adim-adim-onay) ve onay özeti ile tanımlı.
- **Uygulama:** Cursor bu kuralları otomatik uygular; panel tarafı akış kodu ve Patron’un tek adım / onay kullanımı ile uyumlu.
- **Ortak başlangıç:** Tüm asistanlar için tek referans = **10 maddelik liste** (`ASISTAN_CALISMA_PRENSIBI_10_MADDE.md`).

Doğru ve güncel olan: **asistan-sabit.mdc + adim-adim-onay.mdc + 10 madde**. Hepsi birlikte “asistan çalışma prensibi”dir.
