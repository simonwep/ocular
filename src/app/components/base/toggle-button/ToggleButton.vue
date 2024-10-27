<template>
  <div :class="[$style.toggleButton, classes]">
    <button
      v-for="btn of buttons"
      :key="btn.id"
      type="button"
      :class="[$style.btn, { [$style.active]: btn.id === modelValue }]"
      @click="modelValue = btn.id"
    >
      <component :is="btn.icon" :class="$style.icon" />
    </button>
  </div>
</template>

<script lang="ts" setup>
import { Selectable, SelectableId } from '@components/base/toggle-button/ToggleButton.types';
import { ClassNames } from '@utils';
import { computed } from 'vue';

const modelValue = defineModel<SelectableId>();

const props = defineProps<{
  class?: ClassNames;
  buttons: Selectable[];
}>();

const classes = computed(() => props.class);
</script>

<style lang="scss" module>
.toggleButton {
  display: flex;
}

.btn {
  all: unset;
  padding: 10px 10px;
  transition: var(--transition-m);

  &:last-child {
    border-top-right-radius: var(--border-radius-m);
    border-bottom-right-radius: var(--border-radius-m);
  }

  &:first-child {
    border-top-left-radius: var(--border-radius-m);
    border-bottom-left-radius: var(--border-radius-m);
  }

  &:not(.active) {
    cursor: pointer;

    &:hover {
      background: var(--c-primary-hover);
    }
  }

  &.active {
    background: var(--c-primary);
  }

  .icon {
    width: 16px;
    height: 16px;
  }
}
</style>
