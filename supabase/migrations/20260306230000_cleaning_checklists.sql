-- YİSA-S: cleaning_checklists — Temizlik personeli günlük checklist
-- Tarih: 6 Mart 2026

CREATE TABLE IF NOT EXISTS cleaning_checklists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tarih DATE NOT NULL DEFAULT CURRENT_DATE,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tenant_id, user_id, tarih)
);

CREATE INDEX IF NOT EXISTS idx_cleaning_checklists_tenant ON cleaning_checklists(tenant_id);
CREATE INDEX IF NOT EXISTS idx_cleaning_checklists_tarih ON cleaning_checklists(tarih);
CREATE INDEX IF NOT EXISTS idx_cleaning_checklists_user ON cleaning_checklists(user_id);

COMMENT ON TABLE cleaning_checklists IS 'Temizlik personeli gunluk checklist kayitlari — tenant_id ile izole';
