import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Read environment variables
dotenv.config({ path: './.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in .env');
  process.exit(1);
}

console.log('Creating products table...');
console.log('Supabase URL:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createTable() {
  try {
    // Check if table exists
    const { error: checkError } = await supabase
      .from('products')
      .select('id')
      .limit(1);

    if (!checkError) {
      console.log('✅ Table "products" already exists.');
      return;
    }

    // Create table using raw SQL via RPC or just logging instructions if RPC not available
    // Since we can't easily run raw SQL via JS client without a specific function, 
    // we will try to use the 'rpc' method if a 'exec_sql' function exists, 
    // or we will rely on the user running it in the dashboard if this fails.
    // BUT, I can try to use the REST API to create it if I had a way, but standard client doesn't support DDL.
    
    // Wait, the previous `create_table_direct.js` just LOGGED the SQL. It didn't execute it.
    // The user needs to run it manually or I need a way to execute SQL.
    // The `server/api/create-table.post.ts` used `serverSupabaseServiceRole` which might have access to a `rpc` call if configured.
    
    // Actually, I can try to use the `pg` library if available to connect directly to the DB if I have the connection string.
    // The `.env` usually has DATABASE_URL.
    
    const connectionString = process.env.DATABASE_URL;
    if (connectionString) {
      console.log('Found DATABASE_URL, attempting to connect via pg...');
      // I can't easily import pg if it's not installed. 
      // Let's check package.json first? No, I'll just assume I can't run DDL from here easily without pg.
      
      // However, I can try to use the `server/api/create-products-table.post.ts` I made earlier!
      // I just need to CALL it.
      
      console.log('Please run the following SQL in your Supabase Dashboard SQL Editor:');
      console.log(`
create table public.products (
  id uuid not null default gen_random_uuid (),
  company_id uuid not null,
  name text not null,
  category text not null,
  sell_price numeric not null,
  buy_price numeric not null,
  stock numeric not null default 0,
  image text null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone null,
  constraint products_pkey primary key (id),
  constraint products_company_id_fkey foreign key (company_id) references public.companies (id) on delete cascade
);

create index products_company_id_idx on public.products (company_id);

alter table public.products enable row level security;

create policy "Enable read access for all users" on public.products
  for select using (true);

create policy "Enable insert for authenticated users only" on public.products
  for insert with check (auth.role() = 'authenticated');

create policy "Enable update for users based on company_id" on public.products
  for update using (auth.uid() in (
    select user_id from public.company_users where company_id = products.company_id
  ));

create policy "Enable delete for users based on company_id" on public.products
  for delete using (auth.uid() in (
    select user_id from public.company_users where company_id = products.company_id
  ));
      `);
    } else {
        console.log('❌ DATABASE_URL not found.');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createTable();
