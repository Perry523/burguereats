/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  // 1. Add product_id column to order_items if it doesn't exist
  const hasProductId = await knex.schema.hasColumn("order_items", "product_id");
  if (!hasProductId) {
    await knex.schema.alterTable("order_items", function (table) {
      table.uuid("product_id").nullable();
    });
  }

  // 2. Create the decrement_product_stock RPC function
  await knex.raw(`
    CREATE OR REPLACE FUNCTION decrement_product_stock(p_product_id uuid, p_qty integer)
    RETURNS void AS $$
    BEGIN
      UPDATE products
        SET stock = GREATEST(stock - p_qty, 0)
        WHERE id = p_product_id;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.raw("DROP FUNCTION IF EXISTS decrement_product_stock(uuid, integer)");

  const hasProductId = await knex.schema.hasColumn("order_items", "product_id");
  if (hasProductId) {
    await knex.schema.alterTable("order_items", function (table) {
      table.dropColumn("product_id");
    });
  }
};
