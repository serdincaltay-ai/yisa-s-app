-- athlete_movements: Sporcu hareket takibi
-- Antrenör bir sporcuya hareket atar, tamamlandığını işaretler.
-- Veli kendi çocuğunun tamamlanan hareketlerini görebilir.

CREATE TABLE IF NOT EXISTS athlete_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id UUID REFERENCES athletes(id) ON DELETE CASCADE,
  movement_id UUID,  -- movements tablosuna FK (ileride oluşturulacak)
  tamamlandi BOOLEAN DEFAULT false,
  tamamlanma_tarihi DATE,
  antrenor_notu TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_athlete_movements_athlete_id ON athlete_movements(athlete_id);
CREATE INDEX IF NOT EXISTS idx_athlete_movements_movement_id ON athlete_movements(movement_id);
CREATE INDEX IF NOT EXISTS idx_athlete_movements_tamamlandi ON athlete_movements(tamamlandi);

ALTER TABLE athlete_movements ENABLE ROW LEVEL SECURITY;

-- RLS: tenant_id üzerinden athletes JOIN ile izolasyon
-- Authenticated kullanıcılar sadece kendi tenant'ındaki sporcuların hareketlerini görebilir
DROP POLICY IF EXISTS "Tenant users can view athlete_movements" ON athlete_movements;
CREATE POLICY "Tenant users can view athlete_movements" ON athlete_movements
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM athletes a
      JOIN user_tenants ut ON ut.tenant_id = a.tenant_id
      WHERE a.id = athlete_movements.athlete_id
        AND ut.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Tenant users can insert athlete_movements" ON athlete_movements;
CREATE POLICY "Tenant users can insert athlete_movements" ON athlete_movements
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM athletes a
      JOIN user_tenants ut ON ut.tenant_id = a.tenant_id
      WHERE a.id = athlete_movements.athlete_id
        AND ut.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Tenant users can update athlete_movements" ON athlete_movements;
CREATE POLICY "Tenant users can update athlete_movements" ON athlete_movements
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM athletes a
      JOIN user_tenants ut ON ut.tenant_id = a.tenant_id
      WHERE a.id = athlete_movements.athlete_id
        AND ut.user_id = auth.uid()
    )
  );

-- Service role tam erişim
DROP POLICY IF EXISTS "Service can manage athlete_movements" ON athlete_movements;
CREATE POLICY "Service can manage athlete_movements" ON athlete_movements
  FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
