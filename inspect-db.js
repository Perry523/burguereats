import knex from 'knex';
import dotenv from 'dotenv';
dotenv.config();

const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  }
});

async function listTables() {
  try {
    const res = await db.raw(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('Tables in public schema:');
    res.rows.forEach(row => console.log(`- ${row.table_name}`));
    
    // Also check columns of Entregadores
    const columns = await db.raw(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'Entregadores'
    `);
    console.log('\nColumns in Entregadores:');
    columns.rows.forEach(col => console.log(`- ${col.column_name} (${col.data_type})`));

    // Also check columns of Company
    const companyCols = await db.raw(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'Company'
    `);
    console.log('\nColumns in Company:');
    companyCols.rows.forEach(col => console.log(`- ${col.column_name} (${col.data_type})`));

  } catch (err) {
    console.error(err);
  } finally {
    await db.destroy();
  }
}

listTables();
