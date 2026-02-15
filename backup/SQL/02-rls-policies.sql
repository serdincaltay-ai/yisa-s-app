-- ═══════════════════════════════════════════════════════════════════════════════════════
-- YİSA-S BACKUP - 02 RLS POLİTİKALARI VE TRIGGER'LAR
-- 01-temel-tablolar.sql sonrası çalıştırın.
-- ═══════════════════════════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────────────────────
-- CHAT_MESSAGES
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can read own chat_messages" ON chat_messages;
CREATE POLICY "Users can read own chat_messages" ON chat_messages
    FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Service can insert chat_messages" ON chat_messages;
CREATE POLICY "Service can insert chat_messages" ON chat_messages
    FOR INSERT WITH CHECK (true);

-- ─────────────────────────────────────────────────────────────────────────────
-- PATRON_COMMANDS
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE patron_commands ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can read own patron_commands" ON patron_commands;
CREATE POLICY "Users can read own patron_commands" ON patron_commands
    FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Service can insert update patron_commands" ON patron_commands;
CREATE POLICY "Service can insert update patron_commands" ON patron_commands
    FOR ALL USING (true) WITH CHECK (true);

-- ─────────────────────────────────────────────────────────────────────────────
-- CEO_TASKS
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE ceo_tasks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can read own ceo_tasks" ON ceo_tasks;
CREATE POLICY "Users can read own ceo_tasks" ON ceo_tasks
    FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Service can manage ceo_tasks" ON ceo_tasks;
CREATE POLICY "Service can manage ceo_tasks" ON ceo_tasks
    FOR ALL USING (true) WITH CHECK (true);

-- ─────────────────────────────────────────────────────────────────────────────
-- CELF_LOGS
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE celf_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service can manage celf_logs" ON celf_logs;
CREATE POLICY "Service can manage celf_logs" ON celf_logs
    FOR ALL USING (true) WITH CHECK (true);

-- ─────────────────────────────────────────────────────────────────────────────
-- AUDIT_LOG
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service can insert audit_log" ON audit_log;
CREATE POLICY "Service can insert audit_log" ON audit_log
    FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Users can read own audit_log" ON audit_log;
CREATE POLICY "Users can read own audit_log" ON audit_log
    FOR SELECT USING (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- ROUTINE_TASKS, TASK_RESULTS, SECURITY_LOGS
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE routine_tasks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service can manage routine_tasks" ON routine_tasks;
CREATE POLICY "Service can manage routine_tasks" ON routine_tasks
    FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE task_results ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service can manage task_results" ON task_results;
CREATE POLICY "Service can manage task_results" ON task_results
    FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE security_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service can manage security_logs" ON security_logs;
CREATE POLICY "Service can manage security_logs" ON security_logs
    FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE system_backups ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service can manage system_backups" ON system_backups;
CREATE POLICY "Service can manage system_backups" ON system_backups
    FOR ALL USING (true) WITH CHECK (true);

-- ─────────────────────────────────────────────────────────────────────────────
-- TRIGGER: updated_at
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

DROP TRIGGER IF EXISTS trg_ceo_tasks_updated ON ceo_tasks;
CREATE TRIGGER trg_ceo_tasks_updated
    BEFORE UPDATE ON ceo_tasks
    FOR EACH ROW EXECUTE PROCEDURE update_patron_commands_updated_at();
