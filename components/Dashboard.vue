<!--components/Dashboard.vue-->
<template>
  <div class="dashboard">
    <StatusHandler :isLoading="notesStore.isLoading" :error="notesStore.error" @retry="fetchNotes">
      <UCard>
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

      <UCard class="mt-8">
        <template #header>
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
            <h2 class="text-xl font-semibold">Recent Notes</h2>
            <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <USelect v-model="selectedStatus" :options="['All', 'Draft', 'In Progress', 'Completed']"
                placeholder="Filter by status" />
              <USelect v-model="sortBy" :options="sortOptions" placeholder="Sort by" />
            </div>
          </div>
        </template>

        <UInput v-model="searchQuery" icon="i-heroicons-magnifying-glass" placeholder="Search notes..." class="mb-4" />

        <UTable :columns="columns" :rows="sortedAndFilteredNotes" :sort="{ column: sortBy, direction: sortDirection }">
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
    </StatusHandler>

    <UNotification v-model="showNotification" :title="notificationTitle" :description="notificationDescription"
      :color="notificationColor" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useNotesStore } from '@/stores/notes'
import { useRouter } from 'vue-router'
import type { Note } from '@/types/index'
import StatusHandler from '@/components/StatusHandler.vue'

const router = useRouter()
const notesStore = useNotesStore()

const selectedStatus = ref('All')
const searchQuery = ref('')
const sortBy = ref('updatedAt')
const sortDirection = ref('desc')
const showNotification = ref(false)
const notificationTitle = ref('')
const notificationDescription = ref('')
const notificationColor = ref('green')

const sortOptions = [
  { label: 'Last Updated', value: 'updatedAt' },
  { label: 'Title', value: 'title' },
  { label: 'Status', value: 'status' },
]

const columns = [
  { key: 'title', label: 'Title', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'updatedAt', label: 'Last Updated', sortable: true },
  { key: 'actions', label: 'Actions' }
]

onMounted(async () => {
  await fetchNotes()
})

const fetchNotes = async () => {
  try {
    await notesStore.fetchNotes()
  } catch (error) {
    console.error('Error fetching notes:', error)
  }
}

const filteredNotes = computed(() => {
  return notesStore.notes.filter(note => {
    const statusMatch = selectedStatus.value === 'All' || note.status === selectedStatus.value
    const searchMatch = note.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                        note.content.toLowerCase().includes(searchQuery.value.toLowerCase())
    return statusMatch && searchMatch
  })
})

const sortedAndFilteredNotes = computed(() => {
  return [...filteredNotes.value].sort((a: Note, b: Note) => {
    const aValue = a[sortBy.value as keyof Note]
    const bValue = b[sortBy.value as keyof Note]
    if (aValue < bValue) return sortDirection.value === 'asc' ? -1 : 1
    if (aValue > bValue) return sortDirection.value === 'asc' ? 1 : -1
    return 0
  })
})

const getNotesCount = (status: string) => {
  return notesStore.getNotesByStatus(status).length
}

const navigateToNewNote = () => {
  router.push('/notes/new')
}

const navigateToEditNote = (id: string) => {
  router.push(`/notes/${id}`)
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