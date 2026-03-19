/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  // Create clients table
  await knex.schema.createTable("clients", function (table) {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.uuid("company_id").notNullable().references("id").inTable("users").onDelete("CASCADE");
    table.string("name").notNullable();
    table.string("phone").nullable();
    table.timestamps(true, true);
  });

  // Add client_id to orders table
  const hasClientId = await knex.schema.hasColumn("orders", "client_id");
  if (!hasClientId) {
    await knex.schema.alterTable("orders", function (table) {
      table.uuid("client_id").nullable().references("id").inTable("clients").onDelete("SET NULL");
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  const hasClientId = await knex.schema.hasColumn("orders", "client_id");
  if (hasClientId) {
    await knex.schema.alterTable("orders", function (table) {
      table.dropColumn("client_id");
    });
  }

  await knex.schema.dropTableIfExists("clients");
};
