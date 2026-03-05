# yisa-s-app-uh Referansı

> **Amaç:** tenant-yisa-s'te eksik sayfa/akış veya CELF dokümanı ihtiyacında nereye bakılacağı.

## Kaynak

**Klasör:** `_schema_sources/yisa-s-app-uh-main/`

- **Sayfa şablonları:** `app/` — ana sayfa, giriş, patron, franchise, veli, antrenor, tesis panelleri (hafif sürüm; Next.js 14).
- **CELF / Asistan dokümanları:**  
  `CELF_MERKEZ_12_DIREKTORLUK.md`, `CELF_MERKEZ_API_ATAMALARI.md`, `CELF_COO_KURALLARI_DINAMIK.md`, `CELF_MALIYET_SATIS_TEMEL.md`,  
  `PATRON_ASISTAN_VIZYON_SEMA.md`, `ASISTAN_CALISMA_PRENSIBI_*.md`, `ROBOT_GOREVLERI.md`,  
  `YISA-S_KAPSAMLI_SISTEM_DOKUMANTASYONU.md`, `YISA-S_ALTYAPI_ENTEGRASYON_REHBERI.md` vb.
- **Scripts:** `scripts/` — Supabase şema (001_yisas_*.sql, 002_rls, 003_triggers).

## tenant-yisa-s ile eşleşme

| UH (yisa-s-app-uh) | tenant-yisa-s karşılığı |
|--------------------|--------------------------|
| app/patron | /dashboard, /patron |
| app/franchise | /franchise, /panel |
| app/veli | /veli |
| app/antrenor | /antrenor |
| app/tesis | /franchise, tesis sayfaları |

Eksik bir sayfa veya akış varsa UH'deki ilgili sayfa/doküman referans alınır; CELF/robot kuralları için yukarıdaki .md dosyaları kullanılır.
