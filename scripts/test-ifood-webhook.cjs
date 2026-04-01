const axios = require('axios');

// Configure these values
const MERCHANT_ID = 'test-merchant-123'; // Must match the value set in your Admin -> Company iFood ID
const ORDER_ID = 'mock-order-' + Date.now();
const WEBHOOK_URL = 'http://localhost:3000/api/webhooks/ifood';

async function testWebhook() {
  console.log('🚀 Sending mock iFood webhook...');
  console.log(`Merchant: ${MERCHANT_ID}`);
  console.log(`Order: ${ORDER_ID}`);

  try {
    const response = await axios.post(WEBHOOK_URL, {
      id: "evt-" + Date.now(),
      code: "PLC",
      fullCode: "PLACED",
      orderId: ORDER_ID,
      merchantId: MERCHANT_ID,
      createdAt: new Date().toISOString(),
      salesChannel: "IFOOD"
    });

    console.log('\n✅ Response:', response.status, response.statusText);
    console.log('Payload:', response.data);
    
    if (response.data.status === 'success') {
      console.log('\n✨ Sync successful! Check your Admin Dashboard for the new order.');
    } else {
      console.log('\n⚠️ Webhook received but ignored. Reason:', response.data.message);
    }
  } catch (error) {
    console.error('\n❌ Error:', error.response?.status, error.response?.data || error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('   Make sure your Nuxt app is running locally (npm run dev)');
    }
  }
}

testWebhook();
