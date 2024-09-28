<script setup lang="ts">
import { ref } from 'vue'

const date = ref('')
const amount = ref('')
const notes = ref('')

function validateAmount(value: string): boolean {
  const regex = /^\d+(\.\d{1,2})?$/
  return regex.test(value)
}

function submit() {
  if (!validateAmount(amount.value)) {
    alert('Please enter a valid amount (max 2 decimal points)')
    return
  }

  $fetch('/api/addCashIn', {
    method: 'POST',
    body: {
      date: date.value,
      amount: parseFloat(amount.value),
      notes: notes.value || null
    }
  }).then(() => {
    alert('Cash In transaction added successfully')
    resetForm()
  }).catch((error) => {
    alert('Error adding Cash In transaction: ' + error.message)
  })
}

function resetForm() {
  date.value = ''
  amount.value = ''
  notes.value = ''
}
</script>

<template>
  <div>
    <h2>Cash In</h2>
    <div>
      <input v-model="date" type="date" required>
    </div>
    <div>
      <input v-model="amount" type="number" step="0.01" placeholder="Amount" required>
    </div>
    <div>
      <textarea v-model="notes" placeholder="Notes (optional)"></textarea>
    </div>
    <button @click="submit">Add Cash In</button>
  </div>
</template>