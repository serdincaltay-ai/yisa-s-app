-- ═══════════════════════════════════════════════════════════════════════════════════════
-- YİSA-S PATRON KOMUTU - CHAT, CEO, CELF, ONAY TABLOLARI
-- chat_messages, patron_commands, ceo_tasks, celf_logs, audit_log
-- Tarih: 30 Ocak 2026
-- Supabase SQL Editor'da çalıştırın.
-- ═══════════════════════════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. CHAT_MESSAGES - Her mesaj kaydı
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

-- RLS: kullanıcı kendi mesajlarını görebilir (auth.uid() = user_id)
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own chat_messages" ON chat_messages;
CREATE POLICY "Users can read own chat_messages" ON chat_messages
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service can insert chat_messages" ON chat_messages;
CREATE POLICY "Service can insert chat_messages" ON chat_messages
    FOR INSERT WITH CHECK (true);

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. PATRON_COMMANDS - Patron komutları ve onay kararları
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS patron_commands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    command TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN (
        'pending',      -- Patron onayı bekliyor
        'approved',     -- Onaylandı
        'rejected',     -- Reddedildi
        'modified'      -- Değiştirildi, yeniden işlendi
    )),
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

ALTER TABLE patron_commands ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own patron_commands" ON patron_commands;
CREATE POLICY "Users can read own patron_commands" ON patron_commands
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service can insert update patron_commands" ON patron_commands;
CREATE POLICY "Service can insert update patron_commands" ON patron_commands
    FOR ALL USING (true) WITH CHECK (true);

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. CEO_TASKS - CEO sınıflandırma ve görev kayıtları
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ceo_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    task_description TEXT NOT NULL,
    task_type VARCHAR(50) NOT NULL,  -- araştırma, tasarım, kod, genel (research, design, code, general)
    director_key VARCHAR(50),       -- CFO, CTO, CMO, ...
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN (
        'pending', 'assigned', 'celf_running', 'completed', 'failed', 'cancelled'
    )),
    result_payload JSONB DEFAULT '{}',
    patron_command_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ceo_tasks_user_id ON ceo_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_ceo_tasks_status ON ceo_tasks(status);
CREATE INDEX IF NOT EXISTS idx_ceo_tasks_task_type ON ceo_tasks(task_type);
CREATE INDEX IF NOT EXISTS idx_ceo_tasks_created_at ON ceo_tasks(created_at DESC);

ALTER TABLE ceo_tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own ceo_tasks" ON ceo_tasks;
CREATE POLICY "Users can read own ceo_tasks" ON ceo_tasks
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service can manage ceo_tasks" ON ceo_tasks;
CREATE POLICY "Service can manage ceo_tasks" ON ceo_tasks
    FOR ALL USING (true) WITH CHECK (true);

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. CELF_LOGS - CELF direktörlük işlem logları
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

ALTER TABLE celf_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service can manage celf_logs" ON celf_logs;
CREATE POLICY "Service can manage celf_logs" ON celf_logs
    FOR ALL USING (true) WITH CHECK (true);

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. AUDIT_LOG - Onay/red/değişiklik denetim kaydı
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action VARCHAR(50) NOT NULL,   -- approve, reject, modify
    entity_type VARCHAR(50),      -- patron_command, ceo_task, approval_queue
    entity_id UUID,
    user_id UUID,
    payload JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_log_action ON audit_log(action);
CREATE INDEX IF NOT EXISTS idx_audit_log_entity ON audit_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON audit_log(created_at DESC);

ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service can insert audit_log" ON audit_log;
CREATE POLICY "Service can insert audit_log" ON audit_log
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can read own audit_log" ON audit_log;
CREATE POLICY "Users can read own audit_log" ON audit_log
    FOR SELECT USING (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- Trigger: patron_commands updated_at
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_patron_commands_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_patron_commands_updated ON patron_commands;
CREATE TRIGGER trg_patron_commands_updated
    BEFORE UPDATE ON patron_commands
    FOR EACH ROW EXECUTE PROCEDURE update_patron_commands_updated_at();

-- ceo_tasks updated_at
DROP TRIGGER IF EXISTS trg_ceo_tasks_updated ON ceo_tasks;
CREATE TRIGGER trg_ceo_tasks_updated
    BEFORE UPDATE ON ceo_tasks
    FOR EACH ROW EXECUTE PROCEDURE update_patron_commands_updated_at();

-- ═══════════════════════════════════════════════════════════════════════════════════════
-- KURULUM TAMAMLANDI
-- Tablolar: chat_messages, patron_commands, ceo_tasks, celf_logs, audit_log
-- ═══════════════════════════════════════════════════════════════════════════════════════
