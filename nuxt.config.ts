// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Nuxt modules
  modules: ['@nuxtjs/tailwindcss'],

  // Register global CSS
  css: ['~/assets/css/main.css'],

  // Point Nuxt to the app/ directory
  srcDir: 'app/',

  // Serve static assets from the root public/ folder.
  // In Nuxt 3 this path is resolved relative to srcDir (app/), so '../public' = view/public
  dir: {
    public: '../public',
  },

  // Runtime config — accessible via useRuntimeConfig()
  runtimeConfig: {
    public: {
      // Browser-facing API URL. Override in production with NUXT_PUBLIC_API_BASE.
      apiBase: process.env.NUXT_PUBLIC_API_BASE ?? 'http://127.0.0.1:8000/api',
      googleClientId: process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID ?? '',
    },
  },
})
