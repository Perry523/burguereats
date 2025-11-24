const knexConfig = require('./knexfile.cjs');
const knex = require('knex')(knexConfig.development);

async function listColumns() {
  try {
    const companyCols = await knex('Company').columnInfo();
    console.log('Company columns:', Object.keys(companyCols));

    const adminCols = await knex('Admins').columnInfo();
    console.log('Admins columns:', Object.keys(adminCols));
    
    // Check if there is a table linking users and companies
    // Maybe 'CompanyUser'?
    const tables = await knex.raw("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
    const tableNames = tables.rows.map(r => r.table_name);
    console.log('All tables:', tableNames);

  } catch (error) {
    console.error('Error listing columns:', error);
  } finally {
    await knex.destroy();
  }
}

listColumns();
