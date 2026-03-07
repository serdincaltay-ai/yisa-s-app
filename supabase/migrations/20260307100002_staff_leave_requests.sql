-- Çalışan izin talepleri tablosu
CREATE TABLE IF NOT EXISTS staff_leave_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  leave_date DATE NOT NULL,
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  is_olcum_day BOOLEAN DEFAULT false,
  substitute_needed BOOLEAN DEFAULT false,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE staff_leave_requests ENABLE ROW LEVEL SECURITY;

-- Staff kendi taleplerini görebilir
CREATE POLICY staff_leave_own_select ON staff_leave_requests
  FOR SELECT USING (user_id = auth.uid());

-- Staff yeni talep oluşturabilir
CREATE POLICY staff_leave_own_insert ON staff_leave_requests
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Service role tüm talepleri görebilir/güncelleyebilir
CREATE POLICY staff_leave_service ON staff_leave_requests
  FOR ALL USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_staff_leave_tenant ON staff_leave_requests(tenant_id);
CREATE INDEX IF NOT EXISTS idx_staff_leave_user ON staff_leave_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_staff_leave_date ON staff_leave_requests(leave_date);
