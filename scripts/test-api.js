#!/usr/bin/env node

// Tomatiza API Testing Script
// This script tests the main API endpoints

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

let authToken = null
let userId = null
let companyId = null

async function makeRequest(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  }

  if (authToken && !headers.Authorization) {
    headers.Authorization = `Bearer ${authToken}`
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${data.message || 'Request failed'}`)
    }

    return data
  } catch (error) {
    console.error(`❌ Request to ${endpoint} failed:`, error.message)
    throw error
  }
}

async function testUserRegistration() {
  console.log('\n🧪 Testing User Registration...')
  
  const userData = {
    name: 'Test User',
    email: `test-${Date.now()}@example.com`,
    phone: '123456789',
    password: 'password123'
  }

  try {
    const response = await makeRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    })

    if (response.success && response.data?.user) {
      userId = response.data.user.id
      console.log('✅ User registration successful')
      console.log(`   User ID: ${userId}`)
      return true
    } else {
      throw new Error('Invalid response format')
    }
  } catch (error) {
    console.error('❌ User registration failed:', error.message)
    return false
  }
}

async function testUserLogin() {
  console.log('\n🧪 Testing User Login...')
  
  // Use the same email from registration
  const loginData = {
    email: `test-${Date.now()}@example.com`,
    password: 'password123'
  }

  try {
    const response = await makeRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(loginData)
    })

    if (response.success && response.data?.token) {
      authToken = response.data.token
      console.log('✅ User login successful')
      console.log(`   Token: ${authToken.substring(0, 20)}...`)
      return true
    } else {
      throw new Error('Invalid response format')
    }
  } catch (error) {
    console.error('❌ User login failed:', error.message)
    return false
  }
}

async function testCompanyCreation() {
  console.log('\n🧪 Testing Company Creation...')
  
  const companyData = {
    name: 'Test Company',
    slug: `test-company-${Date.now()}`,
    description: 'A test company for API testing',
    business_category: 'retail',
    userId: userId
  }

  try {
    const response = await makeRequest('/api/companies/create', {
      method: 'POST',
      body: JSON.stringify(companyData)
    })

    if (response.success && response.data?.company) {
      companyId = response.data.company.id
      console.log('✅ Company creation successful')
      console.log(`   Company ID: ${companyId}`)
      return true
    } else {
      throw new Error('Invalid response format')
    }
  } catch (error) {
    console.error('❌ Company creation failed:', error.message)
    return false
  }
}

async function testAIContentGeneration() {
  console.log('\n🧪 Testing AI Content Generation...')
  
  const generationData = {
    company_id: companyId,
    type: 'post',
    category: 'retail',
    theme: 'promotion',
    customPrompt: 'Create a post about our new product launch',
    tone: 'friendly'
  }

  try {
    const response = await makeRequest('/api/ai/generate', {
      method: 'POST',
      body: JSON.stringify(generationData)
    })

    if (response.success && response.data?.generation) {
      console.log('✅ AI content generation successful')
      console.log(`   Caption: ${response.data.generation.caption.substring(0, 50)}...`)
      return true
    } else {
      throw new Error('Invalid response format')
    }
  } catch (error) {
    console.error('❌ AI content generation failed:', error.message)
    return false
  }
}

async function testPostCreation() {
  console.log('\n🧪 Testing Post Creation...')
  
  const postData = {
    company_id: companyId,
    user_id: userId,
    title: 'Test Post',
    caption: 'This is a test post created by the API testing script',
    hashtags: ['#test', '#api', '#Tomatiza'],
    platform: 'instagram',
    content_type: 'post'
  }

  try {
    const response = await makeRequest('/api/posts/create', {
      method: 'POST',
      body: JSON.stringify(postData)
    })

    if (response.success && response.data?.post) {
      console.log('✅ Post creation successful')
      console.log(`   Post ID: ${response.data.post.id}`)
      return true
    } else {
      throw new Error('Invalid response format')
    }
  } catch (error) {
    console.error('❌ Post creation failed:', error.message)
    return false
  }
}

async function runTests() {
  console.log('🍅 Tomatiza API Testing Script')
  console.log('==============================')
  console.log(`Testing against: ${BASE_URL}`)

  const tests = [
    testUserRegistration,
    testUserLogin,
    testCompanyCreation,
    testAIContentGeneration,
    testPostCreation
  ]

  let passed = 0
  let failed = 0

  for (const test of tests) {
    try {
      const result = await test()
      if (result) {
        passed++
      } else {
        failed++
      }
    } catch (error) {
      failed++
    }
  }

  console.log('\n📊 Test Results')
  console.log('================')
  console.log(`✅ Passed: ${passed}`)
  console.log(`❌ Failed: ${failed}`)
  console.log(`📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`)

  if (failed === 0) {
    console.log('\n🎉 All tests passed! Your API is working correctly.')
  } else {
    console.log('\n⚠️  Some tests failed. Please check the error messages above.')
    process.exit(1)
  }
}

// Run the tests
runTests().catch(error => {
  console.error('💥 Test runner failed:', error.message)
  process.exit(1)
})
