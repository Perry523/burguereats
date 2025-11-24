/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  // Create sequence for pickup codes (1-999, cycling)
  await knex.raw(
    "CREATE SEQUENCE IF NOT EXISTS order_pickup_seq MINVALUE 1 MAXVALUE 999 CYCLE START 1"
  );

  // Add pickup_code column with default value from sequence
  await knex.schema.alterTable("orders", function (table) {
    table.string("pickup_code").nullable();
  });

  // Create a function to format the sequence value
  await knex.raw(`
    CREATE OR REPLACE FUNCTION get_next_pickup_code()
    RETURNS text AS $$
    BEGIN
      RETURN lpad(nextval('order_pickup_seq')::text, 3, '0');
    END;
    $$ LANGUAGE plpgsql;
  `);

  // Set default value using the function for new rows
  await knex.raw(
    "ALTER TABLE orders ALTER COLUMN pickup_code SET DEFAULT get_next_pickup_code()"
  );

  // Update existing rows with a value (optional, but good for consistency)
  await knex.raw(
    "UPDATE orders SET pickup_code = get_next_pickup_code() WHERE pickup_code IS NULL"
  );

  // Make it not null after populating
  await knex.schema.alterTable("orders", function (table) {
    table.string("pickup_code").notNullable().alter();
  });

  // Add index for fast lookup
  await knex.schema.alterTable("orders", function (table) {
    table.index("pickup_code", "idx_orders_pickup_code");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.alterTable("orders", function (table) {
    table.dropIndex("pickup_code", "idx_orders_pickup_code");
    table.dropColumn("pickup_code");
  });

  await knex.raw("DROP FUNCTION IF EXISTS get_next_pickup_code");
  await knex.raw("DROP SEQUENCE IF EXISTS order_pickup_seq");
};
