/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('post_sketches', function(table) {
    // Primary key
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    
    // Foreign key to users
    table.uuid('user_id').notNullable();
    table.foreign('user_id').references('id').inTable('auth.users').onDelete('CASCADE');
    
    // Sketch metadata
    table.string('title', 255).notNullable();
    table.text('description').nullable();
    
    // Content storage (JSONB for rich data)
    table.jsonb('generated_content').nullable();
    table.jsonb('text_elements').defaultTo('[]');
    table.jsonb('carousel_settings').defaultTo('{}');
    
    // Timestamps
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // Indexes for performance
    table.index('user_id', 'idx_post_sketches_user_id');
    table.index('created_at', 'idx_post_sketches_created_at');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('post_sketches');
};
