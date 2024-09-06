<!-- components/Auth.vue -->

<template>
  <div>
    <button v-if="!user" @click="login">Login</button>
    <div v-else>
      <p>Welcome, {{ user.given_name }}!</p>
      <button @click="logout">Logout</button>
    </div>
  </div>
</template>

<script setup>
const { login, logout, user } = useKindeAuth()
</script>