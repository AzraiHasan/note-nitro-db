<template>
  <div class="recent-transaction-list">
    <h2>Recent Transaction List</h2>
    <div v-if="loading">Loading transactions...</div>
    <table v-else-if="transactions.length">
      <thead>
        <tr>
          <th>ID</th>
          <th>Text</th>
          <th>Created At</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="transaction in transactions" :key="transaction.id">
          <td>{{ transaction.id }}</td>
          <td>{{ transaction.text }}</td>
          <td>{{ formatDate(transaction.created_at) }}</td>
          <td>
            <button v-if="isToday(transaction.created_at)" @click="editTransaction(transaction.id)">
              Edit
            </button>
            <span v-else>Synced</span>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else>No transactions found. {{ errorMessage }}</p>
    <p>Debug: {{ transactions.length }} transactions</p>
    <button @click="manualFetch">Manual Fetch</button>
  </div>
</template>

<script setup>
const transactions = ref([])
const errorMessage = ref('')
const loading = ref(true)

const props = defineProps({
  refreshTrigger: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['error'])

function formatDate(dateString) {
  return new Date(dateString).toLocaleString()
}

function isToday(dateString) {
  const today = new Date()
  const transactionDate = new Date(dateString)
  return (
    transactionDate.getDate() === today.getDate() &&
    transactionDate.getMonth() === today.getMonth() &&
    transactionDate.getFullYear() === today.getFullYear()
  )
}

function editTransaction(id) {
  console.log(`Edit transaction with ID: ${id}`)
  // Implement edit functionality here
}

async function fetchTransactions() {
  loading.value = true
  try {
    const response = await fetch('/api/getRecentTransactions')
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    console.log('Fetched transactions:', data)
    transactions.value = Array.isArray(data) ? data : []
    console.log('Transactions after assignment:', transactions.value)
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

function manualFetch() {
  console.log('Manual fetch triggered');
  fetchTransactions();
}

onMounted(() => {
  console.log('RecentTransactionList component mounted')
  fetchTransactions()
})

watch(() => props.refreshTrigger, () => {
  console.log('Refresh triggered')
  fetchTransactions()
})

watch(transactions, (newValue) => {
  console.log('Recent Transactions updated:', newValue)
}, { deep: true })
</script>

<style scoped>
.recent-transaction-list {
  margin-top: 30px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}

button {
  padding: 5px 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}
</style>