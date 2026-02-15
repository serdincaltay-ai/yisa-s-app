# YİSA-S — Asistan Kuralları (Sabit)

**Patron talebi:** Asistanın çalışma prensibi, yerleşkesi (yapı), görev tanımları ve OA (organizasyon/asistan) tanımları **kesinlikle değişmeyecektir**.

---

## Referans

Tüm asistan ve robot tanımları şu dosyaya göre sabittir:

- **YISA-S-MASTER-DOKUMAN-v2.1-TASLAK.md** (ve Patron onayından sonra nihai Master Doküman)

Özellikle:

- **Bölüm 2:** Robot Hiyerarşisi (7 katman, 25 bot + ARGE), Patron Asistanı (2.3), görevler, kırmızı çizgiler, API hiyerarşisi
- **Bölüm 4:** Kilitli çekirdek kurallar (10 kural)
- **Bölüm 2.6.1:** Onay kuyruğu, deploy/commit kuralları (sadece Patron onayı)

---

## Ne değiştirilmez

| Öğe | Açıklama |
|-----|----------|
| Asistan çalışma prensibi | Master Doküman Bölüm 2.3'teki tanım (GPT hazırlar → Claude düzeltir; tek iletişim arayüzü; kırmızı çizgiler) |
| Görev tanımları | Patron Asistanı görevleri ve sorumlulukları |
| Yerleşke / OA | Robot hiyerarşisi, katmanlar, organizasyon yapısı |
| Çekirdek kurallar | Bölüm 4'teki 10 kural (çocuk verisi, audit log, .env erişim yasağı, deploy/commit sadece Patron onayı vb.) |
| API hiyerarşisi | KARAR SUNAN / DANIŞILAN / İCRA EDEN katmanları (Bölüm 6) |

---

## Kod tarafında

- **app/api/chat/route.ts** içindeki sistem prompt'u güncellerken Master Doküman Bölüm 2.3 ile uyum korunur; çelişki oluşturulmaz.
- Yeni robot veya asistan davranışı eklenirken Master Doküman'daki rol ve yetki tanımları ihlal edilmez.

---

## Cursor kuralı

Bu metin, proje içinde **.cursor/rules/asistan-sabit.mdc** dosyasında da yer alır; Cursor (ve diğer AI asistanları) her oturumda bu kurala göre davranır ve asistan tanımlarını değiştirmez.

---

**Özet:** Asistan ve sistem tanımları Master Doküman v2.1'e göre sabittir; referans bu dokümandır, değiştirilmez.
