/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("products", function (table) {
    // Primary key
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));

    // Foreign key to Company (text type to match Company.id)
    table.text("company_id").notNullable();
    table
      .foreign("company_id")
      .references("id")
      .inTable("Company")
      .onDelete("CASCADE");

    // Product details
    table.string("name").notNullable();
    table.string("category").notNullable();
    table.decimal("sell_price", 10, 2).notNullable();
    table.decimal("buy_price", 10, 2).notNullable();
    table.decimal("stock", 10, 2).notNullable().defaultTo(0);
    table.text("image").nullable();

    // Timestamps
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());

    // Indexes
    table.index("company_id", "idx_products_company_id");
  });

  // Enable RLS
  await knex.raw("ALTER TABLE products ENABLE ROW LEVEL SECURITY");

  // Create policies - simplified for now
  await knex.raw(`
    CREATE POLICY "Enable read access for all users" ON products
      FOR SELECT USING (true);
  `);

  await knex.raw(`
    CREATE POLICY "Enable all for authenticated users" ON products
      FOR ALL USING (auth.role() = 'authenticated')
      WITH CHECK (auth.role() = 'authenticated');
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("products");
};
