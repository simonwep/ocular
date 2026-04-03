import styles from './vTooltip.module.scss';
import { useAppSize } from '@composables/app-size/useAppSize.ts';
import { uuid } from '@utils/uuid/uuid.ts';
import { Directive, unref } from 'vue';

export type Placement = 'top' | 'right' | 'bottom' | 'left';

export type TooltipConfig = {
  text?: string;
  position?: Placement;
};

export type Tooltip = {
  destroy: () => void;
  element: HTMLElement;
};

const poppers: WeakMap<HTMLElement, Tooltip> = new WeakMap();

const resolveConfig = (value: undefined | string | TooltipConfig): TooltipConfig =>
  typeof value === 'string' || !value ? { text: value } : value;

export const getAnchorNames = (el: HTMLElement) =>
  el.style
    .getPropertyValue('anchor-name')
    ?.split(',')
    .map((v) => v.trim())
    .filter(Boolean) ?? [];

export const vTooltip: Directive<HTMLElement, undefined | string | TooltipConfig> = {
  mounted: (el, { value }) => {
    const { text, position } = resolveConfig(value);
    const media = useAppSize(); // doesn't need to be in a scope
    const anchorId = `--${uuid()}`;

    const tooltip = document.createElement('span');
    tooltip.textContent = unref(text)?.trim() ?? '';
    tooltip.classList.add(styles.tooltip);
    tooltip.style.setProperty('position-anchor', anchorId);
    tooltip.style.setProperty('position-area', position ?? 'top');

    tooltip.addEventListener('transitionend', () => {
      if (!tooltip.classList.contains(styles.show)) {
        tooltip.remove();

        const anchors = getAnchorNames(el).filter((v) => v !== anchorId);
        el.style.setProperty('anchor-name', anchors.join(','));
      }
    });

    const hide = () => {
      requestAnimationFrame(() => {
        tooltip.classList.remove(styles.show);
      });
    };

    const show = () => {
      if (!tooltip.textContent || media.value === 'mobile' || navigator.webdriver) {
        return;
      }

      const app = document.getElementById('app');
      if (!app?.contains(tooltip)) {
        app?.appendChild(tooltip);
      }

      requestAnimationFrame(() => {
        const anchorNames = getAnchorNames(el).concat([anchorId]);
        el.style.setProperty('anchor-name', anchorNames.join(','));
        tooltip.classList.add(styles.show);
      });
    };

    const destroy = () => {
      tooltip.remove();

      el.removeEventListener('pointerleave', hide);
      el.removeEventListener('pointerdown', hide);
      el.removeEventListener('pointerup', hide);
      el.removeEventListener('pointerenter', show);
    };

    el.addEventListener('pointerleave', hide);
    el.addEventListener('pointerdown', hide);
    el.addEventListener('pointerup', hide);
    el.addEventListener('pointerenter', show);

    poppers.set(el, { destroy, element: tooltip });
  },
  updated: (el, { value }) => {
    const { text, position } = resolveConfig(value);
    const tooltip = poppers.get(el);

    if (tooltip) {
      tooltip.element.textContent = unref(text)?.trim() ?? '';
      tooltip.element.style.setProperty('position-anchor', position ?? 'top');
    }
  },
  unmounted: (el) => {
    el.classList.remove(styles.anchor);
    poppers.get(el)?.destroy();
  }
};
