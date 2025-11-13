// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  modules: [
    "@nuxt/eslint",
    "@nuxt/image",
    "@nuxt/ui",
    "@nuxt/test-utils",
    "@nuxt/scripts",
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
  ],
  plugins: [{ src: "~/plugins/supabase.client", mode: "client" }],

  css: ["~/assets/css/main.css"],

  // colorMode: {
  //   preference: "light",
  //   fallback: "light",
  //   classSuffix: "",
  //   storageKey: "nuxt-color-mode",
  // },

  ui: {
    colorMode: false,
  },

  piniaPersistedstate: {
    storage: "localStorage",
  },

  typescript: {
    typeCheck: false,
  },

  ssr: false,

  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL,
    jwtSecret: process.env.JWT_SECRET,
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    },
  },
  nitro: {
    compressPublicAssets: true,
    // Force knex and pg to be bundled instead of externalized for Vercel
    preset: 'vercel',
    externals: {
      inline: [
        'knex',
        'pg',
        'tarn',
        'pg-connection-string',
        'pg-pool',
        'pg-types',
      ],
    },
    // rollupConfig: {
    //   external: (id) => {
    //     // Keep knex and pg packages bundled (not external)
    //     if (id === 'knex' || id.startsWith('pg')) {
    //       return false
    //     }
    //     // Externalize everything else
    //     return true
    //   }
    // }
    rollupConfig: {
      external: [],
    },
  }
});
