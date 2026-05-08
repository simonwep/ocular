import { useElementSize } from '@vueuse/core';
import { MaybeRefOrGetter, toValue, TemplateRef, watch } from 'vue';

export const useSquircle = (el: TemplateRef<HTMLElement | null>, curvature: MaybeRefOrGetter<number>) => {
  const { width, height } = useElementSize(el, new DOMRect(), { box: 'border-box' });

  watch([width, height], ([w, h]) => {
    if (!w || !h) return;

    const min = Math.min(w, h) * toValue(curvature);

    const commands = [
      `M 0,${min}`,
      `C 0,0 0,0 ${min},0`,
      `L ${w - min},0`,
      `C ${w},0 ${w},0 ${w},${min}`,
      `L ${w},${min} ${w},${h - min}`,
      `C ${w},${h} ${w},${h} ${w - min},${h}`,
      `L ${w - min},${h} ${min},${h}`,
      `C 0,${h} 0,${h} 0,${h - min}`,
      `Z`
    ];

    el.value?.style.setProperty('clip-path', `path('${commands.join(' ')}')`);
  });
};
