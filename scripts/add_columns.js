import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Client } = pg;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function run() {
  try {
    await client.connect();
    console.log("Connected to database");
    
    // Check if columns exist, if not, add them
    const addColQuery = `
      ALTER TABLE biker_payouts 
      ADD COLUMN IF NOT EXISTS week_from DATE,
      ADD COLUMN IF NOT EXISTS week_to DATE;
    `;
    
    await client.query(addColQuery);
    console.log("Columns added successfully");
    
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.end();
  }
}

run();
