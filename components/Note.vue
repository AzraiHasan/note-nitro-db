<template>
  <div class="note">
    <UCard :ui="{ body: { base: 'relative' } }">
      <template #header>
        <div class="flex justify-between items-center">
          <UInput v-model="note.title" placeholder="Note Title" class="text-xl font-bold"
            :disabled="!isEditing || isLoading" @blur="validateField('title')" aria-label="Note Title"
            :error="errors.title" />
          <div>
            <UButton v-if="!isEditing" icon="i-heroicons-pencil" color="gray" variant="ghost" @click="startEditing"
              aria-label="Edit note" />
            <UButton v-else icon="i-heroicons-check" color="primary" variant="solid" @click="saveNote"
              :disabled="isLoading" aria-label="Save note" />
          </div>
        </div>
      </template>

      <div class="mb-4">
        <UTextarea v-model="note.content" :disabled="!isEditing || isLoading" placeholder="Note content..." :rows="5"
          class="w-full" @blur="validateField('content')" aria-label="Note content" :error="errors.content" />
      </div>

      <div class="flex justify-between items-center text-sm text-gray-500">
        <span>Last updated: {{ formatDate(note.updatedAt) }}</span>
        <UBadge :color="getStatusColor(note.status)">
          {{ note.status }}
        </UBadge>
      </div>

      <template #footer>
        <div class="flex justify-between items-center">
          <UTags v-model="note.tags" :disabled="!isEditing || isLoading" />
          <UButton v-if="note.id" icon="i-heroicons-trash" color="red" variant="ghost" @click="confirmDelete"
            :disabled="isLoading" aria-label="Delete note" />
        </div>
      </template>

      <UOverlay v-if="isLoading" :show="isLoading" data-testid="loading-overlay">
        <UCard>
          <UIcon name="i-heroicons-arrow-path" class="animate-spin" />
          <p>Loading...</p>
        </UCard>
      </UOverlay>
    </UCard>

    <UModal v-model="showDeleteModal">
      <UCard>
        <template #header>
          Confirm Deletion
        </template>
        <p>Are you sure you want to delete this note?</p>
        <template #footer>
          <div class="flex justify-end space-x-2">
            <UButton @click="showDeleteModal = false">Cancel</UButton>
            <UButton color="red" @click="deleteNote" :disabled="isLoading">Delete</UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useNotesStore } from '@/stores/notes'
import type { Note } from '@/types'

const props = defineProps<{
  noteId?: string
}>()

const emit = defineEmits<{
  (e: 'update:note', note: Note): void
  (e: 'delete:note', noteId: string): void
}>()

const notesStore = useNotesStore()
const note = ref<Note>({
  id: '',
  title: '',
  content: '',
  status: 'Draft',
  tags: [],
  createdAt: new Date(),
  updatedAt: new Date()
})
const isEditing = ref(false)
const showDeleteModal = ref(false)
const isLoading = ref(false)
const errors = ref({
  title: '',
  content: ''
})

onMounted(async () => {
  if (props.noteId) {
    await fetchNote()
  }
})

const fetchNote = async () => {
  isLoading.value = true
  try {
    const fetchedNote = await notesStore.fetchNote(props.noteId!)
    if (fetchedNote) {
      note.value = fetchedNote
    }
  } catch (error) {
    console.error('Error fetching note:', error)
    // TODO: Handle error (e.g., show error message to user)
  } finally {
    isLoading.value = false
  }
}

const startEditing = () => {
  isEditing.value = true
}

const validateField = (field: 'title' | 'content') => {
  errors.value[field] = ''
  if (field === 'title') {
    if (!note.value.title.trim()) {
      errors.value.title = 'Title is required'
    } else if (note.value.title.length < 3) {
      errors.value.title = 'Title must be at least 3 characters long'
    } else if (note.value.title.length > 100) {
      errors.value.title = 'Title must be no more than 100 characters long'
    }
  } else if (field === 'content') {
    if (!note.value.content.trim()) {
      errors.value.content = 'Content is required'
    } else if (note.value.content.length < 10) {
      errors.value.content = 'Content must be at least 10 characters long'
    }
  }
}

const validateNote = () => {
  validateField('title')
  validateField('content')
  return !errors.value.title && !errors.value.content
}

const saveNote = async () => {
  isLoading.value = true
  if (!validateNote()) {
    isLoading.value = false
    return
  }
  
  try {
    await updateNote()
    isEditing.value = false
  } catch (error) {
    console.error('Error saving note:', error)
    // TODO: Handle error (e.g., show error message to user)
  } finally {
    isLoading.value = false
  }
}

const updateNote = async () => {
  if (note.value.id) {
    await notesStore.updateNote(note.value)
  } else {
    const newNote = await notesStore.createNote(note.value)
    note.value = newNote
  }
  emit('update:note', note.value)
}

const confirmDelete = () => {
  showDeleteModal.value = true
}

const deleteNote = async () => {
  if (note.value.id) {
    isLoading.value = true
    try {
      await notesStore.deleteNote(note.value.id)
      emit('delete:note', note.value.id)
      showDeleteModal.value = false
    } catch (error) {
      console.error('Error deleting note:', error)
      // TODO: Handle error (e.g., show error message to user)
    } finally {
      isLoading.value = false
    }
  }
}

const formatDate = (date: Date): string => {
  return new Date(date).toLocaleString()
}

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'Draft':
      return 'gray'
    case 'In Progress':
      return 'blue'
    case 'Completed':
      return 'green'
    default:
      return 'gray'
  }
}
</script>