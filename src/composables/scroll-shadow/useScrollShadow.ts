import { useEventListener, watchImmediate } from '@vueuse/core';
import { TemplateRef } from 'vue';

export const useScrollShadow = (
  element: TemplateRef<HTMLElement | undefined>,
  trigger: TemplateRef<HTMLElement | undefined>,
  shadow: string,
  offset = 5
) => {
  const frame = () => {
    if (!element.value || !trigger.value) return;

    if (trigger.value.scrollTop > offset) {
      element.value.style.setProperty('box-shadow', shadow);
    } else {
      element.value.style.removeProperty('box-shadow');
    }
  };

  watchImmediate(element, (el) => {
    el?.style.removeProperty('box-shadow');
  });

  useEventListener(trigger, 'scroll', () => {
    requestAnimationFrame(frame);
  });
};
