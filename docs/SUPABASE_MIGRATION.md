# Supabase Migration to @nuxtjs/supabase

This document explains the migration from direct `@supabase/supabase-js` usage to the official `@nuxtjs/supabase` module.

## What Changed

### Before (Direct Client)
```typescript
// utils/supabase.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  useRuntimeConfig().public.supabaseUrl,
  useRuntimeConfig().public.supabaseAnonKey
)

// In components/composables
import { supabase } from '~/utils/supabase'
const { data } = await supabase.from('users').select('*')
```

### After (@nuxtjs/supabase)
```typescript
// In components/composables - no imports needed!
const supabase = useSupabaseClient()
const { data } = await supabase.from('users').select('*')

// Access current user reactively
const user = useSupabaseUser()
```

## Benefits of @nuxtjs/supabase

1. **Auto-imports**: No need to import the client manually
2. **Reactive user state**: `useSupabaseUser()` provides reactive authentication state
3. **SSR support**: Better server-side rendering integration
4. **Type safety**: Better TypeScript integration
5. **Automatic configuration**: Uses environment variables automatically
6. **Built-in auth helpers**: Additional composables for authentication

## Environment Variables

Make sure these are set in your `.env` file:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_KEY=your_supabase_service_key_here
```

## Available Composables

### `useSupabaseClient()`
Returns the Supabase client instance for database operations.

```typescript
const supabase = useSupabaseClient()
const { data, error } = await supabase.from('users').select('*')
```

### `useSupabaseUser()`
Returns reactive user authentication state.

```typescript
const user = useSupabaseUser()

// In template
<div v-if="user">Welcome, {{ user.email }}!</div>
<div v-else>Please log in</div>
```

### `useSupabaseAuth()`
Provides authentication methods.

```typescript
const { auth } = useSupabaseAuth()

// Sign in
await auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
})

// Sign out
await auth.signOut()
```

## Migration Steps

1. ✅ Install `@nuxtjs/supabase`
2. ✅ Add module to `nuxt.config.ts`
3. ✅ Update environment variables
4. ✅ Keep `supabaseAdmin` for server-side operations
5. 🔄 Replace direct imports with composables in existing code

## Server-Side Usage

For server-side operations with elevated privileges, continue using the `supabaseAdmin` function:

```typescript
// server/api/example.ts
import { supabaseAdmin } from '~/utils/supabase'

export default defineEventHandler(async (event) => {
  const admin = supabaseAdmin()
  const { data } = await admin.from('users').select('*')
  return data
})
```

## Example Usage

See `composables/useSupabaseExample.ts` for complete examples of:
- CRUD operations
- Real-time subscriptions
- Error handling
- TypeScript integration

## Configuration

The module is configured in `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  modules: ['@nuxtjs/supabase'],
  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/register', '/']
    }
  }
})
```

## Setup Instructions

### 1. Configure Supabase Project

1. Create a new Supabase project at https://supabase.com
2. Go to Settings > API in your Supabase dashboard
3. Copy your project URL and API keys

### 2. Update Environment Variables

Update your `.env` file with your actual Supabase credentials:

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_actual_anon_key_here
SUPABASE_SERVICE_KEY=your_actual_service_role_key_here
```

### 3. Restart Development Server

After updating the environment variables, restart your development server:

```bash
npm run dev
```

The `@nuxtjs/supabase` module will now be automatically loaded and configured.

### 4. Verify Setup

You can verify the setup is working by using the composables in any component:

```vue
<template>
  <div>
    <div v-if="user">Welcome, {{ user.email }}!</div>
    <div v-else>Not logged in</div>
  </div>
</template>

<script setup>
const user = useSupabaseUser()
const supabase = useSupabaseClient()

// Test database connection
onMounted(async () => {
  const { data, error } = await supabase.from('users').select('count')
  console.log('Database connection test:', { data, error })
})
</script>
```

## Next Steps

1. ✅ Install and configure @nuxtjs/supabase module
2. ✅ Update environment variables with real Supabase credentials
3. 🔄 Update existing code to use the new composables
4. 🔄 Remove direct imports of the old supabase client
5. 🔄 Test authentication flows
6. 🔄 Update any custom auth logic to use the new helpers

## Current Status

- ✅ Module installed and conditionally loaded
- ✅ Configuration set up to handle missing credentials gracefully
- ✅ Development server runs without errors
- ⏳ Waiting for proper Supabase credentials to be configured
