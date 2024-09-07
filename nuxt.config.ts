// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/kinde"],
  /* kinde: {
    domain: process.env.NUXT_KINDE_AUTH_DOMAIN,
    clientId: process.env.NUXT_KINDE_CLIENT_ID,
    clientSecret: process.env.NUXT_KINDE_CLIENT_SECRET,
    redirectUri: process.env.NUXT_KINDE_REDIRECT_URL,
    logoutRedirectUri: process.env.NUXT_KINDE_LOGOUT_REDIRECT_URL,
    postLoginRedirectURL: process.env.NUXT_KINDE_POST_LOGIN_REDIRECT_URL
  } as any, */
});
