/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  // Drop the problematic foreign key constraint
  await knex.raw('ALTER TABLE clients DROP CONSTRAINT IF EXISTS clients_company_id_foreign');
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  // It's generally not safe to reverse this if the referenced table/data doesn't exist,
  // but we provide the statement for completeness.
  // await knex.raw('ALTER TABLE clients ADD CONSTRAINT clients_company_id_foreign FOREIGN KEY (company_id) REFERENCES users(id) ON DELETE CASCADE');
};
