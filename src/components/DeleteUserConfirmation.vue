<script setup lang="ts">
import type { User } from '@/types';
import TheButton from './TheButton.vue';

type Props = {
  user: User;
  isLoading?: boolean;
  error?: unknown;
};

defineProps<Props>();

defineEmits<{
  cancel: [];
  confirm: [];
}>();
</script>

<template>
  <h3 class="mb-2 text-xl">Are you sure?</h3>
  <p class="mb-8">You are about to delete {{ user.username }} user.</p>

  <div class="flex justify-between">
    <TheButton type="button" @click="$emit('cancel')">Cancel</TheButton>
    <TheButton
      class="!border-red-200"
      type="button"
      :is-loading="isLoading"
      data-testid="delete-confirmation-submit"
      @click="$emit('confirm')"
    >
      Delete
    </TheButton>
  </div>

  <div class="text-red-500" v-if="error">{{ error }}</div>
</template>
