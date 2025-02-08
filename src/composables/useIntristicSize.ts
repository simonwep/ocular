import { useMutationObserver } from './useMutationObserver';
import { useResizeObserver } from './useResizeObserver';
import { ref, Ref, watch } from 'vue';

export const useIntristicSize = (el: Ref<HTMLElement | undefined>): Ref<DOMRect> => {
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
