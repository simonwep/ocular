<template>
  <button
    v-tooltip="{ text: tooltip, position: tooltipPosition }"
    :class="classes"
    :disabled="disabled"
    :type="type"
    @click="emit('click', $event)"
  >
    <Icon v-if="icon" :class="[$style.icon, iconClass]" :icon="icon" />
    <span v-if="text" :class="$style.text">{{ text }}</span>
  </button>
</template>

<script lang="ts" setup>
import { Placement } from '@popperjs/core';
import { computed, useCssModule } from 'vue';
import { AppIcon } from '@components/base/icon/Icon.types';
import Icon from '@components/base/icon/Icon.vue';
import { Color, useThemeStyles } from '@composables';
import { ClassNames } from '@utils';

const emit = defineEmits<{
  (e: 'click', v: MouseEvent): void;
}>();

const props = withDefaults(
  defineProps<{
    class?: ClassNames;
    iconClass?: ClassNames;
    icon?: AppIcon;
    text?: string;
    tooltip?: string;
    type?: 'button' | 'reset' | 'submit';
    tooltipPosition?: Placement;
    color?: Color;
    textual?: boolean;
    rounded?: boolean;
    disabled?: boolean;
  }>(),
  {
    color: 'primary',
    type: 'button',
    textual: false,
    rounded: false,
    disabled: false
  }
);

const styles = useCssModule();
const theme = useThemeStyles(() => props.color);
const classes = computed(() => [
  props.class,
  styles.button,
  {
    [styles.hasIcon]: props.icon,
    [styles.disabled]: props.disabled,
    [styles.textual]: props.textual,
    [styles.rounded]: props.rounded,
    [styles.iconOnly]: props.icon && !props.text
  }
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
  padding: 8px 10px;

  &.iconOnly {
    padding: 3px;
  }

  &.hasIcon .text {
    margin-left: 5px;
  }

  .icon {
    width: 16px;
    height: 16px;
  }

  .text {
    width: 100%;
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-l);
    line-height: 1em;
  }

  &:focus {
    box-shadow: 0 0 0 2px v-bind('theme.focus');
  }

  &.textual {
    background: transparent;
    color: v-bind('theme.pure.base');

    &:focus {
      box-shadow: none;
    }
  }

  &.rounded {
    border-radius: 100px;
  }

  &.disabled,
  &.disabled:hover {
    background: var(--c-dimmed);
    cursor: default;
  }
}

@media (pointer: fine) {
  .button {
    &:hover {
      background: v-bind('theme.color.hover');
      color: v-bind('theme.text.hover');
    }

    &.textual:hover {
      background: transparent;
      color: v-bind('theme.pure.hover');
    }
  }
}
</style>
