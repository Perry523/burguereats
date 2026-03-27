/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  const hasColumn = await knex.schema.hasColumn("Entregadores", "advance_money");
  if (!hasColumn) {
    await knex.schema.alterTable("Entregadores", function (table) {
      table.decimal("advance_money", 10, 2).defaultTo(0);
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  const hasColumn = await knex.schema.hasColumn("Entregadores", "advance_money");
  if (hasColumn) {
    await knex.schema.alterTable("Entregadores", function (table) {
      table.dropColumn("advance_money");
    });
  }
};
