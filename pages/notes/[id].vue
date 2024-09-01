<!--pages/notes/[id].vue-->
<template>
  <div class="note-detail">
    <UBreadcrumb :items="breadcrumbs" />
    <h1 class="text-2xl font-bold mt-4 mb-6">{{ isNewNote ? 'Create New Note' : 'Edit Note' }}</h1>

    <UCard v-if="isLoading">
      <USkeleton class="h-8 w-full mb-4" />
      <USkeleton class="h-32 w-full mb-4" />
      <USkeleton class="h-8 w-1/3 mb-4" />
    </UCard>

    <form v-else @submit.prevent="saveNoteAsync">
      <UCard>
        <UInput v-model="note.title" label="Title" placeholder="Enter note title" class="mb-4"
          :error="validationErrors.title" />
        <UTextarea v-model="note.content" label="Content" placeholder="Enter note content" class="mb-4"
          :error="validationErrors.content" />
        <USelect v-model="note.status" :options="['Draft', 'In Progress', 'Completed']" label="Status" class="mb-4" />
        <UTags v-model="note.tags" label="Tags" placeholder="Add tags" class="mb-4" />
        <div class="flex justify-end space-x-2">
          <UButton color="gray" @click="navigateToDashboard">Cancel</UButton>
          <UButton type="submit" color="primary" :loading="isSaving">
            {{ isNewNote ? 'Create' : 'Update' }}
          </UButton>
        </div>
      </UCard>
    </form>

    <UNotification v-model="showNotification" :title="notificationTitle" :description="notificationDescription"
      :color="notificationColor" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useNotesStore } from '@/stores/notes'
import { useRoute, useRouter } from 'vue-router'
import type { Note } from '@/types/index'

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

const isLoading = ref(false)
const isSaving = ref(false)
const showNotification = ref(false)
const notificationTitle = ref('')
const notificationDescription = ref('')
const notificationColor = ref('green')

const validationErrors = ref({
  title: '',
  content: '',
})

const breadcrumbs = computed(() => [
  { label: 'Dashboard', to: '/' },
  { label: isNewNote.value ? 'New Note' : 'Edit Note', to: route.fullPath },
])

// Fetch note data if editing an existing note
if (!isNewNote.value) {
  const fetchNote = async () => {
    isLoading.value = true
    try {
      const fetchedNote = await notesStore.fetchNote(noteId.value)
      if (fetchedNote) {
        note.value = { ...fetchedNote }
      }
    } catch (error) {
      console.error('Error fetching note:', error)
      showErrorNotification('Failed to load note. Please try again.')
    } finally {
      isLoading.value = false
    }
  }
  fetchNote()
}

const validateNote = () => {
  validationErrors.value = {
    title: '',
    content: '',
  }

  if (!note.value.title.trim()) {
    validationErrors.value.title = 'Title is required'
  }

  if (!note.value.content.trim()) {
    validationErrors.value.content = 'Content is required'
  }

  return !validationErrors.value.title && !validationErrors.value.content
}

const showSuccessNotification = (message: string) => {
  notificationTitle.value = 'Success'
  notificationDescription.value = message
  notificationColor.value = 'green'
  showNotification.value = true
}

const showErrorNotification = (error: string) => {
  notificationTitle.value = 'Error'
  notificationDescription.value = error
  notificationColor.value = 'red'
  showNotification.value = true
}

const saveNoteAsync = async () => {
  if (!validateNote()) return

  isSaving.value = true
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
  } finally {
    isSaving.value = false
  }
}

const navigateToDashboard = () => {
  router.push('/')
}
</script>