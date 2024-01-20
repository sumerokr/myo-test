<script setup lang="ts">
import { ref } from 'vue';
import type { UserDraft } from '@/types';
import TheButton from '@/components/TheButton.vue';

type Props = {
  isCreating: boolean;
  creatingError: unknown;
};

defineProps<Props>();

defineEmits<{
  cancel: [];
  submit: [user: UserDraft];
}>();

const localUser = ref<UserDraft>({
  username: '',
  profile: {
    firstName: '',
    lastName: '',
    avatar: '',
  },
});
</script>

<template>
  <form class="space-y-4" @submit.prevent="$emit('submit', localUser)">
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
        required
      />
    </div>

    <div class="flex justify-between">
      <TheButton type="button" @click="$emit('cancel')">Cancel</TheButton>
      <TheButton type="submit">Save</TheButton>
    </div>

    <div class="text-red-500" v-if="creatingError" data-testid="edit-form-error">
      {{ creatingError }}
    </div>
  </form>
</template>
