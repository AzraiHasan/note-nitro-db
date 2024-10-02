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
            <button v-if="isToday(transaction.created_at)" @click="openEditModal(transaction)">
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

  <!-- Edit Modal -->
  <Teleport to="body">
    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <h3>Edit Transaction</h3>
        <input v-model="editingText" type="text" />
        <div class="modal-buttons">
          <button @click="saveEdit">Save</button>
          <button @click="closeModal">Cancel</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const transactions = ref([])
const errorMessage = ref('')
const loading = ref(true)
const showModal = ref(false)
const editingTransaction = ref(null)
const editingText = ref('')

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

function openEditModal(transaction) {
  editingTransaction.value = transaction
  editingText.value = transaction.text
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editingTransaction.value = null
  editingText.value = ''
}

async function saveEdit() {
  console.log(`Saving edit for transaction ${editingTransaction.value.id}`)

  try {
    const response = await fetch(`/api/updateTransaction/${editingTransaction.value.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: editingText.value }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.statusMessage || `HTTP error! status: ${response.status}`);
    }

    // Update the transaction locally
    const index = transactions.value.findIndex(t => t.id === editingTransaction.value.id);
    if (index !== -1) {
      transactions.value[index] = {
        ...transactions.value[index],
        text: editingText.value
      };
    }

    console.log(`Successfully updated transaction ${editingTransaction.value.id}`);
    closeModal();
  } catch (error) {
    console.error('Error updating transaction:', error);
    errorMessage.value = error.message || 'Failed to update transaction. Please try again.';
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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  width: 300px;
}

.modal h3 {
  margin-top: 0;
}

.modal input {
  width: 100%;
  padding: 5px;
  margin-bottom: 10px;
}

.modal-buttons {
  display: flex;
  justify-content: space-between;
}

.modal-buttons button {
  width: 45%;
}
</style>