<!--pages/signup.vue-->
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleSignup">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <UInput v-model="name" type="text" autocomplete="name" required placeholder="Full name"
              :error="errors.name" />
          </div>
          <div>
            <UInput v-model="email" type="email" autocomplete="email" required placeholder="Email address"
              :error="errors.email" />
          </div>
          <div>
            <UInput v-model="password" type="password" autocomplete="new-password" required placeholder="Password"
              :error="errors.password" />
          </div>
        </div>

        <div>
          <UButton type="submit" color="primary" block :loading="isLoading">
            Sign up
          </UButton>
        </div>
      </form>
      <div class="text-center">
        <ULink to="/login">Already have an account? Sign in</ULink>
      </div>
    </div>
    <UNotification v-model="showNotification" :title="notificationTitle" :description="notificationDescription"
      :color="notificationColor" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const name = ref('')
const email = ref('')
const password = ref('')
const errors = ref({ name: '', email: '', password: '' })
const isLoading = ref(false)

const showNotification = ref(false)
const notificationTitle = ref('')
const notificationDescription = ref('')
const notificationColor = ref('red')

const handleSignup = async () => {
  errors.value = { name: '', email: '', password: '' }
  isLoading.value = true

  try {
    await authStore.register(name.value, email.value, password.value)
    router.push('/')
  } catch (error) {
    console.error('Signup error:', error)
    notificationTitle.value = 'Error'
    notificationDescription.value = 'Failed to create account. Please try again.'
    notificationColor.value = 'red'
    showNotification.value = true
  } finally {
    isLoading.value = false
  }
}
</script>