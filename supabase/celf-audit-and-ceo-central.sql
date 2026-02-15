-- ═══════════════════════════════════════════════════════════════════════════════════════
-- YİSA-S CELF İÇ DENETİM + CEO MERKEZ VERİTABANI
-- patron_private_tasks, celf_audit_logs, director_rules
-- ceo_routines, ceo_rules, ceo_templates, ceo_approved_tasks, ceo_franchise_data
-- Tarih: 30 Ocak 2026 — Supabase SQL Editor'da çalıştırın.
-- ═══════════════════════════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. PATRON ÖZEL İŞLER
-- ─────────────────────────────────────────────────────────────────────────────
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
CREATE POLICY "Users can read own patron_private_tasks" ON patron_private_tasks
  FOR SELECT USING (auth.uid() = patron_id);
DROP POLICY IF EXISTS "Service can manage patron_private_tasks" ON patron_private_tasks;
CREATE POLICY "Service can manage patron_private_tasks" ON patron_private_tasks
  FOR ALL USING (true) WITH CHECK (true);

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. CELF DENETİM LOGLARI
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS celf_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID,
  director_key TEXT NOT NULL,
  check_type TEXT NOT NULL CHECK (check_type IN ('data_access', 'protection', 'approval', 'veto')),
  check_result TEXT NOT NULL CHECK (check_result IN ('passed', 'failed', 'warning')),
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_celf_audit_logs_task_id ON celf_audit_logs(task_id);
CREATE INDEX IF NOT EXISTS idx_celf_audit_logs_director_key ON celf_audit_logs(director_key);
CREATE INDEX IF NOT EXISTS idx_celf_audit_logs_created_at ON celf_audit_logs(created_at DESC);
ALTER TABLE celf_audit_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service can manage celf_audit_logs" ON celf_audit_logs;
CREATE POLICY "Service can manage celf_audit_logs" ON celf_audit_logs
  FOR ALL USING (true) WITH CHECK (true);

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. DİREKTÖRLÜK KURALLARI (config)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS director_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  director_key TEXT UNIQUE NOT NULL,
  data_access TEXT[] DEFAULT '{}',
  read_only TEXT[] DEFAULT '{}',
  protected_data TEXT[] DEFAULT '{}',
  requires_approval TEXT[] DEFAULT '{}',
  has_veto BOOLEAN DEFAULT false,
  ai_providers TEXT[] DEFAULT '{}',
  triggers TEXT[] DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_director_rules_director_key ON director_rules(director_key);
ALTER TABLE director_rules ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service can manage director_rules" ON director_rules;
CREATE POLICY "Service can manage director_rules" ON director_rules
  FOR ALL USING (true) WITH CHECK (true);

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. CEO RUTİN HAVUZU
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ceo_routines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  routine_name TEXT NOT NULL,
  routine_type TEXT NOT NULL CHECK (routine_type IN ('rapor', 'kontrol', 'bildirim', 'sync')),
  director_key TEXT NOT NULL,
  command_template TEXT NOT NULL,
  data_sources TEXT[] DEFAULT '{}',
  schedule TEXT NOT NULL CHECK (schedule IN ('daily', 'weekly', 'monthly')),
  schedule_time TIME,
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
CREATE POLICY "Service can manage ceo_routines" ON ceo_routines
  FOR ALL USING (true) WITH CHECK (true);

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. CEO KURAL HAVUZU
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ceo_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_name TEXT NOT NULL,
  rule_type TEXT NOT NULL CHECK (rule_type IN ('validation', 'automation', 'restriction', 'notification')),
  applies_to TEXT[] DEFAULT '{}',
  condition JSONB NOT NULL,
  action JSONB NOT NULL,
  priority INTEGER DEFAULT 5,
  is_active BOOLEAN DEFAULT true,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ceo_rules_rule_type ON ceo_rules(rule_type);
ALTER TABLE ceo_rules ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service can manage ceo_rules" ON ceo_rules;
CREATE POLICY "Service can manage ceo_rules" ON ceo_rules
  FOR ALL USING (true) WITH CHECK (true);

-- ─────────────────────────────────────────────────────────────────────────────
-- 6. CEO ŞABLON HAVUZU
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ceo_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_name TEXT NOT NULL,
  template_type TEXT NOT NULL CHECK (template_type IN ('rapor', 'dashboard', 'ui', 'email', 'bildirim')),
  director_key TEXT,
  content JSONB NOT NULL,
  variables TEXT[] DEFAULT '{}',
  data_sources TEXT[] DEFAULT '{}',
  is_approved BOOLEAN DEFAULT false,
  approved_by UUID,
  approved_at TIMESTAMPTZ,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ceo_templates_template_type ON ceo_templates(template_type);
ALTER TABLE ceo_templates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service can manage ceo_templates" ON ceo_templates;
CREATE POLICY "Service can manage ceo_templates" ON ceo_templates
  FOR ALL USING (true) WITH CHECK (true);

-- ─────────────────────────────────────────────────────────────────────────────
-- 7. CEO ONAYLI İŞLER ARŞİVİ
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ceo_approved_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL,
  task_type TEXT NOT NULL,
  director_key TEXT NOT NULL,
  original_command TEXT NOT NULL,
  final_result JSONB,
  data_used TEXT[] DEFAULT '{}',
  data_changed TEXT[] DEFAULT '{}',
  approved_by UUID,
  approved_at TIMESTAMPTZ DEFAULT NOW(),
  can_become_routine BOOLEAN DEFAULT true,
  became_routine_id UUID
);
CREATE INDEX IF NOT EXISTS idx_ceo_approved_tasks_task_id ON ceo_approved_tasks(task_id);
CREATE INDEX IF NOT EXISTS idx_ceo_approved_tasks_approved_at ON ceo_approved_tasks(approved_at DESC);
ALTER TABLE ceo_approved_tasks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service can manage ceo_approved_tasks" ON ceo_approved_tasks;
CREATE POLICY "Service can manage ceo_approved_tasks" ON ceo_approved_tasks
  FOR ALL USING (true) WITH CHECK (true);

-- ─────────────────────────────────────────────────────────────────────────────
-- 8. FRANCHISE VERİ HAVUZU
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ceo_franchise_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  franchise_id UUID NOT NULL,
  data_type TEXT NOT NULL,
  data_value JSONB NOT NULL,
  period TEXT,
  reported_at TIMESTAMPTZ DEFAULT NOW(),
  synced_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ceo_franchise_data_franchise_id ON ceo_franchise_data(franchise_id);
CREATE INDEX IF NOT EXISTS idx_ceo_franchise_data_data_type ON ceo_franchise_data(data_type);
ALTER TABLE ceo_franchise_data ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service can manage ceo_franchise_data" ON ceo_franchise_data;
CREATE POLICY "Service can manage ceo_franchise_data" ON ceo_franchise_data
  FOR ALL USING (true) WITH CHECK (true);
