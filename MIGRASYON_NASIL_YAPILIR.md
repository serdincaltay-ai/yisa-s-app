# Migration Nasıl Yapılır — Adım Adım

## Yöntem: Supabase SQL Editor (şifre gerekmez)

### Adım 1 — Supabase'e gir
1. Tarayıcıda **https://supabase.com/dashboard** aç
2. Giriş yap (hesabın varsa)
3. **YİSA-S projesini** seç (tıkla)

---

### Adım 2 — SQL Editor'ü aç
1. Sol menüden **"SQL Editor"** seçeneğine tıkla
2. Üstte **"New query"** butonuna tıkla (veya zaten boş bir alan açıksa oraya geç)

---

### Adım 3 — SQL dosyasını aç
1. Bilgisayarında şu klasöre git:
   ```
   C:\Users\info\OneDrive\Desktop\claude\proje\YISA_S_APP\yisa-s-app\supabase
   ```
2. **SUPABASE_EDITOR_ILE_CALISTIR.sql** dosyasına çift tıkla
3. Dosya Not Defteri veya başka bir editörde açılacak
4. **Ctrl+A** (hepsini seç) → **Ctrl+C** (kopyala)

---

### Adım 4 — SQL Editor'e yapıştır ve çalıştır
1. Supabase SQL Editor sayfasına dön
2. Boş alana **Ctrl+V** (yapıştır)
3. Sağ altta **"Run"** butonuna tıkla (veya **Ctrl+Enter**)
4. "Success" veya yeşil onay görürsen tamam

---

### Adım 5 — Hata alırsan
- **"relation patron_commands does not exist"** → Önce temel tabloları oluşturman lazım. Söyle, ona göre SQL verelim.
- **Başka hata** → Hata mesajını kopyala, bana gönder.

---

## Dosyayı bulamazsan — SQL'i buradan kopyala

Aşağıdaki satırların HEPSİNİ seç (Ctrl+A) → Ctrl+C ile kopyala → Supabase SQL Editor'e yapıştır → Run:

-- BASLA (bu satırdan itibaren kopyala)
ALTER TABLE patron_commands ADD COLUMN IF NOT EXISTS ticket_no TEXT;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ceo_tasks') THEN
    ALTER TABLE ceo_tasks ADD COLUMN IF NOT EXISTS ticket_no TEXT;
  END IF;
END $$;

WITH numbered AS (
  SELECT id, '26' || TO_CHAR(created_at AT TIME ZONE 'UTC', 'MMDD') || '-' || LPAD(ROW_NUMBER() OVER (ORDER BY created_at)::text, 4, '0') AS tn
  FROM patron_commands
  WHERE ticket_no IS NULL
)
UPDATE patron_commands p
SET ticket_no = n.tn
FROM numbered n
WHERE p.id = n.id;

ALTER TABLE patron_commands ADD COLUMN IF NOT EXISTS type TEXT;
ALTER TABLE patron_commands ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE patron_commands ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'normal';
ALTER TABLE patron_commands ADD COLUMN IF NOT EXISTS source TEXT;
-- BITIR (bu satıra kadar)

---

## Özet
1. supabase.com → Proje → SQL Editor
2. New query
3. SUPABASE_EDITOR_ILE_CALISTIR.sql dosyasını aç → İçeriği kopyala
4. SQL Editor'e yapıştır → Run

Bu kadar.
