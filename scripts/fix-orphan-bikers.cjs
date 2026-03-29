const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_ANON_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixOrphans() {
  console.log("Checking for orphaned Entregadores...");

  // 1. Fetch all bikers from Entregadores
  const { data: bikers, error: bikersError } = await supabase
    .from("Entregadores")
    .select("id, name, email, userId, phone, password_hash");

  if (bikersError) {
    console.error("Error fetching bikers:", bikersError);
    return;
  }

  console.log(`Found ${bikers.length} bikers. Checking each for a user record...`);

  let fixedCount = 0;
  for (const biker of bikers) {
    // 2. Check if a user record exists with this userId
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("id", biker.userId)
      .maybeSingle();

    if (user) {
      // User exists, move to next
      continue;
    }

    console.log(`Biker ${biker.email} has no user record (userId: ${biker.userId}). Fixing...`);

    // 3. Create missing user record
    // We use the same userId stored in Entregadores to restore the link
    const { error: insertError } = await supabase.from("users").insert({
      id: biker.userId,
      name: biker.name,
      email: biker.email,
      phone: biker.phone,
      type: "biker",
      password_hash: biker.password_hash,
      finished_register: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (insertError) {
      console.error(`Failed to create user record for ${biker.email}:`, insertError);
    } else {
      console.log(`Fixed user record for ${biker.email}`);
      fixedCount++;
    }
  }

  console.log(`\nRepair complete! Fixed ${fixedCount} orphaned records.`);
}

fixOrphans().catch(console.error);
