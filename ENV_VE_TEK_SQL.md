# .env.local + Tek SQL Referansı

**Patron:** Serdinç ALTAY  
**Tarih:** 30 Ocak 2026  

---

## 1. Asistan vs CELF — 2 set anahtar

Aynı API (örn. Gemini) **iki yerde** kullanılıyor: **Asistan** (ilk adım imla + özel iş) ve **CELF** (şirket işi). İki ayrı anahtar kullanırsanız birbirini etkilemez.

| Kullanım | Değişkenler (öncelikli) | Yedek (yoksa) |
|----------|-------------------------|----------------|
| **Asistan** | `ASISTAN_GOOGLE_API_KEY`, `ASISTAN_OPENAI_API_KEY`, `ASISTAN_ANTHROPIC_API_KEY` | `GOOGLE_API_KEY`, `OPENAI_API_KEY`, `ANTHROPIC_API_KEY` |
| **CELF** | `CELF_GOOGLE_API_KEY`, `CELF_OPENAI_API_KEY`, `CELF_ANTHROPIC_API_KEY`, `CELF_TOGETHER_API_KEY` | `GOOGLE_API_KEY`, `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `TOGETHER_API_KEY` |

- **Sadece genel key'ler:** Hepsi için `GOOGLE_API_KEY`, `OPENAI_API_KEY`, `ANTHROPIC_API_KEY` yazarsanız hem Asistan hem CELF aynı anahtarı kullanır.
- **İki set:** Asistan için `ASISTAN_*`, CELF için `CELF_*` yazarsanız iki taraf ayrı kotadan çalışır; karışmaz.
- **.env.local** proje kökünde olmalı; değişiklikten sonra **npm run dev** yeniden başlatın.

---

## 2. Tek SQL — Tüm tablolar

**Dosya (tek script):**

```
supabase/YISA-S_TUM_TABLOLAR_TEK_SQL.sql
```

**Ne yapar:** Patron/Chat/CEO, CELF, robot, v2.1 operasyon, maliyet/satış, COO kuralları, rol tabloları dahil tüm tabloları tek seferde oluşturur.

**Nasıl çalıştırılır:**  
Supabase Dashboard → **SQL Editor** → New query → `YISA-S_TUM_TABLOLAR_TEK_SQL.sql` dosyasının **içeriğini tamamen** yapıştırın → **Run**.

**Tam yol (Windows):**  
`C:\Users\info\OneDrive\Desktop\YISA_S_APP\yisa-s-app\supabase\YISA-S_TUM_TABLOLAR_TEK_SQL.sql`

---

**Döküman sonu.**
