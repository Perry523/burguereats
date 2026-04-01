const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const { randomUUID } = require('crypto');
const bcrypt = require('bcrypt');

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createCompany() {
  const companyName = 'teste-ifood';
  const merchantId = '2e1681cd-8f1e-43b1-aa55-f370b659e111';
  const companyId = randomUUID();

  console.log(`🚀 Creating company: ${companyName}...`);

  // 1. Create Company
  const { data: company, error: companyError } = await supabase
    .from('Company')
    .insert({
      id: companyId,
      name: companyName,
      email: 'teste@ifood.com',
      type: 'delivery',
      ifood_merchant_id: merchantId,
      updatedAt: new Date().toISOString()
    })
    .select()
    .single();

  if (companyError) {
    console.error('❌ Error creating company:', companyError.message);
    return;
  }

  console.log(`✅ Company created with ID: ${companyId}`);

  // 2. Create Manager Admin
  const managerEmail = 'admin-ifood@teste.com';
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const { data: manager, error: managerError } = await supabase
    .from('Admins')
    .insert({
      id: randomUUID(),
      name: 'Manager Teste iFood',
      email: managerEmail,
      password: hashedPassword,
      role: 'manager',
      companyId: companyId,
      isActive: true,
      updatedAt: new Date().toISOString()
    });

  if (managerError) {
    console.error('❌ Error creating manager:', managerError.message);
    // Rolbak company? User might want to try again.
  } else {
    console.log(`✅ Manager created: ${managerEmail} / admin123`);
  }
}

createCompany();
