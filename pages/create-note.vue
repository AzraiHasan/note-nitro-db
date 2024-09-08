<!-- pages\create-note.vue -->

<template>
  <UContainer>
    <UCard class="my-8">
      <template #header>
        <h2 class="text-2xl font-bold">Create New Note</h2>
      </template>
      <form @submit.prevent="saveNote">
        <UFormGroup label="Title">
          <UInput v-model="note.title" placeholder="Enter note title" />
        </UFormGroup>
        <UFormGroup label="Content" class="mt-4">
          <UTextarea v-model="note.content" placeholder="Enter note content" :rows="6" />
        </UFormGroup>
        <div class="mt-4 flex justify-end space-x-2">
          <UButton color="gray" @click="cancelCreate">Cancel</UButton>
          <UButton type="submit" color="primary">Save Note</UButton>
        </div>
      </form>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth-logged-in'],
})

const note = ref({
  title: '',
  content: '',
})

const saveNote = () => {
  // Here you would typically save the note to your backend
  console.log('Saving note:', note.value)
  // For now, we'll just navigate back to the dashboard
  navigateTo('/dashboard')
}

const cancelCreate = () => {
  navigateTo('/dashboard')
}
</script>