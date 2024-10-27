import { arrayify } from '@utils';
import { onMounted, onUnmounted, Ref } from 'vue';

export const useOutOfElementClick = (
  valid: Ref<HTMLElement | undefined>[] | Ref<HTMLElement | undefined>,
  cb: (evt: MouseEvent) => void
) => {
  const els = arrayify(valid);

  const click = (evt: MouseEvent) => {
    if (evt.isTrusted && els.every((el) => !el.value || !evt.composedPath().includes(el.value))) {
      cb(evt);
    }
  };

  onMounted(() => window.addEventListener('click', click));
  onUnmounted(() => window.removeEventListener('click', click));
};
