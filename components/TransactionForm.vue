<template>
  <UCard class="mt-8">
    <UForm :state="formState" @submit="onSubmit">
      <h2 class="mb-4 text-xl font-bold">Add New Transaction</h2>

      <UFormGroup label="Date" name="date">
        <UInput v-model="formState.date" type="date" />
      </UFormGroup>

      <UFormGroup label="Amount (MYR)" name="amount">
        <UInput v-model="formState.amount" type="number" step="0.01" />
      </UFormGroup>

      <UFormGroup label="Type" name="type">
        <USelect v-model="formState.type" :options="typeOptions" option-attribute="label" value-attribute="value"
          placeholder="Select Type ..." @change="updateCategoryOptions" />
      </UFormGroup>

      <UFormGroup label="Category" name="category">
        <USelect v-model="formState.category" :options="categoryOptions" option-attribute="label"
          value-attribute="value" placeholder="Select Category ..." :disabled="!formState.type" />
      </UFormGroup>

      <UFormGroup label="Transaction Note" name="text">
        <UTextarea v-model="formState.text" />
      </UFormGroup>

      <UButton type="submit" color="primary" class="mt-4">Submit</UButton>
    </UForm>

    <UAlert v-if="localMessage" :type="localIsError ? 'danger' : 'success'" :title="localIsError ? 'Error' : 'Success'"
      :description="localMessage" class="mt-4" />
  </UCard>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'

const props = defineProps({
  initialFormState: {
    type: Object,
    default: () => ({
      date: new Date().toISOString().split('T')[0],
      amount: '',
      type: null,
      category: '',
      text: ''
    })
  },
  message: {
    type: String,
    default: ''
  },
  isError: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit', 'updateCategoryOptions'])

const formState = reactive({ ...props.initialFormState })
const localMessage = ref('')
const localIsError = ref(false)

const typeOptions = ref([
  { label: 'Cash In', value: 'Cash In' },
  { label: 'Cash Out', value: 'Cash Out' }
])

const categoryOptions = ref([])

function updateCategoryOptions() {
  if (formState.type === 'Cash In') {
    categoryOptions.value = [
      { label: 'Sales', value: 'Sales' },
      { label: 'Balance', value: 'Balance' },
      { label: 'Other', value: 'Other' }
    ]
  } else if (formState.type === 'Cash Out') {
    categoryOptions.value = [
      { label: 'Ingredients', value: 'Ingredients' },
      { label: 'Supplies', value: 'Supplies' },
      { label: 'Salary', value: 'Salary' },
      { label: 'Utilities', value: 'Utilities' },
      { label: 'Rent', value: 'Rent' },
      { label: 'Other', value: 'Other' }
    ]
  } else {
    categoryOptions.value = []
  }
  formState.category = '' // Reset category when type changes
}

async function onSubmit() {
  try {
    const response = await fetch('/api/addTransaction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formState),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    if (result.id) {
      localMessage.value = `Transaction added successfully (ID: ${result.id})`
    } else {
      localMessage.value = `Transaction added successfully, but no ID was returned`
    }
    localIsError.value = false

    // Reset form state
    Object.assign(formState, props.initialFormState)
    updateCategoryOptions()

    // Emit submit event for parent component
    emit('submit', result)
  } catch (error) {
    console.error('Error submitting transaction:', error)
    localMessage.value = 'An error occurred while submitting the transaction. Please try again.'
    localIsError.value = true
  }
}

watch(() => props.initialFormState, (newValue) => {
  Object.assign(formState, newValue)
}, { deep: true })

watch(() => props.message, (newValue) => {
  localMessage.value = newValue
})

watch(() => props.isError, (newValue) => {
  localIsError.value = newValue
})

// Initialize category options
updateCategoryOptions()

// Watch for changes in the transaction type
watch(() => formState.type, () => {
  updateCategoryOptions()
})
</script>