/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  const hasTable = await knex.schema.hasTable("biker_assignments");
  if (!hasTable) {
    await knex.schema.createTable("biker_assignments", function (table) {
      table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
      table.uuid("biker_id").notNullable();
      table.text("company_id").notNullable();
      table.string("date", 10).notNullable(); // YYYY-MM-DD
      table.string("status").defaultTo("confirmado"); // "confirmado" or "cancelado"
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());

      table.index(["biker_id", "date"]);
      table.index(["company_id", "date"]);
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("biker_assignments");
};
