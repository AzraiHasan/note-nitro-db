<!--pages/notes/[id].vue-->
<template>
  <div class="note-detail">
    <UBreadcrumb :items="breadcrumbs" />
    <h1 class="text-2xl font-bold mt-4 mb-6">{{ isNewNote ? 'Create New Note' : 'Edit Note' }}</h1>

    <StatusHandler :isLoading="notesStore.isLoading" :error="notesStore.error" @retry="fetchNote">
      <form @submit.prevent="saveNote">
        <UCard>
          <UInput v-model="note.title" label="Title" placeholder="Enter note title" class="mb-4" />
          <UTextarea v-model="note.content" label="Content" placeholder="Enter note content" class="mb-4" />
          <USelect v-model="note.status" :options="['Draft', 'In Progress', 'Completed']" label="Status" class="mb-4" />
          <UTags v-model="note.tags" label="Tags" placeholder="Add tags" class="mb-4" />
          <div class="flex justify-end space-x-2">
            <UButton color="gray" @click="navigateToDashboard">Cancel</UButton>
            <UButton type="submit" color="primary" :loading="notesStore.isLoading">
              {{ isNewNote ? 'Create' : 'Update' }}
            </UButton>
          </div>
        </UCard>
      </form>
    </StatusHandler>

    <UNotification v-model="showNotification" :title="notificationTitle" :description="notificationDescription"
      :color="notificationColor" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useNotesStore } from '@/stores/notes'
import { useRoute, useRouter } from 'vue-router'
import type { Note } from '@/types/index'
import StatusHandler from '@/components/StatusHandler.vue'

const route = useRoute()
const router = useRouter()
const notesStore = useNotesStore()

const isNewNote = computed(() => route.params.id === 'new')
const noteId = computed(() => isNewNote.value ? '' : route.params.id as string)

const note = ref<Note>({
  id: '',
  title: '',
  content: '',
  status: 'Draft',
  tags: [],
  createdAt: new Date(),
  updatedAt: new Date()
})

const showNotification = ref(false)
const notificationTitle = ref('')
const notificationDescription = ref('')
const notificationColor = ref('green')

const breadcrumbs = computed(() => [
  { label: 'Dashboard', to: '/' },
  { label: isNewNote.value ? 'New Note' : 'Edit Note', to: route.fullPath },
])

onMounted(async () => {
  if (!isNewNote.value) {
    await fetchNote()
  }
})

const fetchNote = async () => {
  try {
    const fetchedNote = await notesStore.fetchNote(noteId.value)
    if (fetchedNote) {
      note.value = { ...fetchedNote }
    }
  } catch (error) {
    console.error('Error fetching note:', error)
  }
}

const saveNote = async () => {
  try {
    if (isNewNote.value) {
      await notesStore.createNote(note.value)
      showSuccessNotification('Note created successfully')
    } else {
      await notesStore.updateNote(note.value)
      showSuccessNotification('Note updated successfully')
    }
    navigateToDashboard()
  } catch (error) {
    console.error('Error saving note:', error)
    showErrorNotification('Failed to save note. Please try again.')
  }
}

const navigateToDashboard = () => {
  router.push('/')
}

const showSuccessNotification = (message: string) => {
  notificationTitle.value = 'Success'
  notificationDescription.value = message
  notificationColor.value = 'green'
  showNotification.value = true
}

const showErrorNotification = (message: string) => {
  notificationTitle.value = 'Error'
  notificationDescription.value = message
  notificationColor.value = 'red'
  showNotification.value = true
}
</script>