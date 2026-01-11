import { useResizeObserver } from '@composables//resize-observer/useResizeObserver';
import { useMutationObserver } from '@composables/mutation-observer/useMutationObserver';
import { ref, Ref, TemplateRef, watch } from 'vue';

export const useIntrinsicSize = (el: TemplateRef<HTMLElement | undefined>): Ref<DOMRect> => {
  const rect = ref<DOMRect>(new DOMRect());
  const mutation = useMutationObserver(el);
  const size = useResizeObserver(el);

  const readSize = () => {
    const element = el.value;

    if (element) {
      element.style.setProperty('position', 'fixed');
      rect.value = element.getBoundingClientRect();
      element.style.removeProperty('position');
    }
  };

  watch([mutation, size], readSize);
  return rect;
};
