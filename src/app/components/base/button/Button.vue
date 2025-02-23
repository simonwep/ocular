<template>
  <button
    v-tooltip="{ text: tooltip, position: tooltipPosition }"
    :class="classes"
    :data-testid="testId"
    :disabled="disabled"
    :type="type"
    @click="emit('click', $event)"
  >
    <component :is="icon" v-if="icon" :class="[$style.icon, iconClass]" />
    <span v-if="text" :class="$style.text">{{ text }}</span>
  </button>
</template>

<script lang="ts" setup>
import { Color, useThemeStyles } from '@composables';
import { Placement } from '@popperjs/core';
import { ClassNames } from '@utils';
import { computed, useCssModule } from 'vue';
import type { Component } from 'vue';

const emit = defineEmits<{
  (e: 'click', v: MouseEvent): void;
}>();

const props = withDefaults(
  defineProps<{
    class?: ClassNames;
    iconClass?: ClassNames;
    icon?: Component;
    text?: string;
    tooltip?: string;
    type?: 'button' | 'reset' | 'submit';
    size?: 'xs' | 's' | 'm' | 'l';
    tooltipPosition?: Placement;
    color?: Color;
    textual?: boolean;
    rounded?: boolean;
    disabled?: boolean;
    testId?: string;
  }>(),
  {
    color: 'primary',
    type: 'button',
    size: 'm',
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
  styles[props.size],
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
@use '@styles/globals.scss';

.button {
  all: unset;
  justify-self: flex-start;
  display: flex;
  align-items: center;
  cursor: pointer;
  background: v-bind('theme.color.base');
  color: v-bind('theme.text.base');
  border-radius: var(--border-radius-full);
  transition: all var(--transition-s);
  padding: 10px;

  &.iconOnly {
    padding: 3px;
  }

  &.hasIcon .text {
    margin-left: 5px;
  }

  .icon {
    width: 16px;
    height: 16px;

    @include globals.onMobileDevices {
      width: 20px;
      height: 20px;
    }
  }

  .text {
    width: 100%;
    font-size: var(--font-size-s);
    font-weight: var(--font-weight-l);
    line-height: 1em;
  }

  &.xs {
    padding: 4px 6px;

    .text {
      font-size: var(--font-size-xs);
    }
  }

  &.s {
    padding: 6px 8px;

    .text {
      font-size: var(--font-size-xs);
    }
  }

  &.l {
    .icon {
      width: 20px;
      height: 20px;

      @include globals.onMobileDevices {
        width: 24px;
        height: 24px;
      }
    }

    .text {
      font-size: var(--font-size-m);
    }
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
