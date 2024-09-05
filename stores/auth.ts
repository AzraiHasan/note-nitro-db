// stores/auth.ts
import { defineStore } from 'pinia'

interface User {
  id: string
  name: string
  email: string
}

interface AuthResponse {
  success: boolean;
  user: User;
  token: string;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: null as string | null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user,
  },

  actions: {
    async register(name: string, email: string, password: string) {
      try {
        const response = await $fetch('/api/auth', {
          method: 'POST',
          body: { action: 'register', name, email, password },
        }) as AuthResponse
        if (response.success) {
          this.user = response.user
          // After registration, we usually want to log in the user
          await this.login(email, password)
        }
      } catch (error) {
        console.error('Registration error:', error)
        throw error
      }
    },

    async login(email: string, password: string) {
      try {
        const response = await $fetch('/api/auth', {
          method: 'POST',
          body: { action: 'login', email, password },
        }) as AuthResponse
        if (response.success) {
          this.token = response.token
          localStorage.setItem('auth_token', response.token)
          await this.fetchUser()
        }
      } catch (error) {
        console.error('Login error:', error)
        throw error
      }
    },

    async fetchUser() {
      try {
        const user = await $fetch('/api/auth/user', {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }) as { id: string; name: string; email: string; }
        this.user = user
      } catch (error) {
        console.error('Error fetching user:', error)
        this.logout()
      }
    },

    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('auth_token')
    },

    async initAuth() {
      const token = localStorage.getItem('auth_token')
      if (token) {
        this.token = token
        await this.fetchUser()
      }
    },
  },
})