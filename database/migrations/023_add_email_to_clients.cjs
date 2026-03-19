/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  const hasColumn = await knex.schema.hasColumn("clients", "email");
  if (!hasColumn) {
    await knex.schema.alterTable("clients", function (table) {
      table.string("email").nullable();
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  const hasColumn = await knex.schema.hasColumn("clients", "email");
  if (hasColumn) {
    await knex.schema.alterTable("clients", function (table) {
      table.dropColumn("email");
    });
  }
};
