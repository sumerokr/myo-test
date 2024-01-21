<script setup lang="ts">
import { ref, toRaw } from 'vue';
import type { User } from '@/types';
import TheButton from './TheButton.vue';

type Props = {
  user: User;
  isLoading?: boolean;
  error?: unknown;
};

const props = defineProps<Props>();

defineEmits<{
  cancel: [];
  submit: [user: User];
}>();

const localUser = ref(structuredClone(toRaw(props.user)));

// formats the date into human-readable format based on the user's locale
const formatDate = (date: string) =>
  new Intl.DateTimeFormat(navigator.language, {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(date));
</script>

<template>
  <form class="space-y-4" @submit.prevent="$emit('submit', localUser)" data-testid="edit-form">
    <div>
      <label for="id">Id</label>
      <input
        class="block w-full border-2 rounded-xl p-2 disabled:bg-neutral-100"
        :value="localUser.id"
        type="text"
        id="id"
        disabled
      />
    </div>

    <div>
      <label for="username">Username</label>
      <input
        class="block w-full border-2 rounded-xl p-2"
        v-model="localUser.username"
        type="text"
        id="username"
        required
      />
    </div>

    <div>
      <label for="firstName">First name</label>
      <input
        class="block w-full border-2 rounded-xl p-2"
        v-model="localUser.profile.firstName"
        type="text"
        id="firstName"
        required
      />
    </div>

    <div>
      <label for="lastName">Last name</label>
      <input
        class="block w-full border-2 rounded-xl p-2"
        v-model="localUser.profile.lastName"
        type="text"
        id="lastName"
        required
      />
    </div>

    <div>
      <label for="avatar">Avatar</label>
      <input
        class="block w-full border-2 rounded-xl p-2"
        v-model="localUser.profile.avatar"
        type="url"
        id="avatar"
        placeholder="https://"
        required
      />
    </div>

    <div>
      <label for="createdAt">Created at</label>
      <input
        class="block w-full border-2 rounded-xl p-2 disabled:bg-neutral-100"
        :value="formatDate(localUser.createdAt)"
        type="text"
        id="createdAt"
        disabled
      />
    </div>

    <div class="flex justify-between">
      <TheButton type="button" @click="$emit('cancel')">Cancel</TheButton>
      <TheButton
        class="border-sky-200"
        type="submit"
        :is-loading="isLoading"
        data-testid="edit-form-submit"
        >Save</TheButton
      >
    </div>

    <div class="text-red-500" v-if="error" data-testid="edit-form-error">
      {{ error }}
    </div>
  </form>
</template>
