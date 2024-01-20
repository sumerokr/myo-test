<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';

const emit = defineEmits<{
  close: [];
}>();

onMounted(() => {
  document.body.classList.add('overflow-hidden');
});

onUnmounted(() => {
  document.body.classList.remove('overflow-hidden');
});
</script>

<template>
  <div
    class="fixed z-50 inset-0 -top-2 flex items-center justify-center backdrop-blur-[2px] bg-black/20 overflow-auto"
    @click.self="emit('close')"
  >
    <div
      class="flex-grow m-4 border-2 border-slate-200 rounded-xl max-w-[24rem] p-4 bg-white shadow-xl"
    >
      <slot />
    </div>
  </div>
</template>
