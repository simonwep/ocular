import { computed, getCurrentScope, onScopeDispose, ref } from 'vue';

const UPDATE_INTERVAL = 1_000 * 60;

export const useTime = () => {
  const timestamp = ref(Date.now());
  const interval = setInterval(() => (timestamp.value = Date.now()), UPDATE_INTERVAL);
  const date = computed(() => new Date(timestamp.value));

  if (getCurrentScope()) {
    onScopeDispose(() => clearInterval(interval));
  }

  return {
    year: computed(() => date.value.getFullYear()),
    month: computed(() => date.value.getMonth())
  };
};
