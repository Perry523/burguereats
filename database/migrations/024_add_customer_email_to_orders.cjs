/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  const hasColumn = await knex.schema.hasColumn("orders", "customer_email");
  if (!hasColumn) {
    await knex.schema.alterTable("orders", function (table) {
      table.string("customer_email").nullable();
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  const hasColumn = await knex.schema.hasColumn("orders", "customer_email");
  if (hasColumn) {
    await knex.schema.alterTable("orders", function (table) {
      table.dropColumn("customer_email");
    });
  }
};
