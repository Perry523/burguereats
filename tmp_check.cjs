const config = require('./knexfile.cjs');
const knex = require('knex')(config.development);

async function check() {
  const columns = await knex('users').columnInfo();
  console.log(columns);
  
  // also check how many users there are and their types
  const users = await knex('users').select('id', 'name', 'type', 'company_id').catch(e => console.log('company_id col might not exist'));
  console.log('Sample users:', await knex('users').select('*').limit(3));
  process.exit(0);
}

check();
