const knexConfig = require("./knexfile.cjs");
const knex = require("knex")(knexConfig.development);

async function checkRLS() {
  try {
    // Check RLS policies on products table
    const policies = await knex.raw(`
      SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
      FROM pg_policies
      WHERE tablename = 'products'
    `);

    console.log("Current RLS policies on products table:");
    console.log(JSON.stringify(policies.rows, null, 2));
  } catch (error) {
    console.error("Error checking RLS:", error);
  } finally {
    await knex.destroy();
  }
}

checkRLS();
