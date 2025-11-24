/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  // Drop foreign key constraint first
  await knex.raw(
    "ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_company_id_foreign"
  );

  // Change column type from UUID to TEXT
  await knex.raw("ALTER TABLE orders ALTER COLUMN company_id TYPE TEXT");

  // Re-add foreign key constraint
  await knex.schema.alterTable("orders", function (table) {
    table
      .foreign("company_id")
      .references("id")
      .inTable("Company")
      .onDelete("CASCADE");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.raw(
    "ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_company_id_foreign"
  );
  await knex.raw(
    "ALTER TABLE orders ALTER COLUMN company_id TYPE UUID USING company_id::uuid"
  );
  await knex.schema.alterTable("orders", function (table) {
    table
      .foreign("company_id")
      .references("id")
      .inTable("Company")
      .onDelete("CASCADE");
  });
};
