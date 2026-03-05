# YİSA-S — İçerik Çekme Listesi (Dağınık → Çekirdek 3)

> **Amaç:** Yanlışlıkla başka projelerde kalan, sizin hazırladığınız içerikleri ve veriyi doğru yere (franchise/tesis sayfası, bjktuzlacimnastik.yisa-s.com) almak.

---

## 1. Veri (137 öğrenci, ödeme, yoklama)

Bu veriler **Mobil Sporcu** veya başka kaynaktan çekildiyse:

- **Nerede olmalı:** Supabase — `tenants`, `athletes` / `students`, `payments`, `attendance` / `student_attendance` tabloları; **tenant_id** = BJK Tuzla franchise’ına ait.
- **Nerede görünecek:** **bjktuzlacimnastik.yisa-s.com** (tenant-yisa-s franchise tesis sayfası): veli/antrenor/tesis müdürü panellerinde öğrenci listesi, ödeme kayıtları, yoklama.

**Yapılacak:** Veri zaten Supabase’deyse, tenant-yisa-s’teki mevcut sayfalar (`/panel/ogrenciler`, `/panel/odemeler`, `/panel/yoklama`, `/veli/*`) bu tablolara bağlı; sadece **tesis vitrin sayfası** ve **görsel içerik** (BJK logosu, Tuzla Cimnastik metinleri, ödeme/performans panelleri) dağınık projeden alınacak.

---

## 2. v0-web-page-content-edit-bjktesis → tenant-yisa-s (BJK Tuzla / tesis sayfası)

Aşağıdakiler **bjktesis** projesinde hazır; **tenant-yisa-s** içine alınacak ki **bjktuzlacimnastik.yisa-s.com** tesis sayfasında kullanılabilsin.

### 2.1 Çekilecek bileşenler (components)

| Kaynak dosya | Hedef (tenant-yisa-s) | Not |
|--------------|------------------------|-----|
| `components/payment-iban-panel.tsx` | `components/franchise/PaymentIBANPanel.tsx` | ✅ **Çekildi.** Paket + IBAN; prop ile `ibanInfo`, `packages`, `whatsappNumber` verilebilir (tenant’a göre). |
| `components/child-performance-panel.tsx` | `components/franchise/ChildPerformancePanel.tsx` | ✅ **Çekildi.** Tablo ile performans özeti; `childId` prop’u var, ileride API bağlanacak. (Recharts isteğe bağlı eklenebilir.) |
| `components/ui/button.tsx`, `card.tsx`, `input.tsx`, `label.tsx`, `select.tsx` | Zaten tenant-yisa-s’te ui var; sadece bjktesis’e özel stil gerekirse kopyala | Gerekirse. |

### 2.2 Çekilecek sayfa / layout içeriği

| Kaynak | Hedef | Açıklama |
|--------|--------|----------|
| `app/page.tsx` (bjktesis ana sayfa) | tenant-yisa-s’te **franchise tesis ana sayfa** şablonu | BJK logosu, “Tuzla Cimnastik Okulu”, iletişim, konum, paket/ödeme alanı. Subdomain’e göre (bjktuzlacimnastik) bu tasarım kullanılacak. |
| `app/dashboard/page.tsx` | Referans | Tesis dashboard; tenant-yisa-s’te zaten `/franchise`, `/panel` var; gerekli bloklar buradan uyarlanabilir. |
| `app/auth/login/page.tsx` (BJK branding) | Referans | Giriş sayfası logo + “BJK Tuzla Jimnastik” metni; tenant-yisa-s auth’a tenant’a özel logo/title eklenebilir. |

### 2.3 Çekilecek statik/görsel

| Kaynak | Hedef | Açıklama |
|--------|--------|----------|
| `public/images/bjk-so-20-20logo-20-28siyah-20zemin-29.png` veya `bjk-tuzla-logo.png` | tenant-yisa-s `public/` veya tenant’a özel asset klasörü | BJK Tuzla logosu; sadece bu franchise için kullanılacaksa tenant’a özel path (örn. `public/tenants/bjktuzlacimnastik/logo.png`). |
| `app/layout.tsx` metadata (title: "BJK Tuzla Cimnastik", description) | tenant-yisa-s’te subdomain’e göre metadata | Subdomain bjktuzlacimnastik iken title/description bu olacak. |

### 2.4 Doküman (referans)

| Kaynak | Kullanım |
|--------|----------|
| `BJK_TUZLA_CIMNASTIK_KAPSAMLI_PROJE_DOKUMANTASYONU.md` | tenant-yisa-s `docs/` veya kök: BJK Tuzla kapsamı ve hedefler referansı. |

---

## 3. Diğer projelerden çekilebilecekler (kısa)

| Kaynak | Ne çekilebilir | Nereye |
|--------|----------------|--------|
| **v0-3-d-landing-page** | Slide içerikleri (Hero, Features, Branches, Directorates, AI Router, System Status, CTA) | app-yisa-s veya yisa-s-com sunum/vitrin sayfası; görsel şablon olarak. |
| **yisa-s-app-uh** | Patron/franchise/veli/antrenor/tesis sayfa iskeletleri, CELF dokümanları | tenant-yisa-s; eksik sayfalar veya doküman referansı. |
| **v0-social-media-ai-assistant** | Lead/CRM admin sayfaları (leads, messages, catalog) | yisa-s-com panel veya tenant-yisa-s; ManyChat entegrasyonu ile. |

---

## 4. Yapılacaklar sırası (öneri)

1. ~~**tenant-yisa-s’e bileşen kopyala**~~ **YAPILDI**  
   - ✅ `PaymentIBANPanel.tsx` → `tenant-yisa-s/components/franchise/PaymentIBANPanel.tsx`  
   - ✅ `ChildPerformancePanel.tsx` → `tenant-yisa-s/components/franchise/ChildPerformancePanel.tsx`  
   - Kullanım: franchise tesis sayfasında veya veli panelinde `<PaymentIBANPanel />`, `<ChildPerformancePanel childId={...} />` import et.

2. **BJK tesis ana sayfa tasarımını tenant vitrinine bağla**  
   - tenant-yisa-s’te franchise subdomain (bjktuzlacimnastik) için ana sayfa: bjktesis `app/page.tsx` tasarımını kullanacak şekilde bir sayfa veya layout (örn. `app/vitrin/[[...slug]]/page.tsx` veya mevcut vitrin route’u) oluştur/güncelle; tenant’a özel logo ve metin (Tuzla Cimnastik Okulu) subdomain veya tenant ayarından gelsin.

3. **Logo ve metadata**  
   - BJK logosunu tenant-yisa-s’e kopyala; subdomain bjktuzlacimnastik iken layout’ta bu logo ve "BJK Tuzla Cimnastik" title/description kullanılsın.

4. **137 öğrenci / ödeme / yoklama**  
   - Veri Supabase’de bu tenant’a ait mi kontrol et; tenant-yisa-s panel/veli sayfaları bu veriyi gösteriyor mu test et. Eksikse migration veya seed ile eşle.

Bu listeyi takip ederek “dağınık içerik” tek yerde (tenant-yisa-s, bjktuzlacimnastik.yisa-s.com) toplanır; veri zaten Supabase’deyse sadece UI ve görsel içerik çekilmiş olur.
