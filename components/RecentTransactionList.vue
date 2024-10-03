<template>
  <div class="recent-transaction-list">
    <h2>Recent Transaction List</h2>
    <div v-if="loading">Loading transactions...</div>
    <table v-else-if="transactions.length">
      <thead>
        <tr>
          <th>Date</th>
          <th>Amount (MYR)</th>
          <th>Type</th>
          <th>Category</th>
          <th>Note</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="transaction in transactions" :key="transaction.id">
          <td>{{ formatDate(transaction.date) }}</td>
          <td>{{ formatCurrency(transaction.amount) }}</td>
          <td>{{ transaction.type }}</td>
          <td>{{ transaction.category }}</td>
          <td>{{ transaction.text }}</td>
          <td>
            <button v-if="isToday(transaction.date)" @click="openEditModal(transaction)">
              Edit
            </button>
            <span v-else>Synced</span>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else>No transactions found. {{ errorMessage }}</p>
  </div>

  <!-- Edit Modal -->
  <Teleport to="body">
    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <h3>Edit Transaction</h3>
        <form @submit.prevent="validateAndSave">
          <label>Date:
            <input v-model="editingTransaction.date" type="date" required />
          </label>
          <span class="error" v-if="errors.date">{{ errors.date }}</span>

          <label>Amount (MYR):
            <input v-model="editingTransaction.amount" type="number" step="0.01" required />
          </label>
          <span class="error" v-if="errors.amount">{{ errors.amount }}</span>

          <label>Type:
            <select v-model="editingTransaction.type" required @change="updateCategoryOptions">
              <option value="Cash In">Cash In</option>
              <option value="Cash Out">Cash Out</option>
            </select>
          </label>
          <span class="error" v-if="errors.type">{{ errors.type }}</span>

          <label>Category:
            <select v-model="editingTransaction.category" required>
              <option v-for="category in categoryOptions" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </label>
          <span class="error" v-if="errors.category">{{ errors.category }}</span>
          <label>Note:
            <input v-model="editingTransaction.text" type="text" required />
          </label>
          <span class="error" v-if="errors.text">{{ errors.text }}</span>


          <div class="modal-buttons">
            <button type="submit">Save</button>
            <button type="button" @click="closeModal">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue'

const transactions = ref([])
const errorMessage = ref('')
const loading = ref(true)
const showModal = ref(false)
const editingTransaction = ref({
  id: null,
  text: '',
  amount: 0,
  type: '',
  category: '',
  date: ''
})
const categoryOptions = ref([])

const errors = reactive({
  text: '',
  amount: '',
  type: '',
  category: '',
  date: ''
})

const props = defineProps({
  refreshTrigger: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['error'])

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString()
}

function isToday(dateString) {
  const today = new Date()
  const transactionDate = new Date(dateString)
  return today.toDateString() === transactionDate.toDateString()
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR' }).format(amount)
}

function updateCategoryOptions() {
  if (editingTransaction.value.type === 'Cash In') {
    categoryOptions.value = ['Sales', 'Balance', 'Other']
  } else {
    categoryOptions.value = ['Ingredients', 'Supplies', 'Salary', 'Utilities', 'Rent', 'Other']
  }
  editingTransaction.value.category = ''
}

function openEditModal(transaction) {
  editingTransaction.value = { ...transaction };
  updateCategoryOptions();
  showModal.value = true;
}

function closeModal() {
  showModal.value = false
  editingTransaction.value = {}
  clearErrors()
}

function clearErrors() {
  Object.keys(errors).forEach(key => errors[key] = '')
}

function validateForm() {
  let isValid = true
  clearErrors()

  if (!editingTransaction.value.text?.trim()) {
    errors.text = 'Transaction text is required'
    isValid = false
  }

  if (!editingTransaction.value.amount || parseFloat(editingTransaction.value.amount) <= 0) {
    errors.amount = 'Amount must be a positive number'
    isValid = false
  }

  if (!editingTransaction.value.type) {
    errors.type = 'Transaction type is required'
    isValid = false
  }

  if (!editingTransaction.value.category) {
    errors.category = 'Category is required'
    isValid = false
  }

  if (!editingTransaction.value.date) {
    errors.date = 'Date is required'
    isValid = false
  } else {
    const selectedDate = new Date(editingTransaction.value.date)
    const currentDate = new Date()
    if (selectedDate > currentDate) {
      errors.date = 'Date cannot be in the future'
      isValid = false
    }
  }

  return isValid
}

async function validateAndSave() {
  if (validateForm()) {
    await saveEdit()
  }
}

async function saveEdit() {
  try {
    console.log('Editing transaction (raw):', editingTransaction.value);

    const transactionToSend = {
      id: editingTransaction.value.id,
      text: editingTransaction.value.text,
      amount: parseFloat(editingTransaction.value.amount),
      type: editingTransaction.value.type,
      category: editingTransaction.value.category,
      date: editingTransaction.value.date
    };

    console.log('Transaction to send (before stringify):', transactionToSend);
    const jsonBody = JSON.stringify(transactionToSend);
    console.log('JSON body to send:', jsonBody);

    const response = await fetch(`/api/updateTransaction/${editingTransaction.value.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: jsonBody,
    });

    console.log('Response status:', response.status);

    const responseText = await response.text();
    console.log('Raw response text:', responseText);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}, message: ${responseText}`);
    }

    let updatedTransaction;
    try {
      updatedTransaction = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Error parsing response:', parseError);
      throw new Error(`Failed to parse server response: ${responseText}`);
    }

    console.log('Parsed updated transaction:', updatedTransaction);

    // Instead of updating the local state, let's fetch the transactions again
    await fetchTransactions();

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

watch(transactions, (newTransactions) => {
  console.log('Transactions updated:', newTransactions);
}, { deep: true })

onMounted(() => {
  console.log('Component mounted, fetching transactions')
  fetchTransactions()
})

watch(() => props.refreshTrigger, () => {
  fetchTransactions()
})
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

td span {
  color: #888;
  font-style: italic;
}

th {
  background-color: #f2f2f2;
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

.modal form {
  display: flex;
  flex-direction: column;
}

.modal label {
  display: block;
  margin-top: 10px;
}

.modal input,
.modal select {
  width: 100%;
  padding: 5px;
  margin-top: 5px;
}

.modal-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.error {
  color: red;
  font-size: 0.8em;
  margin-top: 2px;
}
</style>