# Database Setup Guide

## Getting Your Supabase Database Connection String

To run migrations and connect to your Supabase database, you need the correct DATABASE_URL.

### Step 1: Get Database Password

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Select your project: `wtcbcatsxgvaatuhmznl`
3. Go to **Settings** > **Database**
4. Scroll down to **Connection string**
5. Copy the **URI** connection string (it looks like this):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.wtcbcatsxgvaatuhmznl.supabase.co:5432/postgres
   ```

### Step 2: Update Your .env File

Replace the DATABASE_URL in your `.env` file with the actual connection string:

```env
DATABASE_URL=postgresql://postgres:your_actual_password@db.wtcbcatsxgvaatuhmznl.supabase.co:5432/postgres
```

**Important**: Replace `your_actual_password` with your actual database password from Supabase.

### Step 3: Run Migrations

Once you have the correct DATABASE_URL, you can run the migrations:

```bash
# Check migration status
npm run migrate:status

# Run all pending migrations
npm run migrate

# Rollback last migration (if needed)
npm run migrate:rollback
```

## Available Migrations

The project has the following migrations ready to run:

1. **001_create_users_table.ts** - Creates the users table
2. **002_create_company_users_table.ts** - Creates company-user relationships
3. **003_create_companies_table.ts** - Creates companies table
4. **004_create_ai_generations_table.ts** - Creates AI content generation history
5. **015_create_company_social_integrations_table.ts** - Creates social media integrations
6. **016_create_social_media_posts_table.ts** - Creates social media posts table

## Troubleshooting

### Error: "Cannot read properties of undefined (reading 'searchParams')"

This error means the DATABASE_URL is not properly formatted. Make sure:
- You have the actual password (not placeholder text)
- The URL format is correct
- No extra spaces or characters

### Error: "Connection refused"

This means:
- The database password is incorrect
- The database host is wrong
- Network connectivity issues

### Error: "Database does not exist"

Make sure you're connecting to the `postgres` database (default Supabase database name).

## Next Steps

After running migrations successfully:

1. Your database tables will be created in Supabase
2. You can view them in the Supabase dashboard under **Table Editor**
3. The application will be able to store and retrieve data
4. You can start using the Supabase integration features

## Security Note

Never commit your actual database password to version control. The `.env` file should be in your `.gitignore`.
