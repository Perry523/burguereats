import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runProductsMigration() {
  console.log('🚀 Running products table migration...\n');

  try {
    // Check if table exists
    const { data: checkData, error: checkError } = await supabase
      .from('products')
      .select('count')
      .limit(1);

    if (!checkError) {
      console.log('✅ Products table already exists!');
      console.log('📊 Checking table structure...');
      
      const { data: sample } = await supabase
        .from('products')
        .select('*')
        .limit(1);
      
      if (sample && sample.length > 0) {
        console.log('Sample product:', sample[0]);
      } else {
        console.log('Table exists but is empty.');
      }
      return;
    }

    console.log('⚠️  Products table does not exist. Creating it now...\n');
    console.log('Please run the following SQL in your Supabase Dashboard SQL Editor:\n');
    console.log('=' .repeat(80));
    console.log(`
-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  category_id UUID REFERENCES "Category"(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  buy_price DECIMAL(10, 2) DEFAULT 0,
  sell_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  quantity INTEGER DEFAULT 0,
  image TEXT,
  is_active BOOLEAN DEFAULT true,
  variants JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS products_company_id_idx ON products(company_id);
CREATE INDEX IF NOT EXISTS products_category_id_idx ON products(category_id);
CREATE INDEX IF NOT EXISTS products_is_active_idx ON products(is_active);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Enable read access for all users" ON products;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON products;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON products;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON products;

-- Create RLS policies
CREATE POLICY "Enable read access for all users" ON products
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON products
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Enable update for authenticated users" ON products
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Enable delete for authenticated users" ON products
  FOR DELETE USING (auth.uid() IS NOT NULL);
`);
    console.log('=' .repeat(80));
    console.log('\n📝 Steps:');
    console.log('1. Go to https://supabase.com/dashboard');
    console.log('2. Select your project');
    console.log('3. Go to SQL Editor');
    console.log('4. Copy the SQL above');
    console.log('5. Paste and Run it');
    console.log('6. Run this script again to verify\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

runProductsMigration();
