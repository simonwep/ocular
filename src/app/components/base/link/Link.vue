<template>
  <RouterLink :to="to" :class="classes">
    <Icon :class="$style.icon" v-if="icon" :icon="icon" />
    <slot />
  </RouterLink>
</template>

<script lang="ts" setup>
import { AppIcon } from '@components/base/icon/Icon.types';
import Icon from '@components/base/icon/Icon.vue';
import { Color, useThemeStyles } from '@composables';
import { ClassNames } from '@utils';
import { computed, useCssModule, useSlots } from 'vue';

const props = withDefaults(
  defineProps<{
    class?: ClassNames;
    icon?: AppIcon;
    color?: Color;
    custom?: boolean;
    to: string;
  }>(),
  {
    color: 'primary',
    custom: undefined
  }
);

const slots = useSlots();
const styles = useCssModule();
const classes = computed(() => [
  props.class,
  styles.link,
  {
    [styles.custom]: props.custom ?? slots.default
  }
]);

const theme = useThemeStyles(() => props.color);
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
