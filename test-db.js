import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const connectionString = process.env.DATABASE_URL;

async function addBikerIdToOrders() {
    const client = new Client({
        connectionString,
    });

    try {
        await client.connect();
        
        const sql = `
          ALTER TABLE orders ADD COLUMN IF NOT EXISTS biker_id UUID REFERENCES "Entregadores"(id);
        `;

        await client.query(sql);
        console.log('orders table altered successfully with biker_id!');
    } catch (err) {
        console.error('Error altering table:', err);
    } finally {
        await client.end();
    }
}

addBikerIdToOrders();
