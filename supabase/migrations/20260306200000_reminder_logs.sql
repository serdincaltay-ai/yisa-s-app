-- Aidat hatirlatma log tablosu
-- Her gonderilen bildirim (push / email / sms) icin bir kayit tutulur.

CREATE TABLE IF NOT EXISTS reminder_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
  veli_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  channel TEXT NOT NULL CHECK (channel IN ('push', 'email', 'sms')),
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reminder_logs_payment ON reminder_logs(payment_id);
CREATE INDEX IF NOT EXISTS idx_reminder_logs_veli ON reminder_logs(veli_user_id);
CREATE INDEX IF NOT EXISTS idx_reminder_logs_sent_at ON reminder_logs(sent_at);

ALTER TABLE reminder_logs ENABLE ROW LEVEL SECURITY;

-- Service role tam erisim
DROP POLICY IF EXISTS "Service can manage reminder_logs" ON reminder_logs;
CREATE POLICY "Service can manage reminder_logs" ON reminder_logs FOR ALL USING (true) WITH CHECK (true);

-- Veli kendi kayitlarini gorebilir
DROP POLICY IF EXISTS "Veli can read own reminder_logs" ON reminder_logs;
CREATE POLICY "Veli can read own reminder_logs" ON reminder_logs FOR SELECT USING (
  veli_user_id = auth.uid()
);
