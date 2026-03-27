/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema.alterTable('biker_payouts', function(table) {
    table.foreign('biker_id').references('id').inTable('Entregadores').onDelete('CASCADE');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.alterTable('biker_payouts', function(table) {
    table.dropForeign('biker_id');
  });
};
