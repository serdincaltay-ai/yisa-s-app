-- patron_commands: komut, sonuc, durum, completed_at kolonları
-- Patron direkt akışında sonuç ve tamamlanma zamanı kaydı için.
-- Tarih: 3 Şubat 2026

-- Kolonlar (idempotent)
ALTER TABLE patron_commands ADD COLUMN IF NOT EXISTS komut TEXT;
ALTER TABLE patron_commands ADD COLUMN IF NOT EXISTS sonuc JSONB;
ALTER TABLE patron_commands ADD COLUMN IF NOT EXISTS durum TEXT;
ALTER TABLE patron_commands ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE;

-- Mevcut kayıtları güncelle: komut = command, onaylı olanlara durum/completed_at
UPDATE patron_commands
SET komut = command
WHERE komut IS NULL AND command IS NOT NULL;

UPDATE patron_commands
SET durum = 'tamamlandi',
    completed_at = COALESCE(updated_at, created_at)
WHERE status = 'approved' AND (durum IS NULL OR durum = '');

-- Bekleyen kayıtlar için varsayılan durum (opsiyonel)
UPDATE patron_commands
SET durum = 'beklemede'
WHERE status = 'pending' AND (durum IS NULL OR durum = '');
