<!-- pages\dashboard.vue -->

<template>
  <UContainer>
    <UCard class="my-8" v-if="$auth.loggedIn">
      <template #header>
        <h2 class="text-2xl font-bold">Dashboard</h2>
      </template>
      <div class="flex items-center space-x-4">
        <UAvatar v-if="$auth.user?.picture" :src="$auth.user.picture" alt="User avatar" />
        <UAvatar v-else :text="getUserInitials()" />
        <div>
          <h3 class="text-lg font-semibold">
            {{ $auth.user?.given_name }} {{ $auth.user?.family_name }}
          </h3>
          <p class="text-sm text-gray-500">{{ $auth.user?.email }}</p>
        </div>
      </div>
    </UCard>

    <UCard class="my-8" v-if="$auth.loggedIn">
      <template #header>
        <h3 class="text-xl font-semibold">Quick Actions</h3>
      </template>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UButton icon="i-heroicons-document-plus" label="Create New Note" @click="createNote" />
        <UButton icon="i-heroicons-clipboard-document-list" label="View All Notes" @click="viewAllNotes" />
      </div>
    </UCard>

    <UCard class="my-8" v-if="$auth.loggedIn">
      <template #header>
        <h3 class="text-xl font-semibold">Recent Notes</h3>
      </template>

      <!-- <div>
        <li v-for="note in recentNotes" :key="note.id">
          <ul>
            {{ note.title }}
          </ul>
          <ul>
            Last edited: {{ formatDate(note.lastEdited) }}
          </ul>
        </li>
      </div> -->

      <UTable :rows="recentNotes" />
    </UCard>

    <UCard class="my-8" v-else>
      <template #header>
        <h2 class="text-2xl font-bold">Welcome to Nitro Note</h2>
      </template>
      <p class="mb-4">Please log in to access your dashboard and notes.</p>
      <UButton icon="i-heroicons-login" label="Log In" @click="login" />
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
const { $auth } = useNuxtApp()

definePageMeta({
  middleware: ['auth-logged-in'],
})

/* const recentNotes = ref([
  { id: 1, title: 'Meeting Notes', lastEdited: new Date('2024-03-01') },
  { id: 2, title: 'Project Ideas', lastEdited: new Date('2024-02-28') },
  { id: 3, title: 'To-Do List', lastEdited: new Date('2024-02-27') },
]) */

const recentNotes = [
  { id: 1, title: 'Meeting Notes', lastEdited: new Date('2024-03-01') },
  { id: 2, title: 'Project Ideas', lastEdited: new Date('2024-02-28') },
  { id: 3, title: 'To-Do List', lastEdited: new Date('2024-02-27') },
]

const getUserInitials = () => {
  const user = $auth.user
  return `${user?.given_name?.[0] || ''}${user?.family_name?.[0] || ''}`
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const createNote = () => {
   navigateTo('/create-note')
  console.log('Navigate to create note page')
}

const viewAllNotes = () => {
  // Implement navigation to all notes page
  console.log('Navigate to all notes page')
}

const login = () => {
  // Implement login functionality
  console.log('Implement login functionality')
}
</script>