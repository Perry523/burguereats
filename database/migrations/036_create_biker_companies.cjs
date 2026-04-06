/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  const hasTable = await knex.schema.hasTable("biker_companies");
  if (!hasTable) {
    await knex.schema.createTable("biker_companies", function (table) {
      table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
      table.uuid("biker_id").notNullable();
      table.text("company_id").notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());

      table.unique(["biker_id", "company_id"]);
      table.index(["biker_id"]);
    });

    // Enable RLS (Row Level Security)
    await knex.raw('ALTER TABLE biker_companies ENABLE ROW LEVEL SECURITY;');

    // Policies
    // 1. Admins have full access
    await knex.raw(`
      CREATE POLICY "Admins have full access to biker_companies" 
      ON biker_companies 
      FOR ALL 
      TO authenticated
      USING (true);
    `);

    // In this project, RLS is often handled by Supabase or just bypassed by service role.
    // But adding basic policies is good practice.
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("biker_companies");
};
