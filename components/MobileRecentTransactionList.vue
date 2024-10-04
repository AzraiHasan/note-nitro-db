<template>
  <div class="recent-transaction-list mt-6">
    <h2 class="text-xl font-bold mb-4">Recent Transaction List</h2>
    <div v-if="!loading && transactions.length" class="space-y-4">
      <UCard v-for="transaction in transactions" :key="transaction.id" class="transaction-card">
        <div class="flex justify-between items-center mb-2">
          <div>
            <div class="font-semibold">{{ formatDate(transaction.date) }}</div>
            <div class="text-gray-600 text-sm">{{ transaction.category }}</div>
          </div>
          <div class="">
            <span :class="transaction.type === 'Cash In' ? 'text-green-600' : 'text-red-600'" class="font-bold mr-4">
              {{ formatAmount(transaction.amount, transaction.type) }}
            </span>
            <UButton v-if="isToday(transaction.date)" size="lg" color="primary" @click="openEditModal(transaction)">
              Edit
            </UButton>
            <span v-else class="text-lg text-gray-500">Synced</span>
          </div>
        </div>
        <p class="text-sm">{{ transaction.text }}</p>
      </UCard>
    </div>
    <UAlert v-else-if="!loading && transactions.length === 0" icon="i-heroicons-information-circle" color="info"
      title="No transactions" :description="errorMessage || 'No transactions found.'" />
    <UProgress v-else indeterminate color="primary" />

    <!-- Edit Modal -->
    <UModal v-model="showModal">
      <UCard>
        <template #header>
          <h3 class="text-lg font-bold">Edit Transaction</h3>
        </template>
        <UForm :state="editingTransaction" @submit="validateAndSave">
          <UFormGroup label="Date" name="date">
            <UInput v-model="editingTransaction.date" type="date" />
          </UFormGroup>
          <UFormGroup label="Amount (MYR)" name="amount">
            <UInput v-model="editingTransaction.amount" type="number" step="0.01" />
          </UFormGroup>
          <UFormGroup label="Type" name="type">
            <USelect v-model="editingTransaction.type" :options="typeOptions" @change="updateCategoryOptions" />
          </UFormGroup>
          <UFormGroup label="Category" name="category">
            <USelect v-model="editingTransaction.category" :options="categoryOptions" />
          </UFormGroup>
          <UFormGroup label="Note" name="text">
            <UTextarea v-model="editingTransaction.text" />
          </UFormGroup>
          <UButton type="submit" color="primary" class="mr-2">Save</UButton>
          <UButton @click="closeModal" color="gray">Cancel</UButton>
        </UForm>
      </UCard>
    </UModal>
  </div>
</template>

<script setup>
// The script section remains unchanged
import { ref, reactive, watch, onMounted } from 'vue'

const transactions = ref([])
const errorMessage = ref('')
const loading = ref(true)
const showModal = ref(false)
const editingTransaction = reactive({
  id: null,
  text: '',
  amount: 0,
  type: '',
  category: '',
  date: ''
})

const typeOptions = [
  { label: 'Cash In', value: 'Cash In' },
  { label: 'Cash Out', value: 'Cash Out' }
]
const categoryOptions = ref([])

const props = defineProps({
  refreshTrigger: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['error', 'refresh'])

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function isToday(dateString) {
  const today = new Date()
  const transactionDate = new Date(dateString)
  return today.toDateString() === transactionDate.toDateString()
}

function formatAmount(amount, type) {
  const formattedAmount = new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR' }).format(amount)
  return type === 'Cash In' ? `+${formattedAmount}` : `-${formattedAmount}`
}

function updateCategoryOptions() {
  if (editingTransaction.type === 'Cash In') {
    categoryOptions.value = [
      { label: 'Sales', value: 'Sales' },
      { label: 'Balance', value: 'Balance' },
      { label: 'Other', value: 'Other' }
    ]
  } else {
    categoryOptions.value = [
      { label: 'Ingredients', value: 'Ingredients' },
      { label: 'Supplies', value: 'Supplies' },
      { label: 'Salary', value: 'Salary' },
      { label: 'Utilities', value: 'Utilities' },
      { label: 'Rent', value: 'Rent' },
      { label: 'Other', value: 'Other' }
    ]
  }
}

function openEditModal(transaction) {
  Object.assign(editingTransaction, {
    ...transaction,
    date: new Date(transaction.date).toISOString().split('T')[0] // Format as YYYY-MM-DD for input
  })
  updateCategoryOptions()
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  Object.keys(editingTransaction).forEach(key => editingTransaction[key] = '')
}

async function validateAndSave() {
  try {
    const transactionToSend = {
      ...editingTransaction,
      date: new Date(editingTransaction.date).toISOString().split('T')[0] // Format as YYYY-MM-DD
    };

    const response = await fetch(`/api/updateTransaction/${editingTransaction.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transactionToSend),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    await fetchTransactions()
    closeModal()
  } catch (error) {
    console.error('Error updating transaction:', error)
    errorMessage.value = 'Failed to update transaction. Please try again.'
  }
}

async function fetchTransactions() {
  loading.value = true
  try {
    const response = await fetch('/api/getRecentTransactions')
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    transactions.value = Array.isArray(data) ? data : []
    errorMessage.value = ''
  } catch (error) {
    console.error('Error fetching transactions:', error)
    errorMessage.value = 'Error fetching transactions.'
    emit('error', 'Error fetching transactions. Please check the console for details.')
    transactions.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchTransactions()
})

watch(() => props.refreshTrigger, () => {
  fetchTransactions()
})
</script>

<style scoped>
.transaction-card {
  transition: all 0.3s ease;
}
</style>