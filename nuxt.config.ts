// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // App head settings (Favicon & Browser Title)
  app: {
    head: {
      title: 'MycoVision — Mushroom Identification & MycoDex',
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
      ],
    },
  },

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
      apiBase: process.env.NUXT_PUBLIC_API_BASE ?? 'http://127.0.0.1:8000/api',
      googleClientId: process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID ?? '',
      appVersion: process.env.NUXT_PUBLIC_APP_VERSION ?? '1.0.0-beta',
      appEnv:     process.env.NUXT_PUBLIC_APP_ENV     ?? (process.env.NODE_ENV ?? 'development'),
    },
  },
})
