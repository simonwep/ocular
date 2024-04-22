<template>
  <li :class="$style.item">
    <button :class="classes" @click="onClick">
      <component :is="icon" v-if="icon" :class="$style.icon"></component>
      <span>{{ text }}</span>
    </button>
  </li>
</template>

<script lang="ts" setup>
import { computed, inject, useCssModule } from 'vue';
import { ContextMenuStore, ContextMenuStoreKey } from '@components/base/context-menu/ContextMenu.types';
import { ClassNames } from '@utils';
import type { Component } from 'vue';

const emit = defineEmits<{
  (e: 'click', evt: MouseEvent): void;
}>();

const props = withDefaults(
  defineProps<{
    class?: ClassNames;
    text: string | number;
    icon?: Component;
    muted?: boolean;
    padIcon?: boolean;
    highlight?: boolean;
  }>(),
  {
    highlight: false,
    padIcon: false,
    muted: false
  }
);

const styles = useCssModule();
const store = inject<ContextMenuStore>(ContextMenuStoreKey);

const classes = computed(() => [
  props.class,
  styles.btn,
  {
    [styles.muted]: props.muted,
    [styles.highlight]: props.highlight,
    [styles.padIcon]: props.padIcon && !props.icon
  }
]);

const onClick = (evt: MouseEvent) => {
  store?.close();
  emit('click', evt);
};
</script>

<style lang="scss" module>
@use 'src/styles/globals';

.item {
  display: flex;
  width: 100%;
}

.btn {
  all: unset;
  width: 100%;
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: var(--font-size-xs);
  padding: 6px 12px;
  transition:
    color var(--transition-s),
    background var(--transition-s);
  color: var(--context-menu-item-color);
  position: relative;

  @include globals.onMobileDevices {
    font-size: var(--font-size-s);
    padding: 10px 16px;
  }

  .icon {
    width: 12px;
    height: 12px;
    margin-right: 8px;
  }

  &.padIcon {
    padding-left: calc(12px + 20px);
  }

  &.muted {
    color: var(--context-menu-item-color-muted);
  }

  &:hover,
  &.highlight {
    color: var(--context-menu-item-color-hover);
  }

  &:hover {
    background: var(--context-menu-item-background-hover);
  }
}
</style>
