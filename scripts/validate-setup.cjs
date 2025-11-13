#!/usr/bin/env node

// Tomatiza Setup Validation Script
// This script validates the project setup without requiring database connection

const fs = require('fs')
const path = require('path')

console.log('🍅 Tomatiza Setup Validation')
console.log('============================')

let passed = 0
let failed = 0

function test(name, condition, message) {
  if (condition) {
    console.log(`✅ ${name}`)
    passed++
  } else {
    console.log(`❌ ${name}: ${message}`)
    failed++
  }
}

// Check if required files exist
test(
  'Environment file exists',
  fs.existsSync('.env'),
  '.env file not found'
)

test(
  'Package.json exists',
  fs.existsSync('package.json'),
  'package.json not found'
)

test(
  'Knex config exists',
  fs.existsSync('knexfile.cjs'),
  'knexfile.cjs not found'
)

// Check if migration files exist
const migrationDir = './database/migrations'
test(
  'Migration directory exists',
  fs.existsSync(migrationDir),
  'Migration directory not found'
)

if (fs.existsSync(migrationDir)) {
  const migrations = fs.readdirSync(migrationDir).filter(f => f.endsWith('.ts'))
  test(
    'Migration files exist',
    migrations.length > 0,
    'No migration files found'
  )
  
  console.log(`   Found ${migrations.length} migration files:`)
  migrations.forEach(m => console.log(`   - ${m}`))
}

// Check if API routes exist
const apiDir = './server/api'
test(
  'API directory exists',
  fs.existsSync(apiDir),
  'API directory not found'
)

if (fs.existsSync(apiDir)) {
  const checkApiRoute = (routePath, description) => {
    test(
      `${description} route exists`,
      fs.existsSync(path.join(apiDir, routePath)),
      `${routePath} not found`
    )
  }

  checkApiRoute('auth/register.post.ts', 'User registration')
  checkApiRoute('auth/login.post.ts', 'User login')
  checkApiRoute('companies/create.post.ts', 'Company creation')
  checkApiRoute('ai/generate.post.ts', 'AI content generation')
  checkApiRoute('posts/create.post.ts', 'Post creation')
  checkApiRoute('social/instagram/connect.post.ts', 'Instagram connection')
  checkApiRoute('social/facebook/connect.post.ts', 'Facebook connection')
}

// Check if composables exist
const composablesDir = './composables'
test(
  'Composables directory exists',
  fs.existsSync(composablesDir),
  'Composables directory not found'
)

if (fs.existsSync(composablesDir)) {
  const checkComposable = (fileName, description) => {
    test(
      `${description} composable exists`,
      fs.existsSync(path.join(composablesDir, fileName)),
      `${fileName} not found`
    )
  }

  checkComposable('useAuth.ts', 'Authentication')
  checkComposable('usePosts.ts', 'Posts management')
  checkComposable('useAI.ts', 'AI content generation')
}

// Check if services exist
const servicesDir = './services'
test(
  'Services directory exists',
  fs.existsSync(servicesDir),
  'Services directory not found'
)

if (fs.existsSync(servicesDir)) {
  test(
    'API service exists',
    fs.existsSync(path.join(servicesDir, 'api.ts')),
    'api.ts not found'
  )
  
  test(
    'Gemini AI service exists',
    fs.existsSync(path.join(servicesDir, 'geminiAI.ts')),
    'geminiAI.ts not found'
  )
}

// Check if types exist
const typesDir = './types'
test(
  'Types directory exists',
  fs.existsSync(typesDir),
  'Types directory not found'
)

if (fs.existsSync(typesDir)) {
  test(
    'Database types exist',
    fs.existsSync(path.join(typesDir, 'database.ts')),
    'database.ts not found'
  )
}

// Check if models exist
const modelsDir = './models'
test(
  'Models directory exists',
  fs.existsSync(modelsDir),
  'Models directory not found'
)

if (fs.existsSync(modelsDir)) {
  const checkModel = (fileName, description) => {
    test(
      `${description} model exists`,
      fs.existsSync(path.join(modelsDir, fileName)),
      `${fileName} not found`
    )
  }

  checkModel('BaseModel.ts', 'Base')
  checkModel('UserModel.ts', 'User')
  checkModel('CompanyModel.ts', 'Company')
  checkModel('ServiceModel.ts', 'Service')
  checkModel('index.ts', 'Model factory')
}

// Check package.json scripts
if (fs.existsSync('package.json')) {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
  const scripts = packageJson.scripts || {}
  
  const checkScript = (scriptName, description) => {
    test(
      `${description} script exists`,
      scripts[scriptName] !== undefined,
      `${scriptName} script not found in package.json`
    )
  }

  checkScript('migrate', 'Database migration')
  checkScript('migrate:status', 'Migration status')
  checkScript('test:api', 'API testing')
  checkScript('deploy', 'Deployment')
}

// Check if .env has required variables (without validating values)
if (fs.existsSync('.env')) {
  const envContent = fs.readFileSync('.env', 'utf8')
  const requiredVars = [
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY', 
    'SUPABASE_SERVICE_KEY',
    'DATABASE_URL',
    'JWT_SECRET',
    'GEMINI_API_KEY'
  ]
  
  requiredVars.forEach(varName => {
    test(
      `${varName} environment variable defined`,
      envContent.includes(`${varName}=`),
      `${varName} not found in .env`
    )
  })
}

console.log('\n📊 Validation Results')
console.log('======================')
console.log(`✅ Passed: ${passed}`)
console.log(`❌ Failed: ${failed}`)
console.log(`📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`)

if (failed === 0) {
  console.log('\n🎉 All validations passed! Your Tomatiza setup is ready.')
  console.log('\nNext steps:')
  console.log('1. Configure your .env file with real credentials')
  console.log('2. Run: npm run migrate')
  console.log('3. Run: npm run dev')
  console.log('4. Test the API endpoints')
} else {
  console.log('\n⚠️  Some validations failed. Please check the issues above.')
  process.exit(1)
}
