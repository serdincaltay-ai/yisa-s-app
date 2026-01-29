-- ═══════════════════════════════════════════════════════════════════════════════════════
-- YİSA-S BACKUP - 01 TEMEL TABLOLAR
-- Tüm tablolar: chat_messages, patron_commands, ceo_tasks, celf_logs, audit_log,
--              routine_tasks, task_results, security_logs, system_backups
-- Tarih: 30 Ocak 2026
-- Supabase SQL Editor'da 01 → 02 → 03 sırasıyla çalıştırın.
-- ═══════════════════════════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. CHAT_MESSAGES
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    ai_providers TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at DESC);

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. PATRON_COMMANDS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS patron_commands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    command TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'modified')),
    decision VARCHAR(20) CHECK (decision IN ('approve', 'reject', 'modify')),
    decision_at TIMESTAMP WITH TIME ZONE,
    modify_text TEXT,
    ceo_task_id UUID,
    output_payload JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_patron_commands_user_id ON patron_commands(user_id);
CREATE INDEX IF NOT EXISTS idx_patron_commands_status ON patron_commands(status);
CREATE INDEX IF NOT EXISTS idx_patron_commands_created_at ON patron_commands(created_at DESC);

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. CEO_TASKS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ceo_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    task_description TEXT NOT NULL,
    task_type VARCHAR(50) NOT NULL,
    director_key VARCHAR(50),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'celf_running', 'completed', 'failed', 'cancelled')),
    result_payload JSONB DEFAULT '{}',
    patron_command_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ceo_tasks_user_id ON ceo_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_ceo_tasks_status ON ceo_tasks(status);
CREATE INDEX IF NOT EXISTS idx_ceo_tasks_task_type ON ceo_tasks(task_type);
CREATE INDEX IF NOT EXISTS idx_ceo_tasks_created_at ON ceo_tasks(created_at DESC);

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. CELF_LOGS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS celf_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ceo_task_id UUID REFERENCES ceo_tasks(id) ON DELETE SET NULL,
    director_key VARCHAR(50) NOT NULL,
    action VARCHAR(100),
    input_summary TEXT,
    output_summary TEXT,
    payload JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_celf_logs_ceo_task_id ON celf_logs(ceo_task_id);
CREATE INDEX IF NOT EXISTS idx_celf_logs_director_key ON celf_logs(director_key);
CREATE INDEX IF NOT EXISTS idx_celf_logs_created_at ON celf_logs(created_at DESC);

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. AUDIT_LOG
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50),
    entity_id UUID,
    user_id UUID,
    payload JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_audit_log_action ON audit_log(action);
CREATE INDEX IF NOT EXISTS idx_audit_log_entity ON audit_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON audit_log(created_at DESC);

-- ─────────────────────────────────────────────────────────────────────────────
-- 6. ROUTINE_TASKS
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

-- ─────────────────────────────────────────────────────────────────────────────
-- 7. TASK_RESULTS
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

-- ─────────────────────────────────────────────────────────────────────────────
-- 8. SECURITY_LOGS
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

-- ─────────────────────────────────────────────────────────────────────────────
-- 9. SYSTEM_BACKUPS (Yedek meta tablosu)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS system_backups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version TEXT NOT NULL,
  backup_type TEXT NOT NULL CHECK (backup_type IN ('full', 'config', 'code')),
  backup_data JSONB NOT NULL,
  description TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_system_backups_version ON system_backups(version);
CREATE INDEX IF NOT EXISTS idx_system_backups_created_at ON system_backups(created_at DESC);
