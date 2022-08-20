<template>
  <div :class="$style.contextMenu">
    <button ref="reference" :class="$style.reference" @click="toggle">
      <slot />
    </button>
    <div ref="popper" :class="$style.popper">
      <ul :class="[$style.list, { [$style.visible]: visible }]">
        <li :class="$style.item" v-for="option of options" :key="option.id">
          <button :class="$style.btn" @click="select(option)">
            {{ option.label ?? option.id }}
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { createPopper, Instance } from '@popperjs/core';
import { ContextMenuOption } from '.';
import { useOutOfElementClick } from '@composables';

const emit = defineEmits<{
  (e: 'select', option: ContextMenuOption): void;
}>();

defineProps<{
  options: ContextMenuOption[];
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
  z-index: 1;
}

.list {
  list-style: none outside none;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  backdrop-filter: var(--context-menu-backdrop);
  box-shadow: var(--context-menu-shadow);
  border-radius: var(--border-radius-m);
  padding: 5px 2px;
  max-height: 130px;
  overflow: auto;
  visibility: hidden;
  opacity: 0;
  transform: translateX(-10px);
  transition: all var(--transition-m);

  &.visible {
    visibility: visible;
    opacity: 1;
    transform: none;
  }

  .item .btn {
    all: unset;
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: var(--font-size-xs);
    border-radius: 10px;
    padding: 6px 8px;
    color: var(--context-menu-item-color);
    position: relative;

    &:hover {
      color: var(--context-menu-item-color-hover);
    }
  }
}
</style>
