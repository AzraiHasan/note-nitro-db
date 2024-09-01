<!--components/Dashboard.vue-->
<template>
  <div class="dashboard">
    <UCard v-if="isLoading">
      <template #header>
        <USkeleton class="h-8 w-1/3" />
      </template>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <UCard v-for="i in 3" :key="i">
          <template #header>
            <USkeleton class="h-6 w-1/2" />
          </template>
          <USkeleton class="h-12 w-full" />
        </UCard>
      </div>
    </UCard>

    <UCard v-else>
      <template #header>
        <h1 class="text-2xl font-bold">Notes Dashboard</h1>
      </template>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <UCard v-for="status in ['Draft', 'In Progress', 'Completed']" :key="status">
          <template #header>
            <h2 class="text-xl font-semibold">{{ status }}</h2>
          </template>

          <div class="space-y-2">
            <p class="text-3xl font-bold">{{ getNotesCount(status) }}</p>
            <p class="text-sm text-gray-500">{{ status === 'Completed' ? 'notes completed' : 'notes' }}</p>
          </div>
        </UCard>
      </div>

      <template #footer>
        <UButton icon="i-heroicons-plus" label="Create New Note" @click="navigateToNewNote" />
      </template>
    </UCard>

    <UCard class="mt-8" v-if="isLoading">
      <template #header>
        <div class="flex justify-between items-center">
          <USkeleton class="h-6 w-1/4" />
          <USkeleton class="h-8 w-1/3" />
        </div>
      </template>
      <USkeleton class="h-64 w-full" />
    </UCard>

    <UCard v-else class="mt-8">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Recent Notes</h2>
          <USelect v-model="selectedStatus" :options="['All', 'Draft', 'In Progress', 'Completed']"
            placeholder="Filter by status" />
        </div>
      </template>

      <UTable :columns="columns" :rows="filteredNotes" :sort="{ column: 'updatedAt', direction: 'desc' }">
        <template #title-data="{ row }">
          <ULink :to="`/notes/${row.id}`">{{ row.title }}</ULink>
        </template>
        <template #status-data="{ row }">
          <UBadge :color="getStatusColor(row.status)">{{ row.status }}</UBadge>
        </template>
        <template #updatedAt-data="{ row }">
          {{ formatDate(row.updatedAt) }}
        </template>
        <template #actions-data="{ row }">
          <UButton icon="i-heroicons-pencil" color="gray" variant="ghost" @click="navigateToEditNote(row.id)"
            aria-label="Edit note" />
        </template>
      </UTable>
    </UCard>
    <!-- <UModal v-model="showCreateNoteModal">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Create New Note</h3>
        </template>
        <form @submit.prevent="createNewNoteAsync">
          <UInput v-model="newNote.title" label="Title" placeholder="Enter note title" class="mb-4"
            :error="validationErrors.title" />
          <UTextarea v-model="newNote.content" label="Content" placeholder="Enter note content" class="mb-4"
            :error="validationErrors.content" />
          <USelect v-model="newNote.status" :options="['Draft', 'In Progress', 'Completed']" label="Status"
            class="mb-4" />
          <UButton type="submit" color="primary" :loading="isCreating">
            Create Note
          </UButton>
        </form>
      </UCard>
    </UModal> -->

    <UNotification v-model="showNotification" :title="notificationTitle" :description="notificationDescription"
      :color="notificationColor" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useNotesStore } from '@/stores/notes'
import type { Note } from '@/types/index'

const notesStore = useNotesStore()
const selectedStatus = ref('All')
const showCreateNoteModal = ref(false)
const isCreating = ref(false)
const router = useRouter()
const isLoading = ref(true)

const navigateToNewNote = () => {
  router.push('/notes/new')
}

const navigateToEditNote = (id: string) => {
  router.push(`/notes/${id}`)
}

const newNote = ref({
  title: '',
  content: '',
  status: 'Draft' as 'Draft' | 'In Progress' | 'Completed',
})

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'status', label: 'Status' },
  { key: 'updatedAt', label: 'Last Updated' },
]

const validationErrors = ref({
  title: '',
  content: '',
})

const showNotification = ref(false)
const notificationTitle = ref('')
const notificationDescription = ref('')
const notificationColor = ref('green')

// Fetch notes when the component is mounted
const { notes } = storeToRefs(notesStore)
await notesStore.fetchNotes()

const filteredNotes = computed(() => {
  return selectedStatus.value === 'All'
    ? notes.value
    : notes.value.filter(note => note.status === selectedStatus.value)
})

const getNotesCount = (status: String) => {
  return notes.value.filter(note => note.status === status).length
}

const validateNote = () => {
  validationErrors.value = {
    title: '',
    content: '',
  }

  if (!newNote.value.title.trim()) {
    validationErrors.value.title = 'Title is required'
  }

  if (!newNote.value.content.trim()) {
    validationErrors.value.content = 'Content is required'
  }

  return !validationErrors.value.title && !validationErrors.value.content
}

const showSuccessNotification = () => {
  notificationTitle.value = 'Success'
  notificationDescription.value = 'Note created successfully'
  notificationColor.value = 'green'
  showNotification.value = true
}

const showErrorNotification = (error: string) => {
  notificationTitle.value = 'Error'
  notificationDescription.value = error
  notificationColor.value = 'red'
  showNotification.value = true
}

const createNewNoteAsync = async () => {
  if (!validateNote()) return

  isCreating.value = true
  try {
    await notesStore.createNote({
      title: newNote.value.title,
      content: newNote.value.content,
      status: newNote.value.status,
      tags: [],
    })
    showCreateNoteModal.value = false
    newNote.value = { title: '', content: '', status: 'Draft' }
    await notesStore.fetchNotes() // Refresh the notes list
    showSuccessNotification()
  } catch (error) {
    console.error('Error creating note:', error)
    showErrorNotification('Failed to create note. Please try again.')
  } finally {
    isCreating.value = false
  }
}

const formatDate = (date: Date) => {
  return new Date(date).toLocaleString()
}

const getStatusColor = (status: string) => {
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