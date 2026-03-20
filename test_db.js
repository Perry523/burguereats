import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

async function checkSchema() {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
  
  // We can query information_schema.columns or we can just run a raw query using supabase.rpc if available.
  // Wait, Supabase js doesn't allow raw queries. Let's just insert a dummy row.
  const { data, error } = await supabase.from('notifications').insert([{
    user_id: '00000000-0000-0000-0000-000000000000',
    title: 'Test',
  }]);
  console.log('Insert test with valid UUID:', error || 'Success');

  const { data: d2, error: e2 } = await supabase.from('notifications').insert([{
    title: 'Test Null',
  }]);
  console.log('Insert test with null user_id:', e2 || 'Success');
}

checkSchema();
