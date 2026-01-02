import { watchEffect, MaybeRefOrGetter, toValue, shallowRef, TemplateRef, computed } from 'vue';

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

export const useSquircleCorner = (
  size: MaybeRefOrGetter<number>,
  curvature: MaybeRefOrGetter<number>,
  position: MaybeRefOrGetter<'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'>
) => {
  const path = computed(() => {
    const c = toValue(curvature);
    const s = toValue(size);

    const a = s * c;
    const b = s - a;

    switch (toValue(position)) {
      case 'top-right':
        return [`M 0,0`, `C ${a},0 ${s},${b} ${s},${s}`].join(' ');
      case 'bottom-left':
        return [`M 0,${s}`, `C 0,${b} ${b},${s} ${s},${s}`].join(' ');
      case 'bottom-right':
        return [`M ${s},${s}`, `C ${s},${a} ${a},0 0,0`].join(' ');
      case 'top-left':
      default:
        return [`M 0,0`, `C 0,${a} ${b},${s} ${s},${s}`].join(' ');
    }
  });

  const style = computed(() => ({
    width: `${toValue(size)}px`,
    height: `${toValue(size)}px`,
    viewBox: `0 0 ${toValue(size)} ${toValue(size)}`
  }));

  return computed(() => ({
    path: path.value,
    style: style.value
  }));
};
