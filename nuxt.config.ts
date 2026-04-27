// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Register global CSS
  css: ['~/assets/css/main.css'],

  // Point Nuxt to the app/ directory
  srcDir: 'app/',
})
