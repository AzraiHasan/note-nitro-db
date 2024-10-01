<!-- CashOut.vue -->
<script setup>
import { ref, computed, watch } from 'vue'
import { useTransactionStore } from '~/stores/transaction'

const transactionStore = useTransactionStore()

const amount = ref(0)
const category = ref('Ingredients')
const notes = ref('')
const transactionDate = ref(new Date().toISOString().split('T')[0]) // Set default to today's date

const categories = ['Ingredients', 'Supplies', 'Salary', 'Utilities', 'Rent', 'Others']

const submitCashOut = () => {
  if (!notes.value.trim()) {
    alert('Notes are required for Cash Out transactions.')
    return
  }

  const selectedDate = new Date(transactionDate.value)
  selectedDate.setHours(new Date().getHours(), new Date().getMinutes(), new Date().getSeconds())

  const transaction = {
    timestamp: selectedDate.getTime(),
    amount: parseFloat(amount.value.toFixed(2)),
    category: category.value,
    notes: notes.value,
    type: 'cash-out'
  }
  transactionStore.addTransaction(transaction)
  // Reset form
  amount.value = 0
  category.value = 'Ingredients'
  notes.value = ''
  transactionDate.value = new Date().toISOString().split('T')[0]
  updateTodaysCashOuts()
}

const today = computed(() => {
  const date = new Date(transactionDate.value)
  date.setHours(0, 0, 0, 0)
  return date
})

// Change todaysCashOuts to a ref
const todaysCashOuts = ref([])

// Function to update todaysCashOuts
const updateTodaysCashOuts = () => {
  todaysCashOuts.value = transactionStore.transactions
    .filter(t => t.type === 'cash-out' && new Date(t.timestamp).setHours(0, 0, 0, 0) === today.value.getTime())
    .sort((a, b) => b.timestamp - a.timestamp)
}

// Call updateTodaysCashOuts initially and whenever transactions or selected date change
watch([() => transactionStore.transactions, transactionDate], updateTodaysCashOuts, { deep: true })

const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

const formatAmount = (amount) => {
  return amount.toFixed(2)
}

// Edit functionality
const isModalOpen = ref(false)
const editingTransaction = ref(null)

const openEditModal = (transaction) => {
  editingTransaction.value = { ...transaction }
  isModalOpen.value = true
}

const closeEditModal = () => {
  isModalOpen.value = false
  editingTransaction.value = null
}

const saveEdit = () => {
  if (editingTransaction.value) {
    if (!editingTransaction.value.notes.trim()) {
      alert('Notes are required for Cash Out transactions.')
      return
    }

    const updatedTransaction = {
      ...editingTransaction.value,
      amount: parseFloat(editingTransaction.value.amount.toFixed(2)),
      oldTimestamp: editingTransaction.value.timestamp,
      // Keep the original timestamp as the primary key
      newTimestamp: editingTransaction.value.timestamp
    }
    transactionStore.updateTransaction(updatedTransaction)
    closeEditModal()

    // Force re-computation of todaysCashOuts
    updateTodaysCashOuts()
  }
}
</script>

<template>
  <div>
    <h2>Cash Out</h2>
    <form @submit.prevent="submitCashOut">
      <div>
        <label for="date">Date:</label>
        <input id="date" v-model="transactionDate" type="date" required>
      </div>
      <div>
        <label for="amount">Amount (MYR):</label>
        <input id="amount" v-model="amount" type="number" step="0.05" min="0" required>
      </div>
      <div>
        <label for="category">Category:</label>
        <select id="category" v-model="category">
          <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
        </select>
      </div>
      <div>
        <label for="notes">Notes:</label>
        <textarea id="notes" v-model="notes" required></textarea>
      </div>
      <button type="submit">Submit</button>
    </form>

    <h3>Selected Date's Cash Out Transactions</h3>
    <table>
      <thead>
        <tr>
          <th>Time</th>
          <th>Amount (MYR)</th>
          <th>Category</th>
          <th>Notes</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="transaction in todaysCashOuts" :key="transaction.timestamp">
          <td>{{ formatTime(transaction.timestamp) }}</td>
          <td class="cash-out">-{{ formatAmount(transaction.amount) }}</td>
          <td>{{ transaction.category }}</td>
          <td>{{ transaction.notes }}</td>
          <td>
            <button @click="openEditModal(transaction)">Edit</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Edit Modal -->
    <div v-if="isModalOpen" class="modal">
      <div class="modal-content">
        <h3>Edit Transaction</h3>
        <p>Time: {{ formatTime(editingTransaction.timestamp) }}</p>
        <div>
          <label for="edit-amount">Amount (MYR):</label>
          <input id="edit-amount" v-model="editingTransaction.amount" type="number" step="0.05" min="0" required>
        </div>
        <div>
          <label for="edit-category">Category:</label>
          <select id="edit-category" v-model="editingTransaction.category">
            <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
          </select>
        </div>
        <div>
          <label for="edit-notes">Notes:</label>
          <textarea id="edit-notes" v-model="editingTransaction.notes" required></textarea>
        </div>
        <div class="modal-actions">
          <button @click="saveEdit">Save</button>
          <button @click="closeEditModal">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
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

.cash-out {
  color: red;
}

.modal {
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

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  width: 300px;
}

.modal-actions {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}
</style>