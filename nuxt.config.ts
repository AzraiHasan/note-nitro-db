// https://nuxt.com/docs/api/configuration/nuxt-config
import * as path from 'path';

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@nuxtjs/kinde'],
  kinde: {
    domain: process.env.NUXT_KINDE_AUTH_DOMAIN,
    clientId: process.env.NUXT_KINDE_CLIENT_ID,
    clientSecret: process.env.NUXT_KINDE_CLIENT_SECRET,
    redirectUri: process.env.NUXT_KINDE_REDIRECT_URL,
    logoutRedirectUri: process.env.NUXT_KINDE_LOGOUT_REDIRECT_URL,
    postLoginRedirectURL: process.env.NUXT_KINDE_POST_LOGIN_REDIRECT_URL
  } as any,
  /* build: {
    transpile: ['@nuxtjs/kinde'],
  },
  alias: {
    '#imports': path.resolve(__dirname, 'node_modules/.vite/deps/@nuxtjs/kinde'),
  }, */
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
  }
})
