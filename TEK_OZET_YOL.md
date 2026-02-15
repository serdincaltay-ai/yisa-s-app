# YİSA-S — Tek Özet Yol (Sohbet Kilidi Sonrası)

**Patron:** Serdinç ALTAY  
**Tarih:** 30 Ocak 2026  
**Kapsam:** "İlk adım Gemini, tek ağız" kilidi sonrası yapılanlar + sizin yapmanız gerekenler + çalışmazsa neden.

---

## 1. Bu sohbette ne kuruldu (kilitli ayarlar)

| Konu | Durum | Nerede |
|------|--------|--------|
| **İlk adım = Gemini** | Kilitli | `ASISTAN_ILK_ADIM_GEMINI_KILIT.md` — Her Patron mesajında önce Gemini imla düzeltir; "Bu mu demek istediniz?" + [Şirket İşi] [Özel İş] [Hayır Düzelt]. Gemini yoksa yedek GPT. |
| **Tek ağız** | Panelde konuşan ağız = Gemini (vizyon) | `PATRON_ASISTAN_VIZYON_SEMA.md` |
| **API anahtarları** | Tek set; hem Asistan hem CELF aynı anahtarları kullanır | `.env.local` — GOOGLE_API_KEY, OPENAI_API_KEY, ANTHROPIC_API_KEY, TOGETHER_API_KEY |
| **.env dosyası** | Tam set oluşturuldu | `.env.local` (Supabase, AI, Cursor, V0, GitHub, Vercel, Railway, SITE_URL) |
| **.env örneği** | Sadeleştirildi | `.env.example` — tek set, ayrı ASISTAN_* / CELF_* yok |

---

## 2. Tek SQL dosyasında değişiklik var mı?

**Hayır.** Kilitli tek SQL dosyası aynen kalır.

- **Dosya:** `supabase/YISA-S_TUM_TABLOLAR_TEK_SQL.sql`
- **Sebep:** "İlk adım Gemini" ve API anahtarları **uygulama kodunda** (gpt-service, celf-execute, chat/flow); veritabanı şemasında değişiklik gerektirmez.
- **Ne yapar:** Tüm tablolar, RLS, view’lar, role_permissions, celf_cost_reports, patron_sales_prices, coo_rules tek script ile oluşturulur.

---

## 3. Sizin yapmanız gerekenler (tek yol)

1. **Veritabanı (bir kez)**  
   Supabase Dashboard → SQL Editor → `YISA-S_TUM_TABLOLAR_TEK_SQL.sql` dosyasının **tamamını** yapıştır → Run.  
   (Tablolar zaten varsa script idempotent; tekrar çalıştırabilirsiniz.)

2. **Ortam**  
   `.env.local` zaten oluşturuldu; anahtarlarınız yüklü. Değişiklik yaptıysanız **npm run dev** ile sunucuyu yeniden başlatın.

3. **Çalışıp çalışmadığını kontrol**  
   Tarayıcıda: `https://localhost:3000/api/health` (veya sitenizin URL’i + `/api/health`).  
   Bu endpoint hangi env’lerin dolu olduğunu, Supabase’e erişimi ve özet durumu döner; çalışmıyorsa **neden** orada yazar.

4. **Akış testi**  
   Dashboard’da Patron sohbetine mesaj yazın → İlk adımda "Bu mu demek istediniz?" + imla düzeltmesi gelmeli (sağlayıcı: Gemini veya GPT).  
   Şirket işi seçince CEO → CELF → Patron onayı akışı çalışmalı.

---

## 4. Çalışmazsa neden? (Sistem kendini söyler)

Uygulama **neden çalışmadığını** sizin dışınızda, kendi mekanizmasıyla raporlar:

- **`GET /api/health`**  
  - Hangi env değişkenlerinin **tanımlı** olduğu (anahtar değeri değil, sadece “var/yok”).  
  - Supabase’e bağlanıp bağlanamadığı.  
  - Özet: `ok: true/false`, `reason` (ör. "GOOGLE_API_KEY yok", "Supabase bağlantı hatası").

Buna göre:

| Sorun | Olası neden | Ne yapılır |
|-------|-------------|------------|
| İmla adımı gelmiyor / hata | GOOGLE_API_KEY yok veya geçersiz | .env.local’de GOOGLE_API_KEY kontrolü; health’ta env durumuna bakın. |
| "Yanıt oluşturulamadı" (CELF) | CELF tarafı API anahtarı yok (kod GOOGLE_API_KEY’e düşer) | Aynı .env.local’de GOOGLE_API_KEY, OPENAI_API_KEY vb. tanımlı olsun. |
| Chat / DB yazmıyor | Supabase bağlantı veya service role | Health’ta supabase: false ise NEXT_PUBLIC_SUPABASE_* ve SUPABASE_SERVICE_ROLE_KEY kontrolü. |
| 500 / Flow hatası | Eksik tablo veya RLS | Tek SQL’i Supabase’de çalıştırdığınızdan emin olun; gerekirse tekrar Run. |

Yani **robot/ sistem**, “çalışmıyor” dediğinizde, sizden bağımsız olarak `/api/health` çıktısıyla "neden çalışmadığı"nı (env eksik, Supabase yok, vb.) gösterecek şekilde ayarlandı.

---

## 5. Kısa referans

- **İlk adım kilidi:** `ASISTAN_ILK_ADIM_GEMINI_KILIT.md`
- **Env + Tek SQL:** `ENV_VE_TEK_SQL.md`
- **Tek SQL dosyası:** `supabase/YISA-S_TUM_TABLOLAR_TEK_SQL.sql` (bu sohbette **değiştirilmedi**, kilitli)
- **Durum kontrolü:** `GET /api/health` — çalışmıyorsa önce buna bakın.

---

**Döküman sonu.**
