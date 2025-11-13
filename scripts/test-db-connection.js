#!/usr/bin/env node

/**
 * Test database connection script
 * This script tests both Supabase client connection and direct PostgreSQL connection
 */

import { createClient } from '@supabase/supabase-js'
import knex from 'knex'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY
const DATABASE_URL = process.env.DATABASE_URL

console.log('🔍 Testing Database Connections...\n')

// Test 1: Supabase Client Connection
async function testSupabaseConnection() {
  console.log('1️⃣ Testing Supabase Client Connection...')
  
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.log('❌ Missing Supabase credentials')
    return false
  }

  if (!SUPABASE_URL.startsWith('https://')) {
    console.log('❌ Invalid Supabase URL format')
    return false
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    
    // Test a simple connection by checking auth
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error && error.message !== 'Auth session missing!') {
      console.log('❌ Supabase connection failed:', error.message)
      return false
    }

    console.log('✅ Supabase client connection successful!')
    console.log('   (Auth session missing is expected - client is working)')
    return true
  } catch (error) {
    console.log('❌ Supabase connection error:', error.message)
    return false
  }
}

// Test 2: Direct PostgreSQL Connection (for migrations)
async function testPostgreSQLConnection() {
  console.log('\n2️⃣ Testing PostgreSQL Connection (for migrations)...')
  
  if (!DATABASE_URL) {
    console.log('❌ Missing DATABASE_URL')
    return false
  }

  if (DATABASE_URL.includes('[password]') || DATABASE_URL.includes('your_database_password')) {
    console.log('❌ DATABASE_URL contains placeholder values')
    console.log('   Please update with your actual Supabase database password')
    console.log('   Get it from: Supabase Dashboard > Settings > Database > Connection string')
    return false
  }

  try {
    const db = knex({
      client: 'postgresql',
      connection: {
        connectionString: DATABASE_URL,
        ssl: { rejectUnauthorized: false }
      }
    })

    // Test connection
    await db.raw('SELECT 1')
    
    console.log('✅ PostgreSQL connection successful!')
    
    // Check if migrations table exists
    const hasTable = await db.schema.hasTable('knex_migrations')
    if (hasTable) {
      console.log('✅ Migrations table exists')
    } else {
      console.log('ℹ️  Migrations table not found (will be created on first migration)')
    }
    
    await db.destroy()
    return true
  } catch (error) {
    console.log('❌ PostgreSQL connection failed:', error.message)
    
    if (error.message.includes('password authentication failed')) {
      console.log('   → Check your database password in DATABASE_URL')
    } else if (error.message.includes('getaddrinfo ENOTFOUND')) {
      console.log('   → Check your database host in DATABASE_URL')
    }
    
    return false
  }
}

// Test 3: Environment Variables Check
function testEnvironmentVariables() {
  console.log('\n3️⃣ Checking Environment Variables...')
  
  const required = {
    'SUPABASE_URL': SUPABASE_URL,
    'SUPABASE_ANON_KEY': SUPABASE_ANON_KEY,
    'DATABASE_URL': DATABASE_URL
  }
  
  let allGood = true
  
  for (const [key, value] of Object.entries(required)) {
    if (!value) {
      console.log(`❌ Missing: ${key}`)
      allGood = false
    } else if (value.includes('your_') || value.includes('[') || value.includes('placeholder')) {
      console.log(`⚠️  Placeholder value: ${key}`)
      allGood = false
    } else {
      console.log(`✅ ${key}: configured`)
    }
  }
  
  return allGood
}

// Run all tests
async function runTests() {
  const envCheck = testEnvironmentVariables()
  const supabaseOk = await testSupabaseConnection()
  const postgresOk = await testPostgreSQLConnection()
  
  console.log('\n📊 Summary:')
  console.log(`Environment Variables: ${envCheck ? '✅' : '❌'}`)
  console.log(`Supabase Client: ${supabaseOk ? '✅' : '❌'}`)
  console.log(`PostgreSQL (Migrations): ${postgresOk ? '✅' : '❌'}`)
  
  if (supabaseOk && postgresOk) {
    console.log('\n🎉 All connections successful! You can now run migrations.')
    console.log('   Run: npm run migrate')
  } else {
    console.log('\n⚠️  Some connections failed. Please check the errors above.')
    console.log('   See: docs/DATABASE_SETUP.md for help')
  }
}

runTests().catch(console.error)
