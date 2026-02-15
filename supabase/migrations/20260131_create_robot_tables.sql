-- =====================================================
-- YİSA-S ROBOT TABLOLARI - Seed öncesi gerekli tablolar
-- Tarih: 31 Ocak 2026
-- =====================================================

-- robots tablosu
CREATE TABLE IF NOT EXISTS robots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kod VARCHAR(50) UNIQUE NOT NULL,
  isim VARCHAR(255) NOT NULL,
  hiyerarsi_sirasi INTEGER NOT NULL DEFAULT 0,
  aciklama TEXT,
  ai_model VARCHAR(50),
  durum VARCHAR(20) DEFAULT 'aktif' CHECK (durum IN ('aktif', 'pasif')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_robots_kod ON robots(kod);
ALTER TABLE robots ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service can manage robots" ON robots;
CREATE POLICY "Service can manage robots" ON robots FOR ALL USING (true);

-- celf_directorates tablosu
CREATE TABLE IF NOT EXISTS celf_directorates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kod VARCHAR(50) UNIQUE NOT NULL,
  isim VARCHAR(100) NOT NULL,
  tam_isim VARCHAR(255),
  aciklama TEXT,
  sorumluluk_alanlari JSONB DEFAULT '[]'::jsonb,
  sira INTEGER NOT NULL DEFAULT 0,
  ana_robot_id UUID REFERENCES robots(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_celf_directorates_kod ON celf_directorates(kod);
ALTER TABLE celf_directorates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service can manage celf_directorates" ON celf_directorates;
CREATE POLICY "Service can manage celf_directorates" ON celf_directorates FOR ALL USING (true);

-- role_permissions tablosu
CREATE TABLE IF NOT EXISTS role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rol_kodu VARCHAR(50) UNIQUE NOT NULL,
  rol_adi VARCHAR(255) NOT NULL,
  hiyerarsi_seviyesi INTEGER NOT NULL DEFAULT 99,
  aciklama TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_role_permissions_rol_kodu ON role_permissions(rol_kodu);
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service can manage role_permissions" ON role_permissions;
CREATE POLICY "Service can manage role_permissions" ON role_permissions FOR ALL USING (true);

-- core_rules tablosu
CREATE TABLE IF NOT EXISTS core_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kural_no INTEGER NOT NULL,
  kural_kodu VARCHAR(50) UNIQUE NOT NULL,
  baslik VARCHAR(255) NOT NULL,
  aciklama TEXT,
  kategori VARCHAR(50),
  zorunlu BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_core_rules_kural_kodu ON core_rules(kural_kodu);
ALTER TABLE core_rules ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service can manage core_rules" ON core_rules;
CREATE POLICY "Service can manage core_rules" ON core_rules FOR ALL USING (true);
