<template>
  <a
    v-if="isExternalLink"
    v-tooltip="{ text: tooltip, position: tooltipPosition }"
    :href="href"
    :class="classes"
    rel="noopener,noreferrer,nofollow"
    target="_blank"
  >
    <Icon v-if="icon" :class="$style.icon" :icon="icon" />
    <slot />
  </a>
  <RouterLink v-else v-tooltip="{ text: tooltip, position: tooltipPosition }" :to="href" :class="classes">
    <Icon v-if="icon" :class="$style.icon" :icon="icon" />
    <slot />
  </RouterLink>
</template>

<script lang="ts" setup>
import { Placement } from '@popperjs/core';
import { computed, useCssModule, useSlots } from 'vue';
import { useRouter } from 'vue-router';
import { AppIcon } from '@components/base/icon/Icon.types';
import Icon from '@components/base/icon/Icon.vue';
import { Color, useThemeStyles } from '@composables';
import { ClassNames } from '@utils';

const props = withDefaults(
  defineProps<{
    class?: ClassNames;
    icon?: AppIcon;
    color?: Color | ((currentRoute: boolean) => Color);
    custom?: boolean;
    tooltip?: string;
    tooltipPosition?: Placement;
    name?: string;
    to?: string;
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
    ? props.color(router.currentRoute.value.name === props.name)
    : props.color ?? 'primary'
);

const href = computed(() => (props.name ? router.resolve({ name: props.name }).href : props.to ?? ''));
const isExternalLink = computed(() => href.value.startsWith('http'));

const classes = computed(() => [
  props.class,
  styles.link,
  {
    [styles.custom]: props.custom ?? slots.default
  }
]);
</script>

<style lang="scss" module>
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
</style>
