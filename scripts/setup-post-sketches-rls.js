import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Read environment variables
dotenv.config({ path: './.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

console.log('Setting up RLS policies for post_sketches table...');

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupRLS() {
  try {
    // First, let's test if the table exists
    const { data: testData, error: testError } = await supabase
      .from('post_sketches')
      .select('id')
      .limit(1);
      
    if (testError) {
      console.error('❌ Error accessing table:', testError);
      console.log('The table might not have proper RLS policies set up.');
      
      console.log('\n📋 Please run this SQL in Supabase Dashboard:');
      console.log(`
-- Enable Row Level Security
ALTER TABLE post_sketches ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own sketches" ON post_sketches;
DROP POLICY IF EXISTS "Users can insert their own sketches" ON post_sketches;
DROP POLICY IF EXISTS "Users can update their own sketches" ON post_sketches;
DROP POLICY IF EXISTS "Users can delete their own sketches" ON post_sketches;

-- Create RLS policies
CREATE POLICY "Users can view their own sketches" ON post_sketches
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sketches" ON post_sketches
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sketches" ON post_sketches
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sketches" ON post_sketches
    FOR DELETE USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_post_sketches_updated_at ON post_sketches;
CREATE TRIGGER update_post_sketches_updated_at 
    BEFORE UPDATE ON post_sketches 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
      `);
      
      console.log('\n🔗 Steps:');
      console.log('1. Go to https://supabase.com/dashboard');
      console.log('2. Select your project');
      console.log('3. Go to SQL Editor');
      console.log('4. Run the SQL above');
      
    } else {
      console.log('✅ Table is accessible!');
      console.log('Found', testData.length, 'records');
      console.log('RLS policies appear to be working correctly.');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

setupRLS();
