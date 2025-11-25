import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkProductsSchema() {
  console.log('🔍 Checking products table schema in production...\n');

  try {
    // Fetch a sample product to see actual columns
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .limit(1);

    if (error) {
      console.error('❌ Error fetching products:', error.message);
      console.error('Details:', error);
      process.exit(1);
    }

    if (!products || products.length === 0) {
      console.log('⚠️  No products found in the table');
      return;
    }

    const product = products[0];
    console.log('✅ Sample product retrieved:');
    console.log(JSON.stringify(product, null, 2));
    console.log('\n📋 Available columns:');
    console.log(Object.keys(product).join(', '));

    console.log('\n🔧 Expected columns by ProductModel:');
    const expectedColumns = [
      'id',
      'company_id',
      'category',
      'name',
      'buy_price',
      'sell_price',
      'stock',  // Using 'stock' to match production
      'image',
      'is_active',
      'created_at',
      'updated_at'
    ];
    const optionalColumns = ['description', 'variants'];  // These are optional
    console.log('Required:', expectedColumns.join(', '));
    console.log('Optional:', optionalColumns.join(', '));

    console.log('\n⚠️  Schema Comparison:');
    const actualColumns = Object.keys(product);
    const missing = expectedColumns.filter(col => !actualColumns.includes(col));
    const extra = actualColumns.filter(col => !expectedColumns.includes(col));

    if (missing.length > 0) {
      console.log('❌ Missing columns:', missing.join(', '));
    }
    if (extra.length > 0) {
      console.log('➕ Extra columns:', extra.join(', '));
    }

    if (missing.length === 0 && extra.length === 0) {
      console.log('✅ Schema matches perfectly!');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

checkProductsSchema();
