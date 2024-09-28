<script setup lang="ts">

const activeComponent = ref<'cashIn' | 'cashOut'>('cashIn')
</script>

<template>
  <div>
    <h1>Financial Tracker</h1>
    <div>
      <button @click="activeComponent = 'cashIn'" :class="{ active: activeComponent === 'cashIn' }">Cash In</button>
      <button @click="activeComponent = 'cashOut'" :class="{ active: activeComponent === 'cashOut' }">Cash Out</button>
    </div>
    <CashIn v-if="activeComponent === 'cashIn'" />
    <CashOut v-if="activeComponent === 'cashOut'" />
    <br>
    <TransactionList />
  </div>
</template>

<style scoped>
.active {
  background-color: #4CAF50;
  color: white;
}
</style>