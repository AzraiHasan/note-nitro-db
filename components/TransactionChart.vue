<template>
  <div class="container">
    <Bar v-if="loaded" :data="chartData" :options="chartOptions" />
    <p v-else>Loading chart data...</p>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const props = defineProps({
  refreshTrigger: {
    type: Number,
    default: 0
  }
})

const loaded = ref(false)
const chartData = ref(null)

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top'
    },
    title: {
      display: true,
      text: 'Transaction Summary (Rolling 7 Days)'
    }
  },
  scales: {
    /* x: {
      reverse: true
    }, */
    y: {
      beginAtZero: true
    }
  }
}

function getLastSevenDays() {
  const dates = [];
  for (let i = 6;i >= 0;i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
}

async function fetchChartData() {
  loaded.value = false
  try {
    const response = await fetch('/api/getRecentTransactions')
    const transactions = await response.json()

    const lastSevenDays = getLastSevenDays();
    const consolidatedData = lastSevenDays.reduce((acc, date) => {
      acc[date] = { cashIn: 0, cashOut: 0 };
      return acc;
    }, {});

    transactions.forEach(t => {
      const transactionDate = t.date.split('T')[0];
      if (lastSevenDays.includes(transactionDate)) {
        if (t.type === 'Cash In') {
          consolidatedData[transactionDate].cashIn += parseFloat(t.amount);
        } else if (t.type === 'Cash Out') {
          consolidatedData[transactionDate].cashOut += parseFloat(t.amount);
        }
      }
    });

    const cashInData = lastSevenDays.map(date => consolidatedData[date].cashIn);
    const cashOutData = lastSevenDays.map(date => consolidatedData[date].cashOut);

    chartData.value = {
      labels: lastSevenDays,
      datasets: [
        {
          label: 'Cash In',
          backgroundColor: '#4CAF50',
          data: cashInData
        },
        {
          label: 'Cash Out',
          backgroundColor: '#F44336',
          data: cashOutData
        }
      ]
    }

    loaded.value = true
  } catch (error) {
    console.error('Error fetching transaction data for chart:', error)
  }
}

onMounted(() => {
  fetchChartData()
})

watch(() => props.refreshTrigger, () => {
  fetchChartData()
})
</script>

<style scoped>
.container {
  height: 400px;
}
</style>