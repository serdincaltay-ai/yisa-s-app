-- ═══════════════════════════════════════════════════════════════════════════════════════
-- YİSA-S CELF MALİYET RAPORLARI + PATRON SATIŞ FİYATLARI
-- CELF (CFO) maliyet raporu üretir → Patron satış fiyatı belirler
-- Tarih: 30 Ocak 2026 — Supabase SQL Editor'da çalıştırın
-- ═══════════════════════════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. CELF MALİYET RAPORLARI (CELF/CFO oluşturur)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS celf_cost_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_type TEXT NOT NULL CHECK (report_type IN (
    'franchise_package', 'student_tier', 'robot', 'veli_extra', 'one_time', 'monthly', 'custom'
  )),
  period TEXT,
  description TEXT NOT NULL,
  product_key TEXT,
  cost_breakdown JSONB NOT NULL DEFAULT '{}',
  director_key TEXT DEFAULT 'CFO',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by TEXT
);

COMMENT ON TABLE celf_cost_reports IS 'CELF (CFO) maliyet raporları; Patron maliyeti buradan görür.';
COMMENT ON COLUMN celf_cost_reports.cost_breakdown IS 'Örn: { "api_cost": 100, "infra_cost": 50, "ops_cost": 30, "total_cost": 180, "currency": "USD" }';

CREATE INDEX IF NOT EXISTS idx_celf_cost_reports_report_type ON celf_cost_reports(report_type);
CREATE INDEX IF NOT EXISTS idx_celf_cost_reports_product_key ON celf_cost_reports(product_key);
CREATE INDEX IF NOT EXISTS idx_celf_cost_reports_created_at ON celf_cost_reports(created_at DESC);

ALTER TABLE celf_cost_reports ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service can manage celf_cost_reports" ON celf_cost_reports;
CREATE POLICY "Service can manage celf_cost_reports" ON celf_cost_reports
  FOR ALL USING (true) WITH CHECK (true);

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. PATRON SATIŞ FİYATLARI (Patron belirler)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS patron_sales_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_key TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  description TEXT,
  cost_report_id UUID REFERENCES celf_cost_reports(id) ON DELETE SET NULL,
  sales_price_amount NUMERIC(12,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  effective_from TIMESTAMPTZ DEFAULT NOW(),
  effective_to TIMESTAMPTZ,
  approved_by UUID,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE patron_sales_prices IS 'Patron satış fiyatları; maliyet raporuna göre Patron belirler.';

CREATE INDEX IF NOT EXISTS idx_patron_sales_prices_product_key ON patron_sales_prices(product_key);
CREATE INDEX IF NOT EXISTS idx_patron_sales_prices_effective ON patron_sales_prices(effective_from, effective_to);

ALTER TABLE patron_sales_prices ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service can manage patron_sales_prices" ON patron_sales_prices;
CREATE POLICY "Service can manage patron_sales_prices" ON patron_sales_prices
  FOR ALL USING (true) WITH CHECK (true);

-- Örnek product_key değerleri (referans)
-- franchise_entry, student_tier_100, student_tier_150, student_tier_200, student_tier_250, student_tier_500
-- robot_basic, robot_premium, veli_extra_full, demo_web, demo_logo, demo_social
