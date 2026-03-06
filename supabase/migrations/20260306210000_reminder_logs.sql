-- Hatırlatma log tablosu — aidat hatırlatma cron'u tarafından kullanılır
CREATE TABLE IF NOT EXISTS reminder_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
  veli_user_id UUID NOT NULL,
  channel TEXT NOT NULL CHECK (channel IN ('push', 'email', 'sms')),
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'skipped')),
  error_message TEXT,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Performans indeksleri
CREATE INDEX IF NOT EXISTS idx_reminder_logs_payment ON reminder_logs(payment_id);
CREATE INDEX IF NOT EXISTS idx_reminder_logs_veli ON reminder_logs(veli_user_id);
CREATE INDEX IF NOT EXISTS idx_reminder_logs_sent ON reminder_logs(sent_at DESC);
