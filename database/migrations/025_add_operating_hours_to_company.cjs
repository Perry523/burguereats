/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  const hasColumn = await knex.schema.hasColumn("Company", "operating_hours");
  if (!hasColumn) {
    await knex.schema.alterTable("Company", function (table) {
      table.jsonb("operating_hours").nullable();
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  const hasColumn = await knex.schema.hasColumn("Company", "operating_hours");
  if (hasColumn) {
    await knex.schema.alterTable("Company", function (table) {
      table.dropColumn("operating_hours");
    });
  }
};
