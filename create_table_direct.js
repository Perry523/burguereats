import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Read environment variables
dotenv.config({ path: './.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

console.log('Creating post_sketches table...');
console.log('Supabase URL:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createTable() {
  try {
    // Try to create the table using a simple insert/select to test if it exists
    const { data, error } = await supabase
      .from('post_sketches')
      .select('id')
      .limit(1);
      
    if (error && error.code === 'PGRST106') {
      console.log('❌ Table does not exist. Please create it manually.');
      console.log('\n📋 SQL to run in Supabase Dashboard:');
      console.log(`
CREATE TABLE post_sketches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    generated_content JSONB,
    text_elements JSONB DEFAULT '[]'::jsonb,
    carousel_settings JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_post_sketches_user_id ON post_sketches(user_id);
CREATE INDEX idx_post_sketches_created_at ON post_sketches(created_at DESC);

-- Enable RLS
ALTER TABLE post_sketches ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own sketches" ON post_sketches
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sketches" ON post_sketches
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sketches" ON post_sketches
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sketches" ON post_sketches
    FOR DELETE USING (auth.uid() = user_id);
      `);
      
      console.log('\n🔗 Steps:');
      console.log('1. Go to https://supabase.com/dashboard');
      console.log('2. Select your project');
      console.log('3. Go to SQL Editor');
      console.log('4. Run the SQL above');
      console.log('5. Test the sketches functionality');
      
    } else if (error) {
      console.error('❌ Error checking table:', error);
    } else {
      console.log('✅ Table exists and is accessible!');
      console.log('Found', data.length, 'records');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createTable();
