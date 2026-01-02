import { arrayify } from '@utils/array/array.ts';
import { onMounted, onUnmounted, Ref } from 'vue';

export const useOutOfElementClick = (
  valid: Ref<HTMLElement | undefined>[] | Ref<HTMLElement | undefined>,
  cb: (evt: MouseEvent) => void
) => {
  const els = arrayify(valid);

  const click = (evt: PointerEvent) => {
    if (evt.isTrusted && els.length && els.every((el) => !el.value || !evt.composedPath().includes(el.value))) {
      cb(evt);
    }
  };

  onMounted(() => window.addEventListener('pointerup', click));
  onUnmounted(() => window.removeEventListener('pointerup', click));
};
