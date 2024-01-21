<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted } from 'vue';
import { onClickOutside } from '@vueuse/core';
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap';

const emit = defineEmits<{
  close: [];
}>();

const dialog = ref<HTMLElement | null>(null);
const { activate, deactivate } = useFocusTrap(dialog);
onClickOutside(dialog, () => emit('close'));

onMounted(async () => {
  document.body.classList.add('overflow-hidden');
  await nextTick();
  activate();
});

onUnmounted(() => {
  document.body.classList.remove('overflow-hidden');
  deactivate();
});
</script>

<template>
  <div
    class="fixed z-50 inset-0 -top-2 flex items-center justify-center backdrop-blur-[2px] bg-black/20 overflow-auto"
  >
    <div
      class="flex-grow m-4 border-2 border-slate-200 rounded-xl max-w-[24rem] p-4 bg-white shadow-xl"
      ref="dialog"
    >
      <slot />
    </div>
  </div>
</template>
