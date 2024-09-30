<!-- components/TransactionList.vue -->
<script setup>
import { computed } from 'vue'
import { useTransactionStore } from '~/stores/transaction'

const transactionStore = useTransactionStore()

const today = new Date()
today.setHours(0, 0, 0, 0)

const sortedTransactions = computed(() => {
  return transactionStore.transactions
    .slice()
    .sort((a, b) => b.timestamp - a.timestamp)
    .filter(transaction => {
      const transactionDate = new Date(transaction.timestamp)
      const daysDiff = (today.getTime() - transactionDate.getTime()) / (1000 * 3600 * 24)
      return daysDiff < 8
    })
})

const formatDate = (timestamp) => {
  const date = new Date(timestamp)
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const month = monthNames[date.getMonth()]
  const day = date.getDate().toString().padStart(2, '0')
  const year = date.getFullYear()
  return `${month} ${day}, ${year}`
}

const formatAmount = (amount, type) => {
  const formattedAmount = amount.toFixed(2)
  return type === 'cash-in' ? `+${formattedAmount}` : `-${formattedAmount}`
}

</script>

<template>
  <div>
    <h2>Transaction List</h2>
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Amount (MYR)</th>
          <th>Category</th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="transaction in sortedTransactions" :key="transaction.timestamp">
          <td>{{ formatDate(transaction.timestamp) }}</td>
          <td :class="transaction.type === 'cash-in' ? 'cash-in' : 'cash-out'">
            {{ formatAmount(transaction.amount, transaction.type) }}
          </td>
          <td>{{ transaction.category }}</td>
          <td>{{ transaction.notes }}</td>
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

.cash-in {
  color: green;
}

.cash-out {
  color: red;
}
</style>