/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  // Create orders table
  await knex.schema.createTable("orders", function (table) {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.text("company_id").notNullable();
    table
      .foreign("company_id")
      .references("id")
      .inTable("Company")
      .onDelete("CASCADE");

    // Customer information
    table.string("customer_name").notNullable();
    table.string("customer_phone").notNullable();
    table.text("customer_address").nullable();

    // Order details
    table.decimal("total", 10, 2).notNullable();
    table.string("status").notNullable().defaultTo("pending"); // pending, preparing, completed, cancelled
    table.text("notes").nullable();

    // Timestamps
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());

    // Indexes
    table.index("company_id", "idx_orders_company_id");
    table.index("status", "idx_orders_status");
    table.index("created_at", "idx_orders_created_at");
  });

  // Create order_items table
  await knex.schema.createTable("order_items", function (table) {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.uuid("order_id").notNullable();
    table
      .foreign("order_id")
      .references("id")
      .inTable("orders")
      .onDelete("CASCADE");

    // Item details
    table.uuid("dish_id").nullable(); // nullable because product might be deleted
    table.string("dish_name").notNullable();
    table.integer("quantity").notNullable().defaultTo(1);
    table.decimal("unit_price", 10, 2).notNullable();
    table.decimal("total_price", 10, 2).notNullable();

    // Customizations (side dishes, observations, etc.) stored as JSON
    table.jsonb("customizations").nullable();

    // Timestamps
    table.timestamp("created_at").defaultTo(knex.fn.now());

    // Indexes
    table.index("order_id", "idx_order_items_order_id");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("order_items");
  await knex.schema.dropTableIfExists("orders");
};
