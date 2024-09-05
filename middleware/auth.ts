// middleware/auth.ts
import { useAuthStore } from "@/stores/auth"

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  
  // If the user is not authenticated and is trying to access a protected route
  if (!authStore.isAuthenticated && to.meta.requiresAuth) {
    // Redirect to login page
    return navigateTo('/login')
  }
})