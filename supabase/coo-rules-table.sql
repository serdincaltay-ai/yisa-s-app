-- ═══════════════════════════════════════════════════════════════════════════════════════
-- YİSA-S COO KURALLARI (coo_rules) — Dinamik COO operasyon kuralları
-- Güncelleme sadece Patron onayı ile; rutine bağlanamaz.
-- İsteğe bağlı: ileride coo-robot kurallarını DB'den okumak için kullanılabilir.
-- Tarih: 30 Ocak 2026
-- ═══════════════════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS coo_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operation_type TEXT NOT NULL CHECK (operation_type IN (
    'daily_ops', 'facility_coord', 'franchise_coord', 'process_track', 'resource_alloc', 'unknown'
  )),
  label TEXT NOT NULL,
  keywords TEXT[] DEFAULT '{}',
  director_mapping JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  approved_by UUID,
  approved_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_coo_rules_operation_type ON coo_rules(operation_type);
ALTER TABLE coo_rules ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service can manage coo_rules" ON coo_rules;
CREATE POLICY "Service can manage coo_rules" ON coo_rules
  FOR ALL USING (true) WITH CHECK (true);
