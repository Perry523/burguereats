/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  // Change dish_id column type from UUID to TEXT
  await knex.raw(
    "ALTER TABLE order_items ALTER COLUMN dish_id TYPE TEXT USING dish_id::text"
  );
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.raw(
    "ALTER TABLE order_items ALTER COLUMN dish_id TYPE UUID USING dish_id::uuid"
  );
};
