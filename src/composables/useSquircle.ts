import { ref, MaybeRef, unref, watchEffect } from 'vue';

export const useSquircle = (size: MaybeRef<number>) => {
  const el = ref<HTMLElement | undefined>();
  const resizeEntry = ref<ResizeObserverEntry>();
  let observer: ResizeObserver;

  watchEffect(() => {
    if (!resizeEntry.value || !el.value || !unref(size)) {
      el.value?.style.removeProperty('clip-path');
      return;
    }

    const { width, height } = resizeEntry.value.contentRect;
    const min = Math.min(width, height) * unref(size);
    const d = `path('${[
      `M 0,${min}`,
      `C 0,0 0,0 ${min},0`,
      `L ${width - min},0`,
      `C ${width},0 ${width},0 ${width},${min}`,
      `L ${width},${min} ${width},${height - min}`,
      `C ${width},${height} ${width},${height} ${width - min},${height}`,
      `L ${width - min},${height} ${min},${height}`,
      `C 0,${height} 0,${height} 0,${height - min}`,
      `Z`
    ].join(' ')}')`;

    el.value.style.setProperty('clip-path', d);
  });

  watchEffect(() => {
    observer?.disconnect();

    if (el.value) {
      observer = new ResizeObserver((entries) => (resizeEntry.value = entries.at(-1)));
      observer.observe(el.value);
    }
  });

  return el;
};
