const dotenv = require('dotenv');
dotenv.config();
const { createClient } = require('@supabase/supabase-js');

async function checkSchema() {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
  
  const { error } = await supabase.from('notifications').insert([{
    user_id: '00000000-0000-0000-0000-000000000000',
    title: 'Test',
  }]);
  console.log('Insert test with valid UUID:', error || 'Success');

  const { error: e2 } = await supabase.from('notifications').insert([{
    title: 'Test Null',
  }]);
  console.log('Insert test with null user_id:', e2 || 'Success');
}

checkSchema();
