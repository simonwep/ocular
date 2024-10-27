<template>
  <div ref="reference" :class="$style.reference" @focusout="focused--" @focusin="focused++">
    <slot />
  </div>
  <div v-if="visible" ref="popper" :class="$style.popper" @focusout="focused--" @focusin="focused++">
    <ul :class="$style.list">
      <li v-for="action of actions" :key="action.id" :class="$style.item">
        <button :class="$style.btn" tabindex="0" type="button" @click="onAction(action.id)">
          {{ action.label }}
        </button>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { CellMenuAction, CellMenuActionId } from '@components/base/cell-menu/CellMenu.types';
import { createPopper, Instance } from '@popperjs/core';
import { ref, watch } from 'vue';

const emit = defineEmits<{
  (e: 'action', name: CellMenuActionId): void;
}>();

defineProps<{
  actions: CellMenuAction[];
}>();

const reference = ref<HTMLButtonElement>();
const popper = ref<HTMLDivElement>();
const visible = ref(false);
const focused = ref(0);
let instance: Instance | undefined;
let frame = -1;

watch([visible, reference, popper], () => {
  if (visible.value && reference.value && popper.value) {
    instance?.destroy();
    instance = createPopper(reference.value, popper.value, {
      strategy: 'absolute',
      placement: 'top-start',
      modifiers: [{ name: 'offset', options: { offset: [0, 5] } }]
    });
  }
});

watch(focused, (count) => {
  cancelAnimationFrame(frame);
  frame = requestAnimationFrame(() => (visible.value = count > 0));
});

const onAction = (id: CellMenuActionId) => {
  emit('action', id);
  cancelAnimationFrame(frame);
  visible.value = false;
};
</script>

<style lang="scss" module>
.reference {
  display: inline-flex;
}

.popper {
  display: flex;
  position: absolute;
  pointer-events: all;
  z-index: 1;
}

.list {
  list-style: none outside none;
  display: flex;
  align-items: flex-end;
  border-radius: var(--border-radius-m);
  box-shadow: var(--cell-menu-shadow);
  backdrop-filter: var(--cell-menu-backdrop);
  -webkit-backdrop-filter: var(--cell-menu-backdrop);
  overflow: hidden;

  .item {
    display: flex;
    flex-shrink: 0;

    .btn {
      all: unset;
      width: 100%;
      cursor: pointer;
      text-align: left;
      font-size: var(--font-size-xxs);
      font-weight: var(--font-weight-l);
      color: var(--c-primary-text);
      padding: 4px 6px;
      transition: all var(--transition-m);

      &:hover {
        background: var(--c-primary-hover);
      }
    }

    &:not(:first-child) {
      border-left: 1px solid var(--app-background);
    }
  }
}
</style>
