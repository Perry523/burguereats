exports.up = async function(knex) {
  return knex.schema.createTable('users', (table) => {
    table.uuid('id').primary() // Use Supabase Auth user ID
    table.string('name').notNullable()
    table.string('email').unique().notNullable()
    table.string('phone').nullable()
    table.string('profile_photo_path').nullable()
    // Password is handled by Supabase Auth, not stored here
    table.string('type').defaultTo('user')
    table.boolean('finished_register').defaultTo(false)
    table.string('instagram_link').nullable()
    table.json('instagram_accounts').nullable()
    table.timestamp('email_verified_at').nullable()
    table.string('remember_token').nullable()
    table.text('two_factor_secret').nullable()
    table.text('two_factor_recovery_codes').nullable()
    table.timestamp('two_factor_confirmed_at').nullable()
    table.timestamps(true, true)

    // Indexes
    table.index('email')
    table.index('type')
  })
}

exports.down = async function(knex) {
  return knex.schema.dropTable('users')
}
