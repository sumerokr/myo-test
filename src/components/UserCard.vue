<script setup lang="ts">
import type { User } from '@/types';

type Props = {
  user: User;
};

defineProps<Props>();

defineEmits<{
  edit: [];
  delete: [];
}>();

const composeFullName = (user: User) => `${user.profile.firstName} ${user.profile.lastName}`.trim();
</script>

<template>
  <div
    class="flex gap-x-4 border-2 border-slate-200 rounded-xl bg-white transition-shadow hover:shadow-md overflow-hidden"
    data-testid="user-card"
  >
    <p class="flex-shrink-0">
      <img
        :src="user.profile.avatar"
        :alt="`avatar of ${composeFullName(user)}`"
        width="72"
        height="72"
      />
    </p>

    <div class="flex-grow self-center min-w-0">
      <p class="mb-1 font-medium truncate">
        {{ composeFullName(user) }}
      </p>
      <p class="text-sm font-mono" data-testid="username">{{ user.username }}</p>
    </div>

    <div class="flex flex-col border-l border-slate-200 divide-y divide-slate-200">
      <button
        class="flex-1 w-9 bg-white transition-colors hover:bg-slate-200/30 active:bg-slate-200/60"
        type="button"
        @click="$emit('edit')"
        title="edit"
        data-testid="edit-user"
      >
        <svg
          class="inline-block opacity-80"
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M5 19h1.425L16.2 9.225L14.775 7.8L5 17.575zm-1 2q-.425 0-.712-.288T3 20v-2.425q0-.4.15-.763t.425-.637L16.2 3.575q.3-.275.663-.425t.762-.15q.4 0 .775.15t.65.45L20.425 5q.3.275.437.65T21 6.4q0 .4-.138.763t-.437.662l-12.6 12.6q-.275.275-.638.425t-.762.15zM19 6.4L17.6 5zm-3.525 2.125l-.7-.725L16.2 9.225z"
          />
        </svg>
        <span class="sr-only">Edit</span>
      </button>
      <button
        class="flex-1 w-9 bg-white transition-colors hover:bg-slate-200/30 active:bg-slate-200/60"
        type="button"
        @click="$emit('delete')"
        title="delete"
        data-testid="delete-user"
      >
        <svg
          class="inline-block opacity-80"
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M7 21q-.825 0-1.412-.587T5 19V6q-.425 0-.712-.288T4 5q0-.425.288-.712T5 4h4q0-.425.288-.712T10 3h4q.425 0 .713.288T15 4h4q.425 0 .713.288T20 5q0 .425-.288.713T19 6v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zm-7 11q.425 0 .713-.288T11 16V9q0-.425-.288-.712T10 8q-.425 0-.712.288T9 9v7q0 .425.288.713T10 17m4 0q.425 0 .713-.288T15 16V9q0-.425-.288-.712T14 8q-.425 0-.712.288T13 9v7q0 .425.288.713T14 17M7 6v13z"
          />
        </svg>
        <span class="sr-only">Delete</span>
      </button>
    </div>
  </div>
</template>
