<template>
  <div>
    <UCard>
      <TransactionChart :refreshTrigger="refreshTrigger" @error="handleListError" />
    </UCard>

    <TransactionForm :initialFormState="formState" :message="message" :isError="isError" @submit="submitTransaction"
      @updateCategoryOptions="updateCategoryOptions" />

    <UDivider class="my-8" />

    <MobileRecentTransactionList :refreshTrigger="refreshTrigger" @error="handleListError"
      @refresh="incrementRefreshTrigger" />

    <!-- <RecentTransactionList :refreshTrigger="refreshTrigger" @error="handleListError"
      @refresh="incrementRefreshTrigger" /> -->
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const formState = reactive({
  date: new Date().toISOString().split('T')[0],
  amount: '',
  type: '',
  category: '',
  text: ''
})

const message = ref('')
const isError = ref(false)
const refreshTrigger = ref(0)

const categoryOptions = ref([])

function updateCategoryOptions(type) {
  categoryOptions.value = type === 'Cash In'
    ? [{ label: 'Sales', value: 'Sales' }, { label: 'Balance', value: 'Balance' }, { label: 'Other', value: 'Other' }]
    : [{ label: 'Ingredients', value: 'Ingredients' }, { label: 'Supplies', value: 'Supplies' }, { label: 'Salary', value: 'Salary' }, { label: 'Utilities', value: 'Utilities' }, { label: 'Rent', value: 'Rent' }, { label: 'Other', value: 'Other' }]
  formState.category = ''
}

function handleListError(errorMessage) {
  message.value = errorMessage
  isError.value = true
}

function incrementRefreshTrigger() {
  refreshTrigger.value++
}

async function submitTransaction(newTransaction) {
  try {
    const response = await fetch('/api/addTransaction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTransaction),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    message.value = `${result.message} (ID: ${result.id})`
    isError.value = false

    // Reset form state
    Object.assign(formState, {
      date: new Date().toISOString().split('T')[0],
      amount: '',
      type: '',
      category: '',
      text: ''
    })

    // Trigger a refresh of the transaction list
    incrementRefreshTrigger()
  } catch (error) {
    console.error('Error submitting transaction:', error)
    message.value = 'An error occurred while submitting the transaction. Please try again.'
    isError.value = true
  }
}
</script>