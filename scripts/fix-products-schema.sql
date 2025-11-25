-- Fix Products Table Schema for Production
-- Run this in your Supabase SQL Editor

-- 1. Rename 'stock' column to 'quantity' to match ProductModel
ALTER TABLE products RENAME COLUMN stock TO quantity;

-- 2. Add missing 'description' column
ALTER TABLE products ADD COLUMN IF NOT EXISTS description TEXT;

-- 3. Add missing 'variants' column
ALTER TABLE products ADD COLUMN IF NOT EXISTS variants JSONB DEFAULT '[]';

-- 4. Verify the changes
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'products'
ORDER BY ordinal_position;
