<!--components/StatusHandler.vue-->
<template>
  <div>
    <UCard v-if="isLoading">
      <template #header>
        <h2 class="text-xl font-semibold">Loading</h2>
      </template>
      <div class="flex justify-center items-center h-24">
        <UIcon name="i-heroicons-arrow-path" class="animate-spin h-8 w-8" />
      </div>
    </UCard>

    <UCard v-else-if="error" class="bg-red-50">
      <template #header>
        <h2 class="text-xl font-semibold text-red-600">Error</h2>
      </template>
      <p class="text-red-600">{{ error }}</p>
      <template #footer>
        <UButton color="red" @click="$emit('retry')">Retry</UButton>
      </template>
    </UCard>

    <slot v-else></slot>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isLoading: boolean;
  error: string | null;
}>();

defineEmits<{
  (e: 'retry'): void;
}>();
</script>