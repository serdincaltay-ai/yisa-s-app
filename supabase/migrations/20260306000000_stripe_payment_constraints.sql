-- Stripe ödeme entegrasyonu için CHECK constraint güncellemesi
-- status: 'processing' eklendi (Stripe checkout başlatıldı, webhook bekleniyor)
-- payment_method: 'kredi_karti_online' eklendi (Stripe ile online ödeme)

ALTER TABLE package_payments DROP CONSTRAINT IF EXISTS package_payments_status_check;
ALTER TABLE package_payments ADD CONSTRAINT package_payments_status_check
  CHECK (status IN ('bekliyor', 'odendi', 'gecikmis', 'iptal', 'processing'));

ALTER TABLE package_payments DROP CONSTRAINT IF EXISTS package_payments_payment_method_check;
ALTER TABLE package_payments ADD CONSTRAINT package_payments_payment_method_check
  CHECK (payment_method IS NULL OR payment_method IN ('nakit', 'havale', 'kredi_karti', 'kredi_karti_online', 'diger'));
