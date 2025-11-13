// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    // head: {
    //   title: "Tomatiza 🍅 | Plataforma de Gestão Empresarial",
    //   meta: [
    //     { charset: "utf-8" },
    //     { name: "viewport", content: "width=device-width, initial-scale=1" },
    //     {
    //       name: "description",
    //       content:
    //         "Plataforma completa de gestão empresarial com integração ao Instagram e Facebook, geração de conteúdo com IA e automação de redes sociais",
    //     },
    //     {
    //       name: "keywords",
    //       content:
    //         "gestão empresarial, redes sociais, instagram, facebook, automação, IA, conteúdo, marketing digital, Tomatiza",
    //     },
    //     { name: "author", content: "Tomatiza" },
    //     {
    //       property: "og:title",
    //       content: "Tomatiza 🍅 | Plataforma de Gestão Empresarial",
    //     },
    //     {
    //       property: "og:description",
    //       content:
    //         "Plataforma completa de gestão empresarial com integração ao Instagram e Facebook, geração de conteúdo com IA e automação de redes sociais",
    //     },
    //     { property: "og:type", content: "website" },
    //     { property: "og:image", content: "/Tomatiza-og-image.png" },
    //     { name: "twitter:card", content: "summary_large_image" },
    //     {
    //       name: "twitter:title",
    //       content: "Tomatiza 🍅 | Plataforma de Gestão Empresarial",
    //     },
    //     {
    //       name: "twitter:description",
    //       content:
    //         "Plataforma completa de gestão empresarial com integração ao Instagram e Facebook",
    //     },
    //   ],
    // },
  },
  modules: [
    "@nuxtjs/eslint-module",
    "@nuxt/ui",
    "@averjs/nuxt-compression",
    "@nuxt/image",
    "@nuxtjs/supabase",
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
  ],
  css: ["~/assets/css/main.css"],

  nitro: {
    compressPublicAssets: true,
  },
  colorMode: {
    preference: "light", // default theme
    dataValue: "theme", // activate data-theme in <html> tag
    fallback: "light",
    classSuffix: "",
  },

  // eslint-disable-next-line
  // @ts-ignore
  runtimeConfig: {
    // Private keys (only available on server-side)
    supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY,
    databaseUrl: process.env.DATABASE_URL,
    jwtSecret: process.env.JWT_SECRET,
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    public: {
      API_URL: process.env.API_URL,
      GEMINI_API_KEY: process.env.GEMINI_API_KEY,
      INSTAGRAM_APP_ID: process.env.INSTAGRAM_APP_ID,
      INSTAGRAM_APP_SECRET: process.env.INSTAGRAM_APP_SECRET,
      INSTAGRAM_REDIRECT_URI: process.env.INSTAGRAM_REDIRECT_URI,
      FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID,
      FACEBOOK_APP_SECRET: process.env.FACEBOOK_APP_SECRET,
      FACEBOOK_REDIRECT_URI: process.env.FACEBOOK_REDIRECT_URI,
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    },
  },

  typescript: {
    typeCheck: false,
  },

  devtools: {
    enabled: true,
  },

  pinia: {
    // autoImports: ["defineStore", "storeToRefs"]
  },

  piniaPersistedstate: {
    storage: "localStorage",
  },

  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_ANON_KEY,
    types: "./types/supabase.ts",
    redirect: false,
    redirectOptions: {
      login: "/login",
      callback: "/confirm",
      exclude: [
        "/register",
        "/criar-conta",
        "/",
        "",
        "register",
        "criar-conta",
      ],
    },
    // redirectOptions: {
    //   login: "/login",
    //   callback: "/confirm",
    //   exclude: [
    //     "/register",
    //     "/criar-conta",
    //     "/",
    //     "",
    //     "register",
    //     "criar-conta",
    //   ],
    // },
  },
  ssr: true,
  compatibilityDate: "2024-07-22",
});
