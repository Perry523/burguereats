require('dotenv').config();
const knex = require('knex');
const config = require('./knexfile.cjs');

console.log('Environment:', process.env.NODE_ENV || 'development');
console.log('Database URL exists:', !!process.env.DATABASE_URL);

const db = knex({
  ...config.development,
  connection: {
    ...config.development.connection,
    ssl: { rejectUnauthorized: false }
  }
});

db.raw('SELECT 1')
  .then(() => {
    console.log('Connection successful!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Connection failed:', err.message);
    process.exit(1);
  });
