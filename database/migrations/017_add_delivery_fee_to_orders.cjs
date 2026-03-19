/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  const hasColumn = await knex.schema.hasColumn("orders", "delivery_fee");
  if (!hasColumn) {
    await knex.schema.alterTable("orders", function (table) {
      table.decimal("delivery_fee", 10, 2).defaultTo(0).notNullable();
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  const hasColumn = await knex.schema.hasColumn("orders", "delivery_fee");
  if (hasColumn) {
    await knex.schema.alterTable("orders", function (table) {
      table.dropColumn("delivery_fee");
    });
  }
};
