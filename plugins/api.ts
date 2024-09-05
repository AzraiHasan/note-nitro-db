// plugins/api.ts
import { defineNuxtPlugin } from 'nuxt/app'
import { useAuthStore } from '@/stores/auth'
import type { FetchOptions } from 'ofetch'

export default defineNuxtPlugin((nuxtApp) => {
  const authStore = useAuthStore()

  const apiFetch = $fetch.create({
    onRequest({ options }) {
      if (authStore.token) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${authStore.token}`
        }
      }
    }
  })

  return {
    provide: {
      apiFetch
    }
  }
})