exports.up = async function(knex) {
  return knex.schema.createTable('products', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.uuid('company_id').notNullable().references('id').inTable('companies').onDelete('CASCADE')
    // Note: 'Category' table name is capitalized in existing API code
    table.uuid('category_id').nullable().references('id').inTable('Category').onDelete('SET NULL')
    table.string('name').notNullable()
    table.text('description').nullable()
    table.decimal('buy_price', 10, 2).defaultTo(0)
    table.decimal('sell_price', 10, 2).notNullable().defaultTo(0)
    table.integer('quantity').defaultTo(0)
    table.string('image').nullable()
    table.boolean('is_active').defaultTo(true)
    table.jsonb('variants').defaultTo('[]')
    table.timestamps(true, true)

    // Indexes
    table.index('company_id')
    table.index('category_id')
    table.index('is_active')
  })
}

exports.down = async function(knex) {
  return knex.schema.dropTable('products')
}
