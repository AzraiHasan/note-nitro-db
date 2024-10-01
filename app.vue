<template>
  <div>
    <h1>Transaction Manager</h1>

    <!-- Add Transaction Form -->
    <form @submit.prevent="submitTransaction">
      <h2>Add New Transaction</h2>
      <label for="transactionText">Transaction Text:</label>
      <input id="transactionText" v-model="transactionText" type="text" required />
      <button type="submit">Submit</button>
    </form>
    <p v-if="message">{{ message }}</p>

    <!-- Transaction List Component -->
    <TransactionList :refreshTrigger="refreshTrigger" @error="handleListError" />
  </div>
</template>

<script setup>

const transactionText = ref('')
const message = ref('')
const refreshTrigger = ref(0)

function handleListError(errorMessage) {
  message.value = errorMessage
}

async function submitTransaction() {
  try {
    const response = await fetch('/api/addTransaction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: transactionText.value }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    message.value = `${result.message} (ID: ${result.id})`
    transactionText.value = '' // Clear the input after successful submission

    // Trigger a refresh of the transaction list
    refreshTrigger.value++
  } catch (error) {
    console.error('Error submitting transaction:', error)
    message.value = 'An error occurred while submitting the transaction. Please check the console for details.'
  }
}
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  max-width: 300px;
  margin: 0 auto 20px;
}

input,
button {
  margin-top: 10px;
}
</style>