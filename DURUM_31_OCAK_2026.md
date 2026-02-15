# YİSA-S Patron Paneli — Mevcut Durum (31 Ocak 2026)

Bu belge: Depodaki son durum, ne çalışıyor / ne çalışmıyor, bilgisayardan veya telefondan (PVA/web) nasıl devam edileceği.

---

## 1. Projeyi Çalıştırma

**Bilgisayarda (PowerShell / CMD):**

```powershell
cd C:\Users\info\Downloads\serdincaltay-ai-yisa-s-app
npm install
npm run dev
```

Tarayıcıda: **http://localhost:3000**  
Giriş: Supabase Auth (e-posta/şifre). `.env.local` içinde `NEXT_PUBLIC_SUPABASE_URL` ve `SUPABASE_SERVICE_ROLE_KEY` (veya anon key) gerekli.

**Telefondan kullanım:**  
- Adım adım anlatım için **`TELEFONDAN_KULLANIM.md`** dosyasına bakın. Özet: Bilgisayarda `npm run dev:phone` çalıştırın, `ipconfig` ile IP’yi alın, telefondaki tarayıcıda `http://IP:3000` yazın (aynı WiFi gerekir).  
- İnternete (Vercel vb.) yüklerseniz linki telefondan her yerden açabilirsiniz.

**PVA / Web üzerinden devam:**  
- Bu belgeyi ve `KURULUM_ADIMLARI.md` / `TELEFONDAN_KULLANIM.md` dosyalarını referans vererek “projeyi çalıştır, sorunları şu listeden kontrol et” talimatı verebilirsiniz.

---

## 2. Şu An Çalışanlar

| Özellik | Durum |
|--------|--------|
| Giriş sayfası (metalik lacivert tema) | ✅ |
| Dashboard (futuristik tema, saat, arama) | ✅ |
| Sidebar: Ana Sayfa, Direktörler, Franchise/Vitrin, Kasa, Şablonlar, Raporlar, Ayarlar | ✅ |
| Sidebar’da Sistem Özeti (öğrenci, onay bekleyen, başvuru, franchise sayıları) | ✅ |
| Onay Kuyruğu (dashboard’da chat yanında; bekleyen / onayla / reddet / iptal) | ✅ |
| Onaylanan İşler Havuzu (liste + “Tıkla içeriği aç”) | ✅ |
| Takvim (7–22 saat, önceki/sonraki gün) | ✅ |
| Direktörler (Canlı) sayfası (bugünkü iş sayıları) | ✅ |
| API: `/api/chat/flow`, `/api/approvals`, `/api/stats`, `/api/directors/status` | ✅ |

---

## 3. Bilinen Sorunlar (Öncelikli Çözülecekler)

### 3.1 Asistan (CIPS) ile konuşamıyorum / cevap gelmiyor

- **Sebep:** Akış ilk adımda “Bu mu demek istediniz?” (imla düzeltme) sonrası **Şirket İşi** veya **Özel İş** seçilmeden devam etmiyor.  
- **Ne yapılmalı:** Mesaj yazdıktan sonra çıkan metinde **“Evet, Şirket İşi”** veya **“Evet, Özel İş”** butonuna tıklanmalı.  
- **Geliştirme tarafı:** İleride isteğe bağlı “imla adımını atla” veya varsayılan Şirket İşi ile tek tıkla devam seçeneği eklenebilir.

### 3.2 Onaylanan işte “(Bu işte kayıtlı içerik yok)”

- **Sebep:** Bazı onaylanan işlerin `patron_commands.output_payload` içinde `displayText` (veya eşdeğer alan) yok veya boş kaydedilmiş.  
- **Ne yapılmalı:** Yeni işlerde CELF çıktısı `output_payload.displayText` olarak mutlaka yazılmalı. Eski kayıtlar için veri düzeltmesi veya “içerik yok” mesajı ile bırakılabilir.

### 3.3 Beyaz sayfa

- **Sebep:** `DashboardSidebar.tsx` içinde `||` ve `??` karışımı derleme hatası veriyordu.  
- **Durum:** Parantez ile düzeltildi; build alındığında sayfa açılmalı. Hâlâ beyaz sayfa görürseniz tarayıcı konsolunda (F12) hata mesajına bakın.

---

## 4. Sonraki Adımlar (Sırayla)

1. **Asistanı konuşur hale getirmek:** İmla adımından sonra Şirket/Özel seçimini netleştirmek veya atlamak; hata durumunda kullanıcıya net mesaj.  
2. **CELF’i çalıştırmak:** Asistan cevap verdikten sonra CEO → CELF akışının gerçek API’lerle (GPT/Claude/Gemini key’leri) test edilmesi.  
3. **Onaylanan işlerde içerik:** Yeni patron komutlarında `displayText`’in her zaman yazıldığından emin olmak.  
4. **Vitrin / şablonlar / raporlar:** İçerik ve sayfa doldurulması (şu an iskelet var).

---

## 5. Depo ve Commit

- Proje klasörü **git repo** olarak hazır; tüm değişiklikler tek commit ile kayıtlı.  
- GitHub’a push için: `git remote add origin <repo-url>` (yoksa), sonra `git push -u origin main`.

---

*Son güncelleme: 31 Ocak 2026 — Commit’ler hazır; asistan/CELF ve içerik sorunları bu belgede özetlendi.*
