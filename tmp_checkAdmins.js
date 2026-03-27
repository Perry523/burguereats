require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function checkSchema() {
  const supabaseUrl = process.env.SUPABASE_URL || 'http://127.0.0.1:54321';
  const supabaseKey = process.env.SUPABASE_ANON_KEY || 'dummy';
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  const { data, error } = await supabase.from('Admins').select('*').limit(1);
  if (error) {
    console.error('Error Admin:', error);
  } else {
    console.log('Sample Admin row cols:', data[0] ? Object.keys(data[0]) : 'No rows found');
  }
}

checkSchema();
