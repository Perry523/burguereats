import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function addIsActiveColumn() {
  try {
    await client.connect();
    console.log('Connected to database.');

    const checkColumnQuery = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='products' AND column_name='is_active';
    `;
    const res = await client.query(checkColumnQuery);

    if (res.rows.length === 0) {
      console.log('Adding is_active column...');
      await client.query('ALTER TABLE products ADD COLUMN is_active BOOLEAN DEFAULT true;');
      console.log('is_active column added successfully.');
    } else {
      console.log('is_active column already exists.');
    }

  } catch (err) {
    console.error('Error adding column:', err);
  } finally {
    await client.end();
  }
}

addIsActiveColumn();
