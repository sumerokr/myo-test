<script setup lang="ts">
import { onClickOutside, onKeyStroke } from '@vueuse/core';
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap';
import { nextTick, onMounted, onUnmounted, ref } from 'vue';

const emit = defineEmits<{
  close: [];
}>();

const dialog = ref<HTMLElement | null>(null);
const { activate, deactivate } = useFocusTrap(dialog);

onClickOutside(dialog, () => emit('close'));
onKeyStroke('Escape', () => {
  emit('close');
});

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
    class="_overlay fixed z-50 inset-0 grid justify-items-center backdrop-blur-[2px] bg-black/30 overflow-auto"
  >
    <div
      class="col-start-2 row-start-2 border-2 border-slate-200 rounded-xl w-full max-w-[24rem] p-4 bg-white shadow-xl"
      ref="dialog"
    >
      <slot />
    </div>
  </div>
</template>

<style scoped>
._overlay {
  grid-template-columns: 1rem 1fr 1rem;
  grid-template-rows: minmax(1rem, 1fr) 1fr minmax(1rem, 3fr);
}
</style>
