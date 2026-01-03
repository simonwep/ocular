import { ref, Ref, TemplateRef, watch } from 'vue';

export const useResizeObserver = (el: TemplateRef<HTMLElement | undefined>): Ref<DOMRect> => {
  const rect = ref<DOMRect>(new DOMRect());

  const observer = new ResizeObserver((entries) => {
    rect.value = entries[0].target.getBoundingClientRect();
  });

  watch(el, (value) => {
    observer.disconnect();

    if (value) {
      observer.observe(value);
    }
  });

  return rect;
};
