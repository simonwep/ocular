import { useEventListener, watchImmediate } from '@vueuse/core';
import { TemplateRef } from 'vue';

export const useScrollShadow = (
  element: TemplateRef<HTMLElement | undefined>,
  trigger: TemplateRef<HTMLElement | undefined>,
  shadow: string,
  offset = 5
) => {
  let hasShadow = false;

  const frame = () => {
    if (!element.value || !trigger.value) return;
    const scrollTop = trigger.value.scrollTop;

    if (hasShadow && scrollTop < offset) {
      element.value.style.removeProperty('box-shadow');
      hasShadow = false;
    } else if (scrollTop > offset) {
      element.value.style.setProperty('box-shadow', shadow);
      hasShadow = true;
    }
  };

  watchImmediate(element, (el) => {
    el?.style.removeProperty('box-shadow');
  });

  useEventListener(trigger, 'scroll', () => {
    requestAnimationFrame(frame);
  });
};
