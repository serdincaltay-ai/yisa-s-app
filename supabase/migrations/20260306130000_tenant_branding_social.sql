-- Tenant branding & sosyal medya bilgileri
-- Logo, renk paleti, sosyal medya bağlantıları, iletişim bilgileri

ALTER TABLE tenants ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS primary_color TEXT DEFAULT '#06b6d4';
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS secondary_color TEXT DEFAULT '#0e7490';
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS accent_color TEXT DEFAULT '#22d3ee';

ALTER TABLE tenants ADD COLUMN IF NOT EXISTS instagram_url TEXT;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS whatsapp_number TEXT;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS google_maps_url TEXT;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS facebook_url TEXT;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS twitter_url TEXT;

ALTER TABLE tenants ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS working_hours TEXT;

-- Supabase Storage bucket for tenant logos (idempotent — skip if exists)
-- Note: Bu bucket'ı Supabase Dashboard'dan da oluşturabilirsiniz:
--   Storage → New Bucket → "tenant-logos" → Public
INSERT INTO storage.buckets (id, name, public)
VALUES ('tenant-logos', 'tenant-logos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policy: Authenticated users can upload to tenant-logos
CREATE POLICY IF NOT EXISTS "tenant_logos_insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'tenant-logos');

CREATE POLICY IF NOT EXISTS "tenant_logos_select"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'tenant-logos');

CREATE POLICY IF NOT EXISTS "tenant_logos_update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'tenant-logos');

CREATE POLICY IF NOT EXISTS "tenant_logos_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'tenant-logos');
