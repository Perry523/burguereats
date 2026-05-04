import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: "c:/Users/Perry/Desktop/restaurante/dash/.env" });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function alterTables() {
  // We'll just run queries to fetch a record to see the keys.
  const { data: bData } = await supabase.from('Entregadores').select('*').limit(1);
  console.log("Entregadores columns:", bData ? Object.keys(bData[0] || {}) : "No data");

  const { data: cData } = await supabase.from('Company').select('*').limit(1);
  console.log("Company columns:", cData ? Object.keys(cData[0] || {}) : "No data");
}

alterTables();
