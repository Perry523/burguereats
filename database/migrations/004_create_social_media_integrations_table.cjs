exports.up = async function(knex) {
  return knex.schema.createTable('user_social_integrations', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.uuid('user_id').notNullable()
    table.string('platform').notNullable() // instagram, facebook, twitter, linkedin
    table.string('platform_user_id').notNullable()
    table.string('username').nullable()
    table.string('display_name').nullable()
    table.string('profile_picture_url').nullable()
    table.text('access_token').notNullable()
    table.text('refresh_token').nullable()
    table.timestamp('token_expires_at').nullable()
    table.json('platform_data').nullable() // Store additional platform-specific data
    table.json('permissions').nullable() // Store granted permissions
    table.boolean('is_active').defaultTo(true)
    table.timestamp('last_sync_at').nullable()
    table.timestamps(true, true)

    // Foreign keys
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')

    // Unique constraint - one integration per platform per user
    table.unique(['user_id', 'platform', 'platform_user_id'])

    // Indexes
    table.index('user_id')
    table.index('platform')
    table.index('is_active')
    table.index('platform_user_id')
  })
}

exports.down = async function(knex) {
  return knex.schema.dropTable('user_social_integrations')
}
