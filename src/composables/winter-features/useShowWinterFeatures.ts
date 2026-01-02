import { useTime } from '@composables/useTime.ts';
import { computed } from 'vue';

export const useShowWinterFeatures = () => {
  const { month } = useTime();
  return computed(() => [11, 0].includes(month.value));
};
