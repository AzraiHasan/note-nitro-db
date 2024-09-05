// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@nuxt/ui','@pinia/nuxt'],
  pinia: {
    storesDirs: ['@/stores/**'],
  },
  nitro: {
    experimental: {
      database: true
    },
    database: {
      default: {
        connector: 'sqlite',
        options: { name: 'db' }
      }
    }
  },
  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET
  }
})