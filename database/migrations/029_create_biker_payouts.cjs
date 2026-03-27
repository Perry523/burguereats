/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  const hasPayouts = await knex.schema.hasTable('biker_payouts');
  if (!hasPayouts) {
    await knex.schema.createTable('biker_payouts', function(table) {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('biker_id').notNullable();
      table.decimal('amount_paid', 10, 2).notNullable();
      table.decimal('discounts', 10, 2).defaultTo(0);
      table.decimal('delivery_fee_total', 10, 2).defaultTo(0);
      table.timestamp('date').defaultTo(knex.fn.now());
      table.timestamp('created_at').defaultTo(knex.fn.now());

      table.index(['biker_id']);
    });
  }

  const hasIsPaid = await knex.schema.hasColumn('biker_payments', 'is_paid');
  if (!hasIsPaid) {
    await knex.schema.alterTable('biker_payments', function(table) {
      table.boolean('is_paid').defaultTo(false);
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('biker_payouts');
  
  const hasIsPaid = await knex.schema.hasColumn('biker_payments', 'is_paid');
  if (hasIsPaid) {
    await knex.schema.alterTable('biker_payments', function(table) {
      table.dropColumn('is_paid');
    });
  }
};
