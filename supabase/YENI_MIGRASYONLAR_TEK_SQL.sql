-- =====================================================
-- YİSA-S TÜM GEREKLİ TABLOLAR — TEK DOSYADA
-- Supabase Dashboard → SQL Editor → Yapıştır → Run
-- tenants yoksa oluşturulur, sonra user_tenants, athletes, payments, attendance...
-- =====================================================

-- 0. TENANTS (yoksa oluştur)
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ad VARCHAR(255),
  name TEXT,
  slug VARCHAR(100) UNIQUE,
  durum VARCHAR(20) DEFAULT 'aktif' CHECK (durum IN ('aktif', 'askida', 'iptal')),
  owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  package_type TEXT DEFAULT 'starter',
  olusturma_tarihi TIMESTAMPTZ DEFAULT NOW(),
  guncelleme_tarihi TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_tenants_slug ON tenants(slug);

-- Eksik kolonları ekle (tablo zaten varsa)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tenants' AND column_name = 'owner_id') THEN
    ALTER TABLE tenants ADD COLUMN owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tenants' AND column_name = 'package_type') THEN
    ALTER TABLE tenants ADD COLUMN package_type TEXT DEFAULT 'starter';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tenants' AND column_name = 'name') THEN
    ALTER TABLE tenants ADD COLUMN name TEXT;
  END IF;
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

-- owner_id artık kesin var, index oluştur
CREATE INDEX IF NOT EXISTS idx_tenants_owner ON tenants(owner_id) WHERE owner_id IS NOT NULL;

-- 1. USER_TENANTS
CREATE TABLE IF NOT EXISTS user_tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'manager', 'trainer', 'staff', 'viewer')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, tenant_id)
);
CREATE INDEX IF NOT EXISTS idx_user_tenants_user_id ON user_tenants(user_id);
CREATE INDEX IF NOT EXISTS idx_user_tenants_tenant_id ON user_tenants(tenant_id);
ALTER TABLE user_tenants ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can read own user_tenants" ON user_tenants;
CREATE POLICY "Users can read own user_tenants" ON user_tenants FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Service can manage user_tenants" ON user_tenants;
CREATE POLICY "Service can manage user_tenants" ON user_tenants FOR ALL USING (true) WITH CHECK (true);

-- 2. ROLES + PACKAGES
CREATE TABLE IF NOT EXISTS roles (id SERIAL PRIMARY KEY, name TEXT UNIQUE NOT NULL, level INTEGER NOT NULL, description TEXT);
INSERT INTO roles (name, level, description) VALUES
  ('Patron', 0, 'En üst yetki'), ('Franchise Sahibi', 1, 'Franchise sahibi'), ('Tesis Müdürü', 2, 'Tesis yönetimi'),
  ('Antrenör', 3, 'Ders yönetimi'), ('Kayıt Personeli', 4, 'Kayıt ve aidat'), ('Veli', 5, 'Çocuk takibi'), ('Sporcu', 6, 'Üye')
ON CONFLICT (name) DO NOTHING;

CREATE TABLE IF NOT EXISTS packages (id SERIAL PRIMARY KEY, name TEXT NOT NULL, slug TEXT UNIQUE NOT NULL, price DECIMAL(10,2) NOT NULL, currency VARCHAR(3) DEFAULT 'TRY', features JSONB DEFAULT '[]'::jsonb, robot_quota INTEGER DEFAULT 1000, max_members INTEGER DEFAULT 50, max_branches INTEGER DEFAULT 1, is_active BOOLEAN DEFAULT TRUE, created_at TIMESTAMPTZ DEFAULT NOW());
INSERT INTO packages (name, slug, price, features, robot_quota, max_members, max_branches) VALUES
  ('Starter', 'starter', 499, '["50 üye","1 şube","Temel robotlar"]'::jsonb, 500, 50, 1),
  ('Pro', 'pro', 999, '["200 üye","3 şube","Tüm robotlar"]'::jsonb, 2000, 200, 3),
  ('Enterprise', 'enterprise', 0, '["Sınırsız"]'::jsonb, 10000, 9999, 99)
ON CONFLICT (slug) DO UPDATE SET name=EXCLUDED.name, price=EXCLUDED.price;

-- 3. ATHLETES
CREATE TABLE IF NOT EXISTS athletes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  parent_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  surname TEXT,
  birth_date DATE,
  gender TEXT CHECK (gender IN ('E', 'K', 'diger')),
  branch TEXT,
  level TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'trial')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_athletes_tenant_id ON athletes(tenant_id);
CREATE INDEX IF NOT EXISTS idx_athletes_parent_user ON athletes(parent_user_id) WHERE parent_user_id IS NOT NULL;
ALTER TABLE athletes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users see own tenant athletes" ON athletes;
CREATE POLICY "Users see own tenant athletes" ON athletes FOR SELECT USING (tenant_id IN (SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid()) OR tenant_id IN (SELECT id FROM tenants WHERE owner_id = auth.uid()));
DROP POLICY IF EXISTS "Users manage own tenant athletes" ON athletes;
CREATE POLICY "Users manage own tenant athletes" ON athletes FOR ALL USING (tenant_id IN (SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid()) OR tenant_id IN (SELECT id FROM tenants WHERE owner_id = auth.uid())) WITH CHECK (tenant_id IN (SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid()) OR tenant_id IN (SELECT id FROM tenants WHERE owner_id = auth.uid()));
DROP POLICY IF EXISTS "Service can manage athletes" ON athletes;
CREATE POLICY "Service can manage athletes" ON athletes FOR ALL USING (true) WITH CHECK (true);

-- 4. STAFF
CREATE TABLE IF NOT EXISTS staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  surname TEXT,
  email TEXT,
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('admin', 'manager', 'trainer', 'receptionist', 'other')),
  branch TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_staff_tenant_id ON staff(tenant_id);
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users see own tenant staff" ON staff;
CREATE POLICY "Users see own tenant staff" ON staff FOR SELECT USING (tenant_id IN (SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid()) OR tenant_id IN (SELECT id FROM tenants WHERE owner_id = auth.uid()));
DROP POLICY IF EXISTS "Users manage own tenant staff" ON staff;
CREATE POLICY "Users manage own tenant staff" ON staff FOR ALL USING (tenant_id IN (SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid()) OR tenant_id IN (SELECT id FROM tenants WHERE owner_id = auth.uid())) WITH CHECK (tenant_id IN (SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid()) OR tenant_id IN (SELECT id FROM tenants WHERE owner_id = auth.uid()));
DROP POLICY IF EXISTS "Service can manage staff" ON staff;
CREATE POLICY "Service can manage staff" ON staff FOR ALL USING (true) WITH CHECK (true);

-- 5. TENANTS RLS
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users see own or assigned tenants" ON tenants;
CREATE POLICY "Users see own or assigned tenants" ON tenants FOR SELECT USING (owner_id = auth.uid() OR id IN (SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid()));
DROP POLICY IF EXISTS "Service can manage tenants" ON tenants;
CREATE POLICY "Service can manage tenants" ON tenants FOR ALL USING (true) WITH CHECK (true);

-- 6. DEMO_REQUESTS
CREATE TABLE IF NOT EXISTS demo_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  facility_type TEXT,
  city TEXT,
  notes TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted', 'rejected')),
  source TEXT DEFAULT 'www',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_demo_requests_status ON demo_requests(status);
ALTER TABLE demo_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can submit demo request" ON demo_requests;
CREATE POLICY "Anyone can submit demo request" ON demo_requests FOR INSERT WITH CHECK (true);

-- 7. TENANT_TEMPLATES
CREATE TABLE IF NOT EXISTS tenant_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  template_id UUID NOT NULL,
  template_source TEXT NOT NULL CHECK (template_source IN ('templates', 'ceo_templates')),
  used_by_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  used_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, template_id, template_source)
);
CREATE INDEX IF NOT EXISTS idx_tenant_templates_tenant ON tenant_templates(tenant_id);
ALTER TABLE tenant_templates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service can manage tenant_templates" ON tenant_templates;
CREATE POLICY "Service can manage tenant_templates" ON tenant_templates FOR ALL USING (true) WITH CHECK (true);

-- 8. PAYMENTS
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  athlete_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  payment_type TEXT DEFAULT 'aidat' CHECK (payment_type IN ('aidat', 'kayit', 'ekstra')),
  period_month INTEGER CHECK (period_month IS NULL OR (period_month >= 1 AND period_month <= 12)),
  period_year INTEGER,
  due_date DATE,
  paid_date DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')),
  payment_method TEXT CHECK (payment_method IS NULL OR payment_method IN ('nakit', 'kart', 'havale', 'eft')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_payments_tenant ON payments(tenant_id);
CREATE INDEX IF NOT EXISTS idx_payments_athlete ON payments(athlete_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_period ON payments(period_year, period_month);
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Tenant users manage payments" ON payments;
CREATE POLICY "Tenant users manage payments" ON payments FOR ALL USING (
  tenant_id IN (SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid())
  OR tenant_id IN (SELECT id FROM tenants WHERE owner_id = auth.uid())
) WITH CHECK (
  tenant_id IN (SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid())
  OR tenant_id IN (SELECT id FROM tenants WHERE owner_id = auth.uid())
);
DROP POLICY IF EXISTS "Parent view payments" ON payments;
CREATE POLICY "Parent view payments" ON payments FOR SELECT USING (
  athlete_id IN (SELECT id FROM athletes WHERE parent_user_id = auth.uid())
);
DROP POLICY IF EXISTS "Service can manage payments" ON payments;
CREATE POLICY "Service can manage payments" ON payments FOR ALL USING (true) WITH CHECK (true);

-- attendance (AŞAMA 7)
CREATE TABLE IF NOT EXISTS attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  athlete_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
  lesson_date DATE NOT NULL,
  lesson_time TIME,
  status TEXT DEFAULT 'present' CHECK (status IN ('present', 'absent', 'late', 'excused')),
  notes TEXT,
  marked_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_attendance_tenant ON attendance(tenant_id);
CREATE INDEX IF NOT EXISTS idx_attendance_athlete ON attendance(athlete_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(lesson_date);
CREATE UNIQUE INDEX IF NOT EXISTS idx_attendance_unique ON attendance(tenant_id, athlete_id, lesson_date);
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Tenant users manage attendance" ON attendance;
CREATE POLICY "Tenant users manage attendance" ON attendance FOR ALL USING (
  tenant_id IN (SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid())
  OR tenant_id IN (SELECT id FROM tenants WHERE owner_id = auth.uid())
) WITH CHECK (
  tenant_id IN (SELECT tenant_id FROM user_tenants WHERE user_id = auth.uid())
  OR tenant_id IN (SELECT id FROM tenants WHERE owner_id = auth.uid())
);
DROP POLICY IF EXISTS "Parent view attendance" ON attendance;
CREATE POLICY "Parent view attendance" ON attendance FOR SELECT USING (
  athlete_id IN (SELECT id FROM athletes WHERE parent_user_id = auth.uid())
);
DROP POLICY IF EXISTS "Service can manage attendance" ON attendance;
CREATE POLICY "Service can manage attendance" ON attendance FOR ALL USING (true) WITH CHECK (true);

-- athletes parent_email (AŞAMA 9)
ALTER TABLE athletes ADD COLUMN IF NOT EXISTS parent_email TEXT;
CREATE INDEX IF NOT EXISTS idx_athletes_parent_email ON athletes(parent_email) WHERE parent_email IS NOT NULL;
