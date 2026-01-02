import { watchEffect, MaybeRefOrGetter, toValue, shallowRef, TemplateRef } from 'vue';

export const useSquircle = (el: TemplateRef<HTMLElement | null>, curvature: MaybeRefOrGetter<number>) => {
  const resizeEntry = shallowRef<ResizeObserverEntry>();
  let observer: ResizeObserver;

  watchEffect(() => {
    if (!resizeEntry.value || !el.value || !toValue(curvature)) {
      el.value?.style.removeProperty('clip-path');
      return;
    }

    const { width, height } = resizeEntry.value.contentRect;
    const min = Math.min(width, height) * toValue(curvature);
    const commands = [
      `M 0,${min}`,
      `C 0,0 0,0 ${min},0`,
      `L ${width - min},0`,
      `C ${width},0 ${width},0 ${width},${min}`,
      `L ${width},${min} ${width},${height - min}`,
      `C ${width},${height} ${width},${height} ${width - min},${height}`,
      `L ${width - min},${height} ${min},${height}`,
      `C 0,${height} 0,${height} 0,${height - min}`,
      `Z`
    ];

    el.value.style.setProperty('clip-path', `path('${commands.join(' ')}')`);
  });

  watchEffect(() => {
    observer?.disconnect();

    if (el.value) {
      observer = new ResizeObserver((entries) => (resizeEntry.value = entries.at(-1)));
      observer.observe(el.value);
    }
  });
};
