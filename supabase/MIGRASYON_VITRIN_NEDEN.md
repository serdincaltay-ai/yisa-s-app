# Vitrin SQL neden Cursor komutlarına dahil edilmedi?

## Kısa cevap

Vitrin migration’ı **önceden hazırlanmıştı** ve projede zaten vardı. Sonraki Cursor görevleri (Patron komut akışı, 66 şablon, ceo_templates, patron_commands) **sadece o görevlerin kapsamındaydı**; “vitrin SQL’ini de çalıştır” talimatı verilmediği için Cursor bu dosyayı komutlara eklemedi.

## Nerede?

| Dosya | Açıklama |
|-------|----------|
| `supabase/migrations/20260203_demo_requests_source_vitrin.sql` | Vitrin için migration (source = vitrin) |
| `supabase/YENI_MIGRASYONLAR_TEK_SQL.sql` | Tüm tablolar + **sonunda** demo_requests source = vitrin (satır ~234–237) |
| `supabase/VITRIN_TEK_SQL.sql` | Sadece vitrin: demo_requests source CHECK’i (tek başına çalıştırmak için) |

## Ne yapmalı?

- **Sadece vitrin kuralını uygulamak için:** Supabase SQL Editor’da `supabase/VITRIN_TEK_SQL.sql` dosyasını çalıştırın.
- **Tüm yeni migration’larla birlikte:** `supabase/YENI_MIGRASYONLAR_TEK_SQL.sql` dosyasını çalıştırın (içinde vitrin de var).
- **Migration sırasıyla:** `supabase migrate` veya Supabase Dashboard’da `20260203_demo_requests_source_vitrin.sql` migration’ını çalıştırın.

## Özet

Vitrin SQL’i eksik değil; başka bir aşamada yazılmıştı ve Cursor’a verilen son görevlerin kapsamında “vitrin’i de dahil et” denmediği için Cursor komutlarına eklenmemişti. Yukarıdaki dosyalardan biriyle istediğiniz şekilde uygulayabilirsiniz.
