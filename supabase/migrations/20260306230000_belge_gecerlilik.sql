-- YiSA-S: athlete_health_records'a saglik_raporu_gecerlilik kolonu ekle
-- Belge gecerlilik uyari sistemi icin
-- Tarih: 6 Mart 2026

ALTER TABLE athlete_health_records
  ADD COLUMN IF NOT EXISTS saglik_raporu_gecerlilik DATE;

COMMENT ON COLUMN athlete_health_records.saglik_raporu_gecerlilik
  IS 'Saglik raporunun son gecerlilik tarihi — belge uyari sistemi tarafindan kullanilir';

CREATE INDEX IF NOT EXISTS idx_athlete_health_gecerlilik
  ON athlete_health_records(saglik_raporu_gecerlilik);
