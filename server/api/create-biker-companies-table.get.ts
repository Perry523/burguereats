import { serverSupabaseServiceRole } from '#supabase/server';

export default defineEventHandler(async (event) => {
  const supabase = serverSupabaseServiceRole(event);
  
  try {
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `
        -- Create biker_companies table
        CREATE TABLE IF NOT EXISTS biker_companies (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            biker_id UUID NOT NULL,
            company_id TEXT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            UNIQUE(biker_id, company_id)
        );

        -- Create index
        CREATE INDEX IF NOT EXISTS idx_biker_companies_biker_id ON biker_companies(biker_id);

        -- Enable RLS
        ALTER TABLE biker_companies ENABLE ROW LEVEL SECURITY;

        -- Create generic policy for authenticated users (admins/bikers)
        DROP POLICY IF EXISTS "Allow all for authenticated" ON biker_companies;
        CREATE POLICY "Allow all for authenticated" ON biker_companies
            FOR ALL TO authenticated USING (true);
      `
    });

    if (error) {
      console.error('Error creating table:', error);
      return { success: false, error: error.message };
    }

    return { 
      success: true, 
      message: 'biker_companies table created successfully!',
    };

  } catch (error: any) {
    console.error('Migration failed:', error);
    return { 
      success: false, 
      error: error.message || 'Unknown error occurred' 
    };
  }
});
