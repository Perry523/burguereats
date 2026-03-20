require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function checkSchema() {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
  
  // We can query 1 row from orders to see its columns
  const { data, error } = await supabase.from('orders').select('*').limit(1);
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Sample order row (to see columns):', data[0] || 'No rows found');
  }
}

checkSchema();
