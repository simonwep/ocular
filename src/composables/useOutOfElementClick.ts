import { onMounted, onUnmounted, Ref } from 'vue';

export const useOutOfElementClick = (
  elements: Ref<HTMLElement | undefined>,
  cb: () => void
) => {
  const click = (v: MouseEvent) => {
    if (elements.value && !v.composedPath().includes(elements.value)) {
      cb();
    }
  };

  onMounted(() => window.addEventListener('click', click));
  onUnmounted(() => window.removeEventListener('click', click));
};
