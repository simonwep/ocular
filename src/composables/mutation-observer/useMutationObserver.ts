import { ref, Ref, TemplateRef, watch } from 'vue';

export const useMutationObserver = (el: TemplateRef<HTMLElement | undefined>): Ref<MutationRecord[]> => {
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
