exports.up = async function(knex) {
  return knex.schema.createTable('social_media_posts', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.uuid('user_id').notNullable()
    table.uuid('integration_id').nullable()
    table.string('platform').notNullable() // instagram, facebook, twitter, linkedin
    table.string('post_type').notNullable() // image, video, carousel, story, reel
    table.string('status').defaultTo('draft') // draft, scheduled, published, failed
    table.text('content').notNullable()
    table.json('media_urls').nullable() // Array of media URLs
    table.json('hashtags').nullable() // Array of hashtags
    table.string('location').nullable()
    table.timestamp('scheduled_at').nullable()
    table.timestamp('published_at').nullable()
    table.string('platform_post_id').nullable() // ID from the social media platform
    table.string('platform_post_url').nullable()
    table.json('platform_response').nullable() // Store platform API response
    table.json('analytics').nullable() // Store post analytics/insights
    table.text('error_message').nullable()
    table.integer('retry_count').defaultTo(0)
    table.timestamps(true, true)

    // Foreign keys
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
    table.foreign('integration_id').references('id').inTable('user_social_integrations').onDelete('SET NULL')

    // Indexes
    table.index('user_id')
    table.index('integration_id')
    table.index('platform')
    table.index('status')
    table.index('scheduled_at')
    table.index('published_at')
    table.index('platform_post_id')
  })
}

exports.down = async function(knex) {
  return knex.schema.dropTable('social_media_posts')
}
