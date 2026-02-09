import { createGlobalState, useTimestamp } from '@vueuse/core';
import { computed } from 'vue';

export const useTime = createGlobalState(() => {
  const timestamp = useTimestamp();

  const date = computed(() => new Date(timestamp.value));

  return {
    year: computed(() => date.value.getFullYear()),
    month: computed(() => date.value.getMonth()),
    timestamp
  };
});
