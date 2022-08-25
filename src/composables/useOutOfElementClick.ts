import { onMounted, onUnmounted, Ref } from 'vue';

export const useOutOfElementClick = (el: Ref<HTMLElement | undefined>, cb: (evt: MouseEvent) => void) => {
  const click = (evt: MouseEvent) => {
    if (el.value && evt.isTrusted && !evt.composedPath().includes(el.value)) {
      cb(evt);
    }
  };

  onMounted(() => window.addEventListener('click', click));
  onUnmounted(() => window.removeEventListener('click', click));
};
