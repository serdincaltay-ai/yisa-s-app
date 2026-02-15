-- ═══════════════════════════════════════════════════════════════════════════════
-- YİSA-S — TÜM YENİ MİGRASYONLAR TEK DOSYADA
-- Supabase Dashboard → SQL Editor → Yapıştır → Run
-- Sıra: patron_private_tasks → celf_kasa → tenant ayarları → tenant_schedule → tenant_purchases
-- ═══════════════════════════════════════════════════════════════════════════════

-- 0. patron_private_tasks (özel iş kaydetme — "Kaydet?" Evet)
CREATE TABLE IF NOT EXISTS patron_private_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patron_id UUID NOT NULL,
  task_type TEXT,
  command TEXT NOT NULL,
  result TEXT,
  ai_providers TEXT[] DEFAULT '{}',
  is_private BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_patron_private_tasks_patron_id ON patron_private_tasks(patron_id);
CREATE INDEX IF NOT EXISTS idx_patron_private_tasks_created_at ON patron_private_tasks(created_at DESC);
ALTER TABLE patron_private_tasks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can read own patron_private_tasks" ON patron_private_tasks;
CREATE POLICY "Users can read own patron_private_tasks" ON patron_private_tasks FOR SELECT USING (auth.uid() = patron_id);
DROP POLICY IF EXISTS "Service can manage patron_private_tasks" ON patron_private_tasks;
CREATE POLICY "Service can manage patron_private_tasks" ON patron_private_tasks FOR ALL USING (true) WITH CHECK (true);

-- 1. CELF Kasa
CREATE TABLE IF NOT EXISTS celf_kasa (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hareket_tipi TEXT NOT NULL CHECK (hareket_tipi IN ('gelir', 'gider')),
  aciklama TEXT NOT NULL,
  tutar DECIMAL(12,2) NOT NULL,
  para_birimi VARCHAR(3) DEFAULT 'TRY',
  referans_tipi TEXT,
  referans_id UUID,
  franchise_id UUID,
  tenant_id UUID,
  kaynak TEXT,
  odeme_tarihi TIMESTAMPTZ,
  odeme_onaylandi BOOLEAN DEFAULT false,
  odeme_onaylayan UUID,
  odeme_onay_tarihi TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_celf_kasa_hareket_tipi ON celf_kasa(hareket_tipi);
CREATE INDEX IF NOT EXISTS idx_celf_kasa_created_at ON celf_kasa(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_celf_kasa_franchise ON celf_kasa(franchise_id);
CREATE INDEX IF NOT EXISTS idx_celf_kasa_tenant ON celf_kasa(tenant_id);

-- 2. Tenants ek alanlar
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS antrenor_hedef INTEGER DEFAULT 0;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS temizlik_hedef INTEGER DEFAULT 0;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS mudur_hedef INTEGER DEFAULT 0;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS aidat_tiers JSONB DEFAULT '{"25": 500, "45": 700, "60": 900}'::jsonb;

-- 3. Haftalık ders programı
CREATE TABLE IF NOT EXISTS tenant_schedule (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  gun TEXT NOT NULL CHECK (gun IN ('Pazartesi','Sali','Carsamba','Persembe','Cuma','Cumartesi','Pazar')),
  saat TEXT NOT NULL,
  ders_adi TEXT NOT NULL,
  antrenor_id UUID,
  brans TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_tenant_schedule_tenant ON tenant_schedule(tenant_id);
-- UNIQUE kaldırıldı (bazı tenant yapılarında staff yoksa hata verebilir)

-- 4. tenant_purchases (ödeme onayı sonrası kullanım)
CREATE TABLE IF NOT EXISTS tenant_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  product_key TEXT NOT NULL,
  product_name TEXT,
  amount DECIMAL(12,2) NOT NULL,
  para_birimi VARCHAR(3) DEFAULT 'TRY',
  celf_kasa_id UUID,
  odeme_onaylandi BOOLEAN DEFAULT false,
  approved_by UUID,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_tenant_purchases_tenant ON tenant_purchases(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_purchases_product ON tenant_purchases(tenant_id, product_key);

-- celf_kasa'ya ödeme onay kolonları (zaten tabloda varsa IF NOT EXISTS ile eklenir)
ALTER TABLE celf_kasa ADD COLUMN IF NOT EXISTS odeme_onaylandi BOOLEAN DEFAULT false;
ALTER TABLE celf_kasa ADD COLUMN IF NOT EXISTS odeme_onaylayan UUID;
ALTER TABLE celf_kasa ADD COLUMN IF NOT EXISTS odeme_onay_tarihi TIMESTAMPTZ;

-- 5. RLS — celf_kasa, tenant_purchases, patron_commands
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'celf_kasa') THEN
    ALTER TABLE celf_kasa ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "celf_kasa_deny_client" ON celf_kasa;
    CREATE POLICY "celf_kasa_deny_client" ON celf_kasa FOR ALL USING (false);
  END IF;
END $$;
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tenant_purchases')
     AND EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_tenants') THEN
    ALTER TABLE tenant_purchases ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "tenant_purchases_select_own" ON tenant_purchases;
    DROP POLICY IF EXISTS "tenant_purchases_deny_write" ON tenant_purchases;
    DROP POLICY IF EXISTS "tenant_purchases_deny_update" ON tenant_purchases;
    DROP POLICY IF EXISTS "tenant_purchases_deny_delete" ON tenant_purchases;
    CREATE POLICY "tenant_purchases_select_own" ON tenant_purchases FOR SELECT USING (
      tenant_id IN (SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid())
      OR tenant_id IN (SELECT id FROM tenants WHERE owner_id = auth.uid())
    );
    CREATE POLICY "tenant_purchases_deny_write" ON tenant_purchases FOR INSERT WITH CHECK (false);
    CREATE POLICY "tenant_purchases_deny_update" ON tenant_purchases FOR UPDATE USING (false);
    CREATE POLICY "tenant_purchases_deny_delete" ON tenant_purchases FOR DELETE USING (false);
  ELSIF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tenant_purchases') THEN
    ALTER TABLE tenant_purchases ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "tenant_purchases_deny_all" ON tenant_purchases;
    CREATE POLICY "tenant_purchases_deny_all" ON tenant_purchases FOR ALL USING (false);
  END IF;
END $$;
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'patron_commands') THEN
    ALTER TABLE patron_commands ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "patron_commands_deny_client" ON patron_commands;
    CREATE POLICY "patron_commands_deny_client" ON patron_commands FOR ALL USING (false);
  END IF;
END $$;

-- 6. Staff genişletilmiş alanlar (personel: doğum, adres, il/ilçe, önceki iş, rahatsızlık, araba, dil)
ALTER TABLE staff DROP CONSTRAINT IF EXISTS staff_role_check;
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN SELECT c.conname FROM pg_constraint c JOIN pg_class t ON c.conrelid = t.oid
    WHERE t.relname = 'staff' AND c.contype = 'c' AND pg_get_constraintdef(c.oid) LIKE '%role%'
  LOOP
    EXECUTE format('ALTER TABLE staff DROP CONSTRAINT IF EXISTS %I', r.conname);
    EXIT;
  END LOOP;
END $$;
ALTER TABLE staff ADD CONSTRAINT staff_role_check CHECK (role IN ('admin', 'manager', 'trainer', 'receptionist', 'other', 'cleaning'));
ALTER TABLE staff ADD COLUMN IF NOT EXISTS birth_date DATE;
ALTER TABLE staff ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE staff ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE staff ADD COLUMN IF NOT EXISTS district TEXT;
ALTER TABLE staff ADD COLUMN IF NOT EXISTS previous_work TEXT;
ALTER TABLE staff ADD COLUMN IF NOT EXISTS chronic_condition TEXT;
ALTER TABLE staff ADD COLUMN IF NOT EXISTS has_driving_license BOOLEAN;
ALTER TABLE staff ADD COLUMN IF NOT EXISTS languages TEXT;

-- 7. COO Depolar (drafts → approved → published)
CREATE TABLE IF NOT EXISTS coo_depo_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  director_key TEXT NOT NULL,
  template_name TEXT,
  content JSONB NOT NULL,
  source TEXT,
  patron_command_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID
);
CREATE INDEX IF NOT EXISTS idx_coo_depo_drafts_director ON coo_depo_drafts(director_key);
CREATE INDEX IF NOT EXISTS idx_coo_depo_drafts_created ON coo_depo_drafts(created_at DESC);

CREATE TABLE IF NOT EXISTS coo_depo_approved (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draft_id UUID,
  director_key TEXT NOT NULL,
  template_name TEXT NOT NULL,
  content JSONB NOT NULL,
  approved_by UUID NOT NULL,
  approved_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_coo_depo_approved_director ON coo_depo_approved(director_key);
CREATE INDEX IF NOT EXISTS idx_coo_depo_approved_at ON coo_depo_approved(approved_at DESC);

CREATE TABLE IF NOT EXISTS coo_depo_published (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  approved_id UUID,
  director_key TEXT NOT NULL,
  template_name TEXT NOT NULL,
  content JSONB NOT NULL,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  published_by UUID,
  tenant_visible BOOLEAN DEFAULT true
);
CREATE INDEX IF NOT EXISTS idx_coo_depo_published_director ON coo_depo_published(director_key);
CREATE INDEX IF NOT EXISTS idx_coo_depo_published_at ON coo_depo_published(published_at DESC);

ALTER TABLE coo_depo_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE coo_depo_approved ENABLE ROW LEVEL SECURITY;
ALTER TABLE coo_depo_published ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "coo_depo_drafts_service_only" ON coo_depo_drafts;
CREATE POLICY "coo_depo_drafts_service_only" ON coo_depo_drafts FOR ALL USING (false) WITH CHECK (false);
DROP POLICY IF EXISTS "coo_depo_approved_service_only" ON coo_depo_approved;
CREATE POLICY "coo_depo_approved_service_only" ON coo_depo_approved FOR ALL USING (false) WITH CHECK (false);
DROP POLICY IF EXISTS "coo_depo_published_read" ON coo_depo_published;
CREATE POLICY "coo_depo_published_read" ON coo_depo_published FOR SELECT USING (true);

-- 8. demo_requests: source'a 'manychat' ekle (ManyChat webhook lead'leri)
ALTER TABLE demo_requests DROP CONSTRAINT IF EXISTS demo_requests_source_check;
ALTER TABLE demo_requests ADD CONSTRAINT demo_requests_source_check
  CHECK (source IN ('www', 'demo', 'fiyatlar', 'vitrin', 'manychat'));

-- 9. ceo_routines (COO run-due — rutin görevler için)
CREATE TABLE IF NOT EXISTS ceo_routines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  routine_name TEXT NOT NULL,
  routine_type TEXT NOT NULL CHECK (routine_type IN ('rapor', 'kontrol', 'bildirim', 'sync')),
  director_key TEXT NOT NULL,
  command_template TEXT NOT NULL,
  data_sources TEXT[] DEFAULT '{}',
  schedule TEXT NOT NULL CHECK (schedule IN ('daily', 'weekly', 'monthly')),
  schedule_time TEXT,
  is_active BOOLEAN DEFAULT true,
  last_result JSONB,
  last_run TIMESTAMPTZ,
  next_run TIMESTAMPTZ,
  created_by UUID,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ceo_routines_next_run ON ceo_routines(next_run) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_ceo_routines_director_key ON ceo_routines(director_key);
ALTER TABLE ceo_routines ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service can manage ceo_routines" ON ceo_routines;
CREATE POLICY "Service can manage ceo_routines" ON ceo_routines FOR ALL USING (true) WITH CHECK (true);

-- 9b. ceo_routines örnek rutin seed
INSERT INTO ceo_routines (
  routine_name, routine_type, director_key, command_template, data_sources,
  schedule, schedule_time, is_active, next_run, approved_at
)
SELECT
  'Günlük CFO Özeti', 'rapor', 'CFO',
  'Günlük finansal durum özeti ver. Gelir, gider, tahsilat durumunu kısaca özetle.',
  ARRAY['payments', 'expenses']::TEXT[],
  'daily', '02:00', true,
  (CURRENT_DATE + INTERVAL '1 day')::TIMESTAMPTZ + INTERVAL '2 hours',
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM ceo_routines WHERE routine_name = 'Günlük CFO Özeti' LIMIT 1);
