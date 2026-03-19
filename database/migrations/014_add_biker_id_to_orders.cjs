/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  const hasColumn = await knex.schema.hasColumn("orders", "biker_id");
  if (!hasColumn) {
    await knex.schema.alterTable("orders", function (table) {
      table.uuid("biker_id").nullable().references("id").inTable("Entregadores").onDelete("SET NULL");
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.alterTable("orders", function (table) {
    table.dropColumn("biker_id");
  });
};
