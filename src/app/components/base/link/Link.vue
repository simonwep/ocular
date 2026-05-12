<template>
  <a
    v-if="to.startsWith('http')"
    ref="browserLink"
    v-tooltip="{ text: tooltip, position: tooltipPosition }"
    :href="to"
    :class="classes"
    :data-testid="testId"
    rel="noopener,noreferrer,nofollow"
    target="_blank"
  >
    <component :is="icon" v-if="icon" :class="$style.icon" />
    <slot />
  </a>
  <RouterLink
    v-else
    ref="routerLink"
    v-tooltip="{ text: tooltip, position: tooltipPosition }"
    :data-testid="testId"
    :to="{ name: to }"
    :class="classes"
    v-bind="exactRouteMatch ? { exactActiveClass: $style.active } : { activeClass: $style.active }"
  >
    <component :is="icon" v-if="icon" :class="$style.icon" />
    <slot />
  </RouterLink>
</template>

<script lang="ts" setup>
import { scaleSvgPath } from '@components/base/link/Link.utils.ts';
import { Color, useThemeStyles } from '@composables/theme-styles/useThemeStyles.ts';
import { Placement } from '@directives/v-tooltip/vTooltip.ts';
import { ClassNames } from '@utils/types.ts';
import { useElementSize } from '@vueuse/core';
import { computed, useCssModule, useTemplateRef } from 'vue';
import type { Component } from 'vue';

// All shapes have a size of 30x30
const shapes = [
  'M 21.47 3.76 C 23.49 5.00 25.29 6.51 26.58 8.44 C 27.89 10.38 28.67 12.69 28.77 15.08 C 28.87 17.45 28.27 19.90 27.07 21.97 C 25.86 24.04 24.04 25.76 21.93 26.89 C 19.81 28.01 17.42 28.54 14.99 28.60 C 12.57 28.63 10.14 28.17 7.99 27.06 C 5.83 25.97 3.98 24.20 3.00 22.09 C 2.03 19.99 1.94 17.49 2.06 15.08 C 2.17 12.68 2.50 10.32 3.56 8.37 C 4.63 6.41 6.44 4.87 8.48 3.64 C 10.51 2.39 12.76 1.47 15.01 1.50 C 17.24 1.51 19.46 2.50 21.47 3.76 Z',
  'M 21.77 3.11 C 23.76 4.44 25.33 6.31 26.42 8.37 C 27.50 10.44 28.07 12.74 28.20 15.09 C 28.33 17.45 28.00 19.89 26.94 22.02 C 25.90 24.13 24.15 25.97 22.05 27.21 C 19.93 28.47 17.48 29.15 15.05 29.09 C 12.62 29.04 10.21 28.26 8.11 27.02 C 6.01 25.76 4.19 24.04 2.90 21.96 C 1.63 19.89 0.86 17.45 0.86 15.02 C 0.86 12.58 1.61 10.15 2.87 8.02 C 4.13 5.90 5.88 4.08 8.01 2.83 C 10.11 1.56 12.57 0.84 14.99 0.90 C 17.41 0.94 19.79 1.77 21.77 3.11 Z',
  'M 21.62 3.57 C 23.60 4.74 25.27 6.43 26.61 8.42 C 27.96 10.42 28.96 12.72 29.01 15.06 C 29.09 17.41 28.24 19.78 26.94 21.83 C 25.63 23.87 23.87 25.60 21.82 26.70 C 19.75 27.81 17.39 28.31 15.03 28.27 C 12.69 28.23 10.36 27.67 8.20 26.63 C 6.02 25.59 4.03 24.06 2.90 22.03 C 1.79 20.02 1.56 17.52 1.76 15.14 C 1.96 12.75 2.58 10.48 3.74 8.51 C 4.88 6.55 6.55 4.90 8.51 3.70 C 10.48 2.51 12.75 1.77 15.03 1.74 C 17.32 1.71 19.62 2.39 21.62 3.57 Z',
  'M 21.72 3.70 C 23.86 4.66 25.87 6.13 27.03 8.10 C 28.19 10.06 28.50 12.54 28.33 14.91 C 28.14 17.29 27.49 19.55 26.43 21.72 C 25.38 23.87 23.94 25.93 21.99 27.13 C 20.02 28.31 17.51 28.61 15.06 28.52 C 12.62 28.43 10.22 27.94 8.18 26.80 C 6.15 25.66 4.50 23.86 3.23 21.79 C 1.98 19.72 1.16 17.36 1.20 15.05 C 1.24 12.74 2.20 10.44 3.41 8.31 C 4.63 6.18 6.14 4.22 8.12 3.15 C 10.11 2.10 12.55 1.97 14.92 2.11 C 17.30 2.27 19.56 2.73 21.72 3.70 Z',
  'M 21.72 3.70 C 23.86 4.66 25.87 6.13 27.03 8.10 C 28.19 10.06 28.50 12.54 28.33 14.91 C 28.14 17.29 27.49 19.55 26.43 21.72 C 25.38 23.87 23.94 25.93 21.99 27.13 C 20.02 28.31 17.51 28.61 15.06 28.52 C 12.62 28.43 10.22 27.94 8.18 26.80 C 6.15 25.66 4.50 23.86 3.23 21.79 C 1.98 19.72 1.16 17.36 1.20 15.05 C 1.24 12.74 2.20 10.44 3.41 8.31 C 4.63 6.18 6.14 4.22 8.12 3.15 C 10.11 2.10 12.55 1.97 14.92 2.11 C 17.30 2.27 19.56 2.73 21.72 3.70 Z'
];

const props = withDefaults(
  defineProps<{
    class?: ClassNames;
    icon?: Component;
    size?: 'm' | 's';
    color?: Color;
    shaped?: boolean;
    inline?: boolean;
    tooltip?: string;
    exactRouteMatch?: boolean;
    tooltipPosition?: Placement;
    to: string;
    testId?: string;
  }>(),
  {
    size: 'm',
    shaped: false,
    squircle: false,
    color: 'primary',
    exactRouteMatch: false,
    inline: false
  }
);

const styles = useCssModule();
const routerLink = useTemplateRef('routerLink');
const browserLink = useTemplateRef('browserLink');
const linkElement = computed(() => (routerLink.value as { $el?: HTMLElement } | undefined)?.$el ?? browserLink.value);

const elementSize = useElementSize(linkElement);

const theme = useThemeStyles(() => props.color);

const classes = computed(() => [
  props.class,
  styles.link,
  styles[props.size],
  {
    [styles.inline]: props.inline,
    [styles.shaped]: props.shaped
  }
]);

const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
const randomClipPath = computed(() => `path('${scaleSvgPath(randomShape, 30, elementSize.width.value)}')`);
</script>

<style lang="scss" module>
.link {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  background: transparent;
  color: v-bind('theme.pure.base');
  transition: all var(--transition-s);
  text-decoration: none;
  outline: none;

  &.inline {
    color: v-bind('theme.pure.base');

    &:hover {
      color: v-bind('theme.pure.hover');
    }

    &.active {
      color: v-bind('theme.pure.hover');
    }
  }

  &:not(.inline) {
    color: v-bind('theme.pure.base');

    .icon {
      transition: transform var(--transition-s);
      width: 20px;
      height: 20px;
    }

    &.shaped {
      display: flex;
      align-items: center;
      justify-content: center;
      clip-path: v-bind(randomClipPath);

      &.active {
        background: v-bind('theme.color.base');
        color: v-bind('theme.text.base');

        .icon {
          transform: scale(0.9);
        }
      }
    }

    &:hover {
      color: v-bind('theme.pure.hover');
    }

    &:not(.shaped).active {
      color: v-bind('theme.pure.hover');
    }

    &.m {
      width: 30px;
      height: 30px;
    }

    &.s {
      width: 26px;
      height: 26px;
    }
  }
}
</style>
