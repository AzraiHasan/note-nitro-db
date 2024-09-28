<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'

interface Transaction {
  id: number
  type: 'Cash In' | 'Cash Out'
  date: string
  amount: number
  category: string | null
  notes: string | null
}

const transactions = ref<Transaction[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const showEditModal = ref(false)
const editingTransaction = reactive<Transaction>({
  id: 0,
  type: 'Cash In',
  date: '',
  amount: 0,
  category: null,
  notes: null
})

const categories = [
  'Ingredient',
  'Supply',
  'Salary',
  'Utilities',
  'Rent',
  'Other'
]

async function fetchTransactions() {
  try {
    loading.value = true
    error.value = null
    const response = await $fetch<{ success: boolean, transactions?: Transaction[], error?: string }>('/api/getTransactions')
    if (response.success && response.transactions) {
      transactions.value = response.transactions
    } else {
      throw new Error(response.error || 'Failed to fetch transactions')
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'An unknown error occurred'
    console.error('Error fetching transactions:', err)
  } finally {
    loading.value = false
  }
}

function openEditModal(transaction: Transaction) {
  Object.assign(editingTransaction, transaction)
  showEditModal.value = true
}

async function saveEdit() {
  try {
    const response = await $fetch<{ success: boolean, error?: string }>('/api/updateTransaction', {
      method: 'POST',
      body: editingTransaction
    })
    if (response.success) {
      await fetchTransactions()
      showEditModal.value = false
    } else {
      throw new Error(response.error || 'Failed to update transaction')
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'An unknown error occurred'
    console.error('Error updating transaction:', err)
  }
}

onMounted(() => {
  fetchTransactions()
})

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString()
}

function formatAmount(amount: number): string {
  return amount.toFixed(2)
}
</script>

<template>
  <div>
    <h2>Transaction List</h2>
    <div v-if="loading">Loading transactions...</div>
    <div v-else-if="error">{{ error }}</div>
    <table v-else>
      <thead>
        <tr>
          <th>Date</th>
          <th>Type</th>
          <th>Amount</th>
          <th>Category</th>
          <th>Notes</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="transaction in transactions" :key="transaction.id">
          <td>{{ formatDate(transaction.date) }}</td>
          <td>{{ transaction.type }}</td>
          <td :class="{'text-green': transaction.type === 'Cash In', 'text-red': transaction.type === 'Cash Out'}">
            {{ transaction.type === 'Cash In' ? '+' : '-' }}${{ formatAmount(transaction.amount) }}
          </td>
          <td>{{ transaction.category || 'N/A' }}</td>
          <td>{{ transaction.notes || 'N/A' }}</td>
          <td>
            <button @click="openEditModal(transaction)">Edit</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Edit Modal -->
    <div v-if="showEditModal" class="modal">
      <div class="modal-content">
        <h3>Edit Transaction</h3>
        <form @submit.prevent="saveEdit">
          <div>
            <label>Date:</label>
            <input v-model="editingTransaction.date" type="date" disabled>
          </div>
          <div>
            <label>Type:</label>
            <select v-model="editingTransaction.type" disabled>
              <option value="Cash In">Cash In</option>
              <option value="Cash Out">Cash Out</option>
            </select>
          </div>
          <div>
            <label>Amount:</label>
            <input v-model.number="editingTransaction.amount" type="number" step="0.01" required>
          </div>
          <div v-if="editingTransaction.type === 'Cash Out'">
            <label>Category:</label>
            <select v-model="editingTransaction.category" required>
              <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
            </select>
          </div>
          <div>
            <label>Notes:</label>
            <textarea v-model="editingTransaction.notes" :required="editingTransaction.type === 'Cash Out'"></textarea>
          </div>
          <div>
            <button type="submit">Save</button>
            <button type="button" @click="showEditModal = false">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
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

.text-green {
  color: green;
}

.text-red {
  color: red;
}

.modal {
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
}
</style>