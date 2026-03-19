const knex = require('knex')(require('./knexfile.cjs').development);

async function fixFK() {
  await knex.raw("ALTER TABLE clients DROP CONSTRAINT IF EXISTS clients_company_id_foreign");
  console.log("Dropped FK constraint clients_company_id_foreign — company_id is now unconstrained.");
  await knex.destroy();
}

fixFK().catch(e => { console.error(e); process.exit(1); });
