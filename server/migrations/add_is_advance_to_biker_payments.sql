-- ============================================================
-- Migration: Add is_advance column to biker_payments
-- Run this in the Supabase SQL Editor
-- ============================================================

-- 1. Add the is_advance column (false by default = normal payment record)
ALTER TABLE biker_payments
  ADD COLUMN IF NOT EXISTS is_advance BOOLEAN NOT NULL DEFAULT FALSE;

-- 2. (Optional) Add an index to speed up financial queries that filter by this field
CREATE INDEX IF NOT EXISTS idx_biker_payments_is_advance
  ON biker_payments (biker_id, is_paid, is_advance);

-- ============================================================
-- CLEANUP (optional): Migrate legacy advance_money data
-- If you had advances stored as biker_payouts with type='advance'
-- and want to convert them to records in biker_payments, run:
-- ============================================================

-- INSERT INTO biker_payments (id, biker_id, company_id, date, amount, total_deliveries, is_advance, is_paid, created_at, updated_at)
-- SELECT
--   gen_random_uuid(),
--   bp.biker_id,
--   NULL,               -- no company for advances
--   bp.created_at::date,
--   bp.amount_paid,
--   0,
--   TRUE,               -- mark as advance
--   FALSE,              -- NOT paid yet (adjust if needed)
--   bp.created_at,
--   bp.created_at
-- FROM biker_payouts bp
-- WHERE bp.type = 'advance';

-- After migrating, you can also reset advance_money to 0 in Entregadores:
-- UPDATE "Entregadores" SET advance_money = 0;
