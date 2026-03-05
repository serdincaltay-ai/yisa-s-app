# Hangi Belge Ne İşe Yarıyor — Tek Referans Rehberi

> **Soru:** "Şu an ne aşamadayız, site baştan sona tam çalışsın diye ne yapacağım? Final iş haritası mı, zorunluluklar mı, iş akışı mı kullanacağım?"

---

## Kısa cevap

| Ne yapacağım? | Hangi belge? |
|---------------|----------------|
| **"Şunu yap, sonra şunu yap" — komut / checklist** | **YISA-S-FINAL-IS-HARITASI.md** |
| "Şu an hangi aşamadayız?" | YISA-S-IS-AKISI-VE-ASAMALAR.md (referans) |
| "Sistemde neler zorunlu, mimari ne?" | YISA-S-TUM-PROJELER-SEMA-VE-ZORUNLULUKLAR.md (referans) |

**İlerleme ve yapılacak işler için tek kaynak = YISA-S-FINAL-IS-HARITASI.md.** Komutları / adımları oradan alacaksınız.

---

## Şu an hangi aşamadayız?

- **İş akışı (A→B→C→D→E):** Tamamlandı. Kurulum, birleştirme, final harita, eksiklik tespiti ve teslim raporla bitti.
- **Site "baştan sona tam çalışsın" için:** Haritada kalan maddeler var; bunları **YISA-S-FINAL-IS-HARITASI.md** içindeki tabloya göre yapacaksınız.

Yani aşama olarak "E. Teslim bitti"; sıradaki iş "haritadaki kalan görevler".

---

## Üç belgenin rolü

| Belge | Ne işe yarıyor? | Ne zaman bakacaksın? |
|-------|------------------|----------------------|
| **YISA-S-FINAL-IS-HARITASI.md** | Yapılacak işlerin listesi (görev, nerede, öncelik). **Komut / checklist buradan.** | "Ne yapmam lazım?" dediğinde — Bölüm 1 (tablo) ve Bölüm 3 (eksiklik listesi). |
| **YISA-S-IS-AKISI-VE-ASAMALAR.md** | A→B→C→D→E aşamaları, "bitir değmeleri", akış diyagramı. | "Hangi aşamadayız?" veya "Akış nerede bitti?" diye merak ettiğinde. |
| **YISA-S-TUM-PROJELER-SEMA-VE-ZORUNLULUKLAR.md** | Proje şeması, zorunluluklar, domain/repo yapısı. | "Bu özellik zorunlu mu?", "app.yisa-s.com nereye deploy?" gibi şema sorusu olduğunda. |

---

## Site tam çalışsın diye sıradaki işler (Final Harita’dan)

Bunları **YISA-S-FINAL-IS-HARITASI.md** Bölüm 1 ve 3’ten takip et; komut/adım orada.

1. **.env.local** — Üç repoda (app-yisa-s, tenant-yisa-s, yisa-s-com) Supabase URL + anon key + gerekirse service role key doldur. (.env.example referans.)
2. **BJK logosu** — `tenant-yisa-s/public/tenants/bjktuzlacimnastik/logo.png` dosyasını ekle.
3. **Veri kontrolü** — Supabase’de BJK tenant’a ait öğrenci/ödeme/yoklama var mı kontrol et; yoksa migration veya seed (harita #2–3).
4. **Deploy / canlı test** — app.yisa-s.com, bjktuzlacimnastik.yisa-s.com, yisa-s.com’u deploy edip tarayıcıdan dene.

İsteğe bağlı: app-yisa-s `package.json` name (harita #5), .env.example eksik değişken (harita #6).

---

## Özet

- **Şu an:** E aşaması bitti; harita tarafı "teslim" edildi. Site tam çalışması için kalan işler Final Harita’da.
- **Komut / ne yapacağım:** **YISA-S-FINAL-IS-HARITASI.md** kullan.
- **Aşama / akış:** YISA-S-IS-AKISI-VE-ASAMALAR.md.
- **Zorunluluk / şema:** YISA-S-TUM-PROJELER-SEMA-VE-ZORUNLULUKLAR.md.

Bu raporun dışına çıkılmayacak; ilerleme Final Harita’ya göre.
