<template>
  <a
    v-if="to.startsWith('http')"
    v-tooltip="{ text: tooltip, position: tooltipPosition }"
    :href="to"
    :class="classes"
    rel="noopener,noreferrer,nofollow"
    target="_blank"
  >
    <component :is="icon" v-if="icon" :class="$style.icon" />
    <slot />
  </a>
  <RouterLink
    v-else
    v-tooltip="{ text: tooltip, position: tooltipPosition }"
    :data-testid="testId ? `${testId}-${to}` : undefined"
    :to="to"
    :class="classes"
  >
    <component :is="icon" v-if="icon" :class="$style.icon" />
    <slot />
  </RouterLink>
</template>

<script lang="ts" setup>
import { Color, useThemeStyles } from '@composables/useThemeStyles.ts';
import { Placement } from '@popperjs/core';
import { ClassNames } from '@utils/types.ts';
import { computed, useCssModule, useSlots } from 'vue';
import { useRouter } from 'vue-router';
import type { Component } from 'vue';

const props = withDefaults(
  defineProps<{
    class?: ClassNames;
    icon?: Component;
    color?: Color | ((currentRoute: boolean) => Color);
    custom?: boolean;
    tooltip?: string;
    tooltipPosition?: Placement;
    to: string;
    testId?: string;
  }>(),
  {
    custom: undefined
  }
);

const slots = useSlots();
const styles = useCssModule();
const router = useRouter();
const theme = useThemeStyles(() =>
  typeof props.color === 'function'
    ? props.color(router.currentRoute.value.name === props.to)
    : (props.color ?? 'primary')
);

const classes = computed(() => [
  props.class,
  styles.link,
  {
    [styles.custom]: props.custom ?? slots.default
  }
]);
</script>

<style lang="scss" module>
@use '@styles/globals.scss';

.link {
  background: transparent;
  color: v-bind('theme.pure.base');
  transition: all var(--transition-s);

  .icon {
    width: 20px;
    height: 20px;
  }

  &.custom {
    text-decoration: none;
    color: inherit;
    outline: none;
  }
}

@media (pointer: fine) {
  .link:not(.custom):hover {
    background: transparent;
    color: v-bind('theme.pure.hover');
  }
}

@include globals.onMobileDevices {
  .link .icon {
    width: 20px;
    height: 20px;
  }
}
</style>
