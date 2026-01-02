import { computed, getCurrentScope, onScopeDispose, shallowRef } from 'vue';

const UPDATE_INTERVAL = 100; // Update every 100 milliseconds

export const useTime = () => {
  const date = shallowRef(new Date());
  const interval = setInterval(() => (date.value = new Date()), UPDATE_INTERVAL);

  if (getCurrentScope()) {
    onScopeDispose(() => clearInterval(interval));
  }

  return {
    year: computed(() => date.value.getFullYear()),
    month: computed(() => date.value.getMonth())
  };
};
