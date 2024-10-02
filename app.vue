<template>
  <div>
    <TransactionChart :refreshTrigger="refreshTrigger" @error="handleListError" />
    <h1>Transaction Manager</h1>

    <!-- Add Transaction Form -->
    <form @submit.prevent="validateAndSubmit">
      <h2>Add New Transaction</h2>

      <label for="transactionDate">Date:</label>
      <input id="transactionDate" v-model="transactionDate" type="date" required />
      <span class="error" v-if="errors.date">{{ errors.date }}</span>

      <label for="transactionAmount">Amount (MYR):</label>
      <input id="transactionAmount" v-model="transactionAmount" type="number" step="0.01" required />
      <span class="error" v-if="errors.amount">{{ errors.amount }}</span>

      <label for="transactionType">Type:</label>
      <select id="transactionType" v-model="transactionType" required @change="updateCategoryOptions">
        <option value="Cash In">Cash In</option>
        <option value="Cash Out">Cash Out</option>
      </select>
      <span class="error" v-if="errors.type">{{ errors.type }}</span>

      <label for="transactionCategory">Category:</label>
      <select id="transactionCategory" v-model="transactionCategory" required>
        <option v-for="category in categoryOptions" :key="category" :value="category">
          {{ category }}
        </option>
      </select>
      <span class="error" v-if="errors.category">{{ errors.category }}</span>

      <label for="transactionText">Transaction Note:</label>
      <textarea id="transactionText" v-model="transactionText" type="text" required />
      <span class="error" v-if="errors.text">{{ errors.text }}</span>

      <button type="submit">Submit</button>
    </form>
    <p v-if="message" :class="{ 'success-message': !isError, 'error-message': isError }">{{ message }}</p>

    <!-- Transaction List Component -->
    <RecentTransactionList :refreshTrigger="refreshTrigger" @error="handleListError" />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const transactionText = ref('')
const transactionAmount = ref('')
const transactionType = ref('Cash In')
const transactionCategory = ref('')
const transactionDate = ref(new Date().toISOString().split('T')[0])
const message = ref('')
const isError = ref(false)
const refreshTrigger = ref(0)

const categoryOptions = ref(['Sales', 'Balance', 'Other'])

const errors = reactive({
  text: '',
  amount: '',
  type: '',
  category: '',
  date: ''
})

function updateCategoryOptions() {
  if (transactionType.value === 'Cash In') {
    categoryOptions.value = ['Sales', 'Balance', 'Other']
  } else {
    categoryOptions.value = ['Ingredients', 'Supplies', 'Salary', 'Utilities', 'Rent', 'Other']
  }
  transactionCategory.value = ''
}

function handleListError(errorMessage) {
  message.value = errorMessage
  isError.value = true
}

function validateForm() {
  let isValid = true

  // Reset errors
  Object.keys(errors).forEach(key => errors[key] = '')

  if (!transactionText.value.trim()) {
    errors.text = 'Transaction text is required'
    isValid = false
  }

  if (!transactionAmount.value || parseFloat(transactionAmount.value) <= 0) {
    errors.amount = 'Amount must be a positive number'
    isValid = false
  }

  if (!transactionType.value) {
    errors.type = 'Transaction type is required'
    isValid = false
  }

  if (!transactionCategory.value) {
    errors.category = 'Category is required'
    isValid = false
  }

  if (!transactionDate.value) {
    errors.date = 'Date is required'
    isValid = false
  } else {
    const selectedDate = new Date(transactionDate.value)
    const currentDate = new Date()
    if (selectedDate > currentDate) {
      errors.date = 'Date cannot be in the future'
      isValid = false
    }
  }

  return isValid
}

async function validateAndSubmit() {
  if (validateForm()) {
    await submitTransaction()
  }
}

async function submitTransaction() {
  try {
    const response = await fetch('/api/addTransaction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: transactionText.value,
        amount: parseFloat(transactionAmount.value),
        type: transactionType.value,
        category: transactionCategory.value,
        date: transactionDate.value
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    message.value = `${result.message} (ID: ${result.id})`
    isError.value = false

    // Clear the form
    transactionText.value = ''
    transactionAmount.value = ''
    transactionType.value = 'Cash In'
    updateCategoryOptions()
    transactionDate.value = new Date().toISOString().split('T')[0]

    // Trigger a refresh of the transaction list
    refreshTrigger.value++
  } catch (error) {
    console.error('Error submitting transaction:', error)
    message.value = 'An error occurred while submitting the transaction. Please try again.'
    isError.value = true
  }
}

// Initialize category options
updateCategoryOptions()
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  max-width: 300px;
  margin: 0 auto 20px;
}

input,
select,
button {
  margin-top: 5px;
  margin-bottom: 10px;
}

.error {
  color: red;
  font-size: 0.8em;
  margin-bottom: 5px;
}

.success-message {
  color: green;
}

.error-message {
  color: red;
}
</style>