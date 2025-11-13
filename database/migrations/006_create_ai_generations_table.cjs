exports.up = async function(knex) {
  return knex.schema.createTable('ai_generations', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.uuid('user_id').notNullable()
    table.string('type').notNullable() // post_content, image, hashtags, caption
    table.text('prompt').notNullable()
    table.text('generated_content').notNullable()
    table.json('parameters').nullable() // Store generation parameters
    table.string('ai_model').nullable() // gemini, gpt-4, etc.
    table.decimal('cost', 10, 6).nullable() // Cost in credits/tokens
    table.integer('tokens_used').nullable()
    table.decimal('processing_time', 8, 3).nullable() // Processing time in seconds
    table.string('status').defaultTo('completed') // pending, completed, failed
    table.text('error_message').nullable()
    table.boolean('is_used').defaultTo(false) // Whether the content was used in a post
    table.uuid('related_post_id').nullable() // Link to social_media_posts if used
    table.timestamps(true, true)

    // Foreign keys
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
    table.foreign('related_post_id').references('id').inTable('social_media_posts').onDelete('SET NULL')

    // Indexes
    table.index('user_id')
    table.index('type')
    table.index('status')
    table.index('is_used')
    table.index('related_post_id')
    table.index('created_at')
  })
}

exports.down = async function(knex) {
  return knex.schema.dropTable('ai_generations')
}
