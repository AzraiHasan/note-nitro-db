<!--app.vue-->
<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from './stores/auth'
import { onMounted } from 'vue'
import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'

const authStore = useAuthStore()

// Initialize auth state when the app starts
onMounted(() => {
  authStore.initAuth()
})

// Apply auth middleware globally
defineNuxtRouteMiddleware(async (to) => {
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return navigateTo('/login')
  }
})
</script>