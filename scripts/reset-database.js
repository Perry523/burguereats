#!/usr/bin/env node

/**
 * Reset database script
 * This script drops all tables and resets the migration state
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

console.log('🔄 Resetting database...\n')

async function resetDatabase() {
  const db = knex({
    client: 'postgresql',
    connection: {
      connectionString: DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    }
  })

  try {
    // Drop all tables in reverse order (to handle foreign keys)
    const tablesToDrop = [
      'ai_generations',
      'social_media_posts', 
      'company_social_integrations',
      'user_social_integrations',
      'company_users',
      'companies',
      'users',
      'knex_migrations',
      'knex_migrations_lock'
    ]

    for (const table of tablesToDrop) {
      try {
        await db.schema.dropTableIfExists(table)
        console.log(`✅ Dropped table: ${table}`)
      } catch (error) {
        console.log(`⚠️  Table ${table} doesn't exist or couldn't be dropped`)
      }
    }

    console.log('\n🎉 Database reset complete!')
    console.log('Now run: npm run migrate')

  } catch (error) {
    console.error('❌ Error resetting database:', error.message)
  } finally {
    await db.destroy()
  }
}

resetDatabase().catch(console.error)
