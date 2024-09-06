<!--components/Comment.vue-->
<template>
  <div class="comment">
    <UCard>
      <div class="flex items-start space-x-4">
        <UAvatar :src="comment.user.avatar" :alt="comment.user.name" />
        <div class="flex-grow">
          <div class="flex justify-between items-center">
            <h4 class="font-bold">{{ comment.user.name }}</h4>
            <span class="text-sm text-gray-500">{{ formatDate(comment.createdAt) }}</span>
          </div>
          <p class="mt-1">{{ comment.content }}</p>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

interface User {
  name: string
  avatar: string
}

interface CommentProp {
  id: string
  content: string
  user: User
  createdAt: Date
}

const props = defineProps<{
  comment: CommentProp
}>()

const formatDate = (date: Date) => {
  return new Date(date).toLocaleString()
}
</script>