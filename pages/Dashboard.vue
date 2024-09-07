<!-- pages/Dashboard.vue -->
<template>
  <div>
    <h1>Dashboard</h1>
    <div v-if="user">
      <h2>Welcome, {{ user.given_name }}!</h2>
      <div class="profile-section">
        <h3>Your Profile</h3>
        <p>Name: {{ user.given_name }} {{ user.family_name }}</p>
        <p>Email: {{ user.email }}</p>
        <button @click="showEditProfile = true">Edit Profile</button>
      </div>
      <div v-if="showEditProfile" class="edit-profile">
        <h3>Edit Profile</h3>
        <form @submit.prevent="updateProfile">
          <div>
            <label for="given_name">First Name:</label>
            <input id="given_name" v-model="profileForm.given_name" required>
          </div>
          <div>
            <label for="family_name">Last Name:</label>
            <input id="family_name" v-model="profileForm.family_name" required>
          </div>
          <div>
            <label for="email">Email:</label>
            <input id="email" v-model="profileForm.email" type="email" required>
          </div>
          <button type="submit">Update Profile</button>
          <button type="button" @click="showEditProfile = false">Cancel</button>
        </form>
      </div>
      <!-- Here you can add more dashboard sections like recent notes, etc. -->
    </div>
    <div v-else>
      <p>Loading user information...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useKindeAuth } from '#imports'

const { user, getToken } = useKindeAuth()
const showEditProfile = ref(false)
const profileForm = ref({
  given_name: '',
  family_name: '',
  email: ''
})

onMounted(() => {
  if (user.value) {
    profileForm.value = {
      given_name: user.value.given_name,
      family_name: user.value.family_name,
      email: user.value.email
    }
  }
})

const updateProfile = async () => {
  try {
    const token = await getToken()
    const response = await fetch(`${process.env.NUXT_KINDE_AUTH_DOMAIN}/api/v1/user`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(profileForm.value)
    })

    if (response.ok) {
      console.log('Profile updated successfully')
      showEditProfile.value = false
      // You might want to refresh the user data here
    } else {
      console.error('Failed to update profile')
    }
  } catch (error) {
    console.error('Error updating profile:', error)
  }
}
</script>