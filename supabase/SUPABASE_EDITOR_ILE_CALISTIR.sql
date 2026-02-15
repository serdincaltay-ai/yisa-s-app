-- YİSA-S — Supabase SQL Editor'da çalıştır (DATABASE_URL gerekmez)
-- Bu dosyayı kopyala → Supabase Dashboard → SQL Editor → Yapıştır → Run

-- 1. ticket_no
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

-- 2. patron_commands genişletme
ALTER TABLE patron_commands ADD COLUMN IF NOT EXISTS type TEXT;
ALTER TABLE patron_commands ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE patron_commands ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'normal';
ALTER TABLE patron_commands ADD COLUMN IF NOT EXISTS source TEXT;

-- 3. franchise_subdomains (asistan komutla eklenebilir)
CREATE TABLE IF NOT EXISTS franchise_subdomains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subdomain TEXT NOT NULL UNIQUE,
  franchise_name TEXT,
  tenant_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID
);
CREATE INDEX IF NOT EXISTS idx_franchise_subdomains_subdomain ON franchise_subdomains(subdomain);
INSERT INTO franchise_subdomains (subdomain, franchise_name) VALUES
  ('bjktuzlacimnastik', 'Tuzla Cimnastik'),
  ('fenerbahceatasehir', 'Ataşehir, Ümraniye, Kurtköy'),
  ('kartalcimnastik', 'Kartal Cimnastik')
ON CONFLICT (subdomain) DO NOTHING;
