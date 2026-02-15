-- ═══════════════════════════════════════════════════════════════════════════════════════
-- YİSA-S ROBOT SİSTEMİ - routine_tasks, task_results, security_logs
-- Tarih: 30 Ocak 2026
-- Supabase SQL Editor'da çalıştırın. patron-chat-ceo-tables.sql sonrası.
-- ═══════════════════════════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. ROUTINE_TASKS - Rutin görevler (Bu rutin olsun)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS routine_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_type TEXT NOT NULL,
  director_key TEXT NOT NULL,
  command TEXT NOT NULL,
  schedule TEXT NOT NULL CHECK (schedule IN ('daily', 'weekly', 'monthly')),
  schedule_time TIME,
  last_run TIMESTAMPTZ,
  next_run TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_routine_tasks_next_run ON routine_tasks(next_run) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_routine_tasks_director_key ON routine_tasks(director_key);
CREATE INDEX IF NOT EXISTS idx_routine_tasks_created_at ON routine_tasks(created_at DESC);

ALTER TABLE routine_tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service can manage routine_tasks" ON routine_tasks;
CREATE POLICY "Service can manage routine_tasks" ON routine_tasks
  FOR ALL USING (true) WITH CHECK (true);

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. TASK_RESULTS - Görev sonuçları (arşiv)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS task_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID,
  routine_task_id UUID REFERENCES routine_tasks(id) ON DELETE SET NULL,
  director_key TEXT,
  ai_providers TEXT[] DEFAULT '{}',
  input_command TEXT,
  output_result TEXT,
  status TEXT DEFAULT 'completed' CHECK (status IN ('completed', 'failed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_task_results_task_id ON task_results(task_id);
CREATE INDEX IF NOT EXISTS idx_task_results_routine_task_id ON task_results(routine_task_id);
CREATE INDEX IF NOT EXISTS idx_task_results_director_key ON task_results(director_key);
CREATE INDEX IF NOT EXISTS idx_task_results_created_at ON task_results(created_at DESC);

ALTER TABLE task_results ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service can manage task_results" ON task_results;
CREATE POLICY "Service can manage task_results" ON task_results
  FOR ALL USING (true) WITH CHECK (true);

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. SECURITY_LOGS - Siber güvenlik logları (4 seviye: sarı, turuncu, kırmızı, acil)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS security_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('sari', 'turuncu', 'kirmizi', 'acil')),
  description TEXT,
  user_id UUID,
  ip_address TEXT,
  blocked BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_security_logs_severity ON security_logs(severity);
CREATE INDEX IF NOT EXISTS idx_security_logs_created_at ON security_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_security_logs_blocked ON security_logs(blocked) WHERE blocked = true;

ALTER TABLE security_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service can manage security_logs" ON security_logs;
CREATE POLICY "Service can manage security_logs" ON security_logs
  FOR ALL USING (true) WITH CHECK (true);

-- ═══════════════════════════════════════════════════════════════════════════════════════
-- KURULUM TAMAMLANDI
-- Tablolar: routine_tasks, task_results, security_logs
-- ═══════════════════════════════════════════════════════════════════════════════════════
