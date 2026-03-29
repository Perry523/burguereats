/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  const hasTable = await knex.schema.hasTable('Entregadores');
  if (hasTable) {
    await knex.schema.alterTable('Entregadores', function(table) {
      // Check for both camelCase and snake_case just in case
      const columns = ['companyId', 'company_id'];
      for (const col of columns) {
        knex.schema.hasColumn('Entregadores', col).then(has => {
          if (has) {
            table.uuid(col).nullable().alter();
          }
        });
      }
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  // Should not rollback nullability unless strictly necessary
};
