/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  // Add role column to Admins table, default to 'manager'
  await knex.schema.alterTable("Admins", function (table) {
    table.string("role").defaultTo("manager");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.alterTable("Admins", function (table) {
    table.dropColumn("role");
  });
};
