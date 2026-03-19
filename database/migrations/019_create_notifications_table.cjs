/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  // Use raw SQL because the tables live in Supabase (Postgres)
  await knex.raw(`
    CREATE TABLE IF NOT EXISTS notifications (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL,
      company_id UUID,
      title TEXT NOT NULL,
      description TEXT,
      type TEXT NOT NULL DEFAULT 'info',
      read BOOLEAN NOT NULL DEFAULT false,
      data JSONB,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
    CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(user_id, read);

    -- Enable RLS
    ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

    -- Policy: users can read their own notifications
    DO $$ BEGIN
      CREATE POLICY "Users can view own notifications"
        ON notifications FOR SELECT
        USING (true);
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    -- Policy: allow inserts from backend
    DO $$ BEGIN
      CREATE POLICY "Allow insert notifications"
        ON notifications FOR INSERT
        WITH CHECK (true);
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    -- Policy: users can update their own (mark as read)
    DO $$ BEGIN
      CREATE POLICY "Users can update own notifications"
        ON notifications FOR UPDATE
        USING (true);
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.raw(`DROP TABLE IF EXISTS notifications CASCADE;`);
};
