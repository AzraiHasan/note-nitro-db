<!--pages/dashboard.vue-->
<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">Dashboard</h1>
    <Dashboard />
  </div>
</template>

<script setup lang="ts">
// Nuxt 3 auto-imports components, so no need to explicitly import Dashboard
definePageMeta({
  requiresAuth: true
})
</script>