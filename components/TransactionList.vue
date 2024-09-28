<script setup lang="ts">
import { ref, onMounted } from 'vue'

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
        </tr>
      </tbody>
    </table>
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
</style>