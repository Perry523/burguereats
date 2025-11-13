#!/usr/bin/env node

/**
 * Check users script
 * This script checks for users in Supabase Auth that don't have records in our custom users table
 */

import knex from 'knex'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL not found in environment variables')
  process.exit(1)
}

console.log('🔍 Checking users...\n')

async function checkUsers() {
  const db = knex({
    client: 'postgresql',
    connection: {
      connectionString: DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    }
  })

  try {
    // Check users in our custom table
    const users = await db('users').select('*')
    
    console.log(`📊 Found ${users.length} users in custom users table:`)
    users.forEach(user => {
      console.log(`  - ${user.name} (${user.email}) - Finished: ${user.finished_register}`)
    })

    if (users.length === 0) {
      console.log('  (No users found)')
    }

  } catch (error) {
    console.error('❌ Error checking users:', error.message)
  } finally {
    await db.destroy()
  }
}

checkUsers().catch(console.error)
