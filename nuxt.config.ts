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

  // Runtime config — accessible via useRuntimeConfig()
  runtimeConfig: {
    public: {
      apiBase: 'http://127.0.0.1:8000/api',
    },
  },
})
