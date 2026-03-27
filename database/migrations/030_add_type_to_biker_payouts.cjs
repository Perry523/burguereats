/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  const hasType = await knex.schema.hasColumn('biker_payouts', 'type');
  if (!hasType) {
    await knex.schema.alterTable('biker_payouts', function(table) {
      table.string('type').defaultTo('settlement');
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  const hasType = await knex.schema.hasColumn('biker_payouts', 'type');
  if (hasType) {
    await knex.schema.alterTable('biker_payouts', function(table) {
      table.dropColumn('type');
    });
  }
};
