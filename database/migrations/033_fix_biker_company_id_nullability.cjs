/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  const hasTable = await knex.schema.hasTable('Entregadores');
  if (hasTable) {
    const hasCompanyId = await knex.schema.hasColumn('Entregadores', 'companyId');
    if (hasCompanyId) {
      await knex.schema.alterTable('Entregadores', function(table) {
        table.uuid('companyId').nullable().alter();
      });
    }
    
    // Also check for snake_case just in case
    const hasCompany_id = await knex.schema.hasColumn('Entregadores', 'company_id');
    if (hasCompany_id) {
      await knex.schema.alterTable('Entregadores', function(table) {
        table.uuid('company_id').nullable().alter();
      });
    }
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  // Not rolling back
};
