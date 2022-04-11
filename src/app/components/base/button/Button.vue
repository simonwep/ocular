<template>
  <button :class="classes" @click="emit('click', $event)">
    <Icon v-if="icon" :class="$style.icon" :icon="icon" />
    <span v-if="text" :class="$style.text">{{ text }}</span>
  </button>
</template>

<script lang="ts" setup>
import { AppIcon } from '@components/base/icon/Icon.types';
import Icon from '@components/base/icon/Icon.vue';
import { ClassNames } from '@utils';
import { computed, useCssModule } from 'vue';
import { Color, useThemeStyles } from '../../../../composables/useThemeStyles';

const emit = defineEmits<{
  (e: 'click', v: MouseEvent): void;
}>();

const props = withDefaults(
  defineProps<{
    class?: ClassNames;
    icon?: AppIcon;
    text?: string;
    color?: Color;
    textual?: boolean;
    inline?: boolean;
  }>(),
  {
    color: 'primary',
    textual: false,
    inline: false,
  }
);

const styles = useCssModule();
const theme = useThemeStyles(() => props.color);
const classes = computed(() => [
  props.class,
  styles.button,
  {
    [styles.hasIcon]: props.icon,
    [styles.textual]: props.textual,
    [styles.inline]: props.inline,
    [styles.iconOnly]: props.icon && !props.text,
  },
]);
</script>

<style lang="scss" module>
.button {
  all: unset;
  justify-self: flex-start;
  display: flex;
  align-items: center;
  cursor: pointer;
  background: v-bind('theme.color.base');
  color: v-bind('theme.text.base');
  border-radius: var(--border-radius-m);
  transition: all var(--transition-s);

  &:not(.inline) {
    padding: 6px 10px;
  }

  &.iconOnly:not(.inline) {
    padding: 3px;
  }

  &.hasIcon .text {
    margin-left: 5px;
  }

  .icon {
    width: 20px;
    height: 20px;
  }

  .text {
    width: 100%;
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-l);
    line-height: 1em;
  }

  &:focus {
    box-shadow: v-bind('theme.focus');
  }

  &:hover {
    background: v-bind('theme.color.hover');
    color: v-bind('theme.text.hover');
  }

  &.textual {
    background: transparent;
    color: v-bind('theme.pure.base');

    &:focus {
      box-shadow: none;
    }

    &:hover {
      background: transparent;
      color: v-bind('theme.pure.hover');
    }
  }
}
</style>
