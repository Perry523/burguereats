export default defineEventHandler(async (event) => {
  const supabase = serverSupabaseServiceRole(event);
  
  try {
    // Create the post_sketches table using raw SQL
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `
        -- Create post_sketches table for saving Instagram post drafts
        CREATE TABLE IF NOT EXISTS post_sketches (
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

        -- Create indexes for better performance
        CREATE INDEX IF NOT EXISTS idx_post_sketches_user_id ON post_sketches(user_id);
        CREATE INDEX IF NOT EXISTS idx_post_sketches_created_at ON post_sketches(created_at DESC);

        -- Enable Row Level Security (RLS)
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

        -- Create updated_at trigger function if it doesn't exist
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $$ language 'plpgsql';

        -- Create trigger
        DROP TRIGGER IF EXISTS update_post_sketches_updated_at ON post_sketches;
        CREATE TRIGGER update_post_sketches_updated_at 
            BEFORE UPDATE ON post_sketches 
            FOR EACH ROW 
            EXECUTE FUNCTION update_updated_at_column();
      `
    });

    if (error) {
      console.error('Error creating table:', error);
      return { success: false, error: error.message };
    }

    // Test the table by trying to query it
    const { data: testData, error: testError } = await supabase
      .from('post_sketches')
      .select('*')
      .limit(1);
      
    if (testError) {
      console.error('Error testing table:', testError);
      return { success: false, error: testError.message };
    }

    return { 
      success: true, 
      message: 'post_sketches table created successfully!',
      data: testData 
    };

  } catch (error) {
    console.error('Migration failed:', error);
    return { 
      success: false, 
      error: error.message || 'Unknown error occurred' 
    };
  }
});
