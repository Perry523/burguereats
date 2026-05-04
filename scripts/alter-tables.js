import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config({ path: "c:/Users/Perry/Desktop/restaurante/dash/.env" });

async function run() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  await client.connect();
  console.log("Connected to PostgreSQL");

  try {
    await client.query(`ALTER TABLE "Entregadores" ADD COLUMN IF NOT EXISTS "pix_key" text;`);
    console.log("Added pix_key to Entregadores");
    
    await client.query(`ALTER TABLE "Company" ADD COLUMN IF NOT EXISTS "isActive" boolean DEFAULT true;`);
    console.log("Added isActive to Company");
  } catch (err) {
    console.error("Error executing query:", err);
  } finally {
    await client.end();
  }
}

run();
