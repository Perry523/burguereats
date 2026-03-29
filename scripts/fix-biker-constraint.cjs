const knex = require('knex');
require('dotenv').config();

const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  }
});

async function fix() {
  try {
    console.log('Attempting to drop NOT NULL constraint on Entregadores.companyId...');
    await db.raw('ALTER TABLE "Entregadores" ALTER COLUMN "companyId" DROP NOT NULL;');
    console.log('✅ Successfully altered Entregadores table');
  } catch (err) {
    if (err.message.includes('column "companyId" does not exist')) {
        console.log('Column "companyId" not found, trying "company_id"...');
        try {
            await db.raw('ALTER TABLE "Entregadores" ALTER COLUMN "company_id" DROP NOT NULL;');
            console.log('✅ Successfully altered Entregadores table (company_id)');
        } catch (err2) {
            console.error('❌ Error with company_id:', err2.message);
        }
    } else {
        console.error('❌ Error:', err.message);
    }
  } finally {
    await db.destroy();
  }
}

fix();
