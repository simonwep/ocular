import { ref, Ref, watch } from 'vue';

export const useMutationObserver = (el: Ref<HTMLElement | undefined>): Ref<MutationRecord[]> => {
  const rect = ref<MutationRecord[]>([]);
  const observer = new MutationObserver((mutations) => {
    rect.value = mutations;
  });

  watch(el, (value) => {
    observer.disconnect();

    if (value) {
      observer.observe(value, { subtree: true, childList: true });
    }
  });

  return rect;
};
