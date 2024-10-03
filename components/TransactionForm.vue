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

    <!-- Alert for debugging purpose -->
    <UAlert v-if="message" :type="isError ? 'danger' : 'success'" :title="isError ? 'Error' : 'Success'"
      :description="message" class="mt-4" />
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
      type: null,  // Changed to null
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

function onSubmit() {
  emit('submit', { ...formState })
}

watch(() => props.initialFormState, (newValue) => {
  Object.assign(formState, newValue)
}, { deep: true })

watch(() => props.message, (newValue) => {
  if (newValue && !props.isError) {
    // Reset form after successful submission
    Object.assign(formState, props.initialFormState)
    updateCategoryOptions() // Update category options after reset
  }
})

// Initialize category options
updateCategoryOptions()

// Watch for changes in the transaction type
watch(() => formState.type, () => {
  updateCategoryOptions()
})
</script>