<template>
  <div :class="[$style.contextMenu, classes]">
    <div ref="reference" :class="$style.reference" @click="toggle">
      <slot />
    </div>
    <div ref="popper" :class="[$style.popper, { [$style.visible]: visible }]">
      <ul :class="$style.list">
        <slot name="options" v-if="$slots.options"></slot>
        <template v-else-if="options">
          <ContextMenuButton
            v-for="option of options"
            :pad-icon="hasOptionWithIcon"
            :key="option.id"
            :text="option.label ?? option.id"
            :icon="option.icon"
            :highlight="option.id === highlight"
            @click="select(option)"
          />
        </template>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { createPopper, Instance } from '@popperjs/core';
import { ContextMenuOption, ContextMenuOptionId } from '.';
import { useOutOfElementClick } from '@composables';
import ContextMenuButton from './ContextMenuButton.vue';
import { ClassNames } from '@utils';

const emit = defineEmits<{
  (e: 'select', option: ContextMenuOption): void;
}>();

const props = defineProps<{
  class?: ClassNames;
  options?: ContextMenuOption[];
  highlight?: ContextMenuOptionId;
}>();

const reference = ref<HTMLButtonElement>();
const popper = ref<HTMLDivElement>();
const visible = ref(false);
let instance: Instance | undefined;

useOutOfElementClick(popper, () => (visible.value = false));

watch([reference, popper], () => {
  instance?.destroy();

  if (reference.value && popper.value) {
    instance = createPopper(reference.value, popper.value, {
      placement: 'right-end',
      modifiers: [{ name: 'offset', options: { offset: [10, 10] } }]
    });
  }
});

const classes = computed(() => props.class);

const hasOptionWithIcon = computed(() => {
  return props.options?.some((v) => v.icon);
});

const select = (option: ContextMenuOption): void => {
  emit('select', option);
  visible.value = false;
};

const toggle = () => {
  requestAnimationFrame(() => (visible.value = !visible.value));
};
</script>

<style lang="scss" module>
.contextMenu {
  display: flex;
}

.reference {
  all: unset;
  display: flex;
}

.popper {
  display: flex;
  position: absolute;
  transition: all var(--transition-m) var(--transition-m);
  z-index: -1;

  &.visible {
    z-index: 1;
    transition: all var(--transition-m);

    .list {
      visibility: visible;
      opacity: 1;
      transform: none;
    }
  }
}

.list {
  list-style: none outside none;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  backdrop-filter: var(--context-menu-backdrop);
  box-shadow: var(--context-menu-shadow);
  border-radius: var(--border-radius-m);
  padding: 6px 0;
  max-height: 130px;
  overflow: auto;
  visibility: hidden;
  opacity: 0;
  transform: translateX(-10px);
  transition: all var(--transition-m);
}
</style>
