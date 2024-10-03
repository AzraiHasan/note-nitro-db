// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  nitro: {
    experimental: {
      database: true
    },
    database: {
      default: {
        connector: 'sqlite',
        options: { name: 'db', path: '.data/db.sqlite3' }
      }
    }
  },

  modules: ['@nuxt/ui']
})