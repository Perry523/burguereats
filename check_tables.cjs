const knexConfig = require('./knexfile.cjs');
const knex = require('knex')(knexConfig.development);

async function listTables() {
  try {
    const result = await knex.raw("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
    console.log('Tables in public schema:', result.rows.map(r => r.table_name));
  } catch (error) {
    console.error('Error listing tables:', error);
  } finally {
    await knex.destroy();
  }
}

listTables();
