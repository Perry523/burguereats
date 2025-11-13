console.log('🍅 Setting up post_sketches RLS policies...\n');

console.log('The table was created by migration, but needs RLS policies.');
console.log('Please run this SQL in your Supabase Dashboard:\n');

console.log('📋 SQL to run in Supabase Dashboard → SQL Editor:');
console.log('=' .repeat(60));

const sql = `
-- Enable Row Level Security
ALTER TABLE post_sketches ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (safe to run)
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

-- Create updated_at trigger function (if it doesn't exist)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_post_sketches_updated_at ON post_sketches;
CREATE TRIGGER update_post_sketches_updated_at 
    BEFORE UPDATE ON post_sketches 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
`;

console.log(sql);
console.log('=' .repeat(60));

console.log('\n🔗 Steps to fix:');
console.log('1. Go to https://supabase.com/dashboard');
console.log('2. Select your project');
console.log('3. Go to SQL Editor');
console.log('4. Copy and paste the SQL above');
console.log('5. Click "Run" to execute');
console.log('6. Refresh the sketches page');

console.log('\n✅ After running the SQL, the sketches functionality will work!');
console.log('🍅 The table exists, it just needs proper security policies.');
