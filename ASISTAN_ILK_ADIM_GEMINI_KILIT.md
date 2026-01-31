# Asistan İlk Adım — Gemini Kilidi

**Patron:** Serdinç ALTAY  
**Tarih:** 30 Ocak 2026  
**Durum:** Kilitli — değiştirme.

---

## Kilitlenen kural

- **İlk adım (her Patron mesajında):** Mesajı alan ve "Bu mu demek istediniz?" + imla düzeltmesini yapan **Gemini** (önce) olacak; Gemini yoksa veya hata verirse yedek **GPT** kullanılır.
- **Tek ağız:** Panel açıldığında Patron ile konuşan ağız = Gemini (vizyon: PATRON_ASISTAN_VIZYON_SEMA.md Bölüm 1–2).
- **Kod:** `lib/ai/gpt-service.ts` — `correctSpelling()` önce Gemini dener, sonra GPT. `app/api/chat/flow/route.ts` — ilk adımda `spellingProvider` (GEMINI/GPT) döner. Dashboard ilk balonda bu sağlayıcıyı gösterir.

Bu kuralı değiştirmek için Patron onayı gerekir.

---

**Döküman sonu.**
