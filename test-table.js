import { createClient } from "@supabase/supabase-js";
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTable() {
  const { data, error } = await supabase
    .from('biker_companies')
    .select('*')
    .limit(1);
    
  if (error) {
    console.log('Table biker_companies does not exist or error:', error.message);
  } else {
    console.log('Table biker_companies exists!');
  }
}

checkTable();
