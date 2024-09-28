<script setup lang="ts">
import { ref } from 'vue'

const date = ref('')
const amount = ref('')
const category = ref('')
const notes = ref('')

const categories = [
  'Ingredient',
  'Supply',
  'Salary',
  'Utilities',
  'Rent',
  'Other'
]

function validateAmount(value: string): boolean {
  const regex = /^\d+(\.\d{1,2})?$/
  return regex.test(value)
}

function submit() {
  if (!validateAmount(amount.value)) {
    alert('Please enter a valid amount (max 2 decimal points)')
    return
  }

  if (!notes.value) {
    alert('Notes are required for Cash Out transactions')
    return
  }

  $fetch('/api/addCashOut', {
    method: 'POST',
    body: {
      date: date.value,
      amount: parseFloat(amount.value),
      category: category.value,
      notes: notes.value
    }
  }).then(() => {
    alert('Cash Out transaction added successfully')
    resetForm()
  }).catch((error) => {
    alert('Error adding Cash Out transaction: ' + error.message)
  })
}

function resetForm() {
  date.value = ''
  amount.value = ''
  category.value = ''
  notes.value = ''
}
</script>

<template>
  <div>
    <h2>Cash Out</h2>
    <div>
      <input v-model="date" type="date" required>
    </div>
    <div>
      <input v-model="amount" type="number" step="0.01" placeholder="Amount" required>
    </div>
    <div>
      <select v-model="category" required>
        <option value="" disabled>Select a category</option>
        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
      </select>
    </div>
    <div>
      <textarea v-model="notes" placeholder="Notes (required)" required></textarea>
    </div>
    <button @click="submit">Add Cash Out</button>
  </div>
</template>