# YİSA-S — Asistan Çalışma Prensibi (Çıkart)

**Patron:** Serdinç ALTAY  
**Tarih:** 30 Ocak 2026  
**Amaç:** Sistemde şu an yüklü olan asistan çalışma prensibini ve kılavuzun kilitlediği maddeleri **olduğu gibi çıkartmak**. Sonrasında hangisi uygunsa ona göre kurulup ilerlenecek.

---

# BÖLÜM A — MEVCUT SİSTEMDE YÜKLÜ OLAN

Aşağıdaki metin, projede **şu an yüklü** olan iki Cursor kuralının aynen çıkartılmış halidir. Başka bir yorum veya ekleme yok.

---

## A.1 Dosya: `.cursor/rules/asistan-sabit.mdc`

```
---
description: Asistan ve sistem tanımları sabittir; Master Doküman v2.1 referans alınır, değiştirilmez.
alwaysApply: true
---

# YİSA-S — Asistan ve Sistem Tanımları Sabittir

## Kural (Patron talebi)

**Asistanın çalışma prensibi, yerleşkesi (yapı), görev tanımları ve OA (organizasyon/asistan) tanımları değiştirilmeyecektir.**

- Tüm asistan ve robot tanımları **YISA-S-MASTER-DOKUMAN-v2.1-TASLAK.md** (ve onaylanmış nihai Master Doküman) dosyasına göre sabittir.
- Bu dosyadaki Bölüm 2 (Robot Hiyerarşisi), Patron Asistanı görevleri, API hiyerarşisi, kırmızı çizgiler ve çekirdek kurallar **referans alınır**; kod veya doküman güncellenirken bu tanımlarla uyum korunur.
- Patron Asistanı sistem prompt'u veya davranışı değiştirilirken Master Doküman Bölüm 2.3 (Patron Asistanı Robotu) ile uyum kontrol edilir; çelişki oluşturulmaz.
- Çekirdek kurallar (Bölüm 4), deploy/commit kuralları (sadece Patron onayı), .env/API key erişim yasağı **değiştirilmez**.

## Ne yapılır

- Yeni özellik veya kod eklerken Master Doküman'daki rol, yetki ve hiyerarşi tanımları ihlal edilmez.
- `/api/chat` veya asistan davranışı güncellenirken Bölüm 2.3 (görevler, kırmızı çizgiler, API hiyerarşisi) referans alınır.
- Belirsizlik durumunda **Master Doküman v2.1** karar verici referanstır.

## Ne yapılmaz

- Asistan çalışma prensibini, görev tanımlarını veya yerleşkeyi (OA/robot yapısı) Master Doküman dışında yeniden tanımlamak.
- Patron Asistanı sistem prompt'unu Master Doküman ile çelişecek şekilde değiştirmek.
- Çekirdek kuralları veya deploy/commit/API key kurallarını gevşetmek veya kaldırmak.
```

---

## A.2 Dosya: `.cursor/rules/adim-adim-onay.mdc`

```
---
description: YİSA-S asistan adım adım ilerler; her adımda onay alınır, onaydan sonra tek komut uygulanır.
alwaysApply: true
---

# YİSA-S — Adım Adım Onay, Son Komut Tek

## Kural (Patron talebi)

**Asistan, tek seferde uzun komut zinciri veya karışık bağlam vermez. Her adım net sunulur, Patron onayı alınır, onaydan sonra yalnızca o adım için tek bir net komut uygulanır.**

- Bu sayede bağlam karışmaz, Claude doğru odakta kalır.

## Nasıl çalışır

1. **Tek adım sun:** Şu anki iş için yalnızca bir adım (veya tek bir net iş paketi) sun.
2. **Onay bekle:** Patron "onayla", "evet", "tamam" vb. demeden bir sonraki adımı uygulama veya uzun komut verme.
3. **Onaydan sonra tek komut:** Patron onayladıktan sonra, **sadece o adımı** uygulayan tek bir net komut/talimat ver veya uygula. Uzun liste veya "şimdi şunu da yap, sonra bunu da" zinciri kurma.
4. **Sonraki adım ayrı tur:** Bir sonraki adım için yeni bir mesajda yine tek adım sun, onay al, sonra tek komut.

## Ne yapılır

- İşi şema / adım listesi olarak böl; her turda tek adım göster.
- Patron onayından sonra yalnızca o adıma ait işi yap veya tek cümlelik komut ver.
- Cevap kısa ve net olsun; gereksiz uzun açıklama veya çoklu komut verme.

## Ne yapılmaz

- Aynı mesajda "önce şunu yap, sonra bunu yap, ardından şuraya git" gibi zincir komut vermek.
- Onay almadan bir sonraki adımı uygulamak veya uzun komut yazmak.
- Çok uzun, karışık bağlamlı tek blok halinde talimat vermek (Claude karışmasın diye).
```

---

# BÖLÜM B — KILAVUZUN KİLİTLEDİĞİ

Kılavuz = **YISA-S-MASTER-DOKUMAN-v2.1-TASLAK.md** (ve Kapsamlı Sistem Dokümantasyonu). Aşağıda bu kılavuzda **asistan / Patron Asistanı / çekirdek kurallar** ile ilgili kilitlenen maddeler çıkartılmıştır.

---

## B.1 Master Doküman — Bölüm 2 (Robot Hiyerarşisi)

- **Patron Asistanı** (Katman 1): Tanımlar Master Doküman **Bölüm 2.3**’e göre sabittir.
- Asistan davranışı veya sistem prompt’u değiştirilirken **Bölüm 2.3 (Patron Asistanı Robotu)** ile uyum kontrol edilir; çelişki oluşturulmaz.
- Robot hiyerarşisi, API hiyerarşisi, kırmızı çizgiler bu bölüme göre referans alınır.

---

## B.2 Master Doküman — Bölüm 4 (Kilitli Çekirdek Kurallar)

**4.1 — 7 Kilitli Çekirdek Kural:** (Master’da “Aynı” deniyor; metin başka yerde tanımlı.) Değiştirilmez.

**4.2 — 10 Asla Geçilemez Kural (kılavuzda kilitlenen):**

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

## B.3 Kılavuzda sabitlenen asistan ile ilgili özet

- Asistan çalışma prensibi, yerleşke, görev tanımları **Master Doküman dışında** yeniden tanımlanmaz.
- Çekirdek kurallar (Bölüm 4), deploy/commit kuralları (sadece Patron onayı), .env/API key erişim yasağı **değiştirilmez**.
- Belirsizlikte **Master Doküman v2.1** karar verici referanstır.

---

# ÖZET

| Nerede | Ne çıkartıldı |
|--------|----------------|
| **A** | Mevcut sistemde yüklü: iki Cursor kuralı (asistan-sabit + adim-adim-onay) — aynen. |
| **B** | Kılavuzun kilitlediği: Bölüm 2 (Patron Asistanı, Bölüm 2.3), Bölüm 4 (7 çekirdek + 10 asla geçilemez), deploy/commit ve .env yasağı. |

Sonrasında **10 (bitirme komutları veya asla geçilemez kurallar)** ile karşılaştırılıp hangisi uygunsa ona göre kurulup ilerlenebilir.

**Döküman sonu — sadece çıkart.**
