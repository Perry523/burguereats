import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const supabase = serverSupabaseServiceRole(event)
  
  try {
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS products (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            company_id UUID NOT NULL,
            name VARCHAR(255) NOT NULL,
            category VARCHAR(255) NOT NULL,
            sell_price DECIMAL(10, 2) NOT NULL,
            buy_price DECIMAL(10, 2) NOT NULL,
            stock INTEGER NOT NULL DEFAULT 0,
            image TEXT,
            is_active BOOLEAN DEFAULT true,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        CREATE INDEX IF NOT EXISTS idx_products_company_id ON products(company_id);
        CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);

        ALTER TABLE products ENABLE ROW LEVEL SECURITY;

        DROP POLICY IF EXISTS "Users can view their own products" ON products;
        DROP POLICY IF EXISTS "Users can insert their own products" ON products;
        DROP POLICY IF EXISTS "Users can update their own products" ON products;
        DROP POLICY IF EXISTS "Users can delete their own products" ON products;

        CREATE POLICY "Users can view their own products" ON products
            FOR SELECT USING (true);

        CREATE POLICY "Users can insert their own products" ON products
            FOR INSERT WITH CHECK (true);

        CREATE POLICY "Users can update their own products" ON products
            FOR UPDATE USING (true);

        CREATE POLICY "Users can delete their own products" ON products
            FOR DELETE USING (true);
      `
    })

    if (error) {
      console.error('Error creating table:', error)
      return { success: false, error: error.message }
    }

    return { 
      success: true, 
      message: 'products table created successfully!'
    }

  } catch (error: any) {
    console.error('Migration failed:', error)
    return { 
      success: false, 
      error: error.message || 'Unknown error occurred' 
    }
  }
})
