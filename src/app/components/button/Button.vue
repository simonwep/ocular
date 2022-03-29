<template>
  <button :class="classes" @click="emit('click', $event)">
    <Icon v-if="icon" :class="$style.icon" :icon="icon"/>
    <span v-if="text" :class="$style.text">{{ text }}</span>
  </button>
</template>

<script lang="ts" setup>
import {AppIcon} from '@components/icon/Icon.types';
import Icon from '@components/icon/Icon.vue';
import {computed, useCssModule} from 'vue';
import {Color, useThemeStyles} from '../../../composables/useThemeStyles';

const emit = defineEmits<{
  (e: 'click', v: MouseEvent): void;
}>();

const props = withDefaults(defineProps<{
  class?: any;
  icon?: AppIcon;
  text?: string;
  color?: Color;
  textual?: boolean;
}>(), {
  color: 'primary',
  textual: false
});

const styles = useCssModule();
const theme = useThemeStyles(() => props.color);
const classes = computed(() => [
  props.class,
  styles.button,
  {
    [styles.icon]: props.icon,
    [styles.textual]: props.textual
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
  color: v-bind('theme.inverted.base');
  border-radius: var(--border-radius-m);
  padding: 4px 10px !important;
  transition: all var(--transition-s);

  &.icon {
    .icon {
      width: 20px;
      height: 20px;
    }

    .text {
      margin-left: 5px;
    }
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
    color: v-bind('theme.inverted.hover');
  }

  &.textual {
    background: v-bind('theme.inverted.base');
    color: v-bind('theme.color.base');

    &:focus {
      box-shadow: none;
    }

    &:hover {
      background: v-bind('theme.inverted.hover');
      color: v-bind('theme.color.hover');
    }
  }
}

</style>
