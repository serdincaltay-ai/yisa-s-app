# Şablon Sistemi — Tamamlama Raporu

**Tarih:** 2 Şubat 2026

---

## Yapılan İşler

### 1. CELF çıktısını ceo_templates'e otomatik kaydet

| Yer | Ne yapıldı |
|-----|------------|
| `app/api/approvals/route.ts` | Onay (approve) sonrası: displayText varsa ve şablon-benzeri ise (director_key CPO/CFO/CMO/… veya task/command'da "şablon") → `saveCeoTemplate()` ile ceo_templates'e kaydet |
| `app/api/startup/route.ts` | Başlangıç görevi tamamlandığında: görev adında "şablon" varsa ve CELF çıktısı varsa → `saveCeoTemplate()` ile ceo_templates'e kaydet |

### 2. Şablonlar sayfasında ceo_templates

| Yer | Ne yapıldı |
|-----|------------|
| `app/api/templates/route.ts` | ceo_templates tablosundan veri çekip templates listesine ekledi; `templates` tablosu sütun eşlemesi düzeltildi (`ad`, `kategori`, `kullanim_sayisi`) |
| `app/dashboard/sablonlar/page.tsx` | "Kaynak" sütunu eklendi (Robot CEO/CELF vs Veritabanı) |

### 3. Tenant–şablon ilişkisi

| Yer | Ne yapıldı |
|-----|------------|
| `supabase/migrations/20260202_tenant_templates.sql` | `tenant_templates` tablosu: tenant_id, template_id, template_source, used_by_user_id, used_at |
| `app/api/templates/usage/route.ts` | GET: kullanım listesi (tenant adı, şablon, tarih); POST: kullanım kaydı |
| `app/api/franchise/template-use/route.ts` | Franchise kullanıcısı için şablon kullanımı kaydı (auth + tenant çözümleme) |
| `app/dashboard/sablonlar/page.tsx` | "Şablon Kullanımı — Hangi Tenant Ne Kullanıyor?" bölümü |
| `app/franchise/page.tsx` COOTab | Gerçek şablonlar listesi + "Kullan" butonu → tenant_templates'e kayıt |

---

## Akış Özeti

1. **Robot şablon üretimi:** CELF görevi (başlangıç veya chat) şablon üretir → Onay kuyruğunda onaylanır → ceo_templates'e kaydedilir.
2. **Görüntüleme:** `/dashboard/sablonlar` → Hem `templates` hem `ceo_templates` listelenir.
3. **Franchise kullanımı:** Franchise paneli → COO Mağazası → Şablonlar → "Kullan" → tenant_templates'e kayıt.
4. **Patron görünümü:** Şablonlar sayfasında "Şablon Kullanımı" tablosu → Hangi tenant hangi şablonu kullandı.

---

## Migration

Supabase'de `20260202_tenant_templates.sql` migration'ını çalıştırın:

```bash
supabase db push
# veya Supabase SQL Editor'da migration içeriğini çalıştırın
```
