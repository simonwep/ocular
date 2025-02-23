import styles from './vTooltip.module.scss';
import { useMediaQuery } from '@composables';
import { createPopper, Instance, Placement } from '@popperjs/core';
import { Directive, Ref, ref, unref } from 'vue';

interface TooltipConfig {
  text?: string;
  position?: Placement;
}

interface Tooltip {
  element: HTMLElement;
  popper: Ref<Instance | undefined>;
}

const poppers: WeakMap<HTMLElement, Tooltip> = new WeakMap();

const resolveConfig = (value: undefined | string | TooltipConfig): TooltipConfig =>
  typeof value === 'string' || !value ? { text: value } : value;

export const vTooltip: Directive<HTMLElement, undefined | string | TooltipConfig> = {
  mounted: (el, { modifiers, value }) => {
    const { text, position } = resolveConfig(value);
    const media = useMediaQuery(); // doesn't need to be in a scope

    const element = document.createElement('span');
    const popper = ref<Instance | undefined>(undefined);
    element.textContent = unref(text)?.trim() ?? '';
    element.classList.add(styles.tooltip);

    element.addEventListener('transitionend', () => {
      if (!element.classList.contains(styles.show)) {
        element.remove();
        popper.value?.destroy();
        popper.value = undefined;
      }
    });

    const hide = () => {
      requestAnimationFrame(() => {
        element.classList.remove(styles.show);
      });
    };

    const show = () => {
      if (!element.textContent || media.value === 'mobile') {
        return;
      }

      if (!popper.value) {
        document.getElementById('app')?.appendChild(element);

        popper.value = createPopper(el, element, {
          placement: (position ?? Object.keys(modifiers)[0] ?? 'auto') as Placement,
          modifiers: [{ name: 'offset', options: { offset: [0, 4] } }]
        });
      }

      requestAnimationFrame(() => {
        element.classList.add(styles.show);
      });
    };

    el.addEventListener('pointerleave', hide);
    el.addEventListener('pointerdown', hide);
    el.addEventListener('pointerup', hide);
    el.addEventListener('pointerenter', show);
    poppers.set(el, { element, popper });
  },
  updated: (el, { modifiers, value }) => {
    const { text, position } = resolveConfig(value);
    const tooltip = poppers.get(el);

    if (tooltip) {
      tooltip.element.textContent = unref(text)?.trim() ?? '';
      tooltip.popper.value?.setOptions({
        placement: (position ?? Object.keys(modifiers)[0] ?? 'auto') as Placement
      });
    }
  },
  unmounted: (el) => {
    const tooltip = poppers.get(el);

    if (tooltip) {
      tooltip.element.remove();
      tooltip.popper.value?.destroy();
    }
  }
};
