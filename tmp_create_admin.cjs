const bcrypt = require('bcrypt');
const knex = require('knex')(require('./knexfile.cjs').development);

async function createAdmin() {
  const email = 'admin@gmail.com';
  const plainPassword = '123123';
  const role = 'admin';
  const companyId = 'daffd54a-9e19-411c-b86a-efb7de1b37ab';

  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  try {
    const [newAdmin] = await knex('Admins').insert({
      id: crypto.randomUUID(), // Or let Postgres handle it if defaulted, but the schema had UUID primary
      email,
      name: 'Super Admin',
      password: hashedPassword,
      role,
      companyId,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning('*');

    console.log('Admin created successfully:', newAdmin.email);
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await knex.destroy();
    process.exit(0);
  }
}

createAdmin();
