-- =====================================================
-- YİSA-S VİTRİN SİSTEMİ — TEK SQL
-- Supabase Dashboard → SQL Editor → Yapıştır → Run
-- demo_requests tablosunda source = 'vitrin' kabul edilir (/vitrin sayfasından gelen talepler)
-- =====================================================
-- Not: Constraint adı farklıysa önce şunu çalıştırın:
--   SELECT conname FROM pg_constraint c
--   JOIN pg_class t ON c.conrelid = t.oid
--   WHERE t.relname = 'demo_requests' AND c.contype = 'c';
--   Sonra DROP CONSTRAINT <conname>; ile eski kısıtı kaldırın.
-- =====================================================

ALTER TABLE demo_requests DROP CONSTRAINT IF EXISTS demo_requests_source_check;
ALTER TABLE demo_requests ADD CONSTRAINT demo_requests_source_check
  CHECK (source IN ('www', 'demo', 'fiyatlar', 'vitrin'));
