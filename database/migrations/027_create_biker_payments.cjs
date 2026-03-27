/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  // Add wallet to Entregadores
  const hasWallet = await knex.schema.hasColumn("Entregadores", "wallet");
  if (!hasWallet) {
    await knex.schema.alterTable("Entregadores", function (table) {
      table.decimal("wallet", 10, 2).defaultTo(0);
    });
  }

  // Create biker_payments table
  const hasTable = await knex.schema.hasTable("biker_payments");
  if (!hasTable) {
    await knex.schema.createTable("biker_payments", function (table) {
      table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
      table.uuid("biker_id").notNullable();
      table.text("company_id").notNullable();
      table.string("date", 10).notNullable(); // YYYY-MM-DD
      table.decimal("amount", 10, 2).notNullable();
      table.integer("total_deliveries").notNullable().defaultTo(0);
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());

      table.index(["biker_id"]);
      table.index(["biker_id", "date"]);
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("biker_payments");
  const hasWallet = await knex.schema.hasColumn("Entregadores", "wallet");
  if (hasWallet) {
    await knex.schema.alterTable("Entregadores", function (table) {
      table.dropColumn("wallet");
    });
  }
};
