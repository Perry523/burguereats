exports.up = async function (knex) {
  // Create table
  await knex.schema.createTable("biker_locations", (table) => {
    table.uuid("biker_id").primary().notNullable(); // Corresponds to user.id
    table.string("biker_name").nullable();
    table.decimal("latitude", 10, 7).notNullable();
    table.decimal("longitude", 10, 7).notNullable();
    table.decimal("speed", 10, 2).nullable();
    table.decimal("heading", 10, 2).nullable();
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });

  // Execute raw Postgres commands for Supabase specific configurations
  // 1. Enable Realtime for the table
  await knex.raw('alter publication supabase_realtime add table biker_locations;');
  
  // 2. Enable RLS
  await knex.raw('alter table biker_locations enable row level security;');
  
  // 3. Create permissive policies for tracking (since anyone with auth can track right now based on our setup)
  await knex.raw(`create policy "Allow insert for all" on biker_locations for insert with check (true);`);
  await knex.raw(`create policy "Allow select for all" on biker_locations for select using (true);`);
  await knex.raw(`create policy "Allow update for all" on biker_locations for update using (true);`);
};

exports.down = async function (knex) {
  // Drop policies
  await knex.raw(`drop policy if exists "Allow insert for all" on biker_locations;`);
  await knex.raw(`drop policy if exists "Allow select for all" on biker_locations;`);
  await knex.raw(`drop policy if exists "Allow update for all" on biker_locations;`);
  
  // Disable RLS
  await knex.raw('alter table biker_locations disable row level security;');
  
  // Remove from Realtime publication
  await knex.raw('alter publication supabase_realtime drop table biker_locations;');

  // Drop table
  await knex.schema.dropTable("biker_locations");
};
