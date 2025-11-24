/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  // Drop existing policies
  await knex.raw(
    'DROP POLICY IF EXISTS "Enable read access for all users" ON products'
  );
  await knex.raw(
    'DROP POLICY IF EXISTS "Enable all for authenticated users" ON products'
  );

  // Create new policies using auth.uid() which works with Supabase
  await knex.raw(`
    CREATE POLICY "Enable read access for all users" ON products
      FOR SELECT USING (true);
  `);

  await knex.raw(`
    CREATE POLICY "Enable insert for authenticated users" ON products
      FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
  `);

  await knex.raw(`
    CREATE POLICY "Enable update for authenticated users" ON products
      FOR UPDATE USING (auth.uid() IS NOT NULL);
  `);

  await knex.raw(`
    CREATE POLICY "Enable delete for authenticated users" ON products
      FOR DELETE USING (auth.uid() IS NOT NULL);
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  // Drop new policies
  await knex.raw(
    'DROP POLICY IF EXISTS "Enable read access for all users" ON products'
  );
  await knex.raw(
    'DROP POLICY IF EXISTS "Enable insert for authenticated users" ON products'
  );
  await knex.raw(
    'DROP POLICY IF EXISTS "Enable update for authenticated users" ON products'
  );
  await knex.raw(
    'DROP POLICY IF EXISTS "Enable delete for authenticated users" ON products'
  );

  // Recreate original policies
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
